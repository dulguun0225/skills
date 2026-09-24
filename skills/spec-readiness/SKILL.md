---
name: spec-readiness
description: Read-only check of a clarified spec-kit spec.md that returns questions for its author and never edits the spec. ALWAYS load after /speckit-clarify and before handing a spec to /build-feature or /speckit-plan, or when asked whether a spec is ready to build or what in it a build would stop on; invoke it by name (/spec-readiness).
---
# Spec readiness — questions for the author before the build, and no edit to the spec

**Premise, shared with every skill in this set:** the code is written by LLM agents and no human reads it line by line. The consequence for a specification is that `spec.md` is the one artifact of a feature a person writes, and the oracle every later gate is judged against. A question the spec leaves open is answered by the plan agent, and nobody reads that answer. It comes back later as a stop whose only remedy is a spec change, or as code built on a reading the author never chose. This skill is the last point where the author can answer such a question cheaply: after `/speckit-clarify`, before `/build-feature` (or a hand-run `/speckit-plan`). It reads the spec against itself, the constitution and the sibling specs, in a context that did not write the spec. It writes a list of questions for the author and **never edits the spec**.

**Why it exists.** Before this skill, eight `build-feature` stops had a cause already present in the spec's text before the run started (run ledger, sweep 2, 2026-09-24): `wf_de4bfd27-d8a`, `wf_bc7b0f7c-ce6`, `wf_fbb2141f-8bf`, `wf_115f053c-900`, `wf_e4e27b83-bc3`, `wf_6e72f3dd-930`, `wf_a6f3b709-43a`, `wf_e68e4e48-4ed`. Every one of those specs had been through clarify. Each stop was resolved within a day. The restart is what made them expensive: after a spec edit a run restarts at `plan`, the plan is regenerated whole, and on five of eight such restarts the new plan then stopped at a fresh review-plan cap. The checks below are derived from those eight handoffs, read in full, plus the constitution and sibling-spec reading the owner asked for. The grounds are in [evidence.md](evidence.md).

**Every directive here is a process directive, so its check is a written artifact: `<featureDir>/READINESS.md`, whose absence at the commit a build starts from is visible.** Nothing mechanises any of them, so every enforcement marker is *convention*. That contradicts this set's rule that a rule ships with a check that fails the build; the contradiction is stated here rather than hidden. The exception is a check the build already enforces, which is said where it applies.

