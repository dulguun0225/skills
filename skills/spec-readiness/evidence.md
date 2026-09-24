# Spec readiness — evidence

For a person deciding whether to trust the directive text. Written 2026-09-24, the date of the owner's decision and of the first read of the eight handoffs. No research pass and no refutation panel stands behind any of it.

## Provenance

| Source | What was read | How |
|---|---|---|
| Eight `HANDOFF.md` files, one per stop | the *What the stage reported* section of each, in full | `git show <sha>:<path>` in the service repository, read-only, 2026-09-24 |
| The run ledger, sweep 2 (2026-09-24), per-stop table | the cause, earliest stage and target of each of the 35 stops on record; group 3, *the spec already held the question* | read in the repository these skills distribute from |
| `reference-data` `specs/003-constant-registry/RESOLUTIONS.md` | how the launching session resolved the 003 stops, and on what grounds | `git show HEAD:<path>`, read-only |
| `build-feature`'s `workflow.mjs` before 2026-09-21 (`9e91cdf^`) | the review-spec stage's reviewer and fixer prompts | `git show` in the repository these skills distribute from |
| `build-feature`'s `workflow.mjs` and `evidence.md` at 2026-09-24 | preflight's dirty-tree rule, `specChangesOf`, the review-spec record of 2026-09-17 | read |
| Stock spec-kit 1.0.8 `speckit-clarify` and `speckit-checklist` skills, as installed in `reference-data` | the five-question cap; which files each loads | `grep` over the installed `SKILL.md` files |

The eight stops, with the handoff commit each was read from:

| Run | Date | Repository, feature | Stage | Handoff commit |
|---|---|---|---|---|
| `wf_de4bfd27-d8a` | 2026-09-21 | `reference-data`, 001-company-registry | analyze | `620e54a` |
| `wf_bc7b0f7c-ce6` | 2026-09-22 | `reference-data`, 001-company-registry | analyze | `0bfcb47` |
| `wf_fbb2141f-8bf` | 2026-09-22 | `reference-data`, 001-company-registry | analyze | `5935a86` |
| `wf_115f053c-900` | 2026-09-22 | `reference-data`, 002-branch-registry | review-plan | `c25ad10` |
| `wf_e4e27b83-bc3` | 2026-09-22 | `reference-data`, 003-constant-registry | analyze | `fc4c90f` |
| `wf_6e72f3dd-930` | 2026-09-22 | `reference-data`, 003-constant-registry | analyze | `94a3842` |
| `wf_a6f3b709-43a` | 2026-09-23 | `reference-data`, 003-constant-registry | analyze | `a28087c` |
| `wf_e68e4e48-4ed` | 2026-09-23 | `customer-party-adapter`, 001-party-registry | review-plan | `cfc16bb` |

Dates are the journal's UTC day. The 003 `RESOLUTIONS.md` dates some of the same stops a day later, in local time.

## Run it after clarify, in a fresh context

The fresh-context premise is `build-feature`'s: on 2026-09-16 two fresh-context reviews found a constitution lagging the plan, a test-property precedence error and an ArchUnit scope error that the writing context had approved (that skill's evidence, 2026-09-16). That is one observation. It is not a measurement that fresh-context review of a *spec* finds more.

Every one of the eight specs had been through `/speckit-clarify` before its run: each of the four features' `spec.md` carries a `### Session 2026-09-21` block under Clarifications at the handoff commit of its first stop (checked 2026-09-24 at `620e54a`, `c25ad10`, `fc4c90f` and `cfc16bb`). Stock `speckit-clarify` 1.0.8 states "Maximum of 5 total questions across the whole session" and loads `.specify/memory/constitution.md`. Neither it nor `speckit-checklist` references any other directory under `specs/`, by `grep` over both installed `SKILL.md` files, 2026-09-24. *Primary-source verified* for spec-kit 1.0.8 only. A later spec-kit may read more.

The tier sentence names `build-feature`'s review-plan row as it stood on 2026-09-24. It follows that table, and the row can move.

## Read the spec, the constitution and the sibling specs, and write only the list

The review-spec reviewer prompt, recovered from `9e91cdf^`, opened: "You are a fresh-context reviewer with no memory of how spec.md was written. Your job is to REFUTE the claim that it is a complete, faithful and testable specification of its source. Read-only: change nothing." It read the spec, `checklists/requirements.md` and the constitution in full, and required each finding to name "the exact location and the concrete edit that resolves it". **Kept:** the stance, the full reading, the exact location. **Dropped:** the source-faithfulness items (the upstream-provenance layer they checked was removed from the service repositories on 2026-09-21), the concrete edit, the fix prompt that applied findings to `spec.md` and committed `spec: review round N`, and the round loop.

