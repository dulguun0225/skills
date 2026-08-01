# Backlog

Topics, not verdicts. **Nothing on this page has had a research pass in this
repository**, and nothing here is a commitment to build. A row becomes a skill
only at the bar `tech-decision-research` and `enforceable-rules` state: a framed
decision, an adversarial panel, refutation votes against primary sources, dated
evidence, and a named check per directive.

Salvaged on 2026-08-01 from the imported decision corpus, which was deleted the
same day once every one of its rule sets had been published as a skill. The
corpus is recoverable from git history at commit
`428bd5411884567d68bdf5554a0492977427a815`.

## Checks never run over the published skills

Three incompleteness checks are published in `enforceable-rules`. Each was found
*after* the rule set that failed it had shipped and been read repeatedly, so a
blank here is not a clean bill — **it is a check nobody has run.**

| Skill | The predicate check | The composite-shape check | The layer check |
| ----- | ------------------- | ------------------------- | --------------- |
| `money`, `money-api` | **not run** for `M-1` … `M-29`, whose predicate names a domain rather than a technology — the lowest-risk gap here | run 2026-07-29 | run 2026-07-29 — this is the rule set that failed it, and the failure is what produced the check |
| `money-storage` | run 2026-07-29 for `M-30` … `M-43` | run 2026-07-29 | run 2026-07-29 |
| `caching`, `caching-java` | effectively run at authoring — the client-scoped seam draft was caught and widened, which is where the check came from | **owed** | **owed.** Cached values cross into a serializer and into whatever the engine stores on the wire, and no directive names either |
| `async-handoff`, `async-handoff-shapes` | run 2026-07-29 | run 2026-07-29 — this is the rule set that failed it | **owed.** Its values cross into a payload contract, an outbox row, and a schema registry if one is ever added |
| `java-backend-rules`, `java-backend-api`, `java-backend-observability` | n/a — a stack rule set has no portable predicate | n/a — it instantiates other rule sets' shapes | **owed** for its own rules, the ones that are not an instantiation of another skill |
| `llm-default-traps` | n/a — cross-stack by construction | **owed** | **owed** |
| `backend-stack` | n/a — its directives bind a decision, not a technology | **owed** | n/a — nothing it governs crosses a layer |
| `guardrails-toolchain` | n/a — its directives bind a tool choice, not a technology | **owed** | **owed**, and it is the check most likely to bite here: this skill's whole subject is which layer owns which defect class, so a directive that names one layer and misses another is the failure mode it was written against |

Doing one of these is a bounded session, not a research project. The layer check
is a read of the file asking one question per directive; the composite-shape
check is a list written before anything is verified. Neither needs a panel, and
**neither may promote a marker** — a check that finds nothing changes no
confidence marker, because finding nothing is not verification. What it may do
is add directives, and those then arrive at the normal bar.

## Evidence owed on a published skill

**Two skills, `backend-stack` and `guardrails-toolchain`, both published
2026-08-01 from external records of the same pass, both shipping everything at
*convention* with a central claim at *uncertain*.** The `guardrails-toolchain`
rows are at the end of this section; the `backend-stack` rows come first because
they were opened first.

**`backend-stack`** — three rows stood here at publication. **The
candidate list at the language and runtime layer was recovered the same day and
its row is gone** — the four candidates and the ground each lost on are in the
skill, the verdict is a contested win rather than an unexamined one, and
`CLAUDE.md` holds the account of what the recovery changed. What it did **not**
supply is below.

