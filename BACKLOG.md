# Backlog

Owed work, in two kinds. **The topic rows are topics, not verdicts: none has had a
research pass in this repository**, and none is a commitment to build. A topic
becomes a skill only at the bar `tech-decision-research` and `enforceable-rules`
state: a framed decision, an adversarial panel, refutation votes against primary
sources, dated evidence, and a named check per directive. **The evidence rows are the
opposite** — skills already published, carrying what each still owes to raise a
marker.

The topic rows were salvaged on 2026-08-01 from the imported decision corpus, which
was deleted the same day once every one of its rule sets had been published as a
skill, except where a later harvest added one. The corpus is recoverable from git
history at commit `428bd5411884567d68bdf5554a0492977427a815`.

**This page carries what is owed and nothing else.** When a row closes, it leaves
this page — what a pass closed, and what each check found, goes to
`docs/history/`. **A backlog that grows as work completes is recording the wrong
thing.**

## Evidence owed on a published skill

**Five skills — `backend-stack`, `guardrails-toolchain`, `ai-maintainer-principles`,
`primary-keys` and `business-numbering` — were converted from external records of
the same 2026-06-11..14 pass.** All ship everything at *convention* with a central
claim at *uncertain*.

**One thing they all owe, and it closes for all five at once or not at all: primary
sources.** The records cite none. The panel transcripts behind them are published
nowhere, and **two records were searched on 2026-08-01 without success** — so read
this as *the sources may not exist*, which is worse than *not yet found*.
Everything below is what each skill owes **beyond** that.

| Skill | Owed | What it unblocks |
| ----- | ---- | ---------------- |
| `backend-stack` | **A re-open trigger per language-layer loser** | Nothing states what would make Go or C#/.NET worth re-examining, so the skill half-fails its own *Record the losers and their grounds* and says so. **Writing one was rejected** — inventing a trigger nobody set authors the verdict. Closes when the decision owner sets them |
| `backend-stack` | **An enforcement-host census for a serious competitor in a backend role** | The published census was taken for one stack, so it shows Java's surface is deep and **not** that it is deeper. One competing census was recovered (TypeScript, frontend, same pass) and is **role-confounded**. Owed: a census run by someone other than the pass that wrote the Java column |
| `guardrails-toolchain` | **A primary source for any tool claim** — free-tier boundaries, licence terms, the intra-file taint limit, runtime compatibility | Unlike the shared row above, **these are re-verifiable from vendor documentation by anyone**, at the cost of an afternoon per tool. Unsourced, not unobtainable |
| `guardrails-toolchain` | **A second completeness-critic run, on a different gate stack** | Its central claim rests on **one run with no control arm**. A second run that finds a fifth concern, or finds nothing, is the first evidence about the method |
| `guardrails-toolchain` | **A ruling on japicmp, and only on japicmp** | Narrowed 2026-08-01: the contested part is the module-package compatibility check, where one record proposes japicmp and `java-backend-api` evaluated and dropped it, neither arguing the other's side. Closes on a case where an in-repo consumer's compile did not catch an incompatible change to a published type |
| `guardrails-toolchain` | **One cost figure for any gate it requires** | The standing sweep, the benchmark ratchet, the characterization corpus and the extra fuzz lane are unpriced, and `caching` and `async-handoff` already carry unmeasured gate cost. The first adopting repo that measures one holds the first real number |
| `ai-maintainer-principles` | **A measurable proxy for "fits one session"** | Its weakest directive by enforcement — no record states a threshold in any unit, so a module budget is judgment and is most easily applied after the fact to justify a split somebody wanted |
| `ai-maintainer-principles` | **A second repo built to these directives, or one built deliberately against them** | The central claim rests on **no measurement at all**. **A recorded failure is worth as much as a success**: a boundary redrawn, a gate relaxed for a human reader, a retry reintroduced |
| `ai-maintainer-principles` | **A hostile re-derivation of the counterfactual** | Its premise-specificity worked case is the same pass arguing with itself, concluding the decision is robust to a premise it was not optimised for — a comfortable finding for its author. Nobody with a stake in the other answer has run it |
| `ai-maintainer-principles` | **A read of the source records it did not open** | Assembled from nine documents in a repository holding many more, and **two of its confirmed defects came from records adjacent to ones it read**. A bounded read, not a research project |
| `primary-keys` | **A reproduced benchmark** — a time-ordered wide key against a narrow sequential one, on insert throughput and write-ahead-log volume, on any hardware | **The cheapest thing anyone could do to change confidence in this skill.** The record states 3,420 against 3,480 transactions per second with no harness, hardware, dataset or methodology. A reproduction promotes the central cost claim out of hearsay; a contradiction is worth more |
| `primary-keys` | **A primary source for any engine claim** — write-ahead-log behaviour under random keys, heap-tuple-identifier index pointers, the native generator's per-backend monotonicity, the index and heap size figures, the RFC 9562 clause | Each promotes one claim independently, and **all are checkable by anyone against vendor documentation or the RFC**. Unsourced, not unobtainable |
| `primary-keys` | **A re-open trigger per loser**, and **cost measured at the volume where the recorded trigger fires** | The pass set two triggers, both on the winner. **`backend-stack` owes the trigger row identically and `business-numbering` makes three** — one habit failing three times. The measurement is defined and simply untaken: the winner's trigger is measured against a committed baseline for the losing candidate |
| `business-numbering` | **A re-open trigger per rejected alternative** | Same habit, third instance. Nothing states what would make engine sequences or gapless-everywhere worth re-examining |
| `business-numbering` | **A measured contention ceiling** | The recorded ceiling is the pass's own estimate of a serialized window against a projected workload, with no run behind it — and the relief ladder it gates has never fired |
| `business-numbering` | **A statutory check outside one jurisdiction** | Its gaplessness ground rests on a **negative search result**: one jurisdiction, one statute, one regulator's instruction, one date. Any repo elsewhere must run its own, and a positive finding anywhere changes the ground from insurance to compliance |

