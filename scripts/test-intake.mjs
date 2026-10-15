// Exercises api/intake.ts with the network stubbed: the Notion write happens, the
// email step is skipped when RESEND_API_KEY is empty and runs with the right subject
// when it is set. Run: node scripts/test-intake.mjs
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { EventEmitter } from "node:events";

const REPO = new URL("../", import.meta.url).pathname;
const out = mkdtempSync(join(tmpdir(), "intake-"));
execSync(`npx tsc -p "${REPO}tsconfig.json" --noEmit false --outDir "${out}"`, { stdio: "inherit" });
// The source imports ../lib/notionIds.js, which tsc emits as JS, so the compiled tree resolves on its own.
const { default: handler } = await import(join(out, "api/intake.js"));

const calls = [];
globalThis.fetch = async (url, init) => {
  calls.push({ url, body: JSON.parse(init.body) });
  return { ok: true, status: 200 };
};

function run(body, env) {
  for (const k of ["NOTION_API_KEY", "RESEND_API_KEY", "STUDIO_NOTIFY_EMAIL"]) delete process.env[k];
  Object.assign(process.env, env);
  calls.length = 0;
  const req = new EventEmitter();
  req.method = "POST";
  req.headers = { "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}` };
  req.socket = { remoteAddress: "127.0.0.1" };
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(s) { this.body = JSON.parse(s); this.done(); } };
  const p = new Promise((r) => (res.done = r));
  const task = handler(req, res);
  const json = JSON.stringify(body);
  setImmediate(() => { req.emit("data", json); req.emit("end"); });
  return Promise.all([p, task]).then(() => ({ status: res.statusCode, body: res.body, calls: [...calls] }));
}

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "PASS" : "FAIL"}  ${m}`); if (!c) fails++; };
const intake = { name: "Maya Rodriguez", email: "maya@example.com", package: "Site in a Week, $2,500", quote: "$2,500", summary: "Kind of business: clinic", company: "" };

let r = await run(intake, { NOTION_API_KEY: "test" });
ok(r.status === 200 && r.body.ok, "Notion key set, empty Resend key: form returns 200");
ok(r.calls.length === 1 && r.calls[0].url.includes("api.notion.com"), "exactly one network call and it is the Notion write");
ok(r.calls[0].body.properties.Package.select.name === "Site in a Week", "Notion row carries the package");

r = await run(intake, { NOTION_API_KEY: "test", RESEND_API_KEY: "   " });
ok(r.calls.length === 1, "a blank Resend key is treated as empty");

r = await run(intake, { NOTION_API_KEY: "test", RESEND_API_KEY: "re_test" });
const mails = r.calls.filter((c) => c.url.includes("api.resend.com"));
ok(r.status === 200 && mails.length === 2, "Resend key set: Notion write plus the notification and the client confirmation");
const notify = mails[0]?.body;
ok(notify?.to?.[0] === "hello@ellingtonenterprises.co", "notification goes to hello@ellingtonenterprises.co");
ok(notify?.subject === "Studio intake: Maya Rodriguez, Site in a Week", `subject is "${notify?.subject}"`);
ok(/Name: Maya Rodriguez\nEmail: maya@example.com\nPackage: Site in a Week\n\nKind of business: clinic/.test(notify?.text || ""), "body carries the name, package and summary");
ok(notify?.reply_to === "maya@example.com", "reply goes to the client");

r = await run({ ...intake, package: "" }, { NOTION_API_KEY: "test", RESEND_API_KEY: "re_test" });
ok(r.calls.filter((c) => c.url.includes("resend"))[0]?.body.subject === "Studio intake: Maya Rodriguez, Not sure", "no package chosen reads Not sure");

r = await run(intake, { NOTION_API_KEY: "test", RESEND_API_KEY: "re_test", STUDIO_NOTIFY_EMAIL: "someone@example.com" });
ok(r.calls.filter((c) => c.url.includes("resend"))[0]?.body.to[0] === "someone@example.com", "STUDIO_NOTIFY_EMAIL still overrides the destination");

globalThis.fetch = async (url, init) => { calls.push({ url, body: JSON.parse(init.body) }); return { ok: !url.includes("resend"), status: url.includes("resend") ? 500 : 200 }; };
r = await run(intake, { NOTION_API_KEY: "test", RESEND_API_KEY: "re_test" });
ok(r.status === 200 && r.body.ok, "a Resend failure never fails the form");

r = await run(intake, {});
ok(r.status === 503, "no Notion key: 503 so the page falls back to mailto");

console.log(fails ? `\n${fails} check(s) failed` : "\nAll intake checks passed");
process.exit(fails ? 1 : 0);