**Status: *decided, not yet validated*, 2026-09-24** (owner's decision the same day: read-only, returns questions, never edits the spec, ships as its own skill). No run has taken it. Confidence markers per claim are in [evidence.md](evidence.md). There is no `review-by` date, because nothing here is marked *confirmed*, so the lapse rule has nothing to demote.

## Run it after clarify, in a fresh context

**Run the check after the author's last `/speckit-clarify` and before the spec goes to `/build-feature`, in a context that neither wrote nor clarified the spec. Where the client has subagents, the context that loaded this skill dispatches one reader subagent and reads none of the spec itself. Where it has none, the author opens a new session and invokes `/spec-readiness` there, and that session is the reader.** Give the reader the feature directory and this file's path, and tell it to follow *Read the spec, the constitution and the sibling specs, and write only the list*, *What the reader looks for* and *How each question is written*. A dispatched reader skips this section. Run the reader at the model and effort the project gives its adversarial reviews. In `build-feature` that is the review-plan row, Opus at high effort as of 2026-09-24.

The value of a reviewer is a fresh context. That is the premise `build-feature` puts at every gate: on 2026-09-16 the reviews that found blocking defects found them because the reviewer had no memory of the writing, not because a person read them. The context that ran clarify holds the author's intent, so it reads what the author meant rather than what the spec says. Every gap below is the difference between those two.

The default an agent reaches for is to treat `/speckit-clarify` as the readiness check. It lost on the record: all eight specs had been clarified. Clarify asks at most five questions per session, runs in the author's own context, and scans ambiguity categories rather than the causes that stop a build. Neither clarify nor the stock `/speckit-checklist` reads the sibling specs, and the checklist writes generic requirement-quality items into `checklists/` without reference to what a build stops on. The second default is to run the check in the session that just finished clarify. It lost for the reason in the paragraph above.

(Check: `READINESS.md`'s header names the reader as a subagent or a separate session — *convention*.)

## Read the spec, the constitution and the sibling specs, and write only the list

**The reader reads, in full: `<featureDir>/spec.md`, `<featureDir>/checklists/requirements.md` if it exists, `.specify/memory/constitution.md`, and the `spec.md` of every other directory under `specs/`. It writes one file, `<featureDir>/READINESS.md`, and nothing else. It edits no line of `spec.md`, runs no `/speckit-*` command, answers no question it asks, and commits nothing.** The feature directory is the one the user names. Otherwise it is the one `.specify/feature.json` names, which is the feature this checkout last ran `/speckit-specify` on. If neither names a directory holding a `spec.md`, ask for it; never pick one.

The reader's stance is refutation. Its job is to refute the claim that a plan can be written from this spec without deciding anything the author has not decided. That stance, the full reading, and the rule that every finding names its exact location come from the review-spec stage `build-feature` carried from 2026-09-17 to 2026-09-21, which read the same inputs. **That stage was removed because it wrote the spec, not because it read it.** It applied its own findings in a fix loop, and an artifact the run may rewrite cannot refute the run. Its loop also had no fixed point: blocking findings went 6 → 3 → 1 over three rounds on `wf_cc1aa65d-148`, and most findings at each cap were holes opened by the previous round's fix. So this skill keeps the reading and drops both the write access and the loop.

The plan artifacts and the code are not read. A spec about to be built has no plan, and reconciling the spec with existing code is the plan's work, which the build's review-plan gate refutes. A sibling spec is read because it is text a person wrote, and a sibling's rule for the same subject is the most common place a question is already answered.

Nothing in a skill can remove the edit tools from the context that runs it. So read-only is the reader's instruction, and the check is the diff afterwards.

(Check: after the reader returns, `git status --porcelain` shows `READINESS.md` as the only change, and `git diff -- <featureDir>/spec.md` is empty — *convention*.)

## What the reader looks for

**Report every instance of each class below. Each class is a cause that stopped a real build, or the constitution and sibling reading the owner asked for.** Each class says what the build does if the question is left unanswered. That prediction goes on the question.

### Markers and placeholders the build refuses on

**List every `[NEEDS CLARIFICATION]` marker and every unfilled template placeholder first.** `build-feature` preflight refuses to start on a marker and lists it, so this is the one class the build already enforces (*bespoke*, preflight in `build-feature`'s `workflow.mjs`). It is listed here because finding it before the handoff costs nothing, and after the handoff it costs a refused run. The review-spec stage graded it blocking. If unanswered: **preflight stops.**

### A value, bound or fact the spec defers or assumes

**A value the spec leaves "to be confirmed before plan" or "confirmed at plan stage", a working value that appears only under Assumptions while no requirement states it, and an algorithm, standard or external document the spec relies on without naming its source, is each a question now.** On `wf_de4bfd27-d8a` a code-length bound sat in Assumptions as an unresolved clarification "to be confirmed … before /speckit-plan". The plan, the data model and a migration task all carried a working value, and analyze stopped because no edit to any of them could settle it. On `wf_e68e4e48-4ed` the spec assumed a citizen-number control digit whose algorithm was "confirmed at plan stage". The plan found no published algorithm, review-plan stopped, and the owner's answer was that none exists. On `wf_bc7b0f7c-ce6` a bound was attributed to a confirmation that the Clarifications section did not record. Silence of the same kind was behind `wf_cc5b26f9-e4b`, whose stop the run ledger attributes to a workflow defect since fixed: readings the plan had to settle — list per set or across sets, a page capped at 500 — stood unanswered until the owner confirmed them after eight wall-green phases. The default is to leave the value for the plan, since the plan will pick a sensible one. It lost because a value the plan picks is carried by every artifact derived from it, and whenever the author later changes it the run restarts at `plan`. The reader cannot verify an external fact, so it asks for the source document; it never supplies the fact itself. If unanswered: **review-plan or analyze stops**, or, since 2026-09-24, tasks or converge stops where it would once have written a task that waits on the author.

### A success criterion without its measurement conditions

**Every success criterion states the quantity, the scale, the conditions it is measured under and what witnesses it. A time bound says which percentile, how many concurrent callers, warm or cold, and on what machine. A multiplier says which dimension it multiplies. A bound on a person's manual work says it is not a timing gate.** On `wf_fbb2141f-8bf`, "one page … in under 1 second at 1,000 companies" gave no percentile, concurrency, warmth or hardware, so analyze called it not assertable. On `wf_6e72f3dd-930`, "ten times those amounts" supported two readings with a tenfold difference in rows, and "under 3 minutes" was not a measurable bound for this feature. The default is to let the plan fix an operational reading. It lost because that reading then lives in the plan and the tests, not in the spec, and analyze reports the gap as a spec change. The review-spec stage graded a criterion with no measure as major. If unanswered: **analyze stops.**

### Search, filter and list semantics left to the contract

**A requirement that finds, searches, filters or lists states its case sensitivity, its match position (prefix, substring, exact), the query-length bound, the outcome of a blank or whitespace-only query, the page bound, the order, and whether the listing crosses a grouping.** On `wf_bc7b0f7c-ce6`, "found by part of its code, name or registration number" stated none of the first three; the plan and contract settled them, and analyze stopped because the requirement was not testable on its own. On `wf_6e72f3dd-930` the spec listed a blank query as an edge case and gave no outcome. The session answered it from the sibling specs and their shipped code. The default is to delegate these to the API contract. It lost because the contract is written by the run, and a requirement whose meaning lives in a run-written file is one the run's own gates cannot test against. If unanswered: **analyze stops.**

### A guarantee without its conditions, an edge case without its outcome

**Every "exactly once", "never", "always" or "0 missing" states the conditions it holds under, and every listed edge case states its outcome.** On `wf_e4e27b83-bc3`, "each value appears exactly once" was unqualified, while a keyset walk over a key that can be edited can miss or repeat a row. The spec's own edge case, paging while a record is edited, gave no outcome. The default is to read an edge case as a note for the plan. It lost because an edge case without its outcome is a decision the plan makes and analyze then reports as the spec's. If unanswered: **analyze stops.**

### Requirements that disagree, repeat or cite the wrong id

**Quote both sides of every pair of requirements, scenarios or criteria that cannot all hold. Report every rule stated by several requirements, and every cross-reference that cites an id which does not say what the citing text claims.** On `wf_fbb2141f-8bf`, FR-009 said no company may be narrowed or hidden from an authorised user, while FR-011 and FR-013 made the default result active-only. On `wf_e4e27b83-bc3`, FR-010 said a deactivated value must be reactivatable, unconditionally, while the uniqueness rules left open whether an inactive row still holds its sort and range, so a plan could make reactivation refusable. On `wf_6e72f3dd-930`, FR-041's normative sentence named "the riskiest" classification without saying whether the open bound had to hold the highest sort. On `wf_de4bfd27-d8a`, three requirements restated one rule and could only be mapped to the same tests. On `reference-data` 003, FR-010 cited FR-021 as the uniqueness rule for every registry, but FR-021 covers only member codes within a set; a session's resolution edit had introduced the citation, and it surfaced at the `wf_cc5b26f9-e4b` stop. The default is to reconcile the pair in the plan with a sentence saying it is not a conflict. It lost because analyze then reports that sentence as the only thing holding the pair together. If unanswered: **analyze stops, or review-plan stops** when the plan cannot realise both halves.

### Residue of a clarify answer

**For every answer under Clarifications, search the whole spec for text that still holds the reading the answer replaced: scenarios, edge cases, success criteria, the independent-test lines, Assumptions. Also check that every decision the spec attributes to a clarification has its entry there.** Clarify writes each answer into the section it integrates and leaves the rest of the spec as it was. On `wf_115f053c-900`, a clarification made FR-008 accept a company code on its shape alone. FR-025, SC-002, scenario 2.7 and one independent-test sentence still demanded a refusal for an unknown or inactive company, and review-plan stopped because no plan could satisfy both. On `wf_a6f3b709-43a`, a scenario and an edge case still called a deactivated classification's range "free" after the session's own clarification had made that range held. The default is to trust that clarify integrated its answer. It lost twice on the record. This is also why the check is worth running a second time after the answers land (*Where the list goes, and what the author does with it*). If unanswered: **review-plan or analyze stops.**

### A conflict with a sibling spec

**Report every requirement or criterion that contradicts another feature's `spec.md`, quoting both with their feature prefix. Also report a question a sibling spec already answers for the same subject, where this spec neither follows that answer nor states that it departs from it.** On `wf_a6f3b709-43a`, 003/SC-009 required every option list to come from the registry, while 005/FR-006 fixed its own per-level unit types. Analyze stopped, and the item went to the owner because it changed one of two specs. On `wf_6e72f3dd-930` the blank-query outcome was settled by 001 and 002, which already refused it. The default is to read the spec alone. It lost because a conflict between two specs is invisible from inside either one, and neither clarify nor the checklist opens the other. If unanswered: **analyze stops.**

### A conflict with the constitution

**Report every requirement that violates a constitution article, and name the article. Also report a requirement that needs an article amended in order to be built.** The review-spec stage graded this blocking. On `wf_cc1aa65d-148` that stage ended on exactly this kind of decision: articles written by one feature about tables another feature owns. `build-feature`'s review-plan reads the constitution and returns such a finding as a spec change. The default is to leave the constitution to the plan's Constitution Check. It lost because the plan can only record the conflict, and the remedy is the author's or the constitution owner's. If unanswered: **review-plan stops.**

### A header the build contradicts

**Report a spec header whose Branch line names a branch other than the one the build will use, and a Status that still reads Draft at sign-off.** `build-feature` builds on `feature/<feature directory name>` unless a branch is passed or already exists. On `wf_de4bfd27-d8a` and `wf_e4e27b83-bc3` a stale Branch line and a Draft status were each returned as a spec change beside the larger items. These are LOW items, and they are listed for the reason given in *Grade by what a run would do, and drop nothing*. If unanswered: **part of an analyze stop.**

## How each question is written

**Each question carries, in this order: the spec text it concerns, quoted verbatim with its section and requirement id or line; the question; the readings the text leaves open; any text of the constitution or a sibling spec that already decides it, quoted; and what a run does if the question is left unanswered — the stage that stops, and that a spec change afterwards restarts the run at `plan`. It never carries the replacement sentence, and it picks none of the readings.** Write the questions in the language the spec is written in, because the domain expert answers them. A quotation keeps the spec's own language whatever language the question is in.

The default is the one the review-spec stage and the analyze agents followed: name the concrete edit that resolves each finding. It lost because a proposed edit is a decision. An author who accepts it unchanged has signed text the checker wrote, which is the review-spec stage writing the spec at one remove. On `wf_e68e4e48-4ed` the assumed fact was simply false. The author, not the checker, was the one who knew that. Quoting the constitution or a sibling spec is different, because it states a fact about text that already exists, and the author weighs it.

(Check: every question in `READINESS.md` holds a verbatim quotation of `spec.md` that `grep -F` finds in the file, and an *If unanswered* line — *convention*.)

## Grade by what a run would do, and drop nothing

**Grade each question by its predicted consequence — the build stage that would stop on it, or *no stop predicted* with the reason — and not on a CRITICAL-to-LOW scale. List every question. Order them by the stage that would stop first, and put the *no stop predicted* ones last. This check stops nothing: it is advisory to the author, who decides which questions to answer.** A question the author declines is recorded as declined with a reason, not deleted.

This is this skill's answer to the owner's open question, whether a MEDIUM or LOW spec finding should stop a run at all, within its own scope. Here, nothing stops, so a LOW question costs the author one line. Dropping LOW questions would hide the kind of thing a build currently stops on: `build-feature` stops on any finding whose only remedy is a spec change, of any severity. Its `specChanges` exits filter on nothing, and LOW header items were part of two of the eight stops. Whether `build-feature` should keep stopping on a LOW spec finding is that skill's question, and it stays the owner's.

The default is a severity floor that leaves out minor items, the review-spec stage's *approve with only minor findings*. It lost because the build it feeds has no floor on spec changes.

(Check: `READINESS.md` groups its questions under the stage headings named in *Where the list goes, and what the author does with it*, and holds a *No stop predicted* group, which may be empty — *convention*.)

## Where the list goes, and what the author does with it

**The reader writes `<featureDir>/READINESS.md`, replacing any earlier one. Its header records the date, the `git hash-object` of `spec.md` as it was read, the sibling specs it read, and whether the reader was a subagent or a separate session. The reader commits nothing. The author answers each question with an `Answer:` line, either "answered in spec, Clarifications session <date>" or "left as written: <reason>", and commits `READINESS.md` together with the spec at sign-off.** A file in the feature directory, rather than a chat reply, because its absence at the commit a build starts from is the evidence that the check did not run. A separate file, rather than a section of the spec, because the spec is never touched.

The reader does not commit because the author is working on the base branch, often with uncommitted spec edits, and a commit there is the author's to make. The author has to commit the file or remove it before the build: an untracked `READINESS.md` is a dirty tree, and `build-feature` preflight refuses on a dirty tree. So the file cannot be left lying around by accident. The recorded hash makes a stale list detectable: if `git hash-object <featureDir>/spec.md` at the build's starting commit differs from the header, the spec changed after the check.

```
# Readiness — <featureDir>
Read <date> by <subagent | separate session>; spec.md <git hash-object>; siblings read: <list>

## Preflight would stop
## Review-plan would stop
## Tasks would stop
## Analyze would stop
## Converge would stop
## No stop predicted

### Q<n> — <class>
> <verbatim spec text> (<section>, <requirement id or line>)
<question>
Readings left open: <each>
Already decided by: <quoted constitution or sibling text, or "nothing found">
If unanswered: <stage> stops; a spec change afterwards restarts the run at plan
Answer: <left for the author>
```

**After the answers land, run the check once more, and once only.** The second run is the residue check applied to the answers the author has just written. Commit the answered first list before the second run, so that the second run's replacement leaves the first list in git. A third run is the author's call. The check does not loop, because the review-spec stage's loop had no fixed point.

(Check: at the commit a build starts from, `<featureDir>/READINESS.md` exists, the hash in its header equals `git hash-object <featureDir>/spec.md` at that commit, and every question carries an `Answer:` line — *convention*. Each step is one shell command, and nothing runs them.)

## What this skill does not do

**It does not edit the spec, answer a question, or run clarify.** The author answers through `/speckit-clarify` (at most five questions per session, clarify's own cap) or by editing the spec directly. **It does not gate the build.** `build-feature` does not read `READINESS.md`, and no stage of it is told to. A preflight line that compared the header hash with the spec would be the host for the one mechanisable check above, and moving the stop into the build that way is the owner's decision, not this skill's. **It reads no plan and no code**, so a spec that contradicts code already shipped is found at review-plan, as before. The exception is where a sibling spec states the same rule. **It verifies no external fact**: it asks for the source. **It does not predict every stop**: the classes are the causes observed in eight stops on four features in two repositories, 2026-09-21..23, not a complete list of what a spec can lack. A stop from a class not listed here is a new class, to be added with its run id. **It says nothing about a spec edited after the check**, beyond the hash mismatch. On a hand-run `/speckit-plan` with no `build-feature`, the same questions apply, and the consequence of leaving one open is that the plan decides it and nothing reports that it did.

**Firing:** meant to be invoked by name (`/spec-readiness`). Measured unprompted too: it fired on 6 of 6 sessions, two prompts at three repeats each, in first-move mode (only the skill tool permitted), `claude-opus-5-5`, Claude Code 2.1.281, linux, 2026-09-24. That is a rate for that model, CLI and fixture, not for a real session that can read the repo before it chooses. **Whether it prevents any stop is unmeasured**: the eight stops are the ground it was written from, not a validation of it. The first `build-feature` run whose spec went through this check, and did not stop on a spec change, is the first data point. The grounds for every claim above, with dates and markers, are in [evidence.md](evidence.md).