Why the stage was removed, from `build-feature`'s evidence, 2026-09-21: the spec became an input the run may not write, "the one thing in the feature directory no agent of the run wrote, and therefore the only oracle the run's own gates can be refuted against". The loop record, from the same file: run `wf_cc1aa65d-148`, three spec-review rounds (6 → 3 → 1 blocking), 1.19M subagent tokens; and, over the seven launches of 2026-09-17, most findings at a cap were "holes opened by the previous round's fix".

Code and plan artifacts are left out by decision, 2026-09-24, *convention*. The cost is known: on `wf_6e72f3dd-930` the blank-query answer came from shipped `CompanyService` and `BranchService` code as well as from the sibling specs. This skill reaches that case only through the sibling specs.

## What the reader looks for

The classes are the item-level causes in the eight handoffs, grouped by what the author would have had to write. The sweep-2 table summarises each stop's cause in a single cell. The handoffs hold more than one item per stop: 18 items across the eight, counted 2026-09-24 and re-countable from the table above. Every item fits a class below. No class was added without an item behind it, except the constitution class, which the owner asked for and which rests on the review-spec record instead.

### Markers and placeholders the build refuses on

Not among the eight, because preflight already refuses on a marker (`build-feature`, *Unattended means the agent decides by a written rule*). The review-spec prompt graded "a [NEEDS CLARIFICATION] or template placeholder left in the spec" blocking.

### A value, bound or fact the spec defers or assumes

- `wf_de4bfd27-d8a` U1 [HIGH]: "the spec records the bound as an unresolved clarification to be confirmed by the domain owner before /speckit-plan, and no functional requirement states any bound, while plan.md R1, data-model.md and migration task T010 all carry ^[A-Z0-9]{1,10}$."
- `wf_bc7b0f7c-ce6` A2 [LOW]: the 1–10 code length is "attributed to a domain-owner confirmation of 2026-09-22, but the Clarifications section records only the 2026-09-21 session".
- `wf_e68e4e48-4ed` item 1: the citizen-number Assumption says "the control-digit algorithm is confirmed at plan stage"; "no published control-digit algorithm exists". The sweep-2 table records the owner's answer: there is none.
- `wf_cc5b26f9-e4b` (target W in the sweep, not S): T104 waited on the owner's answers to plan readings (a)–(d); the owner confirmed all of them on 2026-09-23 (003 `RESOLUTIONS.md`).

### A success criterion without its measurement conditions

- `wf_fbb2141f-8bf` A1 [MEDIUM]: SC-004 "states 'one page of list or search in under 1 second at 1,000 companies' with no percentile, concurrency, warmth or hardware condition, so it is not assertable as written."
- `wf_6e72f3dd-930` C1 [HIGH]: SC-004 "must say what 'ten times those amounts' measures" — 25,500 rows under one reading, 250,000 under the other.
- `wf_6e72f3dd-930` A3 [LOW]: SC-001 "'under 3 minutes' is not a measurable bound for this feature".
- The review-spec prompt graded "a success criterion with no measure" major.

### Search, filter and list semantics left to the contract

- `wf_bc7b0f7c-ce6` A1 [MEDIUM]: FR-013 "says a company is found by 'part of' its code, name or registration number without stating case sensitivity, match position or a query-length bound".
- `wf_6e72f3dd-930` A2 [HIGH]: FR-014 "must state the outcome of a blank or whitespace-only `q`"; resolved from 001, 002 and their shipped services (003 `RESOLUTIONS.md`).
- The page bound and the cross-grouping listing are T104 readings (a) and (b), `wf_cc5b26f9-e4b`.

### A guarantee without its conditions, an edge case without its outcome

- `wf_e4e27b83-bc3` U2 [HIGH]: "'each value appears exactly once' and '0 duplicated, 0 missing' are unqualified, but a keyset walk over the mutable key … can miss or repeat a row … and the spec's own edge case … leaves the outcome unstated."

### Requirements that disagree, repeat or cite the wrong id

- `wf_fbb2141f-8bf` A2 [MEDIUM]: FR-009 against FR-011 and FR-013, "reconciled only by SC-003's single sentence and by plan decision D-g".
- `wf_e4e27b83-bc3` U1 [HIGH]: FR-010 "states unconditionally that a deactivated constant MUST be reactivatable"; resolved by stating that uniqueness holds across all rows regardless of status (003 `RESOLUTIONS.md`).
- `wf_6e72f3dd-930` A1 [HIGH]: FR-041 and the non-binding word "riskiest".
- `wf_de4bfd27-d8a` D1 [MEDIUM]: FR-025, FR-026 and FR-027 "restate one rule … in three aspects".
- Citation drift, 003 `RESOLUTIONS.md` at the T104 stop: FR-010 cited FR-021, "This session's own error of that date"; SC-002 repeated FR-019's list.

