import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const SITE_TITLE = "Ninon Hermellon — Portfolio";
const SITE_DESC =
  "Actualités, projets et publications de Ninon Hermellon — Ingénieur cybersécurité & Formateur IT.";

const items = [
  {
    id: "histoire",
    title: "Mon histoire",
    link: "/histoire",
    desc: "Parcours professionnel et personnel de Ninon Hermellon.",
    date: "2024-01-15T10:00:00Z",
  },
  {
    id: "projets",
    title: "Mes projets",
    link: "/projets",
    desc: "Réalisations en cybersécurité, conseil et formation.",
    date: "2024-06-01T10:00:00Z",
  },
  {
    id: "ecole",
    title: "ESTAM & C-TECH",
    link: "/ecole",
    desc: "Mes engagements pédagogiques pour l'excellence informatique au Congo.",
    date: "2024-03-01T10:00:00Z",
  },
  {
    id: "ville",
    title: "Ma ville",
    link: "/ville",
    desc: "L'environnement professionnel et culturel qui m'inspire.",
    date: "2024-02-10T10:00:00Z",
  },
];

const esc = (s: string) =>
  s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c]!));

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_TITLE)}</title>
    <link>${origin}/</link>
    <description>${esc(SITE_DESC)}</description>
    <language>fr-FR</language>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${origin}${i.link}</link>
      <guid isPermaLink="true">${origin}${i.link}</guid>
      <description>${esc(i.desc)}</description>
      <pubDate>${new Date(i.date).toUTCString()}</pubDate>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
