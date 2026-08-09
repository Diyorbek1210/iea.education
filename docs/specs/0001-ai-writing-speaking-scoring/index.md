# 0001. AI scoring for mock test Writing and Speaking

**Date**: 2026-08-09
**Status**: In Progress

## Summary

Mock test Writing and Speaking answers are now scored by a length based formula that cannot judge grammar or content. This spec replaces that with real AI scoring through Google Gemini (a large language model called with a plain HTTP request), called once at the end of each mock test. The old formula stays as a safety net: if the AI call fails for any reason, that skill quietly uses the old estimate instead, so no test attempt ever breaks. The result page shows each official IELTS criterion with its own score plus short advice.

## Requirements

**User stories**:
- As a student, I want my essay and spoken answers scored like the real IELTS exam, so that my mock band tells me the truth about my level.
- As a student, I want short advice on what to improve, so that each mock test teaches me something.
- As a developer, I want scoring to never block or break the result flow, so that a missing key or a slow API never loses a user's test attempt.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):
- **AC-1**: When a mock test finishes, Writing and Speaking are scored by the AI automatically (no button) whenever `GEMINI_API_KEY` is set on the server; the result screen shows a waiting state and the final scores appear only after the evaluation completes.
- **AC-2**: The Writing score is one combined band across Task 1 and Task 2 with Task 2 weighted double; the feedback panel lists the four official criteria (Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy), each with a band and a one line comment, plus a summary and tips, all in English.
- **AC-3**: Speaking is scored from the recorded transcripts; its feedback lists three criteria (Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy) and the UI states clearly that pronunciation is not assessed because only text transcripts are scored.
- **AC-4**: If the key is missing, the API errors or times out, or the response cannot be parsed, the affected skill alone falls back to the existing heuristic estimate; the result is still shown and saved, and `source` records which path (`ai` or `heuristic`) produced each skill's band.
- **AC-5**: A speaking transcript set with fewer than 10 words in total is never sent to the API; the heuristic scores speaking instead (an empty answer earns a low band without spending quota).
- **AC-6**: The saved result document carries the user's `writingTexts` (both tasks), `speakingTranscripts`, and the AI `feedback` object, so the user can later re-read their own text together with its evaluation.
- **AC-7**: Results saved before this feature remain fully valid: every new field is optional, and the mock test list and leaderboard render unchanged for documents without them.

## Decision

**Chosen option**: Option 1: Gemini 3.1 Flash Lite through AI Studio (single combined calls)

Score Writing (both tasks, one combined band, Task 2 weighted double) and Speaking (transcripts, no pronunciation) with one server function calling Gemini 3.1 Flash Lite, falling back per skill to the existing heuristic whenever the AI path cannot produce a valid result.

## Rationale

Reasoning and options: see rationale.md.

## Feature design

**Data model sketch** (existing `MockResult` in `src/lib/types.ts` extended; all new fields optional so AC-7 holds):

| Field | Type | Required | Notes |
|---|---|---|---|
| writingTexts | `{ task1: string, task2: string }` | no | the raw essays the user wrote |
| speakingTranscripts | `string[]` | no | 7 transcripts from speech recognition or typed input |
| feedback | object | no | absent entirely when no AI scoring happened |
| feedback.writing.band | number 0 to 9 | yes (within feedback) | combined, Task 2 weighted double |
| feedback.writing.criteria | 4 items of `{ label, band, comment }` | yes | the four official writing criteria |
| feedback.writing.source | `"ai"` or `"heuristic"` | yes | which path produced the writing band |
| feedback.writing.summary | string | yes | 1 to 2 sentences |
| feedback.writing.tips | `string[]` | yes | 2 to 3 improvement tips |
| feedback.speaking.* | same shape, criteria has 3 items | no | speaking part absent when no usable transcripts existed |

`writing` and `speaking` band numbers on the result document always mirror `feedback.<skill>.band` when AI succeeded, so readers never need two sources of truth.

**State transitions**: none (one shot scoring at result time; no reusable job state).

**API surface**:

| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `scoreMockPerformance` (server function, `createServerFn`, new file `src/lib/aiScoring.ts`) | POST | task1Prompt, task1Text, task2Prompt, task2Text, speakingQuestions: string[], speakingTranscripts: string[] | `{ writing?: AiSkillFeedback, speaking?: AiSkillFeedback }` | none (same as existing `synthesizeSpeech`) | throws on missing key, API error, timeout, or unparsable response |

**Value sourcing** (every value the result needs, with its source):

| Action | Value produced / displayed | Source |
|---|---|---|
| score test | writing band | AI response when valid, else `estimateWritten(writing1, 150)` and `estimateWritten(writing2, 250)` weighted 1/3 and 2/3 (existing code) |
| score test | speaking band | AI response when valid and transcripts reach 10 words, else `estimateWritten(joined transcripts, 150)` (existing code) |
| score test | listening, reading bands | unchanged, exact answer matching plus band tables (existing code) |
| score test | overall band | mean of the four bands, rounded to the nearest 0.5 (existing code) |
| score test | criteria labels and bands | fixed label list in the prompt contract, bands from the AI JSON response |
| score test | summary, tips | AI JSON response |
| save result | writingTexts, speakingTranscripts | the run page's component state |
| save result | feedback.writing.source / speaking.source | which path (`ai` or `heuristic`) produced each skill band |
| result page | "AI evaluated" versus "estimated" note | the per skill `source` value |
| result page | pronunciation note | static text on the speaking feedback panel |

