---
name: spec-handoff-joint
description: Stage 3 of the spec handoff — walks the domain and technical experts together through the Domain+Technical questions in HANDOFF-QUESTIONS.md and writes each answer into spec.md; invoke by name (/spec-handoff-joint).
disable-model-invocation: true
---
# Spec handoff, stage 3 — the questions that need both experts

Premise and sequence: `spec-handoff-questions`. The domain and technical experts, together, answer `## Domain+Technical` of `<featureDir>/HANDOFF-QUESTIONS.md` (the user's feature directory, else `.specify/feature.json`'s), the handoff's one joint step. **Status: *decided, not yet validated*, 2026-09-26**, owner's decision, never run; checks *convention*.

## Skip when nothing is open

**If the file has no `Answer: open` under `## Domain+Technical`, say the stage is skipped, point to `/spec-handoff-questions`, and stop.**

## Both present, one at a time, no recommendation

**Take the open questions in file order. Show the quoted text, the question, and each reading with its technical consequence. The technical expert states the facts; the domain expert makes the choice. Recommend no reading; write no answer they did not give.**

The default is to take each half to each person and relay. It lost: here the choice depends on the fact and the fact on the choice, which is why the question was not split.

(Check: every `Answer:` written matches a reply the experts gave — *convention*.)

## Apply and record the answer

**Apply each answer in `spec.md` wherever the question quotes. Record `- Q: <question> → A: <answer>` under `## Clarifications`, `### Session <date> (handoff: joint)`. Set `Answer: answered in spec, Session <date> (handoff: joint)`, or `Answer: left as written: <reason>`.** An answer that amends the constitution says so in its `Answer:` line; the amendment is the technical expert's commit, with its reason.

(Check: each question answered in the spec has its Session entry in `spec.md` — *convention*.)

## Next

**Next: `/spec-handoff-questions`, the rerun; then the domain expert's sign-off, per `spec-handoff-domain`. This stage commits nothing.**
