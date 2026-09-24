// Brand options verification: every option page at 390 and 1440, links, intake behavior,
// printed contrast ratios meet their thresholds, chooser screenshots load and rulings copy.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const REPO = new URL("..", import.meta.url).pathname;
const OPTS = ["a-blueprint", "b-greenhouse", "c-signal", "d-maison", "e-coastline"];
const fails = [];
const ok = (c, m) => { console.log(`${c ? "PASS" : "FAIL"}  ${m}`); if (!c) fails.push(m); };

// 1. Page checks through the shared verifier.
const pages = OPTS.flatMap((o) => [`brand-options/${o}/index.html`, `brand-options/${o}/intake.html`, `brand-options/${o}/kit.html`]).concat(["brand-options/index.html"]);
const r = spawnSync("node", [join(REPO, "scripts/verify-pages.mjs"), REPO], { env: { ...process.env, PAGES: pages.join(","), INTAKES: OPTS.map((o) => `brand-options/${o}/intake.html`).join(",") }, encoding: "utf8" });
process.stdout.write(r.stdout);
ok(r.status === 0, "verify-pages on all brand option pages");

// 2. Contrast ratios printed on each kit meet the threshold beside them.
for (const o of OPTS) {
  const html = readFileSync(join(REPO, "brand-options", o, "kit.html"), "utf8");
  const found = [...html.matchAll(/(\d+\.\d\d) to 1, AA (body|large) needs (4\.5|3)/g)];
  ok(found.length >= 12, `${o} kit prints ${found.length} contrast ratios`);
  for (const [, ratio, size, need] of found) ok(Number(ratio) >= Number(need), `${o} ${size} pairing ${ratio} meets ${need}`);
}

// 3. Chooser: screenshots load, buttons copy the ruling.
const MIME = { ".html": "text/html", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".pdf": "application/pdf" };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p.endsWith("/")) p += "index.html";
  try { const f = join(REPO, p); await stat(f); res.writeHead(200, { "Content-Type": MIME[extname(f)] || "application/octet-stream" }); res.end(await readFile(f)); } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
const pg = await ctx.newPage();
await pg.goto(`${base}/brand-options/index.html`, { waitUntil: "networkidle" });
const imgs = await pg.$$eval("img.shot, .shot img", (els) => els.map((e) => ({ src: e.getAttribute("src"), w: e.naturalWidth })));
ok(imgs.length === 5 && imgs.every((i) => i.w > 0), `chooser shows 5 home screenshots (${imgs.map((i) => i.w).join(", ")})`);
for (const [i, L] of ["A", "B", "C", "D", "E"].entries()) {
  await pg.click(`.choose >> nth=${i}`);
  await pg.waitForTimeout(150);
  const clip = await pg.evaluate(() => navigator.clipboard.readText());
  const shown = await pg.textContent("#ruled");
  const name = { A: "Blueprint", B: "Greenhouse", C: "Signal", D: "Maison", E: "Coastline" }[L];
  ok(clip === `Ruling: Ellington Studio adopts Option ${L}, ${name}`, `Choose ${L} copies the ruling (${clip})`);
  ok(shown.startsWith("Copied:"), `Choose ${L} confirms on screen`);
}
const origCells = await pg.$$eval("tr.orig td", (tds) => tds.map((t) => t.textContent.trim()));
ok(origCells.length === 5 && origCells[3].startsWith("Not borrowed") && origCells[4].startsWith("Not borrowed"), "originality row present with D and E entries");
for (const o of OPTS) {
  const L = o[0].toUpperCase();
  const s = (await fetch(`${base}/brand-options/${o}/Ellington%20Studio%20Brand%20Kit%20Option%20${L}%202026.09.24.pdf`)).status;
  ok(s === 200, `${o} kit PDF is present`);
  for (const a of ["icon-16.png", "icon-32.png", "icon-1024.png", "home-390.png", "home-1440.png", "intake-390.png", "intake-1440.png", "kit-1440.png"]) {
    ok((await fetch(`${base}/brand-options/${o}/assets/${a}`)).status === 200, `${o} asset ${a} is present`);
  }
}
await browser.close(); server.close();
console.log(fails.length ? `\n${fails.length} check(s) failed` : "\nAll brand option checks passed");
process.exit(fails.length ? 1 : 0);
