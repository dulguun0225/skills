# CLAUDE.md

File give guidance to Claude Code (claude.ai/code) when work code in this repo.

## What this repo is

Skills repo: publish engineering-decision corpus in `raw/` as Agent Skills, install with Vercel `skills` CLI (skills.sh), **not listed in public skills.sh directory**.

State 2026-07-30: no build/lint/test tooling beyond discovery check. Exist: project setup (node + `skills` CLI pinned, LF repo-wide, commands as npm scripts — see *Commands*), decided skill decomposition + layout (*Where skills live*), and **every row of table in *Where skills live* authored — Milestone 1 done. Every cross-stack source in `raw/rule-sources/` converted, both *packs* converted, both corpus-derived method skills written**:

- **Money family, authored 2026-07-30 in two phases** — `skills/money/`, `skills/money-api/`, `skills/money-storage/`, `skills/money-java/` (`SKILL.md` + `api.md` + `storage.md`), all 43 directives `M-1` … `M-43` defined exactly once. What authoring decided beyond spec: *Phase 1, as shipped* + *Phase 2, as shipped*.
- **Caching family, authored 2026-07-30 after** — `skills/caching/` (`SKILL.md` + `evidence.md`), `skills/caching-java/` (`SKILL.md`), all 16 directives `C-1` … `C-16` defined exactly once. See *The caching skill family*.
- **Async-handoff family, authored 2026-07-30 after that** — `skills/async-handoff/` (`SKILL.md` + `evidence.md`), `skills/async-handoff-shapes/` (`SKILL.md` + `evidence.md`), `skills/async-handoff-java/` (`SKILL.md` + `shapes.md`), all 36 directives `E-1` … `E-36` defined exactly once. See *The asynchronous-handoff skill family*.
- **`llm-default-traps`, authored 2026-07-30 fourth** — `skills/llm-default-traps/` (`SKILL.md` + `evidence.md`), nine directives, **no rule ids**. First pack-derived skill, first single-skill conversion, now **owner of record for jqwik version pin** three stack skills name. See *The `llm-default-traps` skill*.
- **Java-backend family, authored 2026-07-30 after that** — `skills/java-backend-rules/`, `skills/java-backend-api/`, `skills/java-backend-observability/` (each `SKILL.md` + `evidence.md`), 67 directives, **no rule ids**. Second pack-derived conversion, **first stack-only family — no neutral sibling, cuz pack *is* stack.** See *The Java-backend skill family*.
- **Two method skills, authored 2026-07-30 last** — `skills/tech-decision-research/`, `skills/enforceable-rules/` (each `SKILL.md` + `evidence.md`), 15 and 13 directives, **no rule ids**. Two corpus-derived conversions, **first whose subject process not code**, first drawn from material with no frontmatter, no marker, no date. See *The method skills*.

All fifteen discovered by `npm run check`. **Milestone 1 — turn content of `raw/` into skills — done**: three cross-stack sources, both packs, both corpus-derived rows converted; no row of table in *Where skills live* unwritten. **What `raw/` still hold no skill carry listed in *What becomes no skill*** under that table — bookkeeping + consuming-repo machinery by construction, not by omission. Expect more material in `raw/` later; new source or pack restart conversion work under same invariants.

**`raw/` raw data — input material, never output.** Hold source text imported elsewhere, read + convert. Nothing in it published skill; no consumer install from it. Edit only to fix import, never to author. Conversion write new files elsewhere, leave raw text as record of what imported. Expect more material dropped there later.

Today `raw/` lifted subtree — was `packs/` dir of bigger spec-driven-development bundle (nc-ears preset over spec-kit). Internal relative links resolve here; anything point outside no resolve (see *Dangling references*).

**Convert source no retire its raw text; money family worked case.** Delete money material from `raw/` considered 2026-07-30 after money skills audited, rejected — not only on never-author-in-`raw/` rule, but cuz none of it unreferenced:

- `raw/rule-sources/money-grade.md` cited **eight times from other two sources**. `cache-discipline.md` + `event-broker-discipline.md` each name money-grade §2 **fourteen check kinds as copy of record** — §2 say so itself, say fifteenth entry would need add in three files or drift in two — and cite `M-17`, `M-5` re-open trigger, float ban besides. Delete file → dangle those, or force kind list copied into sibling = duplication §2 exist to stop.

  **Premise of that bullet decayed same day; conclusion no change.** It said "two sources nobody converted yet"; both converted 2026-07-30, so no source in `raw/rule-sources/` unconverted now. Citations unchanged, `raw/` still record of import, authoring in it still forbidden — so nothing may delete. **Recorded cuz third instance of same failure repo keep finding: sentence that count or enumerate decay silently, no id to grep.**
- Java money text no lift out clean. `java-backend-rules` row in *Where skills live* defined as `raw/seed/java-backend.md` **excluding lines 442–744**, so cut those lines move anchor; and §4 general `API contract` + `Observability` evidence shared — `M-15` … `M-19` and `M-20` … `M-22` rest on it beside non-money rules.

General rule settled: **`raw/` shrink only when file have no inbound citation from unconverted material — not case for anything money today.**

## Commands

Fresh machine setup = [README.md](README.md), *Setup on a new machine* — `mise trust`, `mise install`, `npm ci`, that order. No build/lint/test command. Two that exist wrap distribution CLI, pinned in `package-lock.json`:

```bash
npm run check                 # list the skills the CLI discovers here — the discovery check
npm run try -- <name>         # run one skill from the working tree without installing it
```

`npm run check` only self-check exist: answer whether skill in discoverable location with valid frontmatter. Anything it no list = invisible to every consumer. Since 2026-07-30 it list every dir under `skills/` — `async-handoff`, `async-handoff-java`, `async-handoff-shapes`, `caching`, `caching-java`, `enforceable-rules`, `java-backend-api`, `java-backend-observability`, `java-backend-rules`, `llm-default-traps`, `money`, `money-api`, `money-storage`, `money-java`, `tech-decision-research`. **Compare against `ls skills/`, not against count in this file** — count here = failure repo now recorded ten times. Say nothing about resource files: `evidence.md`, `api.md`, `storage.md`, `shapes.md` unlisted + unchecked, so broken relative link inside skill pass it.

**It caught real defect 2026-07-30, and only thing that would.** `llm-default-traps` written with `: ` — colon then space — inside unquoted `description`; YAML parse as nested mapping not string, so file **not skill at all** and check listed nine. Nothing about file look wrong when read. **Run `npm run check` after write or edit any frontmatter; treat missing name as frontmatter syntax error before look anywhere else** — descriptions here long prose, colon easy to write.
**`npm ci` must run first** — `npm run check` shell out to pinned CLI in `node_modules`; on machine where it no run, script fail with `'skills' is not recognized` not report zero skills.

Two more CLI commands not wrapped, each one-off: `npx skills init <name>` scaffold `<name>/SKILL.md` at repo root, so anything it make get moved under `skills/`; `npx skills add <owner>/<repo> -a claude-code -y` = how consumer install from here.

Two checks corpus text refer to **not in this repo**: `ci/check_packs.py` (fail build on mis-grouped evidence subheadings and on rule ids or links in seed text) and `bundle-checks.yml` freshness step (warn when `review-by` passed). Want those gates here → must write them.

## Distribution constraints (skills.sh)

Verified against `vercel-labs/skills` README 2026-07-30.

