import { createFileRoute } from "@tanstack/react-router";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const Route = createFileRoute("/api/public/newsletter/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: { email?: string; source?: string };
        try {
          payload = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const email = (payload.email ?? "").trim().toLowerCase();
        const source = (payload.source ?? "").slice(0, 120);

        if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
          return json({ error: "Adresse email invalide." }, 400);
        }

        const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 255);

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const { error } = await supabaseAdmin
          .from("newsletter_subscribers" as never)
          .upsert(
            {
              email,
              source: source || null,
              user_agent: userAgent || null,
              unsubscribed: false,
            } as never,
            { onConflict: "email" },
          );

        if (error) {
          console.error("[newsletter] insert failed", error);
          return json({ error: "Une erreur est survenue, réessayez." }, 500);
        }

        return json({ ok: true, message: "Merci pour votre abonnement !" });
      },
    },
  },
});
