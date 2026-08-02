# The money skill family

*Extracted from `CLAUDE.md` 2026-08-02, unedited except that cross-section pointers became file links. Where older text says "this file", it means the project record, which was one file then.*


Decided 2026-07-30 in one interview pass. This = authoring spec, supersede single `money-values` row table used to carry. **Both phases written (2026-07-30) — see *Phase 1, as shipped* + *Phase 2, as shipped* at end for what authoring settled and what left standing.**

### The set

```
skills/money/          SKILL.md  evidence.md             M-1…M-9, M-20…M-29     19
skills/money-api/      SKILL.md  evidence.md             M-12…M-19               8
skills/money-storage/  SKILL.md  evidence.md             M-10, M-11, M-30…M-43  16
skills/money-java/     SKILL.md  api.md  storage.md      no directives of its own
```

43 directives, each in exactly one place. Java repo install all four; `money-java/SKILL.md` say so on first line, cuz every check in it keyed to id living in one of other three.

### The ten decisions

1. **Write-once.** Neutral skill carry directive, rejected default, *kind* of check. Stack skill name tool, add only what stack-shaped. No directive text exist twice → no diff to run, nothing to drift. **This one place skills depart from corpus**, where duplication between stack packs deliberate — and that only hold cuz seed file *pasted* into repo holding no copy of corpus, so paste must be whole. Installed skill not pasted.
2. **Shipped skills cite `M-n`.** See narrowed invariant under [Authoring invariants](../../CLAUDE.md).
3. **Stack skill = whole stack, not language.** `money-java` = Java + Spring Boot MVC + jOOQ + PostgreSQL, match the Java-backend pack. **No `money-sql`**: storage checks weld engine fact to ecosystem tool, no separate. `NaN` `CHECK` = PostgreSQL fact asserted by schema lint over committed **Flyway** migrations; over-scale rejection = PostgreSQL behaviour asserted by integration test against real engine in **throwaway container**; query-arithmetic ban half PostgreSQL, half **jOOQ** trap. `squawk` = one clean separation, one case no carry axis.
4. **Three neutral skills**, cut on extra conditions the money-grade source when-this-applies section itself state. Observability **not** cut out: its condition — nobody watch running system between incidents — = corpus own premise, so always on, stay in core.
5. **One stack skill per stack**, bulky parts in reference files inside own dir. Add `money-go` = add one dir, edit nothing. Rejected: fold stacks into neutral skills as `java.md`, `go.md`, `python.md` — would make every new stack edit all three neutral skills and ship every consumer every other stack checks.
6. **Instruct agent, plus one-time gate setup.** These directives = two kinds welded: instinct-overrides that fire at authoring time, and build gates that must exist in repo. Instruct agent do nothing for second kind: gate = what catch *next* agent. So each stack skill carry `## Wiring the gates` section, run once, which also record what wired and what skipped with reason. Neutral skills have no such section — only place no tool can be named.
7. **Marker + date inline on every directive**; evidence one hop away in skill own `evidence.md` (source quotes, do-not-cite list, re-open triggers). Lapse rule = reason: past `review-by` **2027-01-21** every *confirmed* marker read as *convention* with no maintainer action, which only work if reader see date beside claim.
8. **Every ban carry four things inline** — ground, org fact it rest on, that no panel argued other side, condition that reopen it. Bind two bans in `money-storage` composite-shape table.
9. **Names**: `money`, `money-api`, `money-storage`, `money-java`. `money-values` retired. `monetary-value` rejected — name not trigger, description is, and content not only values (columns, payload fields, alert rules, migrations, CI gates). `money-persistence` rejected cuz in Java shop it read as persistence layer, exact scoping the money-grade source when-this-applies section call fatal: rules must reach hand-written query, view definition, migration, support script, **none of which import client library**.
10. **Phase 1 = `money` + `money-api` + `money-java` (`SKILL.md` + `api.md`).** Phase 2 = `money-storage` + `money-java/storage.md`. Order forced by citation graph below: no phase ship id pointing at unwritten skill.

### The split, and where each part's evidence lives

