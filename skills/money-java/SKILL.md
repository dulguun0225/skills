---
name: money-java
description: The Java checks that make the money rules fail the build — which tool enforces each directive on Java, Spring Boot MVC, Jackson, jOOQ, PostgreSQL, Flyway and Testcontainers, plus the one-time gate wiring and the hand-rolled-money-type decision. Load in a Java repo alongside the money, money-api and money-storage skills, before adding a money type, a money field, a rounding step, a money endpoint, a money column, a migration, or a query that reads an amount. Every check here is keyed to a directive id that lives in those three skills.
---

# Money-grade rules: the Java checks

**Install this skill with `money`, `money-api` and `money-storage`.** Every check
below is keyed to a directive id — `M-1` … `M-43` — and **every one of those ids
lives in one of those three skills, not here**. This skill names the tool and
adds only what is Java-shaped; it does not restate a directive, so read
alongside, not instead.

- `M-1` … `M-9`, `M-20` … `M-29` — `money`; the Java half is this file
- `M-12` … `M-19` — `money-api`; the Java half is [api.md](api.md)
- `M-10`, `M-11`, `M-30` … `M-43` — `money-storage`; the Java half is
  [storage.md](storage.md)

**The stack.** Java as pinned in the build (these passes were run against JDK
25), Spring Boot MVC, Jackson, jOOQ, PostgreSQL, Flyway, JUnit, Testcontainers.

**Read [storage.md](storage.md) if the repo stores an amount at all.** Nothing in
this file or in `api.md` reaches a money column, query text, a view, or a
migration: the float ban's column half, the engine-rounding rejection, and every
schema constraint are there. Three of its rules are also the reason one earlier
decision is load-bearing — integration tests run against real PostgreSQL in a
throwaway container, never an in-memory substitute.

## Money

- **`M-1` — a hand-rolled `Money` value type**: an exact `BigDecimal` amount
  plus a `java.util.Currency`, immutable, constructed only at the currency's
  minor-unit scale. Excess precision is rejected at construction with
  `RoundingMode.UNNECESSARY`, which throws `ArithmeticException` rather than
  rounding. Why hand-rolled rather than a library is a real decision with a
  named runner-up — see *The Java library decision* below. (Convention — the
  property tests under `M-24` exercise it.)
- **`M-2` — ArchUnit for the module boundary, Error Prone for the float ban.**
  An ArchUnit rule bans `BigDecimal` arithmetic outside the money package
  (off-the-shelf tool, the predicate authored per repo). An Error Prone pattern
  bans `double` and `float` on a money field or parameter (bespoke). Generated
  jOOQ packages are excluded from the ArchUnit rule, which is exactly why the
  column half matters: it is the schema lint in [storage.md](storage.md)
  (`M-10`, `M-31`), and **jOOQ arithmetic needs its own predicate there
  (`M-35`) because no value in a jOOQ arithmetic chain is ever a
  `BigDecimal`** — this rule reports green over all of it.
- **`M-3` — a jqwik property test**: same-currency `plus` and `minus` are exact
  and associative. `BigDecimal.add(BigDecimal)` and `subtract(BigDecimal)`
  return the exact result at `max(this.scale, augend.scale)` and take no
  `RoundingMode` or `MathContext`; only the two-argument `MathContext` variants
  round. Since `Money` fixes both operands at the minor-unit scale, the result
  sits there too. The property doubles as a tripwire for a rounding step
  slipped into ±. (Convention — an authored property test; the `BigDecimal`
  behaviour it rests on is confirmed.)
- **`M-4` — a property of the type, exercised by its own tests**: a
  cross-currency `plus`, `minus` or comparison throws. (Convention.)
- **`M-5` — spec and review, with one partial off-the-shelf gate.** Error Prone
  `EmptyCatch` promoted to `ERROR` fails the build on the empty-catch case
  **only**; it skips a block carrying an explanatory comment or an `ignored` or
  `expected` variable. ArchUnit models the caught throwable type but not the
  catch-block body, so it cannot tell a swallowing handler from a propagating
  one. **Named blind spot:** a handler that logs and returns
  `Money.zero(currency)` passes both. The general rule stays spec and review.
  (Convention, with an off-the-shelf partial.)
- **`M-6` — an ArchUnit predicate.** `Rate`, `Factor` and `Percentage` are
  their own types at their own higher scale; they are not `Money` and do not
  take the minor-unit scale. The predicate bans assigning one to the other and
  bans `Money` appearing where a rate is expected. (Bespoke — an ArchUnit
  predicate.)

