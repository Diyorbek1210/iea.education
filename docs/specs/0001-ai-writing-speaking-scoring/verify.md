# Verify: AI scoring for Writing and Speaking · spec 0001 · updated 2026-08-09

_Steps derived from spec 0001 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [ ] `npm run dev`, finish one full mock test with `GEMINI_API_KEY` set → waiting state "Evaluating your writing and speaking…" shows first, bands appear only after it → **AC-1**
- [ ] Same run → Writing panel lists 4 criteria with bands/comments, one combined band, summary, tips, all English → **AC-2**
- [ ] Same run → Speaking panel lists 3 criteria plus the pronunciation note → **AC-3**
- [ ] Unset `GEMINI_API_KEY`, finish a mock → result completes, skill panels show the "Estimated" note, overall still renders → **AC-4**
- [ ] With a depleted/quota-exceeded key, finish a mock → same clean fallback, saved document has `source: "heuristic"` → **AC-4**
- [ ] Answer speaking with fewer than 10 words total → no `/api` AI call for speaking (network tab), speaking band equals heuristic → **AC-5**
- [ ] Open the saved result document (Firestore console or localStorage) → contains `writingTexts`, `speakingTranscripts`, `feedback` → **AC-6**
- [ ] Leaderboard and mock test list with a pre-feature result (no new fields) → render unchanged → **AC-7**
- [ ] Compute by hand: `overall` equals the mean of the four bands rounded to 0.5 → value sourcing (overall band)
- [ ] Source note under the overall band reads "AI evaluated" when AI ran and "estimated locally" when it did not → value sourcing (source note)

## Commands

- [ ] `npx tsc --noEmit` → passes → **AC-7** (types stay compatible with old documents)
- [ ] `npx eslint src/` → passes → general gate
- [ ] `npm run build` → passes → general gate
- [ ] `node -e "const k=require('fs').readFileSync('.env','utf8').match(/^GEMINI_API_KEY=(.+)$/m)[1].trim();fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key='+k,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:'Reply with exactly: OK'}]}]})}).then(r=>console.log('status',r.status))"` → status 200 means the AI path will run; 429 means fallback covers it → **AC-1**, **AC-4**

## Acceptance-criteria coverage

- AC-1: steps 1, 13 · AC-2: step 2 · AC-3: step 3 · AC-4: steps 4, 5, 13 · AC-5: step 6 · AC-6: step 7 · AC-7: steps 8, 11 · value sourcing rows: steps 9, 10