| Directives | Skill | Directive text | Evidence trail |
| ---------- | ----- | -------------- | -------------- |
| M-1 … M-9 | `money` | the money-grade source directives, *Money* + *Rounding* | the Java-backend pack evidence notes under `Money-grade rules`, same subsection names |
| M-20 … M-22 | `money` | the directives, *Observability* | the Java-backend pack evidence notes, **general** `Observability` heading — not under `Money-grade rules` |
| M-23 … M-29 | `money` | the directives, *Evidence gates* | the Java-backend pack evidence notes under `Money-grade rules` |
| M-12 … M-14 | `money-api` | the directives, *Wire* | the Java-backend pack evidence notes under `Money-grade rules` → `Wire` |
| M-15 … M-19 | `money-api` | the directives, *API contract* | the Java-backend pack evidence notes, **general** `API contract` heading |
| M-10, M-11 | `money-storage` | the directives, *Storage* | the Java-backend pack evidence notes under `Money-grade rules` → `Storage` |
| M-30 … M-43, composite shapes | `money-storage` | the directives, *Persistence* + *Composite shapes a repo assembles out of stored money* | the money-grade source evidence notes, *The Persistence pass — 2026-07-29* — only money trail living in source itself |

Java checks came from the Java-backend paste text, its `####` headings as anchors. Line numbers that used to sit in this table deleted with source 2026-08-01.

| Paste subsection | Lands in |
| ---------------- | -------- |
| preamble, `Money`, `Rounding` | `money-java/SKILL.md` |
| `Observability (money-grade)`, `Evidence gates for money` | `money-java/SKILL.md` |
| `Wire`, `API contract (money-grade)` | `money-java/api.md` |
| `Storage`, `Persistence` | `money-java/storage.md` |

### What every money `SKILL.md` carries

- **Premise, stated.** *Code written by LLM agents, no human read it line by line; feature carry amount of money system compute with.* Without it these read as generic engineering advice and get argued with — verdict portable exactly as far as its premise.
- **Rejected default, by name** (*Distrust what the agent picks and what it reads*, in `enforceable-rules`). "Use a money type" no override agent instinct. "Default = raw decimal or float, rejected cuz no check can tell which one hold amount" do. Binary floating-point = corpus default by wide margin, banned at three separate layers cuz it re-enter at each one.
- **Named blind spots, still named.** M-35 lint cannot reach query text assembled at runtime from fragments. That sentence ship, cuz green lint otherwise read as coverage.
- **Check kind with its enforcement marker**, never bare directive (*Machine-enforced or it is not a rule*, in `enforceable-rules`).

**M-29 change meaning, change deliberate.** In corpus it arm tripwire: rules sit in repo constitution before any money field exist, plan introducing first money feature cite them. Skill not pasted, so always-loaded **description** = tripwire instead — arguably stronger, fire without anyone remember re-read constitution. M-29 therefore ship as obligation to record decision in plan, not as arming mechanism. Write descriptions accordingly: must match moment agent about to add field, column, payload, or computation holding amount.

### The citation graph — what fixes the phase order

`M-n` citations load-bearing under decisions 1 + 2, so phase shipping citation to unwritten skill ship dangling pointer.

- **Inside `money-api`:** M-15 extend M-12; M-16 sharpen M-13.
- **Inside `money`:** M-21 make M-5 observable; M-22 cover M-28 invariants.
- **Inside `money-storage`:** M-31 sharpen M-10; M-36 = one exception to M-35; M-42 ground = M-30 rounding evidence; M-43 complete M-10.
- **`money-api` → `money`:** M-19 extend M-26.
- **`money` → `money-api`:** M-26 name M-19 as money cases it must cover. **One back-edge, why two ship together.**
- **`money-storage` → `money-api`:** M-37 = M-16 in read direction; M-39 = M-18 at store, same version column; M-40 need idempotency record M-17 require.
- **`money-storage` → `money`:** M-30 reintroduce what M-7 ban and M-1 reject; M-32 cite class M-5 exist for; M-35 = M-2 over query text; M-40 need M-20 event; M-41 need M-25 worked example.
- **Out of family:** two rows of composite-shape table hand off to `caching` + `async-handoff` skills — cached amount = copy no column constraint reach, and M-40 name outbox seam. Those citations resolve only if those skills exist; until then rows say verdict owned elsewhere and name seam, which is what source do. **Caching row resolved 2026-07-30** when `caching` authored ([the caching history](caching.md)); now name published skill and tell reader install it. **Outbox row resolved later same day** when `async-handoff` authored: now name `E-21` for payload and `E-5` for outbox row, and `M-40` recorded residue — "this rule depend on second rule set agreeing" — discharged, cuz `E-5` require exactly what `M-40` assume. **Both out-of-family rows now resolve to installed skills.**

So dependency run **storage → api → core**, one back-edge core → api.

### Distribution

