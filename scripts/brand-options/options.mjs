// Option data for the three Ellington Studio brand directions.
// Marks are original SVG drawn here. Colors are hex tokens; contrast is computed at build time.

const svgOpen = (vb, cls = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" class="mark ${cls}" role="img" aria-label="Ellington Studio">`;

// ---------- Option A: Blueprint ----------
// Drafted E and S. Bold strokes read at 16 px; the hairline sheet frame and the ember tick fade at small sizes.
const aMonogram = (fg = "currentColor", signal = "var(--signal)") => `${svgOpen("0 0 64 64", "mono-a")}
<rect x="1.5" y="1.5" width="61" height="61" fill="none" stroke="${fg}" stroke-width="1" opacity=".45"/>
<path d="M6 12h4M8 10v4M54 52h4M56 50v4" stroke="${fg}" stroke-width="1" opacity=".55"/>
<path d="M11 13h23v8H19v7h14v8H19v7h15v8H11z" fill="${fg}"/>
<path d="M51 20.5C50 15 45 13 41 13c-5 0-7.5 3.3-7.5 7.2 0 9.4 17 6.6 17 17.3 0 5.7-4.4 9.5-9.5 9.5-4.8 0-8-2.6-9-6.5" fill="none" stroke="${fg}" stroke-width="8" stroke-linecap="square"/>
<rect x="50" y="8" width="6" height="6" fill="${signal}"/>
</svg>`;

// ---------- Option B: Greenhouse ----------
// ES inside a seal. The ring is the metal; the letters are the ink.
const bMonogram = (fg = "currentColor", metal = "var(--metal)") => `${svgOpen("0 0 64 64", "mono-b")}
<circle cx="32" cy="32" r="29.5" fill="none" stroke="${metal}" stroke-width="2.2"/>
<circle cx="32" cy="32" r="25.5" fill="none" stroke="${metal}" stroke-width=".7" opacity=".8"/>
<g transform="translate(32 34) scale(1.24) translate(-32 -34)"><path d="M17 20h15.5v4.2H21.6v7.5h9.5v4.1h-9.5v8h11.2V48H17z" fill="${fg}"/>
<path d="M47.5 24.6c-.8-3.3-3.2-4.9-6.1-4.9-3.3 0-5.4 1.9-5.4 4.6 0 6.7 12.6 4 12.6 12.4 0 4.7-3.6 7.6-8.1 7.6-4 0-6.9-2-7.9-5.7" fill="none" stroke="${fg}" stroke-width="4.6"/></g>
<path d="M14 54h36" stroke="${metal}" stroke-width=".7" opacity="0"/>
</svg>`;

// ---------- Option C: Signal ----------
// A solid square with a geometric E and a stepped S knocked out.
const cMonogram = (fg = "currentColor", ground = "var(--ground)") => `${svgOpen("0 0 64 64", "mono-c")}
<rect width="64" height="64" fill="${fg}"/>
<path d="M11 13h21v7H19v6.5h12v7H19v6.5h13V47H11z" fill="${ground}"/>
<path d="M35 13h19v7H43v6.5h11V47H35v-7h11v-6.5H35z" fill="${ground}"/>
</svg>`;


// ---------- Option D: Maison ----------
// A serif E and S drawn as shapes: bracketed serifs on the E, a high contrast S with beaked terminals.
// A small lozenge sits between them. No frame, no interlock.
const dMonogram = (fg = "currentColor", second = "var(--burgundy)") => `${svgOpen("0 0 64 64", "mono-d")}
<path d="M8 13h22.5v6.5H16.5v8.6h12v6.2h-12v9.7H31V51H8v-4.5l3.2-.8V19.6L8 18.6z" fill="${fg}"/>
<path d="M6 13h4.5v2.2H6zM6 48.8h4.5V51H6zM26 13h4.5v2.2H26zM26.5 48.8H31V51h-4.5z" fill="${fg}"/>
<path d="M56.5 20.5c-1.2-4.6-4.6-6.9-8.6-6.9-4.7 0-7.7 2.6-7.7 6.3 0 9 17.4 5.7 17.4 17.5 0 6.3-4.9 10.5-11.4 10.5-5.6 0-9.4-2.9-10.8-7.9" fill="none" stroke="${fg}" stroke-width="6"/>
<path d="M54.2 16.4l3.4-3.6 1.6 1.6-3.4 3.6zM37.2 43.5l-3.4 3.6 1.6 1.6 3.4-3.6z" fill="${fg}"/>
<path d="M33.2 31.5l3.3-3.3 3.3 3.3-3.3 3.3z" fill="${second}"/>
</svg>`;

// Repeating ornament built from the E stems and the S curve. Used as a hairline divider, never all over.
const dOrnamentTile = (fg = "currentColor") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" class="orn" aria-hidden="true"><path d="M5 4v16M27 4v16" stroke="${fg}" stroke-width="1.6"/><path d="M9 8c3-4 8-3 8 1s-8 2-8 6 6 5 9 1" fill="none" stroke="${fg}" stroke-width="1.6"/><path d="M16 1l2 2-2 2-2-2z" fill="${fg}"/></svg>`;

// ---------- Option E: Coastline ----------
// Rounded strokes. The E's bottom bar and the S share one soft horizon curve underneath.
const eMonogram = (fg = "currentColor", second = "var(--ocean)") => `${svgOpen("0 0 64 64", "mono-e")}
<path d="M12 12v28M12 12h17M12 26h14M12 40h17" fill="none" stroke="${fg}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M53 18.5c-1.5-3.5-5-5.5-8.5-5.5-4.6 0-7.5 2.6-7.5 6 0 8 16 4.5 16 13 0 4-3.6 6.5-8 6.5-4.3 0-7.6-2-9-5.5" fill="none" stroke="${fg}" stroke-width="7" stroke-linecap="round"/>
<path d="M9 53c7.5-5 15.5-5 23 0s15.5 5 23 0" fill="none" stroke="${second}" stroke-width="4.5" stroke-linecap="round"/>
</svg>`;

export const OPTIONS = {
  a: {
    slug: "a-blueprint",
    letter: "A",
    name: "Blueprint",
    title: "Option A, Blueprint",
    feeling: "Engineered, exact, calm, blue, trusted",
    says: "The Studio is a precision shop. The date and the price are drawn before the work starts, like a plan.",
    risk: "Blue and orange sits one step from SwampCast. The ember signal must stay under 10% of any screen or it drifts into sports.",
    furthest: "Bar Ellington. No gold, no serif, no cream, no glassware.",
    recommend: true,
    reason: "Of the five it is the only one whose design makes the Studio's actual promise, precision on a date, and it is the pair Ellington already loves, kept a full step from SwampCast by the engineered blues and the ember under 10%.",
    fonts: {
      url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Manrope:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
      faces: [
        { name: "Space Grotesk", role: "Headings and display", weights: "500, 700", source: "https://fonts.google.com/specimen/Space+Grotesk", license: "SIL Open Font License 1.1" },
        { name: "Manrope", role: "Text, labels, buttons", weights: "400, 500, 600", source: "https://fonts.google.com/specimen/Manrope", license: "SIL Open Font License 1.1" },
        { name: "IBM Plex Mono", role: "Figures, dates, technical labels", weights: "400, 500", source: "https://fonts.google.com/specimen/IBM+Plex+Mono", license: "SIL Open Font License 1.1" },
      ],
    },
    tokens: {
      ground: "#F4F6F9", surface: "#FFFFFF", ink: "#0F1B2D", ink2: "#33415A", mute: "#5A6A82",
      line: "#C8D2DF", grid: "#DCE3EC", blue: "#1E3A5F", midnight: "#0B1626", signal: "#B8420C",
      success: "#1C6B47", danger: "#A32D2D", onDark: "#E8EEF5", onDarkMute: "#A9B7C9",
    },
    swatches: [
      { name: "Paper", token: "ground", role: "Ground", pairText: "ink", size: "body" },
      { name: "Sheet", token: "surface", role: "Card surface", pairText: "ink", size: "body" },
      { name: "Midnight", token: "midnight", role: "Dark ground, hero panel, footer", pairText: "onDark", size: "body" },
      { name: "Ink", token: "ink", role: "Headings and body text", pairText: "ground", size: "body" },
      { name: "Slate", token: "ink2", role: "Secondary text", pairText: "ground", size: "body" },
      { name: "Mute", token: "mute", role: "Captions and labels", pairText: "ground", size: "body" },
      { name: "Drafting Blue", token: "blue", role: "Accent, primary button, links", pairText: "surface", size: "body", textOnIt: true },
      { name: "Ember", token: "signal", role: "Signal, under 10% of any screen", pairText: "surface", size: "body", textOnIt: true },
      { name: "Grid", token: "grid", role: "Grid lines and rules", pairText: "ink", size: "body" },
      { name: "Success", token: "success", role: "Success state", pairText: "surface", size: "body", textOnIt: true },
      { name: "Danger", token: "danger", role: "Danger state, form errors", pairText: "surface", size: "body", textOnIt: true },
      { name: "Light on Midnight", token: "onDark", role: "Text on dark grounds", pairText: "midnight", size: "body" },
    ],
    scale: [
      ["Display", "Space Grotesk 700", "64 / 1.0", "clamp(40px, 6vw, 64px)"],
      ["H1", "Space Grotesk 700", "48 / 1.05", "clamp(34px, 4.5vw, 48px)"],
      ["H2", "Space Grotesk 700", "32 / 1.15", "32px"],
      ["Body", "Manrope 400", "17 / 1.6", "17px"],
      ["Small", "Manrope 500", "14 / 1.5", "14px, tracking .02em"],
      ["Mono", "IBM Plex Mono 500", "13 / 1.4", "13px, uppercase labels, figures at any size"],
    ],
    rules: [
      ["Spacing unit", "8px. Sections 96px, blocks 48px, card padding 28px, gaps 24px"],
      ["Radius", "2px on everything. Corners are drafted, not softened"],
      ["Shadow", "None. Depth comes from the 1px line and the grid, never a blur"],
      ["Rules", "1px lines in Grid. Dimension ticks 6px long at section edges"],
    ],
    shots: [
      "A birch workbench from above, a steel rule and a mechanical pencil aligned to the edge, morning daylight from the left.",
      "One human hand, sleeve rolled, setting a drafting square against a sheet of slate blue paper with white grid lines.",
      "A clean desk with a closed laptop, a paper notebook open to a hand drawn wireframe, a single ember pencil cap.",
      "A wall of pinned plans, shot straight on, the grid of the paper catching side light, no people.",
      "A phone on the bench beside a printed scope, the screen showing a plain white page, the rest of the frame in shadow.",
      "A window sill with a level, a tape measure and a coffee, the light flat and honest, everything square to the frame.",
    ],
    sample: { prompt: "Birch workbench, drafting square, steel rule, slate blue grid paper, one hand, one ember pencil cap, daylight." },
    voice: "Blueprint speaks in measurements. Short declaratives, figures in mono, every promise with a date beside it. It never raises its voice, because the plan already says what will happen.",
    never: [
      { title: "Never a royal blue or a bright orange", note: "That is a stadium, not a studio." },
      { title: "Never a soft radius or a drop shadow", note: "The system is drafted. Edges stay sharp." },
      { title: "Never the monogram without its frame", note: "The frame is the sheet. Without it the letters float." },
    ],
    monogram: aMonogram,
    heroArt: (m) => `<div class="draft-sheet">${m}<span class="dim dim-w"></span><span class="dim dim-h"></span></div>`,
    wm: { fam: "'Space Grotesk', sans-serif", weight: 700, spacing: "0.06em", text: "ELLINGTON STUDIO", size: 24, width: 270 },
    show: { head: "'Space Grotesk', sans-serif", text: "'Manrope', sans-serif", weight: 700, tracking: "-0.01em", primaryBg: "#1E3A5F", primaryFg: "#FFFFFF", second: "#B8420C" },
    icon: { bg: "#0B1626", fg: "#E8EEF5", second: "#B8420C" },
    neverDemos: ["royal", "soft", "noframe"],
  },

  b: {
    slug: "b-greenhouse",
    letter: "B",
    name: "Greenhouse",
    title: "Option B, Greenhouse",
    feeling: "Quiet money, warm, trusted, crafted, private",
    says: "The Studio is a craftsman you were referred to. You are paying for judgment and a finished object, not hours.",
    risk: "Warm cream plus a metal sits nearest Bar Ellington. Copper has to stay copper, never gold, and the serif has to stay modern.",
    furthest: "SwampCast. Nothing in it moves fast or shouts.",
    recommend: false,
    reason: "Beautiful and the most expensive looking of the three, but it reads as advisory and hospitality, and physicians and creators may not see software in it.",
    fonts: {
      url: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Source+Sans+3:wght@400;500;600&display=swap",
      faces: [
        { name: "Fraunces", role: "Headings, display, the tagline", weights: "400, 600, italic 400", source: "https://fonts.google.com/specimen/Fraunces", license: "SIL Open Font License 1.1" },
        { name: "Source Sans 3", role: "Text, labels, buttons, forms", weights: "400, 500, 600", source: "https://fonts.google.com/specimen/Source+Sans+3", license: "SIL Open Font License 1.1" },
      ],
    },
    tokens: {
      ground: "#F4ECDD", surface: "#FBF6EC", forest: "#0F2E23", forest2: "#173D30", ink: "#1A2620", ink2: "#3F4C45", mute: "#5F6B64",
      line: "#D8CCB4", metal: "#8A4E1E", metalLight: "#D9A268", success: "#2C6E49", danger: "#963030", onDark: "#F4ECDD", onDarkMute: "#B9C3BC",
    },
    swatches: [
      { name: "Cream", token: "ground", role: "Ground, paper", pairText: "ink", size: "body" },
      { name: "Card", token: "surface", role: "Card surface", pairText: "ink", size: "body" },
      { name: "Forest", token: "forest", role: "Dark ground, hero, footer, primary button", pairText: "onDark", size: "body" },
      { name: "Bottle", token: "forest2", role: "Raised panel on Forest", pairText: "onDark", size: "body" },
      { name: "Ink", token: "ink", role: "Headings and body text", pairText: "ground", size: "body" },
      { name: "Moss Ink", token: "ink2", role: "Secondary text", pairText: "ground", size: "body" },
      { name: "Mute", token: "mute", role: "Captions and labels", pairText: "ground", size: "body" },
      { name: "Copper", token: "metal", role: "The single metal. Rules, seal, small labels on cream", pairText: "ground", size: "body" },
      { name: "Copper Light", token: "metalLight", role: "Copper on Forest, large text and rules only", pairText: "forest", size: "large" },
      { name: "Success", token: "success", role: "Success state", pairText: "surface", size: "body", textOnIt: true },
      { name: "Danger", token: "danger", role: "Danger state, form errors", pairText: "surface", size: "body", textOnIt: true },
      { name: "Cream on Forest", token: "onDark", role: "Text on dark grounds", pairText: "forest", size: "body" },
    ],
    scale: [
      ["Display", "Fraunces 400, optical size 144", "72 / 1.0", "clamp(44px, 6.5vw, 72px)"],
      ["H1", "Fraunces 400", "56 / 1.05", "clamp(36px, 5vw, 56px)"],
      ["H2", "Fraunces 600", "34 / 1.15", "34px"],
      ["Body", "Source Sans 3 400", "18 / 1.6", "18px"],
      ["Small", "Source Sans 3 600", "13 / 1.5", "13px, uppercase, tracking .14em"],
      ["Mono", "none", "", "This option has no mono. Figures set in Fraunces"],
    ],
    rules: [
      ["Spacing unit", "8px. Sections 112px, blocks 56px, card padding 32px, gaps 24px"],
      ["Radius", "0 on panels and cards, 999px on pills and buttons"],
      ["Shadow", "One soft shadow on raised cards: 0 24px 48px rgba(15,46,35,.10)"],
      ["Rules", "1px Copper hairlines. The seal sits on a rule at 40% opacity"],
    ],
    shots: [
      "A walnut desk under one brass lamp, a finished leather notebook closed, the rest of the room falling into green shadow.",
      "Brass fittings on a bottle green door, shot close, the metal warm and worn, the paint deep and matte.",
      "A cream card on green baize with a single copper pen laid across it, lamp light from the right.",
      "A leather chair from behind, a window with rain, a laptop closed on the side table, quiet and finished.",
      "A row of walnut shelves with one object per shelf: a clock, a bound volume, a phone face down.",
      "A craftsman's hand polishing a copper edge, sleeve of a dark green jumper, everything else soft.",
    ],
    sample: { prompt: "Walnut desk, brass lamp, bottle green leather notebook with a copper clasp, cream card, deep green shadow." },
    voice: "Greenhouse speaks like a letter from someone you trust. Full sentences, a warm serif, one italic for emphasis, a rule between thoughts. It offers, never pitches.",
    never: [
      { title: "Never gold", note: "Copper is the metal. Gold belongs to Bar Ellington." },
      { title: "Never Cormorant Garamond", note: "Two siblings own it. Fraunces is the serif here." },
      { title: "Never a filled seal", note: "The seal is drawn, not stamped. It stays a line." },
    ],
    monogram: bMonogram,
    heroArt: (m) => `<div class="seal-stage">${m}</div>`,
    wm: { fam: "'Fraunces', serif", weight: 400, spacing: "0.22em", text: "ELLINGTON STUDIO", size: 22, width: 330 },
    show: { head: "'Fraunces', serif", text: "'Source Sans 3', sans-serif", weight: 400, tracking: "0", primaryBg: "#0F2E23", primaryFg: "#F4ECDD", second: "#8A4E1E" },
    icon: { bg: "#0F2E23", fg: "#F4ECDD", second: "#D9A268" },
    neverDemos: ["gold", "cg", "fillseal"],
  },

  c: {
    slug: "c-signal",
    letter: "C",
    name: "Signal",
    title: "Option C, Signal",
    feeling: "Bold, modern, confident, direct, fast",
    says: "The Studio is a software company that ships. Big type, hard edges, one bright signal that tells you where to press.",
    risk: "Black and white with one loud accent is the default of a thousand software studios. It leans on the mark and the type to stay Ellington's.",
    furthest: "Bar Ellington and the fashion house together. No warmth, no serif, no metal, no editorial softness.",
    recommend: false,
    reason: "The strongest single impression of the three and the easiest to build on, but it says software studio before it says one experienced person, and the founder is the product.",
    fonts: {
      url: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      faces: [
        { name: "Inter Tight", role: "Display and headings", weights: "500, 700, 800", source: "https://fonts.google.com/specimen/Inter+Tight", license: "SIL Open Font License 1.1" },
        { name: "Inter", role: "Text, buttons, forms", weights: "400, 500, 600", source: "https://fonts.google.com/specimen/Inter", license: "SIL Open Font License 1.1" },
        { name: "JetBrains Mono", role: "Labels, step numbers, table figures", weights: "400, 500", source: "https://fonts.google.com/specimen/JetBrains+Mono", license: "SIL Open Font License 1.1" },
      ],
    },
    tokens: {
      ground: "#FFFFFF", surface: "#F3F3F1", graphite: "#141414", graphite2: "#232323", ink: "#0B0B0B", ink2: "#3A3A3A", mute: "#666666",
      line: "#DDDDDD", accent: "#C6F135", accentInk: "#0B0B0B", success: "#1B7A46", danger: "#B42525", onDark: "#F5F5F2", onDarkMute: "#A8A8A3",
    },
    swatches: [
      { name: "Paper White", token: "ground", role: "Ground", pairText: "ink", size: "body" },
      { name: "Stone", token: "surface", role: "Card surface, form fields", pairText: "ink", size: "body" },
      { name: "Graphite", token: "graphite", role: "Dark ground, hero, footer, primary button", pairText: "onDark", size: "body" },
      { name: "Graphite 2", token: "graphite2", role: "Raised panel on Graphite", pairText: "onDark", size: "body" },
      { name: "Ink", token: "ink", role: "Headings and body text", pairText: "ground", size: "body" },
      { name: "Ink 2", token: "ink2", role: "Secondary text", pairText: "ground", size: "body" },
      { name: "Mute", token: "mute", role: "Captions and labels", pairText: "ground", size: "body" },
      { name: "Acid", token: "accent", role: "The one accent. One job per screen: the primary action", pairText: "accentInk", size: "body", textOnIt: true },
      { name: "Line", token: "line", role: "Rules and borders", pairText: "ink", size: "body" },
      { name: "Success", token: "success", role: "Success state", pairText: "ground", size: "body", textOnIt: true },
      { name: "Danger", token: "danger", role: "Danger state, form errors", pairText: "ground", size: "body", textOnIt: true },
      { name: "White on Graphite", token: "onDark", role: "Text on dark grounds", pairText: "graphite", size: "body" },
    ],
    scale: [
      ["Display", "Inter Tight 800", "96 / 0.92", "clamp(48px, 9vw, 96px), tracking .03em negative"],
      ["H1", "Inter Tight 800", "64 / 0.95", "clamp(40px, 6vw, 64px)"],
      ["H2", "Inter Tight 700", "36 / 1.05", "36px"],
      ["Body", "Inter 400", "17 / 1.55", "17px"],
      ["Small", "Inter 500", "14 / 1.5", "14px"],
      ["Mono", "JetBrains Mono 500", "12 / 1.4", "12px, uppercase, tracking .08em"],
    ],
    rules: [
      ["Spacing unit", "8px. Sections 120px, blocks 64px, card padding 32px, gaps 16px"],
      ["Radius", "0. Every corner is square, including buttons and fields"],
      ["Shadow", "None. Contrast does the work"],
      ["Rules", "1px Line on white, 1px Graphite 2 on dark. Section heads carry a mono index like 01, 02"],
    ],
    shots: [
      "A laptop and a phone on matte black, screens white and blank, one hard spotlight from the upper left.",
      "A single keyboard key, extreme close up, black on black, the edge lit by one thin line of light.",
      "A printed scope on a black table, the paper very white, the shadow of the hand that set it down.",
      "A monitor on a black wall showing a plain grid of white squares, the room otherwise unlit.",
      "A founder in a black shirt against black, lit from one side, looking at a screen out of frame.",
      "A phone standing upright under a spotlight, a single acid green cable running out of frame.",
    ],
    sample: { prompt: "Laptop and phone on matte black, white blank screens, one hard spotlight, one thin acid green light line." },
    voice: "Signal speaks in headlines. Big statements, short lines, numbers set in mono, and one bright button that says what to do next. It is sure of itself and does not explain twice.",
    never: [
      { title: "Never two accent jobs on one screen", note: "Acid is the signal. Use it twice and it is decoration." },
      { title: "Never a rounded corner", note: "The whole system is square. One radius breaks it." },
      { title: "Never the monogram outlined", note: "It is a solid block with the letters cut out. An outline is a different mark." },
    ],
    monogram: cMonogram,
    heroArt: (m) => `<div class="signal-block">${m}</div>`,
    wm: { fam: "'Inter Tight', sans-serif", weight: 800, spacing: "-0.02em", text: "Ellington Studio", size: 30, width: 250 },
    show: { head: "'Inter Tight', sans-serif", text: "'Inter', sans-serif", weight: 800, tracking: "-0.03em", primaryBg: "#C6F135", primaryFg: "#0B0B0B", second: "#141414" },
    icon: { bg: "#141414", fg: "#0B0B0B", second: "#F5F5F2", block: true },
    neverDemos: ["twoaccent", "round", "outline"],
  },

  d: {
    slug: "d-maison",
    letter: "D",
    name: "Maison",
    title: "Option D, Maison",
    feeling: "Rich, confident, theatrical, storied, precise",
    says: "The Studio is a house with standards. Every project is composed, not assembled, and the price is part of the composition.",
    risk: "Jewel tones and a high contrast serif can tip into fashion. If the layout loosens or a gold ground creeps in, it stops being a software studio and starts being a boutique.",
    furthest: "The Quadrant Company. No orange, no Helvetica, no boxed mark, nothing corporate.",
    recommend: false,
    reason: "The most memorable of the five and the best for a founder led brand, but the theatre asks the client to buy taste before they buy a delivery date.",
    originality: "Not borrowed: no interlocking letters, no double letter monogram, no stripe of any color pair, no all over monogram print, no flora, no house tagline, no gold ground. Built instead: an emerald and burgundy pair on warm off white, a Bodoni serif with Instrument Sans, a drawn serif E and S with a lozenge between them, and a hairline divider made from the E stems and the S curve.",
    fonts: {
      url: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400&family=Instrument+Sans:wght@400;500;600&display=swap",
      faces: [
        { name: "Bodoni Moda", role: "Display, headings, the tagline", weights: "400, 600, italic 400", source: "https://fonts.google.com/specimen/Bodoni+Moda", license: "SIL Open Font License 1.1" },
        { name: "Instrument Sans", role: "Text, labels, buttons, forms", weights: "400, 500, 600", source: "https://fonts.google.com/specimen/Instrument+Sans", license: "SIL Open Font License 1.1" },
      ],
    },
    tokens: {
      ground: "#F7F2EA", surface: "#FFFBF5", emerald: "#0E4D3A", emerald2: "#0A3A2C", burgundy: "#6B1F2A", ink: "#221C1C", ink2: "#4A4141", mute: "#6E6560",
      line: "#E2D8CA", gold: "#B08D57", success: "#2E6B3F", danger: "#9B2335", onDark: "#F7F2EA", onDarkMute: "#C9C0B3",
    },
    swatches: [
      { name: "Off White", token: "ground", role: "Ground, warm paper", pairText: "ink", size: "body" },
      { name: "Card", token: "surface", role: "Card surface", pairText: "ink", size: "body" },
      { name: "Emerald", token: "emerald", role: "First jewel. Hero cover, footer, primary button", pairText: "onDark", size: "body" },
      { name: "Deep Emerald", token: "emerald2", role: "Raised panel on Emerald", pairText: "onDark", size: "body" },
      { name: "Burgundy", token: "burgundy", role: "Second jewel. Labels, the lozenge, links", pairText: "ground", size: "body" },
      { name: "Ink", token: "ink", role: "Headings and body text", pairText: "ground", size: "body" },
      { name: "Ink 2", token: "ink2", role: "Secondary text", pairText: "ground", size: "body" },
      { name: "Mute", token: "mute", role: "Captions", pairText: "ground", size: "body" },
      { name: "Gold Hairline", token: "gold", role: "Hairline rules and one foil moment only. Never a ground, never text", pairText: "emerald2", size: "large" },
      { name: "Success", token: "success", role: "Success state", pairText: "surface", size: "body", textOnIt: true },
      { name: "Danger", token: "danger", role: "Danger state, form errors", pairText: "surface", size: "body", textOnIt: true },
      { name: "Off White on Emerald", token: "onDark", role: "Text on dark grounds", pairText: "emerald", size: "body" },
    ],
    scale: [
      ["Display", "Bodoni Moda 400, optical size 96", "84 / 0.95", "clamp(48px, 7.5vw, 84px), tight leading"],
      ["H1", "Bodoni Moda 400", "64 / 1.0", "clamp(40px, 5.6vw, 64px)"],
      ["H2", "Bodoni Moda 600", "38 / 1.1", "38px"],
      ["Body", "Instrument Sans 400", "17 / 1.6", "17px"],
      ["Small", "Instrument Sans 600", "12 / 1.5", "12px, uppercase, tracking .2em"],
      ["Mono", "none", "", "No mono. Figures set in Bodoni Moda"],
    ],
    rules: [
      ["Spacing unit", "8px. Sections 120px, blocks 64px, card padding 36px, margins generous"],
      ["Radius", "0. Every corner is cut square"],
      ["Shadow", "One deep shadow on the cover image only: 0 40px 80px rgba(14,77,58,.25)"],
      ["Rules", "1px Gold hairlines. The ornament row sits on a hairline as a section divider, once per page"],
    ],
    shots: [
      "An oxblood leather notebook closed on an emerald lacquered desk, one hard light from the right, one long shadow.",
      "A black fountain pen laid diagonally on burgundy velvet, the nib catching the light, everything else soft.",
      "A stack of three warm white cards on a lacquered surface, the top card blank, a deep green wall behind.",
      "A brass desk clock face down on velvet, the shadow doing the work, no reflection of the room.",
      "A laptop closed on a marble ledge, a single leaf of paper beneath its edge, the backdrop a burgundy curtain.",
      "A leather portfolio open to a blank page, shot from above, the lacquer around it reflecting one light.",
    ],
    sample: { prompt: "Emerald lacquered desk, burgundy velvet backdrop, oxblood notebook, black fountain pen, one dramatic shadow." },
    voice: "Maison speaks in complete, composed sentences and pauses between them. A large serif line, a hairline, then the detail in a small sans. It never hurries, and it never repeats itself.",
    never: [
      { title: "Never gold as a ground", note: "Gold on cream is Bar Ellington. Gold here is a hairline, nothing more." },
      { title: "Never Cormorant Garamond", note: "Two siblings own it. Bodoni Moda is the serif here." },
      { title: "Never the ornament all over", note: "One divider row per page. Tiled, it reads as a monogram print, which is someone else's idea." },
    ],
    monogram: dMonogram,
    ornament: dOrnamentTile,
    heroArt: (m) => `<figure class="cover"><img src="assets/sample.jpg" alt="" width="1536" height="1024"><span class="cover-mark">${m}</span></figure>`,
    wm: { fam: "'Bodoni Moda', serif", weight: 400, spacing: "0.3em", text: "Ellington Studio", size: 24, width: 360, smallCaps: true },
    show: { head: "'Bodoni Moda', serif", text: "'Instrument Sans', sans-serif", weight: 400, tracking: "-0.01em", primaryBg: "#0E4D3A", primaryFg: "#F7F2EA", second: "#B08D57" },
    icon: { bg: "#0E4D3A", fg: "#F7F2EA", second: "#B08D57" },
    neverDemos: ["goldground", "cg", "allover"],
  },

  e: {
    slug: "e-coastline",
    letter: "E",
    name: "Coastline",
    title: "Option E, Coastline",
    feeling: "Calm, sun washed, open, unhurried, kind",
    says: "The Studio is easy to work with. The process is as clear as the price, and nothing about it will stress you.",
    risk: "Low saturation and soft corners can read as wellness or lifestyle rather than engineering. It needs the figures and the dates to stay crisp or it drifts into a mood board.",
    furthest: "SwampCast and The Quadrant Company together. No bright color, no black, no hard edge, no broadcast energy.",
    recommend: false,
    reason: "The most welcoming of the five and the clearest break from the current site, but the calm hides the precision that is the Studio's actual promise.",
    originality: "Not borrowed: no mountain or wave device, no stitched or embroidered feel, no athletic or performance vocabulary, no product photography of clothing or bodies, no tagline about movement. Built instead: a warm white and sand ground with sage, eucalyptus, sea glass and a muted ocean blue, one humanist sans at two weights, a rounded E and S with one horizon curve beneath them, and a lowercase wordmark.",
    fonts: {
      url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&display=swap",
      faces: [
        { name: "Plus Jakarta Sans", role: "Everything. Headings at 600, text at 400", weights: "400, 600", source: "https://fonts.google.com/specimen/Plus+Jakarta+Sans", license: "SIL Open Font License 1.1" },
      ],
    },
    tokens: {
      ground: "#FBF8F3", sand: "#F1EBE1", charcoal: "#3A3935", ink: "#3A3935", ink2: "#5B5953", mute: "#6B6860",
      line: "#E4DDD1", sage: "#8A9A7B", eucalyptus: "#4F6A5B", seaglass: "#C5DCD5", driftwood: "#C8B79F", ocean: "#4A6B7C",
      success: "#47754F", danger: "#A6524A", onDark: "#FBF8F3", onDarkMute: "#C9C4BA",
    },
    swatches: [
      { name: "Warm White", token: "ground", role: "Ground", pairText: "ink", size: "body" },
      { name: "Sand", token: "sand", role: "Soft panels, cards, form fields", pairText: "ink", size: "body" },
      { name: "Charcoal", token: "charcoal", role: "The darkest ink. Text, footer ground. Never pure black", pairText: "ground", size: "body" },
      { name: "Ink 2", token: "ink2", role: "Secondary text", pairText: "ground", size: "body" },
      { name: "Mute", token: "mute", role: "Captions and labels", pairText: "ground", size: "body" },
      { name: "Ocean", token: "ocean", role: "Primary button, links, the horizon curve", pairText: "ground", size: "body", textOnIt: true },
      { name: "Eucalyptus", token: "eucalyptus", role: "Labels, step numbers, secondary accent", pairText: "ground", size: "body" },
      { name: "Sage", token: "sage", role: "Large text and rules on Sand only", pairText: "charcoal", size: "large" },
      { name: "Sea Glass", token: "seaglass", role: "Tint panels behind Charcoal text", pairText: "charcoal", size: "body" },
      { name: "Driftwood", token: "driftwood", role: "Tags and hairline accents beside Charcoal", pairText: "charcoal", size: "body" },
      { name: "Success", token: "success", role: "Success state", pairText: "ground", size: "body", textOnIt: true },
      { name: "Danger", token: "danger", role: "Danger state, form errors", pairText: "ground", size: "body", textOnIt: true },
      { name: "Warm White on Charcoal", token: "onDark", role: "Text on the footer", pairText: "charcoal", size: "body" },
    ],
    scale: [
      ["Display", "Plus Jakarta Sans 600", "60 / 1.08", "clamp(36px, 4.8vw, 60px), tracking .02em negative"],
      ["H1", "Plus Jakarta Sans 600", "52 / 1.1", "clamp(34px, 4.2vw, 52px)"],
      ["H2", "Plus Jakarta Sans 600", "32 / 1.2", "32px"],
      ["Body", "Plus Jakarta Sans 400", "17 / 1.75", "17px, wide line height, airy paragraphs"],
      ["Small", "Plus Jakarta Sans 600", "13 / 1.6", "13px, tracking .04em"],
      ["Mono", "none", "", "No mono. Figures set in Plus Jakarta Sans 600"],
    ],
    rules: [
      ["Spacing unit", "8px. Sections 112px, blocks 56px, card padding 32px, paragraphs max 60 characters"],
      ["Radius", "16px on cards and fields, 999px on buttons and tags"],
      ["Shadow", "Almost invisible: 0 2px 12px rgba(58,57,53,.06)"],
      ["Rules", "1px Line. Sections separate with space first, a rule second"],
    ],
    shots: [
      "A closed laptop on a pale wood porch table, morning haze, the ocean far behind and out of focus.",
      "A linen cloth, a ceramic mug and a paper notebook in soft side light, nothing glossy in the frame.",
      "A sage plant on a windowsill, the window fogged at the edges, the light warm and low.",
      "A phone face up on driftwood, the screen a plain pale page, sand in the background.",
      "A founder's hands on a keyboard at an outdoor table, sleeves pushed up, the frame cropped at the wrists.",
      "An empty chair on a porch at dawn, a laptop bag beside it, sea glass blue in the far distance.",
    ],
    sample: { prompt: "Pale wood porch table, closed laptop, linen, ceramic mug, morning haze, the Pacific out of focus, sage at the edge." },
    voice: "Coastline speaks the way a good host does. Short, warm sentences with room around them, no pressure, and the price said once and plainly. It exhales, and lets you exhale too.",
    never: [
      { title: "Never pure black", note: "The darkest ink is Charcoal. Black closes the page." },
      { title: "Never a square corner", note: "Cards at 16px, buttons at full pill. A sharp edge breaks the calm." },
      { title: "Never a glossy shadow", note: "Depth comes from Sand on Warm White, never from a drop shadow you can see." },
    ],
    monogram: eMonogram,
    heroArt: (m) => `<figure class="shore"><img src="assets/sample.jpg" alt="" width="1536" height="1024"></figure>`,
    wm: { fam: "'Plus Jakarta Sans', sans-serif", weight: 600, spacing: "-0.01em", text: "ellington studio", size: 26, width: 230 },
    show: { head: "'Plus Jakarta Sans', sans-serif", text: "'Plus Jakarta Sans', sans-serif", weight: 600, tracking: "-0.02em", primaryBg: "#4A6B7C", primaryFg: "#FBF8F3", second: "#4A6B7C" },
    icon: { bg: "#F1EBE1", fg: "#3A3935", second: "#4A6B7C" },
    neverDemos: ["black", "sharp", "glossy"],
  },
};

// Wordmark as SVG text in the option's heading face. The lockup pairs it with the monogram.
export function wordmark(opt, fg = "currentColor") {
  const w = opt.wm;
  const sc = w.smallCaps ? ' style="font-variant:small-caps"' : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.width} 40" class="wordmark wm-${opt.letter.toLowerCase()}" role="img" aria-label="Ellington Studio"><text x="0" y="29" font-family="${w.fam}" font-weight="${w.weight}" font-size="${w.size}" letter-spacing="${w.spacing}" fill="${fg}"${sc}>${w.text}</text></svg>`;
}

export function lockup(opt, fg = "currentColor", second) {
  return `<span class="lockup-inner">${opt.monogram(fg, second)}${wordmark(opt, fg)}</span>`;
}
