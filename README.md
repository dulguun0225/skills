# nc skills

Agent Skills carrying dated, researched technology rules for repos whose code is
written by LLM agents. The skills are installed with Vercel's `skills` CLI and are
**not listed in the public skills.sh directory**; installing by repo name works
regardless.

The skills are the artifact. The imported decision corpus they were written from
was deleted on 2026-08-01, once every rule set in it had shipped as a skill; its
researched-but-unwritten topics live on in [BACKLOG.md](BACKLOG.md). How each
skill is split, and why, is recorded in [CLAUDE.md](CLAUDE.md) — the operative
rules there, and the per-skill account of each authoring pass, its sweeps and its
reviews under [docs/history/](docs/history/). Read both before authoring anything
here.

## Why this exists

An LLM writes code by training-data default, and the default is whatever was most
common in the corpus — not what is best where no human writes or reviews the code
line by line. Overriding a default takes research: frame the question, rank the
candidates, verify the facts, date them. That research does not change from project
to project, so redoing it in each one is waste.

This repo does the research once and turns the result into knowledge an agent
loads at the moment it is about to write — technology choices, principles, methods,
guardrails, each with its check, its confidence marker and its date. Skills are the
form because they are shareable and installable: one command puts the same rules in
any repo, and the agent picks up the ones relevant to what it is doing. That is the
whole purpose; everything else here is in service of it.

## What is published

