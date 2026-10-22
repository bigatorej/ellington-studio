# Rounds at Home. Labs playground

One shared record for a parent's care. Siblings stop coordinating by group text. One voice note after the doctor becomes the log, the meds list and the task list.

This folder is a complete single file web app: `index.html`. No build step, no framework, no server, no keys, no network. Open the file and use it. It is the same file Ellington Studio deploys at `/labs/rounds-at-home/`.

## The views

| Tab | What it does |
|---|---|
| Today | Parent header with the on duty chip. Meds due today grouped Morning, Evening, Bedtime, each marked given (who and when) or Missed after the slot passes, with Undo. Refills due inside 7 days in Amber. Up next appointments, open tasks with Done, questions for the doctor, the three newest rounds, and the big Coral Add a round button. |
| Rounds | The capture sheet (Record with live transcript, or Type instead), the review card that shows every extracted item before anything is written, and the log, newest first, with author, date, chips per thing produced, filters by author and type, and search. |
| Meds | Active meds as cards. Tap one for the full change history with reasons. Change a dose (reason required), stop a med (reason required, moves to Stopped), restart, set a refill date, add a med. Share the list copies plain text to the clipboard and shows it in a box. |
| Papers | Documents with date and type. Add by photo or file (stored as a data URL up to 1.5 MB, name only above that). Open a paper for the preview and Explain this. The seeded discharge summary has a pre written four part reading, 3 tasks with one tap Add, 2 questions, and a glossary. A new paper gets the honest template plus a Type the key lines box that runs the same parser. Insurance and legal cards below. |
| Family | Members with role and phone (on file). On duty rotation with a Swap button. Invite link generator. Visit brief: a printable one page with current meds, weight and blood pressure sparklines, changes since the last visit, open questions and the family contact for the day. Security card. |
| Settings | Reached from the gear in the top bar. Parent fields, household, who you are, export JSON, import JSON, Reset to seed, How this playground works, and the Ellington Enterprises line. |

## How state works

- One JSON document in `localStorage` under the key `labs.rounds-at-home.v1`.
- Every read and write is wrapped in try and catch. If storage is blocked the app runs in memory for the session.
- The current tab is persisted. Sheets, filters and forms are in memory only.
- Dates are stored as ISO strings and shown through one `fmtDate()` helper as "October 21st, 2026".
- Doses given are keyed by day, med and slot, with who gave it and when.
- Reset to seed replaces the whole document with the fictional Hale family record.

## What is simulated, and what replaces it

| Playground spot | How it works here | Real service in the app |
|---|---|---|
| Record button and live transcript | The browser's `webkitSpeechRecognition` when present. Otherwise the button reads Type instead and focuses the text box. | Claude speech to text on the server, with the same review card. |
| `parseRound(text)` | Deterministic rules on one sentence at a time: vitals patterns, med change verbs plus a known med name, task openers, visit words plus a date phrase, question marks. Comments in the source name each rule. | Claude reads the note and returns the same item shapes with higher recall. |
| Explain this on a paper | The seeded discharge summary carries a pre written explanation. New papers show the honest template and a Type the key lines box that reuses the parser. | Claude reads the photo or PDF and writes the four parts, tasks, questions and glossary. |
| Invite link | A random code under `rounds.ellingtonenterprises.co/join/`. | Real accounts, real invites, sync between family members. |

The chip marked Playground appears at each of these spots in the UI.

## Seed

All fictional. Dorothy Hale, 79, and her family Jordan, Maya, Theo and the aide Priya. Five meds with history, four appointments including a recurring physical therapy slot, four tasks, eight rounds, 14 days of weight, five blood pressure and six blood sugar readings, one discharge summary, three open questions. No real phone numbers, addresses, emails or door codes anywhere. Phones and policy numbers read "on file".

## How to run the checks

1. Copy rule: `node /home/claude/ellington-studio/scripts/check-copy.mjs /home/claude/ellington-studio/labs/rounds-at-home/index.html`
2. Serve the folder: `cd /home/claude/ellington-studio/labs/rounds-at-home && python3 -m http.server 8765 --bind 127.0.0.1`
3. Acceptance run (Python Playwright, Chromium at `/opt/pw-browsers`): `python3 /tmp/claude-0/-home-claude/4d02d115-62b7-5012-83cd-c1bc9a5919c7/scratchpad/labs/test-rounds.py http://127.0.0.1:8765/`

The run checks the seed, dose persistence across reload, the magic moment (5 items, commit, each lands in its place, follow up date 14 days from today), the paper explanation and task add, the family swap and the brief with both sparklines, Reset to seed, no page errors, no horizontal scroll at 390 and 1440, no dashes or ISO dates in any visible text, and writes the screenshots into the deliverable folder in OneDrive (`15 Ellington Labs 2026.10.21/playgrounds/`).
