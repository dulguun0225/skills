# What the skills did on real work — the run ledger

`npm run firing` asks whether a skill loads. `npm run probes` asks whether it
needs to exist. The `tokens` family asks what it costs. **None of them observes a
skill doing the work it was written for**, and until 2026-09-22 nothing here did:
`build-feature` and `converge-feature` had been running unattended in two service
repositories for six days, every run leaving a journal, and no journal had been
read back.

`npm run runs` reads them. **Since 2026-09-24 it reads a second source beside
them: each service repository's git history of `<featureDir>/HANDOFF.md`.** Every
`needs-human` exit with a resolved feature directory, off the base branch, commits
that file with the subject `handoff: the <stage> stage stopped and needs a person`;
the report finds that commit for each stop, and lists the commits between it and
the next run on the feature — what somebody changed before restarting, which no
journal records. The git calls are read-only. It is **a report and can never be a gate** — every
number in it is a property of runs that happened on one machine, in repositories
this repo does not control, by an operator who may have intervened by hand
between runs; a threshold on any of it would fail this build for something nobody
in this repo did, which is the check-that-fails-on-noise `guardrails-toolchain`
bans by name. It is not in `npm run gates` and must not be added to it.

**The journals are ephemeral and nothing here commits one.** Claude Code writes
them to `~/.claude/projects/<consumer repo path with "/" replaced by "-">/<sessionId>/workflows/wf_*.json`.
They are machine-local, in no repository, and a cleared projects directory erases
them. **This page is the durable record** — the same arrangement `npm run firing`
has, where the sessions are thrown away and the rates are written down. Owner's
decision, 2026-09-22: no raw-JSON backup is committed anywhere, and
`npm run runs -- --json` exists for piping, not for keeping.

**The defect class this page exists for.** The lapse rule decays a *confirmed*
marker to *convention* once `review-by` passes, with no maintainer action needed.
**Nothing here ever promoted an *unrun* or *unmeasured* claim when a run took
it** — decay was handled in one direction only, and the first read of the banked
journals found a shipped status line calling three mechanisms unrun while one of
them had seventeen firings. A claim that a thing has not happened is as
perishable as a claim that it has.

---

## Sweep 1 — 2026-09-22

**Stamp.** 28 journals, runs `wf_79724f0d-fd4` (2026-09-17) through
`wf_fbb2141f-8bf` (2026-09-22). Repos `netos/netcore-platform/reference-data` (8
runs) and `netos/netcore-platform/product-catalog` (20). One machine, linux
7.1.5 x86_64, Claude Code CLI 2.1.278, Node v26.5.1, one operator. **No control
arm and no repeat**: every claim below is *convention* unless it is a direct
reading of a field, and a number is comparable only to another taken the same
way. Re-run with `npm run runs -- --since 2026-09-17 --until 2026-09-22 --repo
~/repos/netos/netcore-platform/reference-data --repo
~/repos/netos/netcore-platform/product-catalog`; the `--` is required, since
without it npm strips the flag names and the script reads every run unfiltered.
**That window is a superset of this stamp and cannot be narrowed to it**:
`--until` is day-granular and more runs ended on 2026-09-22 after this sweep was
taken, so the command lists 37 runs on 2026-09-24, and this sweep's 28 are the
first 28 of them, through `wf_fbb2141f-8bf` (03:12Z).

### Corpus

```
Corpus: 28 runs, 2026-09-17..2026-09-22, >=28,671,567 over 250/276 agents, 17.5h, 276 agents.
Exits: done=8, harness:killed=1, needs-human@-=1, needs-human@analyze=5, needs-human@converge=3, needs-human@preflight=1, needs-human@review-plan=5, needs-human@review-spec=4
Mechanisms across the corpus: forced=17, wallRepair=0, reconcile=0, assessOnly=4, stallRetry=2

Per feature:
  product-catalog/(unresolved)                         runs= 1 tok=0.04M implement-agents= 0  <- never reached implement
  product-catalog/specs/002-product                    runs= 4 tok=2.04M implement-agents= 6
  product-catalog/specs/003-product-version            runs= 9 tok=9.37M implement-agents=13
  product-catalog/specs/004-product-gl-config          runs= 6 tok=11.59M implement-agents=35
  reference-data/specs/001-company-registry            runs= 8 tok=5.62M implement-agents= 0  <- never reached implement
```