| Owed | What it unblocks |
| ---- | ---------------- |
| **The 2026-06-11..14 platform pass's primary sources**, not held in this repository — **and searched for on 2026-08-01 without success** | Promotes the Java verdict's grounds from convention to primary-source verified, per claim. The skill's *Do not cite* list names them as unavailable and must be rewritten when they arrive. **Two external records were searched and neither cites a source**: the pass's own decision records state grounds without citation, and the material this skill set was converted from says the steelmen and grounds "are recorded in the research pass" — transcripts published nowhere. **Re-read this row as: the sources may not exist**, which is a different and worse position than not having found them yet |
| **A re-open trigger per language-layer loser**, which the pass never set | *Record the losers and their grounds* requires each loser to carry the condition that would reopen it, and the recovered record carries none — so `backend-stack` still half-fails that directive about itself, and says so. Nothing states what would make Go or C#/.NET worth re-examining. **Writing one during the recovery was rejected**: inventing a trigger nobody set authors the pass's verdict rather than records it. This row closes when the decision owner sets them, or when a re-examination happens and its own grounds are recorded |
| **An enforcement-host census for one serious competitor, in a backend role** — narrowed 2026-08-01, not closed | The published census was taken for one stack, so it shows Java's surface is deep and **not** that it is deeper. **One competing census was recovered**: TypeScript, from the same pass's frontend profile plus its consolidated toolchain map, dated 2026-06-12..13 and now in `backend-stack`. It gave *Count the independent enforcement hosts* its first case, and the case cuts against a naive reading of it — both columns fill seven of eight categories, and what separates them is one absent category (no host for custom checks on the compile path) and one where the tool exists but the gate is advisory with an unresolved upstream issue. **What is still owed** is a census for a competitor doing this stack's job, run by someone other than the pass that wrote the Java column. Also recovered and now carried: the *coverage and mutation* host compared across three candidates from the candidate list itself |

**Nothing here is a research project.** The sources are recovery of material that
may not exist; the triggers are a decision the owner makes; the census is the
same grep the skill publishes, run against another stack's rule set.

**`guardrails-toolchain`, harvested from the same pass's consolidated toolchain
map and the four decision records folded out of it.** What it owes:

| Owed | What it unblocks |
| ---- | ---------------- |
| **A primary source for any tool claim in it** — free-tier boundaries, licence terms, the intra-file taint limit, compatibility with a pinned runtime | Promotes tool facts from convention to primary-source verified. **The same search that failed for `backend-stack` covers this**: the record cites nothing, and the sweep behind it is published nowhere. The difference is that these claims are re-verifiable from vendor documentation by anyone, at the cost of an afternoon per tool — they are unsourced, not unobtainable |
| **A second completeness-critic run, on a different gate stack** | The skill's central claim — that asking what whole concerns a stack omits finds things no tool-by-tool comparison does — rests on **one run with no control arm**. A second run that finds a fifth class, or finds nothing, is the first evidence about the method rather than about the four concerns it produced |
| **A ruling on japicmp — and only on japicmp** | Opened 2026-08-01 as a broad "consumer-surface scope disagreement" and **narrowed the same day by the hostile audit**, which read the contract record the first pass had not: the prior-art repo's full-document diff runs under an allow policy permitting exactly the additive changes a same-change client regeneration absorbs, which is `java-backend-api`'s own ground applied as configuration rather than as a competing position. What is actually contested is the module-package compatibility check: the record proposes japicmp, `java-backend-api` evaluated and dropped it, neither argued the other's side. It closes on a case where an in-repo consumer's compile did not catch an incompatible change to a published type |
| **One cost figure for any gate the skill requires** | The standing sweep, the benchmark ratchet, the characterization corpus and the extra fuzz lane are all unpriced, and `caching` and `async-handoff` already carry unmeasured gate cost as an open question. The first adopting repo that measures one holds the first real number in this set |

**The performance split has never been built.** Layers one and two are a written
contract in the source record and in the skill; no repo in this set has a
ratchet, a contention harness or the alert rules. Band width, baseline churn and
whether the gate flakes are all unobserved — which is exactly what the skill's
own *a gate only gates where its measurement is honest* directive would demand
evidence for.

**What the recovery cost, recorded so the next one is priced.** Outside the two
`backend-stack` files it changed both `java-backend-rules` files, `README.md`,
`CLAUDE.md` and this page — and every one of those edits was a sentence
asserting the absence of the thing recovered. **A recovery obliges the same sweep a publish
does**, and for the same reason: the claim that something is missing is a
cross-file claim nothing checks. **Deleting a closed row is part of that sweep**:
this page had the residues recorded only inside the row that closed, so removing
it without promoting them to rows of their own would have dropped them.

