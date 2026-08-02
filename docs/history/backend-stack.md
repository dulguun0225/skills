# The `backend-stack` skill

*Extracted from `CLAUDE.md` 2026-08-02, unedited except that cross-section pointers became file links. Where older text says "this file", it means the project record, which was one file then.*


Authored 2026-08-01, **first skill in repo not drawn from deleted corpus**. Two files:

```
skills/backend-stack/  SKILL.md  evidence.md   8 criterion directives + 3 worked-case sections, no ids
```

Sixteenth skill, listed by `npm run check`. **No row in [the decomposition record](decomposition.md) table, cuz that table = corpus provenance and this skill have none.** Drawn from: 2026-06-11..14 platform pass (via what `java-backend-rules` already publish about it, plus that pass own ADRs in sibling repo `../net-saas`, recovered 2026-08-01), host census over published skills, and interview with repo owner.

### Why it exist

Repo shipped fifteen skills instantiated on one stack and **nothing argued the stack**. `java-backend-rules` said explicitly it no argue it, and told reader "decide it on operability first" — which owner say wrong: stack chosen for **mature compile-time guardrail surface** serving spec-driven development, where operability = floor not criterion. Skill publish that argument.

### What it decided

1. **Two halves: portable criterion + Java as worked case.** Criterion = payload, decide Go/.NET/TS question same way. Worked case there as evidence criterion discriminate, **explicitly not recommendation**. Rejected: Java-verdict-only (fire only when someone already asking about Java, do nothing for BACKLOG stacks) and full-four-layer (write-once violation — `java-backend-rules` already own JPA/WebFlux/annotation rejections).
2. **Criterion = enforcement-host count, not type system.** Owner point: it ArchUnit, NullAway, Error Prone etc, no javac alone. Eight host categories, each reach different defect class. **This the load-bearing content** and it what make argument survive contact with "but Kotlin/C# have good types too".
3. **Host census = re-runnable grep, dated, command published in skill.** 16 hosts across published skills, 2026-08-01. `enforceable-rules` enumeration check explicitly allow count as evidence **when stated with date + called re-runnable**, so its decay = point not defect. First use of that exception in repo.
4. **Census is evidence about Java ecosystem, NOT about choice being right.** Circularity blocked by own directive *A rule set is never a reason to adopt a stack*, sentence salvaged from `java-backend-rules` paragraph rewritten. `evidence.md` carry two do-not-cite entries for exactly this.
5. **Everything convention; central claim *uncertain*.** Second skill in set whose central claim uncertain (`tech-decision-research` first), same ground — no outcome measured. Criterion **written after decision it explain**, so it have only ever ratified, never selected. Stated in skill.
6. **Lapse rule vacuous, stated not omitted** — method-skills precedent, nothing above convention so rule demote nothing. Conversion date 2026-08-01 stated once, labelled conversion date. Per-directive dates: 2026-06-11..14 where platform pass ground it, 2026-08-01 where directive state something pass no write in that form. **No date invented.**
7. **No rule ids, `###` headings** — `llm-default-traps` decision 2. **No `## Wiring the gates`** — directives bind decision made before code exist, same as `tech-decision-research`.
8. **Skill fail own directive and say so.** *Record the losers* require candidate list; **none survive for language/runtime layer** at authoring. Shipped as **unexamined win not contested one**, same honesty `java-backend-rules/evidence.md` apply to WebFlux ban. **Reversed same day — see *The candidate-list recovery*.** List found in sibling repo, verdict now contested win; half of directive still failed, cuz pass set no re-open trigger per loser.

### The sweep

**Publish oblige sweep, and this publish contradict published sentence — first time that happened.** `java-backend-rules/SKILL.md` said platform decided "on dominant criterion, which is that team can run this stack in production" + "decide it on operability first and come back". Rewritten: operability = **veto** winner must clear, criterion = enforcement surface, pointer to `backend-stack`. **Half kept unchanged** — *a rule set is never a reason to adopt a stack* still true and now published both places, cuz it block circularity this new skill most exposed to. `llm-default-traps` lesson applied: check what new skill publish against what old sentence claim, and here old sentence half-right.

Also swept: `java-backend-rules/evidence.md` (platform-pass note now say candidate list absent at language layer; WebFlux re-open trigger now name where platform decision get argued), `README.md` (row + marker-ceiling sentence — **README inside sweep rule, per whole-project review 2026-07-31**), `BACKLOG.md` (new *Evidence owed* section; `ai-maintainer-principles` row narrowed cuz **two of its four topics now published here**).

### The candidate-list recovery, 2026-08-01