- **Discovery layout.** Skill containers walked one level deep for flat layout `skills/<name>/SKILL.md`, one extra level for catalog layout `skills/<category>/<name>/SKILL.md`. `SKILL.md` at shallower level shadow anything nested below. `skills/`, `skills/.curated/`, `skills/.experimental/`, `skills/.system/`, `.claude/skills/` all scanned; root `SKILL.md` make repo one skill. Recursive search only when nothing found in standard location — no rely on it.
- **Frontmatter.** `name` (lowercase, hyphens) + `description` required; file missing either not skill. `allowed-tools` broadly supported; `context: fork` Claude Code only → cannot be load-bearing for skill meant to work anywhere.
- **Unlisted, two separate mechanisms.** Absence from skills.sh directory keep skill unlisted while `npx skills add <owner>/<repo>` (or full git URL, or direct tree path) still install it. `metadata.internal: true` go further: CLI hide skill from own discovery, including `--list`, unless `INSTALL_INTERNAL_SKILLS=1` set. Choose deliberate — second one hide skill from us too.
- Spec: [agentskills.io](https://agentskills.io).

## Where skills live

Decided 2026-07-30. **One skill per topic, flat: `skills/<name>/SKILL.md`.** Resource files sit inside skill own dir. Catalog level (`skills/<category>/<name>/`) available if set outgrow flat list; unused, and move to it later change installed paths.

**Topic = what agent doing when it need rules.** Not how `raw/` file its material; decomposition no inherit that filing or vocabulary — `raw/` mined for content only. Consequence: language-neutral rule sets = skills in own right, not resource files inside Java skill, cuz money rules must reach non-Java repo, and caching rules should load only when something about to be cached.

| Skill | Content drawn from |
| ----- | ------------------ |
| `java-backend-rules`, `java-backend-api`, `java-backend-observability` | `raw/seed/java-backend.md` **lines 1–441 only** — 442 on = money, cache, broker sections, already converted; evidence + dates from `raw/java-backend.md` §4 under same eight `###` headings, plus §3 rejections and §5 triggers. Split in *The Java-backend skill family* |
| `llm-default-traps` | `raw/seed/agent-traps.md`; evidence from `raw/agent-traps.md` §3 |
| `money`, `money-api`, `money-storage`, `money-java` | `raw/rule-sources/money-grade.md` + `raw/seed/java-backend.md` lines 442–744 — per-skill split + evidence map in *The money skill family* |
| `caching`, `caching-java` | `raw/rule-sources/cache-discipline.md` + `raw/seed/java-backend.md` lines 745–935; Java evidence from `raw/java-backend.md` §4 under `Cache discipline`. Split in *The caching skill family* |
| `async-handoff`, `async-handoff-shapes`, `async-handoff-java` | `raw/rule-sources/event-broker-discipline.md` + `raw/seed/java-backend.md` lines 937–1757; Java evidence from `raw/java-backend.md` §4 under `Event broker discipline`. Split in *The asynchronous-handoff skill family* |
| `tech-decision-research` | `raw/research-protocol.md` §1–4, §6. Its §3 confidence markers land here; `raw/README.md` duplicate definition of same four not carried twice. Split in *The method skills* |
| `enforceable-rules` | `raw/README.md` design principles + premise-specificity test; portable checks in `raw/research-protocol.md` §5; plus `raw/README.md` *Markers* — **enforcement** markers + **status tier** only — and its Anatomy tripwire, which table no assign. Split in *The method skills* |

**What becomes no skill**, recorded so absence no read as oversight:

- Corpus bookkeeping — `raw/index.md` roster, audits-owed backlog, harvest map, candidate list, sunset clock; `raw/README.md` governance. These maintain corpus; not capability anyone install.
- Six-step adoption procedure in `raw/README.md` + everything around `.specify/memory/constitution.md`. Machinery not in this repo, its files dangling refs here. **Narrowed 2026-07-30**: two steps generalise and `enforceable-rules` carry them — re-verify dated facts at adoption not on calendar, and wire checks in same change, unwired check marked deferred and **never described as enforced**. Stay out: every step naming file in that scaffold.
- Pack-versus-source distinction itself + roster of which is which. Load-bearing inside `raw/` — why some rules live under stable ids and never pasted — but fact about how *that* corpus filed. `enforceable-rules` carry only what generalise: prefer one owner, and where duplication deliberate, one index only thing that catch drift.

**`raw/` stay exactly where it is**, unchanged, as record of import. Skills = new files under `skills/`.

**Skill dir = whole world its consumer have.** Every link in skill resolve inside that dir or absolute URL. Where skill carry text verbatim from `raw/`, copy byte-identical and diff = gate; where rewritten, rewritten wholesale — no half-copies, which diff cannot check and reader cannot trust.

**Two questions open per skill, not once for set.** Decided as each skill authored, answer recorded with that skill — directive set of nine dependency picks and one of 149 platform rules have no reason to answer same way:

- Whether directive ship with *kind* of check it need and tool left to adopting repo, or appear only where tool can be named. Decide how much of money skills, `caching`, `async-handoff` exist outside `java-backend-rules`.
- Whether skill instruct agent directly, or its job = write rules file consumer repo commit.

**Both answered for money family and caching family** (2026-07-30 — *The money skill family*, *The caching skill family*), and **both families answered same way**. Q1: directive ship with check *kind* in language-neutral skill, tool named in per-stack skill → each directive text exist exactly once. Q2: skill instruct agent, stack skill additionally carry one-time section that wire build gates in.

**All three cross-stack families answered identical, third confirmed it not merely inherit** (2026-07-30 — *The asynchronous-handoff skill family*). Settled by shape all three share: portable directive set whose enforcement per stack. **Rule now closed for cross-stack sources, cuz no fourth one.** Skill drawn from *pack* have no such split and not covered. **Both packs confirmed that on authoring; rule now closed for them too, cuz no third pack:**

- **`llm-default-traps`** (2026-07-30) shipped as **one** skill naming both check kind and tool in one file. *The `llm-default-traps` skill* record two grounds beyond this one.
- **Java-backend family** (2026-07-30) shipped as **three** skills — not counter-example: **split by what agent doing, not neutral-versus-stack.** All three name tools, cuz pack *is* stack, no sibling to defer tool to. *The Java-backend skill family* record consequence that bit — stack skill with no neutral sibling still hedge tool names out of habit, twelve did.

**Two corpus-derived skills answered Q1 third way; this close both questions for every row of table** (2026-07-30 — *The method skills*). Neither neutral-versus-stack, neither pack. **Subject = process not code, so most directives have no build gate at all and cannot get one** — check = written artifact whose absence visible. Both say so at top not hedge tool name; `tech-decision-research` have no `## Wiring the gates` section, cuz nothing to wire. **Not first skill in set without one — that claim written here and copied into skill, both false**: six neutral skills (`money`, `money-api`, `money-storage`, `caching`, `async-handoff`, `async-handoff-shapes`) carry no such section either, cuz their gates real and stack sibling wire them. New here: no sibling + no gate to defer, which skill now say. `enforceable-rules` have one, hold two checks that genuinely can mechanise. Q2 both answer as everything else: instruct agent. **Nothing in `raw/` left to raise either question again.**

### Where `llm-default-traps` stands

**Authored 2026-07-30, fourth of five — this subsection superseded by *The `llm-default-traps` skill*** = record. It used to hold plan: skill instruct agent directly, no directive check-kind-only, three open questions with recommendation each. **All three recommendations accepted on authoring, none overturned** — five JVM-only directives stayed in this skill as group conditioned on JVM repos, each directive carry marker + date inline with evidence one hop away, name `llm-default-traps` kept. Reasons in new section; no re-derive from here.

## The money skill family

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

1. **Write-once.** Neutral skill carry directive, rejected default, *kind* of check. Stack skill name tool, add only what stack-shaped. No directive text exist twice → no diff to run, nothing to drift. **This one place skills depart from `raw/`**, where duplication between stack packs deliberate — and that only hold cuz seed file *pasted* into repo holding no copy of corpus, so paste must be whole. Installed skill not pasted.
2. **Shipped skills cite `M-n`.** See narrowed invariant under *Invariants when converting `raw/` into skills*.
3. **Stack skill = whole stack, not language.** `money-java` = Java + Spring Boot MVC + jOOQ + PostgreSQL, match `raw/java-backend.md`. **No `money-sql`**: storage checks weld engine fact to ecosystem tool, no separate. `NaN` `CHECK` = PostgreSQL fact asserted by schema lint over committed **Flyway** migrations; over-scale rejection = PostgreSQL behaviour asserted by integration test against real engine in **throwaway container**; query-arithmetic ban half PostgreSQL, half **jOOQ** trap. `squawk` = one clean separation, one case no carry axis.
4. **Three neutral skills**, cut on extra conditions `money-grade.md` §1 itself state. Observability **not** cut out: its condition — nobody watch running system between incidents — = corpus own premise, so always on, stay in core.
5. **One stack skill per stack**, bulky parts in reference files inside own dir. Add `money-go` = add one dir, edit nothing. Rejected: fold stacks into neutral skills as `java.md`, `go.md`, `python.md` — would make every new stack edit all three neutral skills and ship every consumer every other stack checks.
6. **Instruct agent, plus one-time gate setup.** These directives = two kinds welded: instinct-overrides that fire at authoring time, and build gates that must exist in repo. Instruct agent do nothing for second kind: gate = what catch *next* agent. So each stack skill carry `## Wiring the gates` section, run once, which also record what wired and what skipped with reason. Neutral skills have no such section — only place no tool can be named.
7. **Marker + date inline on every directive**; evidence one hop away in skill own `evidence.md` (source quotes, do-not-cite list, re-open triggers). Lapse rule = reason: past `review-by` **2027-01-21** every *confirmed* marker read as *convention* with no maintainer action, which only work if reader see date beside claim.
8. **Every ban carry four things inline** — ground, org fact it rest on, that no panel argued other side, condition that reopen it. Bind two bans in `money-storage` composite-shape table.
9. **Names**: `money`, `money-api`, `money-storage`, `money-java`. `money-values` retired. `monetary-value` rejected — name not trigger, description is, and content not only values (columns, payload fields, alert rules, migrations, CI gates). `money-persistence` rejected cuz in Java shop it read as persistence layer, exact scoping `money-grade.md` §1 call fatal: rules must reach hand-written query, view definition, migration, support script, **none of which import client library**.
10. **Phase 1 = `money` + `money-api` + `money-java` (`SKILL.md` + `api.md`).** Phase 2 = `money-storage` + `money-java/storage.md`. Order forced by citation graph below: no phase ship id pointing at unwritten skill.

### The split, and where each part's evidence lives

| Directives | Skill | Directive text | Evidence trail |
| ---------- | ----- | -------------- | -------------- |
| M-1 … M-9 | `money` | `money-grade.md` §2, *Money* + *Rounding* | `java-backend.md` §4 under `Money-grade rules`, same subsection names |
| M-20 … M-22 | `money` | §2, *Observability* | `java-backend.md` §4, **general** `Observability` heading — not under `Money-grade rules` |
| M-23 … M-29 | `money` | §2, *Evidence gates* | `java-backend.md` §4 under `Money-grade rules` |
| M-12 … M-14 | `money-api` | §2, *Wire* | `java-backend.md` §4 under `Money-grade rules` → `Wire` |
| M-15 … M-19 | `money-api` | §2, *API contract* | `java-backend.md` §4, **general** `API contract` heading |
| M-10, M-11 | `money-storage` | §2, *Storage* | `java-backend.md` §4 under `Money-grade rules` → `Storage` |
| M-30 … M-43, composite shapes | `money-storage` | §2, *Persistence* + *Composite shapes a repo assembles out of stored money* | `money-grade.md` §4, *The Persistence pass — 2026-07-29* — only money trail living in source itself |

Java checks come from `raw/seed/java-backend.md`. Line numbers against file as imported; `####` headings = durable anchors.

| Seed subsection | Lines | Lands in |
| --------------- | ----- | -------- |
| preamble, `Money`, `Rounding` | 442–496 | `money-java/SKILL.md` |
| `Observability (money-grade)`, `Evidence gates for money` | 698–744 | `money-java/SKILL.md` |
| `Wire`, `API contract (money-grade)` | 646–697 | `money-java/api.md` |
| `Storage`, `Persistence` | 497–645 | `money-java/storage.md` |

### What every money `SKILL.md` carries

- **Premise, stated.** *Code written by LLM agents, no human read it line by line; feature carry amount of money system compute with.* Without it these read as generic engineering advice and get argued with — verdict portable exactly as far as its premise.
- **Rejected default, by name** (`P-6`). "Use a money type" no override agent instinct. "Default = raw decimal or float, rejected cuz no check can tell which one hold amount" do. Binary floating-point = corpus default by wide margin, banned at three separate layers cuz it re-enter at each one.
- **Named blind spots, still named.** M-35 lint cannot reach query text assembled at runtime from fragments. That sentence ship, cuz green lint otherwise read as coverage.
- **Check kind with its enforcement marker**, never bare directive (`P-1`).

**M-29 change meaning, change deliberate.** In `raw/` it arm tripwire: rules sit in repo constitution before any money field exist, plan introducing first money feature cite them. Skill not pasted, so always-loaded **description** = tripwire instead — arguably stronger, fire without anyone remember re-read constitution. M-29 therefore ship as obligation to record decision in plan, not as arming mechanism. Write descriptions accordingly: must match moment agent about to add field, column, payload, or computation holding amount.

### The citation graph — what fixes the phase order

`M-n` citations load-bearing under decisions 1 + 2, so phase shipping citation to unwritten skill ship dangling pointer.

- **Inside `money-api`:** M-15 extend M-12; M-16 sharpen M-13.
- **Inside `money`:** M-21 make M-5 observable; M-22 cover M-28 invariants.
- **Inside `money-storage`:** M-31 sharpen M-10; M-36 = one exception to M-35; M-42 ground = M-30 rounding evidence; M-43 complete M-10.
- **`money-api` → `money`:** M-19 extend M-26.
- **`money` → `money-api`:** M-26 name M-19 as money cases it must cover. **One back-edge, why two ship together.**
- **`money-storage` → `money-api`:** M-37 = M-16 in read direction; M-39 = M-18 at store, same version column; M-40 need idempotency record M-17 require.
- **`money-storage` → `money`:** M-30 reintroduce what M-7 ban and M-1 reject; M-32 cite class M-5 exist for; M-35 = M-2 over query text; M-40 need M-20 event; M-41 need M-25 worked example.
- **Out of family:** two rows of composite-shape table hand off to `caching` + `async-handoff` skills — cached amount = copy no column constraint reach, and M-40 name outbox seam. Those citations resolve only if those skills exist; until then rows say verdict owned elsewhere and name seam, which is what source do. **Caching row resolved 2026-07-30** when `caching` authored (*The caching skill family*); now name published skill and tell reader install it. **Outbox row resolved later same day** when `async-handoff` authored: now name `E-21` for payload and `E-5` for outbox row, and `M-40` recorded residue — "this rule depend on second rule set agreeing" — discharged, cuz `E-5` require exactly what `M-40` assume. **Both out-of-family rows now resolve to installed skills.**

So dependency run **storage → api → core**, one back-edge core → api.

### Distribution

`metadata.internal` stay **unset**. Absence from skills.sh directory already keep these unlisted; set `internal` would hide them from `npx skills --list`, which `npm run check` — only self-check in repo — depend on.

### Carried forward, undecided

- **What repo on uninstantiated stack receive.** Deferred 2026-07-30. Go or Python repo would install neutral skills and get 43 directives whose checks named only by kind, which `P-1` call wish. Today every consumer install `money-java`, so tool always named. Options considered: state kind + oblige repo name and record own tool (that record then raw material `money-go` authored from); state kind and stop; or neutral skills declare themselves unenforced. **Revisit when second stack real.**
- **Whether `money-storage` two bans survive panel.** Ship marked decided without one — `money-grade.md` §4 explicit that case for each banned shape written by whoever rejected it, which = failure protocol panel rule exist to prevent. Run panel = that source first re-open trigger; until it run nothing in M-30 … M-43 may promote to *confirmed*.
- **`money-grade.md` §3 gain no row.** Its instantiation table track stack packs, skill not one. Worth sentence in that file so absence no read as missed instantiation — not yet written.

### Phase 1, as shipped

Authored 2026-07-30. Six files, all three skills listed by `npm run check`:

```
skills/money/          SKILL.md  evidence.md    M-1…M-9, M-20…M-29
skills/money-api/      SKILL.md  evidence.md    M-12…M-19
skills/money-java/     SKILL.md  api.md         the Java checks, keyed to those ids
```

`money-java/SKILL.md` open by saying install it with `money` + `money-api` — **three, not spec four**, until phase 2 exist.

**Rewritten wholesale, not carried verbatim.** No skill file hold byte-identical copy of any `raw/` text, so diff gate in *Where skills live* no apply to phase 1, nothing to diff. Reason: half-copy never available — `money-grade.md` §2 directive text carry corpus vocabulary meaning nothing to consumer ("a stack pack states it once"), and each skill add premise, rejected default, instructions to agent around every directive.

**Markers, as actually landed.** `money-grade.md` §2 give each directive check *kind* plus *confidence* marker; enforcement marker (off-the-shelf / bespoke / convention) exist only where tool named. So neutral skills carry **kind + confidence marker + date**, `money-java` carry **tool + enforcement marker**. Read bullet "the check kind with its enforcement marker" in *What every money `SKILL.md` carries* that way — enforcement marker cannot be in file naming no tool.

**Every directive got date; where source gave none, pass date used** — 2026-07-21 founding pass, 2026-07-25 two scoped additions passes (M-3, M-5, M-15 … M-19, M-26), 2026-07-27 observability (M-20 … M-22). Dates inherited not invented; decision 7 lapse rule need date beside every claim, undated *convention* marker would disable it.

**Java evidence inline, cuz spec give `money-java` no `evidence.md`.** Both `SKILL.md` + `api.md` end with dated claim table, do-not-cite list, review-by date. Money-library evaluation (Joda-Money, Moneta, thin-wrapper runner-up) sit in `money-java/SKILL.md` under *The Java library decision*, per `money-grade.md` §4 rule that stack-specific evidence stay with stack.

**One phase-order leak citation graph missed — closed by phase 2.** M-2 check cite M-10 schema lint for float-column half of ban, M-10 was phase 2, so phase 1 shipped that half as named blind spot with **no id**. Phase 2 replaced it with citation and rewrote four places saying store side missing: `money/SKILL.md` (*What is here and what is not*, M-2 clause), `money-api/SKILL.md` (*What is here and what is elsewhere*), `money-java/SKILL.md` (*Named gap* paragraph, M-2 entry). Recorded cuz citation graph no predict it: **check own text can cite across phase boundary even when no directive do.**

**One contradiction carried by phase 1, decided by phase 2 — as unreconciled, deliberate.** `raw/java-backend.md` §4 *Storage* say ISO 4217 exponent 4 CLF-only; its *API contract* note (2026-07-25 pass) say exponent 4 not CLF-only and name UYW. **Neither skill depend on which right**: both notes agree *maximum* exponent = 4, all M-10 scale-4 clause need, and M-14 say read counterparty published table not derive exponent. So both `money-api/evidence.md` + `money-storage/evidence.md` record both readings, attributed + dated, each with re-open trigger, neither pick one. Pick one = author research finding, not what conversion do.

**What phase 1 no build, and phase 2 no either.** No check enforce conversion invariants: nothing verify skill hold no link into `raw/`, cite no `P-n` or `B-n`, keep every relative link inside own dir. Checked by hand 2026-07-30 over all four skills, clean. `npm run check` no see resource files at all, so broken `evidence.md` link pass it.

### Phase 2, as shipped

Authored 2026-07-30, straight after phase 1. Three files:

```
skills/money-storage/  SKILL.md  evidence.md    M-10, M-11, M-30…M-43 + composite shapes
skills/money-java/     storage.md               the PostgreSQL, jOOQ, Flyway and squawk checks
```

All 43 directives now defined exactly once across `money`, `money-api`, `money-storage`; each have Java entry in `money-java`. Every cross-skill citation resolve to installed skill.

**Neutral skill name engines, and that no departure.** Decision 1 put tool in stack skill; `money-storage` hold none — squawk, jOOQ, Flyway, ArchUnit, Testcontainers appear only in `storage.md`. But `money-grade.md` §2 name PostgreSQL, MySQL, SQL Server **inside directives**, cuz engine documented behaviour = rule **ground**, not enforcement. `money-storage` do same: directive stay engine-neutral ("the store rounds, and it does it quietly"), sentence that prove it name vendor. First draft wrote "one engine documents…", corrected — left reader unable to tell whether own engine affected, exact decision rule exist to inform.

**Marker ceiling stated at top of `SKILL.md`, not only in `evidence.md`.** Phase 2 one addition to shape decision 7 fixed. Missing panel = property of whole 2026-07-29 group not any one claim, and fourteen rules marked *primary-source verified* read as settled to anyone never open `evidence.md`. So file open with ceiling, no-panel fact, instruction that **no marker there may promote to confirmed until panel run** — least of all two bans.

**Two bans ship as four-bullet block each**, not prose sentence: ground, org fact it rest on, that no independent panel argued other side, re-open condition. Decision 8 require all four inline, and four things in one sentence = where one get dropped.

**Two out-of-family composite rows say verdict owned elsewhere and name seam** — cached amount = copy no column constraint reach, M-40 name outbox seam. No link, no id, both say plainly those rule sets not published in this skill set. That what source do, and what `caching` + `async-handoff` skills will replace. **Both rows replaced 2026-07-30 — caching one when `caching` authored, outbox one when `async-handoff` was — so whole note now history**; see *The caching skill family*, *The asynchronous-handoff skill family*.

**squawk = one clean stack separation spec predicted (decision 3), shipped with ungated half named.** It flag `numeric` scale change off shelf for lock; say nothing about values already in column, so that half spec-and-review and `storage.md` refuse to describe as gated. `storage.md` wiring record list that, M-35 runtime-SQL blind spot, and M-43 as three things repo must record as *not gated* on first run.

**Still open, now blocked on rule conflict.** *`money-grade.md` §3 gains no row* want sentence written into `raw/rule-sources/money-grade.md` so absence of skills row no read as missed instantiation. **Write it = author in `raw/`, which *What this repo is* forbid** — `raw/` edited only to correct import. Decide which rule win before touch that file; cheap alternative: this sentence in `CLAUDE.md` = record instead.

### The audit, 2026-07-30

All nine files re-read against `money-grade.md`, `raw/seed/java-backend.md` 442–744, `raw/java-backend.md` §4, straight after phase 2. **Structure held**: 43 directives defined exactly once, every `M-n` citation resolving to installed skill, no `P-n`, no `B-n`, no link out of skill dir, all four skills listed by `npm run check`, every directive carry check kind + marker + date. Six content defects found + fixed; two generalise:

- **Cross-skill claim can decay in prose citing no id.** `money/SKILL.md` still said float ban third layer was "the store rules, absent here" inside *The defaults these rules override*, cuz phase 2 rewrote four places naming gap and id-free prose no one of them. Now `money-storage`, `M-10`. Phase-1 note predicted reverse case — check text citing across boundary — this same leak with no id to grep.
- **Tool evidence name must be named in stack skill, not described.** `money-java` said "a Schemathesis-class generator" throughout while own *Do not cite* list warned off "Rust core" claim only about Schemathesis, and `money-api/evidence.md` promised oracle tool "named in the stack skill". `P-1` want tool; hedge = general-gate wording from seed leaking into money instantiation. Now named, with `[generation] deterministic` / `seed` keys recorded as **4.x-specific**, which raw re-open trigger say and no skill had carried.

Other four:

- **`money/SKILL.md` called observability condition "this rule set's own premise".** `raw/java-backend.md` §4 explicit it *different* premise stated as own condition, and `money-grade.md` §1 file it as one of three extra conditions. Decision 4 — observability stay in core skill, always on — unaffected, no need that claim: condition now stand on own, staffed-rota carve-out kept, emission rules named as code rules.
- **`money-storage/SKILL.md` twice pointed inside itself for defect happening elsewhere** — "corrected twice elsewhere in this rule set" (library-scoped seam) + "a sibling rule set" (five unsurfaced composite shapes). Both = caching + async-handoff rules. Named, so consumer stop looking for them in money skills. At audit time neither `caching` nor `async-handoff` published and both sentences said so; **both authored later same day, both sentences rewritten in two steps** (*The interlocks* in each family section). Five unsurfaced composite shapes now `async-handoff-shapes` plus two bans in `async-handoff`, **which no weaken lesson `money-storage` draw**: defect was nothing in that rule set made absences visible, and naming gaps rule by rule no help.
- **`money-java` jqwik pin now say cross-cutting, not money rule.** `raw/java-backend.md` §4 record caveat *moved to agent-traps pack* for exactly that reason. Pin stay in `money-java` — drop it leave consumer of only money skills with no pin — but it **one known overlap with `llm-default-traps`**, and decision 1 write-once rule must settle between them when that skill authored. **Since 2026-07-30 `caching-java` + `async-handoff-java` both name jqwik too**, without pin, so overlap three-way — see *Still open for this family* under caching + async-handoff families.

**What audit no change.** Naming PostgreSQL, MySQL, SQL Server in `money-storage` (ground not enforcement — phase 2 note stand); `M-2` Java marker reading "off-the-shelf tool, the predicate authored per repo" where seed say plainly "off-the-shelf" (skill more honest of two); `M-23` *convention* marker, which source leave unmarked and `money-grade.md` §4 own default — silence in trail = convention — supply.

**Still unbuilt, same as after phase 2**: no check enforce any of this. Audit = hand pass.

## The caching skill family

Authored 2026-07-30, straight after money audit, one pass. Three files:

```
skills/caching/        SKILL.md  evidence.md    C-1 … C-16
skills/caching-java/   SKILL.md                 the Java checks, plus the engine pick
```

16 directives, each defined exactly once in `caching`; every one keyed in `caching-java`. Both listed by `npm run check`.

### What was forced by the money precedent, and needed no re-deriving

- **Two skills, not one.** Table had one `caching` row; neutral/stack split = money decisions 1 + 5, and this source same shape — portable directives, per-stack enforcement.
- **Both open questions answered as money answered** (*Where skills live*).
- **`C-16` = `M-29` shape.** In `raw/` it arm tripwire; skill not pasted, so **description** = tripwire and `C-16` ship as obligation to record decision in plan.
- **`C-1` … `C-16` ship as ids**, resolving inside installed skills. No `P-n`, no `B-n` — every citation of those rewritten as prose.
- **No `evidence.md` in stack skill.** Java evidence inline, end in dated claim table, *Do not cite* list, review-by date.

### What this family decided that the money spec did not

1. **One neutral skill, not three.** Money cut three neutral skills on extra conditions its source state. `cache-discipline.md` state one extra condition — repo cache value it could recompute — plus `C-9` in-process-and-multi-instance carve-out; neither decomposition axis. 16 directives fit one `SKILL.md`.
2. **Engine pick = directive in `caching-java` with no `C-n` id, and stack skill say so on first screen.** One place a `caching-java` entry not keyed to neutral id, no oversight: `cache-discipline.md` §1 deliberately keep engine pick out of source cuz its gates no vary by stack, its right answer vary *within* stack, and it fail premise-specificity test. All three grounds ship, in `caching/evidence.md`. **Contrast `money-java`, where every entry have id** — reader assuming that invariant hold everywhere would hunt for missing directive.
3. **Nine-candidate engine survey ships, in `caching/evidence.md`, as evidence not rule.** Platform-neutral = source own reason for holding once; put in `caching-java` would make next stack re-run it. `caching-java` carry only own dated licence, governance, managed-pricing record for engines its pick name.
4. **Fourteen check kinds not enumerated in any skill.** Source name `money-grade.md` §2 as copy of record for that list, and no money skill carry it — money skills use kinds inline, nothing broke. So `caching` do same. What ship = *reason* list mattered here: `C-13` need **differential execution**, which no kind name, written as *integration test (differential)* with parenthetical carrying difference. Closed vocabulary list = corpus bookkeeping; kind for rule in hand = payload.
5. **`C-6` worded on unwritability; its bytecode-impossibility ground not asserted.** Source own re-open trigger record claim challenged and auditor hit HTTP 403 on primary specification. Rule hold either way — factory that cannot take free-text parameter make wrong call uncompilable — so `caching` state it that way and `caching/evidence.md` record challenge. **`caching-java` record contradiction between its two sources not resolve it**: `raw/java-backend.md` §4 list `invokedynamic` claim as confirmed, source call it challenged, both readings ship attributed + dated, skill state no rule depend on which right. Same call money phase 1 made on ISO 4217 exponent-4 disagreement.
6. **Three Java tool limits appear in neutral skill as consequences, not facts.** `C-3`, `C-6`, `C-12` worded that way *because* of them, so `caching/evidence.md` state what generalise ("analysis that reads compiled output cannot follow a lambda into its body") while tool, issue number, confirmed marker stay in `caching-java`.
7. **Org fact ship as ground for *Start by not caching*.** Eighteen three-person teams, one engineer each, no platform or operations role. Source require pack say "most repos should run no shared cache" *before* stating rule, so top-level section ahead of directives, with three-way ranking (no cache / in-process with short expiry / server).
8. **Marker ceiling stated at top of markers section and in premise neighbourhood, way `money-storage` state own.** All sixteen *convention*, all dated 2026-07-29, **no production use anywhere** — property of whole pass, not any one rule. What 2026-07-29 pass confirmed = *tool* evidence, why confirmed markers all sit in `caching-java`.

### The interlocks, and which ones now resolve

- **`caching` → `money`, resolve.** `C-5` name `M-17` — idempotency record must not live in cache — and `C-10` name float ban fourth layer. Both money skills published, so first cross-family citations in repo pointing at real installed skill.
- **`money-storage` edited, and that owed.** Its composite-shape table row for cached amount, its *What is here and what is elsewhere* list, its library-scoped-seam paragraph all said caching rules "not published in this skill set". Three edits, and **only caching half** — async-handoff sentences still true then, swept in turn when `async-handoff` authored later same day. **General rule: publish skill oblige sweep for every sentence in every other skill saying it no exist.** Nothing check this; already had to run twice.
- **`caching` → async-handoff rule set. ~~Does not resolve.~~ Resolved 2026-07-30**, when `async-handoff` authored. `C-9` post-commit registration exactly seam `E-5` confine, so interlock now name that id from caching side and name `C-9` from other; both sentences saying rule set unpublished rewritten, in `caching/SKILL.md` + `caching-java`, and matching re-open trigger in `caching/evidence.md` struck through. `caching-java` additionally carry delete-after-commit / publish-after-commit contrast, cuz carry one verdict over to other = specific mistake source text exist to prevent.
- **Cross-family reference style: name skill, never link to it, prefer skill name over id.** Relative link out of skill dir break invariant in *Where skills live* — three written + removed during authoring. And `money-storage` new caching sentences name `caching` without citing `C-n`, cuz money-only consumer no install it; id resolving for one install and dangling for another worse than name.

### Still open for this family

- **What repo on uninstantiated stack receive** — same question money carried, answer more urgent here: **six of sixteen directives lean on type design** (no bare write, no atomic primitive, registration-only expiry, key-is-the-tuple, immutable value type, loader return distinguishing absence), assuming type system that can make method absent and constructor mandatory. `caching/evidence.md` state this as first predicted honest gap. **Revisit when second stack real**, answer should match whatever money family settle.
- **Nothing here may promote to *confirmed* without new research pass**, and unlike `money-storage` blocker not missing panel on part of set — every directive design argument with **no production use anywhere**.
- **Differential gate cost unmeasured.** Run integration suite three times triple integration CI time, nobody run it. One adopting repo reporting wall-clock close it; one open item that could retire rule rather than re-date it.
- **`C-1` hand-rolled-memo field-type rule unmeasured too** — nobody counted how many legitimate entries its opt-out list need. `caching-java` state that if number large, honest move = name gap not keep rule.
- **Who own jqwik version pin — found by 2026-07-30 review.** Cross-cutting dependency rule, not money or cache rule, and *confirmed* trap. `money-java` carry as `M-24`; `caching-java` name jqwik in `C-6` + `C-10` and state as named gap that caching-only install have no pin, deliberately no copy value. **Second known overlap with `llm-default-traps`; `async-handoff-java` made it third later same day**, naming jqwik in `E-7` + `E-13` and recording same gap — so three stack skills depend on pin only one of them state, all settled when that skill authored. Whatever it decide must not leave repo installing one family and not other unpinned.
- **Same as after money family: no check enforce any conversion invariant.** Id-uniqueness, no-`P-n`, no-`B-n`, no-link-out-of-dir, no-`raw/`-reference sweep over these three files run by hand 2026-07-30, clean. `npm run check` see neither `evidence.md`.

### The adversarial review, 2026-07-30

All three files re-read against `cache-discipline.md`, `raw/seed/java-backend.md` 745–935, `raw/java-backend.md` §4 under `Cache discipline`, plus four published money skills. **Structure held**: 16 directives defined exactly once, no `P-n`, no `B-n`, no link out of skill dir, no reference into `raw/`, every directive carry kind + marker + date, all six skills listed by `npm run check`. Every content defect found fixed, in four files — `caching/SKILL.md`, `caching/evidence.md`, `caching-java/SKILL.md`, **`money/SKILL.md`**, one nobody expected to touch. **Four findings generalise:**

- **Consumer-facing sentence may not point at "this corpus".** Four did — erasure false-green in `C-10`, `rebuildable-cache premise` collision note in both `caching` files, withdrawn-ground note in `caching/evidence.md`, `caching-java` "this stack already records". Each named fact whose home unpublished material, so consumer could not resolve and could not tell unresolvable. **Fix = money-audit fix: name thing and say plainly not published in this skill set** — and where published sibling can carry claim instead, cite sibling (withdrawn-ground note now point at `caching-java` own engine pick, which *is* technology pick enforced by banned-dependency rule).
- **Interlock other side must be read, not assumed.** `C-5` said idempotency-record ban stated by `money` + `money-storage` skills and "both say the same thing from their side". `M-17` in **`money-api`**, and **no money skill mention cache at all** — source claim "both files say so" already untrue of `money-grade.md`. `C-5` now state it carry ban alone, on ground that cache write in no transaction, and `caching/evidence.md` record false claim so no reintroduced. **Cross-family citation = claim about another file contents; verify it there.**
- **Named gap with subject hidden not named gap.** Three places anonymised thing reader need to know sentence about them: `C-5` "a classic-protocol cache" for **memcached** (whose protocol = clause *ground* — same call money phase 2 made for PostgreSQL in `money-storage`), and "one major cloud provider" for **Google Cloud Memorystore** in two files. All three now name subject.
- **Publish skill oblige sweep in both directions, and prose that count = where it decay.** Caching publish updated three sentences in `money-storage` but missed `money/SKILL.md` float-ban bullet, saying ban stand at **three** layers and enumerating them. Cached amount = fourth, which `money-storage` + `C-10` both already said. **Enumeration with count = highest-risk sentence in cross-skill claim** — decay silently, no id to grep. Fixed; count now four and name `caching`.

Findings no generalise: `caching/SKILL.md` no state marker ceiling anywhere near top, so whole-set *no production use anywhere* fact sat 500 lines below first directive — now stated before premise, way `money-storage` state own, which this file already claimed; `caching-java` Valkey directive promised compatibility with "the open-source Redis line", now false-by-omission for Redis 8.x under AGPLv3 and contradicted own evidence row (guarantee = Redis OSS 7.2 and earlier, and RDB files from Redis CE 7.4 and later *not* compatible); `caching-java` name jqwik in two checks and in wiring list but omitted from stack line; **its version pin — confirmed trap — carried only by `money-java` `M-24`, so repo installing caching skills and not money skills have no pin**, now stated as sixth named gap with value deliberately not copied (pin in two skills drift in one); and `EmptyCatch`-defaults-to-`WARNING` fact asserted in wiring step with no evidence row, now carried with own source + date.

**Left standing deliberately.** `caching/SKILL.md` say "No tool is named here" then name seven Java tools in pointer bullet for `caching-java` — that bullet say what named *there*, strip it cost reader more than inconsistency cost. `C-14` keep Java seed "the normal run asserts at least one", overlapping `C-13` zero-hit assertion; both readings same build artifact and C-14 framing (each configuration prove it took effect) need it. `caching-java` `C-6` property test assert key injectivity where neutral `C-6` state "equal keys imply equal uncached results" — stack skill changing *what asserted* not only tool, which skill reconcile inline and seed require.

## The asynchronous-handoff skill family

Authored 2026-07-30, straight after caching family, one pass. Six files:

```
skills/async-handoff/         SKILL.md  evidence.md   E-1 … E-28, E-32, E-33   30
skills/async-handoff-shapes/  SKILL.md  evidence.md   E-29 … E-31, E-34 … E-36  6
skills/async-handoff-java/    SKILL.md  shapes.md     the Java checks, keyed to those ids
```

36 directives, each defined exactly once; every one keyed in `async-handoff-java`. All three listed by `npm run check`. Largest source in `raw/` (2533 lines) and largest family here.

### What was forced by the two precedents, and needed no re-deriving

- **Neutral/stack split, both open questions answered as money + caching answered** (*Where skills live*). Source same shape: portable directives, per-stack enforcement.
- **`E-28` = `M-29` + `C-16` shape** — **description** = tripwire, `E-28` ship as obligation to record decision in plan.
- **`E-1` … `E-36` ship as ids**; no `P-n`, no `B-n`, every citation of those rewritten as prose.
- **No `evidence.md` in stack skill.** Java evidence inline, end in dated claim table, *Do not cite* list, review-by date.
- **Transport pick = directive in `async-handoff-java` with no `E-n` id**, exactly as `caching-java` carry engine pick, stack skill say so on first screen. Source keep pick out for same three grounds.
- **Nine-candidate transport survey ship in `async-handoff/evidence.md`** as evidence, cuz platform-neutral.

### What this family decided that neither precedent did

1. **Two neutral skills, cut on dormancy conditions source own `holds-when` state.** 36 directives no fit one always-loaded `SKILL.md`, and source state per-group conditions: flow across transactions (`E-29` … `E-31`), HTTP across org boundary (`E-34`, `E-35`), oversized payload (`E-36`). Those six became `async-handoff-shapes`. **`E-32` + `E-33` stayed in core skill cuz source say never dormant** — "a ban with a precondition is a ban an agent can argue its way past" — same call decision 4 made for money observability rules: condition always on, rule stay in core.
2. **Split also evidence-provenance split, stronger reason.** Pass 1 wrote `E-1` … `E-28` and had hostile audit whose planted canary caught; pass 2 wrote composite shapes + two bans with **one researcher, no panel, no steelman duel, no hostile audit.** Two files let each state own ceiling honestly, and `async-handoff-shapes/SKILL.md` say plainly its pass weakest behind any skill here.
3. **Three-way name split for stack skill: `SKILL.md` + `shapes.md`, keyed to two different neutral skills.** `money-java` + `caching-java` each face one neutral family; this stack skill `shapes.md` keyed to `async-handoff-shapes` while `SKILL.md` keyed to `async-handoff`. Each file state which.
4. **Transports + engines named in neutral skills; frameworks, libraries, analysers not.** This = money phase 2 rule ("engine documented behaviour = rule *ground*, not enforcement") turned into usable line. So Kafka `enable.auto.commit`, RabbitMQ quorum-queue delivery limit, SQS absent automatic acknowledgement, PostgreSQL `SKIP LOCKED` caveat, Kafka Streams late-record drop all in `async-handoff`, while Spring `BATCH` ack default, `DefaultErrorHandler`, `@RetryableTopic`, ArchUnit, Error Prone, jOOQ, Toxiproxy appear only in `async-handoff-java`.
5. **Anonymised subjects named, per caching review finding.** Where source write "one widely used queue-shaped broker" or "a managed queue" and Java pack name product, neutral skill name it too — cuz named gap or named ground whose subject hidden = one no reader can tell apply to them.
6. **Withdrawn thresholds ship as history plus do-not-reintroduce entry, not deleted branch.** Source reversed itself same day written: polled table = recommended default and broker = conditional escalation above three thresholds, all three withdrawn as undecidable at plan gate. `async-handoff/SKILL.md` state reversal + three reasons, cuz **"an agent reading a broker-versus-table argument out of its training corpus will reconstruct something close to the first threshold."** Excluded ninth survey candidate keep full row + steelman for same reason.
7. **Two claims source make about other files checked before repeated; one narrowed.** `E-13` source text say three-way interlock carried by all three rule sets. `M-17` (in `money-api`) require idempotency record in money effect transaction and **mention neither cache nor broker**; `C-5` (in `caching`) carry cache ban. So `E-13` ship saying it carry **broker** half alone and name who carry other two. **Caching review rule applied prospectively: cross-family citation = claim about another file contents, verify it there.**
8. **Float ban layer count moved, enumerations swept.** `E-21` = fifth layer, so `money/SKILL.md` bullet went four → five and named `async-handoff`. `caching` "fourth layer" for cached copy still correct, left alone.
9. **`async-handoff/SKILL.md` = 1282 lines, largest always-loaded body here; split core further considered + rejected.** Candidate cut = producer path / consumer path / shared machinery. Fail cuz **machinery shared by both directions**: `E-1` seam cover publish + subscribe, `E-26` catalog read by eleven directives on both sides, `E-24` gate enumerate it — so cut need third skill every repo install anyway. Same token cost, plus three descriptions competing to fire and more cross-skill citation surface. **Dormancy cut producing `async-handoff-shapes` = only one source support.** Revisit only if context cost measured as real problem, and record measurement.

### The interlocks, and which ones now resolve

- **`caching` → `async-handoff`, resolve.** `C-9` post-commit callback = exact seam `E-5` confine; general `afterCommit(Runnable)` defeat `E-5` entirely. Three sentences in `caching/SKILL.md` + `caching-java` said rule set not published; all now name it, one re-open trigger in `caching/evidence.md` struck through as resolved.
- **`money-storage` → `async-handoff`, `M-40` residue discharged.** `M-40` required durable row money event published from be in money effect transaction and recorded residue: depended on second rule set agreeing. `E-5` require exactly that. Six sentences across `money-storage/SKILL.md`, `money-storage/evidence.md`, `money/SKILL.md` rewritten.
- **`async-handoff` → `money` + `caching`**, all resolving: `E-13` → `M-17`, `M-40`, `C-5`; `E-20` → `M-13` + `C-11` inversion; `E-21` → `M-2`, `M-10`, `M-12`, `C-10`; `E-32` → `M-38`; `E-15` → `C-6` challenged ground; `E-10` → `M-5` + `C-12`.
- **Cross-family reference style unchanged: name skill, never link to it.** No relative link leave any skill dir in family.

### Still open for this family

- **Panel neither pass had, two triggers not one.** Pass 1 owe three refutation votes; pass 2 owe steelman duel plus hostile audit, **ranking with votes not below them cuz two of its outputs = bans removing option from every future repo.** Nothing may promote to *confirmed* until both run.
- **What repo on uninstantiated stack receive** — third family carrying this, largest surface yet: **eleven directives lean on type design**, against caching six. Revisit when second stack real; answer should match whatever money + caching settle.
- **Four-configuration gate cost unmeasured, now most expensive gate in repo skills** — quadruple integration CI time against real broker in container, where caching gate merely triple it. If cut, five directives degrade to declarations while catalog still report green.
- **Cross-repository union check have no host anywhere**, making `E-19` + `E-26` repo-local hygiene wearing clothes of contract. Both skills say so. Most consequential gap in family for eighteen-team org.
- **jqwik pin now three-way overlap with `llm-default-traps`, not two-way.** `money-java` carry as `M-24` at ≤ 1.9.3 with CI version-ceiling check; `caching-java` name jqwik in `C-6` + `C-10`, `async-handoff-java` name it in `E-7` + `E-13`, both record same gap **without copying value**, cuz pin in three skills drift in two. When `llm-default-traps` authored, whatever it decide must not leave repo installing one family and not others unpinned. All three stack skills now point at same unsettled question.
- **Webhook signing standard have no pick; reason = unverified belief.** `E-34` require one of RFC 9421 or Standard Webhooks committed, and neither `async-handoff-shapes` nor `async-handoff-java/shapes.md` name winner: pass never checked what maintained JVM implementations either have, and own re-open trigger ("RFC 9421 gains a maintained implementation on the stack") imply belief it no verify. **2026-07-30 review found neutral skill promising pick stack file withhold, fixed promise not invent pick.** One implementation survey close it.
- **`event-broker-discipline.md` §3 instantiation table gain no row, hit same rule conflict money left open.** Skill not stack pack, so absence correct; write sentence into `raw/` to say so = author in `raw/`, which *What this repo is* forbid. **Same decision owed as `money-grade.md` §3; cheap alternative same: this sentence in `CLAUDE.md` = record.**
- **No check enforce any conversion invariant, same as after money + caching.** Sweep over these six files run by hand 2026-07-30, clean: 36 directives defined exactly once, every `E-n` reference resolving to defined id, no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`, no relative link leaving skill dir, every directive carry kind + marker + date, every cited `M-n` + `C-n` read in defining file before cited. `npm run check` see none of four resource files. **Last clause of that sentence not true** — adversarial review below found one cross-family citation naming wrong rule — and structural half of sweep confirmed clean by second mechanical pass.

### The adversarial review, 2026-07-30

All six files re-read against `event-broker-discipline.md`, `raw/seed/java-backend.md` 937–1757, `raw/java-backend.md` §4 under `Event broker discipline`, plus four money skills + two caching skills. **Structure held, this time checked by script not eye**: 36 directives defined exactly once, each carry check kind + *convention* marker + date; 36 directive *statements* diffed word-for-word against source with no clause dropped (six diffs, all punctuation or deliberate `E-28` removal below); all 19 of source named gaps, residues, weakest-clause notes carried; no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`, no link leaving skill dir; nine skills listed by `npm run check`. Ten content defects fixed, in five of six files. **Five findings generalise:**

- **Marker word inside prose = claim, and *confirmed* = one that leak.** Five places used it as ordinary English over material their own tables mark *primary-source verified*: `E-2` meta-annotation fact, `E-12` arithmetic, "the confirmed material is…" sentences in both `async-handoff/SKILL.md` + its `evidence.md`, plus `async-handoff-java` "all three are confirmed for this stack". **Source do same in two of those places, so conversion inherited defect not invented it** — case for checking marker words in prose way table row checked. And where claim here genuinely *is* confirmed, **different family pass** confirmed it: `caching-java` carry ArchUnit lambda-body + catch-body limits and no-op cache manager as *confirmed*, cuz cache pass ran three refutation votes. This pass confirmed nothing, so attribution must travel with claim.
- **Count in prose decayed again — twice, both in newest file, both created by split itself.** `async-handoff-shapes` said its six directives add "seven named gaps of their own" (five theirs; two belong to bans shipped in `async-handoff`), and its `evidence.md` said "three of the six lean on type design" while listing construct `E-22` define in core skill (two do). Fourth instance of failure this file keep recording. New half of lesson: **count most dangerous exactly where family split, cuz each half inherit whole number and nothing re-derive it.**
- **Cross-family citation naming wrong id invisible to every structural check.** `async-handoff/evidence.md` cited `C-5` for swallowing-catch residue, where rule = `C-12` — and cited `C-12` correctly 300 lines later. Both ids exist + resolve, so id sweep pass and only reading cited rule catch it. **Caching review rule was verify other side; this add that verification cannot delegate to id sweep, and that previous session claim to have done it was itself thing to check.**
- **"Named in the stack skill" pointer must check against stack skill, both polarities.** `async-handoff-shapes` said signing-standard pick "is stated in the stack skill"; `shapes.md` deliberately name **no** winner, cuz pass never checked what maintained implementations either standard have. Money audit found this defect as hedge where tool should have been named; here it arrive inverted — neutral skill promising pick stack skill was right to withhold. **Both same check: follow pointer.**
- **Claim with no evidence row anywhere worse in stack skill than neutral one**, cuz stack skill where reader expect sourced tool fact. `async-handoff-java` "Kafka share groups move a past-limit record to an archived state and route it nowhere" = only claim in family with no primary source in **either** pass — exist in Java seed text alone, sat one sentence away from RabbitMQ delivery-limit fact which primary-source verified. Now carry **not verified — do not cite as documented**, sentence say which half sourced.

Five that no generalise: `E-26` carried none of second-consumer extra condition source state for **both** cross-repository directives, only `E-19` did (added, with generated catalog itself explicitly *not* dormant, cuz eleven directives read it inside one repo); `E-24` kind note said "a fifteenth is not added", pointing at fourteen-item vocabulary no consumer can see, now match `caching` self-contained wording; `E-13` said neither `M-17` nor `M-40` "mentions a cache or a broker", true of `M-17` and false of `M-40` as published — `M-40` reach broker to require row event published from share effect transaction — narrowed to what both actually constrain, which is *when* record written not *where* it live; RabbitMQ 4.2 support window written as having "ended 2026-07-31", future date in past tense; `evidence.md` named **Microsoft Azure** where pass recorded only "one major provider" plus its retail-prices API, name kept with identification marked as inference drawn during conversion not vendor name pass wrote down; and `E-28` Java entry used "the Decision Trace citation line" with no gloss, where `money-java` + `caching-java` both gloss it — consuming repo without that spec machinery have no Decision Trace to write in.

**Left standing deliberately.** 1282-line core skill + dormancy split (rejected producer/consumer/machinery cut still right rejection); naming Kafka, RabbitMQ, SQS, NATS, Kafka Streams in neutral skills (ground not enforcement); `E-28` dropping source "in its Decision Trace" from neutral text while stack skill keep and now gloss it; and claim this family passes **worse than caching family** — checked against `cache-discipline.md` own frontmatter, which record evidence panel + three-vote refutation broker pass never ran, so comparison exact not rhetorical.

## The `llm-default-traps` skill

Authored 2026-07-30, fourth of five, one pass. Two files:

```
skills/llm-default-traps/  SKILL.md  evidence.md   nine directives, no ids
```

**First pack-derived skill, first single-skill conversion, first skill here with no rule ids.** Listed by `npm run check`. Drawn from `raw/seed/agent-traps.md` (53 lines, nine directives) with evidence from `raw/agent-traps.md` §3 (five dated notes) + §4 (three re-open triggers).

### What was forced by the three precedents

- **Both open questions from *Where skills live* answered as every family answered**: instruct agent directly, carry one-time `## Wiring the gates` section, cuz gate = what catch *next* agent.
- **Marker + date inline on every directive**, evidence one hop away — sources, do-not-cite list, re-open triggers, what skill no carry.
- **Lapse rule stated with date** (`review-by` **2027-01-24**), marker ceiling stated near top not only in `evidence.md`.
- **No `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`, no link leaving skill dir.**
- **Decision Trace glossed**, per async-handoff review finding that consuming repo may have no such document.

### What this skill decided that no family did

1. **One skill, no neutral/stack split, and *Where skills live* predicted this correct.** Split rule closed for cross-stack sources and explicitly no cover pack. Two further grounds: five JVM directives = **dependency + tooling picks not service-code rules**, so bind Java library, CLI or batch job as much as backend — `-java` sibling would carry wrong condition — and pack have no source with per-stack instantiation to defer tool to. JVM group ship as conditioned section, way source text already split it.
2. **No rule ids, first skill in set without them.** `raw/` assign ids only to *sources*; pack have none to inherit, so ids here would need invent, making this skill definition of record for numbering `raw/` no have. Decisive ground = cross-family reference style caching settled — **prefer skill name over id, cuz id resolve for repo that installed skill and dangle for one that no** — and three stack skills need point at one rule here. They point by skill name plus subject. Each directive get `###` heading instead, durable anchor id would have been.
3. **It name both check kind and tool, in one file, split by group.** Any-stack gates named by *kind* with tool left to ecosystem; JVM gates name maven-enforcer + Error Prone. Every other skill here put those two halves in two skills. No second file to put tool in, and invent one = split rejected in point 1.
4. **Marker ceiling inverted.** `money-storage` + `caching` open by warning markers weaker than they look. Here most claims *confirmed* — three refutation votes against primary sources — making this only skill in set not predominantly convention. So top-of-file note say markers run *other* way and name three exceptions: general injection-surface rule = convention with one instance behind it, scanner-compromise record dated and must re-verify at adoption, and slopsquatting *threat* confirmed while lockfile-and-plan-gate *response* = this org convention.
5. **Growth tripwire convert into two obligations not one.** Source own tripwire: newly found trap added to pack with date — its only growth path. Installed skill not file consumer edit, so skill require repo **record new trap in own rules at moment found** *and* **report it back**, and say plainly nothing automate second. First tripwire in set that = maintenance path not arming mechanism, and **`M-29` / `C-16` / `E-28` shape not needed**: plan-gate obligation already directive in source text ("a new dependency appears in the plan's Decision Trace, never silently in a diff"), so native here not conversion artifact.
6. **"Silence about a trap is not evidence the trap is absent"** ship as top-level statement not named gap, cuz incompleteness = property of whole list not any rule in it.

### The jqwik pin — settled, and what the sweep changed

**This skill now owner of record.** Corpus own answer decided it: `raw/java-backend.md` §4 record caveat *moved to agent-traps pack* precisely cuz cross-cutting, and all three stack skills already said pin not their rule. Seven edits across four published files:

- **`money-java/SKILL.md`** — `M-24` entry, wiring step 4, evidence table row.
- **`caching-java/SKILL.md`** — wiring record skipped-item bullet, named gap 6.
- **`async-handoff-java/SKILL.md`** — wiring record skipped-item bullet, named gap 7.

**Version removed from `money-java`, one consequence to know.** Before, repo installing only money skills had pin; now no stack skill state it, all three name `llm-default-traps` as owner, all three carry same fallback — if that skill not installed, pin = repo own to state and no skill here supply it. Two grounds. Repo own rule, already stated twice by `caching-java` + `async-handoff-java`: pin stated in *N* skills drift in *N*−1; and `llm-default-traps` bind **every** agent-built repo regardless of stack, so baseline not optional companion. Alternative — leave value in `money-java` too — exactly two-copy drift those two skills refused to create.

**Constraint this file set** ("whatever it decides must not leave a repo installing one family and not the others unpinned") **met by making install instruction loud in all three and stating fallback in all three.** Not met for repo that ignore instruction — but that outcome now **symmetric across three and stated in each**, where before silently true for two and silently false for third.

**Inside `llm-default-traps` version appear twice, doing two jobs**: directive state ceiling, `evidence.md` state release date of clause-free version = *why* that ceiling. Wiring step deliberately point back at directive not restate number.

### The interlock that only partly resolved — and the new lesson

Two caching sentences — one in `caching/SKILL.md`, one in `caching-java` — said unloggable-domain-type rule belong to "a platform rule set not published in this skill set". This skill publish **tool ban** (Error Prone, never ArchUnit) + erasure ground behind it; **rule itself** = platform Observability rule, unwritten at time. So both sentences **narrowed, not resolved**: named `llm-default-traps` as carrying ban + ground, kept saying domain-type rule unpublished.

**Lesson: publish-obliges-sweep rule need second step — check what new skill actually publish against what old sentence actually claimed.** Three previous publishes replaced such sentences wholesale; first where wholesale replacement would have been **false**. Other two "not published in this skill set" sentences in caching family about telemetry disposability + `rebuildable-cache premise` collision; both read and correctly left alone.

**Both halves resolved later same day**, when `java-backend-observability` authored (*The Java-backend skill family*). Domain-type rule now published there, two caching sentences + this skill two matching ones rewritten to name it — each stating why ban stay in `llm-default-traps` not move, since erasure trap bind every JVM repo while that skill bind one backend stack — and **two sentences correctly left alone rewritten too**, cuz that publish resolved telemetry-disposability half as well. **Lesson survive own resolution:** narrowing right call at time, and sentences right to leave alone were right for reason that then changed. Nothing check either step.

### Still open for this skill

- **Trap list grow only when someone notice.** Stated as first named gap, not closable.
- **Registry verification have no host** — convention, agent state it done. First line of defence against one *confirmed* threat in set and least enforced rule in it. Green lockfile gate not registry verification, and skill say so where it would misread.
- **Injection-surface rule generalise from single case.** Second confirmed instance promote it from convention and also first evidence about how often this happen.
- **Any-stack version-ceiling mechanism named by kind only**, = uninstantiated-stack question in mildest form: lockfile gates + action pin-checks off shelf in every major ecosystem, ceilings not. Repo finding no off-the-shelf host for one of three any-stack gates must record which — those records = raw material per-ecosystem section would be authored from.
- **jqwik successor evaluation never run.** Re-open trigger carried from 2026-07-21, and **four skills here now depend on library**, so evaluation worth more than version bump.
- **`raw/agent-traps.md` gain no row and need none; this conversion first that does *not* hit `raw/`-editing conflict** money + async-handoff left open. That conflict about writing sentence into *source* instantiation table; **pack have no such table**, so nothing to write and nothing to decide. Conflict still stand for `money-grade.md` §3 + `event-broker-discipline.md` §3.
- ~~**No adversarial review has been run on this skill.**~~ **Run 2026-07-30 — see *The adversarial review* below.** What bullet used to say still hold as background: each of three families reviews found content defects in files authoring pass already called clean, and this skill did too. **Structural sweep clean at authoring and clean again after review**: nine directives each carry check + enforcement marker + date; no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`; only two links = `SKILL.md` ↔ `evidence.md`; ten skills listed by `npm run check`. **Two counting errors caught during authoring by re-deriving not re-reading** — "seven of the nine claims are confirmed" (confirmed set neither seven nor nine; sentence now stated by exception with no count) and "the four any-stack gates" against "one of these three" three lines later. Fifth instance of this failure in repo, **and review found sixth: same "four any-stack gates" phrase, uncorrected, in `evidence.md`.**

### The adversarial review, 2026-07-30

Both files re-read against `raw/seed/agent-traps.md`, `raw/agent-traps.md` §1, §3, §4, `raw/README.md` marker + status-tier definitions, three stack skills pointing here. **Structure held**: nine directives each carry check kind + enforcement marker + date; nine directive statements diffed against seed with no clause dropped; no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`, only links `SKILL.md` ↔ `evidence.md`; frontmatter still parsing after description edit and ten skills listed by `npm run check`. Content defects fixed in both files — **deliberately no counted here, since count = failure this very review found for sixth time.** **Five findings generalise:**

- **Fix decayed count in one file no fix its copy in sibling, and repo own record of catching it made that harder to see.** Authoring caught "the four any-stack gates" in `SKILL.md` and *this file* recorded catch; identical phrase sat uncorrected in `evidence.md`, pointing at named gap saying "one of these three". `evidence.md` now **name** them — lockfile gate, pin-check lint, version-ceiling mechanism — and named gap keep "one of these three", cuz there count sit one sentence after enumeration it count. **Sixth instance of counting failure, first where fix note in `CLAUDE.md` read as coverage for file fix never reached.**
- **Cross-family citation carry quantities; those need same verification ids get.** Both files said three stack skills name jqwik "as the check for **one** of their own directives". `money-java` name it for `M-1`, `M-3`, `M-8`, `M-24`; `caching-java` for `C-6`, `C-10`; `async-handoff-java` for `E-7`, `E-13`. Worse, `evidence.md` asserted **"their side was read before this was written"** in same sentence that got number wrong — async-handoff review lesson repeating exactly: **claim to have verified is itself claim to check.**
- **Marker or tier glossed in author own words can invert what it name.** Status tier read "the enforcement shapes have not been run long enough to be production-confirmed", asserting production use; `raw/README.md` define *decided, not yet validated* as **no production use yet**. Gloss must diff against definition, not written from phrase. Same section used **recorded** as third marker value in its table and defined only *confirmed* + *convention* — now defined.
- **Superlative about other skills = count in disguise, and it wrong.** File claimed to be "the only skill in this set that is not predominantly convention". `money-storage` not predominantly convention either — roughly half its directives *primary-source verified* from 2026-07-29 persistence pass. Marker inversion real and worth stating; ranking against nine other files not checkable and gone. It also said exceptions "stated by exception rather than by count" **while counting them**.
- **Conditioned group must be conditioned where premise stated.** Premise section said premise "is the whole of the condition — there is no second half, which is why this skill applies to every agent-built repo regardless of stack", and JVM group dormancy condition arrived 115 lines later. `raw/agent-traps.md` §1 state both together. Python repo reading only premise section told nothing here stack-conditioned = exact reading JVM group exist to prevent.

Rest, no generalise: gap 2 called registry verification defence against "**the** confirmed threat in this set" and "the least enforced rule in it" — two confirmed threat claims exist and two other gaps equally unenforced, so now name slopsquatting and say plainly nothing in any build reach verification; `evidence.md` counted "four skills in this set depend on the library" (three run checks on it, this one pin it — now named not counted); growth-path section opened with "**The source this converts** states its own growth path", consumer-facing pointer at unpublished material = caching review finding — growth rule now stated as this skill own; wiring step 3 said ceiling mechanism have "the jqwik pin **below**" when pin stated above it, and its justification ("the first one is already known") false on every non-JVM stack where mechanism start empty; description + JVM heading called all five JVM rules "dependency and tooling picks" while skill itself say `char[]` directive "bans a **claim** rather than a pick"; two of five re-open triggers = conversion additions not triggers pass wrote down, now marked as such; directive "it is in maintenance mode" had no ground of own — `evidence.md` now say it rest on maintainer *probably*-hedged sentence and that pin no; and `SKILL.md` promised "**Sources** for each" where jqwik entry name no source document, now "the ground behind each claim — with its source where the pass named one".

**Left standing deliberately.** No rule ids (decision 2 hold — three stack skills cite by skill name plus subject, all three resolve); one skill with no neutral/stack split; marker inversion itself = point of top-of-file note; naming Trivy, jqwik, `de.jollyday`, JSR-275, JScience, maven-enforcer, Error Prone; and source blanket claim that **every** trap here = named corpus favourite, loose for registry-verification + injection-surface rules — loser there = habit not package — but source own sentence and hold for all nine on reading that rejected default named inline.

## The Java-backend skill family

Authored 2026-07-30, straight after `llm-default-traps`, one pass. Six files:

```
skills/java-backend-rules/          SKILL.md  evidence.md   Platform, Concurrency, Time, Null, ban list, evidence toolchain  31
skills/java-backend-api/            SKILL.md  evidence.md   the general API contract                                        22
skills/java-backend-observability/  SKILL.md  evidence.md   the general Observability section                               14
```

67 directives, each defined exactly once, one `###` heading each. All three listed by `npm run check`, which listed thirteen when family shipped. Drawn from `raw/seed/java-backend.md` **lines 1–441** — whole file minus three already-converted conditional sections — with evidence from `raw/java-backend.md` §4 eight matching headings, rejections in §3, triggers in §5.

### What was forced by the four precedents

- **Both open questions from *Where skills live* answered as every skill answered**: each skill instruct agent directly, each carry one-time `## Wiring the gates` section with record of what wired and what skipped, cuz **gate = what catch next agent.**
- **No rule ids**, following `llm-default-traps` decision 2 — pack have none to inherit, `###` headings = durable anchor, cross-skill citation by skill name plus subject. **No `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`, no link leaving skill dir** — verified by script.
- **Marker + date inline on every directive**, evidence one hop away, marker ceiling stated near top of each file, `review-by` **2027-01-21** with lapse rule, status tier **decided, not yet validated** glossed as *no production use yet* — checked against definition not written from phrase.

### What this family decided that no predecessor did

1. **Stack-only family: three skills, no neutral sibling, split rule in *Where skills live* no reach this case.** That rule closed for cross-stack sources and no cover pack; `llm-default-traps` shipped as one skill. Here pack **is** stack — every directive name Java tool, so nothing portable to lift out and no per-stack instantiation to defer tool to. **Consequence that bite: tool named only in evidence trail must be named in directive, cuz no stack sibling to name it in.** Money audit finding arriving through different door, and review below found twelve instances.
2. **Cut by *what agent doing*, and two of three lines = source own stated conditions.** API-contract section state it bind when OpenAPI document exist; Observability section state it bind when nobody watch running system. Those became skills. **Unlike `async-handoff-shapes` this no pure dormancy cut**, difference recorded cuz it look like one: `raw/java-backend.md` §1 explicit that repo with staffed rota **keep observability emission rules** — code rules under pack main premise — and re-decide only alerting ones. So that skill condition partial, and skill say which half survive dropping premise. **Only place in set where dropping premise drop part of rule set.**
3. **Third ground for cut = progressive disclosure, stated cuz dormancy argument alone no carry it.** Agent writing jOOQ query should not load 22 contract directives or 14 telemetry directives. Always-loaded bodies ~700, ~640, ~460 lines not one ~1800-line file, and three descriptions each fire at own moment — add endpoint, add log line, write query.
4. **Names keep `java-backend-` prefix so family visible in flat list**, and `java-backend-rules` keep name table already carried. `java-backend` alone rejected: read as "everything about Java backends" for skill excluding contracts, telemetry, money, caching, async handoffs.
5. **Ban list = one place marker + date *not* inline per directive, and skill say so.** Its six entries share one ground + one enforcement host — source state check once, in last bullet — so marker (**convention, 2026-07-21**) + host stated once at group head with explicit note this deliberate not dropped marker. Every other directive in family carry both inline.
6. **Three Platform directives have no evidence note anywhere**, dates = inference not verification. WebFlux paradigm ban, Flyway-migrations rule, Jackson pick dated **2026-06-11..14** cuz only pass whose scope cover them, and all three skills say dating drawn during conversion. **WebFlux ban = consequential one** — no pass ever examined alternative it ban, so `evidence.md` state it as unexamined ban not refuted alternative and add re-open trigger passes no write down.
7. **`confirmed` mean two different things inside `java-backend-rules`, and date tell them apart.** 2026-07-24 concurrency pass ran three refutation votes; 2026-07-25 persistence pass wrote *confirmed* against single-researcher documentation checks. Both usages carried not re-graded — **re-mark someone else verdict not what converting do** — with ambiguity stated at top of file. `java-backend-api` = pure case: **every** *confirmed* there = documentation check, cuz that pass cast no vote at all.

### The interlocks, and which ones now resolve

- **`llm-default-traps` → resolved, interlock previous conversion could only narrow.** That skill publish ban on ArchUnit as host for non-loggability rule; **rule itself now *domain types are unloggable by type* in `java-backend-observability`.** Both sentences saying domain-type rule unpublished rewritten, in `llm-default-traps/SKILL.md` + its `evidence.md`, each stating why ban stay there not move here — erasure trap bind every JVM repo, this skill bind one backend stack.
- **`caching` → resolved twice.** Its erasure-trap paragraph + `caching-java` `C-10` both said domain-type rule belonged to unpublished platform rule set; both now name skill. And **"rebuildable-cache premise" naming collision now have both sides published** — `caching` deliberately say *derived-store premise* to avoid redefining telemetry disposability, and that directive now *telemetry is rebuildable, disposable data* here, stating collision from own side. Three edits in `caching/SKILL.md` + `caching/evidence.md`, one in `caching-java`.
- **`money` + `money-api` → pointers added, not resolutions.** `M-26` note in `money/evidence.md` said contract conformance fuzzing "is now a general rule" with no published home; now name *the committed document is the single conformance oracle*. `M-18` said "a repo with no such general rule states one here"; now name general rule. **Both original sentences stay true and neither replaced wholesale** — `llm-default-traps` lesson applied: check what new skill publish against what old sentence claimed, cuz wholesale replacement sometimes false.
- **`java-backend-rules` → `caching` + `async-handoff`, new outbound interlock.** Transaction seam = shared resource and **two published skills add requirements to it this family directive no state** — `C-9` need cache invalidation reachable only from its post-commit registration, `E-5` need general-purpose post-commit callback *not* exist. Seam directive name both and say plainly it fix transaction boundary and not post-commit surface.
- **Cross-family reference style unchanged: name skill, never link to it.** No relative link leave any skill dir in family.

### Still open for this family

- **No panel run over two of three areas.** Contract pass ran one researcher and cast no refutation vote; observability pass panelled exactly one claim. Only 2026-07-24 concurrency group + 2026-07-21 founding group had votes. **Run panels = what promote those markers**, and both skills say so at top not only in `evidence.md`.
- **`java-backend-api` have no decimal-string directive, and source claim it do.** `raw/java-backend.md` §3 integer-minor-units rejection say API-contract rules "extend the string-decimal choice to every decimal field" — but no directive in general section state it. Rule that do = `M-15` in `money-api`, filed under money-grade. **So repo with rate or percentage field on wire and no money feature have no rule at all.** Found while authoring, stated as that skill first named gap, family clearest content gap not enforcement one.
- **Mutation-testing gap in general tier.** Coverage floor cannot see whether test asserted anything, and mutation testing scoped to money packages only — verified in `money-java`, which pin pitest "scoped to the money packages". So general-tier package can sit green over vacuous machine-written tests with nothing detecting it. Source name triggers that would extend it; none fired.
- **`ExecutorService.close()` ground thinner than rule built on it.** Fan-out helper ban on raw shape rest on close semantics asserted only in rejected-alternatives record, with **no javadoc citation anywhere in trail and no pass listing helper in scope.** Marked convention, with re-verify-at-adoption instruction. Helper worth building regardless; *ban* only as strong as that claim.
- **Three-Platform-directives gap + WebFlux question** — item 6 above.
- **`java-backend.md` §3 + §5 gain no row, hit no rule conflict.** Unlike `money-grade.md` §3 + `event-broker-discipline.md` §3, **pack** have no instantiation table, so nothing to write into `raw/` and nothing to decide. Conflict still stand for two sources.
- **No check enforce any conversion invariant**, same as after every previous family. Sweep over these six files run **by script** 2026-07-30, clean: 67 directives across three skills totalling exactly seed 67 directive bullets in lines 1–441; every directive carry check + marker + date except six ban-list entries covered by group-level marker; no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`, no link leaving skill dir, no reference to unpublished prior-art documents by name. `npm run check` see none of three `evidence.md` files.

### The adversarial review, 2026-07-30

Run against `raw/seed/java-backend.md` 1–441, `raw/java-backend.md` §1, §3, §4, §5, and ten previously published skills. **Structure held and checked mechanically**: 67 directive statements distinctive tokens — every backticked identifier, RFC number, status code in seed directive region — diffed against three skills, 121 distinct tokens checked. **Five findings generalise:**

- **Stack skill with no neutral sibling will hedge tool names anyway, and hedge invisible to every other check.** Twelve of 121 seed tokens missing, and **every one a tool skill described instead of naming**: `ProblemDetail`, `ResponseEntityExceptionHandler`, `@PatchMapping`, `ISO_LOCAL_DATE`, `MeterFilter`, `promtool test rules`, `GeneralCodingRules.NO_CLASSES_SHOULD_ACCESS_STANDARD_STREAMS`, `NO_CLASSES_SHOULD_USE_JAVA_UTIL_LOGGING`, `jacoco-maven-plugin`, `COVEREDRATIO`. Plus springdoc, HikariCP, Prometheus, which seed name unbackticked and skills reduced to "the code-first generator", "the connection pool", "the metrics vendor". **Cause = style carried from neutral skills, where withhold tool correct** — and money audit found same defect from other direction, as hedge in stack skill whose evidence named tool. **Mechanical form of check = finding worth keeping: extract every identifier-shaped token from source directive region and require each in converted text.** Caught all twelve; no marker, id or link sweep would catch any.
- **Superlative about other skills = count in disguise — async-handoff review finding, repeating on very next conversion.** `java-backend-rules` called fan-out context rule "the one rule in this skill set with a full three-vote adversarial panel behind it." **False**: money founding pass ran three votes per claim, caching pass ran three on load-bearing claims, and this family own 2026-07-24 concurrency group had one. Narrowed to "the one rule in that skill's area." **Seventh instance of counting failure in repo.**
- **Ceiling stated as "exactly one confirmed claim" must check against marker table, not pass note.** `java-backend-observability` said one claim alone carry *confirmed* while own table gave marker to two directives — fan-out capture + backend pin — cuz panel produced **both** ("pin the backend, and do not depend on inheritance even where it works" = one conclusion not two findings). Three places said one; named gap said "thirteen of these fourteen." All now say two, and gap **name** exception instead of counting remainder.
- **Dormancy claim need enforcement halves enumerated, or wrong in both directions.** `java-backend-api` said that without OpenAPI document "most of them are dormant, and the two directives that survive say so inline." Neither half true: most directives survive in some form cuz ArchUnit or test host them, and more than two do. Replaced with actual split — six gates plus every lint go dormant; eleven ArchUnit-or-test-hosted rules no — **stated before first directive, cuz reader without document need it to know whether skill apply at all.**
- **Write-once violation between new skill and published one hide inside rejected-alternatives bullet.** Ban-list entry for caching annotations restated **all four** of `caching` rejection grounds, which that skill already carry as language-neutral rejected alternative. Source own division: neutral grounds live in cache source and *pack add Spring-specific one*. Now entry state ban, add only stack-shaped ground (size of corpus pull on this stack), defer four, warn that repo installing this skill without `caching` **have ban and no replacement**. **Rejected-alternative prose = where duplication survive id-uniqueness sweep**, cuz carry no id.

Rest, no generalise: exponent-4 contradiction attributed to "the same pass's storage note" when disagreement **between** 2026-07-21 storage pass and 2026-07-25 contract pass — cross-file citation getting *provenance* wrong not id; five vendors anonymised as "one large vendor", "a well-known payments API", "a second well-known API", "one payments vendor", "the metrics vendor" where `money-api` name Stripe, Adyen, PayPal outright, so all now named (Stripe, GitHub, Salesforce, Google AIP-158, Prometheus) for consistency and cuz named loser = load-bearing half; "two of the three halves" of logger ban conflated ArchUnit two public rules with per-repo raw-logger predicate, now stated without count; three directives lacked date or confidence marker (*the ban list is an executable test class*, *no offset parameter in the contract*, ban-list group), all now carrying one; and prior-art references — internal decision record + deep-research result of another repository — were consumer-facing pointers at unpublished material, now stated as such in all three `evidence.md` files = caching review finding applied to provenance note not claim.

**Left standing deliberately.** Three-way split + its non-dormancy third ground; no rule ids; naming PostgreSQL, jOOQ, Flyway, squawk, springdoc, vacuum, oasdiff, Schemathesis, Logback, Log4j 2, reload4j, Micrometer, Prometheus, promtool, JaCoCo, HikariCP, ArchUnit, Error Prone, NullAway, JSpecify, Jackson, Testcontainers in what are stack skills by construction; carrying source own inconsistent use of *confirmed* not re-grading it, with inconsistency stated; ban list group-level marker.

### The second review, 2026-07-30

Run straight after first, against same sources. **Structure re-verified by script and held**: 67 directive headings totalling seed 67 bullets, each carry check + marker + date except six ban-list entries group-level marker cover; 115 of seed 116 directive-region tokens present, one absentee = concatenated method list whose parts each named; no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`, no prior-art document named, every link `SKILL.md` ↔ `evidence.md` inside own dir, thirteen skills existing then listed by `npm run check`. **Five findings generalise, first three = one finding wearing three faces:**

- **De-naming defect have second home, and first review check could not see it.** That check extracted identifier tokens from **seed directive region** and caught twelve hedges. Run same extraction over `raw/java-backend.md` §4 — *evidence* source — surface **23 more, every one in an `evidence.md`**: `Byte Buddy`, `LogbackMDCAdapter`, `BasicMDCAdapter`, `ContextPropagatingTaskDecorator`, `spring.task.execution.propagate-context`, `Slf4jThreadLocalAccessor`, `ContextSnapshot`, `MDC.setContextMap(null)`, `CommonStructuredLogFormat`, `@JsonCreator`, Jackson `required`, idempotency draft full name, Fowler Optimistic Offline Lock, JPA `@Version`, springdoc issue numbers. **Check was right and its input region too narrow** — previous session recorded mechanical form as finding worth keeping, and form worth keeping; run it over every source region skill draw from, not only paste text.
- **Do-not-cite entry whose subject anonymised cannot be obeyed, worse than no entry** — tell reader trap exist and withhold which thing = trap. Four shipped: "Cite the order-flag issue, not the earlier unrelated one" (#1362 versus #857), "Cite the fix version and the commit" (LOGBACK-624, 1.1.5, `aa7d584`), "Cite the repository" (`micrometer-metrics/context-propagation`), and — sharpest — "its two open or closed issues **named above**", which name neither, in sentence claiming they named. **Async-handoff review rule: claim to have verified is itself claim to check; this add that claim to have *named* is too.**
- **Tool seed name dropped in exactly two places seed name it, and inserted in two places seed leave it generic.** `vacuum` host all five OpenAPI lints; seed name it for offset-parameter + temporal-naming rules and say only "a lint" / "an OpenAPI lint" for problem-schema + `PATCH` rules. Conversion inverted all four, and wiring step, named gap, re-open trigger hedged it as "the lint host" besides. **First review sweep passed cuz string present somewhere in file. Presence not placement — token check must be per-directive, not per-file**, one respect in which mechanical form recorded above insufficient as recorded.
- **Eighth instance of counting failure, first where skill count contradict own `evidence.md` *and* source.** `java-backend-observability` said "**Seven** of the directives below are convention"; six are, seventh item = *claim* inside directive whose tool split primary-source verified. Own `evidence.md` list six and so do `raw/java-backend.md` §4. Now stated by name with no count, mixed directive called out separately with instruction to read marker beside each half. **New lesson: count can be wrong by silently promoting claim to directive**, which no id or marker sweep see cuz both halves correctly marked where they sit.
- **"*confirmed* means N things and the date tells you which" gloss = enumeration, and decay like one.** `java-backend-rules` mapped **2026-07-24** + **2026-07-25** and omitted **2026-07-21**, which also ran three-vote panel — so reader holding one 2026-07-21 *confirmed* in file (nullness) told nothing by sentence written to tell them. Now every date appearing in file mapped, including 2026-07-27 (whose panelled claim belong to sibling skill) + 2026-06-11..14 (carrying no *confirmed* at all, stated so absence no read as omission). **Marker-gloss finding from `llm-default-traps` review arriving through date axis not definition axis.**

Rest, no generalise: `java-backend-rules` called fan-out context capture "the one rule in that skill's area with an adversarial panel behind it" while `java-backend-observability` say **twice** panel produced **two** rules there — ninth instance of counting failure, second time this exact cross-reference needed narrowing; "Concurrency is the strongest group in **this skill set**" = superlative in disguise twice over (nullness panelled too, and "this skill set" read as all thirteen), now stated as fact with ranking dropped; "**Four** more corpus defaults are rejected elsewhere" counted sentences not defaults, count gone; "**one of them** is an ArchUnit ban that reuses the same host" where six are; dormancy split claimed "**every** lint" while enumerating four of five — omitting problem-schema lint own wiring step list — and two lists now cross-reference each other with explicit tie-breaker (**when same set must be enumerated twice, say which copy authoritative**), plus two directives sitting in neither list now named as sitting in neither and why; WebFlux ban said "the one-concurrency-model ground it rests on is the confirmed part" when no pass examined that argument, now stated as nothing about ban being confirmed; "two markers were corrected **downward-to-upward**" garbled *enforcement* correction (bespoke → off-the-shelf) into confidence one, now stated as enforcement change with "nothing about their confidence changed"; and *the closed page catalog*, carried verbatim from source re-open trigger, = consumer-facing pointer at construct **no directive in skill establish** — now kept with that said = caching review finding applied to trigger not claim.

**Still unbuilt, unchanged.** No check enforce any of this; both sweeps run from scratch script, and neither widened token extraction nor per-directive placement check exist in repo.

## The method skills

Authored 2026-07-30, last of six, one pass. Four files:

```
skills/tech-decision-research/  SKILL.md  evidence.md   15 directives, no ids
skills/enforceable-rules/       SKILL.md  evidence.md   13 directives, no ids
```

**Two corpus-derived conversions, last rows of table in *Where skills live*.** Both listed by `npm run check`. Drawn from `raw/research-protocol.md` §1–4 + §6 (`tech-decision-research`) and from `raw/README.md` *Markers*, *Authoring a pack*, one Anatomy item plus `raw/research-protocol.md` §5 (`enforceable-rules`).

**First skills in set whose subject process not code**, and first drawn from material carrying **no frontmatter, no confidence marker on any claim, no date.** Both facts drove most of what follow.

### The split, which the table decided and authoring confirmed

`tech-decision-research` fire when agent **deciding** something; `enforceable-rules` fire when it **writing decision down as rule.** Different moments = *what is the agent doing* test. Interlock run both ways — research protocol §5 say write rule set, and authoring bar need confidence markers research produce — so back-edge pair like `money` ↔ `money-api`, both shipped together.

**Marker vocabularies split three ways, which table no assign.** `raw/README.md` define all three sets and `raw/research-protocol.md` §3 redefine confidence four. Write-once forced call:

- **Confidence** — *confirmed* / *primary-source verified* / *convention* / *uncertain* → `tech-decision-research`. **Output of research method**, and refutation votes promoting one live there.
- **Enforcement** — *off-the-shelf* / *bespoke* / *convention* → and **status tier** → `enforceable-rules`. Both properties of **rule check**.
- Each skill name other set, say where defined, **state plainly what repo installing only one of them no get.** Money + caching precedent for vocabulary neither own alone.

### What these two decided that no predecessor did

1. **No dates on any directive, no date invented — first conversion where nothing to inherit.** Every previous family took dates from research pass, using pass date where directive gave none. **These sources have no pass.** So each skill state **conversion date, 2026-07-30, once**, labelled as conversion date and explicitly not verification date. Use it per directive would manufacture verification that never happened.
2. **Lapse rule stated as vacuous not omitted.** Neither source have `review-by`, so none invented — and rule would do nothing anyway, cuz it demote *confirmed* to *convention* and **nothing here above convention.** Both skills say so, both say what it cost: nothing make their age visible. **Every other skill in set have `review-by`, so silence would read as omission.**
3. **Markers derived by applying method to itself.** `raw/` own rule — claim backed by neither execution nor primary source = *convention* — land method recorded by person who ran it at convention. Whole derivation, and why both marker tables have three rows and six rows not one per directive.
4. **`P-1` … `P-8` dropped, sharpest id call in repo.** Source assign those ids *precisely so citation survive reordering*, conversion reverse it. Three grounds, recorded in `enforceable-rules/evidence.md`: nothing installed carry `raw/README.md`, so number = pointer into text reader lack; other skills already refer to these principles in prose, so ship ids would create asymmetry caching family settled against (**resolve for one install, dangle for other**); and **transferable half survive** — each principle get stable *name* as `###` heading, and shipped rule = *cite by stable anchor, never by list position*, what never-renumber rule actually for. Cost stated: name can be paraphrased, number cannot.
5. **Check for process directive = written artifact whose absence visible**, and both skills say so instead of hedging tool name. Produce one genuine contradiction in set, **stated not glossed**: `enforceable-rules` publish *machine-enforced or it is not a rule*, and by that standard **nothing in `tech-decision-research` is a rule.** Resolution = scope distinction — that principle govern rules binding code, and decision happen before there code to check — plus honest limit: **these checks catch omission and cannot catch lie.** Frame document written after candidates chosen pass every one of them.
6. **`tech-decision-research` have no `## Wiring the gates` section — first in set — and absence deliberate.** `enforceable-rules` have one, holding **two** things in either source genuinely mechanisable: evidence-order check + dangling-pointer check. Both **bespoke and unbuilt**, which that skill state as named gap not plan — reader told to build something author no have.
7. **Two checks *added*, not converted, marked as additions in directive text, marker table, `evidence.md`.** One place these skills author not convert; ground for allowing = source own pattern: two of its three ship checks exist cuz shipped rule set failed them. **Enumeration check** (state contents by name, not by count) rest on failure this file recorded **ten** times. **Token-placement check** (extract identifier-shaped tokens from every source region; require each per directive, not per file) = mechanical form Java-backend reviews recorded twice and nobody built. Case against recorded too: every other skill convert, so reader trusting these cuz rest of set = conversion get something with different provenance.
8. **Tripwire + dormancy rule carried although table no assign it.** `raw/README.md` Anatomy item 2 + adoption step 4 hold it — *dormant, not inapplicable*; delete when capability absent **by design**, keep when merely absent **so far**; delete dormant group remove tripwire. About how rule set *written* not about paste mechanism, and **every family in this set had to decide it** (`M-29`, `C-16`, `E-28`, and dormancy cut producing `async-handoff-shapes` + Java-backend three-way split). Two sentences in *The shape of a rule*.
9. **Three of five incompleteness checks have worked case published in this skill set**, making this first method material in repo grounded in repo own output not unpublished passes. All four citations verified in defining file before written: **predicate** check → `money-storage` "none of which imports a client library" predicate, plus `async-handoff` any-shape predicate surviving 2026-07-29 threshold withdrawal; **composite-shape** check → `money-storage` shape table + five shapes now published as `async-handoff-shapes` plus two bans in `async-handoff`; **layer** check → `money-storage` ban on arithmetic in store query language, shipping its runtime-SQL blind spot beside it.

### The publish sweep, which resolved six sentences in five skills

**`tech-decision-research` publish protocol five published skills refer to as unnamed material**, and sweep found it: `async-handoff/SKILL.md` ("both fell short of the protocol they were written under"), `async-handoff-java/SKILL.md` ("did not finish the protocol"), `caching/evidence.md` (downgrade rule making all sixteen directives convention), and **three** sentences in `java-backend-observability/evidence.md` about panel + three-vote refutation. All six now name skill.

**Wholesale naming correct here and `llm-default-traps` lesson still applied** — each sentence checked against what new skill actually publish, and all six about votes, panels or downgrade rule, every one of which it carry. `caching/evidence.md` gained stronger statement: that skill **name caching rule set as its worked case for downgrade**, so interlock two-way, and marker = rule applied without flinching not shortfall.

**One unrelated pre-existing defect fixed in passing**, called out so no read as part of sweep: `money/evidence.md` `M-5` note said "Prior research in **this corpus** carries silent catches as a standing defect class" — consumer-facing pointer at unpublished material = caching review finding, still uncorrected there. Now marked as not published in this skill set.

### The review, 2026-07-30

Run straight after authoring, against `raw/research-protocol.md`, `raw/README.md`, thirteen previously published skills. **Structure checked by script and held**: 15 and 13 directives each carry `*Check:` line with enforcement marker; no `P-n`, no `B-n`, no `DECISIONS.md`, no `ci/check_packs.py`, no `.specify`, no `speckit`, no reference into `raw/`; only links `SKILL.md` ↔ `evidence.md` in each dir; fifteen skills listed by `npm run check`. **Three findings, first two ones to carry:**

- **Tenth instance of counting failure created by publishing skill that publish check against it.** `tech-decision-research/evidence.md` grounded its claim about set marker vocabulary in four tallies of other files contents — *primary-source verified* in 17 files, *uncertain* in 4, *production-confirmed* in 1. **Publishing these two skills changed all four within hour**, cuz both files use vocabulary they were counting: 19, 8, 4. Counts correct when measured, correct when written, false on arrival. Replaced by grep itself, and instance now worked case inside `enforceable-rules` enumeration check. **New half of lesson: count of another document contents can be invalidated by act of publishing document that state it** — no sweep of *other* files would catch this one, cuz decay self-inflicted. Also forced check to state one honest exception: **where count *is* evidence, state it with date taken and call it re-runnable check, so its decay = point not defect.**
- **Cross-family citation false, and running check on own source caught second defect in author own work.** `enforceable-rules/evidence.md` claimed "the money skills record that the obvious layer-shaped name was rejected" — that rejection recorded **in this file and in no skill**, so claim about contents that no exist. Dropped; predicate half, which *is* in `money-storage`, kept. Separately, **running token-placement check over `raw/` own tokens** found `verified` + `review-by` de-named as "the verification date and the expiry date" in `enforceable-rules` while `tech-decision-research` and every other skill name them literally — de-naming defect, found by check same file was publishing.
- Counts re-derived and fixed not trusted: "thirteen rule sets written against this bar" (they skills not rule sets, and number move — now "every other skill in this set"); "six of their sixteen directives are type design" in `caching` (replaced by naming two of them, in source own wording — expiry constructible only at catalog registration, factory accepting no free-text parameter); "three of the nine were superlatives" (replaced by naming three false superlatives); "every one of their sixteen directives" for `caching` (correct, but "every one of their directives" cannot decay).

**Left standing deliberately.** No rule ids, including `P-n` reversal; contradiction with *machine-enforced or it is not a rule*, stated not resolved away; `tech-decision-research` having no wiring section; two added checks, marked as additions; and two skills unusual marker tables — three and six rows not one per directive — cuz marker = property of whole material not each claim.

### The second review, 2026-07-30

Run straight after first, against `raw/research-protocol.md`, `raw/README.md`, thirteen previously published skills. **Structure held again and re-checked by script**: 15 and 13 `###` directives each carry `*Check:` line with enforcement marker; no `P-n`, no `B-n`, no `DECISIONS.md`, no `ci/check_packs.py`, no `.specify`, no `speckit`, no reference into `raw/`; only links `SKILL.md` ↔ `evidence.md` in each dir; fifteen skills listed by `npm run check`. **Content defects fixed in all four files, plus two in async-handoff family. Five findings generalise:**

- **Publisher of check not exempt from it, and nothing in repo assumed otherwise until it happened.** Two skills publishing enumeration check failed it throughout, hours after shipping it: `tech-decision-research` told reader sibling carry **three** incompleteness checks where it carry five (in both files); both evidence files named **five** frontmatter fields and called them six; `enforceable-rules` counted "the other twelve skills in this set" where there fourteen; and its own false-green ground counted **three** independent instances of defect that is two. **Cross-document count at worst between back-edge pair published in one pass** — no publish boundary between them to trigger sweep, so count written once and never re-read from other side.
- **Fix recorded in this file never made in file it name, worse than sixth instance which at least reached one copy.** First review recorded finding `verified` + `review-by` de-named in `enforceable-rules`; de-naming still there, untouched, in sentence note describe. Same review recorded replacing `caching` "sixteen directives" — done in `tech-decision-research/evidence.md`, left standing in its `SKILL.md`. **Note in `CLAUDE.md` = evidence defect was seen, never that it was fixed**; only check = file.
- **Worked case counting instances must check for double-counting one defect seen from two sides.** False-green clause claimed three independent instances; erasure trap = one defect recorded twice — `llm-default-traps` ban ArchUnit as host for "never log this type" rule, and `caching` refuse same host for value-round-trip check **citing that same shipment**. Two instances not three, and corrected version stronger argument: second occurrence stopped only cuz first written down.
- **Follow-the-pointer reach across families, and pointer false.** `async-handoff/evidence.md` said false-green contract tool "is named in `async-handoff-java`"; that skill describe it by ecosystem, plugin parameters, repository state and **print no name**, while claiming it "names it so nobody wires it". Both sentences corrected not invent name pass never recorded, and `enforceable-rules` now state product not citable by name from anywhere in this skill set.
- **Vocabulary one skill own leak into section where other define its own.** *production-confirmed* — **status tier**, owned by `enforceable-rules` — listed inside `tech-decision-research` definition of four **confidence** markers, in both files, as though fifth value nothing reached. Split of three vocabularies = this pair own decision, making it pair most likely to break it.

Rest, no generalise: status-tier gloss read "decided and in use" in both skills, asserting production use definition deny — now "researched and decided, with no production use yet" in both, with usage stated separately; two false superlatives, *the weakest-marked skill in the set* (`enforceable-rules` marked identically) and *the first skill in this set with no wiring section* (six neutral skills have none, for opposite reason), second of which **this file wrote first and skill copied**; `tech-decision-research` said its source carry no dates "beyond two" where `raw/research-protocol.md` carry one, and `enforceable-rules` said neither of its source two dates attach to directive it carry — **2026-07-28 do**, being amendment that added accounting walk + no-ids rule, now recorded as amendment date and still not used to date directive; decision-owner directive offered "a named delegate" where source own value ***delegated*** and every published pass write it that way; ArchUnit + Error Prone restored to *off-the-shelf* definition, which had reduced source two named examples to "an architecture test, a compiler check" — de-naming defect inside definition of marker requiring named tool; "one skill adds a fifth value, **recorded**" now name `llm-default-traps`; and do-not-cite entry warned against citing marker counts same file already replaced with grep.

**Enumeration check own text rewritten to survive this.** Its instance count now **dated floor** — ten as of 2026-07-30 — under exception it already state for count that *is* evidence, and new instances stated **by name not added to total**. Its superlative list gained two found here. **Nothing about this verified by check**; both reviews = scratch scripts plus reading.

### Still open for these two

- **No outcome measurement for either.** Nobody compared decision made under `tech-decision-research` against one made without it, and no rule cut by premise-specificity test recorded, so that test discriminating power unmeasured. Both stated as *uncertain* not caveats. **First two skills in set whose central claim marked uncertain.**
- **Refuter independence asserted, not enforced.** Three fresh contexts of **same model** share one training corpus, so where corpus hold wrong consensus votes reproduce it three times. `tech-decision-research` state this as failure mode it least protected against; mitigation = prefer primary source, and second model family = structural fix.
- **Eight principles never tested by exclusion.** No rule serving none of them recorded, so nothing establish eight enough.
- **Two mechanisable checks described and unbuilt** — including here. `enforceable-rules` tell reader wire evidence-order check + dangling-pointer check, and **this repo run neither over own skills.** Same gap this file recorded after every family, now stated inside published skill where consumer can see it. **Narrowed by second review: not unbuilt in general** — `raw/research-protocol.md` §5 record both implemented as one script (`ci/check_packs.py`, dangling reference here), so skill gap now say reader told to rebuild something that exist and cannot be obtained, not something nobody written.
- **`raw/research-protocol.md` + `raw/README.md` gain no row, hit no rule conflict.** Neither have instantiation table, so nothing to write into `raw/` and nothing to decide — same clean case as two packs. **Conflict still stand for `money-grade.md` §3 + `event-broker-discipline.md` §3, and now only decision Milestone 1 left open.**

## The whole-project review, 2026-07-31

First review whose unit = repository not family, run day after Milestone 1 closed. **Every structural invariant this file claim re-checked by script and all hold**: 95 directive ids (`M-1` … `M-43`, `C-1` … `C-16`, `E-1` … `E-36`) each defined exactly once as `**id — ` directive and each carry check kind + marker + date; every `M-n`, `C-n`, `E-n` reference resolving to defined id; every id keyed in matching `-java` skill with none missing; no `P-n`, no `B-n`, no `DECISIONS.md`, no `ci/check_packs.py`, no `.specify`, no `speckit`, no reference into `raw/`; every relative link resolving inside own skill dir; fifteen skills listed by `npm run check`, matching `ls skills/`.

**Token-placement check finally run as check not described**, over all four `raw/` source regions against converted skills. Close to clean — seed identifier tokens present, and handful of absentees = corpus filenames, example type name, detail conversion dropped deliberately (concatenated jOOQ method list whose parts each named, three *retired* Kafka Streams drop-metric names superseded by `dropped-records` metric evidence do carry). **That check now pass = finding**: Java-backend reviews twelve + twenty-three hits real and fixed, nothing re-hedged since.

**Three defects found and fixed, in three files.** Two generalise:

- **Eleventh instance of counting failure, first found by diffing count against *same claim in sibling skill*.** `caching/SKILL.md` *What to do when this skill fires* called catalog "machinery **four** other rules read". `C-15` itself name five readers, and `caching-java` `C-15` entry name same five. So count contradicted two enumerations, one 300 lines below it in own file. Now name `C-7`, `C-8`, `C-10`, `C-13`, `C-14` and state no number. **Mechanical form worth keeping and cheap: for every sentence carrying number word and two or more backticked ids, compare number against ids.** Twenty-line script over all thirty files; surfaced this one and produced only range-notation noise otherwise. Note what it does *not* catch — sibling `async-handoff` sentence ("machinery eleven other rules read") correct and pass for same reason caching one failed: check need ids beside count, and count with no ids beside it still invisible.
- **Pointer can be false against file it sit in.** `async-handoff-java/shapes.md` said three rules worded around Java fact "and all three are in this file", then named third as `E-32` + `E-33` **in `SKILL.md`** three words later. Two failures in one sentence: self-contradicting placement claim, and count of three over four rules cuz one item = pair. Previous reviews follow-the-pointer finding always about pointer into *another* skill; this one refuted by own parenthesis. Now stated by name with no count and with split said plainly.

Third no generalise but largest: **`README.md` still described four-skill repository.** Listed only money family, said "`npm run check` lists four skills as of 2026-07-30", summarised set as forty-three rules. Eleven skills shipped after it written and nothing swept it, cuz every publish sweep this file record was sweep of *skills* for sentences about other skills — repository own front page never in set. All fifteen now in its table, grouped by family, and **count sentence gone**: it say compare `npm run check` against `ls skills/`, what this file already tell agent to do. **General lesson: `README.md` = consumer-facing file carrying claims about skills, so inside publish-obliges-a-sweep rule and never treated that way.**

**What this review no find, stated so silence no read as coverage.** No cross-family citation verified by re-reading every cited rule in defining file — sample checked (`E-26` reader list, `M-17` scope, float ban five layers, `C-9`/`E-5` post-commit collision, contract-tool non-naming, `@KafkaListener` meta-annotation pointer) all held. Marker prose, superlatives, evidence-row provenance spot-checked not swept. **And conversion invariants still enforced by nothing**: this review, like eight before it, = scratch scripts plus reading, and not one of them live in repo.

## The `raw/` corpus — the model to preserve

Read `raw/README.md` first; authority on corpus own rules. Structure that take several files to see:

**Three kinds of file, dir = split.**

| Kind | Adopted? | Files |
| ---- | -------- | ----- |
| Stack pack | yes — its seed file is pasted | `raw/java-backend.md` |
| Cross-stack pack | yes — its seed file is pasted | `raw/agent-traps.md` |
| Cross-stack source | **no — has no seed file, nobody adopts it** | everything in `raw/rule-sources/` |

**Pack** = evidence file: when it apply, tripwires, rejected alternatives named by name, dated evidence notes, re-open triggers. **Seed file** (`raw/seed/<pack-id>.md`) = paste unit — directives only, no title, no evidence, no commentary — so adoption = "copy whole file". **Source** hold portable directives under stable ids (`M-n` money-grade, `C-n` cache-discipline, `E-n` event-broker-discipline) and never pasted; each stack pack **instantiate** every one of its rules with that stack named check, or name gap with reason, or record platform divergence in source instantiation table. Silence about source rule read as coverage = defect.

**Frontmatter only authority** for `status`, `holds-when`, `verified`, `review-by`. `raw/index.md` Shipped table = single deliberate mirror of dates; `raw/README.md` roster carry none, cuz date copied into three files go stale in two. No add fourth copy.

**Markers, per claim and per rule.** Confidence: *confirmed* (survived three independent refutation votes against primary sources) / *primary-source verified* (one researcher, no panel) / *convention* / *uncertain*. Enforcement: *off-the-shelf* / *bespoke* / *convention*. Status tier: *production-confirmed* / *decided, not yet validated* / *deferred — evidence-driven*. **Lapse rule**: past `review-by`, every *confirmed* marker read as *convention* until new pass re-date it — no maintainer action needed.

**Authoring bar** = `raw/README.md` design principles `P-1` … `P-8` (ids never renumbered, cited by id) plus premise-specificity test: rule earn its place only when "no human reads the code" change its stakes — failure it prevent turn invisible-forever or unbounded. `raw/research-protocol.md` = method (§1–4, §6 apply to any decision at this bar; §5 = pack-specific ship checks, including B-13 predicate, B-15 composite-shape, B-16 layer checks). `raw/index.md` carry *Audits owed* backlog for those three — **empty cell there = check nobody ran, not clean file.** **All converted as of 2026-07-30**: §1–4 + §6 into `tech-decision-research`, and principles, premise test, §5 three checks into `enforceable-rules`, which name them by source own names since `B-n` ids cannot ship. Audits-owed backlog stay here — bookkeeping.

**Every pack shared premise** (`holds-when`): code written by LLM agents and no human read it line by line. Rules conditioned on it; verdicts portable exactly as far as their premises.

### File map

| File | Lines | Role |
| ---- | ----- | ---- |
| `raw/README.md` | 343 | how packs work, anatomy, markers, adoption procedure, `P-1` … `P-8`, governance |
| `raw/index.md` | 320 | shipped-date mirror, audits-owed backlog, candidate sources, harvest map, sunset |
| `raw/research-protocol.md` | 189 | the evidence bar and the ship checks |
| `raw/agent-traps.md` | 81 | cross-stack pack — corpus defaults banned by name |
| `raw/seed/agent-traps.md` | 53 | its paste text (any-stack group + Java-family group) |
| `raw/java-backend.md` | 1835 | stack pack — Java, Spring Boot MVC, jOOQ, PostgreSQL; §4 is the evidence trail, grouped by seed section |
| `raw/seed/java-backend.md` | 1757 | its paste text; sections Platform … Event broker discipline |
| `raw/rule-sources/money-grade.md` | 889 | source, `M-1` … `M-43` |
| `raw/rule-sources/cache-discipline.md` | 734 | source, `C-1` … `C-16`; every directive is *convention* |
| `raw/rule-sources/event-broker-discipline.md` | 2533 | source, `E-1` … `E-36`; every directive is *convention*, and its pass was short of the three refutation votes |

## Invariants when converting `raw/` into skills

These = corpus own rules, and conversion = where they break quietly.

- **Rule ship with named check + enforcement marker, or not rule** (`P-1`). Never restate directive without parenthesised check.
- **Dates + markers travel with claim.** Drop *convention* marker promote design argument to verified fact; drop date disable lapse rule.
- **Directive text + evidence stay separate.** Seed text = instinct-override payload for scarce context window; evidence = for human deciding whether to trust it. Progressive disclosure map onto this directly — but Java seed text alone 1757 lines, so single always-loaded `SKILL.md` body cannot hold it.
- **Rule ids + links back into this corpus never appear in text consumer paste into own repo.** Reason = dangling pointers: repo holding no copy of corpus cannot resolve cited id or relative link. **Narrowed 2026-07-30 for installed skills.** Id resolving inside skill dir consumer installed not dangling, so money skills ship `M-1` … `M-43` (*The money skill family*, decision 2) — `money-java` cite them and `money/`, `money-api/`, `money-storage/` on same disk. No extend to `P-n` or `DECISIONS.md` `B-n`: nothing installed carry copy of `raw/README.md`, and `DECISIONS.md` not in repo at all. Relative link into `raw/` never leave either, installed or pasted.
  **Tested + upheld 2026-07-30 by one conversion that could overturn it.** `enforceable-rules` publish eight design principles themselves, so installed skill now *do* carry them — removing narrowing stated ground. **Ids still stayed out**, on two grounds narrowing no anticipate: other skills already refer to those principles in prose, so ship ids would make one resolve for reader who installed `enforceable-rules` and dangle for one who no; and stable `###` heading name carry whole point of never-renumbering. **So rule for `P-n` now absolute not contingent** — see *The method skills*, decision 4. `B-n` unchanged and unreachable.
- **Name corpus favourite and why it lost** (`P-6`). "Use X" no override agent instinct; "the default is Y, rejected because Z" do. That sentence most important line in pack — no compress it away.
- **Duplication between stack packs deliberate**; source instantiation table only thing between it and drift.
- Directive shape in seed text: **bold directive**, then reasoning, then check in parentheses with its enforcement marker.

**Two of these invariants narrowed by last conversion; narrowings ones to know** (2026-07-30, *The method skills*):

- **"Dates and markers travel with the claim" assume source have date.** `raw/research-protocol.md` + `raw/README.md` carry no frontmatter, no marker, no date at all. Rule hold by being applied honestly not literally: **no date invented**, conversion date stated once and labelled as such, markers derived by applying `raw/` own downgrade rule to material — landing every directive in both skills at *convention*. **Invent per-directive date would be exact failure this invariant exist to prevent, in reverse.**
- **"A rule ships with its named check, or it is not a rule" about rules that bind code.** Both method skills directives bind *process*, and their check = written artifact whose absence visible. Contradiction stated inside skills not hidden by hedged tool names, and one place converted skill declare `raw/` principle no reach it.

Where converted skills live and what one skill is: *Where skills live*. Two questions about shape of directive in skill open per skill, listed at end of that section. **Every authored skill set now answered both, `raw/` fully converted, nothing in it left to raise either question again** — see *The money skill family*, *The caching skill family*, *The asynchronous-handoff skill family*, *The `llm-default-traps` skill*, *The Java-backend skill family*, *The method skills*. Three cross-stack families answered identically. Both pack-derived sets answered second question same way and first differently, cuz neither neutral/stack pair: each name tool beside check kind in same file, `llm-default-traps` as one skill and Java-backend family as three cut by what agent doing. Two corpus-derived skills answered first in third way — **most of their directives can have no gate at all** — and second as everything else did.

## Dangling references in `raw/`

Cited but absent from this repo. No send agent looking for them, no resolve citation by guessing:

- `DECISIONS.md` — cited by id throughout (**B-3, B-8, B-10, B-11, B-13, B-14, B-15, B-16**). These ids carry reasons behind corpus structure and cannot resolve here.
- `ci/check_packs.py`, `bundle-checks.yml` — machine checks.
- `../../../CLAUDE.md`, `../../../reference/open-questions.md`, `GOVERNANCE.md`, `docs/BREAKING-CHANGES.md` — bundle-root files.
- `.specify/memory/constitution.md`, `spec.md`, `plan.md`, `speckit.plan` / `speckit.nc.review` commands, nc-ears preset — consuming repo machinery, what pack text written to land in.
- **Paths in prose stale**: `raw/README.md` + `raw/index.md` still say `packs/*.md` and `packs/rule-sources/` for what now `raw/` and `raw/rule-sources/`.