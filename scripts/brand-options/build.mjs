// Builds brand-options/<option>/{index,intake,kit}.html and brand-options/index.html
// from one shared structure per page. Run: node scripts/brand-options/build.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { OPTIONS, wordmark, lockup } from "./options.mjs";
import { kitPage } from "./kit.mjs";
import { chooserPage } from "./chooser.mjs";

const REPO = new URL("../../", import.meta.url).pathname;
const OUT = join(REPO, "brand-options");
const homeTmpl = readFileSync(new URL("./home.tmpl.html", import.meta.url), "utf8");
const intakeSrc = readFileSync(join(REPO, "intake.html"), "utf8");

// ---------- contrast ----------
export function luminance(hex) {
  const [r, g, b] = hex.replace("#", "").match(/../g).map((h) => parseInt(h, 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const fill = (tmpl, map) => tmpl.replace(/\{\{(\w+)\}\}/g, (_, k) => { if (!(k in map)) throw new Error(`missing ${k}`); return map[k]; });

function intakePage(opt, marks) {
  let s = intakeSrc;
  // Replace the head style block with the option's fonts and stylesheet. The fields and the script stay as they are.
  s = s.replace(/<style>[\s\S]*?<\/style>/, `<link rel="icon" type="image/png" sizes="32x32" href="assets/icon-32.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${opt.fonts.url}">
<link rel="stylesheet" href="theme.css">`);
  s = s.replace('<html lang="en">', `<html lang="en" data-option="${opt.slug}">`);
  s = s.replace("<body>", '<body class="intake">');
  s = s.replace(/<header>[\s\S]*?<\/header>/, `<header class="site-head"><div class="wrap nav"><a class="lockup" href="index.html" aria-label="Ellington Studio">${marks.lockup}</a><span class="nav-note">About 10 minutes</span></div></header>`);
  s = s.replace('<div class="wrap">\n<h1>Start a project</h1>', '<main class="wrap form-wrap">\n<h1>Start a project</h1>');
  s = s.replace("</div>\n\n<script>", "</main>\n\n<script>");
  s = s.replace('<span style="color:var(--mute);font-size:14px">Scope and price back within 1 business day.</span>', '<span class="note">Scope and price back within 1 business day.</span>');
  return s;
}

for (const key of ["a", "b", "c"]) {
  const opt = OPTIONS[key];
  const dir = join(OUT, opt.slug);
  mkdirSync(join(dir, "assets"), { recursive: true });
  const marks = {
    lockup: lockup(opt),
    monogram: opt.monogram(),
    wordmark: wordmark(opt),
  };
  const home = fill(homeTmpl, {
    SLUG: opt.slug,
    FONTS_URL: opt.fonts.url,
    LOCKUP: marks.lockup,
    HERO_ART: opt.heroArt(opt.monogram()),
    MONOGRAM: marks.monogram,
    WORDMARK: marks.wordmark,
  });
  writeFileSync(join(dir, "index.html"), home);
  writeFileSync(join(dir, "intake.html"), intakePage(opt, marks));
  writeFileSync(join(dir, "kit.html"), kitPage(opt, { contrast, lockup, wordmark, hasSample: existsSync(join(dir, "assets", "sample.jpg")) }));
  console.log(`built ${opt.slug}`);
}
writeFileSync(join(OUT, "index.html"), chooserPage(OPTIONS, { lockup, wordmark }));
console.log("built chooser");
