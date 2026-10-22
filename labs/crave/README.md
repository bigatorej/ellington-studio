# Crave, playground

Say what you are craving. Eat what fits. A Labs app from Ellington Enterprises LLC, built October 21st, 2026. One HTML file, no build, no keys, no server. Open `index.html` in any browser or visit `/labs/crave/` on the Studio site.

## What it does

| Tab | What happens |
|---|---|
| Today | The ring shows calories left today. Budget equals resting energy plus active energy from Health, less 500 for a pound a week or 250 for half a pound. Three macro bars. The Health card with resting, active, steps and workouts, plus buttons that simulate a run, a walk or a lift. "What can I eat right now" returns five foods that fit what is left and push protein. Today's log by meal. |
| Crave | Type or say a craving. Eight flavor chips. Three swaps that taste like it and fit today, each with a why line, a flavor match bar and one tap Log. Twelve super recipes, each with ingredients, method and the flavor it keeps. |
| Out | Search a restaurant or tap Near me. Pick one and the menu populates in three groups against your remaining budget and your diet: Fits now, Fits with a change, Save for a bigger day. Ten chains built in with published nutrition, rounded and marked approximate. One tap diet switcher. |
| Log | Search 140 foods and 86 restaurant items with a serving multiplier. Photo log stores a thumbnail and asks you to pick the closest food. A seven day strip of small rings. |
| Me | Profile: sex, age, height, weight, goal, pace, body type, diet, allergies, dislikes. Progress chart with the goal line and a goal date. Health simulation controls. How the numbers work, with every term defined. Export, import, Reset to seed. |

## How state works

One JSON document in `localStorage` under `labs.crave.v1`. Every read and write is in try and catch; if storage is blocked the app runs in memory. `Reset to seed` in Me restores the demo user: male, 38, 5 ft 11 in, 212 lb, goal 190, athletic build, high protein, Health connected at 7,500 steps.

## The engines (pure functions in the file, each commented)

| Function | What it does |
|---|---|
| `bmr(profile)` | Mifflin St Jeor basal metabolic rate |
| `healthToday()` | The simulated HealthKit read: steps on a day curve from 6 am to 10 pm at 0.04 kcal a step, plus logged workouts |
| `budget()` | Calories and macro targets for today, with eaten, burned and left. Body type sets the split, diet adjusts it, GLP 1 mode sets a protein floor, floors at 1,200 and 1,500 |
| `fitScore(food, budget)` | 0 to 100. Fits the remaining calories, rewards protein share and fiber, penalizes sugar on strict diets |
| `namedTarget(text)` | Finds a food the words name ("pizza", "ice cream") and makes it the craving target |
| `cravingVector(text, chips, target)` | Words and chips become eight flavor scores |
| `flavorMatch(v, food)` | Half cosine similarity, half coverage of the flavors asked for |
| `swap(text, chips)` | Three foods that taste like the craving and fit today, with a why line |
| `recommendNow()` | Five foods across categories that fit what is left |
| `restaurantFits(restaurant)` | Groups a menu by fit against the budget and the diet |

## Simulated in the playground, and the real service

| Spot | Playground | Real app |
|---|---|---|
| Health connection | Steps curve and workout buttons | HealthKit on iPhone, Health Connect on Android, inside a native Expo app |
| Craving reader | Keyword rules | Claude returning the same eight score vector and target |
| Photo log | Stores the photo, you pick the food | A vision model proposes the food |
| Restaurants | Ten built in chains, fake distances | Web search plus the restaurant's nutrition page read by Claude, Google Places for near me |
| Accounts and sync | None | Supabase Auth and Postgres |
| Money | None | $4.99 a month or $39.99 a year through RevenueCat and Stripe |

## Checks

```
node scripts/check-copy.mjs labs/crave/index.html
python3 test-crave.py   # the Playwright run, 36 checks at 390 and 1440, in the Labs deliverable folder
```

## Nutrition sources

Whole foods from USDA FoodData Central standard servings, rounded. Restaurant items from each chain's published nutrition page, rounded to the nearest 10 calories and 1 gram, marked approximate in the app with the line "Published nutrition, rounded. Check the restaurant's own page before you order."