**Every token figure carries its coverage and the reason is not tidiness.**
`tokens` is null on 26 of 276 agents, all of them `state: "done"`, twelve of them
`implement phase`. Per-tier sums equal `totalTokens` exactly, so the nulls
contribute zero: **28.7M is a floor, not a total**, and a bare total would be
wrong by an unknown amount in one direction.

### Stage × tier — the cost table the skill said did not exist

`build-feature/SKILL.md` says *It has no measured cost in this shape yet*. This
is that cost, and it is the run's own arithmetic, not an estimate:

```
stage                           tier               n            tok(cov)   mean tok   mean s  retries
converge                        opus medium       39   5,845,202 (37/39)     157978      256  0
implement phase                 opus medium       54   4,199,203 (42/54)      99981      358  0
review-plan                     fable low         16   2,483,792 (15/16)     165586      303  1
analyze                         opus medium       14   1,723,794 (12/14)     143650      279  1
review-spec                     fable high         7     1,438,100 (7/7)     205443      550  0
fix-spec                        opus medium        9     1,206,834 (9/9)     134093      469  0
fix-plan                        opus medium       14   1,188,196 (13/14)      91400      206  0
phases after forced append      sonnet low        17   1,178,348 (16/17)      73647       40  0
review-plan                     opus high          3       992,253 (3/3)     330751      890  0
remediate                       opus medium       11     972,154 (10/11)      97215      252  0
phases after converge           sonnet low        16     867,639 (15/16)      57843       28  0
force-append converge           opus medium       17     852,978 (16/17)      53311       68  0
review-spec                     fable low          4       780,829 (4/4)     195207      187  0
tasks                           opus medium        6       739,343 (5/6)     147869      320  0
review-spec                     opus high          3       672,994 (3/3)     224331      575  0
converge (assess only)          opus medium        4       550,863 (4/4)     137716      211  0
handoff                         sonnet low        11     488,929 (11/11)      44448       39  0
plan                            opus xhigh         1       441,156 (1/1)     441156     2499  0
finish                          sonnet low         8       390,626 (8/8)      48828       91  0
plan                            fable low          4       382,488 (3/4)     127496      311  0
specify                         opus medium        2       371,022 (2/2)     185511      814  0
preflight                       sonnet low         5       218,649 (5/5)      43730       16  0
clarify                         opus medium        2       216,819 (2/2)     108410      291  0
converge                        opus high          1       199,918 (1/1)     199918      368  0
preflight (discovery and sync)  sonnet low         6       194,779 (5/6)      38956       16  0
phases                          sonnet low         2        74,659 (1/2)      74659       52  0

By tier alone:
  opus medium    n= 172  >=17,866,408 over 152/172 agents             mean=117542  mean_s=283
  fable low      n=  24  >=3,647,109 over 22/24 agents                mean=165778  mean_s=283
  sonnet low     n=  65  >=3,413,629 over 61/65 agents                mean=55961  mean_s=40
  opus high      n=   7  >=1,865,165 over 7/7 agents                  mean=266452  mean_s=680
  fable high     n=   7  >=1,438,100 over 7/7 agents                  mean=205443  mean_s=550
  opus xhigh     n=   1  >=441,156 over 1/1 agents                    mean=441156  mean_s=2499
```

The `opus high`, `fable high` and `opus xhigh` rows are runs from 2026-09-17 and
2026-09-19, before `tier()` was narrowed to the roster's six pairs; a run today
throws on any of them before its first agent starts. They are kept because they
are the only comparison the corpus contains.

### What this sweep changed in the skills

**1. The forced convergence round has run; wall repair and reconcile have not.**
`build-feature/SKILL.md` and `converge-feature/SKILL.md` both carried a sentence
calling the forced round, the bounded wall repairs and the reconcile-behind-a-
failed-append equally unrun. Measured: **17 `force-append converge` dispatches
across 4 runs on 2026-09-20** — `wf_3dc51822-772` (6), `wf_fbb96088-993` (6),
`wf_c6f73cab-e1f` (2), `wf_1ee836c9-35f` (3), all on
`product-catalog/specs/004-product-gl-config` — with **15** `Convergence (forced
round n)` phases implemented and wall green, 17 `phases after forced append`
certifier agents, and **188** entries in `result.converge.forced`. Wall repair:
**0** agents in 28 runs. Reconcile: **0**.

