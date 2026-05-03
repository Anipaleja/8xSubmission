# 8x Creator App — Submission Flow

A mobile app (Expo + React Native) for creators to discover campaigns, read briefs, and submit videos.

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Campaign List | `CampaignList` | All active campaigns with payout, deadline, spots left. Filter by All / New / Submitted. Earnings summary banner at top. |
| Campaign Detail | `CampaignDetail` | Brand hero, tabbed view: **Brief** (overview, requirements, do-nots, spark code) and **Examples** (thumbnail cards with creator notes). Bottom bar shows submit CTA or submission status. |
| Submit Video | `SubmitVideo` (modal) | URL input with live platform detection (TikTok / Instagram / YouTube). Validation, pre-submission checklist, animated success state. |
| Submissions | `Submissions` | All submissions sorted by recency. Status badges (Approved / Pending / Rejected), review notes, payout tracking. |

## Stack

- **Expo** ~51 (bare workflow compatible)
- **React Navigation** — native stack
- **React Native** 0.74
- No external state management (Zustand noted in REFLECTION.md as next step)
- No backend — all data mocked in `src/data/campaigns.js`

## Running Locally

```bash
npm install
npx expo start
```

Scan QR with Expo Go on iOS or Android.

## Project Structure

```
8x-creator-app/
├── App.js                        # Navigation container + stack config
├── app.json                      # Expo config
├── package.json
├── REFLECTION.md                 # Written reflection
├── ai-logs/
│   └── session-log.md            # AI session transcript + override notes
└── src/
    ├── data/
    │   └── campaigns.js          # Mocked campaigns + submissions
    └── screens/
        ├── CampaignListScreen.js
        ├── CampaignDetailScreen.js
        ├── SubmitVideoScreen.js
        └── SubmissionsScreen.js
```

## Key Decisions

**Flat mocked data over AsyncStorage** — the brief says no backend needed. AsyncStorage adds async
init complexity and a dependency for zero demo benefit. A module-level JS object is simpler and
clearer.

**Stack-only navigation over bottom tabs** — campaigns are primary; submissions are secondary.
A tab bar implies equal weight and clutters the chrome. The submissions button lives in the header
of the campaign list, which is semantically correct.

**Platform detection via regex** — three platforms, three patterns, six lines. No library needed.

**Tab pattern for brief/examples** — avoids a 600px scroll before you get to the example videos.
Creators who've used similar tools (Aspire, Grin) will recognize the pattern.
