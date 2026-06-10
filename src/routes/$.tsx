import { createFileRoute } from "@tanstack/react-router";
import html from "../static-pages/index.html?raw";

// Known clean routes (without leading slash)
const KNOWN_ROUTES = new Set([
  "",
  "contact",
  "projets",
  "ecole",
  "histoire",
  "ville",
  "conditions",
  "confidentialite",
  "clientok",
  "sitemap.xml",
  "robots.txt",
]);

// Render a French 404 page matching the site's visual style.
function render404Html(path: string): string {
  // Reuse the index template head (CSS/fonts) by extracting it
  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  const head = headMatch ? headMatch[0] : "<head><meta charset=\"utf-8\"></head>";
  return `<!DOCTYPE html>
<html lang="fr">
${head}
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6">
  <main class="max-w-xl text-center">
    <p class="text-sm uppercase tracking-[0.3em] text-cyan-400 mb-4">Erreur 404</p>
    <h1 class="text-5xl md:text-6xl font-bold mb-4">Page introuvable</h1>
    <p class="text-slate-400 mb-8">
      La page <code class="text-cyan-300">${path.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c]!))}</code>
      n'existe pas ou a été déplacée.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/" class="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition">
        Retour à l'accueil
      </a>
      <a href="/contact" class="px-6 py-3 rounded-lg border border-slate-700 hover:border-cyan-400 transition">
        Me contacter
      </a>
    </div>
  </main>
</body>
</html>`;
}

export const Route = createFileRoute("/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const splat = params._splat ?? "";
        const url = new URL(request.url);

        // 1) Redirect legacy .html URLs to clean equivalents
        if (splat.endsWith(".html")) {
          const base = splat.slice(0, -".html".length);
          const target = base === "index" ? "/" : `/${base}`;
          return new Response(null, {
            status: 301,
            headers: { Location: target + url.search },
          });
        }

        // 2) Trailing slash → strip
        if (splat.endsWith("/") && splat.length > 1) {
          return new Response(null, {
            status: 301,
            headers: { Location: "/" + splat.replace(/\/+$/, "") + url.search },
          });
        }

        // 3) Known route hit via splat (shouldn't normally happen)
        if (KNOWN_ROUTES.has(splat)) {
          return new Response(null, {
            status: 301,
            headers: { Location: "/" + splat },
          });
        }

        // 4) Custom 404
        return new Response(render404Html("/" + splat), {
          status: 404,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