### Residue of a clarify answer

- `wf_115f053c-900` finding 1: FR-008, FR-009, FR-031 and scenarios 2.4 and 2.6 accept a company code on shape alone, "while those four places still demand a refusal naming an unknown or inactive company".
- `wf_a6f3b709-43a` I1 [HIGH]: scenario 4.10 and the edge case call the range "чөлөөтэй" (free); the session's resolution notes that "the scenario was left behind by that edit".

### A conflict with a sibling spec

- `wf_a6f3b709-43a` C1 [HIGH]: "003 spec.md SC-009 vs specs/005-address-registry/spec.md FR-006: the owners of the two specs must decide which one yields." Taken to the owner, who narrowed 003/SC-009 on 2026-09-23.

### A conflict with the constitution

None of the eight. The ground is the review-spec prompt ("a requirement that violates a constitution article — blocking, and say which article") and `wf_cc1aa65d-148`, whose last blocker was "three Article VII articles written by 002 about tables 003 owns" (`build-feature` evidence, 2026-09-17). Kept because the owner asked for it on 2026-09-24. This is the class with the least ground: *convention*.

### A header the build contradicts

- `wf_de4bfd27-d8a` I2 [LOW]: "Branch reads feature/spec-v1 and Status reads 'Draft'".
- `wf_e4e27b83-bc3` F4 [LOW]: the header "names the branch `feature/spec-03-constant-register` … and Status still reads 'Draft — Ноорог'"; applied by the session (003 `RESOLUTIONS.md`).

## How each question is written

The fact that shows what a proposed answer can cost is `wf_e68e4e48-4ed`. The spec assumed a control-digit algorithm, the plan could not find one, and only the owner knew that none exists. By the sweep-2 record, the session's recommendations on the eight items taken to a person were all adopted, one then corrected by a fact only the owner held. That shows sessions recommend well. It does not show that a checker's proposed text is safe for the author to sign. The rule against writing the replacement sentence is the owner's decision (returns questions, never edits), made 2026-09-24, *convention*.

## Grade by what a run would do, and drop nothing

`workflow.mjs` at 2026-09-24: `const specChangesOf = r => (r && Array.isArray(r.specChanges) ? r.specChanges.filter(Boolean) : [])`, and every stage that returns it stops on a non-empty result. No severity is read. *Primary-source verified*, one reader. LOW items were among the spec changes of `wf_de4bfd27-d8a` (I2), `wf_bc7b0f7c-ce6` (A2), `wf_e4e27b83-bc3` (F4) and `wf_6e72f3dd-930` (A3). Whether any of those would have stopped a run on its own was not tested.

## Where the list goes, and what the author does with it

`build-feature` preflight, `workflow.mjs` at 2026-09-24: "`git status --porcelain` must be empty (untracked files under .specify/workflows/runs/ and .claude/worktrees/ do not count). A dirty tree is a problem and you stop there". So an untracked `READINESS.md` in the feature directory is a preflight refusal. *Primary-source verified* for that date. The author works on the base branch while the build runs (owner's decision, 2026-09-21, recorded in `build-feature`).

The once-only second run is a decision, *convention*: the residue class exists because clarify answers left residue twice, and the loop limit exists because the review-spec loop had no fixed point.

## What this skill does not do

What would reopen a decision here:

- A `build-feature` stop whose cause was in the spec before the run but fits no class above: add the class, with its run id.
- A spec that went through this check and still stopped on a class the check names: the reader missed it, and the finding is about the reading, not the class list.
- A second author, or a spec in another repository: every class comes from one team's specs in two repositories over three days.
- A spec-kit release whose clarify or checklist reads the sibling specs: re-check the default this skill overrides.

**Not to be cited as evidence that this skill works**: the eight stops. They are the ground it was written from. No spec has been through it.

| Claim | Marker |
|---|---|
| The eight stops' causes were in the spec text before the run | *primary-source verified* — one reader of the handoffs, 2026-09-24 |
| Clarify caps at five questions; neither clarify nor checklist reads sibling specs | *primary-source verified* — spec-kit 1.0.8, 2026-09-24 |
| `build-feature` stops on a spec change of any severity; preflight refuses on a dirty tree | *primary-source verified* — `workflow.mjs`, 2026-09-24 |
| A fresh context finds what the writing context approved | *convention* — one observation on plans, 2026-09-16 |
| The class list covers what a spec lacks | *uncertain* — eight stops, one team |
| Running this check prevents a stop | *uncertain* — never run |
| Every directive | *convention* — decided 2026-09-24, check is the written artifact |