## Rounding

- **`M-7` — spec and review.** Every rounding names its `RoundingMode` at the
  call site. `Money` exposes no operation that rounds without one: no rounding
  constructor, no `double` overload, no scalar divide that takes a mode from
  anywhere but the call. Owning the type is what makes those signatures
  unwritable rather than lint-banned. (Convention — spec and review; the absent
  signatures are the real gate.)
- **`M-8` — a jqwik property test stating conservation.** Allocation is
  hand-written: largest-remainder or equivalent. No Java money library ships
  allocation, so this code is bespoke whichever way `M-1` is answered.
  (Convention — a property test.)
- **`M-9` — spec and review, and Java's own naming is the trap.**
  `RoundingMode.HALF_UP` rounds **away from zero** at a tie; rounding toward
  positive infinity is `CEILING`. A spec that says "round up" without saying
  which has not decided anything for negative amounts. (Convention.)

## Observability

- **`M-20` — the compile-checked event catalog plus a test per money-mutating
  path.** The event name comes from the catalog enum, never an inline string
  literal; the log facade takes catalog keys plus whitelisted scalars and
  identifiers, so a domain type carrying personal data cannot be passed to it.
  Entity ids only. (Bespoke — the catalog entries plus a test asserting the
  event fires on every money-mutating path.)
- **`M-21` — the coded error is a catalog entry with a committed alert rule.**
  The error code comes from the same compile-checked catalog enum the API's
  problem responses draw from, so the alert rule and the response reference one
  name. The fire-test is hosted off the shelf: `promtool test rules` runs unit
  tests over the committed rule files, and `alert_rule_test` asserts which
  alerts fire under given series at a given evaluation time. (Off-the-shelf
  host — `promtool test rules`; the fixtures are authored per repo.)
- **`M-22` — a Micrometer gauge per invariant carrying its last-run
  timestamp**, a paging-severity alert on both the breach and the staleness of
  that gauge, and a `promtool` fire-test on each. The must-not-fire case is
  expressed by leaving the expected-alerts list empty. Keep the gauge's label
  set bounded — `MeterFilter`'s maximum-allowable-tags filter with a deny
  action, and the high-cardinality-tags detector on the registry, are both
  off-the-shelf. (Off-the-shelf hosts; the gauge and fixtures are per repo.)

## Evidence gates

- **`M-23` — pitest, version 1.25.8 or later, scoped to the money packages.**
  The floor matters: a real Java 25 defect in the `BigDecimal` and `BigInteger`
  mutators — the mutators money code exercises — was fixed in 1.25.8. The
  mutation score is the ceiling above the repo's general coverage floor, and the
  threshold is this repo's call, stated in the repo's own text.
  (Off-the-shelf.)
- **`M-24` — jqwik property tests, at the version ceiling `llm-default-traps`
  states and enforced by that skill's CI check.** The pin is not incidental:
  this library carries a known version trap, and it is re-decidable at every
  dependency review rather than bumped on sight. It is a **cross-cutting
  dependency rule, not a money rule** — it binds every use of the library in the
  repo — so `llm-default-traps` owns it, and **the version is deliberately not
  repeated here, because a pin stated in four skills drifts in three.** Install
  that skill alongside these; if this repo does not, the pin is its own to state
  at its own dependency review, and no skill here supplies it. (Convention —
  authored property tests, off-the-shelf runner; the ceiling — off-the-shelf,
  wired per `llm-default-traps`.)
- **`M-25` — a JUnit golden test against committed, approved output.**
  (Convention.)
- **`M-26` — Schemathesis against the app booted with Testcontainers.** One
  synthetic tenant, `[generation] deterministic = true` with a top-level
  `seed`, so the case set is reproducible and never retried — both keys are
  specific to the 4.x line, so re-check them against the pinned version. The
  money input set is `M-19` — see [api.md](api.md). No second,
  spec-independent conformance suite is added. (Off-the-shelf tool, bespoke
  wiring.)
- **`M-27` — a bespoke characterization replay.** The determinism precondition
  is wired, not assumed: an injected `java.time.Clock`, a pinned locale and
  time zone, stable ordering, generation in one pinned container, and a CI step
  that regenerates twice and fails unless both regenerations and the committed
  copy are byte-identical. (Bespoke.)
- **`M-28` — a scheduled production job** running the domain's standing
  invariants against real data, reporting through the `M-22` gauge. (Bespoke.)
