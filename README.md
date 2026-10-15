# Ellington Studio

The public site for Ellington Studio, a venture of Ellington Enterprises LLC. A website in a week, a working app in a month, one fixed price. Live at https://ellington-studio.vercel.app, and at https://studio.ellingtonenterprises.co once the DNS record below exists.

Plain static pages at the repo root plus two Vercel serverless functions. No framework, no build step for the pages. Node 24 for the functions.

## Pages

| Path | File | What it is |
|---|---|---|
| `/` | `index.html` | The home page: hero, three packages, how it works, portfolio, who it is for, founder, FAQ |
| `/intake.html` | `intake.html` | The 10 minute intake form |
| `/privacy.html` | `privacy.html` | What the site collects, the server logs, the analytics, the payments |
| any missing path | `404.html` | One line and a link home |
| `/brand-options/` | `brand-options/` | Five candidate brand kits and site designs, additive, awaiting Ellington's pick |
| `/api/config` | `api/config.ts` | The Stripe payment links, read from environment variables at request time |
| `/og/studio.png` | `og/studio.png` | The Open Graph card every page carries: the three packages and prices |
| `/sitemap.xml`, `/robots.txt` | the files | The sitemap lists the three public pages; robots keeps `/api/` and `/brand-options/` out |

Every page carries a title, a description and the Open Graph tags, so a pasted link shows a card. Every page loads `/_vercel/insights/script.js`, Vercel Web Analytics, which counts visits without cookies. The Privacy page says so.

## How to change a price

Prices live in exactly three places. Change all three in one commit.

1. `index.html`: the three price strings inside the package cards (`$2,500`, `$7,500`, `$250`) and the same figures inside the hero paragraph and the FAQ answer about delivery.
2. `intake.html`: the package radio values (`Site in a Week, $2,500` and so on), the budget radio values, and the `quoteFor()` function in the script that prints the quote.
3. The price sheet PDF in OneDrive at `02 Ellington Studio 2026.09.24/02 Price Sheet/`, which Claude regenerates from the markdown source in `source/`.

4. `og/studio.png` reads the prices from `index.html`. Run `npm run og` after the price change so the card matches.

Then run `npm test` and deploy.

## Payment buttons

Each package card on `index.html` carries a secondary button under the intake call to action. The page asks `/api/config` on load and shows a button only when its link exists. Balance links are sent by hand after delivery and never go on the site.

| Variable | Button | Card |
|---|---|---|
| `STRIPE_LINK_SITE_DEPOSIT` | Pay the deposit, $1,250 | Site in a Week |
| `STRIPE_LINK_APP_DEPOSIT` | Pay the deposit, $3,750 | App in a Month |
| `STRIPE_LINK_CARE_PLAN` | Subscribe, $250 a month | Care Plan |

All three exist on the Vercel project as empty strings. Paste a Stripe payment link into one and the button appears on the next deployment: Vercel reads environment variables when a deployment is created, so after setting a value run `npx vercel redeploy <latest production url> --scope quad-co` or press Redeploy in the dashboard. A value that is not an `https://` address is treated as empty.

## How the intake flows

1. The client fills `intake.html`. The page builds a plain text summary and a quote in the browser.
2. The page POSTs JSON `{summary, name, email, package, quote, company}` to `/api/intake`. The `company` field is a hidden honeypot. A real person never fills it.
3. `api/intake.ts` checks the rate limit (5 requests a minute per IP, in memory), validates the name and email, then:
   - creates a row in the Notion database **Studio Intake** (ids in `lib/notionIds.ts`) with Status set to New,
   - emails the Studio at hello@ellingtonenterprises.co with subject `Studio intake: <name>, <package>` and the name, package and summary as the body,
   - emails the client a confirmation: "Received. The scope and price come within 1 business day." with the summary below.
4. The API returns 200 only when the Notion row was created. The emails are best effort after that: an empty `RESEND_API_KEY` skips them, and a Resend error never fails the form.
5. If the API returns anything but 200, or is unreachable, the page opens a `mailto:` link to the Studio with the whole summary in the body. Until the API keys exist the API returns 503 on purpose and the fallback is the designed path.

The summary body is never logged.

## Environment variables

Set on the Vercel project `ellington-studio`.

| Name | Who sets it | What it does |
|---|---|---|
| `NOTION_API_KEY` | Ellington, in the Vercel dashboard | Internal integration token with access to the Ellington Studio page. Until it exists `/api/intake` returns 503 and the page falls back to mailto |
| `RESEND_API_KEY` | Ellington, in the Vercel dashboard | Resend API key. Empty means no email is sent and the form still succeeds |
| `STRIPE_LINK_SITE_DEPOSIT`, `STRIPE_LINK_APP_DEPOSIT`, `STRIPE_LINK_CARE_PLAN` | Ellington, when Stripe activates | Stripe payment links. Present as empty strings today |
| `STUDIO_NOTIFY_EMAIL` | Optional | Overrides the notification address. The default is hello@ellingtonenterprises.co |
| `STUDIO_FROM_EMAIL` | Optional | Sender address. Defaults to `Ellington Studio <studio@thequadco.ai>`, the domain verified in Resend today. Set it once ellingtonenterprises.co is verified in Resend |

Never commit a key. `.env*` files are ignored.

## Deploy path

`main` is production. The Vercel project is `ellington-studio` in the `quad-co` team. The GitHub app is not connected, so a merge to `main` does not deploy on its own. After merging, deploy from `main` by CLI:

```bash
npx vercel deploy --prod --yes --scope quad-co
```

A plain `npx vercel deploy --scope quad-co` makes a preview. To see the payment buttons on a preview, pass test links: `npx vercel deploy --scope quad-co -e STRIPE_LINK_SITE_DEPOSIT=https://buy.stripe.com/test_x` and so on.

```bash
npm test        # the copy check on every HTML page, then the intake handler with the network stubbed
npm run verify  # Playwright: no horizontal scroll, links resolve, intake validates and falls back to mailto
npm run og      # rerender og/studio.png from the prices in index.html
```

## The studio.ellingtonenterprises.co domain

The domain is attached to the project and verified. It resolves once this record exists at Spaceship, where the DNS for ellingtonenterprises.co lives:

| Type | Name | Value |
|---|---|---|
| CNAME | `studio` | `c6c611b3969b15f1.vercel-dns-016.com` |

When `curl -sI https://studio.ellingtonenterprises.co` answers 200, finish the move in one commit:

1. Replace `https://ellington-studio.vercel.app` with `https://studio.ellingtonenterprises.co` in `index.html`, `intake.html`, `privacy.html`, `404.html`, `sitemap.xml` and `robots.txt` (the canonical, `og:url` and `og:image` addresses).
2. Point the old address at the new one, 308, with no code change: `PATCH https://api.vercel.com/v9/projects/prj_xk7EglNhmHv5Dmm10Hn0Wngmldn7/domains/ellington-studio.vercel.app?teamId=team_bdqVtOQCoubfUROsqWEV00ss` with body `{"redirect":"studio.ellingtonenterprises.co","redirectStatusCode":308}`.
3. Deploy, then check that the old address redirects and the card still renders from the new one.

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
