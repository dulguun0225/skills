---
name: spec-handoff-domain
description: Stage 2 of the spec handoff — walks the domain expert, alone, through the Domain questions in HANDOFF-QUESTIONS.md and writes each answer into spec.md; invoke by name (/spec-handoff-domain).
disable-model-invocation: true
---
# Spec handoff, stage 2 — the domain expert's questions

Premise and sequence: `spec-handoff-questions`. The domain expert, alone, answers `## Domain` of `<featureDir>/HANDOFF-QUESTIONS.md` (the user's feature directory, else `.specify/feature.json`'s). **Status: *decided, not yet validated*, 2026-09-26**, owner's decision, never run; checks *convention*.

## Refuse without open questions

**If the file is missing or has no `Answer: open` under `## Domain`, say so, name the next step, and stop.**

## One at a time, no recommendation

**Take open Domain questions in file order; show the quoted text, question and readings in the expert's terms; wait. Recommend nothing; write only answers the expert gave.**

The default is every question at once, each with a likely answer. It lost: an answer accepted unchanged is the agent writing the spec.

(Check: every `Answer:` written matches the expert's reply — *convention*.)

## Apply and record the answer

**Apply each answer in `spec.md` wherever the question quotes; add `- Q: <question> → A: <answer>` under `## Clarifications`, `### Session <date> (handoff: domain)`; set `Answer: answered in spec, Session <date> (handoff: domain)` or `Answer: left as written: <reason>`.**

(Check: each answered question has its Session entry — *convention*.)

## Technical input moves the question

**If the expert needs a technical fact (cost, feasibility, a platform rule), move it to `## Domain+Technical` with `Moved from Domain <date>: <reason>`, leave it open, go on.**

The default is the agent supplying the fact. It lost: the expert cannot weigh it, and nobody checks it.

## Sign-off after the rerun

**Next: `/spec-handoff-joint` if Domain+Technical has an open question, else `/spec-handoff-questions`. Once that rerun reports the handoff complete, the domain expert sets `**Status**:` to anything but Draft and commits both files together. This stage commits nothing.**

The default is to sign off now. It lost: joint answers and rerun questions are still his, and meeting them after handoff stops the build.

(Check: `build-feature-prepare` refuses a Draft or uncommitted file — *convention*.)
