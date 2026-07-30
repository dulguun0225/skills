# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A skills repository: it publishes the engineering-decision corpus in `raw/` as
Agent Skills, installed with Vercel's `skills` CLI (skills.sh) and **not listed
in the public skills.sh directory**.

State as of 2026-07-30: there is no build, lint, or test tooling beyond the
discovery check. What exists is the project setup (node and the `skills` CLI
pinned, LF enforced repo-wide, commands as npm scripts — see *Commands*), the
decided skill decomposition and layout (*Where skills live*), and **three
authored families plus one standalone skill — every cross-stack source in
`raw/rule-sources/` is now converted, and the first *pack* has been converted
too**:

- **The money family, authored 2026-07-30 in two phases** — `skills/money/`,
  `skills/money-api/`, `skills/money-storage/` and `skills/money-java/`
  (`SKILL.md` + `api.md` + `storage.md`), all 43 directives `M-1` … `M-43`
  defined exactly once. What authoring decided that the spec left open is
  *Phase 1, as shipped* and *Phase 2, as shipped*.
- **The caching family, authored 2026-07-30 after it** — `skills/caching/`
  (`SKILL.md` + `evidence.md`) and `skills/caching-java/` (`SKILL.md`), all 16
  directives `C-1` … `C-16` defined exactly once. See *The caching skill
  family*.
- **The asynchronous-handoff family, authored 2026-07-30 after that** —
  `skills/async-handoff/` (`SKILL.md` + `evidence.md`),
  `skills/async-handoff-shapes/` (`SKILL.md` + `evidence.md`) and
  `skills/async-handoff-java/` (`SKILL.md` + `shapes.md`), all 36 directives
  `E-1` … `E-36` defined exactly once. See *The asynchronous-handoff skill
  family*.
- **`llm-default-traps`, authored 2026-07-30 last** — `skills/llm-default-traps/`
  (`SKILL.md` + `evidence.md`), nine directives, **no rule ids**. The first
  pack-derived skill and the first single-skill conversion, and it is now the
  **owner of record for the jqwik version pin** that three stack skills name. See
  *The `llm-default-traps` skill*.

All ten are discovered by `npm run check`. **Milestone 1 is to turn the content
of `raw/` into skills**; the three cross-stack sources and one of the two packs
are done, and the remaining unwritten rows of the table in *Where skills live*
are one pack-derived (`java-backend-rules`) and two corpus-derived
(`tech-decision-research`, `enforceable-rules`).

**`raw/` is raw data — input material, never output.** It holds source text
imported from elsewhere, to be read and converted; nothing in it is a published
skill and no consumer installs from it. Its contents are edited only to correct
an import, not to author with; conversion writes new files elsewhere and leaves
the raw text as the record of what was imported. Expect more material to be
dropped in there later.

Today's `raw/` is a lifted subtree — it was the `packs/` directory of a larger
spec-driven-development bundle (nc-ears preset over spec-kit). Its internal
relative links resolve here; everything pointing outside it does not (see
*Dangling references* below).

**Converting a source does not retire its raw text, and the money family is the
worked case.** Deleting the money material from `raw/` was considered on
2026-07-30, after the money skills were audited, and rejected — not only on the
never-author-in-`raw/` rule above, but because none of it is unreferenced:

- `raw/rule-sources/money-grade.md` is cited **eight times from the other two
  sources**. `cache-discipline.md` and `event-broker-discipline.md` each name
  money-grade §2's **fourteen check kinds as the copy of record** — §2 says so
  itself, and says a fifteenth entry would have to be added in three files or
  drift in two — and they cite `M-17`, `M-5`'s re-open trigger and the float ban
  besides. Deleting the file would either dangle those or force the kind list to
  be copied into a sibling, which is the duplication §2 exists to prevent.

  **The premise of that bullet decayed the same day and the conclusion did not.**
  It said "the two sources nobody has converted yet"; both were converted on
  2026-07-30, so no source in `raw/rule-sources/` is unconverted now. The
  citations are unchanged, `raw/` is still the record of what was imported, and
  authoring in it is still forbidden — so nothing may be deleted. **Recorded
  because it is the third instance of the same failure this repo keeps finding: a
  sentence that counts or enumerates decays silently and has no id to grep for.**
- The Java money text does not lift out cleanly. The `java-backend-rules` row in
  *Where skills live* is defined as `raw/seed/java-backend.md` **excluding lines
  442–744**, so cutting those lines moves the anchor; and §4's general
  `API contract` and `Observability` evidence is shared — `M-15` … `M-19` and
  `M-20` … `M-22` rest on it beside non-money rules.

The general rule this settles: **`raw/` shrinks only when a file has no inbound
citation from unconverted material, which is not the case for anything money
today.**

## Commands

Setting up a fresh machine is [README.md](README.md), *Setup on a new machine* —
`mise trust`, `mise install`, `npm ci`, in that order. There is no build, lint, or
test command. The two that exist wrap the distribution CLI, pinned in
`package-lock.json`:

```bash
npm run check                 # list the skills the CLI discovers here — the discovery check
npm run try -- <name>         # run one skill from the working tree without installing it
```

`npm run check` is the only self-check that exists: it answers whether a skill is
in a discoverable location with valid frontmatter. Anything it does not list is
invisible to every consumer. Since 2026-07-30 it lists ten — `async-handoff`,
`async-handoff-java`, `async-handoff-shapes`, `caching`, `caching-java`,
`llm-default-traps`, `money`, `money-api`, `money-storage`, `money-java`. It says
nothing about resource files: `evidence.md`, `api.md`, `storage.md` and
`shapes.md` are unlisted and unchecked, so a broken relative link inside a skill
passes it.

**It caught a real defect on 2026-07-30, and it is the only thing that would
have.** `llm-default-traps` was written with a `: ` — colon then space — inside
its unquoted `description`, which YAML parses as a nested mapping rather than a
string, so the file was **not a skill at all** and the check listed nine. Nothing
about the file looks wrong when read. **Run `npm run check` after writing or
editing any frontmatter, and treat a missing name as a frontmatter syntax error
before looking anywhere else** — the descriptions here are long prose and a colon
is easy to write.
**`npm ci` must have run first** — `npm run check` shells out to the pinned CLI
in `node_modules`, and on a machine where it has not, the script fails with
`'skills' is not recognized` rather than reporting zero skills.

Two more CLI commands are not wrapped, because each is a one-off:
`npx skills init <name>` scaffolds `<name>/SKILL.md` at the repo root, so anything
it makes is moved under `skills/`; `npx skills add <owner>/<repo> -a claude-code
-y` is how a consumer installs from here.

Two checks the corpus text refers to are **not in this repo**:
`ci/check_packs.py` (fails the build on mis-grouped evidence subheadings and on
rule ids or links appearing in seed text) and the `bundle-checks.yml` freshness
step (warns when `review-by` has passed). If those gates are wanted here, they
have to be written.

## Distribution constraints (skills.sh)

Verified against `vercel-labs/skills` README on 2026-07-30.

- **Discovery layout.** Skill containers are walked one level deep for the flat
  layout `skills/<name>/SKILL.md`, and one extra level for the catalog layout
  `skills/<category>/<name>/SKILL.md`. A `SKILL.md` at the shallower level
  shadows anything nested below it. `skills/`, `skills/.curated/`,
  `skills/.experimental/`, `skills/.system/` and `.claude/skills/` are all
  scanned; a root `SKILL.md` makes the repo one skill. Recursive search happens
  only when nothing is found in a standard location — do not rely on it.
- **Frontmatter.** `name` (lowercase, hyphens) and `description` are required;
  a file missing either is not a skill. `allowed-tools` is broadly supported;
  `context: fork` is Claude Code only, so it cannot be load-bearing for a skill
  meant to work anywhere.
- **Unlisted, two separate mechanisms.** Absence from the skills.sh directory
  keeps a skill unlisted while `npx skills add <owner>/<repo>` (or a full git
  URL, or a direct tree path) still installs it. `metadata.internal: true` goes
  further: the CLI hides the skill from its own discovery, including `--list`,
  unless `INSTALL_INTERNAL_SKILLS=1` is set. Choose deliberately — the second
  one hides the skill from us too.