**Backlog item *Evidence owed on a published skill*, second row, closed same day skill shipped — and row deleted from `BACKLOG.md`, no left struck through.** Deleting it forced promoting its two residues to rows of own (primary sources, re-open trigger per loser), cuz row that close often hold only record of what it no discharge. **This file = account of what closed; backlog carry only what still owed.** Material found in sibling product repo `../net-saas` — its stack-overview ADR + explicit-JVM ADR, both dated **2026-06-12**, inside 2026-06-11..14 window. Four language candidates with ground each lost on: **C#/.NET** (native `decimal` + compile-time project boundaries, lost on silent zero-defaults, open non-exhaustive enums, drifting outbox landscape — close second), **Kotlin** (ergonomics, lost on commercial-or-noisy mutation testing over Kotlin bytecode, silently-rounding stdlib `BigDecimal /`, idiom variance), **Go** (best explicitness + best ops story, lost on no maintained mutation testing, statement-only coverage, silent zero-values in money code), **TypeScript backend** (no enforced decimal type, disqualified for ledger). Winner grounds all host-shaped: PIT, Error Prone extensibility, sealed + exhaustive switch, throwing `BigDecimal.divide`, Modulith outbox, deepest banking corpus.

**Restated in skill, not cited.** That repo not published in this skill set, so pointer nobody can follow — same call money + Java-backend skills make for prior-art documents. Material travel or get dropped.

**Four things recovery changed beyond publishing list:**

1. **Attribution stop being inference.** `evidence.md` had recorded language-layer attribution to that pass as inference drawn during conversion, same shape as three undated Platform directives. Record cover language layer explicitly and date inside window. Inference was right; now no longer inference. `java-backend-rules/evidence.md` swept.
2. **"Criterion is this skill set's own synthesis" narrowed — pass *did* write criteria down.** Five: compile-time error surface, test-ecosystem quality, exact decimal money math, minimal operational surface, idiom stability across sessions. Skill collapse first + second into one ranking, turn fifth into cost. **Unchecked step now named as the collapse**, not as whole criterion being invented.
3. **Genuine contradiction found and shipped unresolved.** Pass **list** operability among five to maximise = ranked criterion; skill demote it to veto. Pass **practice** support veto — Go recorded as best ops story of four and lost anyway. Skill state both, pick neither. Same call money phase 1 made on exponent-4 disagreement.
4. **Premise confirmed by outside record.** Stack-overview ADR open by stating AI sole maintainer, humans never read code — shared premise written by pass itself, not carried forward by conversion. Plus greenfield-merit scoping with hiring explicitly irrelevant.

**Nothing promoted above convention, and reason changed.** Before: no list. Now: list = decision record with **no per-claim marker and no primary source cited anywhere in it**. Grounds are checkable claims about other ecosystems' tooling and none verified here. New do-not-cite entry cover exactly that: grounds recorded as *what decision was taken on*, not as true today, cuz tooling claims decay fastest of any kind in set.

**Recovery oblige same sweep publish does**, and every edit outside skill was sentence asserting absence of thing recovered — `java-backend-rules/SKILL.md`, its `evidence.md`, `README.md`, `BACKLOG.md`, this file.

### Second recovery pass, same day — the competing census

**Two more external record sets searched: `../raw` (imported corpus, undeleted working copy of what repo deleted 2026-08-01) and rest of `../net-saas`.** Three results, one big.

- **Primary sources no exist in either, and that a result not a blank.** Corpus java-backend pack say plainly "full steelmen and grounds are recorded in the research pass" — pointer at transcripts published nowhere. Two records searched, both silent. `BACKLOG.md` row + skill both now say **sources may be non-existent, not merely unlocated**, which worse position than "not found yet" and must no be read as same thing.
- **Competing enforcement-host census found, and third backlog row narrowed not closed.** Same pass's **frontend profile ADR + consolidated guardrails map**, dated **2026-06-12..13**: TypeScript stack with tool named per host category. Now published in `backend-stack` as eight-row table against Java column. **Result cut against naive reading of skill own criterion** — both columns fill seven of eight, and what separate them is one *absent* category (lint run beside type checker, no host for custom check on compile path) plus one where tool exist and gate is advisory with unresolved upstream issue, against blocking mutation score on money modules. **So count came out level and something else decided**, which test *Count the independent enforcement hosts* rather than confirm it, and give *Enforcement-tool maturity is separate question* its first data. Three confounds stated before result in skill: **not independent** (same org, same pass, same author as Java column), **role-confounded** (frontend have no migration lint to host, browser driver not container test), and **no rehabilitation** of TypeScript backend, which lost on absent decimal type — language fact no host count reach.
- **One recorded expectation point away from winner, and no skill carried it.** Cache + broker sources predicted second stack host their type-design directives worse; generic half published in `caching` + `async-handoff`. **Per-candidate half never carried anywhere**: it expected **Go** to host them *more* strongly than Java, on compiler-enforced package boundary + unexported method making outside implementation impossible. Now in `backend-stack`, cuz skill publishing census that favour own stack should carry one recorded claim against it. No conflict with Go losing actual decision — that was mutation testing, coverage granularity, zero-values. **Two records together = evidence host categories not interchangeable**, which is what that directive assert and had no case for.

