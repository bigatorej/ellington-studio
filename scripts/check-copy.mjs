// Ellington's writing rule, enforced in CI.
// Fails if any visible text in an HTML page carries a hyphen, an en dash or an em dash,
// or writes a date as a digit before a month name. Tags, attributes, scripts, styles,
// code, URLs and file names are exempt.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SKIP_DIRS = new Set(["node_modules", ".git", ".vercel", "assets", "screens"]);
const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December";
const DATE_RE = new RegExp(`\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${MONTHS})\\b`, "g");
const DASH_RE = /[-–—]/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

function decode(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

// Returns the visible text with a line number for each fragment.
function visibleFragments(html) {
  let s = html
    .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/<(script|style|code|pre|kbd|svg|template)\b[\s\S]*?<\/\1>/gi, (m) => m.replace(/[^\n]/g, " "))
    .replace(/<[^>]+>/g, (m) => m.replace(/[^\n]/g, " "));
  const frags = [];
  s.split("\n").forEach((line, i) => {
    const t = decode(line).trim();
    if (t) frags.push({ line: i + 1, text: t });
  });
  return frags;
}

const isUrlOrFile = (w) => /^(https?:\/\/|www\.)/i.test(w) || /^[\w.\-\/]+\.(html|pdf|png|svg|md|css|js|mjs|ts|json|ai|com|io)$/i.test(w) || /^[\w-]+\.[a-z]{2,}(\/\S*)?$/i.test(w);

const files = process.argv.slice(2).length ? process.argv.slice(2) : walk(ROOT);
const problems = [];
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const { line, text } of visibleFragments(html)) {
    for (const word of text.split(/\s+/)) {
      if (isUrlOrFile(word)) continue;
      if (DASH_RE.test(word)) problems.push({ file, line, kind: "dash", word });
      DASH_RE.lastIndex = 0;
    }
    const d = text.match(DATE_RE);
    if (d) problems.push({ file, line, kind: "date", word: d.join(", ") });
  }
}

if (problems.length) {
  console.error("Copy check failed:");
  for (const p of problems) console.error(`  ${relative(ROOT, p.file)}:${p.line}  ${p.kind}  "${p.word}"`);
  process.exit(1);
}
console.log(`Copy check passed on ${files.length} page${files.length === 1 ? "" : "s"}.`);
