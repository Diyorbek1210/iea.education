# Scope: IEA (IELTS & English Access)

A web app that gives learners free, structured IELTS preparation: courses, games, a placement test, and 10 full mock tests with band scoring.

**Build approach:** Tracer Bullet (thin end to end slices first, then each slice grows).
**Workflow:** Beta (the tail after develop: check verify, then test). The project's default rigor tier; a feature's own tier tag (e.g. `· GA`) overrides it.

_You are in charge. Every box below is a **suggestion**, not a gate: run any, skip any, and mark a feature `done` when you decide it is. The workflow records what you actually did (including "skipped"), it never requires a step. The one thing it asks is that a load bearing decision be written down (a spec), not that any check be run._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| A | Mock tests | existing | existing |
| 1 | AI scoring for Writing and Speaking | Mock tests | in-progress |

## Mock tests

### A. Mock tests · existing
Pre-workflow feature: 10 mock tests (Reading multiple choice, Listening gap fill, Writing Task 1 and 2, Speaking parts 1 to 3) with heuristic band estimates. code in `src/data/mockTests/`, `src/routes/mock-test.tsx`, `src/routes/mock-test_.$mockId.tsx`

### 1. AI scoring for Writing and Speaking · in-progress
Replace the length based formula for Writing and Speaking bands with real AI scoring (Gemini 3.1 Flash Lite), keeping the formula as a per skill fallback, and show criterion based feedback on the result page.
**Done when:** finishing a mock scores essays and transcripts through the AI when a key is configured, bands and criterion feedback persist with the result, and every failure mode silently falls back without breaking the result flow.
- [x] Design it (spec): `/architect ai writing speaking scoring`
- [x] Build it: `/develop ai writing speaking scoring`
   - [x] Data model + AI service: types plus the scoreMockPerformance server function with the writing and speaking Gemini calls (AC-1..3)
   - [x] Result flow wiring: AI first, per skill fallback, short transcript rule (AC-1, AC-4, AC-5)
   - [x] Result page feedback panel with criteria, tips, and pronunciation note (AC-2, AC-3, AC-4)
   - [x] Persist texts and feedback on saved results (AC-6, AC-7)
- [ ] Verify it: `/check verify ai writing speaking scoring`
- [ ] Test it: `/test ai writing speaking scoring`
Spec [0001](../specs/0001-ai-writing-speaking-scoring/index.md) · code in `src/lib/aiScoring.ts`, `src/lib/aiScoringCore.ts`, `src/lib/types.ts`, `src/routes/mock-test_.$mockId.tsx`

## Deferred
Out of scope for the current build pass, kept so the plan stays honest.
- **Pronunciation assessment**: score real audio, not transcripts · needs a decision · from spec 0001
- **Per user AI quota**: cap daily AI scorings if the shared key gets abused · from spec 0001

## Legend

**The decision box.** Every feature carries exactly one, the sub task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally), so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**: `planned` (one box: `Design it (spec)`) → `in-progress` (designed: spec linked, milestone rollup under `Build it`) → `in-progress` (building, verified) → `done` (your call, never gated).

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop`. The tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` → `in-progress` → `done`, plus `existing` (pre-workflow) and `dropped` (de-scoped, kept for history).
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.