**Backlog gained finding beyond asked item.** Every row of *Researched, unwritten* have decision record in same external repo — frontend profile, schema-per-tenant (HikariCP issue + `search_path` CVE cited by number), guardrails map (tool-per-concern with licence column + own four gap classes), UUIDv7 keys. **Promote nothing** — decision record state grounds, it not research notes, and records found here cite no primary source for anything. What change = cost estimate: harvest start from written decision with named losers, no from topic summary. **Claim that something missing = cross-file claim nothing check**, and it decay when someone find it. First time this shape hit repo; publish-obliges-sweep rule now cover recoveries too.

### Still open

- **Primary sources owed, in `BACKLOG.md` — recovery no supply them.** Record cite none. Until they land nothing may promote above convention.
- **No re-open trigger per loser.** *Record the losers* require one, pass set none. **Not invented** — inventing trigger nobody set = authoring pass verdict, not recording it. So skill still half-fail own directive about itself, and say so.
- **No competing census, narrowed.** Candidate list compare *coverage and mutation* host across three candidates — one category of eight. Other seven uncompared on every alternative, so census still show Java surface deep and **not** that it deeper.
- **Criterion never selected against real alternative.** Marked *uncertain* for that reason, no caveated. Recovery no change this: list = decision criterion written to describe, not decision criterion made.
- **Defect this skill create for future sweeps**: it name six sibling skills + four tool-owning skills in prose. Every one = cross-skill claim nothing check.


## The composite-shape check, 2026-08-02

**The only check that was owed on this skill** — the predicate check is n/a (its directives bind a decision, not a technology) and the layer check is n/a (nothing it governs crosses a layer). **No marker promoted, no ban added.**

### The check bit on a condition already true in the worked case

This skill decides *a* stack. **The competing census it carries is a frontend profile from the same pass** — so the organisation behind the worked case had already made a second stack choice before this record was written, and **no directive says that the host census, the corpus-gravity price and the rule sets are per stack and reach no other one.** A repo that assumes otherwise has a defect class covered on one side of a language boundary and nowhere on the other.

The same shape one level down: **a second language inside one repository.** Build scripts, code generators and test fixtures routinely run on something other than the service's language, and every host counted for the winner reaches none of it. The condition is that the census state which parts of the repository it covers, so the uncounted parts are a visible blank.

### The entry most likely to be missed

**A rejected candidate that arrives as a dependency anyway.** The losing runtime running the frontend build; the CI actions; the scanners; the code generators. It lost the ranking and is **operationally load-bearing**, and it arrived with none of this skill's machinery — no operability veto applied to it, no gravity priced, no losers recorded about it. `ai-maintainer-principles`' *Price the bus factor by failure shape, with an exit ladder* governs it from the moment it arrives that way, and **this skill never handed it over.** Added as a fifth entry to *What is recorded and what still is not*, because it is a gap in the worked case and not only in the criterion.

### Two entries about the census itself

- **An advisory gate counted as a filled census row — banned, and the recovered competing census actually contains one.** *Count the independent enforcement hosts* already says hosts worth counting are ones that fail a build; the TypeScript column has a category where the tool exists and the gate is advisory with an unresolved upstream issue. **A census is a count**, which is this repo's most-recorded failure class, so the row is stated rather than left to the reader.
- **Two candidates tied on host count.** The recovered census has two columns filling seven of eight categories, so **host count did not discriminate and structurally was not going to.** What separated them was one absent category and one advisory gate, then corpus gravity, unwritability and the operability veto. A record that stops at the census has not finished the comparison — which is worth saying because the census is the most quotable artefact in this skill.

### Still open on this family

- **The enumeration and token-placement checks have not been run here.** The enumeration check has obvious candidates: this skill carries a census, a candidate list and a host list, and the census is explicitly a re-runnable grep with a date.
- **The new shape table shares the skill's own honest limit** — every entry is a written-artifact obligation, and this skill has no gates to wire.
