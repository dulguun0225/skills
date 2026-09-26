---
name: spec-handoff-joint
description: Stage 3 of the spec handoff — shows the domain and technical experts together every open Domain+Technical question in HANDOFF-QUESTIONS.md as one table with a recommended answer each, and writes what they accept or say into spec.md; invoke by name (/spec-handoff-joint).
disable-model-invocation: true
---
# Spec handoff, stage 3 — the questions that need both experts

Premise and sequence: `spec-handoff-questions`. The domain and technical experts, together, answer `## Domain+Technical` of `<featureDir>/HANDOFF-QUESTIONS.md` (the user's feature directory, else `.specify/feature.json`'s), the handoff's one joint step. **Status: *decided, not yet validated*, 2026-09-26**, owner's decision, never run; checks *convention*.

## Skip when nothing is open

**If the file has no `Answer: open` under `## Domain+Technical`, say the stage is skipped, point to `/spec-handoff-questions`, and stop.**

## Both present, all at once, each with a recommendation

**Show every open question in one compact table, in file order: id, the question in one plain sentence, the recommended answer with its technical consequence, and a one-sentence reason naming its source or saying it is a guess. Use the experts' language and plain terms. The technical expert corrects the facts; the domain expert makes the choice. They reply with only the rows they disagree with; every other row counts as accepted. Write only what they accepted or said.**

The default is to take each half to each person and relay. It lost: here the choice depends on the fact and the fact on the choice, which is why the question was not split.

Reversed by the owner on 2026-09-26, with stage 2: one question at a time, with no recommendation. On stage 2's first run it wasted the expert's time, and most questions only re-confirmed the spec. The cost accepted: a row they pass over puts the agent's answer in the spec.

(Check: every `Answer:` written is the experts' reply or the recommendation of a row they did not dispute — *convention*.)

## Apply and record the answer

**Apply each answer in `spec.md` wherever the question quotes. Record `- Q: <question> → A: <answer>` under `## Clarifications`, `### Session <date> (handoff: joint)`. Set `Answer: answered in spec, Session <date> (handoff: joint)`, or `Answer: left as written: <reason>`.** An answer that amends the constitution says so in its `Answer:` line; the amendment is the technical expert's commit, with its reason.

(Check: each question answered in the spec has its Session entry in `spec.md` — *convention*.)

## Next

**Next: `/spec-handoff-questions`, the rerun; then the domain expert's sign-off, per `spec-handoff-domain`. This stage commits nothing.**