| Skill | For an agent about to… |
| ----- | ---------------------- |
| `money` | add or change a field, a payload, a computation or a rounding step that carries an amount of money — the money type, arithmetic, rounding, fail-loud money paths, telemetry, and the evidence gates. Any language |
| `money-api` | put an amount of money on the wire — string decimals, required fields, counterparty minor units, constructor-only deserialization, idempotency keys, required preconditions, the money fuzz cases. Any language |
| `money-storage` | store an amount and read it back — column declaration, over-scale writes rejected rather than rounded, constraints the store must carry, arithmetic in the query language banned, one named read boundary, appended effect rows, migrations that compute money, and a verdict on every shape a repo assembles out of stored money. Any engine |
| `money-java` | do any of those in a Java, Spring Boot MVC, jOOQ and PostgreSQL repo — the tool that fails the build for each rule, and the one-time gate wiring. Install it **with** the three above; its checks are keyed to their rule ids |
| `caching` | serve a value from memory or a cache server instead of recomputing it — one adapter seam, no caching annotation, read-through only, nothing correctness-bearing cached, scoped keys, a committed staleness ceiling, delete-only invalidation after commit, and the three-configuration differential gate. Carries the verdict on every shape a repo assembles out of these primitives, and fires on a proxy or content-delivery-network cache too. Starts by asking whether to cache at all. Any language |
| `caching-java` | do that on the Java stack — the tool per rule, the engine pick, and the gate wiring. Install it **with** `caching` |
| `async-handoff` | move work out of the caller's control flow — one outbox row plus one broker and no second mechanism, one messaging-adapter seam, no annotation-bound consumers, deterministic message identity, manual acknowledgement, a failure policy with no silent drop, a generated subscription catalog, and two architectures banned outright. Any language |
| `async-handoff-shapes` | build a saga, a compensation path, a business timer, a webhook in either direction, or a claim check — the shapes assembled *out of* handoffs. Install it **with** `async-handoff` |
| `async-handoff-java` | do either of those on the Java stack — the tool per rule, the transport pick, and the gate wiring |
| `llm-default-traps` | add or bump a dependency, pin a tool, pin a CI action or a container image reference, wire CI, pick a property-test, holiday or units library, or store a deadline — the picks an LLM makes by training-data default, banned by name. Any language, plus a JVM-only group. **Owns the jqwik version pin** the three Java stack skills defer to |
| `backend-stack` | pick the language, runtime, framework, persistence library or database for a new backend, add a second language to a repository or an organisation, or argue an existing stack should change — rank candidates by what their build can refuse to ship, count the independent enforcement hosts rather than type-system features, and price corpus gravity as a cost the winner carries. Carries the Java verdict as its worked case. **The one skill here that argues a stack choice**; every other stack skill assumes it |
| `guardrails-toolchain` | adopt a static analyser, scanner, coverage or mutation tool, wire or remove a CI gate, add a suppression or baseline file, change branch protection or a shared workflow, or claim a defect class is covered — which tool may occupy a gate at all, what disqualifies one, how gates compose, the verdict on every shape a repo assembles out of two gates, and the four whole concerns a tool-by-tool comparison never surfaces. Carries one repo's whole tool map as its worked case. Any stack |
| `ai-maintainer-principles` | draw or move a module boundary, choose a runtime topology, decide what a build gate may be relaxed for, adopt a database, managed service or vendor API, write a retry or a subtle piece, introduce a second way to do something, migrate from an existing system, or write a repo constitution — the decisions that change answer because the maintainer is an agent: startup-loud magic allowed and runtime-silent banned, requirements needing whole-program reasoning designed out, a module sized to one session, topology by the number of independent wills, one idiom imposed mechanically, and the review substitute that stands in for a human reader. Any stack |
| `primary-keys` | create a table, choose or change a primary key, generate an id in application code, design a human-facing number format, write an object-storage key template or a log field set, put an id in a URL, a log line, a payload or an export, write an `ORDER BY` over an id column in any language, or move tenant data between databases — rank key candidates by the surfaces the id lands on rather than by index size, the enumerable-key disclosure, the replication cost of a sequence, the computed table classification, the cost folklore that belongs to a different key and a different engine, the `ORDER BY`-on-id ban and its one pagination carve-out, and the split between the opaque key and the human-facing business number. Carries one repo's UUIDv7-everywhere verdict as its worked case, with its losers. Any engine |
| `business-numbering` | issue a number a person reads out, quotes or types — an account, loan, voucher or document number — or write an issuer, a counter, a format or a check digit, import legacy numbers, or make any number gapless — the class catalog with a decision per class, counter rows inside the caller's transaction rather than engine sequences, gapless as a transactional property only where it earns its keep, periods from the business calendar, typed format parts against the pattern-string engine it names as the anti-pattern, Damm check digits validated at every ingress, and exhaustion that hard-fails rather than widening silently. Carries one repo's seven-class catalog as its worked case, with its rejected alternatives. Any store |
| `new-java-backend` | create a Java backend project from nothing — one pinned script lands `dulguun0225/java-backend-template` with every gate wired, then `specify init`, then a hand-off to `/speckit.constitution` for the project's own articles. Nothing in it is a decision; invoke it by name |
| `build-feature` | build one feature from a written source with no human gate — one Workflow script runs specify, clarify, plan, tasks, analyze, implement and converge as fresh subagents on the model and effort each stage earns, puts a fresh-context refutation review where each of spec-kit's human gates was, and loops converge and implement until nothing converge finds is above LOW severity; invoke it by name |
| `converge-feature` | converge, finish or close out a feature that is already implemented — the converge ⇄ implement loop of `build-feature` alone, from `converge` to `finish`, through that skill's script; no script of its own, so install it **with** `build-feature`; invoke it by name |
| `java-backend-rules` | write a query, a transaction, an in-request fan-out, a migration, a scheduled task or a test on Java, Spring Boot MVC, jOOQ and PostgreSQL — the platform, concurrency, time and nullness rules, and the banned dependencies and annotations |
| `java-backend-api` | add or change an endpoint on that stack — the committed OpenAPI document as the single conformance oracle, error contract, pagination, versioning, temporal wire format and concurrency headers |
| `java-backend-observability` | add a log line, a metric, a trace or an alert on that stack — the typed logging facade, unloggable domain types, context propagation across a fan-out, and what an alert is allowed to be |
| `tech-decision-research` | pick a library, framework, datastore, architecture or tool — frame before naming candidates, run an adversarial panel rather than one survey, verify by three refutation votes, date every version fact. **Defines the four confidence markers** the rest of this set marks its claims in |
| `enforceable-rules` | write the decision down as a rule — the premise-specificity test, eight principles, and five checks a rule set passes while still being silently incomplete. **Defines the enforcement markers and status tiers** the rest of this set uses |

Every directive carries the kind of check it needs, its confidence marker, and its
date. The money, caching and asynchronous-handoff skills carry rule ids (`M-n`,
`C-n`, `E-n`), each defined in exactly one skill and keyed from the matching
`-java` skill; the rest anchor on stable headings instead.

**Read each skill's marker ceiling before trusting a marker.** Several groups
shipped without the panel that would promote them — `money-storage`'s persistence
group and both bans, every directive in `caching`, and both asynchronous-handoff
passes. `backend-stack`, `guardrails-toolchain`, `ai-maintainer-principles`,
`primary-keys` and `business-numbering` are weaker still: everything in all five is
convention, each marks its central claim *uncertain*, and the external records they
were written from — recovered on 2026-08-01 and 2026-08-02 — cite no primary source
for any ground they record.
Three add a caveat of their own: every tool fact in `guardrails-toolchain` is dated
2026-06-13; every engine fact and the one benchmark in `primary-keys` are
dated 2026-06-12 and unreproduced; and `business-numbering` carries a **negative
search result** — one jurisdiction, one statute, one date, no gapless-numbering
requirement found — which is not a finding that none exists. Tooling and engine
facts decay faster than anything else here. Each `SKILL.md` states its own ceiling near the top.

## Setup on a new machine

