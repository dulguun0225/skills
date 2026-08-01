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
| `ai-maintainer-principles` | **owed, and it is the check most likely to bite here.** Three of its directives quantify over an open set named only by example — *every operational surface*, *every load-bearing dependency*, *anything subtle enough to need a safety argument*. A predicate that enumerates instead of defining is the exact shape the check was written against, and the skill's own gap list does not name this one | **owed** | n/a — nothing it governs crosses a layer; its subject is where a boundary falls, not what crosses one |
| `primary-keys` | **owed, and it is the check most likely to bite here.** Its central criterion is an enumeration — rank candidates by the surfaces the id lands on — and the surfaces are given by example: URL, log line, payload, export, replication stream, escape-hatch store. **A repo with a surface outside that list gets a green selection record and the wrong key**, and the skill's own gap list names this one, which the earlier failures of this check did not | **owed.** Its subject *is* an identifier that crosses into a URL, a log line, a payload, an export and a replication stream, so the shapes assembled out of a key are the whole surface — and the skill enumerates them as a criterion without ever asking what composite a repo builds out of two of them | **owed.** The key crosses the schema, the generated database classes, the wire contract, the export toolchain and the object-storage path, and the directives name checks at the first three and a caveat at the fourth |
| `guardrails-toolchain` | n/a — its directives bind a tool choice, not a technology | **owed** | **owed**, and it is the check most likely to bite here: this skill's whole subject is which layer owns which defect class, so a directive that names one layer and misses another is the failure mode it was written against |

Doing one of these is a bounded session, not a research project. The layer check
is a read of the file asking one question per directive; the composite-shape
check is a list written before anything is verified. Neither needs a panel, and
**neither may promote a marker** — a check that finds nothing changes no
confidence marker, because finding nothing is not verification. What it may do
is add directives, and those then arrive at the normal bar.

## Evidence owed on a published skill

**Three skills — `backend-stack`, `guardrails-toolchain` and
`ai-maintainer-principles` — all published 2026-08-01 from external records of the
same pass, all shipping everything at *convention* with a central claim at
*uncertain*.** Rows are in the order the skills were published, `backend-stack`
first.

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

**`ai-maintainer-principles`, harvested across the same pass's architecture
decision records.** What it owes:

| Owed | What it unblocks |
| ---- | ---------------- |
| **A measurable proxy for "fits one session"** | The skill's weakest directive by enforcement. No record read for it states a threshold in any unit — no file count, no line count, no token budget — so a module budget is judgment and the criterion is most easily applied after the fact to justify a split somebody already wanted. Any repeatable number that predicts whether an agent can hold a module moves it from judgment to check |
| **A second repo built to these directives, or one built deliberately against them** | The central claim — that these decisions come out different under an agent maintainer than under a human team — is *uncertain* on **no measurement at all**. One repo was built this way; none was built the other way for comparison. **A recorded failure is worth as much as a success here**: a boundary redrawn, a gate relaxed for a human reader, a retry reintroduced |
| **A hostile re-derivation of the counterfactual** | The skill carries that pass's own re-derivation under a changed axiom as its premise-specificity worked case. It is the same pass arguing with itself, and it concludes the decision is robust to a premise it was not optimised for — a comfortable finding for its author to reach. Nobody with a stake in the other answer has run it |
| **Primary sources — same search, same result** | The 2026-06-11..14 records cite nothing, and the panel transcripts behind them are published nowhere. **This is the third skill in that position and the row is not separate from the two above it**; it closes for all three at once or not at all |
| **A read of the source records the skill did not open** — added 2026-08-01 by the hostile audit | The skill was assembled from nine documents in a repository that holds many more. **Two of its confirmed defects came from records adjacent to ones it had read** — a discriminator's third branch, and a rejection whose grounds sat in a record it never opened — and a third ground it does cite comes from a record outside its declared window. The audit's own top finding for `guardrails-toolchain` was that reading a source's neighbours is part of conversion and skipping them looks identical to finishing. **This is that finding recurring one publish later**, and it is a bounded read, not a research project |

**`primary-keys`, harvested from the same pass's primary-keys record and the five
neighbours it names.** What it owes:

| Owed | What it unblocks |
| ---- | ---------------- |
| **A reproduced benchmark** — a time-ordered wide key against a narrow sequential one, on insert throughput and write-ahead-log volume, on any hardware | **The cheapest thing anyone could do to change the confidence in this skill.** The record states 3,420 against 3,480 transactions per second as a controlled benchmark and records no harness, hardware, dataset or methodology; the skill carries the numbers because a range would misrepresent what the pass claimed, and names them unreproduced in three places. A reproduction on any machine promotes the central cost claim out of hearsay; a contradiction is worth more |
| **A primary source for any engine claim in it** — write-ahead-log behaviour under random keys, PostgreSQL secondary indexes pointing at heap tuple identifiers, the native generator's per-backend monotonicity, the index and heap size figures, and the RFC 9562 clause the record names without quoting | Each promotes one claim independently. **These are unsourced, not unobtainable** — every one is checkable against vendor documentation or the RFC by anyone, at the cost of an afternoon, which is the same position `guardrails-toolchain`'s tool facts are in and a better one than the other two skills' grounds |
| **A re-open trigger per loser** | The pass set two triggers, both on the winner, and nothing states what would make the bigint-plus-external-id hybrid or TSID worth re-examining. **`backend-stack` owes this identically and for the same reason**, so it is one habit failing twice rather than two omissions. Closes when a decision owner sets them, or when a re-examination happens and records its own grounds. **Writing one during the harvest was rejected**, same call as the `backend-stack` recovery: inventing a trigger nobody set authors the verdict rather than records it |
| **Cost measured at the volume where the recorded trigger would fire** | Nothing in this set has run any key strategy at the scale where the read-latency trigger fires, which is the only condition under which the cost side of this decision is tested rather than argued. **The winner's trigger is measured against a committed baseline for the losing candidate**, which is what makes it executable — so the measurement is defined and just has not been taken |
| **Primary sources for the pass itself — same search, same result** | The panel transcripts behind the three-way evaluation are published nowhere. **This is the fourth skill in that position and the row is not separate from the three above it**; it closes for all four at once or not at all |

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
row below has a decision record in the same external repository**, as did both
rows harvested out of this table since. A frontend
profile ADR carries the Angular row's rejections including the Next.js one; a
schema-per-tenant ADR carries the tenancy row with the HikariCP issue and the
`search_path` CVE both cited by number; a primary-keys ADR carries the
UUIDv7 row. **This does not promote any row.** A decision record states grounds;
it is not the research notes, and the records found for `backend-stack` cite no
primary source for anything. What it changes is the cost estimate: harvesting
starts from a written decision with named losers rather than from a topic
summary.

**Three rows were harvested the same day and are gone from the table below:
`guardrails-toolchain`, `ai-maintainer-principles` and `primary-keys`, all
published 2026-08-01.** The table gained one row it did not have —
`business-numbering` — because the third harvest read a neighbouring record in
full and deliberately carried only the part its own topic rested on.

**What the third one changed about the cost estimate: nothing, and that is the
finding.** Its row named "UUIDv7 research notes" as its source and no such notes
exist — the same result as the second harvest, so **a row naming research notes
has now twice named a hope rather than a location.** What existed was one decision
record whose own status line names a three-way adversarial evaluation and records
grounds per loser — **the best-structured source any harvest here has had** — plus
five neighbours it names or is named by, all of which had to be read. One of them,
the business-numbering record, **changed a directive rather than decorating it**:
from the primary-keys record alone the rule would have read "keep the
sequence-reset checklist short", and the neighbour resolves it to zero. The
estimate held: a day, not a research project.

**What the second one changed about the cost estimate.** Its row named "AI-maintenance
research notes" as its source; **no such notes exist** — not in this repository, not
in the deleted corpus's working copy, not in the external repository. What exists is
**that pass's architecture decision records** — boundary criteria, service
decomposition, stack chassis, verification strategy, local verification,
predecessor scoping, code layout, plus a non-authoritative counterfactual variant
and a note written for management — and the topic had to be assembled across them
rather than read out of one. That is the opposite shape from
the toolchain harvest, which had a single consolidated map and spent its effort
deciding what the published skills already owned. **The estimate held anyway — a day,
not a research project — but for a different reason**: the records are long,
argued, and each states its own grounds, so assembling across them cost about what
reading one map and diffing it against the published skills did. **A row naming a
source document is naming a hope, not a location, until someone opens it.**

The row also predicted its own hardest problem correctly: two of its four topics had
already been published by `backend-stack`, and checking what was left against
those two directives first is what the harvest did. **A third overlap it did not
predict** — the eight design principles in `enforceable-rules` — turned out to be
the real constraint, and the resolution is that the published skill states *system
shape* while `enforceable-rules` states *rule shape*, with the principles cited by
name and none restated.

The toolchain row confirmed the cost
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
| `angular-frontend-ai` | CVE-2025-29927 (Next.js) | An explicit Angular profile for AI maintenance; Bun versus Node; the Next.js rejection on CVE-2025-29927; a signal-everything dialect, an eslint wall, and exemplar files |
| `postgres-tenancy` | PostgreSQL documentation; HikariCP issue #1633; CVE-2018-1058 | Schema-per-tenant versus pooled row-level security versus database-per-tenant, with PostgreSQL-documented facts (`PREPARE` re-parse, HikariCP #1633, CVE-2018-1058), the ceiling on each, and the escape hatches. **Its record was opened on 2026-08-01 during the `primary-keys` harvest, for one fact — that logical replication carries rows and not sequence values — and is otherwise unread. It carries the two cited issue numbers, and the pooled-RLS and database-per-tenant rejections, each with grounds** |
| **`business-numbering`** — added 2026-08-01, **not salvaged from the corpus but left behind by the `primary-keys` harvest** | The same pass's business-numbering record, 2026-06-12, read in full for that harvest | Human-facing identifiers as a class distinct from row keys: number classes and their scopes, gapless as a transactional property of a same-transaction counter increment rather than a cleanup job, counter rows instead of engine sequences, a typed-parts format model against the string-interpolation pattern language it names as the anti-pattern, check-digit selection with the algorithm in stored config, and exhaustion with a hard-fail rather than silent widening. **`primary-keys` carries only the part its own decision rests on** — that the two identifiers are separate and that the sequential one is not implemented with sequences — and says so. The rest is a skill's worth of material restated nowhere in this set |

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