`metadata.internal` stay **unset**. Absence from skills.sh directory already keep these unlisted; set `internal` would hide them from `npx skills --list`, which `npm run check` depend on. (Written when it was the only self-check here; two gates wired 2026-08-02 — [wired-gates](wired-gates.md) — and neither use `--list`, so the reason hold unchanged.)

### Carried forward, undecided

- **What repo on uninstantiated stack receive.** Deferred 2026-07-30. Go or Python repo would install neutral skills and get 43 directives whose checks named only by kind, which *Machine-enforced or it is not a rule* call wish. Today every consumer install `money-java`, so tool always named. Options considered: state kind + oblige repo name and record own tool (that record then raw material `money-go` authored from); state kind and stop; or neutral skills declare themselves unenforced. **Revisit when second stack real.**
- **Whether `money-storage` two bans survive panel.** Ship marked decided without one — the money-grade source evidence notes explicit that case for each banned shape written by whoever rejected it, which = failure protocol panel rule exist to prevent. Run panel = that source first re-open trigger; until it run nothing in M-30 … M-43 may promote to *confirmed*.
- **The money-grade source instantiation table gained no row, and now never will.** That table tracked stack packs; skill not one. Sentence saying so was owed in source itself and never written. **Closed 2026-08-01 by deleting corpus** — no table, no absence to explain.

### Phase 1, as shipped

Authored 2026-07-30. Six files, all three skills listed by `npm run check`:

```
skills/money/          SKILL.md  evidence.md    M-1…M-9, M-20…M-29
skills/money-api/      SKILL.md  evidence.md    M-12…M-19
skills/money-java/     SKILL.md  api.md         the Java checks, keyed to those ids
```

`money-java/SKILL.md` open by saying install it with `money` + `money-api` — **three, not spec four**, until phase 2 exist.

**Rewritten wholesale, not carried verbatim.** No skill file hold byte-identical copy of any corpus text, so diff gate in [the decomposition record](decomposition.md) no apply to phase 1, nothing to diff. Reason: half-copy never available — the money-grade source directives directive text carry corpus vocabulary meaning nothing to consumer ("a stack pack states it once"), and each skill add premise, rejected default, instructions to agent around every directive.

**Markers, as actually landed.** The money-grade source directives give each directive check *kind* plus *confidence* marker; enforcement marker (off-the-shelf / bespoke / convention) exist only where tool named. So neutral skills carry **kind + confidence marker + date**, `money-java` carry **tool + enforcement marker**. Read bullet "the check kind with its enforcement marker" in *What every money `SKILL.md` carries* that way — enforcement marker cannot be in file naming no tool.

**Every directive got date; where source gave none, pass date used** — 2026-07-21 founding pass, 2026-07-25 two scoped additions passes (M-3, M-5, M-15 … M-19, M-26), 2026-07-27 observability (M-20 … M-22). Dates inherited not invented; decision 7 lapse rule need date beside every claim, undated *convention* marker would disable it.

**Java evidence inline, cuz spec give `money-java` no `evidence.md`.** Both `SKILL.md` + `api.md` end with dated claim table, do-not-cite list, review-by date. Money-library evaluation (Joda-Money, Moneta, thin-wrapper runner-up) sit in `money-java/SKILL.md` under *The Java library decision*, per the money-grade source evidence notes rule that stack-specific evidence stay with stack.

**One phase-order leak citation graph missed — closed by phase 2.** M-2 check cite M-10 schema lint for float-column half of ban, M-10 was phase 2, so phase 1 shipped that half as named blind spot with **no id**. Phase 2 replaced it with citation and rewrote four places saying store side missing: `money/SKILL.md` (*What is here and what is not*, M-2 clause), `money-api/SKILL.md` (*What is here and what is elsewhere*), `money-java/SKILL.md` (*Named gap* paragraph, M-2 entry). Recorded cuz citation graph no predict it: **check own text can cite across phase boundary even when no directive do.**

**One contradiction carried by phase 1, decided by phase 2 — as unreconciled, deliberate.** The Java-backend pack evidence notes, *Storage* say ISO 4217 exponent 4 CLF-only; its *API contract* note (2026-07-25 pass) say exponent 4 not CLF-only and name UYW. **Neither skill depend on which right**: both notes agree *maximum* exponent = 4, all M-10 scale-4 clause need, and M-14 say read counterparty published table not derive exponent. So both `money-api/evidence.md` + `money-storage/evidence.md` record both readings, attributed + dated, each with re-open trigger, neither pick one. Pick one = author research finding, not what conversion do.