**The shape was worse than staleness, and that is the finding.** One sentence
marked three mechanisms equally unrun; one had seventeen firings and two had
none. A reader trusting it discounted the mechanism with evidence and trusted the
two without it exactly as much. Both status lines are now split, and each side
carries the run ids and the command that re-runs the count.

Not resolved, and left as owed: **17 dispatches produced 15 implemented forced
phases.** The two-run difference is not explained by anything in the journals.

**2. A question the tier table deferred to "the next run" is answered, as a
direction only.** `SKILL.md` rejected Fable at high and xhigh on 2026-09-17 and
ended *whether low effort brings that spend down is the next run's measurement,
not a claim here*. Fable low: 24 agents, mean 165,778 tokens over 22/24, mean
283 s. Fable high: 7 agents, mean 205,443 over 7/7, mean 550 s. Low is cheaper
per agent and faster. **This is not a controlled comparison** — different
stages, different features, different dates, no repeat — so it ships
*convention*, direction only. Recorded in the skill that way.

**3. The round-cap raise of 2026-09-18 bought rounds and not closure.** `maxReviewRounds`
and `maxAnalyzeRounds` went from 2 to 3 because the 2026-09-17 record showed the
operator resolving five capped runs by hand with one more fix round — a cap of 2
declining work the loop could do. Both skills then carried *no run has taken a third
round*. Measured: **six runs took one** — four at review-plan, one at review-spec, one
at analyze, each dispatching exactly three fix or remediate agents — and **all six
still ended `needs-human` at the cap**. So the paragraph's prediction (a bigger cap
buys rounds rather than closure, because most findings at a cap are holes the previous
fix opened) is confirmed and the hope beside it is not. **The counterfactual is
untaken**: nobody has run a fourth round on any of the six, which is the only thing
that would say whether 3 is a cap or a coincidence. Corrected in
`build-feature/evidence.md` and in the `maxReviewRounds` comment in `workflow.mjs`.

**4. Three more deferred claims answered, all as predicted.** Converge agents do return
graded findings (188 reached `converge.forced`, every one `LOW` on the four runs that
forced anything). The assess-only round has its number: four agents, 550,863 tokens, a
mean near 137,700. And **at the default floor `NONE` no run has ever ended
`converged`** — of seven terminated converge loops, four ended `round-cap` and three
`converged` only at a floor deliberately raised to `LOW` or `MEDIUM`. That is what
`build-feature` said would happen, so it is a confirmed prediction and not a defect.

### F3 — a feature can burn eight runs without reaching implement

`reference-data/specs/001-company-registry`, 2026-09-21..22: **8 runs, 5.62M
tokens, zero `implement` agents in any of them.** Exits: `needs-human` at
preflight ×1, review-plan ×3, analyze ×4. The recurrence block groups two of the
analyze exits on a normalised `result.why` and the review-plan cap exits on
another; read loosely, three of the four analyze exits carry the same sentence
differing only in a count word, and the third is outside the group for exactly
that reason — which is the grouping's stated limit, not a disagreement.

The loop is at a fixed point it cannot leave by itself. **This is the baseline for
the resolution rule of 2026-09-22**, which says the launching session resolves a
`needs-human` return rather than relaying it: as of this sweep no run had been
resolved under it, so 8-runs-no-code is the number the rule has to beat.

### F4 — the resolution record went into the file the skill calls the wrong file

`RESOLUTIONS.md` **has never existed** in either service repository
(`git log --all --diff-filter=A`: three files of that class ever — two
`HANDOFF.md`, one `convergence-rationale.md`). The two resolutions that were
recorded were written by **overwriting `HANDOFF.md`** with `# Resolved — …`
documents, which is precisely the failure `build-feature` names when it chooses a
separate file: *the script overwrites that file at the next exit by design*.