- **`M-29` — the Decision Trace line.** The plan or spec introducing the first
  money-carrying feature records that these rules bind it, at the plan approval
  gate. (Convention — spec and review.)

## Wiring the gates

Run this once per repo, in the PR that lands the first money feature — not per
money change. Instructing an agent does nothing for a gate: the gate is what
catches the **next** agent, and an unwired gate is a rule described as enforced
that is not.

1. **ArchUnit** — the money-package boundary rule (`M-2`), the rate-versus-money
   predicate (`M-6`), and the exclusion of generated jOOQ packages. Fails the
   build.
2. **Error Prone** — the `double`/`float`-on-money pattern (`M-2`), and
   `EmptyCatch` promoted from its default `WARNING` to `ERROR` (`M-5`).
3. **pitest ≥ 1.25.8** on the money packages with the repo's threshold
   (`M-23`).
4. **The property suites** for `M-1`, `M-3`, `M-8` and `M-24`. The jqwik version
   ceiling those suites run under is wired from `llm-default-traps`, which owns
   it — not from here.
5. **The catalog gates** — the event-name and error-code catalog enums, their
   committed snapshots diffed each build, and the per-money-path event test
   (`M-20`, `M-21`).
6. **`promtool test rules`** in CI over the committed alert rules, with a
   fire-test for the `M-21` error alert and both the breach and staleness rules
   of `M-22`.
7. **The conformance-fuzz job** with the money input set (`M-26`, `M-19`) and
   the contract lints in [api.md](api.md).
8. **The replay job** and its regenerate-twice determinism check (`M-27`).
9. **The production invariant schedule** and its gauge (`M-28`, `M-22`).
10. **The store-side gates** — the schema lint, the two ArchUnit predicates, the
    query-text lint, squawk, and the containerised rejection, grant, concurrency
    and golden tests. That list is its own step, in
    [storage.md](storage.md), *Wiring the storage gates* (`M-10`, `M-11`,
    `M-30` … `M-43`).

**Then commit the record**, in the repo's own text — its constitution, its
rules file, or a decision record. One line per directive id: the tool, and
either *wired* or *deferred with the reason and who owns it*. These entries are
already known and belong in that record on the first run:

- `M-5`, `M-7`, `M-9`, `M-29` — spec-and-review, with `M-5` carrying the
  partial `EmptyCatch` gate. These have no full build gate by design, and
  saying so is what keeps the rest of the record honest.
- `M-43`, and the value side of `M-42` — spec-and-review too. Plus `M-35`'s
  named blind spot on runtime-assembled SQL. All three are stated in
  [storage.md](storage.md), which lists what its own section must record.

A record that lists only what was wired reads as complete coverage. That is the
failure this step exists to prevent.

## The Java library decision

**Hand-rolled `Money` over a library — the decision holds, and the earlier
reason for it was wrong.** Re-verified 2026-07-24 in a three-vote adversarial
pass against the live sources. The corpus favourite here is *reaching for a
money library unexamined*, and the honest verdict is that the libraries are
better than the earlier rationale claimed.

- **The old reason, corrected.** "The libraries ship no monetary algorithms, so
  allocation and rounding stay hand-written either way" is true but mis-framed:
  it treats a missing *algorithm* as a missing *value type*.
- **Joda-Money (2.0.3, 2025-12-14; actively maintained; Java 21+ on the 2.x
  line) provides most of `M-1` natively.** `Money.of` binds to the ISO 4217
  minor-unit scale and rejects excess precision via `RoundingMode.UNNECESSARY`,
  throwing `ArithmeticException` with no silent rounding — `M-1`, near
  verbatim. `plus` and `minus` throw `CurrencyMismatchException`, which is
  `M-4`. The type is immutable.
- **The real reason to own the type is API surface.** The same public `Money`
  also ships precision-losing operations: the rounding constructor
  `of(currency, amount, RoundingMode)`, the `double` overloads, and scalar
  `dividedBy(long, RoundingMode)` — per-quotient rounding, the non-conserving
  split `M-8` forbids. A type you own omits them, so they are **unwritable**
  rather than lint-banned.
- **The honest size of that win.** Each is a specific signature ArchUnit can
  ban. So it is "unwritable for free, because we are building the type anyway",
  not "a ban would not hold".
- **Not footguns.** `dividedBy(x, RoundingMode)` and
  `multipliedBy(BigDecimal, RoundingMode)` name the mode at the call site,
  which is `M-7` itself, and division has no exact overload — any correct money
  type reproduces them.
