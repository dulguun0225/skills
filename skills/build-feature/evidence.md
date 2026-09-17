# Build a feature — evidence

For a human deciding whether to trust the directive text. Every claim below is *convention* — a decision recorded with its date and observed ground, no research pass and no refutation panel behind it.

## Run the workflow; orchestrate nothing yourself

The run this skill is modelled on, 2026-09-16 to 2026-09-17: `specify workflow run speckit` driven from inside a Claude Code session for the `002-product` feature of a Java backend, with the session answering both gates after spawning a fresh-context Opus review of each artifact. Both reviews found blocking defects the writing context had passed — the constitution lagging the plan, a test-property precedence error, an ArchUnit scope error — and each was fixed in the artifact and committed before the gate was approved. Timings from the engine's own log: specify 19 minutes, plan 29, tasks 11, implement 53; the tasks step exited 1 on a transient spend-limit error after writing a complete `tasks.md`, and the run was resumed by patching the engine's state file. A later `/speckit-converge` appended eight gate and documentation gaps as a ninth phase, all implemented; the second converge is expected to report converged.

What spec-kit's engine (specify-cli 1.0.7) can and cannot do, read from its source the same day: a `command` step carries `model`, passed as `--model` to `claude -p "/speckit-<stem> <args>"`; per-step `integration_args` and `integration_options` exist in the schema but the Claude integration inherits the base `validate_runtime_config`, which raises on any value, so `--effort` can only reach the child through `SPECKIT_INTEGRATION_CLAUDE_EXTRA_ARGS`, one value for every step of the run. A `gate` step returns `PAUSED` when stdin is not a TTY. A `command` step's stdout is not captured ("a planned enhancement" in its docstring), so a `while` step cannot be conditioned on what converge reported. A `shell` step could run `claude -p` with any flags, but then the engine contributes nothing the script here does not.

Alternatives weighed and rejected, 2026-09-17: a Node script driving `claude -p --model --effort` per stage from a terminal — the same control flow, re-implementing the resume, journal and progress that the Workflow tool already has, and needing its own permission and environment handling for the child sessions; and one orchestrating agent that invokes the speckit skills in its own context — the human gate moved into the writer's context, which is the failure the two fresh reviews caught.

## Each stage runs on the tier it earns

The Workflow tool's `agent()` takes `model` and `effort` per call (its authoring reference, read 2026-09-17), and the Agent tool's `model` accepts the aliases `sonnet`, `opus`, `fable`. The table is a decision from the shape of each stage's work, not a measurement: the reading-heavy stages return facts or findings and the writing stages produce artifacts a stronger tier reviews. No run has yet recorded the token cost per stage; when one does, the numbers belong here with their date.

## A gate is a fresh-context refutation, not a human

Ground: the two gate reviews of 2026-09-16 above, each a fresh Opus context prompted to review, each finding blocking defects. The refutation framing and the findings-as-data return follow the Workflow tool's adversarial-verify pattern, where a verifier prompted to refute catches plausible-but-wrong artifacts that a verifier prompted to approve waves through. The round caps are a decision: two fix rounds for a spec or plan, because a third round on the same findings means the finding is contested and a person should read it; three converge rounds, because the one observed converge appended eight tasks and a second is expected to append none.

## Analyze goes back to the artifact it names; converge goes back to implement

`/speckit-analyze` is read-only by its own text and ends by offering remediation edits to the user; `/speckit-converge` is append-only by its own text and reports `converged` or `tasks_appended`. Both give the loop a clean signal. Editing in place rather than re-running was decided on 2026-09-17 from the review-fix commits of the `002-product` run: each `/speckit-*` command regenerates its file whole, so a re-run would have discarded those fixes.

## Unattended means the agent decides by a written rule

The interactive points in the installed skills, read 2026-09-17: `/speckit-specify` presents up to three clarification questions and waits; `/speckit-clarify` is a one-question-at-a-time loop of up to five; `/speckit-implement` stops on an unchecked checklist and asks; `/speckit-analyze` asks whether to suggest remediation. Each has a rule in its stage prompt, and each rule writes its decision into the artifact so the next review can refute it.

## What this skill does not do

The skill is inception-cadence for a feature — it fires once per feature, and its frontmatter is paid every session; it exists because the alternative was a person at two gates and a night of attention per feature. The sequential shape is a decision: spec, plan, tasks and code are one dependency chain, and the one place work could fan out — implement phases — is kept sequential because each phase's wall run touches the same tree.


## 2026-09-17 — first end-to-end run, product-catalog 003-product-version

Run `wf_cc1aa65d-148`: preflight, specify, clarify (5 questions self-answered), three review-spec rounds (6 → 3 → 1 blocking) in 71 min, 8 agents, 1.19M subagent tokens; exit `needs-human` at review-spec. The remaining blocker was a constitution decision (three Article VII articles written by 002 about tables 003 owns). Consequence: the admission test in the plan, review-plan and fix-plan prompts, and in the project's constitution Governance.

**2026-09-17, tier ceiling lowered to Opus.** Runs `wf_cc1aa65d-148` and `wf_e460bffc-289` (Fable high on the reviews, xhigh on plan) cost 1.19M and 0.91M subagent tokens for eight and five agents without leaving review-spec. The user's verdict: the tier eats too many tokens for what it adds; every `fable` row in `TIERS` is now `opus`, efforts unchanged.