**Stated honestly: the resolution rule is dated 2026-09-22, the day of this
sweep, so 0-for-8 is the behaviour before the rule and not a violation of it.**
What it gives the rule is a baseline. What it also gives is the format that *was*
maintained without anybody enforcing it —
`product-catalog/specs/004-product-gl-config/convergence-rationale.md`: one dated
entry per task id, `**Finding.**` then `**Route taken.**` then `**Reason it is
closed without an edit.**`, naming the governing skill and the constitution
article inline. **The next sweep should compare `RESOLUTIONS.md`'s rate against
that file's, and if the instructed artifact is still unwritten while the
uninstructed one is maintained, the defect is in where the skill put the record.**
No edit is made on that today: one sweep is not evidence about a rule one day old.

### An observation the harvest has not decided

Of the 14 recurring finding-location groups, **most are `plan.md — named gap n`**:
the forced rounds are forcing tasks against gaps the plan itself declared. Under
floor `NONE` a declared gap grades above the floor, gets forced, and comes back,
because a declared gap is not closable by code in the repository. That is a
candidate for step **d** below — a directive, a constitution article, a template
gate or nothing — and **this page does not decide it.** It is the loudest thing in
the recurrence block and it wants its own pass.

---

## The harvest procedure

Run by an agent, per sweep, not per run. `npm run runs` is one command; steps b,
c, e and f are reading skill text against a table, which is bounded reasoning —
tier `analyst`. Step d reads each stop's handoff and resolution commits out of the
service repository and decides where the stop should have been prevented, which is
a rule decision — tier `principal`.

**Not a skill**, deliberately: a skill costs frontmatter in every session of every
consumer for a job done once a sweep, which is the bad trade `CLAUDE.md` names —
*a skill that adds three hundred tokens to every session and fires on a decision
made twice a year*. **Not a checklist in `CLAUDE.md`** either: that file is loaded
every session and carries only what is needed every session. A section on this
page costs nothing until somebody opens it.

- **a.** `npm run runs -- --since <last sweep's date> --until <today>`, and record
  both dates in the stamp beside the run-id range, which is the only exact bound
  when either day holds runs from outside the sweep. Paste the per-run block, the
  corpus line, the stage × tier table and the per-stop block's summary line into
  a new sweep section, verbatim.
- **b.** **Re-read every status line, and every *unmeasured* / *unrun* / *no run
  has taken* / *no measured cost* sentence, in `build-feature/SKILL.md`,
  `converge-feature/SKILL.md` and both `evidence.md` files against the mechanisms
  column. Any claim the column contradicts is edited, with the run ids as its
  ground.** First, because it is the step that found something on the first pass.
- **c.** Every question the skills defer to a future run — *the next run's
  measurement*, *unmeasured*, *has not taken* — checked against the stage × tier
  table, and either answered with its stamp and its marker, or restated as still
  open. An uncontrolled comparison answers at *convention* and says so.
- **d.** **Every `needs-human` stop in the window**, read from the per-stop
  block: the handoff in full (its `read:` command) and each resolution commit
  (`git -C <repo> show <sha>`), with `RESOLUTIONS.md` where the window has one.
  Per stop, name **the earliest stage whose inputs already held what was
  needed** to avoid the stop, and decide **exactly one** prevention target:
  a question the spec should have answered at `specify` or `clarify`; an article
  in the consumer constitution; a gate or scaffold change in
  `java-backend-template`; a directive in an existing skill here; a
  `build-feature` stage prompt in `workflow.mjs`; or nothing, with the reason —
  irreducible where the stop needed a business value nothing in the repository
  states, or somebody else's uncommitted work or merge conflict. A stop the
  block reports with no handoff is decided from the journal's `result.why` and
  `result.detail` alone, and the sweep says its resolution is unknown.
  **Cross-feature recurrence sets priority, not eligibility**: a stop that
  happened once, or recurs within one feature, gets a decision like any other,
  and a `CROSS-FEATURE` group is decided first. The decisions go into the sweep
  section as one row per stop — run id, stage, earliest stage, target, applied
  or owed. A target decided and not applied is recorded as owed on
  `BACKLOG.md`.