- Spec: [agentskills.io](https://agentskills.io).

## Where skills live

Decided 2026-07-30. **One skill per topic, flat: `skills/<name>/SKILL.md`.**
Resource files sit inside the skill's own directory. The catalog level
(`skills/<category>/<name>/`) is available if the set ever outgrows a flat list;
it is unused, and moving to it later changes installed paths.

**A topic is what an agent is doing when it needs the rules.** It is not how
`raw/` files its material, and the decomposition does not inherit that filing or
its vocabulary — `raw/` is mined for content only. The consequence worth stating:
the language-neutral rule sets are skills in their own right rather than resource
files inside the Java skill, because the money rules have to be reachable from a
repo that is not Java, and the caching rules should load only when something is
about to be cached.

| Skill | Content drawn from |
| ----- | ------------------ |
| `java-backend-rules` | `raw/seed/java-backend.md` **excluding lines 442–744**, split by area; evidence and dates from `raw/java-backend.md` §4. Those lines are the money sections and belong to `money-java` |
| `llm-default-traps` | `raw/seed/agent-traps.md`; evidence from `raw/agent-traps.md` §3 |
| `money`, `money-api`, `money-storage`, `money-java` | `raw/rule-sources/money-grade.md` and `raw/seed/java-backend.md` lines 442–744 — the per-skill split and the evidence map are in *The money skill family* below |
| `caching`, `caching-java` | `raw/rule-sources/cache-discipline.md` and `raw/seed/java-backend.md` lines 745–935; Java evidence from `raw/java-backend.md` §4 under `Cache discipline`. The split is in *The caching skill family* below |
| `async-handoff`, `async-handoff-shapes`, `async-handoff-java` | `raw/rule-sources/event-broker-discipline.md` and `raw/seed/java-backend.md` lines 937–1757; Java evidence from `raw/java-backend.md` §4 under `Event broker discipline`. The split is in *The asynchronous-handoff skill family* below |
| `tech-decision-research` | `raw/research-protocol.md` §1–4, §6 |
| `enforceable-rules` | `raw/README.md`'s design principles and premise-specificity test; the portable checks in `raw/research-protocol.md` §5 |

**What becomes no skill**, recorded so its absence is not read as an oversight:

- Corpus bookkeeping — `raw/index.md`'s roster, audits-owed backlog, harvest map,
  candidate list and sunset clock, and `raw/README.md`'s governance. These
  maintain the corpus; they are not a capability anyone installs.
- The six-step adoption procedure in `raw/README.md` and everything around
  `.specify/memory/constitution.md`. That machinery is not in this repo, and its
  files are dangling references here.

**`raw/` stays exactly where it is**, unchanged, as the record of what was
imported. Skills are new files under `skills/`.

**A skill directory is the whole world its consumer has.** Every link in a skill
resolves inside that directory or is an absolute URL. Where a skill carries text
verbatim from `raw/`, the copy is byte-identical and a diff is the gate; where it
is rewritten, it is rewritten wholesale — no half-copies, which a diff cannot
check and a reader cannot trust.

**Two questions are open per skill, not once for the set.** They are decided as
each skill is authored, and the answer is recorded with that skill — a directive
set of nine dependency picks and one of 149 platform rules have no reason to
answer either the same way:

- Whether a directive ships with the *kind* of check it needs and the tool left to
  the adopting repo, or appears only where a tool can be named. This decides how
  much of the money skills, `caching` and `async-handoff` exists outside
  `java-backend-rules`.
- Whether the skill instructs the agent directly, or its job is to write a rules
  file the consumer repo commits.

**Both are answered for the money family and for the caching family**
(2026-07-30 — *The money skill family* and *The caching skill family* below), and
**both families answered them the same way**. First question: the directive ships
with its check *kind* in a language-neutral skill, and the tool is named in a
per-stack skill, so each directive's text exists exactly once. Second question:
the skill instructs the agent, and the stack skill additionally carries a one-time
section that wires the build gates in.

**All three cross-stack families answered identically, and the third confirmed it
rather than merely inheriting it** (2026-07-30 — *The asynchronous-handoff skill
family*). What settles it is the shape all three share: a portable directive set
whose enforcement is per stack. **The rule is now closed for cross-stack sources,
because there is no fourth one.** A skill drawn from a *pack* rather than a
source — `java-backend-rules`, `llm-default-traps` — has no such split to make and
is not covered by this. **`llm-default-traps` confirmed that on authoring**
(2026-07-30): it shipped as one skill naming both the check kind and the tool in
one file, and *The `llm-default-traps` skill* records the two grounds beyond this
one.

### Where `llm-default-traps` stands

**Authored 2026-07-30, last of the four — this subsection is superseded by *The
`llm-default-traps` skill* below**, which is the record. What it used to hold was
a plan: that the skill instructs the agent directly, that no directive in it is
check-kind-only, and three open questions carried with a recommendation each.
**All three recommendations were accepted on authoring, none overturned** — the
five JVM-only directives stayed in this skill as a group conditioned on JVM
repos, each directive carries its marker and date inline with evidence one hop
away, and the name `llm-default-traps` was kept. The reasons are in the new
section; do not re-derive them from here.

## The money skill family

Decided 2026-07-30 in one interview pass. This is the authoring spec, and it
supersedes the single `money-values` row the table above used to carry.
**Both phases are written (2026-07-30) — see *Phase 1, as shipped* and *Phase 2,
as shipped* at the end of this section for what authoring settled and what it
left standing.**

### The set

```
skills/money/          SKILL.md  evidence.md             M-1…M-9, M-20…M-29     19
skills/money-api/      SKILL.md  evidence.md             M-12…M-19               8
skills/money-storage/  SKILL.md  evidence.md             M-10, M-11, M-30…M-43  16
skills/money-java/     SKILL.md  api.md  storage.md      no directives of its own
```

Forty-three directives, each in exactly one place. A Java repo installs all four,
and `money-java/SKILL.md` says so on its first line, because every check in it is
keyed to an id that lives in one of the other three.

### The ten decisions

1. **Write-once.** The neutral skill carries the directive, the rejected default,
   and the *kind* of check. The stack skill names the tool and adds only what is
   stack-shaped. No directive's text exists twice, so there is no diff to run and
   nothing to drift. **This is the one place the skills depart from `raw/`**, where
   duplication between stack packs is deliberate — and that only holds because a
   seed file is *pasted* into a repo holding no copy of the corpus, so the paste
   has to be whole. An installed skill is not pasted.
2. **Shipped skills cite `M-n`.** See the narrowed invariant under *Invariants when
   converting `raw/` into skills* above.
3. **A stack skill is a whole stack, not a language.** `money-java` is Java +
   Spring Boot MVC + jOOQ + PostgreSQL, matching `raw/java-backend.md`. There is
   **no `money-sql`**: the storage checks weld an engine fact to an ecosystem tool
   and do not separate. The `NaN` `CHECK` is a PostgreSQL fact asserted by a schema
   lint over committed **Flyway** migrations; over-scale rejection is a PostgreSQL
   behaviour asserted by an integration test against a real engine in a **throwaway
   container**; the query-arithmetic ban is half PostgreSQL and half the **jOOQ**
   trap. `squawk` is the one clean separation, and one case does not carry an axis.
4. **Three neutral skills**, cut on the extra conditions `money-grade.md` §1 itself
   states. Observability is **not** cut out: its condition — nobody watches the
   running system between incidents — is the corpus's own premise, so it is always
   on and stays in the core.
5. **One stack skill per stack**, bulky parts in reference files inside its own
   directory. Adding `money-go` adds one directory and edits nothing. Rejected:
   folding stacks into the neutral skills as `java.md`, `go.md`, `python.md`, which
   would make every new stack edit all three neutral skills and ship every consumer
   every other stack's checks.
6. **Instruct the agent, plus a one-time gate setup.** These directives are two
   kinds welded together — instinct-overrides that fire at authoring time, and
   build gates that have to exist in the repo. Instructing an agent does nothing
   for the second kind: the gate is what catches the *next* agent. So each stack
   skill carries a `## Wiring the gates` section, run once, which also records what
   was wired and what was skipped with the reason. The neutral skills have no such
   section — they are the only place no tool can be named.
7. **Marker and date inline on every directive**; evidence one hop away in the
   skill's own `evidence.md` (source quotes, the do-not-cite list, re-open
   triggers). The lapse rule is the reason: past `review-by` **2027-01-21** every
   *confirmed* marker reads as *convention* with no maintainer action, which only
   works if the reader can see the date beside the claim.
8. **Every ban carries four things inline** — its ground, the org fact it rests on,
   that no panel argued the other side, and the condition that reopens it. This
   binds the two bans in `money-storage`'s composite-shape table.
9. **Names**: `money`, `money-api`, `money-storage`, `money-java`. `money-values`
   retired. `monetary-value` rejected — the name is not the trigger, the
   description is, and the content is not only values (columns, payload fields,
   alert rules, migrations, CI gates). `money-persistence` rejected because in a
   Java shop it reads as the persistence layer, the exact scoping `money-grade.md`
   §1 calls fatal: these rules must reach a hand-written query, a view definition,
   a migration and a support script, **none of which import a client library**.
10. **Phase 1 is `money` + `money-api` + `money-java` (`SKILL.md` + `api.md`).**
    Phase 2 is `money-storage` + `money-java/storage.md`. The order is forced by
    the citation graph below: no phase ships an id pointing at an unwritten skill.

### The split, and where each part's evidence lives

| Directives | Skill | Directive text | Evidence trail |
| ---------- | ----- | -------------- | -------------- |
| M-1 … M-9 | `money` | `money-grade.md` §2, *Money* and *Rounding* | `java-backend.md` §4 under `Money-grade rules`, same subsection names |
| M-20 … M-22 | `money` | §2, *Observability* | `java-backend.md` §4, the **general** `Observability` heading — not under `Money-grade rules` |
| M-23 … M-29 | `money` | §2, *Evidence gates* | `java-backend.md` §4 under `Money-grade rules` |
| M-12 … M-14 | `money-api` | §2, *Wire* | `java-backend.md` §4 under `Money-grade rules` → `Wire` |
| M-15 … M-19 | `money-api` | §2, *API contract* | `java-backend.md` §4, the **general** `API contract` heading |
| M-10, M-11 | `money-storage` | §2, *Storage* | `java-backend.md` §4 under `Money-grade rules` → `Storage` |
| M-30 … M-43, composite shapes | `money-storage` | §2, *Persistence* and *Composite shapes a repo assembles out of stored money* | `money-grade.md` §4, *The Persistence pass — 2026-07-29* — the only money trail that lives in the source itself |

The Java checks come from `raw/seed/java-backend.md`. Line numbers are against the
file as imported; the `####` headings are the durable anchors.

| Seed subsection | Lines | Lands in |
| --------------- | ----- | -------- |
| preamble, `Money`, `Rounding` | 442–496 | `money-java/SKILL.md` |
| `Observability (money-grade)`, `Evidence gates for money` | 698–744 | `money-java/SKILL.md` |
| `Wire`, `API contract (money-grade)` | 646–697 | `money-java/api.md` |
| `Storage`, `Persistence` | 497–645 | `money-java/storage.md` |

### What every money `SKILL.md` carries

- **The premise, stated.** *Code is written by LLM agents and no human reads it
  line by line; a feature carries an amount of money the system computes with.*
  Without it these read as generic engineering advice and get argued with — a
  verdict is portable exactly as far as its premise.
- **The rejected default, by name** (`P-6`). "Use a money type" does not override
  an agent's instinct. "The default is a raw decimal or a float, rejected because
  no check can tell which one holds an amount" does. Binary floating-point is the
  corpus default by a wide margin and is banned at three separate layers because it
  re-enters at each one.
- **Named blind spots, still named.** M-35's lint cannot reach query text assembled
  at runtime from fragments. That sentence ships, because a green lint otherwise
  reads as coverage.
- **The check kind with its enforcement marker**, never a bare directive (`P-1`).

**M-29 changes meaning and the change is deliberate.** In `raw/` it arms the
tripwire: the rules sit in a repo's constitution before any money field exists, and
the plan introducing the first money feature cites them. A skill is not pasted, so
the always-loaded **description** is the tripwire instead — arguably stronger, since
it fires without anyone remembering to re-read a constitution. M-29 therefore ships
as an obligation to record the decision in the plan, not as the arming mechanism.
Write the descriptions accordingly: they must match the moment an agent is about to
add a field, a column, a payload, or a computation that holds an amount.

### The citation graph — what fixes the phase order

`M-n` citations are load-bearing under decisions 1 and 2, so a phase that ships a
citation to an unwritten skill ships a dangling pointer.

- **Inside `money-api`:** M-15 extends M-12; M-16 sharpens M-13.
- **Inside `money`:** M-21 makes M-5 observable; M-22 covers M-28's invariants.
- **Inside `money-storage`:** M-31 sharpens M-10; M-36 is the one exception to
  M-35; M-42's ground is M-30's rounding evidence; M-43 completes M-10.
