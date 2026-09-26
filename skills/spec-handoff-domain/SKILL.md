---
name: spec-handoff-domain
description: Stage 2 of the spec handoff — shows the domain expert, alone, the few open Domain questions and the agent's proposed Domain and Domain+Technical decisions from HANDOFF-QUESTIONS.md in two tables, and writes what he accepts or says into spec.md; invoke by name (/spec-handoff-domain).
disable-model-invocation: true
---
# Spec handoff, stage 2 — the domain expert's check

Premise and sequence: `spec-handoff-questions`. The domain expert, alone, answers the questions under `## Domain` of `<featureDir>/HANDOFF-QUESTIONS.md` (the user's feature directory, else `.specify/feature.json`'s) and checks the decisions under `## Domain` and `## Domain+Technical`. **Status: *decided, not yet validated*, 2026-09-26**, owner's decision; run once that day under the earlier one-at-a-time rule, which the owner then reversed twice; checks *convention*.

## Refuse with nothing open

**If the file is missing, or has no `Answer: open` under `## Domain` and no `Answer: proposed` under `## Domain` or `## Domain+Technical`, say so, name the next step, and stop.**

## Close what the spec already answers, unasked

**Before showing anything, search all of `spec.md` for each open question's answer and each proposed decision's text. An entry the spec answers is not shown: set `Answer: stated in spec: "<quoted text>" (<requirement id or section>)` and list its id in one line of the reply.**

The default was to show it with the spec's answer as the recommendation. It lost (owner, 2026-09-26): the expert was still asked what the spec already said.

(Check: no shown row's recommendation or decision is a quotation of the spec — *convention*.)

## One reply, two tables

**In the expert's language and business terms, show first the open Domain questions in one compact table: id, the question in one plain sentence, the recommended answer, and a one-sentence reason naming its source or saying it is a guess. Then the proposed decisions under Domain and Domain+Technical in a second: id, the decision in one plain sentence, its source, and for a Domain+Technical row its consequence in plain words. The expert replies once, with only the rows he disagrees with; every other row counts as accepted. Write only what he accepted or said.**

Reversed by the owner on 2026-09-26, after the first run: one question at a time, with no recommendation, so that an accepted answer could never be the agent's text. It wasted the expert's time, and most of the 29 questions only re-confirmed the spec. Decisions are shown, not asked, since the owner's second reversal the same day: the agent decides what it can. The cost accepted: a row he passes over puts the agent's text in the spec.

(Check: every `Answer:` written is the expert's reply or a row he did not dispute — *convention*.)

## Apply and record

**Apply each accepted answer or decision, or the expert's replacement, in `spec.md` wherever the entry quotes; add `- Q: <question or gap> → A: <answer or decision>` under `## Clarifications`, `### Session <date> (handoff: domain)`; set `Answer: answered in spec, …`, `Answer: applied, …` or `Answer: replaced by the expert, Session <date> (handoff: domain)`, or `Answer: left as written: <reason>`.**

(Check: each applied entry has its Session entry — *convention*.)

## Technical input moves the entry

**If the expert needs a technical fact (cost, feasibility, a platform rule) to answer a question or to dispute a decision, move it to the questions under `## Domain+Technical` with `Moved from Domain <date>: <reason>`, leave it open, go on.**

The default is the agent supplying the fact. It lost: the expert cannot weigh it, and nobody checks it.

## Sign-off after the rerun

**Next: `/spec-handoff-joint` if Domain+Technical has an open question, else `/spec-handoff-questions`. Once that rerun reports the handoff complete, the domain expert sets `**Status**:` to anything but Draft and commits both files together. This stage commits nothing.**

The default is to sign off now. It lost: joint answers and rerun entries are still his, and meeting them after handoff stops the build.

(Check: `build-feature-prepare` refuses a Draft or uncommitted file — *convention*.)
