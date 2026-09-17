---
name: build-feature
description: Build one spec-kit feature end to end with no human gate — one Workflow script runs specify, clarify, plan, tasks, analyze, implement and converge as fresh subagents, each on the model and effort its stage earns, with a fresh-context refutation review in place of every human gate and a converge loop that ends only when nothing is left to build. ALWAYS load when asked to build, implement or ship a feature from a spec or an upstream spec document unattended, or to run the spec-kit cycle from specify through implement; invoke it by name (/build-feature).
---
# Build a feature — the spec-kit cycle with no human gate

**Premise, shared with every skill in this set:** the code is written by LLM agents and no human reads it line by line. The consequence for a feature is that the human gates spec-kit puts between its commands — *review the spec before planning*, *review the plan before tasks* — are the last place a person reads anything, and on 2026-09-16 both of them found blocking defects only because the reviewer was a fresh context, not a person. This skill keeps the fresh context and drops the person: one deterministic script, one subagent per stage, a refutation review where each gate was, and a loop that ends when converge finds nothing.

## Run the workflow; orchestrate nothing yourself

**Call the Workflow tool with this skill's script and the two inputs the user supplies, and run no spec-kit command from your own context.**

```
Workflow({
  scriptPath: "${CLAUDE_SKILL_DIR}/workflow.mjs",
  args: {
    source: "Create a feature spec from <path to the upstream spec, or the description>",
    shortName: "<spec-kit short name, e.g. product-version>"
  }
})
```

`${CLAUDE_SKILL_DIR}` is the directory this file is in; Claude Code substitutes it. A workflow starts only from a script the session may read, so a skill installed outside the working directory (a user-level install under `~/.claude/skills/`) needs that directory added first — `/add-dir` with the same path, or a `Read` allow rule — where a project-level install under `.claude/skills/` needs nothing. From a terminal, with no session open, the same run is `claude -p "/build-feature <source> shortName=<name>" --permission-mode bypassPermissions`; the session that dispatches can be the cheapest model, since it does nothing but this one call, and it stays open until the workflow ends (the idle ceiling is `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS`).

