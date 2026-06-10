import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const SITE_TITLE = "Ninon Hermellon — Portfolio";

const items = [
  { id: "histoire", title: "Mon histoire", link: "/histoire", desc: "Parcours professionnel et personnel.", date: "2024-01-15T10:00:00Z" },
  { id: "projets", title: "Mes projets", link: "/projets", desc: "Réalisations en cybersécurité.", date: "2024-06-01T10:00:00Z" },
  { id: "ecole", title: "ESTAM & C-TECH", link: "/ecole", desc: "Engagements pédagogiques.", date: "2024-03-01T10:00:00Z" },
  { id: "ville", title: "Ma ville", link: "/ville", desc: "Environnement professionnel.", date: "2024-02-10T10:00:00Z" },
];

const esc = (s: string) =>
  s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c]!));

export const Route = createFileRoute("/atom.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const updated = new Date().toISOString();
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="fr-FR">
  <title>${esc(SITE_TITLE)}</title>
  <link href="${origin}/" />
  <link rel="self" href="${origin}/atom.xml" />
  <id>${origin}/</id>
  <updated>${updated}</updated>
  <author><name>Ninon Hermellon</name></author>
${items
  .map(
    (i) => `  <entry>
    <title>${esc(i.title)}</title>
    <link href="${origin}${i.link}" />
    <id>${origin}${i.link}</id>
    <updated>${new Date(i.date).toISOString()}</updated>
    <summary>${esc(i.desc)}</summary>
  </entry>`,
  )
  .join("\n")}
</feed>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/atom+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
