---
name: build-feature-prepare
description: Stage 4 of the spec handoff — refuses unless the handoff is complete, then shows the technical expert, alone, every open Technical question in HANDOFF-QUESTIONS.md as one table with a recommended answer each, before /build-feature; invoke by name (/build-feature-prepare).
disable-model-invocation: true
---
# Spec handoff, stage 4 — technical questions

Premise and sequence: `spec-handoff-questions`. The technical expert, alone, answers `## Technical` of `<featureDir>/HANDOFF-QUESTIONS.md` (the user's feature directory, else `.specify/feature.json`'s). **Status: *decided, not yet validated*, 2026-09-26**, owner's decision, never run; checks *convention*.

## Refuse unless complete

**First require all four; on a failure, name it and its fixing step, and stop.**

- The file exists; `git status --porcelain -- <featureDir>` is empty.
- No `Answer: open` under `## Domain` or `## Domain+Technical`.
- The last `Run` hash equals `grep -v '^\*\*Status\*\*:' <featureDir>/spec.md | git hash-object --stdin`.
- `**Status**:` is not Draft.

The default is to start anyway. It lost: an open domain question stops the build after the domain expert has left.

## All at once, each with a recommendation

**Show every open Technical question in one compact table, in file order, each after its `Depends on: Q<n>` answer: id, the question in one plain sentence, the recommended answer, and a one-sentence reason naming its source or saying it is a guess. Where the spec already states the answer, recommend that answer. The expert replies with only the rows he disagrees with; every other row counts as accepted. Write only what he accepted or said.**

Reversed by the owner on 2026-09-26, with stages 2 and 3: one question at a time, with no recommendation. On stage 2's first run it wasted the expert's time, and most questions only re-confirmed the spec. The cost accepted: a row he passes over puts the agent's answer in the spec.

(Check: every `Answer:` written is the expert's reply or the recommendation of a row he did not dispute — *convention*.)

## Apply and record the answer

**Apply each answer in `spec.md` wherever the question quotes; add `- Q: <question> → A: <answer>` under `## Clarifications`, `### Session <date> (handoff: technical)`; set `Answer: answered in spec, Session <date> (handoff: technical)` or `Answer: left as written: <reason>`.** A constitution amendment is its own commit with its reason, named in `Answer:`.

(Check: each answered question has its Session entry — *convention*.)

## A domain decision reopens the handoff

**Move such a question to `## Domain` with `Moved from Technical <date>: <reason>`, leave it open, tell the technical expert the domain expert answers it in this file, and stop; he commits both files.** Resume: `/spec-handoff-domain`, rerun, sign-off, here.

The default is picking the sensible reading. It lost: that is the plan-decides failure, without domain knowledge.

## Commit, then build

**With nothing open under `## Technical`, the technical expert commits both files together and runs `/build-feature`,** which reads only the committed spec.

(Check: no `Answer: open` at `build-feature`'s starting commit — *convention*.)
