// Renders og/studio.png, the 1200 by 630 Open Graph card for every Studio page.
// It shows the three packages and prices in the live site's own type and colours.
// Run: node scripts/og/render.mjs   (Playwright is a devDependency; prices come from index.html)
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

const REPO = new URL("../../", import.meta.url).pathname;
const home = readFileSync(REPO + "index.html", "utf8");
const card = (name) => {
  const m = home.match(new RegExp(`<h3>${name}</h3>\\s*<div class="price">([^<]*)(?:<small>([^<]*)</small>)?</div>\\s*<div class="when">([^<]*)</div>`));
  if (!m) throw new Error(`no card for ${name} in index.html`);
  return { name, price: m[1].trim(), unit: (m[2] || "").trim(), when: m[3].trim() };
};
const cards = [card("Site in a Week"), card("App in a Month"), card("Care Plan")];

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
:root{--ink:#14161a;--ink2:#3d434c;--mute:#6b7280;--line:#e2e4e8;--paper:#ffffff;--wash:#f6f5f1;--acc:#0b3d5c;--acc2:#b8860b}
*{box-sizing:border-box}html,body{margin:0}
body{width:1200px;height:630px;background:var(--paper);color:var(--ink);font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;padding:64px 72px;display:flex;flex-direction:column}
.wordmark{font-weight:700;letter-spacing:.04em;font-size:26px}.wordmark span{color:var(--acc2)}
h1{font-size:54px;line-height:1.05;letter-spacing:-.02em;margin:34px 0 0;max-width:1000px}
h1 em{font-style:normal;color:var(--acc)}
.pk{display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px;margin-top:auto}
.card{border:1.5px solid var(--line);border-radius:14px;padding:26px 28px;background:#fff}
.card.hi{border:2.5px solid var(--acc)}
.card h3{margin:0 0 4px;font-size:24px}
.price{font-size:44px;font-weight:700;line-height:1.1}.price small{font-size:18px;color:var(--mute);font-weight:400}
.when{color:var(--acc2);font-weight:600;font-size:17px;margin-top:6px}
.foot{display:flex;justify-content:space-between;color:var(--mute);font-size:18px;margin-top:28px}
</style></head><body>
<div class="wordmark">ELLINGTON <span>STUDIO</span></div>
<h1>A website in a week. A working app in a month. <em>One fixed price.</em></h1>
<div class="pk">${cards.map((c, i) => `<div class="card${i === 1 ? " hi" : ""}"><h3>${c.name}</h3><div class="price">${c.price}${c.unit ? ` <small>${c.unit}</small>` : ""}</div><div class="when">${c.when}</div></div>`).join("")}</div>
<div class="foot"><span>Half to start, half on delivery. A written scope comes first.</span><span>A venture of Ellington Enterprises LLC</span></div>
</body></html>`;

mkdirSync(REPO + "og", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.screenshot({ path: REPO + "og/studio.png", type: "png" });
await browser.close();
console.log("wrote og/studio.png", cards.map((c) => `${c.name} ${c.price}${c.unit ? " " + c.unit : ""}`).join(" | "));
