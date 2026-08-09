# 0001. AI scoring for mock test Writing and Speaking — rationale

## Context

The app offers 10 full IELTS mock tests. Listening and Reading score themselves reliably because answers are exact (typed gaps and multiple choice). Writing and Speaking currently go through `estimateWritten` in `src/data/mockTest.ts`, a formula that counts words and unique word ratio only. It cannot see grammar, coherence, or relevance, so varied nonsense text scores high. Users preparing for IELTS need feedback close to the real exam's four marking criteria, or the band number misleads them.

Forces at play: solo developer, no QA team; the app already calls Google's Text to Speech API from a server function with the key held server side (see `src/lib/tts.ts`), so a second Google HTTP integration costs almost nothing to operate; the user base is small, so a free tier model fits; the result screen already saves results to Firestore with a localStorage fallback, and any new fields must not break old saved results.

The consequence of not deciding: bands for half the exam stay decorative and users trust a score that does not measure writing or speaking ability.

## Options considered

### Option 1: Gemini 3.1 Flash Lite through AI Studio (single combined calls)

Call Google's Gemini 3.1 Flash Lite model from a new server function with a plain fetch request, mirroring the existing Text to Speech integration. One request scores both writing tasks together, one request scores the speaking transcripts. The key lives only on the server.

**Pros**:
- Free AI Studio tier (about 1500 requests per day) far exceeds current usage (2 requests per finished mock)
- Reuses the proven pattern already running for TTS: no SDK, no new dependency, key handling solved
- Fast responses (typically 3 to 8 seconds), so a waiting state on the result screen is acceptable

**Cons**:
- Scoring quality sits below top tier models; bands can vary slightly between runs
- Hard external dependency: key outage or quota exhaustion must always fall back cleanly

> Note (updated 2026-08-09, engineer confirmed): the originally chosen 2.0 Flash model now reports a free tier quota of 0 for this project, so the build uses the current equivalent, Gemini 3.1 Flash Lite. Everything else in this spec is unchanged.

### Option 2: Gemini 2.5 Pro

Same integration, a stronger model.

**Pros**:
- Noticeably better judgement of argument structure and grammar

**Cons**:
- Much lower free limits and slower responses, so every finished mock risks a long wait or quota failure

### Option 3: OpenAI GPT 4o mini (or another hosted model)

Call a different provider's chat model instead.

**Pros**:
- Comparable quality and low per call cost

**Cons**:
- Adds a second provider account, billing, and secret to operate, while the project already runs on Google's API surface

### Option 4: Fix in place, extend the heuristic only

Keep scoring fully offline and add signals like connector words and sentence variety to the current formula.

**Pros**:
- Zero cost, zero latency, no external key to manage

**Cons**:
- Cannot judge grammar or content at all, which is the root gap; offline spell and grammar checking is itself a large project

## Rationale

The root problem is that a word counting formula cannot evaluate grammar or content; only a language model fixes that. Among real model options, Gemini 3.1 Flash Lite wins on operational reality rather than on benchmark scores: zero added infrastructure (a plain fetch, exactly like the TTS call already in production), a free limit of about 1500 requests per day against 2 requests per finished test for a small user base, and latency low enough for the agreed waiting state. Option 2's quality gain does not pay for tighter quotas, and Option 3's quality parity does not justify a second provider's secrets and billing. Option 4 was the honest fallback and it stays in the design as exactly that: a fallback, not the scorer.