```bash
mise trust && mise install   # once per machine: mise refuses to run an untrusted config
npm ci                       # exact tool versions from package-lock.json
npm run check
npm run gates
```

`mise` pins node; `package-lock.json` pins the `skills` CLI, whose discovery
behaviour decides what counts as a skill in this repo.

## Commands

| Command | What it does |
| ------- | ------------ |
| `npm run check` | Lists the skills the CLI discovers here. Anything it does not list is invisible to every consumer. |
| `npm run gates` | Runs both wired gates below. Fails the build; neither is advisory. |
| `npm run check:evidence-order` | Every evidence heading that names a directive section runs in the directive text's order (`--orphans` lists the headings that name none). |
| `npm run check:pointers` | No skill text cites a rule id, or links to a file, that its own installed dir does not carry (`--pairs` lists the cross-skill id citations). |
| `npm run tokens` | Size of every skill's directive text, `evidence.md` excluded — the cost paid each time a skill fires (`--files` breaks it down per file). A report, not a gate. |
| `npm run tokens:frontmatter` | Size of every skill's `name` and `description` — the cost paid every session whether the skill fires or not. |
| `npm run tokens:sections` | Size of each `##` section of each `SKILL.md` — where a body's cost sits (`--skill <name>` for one, `--repeated` to roll up by section name across skills, `--min 0` to fold nothing). |
| `npm run firing` | Runs headless sessions against an isolated sandbox holding only this repo's skills, and reports which skills actually fired (`--skill <name>`, `--case <id>`, `--repeats N`, `--against <git-ref>` to A/B a frontmatter edit, `--model <name>` to pin one, `--dry-run` to price it first). Two modes: the default scores whether a skill fires as the model's first action; `--explore` allows the read and edit tools and scores whether it fires before the first code edit, which is the delivery question — the two rates are different measurements. A report, not a gate — it is stochastic and it spends money. |
| `npm run probes` | Runs headless sessions with **no skills installed** and records what a bare agent writes for a task a directive governs — the opposite question from `firing`: not *does the skill load* but *does it need to exist* (`--model <name>`, `--case <id>`, `--repeats N`, `--budget N` USD stop, `--dry-run`). Grading is manual, against each case's written criterion. A report, not a gate — stochastic, and it spends money. |
| `npm run try -- <name>` | Runs one skill straight from the working tree, without installing it. |

`npm run check` should list every directory under `skills/` — compare its output
against `ls skills/` rather than against a number written here. It checks
discovery and frontmatter, nothing else: it does not see a skill's resource files
(`evidence.md`, `api.md`, `storage.md`, `shapes.md`, `gates.md`).

The two gates are the pair `enforceable-rules` says are the only machine-checkable
part of it, wired here on 2026-08-02 and run by CI on every push touching
`skills/` or `scripts/` since 2026-09-16 (`.github/workflows/skills-checks.yml`,
which also fails on a `SKILL.md` the discovery check skips). **Each prints what it does not decide on
every run** — a check that is trusted past its reach is the false assurance that
skill's first principle bans. Everything else in this repo, including all five
incompleteness checks, is still reading.

The token reports — `tokens`, `tokens:frontmatter`, `tokens:sections` — measure
size, not quality, and the first two measure different costs, because skill
loading is three tiers. Frontmatter — `name` and
`description` — is injected at session start so the agent can decide what is
relevant, and is paid whether the skill fires or not: `npm run
tokens:frontmatter`. The `SKILL.md` body loads when the skill fires, per
invocation: `npm run tokens`. A resource file (`evidence.md`, `api.md`,
`storage.md`, `shapes.md`, `gates.md`) loads only if the body points at it and the agent
opens it, which for `evidence.md` is never, which is why it is excluded.

So the `npm run tokens` total is a worst case — every skill installed and every
one fired — and not a number any consumer pays. `npm run tokens:sections` splits
that per-firing tier by `##` section, which is the form the answer has to take
when the question is which part of a body could move to `evidence.md`; it counts
`SKILL.md` only. Every token script tokenizes with o200k_base, exact for GPT
models and an approximation for Claude, which ships no offline tokenizer: read
the ranking and the direction, not the absolute number.

The token reports weigh a `description` without reading it, and a `description` is
the only thing that makes a skill fire. `npm run firing` is the other half:
it sends a headless session a prompt an engineer would plausibly type and records
which skills the agent chose to load. **Firing is decided by frontmatter alone** —
the body and every resource file are invisible until after the choice — so this is
the only script here that reaches the one tier the others can only weigh. It spends
money and it is stochastic, so it is never wired into `npm run gates`; run it with
`--repeats` behind any claim you intend to make from it.

