---
name: spec-handoff-domain
description: Stage 2 of the spec handoff — shows the domain expert, alone, every open Domain question in HANDOFF-QUESTIONS.md as one table with a recommended answer each, and writes what he accepts or says into spec.md; invoke by name (/spec-handoff-domain).
disable-model-invocation: true
---
# Spec handoff, stage 2 — the domain expert's questions

Premise and sequence: `spec-handoff-questions`. The domain expert, alone, answers `## Domain` of `<featureDir>/HANDOFF-QUESTIONS.md` (the user's feature directory, else `.specify/feature.json`'s). **Status: *decided, not yet validated*, 2026-09-26**, owner's decision; run once that day under the earlier one-at-a-time rule, which the owner then reversed; checks *convention*.

## Refuse without open questions

**If the file is missing or has no `Answer: open` under `## Domain`, say so, name the next step, and stop.**

## Close what the spec already answers, unasked

**Before showing anything, search all of `spec.md` for each open question's answer. A question the spec answers is not shown: set `Answer: stated in spec: "<quoted text>" (<requirement id or section>)` and list its id in one line of the reply.**

The default was to show it with the spec's answer as the recommendation. It lost (owner, 2026-09-26): the expert was still asked what the spec already said.

(Check: no shown row's recommendation is a quotation of the spec — *convention*.)

## All at once, each with a recommendation

**Show every remaining open Domain question in one compact table, in file order: id, the question in one plain sentence, the recommended answer, and a one-sentence reason naming its source (a sibling spec, the constitution) or saying it is a guess. Use the expert's language and business terms. The Caveats question is one row; accepting it deletes every note it lists and keeps the values. The expert replies with only the rows he disagrees with; every other row counts as accepted. Write only what he accepted or said.**

Reversed by the owner on 2026-09-26, after the first run: one question at a time, with no recommendation, so that an accepted answer could never be the agent's text. It wasted the expert's time, and most of the 29 questions only re-confirmed the spec. The cost accepted: a row he passes over puts the agent's answer in the spec.

(Check: every `Answer:` written is the expert's reply or the recommendation of a row he did not dispute — *convention*.)

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
