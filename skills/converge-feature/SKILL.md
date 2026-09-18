---
name: converge-feature
description: Run the converge ⇄ implement loop alone against a spec-kit feature that already has its artifacts and is already implemented, until nothing converge reports is above LOW severity — one Workflow call into build-feature's script from converge to finish, with no loop of its own and no /loop. ALWAYS load when asked to converge, finish, close out or wrap up an already-implemented feature, to loop converge and implement until nothing is left, or to run /speckit-converge more than once; invoke it by name (/converge-feature).
---
# Converge a feature — the loop alone, against work that already exists

**Premise, shared with every skill in this set:** the code is written by LLM agents and no human reads it line by line. The consequence for a feature that is already implemented is that *is it done* is a question `/speckit-converge` answers by reading the code against the spec, plan and tasks — and on the one run that measured it (2026-09-18) the answer kept changing: converge has no fixed point, each pass finds what the previous implement did not, and the loop ends at a written severity floor or it does not end. This skill is a named entry point to that loop. It runs `build-feature`'s script from its converge stage, and nothing else.

## Call build-feature's script; write no loop

**Call the Workflow tool with `build-feature`'s `workflow.mjs`, reached as a sibling of this skill's directory, with `from: "converge"` and `until: "finish"`, and run no `speckit-*` skill from your own context.**

```
Workflow({
  scriptPath: "${CLAUDE_SKILL_DIR}/../build-feature/workflow.mjs",
  args: { featureDir: "specs/001-product-hierarchy", branch: "main",
          wall: "node backend/scripts/wall.mjs",
          from: "converge", until: "finish" }
})
```

`build-feature` installed beside this skill is a precondition, not a suggestion: this skill ships no script, because one loop exists and it is that one. A workflow starts only from a script the session may read, so a user-level install under `~/.claude/skills/` needs that directory added first — `/add-dir` with the same path, or a `Read` allow rule — where a project-level install under `.claude/skills/` needs nothing; the same "cannot read" refusal with `build-feature` sitting beside this skill on disk means that missing permission and not a missing install. A missing sibling fails loudly at the same Workflow call — the tool refuses a `scriptPath` it cannot read — and the fix for that case is `npx skills add dulguun0225/skills`, which installs both. `featureDir` is the feature's spec-kit directory, `branch` the branch it lives on. **`args.wall` is required on any start after preflight**, this one included: preflight is the stage that reads the definition-of-done command from the project's `CLAUDE.md`, and a run that skips it would hand every prompt the string `null` as the command — the script refuses to start without it (defect observed 2026-09-17, recorded in `build-feature`). A run interrupted mid-loop resumes with `resumeFromRunId`, which replays every finished agent from its journal and picks up at the round it was in. Every other `build-feature` argument applies unchanged, with its default: `maxConvergeRounds` 6, `maxWallAttempts` 3, `push` **default true** — so the example above, on `branch: "main"`, has finish push `main` directly; pass `push: false` where that is not wanted — `mergeInto` **default none**, so nothing is merged unless a branch is named, and `tiers`. The loop's stop rule, its tier table and its exits are `build-feature`'s and are stated there, not here.

The default an agent reaches for is `/loop`: *Run /speckit-converge then /speckit-implement until converge appends nothing*, retyped into the session. Rejected 2026-09-18 against the `001-product-hierarchy` run this skill is written from, on three grounds. The stop condition is re-judged by feel each tick rather than written down — that run took five passes, and the fifth appended nothing only because the operator had stopped applying findings below the floor; the script writes the rule (stop when the assessment grades nothing above LOW) and logs which round's assessment ended the loop. Each tick re-enters the main context, so nothing is journalled or resumable and the subagents it spawns inherit the session's model rather than the stage's tier — converge on Opus medium, implement on Opus medium, phases on Sonnet low, every row checked against the roster before the first agent starts. And it is a sentence retyped per feature and per project, which is the shape this whole skill set exists to replace.

(Check: the session's tool calls hold one `Workflow` call whose `scriptPath` ends in `build-feature/workflow.mjs` with `from: "converge"`, and no `Skill` call to `speckit-converge` or `speckit-implement` and no `loop` from the main context — *convention*, 2026-09-18.)

## What this skill does not do

It does not specify, plan, review or analyze: a feature that lacks `spec.md`, `plan.md` or `tasks.md`, or whose tasks are largely unchecked, is `build-feature`'s with `from` set to the first missing stage, and running this skill on it makes converge append the whole feature as one phase. It does not decide when the loop stops or what a round may cost — `build-feature` does, in its script and its tier table, and a change to either is made there once rather than here. It does not run without `build-feature` on the same disk. It has no measured cost: the run it is written from was driven by hand, and the first scripted run of the converge stage at the severity floor is the measurement.

**Status: *decided, not yet validated*** — written 2026-09-18 from one hand-driven converge ⇄ implement run of five passes; no feature has yet been converged by invoking this skill. **Firing:** meant to be invoked by name (`/converge-feature`); whether the description earns the load on "finish this feature" or "converge until nothing is left" is unmeasured. Grounds and dates in [evidence.md](evidence.md).
