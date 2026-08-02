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
| `llm-default-traps` | add or bump a dependency, pin a tool, choose a container base image, wire CI, pick a property-test, holiday or units library, or store a deadline — the picks an LLM makes by training-data default, banned by name. Any language, plus a JVM-only group. **Owns the jqwik version pin** the three Java stack skills defer to |
| `backend-stack` | pick the language, runtime, framework, persistence library or database for a new backend, add a second language to a repository or an organisation, or argue an existing stack should change — rank candidates by what their build can refuse to ship, count the independent enforcement hosts rather than type-system features, and price corpus gravity as a cost the winner carries. Carries the Java verdict as its worked case. **The one skill here that argues a stack choice**; every other stack skill assumes it |
| `guardrails-toolchain` | adopt a static analyser, scanner, coverage or mutation tool, wire or remove a CI gate, add a suppression or baseline file, change branch protection or a shared workflow, or claim a defect class is covered — which tool may occupy a gate at all, what disqualifies one, how gates compose, the verdict on every shape a repo assembles out of two gates, and the four whole concerns a tool-by-tool comparison never surfaces. Carries one repo's whole tool map as its worked case. Any stack |
| `ai-maintainer-principles` | draw or move a module boundary, choose a runtime topology, decide what a build gate may be relaxed for, adopt a database, managed service or vendor API, write a retry or a subtle piece, introduce a second way to do something, migrate from an existing system, or write a repo constitution — the decisions that change answer because the maintainer is an agent: startup-loud magic allowed and runtime-silent banned, requirements needing whole-program reasoning designed out, a module sized to one session, topology by the number of independent wills, one idiom imposed mechanically, and the review substitute that stands in for a human reader. Any stack |
| `primary-keys` | create a table, choose or change a primary key, generate an id in application code, design a human-facing number format, write an object-storage key template or a log field set, put an id in a URL, a log line, a payload or an export, write an `ORDER BY` over an id column in any language, or move tenant data between databases — rank key candidates by the surfaces the id lands on rather than by index size, the enumerable-key disclosure, the replication cost of a sequence, the computed table classification, the cost folklore that belongs to a different key and a different engine, the `ORDER BY`-on-id ban and its one pagination carve-out, and the split between the opaque key and the human-facing business number. Carries one repo's UUIDv7-everywhere verdict as its worked case, with its losers. Any engine |
| `business-numbering` | issue a number a person reads out, quotes or types — an account, loan, voucher or document number — or write an issuer, a counter, a format or a check digit, import legacy numbers, or make any number gapless — the class catalog with a decision per class, counter rows inside the caller's transaction rather than engine sequences, gapless as a transactional property only where it earns its keep, periods from the business calendar, typed format parts against the pattern-string engine it names as the anti-pattern, Damm check digits validated at every ingress, and exhaustion that hard-fails rather than widening silently. Carries one repo's seven-class catalog as its worked case, with its rejected alternatives. Any store |
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
```

`mise` pins node; `package-lock.json` pins the `skills` CLI, whose discovery
behaviour decides what counts as a skill in this repo.

## Commands

| Command | What it does |
| ------- | ------------ |
| `npm run check` | Lists the skills the CLI discovers here — the only self-check that exists. Anything it does not list is invisible to every consumer. |
| `npm run try -- <name>` | Runs one skill straight from the working tree, without installing it. |

`npm run check` should list every directory under `skills/` — compare its output
against `ls skills/` rather than against a number written here. It checks
discovery and frontmatter, nothing else: it does not see a skill's resource files
(`evidence.md`, `api.md`, `storage.md`, `shapes.md`), so a broken link inside one
passes.

## Installing from this repo

```bash
npx skills add dulguun0225/skills -a claude-code -y
```
