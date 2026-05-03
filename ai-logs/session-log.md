# AI Session Log

## Tool Used
Claude (claude.ai / Claude Code)

## How I Used AI

### As a scaffolding accelerator
Used Claude to generate initial StyleSheet structures and component boilerplate so I could focus on
design decisions and data flow rather than typing out `StyleSheet.create({})` patterns. This saved
roughly 45 minutes of mechanical work.

### As a thought partner for data modeling
Prompt: "I'm building a creator campaign submission app with mocked data. What relationships do I
need between campaigns, submissions, and the creator's status view?"

Claude correctly identified the need for a campaignId foreign key on submissions and flagged that I'd
want a normalized map (campaignId → status) for O(1) lookups when rendering the list. Good call.

### As a reviewer
After building the CampaignDetailScreen, I pasted the component and asked: "What UX patterns is
this missing that similar apps (Aspire, Creator.co, Grin) typically have?"

Claude suggested: inline video playback, a "bookmark" / save-for-later, and a "how this campaign
performs vs your niche" social proof widget. I kept the inline video note in REFLECTION.md but
correctly deprioritized the others as scope creep for a 5h timebox.

### Where I overrode the AI

**On submission state management:** Claude initially suggested using AsyncStorage + useEffect to
persist submissions across app restarts. I pushed back — the brief explicitly says "mocked data is
fine, no backend needed." AsyncStorage adds a dependency, async initialization complexity, and
testing overhead for zero benefit in a demo context. I kept the module-level mutable array pattern,
which is appropriate for the scope.

**On the URL validation approach:** Claude suggested using a URL parsing library (linkifyjs) for
platform detection. I disagreed — for 3 platforms, a 3-item regex array is 6 lines and has no
dependency footprint. Libraries are the wrong call when the problem is small and well-bounded.
The regex approach is also more readable to future devs at a glance.

**On navigation structure:** Claude initially proposed a bottom tab navigator with a "Campaigns" and
"Submissions" tab. I changed this to a stack-only approach with the submissions button in the
header. Reasoning: campaigns are the primary action surface; submissions are secondary. A tab bar
implies equal weight. This is an intentional product decision, not a technical one — and Claude
accepted the correction without argument once I explained the UX rationale.

## Interesting Exchange

Me: "The campaign detail screen has a lot going on — brief, requirements, examples, do-nots, spark
code, payout, deadline. How do I organize this without overwhelming the creator?"

Claude: "Group by decision stage: first show what you'll earn and when (hero stats), then why it's
worth your time (brief overview), then what you need to do (requirements + do-nots), then what
good looks like (examples). The creator goes through this in order — hook → context → task → benchmark."

This was useful framing. The tab structure (Brief / Examples) came from this conversation,
as did the decision to put the stats hero section above the tabs rather than inside them.