**What phase 1 no build, and phase 2 no either.** No check enforce conversion invariants: nothing verify skill hold no link into corpus, cite no `P-n` or `B-n`, keep every relative link inside own dir. Checked by hand 2026-07-30 over all four skills, clean. `npm run check` no see resource files at all, so broken `evidence.md` link pass it.

### Phase 2, as shipped

Authored 2026-07-30, straight after phase 1. Three files:

```
skills/money-storage/  SKILL.md  evidence.md    M-10, M-11, M-30…M-43 + composite shapes
skills/money-java/     storage.md               the PostgreSQL, jOOQ, Flyway and squawk checks
```

All 43 directives now defined exactly once across `money`, `money-api`, `money-storage`; each have Java entry in `money-java`. Every cross-skill citation resolve to installed skill.

**Neutral skill name engines, and that no departure.** Decision 1 put tool in stack skill; `money-storage` hold none — squawk, jOOQ, Flyway, ArchUnit, Testcontainers appear only in `storage.md`. But the money-grade source directives name PostgreSQL, MySQL, SQL Server **inside directives**, cuz engine documented behaviour = rule **ground**, not enforcement. `money-storage` do same: directive stay engine-neutral ("the store rounds, and it does it quietly"), sentence that prove it name vendor. First draft wrote "one engine documents…", corrected — left reader unable to tell whether own engine affected, exact decision rule exist to inform.

**Marker ceiling stated at top of `SKILL.md`, not only in `evidence.md`.** Phase 2 one addition to shape decision 7 fixed. Missing panel = property of whole 2026-07-29 group not any one claim, and fourteen rules marked *primary-source verified* read as settled to anyone never open `evidence.md`. So file open with ceiling, no-panel fact, instruction that **no marker there may promote to confirmed until panel run** — least of all two bans.

**Two bans ship as four-bullet block each**, not prose sentence: ground, org fact it rest on, that no independent panel argued other side, re-open condition. Decision 8 require all four inline, and four things in one sentence = where one get dropped.

**Two out-of-family composite rows say verdict owned elsewhere and name seam** — cached amount = copy no column constraint reach, M-40 name outbox seam. No link, no id, both say plainly those rule sets not published in this skill set. That what source do, and what `caching` + `async-handoff` skills will replace. **Both rows replaced 2026-07-30 — caching one when `caching` authored, outbox one when `async-handoff` was — so whole note now history**; see [the caching history](caching.md), [the async-handoff history](async-handoff.md).

**squawk = one clean stack separation spec predicted (decision 3), shipped with ungated half named.** It flag `numeric` scale change off shelf for lock; say nothing about values already in column, so that half spec-and-review and `storage.md` refuse to describe as gated. `storage.md` wiring record list that, M-35 runtime-SQL blind spot, and M-43 as three things repo must record as *not gated* on first run.

**Was open, blocked on rule conflict; closed by deletion.** *Money-grade instantiation table gains no row* wanted sentence written into source so absence of skills row no read as missed instantiation. Writing it = authoring in corpus, which old rule forbid — corpus edited only to correct import. Neither rule won: **corpus deleted 2026-08-01**, so nothing to write into and nothing left to decide.

### The audit, 2026-07-30

All nine files re-read against the money-grade source, the Java-backend paste text money section, the Java-backend pack evidence notes, straight after phase 2. **Structure held**: 43 directives defined exactly once, every `M-n` citation resolving to installed skill, no `P-n`, no `B-n`, no link out of skill dir, all four skills listed by `npm run check`, every directive carry check kind + marker + date. Six content defects found + fixed; two generalise:

- **Cross-skill claim can decay in prose citing no id.** `money/SKILL.md` still said float ban third layer was "the store rules, absent here" inside *The defaults these rules override*, cuz phase 2 rewrote four places naming gap and id-free prose no one of them. Now `money-storage`, `M-10`. Phase-1 note predicted reverse case — check text citing across boundary — this same leak with no id to grep.
- **Tool evidence name must be named in stack skill, not described.** `money-java` said "a Schemathesis-class generator" throughout while own *Do not cite* list warned off "Rust core" claim only about Schemathesis, and `money-api/evidence.md` promised oracle tool "named in the stack skill". *Machine-enforced or it is not a rule* want tool; hedge = general-gate wording from paste text leaking into money instantiation. Now named, with `[generation] deterministic` / `seed` keys recorded as **4.x-specific**, which raw re-open trigger say and no skill had carried.

Other four:

- **`money/SKILL.md` called observability condition "this rule set's own premise".** The Java-backend pack evidence notes explicit it *different* premise stated as own condition, and the money-grade source when-this-applies section file it as one of three extra conditions. Decision 4 — observability stay in core skill, always on — unaffected, no need that claim: condition now stand on own, staffed-rota carve-out kept, emission rules named as code rules.
- **`money-storage/SKILL.md` twice pointed inside itself for defect happening elsewhere** — "corrected twice elsewhere in this rule set" (library-scoped seam) + "a sibling rule set" (five unsurfaced composite shapes). Both = caching + async-handoff rules. Named, so consumer stop looking for them in money skills. At audit time neither `caching` nor `async-handoff` published and both sentences said so; **both authored later same day, both sentences rewritten in two steps** (*The interlocks* in each family section). Five unsurfaced composite shapes now `async-handoff-shapes` plus two bans in `async-handoff`, **which no weaken lesson `money-storage` draw**: defect was nothing in that rule set made absences visible, and naming gaps rule by rule no help.
- **`money-java` jqwik pin now say cross-cutting, not money rule.** The Java-backend pack evidence notes record caveat *moved to agent-traps pack* for exactly that reason. Pin stay in `money-java` — drop it leave consumer of only money skills with no pin — but it **one known overlap with `llm-default-traps`**, and decision 1 write-once rule must settle between them when that skill authored. **Since 2026-07-30 `caching-java` + `async-handoff-java` both name jqwik too**, without pin, so overlap three-way — see *Still open for this family* under caching + async-handoff families.

**What audit no change.** Naming PostgreSQL, MySQL, SQL Server in `money-storage` (ground not enforcement — phase 2 note stand); `M-2` Java marker reading "off-the-shelf tool, the predicate authored per repo" where seed say plainly "off-the-shelf" (skill more honest of two); `M-23` *convention* marker, which source leave unmarked and the money-grade source evidence notes own default — silence in trail = convention — supply.

**Still unbuilt, same as after phase 2**: no check enforce any of this. Audit = hand pass.


## The predicate check on `M-1` … `M-29`, 2026-08-02

**The last cell in `BACKLOG.md`'s incompleteness table.** The row had called it *the lowest-risk gap here*, on the ground that this rule set's predicate names a domain rather than a technology. **Naming a domain turned out to be the same trap with a different label**, and the check found four misses rather than none. No directive changed; three were closed by widening the trigger and the fourth is recorded as a decision nobody has taken.

1. **An amount that arrives as configuration.** A fee, a limit, a threshold, a price, a default charge — set as a property, an environment variable or a feature-flag value. **Nobody adds a field doing it**, so no trigger fired, and `M-1`'s money type reaches nothing in a properties file. **This is the cheapest way to put an amount into a system and it was outside every trigger in the family.** The mechanism is the one the layer check keeps finding elsewhere, arriving here as a predicate problem: the value never becomes a money type because it never passes through code that constructs one.
2. **A rate, a factor, a percentage.** `M-6` governs them — separate types, higher precision, rounded only when they produce a payable amount — while the trigger named *an amount of money*. **A directive whose whole subject is that these are not amounts, sitting behind a trigger that fired only on amounts.**
3. **An amount arriving in a file rather than a payload.** `money-api`'s trigger named a request or response payload, a schema, an endpoint. A batch import, a bank statement, a settlement report or a spreadsheet upload is none of those and carries amounts in from outside with the same decisions `M-12` and `M-13` make for JSON. **The directives transfer unchanged; the gate does not** — `M-19`'s conformance fuzzer generates against a committed API document, and a file format usually has none, so the check is a parse test over a committed corpus of malformed and truncated files, authored per format. Stated in `money-api` rather than left silent.
4. **A quantity with money's exactness requirements that nobody calls money** — loyalty points, prepaid credits, allowances, units of an instrument. **This is the predicate check's own target exactly.** Left open deliberately: these rules are conditioned on a premise about money — *a wrong cent is a defect with a victim outside the system* — and whether that premise holds for points is a decision, not a consequence. `BACKLOG.md`'s *Shelved* section already holds three adjacent exactness domains for the related reason that enforcement for each is bespoke. **What the widened trigger does is make the decision get taken rather than skipped.**

### What this closed

**Every cell of the incompleteness table now reads *run* or *n/a*.** The table is kept rather than deleted, because each cell records what its check found and deleting a closed row takes the findings with it — the same call the `backend-stack` candidate-list row went through. **What replaced it as owed work is stated there**: `enforceable-rules` publishes five incompleteness checks, and the two drawn from this skill set's own authoring — the enumeration check and the token-placement check — **have not been run over any published skill.**