**It runs on any machine with the `claude` CLI logged in, but a firing rate does
not travel between machines.** A rate is a property of one model reading one
description under one CLI version — headless sessions default to a different model
than the one you are working in, which is a mistake this repo has already made
once. Every run stamps its model and CLI version on the report and in `--json`, and
`--model` pins one. The one setup difference worth knowing about: sessions run
under an isolated `CLAUDE_CONFIG_DIR` so that globally installed skills cannot
compete, and a machine that authenticates through an OS keychain rather than
`~/.claude/.credentials.json` may need `ANTHROPIC_API_KEY` exported for the run.

**Every rate this harness produced before 2026-08-03 evening is void**, because
the sandbox was not sealed: `--allowed-tools` auto-approves rather than
restricts, and the deny list beside it missed the Windows shell and eighteen
other tools, so sessions explored freely and then died at the turn cap. The run
now refuses to start when the session holds a tool its mode does not permit,
and the environment passed to a session is an allowlist rather than whatever
the operator's shell happened to hold. Full account in
[docs/history/firing-harness.md](docs/history/firing-harness.md).
The preflight session says so before spending anything.

`npm run probes` asks the question the firing harness cannot: whether a bare
agent already does what a directive says, from training data alone. Every case
in `scripts/redundancy-cases.json` poses a task a directive governs to a session
with no skills installed; grading is manual against the case's criterion. It
was run once, 2026-08-11 and 2026-08-12, on `claude-sonnet-5` and `claude-opus-5`:
no skill was deletable, most probed directives were violated by the bare agent,
and compliance was strongly tier-dependent — so a redundancy verdict belongs to
the deployed model, not to the skill. The record, with what it does not decide,
is [docs/history/skill-redundancy-audit.md](docs/history/skill-redundancy-audit.md).

## Installing from this repo

```bash
npx skills add dulguun0225/skills -a claude-code -y
```

Installing places the skills; it does not make them fire. A skill fires when
the agent judges its `description` relevant at session start, and a miss is
silent. **Measured on sealed sessions, 2026-08-03, `claude-opus-5` under CLI
2.1.220 on win32, one repeat per case: 43 of 44 prompts loaded the skill they
should have, none of the four negative prompts loaded anything, and in the run
that allowed the read and edit tools, no skill arrived after the code it
governs.** Both runs, and everything they do not decide — one repeat ranks
rather than proves, and the rate belongs to that fixture set — are in
[docs/history/firing-harness.md](docs/history/firing-harness.md). The
descriptions are directive-worded ("ALWAYS load before …") since 2026-08-03,
which one external study (web-sourced 2026-08-03, unverified here) associates
with the largest activation gain; the check that measures this set is
`npm run firing`. Delivery work on this set happens in exactly two places —
the frontmatter, or hooks — by owner decision, 2026-08-03: installing these
skills never requires copying anything into the consuming repo.

**A greenfield Java repo on the stack `java-backend-rules` binds does not start
from these skills; it starts from
[`dulguun0225/java-backend-template`](https://github.com/dulguun0225/java-backend-template)**,
a GitHub template where every gate the Java skills name as build-enforceable is
already wired and green (`gh repo create <org>/<name> --template
dulguun0225/java-backend-template`). The skills carry the decisions and their
checks; the template carries the consequences — the poms, the executable ban
list, the migration lint, the contract snapshots, the CI — so an agent's first
session goes to domain code rather than to scaffolding it would otherwise
regenerate, differently, every time. The template's `docs/GATES.md` maps each
wired gate to the directive it implements and names what it does not reach.
`new-java-backend` ships `scripts/new-backend.mjs`, which instantiates the
template at a pinned commit in one command and stops before anything that
touches the forge; an agent runs it rather than retyping the template's README,
and the skill ends where spec-kit's `/speckit.constitution` begins.
It is Node on the standard library, the runtime `npx skills add` already needs,
so it runs the same on Linux, macOS and Windows.
Created 2026-09-16; record in
[docs/history/java-backend-template.md](docs/history/java-backend-template.md).

## Starting a new Java project

The order is fixed, decided 2026-09-16, and the skill comes before spec-kit:

1. In an empty project directory, invoke `/new-java-backend`. It asks for the
   package, artifact name and group, lands the template in `backend/` at its
   pinned commit, runs codegen and `mvn verify`, commits, and runs
   `specify init --here`. It prints the forge and ruleset steps and does not run
   them.
2. `/speckit.constitution`, with only the product's own decisions as input. It
   fills Article VII; Articles I–VI arrive pre-filled from the template and are
   not re-planned.
3. `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`
   as spec-kit documents them, or `/build-feature`, which runs them (plus
   clarify, analyze and converge) unattended with a fresh-context review where
   each human gate was. The plan's Technical Context inherits the platform from
   the constitution.

Run spec-kit first and the constitution it writes is the one that stays: the
scaffold never overwrites a file, so the platform articles are dropped with a
warning and the plan re-decides the stack the template has already decided.
