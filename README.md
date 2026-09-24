# Ellington Studio

The public site for Ellington Studio, a venture of Ellington Enterprises LLC. A website in a week, a working app in a month, one fixed price. Live at https://ellington-studio.vercel.app

Plain static pages at the repo root plus one Vercel serverless function. No framework, no build step for the pages. Node 20 for the function.

## Pages

| Path | File | What it is |
|---|---|---|
| `/` | `index.html` | The home page: hero, three packages, how it works, portfolio, who it is for, founder, FAQ |
| `/intake.html` | `intake.html` | The 10 minute intake form |
| any missing path | `404.html` | One line and a link home |
| `/brand-options/` | `brand-options/` | Three candidate brand kits and site designs, additive, awaiting Ellington's pick |

## How to change a price

Prices live in exactly three places. Change all three in one commit.

1. `index.html`: the three price strings inside the package cards (`$2,500`, `$7,500`, `$250`) and the same figures inside the hero paragraph and the FAQ answer about delivery.
2. `intake.html`: the package radio values (`Site in a Week, $2,500` and so on), the budget radio values, and the `quoteFor()` function in the script that prints the quote.
3. The price sheet PDF in OneDrive at `02 Ellington Studio 2026.09.24/02 Price Sheet/`, which Claude regenerates from the markdown source in `source/`.

Then run `npm test` and deploy.

## How the intake flows

1. The client fills `intake.html`. The page builds a plain text summary and a quote in the browser.
2. The page POSTs JSON `{summary, name, email, package, quote, company}` to `/api/intake`. The `company` field is a hidden honeypot. A real person never fills it.
3. `api/intake.ts` checks the rate limit (5 requests a minute per IP, in memory), validates the name and email, then:
   - creates a row in the Notion database **Studio Intake** (ids in `lib/notionIds.ts`) with Status set to New,
   - emails the Studio at `STUDIO_NOTIFY_EMAIL` with subject `Studio intake: <name>` and the summary as the body,
   - emails the client a confirmation: "Received. The scope and price come within 1 business day." with the summary below.
4. The API returns 200 only when the Notion row was created. The emails are best effort after that.
5. If the API returns anything but 200, or is unreachable, the page opens a `mailto:` link to the Studio with the whole summary in the body. Until the API keys exist the API returns 503 on purpose and the fallback is the designed path.

The summary body is never logged.

## Environment variables

Set on the Vercel project `ellington-studio`.

| Name | Who sets it | What it does |
|---|---|---|
| `NOTION_API_KEY` | Ellington, in the Vercel dashboard | Internal integration token with access to the Ellington Studio page |
| `RESEND_API_KEY` | Ellington, in the Vercel dashboard | Resend API key for the verified sending domain |
| `STUDIO_NOTIFY_EMAIL` | Set to `bigatorej@gmail.com` | Where intake notifications go |
| `STUDIO_FROM_EMAIL` | Optional | Sender address. Defaults to `Ellington Studio <studio@thequadco.ai>`, the domain verified in Resend today |

Never commit a key. `.env*` files are ignored.

## Deploy path

`main` is production. Every merge to `main` deploys to https://ellington-studio.vercel.app through the Vercel GitHub integration. Preview deploys come from branches.

```bash
npm test        # the copy check on every HTML page
npm run verify  # Playwright: no horizontal scroll, links resolve, intake validates and falls back to mailto
```

## Writing rule

`scripts/check-copy.mjs` fails the build if visible text on any page carries a hyphen, an en dash or an em dash, or writes a date as a digit before a month name. Dates read "September 24th, 2026". Tags, attributes, scripts, code, URLs and file names are exempt.

## Brand options

`brand-options/` holds five complete brand directions built on September 24th, 2026 so Ellington can pick one by looking: A Blueprint, B Greenhouse, C Signal, D Maison, E Coastline. Each folder has `theme.css` (tokens in one block at the top), `index.html`, `intake.html`, `kit.html`, the kit PDF and `assets/` with icons, screens and the sample photograph. The chooser is `brand-options/index.html`.

All nine pages come from one shared structure. Do not edit the generated HTML by hand. Change the source and rebuild:

```bash
npm run brand:build    # scripts/brand-options: options.mjs (data and marks), home.tmpl.html, kit.mjs, chooser.mjs
npm run brand:render   # icons, full page screens and kit PDFs through Playwright
npm run brand:verify   # every option page at 390 and 1440, contrast ratios, chooser buttons
```

The live `/` and `/intake.html` do not change until Ellington rules.