**What the review verified, stated so a blank is not read as coverage.** Skill
count, the 95 directive ids and their uniqueness, every `###` and `##` heading,
backticked identifier tokens per file, every date, every confidence and
enforcement marker, bullet and numbered-item counts, table rows, bold spans,
directive statements, and dropped negations — all by script against `HEAD`, all
clean but the rows in this section. **Not verified**: whether a compressed sentence still
supports the cross-skill claim another skill makes about it, and whether any
`*Check:*` line still names an enforceable check rather than a shorter phrase
that reads like one. Both are readings, not greps.

## Researched, unwritten

Each row is a topic whose sources were identified during the corpus era. **The
underlying research notes were never in this repository** and are not in its git
history either, so these rows are topic summaries, not evidence. Harvesting one
means re-verifying its claims from primary sources, splitting portable rules from
project-shaped facts, recording the premise each rule holds under, and writing
the skill. Order of magnitude: a day, not a research project.

**Located 2026-08-01, while recovering the `backend-stack` candidate list: every
row below has a decision record in the same external repository**, as did the
toolchain row that has since been harvested out of this table. A frontend
profile ADR carries the Angular row's rejections including the Next.js one; a
schema-per-tenant ADR carries the tenancy row with the HikariCP issue and the
`search_path` CVE both cited by number; a primary-keys ADR carries the
UUIDv7 row. **This does not promote any row.** A decision record states grounds;
it is not the research notes, and the records found for `backend-stack` cite no
primary source for anything. What it changes is the cost estimate: harvesting
starts from a written decision with named losers rather than from a topic
summary.

**The toolchain row was harvested the same day and is gone from the table below:
`guardrails-toolchain`, published 2026-08-01.** It confirmed the cost
estimate above and one thing the estimate did not predict — **the harvest's
expensive half was not the writing, it was establishing what the published
skills already owned.** The source map splits three ways — rows a sibling skill
already names with its own check, the frontend column `backend-stack` already
carries as its competing census, and the rows nothing here owned. Only the third
group is restated, alongside the selection criteria and the four gap classes.
**What that row still owes is now in *Evidence owed on a published skill*, not
here** — the same promotion the `backend-stack` candidate-list row went through,
for the same reason: a row that closes often holds the only record of what it
did not discharge.

| Candidate skill | Named sources | What it would carry |
| --------------- | ------------- | ------------------- |
| `ai-maintainer-principles` | AI-maintenance research notes | Startup-loud versus runtime-silent behaviour; the one-AI-session cognitive-load boundary criterion. These overlap the eight design principles already published in `enforceable-rules`; this candidate would be their directive form — the same ideas as rules a repo commits, rather than as an authoring bar. **Two of its four topics were published on 2026-08-01 by `backend-stack`** — "what the build can refuse to ship is the deciding criterion" is that skill's first directive, and corpus-gravity and drift-asymmetry reasoning is its fourth. Harvesting this row now means checking what is left against those two directives first, not re-deriving them |
| `angular-frontend-ai` | CVE-2025-29927 (Next.js) | An explicit Angular profile for AI maintenance; Bun versus Node; the Next.js rejection on CVE-2025-29927; a signal-everything dialect, an eslint wall, and exemplar files |
| `postgres-tenancy` | PostgreSQL documentation; HikariCP issue #1633; CVE-2018-1058 | Schema-per-tenant versus pooled row-level security versus database-per-tenant, with PostgreSQL-documented facts (`PREPARE` re-parse, HikariCP #1633, CVE-2018-1058), the ceiling on each, and the escape hatches |
| `uuidv7-primary-keys` | UUIDv7 research notes | UUIDv7-everywhere versus bigint identity versus TSID hybrids, with the `ORDER BY` carve-out |

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
