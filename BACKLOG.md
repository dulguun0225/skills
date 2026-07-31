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

Doing one of these is a bounded session, not a research project. The layer check
is a read of the file asking one question per directive; the composite-shape
check is a list written before anything is verified. Neither needs a panel, and
**neither may promote a marker** — a check that finds nothing changes no
confidence marker, because finding nothing is not verification. What it may do
is add directives, and those then arrive at the normal bar.

## Evidence owed on a published skill

**`backend-stack`, published 2026-08-01, ships everything at *convention* and
its central claim at *uncertain*.** Three things would move it, and the first is
the one the author holds:

| Owed | What it unblocks |
| ---- | ---------------- |
| **The 2026-06-11..14 platform pass's primary sources**, not held in this repository | Promotes the Java verdict's grounds from convention to primary-source verified, per claim. The skill's *Do not cite* list names them as unavailable and must be rewritten when they arrive |
| **The candidate list at the language and runtime layer** — which languages were compared, on what grounds, with a steelman for each loser | The skill's largest named gap. Until it lands the verdict ships as an **unexamined win**, the same honesty `java-backend-rules/evidence.md` applies to the WebFlux ban. Naming the loser is this repository's most load-bearing invariant and `backend-stack` currently fails it about itself |
| **An enforcement-host census for one serious competitor** | The published census was taken for one stack, so it shows Java's surface is deep and **not** that it is deeper. One competing census gives *Count the independent enforcement hosts* its first discriminating case |

**Nothing here is a research project.** The first two are recovery of material
that exists outside this repository; the third is the same grep the skill
publishes, run against another stack's rule set.

## Researched, unwritten

Each row is a topic whose sources were identified during the corpus era. **The
underlying research notes were never in this repository** and are not in its git
history either, so these rows are topic summaries, not evidence. Harvesting one
means re-verifying its claims from primary sources, splitting portable rules from
project-shaped facts, recording the premise each rule holds under, and writing
the skill. Order of magnitude: a day, not a research project.

| Candidate skill | Named sources | What it would carry |
| --------------- | ------------- | ------------------- |
| `ai-maintainer-principles` | AI-maintenance research notes | Startup-loud versus runtime-silent behaviour; the one-AI-session cognitive-load boundary criterion. These overlap the eight design principles already published in `enforceable-rules`; this candidate would be their directive form — the same ideas as rules a repo commits, rather than as an authoring bar. **Two of its four topics were published on 2026-08-01 by `backend-stack`** — "what the build can refuse to ship is the deciding criterion" is that skill's first directive, and corpus-gravity and drift-asymmetry reasoning is its fourth. Harvesting this row now means checking what is left against those two directives first, not re-deriving them |
| `angular-frontend-ai` | CVE-2025-29927 (Next.js) | An explicit Angular profile for AI maintenance; Bun versus Node; the Next.js rejection on CVE-2025-29927; a signal-everything dialect, an eslint wall, and exemplar files |
| `postgres-tenancy` | PostgreSQL documentation; HikariCP issue #1633; CVE-2018-1058 | Schema-per-tenant versus pooled row-level security versus database-per-tenant, with PostgreSQL-documented facts (`PREPARE` re-parse, HikariCP #1633, CVE-2018-1058), the ceiling on each, and the escape hatches |
| `guardrails-toolchain` | a toolchain survey | The roughly forty-tool map: concern, tool, gate, licence, and the caveat that bites for each — plus the four gap classes the survey found |
| `uuidv7-primary-keys` | UUIDv7 research notes | UUIDv7-everywhere versus bigint identity versus TSID hybrids, with the `ORDER BY` carve-out |

## Stacks with no instantiation

`money`, `caching` and `async-handoff` each carry an open item reading "revisit
when a second stack is real" — every rule set here has been instantiated on
exactly one stack, Java with Spring Boot MVC, jOOQ and PostgreSQL. **The
predictions below are the corpus's answer to that item**, and they are
predictions: no pass tested any of them.

- **`dotnet-backend`** — strongest candidate, and the first that would instantiate
  the money rules from scratch: every `M-n` written with a .NET check, on a second
  type system where the exact decimal is a language primitive rather than a
  library type. Whatever it cannot check becomes the first honest gap, recorded
  there rather than worked around.
- **`llm-service`** — highest value, least settled ground. It breaks the "evidence
  is deterministic tests" assumption every skill here rests on, so research has to
  precede drafting.
- **typescript-node-backend, python-backend, go-backend, rust-backend,
  typescript-frontend, data-pipeline, iac, supply-chain.** Each would instantiate
  all three rule sets — every `M-n`, every `C-n` and every `E-n` with that stack's
  check, or a named gap with the reason. Two are predicted to strain the money
  rules: **typescript-node-backend**, where the corpus default is the IEEE-754
  `number` and the check has to make an exact decimal type the only writable one,
  and **go-backend**, whose standard library has no fixed-point decimal type at
  all. The caching rules strain differently — `caching/evidence.md` names the
  directives that lean on type design (no bare write, no atomic primitive,
  registration-only expiry, key-is-the-tuple, immutable value type, a loader
  return that distinguishes absence), so **typescript-node-backend** is expected
  to convert several into runtime guards, while **go-backend** should host them
  *more* strongly than Java does, via a compiler-enforced package boundary and an
  unexported method on the loader port that makes an outside implementation
  impossible. The asynchronous-handoff rules are the largest set and predict the
  same split on a wider surface, and the Java instantiation already records that
  the same-transaction property could not be type-designed at all and fell back
  to a test. Expect that worse on a dynamically
  typed stack and better on one whose transaction scope is a distinct type. The
  allow-list seam is the one rule whose cost scales with the language's async
  surface: a stack with `async`/`await` everywhere has far more constructs to
  enumerate than Java does.

**Money in a new language is not a new topic** — it is an instantiation, a
`money-<stack>` skill keyed to the existing ids, plus a divergence note wherever
the language forces one.

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