- **`money-api` → `money`:** M-19 extends M-26.
- **`money` → `money-api`:** M-26 names M-19 as the money cases it must cover.
  **This is the one back-edge, and it is why the two ship together.**
- **`money-storage` → `money-api`:** M-37 is M-16 in the read direction; M-39 is
  M-18 at the store, on the same version column; M-40 needs the idempotency record
  M-17 requires.
- **`money-storage` → `money`:** M-30 reintroduces what M-7 bans and M-1 rejects;
  M-32 cites the class M-5 exists for; M-35 is M-2 over query text; M-40 needs
  M-20's event; M-41 needs M-25's worked example.
- **Out of this family:** two rows of the composite-shape table hand off to the
  `caching` and `async-handoff` skills — a cached amount is a copy no column
  constraint reaches, and M-40 names the outbox seam. Those citations resolve only
  if those skills exist; until they do, the rows say the verdict is owned elsewhere
  and name the seam, which is what the source does. **The caching row was resolved
  on 2026-07-30** when `caching` was authored (*The caching skill family*); it now
  names the published skill and tells the reader to install it. **The outbox row
  was resolved later the same day** when `async-handoff` was authored (*The
  asynchronous-handoff skill family*): it now names `E-21` for the payload and
  `E-5` for the outbox row, and `M-40`'s recorded residue — "this rule depends on a
  second rule set agreeing" — is discharged, because `E-5` requires exactly what
  `M-40` assumes. **Both out-of-family rows now resolve to installed skills.**

So the dependency runs **storage → api → core**, with one back-edge core → api.

### Distribution

`metadata.internal` stays **unset**. Absence from the skills.sh directory already
keeps these unlisted; setting `internal` would hide them from `npx skills --list`,
which is what `npm run check` — the only self-check in this repo — depends on.

### Carried forward, undecided

- **What a repo on an uninstantiated stack receives.** Deferred on 2026-07-30. A Go
  or Python repo would install the neutral skills and get 43 directives whose
  checks are named only by kind, which `P-1` calls a wish. Today every consumer
  installs `money-java`, so the tool is always named. The options considered were:
  state the kind and oblige the repo to name and record its own tool (which would
  make that record the raw material `money-go` is authored from); state the kind
  and stop; or have the neutral skills declare themselves unenforced. **Revisit
  when a second stack is real.**
- **Whether `money-storage`'s two bans survive a panel.** They ship marked as
  decided without one — `money-grade.md` §4 is explicit that the case for each
  banned shape was written by whoever rejected it, which is the failure the
  protocol's panel rule exists to prevent. Running the panel is that source's first
  re-open trigger, and until it runs nothing in M-30 … M-43 may be promoted to
  *confirmed*.
- **`money-grade.md` §3 gains no row.** Its instantiation table tracks stack packs,
  and a skill is not one. Worth a sentence in that file so the absence is not read
  as a missed instantiation — not yet written.

### Phase 1, as shipped

Authored 2026-07-30. Six files, all three skills listed by `npm run check`:

```
skills/money/          SKILL.md  evidence.md    M-1…M-9, M-20…M-29
skills/money-api/      SKILL.md  evidence.md    M-12…M-19
skills/money-java/     SKILL.md  api.md         the Java checks, keyed to those ids
```

`money-java/SKILL.md` opens by saying to install it with `money` and `money-api`
— **three, not the spec's four**, until phase 2 exists.

