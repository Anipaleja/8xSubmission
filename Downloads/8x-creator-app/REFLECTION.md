# Reflection: 8x Founding Engineer Assignment

## What Was Hard

**State management without a backend.** The submission flow needs to feel real, submitted state should
persist when you navigate back, and the campaign card should immediately update to show "Pending".

- With mocked data in a flat JS file this requires a shared state approach. I used a simple module-level
array rather than spinning up Zustand, since the brief said no backend needed and the timebox was 5
hours. 
- If this were production, I'd want Zustand or Jotai here.

**Making the UI feel _not_ like a demo.** The first version of the campaign cards looked like a
settings screen. 
- Getting the visual hierarchy right with payout as the hero number, deadline with a
colour coded urgency signal, the brand brief teaser took more iteration than expected. 
- Also, light mode consumer apps need careful contrast ratios to not feel flat.

**The "examples" tab.** Embedding watchable videos in a mobile app cleanly is hard without expo-av
or a WebView. 
- I landed on a thumbnail-first pattern with a play button overlay, which is accurate to
how most UGC brief tools actually work (Aspire, Later, etc.), they link out rather than inline play.

## What Was Easy

**Navigation stack**: React Navigation's native stack is second nature. The modal presentation for
SubmitVideo felt natural immediately.

**The data model**: campaigns, submissions, the relationship between them. Designing the mock data
was actually fun and made the UI feel more real (real brand names, real brief structures, real rejection
notes like "missing the subscription offer mention").

**Platform detection in submit flow**: the URL regex approach is simple and the right call here.
No need for a link parser library.

## Process

1. Read the brief three times. Identified the 4 screens implied in the brief: list, detail, submit, status history.
2. Designed the data model (campaigns.js) first, everything else falls out of it.
3. Built screens bottom up: dumbest possible version, then iterate on design.
4. Used Claude Code to draft boilerplate StyleSheet patterns and iterate on card layouts faster.
5. Spent the last 45 min on polish: urgency colors on deadlines, the success animation, the
   validation states in the submit flow.

## Time Spent

Roughly 4.5 hours total:
- 30 min: reading, planning, data model design
- 45 min: CampaignListScreen (the most complex)
- 45 min: CampaignDetailScreen (brief + examples tabs)
- 45 min: SubmitVideoScreen (validation, success state)
- 30 min: SubmissionsScreen
- 45 min: polish, navigation, edge cases

## What I'd Do Differently

- **Shared state**: I'd probably pull SUBMISSIONS into a Zustand store so mutations (adding a new submission)
  immediately propagate to the campaign list card without needing to navigate back and forth.
- **Video playback**: Also, i'd use `expo-av` or `expo-video` to inline play the brief example videos rather
  than thumbnail + link-out. That's the highest-leverage UX improvement.
- **Haptics**: `expo-haptics` on the submit button and success state which is a tiny detail, but big impact on
  perceived quality.
- **Optimistic UI**: When submit is tapped, immediately add the submission in "pending" state rather
  than waiting for the mock API delay. Show an undo option.
- **Tests**: At minimum, a test for the `detectPlatform` URL regex and `formatDeadline` edge cases.
