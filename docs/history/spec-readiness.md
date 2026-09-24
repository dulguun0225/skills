# spec-readiness — authoring record

**Published 2026-09-24.** Owner's decision the same day: a read-only check of a spec-kit `spec.md` that the domain expert runs after `/speckit-clarify` and before handing the spec to `/build-feature`. It returns questions for the author, never edits the spec, and ships as its own skill in this repo. The three placements the backlog row weighed were stock spec-kit, a new skill, and `build-feature`'s preflight. The owner chose the new skill; preflight was rejected because it moves the stop before plan rather than preventing it.

## What the pass decided, and on what

- **Classes from the handoffs, not from the backlog summary.** The eight `HANDOFF.md` files the run ledger's sweep 2 marks target **S** were read in full from git, read-only (`git show <sha>:<path>` in `reference-data` and `customer-party-adapter`). They hold 18 items (counted 2026-09-24). Each item was placed in a class, and each class is a `###` directive in the skill: deferred or assumed value, bound or fact; success criterion without measurement conditions; search, filter and list semantics; guarantee without conditions and edge case without outcome; requirements that disagree, repeat or cite the wrong id; clarify residue; sibling-spec conflict; header the build contradicts. There are two further classes without an item among the eight: markers and placeholders (already a preflight refusal) and the constitution conflict (the owner's request, grounded on the review-spec record). The 003 `RESOLUTIONS.md` supplied the citation-drift instance and the `wf_cc5b26f9-e4b` readings.
- **The removed review-spec stage was recovered from `9e91cdf^:skills/build-feature/workflow.mjs`.** Kept: the fresh-context refutation stance, the full reading of spec, checklist and constitution, and the exact location on every finding. Dropped: the fix prompt that wrote `spec.md`, the round loop (6 → 3 → 1 blocking on `wf_cc1aa65d-148`, no fixed point), the upstream source-faithfulness items (that layer left the service repos 2026-09-21), and "the concrete edit that resolves it".
- **Output: `<featureDir>/READINESS.md`, written by the reader and committed by the author.** A file in the feature directory rather than a chat reply, so that its absence at the build's starting commit is visible. The reader commits nothing, because the author is on the base branch. The file cannot be left untracked by accident: `build-feature` preflight requires `git status --porcelain` to be empty (verified in `workflow.mjs`, 2026-09-24). The header records the spec's `git hash-object`, so a stale list is detectable by one command.
- **Severity: graded by predicted stop, nothing dropped.** `specChangesOf` in `workflow.mjs` filters on nothing, so `build-feature` stops on a spec-only finding of any severity. LOW items were among the spec changes of four of the eight stops. The owner's open question, whether a MEDIUM or LOW spec finding should stop a run, is answered only inside this skill's scope: nothing here stops, and every question is listed. Whether `build-feature` should stop on LOW is still the owner's question, on the backlog row.
- **Questions carry readings, never the replacement sentence.** On `wf_e68e4e48-4ed` the assumed fact was false, and only the owner knew that.
- **One re-run after the answers, then stop.** It catches residue of the new answers. The loop limit is there because the review-spec loop had no fixed point.
- **`new-java-backend` not edited.** Its body does not describe the spec sequence, and its own directive bans naming a `/speckit.*` command as a next step. A sentence naming spec → clarify → spec-readiness → build-feature there would contradict it. The sequence lives in `README.md`, *Starting a new Java project*, step 3.

## Cost and firing

- **Frontmatter: 87 tokens** (name 3, description 77, framing 7), `npm run tokens:frontmatter`, 2026-09-24. Set total 1,842 across the twenty-four skills on that date. **Description: 329 chars**; set total 7,614 / 8,000 by `npm run check:descriptions`, up from 7,285.
- **Body: 5,712 tokens per firing**, `npm run tokens`, o200k_base, 2026-09-24.
- **Firing: 6/6**, cases `spec-readiness-1` and `spec-readiness-2`, three repeats each, first-move mode, `claude-opus-5-5`, Claude Code 2.1.281, linux, 2026-09-24T12:59Z, $1.08. No other skill fired in any of the six, `build-feature` included. The cases run in a new `speckit` fixture (a constitution, two specs, `.specify/feature.json`), added to `scripts/firing-harness.mjs` with the cases, so no existing baseline restarted. Not measured: explore mode, any other model, any real consumer session.
- **Harness change on the way.** The first attempt was refused by the preflight: CLI 2.1.281 exposes `ListAgents` and `Monitor`, which `DENIED` lacked. No case session had been spent. Both were added. This is the guard of 2026-08-03 working as written.
- **Worth loading?** It fires once per feature, at sign-off, plus once per re-run; ten features in three repositories appear in the run journals over 2026-09-17..24 (`npm run runs -- --since 2026-09-17 --json`). Against that, 87 tokens in every session is small. The trade the harvest rule asks about is unmeasured, since no spec has been through the check.

## Sweep

- `README.md`: row in *What is published*; step 3 of *Starting a new Java project* now names `/spec-readiness` between clarify and plan.
- `CLAUDE.md` *History* list: the line for this file is owed. It was not written in this pass because the pass was run by a subagent, and a `CLAUDE.md` edit needs the owner.
- Owed in files this pass was told not to touch, handed back with exact text: `build-feature/SKILL.md` (the author's step before the run) and `build-feature/evidence.md` line listing "a spec-readiness pass the author runs before sign-off" under *decided and not applied* (now published); the backlog row *Spec readiness before sign-off*.
- Grep over `skills/*/SKILL.md`, `README.md` and `CLAUDE.md` for sentences saying no spec check exists: none outside `build-feature`. `build-feature/SKILL.md`'s status line says the run has "no spec review", which is still true of the run and is left alone.

## Not reviewed

No adversarial review has been run on this skill. The directive text was checked against the handoffs by the pass that wrote it. That is the shape this repo's *follow the pointer* class records failing.
