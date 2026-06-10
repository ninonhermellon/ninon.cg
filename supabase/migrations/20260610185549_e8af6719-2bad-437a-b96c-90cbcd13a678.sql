CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE, -- Crée automatiquement un index unique sur l'email
  source TEXT,
  user_agent TEXT,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  unsubscribed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sécurité stricte : Seul le service_role a accès à la table
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.newsletter_subscribers FROM authenticated, anon; -- Par sécurité
GRANT ALL ON public.newsletter_subscribers TO service_role;

-- Politique RLS pour le service_role (Optionnel mais recommandé si la RLS est stricte)
CREATE POLICY "service role manages subscribers"
  ON public.newsletter_subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optimisation : Index partiel pour cibler rapidement les abonnés actifs
CREATE INDEX idx_newsletter_subscribers_active 
ON public.newsletter_subscribers(email) 
WHERE unsubscribed = false AND confirmed = true;