# The firing harness — the first check here that reaches a `description`

Built 2026-08-02, in answer to the one thing `docs/history/context-budget.md` said
it could not decide: **whether a shortened description still fires its skill.**

`npm run firing` — `scripts/firing-harness.mjs`, corpus in
`scripts/firing-cases.json`.

## Why nothing else here could answer it

Every other script in `scripts/` measures text. Firing is not a property of text
in this repo; it is a decision a model makes at session start, given the
frontmatter of every installed skill and a prompt. The two wired gates never open
a `description`, and the three token scripts weigh one without reading it.
`frontmatter-tokens.mjs` has said so on every run since it was written — *whether
a description is too long; it is also the only thing that makes the skill fire*.

**Firing is decided by frontmatter alone.** The `SKILL.md` body and every resource
file beside it are invisible until after the choice is made. That is why the
2026-08-02 context-budget refactor could not have affected firing for eighteen of
the twenty skills — their frontmatter is byte-identical across it — and why the
question was live for exactly the two whose `description` changed.

## What it does

One case = one headless `claude -p` session in a sandbox holding this repo's
skills and nothing else, with every tool but `Skill` denied. It records which
skills the agent chose to load.

Three design decisions a reader will otherwise re-litigate:

- **Isolated `CLAUDE_CONFIG_DIR`.** Whatever skills the operator has installed
  globally would otherwise compete for every prompt, and the run would measure
  their machine rather than this set. Credentials are symlinked in, not copied.
- **Two fixtures, `bare` and `java`.** Four skills say *Load in a Java repo* and
  are entitled to see one; running them against an empty directory measures the
  fixture. The Java fixture is a `pom.xml` with a Spring Boot parent and two
  files under `src/main/java`.
- **Only the skill under test is scored.** Other skills firing is recorded and
  never counted against a case — a Java money prompt pulling in `money`,
  `money-java` and `money-storage` together is the set working. `forbid` on the
  four negative cases is the only cross-skill assertion.

**The corpus rule is the load-bearing part**, and it is stated at the top of
`firing-cases.json`: a prompt must read like something an engineer would type,
in that engineer's vocabulary, **never the skill's own words**. A corpus written
out of the descriptions tests string matching and passes forever while the
descriptions rot. When a case fails, the first suspect is the description.

## Every number below is `claude-sonnet-5`, and nobody chose that

**Correction, made the same day, and it is the most important line in this file.**
The runs recorded here were taken before the harness stamped its output. When
stamping was added, the first run printed `model=claude-sonnet-5` — a headless
session under an isolated `CLAUDE_CONFIG_DIR` with an empty `settings.json` takes
the CLI's default, and the default is not the model the operator was working in.
So **the baseline and both A/B runs measure Sonnet 5 reading these descriptions**,
which was an accident rather than a decision, and none of them recorded it at the
time. They are re-derived from a later run on the same machine, config and CLI,
not read off the runs themselves — treat the attribution as strong inference and
not as a record.

**A firing rate is a property of a model reading a description, not of the
description.** A rate for one model says nothing certain about another; the
descriptions here were written for agents running Opus. Every run now prints
`model` and CLI version in its header and its `--json`, and `--model opus` pins
one deliberately, at roughly $0.25 a session against Sonnet's $0.115.

**What is owed because of this: the baseline on the model this set is actually
used under.** One spot check on Opus — `ai-maintainer-principles-2`, the case that
went 0/5 on Sonnet's long description — fired first try. One session is not a
result, but it is enough to say the Sonnet numbers must not be read as this set's
firing rate.

## It is a report, never a gate

It spends money — **$0.115 per session on `claude-sonnet-5`, measured over 100
sessions on 2026-08-02; about $0.25 on `claude-opus-5`, measured over two** — and
it is stochastic. `money-1` fired on its own and missed in the full run
twenty minutes later, same prompt, same description. **One miss is a coin flip.**
Re-run with `--repeats` before touching anything. Do not wire it into
`npm run gates`; a gate that fails on noise trains people to ignore it, which is
what `guardrails-toolchain` bans by name.

## The A/B, 2026-08-02 — the trim did not cost a firing

Two descriptions changed in `0c5c10d`. `--against HEAD~1` runs both frontmatter
versions over the same prompts.

**All figures in this section and the next: `claude-sonnet-5`, CLI 2.1.220, linux
— see the correction above.**

| Skill | long `description` (HEAD~1) | trimmed (HEAD) | sessions per variant |
| ----- | --------------------------- | -------------- | -------------------- |
| `ai-maintainer-principles` | 5/16 | **6/16** | 16 |
| `backend-stack` | 5/6 | **6/6** | 6 |

**No cost, and no measurable benefit either.** The per-case split flipped between
the two runs that make up the 16 — case 1 went 2/3 then 2/5, case 2 went 0/3 then
3/5 — which at that sample size is noise and should be read as such. The claim
this supports is narrow and is the one that was owed: **cutting 89 tokens of
enumeration out of two descriptions did not stop either skill firing.** The
`Load before …` trigger clause was byte-identical across the edit in both, which
is what the procedure in `context-budget.md` told the next person to preserve.

## What it found instead, and it is worse than what it was built to check