**Key invariants**:
- `overall` always equals the rounded mean of the four band fields, whatever path produced them.
- `feedback.writing.criteria` has exactly 4 entries; `feedback.speaking.criteria` exactly 3.
- A missing or broken AI path never blocks showing or saving the result (AC-4).
- Old documents without the new fields read identically to before (AC-7).

**Security model**:
- `GEMINI_API_KEY` lives only in server environment variables (never `VITE_` prefixed), same rule as the existing TTS key.
- The server function has no auth check, consistent with every other server function in the app (engineer accepted quota risk; a test costs 2 requests against a free limit of about 1500 per day).
- Inputs are capped server side in the validator (task texts 6000 chars each, each transcript 4500 chars), so a hostile or buggy client cannot blow up prompt size or cost.
- User essays and transcripts leave the server only to Google's API; they are ordinary user generated content already stored in Firestore, no compliance scope triggered.

**Configuration required**:
- `GEMINI_API_KEY`: API key from Google AI Studio (aistudio.google.com), used server side only by `src/lib/aiScoring.ts`. Documented in `.env.example` with the same warning style as `GOOGLE_TTS_API_KEY`.

**Critical test scenarios** (each maps to an acceptance criterion):
- Happy path: finish a mock with the key set, waiting state shows, then final bands plus the criteria panel render with correct weighting, verifies **AC-1**, **AC-2**, **AC-3**
- Failure case: remove the key (or force a fetch failure) and finish a mock; result completes with heuristic bands, saved document has `source: "heuristic"` and no crash, verifies **AC-4**
- Edge case: answer speaking with a few words only; no API request for speaking is made and speaking scores via the heuristic, verifies **AC-5**
- Data case: open a previously saved old result and the leaderboard; both render without errors, verifies **AC-7**

## Build plan

(Build approach: none recorded for this product; assume end to end slices. The thin thread here is the writing path through every layer, then the speaking path thickens it. The data model is small, one types update, applied where its slice lands.)

1. Extend `src/lib/types.ts` with `AiCriterion`, `AiSkillFeedback`, and the optional `MockResult` fields, satisfies **AC-6**, **AC-7**
2. Create `src/lib/aiScoring.ts` server function: env loading (dev dotenv branch like `tts.ts`), input validation with caps, and the writing only Gemini call with a JSON response contract (response format `application/json`, defensive parsing), satisfies **AC-1**, **AC-2**
3. Add the speaking Gemini call inside the same function, run both requests in parallel, return whichever parts succeeded, satisfies **AC-3**
4. Wire `finish()` in `src/routes/mock-test_.$mockId.tsx`: waiting state on the result stage, AI first, per skill silent fallback, the under 10 words speaking rule, final bands and `source` values, satisfies **AC-1**, **AC-4**, **AC-5**
5. Persist `writingTexts`, `speakingTranscripts`, and `feedback` through `addMockResult`, satisfies **AC-6**
6. Build the result page feedback panel: criteria bars with bands and comments, summary, tips, the pronunciation note, and the AI versus estimated source note, satisfies **AC-2**, **AC-3**, **AC-4**
7. Update `.env.example` with `GEMINI_API_KEY` documentation, then verify end to end without the key (fallback path) and with the key (AI path), satisfies **AC-4**, **AC-7**

## Consequences

**Positive**:
- Mock bands start measuring real writing and speaking ability instead of text length; feedback makes each attempt a lesson.
- Old results and every page reading them need no changes (additive optional fields).
- No new dependency or service to operate: one more HTTP integration beside the existing one.

**Negative / tradeoffs**:
- The result flow gains a seconds long wait whenever AI is used, and band numbers can drift slightly between identical submissions (language models are not deterministic; temperature is kept low to limit this).
- A new secret to manage; forgetting it in a deploy silently turns scoring back into the heuristic (mitigated by the source note on the result page).
- User text is sent to a third party API (Google), which needs a line in any future privacy policy.
- Feedback is English only, so weaker students may not understand the advice fully.

**Neutral**:
- The heuristic in `estimateWritten` is not deleted; it becomes the documented fallback path.
- No data migration is needed: old documents never gain the fields, readers treat them as absent.

## Follow-up

- [ ] Create the Gemini key at aistudio.google.com and set `GEMINI_API_KEY` in local `.env` and in the deployment environment before shipping
- [ ] If the AI versus heuristic gap shows bands drifting oddly, consider logging both values for a calibration period
- [ ] Long term: consider audio based pronunciation assessment (needs a speech API with pronunciation scoring); out of scope here because only transcripts are scored
