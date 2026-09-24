// The chooser page at brand-options/index.html. Three columns, one table, three rulings.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function chooserPage(OPTIONS, { lockup, wordmark }) {
  const opts = ["a", "b", "c"].map((k) => OPTIONS[k]);
  const fontLinks = opts.map((o) => `<link rel="stylesheet" href="${o.fonts.url}">`).join("\n");

  const cols = opts.map((o) => {
    const t = o.tokens;
    const dark = t.midnight || t.forest || t.graphite;
    const second = t.signal || t.metal || t.graphite;
    const strip = Object.entries(t).filter(([k]) => !["onDark", "onDarkMute", "accentInk", "grid"].includes(k)).map(([k, v]) => `<i title="${k} ${v}" style="background:${v}"></i>`).join("");
    const head = { a: "'Space Grotesk', sans-serif", b: "'Fraunces', serif", c: "'Inter Tight', sans-serif" }[o.letter.toLowerCase()];
    const text = { a: "'Manrope', sans-serif", b: "'Source Sans 3', sans-serif", c: "'Inter', sans-serif" }[o.letter.toLowerCase()];
    const weight = { a: 700, b: 400, c: 800 }[o.letter.toLowerCase()];
    const tracking = { a: "-0.01em", b: "0", c: "-0.03em" }[o.letter.toLowerCase()];
    return `<article class="col opt-${o.letter.toLowerCase()}">
  <div class="stage" style="background:${dark};color:${t.onDark}">
    <span class="letter" style="font-family:${head}">${o.letter}</span>
    <span class="lk">${lockup(o, "currentColor", second)}</span>
  </div>
  <h2 style="font-family:${head};font-weight:${weight};letter-spacing:${tracking}">${esc(o.name)}</h2>
  <p class="feel" style="font-family:${text}">${esc(o.feeling)}</p>
  <div class="strip">${strip}</div>
  <div class="type" style="font-family:${text};color:${t.ink};background:${t.ground}">
    <div class="th" style="font-family:${head};font-weight:${weight};letter-spacing:${tracking}">A website in a week.</div>
    <p>You know the price and the date before you say yes.</p>
    <a class="cta" style="background:${o.letter === "C" ? t.accent : (t.blue || t.forest)};color:${o.letter === "C" ? t.accentInk : t.onDark};font-family:${text}">Start a project</a>
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

  const row = (label, f) => `<tr><th>${label}</th>${opts.map((o) => `<td>${f(o)}</td>`).join("")}</tr>`;
  const table = `<table class="cmp">
<thead><tr><th></th>${opts.map((o) => `<th>${esc(o.title)}</th>`).join("")}</tr></thead>
<tbody>
${row("The feeling in 5 words", (o) => esc(o.feeling))}
${row("What it says about the Studio", (o) => esc(o.says))}
${row("The risk", (o) => esc(o.risk))}
${row("Sibling brand it stands furthest from", (o) => esc(o.furthest))}
${row("Recommendation", (o) => `${o.recommend ? '<b class="rec">Recommended.</b> ' : ""}${esc(o.reason)}`)}
</tbody></table>`;

  const buttons = opts.map((o) => `<button type="button" class="choose" data-ruling="Ruling: Ellington Studio adopts Option ${o.letter}, ${o.name}">Choose ${o.letter}</button>`).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ellington Studio. Three brand options</title>
<meta name="description" content="Three complete brand directions for Ellington Studio, each with a kit, a home page and an intake page. Pick one by looking.">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontLinks}
<style>
:root{--ink:#14161a;--ink2:#3d434c;--mute:#6b7280;--line:#e2e4e8;--paper:#fff;--wash:#f4f4f2}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5}
a{color:inherit}
.wrap{max-width:1360px;margin:0 auto;padding:0 24px}
header{padding:48px 0 24px;border-bottom:1px solid var(--line)}
header h1{font-size:34px;margin:0 0 8px;letter-spacing:-.01em}
header p{margin:0;color:var(--ink2);max-width:760px;font-size:18px}
header .date{display:block;margin-top:10px;font-size:13px;color:var(--mute);letter-spacing:.08em;text-transform:uppercase}
.cols{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:36px 0}
.col{border:1px solid var(--line);display:flex;flex-direction:column;min-width:0}
.col .stage{height:170px;display:flex;align-items:center;justify-content:center;position:relative}
.col .stage .letter{position:absolute;left:16px;top:10px;font-size:14px;letter-spacing:.1em;opacity:.7}
.col .stage .lk .lockup-inner{display:flex;align-items:center;gap:14px}
.col .stage .mark{width:56px;height:56px}
.col .stage .wordmark{height:30px;width:auto}
.col h2{margin:22px 22px 4px;font-size:30px;line-height:1}
.col .feel{margin:0 22px 16px;color:var(--mute);font-size:15px}
.col .strip{display:flex;height:34px;margin:0 22px 16px;border:1px solid var(--line)}
.col .strip i{flex:1}
.col .type{margin:0 22px 16px;padding:22px;border:1px solid var(--line)}
.col .type .th{font-size:28px;line-height:1.05;margin-bottom:8px}
.col .type p{margin:0 0 14px;font-size:15px;opacity:.85}
.col .type .cta{display:inline-block;padding:10px 16px;font-size:14px;font-weight:600;text-decoration:none}
.col .shot{display:block;margin:0 22px;border:1px solid var(--line);overflow:hidden;background:var(--wash);aspect-ratio:1440/1300}
.col .shot img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.col .links{display:flex;gap:6px;flex-wrap:wrap;padding:16px 22px 22px;margin-top:auto}
.col .links a{font-size:13.5px;font-weight:600;text-decoration:none;border:1px solid var(--line);padding:7px 11px;border-radius:999px;color:var(--ink)}
.col .links a:hover{background:var(--wash)}
.cmp{width:100%;border-collapse:collapse;font-size:15px;margin:8px 0 36px}
.cmp th,.cmp td{text-align:left;vertical-align:top;padding:14px 16px 14px 0;border-bottom:1px solid var(--line)}
.cmp thead th{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.cmp tbody th{width:200px;font-weight:600;color:var(--ink)}
.cmp td{color:var(--ink2);width:calc((100% - 200px)/3)}
.cmp .rec{color:#0f6b3a}
.choose-row{display:flex;gap:14px;flex-wrap:wrap;align-items:center;padding:8px 0 64px}
.choose{font:inherit;font-weight:700;font-size:16px;padding:14px 26px;border:2px solid var(--ink);background:var(--ink);color:#fff;cursor:pointer;border-radius:6px}
.choose.opt-b{background:#0F2E23;border-color:#0F2E23}
.choose.opt-c{background:#C6F135;border-color:#C6F135;color:#0B0B0B}
.choose:focus-visible{outline:3px solid #b8860b;outline-offset:2px}
#ruled{color:var(--mute);font-size:14.5px;min-height:1.4em}
h2.sec{font-size:24px;margin:16px 0 10px}
@media (max-width:1000px){.cols{grid-template-columns:1fr}.cmp{display:block;overflow-x:auto}.cmp tbody th{width:150px}}
</style>
</head>
<body>
<header><div class="wrap">
  <h1>Ellington Studio. Three brand options.</h1>
  <p>Three complete directions, same words in each. Open the home pages side by side, look, and choose. Each column links to the live home page, the intake page and the brand kit built in that system.</p>
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
document.querySelectorAll(".choose").forEach((b, i) => {
  b.classList.add(["opt-a","opt-b","opt-c"][i]);
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
