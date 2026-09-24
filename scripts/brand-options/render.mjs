// Renders per option: icon-16/32/1024 PNGs from the monogram SVG, full page screens at 390 and 1440,
// and the kit PDF. Run after build.mjs: node scripts/brand-options/render.mjs
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, stat, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { OPTIONS } from "./options.mjs";

const REPO = new URL("../../", import.meta.url).pathname;
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".pdf": "application/pdf" };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  try {
    const f = join(REPO, p);
    const s = await stat(f);
    res.writeHead(200, { "Content-Type": MIME[extname(f)] || "application/octet-stream" });
    res.end(await readFile(s.isDirectory() ? join(f, "index.html") : f));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();

const only = process.argv[2];
for (const key of Object.keys(OPTIONS)) {
  const opt = OPTIONS[key];
  if (only && only !== key) continue;
  const dir = join(REPO, "brand-options", opt.slug);
  const assets = join(dir, "assets");
  const t = opt.tokens;
  const second = opt.icon.second;
  const bg = opt.icon.bg;
  const fg = opt.icon.fg;

  // Icons: monogram on the option's dark ground (C is a solid block already).
  for (const size of [16, 32, 1024]) {
    const ctx = await browser.newContext({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    const pg = await ctx.newPage();
    const pad = opt.icon.block ? 0 : Math.round(size * 0.12);
    const inner = size - pad * 2;
    const svg = opt.icon.block ? opt.monogram(fg, second) : opt.monogram(fg, second);
    await pg.setContent(`<html><body style="margin:0;background:${bg};width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center"><div style="width:${inner}px;height:${inner}px;color:${fg}">${svg.replace("<svg ", '<svg style="width:100%;height:100%;display:block" ')}</div></body></html>`);
    await pg.waitForTimeout(100);
    await pg.screenshot({ path: join(assets, `icon-${size}.png`), clip: { x: 0, y: 0, width: size, height: size }, omitBackground: false });
    await ctx.close();
  }

  // Full page screens.
  for (const [page, widths] of [["index", [390, 1440]], ["intake", [390, 1440]], ["kit", [1440]]]) {
    for (const w of widths) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
      const pg = await ctx.newPage();
      await pg.goto(`${base}/brand-options/${opt.slug}/${page}.html`, { waitUntil: "networkidle" });
      await pg.evaluate(() => document.fonts.ready);
      await pg.waitForTimeout(400);
      const name = page === "index" ? "home" : page;
      await pg.screenshot({ path: join(assets, `${name}-${w}.png`), fullPage: true });
      await ctx.close();
    }
  }

  // Kit PDF.
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 1600 } });
  const pg = await ctx.newPage();
  await pg.goto(`${base}/brand-options/${opt.slug}/kit.html`, { waitUntil: "networkidle" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.emulateMedia({ media: "screen" });
  await pg.pdf({ path: join(dir, `Ellington Studio Brand Kit Option ${opt.letter} 2026.09.24.pdf`), width: "1200px", height: "1600px", printBackground: true, margin: { top: "0", bottom: "0", left: "0", right: "0" } });
  await ctx.close();
  console.log(`rendered ${opt.slug}`);
}
await browser.close();
server.close();