- **e.** Each `REPEAT` group, and each stop flagged `REPEAT-STAGE` whose
  resolution window holds a commit, is a resolution that did not take, so it
  goes to the person under the skill's own one-attempt rule — and this page
  records that it did. `REPEAT-STAGE` is a stage-level flag: whether the *item*
  came back is read by comparing the two handoffs. A `REPEAT-STAGE` stop whose
  window is empty is a restart with nothing changed, not a failed resolution.
- **f.** Write what the sweep did **not** reach. Non-negotiable: the gaps listed
  below are most of any sweep's surface, and a sweep that lists no gaps has
  stopped reading rather than run out of them.

**Markers.** Nothing from this page ships above *primary-source verified*, and
most ships *convention*: one machine, one operator, no control arm, no repeat. A
number without its CLI version and its date is not comparable to any other,
exactly as [firing-harness](firing-harness.md) records for firing rates.
Enforcement on the whole procedure is *convention* — no gate reaches it, and the
check is the sweep section being on this page to read.

(Check: each sweep section carries its stamp — date, CLI version, machine, repos
and run-id range — the verbatim script output, and a *did not reach* paragraph;
absence is visible on the page — *convention*, 2026-09-22.)

**Step d covers every stop since 2026-09-24, owner's decision.** Until then it
decided only on `CROSS-FEATURE` groups, so a stop that happened once, or recurred
within one feature — F3's eight runs on one feature among them — got no
prevention decision at all. The per-stop block in `runs.mjs` was written the same
day as its input; nothing in `workflow.mjs` or in the session's behaviour changed.
**Status: *decided, not yet validated*** — no sweep has used step d in this form
yet, so there is no result to report from it. Enforcement *convention*: the check
is the per-stop decision table being in the sweep section.

---

## The gaps — what a journal and the handoff history do not hold

Verified by reading the files, 2026-09-22; the handoff-history entries and the
narrowing of the preview and join entries, 2026-09-24. Each is a thing a sweep
must not claim.

1. **No cost in money.** One undifferentiated token number per agent, with no
   input/output/cache split, so no price table could be applied even if one
   existed — and a price table is a silently-staling dependency in a repo whose
   gates are dependency-free by rule. **Cost here is tokens and wall-clock,
   never dollars.**
2. **No skill attribution.** `grep` for `Skill`, `money-java`, `primary-keys`,
   `business-numbering`, `java-backend-rules` and `measured-defaults` across all
   28 journals returns **nothing**. Which of the other skills reached an implement
   agent is **not observable from a journal at all** — see the phase-two note.
3. **Tokens null on 26 of 276 agents**, all `state: "done"`. Every total is a
   floor, printed with its coverage.
4. **Effort exists only inside the label string** (`analyze 1 (opus medium)`),
   not as a field, so the reader is coupled to `workflow.mjs`'s prose label
   format. A label it cannot parse is reported and counted under `(unparsed)`,
   never dropped, and the script exits 1 — a silently short table is worse than a
   failure.
5. **Prompt and result previews are capped at 401 characters.** A finding
   survives only where the script lifted it into `result.detail` or
   `result.converge.forced`; one a round graded and the script did not surface is
   unrecoverable. **A stop with a handoff has its reported findings in git as
   well**, durable past a cleared projects directory and readable on any clone;
   **a stop without one has them only in the journal.** The handoff renders
   `result.detail` and nothing more — on `wf_e5ab8e1a-c53`, 2026-09-24, twelve
   items in both — so it does not recover a finding the script did not lift.
6. **Which skill invoked the run is not recorded.** Every journal names
   `build-feature`'s script, so a `converge-feature` run is indistinguishable
   from `build-feature` with `from: "converge"`. `converge-feature`'s claim that
   no feature has been converged by invoking it **is not answerable from here**,
   and the skill now says so rather than guessing. Owner's decision, 2026-09-22:
   **no `invokedBy` change to `workflow.mjs`** — the row stays on `BACKLOG.md`.
7. **Wall attempts inside an implement agent are not recorded**, nor is a second
   implement pass over unchecked ids; neither has a label or a log line. Only the
   phase-level wall outcome is observable.
