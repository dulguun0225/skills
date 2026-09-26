---
name: spec-handoff-questions
description: Stage 1 of the spec handoff — a fresh-context, read-only reading of a clarified spec-kit spec.md that writes HANDOFF-QUESTIONS.md for the domain and technical experts; invoke by name (/spec-handoff-questions).
disable-model-invocation: true
---
# Spec handoff, stage 1 — the questions

**Premise:** LLM agents write the code and no human reads it, so `spec.md` is the one artifact a person writes; the plan agent answers what it leaves open, unread.

Sequence (owner, 2026-09-26): this → `spec-handoff-domain`, domain expert alone → `spec-handoff-joint`, both, if anything is open → this again → `build-feature-prepare`, technical expert alone → `build-feature`.

Ground: eight `build-feature` stops caused by clarified specs ([evidence.md](evidence.md)). Each check is the written file, *convention*, contrary to this set's rule that a check fails the build. **Status: *decided, not yet validated*, 2026-09-26**; run once, on 2026-09-26, before the caveat rule below; no build has followed; no `review-by`, as nothing is *confirmed*.

## Run it in a fresh context

**Run after the last `/speckit-clarify` and after stages 2 and 3, in a context that did not write, clarify or answer the spec: a subagent given the feature directory and this file's path, or a new session. The invoker reads no spec; the reader skips this section.** Effort: `build-feature`'s review-plan row (Opus, high, 2026-09-24).

The default is clarify, or its session, as the check. It lost: all eight specs were clarified; clarify asks at most five questions, skips sibling specs, and reads what the author meant.

(Check: the `Run` line names a subagent or separate session — *convention*.)

## Read the spec, the constitution and the sibling specs, and write only the file

**Read in full `spec.md`, `checklists/requirements.md` if present, `.specify/memory/constitution.md` and every other `specs/*/spec.md`; no plan or code. Write only `HANDOFF-QUESTIONS.md`: no spec edit, `/speckit-*`, answer or commit.** Feature directory: the user's, else `.specify/feature.json`'s; if neither has a `spec.md`, ask.

Stance: refute that a plan can be written without deciding what the authors have not; it is `build-feature`'s removed review-spec reading, minus its writes and its fix loop, which had no fixed point.

(Check: `git status --porcelain` lists only `HANDOFF-QUESTIONS.md`; `git diff -- <featureDir>/spec.md` is empty — *convention*.)

## What the reader looks for

**Raise only a real gap: no answer in the spec, statements that contradict, or a case with no outcome. Before writing a question, search all of `spec.md` for its answer — every requirement, scenario, edge case, entity, success criterion, assumption and `## Clarifications` entry, not only the section quoted — then the constitution and the sibling specs. An answer found anywhere, which no other text contradicts, means no question. Never ask to confirm what the spec states definitively; a "needs confirmation" or "assumed" note beside a stated value is not a question of its own.** Brackets: default section, overridden by the section rule; stopping stage.

- **Markers** [D; preflight, *bespoke*]: every `[NEEDS CLARIFICATION]` and unfilled placeholder, listed first.
- **Deferred or assumed fact** [D; review-plan to converge]: a value the spec leaves open, calls undecided, or defers ("at plan stage") with no value stated; an algorithm or standard named without a source. Ask for the source; never supply it. `wf_e68e4e48-4ed`.
- **Caveats on stated values** [D; graded like any other]: one question for the whole spec, quoting each confirmation or assumption note with the value it qualifies. Readings: delete the notes and keep the values, or name the values that change.
- **Criterion without measurement conditions** [split; analyze]: load and wait (D); percentile, concurrency, warm or cold, machine (T); a multiplier's dimension; a manual-work bound is no timing gate. `wf_fbb2141f-8bf`.
- **Search and list semantics** [split; analyze]: case, match position, blank or whitespace query, order, crossing a grouping (D); query-length and page bounds (T). `wf_bc7b0f7c-ce6`.
- **Unconditioned guarantee, edge case without outcome** [D+T; analyze]: "exactly once", "never", "always", "0 missing"; an edge case with no outcome. `wf_e4e27b83-bc3`.
- **Requirements that disagree, repeat or mis-cite** [split; analyze, or review-plan if no plan realises both]: both sides (D); a repeated rule, a wrong cited id, where the intended text is plain (T). `wf_6e72f3dd-930`.
- **Clarify residue** [D; review-plan or analyze]: text keeping a replaced reading; a decision credited to a missing clarification. `wf_115f053c-900`.
- **Sibling-spec conflict** [D; analyze]: a contradiction, both quoted with feature prefix. Where this spec is silent and a sibling decides, the sibling's answer stands; no question. `wf_a6f3b709-43a`.
- **Constitution conflict** [T if an amendment resolves it, else D+T; review-plan]: a violated article, named; a requirement needing an amendment. `wf_cc1aa65d-148`.
- **Contradicted header** [T; analyze]: a Branch line other than `feature/<feature directory name>`. `wf_de4bfd27-d8a`.

