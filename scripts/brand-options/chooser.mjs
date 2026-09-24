// The chooser page at brand-options/index.html. Five columns, one table, five rulings.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function chooserPage(OPTIONS, { lockup, wordmark }) {
  const opts = Object.values(OPTIONS);
  const fontLinks = opts.map((o) => `<link rel="stylesheet" href="${o.fonts.url}">`).join("\n");

  const cols = opts.map((o) => {
    const t = o.tokens;
    const dark = o.show.primaryBg === t.accent ? t.graphite : (t.midnight || t.forest || t.graphite || t.emerald || t.charcoal);
    const strip = Object.entries(t).filter(([k]) => !["onDark", "onDarkMute", "accentInk", "grid"].includes(k)).map(([k, v]) => `<i title="${k} ${v}" style="background:${v}"></i>`).join("");
    const s = o.show;
    return `<article class="col opt-${o.letter.toLowerCase()}">
  <div class="stage" style="background:${dark};color:${t.onDark}">
    <span class="letter" style="font-family:${s.head}">${o.letter}</span>
    <span class="lk">${lockup(o, "currentColor", s.second)}</span>
  </div>
  <h2 style="font-family:${s.head};font-weight:${s.weight};letter-spacing:${s.tracking}">${esc(o.name)}</h2>
  <p class="feel" style="font-family:${s.text}">${esc(o.feeling)}</p>
  <div class="strip">${strip}</div>
  <div class="type" style="font-family:${s.text};color:${t.ink};background:${t.ground}">
    <div class="th" style="font-family:${s.head};font-weight:${s.weight};letter-spacing:${s.tracking}">A website in a week.</div>
    <p>You know the price and the date before you say yes.</p>
    <a class="cta" style="background:${s.primaryBg};color:${s.primaryFg};font-family:${s.text}">Start a project</a>
  </div>
  <a class="shot" href="${o.slug}/index.html"><img src="${o.slug}/assets/home-1440.png" alt="${esc(o.title)} home page at 1440 pixels" loading="lazy"></a>
  <nav class="links">
    <a href="${o.slug}/index.html">Home</a>
    <a href="${o.slug}/intake.html">Intake</a>
    <a href="${o.slug}/kit.html">Brand kit</a>
    <a href="${o.slug}/Ellington Studio Brand Kit Option ${o.letter} 2026.09.24.pdf">Kit PDF</a>
  </nav>
</article>`;
  }).join("\n");

  const row = (label, f, cls = "") => `<tr class="${cls}"><th>${label}</th>${opts.map((o) => `<td>${f(o)}</td>`).join("")}</tr>`;
  const table = `<table class="cmp">
<thead><tr><th></th>${opts.map((o) => `<th>${esc(o.title)}</th>`).join("")}</tr></thead>
<tbody>
${row("The feeling in 5 words", (o) => esc(o.feeling))}
${row("What it says about the Studio", (o) => esc(o.says))}
${row("The risk", (o) => esc(o.risk))}
${row("Sibling brand it stands furthest from", (o) => esc(o.furthest))}
${row("Recommendation", (o) => `${o.recommend ? '<b class="rec">Overall pick.</b> ' : ""}${esc(o.reason)}`)}
${row("Originality check", (o) => (o.originality ? esc(o.originality) : '<span class="na">Built from a brief, not a reference brand.</span>'), "orig")}
</tbody></table>`;

  const buttons = opts.map((o) => `<button type="button" class="choose opt-${o.letter.toLowerCase()}" data-ruling="Ruling: Ellington Studio adopts Option ${o.letter}, ${o.name}" style="background:${o.show.primaryBg};border-color:${o.show.primaryBg};color:${o.show.primaryFg}">Choose ${o.letter}</button>`).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ellington Studio. Five brand options</title>