**Nothing here is a research project.** The sources are a recovery of material that
may not exist; the triggers are a decision the owner makes; the censuses and cost
figures are the same greps and measurements the skills already publish, run against
another stack or at another volume.

**The performance split has never been built.** Layers one and two are a written
contract in `guardrails-toolchain` and in the source record; no repo in this set has
a ratchet, a contention harness or the alert rules. Band width, baseline churn and
whether the gate flakes are all unobserved — which is what that skill's own *a gate
only gates where its measurement is honest* would demand evidence for.

## Context budget owed

**Measured 2026-08-02, and four of the five reductions closed the same day** —
directive text across the set fell from 175,380 to 150,918 tokens. The procedure —
what moves, what must stay inline, which gate to run afterwards, and how to tell it
worked — plus what each closed pass found and **one reduction that was built,
measured and rejected because it made the set larger**, are in
[docs/history/context-budget.md](docs/history/context-budget.md).

| Owed | Why it is owed | Watch |
| ---- | -------------- | ----- |
| **Cut the enumeration out of the three long descriptions left** — `primary-keys` 358, `business-numbering` 306, `guardrails-toolchain` 300; `ai-maintainer-principles` done 2026-08-02, 360 → 277 | Frontmatter is paid every session whether the skill fires or not, and these three enumerate directives the agent gets in full once the skill fires | A check exists now — `npm run firing --skill <name> --against <ref>` — but it costs money and needs repeats, so measure before and after each edit rather than trimming all three and running once. All three fired 2/2 in the Sonnet baseline as they stand; on the 2026-08-03 Opus run `guardrails-toolchain-1` missed on both arms while the other two held. Method and the one worked example are in the history file |

**Every figure behind these rows is re-runnable**: `npm run tokens:sections`,
wired 2026-08-02. Re-measure before starting a row and after finishing one —
`--repeated` for a section name carried by several skills, `--skill <name>` for
one body.

## Firing owed

**Two baselines exist now, and neither is comparable to the other.** Sonnet
2026-08-02: 31/44, linux, $5.86. Opus 2026-08-03: 19/44 on the pre-edit
descriptions and 23/44 on the `ALWAYS load` ones, win32, same CLI 2.1.220,
$18.98 — taken as one `--against` run, so the pre-edit arm is the Opus
re-baseline this table used to owe. Four negative cases clean on every run so
far. Method, both baselines, the void Windows run that preceded the real one,
and the confounds that make any single miss weak evidence are in
[docs/history/firing-harness.md](docs/history/firing-harness.md).

