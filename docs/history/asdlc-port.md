# The asdlc port, 2026-09-16 — what the monorepo changed, and what came back

From 2026-08-05 these twenty skills were also held in the sibling repository
`../asdlc`, a monorepo that placed them beside its own lifecycle procedures,
an agent roster and a QA harness. **That repository was abandoned in
September 2026.** This repository had not changed since 2026-08-03, so
everything below is a one-way port: what asdlc did to the skills while it held
them, verified by diffing this tree against asdlc's import commit (`9e1564e`,
byte-identical except one pointer in `enforceable-rules`) and against its
head (`b522461`).

**Nothing here was re-researched.** Every marker, date and probe result was
carried as written; the port's own edits are the pointer rewrites named below.

## What asdlc changed in the skills, in the order it happened

1. **2026-08-05 — the skills shed their edit history** (asdlc `5266030`).
   Every *Narrowed <date>:* chain rewritten to current truth; *earlier draft
   said* notes replaced by the surviving fact or a do-not-reintroduce guard;
   *Added <date> by <check>* section leads normalised to *<check>, run
   <date>*; two enumeration-check instances moved from
   `enforceable-rules/SKILL.md` to its `evidence.md` instead of dying; one bare
   count (*the 8 declared by name*) became a name. Dated ground — measured
   figures, check-run dates, refuted claims — stayed. Sixteen skills touched.
2. **2026-08-11/12 — the redundancy audit and its trim** (asdlc `d61164d`).
   Recorded in full in [skill-redundancy-audit](skill-redundancy-audit.md).
   In the skills: `money` `M-3`/`M-4` compacted to one line and `M-8` demoted
   with its 4/4 probe; `money-storage` `M-31` gained its **binding** probe
   result and the measured bare default (`bigint` minor units) in its
   defaults list, `M-33` demoted; `money-java` `M-9` compacted;
   `caching`'s *start by not caching* ground rewritten to the probe-scoped
   claim; `llm-default-traps` JSR-385 demoted to one line with the
   corpus-outnumbering claim marked refuted; `ai-maintainer-principles` A3
   core and the dependency-risk directive's popularity-metric half trimmed;
   `guardrails-toolchain` five cores trimmed and the baseline ban demoted with
   its 4/4; `primary-keys` five cores trimmed, the renumbering ban kept
   because it bound; `java-backend-rules` clock ban demoted and five
   pro-default rows stamped; `java-backend-api` three temporal and versioning
   rows stamped; `java-backend-observability` the telemetry-not-truth
   directive compacted.
3. **2026-09-01 — `java-backend-rules` gained two directives** (asdlc
   `0363745`, `5225c1e`, `5f19d3b`), written from one observed failure: an
   agent told *JPA banned* scaffolded a greenfield service on Spring Data JDBC,
   a superseded Java LTS and a superseded Spring Boot major. **Spring Data JDBC
   and the `JdbcTemplate` family join the persistence ban on their own
   grounds** — query derivation from method names, reflective row mapping, a
   second idiom beside jOOQ — scoped so Spring Data JDBC stays the named jOOQ
   stewardship exit and may never run beside it; artifact bans for the Spring
   Data starters, a **type ban** on the ArchUnit ban-list class for the
   template family because `spring-jdbc` arrives transitively under the jOOQ
   starter. **The pin is created at the newest supported LTS**: a repo with no
   pin pins the newest Java LTS and newest Boot GA line verified against the
   vendor's release page and dated in the repo; a repo with a pin defers to it;
   no floating versions; one LTS back where a named enforcement host does not
   yet support the newest, with the host recorded. Maven Enforcer is wiring
   item 11 and holds the floor; **named gap 11 states that nothing can gate
   "newest"**. The `CrudRepository.save()` insert-versus-update claim ships
   marked **uncertain** in both files. The description gained *before creating
   a build file or pinning the Java or Spring Boot version for a new repo*.
   Everything from this pass is **convention, no research pass behind it**, and
   the evidence ledger says so row by row.

## What was ported, and what the port itself edited

- **All twenty skill directories, wholesale** — asdlc's files replaced this
  tree's. One edit after the copy: `enforceable-rules` named gap 2 pointed at
  `dulguun0225/asdlc` under `tools/skills-harness/scripts/`; it now names this
  repository under `scripts/`. Its sentence that the gates run under CI became
  true here the same day, below.
- **`scripts/redundancy-probes.mjs` and `scripts/redundancy-cases.json`**,
  the probe runner and its 28 cases, new here as `npm run probes`. Two comment
  paths rewritten to this layout; the runner's root resolution needed no change.
  Probe outputs are ignored by `.gitignore`, as asdlc did.
- **`.github/workflows/skills-checks.yml`** — discovery check plus both gates
  on every push or pull request touching `skills/`, `scripts/` or the package
  files, with the discovery step failing on any `Skipped … SKILL.md` line.
  Rewritten for a root-level harness; first ran green in asdlc 2026-08-05.
  **Consequence recorded in [wired-gates](wired-gates.md): the `review-by`
  freshness step, declined there because nothing ran on a schedule, is
  reopened and on `BACKLOG.md`.**
- **`mise.toml`** lost `uv = "latest"`: nothing here used it, and it was a
  floating pin in a repository whose skills ban floating pins.
- **`README.md`** — the `llm-default-traps` row still offered *choose a
  container base image*, the trigger narrowed out of the description on
  2026-08-03 and missed in the consumer-facing file: the *publish obliges a
  sweep* class again, caught by asdlc's README and carried here. Plus the
  `probes` row and a paragraph on what the one run found.
- **`CLAUDE.md`** — the `probes` command and its finding; the CI sentence; the
  frontmatter figure re-measured; one new recurring defect class (an id a pass
  invents and no file carries); history pointers.

## What was not ported

- The four `asdlc-*` stage skills, the agent roster, the ADRs and everything
  else that was that repository's own. None of it was ever a skill here.
- asdlc's restructured `skills/CLAUDE.md` and `README.md`: rewritten for a
  monorepo whose harness lived two directories up. This repository's files are
  the authority; only the content changes above came across.
- asdlc's edits to the other scripts' comments and root paths — path
  adaptations for its layout, not improvements.
- The first addendum's consumer-map reasoning in the audit note rests on
  asdlc's agent roster. Kept in the ported record as context for why the
  second probe batch ran at sonnet / effort high; nothing here routes by it.

## What this port costs, and what is unmeasured

| Measure | Before (2026-08-03) | After (2026-09-16) |
| ------- | ------------------- | ------------------ |
| Frontmatter, all twenty skills, `npm run tokens:frontmatter` | 4,406 | 4,434 |
| `java-backend-rules` body, `npm run tokens` | 9,193 (asdlc's pre-trim figure, 2026-08-12) | 10,641 — the two new directives, wiring item 11 and named gap 11 |

The only description that changed is `java-backend-rules`, which grew by the
scaffolding trigger. **Its firing rate is unmeasured** — no case in
`firing-cases.json` uses a bare fixture, which is the moment the new clause
targets — and that is the backlog row this port adds under *Firing owed*.
Both sealed baselines in [firing-harness](firing-harness.md) were taken on
the pre-port descriptions; nineteen are unchanged.

`npm run check` lists twenty; `npm run gates` reports zero failures on both
checks after the port.
