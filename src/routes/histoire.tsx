import { createFileRoute } from "@tanstack/react-router";
import html from "../static-pages/histoire.html?raw";

export const Route = createFileRoute("/histoire")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400" },
        }),
    },
  },
});
