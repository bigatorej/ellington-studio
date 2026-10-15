import type { IncomingMessage, ServerResponse } from "node:http";

// Public, non secret settings the static pages read at load time.
// Each Stripe payment link comes from an environment variable set on the Vercel project.
// An empty variable returns an empty string and the page keeps that button hidden.
// Vercel applies environment variable changes on the next deployment, so after a link is
// set, redeploy once (vercel redeploy on the latest production deployment, or the
// Redeploy button in the dashboard).
function link(raw: string | undefined): string {
  const v = (raw || "").trim();
  return /^https:\/\/\S+$/.test(v) ? v : "";
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.statusCode = req.method === "GET" || req.method === "HEAD" ? 200 : 405;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  if (res.statusCode !== 200) return res.end(JSON.stringify({ ok: false, error: "GET only" }));
  res.end(
    JSON.stringify({
      ok: true,
      pay: {
        site: link(process.env.STRIPE_LINK_SITE_DEPOSIT),
        app: link(process.env.STRIPE_LINK_APP_DEPOSIT),
        care: link(process.env.STRIPE_LINK_CARE_PLAN),
      },
    }),
  );
}
