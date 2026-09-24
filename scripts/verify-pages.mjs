// Local verification: no horizontal scroll at 390 and 1440, every link resolves,
// the intake refuses to send without a name and a valid email, and it opens the
// mailto fallback when the API is down. Usage: node scripts/verify-pages.mjs [dir]
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, resolve } from "node:path";

const ROOT = resolve(process.argv[2] || new URL("..", import.meta.url).pathname);
const PAGES = (process.env.PAGES || "index.html,intake.html,404.html").split(",");
const INTAKES = (process.env.INTAKES || "intake.html").split(",");
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".png": "image/png", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".woff2": "font/woff2" };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = join(ROOT, p);
  try {
    const s = await stat(file);
    const f = s.isDirectory() ? join(file, "index.html") : file;
    res.writeHead(200, { "Content-Type": MIME[extname(f)] || "application/octet-stream" });
    res.end(await readFile(f));
  } catch {
    res.writeHead(404); res.end("not found");
  }
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

const fails = [];
const ok = (cond, msg) => { console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`); if (!cond) fails.push(msg); };
const browser = await chromium.launch();

for (const page of PAGES) {
  for (const width of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const pg = await ctx.newPage();
    const errors = [];
    pg.on("pageerror", (e) => errors.push(e.message));
    const resp = await pg.goto(`${base}/${page}`, { waitUntil: "networkidle" });
    ok(resp.ok(), `${page} loads (${width})`);
    const [sw, cw] = await pg.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    ok(sw <= cw, `${page} no horizontal scroll at ${width} (scrollWidth ${sw}, clientWidth ${cw})`);
    ok(errors.length === 0, `${page} no page errors at ${width}${errors.length ? ": " + errors.join("; ") : ""}`);
    if (width === 1440) {
      const links = await pg.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")));
      for (const href of new Set(links)) {
        if (href.startsWith("mailto:") || href === "#") continue;
        if (href.startsWith("#")) {
          ok(await pg.evaluate((id) => !!document.getElementById(id), href.slice(1)), `${page} anchor ${href} exists`);
        } else if (/^https?:/.test(href)) {
          let status = 0;
          try { status = (await fetch(href, { method: "GET", redirect: "follow", headers: { "User-Agent": "Mozilla/5.0" } })).status; } catch {}
          ok(status > 0 && status < 400, `${page} external ${href} responds (${status})`);
        } else {
          const target = new URL(href, `${base}/${page}`).toString();
          let status = 0;
          try { status = (await fetch(target)).status; } catch {}
          ok(status === 200, `${page} link ${href} resolves (${status})`);
        }
      }
    }
    await ctx.close();
  }
}

for (const intake of INTAKES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  await ctx.route("**/api/intake", (route) => route.abort());
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Page.enable");
  const navRequests = [];
  cdp.on("Page.frameRequestedNavigation", (e) => navRequests.push(e.url));
  await pg.goto(`${base}/${intake}`, { waitUntil: "networkidle" });
  await pg.click("button:has-text('Send my project')");
  ok(await pg.isVisible("#e-name"), `${intake} refuses to send without a name`);
  ok(!(await pg.isVisible("#out")), `${intake} output stays hidden without a name`);
  await pg.fill("#name", "Test Person");
  await pg.fill("#email", "not an email");
  await pg.click("button:has-text('Send my project')");
  ok(await pg.isVisible("#e-email"), `${intake} refuses to send with a bad email`);
  ok(!(await pg.isVisible("#out")), `${intake} output stays hidden with a bad email`);
  await pg.fill("#email", "test@example.com");
  await pg.check("input[name=pkg][value^='Site']");
  await pg.click("button:has-text('Send my project')");
  await pg.waitForTimeout(800);
  ok(await pg.isVisible("#out"), `${intake} shows the summary after a valid send`);
  const summary = await pg.inputValue("#summary");
  ok(summary.includes("Name: Test Person") && summary.includes("$2,500"), `${intake} summary carries the name and the quote`);
  const mailto = navRequests.find((u) => u.startsWith("mailto:"));
  ok(!!mailto, `${intake} opens the mailto fallback when the API is down`);
  if (mailto) {
    const body = decodeURIComponent(new URL(mailto).searchParams.get("body") || "");
    ok(body.includes("Name: Test Person") && body.includes("Studio read"), `${intake} mailto body carries the full summary`);
    ok(mailto.startsWith("mailto:bigatorej@gmail.com"), `${intake} mailto goes to the Studio address`);
  }
  await ctx.close();
}

await browser.close();
server.close();
console.log(fails.length ? `\n${fails.length} check(s) failed` : "\nAll checks passed");
process.exit(fails.length ? 1 : 0);
