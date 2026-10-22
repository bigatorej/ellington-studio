# Keep. Playground

Keep remembers the birthdays, anniversaries and special occasions of the people who matter to you. It reminds you early enough to do something about it, and it drafts the message so you never send a late "happy birthday". Keep is a friend who remembers, not a CRM.

This folder is the playground build: one HTML file, no server, no keys, no network. It runs offline on a phone or in a centered phone shell on a desktop, and it is the file deployed at `/labs/keep/` on the Ellington Studio site.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app. Inline CSS and JavaScript, Google Fonts link only. |
| the deliverable folder in OneDrive (`15 Ellington Labs 2026.10.21/playgrounds/`) | Screenshots from the acceptance run at 390 wide, plus one at 1440. |
| `README.md` | This file. |

## The views

| Tab | What it shows | What you can do |
|---|---|---|
| Up next | Today first, then the next 60 days grouped by week, then by month. Each row has the person, the occasion ("Birthday, turns 41"), the date in words, days away, and the current ladder step as a chip. | Tap a row for the occasion sheet: the four step ladder with done marks, the gift picked for this year, the drafted message with Warm, Funny and Short tones, Copy, Mark sent, Call and Text. |
| People | Everyone, alphabetical, with relationship, the next occasion, and a Rose dot when you are past your cadence. | Open a person to add, edit or remove occasions, add notes, manage gift ideas, log "We talked today", and edit details. Add a person from the top bar. |
| Gifts | This season: upcoming occasions with the picked gift, budget total and status. Ideas bank filtered by price band. Do not repeat: what you already gave the people coming up. | Pick a gift for an occasion, move an idea from idea to bought to given. Given gifts move into history with the year. |
| Slipping | People past their cadence, sorted by how far past, each with a reason to reach out drawn from their notes. | We talked, or Draft a note for no reason. |
| Settings | Your name, the four lead times, reminders on this device, contacts import, calendar export, JSON export and import, Reset to seed, and how the playground works. | |

## The reminder ladder

Every occasion climbs the same four steps. The lead times are in Settings and default to:

| Step | Default lead | Meaning |
|---|---|---|
| Plan it | 14 days before | Pick a gift or make the plan. |
| Get it | 5 days before | Order it, ship it, or buy the card. |
| Write it | 1 day before | Draft the message and pick the time. |
| Send it | The day | The message is ready. Copy it, send it, mark it sent. |

How the current step is chosen:

- The window step is the step with the smallest lead that is still at or past today. At 8 days out with the defaults that is Plan it. At 3 days out it is Get it.
- The current step is the first step from the window on that is not done. If Plan it and Get it are done at 3 days out, the chip says Write it.
- Steps before the window that were never done show as Missed in the ladder. The chip is not pulled back by them.
- Beyond the first lead the chip says Coming up.
- When you add a person whose occasion is already inside the ladder, the steps that already passed are recorded as Skipped so you start on the step you can still do. Each skipped step shows that honestly and can be reopened.

Reminders are computed from the data every time the app renders. They are never stored, so changing a lead time changes every reminder at once. Only the done marks are stored, under the key `personId:occasionId:year:step`. Snooze stores a date under the same key and hides the chip until tomorrow. Mark sent marks every open step done and sets last contact to today, which removes the item from Up next.

Browser notifications: "Turn on reminders on this device" asks the browser for permission. When granted, each time the app opens it fires one notification per reminder that is due today and not done. This only works while Keep is open. The real app sends reminders to your phone.

## How state works

- One JSON document in `localStorage` under `labs.keep.v1`.
- Every read and write is wrapped in try and catch. If storage is blocked, the app runs in memory and still works.
- The seed is built at runtime relative to today's date, so the demo works on any day: two birthdays at today plus 3 and today plus 8, a custom "First day at the new job" at today plus 2, a godson's birthday party at today plus 12 and his birthday at today plus 18, a neighbors' anniversary at today plus 21, and Thanksgiving fixed at November 26th, 2026 as a shared item for Mom and Dad with the plan "Call Mom and Dad". Birth years are fixed so ages compute.
- Reset to seed in Settings rebuilds the seed. It asks for a second tap before it does.
- The current tab is persisted.

The people, phone numbers, notes and gifts are all fictional. Phone numbers use the reserved 555 range.

## What is simulated, and what replaces it

| Spot in the UI | Playground behaviour | Real service in the shipped app |
|---|---|---|
| Your message (occasion sheet) and Draft a note (Slipping) | `draftMessage(person, occasion, tone)`: a template by relationship group, occasion kind and tone, plus one specific line from `specific(person, 'line')` which reads the newest note that matches a rule ("Loves Dodgers and dark chocolate" becomes "Hope there is dark chocolate involved."), else gift history. Marked with a Playground chip. | Claude, given the person's notes, history and channel, writes the draft and the three tones. |
| Reason to reach out (Slipping) | `specific(person, 'reason')`: the same rules phrased as a prompt to you ("She just started at the bakery on Grand."). Playground chip. | Claude reads the notes and recent history and proposes the reason. |
| Reminders on this device | The browser Notification API, fired while the page is open. | Server side scheduling with push notifications to the phone. |
| Contacts import | A real `.vcf` parser in the page. Nothing simulated. | The same parser, plus a direct contacts permission on iOS and Android. |
| Accounts, sync, sharing | None. One device only. | Accounts, sync across devices, shared lists with a partner. |

## Formats handled

### vCard import (`.vcf`)

- Unfolds continuation lines, handles `\r\n` and `\n`, versions 3.0 and 4.0, and `item1.` prefixes.
- `FN` for the name, with `N` as the fallback.
- `BDAY` in three forms: `19850314`, `1985-03-14` (also with a `VALUE=date` parameter) and `--0314` or `--03-14` for a birthday with no year. Apple's placeholder year 1604 is read as no year.
- `TEL`, first number only, digits kept.
- `X-ANNIVERSARY` and `ANNIVERSARY`, same date forms.
- A preview table lets you add all or pick. Imported people arrive as Friend, quarterly cadence, no last contact.

### Calendar export (`.ics`)

- One `VEVENT` per occasion. Birthdays, anniversaries and yearly custom occasions carry `RRULE:FREQ=YEARLY` from their next occurrence. One time occasions and holidays are single events.
- Each event carries a `VALARM` with `TRIGGER:-P14D`, where 14 is your Plan it lead time.
- Lines are folded at 73 characters. Text is escaped per RFC 5545.

### JSON backup

Export writes the whole state document. Import accepts a file with a `people` array, normalizes it, and replaces the current state.

## How to run the checks

Copy rule (no hyphen, en dash or em dash in visible text, no digit before a month name):

```
node /home/claude/ellington-studio/scripts/check-copy.mjs /home/claude/ellington-studio/labs/keep/index.html
```

Acceptance run (Playwright for Python, Chromium in `/opt/pw-browsers`). It serves this folder over a local http server on a free port, drives the nine acceptance tests from the spec, checks for zero page errors and zero horizontal scroll at 390 and 1440, confirms persistence across reload and Reset to seed, and writes the screenshots into the deliverable folder in OneDrive (`15 Ellington Labs 2026.10.21/playgrounds/`):

```
python3 /tmp/claude-0/-home-claude/4d02d115-62b7-5012-83cd-c1bc9a5919c7/scratchpad/labs/test-keep.py
```

The sandbox cannot reach Google Fonts, so the test serves the same DM Sans and DM Serif Display files from a local folder through a Playwright route. The app itself still loads from Google Fonts and falls back to system fonts when offline.