- **The runner-up the binary framing hides: a thin wrapper over Joda's
  `Money`,** exposing only the safe subset. It wins on one axis — Joda
  maintains the ISO 4217 minor-unit table, including JPY at scale 0, the BHD
  class at scale 3, and the no-minor-unit pseudo-currencies, which a hand-roll
  otherwise takes from `java.util.Currency`. It does not shrink the
  highest-risk code (allocation, rounding policy and the rate type stay
  bespoke) and it is slightly weaker on the unwritable goal, since the
  footgun-bearing inner `Money` sits one accessor away.
- **Moneta (JSR 354; maintenance mode, 1.4.5, 2025-03-22, Java 8).** Correcting
  the old "no algorithms" wording: it does ship percent, permil, minor-part and
  rounding operators. But it ships no allocation, no call-site rounding
  discipline, and defaults that make silent rounding the easy path — `multiply`
  and `divide` apply a context `HALF_EVEN` with no call-site mode,
  `getDefaultRounding` is repo-wide (`M-7`'s banned shape, as a library
  feature), and `FastMoney` rounds to scale 5.
- **Either way, allocation and the separate higher-precision rate type are
  shipped by neither library and stay hand-written.**

Sources: `joda.org/joda-money` javadoc and the `JodaOrg/joda-money` README; the
`JavaMoney/jsr354-ri` repository. Re-run this evaluation, rather than inherit
it, for any other ecosystem.

## Evidence and dates

Java-specific claims and their markers. The platform-neutral evidence — what
each directive rests on, what did not survive citation, and what reopens a
decision — is in the `money` and `money-api` skills' own `evidence.md`.

| Claim | Marker | Date |
| ----- | ------ | ---- |
| Hand-rolled `Money` over Joda-Money and Moneta, with the thin-wrapper runner-up named | confirmed — three independent refutation votes against the live sources | 2026-07-24 |
| `BigDecimal.add`/`subtract` are exact at `max` scale and take no `RoundingMode`; only the two-argument `MathContext` variants round (`java.math.BigDecimal` javadoc, JDK 25) | confirmed | 2026-07-25 |
| Error Prone `EmptyCatch` is `WARNING` by default, must be promoted to `ERROR`, matches only the empty case, and skips a commented or `ignored`/`expected` block (errorprone.info) | confirmed | 2026-07-25 |
| ArchUnit models the caught throwable type but not the catch-block body, so it cannot see a swallowing handler (TNG/ArchUnit issue 1120) | confirmed | 2026-07-25 |
| pitest supports bytecode through Java 26, is actively maintained, and fixed a real Java 25 defect in the `BigDecimal`/`BigInteger` mutators in 1.25.8 (2026-07-20) | confirmed | 2026-07-21 |
| jqwik carries a version trap, calling for a CI version-ceiling check and treatment as re-decidable at every dependency review. The ceiling version itself is stated once, by `llm-default-traps`, which owns the pin — the same 2026-07-21 finding, recorded there with its incident detail | confirmed | 2026-07-21 |
| `promtool test rules` runs unit tests over committed rule files; `alert_rule_test` asserts which alerts fire at a given evaluation time, and the must-not-fire case is an empty expected-alerts list (prometheus.io) | primary-source verified — one researcher, no panel | 2026-07-27 |
| Metric label cardinality is boundable off the shelf on both sides: Micrometer's `MeterFilter` maximum-allowable-tags filter with a deny action, and the registry's high-cardinality-tags detector, which its docs support in a one-time-check form for tests | primary-source verified | 2026-07-27 |
| Schemathesis is the conformance-fuzz oracle — MIT, on its 4.x line — and `[generation] deterministic = true` plus a top-level `seed` give reproducible runs; both keys are 4.x-specific, so they are re-checked at every version bump | confirmed | 2026-07-25 |

**Do not cite.** Prometheus's own docs give **no** default cardinality
threshold — do not state one. Do not cite `openjdk.org/jeps/*` (it returns HTTP
403 to a fetcher); use the Oracle javadoc or the `openjdk/jdk` sources. Do not
cite an "adversarial AI reviewer catches silent catches" backstop as a gate: it
is non-deterministic, which is why `M-5` stays spec and review.

**Review by 2027-01-21.** Past that date every **confirmed** marker above reads
as **convention** until a new pass re-dates it. The version pins age fastest —
re-check pitest, jqwik and Joda-Money at adoption, not on the calendar.