**Rewritten wholesale, not carried verbatim.** No skill file holds a
byte-identical copy of any `raw/` text, so the diff gate in *Where skills live*
does not apply to phase 1 and there is nothing to diff. The reason is that a
half-copy was never available: `money-grade.md` §2's directive text carries
corpus vocabulary that means nothing to a consumer ("a stack pack states it
once"), and each skill adds the premise, the rejected default, and instructions
to the agent around every directive.

**Markers, as they actually landed.** `money-grade.md` §2 gives each directive a
check *kind* plus a *confidence* marker; the enforcement marker
(off-the-shelf / bespoke / convention) exists only where a tool is named. So the
neutral skills carry **kind + confidence marker + date**, and `money-java`
carries **tool + enforcement marker**. Read the bullet "the check kind with its
enforcement marker" in *What every money `SKILL.md` carries* that way — the
enforcement marker cannot be in a file that names no tool.

**Every directive got a date, and where the source gave none the pass date was
used** — 2026-07-21 for the founding pass, 2026-07-25 for the two scoped
additions passes (M-3, M-5, M-15 … M-19, M-26), 2026-07-27 for observability
(M-20 … M-22). Those dates are inherited, not invented; decision 7's lapse rule
needs a date beside every claim, and an undated *convention* marker would have
disabled it.

**Java evidence is inline, because the spec gives `money-java` no
`evidence.md`.** Both `SKILL.md` and `api.md` end with a dated claim table, a
do-not-cite list, and the review-by date. The money-library evaluation
(Joda-Money, Moneta, the thin-wrapper runner-up) sits in `money-java/SKILL.md`
under *The Java library decision*, per `money-grade.md` §4's rule that
stack-specific evidence stays with the stack.

**The one phase-order leak the citation graph missed — closed by phase 2.**
M-2's check cites the M-10 schema lint for the float-column half of its ban, and
M-10 was phase 2, so phase 1 shipped that half as a named blind spot with **no
id**. Phase 2 replaced it with the citation and rewrote the four places that said
the store side was missing: `money/SKILL.md` (*What is here and what is not*, and
M-2's clause), `money-api/SKILL.md` (*What is here and what is elsewhere*), and
`money-java/SKILL.md` (the *Named gap* paragraph and M-2's entry). Recorded
because the citation graph in this spec did not predict it: **a check's own text
can cite across the phase boundary even when no directive does.**

**One contradiction was carried by phase 1 and decided by phase 2 — as
unreconciled, deliberately.** `raw/java-backend.md` §4 *Storage* says ISO 4217
exponent 4 is CLF-only; its *API contract* note (the 2026-07-25 pass) says
exponent 4 is not CLF-only and names UYW. **Neither skill depends on which is
right**: both notes agree the *maximum* exponent is 4, which is all M-10's
scale-4 clause needs, and M-14 says to read the counterparty's published table
rather than derive an exponent. So both `money-api/evidence.md` and
`money-storage/evidence.md` record both readings, attributed and dated, each with
a re-open trigger, and neither picks one. Picking one would have been authoring a
research finding, which is not what conversion does.

**What phase 1 did not build, and phase 2 did not either.** No check enforces the
conversion invariants: nothing verifies that a skill holds no link into `raw/`,
cites no `P-n` or `B-n`, and keeps every relative link inside its own directory.
That was checked by hand on 2026-07-30 over all four skills and is clean.
`npm run check` does not see resource files at all, so a broken `evidence.md`
link passes it.

### Phase 2, as shipped

Authored 2026-07-30, straight after phase 1. Three files:

```
skills/money-storage/  SKILL.md  evidence.md    M-10, M-11, M-30…M-43 + composite shapes
skills/money-java/     storage.md               the PostgreSQL, jOOQ, Flyway and squawk checks
```

All 43 directives are now defined exactly once across `money`, `money-api` and
`money-storage`, and each has a Java entry in `money-java`. Every cross-skill
citation resolves to an installed skill.

**The neutral skill names the engines, and that is not a departure.** Decision 1
puts the tool in the stack skill, and `money-storage` holds none — squawk, jOOQ,
Flyway, ArchUnit and Testcontainers appear only in `storage.md`. But
`money-grade.md` §2 names PostgreSQL, MySQL and SQL Server **inside its
directives**, because an engine's documented behaviour is the rule's **ground**,
not its enforcement. `money-storage` does the same: the directive stays
engine-neutral ("the store rounds, and it does it quietly"), and the sentence
that proves it names the vendor. A first draft wrote "one engine documents…" and
that was corrected — it left a reader unable to tell whether their own engine was
affected, which is the decision the rule exists to inform.

**The marker ceiling is stated at the top of `SKILL.md`, not only in
`evidence.md`.** This is phase 2's one addition to the shape decision 7 fixed.
The missing panel is a property of the whole 2026-07-29 group rather than of any
one claim, and fourteen rules marked *primary-source verified* read as settled to
anyone who never opens `evidence.md`. So the file opens with the ceiling, the
no-panel fact, and the instruction that **no marker there may be promoted to
confirmed until the panel runs** — least of all the two bans.

**The two bans ship as a four-bullet block each**, not as a prose sentence:
ground, the org fact it rests on, that no independent panel argued the other
side, and the re-open condition. Decision 8 requires all four inline, and four
things in one sentence is where one gets dropped.

**The two out-of-family composite rows say the verdict is owned elsewhere and
name the seam** — a cached amount is a copy no column constraint reaches, and
M-40 names the outbox seam. No link, no id, and both say plainly that those rule
sets are not published in this skill set. That is what the source does, and it is
what the `caching` and `async-handoff` skills will replace. **Both rows were
replaced on 2026-07-30 — the caching one when `caching` was authored and the
outbox one when `async-handoff` was — so this whole note is now history**; see
*The caching skill family* and *The asynchronous-handoff skill family*.

**squawk is the one clean stack separation the spec predicted (decision 3), and
it shipped with its ungated half named.** It flags the `numeric` scale change
off the shelf for the lock; it says nothing about the values already in the
column, so that half is spec-and-review and `storage.md` refuses to describe it
as gated. `storage.md`'s wiring record lists that, M-35's runtime-SQL blind spot,
and M-43 as the three things a repo must record as *not gated* on the first run.

**Still open, and now blocked on a rule conflict.** *`money-grade.md` §3 gains
no row* (above) wants a sentence written into `raw/rule-sources/money-grade.md`
so the absence of a skills row is not read as a missed instantiation. **Writing
it would be authoring in `raw/`, which *What this repo is* forbids** — `raw/` is
edited only to correct an import. Decide which rule wins before touching that
file; the cheap alternative is that this sentence in `CLAUDE.md` is the record
instead.

### The audit, 2026-07-30

All nine files re-read against `money-grade.md`, `raw/seed/java-backend.md`
442–744 and `raw/java-backend.md` §4, straight after phase 2. **The structure
held**: 43 directives defined exactly once, every `M-n` citation resolving to an
installed skill, no `P-n`, no `B-n`, no link out of a skill directory, all four
skills listed by `npm run check`, and every directive carrying its check kind, a
marker and a date. Six content defects were found and fixed, and the two that
generalise are worth carrying:

- **A cross-skill claim can decay in prose that cites no id.** `money/SKILL.md`
  still said the float ban's third layer was "the store rules, absent here"
  inside *The defaults these rules override*, because phase 2 rewrote the four
  places that named the gap and the id-free prose was not one of them. Now
  `money-storage`, `M-10`. The phase-1 note above predicted the reverse case — a
  check's text citing across the boundary — and this is the same leak with no id
  to grep for.
- **A tool the evidence names must be named in the stack skill, not described.**
  `money-java` said "a Schemathesis-class generator" throughout while its own
  *Do not cite* list warned off a "Rust core" claim that is only about
  Schemathesis, and `money-api/evidence.md` promised the oracle tool was "named
  in the stack skill". `P-1` wants the tool; the hedge was a general-gate wording
  from the seed leaking into the money instantiation. Now named, with the
  `[generation] deterministic` / `seed` keys recorded as **4.x-specific**, which
  the raw re-open trigger says and no skill had carried.

The other four:

- **`money/SKILL.md` called the observability condition "this rule set's own
  premise".** `raw/java-backend.md` §4 is explicit that it is a *different*
  premise, stated as its own condition, and `money-grade.md` §1 files it as one
  of three extra conditions. Decision 4 — observability stays in the core skill,
  always on — is unaffected and does not need that claim: the condition now
  stands on its own, with the staffed-rota carve-out kept and the emission rules
  named as code rules.
- **`money-storage/SKILL.md` twice pointed inside itself for a defect that
  happened elsewhere** — "corrected twice elsewhere in this rule set" (the
  library-scoped seam) and "a sibling rule set" (the five unsurfaced composite
  shapes). Both are the caching and asynchronous-handoff rules. Named, so a
  consumer can stop looking for them in the money skills. At the time of the audit
  neither `caching` nor `async-handoff` was published and both sentences said so;
  **both were authored later the same day and both sentences were rewritten in two
  steps** (*The caching skill family* and *The asynchronous-handoff skill family*,
  *The interlocks* in each). The five unsurfaced composite shapes are now
  `async-handoff-shapes` plus the two bans in `async-handoff`, **which does not
  weaken the lesson `money-storage` draws from them**: the defect was that nothing
  in that rule set made the absences visible, and naming gaps rule by rule did not
  help.
- **`money-java`'s jqwik pin now says it is cross-cutting, not a money rule.**
  `raw/java-backend.md` §4 records that the caveat was *moved to the agent-traps
  pack* for exactly that reason. The pin stays in `money-java` — dropping it
  would leave a consumer of only the money skills with no pin at all — but it is
  the **one known overlap with `llm-default-traps`**, and decision 1's write-once
  rule has to be settled between them when that skill is authored. **Since
  2026-07-30 `caching-java` and `async-handoff-java` both name jqwik too**,
  without the pin, so the overlap is three-way — see *Still open for this family*
  under *The caching skill family* and under *The asynchronous-handoff skill
  family*.

**What the audit did not change.** Naming PostgreSQL, MySQL and SQL Server in
`money-storage` (ground, not enforcement — phase 2's note stands); `M-2`'s Java
marker reading "off-the-shelf tool, the predicate authored per repo" where the
seed says plainly "off-the-shelf" (the skill is the more honest of the two);
`M-23`'s *convention* marker, which the source leaves unmarked and
`money-grade.md` §4's own default — silence in the trail means convention —
supplies.

**Still unbuilt, same as after phase 2**: no check enforces any of this. The
audit was a hand pass.

## The caching skill family

Authored 2026-07-30, straight after the money audit, in one pass. Three files:

```
skills/caching/        SKILL.md  evidence.md    C-1 … C-16
skills/caching-java/   SKILL.md                 the Java checks, plus the engine pick
```

Sixteen directives, each defined exactly once in `caching`; every one of them
keyed in `caching-java`. Both listed by `npm run check`.

### What was forced by the money precedent, and needed no re-deriving

- **Two skills, not one.** The table above had one `caching` row; the neutral /
  stack split is the money family's decision 1 and 5, and this source is the same
  shape — portable directives, per-stack enforcement.
- **Both open questions answered as money answered them** (*Where skills live*).
- **`C-16` is `M-29`'s shape.** In `raw/` it arms the tripwire; a skill is not
  pasted, so the **description** is the tripwire and `C-16` ships as the
  obligation to record the decision in the plan.
- **`C-1` … `C-16` ship as ids**, resolving inside installed skills. No `P-n`,
  no `B-n` — every citation of those was rewritten as prose.
- **No `evidence.md` in the stack skill.** Java evidence is inline, ending in a
  dated claim table, a *Do not cite* list, and the review-by date.

### What this family decided that the money spec did not

1. **One neutral skill, not three.** The money family cut three neutral skills on
   the extra conditions its source states. `cache-discipline.md` states one extra
   condition — the repo caches a value it could recompute — plus `C-9`'s
   in-process-and-multi-instance carve-out, and neither is a decomposition axis.
   Sixteen directives fit one `SKILL.md`.
2. **The engine pick is a directive in `caching-java` with no `C-n` id, and the
   stack skill says so on its first screen.** This is the one place a
   `caching-java` entry is not keyed to a neutral id, and it is not an oversight:
   `cache-discipline.md` §1 deliberately keeps the engine pick out of the source
   because its gates do not vary by stack, its right answer varies *within* a
   stack, and it fails the premise-specificity test. All three grounds ship, in
   `caching/evidence.md`. **Contrast `money-java`, where every entry has an id** —
   a reader who assumes that invariant holds everywhere would hunt for a missing
   directive.
3. **The nine-candidate engine survey ships, in `caching/evidence.md`, as
   evidence and not a rule.** It is platform-neutral, which is the source's own
   reason for holding it once; putting it in `caching-java` would make the next
   stack re-run it. `caching-java` carries only its own dated licence, governance
   and managed-pricing record for the engines its pick names.
4. **The fourteen check kinds are not enumerated in any skill.** The source names
   `money-grade.md` §2 as the copy of record for that list, and no money skill
   carries it — the money skills use the kinds inline and nothing broke. So
   `caching` does the same. What does ship is the *reason* the list mattered
   here: `C-13` needs **differential execution**, which no kind names, and it is
   written as *integration test (differential)* with the parenthetical carrying
   the difference. A closed vocabulary list is corpus bookkeeping; the kind for
   the rule in hand is the payload.
5. **`C-6` is worded on unwritability, and its bytecode-impossibility ground is
   not asserted.** The source's own re-open trigger records that the claim is
   challenged and that the auditor hit HTTP 403 on the primary specification. The
   rule holds either way — a factory that cannot take a free-text parameter makes
   the wrong call uncompilable — so `caching` states it that way and
   `caching/evidence.md` records the challenge. **`caching-java` records the
   contradiction between its two sources rather than resolving it**:
   `raw/java-backend.md` §4 lists the `invokedynamic` claim as confirmed, the
   source calls it challenged, both readings ship attributed and dated, and the
   skill states that no rule depends on which is right. That is the same call
   phase 1 of the money family made on the ISO 4217 exponent-4 disagreement.
6. **The three Java tool limits appear in the neutral skill as consequences, not
   as facts.** `C-3`, `C-6` and `C-12` are worded the way they are *because* of
   them, so `caching/evidence.md` states what generalises ("analysis that reads
   compiled output cannot follow a lambda into its body") while the tool, the
   issue number and the confirmed marker stay in `caching-java`.
7. **The org fact ships as the ground for *Start by not caching*.** Eighteen
   three-person teams, one engineer each, no platform or operations role. The
   source requires a pack to say "most repos should run no shared cache" *before*
   stating a rule, so it is a top-level section ahead of the directives, with the
   three-way ranking (no cache / in-process with a short expiry / a server).
8. **The marker ceiling is stated at the top of the markers section and in the
   premise's neighbourhood, the way `money-storage` states its own.** All sixteen
   are *convention*, all dated 2026-07-29, **no production use anywhere** — and
   that is a property of the whole pass, not of any one rule. What the 2026-07-29
   pass confirmed is the *tool* evidence, which is why the confirmed markers all
   sit in `caching-java`.

### The interlocks, and which ones now resolve

- **`caching` → `money`, and it resolves.** `C-5` names `M-17` — the idempotency
  record that must not live in a cache — and `C-10` names the float ban's fourth
  layer. Both money skills are published, so these are the first cross-family
  citations in this repo that point at a real installed skill.
- **`money-storage` was edited, and that was owed.** Its composite-shape table
  row for a cached amount, its *What is here and what is elsewhere* list, and its
  library-scoped-seam paragraph all said the caching rules were "not published in
  this skill set". Three edits, and **only the caching half** — the
  asynchronous-handoff sentences were still true then, and were swept in turn when
  `async-handoff` was authored later the same day. **The general rule: publishing a
  skill obliges a sweep for every sentence in every other skill that says it does
  not exist.** Nothing checks this, and it has now had to be run twice.
- **`caching` → an asynchronous-handoff rule set. ~~Does not resolve.~~ Resolved
  2026-07-30**, when `async-handoff` was authored. `C-9`'s post-commit registration
  is exactly the seam `E-5` confines, so the interlock now names that id from the
  caching side and names `C-9` from the other; both sentences that said the rule
  set was unpublished were rewritten, in `caching/SKILL.md` and `caching-java`, and
  the matching re-open trigger in `caching/evidence.md` is struck through.
  `caching-java` additionally carries the delete-after-commit /
  publish-after-commit contrast, because carrying one verdict over to the other is
  the specific mistake that source text exists to prevent.
- **Cross-family reference style: name the skill, never link to it, and prefer
  the skill name over an id.** A relative link out of a skill directory breaks
  the invariant in *Where skills live* — three were written and removed during
  authoring. And `money-storage`'s new caching sentences name `caching` without
  citing `C-n`, because a money-only consumer has not installed it; an id that
  resolves for one install and dangles for another is worse than a name.

### Still open for this family

- **What a repo on an uninstantiated stack receives** — the same question the
  money family carried forward, and the answer is more urgent here: **six of the
  sixteen directives lean on type design** (no bare write, no atomic primitive,
  registration-only expiry, key-is-the-tuple, immutable value type, a loader
  return that distinguishes absence), which assumes a type system that can make a
  method absent and a constructor mandatory. `caching/evidence.md` states this as
  the first predicted honest gap. **Revisit when a second stack is real**, and
  the answer should match whatever the money family settles.
- **Nothing here may be promoted to *confirmed* without a new research pass**,
  and unlike `money-storage` the blocker is not a missing panel on part of the
  set — it is that every directive is a design argument with **no production use
  anywhere**.
- **The differential gate's cost is unmeasured.** Running the integration suite
  three times triples integration CI time and nobody has run it. One adopting
  repo reporting wall-clock closes it, and it is the one open item that could
  retire a rule rather than re-date it.
- **`C-1`'s hand-rolled-memo field-type rule is unmeasured too** — nobody has
  counted how many legitimate entries its opt-out list needs. `caching-java`
  states that if the number is large, the honest move is to name the gap rather
  than keep the rule.
- **Who owns the jqwik version pin — found by the 2026-07-30 review.** It is a
  cross-cutting dependency rule, not a money or a cache rule, and it is a
  *confirmed* trap. `money-java` carries it as `M-24`; `caching-java` names jqwik
  in `C-6` and `C-10` and states as a named gap that a caching-only install has
  no pin, deliberately without copying the value. **This was the second known
  overlap with `llm-default-traps`; `async-handoff-java` made it the third later
  the same day**, naming jqwik in `E-7` and `E-13` and recording the same gap — so
  three stack skills depend on a pin only one of them states, and all are settled
  when that skill is authored. Whatever it
  decides must not leave a repo installing one family and not the other unpinned.
- **Same as after the money family: no check enforces any conversion
  invariant.** The id-uniqueness, no-`P-n`, no-`B-n`, no-link-out-of-directory
  and no-`raw/`-reference sweep over these three files was run by hand on
  2026-07-30 and is clean. `npm run check` sees neither `evidence.md`.

### The adversarial review, 2026-07-30

All three files re-read against `cache-discipline.md`, `raw/seed/java-backend.md`
745–935 and `raw/java-backend.md` §4 under `Cache discipline`, plus the four
published money skills. **The structure held**: 16 directives defined exactly
once, no `P-n`, no `B-n`, no link out of a skill directory, no reference into
`raw/`, every directive carrying a kind, a marker and a date, and all six skills
listed by `npm run check`. Every content defect found was fixed, in four files —
`caching/SKILL.md`, `caching/evidence.md`, `caching-java/SKILL.md` and
**`money/SKILL.md`**, which is the one nobody expected to touch. **Four findings
generalise and are the ones to carry:**

- **A consumer-facing sentence may not point at "this corpus".** Four sentences
  did — the erasure false-green in `C-10`, the `rebuildable-cache premise`
  collision note in both `caching` files, the withdrawn-ground note in
  `caching/evidence.md`, and `caching-java`'s "this stack already records". Each
  named a fact whose home is unpublished material, so a consumer could not
  resolve it and could not tell it was unresolvable. **The fix is the money-audit
  fix: name the thing and say plainly it is not published in this skill set** —
  and where a published sibling can carry the claim instead, cite the sibling
  (the withdrawn-ground note now points at `caching-java`'s own engine pick,
  which *is* a technology pick enforced by a banned-dependency rule).
- **An interlock's other side must be read, not assumed.** `C-5` said the
  idempotency-record ban was stated by the `money` and `money-storage` skills and
  that "both say the same thing from their side". `M-17` is in **`money-api`**,
  and **no money skill mentions a cache at all** — the source claims "both files
  say so" and that was already untrue of `money-grade.md`. `C-5` now states that
  it carries the ban alone, on the ground that a cache write is in no
  transaction, and `caching/evidence.md` records the false claim so it is not
  reintroduced. **A cross-family citation is a claim about another file's
  contents; verify it there.**
- **A named gap with its subject hidden is not a named gap.** Three places
  anonymised the thing the reader needs in order to know the sentence is about
  them: `C-5`'s "a classic-protocol cache" for **memcached** (whose protocol is
  the clause's *ground* — the same call phase 2 of the money family made for
  PostgreSQL in `money-storage`), and "one major cloud provider" for **Google
  Cloud Memorystore** in two files. All three now name the subject.
- **Publishing a skill obliges the sweep in both directions, and prose that
  counts is where it decays.** The caching publish updated three sentences in
  `money-storage` but missed `money/SKILL.md`'s float-ban bullet, which said the
  ban stands at **three** layers and enumerated them. A cached amount is the
  fourth, which `money-storage` and `C-10` both already said. **An enumeration
  with a count is the highest-risk sentence in a cross-skill claim** — it decays
  silently and has no id to grep for. Fixed; the count is now four and names
  `caching`.

The findings that do not generalise: `caching/SKILL.md` did not state the marker
ceiling anywhere near
the top, so the whole-set *no production use anywhere* fact sat 500 lines below
the first directive — now stated before the premise, the way `money-storage`
states its own, which is what this file already claimed; `caching-java`'s Valkey
directive promised compatibility with "the open-source Redis line", which is now
false-by-omission for Redis 8.x under AGPLv3 and contradicted its own evidence
row (the guarantee is Redis OSS 7.2 and earlier, and RDB files from Redis CE 7.4
and later are *not* compatible); `caching-java` names jqwik in two checks and in
its wiring list but omitted it from the stack line; **its version pin — a
confirmed trap — is carried only by `money-java`'s `M-24`, so a repo installing
the caching skills and not the money skills has no pin**, now stated as a sixth
named gap with the value deliberately not copied (a pin in two skills drifts in
one); and the `EmptyCatch`-defaults-to-`WARNING` fact was asserted in the wiring
step with no evidence row, now carried with its own source and date.

**Left standing deliberately.** `caching/SKILL.md` says "No tool is named here"
and then names seven Java tools in its pointer bullet for `caching-java` — that
bullet says what is named *there*, and stripping it would cost a reader more than
the inconsistency costs. `C-14` keeps the Java seed's "the normal run asserts at
least one", which overlaps `C-13`'s zero-hit assertion; both readings are the same
build artifact and C-14's framing (each configuration proves it took effect)
needs it. `caching-java`'s `C-6` property test asserts key injectivity where
neutral `C-6` states "equal keys imply equal uncached results" — a stack skill
changing *what is asserted* rather than only the tool, which the skill reconciles
inline and the seed requires.

## The asynchronous-handoff skill family

Authored 2026-07-30, straight after the caching family, in one pass. Six files:

```
skills/async-handoff/         SKILL.md  evidence.md   E-1 … E-28, E-32, E-33   30
skills/async-handoff-shapes/  SKILL.md  evidence.md   E-29 … E-31, E-34 … E-36  6
skills/async-handoff-java/    SKILL.md  shapes.md     the Java checks, keyed to those ids
```

Thirty-six directives, each defined exactly once; every one keyed in
`async-handoff-java`. All three listed by `npm run check`. This is the largest
source in `raw/` (2533 lines) and the largest family here.

### What was forced by the two precedents, and needed no re-deriving

- **The neutral / stack split, and both open questions answered as the money and
  caching families answered them** (*Where skills live*). The source is the same
  shape: portable directives, per-stack enforcement.
- **`E-28` is `M-29`'s and `C-16`'s shape** — the **description** is the tripwire,
  and `E-28` ships as the obligation to record the decision in the plan.
- **`E-1` … `E-36` ship as ids**; no `P-n`, no `B-n`, every citation of those
  rewritten as prose.
- **No `evidence.md` in the stack skill.** Java evidence is inline, ending in a
  dated claim table, a *Do not cite* list and the review-by date.
- **The transport pick is a directive in `async-handoff-java` with no `E-n` id**,
  exactly as `caching-java` carries the engine pick, and the stack skill says so on
  its first screen. The source keeps the pick out for the same three grounds.
- **The nine-candidate transport survey ships in `async-handoff/evidence.md`** as
  evidence, because it is platform-neutral.

### What this family decided that neither precedent did

1. **Two neutral skills, cut on the dormancy conditions the source's own
   `holds-when` states.** Thirty-six directives will not fit one always-loaded
   `SKILL.md`, and the source states per-group conditions: a flow across
   transactions (`E-29` … `E-31`), HTTP across the organisation's boundary
   (`E-34`, `E-35`), an oversized payload (`E-36`). Those six became
   `async-handoff-shapes`. **`E-32` and `E-33` stayed in the core skill because
   the source says they are never dormant** — "a ban with a precondition is a ban
   an agent can argue its way past" — which is the same call decision 4 made for
   the money family's observability rules: the condition is always on, so the rule
   stays in the core.
2. **The split is also an evidence-provenance split, and that is the stronger
   reason.** Pass 1 wrote `E-1` … `E-28` and had a hostile audit whose planted
   canary was caught; pass 2 wrote the composite shapes and the two bans with **one
   researcher, no panel, no steelman duel and no hostile audit.** Two files let
   each state its own ceiling honestly, and `async-handoff-shapes/SKILL.md` says
   plainly that its pass is the weakest behind any skill here.
3. **A three-way name split for the stack skill: `SKILL.md` + `shapes.md`, keyed
   to two different neutral skills.** `money-java` and `caching-java` each face one
   neutral family; this stack skill's `shapes.md` is keyed to
   `async-handoff-shapes` while its `SKILL.md` is keyed to `async-handoff`. Each
   file states which.
4. **Transports and engines are named in the neutral skills; frameworks,
   libraries and analysers are not.** This is phase 2 of the money family's rule
   ("an engine's documented behaviour is the rule's *ground*, not its
   enforcement") turned into a usable line. So Kafka's `enable.auto.commit`,
   RabbitMQ's quorum-queue delivery limit, SQS's absent automatic
   acknowledgement, PostgreSQL's `SKIP LOCKED` caveat and Kafka Streams' late-record
   drop are all in `async-handoff`, while Spring's `BATCH` ack default,
   `DefaultErrorHandler`, `@RetryableTopic`, ArchUnit, Error Prone, jOOQ and
   Toxiproxy appear only in `async-handoff-java`.
5. **Anonymised subjects were named, per the caching review's finding.** Where the
   source writes "one widely used queue-shaped broker" or "a managed queue" and
   the Java pack names the product, the neutral skill names it too — because a
   named gap or a named ground whose subject is hidden is one no reader can tell
   applies to them.
6. **The withdrawn thresholds ship as history plus a do-not-reintroduce entry, not
   as a deleted branch.** The source reversed itself the same day it was written:
   a polled table was the recommended default and the broker a conditional
   escalation above three thresholds, all three withdrawn as undecidable at the
   plan gate. `async-handoff/SKILL.md` states the reversal and the three reasons,
   because **"an agent reading a broker-versus-table argument out of its training
   corpus will reconstruct something close to the first threshold."** The excluded
   ninth survey candidate keeps its full row and its steelman for the same reason.
7. **Two claims the source makes about other files were checked before being
   repeated, and one was narrowed.** `E-13`'s source text says a three-way
   interlock is carried by all three rule sets. `M-17` (in `money-api`) requires
   the idempotency record in the money effect's transaction and **mentions neither
   a cache nor a broker**; `C-5` (in `caching`) carries the cache ban. So `E-13`
   ships saying it carries the **broker** half alone and names who carries the
   other two. **This is the caching review's rule applied prospectively: a
   cross-family citation is a claim about another file's contents, so verify it
   there.**
8. **The float ban's layer count moved and the enumerations were swept.** `E-21`
   is the fifth layer, so `money/SKILL.md`'s bullet went from four to five and
   named `async-handoff`. `caching`'s "fourth layer" for a cached copy is still
   correct and was left alone.
9. **`async-handoff/SKILL.md` is 1282 lines, the largest always-loaded body here,
   and splitting the core further was considered and rejected.** The candidate cut
   was producer path / consumer path / shared machinery. It fails because **the
   machinery is shared by both directions**: `E-1`'s seam covers publish and
   subscribe, `E-26`'s catalog is read by eleven directives on both sides, and
   `E-24`'s gate enumerates it — so the cut needs a third skill every repo installs
   anyway. That is the same token cost, plus three descriptions competing to fire
   and more cross-skill citation surface. **The dormancy cut that produced
   `async-handoff-shapes` is the only one the source supports.** Revisit only if
   context cost is measured as a real problem, and record the measurement.

### The interlocks, and which ones now resolve

- **`caching` → `async-handoff`, and it resolves.** `C-9`'s post-commit callback
  is the exact seam `E-5` confines; a general `afterCommit(Runnable)` defeats
  `E-5` entirely. Three sentences in `caching/SKILL.md` and `caching-java` said
  that rule set was not published; all now name it, and one re-open trigger in
  `caching/evidence.md` is struck through as resolved.
- **`money-storage` → `async-handoff`, and `M-40`'s residue is discharged.**
  `M-40` required the durable row a money event will be published from to be in the
  money effect's transaction and recorded a residue: it depended on a second rule
  set agreeing. `E-5` requires exactly that. Six sentences across
  `money-storage/SKILL.md`, `money-storage/evidence.md` and `money/SKILL.md` were
  rewritten.
- **`async-handoff` → `money` and `caching`**, all resolving: `E-13` → `M-17`,
  `M-40`, `C-5`; `E-20` → `M-13` and the `C-11` inversion; `E-21` → `M-2`, `M-10`,
  `M-12`, `C-10`; `E-32` → `M-38`; `E-15` → `C-6`'s challenged ground; `E-10` →
  `M-5` and `C-12`.
- **Cross-family reference style is unchanged: name the skill, never link to it.**
  No relative link leaves any skill directory in the family.

### Still open for this family

- **The panel that neither pass had, and it is two triggers rather than one.**
  Pass 1 owes three refutation votes; pass 2 owes a steelman duel plus a hostile
  audit, **which ranks with the votes rather than below them because two of its
  outputs are bans that remove an option from every future repo.** Nothing may be
  promoted to *confirmed* until both run.
- **What a repo on an uninstantiated stack receives** — the third family to carry
  this, and the largest surface yet: **eleven directives lean on type design**,
  against the caching family's six. Revisit when a second stack is real; the answer
  should match whatever the money and caching families settle.
- **The four-configuration gate's cost is unmeasured, and it is now the most
  expensive gate in this repo's skills** — it quadruples integration CI time
  against a real broker in a container, where the caching gate merely triples it.
  If it is cut, five directives degrade to declarations while the catalog still
  reports green.
- **The cross-repository union check has no host anywhere**, which makes `E-19`
  and `E-26` repo-local hygiene wearing the clothes of a contract. Both skills say
  so. It is the most consequential gap in the family for an eighteen-team
  organisation.
- **The jqwik pin is now a three-way overlap with `llm-default-traps`, not a
  two-way one.** `money-java` carries it as `M-24` at ≤ 1.9.3 with the CI
  version-ceiling check; `caching-java` names jqwik in `C-6` and `C-10` and
  `async-handoff-java` names it in `E-7` and `E-13`, and both record the gap
  **without copying the value**, because a pin in three skills drifts in two. When
  `llm-default-traps` is authored, whatever it decides must not leave a repo
  installing one family and not the others unpinned. All three stack skills now
  point at the same unsettled question.
- **The webhook signing standard has no pick, and the reason is an unverified
  belief.** `E-34` requires one of RFC 9421 or Standard Webhooks to be committed,
  and neither `async-handoff-shapes` nor `async-handoff-java/shapes.md` names a
  winner: the pass never checked what maintained JVM implementations either has,
  and its own re-open trigger ("RFC 9421 gains a maintained implementation on the
  stack") implies a belief it did not verify. **The 2026-07-30 review found the
  neutral skill promising a pick the stack file withholds, and fixed the promise
  rather than inventing the pick.** One implementation survey closes it.
- **`event-broker-discipline.md` §3's instantiation table gains no row, and this
  hits the same rule conflict the money family left open.** A skill is not a stack
  pack, so the absence is correct; writing a sentence into `raw/` to say so would
  be authoring in `raw/`, which *What this repo is* forbids. **Same decision owed
  as for `money-grade.md` §3, and the cheap alternative is the same: this sentence
  in `CLAUDE.md` is the record.**
- **No check enforces any conversion invariant, same as after the money and
  caching families.** The sweep over these six files was run by hand on 2026-07-30
  and is clean: 36 directives defined exactly once, every `E-n` reference resolving
  to a defined id, no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`,
  no relative link leaving a skill directory, every directive carrying a kind, a
  marker and a date, and every cited `M-n` and `C-n` read in the file that defines
  it before being cited. `npm run check` sees none of the four resource files.
  **The last clause of that sentence was not true** — the adversarial review below
  found one cross-family citation naming the wrong rule — and the structural half
  of the sweep is confirmed clean by a second, mechanical pass.

### The adversarial review, 2026-07-30

All six files re-read against `event-broker-discipline.md`, `raw/seed/java-backend.md`
937–1757 and `raw/java-backend.md` §4 under `Event broker discipline`, plus the
four money skills and the two caching skills. **The structure held, and this time
it was checked by script rather than by eye**: 36 directives defined exactly once
and every one carrying a check kind, a *convention* marker and the date; the 36
directive *statements* diffed word-for-word against the source with no clause
dropped (six diffs, all of them punctuation or the deliberate `E-28` removal
below); all 19 of the source's named gaps, residues and weakest-clause notes
carried; no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`, no link
leaving a skill directory; nine skills listed by `npm run check`. Ten content
defects were fixed, in five of the six files. **Five findings generalise:**

- **A marker word inside prose is a claim, and *confirmed* is the one that
  leaks.** Five places used it as ordinary English over material their own tables
  mark *primary-source verified*: `E-2`'s meta-annotation fact, `E-12`'s
  arithmetic, and the "the confirmed material is…" sentences in both
  `async-handoff/SKILL.md` and its `evidence.md`, plus `async-handoff-java`'s
  "all three are confirmed for this stack". **The source does the same in two of
  those places, so the conversion inherited the defect rather than inventing it** —
  which is the case for checking marker words in prose the way a table row is
  checked. And where a claim here genuinely *is* confirmed, a **different family's
  pass** confirmed it: `caching-java` carries the ArchUnit lambda-body and
  catch-body limits and the no-op cache manager as *confirmed*, because the cache
  pass ran the three refutation votes. This pass confirmed nothing, so the
  attribution has to travel with the claim.
- **A count in prose decayed again — twice, both in the newest file, and both
  created by the split itself.** `async-handoff-shapes` said its six directives
  add "seven named gaps of their own" (five are theirs; two belong to the bans that
  shipped in `async-handoff`), and its `evidence.md` said "three of the six lean on
  type design" while listing a construct `E-22` defines in the core skill (two do).
  This is the fourth instance of the failure this file keeps recording. The new
  half of the lesson: **a count is at its most dangerous exactly where a family was
  split, because each half inherits the whole's number and nothing re-derives it.**
- **A cross-family citation naming the wrong id is invisible to every structural
  check.** `async-handoff/evidence.md` cited `C-5` for the swallowing-catch
  residue, where the rule is `C-12` — and cited `C-12` correctly 300 lines later.
  Both ids exist and resolve, so an id sweep passes and only reading the cited rule
  catches it. **The caching review's rule was to verify the other side; this adds
  that the verification cannot be delegated to the id sweep, and that the previous
  session's claim to have done it was itself the thing to check.**
- **A "named in the stack skill" pointer has to be checked against the stack
  skill, in both polarities.** `async-handoff-shapes` said the signing-standard
  pick "is stated in the stack skill"; `shapes.md` deliberately names **no**
  winner, because the pass never checked what maintained implementations either
  standard has. The money audit found this defect as a hedge where the tool should
  have been named; here it arrives inverted — a neutral skill promising a pick the
  stack skill was right to withhold. **Both are the same check: follow the
  pointer.**
- **A claim with no evidence row anywhere is worse in a stack skill than in a
  neutral one**, because the stack skill is where a reader expects a sourced tool
  fact. `async-handoff-java`'s "Kafka share groups move a past-limit record to an
  archived state and route it nowhere" is the only claim in the family with no
  primary source in **either** pass — it exists in the Java seed text alone, and it
  sat one sentence away from the RabbitMQ delivery-limit fact, which is
  primary-source verified. It now carries **not verified — do not cite as
  documented**, and the sentence says which half is sourced.

The five that do not generalise: `E-26` carried none of the second-consumer extra
condition the source states for **both** cross-repository directives, only `E-19`
did (added, with the generated catalog itself explicitly *not* dormant, because
eleven directives read it inside one repo); `E-24`'s kind note said "a fifteenth
is not added", pointing at a fourteen-item vocabulary no consumer can see, and now
matches `caching`'s self-contained wording; `E-13` said neither `M-17` nor `M-40`
"mentions a cache or a broker", which is true of `M-17` and false of `M-40` as
published — `M-40` reaches the broker to require that the row an event is published
from shares the effect's transaction — so it is narrowed to what both actually
constrain, which is *when* the record is written and not *where* it lives;
RabbitMQ's 4.2 support window was written as having "ended 2026-07-31", a future
date in the past tense; `evidence.md` named **Microsoft Azure** where the pass
recorded only "one major provider" plus its retail-prices API, and the name is kept
with the identification marked as an inference drawn during conversion rather than
a vendor name the pass wrote down; and `E-28`'s Java entry used "the Decision Trace
citation line" with no gloss, where `money-java` and `caching-java` both gloss it —
a consuming repo without that spec machinery has no Decision Trace to write in.

**Left standing deliberately.** The 1282-line core skill and the dormancy split
(the rejected producer/consumer/machinery cut is still the right rejection);
naming Kafka, RabbitMQ, SQS, NATS and Kafka Streams in the neutral skills (ground,
not enforcement); `E-28` dropping the source's "in its Decision Trace" from the
neutral text while the stack skill keeps and now glosses it; and the claim that
this family's passes are **worse than the caching family's** — checked against
`cache-discipline.md`'s own frontmatter, which records an evidence panel and a
three-vote refutation the broker pass never ran, so the comparison is exact rather
than rhetorical.

## The `llm-default-traps` skill

Authored 2026-07-30, last of the four, in one pass. Two files:

```
skills/llm-default-traps/  SKILL.md  evidence.md   nine directives, no ids
```

**The first pack-derived skill, the first single-skill conversion, and the first
skill here with no rule ids.** Listed by `npm run check`. Drawn from
`raw/seed/agent-traps.md` (53 lines, nine directives) with evidence from
`raw/agent-traps.md` §3 (five dated notes) and §4 (three re-open triggers).

### What was forced by the three precedents

- **Both open questions from *Where skills live* answered as every family
  answered them**: it instructs the agent directly, and it carries a one-time
  `## Wiring the gates` section, because the gate is what catches the *next*
  agent.
- **Marker and date inline on every directive**, evidence one hop away — sources,
  the do-not-cite list, re-open triggers, and what the skill does not carry.
- **The lapse rule stated with its date** (`review-by` **2027-01-24**), and the
  marker ceiling stated near the top rather than only in `evidence.md`.
- **No `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`, no link
  leaving the skill directory.**
- **The Decision Trace is glossed**, per the asynchronous-handoff review's
  finding that a consuming repo may have no such document.

### What this skill decided that no family did

1. **One skill, no neutral/stack split, and *Where skills live* predicted this
   correctly.** The split rule is closed for cross-stack sources and explicitly
   does not cover a pack. Two further grounds beyond that: the five JVM
   directives are **dependency and tooling picks rather than service-code rules**,
   so they bind a Java library, CLI or batch job as much as a backend — a
   `-java` sibling would carry the wrong condition — and a pack has no source with
   per-stack instantiation to defer a tool to. The JVM group ships as a
   conditioned section, the way the source text already splits it.
2. **No rule ids, and this is the first skill in the set without them.** `raw/`
   assigns ids only to *sources*; a pack has none to inherit, so ids here would
   have to be invented, making this skill the definition of record for a numbering
   `raw/` does not have. The decisive ground is the cross-family reference style
   the caching family settled — **prefer the skill name over an id, because an id
   resolves for a repo that installed the skill and dangles for one that did
   not** — and three stack skills need to point at one rule here. They point by
   skill name plus subject. Each directive gets a `###` heading instead, which is
   the durable anchor an id would have been.
3. **It names both the check kind and the tool, in one file, split by group.** The
   any-stack gates are named by *kind* with the tool left to the ecosystem; the
   JVM gates name maven-enforcer and Error Prone. Every other skill here puts
   those two halves in two skills. There is no second file to put the tool in, and
   inventing one would have been the split rejected in point 1.
4. **The marker ceiling is inverted.** `money-storage` and `caching` open by
   warning that their markers are weaker than they look. Here most claims are
   *confirmed* — three refutation votes against primary sources — which makes this
   the only skill in the set that is not predominantly convention. So the
   top-of-file note says the markers run the *other* way and names the three
   exceptions: the general injection-surface rule is convention with one instance
   behind it, the scanner-compromise record is dated and must be re-verified at
   adoption, and the slopsquatting *threat* is confirmed while the
   lockfile-and-plan-gate *response* is this organisation's convention.
5. **The growth tripwire converts into two obligations rather than one.** The
   source's own tripwire is that a newly found trap is added to the pack with a
   date — its only growth path. An installed skill is not a file the consumer
   edits, so the skill requires the repo to **record the new trap in its own rules
   at the moment it is found** *and* **report it back**, and says plainly that
   nothing automates the second. This is the first tripwire in the set that is a
   maintenance path rather than an arming mechanism, and **the `M-29` / `C-16` /
   `E-28` shape was not needed**: the plan-gate obligation is already a directive
   in the source text ("a new dependency appears in the plan's Decision Trace,
   never silently in a diff"), so it is native here rather than a conversion
   artifact.
6. **"Silence about a trap is not evidence the trap is absent"** ships as a
   top-level statement, not a named gap, because the incompleteness is a property
   of the whole list rather than of any rule in it.

### The jqwik pin — settled, and what the sweep changed

**This skill is now the owner of record.** The corpus's own answer decided it:
`raw/java-backend.md` §4 records that the caveat was *moved to the agent-traps
pack* precisely because it is cross-cutting, and all three stack skills already
said the pin was not their rule. Seven edits across four published files:

- **`money-java/SKILL.md`** — the `M-24` entry, wiring step 4, and the evidence
  table row.
- **`caching-java/SKILL.md`** — the wiring record's skipped-item bullet and named
  gap 6.
- **`async-handoff-java/SKILL.md`** — the wiring record's skipped-item bullet and
  named gap 7.

**The version was removed from `money-java`, and that is the one consequence to
know about.** Before this, a repo installing only the money skills had the pin;
now no stack skill states it, all three name `llm-default-traps` as the owner, and
all three carry the same fallback — if that skill is not installed, the pin is the
repo's own to state and no skill here supplies it. Two grounds. The repo's own
rule, already stated twice by `caching-java` and `async-handoff-java`, is that a
pin stated in *N* skills drifts in *N*−1; and `llm-default-traps` binds **every**
agent-built repo regardless of stack, so it is a baseline rather than an optional
companion. The alternative — leave the value in `money-java` too — is exactly the
two-copy drift those two skills refused to create.

**The constraint this file set** ("whatever it decides must not leave a repo
installing one family and not the others unpinned") **is met by making the install
instruction loud in all three and stating the fallback in all three.** It is not
met for a repo that ignores the instruction — but that outcome is now **symmetric
across the three and stated in each**, where before it was silently true for two
of them and silently false for the third.

**Inside `llm-default-traps` the version appears twice, doing two different
jobs**: the directive states the ceiling, and `evidence.md` states the release
date of the clause-free version, which is *why* that ceiling. The wiring step
deliberately points back at the directive rather than restating the number.

### The interlock that only partly resolved — and the new lesson

Two caching sentences — one in `caching/SKILL.md`, one in `caching-java` — said
the unloggable-domain-type rule belongs to "a platform rule set not published in
this skill set". This skill publishes the **tool ban** (Error Prone, never
ArchUnit) and the erasure ground behind it; the **rule itself** lives in
`raw/seed/java-backend.md`'s Observability section and belongs to
`java-backend-rules`, still unwritten. So both sentences were **narrowed, not
resolved**: they now name `llm-default-traps` as carrying the ban and the ground,
and keep saying the domain-type rule is unpublished.

**The lesson: the publish-obliges-a-sweep rule needs a second step — check what
the new skill actually publishes against what the old sentence actually
claimed.** The three previous publishes replaced such sentences wholesale, and
this is the first where wholesale replacement would have been **false**. The other
two "not published in this skill set" sentences in the caching family are about
telemetry's disposability and the `rebuildable-cache premise` collision; both were
read and correctly left alone.

### Still open for this skill

- **The trap list grows only when someone notices.** Stated as the first named
  gap, and it is not closable.
- **Registry verification has no host** — convention, the agent states it was
  done. It is the first line of defence against the one *confirmed* threat in the
  set and the least enforced rule in it. A green lockfile gate is not registry
  verification, and the skill says so where it would be misread.
- **The injection-surface rule generalises from a single case.** A second
  confirmed instance promotes it from convention and is also the first evidence
  about how often this happens.
- **The any-stack version-ceiling mechanism is named by kind only**, which is the
  uninstantiated-stack question in its mildest form: lockfile gates and action
  pin-checks are off the shelf in every major ecosystem, ceilings are not. A repo
  that finds no off-the-shelf host for one of the three any-stack gates must
  record which — and those records are the raw material a per-ecosystem section
  would be authored from.
- **The jqwik successor evaluation has never been run.** It is a re-open trigger
  carried from 2026-07-21, and **four skills here now depend on the library**, so
  the evaluation is worth more than the version bump.
- **`raw/agent-traps.md` gains no row and needs none, and this conversion is the
  first that does *not* hit the `raw/`-editing conflict** the money and
  asynchronous-handoff families left open. That conflict is about writing a
  sentence into a *source's* instantiation table; a **pack has no such table**, so
  there is nothing to write and nothing to decide. The conflict still stands for
  `money-grade.md` §3 and `event-broker-discipline.md` §3.
- ~~**No adversarial review has been run on this skill.**~~ **Run 2026-07-30 — see
  *The adversarial review* below.** What this bullet used to say still holds as
  background: each of the three families' reviews found content defects in files
  the authoring pass had already called clean, and this skill's did too. **The
  structural sweep was clean at authoring and is clean again after the review**:
  nine directives each carrying a check, an enforcement marker and a date; no
  `P-n`, no `B-n`, no `DECISIONS.md`, no reference into `raw/`; the only two links
  being `SKILL.md` ↔ `evidence.md`; and ten skills listed by `npm run check`.
  **Two counting errors were caught during authoring by re-deriving rather than
  re-reading** — "seven of the nine claims are confirmed" (the confirmed set is
  neither seven nor nine, and the sentence is now stated by exception with no
  count at all) and "the four any-stack gates" against "one of these three" three
  lines later. That was the fifth instance of this failure in this repo, **and the
  review found the sixth: the same "four any-stack gates" phrase, uncorrected, in
  `evidence.md`.**

### The adversarial review, 2026-07-30

Both files re-read against `raw/seed/agent-traps.md`, `raw/agent-traps.md` §1, §3
and §4, `raw/README.md`'s marker and status-tier definitions, and the three stack
skills that point here. **The structure held**: nine directives each carrying a
check kind, an enforcement marker and a date; the nine directive statements diffed
against the seed with no clause dropped; no `P-n`, no `B-n`, no `DECISIONS.md`, no
reference into `raw/`, the only links being `SKILL.md` ↔ `evidence.md`; the
frontmatter still parsing after a description edit and ten skills listed by
`npm run check`. Content defects were fixed in both files — **deliberately not
counted here, since a count is the failure this very review found for the sixth
time.** **Five findings generalise:**

- **Fixing a decayed count in one file does not fix its copy in the sibling, and
  this repo's own record of catching it made that harder to see.** Authoring
  caught "the four any-stack gates" in `SKILL.md` and *this file* recorded the
  catch; the identical phrase sat uncorrected in `evidence.md`, pointing at the
  named gap that says "one of these three". `evidence.md` now **names** them
  instead — the lockfile gate, the pin-check lint, the version-ceiling mechanism —
  and the named gap keeps "one of these three", because there the count sits one
  sentence after the enumeration it counts. **Sixth instance of the counting
  failure, and the first where a fix note in `CLAUDE.md` read as coverage for a
  file the fix never reached.**
- **A cross-family citation carries quantities, and those need the same
  verification the ids get.** Both files said the three stack skills name jqwik
  "as the check for **one** of their own directives". `money-java` names it for
  `M-1`, `M-3`, `M-8` and `M-24`; `caching-java` for `C-6` and `C-10`;
  `async-handoff-java` for `E-7` and `E-13`. Worse, `evidence.md` asserted **"their
  side was read before this was written"** in the same sentence that got the number
  wrong — the async-handoff review's lesson repeating exactly: **a claim to have
  verified is itself a claim to check.**
- **A marker or tier glossed in the author's own words can invert what it
  names.** The status tier read "the enforcement shapes have not been run long
  enough to be production-confirmed", which asserts production use;
  `raw/README.md` defines *decided, not yet validated* as **no production use
  yet**. A gloss must be diffed against the definition, not written from the
  phrase. The same section used **recorded** as a third marker value in its table
  and defined only *confirmed* and *convention* — now defined.
- **A superlative about the other skills is a count in disguise, and it was
  wrong.** The file claimed to be "the only skill in this set that is not
  predominantly convention". `money-storage` is not predominantly convention
  either — roughly half its directives are *primary-source verified* from the
  2026-07-29 persistence pass. The marker inversion is real and worth stating; the
  ranking against nine other files was not checkable and is gone. It also said the
  exceptions are "stated by exception rather than by count" **while counting
  them**.
- **A conditioned group has to be conditioned where the premise is stated.** The
  premise section said the premise "is the whole of the condition — there is no
  second half, which is why this skill applies to every agent-built repo
  regardless of stack", and the JVM group's dormancy condition arrived 115 lines
  later. `raw/agent-traps.md` §1 states both together. A Python repo reading only
  the premise section is told nothing here is stack-conditioned, which is the
  reading the JVM group exists to prevent.

The rest, which do not generalise: gap 2 called registry verification the defence
against "**the** confirmed threat in this set" and "the least enforced rule in it"
— two confirmed threat claims exist and two other gaps are equally unenforced, so
it now names slopsquatting and says plainly that nothing in any build reaches the
verification; `evidence.md` counted "four skills in this set depend on the
library" (three run checks on it, this one pins it — now named, not counted); the
growth-path section opened with "**The source this converts** states its own
growth path", a consumer-facing pointer at unpublished material, which is the
caching review's finding — the growth rule is now stated as this skill's own;
wiring step 3 said the ceiling mechanism has "the jqwik pin **below**" when the
pin is stated above it, and its justification ("the first one is already known")
was false on every non-JVM stack, where the mechanism starts empty; the
description and the JVM heading called all five JVM rules "dependency and tooling
picks" while the skill itself says the `char[]` directive "bans a **claim** rather
than a pick"; two of the five re-open triggers are conversion additions rather
than triggers the pass wrote down, now marked as such; the directive's "it is in
maintenance mode" had no ground of its own — `evidence.md` now says it rests on
the maintainer's *probably*-hedged sentence and that the pin does not; and
`SKILL.md` promised "**Sources** for each" where the jqwik entry names no source
document, now "the ground behind each claim — with its source where the pass named
one".

**Left standing deliberately.** No rule ids (decision 2 holds — three stack skills
cite by skill name plus subject and all three resolve); one skill with no
neutral/stack split; the marker inversion itself, which is the point of the
top-of-file note; naming Trivy, jqwik, `de.jollyday`, JSR-275, JScience,
maven-enforcer and Error Prone; and the source's blanket claim that **every** trap
here is a named corpus favourite, which is loose for the registry-verification and
injection-surface rules — the loser there is a habit rather than a package — but
is the source's own sentence and holds for all nine on the reading that the
rejected default is named inline.

## The `raw/` corpus — the model to preserve

Read `raw/README.md` first; it is the authority on the corpus's own rules. The
structure that takes several files to see:

**Three kinds of file, and the directory is the split.**

| Kind | Adopted? | Files |
| ---- | -------- | ----- |
| Stack pack | yes — its seed file is pasted | `raw/java-backend.md` |
| Cross-stack pack | yes — its seed file is pasted | `raw/agent-traps.md` |
| Cross-stack source | **no — has no seed file, nobody adopts it** | everything in `raw/rule-sources/` |

A **pack** is the evidence file: when it applies, the tripwires, rejected
alternatives named by name, dated evidence notes, re-open triggers. The
**seed file** (`raw/seed/<pack-id>.md`) is the paste unit — directives only, no
title, no evidence, no commentary — so adoption is "copy the whole file". A
**source** holds portable directives under stable ids (`M-n` money-grade, `C-n`
cache-discipline, `E-n` event-broker-discipline) and is never pasted; each stack
pack **instantiates** every one of its rules with that stack's named check, or
names the gap with a reason, or records a platform divergence in the source's
instantiation table. Silence about a source rule reads as coverage and is a
defect.

**Frontmatter is the only authority** for `status`, `holds-when`, `verified`,
`review-by`. `raw/index.md`'s Shipped table is the single deliberate mirror of
the dates; `raw/README.md`'s roster carries none, because a date copied into
three files goes stale in two. Do not add a fourth copy.

**Markers, per claim and per rule.** Confidence: *confirmed* (survived three
independent refutation votes against primary sources) / *primary-source
verified* (one researcher, no panel) / *convention* / *uncertain*. Enforcement:
*off-the-shelf* / *bespoke* / *convention*. Status tier: *production-confirmed*
/ *decided, not yet validated* / *deferred — evidence-driven*. The **lapse
rule**: past `review-by`, every *confirmed* marker reads as *convention* until a
new pass re-dates it — no maintainer action needed.

**The authoring bar** is `raw/README.md`'s design principles `P-1` … `P-8` (ids
never renumbered, cited by id) plus the premise-specificity test: a rule earns
its place only when "no human reads the code" changes its stakes — the failure
it prevents turns invisible-forever or unbounded. `raw/research-protocol.md` is
the method (§1–4, §6 apply to any decision at this bar; §5 is the pack-specific
ship checks, including the B-13 predicate, B-15 composite-shape and B-16 layer
checks). `raw/index.md` carries the *Audits owed* backlog for those three —
**an empty cell there is a check nobody ran, not a clean file.**

**Every pack's shared premise** (`holds-when`): code is written by LLM agents
and no human reads it line by line. Rules are conditioned on it; verdicts are
portable exactly as far as their premises.

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

These are the corpus's own rules, and the conversion is where they break
quietly.

- **A rule ships with its named check and enforcement marker, or it is not a
  rule** (`P-1`). Never restate a directive without the parenthesised check.
- **Dates and markers travel with the claim.** Dropping a *convention* marker
  promotes a design argument to a verified fact; dropping a date disables the
  lapse rule.
- **Directive text and evidence stay separate.** Seed text is instinct-override
  payload for a scarce context window; evidence is for the human deciding
  whether to trust it. Progressive disclosure maps onto this directly — but the
  Java seed text alone is 1757 lines, so a single always-loaded `SKILL.md` body
  cannot hold it.
- **Rule ids and links back into this corpus never appear in text a consumer
  pastes into their own repo.** The reason is dangling pointers: a repo holding no
  copy of this corpus cannot resolve a cited id or a relative link.
  **Narrowed 2026-07-30 for installed skills.** An id that resolves inside a skill
  directory the consumer has installed is not dangling, so the money skills ship
  `M-1` … `M-43` (*The money skill family*, decision 2) — `money-java` cites them
  and `money/`, `money-api/`, `money-storage/` are on the same disk. This does not
  extend to `P-n` or `DECISIONS.md`'s `B-n`: nothing installed carries a copy of
  `raw/README.md`, and `DECISIONS.md` is not in this repo at all. A relative link
  into `raw/` never leaves either, installed or pasted.
- **Name the corpus favourite and why it lost** (`P-6`). "Use X" does not
  override an agent's instinct; "the default is Y, rejected because Z" does.
  That sentence is the most important line in a pack — do not compress it away.
- **Duplication between stack packs is deliberate**; the source's instantiation
  table is the only thing between it and drift.
- Directive shape in seed text: **bold directive**, then the reasoning, then the
  check in parentheses with its enforcement marker.

Where the converted skills live, and what one skill is: *Where skills live*
above. Two questions about the shape of a directive in a skill are open per skill
and are listed at the end of that section. **All four authored skill sets have now
answered both** — see *The money skill family*, *The caching skill family*, *The
asynchronous-handoff skill family* and *The `llm-default-traps` skill*. The three
cross-stack families answered identically; `llm-default-traps` answered the second
question the same way and the first differently, because it is one skill rather
than a neutral/stack pair.

## Dangling references in `raw/`

Cited but absent from this repo. Do not send an agent looking for them, and do
not resolve a citation by guessing:

- `DECISIONS.md` — cited by id throughout (**B-3, B-8, B-10, B-11, B-13, B-14,
  B-15, B-16**). These ids carry the reasons behind the corpus's structure and
  cannot be resolved here.
- `ci/check_packs.py`, `bundle-checks.yml` — the machine checks.
- `../../../CLAUDE.md`, `../../../reference/open-questions.md`, `GOVERNANCE.md`,
  `docs/BREAKING-CHANGES.md` — bundle-root files.
- `.specify/memory/constitution.md`, `spec.md`, `plan.md`, the
  `speckit.plan` / `speckit.nc.review` commands, the nc-ears preset — the
  consuming repo's machinery, which is what pack text is written to land in.
- **Paths in the prose are stale**: `raw/README.md` and `raw/index.md` still say
  `packs/*.md` and `packs/rule-sources/` for what is now `raw/` and
  `raw/rule-sources/`.