Draft Status is no question; the domain expert sets it at sign-off.

The default is to leave these to the plan. It lost: a value the run picks lives in its own files, its gates cannot test against them, and a later author change restarts the run at `plan`.

The default is also to ask about every hedge. It lost (owner, 2026-09-26): on the first run, 29 Domain questions went to the domain expert, and most re-confirmed a value the spec stated; the first asked him to confirm a name length FR-009 states outright, raised only by an Assumptions note.

**Before writing the file, re-read `spec.md` once per drafted question and delete every question it answers.** The owner reported the re-asking again after the rule above (2026-09-26): the class list invites a question per match, and a reader that quotes one section misses the answer in another.

(Check: for each question, a search of `spec.md` for its subject finds no text that answers it; no question is answered by the constitution or a sibling spec; caveats appear only in the one Caveats question — *convention*, read by a person.)

## Which section each question goes in

**Each question goes in the one section whose people can answer it.** Domain (D): no technical input; business terms, an example per reading ("If someone types `abc`, should `XABC-1` appear?"), no technical word. Technical (T): answerable from the domain text alone (percentile, page size, Branch line). Domain+Technical (D+T): a domain choice and a technical fact that depend on each other, with each reading's technical consequence.

**A mixed question whose technical half follows from its domain half is split, the T half carrying `Depends on: Q<n>`, not made joint.**

The default is one list for one reader, as `spec-readiness` wrote. It lost: the domain expert got technical questions he could not answer, and they stopped the build after his handoff (owner, 2026-09-26).

(Check: no technical term under Domain; a consequence per D+T reading; each split half names its pair — *convention*, read by a person.)

## How each question is written

**Follow the template, in the spec's language, quoting verbatim. No replacement sentence, no chosen reading.**

The default is to propose the fixing edit. It lost: the author signs the checker's text; on `wf_e68e4e48-4ed` the assumed fact was false and only the owner knew.

(Check: every quotation passes `grep -F` against the `spec.md` read; every question has `If unanswered:` — *convention*.)

## Grade by what a run would do, and drop nothing

**Grade by the stage that would stop, or *no stop predicted* with reason, and order by it; never by severity. Keep every real gap whatever its stage; a declined one is `left as written` with reason.**

The default is a severity floor. It lost: `build-feature` stops on a spec finding of any severity (`specChangesOf` filters nothing), and LOW items were in four of the eight stops.

(Check: each section holds the six stage groups in order — *convention*.)

## The file, and the rerun

**A rerun keeps every question and `Answer:` unchanged and never raises a question on a subject an earlier question closed; a new question is only a gap the spec's changed text created, and passes the same search. It appends new ones at their group's end as `(added <date>)` after the highest `Q<n>`, appends a `Run` line, and reports *handoff complete* or the open D and D+T ids with their next stage. It runs after stage 3 (2 if 3 is skipped), again only if a later stage reopens the handoff; never a loop.**

- **Spec hash:** `grep -v '^\*\*Status\*\*:' spec.md | git hash-object --stdin`; Status excluded so sign-off keeps it valid.
- **Complete:** no `Answer: open` under D or D+T, and the last `Run` hash equals the spec hash.

```
# Handoff questions — <featureDir>
Run <date>, <subagent | separate session>; spec hash <hash>; siblings read: <list>

## Domain
### Preflight would stop
### Review-plan would stop
### Tasks would stop
### Analyze would stop
### Converge would stop
### No stop predicted
## Domain+Technical
(same six groups)
## Technical
(same six groups)

#### Q<n> — <class>[ (added <date>)]
> <verbatim spec text> (<section>, <requirement id or line>)
<question>
Readings: <each; under Domain+Technical, with technical consequence>
Depends on: Q<n>        (split Technical half only)
If unanswered: <stage> stops; a later spec change restarts the run at plan
Answer: open
```

Later stages set `Answer: answered in spec, Session <date> (handoff: domain|joint|technical)`, `Answer: stated in spec: "<quote>" (<location>)` for a question this stage should not have raised, or `Answer: left as written: <reason>`; a moved question gains `Moved from <section> <date>: <reason>`.

(Check: at stage 4's start the hashes match and every question has `Answer:` — *convention*; `build-feature-prepare` checks.)

## What this skill does not do

**It gates no build.** A stop outside the classes is a new class, added with its run id. **Whether it prevents a stop is unmeasured.**