| Owed | Why it is owed | Watch |
| ---- | -------------- | ----- |
| **An explore-tolerant harness mode, and the java cases re-measured under it** | The 2026-08-03 repeats run settled the Java collapse (16/80, transcripts unanimous): Opus's first move in a concrete repo is to read code, every tool but `Skill` is denied, so the session dies before the skill decision. The harness measures *fires as the first action*, which for repo-fixture execution prompts is not delivery. No description edit can fix this | Read tools allowed, more turns, scored as *skill loaded before the first code edit*. Costs more per session. Until it exists, the java-case rates mean "first-move firing" only — see [docs/history/firing-harness.md](docs/history/firing-harness.md) |
| **Re-run the seven bare-fixture Opus misses at `--repeats 5`** | The explore-first artifact cannot explain a bare-repo miss — there is nothing to explore — so these seven (`money-1`, `money-2`, `money-storage-2`, `async-handoff-1`, `llm-default-traps-2`, `enforceable-rules-1`, `tech-decision-research-2`) are the misses that may actually be description work | ~$8 for 7 cases × 5. Only what stays below about half is description work |
| **The stack-sibling boundary, now with a cleaner symptom** | Nine java-repeat sessions loaded the language-neutral parent (`money`, `caching`, `async-handoff`) without the `-java` sibling whose description says to install alongside. When Opus does fire before exploring, it reaches for the parent and skips the tool mapping | Whether a real session that loaded `money` opens `money-java` by the time it writes code is the explore-tolerant mode's question too |
| **Settle the `ALWAYS load` edit with repeats** | 19/44 → 23/44 with eight cases changed, six up and two down, is one repeat per case: consistent with an improvement, not evidence of one — and the whole gain sits in the bare fixture (12/24 → 17/24), where the measurement is not distorted by the explore artifact. The negatives' half is settled: 4/4 clean on both arms | The eight changed cases first: 8 cases × 2 arms × 5 repeats ≈ $18. The edit is additive and 20 frontmatter tokens; it stays unless repeats show the two down-flips are real |
| **The Opus/Sonnet gap, residual** | Most of 19/44-against-31/44 dissolved into the explore-first behavior on the java cases. The residual question is the bare fixture — Opus 12/24 pre-edit against Sonnet's bare rate — still confounded by win32-against-linux | One model's bare-fixture run repeated on the other's platform. Smaller question than it was on 2026-08-03 morning |
| **A second corpus author** | Every prompt in `firing-cases.json` was written by the same pass that read the descriptions, which is the harness's own version of the panel-of-one problem `guardrails-toolchain` owes a fix for. A prompt written by someone who has not read a description is worth several written by someone who has — and the repeats run adds a shape rule: for repo fixtures, question-shaped and execution-shaped prompts measure different things (5/5 against 0/5 on the same skills) | Cheap. Anyone can add cases; the corpus rule is stated at the top of the file |

## Researched, unwritten

Each row is a topic whose sources were identified during the corpus era. **The
underlying research notes were never in this repository** and are not in its git
history, so these rows are topic summaries, not evidence. Harvesting one means
re-verifying its claims from primary sources, splitting portable rules from
project-shaped facts, recording the premise each rule holds under, and writing the
skill.

**Cost, from every harvest run so far: a day, not a research project.** **Both
remaining rows have a decision record in `../net-saas`**, so a harvest starts from a
written decision with named losers rather than from a topic summary. **That does not
promote either row**: a decision record states grounds, it is not research notes, and
the records found so far cite no primary source for anything. The lesson that binds
both rows: **a row naming "research notes" has repeatedly named a hope rather than a
location**, and these two name records that exist.

| Candidate skill | Named sources | What it would carry |
| --------------- | ------------- | ------------------- |
| `angular-frontend-ai` | CVE-2025-29927 (Next.js) | An explicit Angular profile for AI maintenance; Bun versus Node; the Next.js rejection on CVE-2025-29927; a signal-everything dialect, an eslint wall, and exemplar files |
| `postgres-tenancy` | PostgreSQL documentation; HikariCP issue #1633; CVE-2018-1058 | Schema-per-tenant versus pooled row-level security versus database-per-tenant, with PostgreSQL-documented facts (`PREPARE` re-parse, HikariCP #1633, CVE-2018-1058), the ceiling on each, and the escape hatches. **Its record was opened on 2026-08-01 during the `primary-keys` harvest, for one fact — that logical replication carries rows and not sequence values — and is otherwise unread. It carries the two cited issue numbers, and the pooled-RLS and database-per-tenant rejections, each with grounds** |

## Candidate topic

| Topic | Why portable | Where its checks would land |
| ----- | ------------ | --------------------------- |
| **object-storage** | A rule against unbounded retention or unversioned overwrite is portable; the check that fails a build is per stack | every stack skill whose repos write blobs |

A search index and feature flags are expected to have the same shape and are not
yet worth a row.

**Not a new topic**: more throughput, multi-tenancy, a different broker or cloud,
stricter thresholds. Those are edits to an existing skill or plan-time decisions.
A persistence preference is a variant of an existing rule set, not a new one.

## Shelved

Three exactness domains next to money — **physical quantities, legal time, and
security-critical values**. Not shipped because enforcement for each is bespoke or
partial, which is the same reason they would be hard to ship now. Reopening one
means finding the off-the-shelf check first, not writing the directives first.
