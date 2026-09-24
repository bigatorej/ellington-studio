import type { IncomingMessage, ServerResponse } from "node:http";
import { NOTION_DATABASE_ID } from "../lib/notionIds.js";

type Body = {
  summary?: unknown;
  name?: unknown;
  email?: unknown;
  package?: unknown;
  quote?: unknown;
  company?: unknown; // honeypot, never shown to a person
};

const PACKAGES = ["Site in a Week", "App in a Month", "Care Plan only", "Not sure"] as const;
const LIMIT = 5;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function ipOf(req: IncomingMessage): string {
  const fwd = req.headers["x-forwarded-for"];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd || "";
  return raw.split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
}

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 200_000) reject(new Error("too large"));
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function send(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function packageName(raw: string): (typeof PACKAGES)[number] {
  if (raw.startsWith("Site")) return "Site in a Week";
  if (raw.startsWith("App")) return "App in a Month";
  if (raw.startsWith("Care")) return "Care Plan only";
  return "Not sure";
}

function chunks(text: string, size = 1900): { text: { content: string } }[] {
  const out: { text: { content: string } }[] = [];
  for (let i = 0; i < text.length && out.length < 90; i += size) {
    out.push({ text: { content: text.slice(i, i + size) } });
  }
  return out.length ? out : [{ text: { content: "" } }];
}

async function createNotionRow(key: string, v: { name: string; email: string; pkg: string; quote: string; summary: string }) {
  const r = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: v.name.slice(0, 200) } }] },
        Email: { email: v.email },
        Package: { select: { name: packageName(v.pkg) } },
        Quote: { rich_text: [{ text: { content: v.quote.slice(0, 200) } }] },
        Status: { select: { name: "New" } },
        Received: { date: { start: new Date().toISOString() } },
        Summary: { rich_text: chunks(v.summary) },
      },
    }),
  });
  if (!r.ok) throw new Error(`notion ${r.status}`);
}

async function sendMail(key: string, from: string, to: string, subject: string, text: string, replyTo?: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}`);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "POST only" });

  const notionKey = process.env.NOTION_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const notify = process.env.STUDIO_NOTIFY_EMAIL;
  if (!notionKey) return send(res, 503, { ok: false, error: "Intake is not configured yet. Use the email fallback." });

  if (limited(ipOf(req))) return send(res, 429, { ok: false, error: "Too many requests. Try again in a minute." });

  let body: Body;
  try {
    body = JSON.parse((await readBody(req)) || "{}");
  } catch {
    return send(res, 400, { ok: false, error: "Bad JSON" });
  }

  // Honeypot: a real person never fills this field.
  if (typeof body.company === "string" && body.company.trim()) return send(res, 200, { ok: true });

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const summary = typeof body.summary === "string" ? body.summary : "";
  const pkg = typeof body.package === "string" ? body.package : "";
  const quote = typeof body.quote === "string" ? body.quote : "";
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !summary) {
    return send(res, 400, { ok: false, error: "Name, email and summary are required." });
  }

  try {
    await createNotionRow(notionKey, { name, email, pkg, quote, summary });
  } catch (e) {
    console.error("intake: notion write failed", (e as Error).message);
    return send(res, 502, { ok: false, error: "Could not record the intake. Use the email fallback." });
  }

  // Notion succeeded, so the intake counts as received. Email is best effort from here.
  const from = process.env.STUDIO_FROM_EMAIL || "Ellington Studio <studio@thequadco.ai>";
  if (resendKey && notify) {
    try {
      await sendMail(resendKey, from, notify, `Studio intake: ${name}`, summary, email);
    } catch (e) {
      console.error("intake: notify email failed", (e as Error).message);
    }
    try {
      await sendMail(
        resendKey,
        from,
        email,
        "Received. Ellington Studio has your project",
        `Received. The scope and price come within 1 business day.\n\n${summary}`,
        notify,
      );
    } catch (e) {
      console.error("intake: confirmation email failed", (e as Error).message);
    }
  }

  return send(res, 200, { ok: true });
}