**`ai-maintainer-principles` fires about a third of the time, and did so before
the trim as well.** 5/16 on the long description is the finding; the refactor is
exonerated and the skill is not. A consumer who installs it and asks *should I
split this service, and where's the seam?* gets it two times in three — which
means the skill is paid for every session and delivered on a minority of the
sessions it was written for.

Set-wide baseline the same day, one session per case, 44 cases:
**31 fired as expected, 0 forbidden, 0 errors, $5.86 — `claude-sonnet-5`, CLI
2.1.220.** The four negative cases
all held — nothing fired on a rename, a `git rebase` question, a Javadoc typo or
a postcode regex, which is the result that makes the misses worth reading.

The thirteen misses, and the split that matters:

- **Fired the wrong sibling** — `async-handoff-java-1` (an `@Async` method) pulled
  `java-backend-rules` and not `async-handoff-java`; `async-handoff-shapes-2` (an
  invoice auto-cancelling after 14 days) pulled `llm-default-traps`, presumably on
  *storing a deadline*. Both are description-boundary problems between siblings,
  the most actionable kind.
- **Fired nothing** — `money-1`, `money-2`, `money-storage-2`, `caching-2`,
  `java-backend-rules-2`, `guardrails-toolchain-1`, `llm-default-traps-2`,
  `ai-maintainer-principles-1`, `ai-maintainer-principles-2`,
  `enforceable-rules-1`, `tech-decision-research-2`.

**Do not act on that list as it stands.** It is one session per case, and
`money-1` is on it while having fired minutes earlier on the identical prompt.
The honest reading of a single-repeat run is a *ranking of where to spend
repeats*, not a defect list. The next pass re-runs the misses at `--repeats 5`
and treats only the ones that stay below about half as description work.

**Nor is a miss automatically the description's fault.** Three confounds, none
measured: the sandbox has no `CLAUDE.md` nudging skill use; every tool but `Skill`
is denied, so the model cannot look at the repo before choosing, and a real agent
often can; and the corpus prompts are deliberately oblique, which is the point of
the corpus rule and also a way to write a prompt no description could reasonably
catch. **A case that fails twice may be a bad case.**

## Running it on another machine

This repo is developed on several. The script runs anywhere the `claude` CLI runs
and is logged in; four things were changed on 2026-08-02 specifically so that it
would, and one thing still does not travel.

- **No `tar`, no `git archive`.** `--against <ref>` materialises the ref's tree
  with `git ls-tree` plus `git show` per file. 45 files, pure git, nothing else
  to install.
- **Copies, not symlinks.** Both the skill dirs and the credentials file. A
  symlink needs privileges on Windows a developer box may not grant, and this is
  not the place to require them.
- **A preflight session before the queue.** Without one, a machine that has the
  CLI but cannot authenticate under the isolated config burns all 44 sessions
  producing the same error, and it reads like a firing result. The preflight
  prints what to check instead.
- **Model and CLI version stamped** on the header, the footer and the `--json`.

**The thing that does not travel is authentication, and it is the isolated
`CLAUDE_CONFIG_DIR` that makes it fragile.** The sandbox copies
`~/.claude/.credentials.json` if it exists. A machine that authenticates any other
way has no such file: `ANTHROPIC_API_KEY` in the environment is inherited and
works, but an OS keychain login — the normal arrangement on macOS — may not follow
into a fresh config dir. On such a machine `claude -p ok` succeeds in a terminal
while the harness fails preflight, and the isolated config is the whole
difference. That isolation is not optional: without it, whatever skills the
operator has installed globally compete for every prompt, and the run measures
their machine. **If it comes to a choice, export `ANTHROPIC_API_KEY` for the run
rather than dropping the isolation.**

**What does not travel at all is a number.** Two machines can both run this and
produce rates that cannot be compared — different model, different CLI version,
and the model is the one that bit first, silently. A rate written into any file
here carries its model and CLI version or it is not a measurement.

## The sweep this obliged

Building something a skill names as missing obliges the same sweep a publish does.
Run 2026-08-02 over `skills/` and `README.md` for sentences asserting no firing
check exists: **none found.** No published skill ever claimed it — the absence was
asserted only in `BACKLOG.md` and `context-budget.md`, both corrected. The three
token scripts weigh a description without reading it and say so on every run;
`frontmatter-tokens.mjs` now points at this harness in the bullet where it says so.

That is the good outcome of the shape recorded in `CLAUDE.md` — *the repo files are
the easy half of the sweep; the published skills are the half that reaches a
consumer* — and this time the consumer-facing half was already clean.

## What this file does not decide

- **Whether the 70% baseline is good.** There is nothing to compare it against —
  no prior measurement of this set, and no published rate for any other. It is a
  first reading, and its value is as a baseline for the next one.
- **Whether the three remaining long descriptions should be trimmed.** The A/B
  says one trim was free on two skills; it says nothing about
  `primary-keys` 358, `business-numbering` 306 or `guardrails-toolchain` 300, and
  all three fired 2/2 in the baseline as they stand.
- **What the model does.** A miss is a model's relevance judgement, not a parse
  failure, and this harness observes the outcome without any access to the reason.
- **Anything about Opus**, which is what these descriptions were written for and
  what this repo is worked in. Every rate here is `claude-sonnet-5` by accident,
  and the one Opus spot check disagreed with it.
- **Whether the result holds on another CLI version.** Run under Claude Code
  2.1.220. A description is a prompt, and the thing reading it changes.