<meta name="description" content="Five complete brand directions for Ellington Studio, each with a kit, a home page and an intake page. Pick one by looking.">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontLinks}
<style>
:root{--ink:#14161a;--ink2:#3d434c;--mute:#6b7280;--line:#e2e4e8;--paper:#fff;--wash:#f4f4f2}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5}
a{color:inherit}
.wrap{max-width:1400px;margin:0 auto;padding:0 20px}
header{padding:48px 0 24px;border-bottom:1px solid var(--line)}
header h1{font-size:34px;margin:0 0 8px;letter-spacing:-.01em}
header p{margin:0;color:var(--ink2);max-width:760px;font-size:18px}
header .date{display:block;margin-top:10px;font-size:13px;color:var(--mute);letter-spacing:.08em;text-transform:uppercase}
.cols{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px;padding:36px 0}
.col{border:1px solid var(--line);display:flex;flex-direction:column;min-width:0}
.col .stage{height:150px;display:flex;align-items:center;justify-content:center;position:relative;padding:0 12px}
.col .stage .letter{position:absolute;left:14px;top:10px;font-size:14px;letter-spacing:.1em;opacity:.7}
.col .stage .lk .lockup-inner{display:flex;align-items:center;gap:10px}
.col .stage .mark{width:44px;height:44px;flex:none}
.col .stage .wordmark{height:22px;width:auto;max-width:150px}
.col h2{margin:18px 16px 4px;font-size:26px;line-height:1}
.col .feel{margin:0 16px 14px;color:var(--mute);font-size:13.5px}
.col .strip{display:flex;height:28px;margin:0 16px 14px;border:1px solid var(--line)}
.col .strip i{flex:1}
.col .type{margin:0 16px 14px;padding:16px;border:1px solid var(--line)}
.col .type .th{font-size:22px;line-height:1.05;margin-bottom:8px}
.col .type p{margin:0 0 12px;font-size:13.5px;opacity:.85}
.col .type .cta{display:inline-block;padding:9px 14px;font-size:13px;font-weight:600;text-decoration:none}
.col .shot{display:block;margin:0 16px;border:1px solid var(--line);overflow:hidden;background:var(--wash);aspect-ratio:1440/1300}
.col .shot img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.col .links{display:flex;gap:5px;flex-wrap:wrap;padding:14px 16px 18px;margin-top:auto}
.col .links a{font-size:12.5px;font-weight:600;text-decoration:none;border:1px solid var(--line);padding:6px 9px;border-radius:999px;color:var(--ink)}
.col .links a:hover{background:var(--wash)}
.cmp{width:100%;border-collapse:collapse;font-size:14px;margin:8px 0 36px}
.cmp th,.cmp td{text-align:left;vertical-align:top;padding:14px 14px 14px 0;border-bottom:1px solid var(--line)}
.cmp thead th{font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.cmp tbody th{width:150px;font-weight:600;color:var(--ink)}
.cmp td{color:var(--ink2);width:calc((100% - 150px)/5)}
.cmp .rec{color:#0f6b3a}
.cmp .orig td{background:var(--wash)}
.cmp .orig .na{color:var(--mute);font-style:italic}
.choose-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;padding:8px 0 64px}
.choose{font:inherit;font-weight:700;font-size:16px;padding:14px 24px;border:2px solid var(--ink);background:var(--ink);color:#fff;cursor:pointer;border-radius:6px}
.choose:focus-visible{outline:3px solid #b8860b;outline-offset:2px}
#ruled{color:var(--mute);font-size:14.5px;min-height:1.4em;flex-basis:100%}
h2.sec{font-size:24px;margin:16px 0 10px}
@media (max-width:1180px){.cols{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:1000px){.cmp{display:block;overflow-x:auto}.cmp tbody th{width:150px;min-width:150px}.cmp td{min-width:220px}}
@media (max-width:760px){.cols{grid-template-columns:1fr}.col .stage .wordmark{max-width:200px}}
</style>
</head>
<body>
<header><div class="wrap">
  <h1>Ellington Studio. Five brand options.</h1>
  <p>Five complete directions, same words in each. Open the home pages side by side, look, and choose. Each column links to the live home page, the intake page and the brand kit built in that system.</p>
  <span class="date">September 24th, 2026</span>
</div></header>
<main class="wrap">
  <div class="cols">
${cols}
  </div>
  <h2 class="sec">Side by side</h2>
  ${table}
  <h2 class="sec">Make the call</h2>
  <p style="color:var(--ink2);margin:0 0 16px">Each button copies a one line ruling to the clipboard. Paste it into chat and the Studio adopts that option.</p>
  <div class="choose-row">
${buttons}
    <span id="ruled" aria-live="polite"></span>
  </div>
</main>
<script>
document.querySelectorAll(".choose").forEach((b) => {
  b.addEventListener("click", async () => {
    const text = b.dataset.ruling;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {}
    if (!ok) {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch (e) {}
      ta.remove();
    }
    document.getElementById("ruled").textContent = ok ? "Copied: " + text : "Copy this: " + text;
    window.__lastRuling = text;
  });
});
</script>
</body>
</html>`;
}
