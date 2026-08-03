# The firing harness — the first check here that reaches a `description`

> **2026-08-03: every first-move number below this line is void, and the
> explore-mode numbers are damaged.** The sessions were not sealed. See
> *[The environment was not the environment](#the-environment-was-not-the-environment-2026-08-03)*
> at the foot of this file for what was actually running and what was fixed.
> The findings sections are kept unedited because the reasoning in them is the
> record of how the defect stayed hidden — read them as history, not as rates.
>
> **The two rates that stand are both at the foot of this file** — *The first
> sealed baseline* (first-move, 43/44) and *The sealed explore run* (43/44,
> 0 late), both `claude-opus-5` / CLI 2.1.220 / win32 / 2026-08-03. Read those
> two sections and treat everything between here and them as method.

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
sessions on 2026-08-02; $0.22 on `claude-opus-5`, measured over 88 sessions on
2026-08-03** — and
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

## The Opus baseline and the ALWAYS A/B, 2026-08-03

One run answered both of the table's top rows: `npm run firing --against HEAD
--model opus`, taken the same day the descriptions were edited, so the `HEAD`
arm is the pre-edit set — the Opus re-baseline `BACKLOG.md` owed — and the
worktree arm is the same set with every description's closing `Load …` clause
strengthened to `ALWAYS load …` (the directive-wording lever from the
2026-08-03 premise review). **All figures: `claude-opus-5`, CLI 2.1.220,
win32, one session per case, $18.98 for 88 sessions — $0.22 a session, which
replaces the two-session $0.25 estimate.**

| Arm | Fired as expected | Negatives clean |
| --- | ----------------- | --------------- |
| `HEAD` (pre-edit descriptions) | **19/44** | 4/4 |
| worktree (`ALWAYS load` descriptions) | **23/44** | 4/4 |

Eight cases changed between arms: six up (`money-api-2`, `caching-1`,
`async-handoff-2`, `business-numbering-2`, `enforceable-rules-2`,
`tech-decision-research-1`), two down (`async-handoff-1`,
`java-backend-api-2`). **At one repeat per case that split is consistent with
an improvement and is not evidence of one** — the same file that recorded
`money-1` firing and missing on the identical prompt twenty minutes apart does
not get to read 6-up-2-down as a result. The half that needed no repeats: the
four negative cases stayed clean on both arms, so the pushier wording caused
no false firing on a rename, a rebase question, a Javadoc typo or a postcode
regex.

Two findings bigger than the edit:

- **Opus fired less than Sonnet on the identical pre-edit descriptions —
  19/44 against 31/44 — and the comparison is confounded exactly the way this
  file says all cross-machine comparisons are**: the Sonnet baseline is linux,
  this run is win32, same CLI version. Whichever way that resolves, the
  assumption behind the re-baseline row — that the Sonnet rates understated
  what Opus would do — went the other way. `ai-maintainer-principles`, the
  Sonnet baseline's worst case at 5–6/16, fired every session on both arms
  here; the weakness moved, it did not lift.
- **The miss list is dominated by the Java fixture.** On the worktree arm, 15
  of 21 misses are `[java]` cases; every `money-java`, `caching-java`,
  `async-handoff-java`, `java-backend-rules`, `java-backend-api` and
  `java-backend-observability` case missed on at least one arm, most with
  "nothing fired". The fixture's files are invisible to the model — every
  tool but `Skill` is denied — so whatever drives this is in the prompt
  wording or the model's judgment, not the repo contents. That pattern is the
  ranking for where `--repeats` goes next.

The 2026-08-02 sibling-boundary findings did not reproduce on Opus:
`async-handoff-shapes-2` (the invoice timeout) fired correctly on both arms,
and `async-handoff-java-1` missed with nothing rather than pulling
`java-backend-rules`. One new wrong-sibling appeared: `caching-java-2` pulled
`caching` alone on the worktree arm.

## The Java collapse explained, 2026-08-03 — it is the harness's design, not the descriptions

The 16 Java-fixture cases re-run at `--repeats 5` on the `ALWAYS load`
descriptions: **16/80 over all, $16.71** (`claude-opus-5`, CLI 2.1.220,
win32) — the collapse is real, not one-repeat noise. But the harness now
persists each session's response text, and the transcripts are unanimous
about the mechanism. Of the 55 sessions where nothing fired, **48 open with
explore intent** — *"I'll start by finding the endpoint"*, *"I'll start by
looking at the codebase"* — **7 produced no text, and zero answered the task
directly.** Given a concrete repo and an execution-shaped prompt, Opus's
first move is to read code. Every tool but `Skill` is denied and `max-turns`
is 2, so the session dies at that first move, before the skill decision was
ever going to happen.

Three consequences, in order of weight:

- **This is not description work, and no wording edit can fix it.** The
  confound this file has carried since 2026-08-02 — *every tool but `Skill`
  is denied, so the model cannot look at the repo before choosing, and a real
  agent often can* — is not a caveat on these 80 sessions; it is the whole
  result. The harness measures whether a skill fires **as the model's first
  action**. Opus in a repo does not take skill-loading as a first action;
  Sonnet evidently does, which also dissolves most of the 19/44-versus-31/44
  model gap into a behavioral difference rather than a description or
  platform one.
- **What the harness cannot see is whether the skill fires on the second or
  third turn of a real session** — after the exploration the model wanted,
  when it starts writing code. Measuring that means a redesigned experiment:
  read tools allowed, more turns, scored as *skill loaded before the first
  code edit* rather than *skill loaded first*. More expensive per session,
  and the only version whose java-case numbers mean delivery.
- **The corpus's prompt shape decides the rate for repo-fixture cases.** The
  two question-shaped java cases — `backend-stack-2` ("…Thoughts?") and
  `guardrails-toolchain-2` ("Can I baseline them and move on?") — fired
  **5/5 each**: nothing to explore first, so the relevance judgment happens
  immediately. The execution-shaped prompts ("Add pagination…", "Implement
  it") sat at 0–3/5. For bare-fixture cases the two shapes coincide, which is
  why the bare rate was never distorted.

Nine of the 64 misses fired a sibling instead of the skill under test —
`money` without `money-java`, `async-handoff` without `async-handoff-java`,
`caching` without `caching-java` — the stack-sibling boundary showing up
inside the artifact: when Opus does load something before exploring, it
reaches for the language-neutral parent, not the `-java` tool mapping its
description tells it to install alongside.

## Explore mode, 2026-08-03 — the delivery number, and what is left after it

`--explore` exists now: Read, Glob, Grep, Write and Edit allowed, the turn cap
raised to 8, each session in its own copy of the fixture because explore
sessions mutate their repo, and a third verdict — **late**, the skill under
test loading only after the first Write or Edit, because rules that arrive
after the code is written did not govern it. Mode is stamped on every report
and in the `--json`; a first-move rate and an explore rate are different
measurements and are never comparable. An explore session costs about
**$0.63** against first-move's $0.22 (`claude-opus-5`, measured over 32 and
88 sessions respectively), and can hit the 300-second timeout — one session
did, and it is the run's single error.

The 16 Java cases at `--repeats 2`, `claude-opus-5`, CLI 2.1.220, win32,
$20.05: **19/32 fired as expected, 0 late** — against 16/80 for the same
cases in first-move mode. Six cases that were 0/5 first-move went 2/2 the
moment exploration was allowed (`money-java-1`, `money-java-2`,
`async-handoff-java-2`, `java-backend-api-2`, `guardrails-toolchain-1`,
`llm-default-traps-1`). **Zero late is the finding that matters most**: when
Opus loads a skill at all, it loads it before writing code — the explore-first
behavior delays the decision past the harness's old horizon, not past the
point where the rules still govern the code.

The bare-fixture tail, re-run the same day at `--repeats 5` in first-move
mode ($6.00): the seven bare misses from the A/B held at **3/35** — but 22 of
their 32 fired-nothing sessions also open with explore intent. The artifact
is not fixture-bound; it follows any prompt that references artifacts the
model would want to look at ("the line items are doubles", "this ADR"), which
a bare fixture merely fails to contain. Those seven owe an explore-mode
measurement before any of them is called description work.

What survives both modes, and is therefore real:

- **Six java cases dead in both** — `caching-java-1`, `caching-java-2`,
  `async-handoff-java-1`, `java-backend-rules-2`, `java-backend-api-1`,
  `java-backend-observability-1` (0/2 explore, 0–1/5 first-move each; two
  repeats is thin, so rank them, do not sentence them).
- **The parent-without-sibling boundary, now demonstrated where it counts**:
  in explore mode `caching-java-2` loaded `caching` and `async-handoff-java-1`
  loaded `async-handoff` plus `java-backend-rules`, then wrote code without
  ever opening the `-java` sibling that carries the build gates. The generic
  rules arrived; the tool mapping did not. That is the first
  description-shaped defect this harness has isolated cleanly, and it belongs
  to the `-java` descriptions' "alongside" clause.

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

**A fifth thing was needed on 2026-08-03, and it cost a full run to find.** The
first Windows run of this harness — the Opus A/B over the `ALWAYS load`
description edit — reported both arms at 4/44: every positive case a miss with
"nothing fired", all four negatives passing. That is not a firing rate; it is
the signature of sessions that never saw their prompts. `spawn` can only reach
a `.cmd` shim on Windows through `shell: true`, and a `shell: true` argument
list is concatenated through `cmd.exe` unescaped — the deprecation warning
Node prints about it was in the log of the void run — so every multi-word
prompt arrived as a fragment. A probe session asked to repeat its prompt back
answered that it had received nothing. Two changes, both in `runOne` and
`preflight`: the prompt now travels on **stdin**, which `claude -p` reads,
leaving only fixed single-token arguments on the command line where cmd.exe
concatenation cannot damage them; and the preflight now requires its probe
word echoed back, because the error-only preflight passed — a session asked a
fragment still answers politely, bills normally, and stamps its model. The
void run cost $12.52 and its report was plausible enough to act on.
**Recognise the shape: all positives missing while all negatives pass is
equally what "prompts mangled" and "no skills installed" look like, and
neither is a measurement.**

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

## The environment was not the environment, 2026-08-03

Every rate above was taken in a sandbox that did not have the properties the
harness said it had. Found by reading one session's raw stream instead of its
parsed result, after the explore-mode run made the first-move numbers look
suspicious.

**`--allowed-tools` is an auto-approve list, not a restriction.** The harness
passed `--allowed-tools Skill` and the file's own comment read *every tool but
Skill is denied*. It never was. Only `--disallowed-tools` removes a tool, and
the deny list beside it was written by enumeration.

What the enumeration missed, in the order it was found:

- **`PowerShell`.** The list named `Bash`. On Windows the shell tool has a
  different name, so first-move sessions on win32 had a working shell. The
  probe's first act was `Get-ChildItem -Recurse`, which listed the whole
  fixture including all twenty `SKILL.md` files.
- **`ToolSearch`.** Unlisted, present, and the probe spent its second turn
  asking it for the five tools that *were* denied. With `--max-turns 2` the
  session then died — `error_max_turns`, no text, recorded as *nothing fired*
  and indistinguishable in the report from a relevance judgment.
- **Seventeen more**, read off the session's own `init` event once the harness
  started checking it: `CronCreate`, `CronDelete`, `CronList`, `DesignSync`,
  `EnterWorktree`, `ExitWorktree`, `PushNotification`, `RemoteTrigger`,
  `ReportFindings`, `ScheduleWakeup`, `SendMessage`, `ShareOnboardingGuide`,
  `TaskCreate`, `TaskGet`, `TaskList`, `TaskUpdate`, `Workflow`. None would
  have been guessed and several postdate the harness.

**The environment was inherited wholesale**: `{ ...process.env }`, which from
inside a Claude Code session is 23 `CLAUDE_*`/`ANTHROPIC_*` variables including
feature flags and a base URL. The same command produced a different environment
depending on where it was typed, and no run recorded which.

### What this does to the record

- **The platform confound was never about the platform.** This file spent two
  sections on *Opus 19/44 win32 against Sonnet 31/44 linux, same CLI, not
  comparable*. The linux runs had `Bash` in the deny list and were near-sealed;
  the win32 runs had an open shell. Two different experiments, and the model
  and OS differences were reading a difference in tool availability.
- **The Java-collapse explanation is wrong in its mechanism.** *Sessions dying
  at a denied read* — the read was never denied. The model explored
  successfully and ran out of turns. The conclusion it supported (first-move
  mode does not measure delivery for execution-shaped prompts) survives; the
  reason given for it does not.
- **The one description defect this harness had isolated is unproven.** The
  parent-without-sibling finding on `caching-java-2` and `async-handoff-java-1`
  came from unsealed sessions. On the sealed harness `money-java-1` — 0/5
  before — fired `money` and `money-java` together on its first session.

### The second defect, found in the same pass: fixtures without referents

Prompts named a `TaxService`, a `GET /customers`, a `ReceiptService`, an ADR and
a report query. No fixture contained any of them. The transcripts are
unanimous — *"There is no `TaxService` in this project"*, *"I can't find the
ADR"*, *"the endpoint isn't in this repo"* — the model looked, asked for the
missing thing and stopped. Scored as a miss with no relevance judgment having
occurred. This is most of the miss list in both modes, and it is why the six
cases called *dead in both* were not evidence of anything.

### What was changed

In `scripts/firing-harness.mjs`:

- **`PERMITTED`, and two checks against it.** The preflight reads the session's
  `init` tool list and refuses to run if it holds anything outside the mode's
  set — before a single case is paid for. `parseSession` additionally fails any
  session that *used* such a tool. The deny list is still enumeration and will
  go stale again; the checks are what make that survivable.
- **`DENIED` extended** with every name above.
- **First-move turn cap 2 → 4.** Two left no room for a rejected call plus an
  answer.
- **`childEnv`**, an allowlist. Platform variables plus `ANTHROPIC_API_KEY`,
  `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_BASE_URL`, which must survive for machines
  that authenticate by key or proxy. Every `CLAUDE_*` is dropped. Which auth
  variables passed is printed and stamped.
- **`FIXTURES`**, a name-to-files table replacing the single hardcoded Java
  writer, with `java` enriched to hold what its prompts name, and two new
  fixtures: `sql` (schema plus a slow report query) and `docs` (a 2024 ADR
  choosing RabbitMQ). `money-storage-2`, `tech-decision-research-2` and
  `llm-default-traps-2` moved onto fixtures that contain their subject;
  `ai-maintainer-principles-1` reworded to state its context instead of
  pointing at a service that was not there.
- **`gitInit` on every fixture.** Transcripts kept stopping at *"it isn't a git
  repository"*.
- **The run's shape in the `--json`** — `permitted`, `denied`, `maxTurns`,
  `repeats` — because two runs labelled `first-move` measured different things
  and neither file recorded which.

**The fixture code is deliberately ordinary** — doubles for money, a plain
string 400 body, a lookup per request. Writing it the way the skills prescribe
would answer the prompt before the model read it. The opposite risk is real and
unmeasured: a fixture exhibiting the defect a skill bans may cue that skill by
itself. A rate is a rate for this fixture, and editing these files starts a new
baseline.

### The first sealed baseline, 2026-08-03

`claude-opus-5`, CLI 2.1.220, win32, first-move mode, 4 turns, `Skill` the only
permitted tool, one repeat per case, **$19.14 over 45 sessions** — $0.47 each,
not the $0.22 the pre-fix runs cost, because a session now has turns to use.
Taken in two parts: 36 cases, then the 8 that died on `rate_limit` re-run at
`--concurrency 2`.

**43/44 fired as expected. 0 forbidden. 4/4 negatives clean.**

The negatives are what make the rest readable: with `Skill` as the only tool
available, the model still loaded nothing on a variable rename, a `git rebase`
question, a Javadoc typo or a postcode regex. A run where everything fires and
no negative ran would not have distinguished working descriptions from
indiscriminate loading.

What this reverses:

- **The six cases "dead in both modes" all fired** — `caching-java-1`,
  `caching-java-2`, `async-handoff-java-1`, `java-backend-rules-2`,
  `java-backend-api-1`, `java-backend-observability-1`. The backlog row is
  withdrawn.
- **The parent-without-sibling defect did not appear once.** `caching-java-1`
  pulled `caching` and `caching-java`; `async-handoff-java-1` pulled
  `async-handoff`, `async-handoff-java` and `java-backend-rules`. The
  "alongside" clause needs no work on this evidence.
- The single miss is `enforceable-rules-1` — *write a CLAUDE.md for this repo* —
  which loaded `ai-maintainer-principles` and the CLI's own built-in `init`
  skill instead. One session, a plausible boundary, worth repeats before it is
  called anything.

**Three things this number is not.** It is one repeat per case, so it ranks
rather than proves. It is a first-move rate in a session whose only tool is
`Skill`, which is an upper bound on delivery, not delivery — the mirror of the
defect that produced the void numbers, and the reason explore mode still owes
its own sealed run. And it belongs to these fixtures: they now contain the
defects the skills ban, which may cue firing by itself and is unmeasured.

### The sealed explore run, 2026-08-03 — the delivery number

`claude-opus-5`, CLI 2.1.220, win32, **explore mode**, 8 turns, Skill plus Read,
Glob, Grep, Write and Edit, one repeat per case, `--concurrency 2`, **$31.92
over 44 sessions** — $0.73 each. No `rate_limit` casualties at that concurrency
and no timeouts; 0 errors.

**43/44 fired as expected. 0 late. 0 forbidden. 4/4 negatives clean.**

This is the number the first-move baseline could not produce. First-move scores
whether a skill is the model's opening move with no other tool available, which
is an upper bound on delivery; explore mode lets the model do what it actually
does — read the repo first — and scores **late**, the skill loading only after
the first Write or Edit, because rules that arrive after the code did not govern
it.

**Zero late over 44 sealed sessions is the finding.** It reproduces the one
result the damaged explore run got right, now on sessions that were the sessions
they claimed to be: when Opus loads one of these skills at all, it loads it
before writing code. The delivery question therefore collapses to *does it
load*, and on this corpus, at this stamp, it loads 43 times in 44.

What it reverses, and what it costs to say so:

- **The parent-without-sibling defect did not appear.** It was called "the first
  description-shaped defect this harness has isolated cleanly" on the damaged
  run, where `caching-java-2` loaded `caching` alone and `async-handoff-java-1`
  loaded `async-handoff` plus `java-backend-rules`, then wrote code without the
  `-java` sibling that carries the build gates. Sealed, all six `-java` cases
  pulled parent and sibling together — `money-java-1` reached four money skills,
  `caching-java-1` both caching skills, `async-handoff-java-2` both handoff
  skills. **The "alongside" clause needs no work on this evidence, and the
  defect it was supposed to answer was an artifact of unsealed sessions.**
- **The six cases "dead in both modes" all fired**, as they had in the sealed
  first-move run. That backlog row stays withdrawn on a second, independent
  measurement.
- **`enforceable-rules-1` fired here** — *write a CLAUDE.md for this repo*,
  loading `enforceable-rules` and `ai-maintainer-principles`. It is the single
  first-move miss, so the two sealed runs disagree about exactly one case in
  each direction.
- **The single explore miss is `llm-default-traps-2`** — *write the Dockerfile,
  pick a sensible base image* — which fired in first-move. One session either
  way; both went to repeats before anything was called a defect.

**Three things this number is not.** One repeat per case, so it ranks rather
than proves. It belongs to these fixtures, which now contain the defects the
skills ban and may cue firing by themselves — unmeasured, and the reason a
fixture edit starts a new baseline. And an 8-turn sandbox with no `CLAUDE.md`
and no user is not a working session; what it removes is the specific artifact
that made the old numbers meaningless, not the distance to production.

**One case in this 44 no longer exists as measured.** `llm-default-traps-2` was
rewritten later the same day, off *pick a sensible base image* and onto build
reproducibility over a Dockerfile and a workflow, running in a new `ci` fixture
— see *Repeats on the two sealed misses* below. The other 43 cases and both
other fixtures are untouched, so this rate stands for them; a re-run of the full
corpus is a 43-case comparison plus one new case, not a like-for-like 44.

### Repeats on the two sealed misses, 2026-08-03

Both misses went to five repeats the same day, each in the mode that produced
it. `claude-opus-5`, CLI 2.1.220, win32.

- **`enforceable-rules-1`, first-move, 4/5, $2.30.** *Write a CLAUDE.md for this
  repo.* The one miss loaded the CLI's own built-in `init` skill, which is a
  defensible answer to that prompt rather than a relevance failure. With the
  baseline miss and the explore hit, 5/7 across every sealed session it has had.
  **No description work owed**; the competitor is a built-in with a strong claim
  to the same prompt.
- **`llm-default-traps-2`, explore, 3/5, $2.52** — 3/6 with the baseline miss.
  Not noise, and the cause is in the description rather than in the model.

**The Dockerfile case had a cause, and it is a shape worth naming.** The
description's trigger clause read *…before choosing a container base image…*
while **none of the skill's nine directives is about choosing one**. Its only
image material is two layer-check notes recording that the lockfile gate does
not see a base image's packages and the pin lint does not read a `FROM` line.
So on half the sessions the model read the description against a Dockerfile
prompt and correctly found nothing on offer.

**The same shape is legitimate one skill over, which is what makes it a
distinction rather than a rule.** `caching` triggers on *putting a cache behind
a proxy or a content-delivery network* and its body states outright that no
directive reaches a response cache in a proxy or CDN, naming the lint that
would — decided 2026-08-02, so that the gap is read rather than left silent.
The discriminator:

- **Legitimate** — the body names the subject and states what it does not carry.
- **Defect** — the description advertises the subject as a choice the skill
  guides, and the body never addresses it.

**The edit, owner-chosen: narrow the trigger to what the skill governs.** The
clause now reads *…pinning a tool, a CI action or a container image
reference…*. Word-diff against `HEAD`, run rather than asserted: `choosing` and
`base` are the only words lost, `container` and `image` survive, `a CI action
or` and `reference` are added. The skill owns *an image referenced by tag rather
than digest*; it does not own *which base image to pick*, and the description
now says only the first.

**The corpus case was rewritten with it**, because a prompt asking which base
image to pick tests a subject nothing in this set owns. It now asks for
reproducible builds over a Dockerfile and a workflow that reference moving tags
— squarely inside the SHA-pinning directive.

**The first A/B of that edit was invalid, and the reason is this file's own
second corpus rule.** The rewritten prompt named a Dockerfile and a workflow;
the `java` fixture it ran in holds neither, so sessions went looking, found
nothing and stopped — the exact failure the rule was added to prevent, in a pass
that had read the rule an hour earlier. The numbers it produced (worktree 1/5,
`HEAD` 2/5) measure fixture absence and are void.

**A `ci` fixture exists now** — a Dockerfile on `FROM eclipse-temurin:21-jre`
and a workflow on `actions/checkout@v4`, `setup-java@v4`,
`docker/build-push-action@v5` — as a new fixture rather than files added to
`java`, because editing `java` restarts the baseline for all sixteen java cases
and a new fixture restarts nothing.

**The valid A/B, `ci` fixture, five repeats an arm, $10.44: 5/5 narrowed, 5/5
`HEAD`, 0 late either way, 0 cases changed.** Three things follow, and only the
first is about the edit:

- **The narrowing is free.** It is kept on the honesty argument — the
  description no longer advertises guidance the body does not carry — with a
  measurement saying it costs no firing, not one saying it gained any.
- **The miss was the case, not the skill.** *Pick a sensible base image* asked
  for a subject nothing in this set owns, in a fixture holding no Dockerfile.
  Put on a subject the skill governs, in a fixture that holds it, the same
  description fires 5/5. **So the sealed explore baseline's single miss is
  attributed to the corpus.** That does not retroactively make the run 44/44 —
  a rate is what was measured — but no description defect is open against this
  set.
- **A miss has at least three causes and this harness cannot tell them apart.**
  The description not earning the load, the prompt naming what the fixture
  lacks, and the prompt asking for something the skill was never about, all
  print as `MISS`. Two of the three are corpus defects, and both were live in
  this one case at once.

### The shape worth remembering

**A configuration flag was believed rather than checked, for the whole life of
the harness.** Every guard this file already carried — the preflight, the probe
word, the stamping — guards against a session that fails or answers the wrong
prompt. None of them asked whether the session was the session. The check that
found it costs one `init` event that every run already receives and throws away.

It is also the second time this harness produced a plausible report from a
broken run: the void Windows run of 2026-08-03 morning read as a firing result,
and these numbers read as a firing result for two days. **A firing report is
plausible by construction — some cases pass, some miss — so plausibility is not
evidence that the run happened.**

## What this file does not decide

- **Whether 43/44 is good.** There is nothing to compare it against — no prior
  sealed measurement of this set, and no published rate for any other. Both
  sealed runs landed there, first-move and explore, which makes it a baseline
  rather than a reading; the two disagree on exactly one case each way.
- **Whether the three remaining long descriptions should be trimmed.** The A/B
  says one trim was free on two skills; it says nothing about
  `primary-keys`, `business-numbering` or `guardrails-toolchain`, which hold the
  three largest description slots and fired in both sealed runs as they stand.
  A trim is an unforced edit to the only text that makes a skill fire.
- **What the model does.** A miss is a model's relevance judgement, not a parse
  failure, and this harness observes the outcome without any access to the reason.
- **Whether Opus actually fires less than Sonnet on this set.** The 2026-08-03
  Opus baseline (19/44) sits far under the 2026-08-02 Sonnet one (31/44) on
  identical descriptions and the same CLI version, but the runs are on
  different platforms — win32 against linux — and this file's own rule is that
  such rates are different measurements, not comparable ones. Settling it
  means one model's run repeated on the other's platform.
- **Whether the result holds on another CLI version.** Run under Claude Code
  2.1.220. A description is a prompt, and the thing reading it changes.
