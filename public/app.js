/**
 * Configuration & Dictionnaire de traduction internationalisation (i18n)
 */
const i18nTokens = {
    fr: {
        "nav-home": "Accueil",
        "nav-about": "À Propos",
        "nav-portfolio": "Portfolio",
        "nav-contact": "Contact",
        "btn-contact": "Me Contacter",
        "hero-badge": "Ingénieur & Formateur IT",
        "footer-desc": "Ingénieur en cybersécurité, consultant et formateur d'avenir. Partenaire clé de l'ESTAM et du Groupe C-TECH pour l'excellence de l'enseignement informatique au Congo.",
    },
    en: {
        "nav-home": "Home",
        "nav-about": "About",
        "nav-portfolio": "Portfolio",
        "nav-contact": "Contact",
        "btn-contact": "Contact Me",
        "hero-badge": "IT Engineer & Trainer",
        "footer-desc": "Cybersecurity engineer, consultant, and future trainer. Key partner of ESTAM and C-TECH Group for IT educational excellence in Congo.",
    }
};

/**
 * Initialisation globale des composants interactifs
 */
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Gestion du commutateur de langues - Sécurisé avec textContent
    const initLanguageToggle = () => {
        const langToggleBtn = document.getElementById("lang-toggle");
        if (!langToggleBtn) return;

        langToggleBtn.addEventListener("click", (e) => {
            e.preventDefault();
            
            const currentLang = langToggleBtn.getAttribute("data-lang") || "fr";
            const nextLang = currentLang === "fr" ? "en" : "fr";
            
            langToggleBtn.setAttribute("data-lang", nextLang);
            langToggleBtn.textContent = nextLang === "fr" ? "EN" : "FR";
            
            // Mise à jour sécurisée des textes avec textContent
            document.querySelectorAll("[data-i18n]").forEach(element => {
                const token = element.getAttribute("data-i18n");
                if (i18nTokens[nextLang] && i18nTokens[nextLang][token]) {
                    const iconElement = element.querySelector("i");
                    element.textContent = i18nTokens[nextLang][token];
                    
                    // Ré-attachement sécurisé des icônes
                    if (iconElement && iconElement.parentNode) {
                        element.appendChild(iconElement);
                    }
                }
            });

            // Sauvegarder la préférence de langue
            localStorage.setItem('preferredLanguage', nextLang);
        });

        // Charger la langue préférée
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && savedLang !== 'fr') {
            langToggleBtn.click();
        }
    };

    // 2. Gestion du WhatsApp button avec validation
    const initWhatsAppButton = () => {
        const whatsappButton = document.querySelector('a[href*="wa.me"]');
        if (whatsappButton) {
            whatsappButton.addEventListener('click', (e) => {
                const href = whatsappButton.getAttribute('href');
                if (!href.startsWith('https://wa.me/')) {
                    e.preventDefault();
                    console.warn('Invalid WhatsApp link');
                }
            });
        }
    };

    // Newsletter — connecté à l'API /api/public/newsletter/subscribe
    const initNewsletterForm = () => {
        const form = document.getElementById('newsletter-form');
        if (!form) return;
        const emailInput = document.getElementById('newsletter-email');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalLabel = submitBtn ? submitBtn.textContent : '';

        let statusEl = form.parentNode.querySelector('.newsletter-status');
        if (!statusEl) {
            statusEl = document.createElement('p');
            statusEl.className = 'newsletter-status text-xs font-medium mt-2';
            statusEl.setAttribute('role', 'status');
            statusEl.setAttribute('aria-live', 'polite');
            form.insertAdjacentElement('afterend', statusEl);
        }

        const setStatus = (msg, ok) => {
            statusEl.textContent = msg;
            statusEl.style.color = ok ? '#34d399' : '#f87171';
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = (emailInput?.value || '').trim();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setStatus('Adresse email invalide.', false);
                return;
            }
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi…'; }
            setStatus('', true);
            try {
                const res = await fetch('/api/public/newsletter/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, source: location.pathname }),
                });
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                    setStatus(data.message || 'Merci pour votre abonnement !', true);
                    form.reset();
                } else {
                    setStatus(data.error || 'Une erreur est survenue.', false);
                }
            } catch (err) {
                console.error('newsletter error', err);
                setStatus('Connexion impossible. Réessayez.', false);
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
            }
        });
    };

    // Liens externes — sécurité
    const initExternalLinks = () => {
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            if (!link.getAttribute('rel')?.includes('noopener')) {
                link.setAttribute('rel', (link.getAttribute('rel') || '') + ' noopener noreferrer');
            }
        });
    };

    // Hauteur dynamique du viewport (mobile)
    const initViewportHeight = () => {
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
    };

    // Focus visible — accessibilité
    const initFocusVisible = () => {
        document.addEventListener('keydown', () => document.body.classList.add('using-keyboard'));
        document.addEventListener('mousedown', () => document.body.classList.remove('using-keyboard'));
    };

    // Initialisation
    initLanguageToggle();
    initWhatsAppButton();
    initNewsletterForm();
    initExternalLinks();
    initViewportHeight();
    initFocusVisible();

    // Support pour les animations au scroll (optional)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }
});