8. **One id joins a journal to a commit, and only one.** Since 2026-09-18 the
   journal's `result.handoff.commit` names the handoff commit's sha, and the
   report verifies it in git before using it. Every other commit — the
   resolution commits included — joins by feature directory plus time.
   `product-catalog` commits carry a `Claude-Session` trailer; the
   `reference-data` ones do not.
9. **Why a resolution was chosen is not in git.** A resolution commit's diff
   shows what changed, not what the confidence behind it rested on; only a
   `RESOLUTIONS.md` entry says that, where one was written.
10. **A stop with no handoff exists only in the journal's return value** — every
    stop before 2026-09-18, and, under the script as it stands, every stop
    before discovery or on the base branch, which commit nothing by design. A cleared projects directory erases
    it.
11. **A decision made in conversation and never committed is invisible.** Git
    holds what was committed; the journal holds what the run returned; a person's
    answer that changed nothing on disk, or changed it in a later commit outside
    the window, is in neither.
12. **The resolution window is bounded by time, not by intent.** It is every
    non-merge commit on the ref between the handoff and the next run's start.
    Where the feature branch is gone from the clone the report reads a ref that
    holds the handoff, usually the base branch, and a stop with no later run
    reads up to that ref's tip — both can pull unrelated work into the window.

---

## The two mechanisms that lost, and why

**A hook.** It addresses exactly one of the gaps listed above — skill attribution — and
loses on three grounds. It must be installed in every consumer repository, which
is the per-consumer-configuration growth law the owner banned for delivery
reappearing for observation. It observes only the next run, where reading
journals gave **28 runs retroactively on the first afternoon**. And it adds a
failure surface inside a 276-agent run in somebody's service repo. The owner's
frontmatter-or-hooks rule is about *delivery* and does not decide this; the rule
that does is that **observation must not require touching the observed system** —
both because the 28 banked runs exist only because nothing had to be installed,
and because a measurement that changes its subject before measuring it has
nothing to compare against.

**The workflow writing a run record into the feature directory.** It changes
`workflow.mjs`, the measured system, before the first measurement; it lands in the
consumer repository, so this repo could not sweep *across* repos, and the
cross-feature recurrence question needs one reader over both; and it would be
written by an LLM agent — the handoff row is Sonnet low — where a journal's
numbers are the harness's own. **And the measured reason: `RESOLUTIONS.md` is
instructed in prose and had been written 0 times in 8 stops at sweep 1,
2026-09-22.** A per-run record
instructed the same way inherits that rate.

---

## Phase two — `GATES.md`, and the skill nobody is watching

The journals cannot say whether `money` or `primary-keys` reached an implement
agent (gap 2). The service repos answer a weaker and more useful question
themselves: `backend/docs/GATES.md` — 79 KB in product-catalog, 28 KB in
reference-data — carries `## Wired` and `## Named gaps: directives with no gate
here`, cites this set's directive ids, and names the test hosting each. **A second
reader over those files gives per-directive coverage across consumer repos for
every skill here**, not just these two.

The finding that says it would pay, read off those files 2026-09-22:
**`business-numbering` appears in neither repo's `GATES.md` — not under `Wired`,
not under `Named gaps`** — while `money` (`M-1`, `M-3`, `M-4`, `M-7`, `M-24`;
`M-10`, `M-11`, `M-31`…`M-33`; `M-2` wired, with `M-6`, `M-8`, `M-23`,
`M-35`…`M-43`, `M-12`, `M-13`, `M-15`…`M-18` declared as gaps) and `primary-keys`
(`MigrationConventionsTest`, `IdsTest`, `BanListArchTest.noOrderByIdOutsidePager`
wired, two declared gaps) appear on both sides. **A `business-numbering` violation
in produced code fails no gate and shows in no gap list**, so it is invisible to
the wall and to any coverage reader that trusts the gap section. That asymmetry
is a row on `BACKLOG.md` and the reader is not built.

**What neither reader ever does:** decide whether the produced code obeys a
directive. That is the consumer repo's wall, which was green on the runs it ran
on. The coverage reader reports what is gated; the wall reports compliance; a
directive in neither section of `GATES.md` is reported by nobody, which is the
whole of the finding above.