Optional `args`, all with a default: `baseBranch` (preflight refuses to start on any other branch), `wall` (the definition-of-done command; when absent, preflight reads it from the project's `CLAUDE.md`, which names it), `planGuidance` and `tasksGuidance` (passed to `/speckit-plan` and `/speckit-tasks`), `push` (default true), `mergeInto` (fast-forward that branch when converged; default none), `maxReviewRounds` 2, `maxAnalyzeRounds` 2, `maxConvergeRounds` 3, `maxWallAttempts` 3, and `tiers` (below). To restart a feature that already has artifacts, pass `featureDir`, `branch` and `from` (one of `preflight`, `specify`, `clarify`, `review-spec`, `plan`, `review-plan`, `tasks`, `analyze`, `implement`, `converge`, `finish`); `until` bounds a run the same way. A run that was interrupted resumes with `resumeFromRunId`, which replays every finished agent from its journal.

The default an agent reaches for is to run `/speckit-specify` itself, read the result, decide it is fine, and continue — the human gate moved into the orchestrator's own context, where the reviewer that approves the spec is the context that wrote it. Rejected, 2026-09-16: two fresh-context reviews found a constitution lagging the plan, a test-property precedence error and an ArchUnit scope error that the writing context had approved. The previous entry point, `specify workflow run speckit`, is rejected too: its gates read a terminal and pause without one, its `model` is per step but effort is not (the Claude integration rejects per-step `integration_args`; the only extra-flag path is one process-wide environment variable), and its command steps capture no output, so nothing in it can loop on what converge reports.

(Check: the session's tool calls hold one `Workflow` call and no `Skill` call to a `speckit-*` skill from the main context — *convention*, 2026-09-17.)

## Each stage runs on the tier it earns

**Take the model and effort of every stage from the `TIERS` table in `workflow.mjs`; change a row for one run with `args.tiers`, never by editing the table.** The aliases resolve to the newest model of each line; effort is one of `low`, `medium`, `high`, `xhigh`, `max`.

| Stage | Tier | Why this tier |
|---|---|---|
| preflight, phases, finish | Sonnet low | shell commands and parsing; the return value is a list of facts |
| specify, clarify, fix-spec | Opus medium | transcribes a written source into the template and records decisions; the review behind it catches what it misses |
| review-spec, review-plan, converge | Fable high | the refutation that stands in for the human; it reads far more than it writes, so its cost is bounded by reading |
| plan | Fable xhigh | the one decision-heavy pass; every later stage inherits its errors |
| fix-plan, remediate (critical) | Fable medium | edits that may reach the constitution |
| tasks, analyze, remediate | Opus medium | decomposition and cross-checking of artifacts a stronger tier already reviewed |
| implement, one agent per phase | Fable medium | a bounded context per phase; the wall is the check, and effort here buys fewer red-wall retries |

The default is one model for the whole run — the session's. Rejected because the run is dominated by reading and shell output, where the tier changes the price and not the result, while the three stages that decide (plan and the two reviews) are a small share of the tokens and the whole of the quality.

(Check: the run's progress tree labels every agent `<stage> (<model> <effort>)`; an agent whose label carries the session default is the finding — *convention*, 2026-09-17.)

## A gate is a fresh-context refutation, not a human

**Where spec-kit pauses for approval, a review agent with no memory of the writing is prompted to refute the artifact and returns findings as data; a fix agent applies them; the review runs again; blocking findings still open at the round cap end the run as `needs-human` with the findings attached.** Review-spec reads the upstream source, the spec and the constitution and reports every source requirement without a counterpart, every contradiction, every invented requirement, every untestable one and every leftover marker. Review-plan reads the spec, every plan artifact, the constitution, the project rules and the code the plan touches, and reports every requirement no design element realises, every gate or article the design violates, and every contract that contradicts the schema. A verdict of approve with only minor findings applies the minors once and does not re-review.

(Check: the workflow's return value is `status: "done"` only when every loop's last verdict was clean, and `status: "needs-human"` with the stage and the findings otherwise; the script has no third exit — *bespoke*, `workflow.mjs`.)

## Analyze goes back to the artifact it names; converge goes back to implement

**A finding is resolved by editing, in place, the artifact it names — never by re-running the command that generated that artifact.** `/speckit-analyze` finds coverage gaps, contradictions and constitution violations across spec, plan and tasks; the remediation agent adds tasks with new ids for a coverage gap, changes the plan or the spec for a violation, and touches the constitution only when the finding says the constitution is what is wrong; then analyze runs again. `/speckit-converge` appends one phase of tasks; the next implement agent runs that phase alone; converge runs again, until it reports converged or the cap is reached. Re-running specify, plan or tasks is rejected because each regenerates its file whole and discards every review fix that came before.

(Check: the feature branch's `git log` carries `spec: review round N`, `plan: review round N`, `tasks: analysis round N` and `tasks: convergence round N` commits and a second `/speckit-plan` run appears nowhere — *convention*, 2026-09-17.)

## Unattended means the agent decides by a written rule

**Every question a speckit skill would put to a person is answered by the rule in that stage's prompt, and the answer is written into the artifact.** Specify resolves each `[NEEDS CLARIFICATION]` from the source, otherwise takes the most conservative option and records it under `## Assumptions`. Clarify plays both roles: it generates its question queue and answers each in this order of authority — what the source states, what the constitution requires, what the code already does, else the skill's own recommendation — and records every pair under `## Clarifications`. Implement proceeds past an unchecked checklist and lists the items. Analyze returns findings instead of offering remediation. A stage that has to ask stops the run: that is the `needs-human` exit, and it is the only one.

(Check: a `[NEEDS CLARIFICATION]` or template placeholder left in any artifact is a blocking finding of the next review, so it cannot survive to implement — *bespoke*, the review prompts in `workflow.mjs`.)

## What this skill does not do

It does not install spec-kit or its skills; preflight fails when `speckit-specify` through `speckit-converge` are missing under `.claude/skills/`. It does not choose the definition of done: the project's `CLAUDE.md` names the command, or `args.wall` does. It does not merge unless `mergeInto` says where, and it never opens a pull request. It runs its stages in sequence — a feature's artifacts are one dependency chain and nothing in it is independent enough to fan out. It is Claude Code only: the Workflow tool, the `${CLAUDE_SKILL_DIR}` substitution and the per-agent model and effort are that client's, and the portable part — the stage prompts and the loop — is readable in `workflow.mjs` for anyone porting it. It has no measured cost yet: the one run it is modelled on took a working night with a person at the gates, and the tier table is a decision, not a measurement. It removes the one gate the rest of this set assumes a person reads — the plan, the last cheap moment a wrong decision is caught — and puts the review-plan refutation there instead; a person who wants that read runs with `until: "review-plan"`, reads the plan, and continues with `from: "tasks"` and the same `featureDir`.

**Status: *decided, not yet validated*** — written 2026-09-17 from one hand-driven run of spec-kit's own workflow; no feature has yet been built by this script end to end. **Firing:** meant to be invoked by name (`/build-feature`); whether the description earns the load on "build this feature from the spec" is unmeasured. Grounds and dates in [evidence.md](evidence.md).
