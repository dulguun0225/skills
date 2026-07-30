---
name: caching-java
description: The Java checks that make the cache rules fail the build — which tool enforces each directive on Java, Spring Boot, ArchUnit, Error Prone, Jackson, Maven, JUnit, Testcontainers and Toxiproxy — plus the cache engine pick (Valkey, with Redis 7.4 through 7.8 banned by name), the one-time gate wiring, and the named gaps where this toolchain can host no check. Load in a Java repo alongside the caching skill, before adding a cache, a memo, a loading cache, a caching annotation, an expiry, or a cache engine. Every check here except the engine pick is keyed to a directive id that lives in the caching skill.
---

# Cache discipline: the Java checks

**Install this skill with `caching`.** Every check below is keyed to a directive
id — `C-1` … `C-16` — and **every one of those ids lives in `caching`, not
here**. This skill names the tool and adds only what is Java-shaped; it does not
restate a directive, its reasoning, or the default it overrides, so read
alongside, not instead.

**One directive here has no id, and that is deliberate: the engine pick.** Which
cache engine the repo runs is not a rule in `caching` — its gates are
deployment-shaped rather than language-shaped, and its right answer varies
*within* a stack. So it is stated here, as this skill's own directive, and the
platform-neutral nine-candidate survey behind it is in the `caching` skill's own
`evidence.md`.

**The stack.** Java as pinned in the build, Spring Boot, ArchUnit, Error Prone,
Jackson, Maven with failsafe, JUnit, jqwik, Testcontainers with Toxiproxy,
Caffeine where an in-process cache is wanted.

**Start by not caching.** That instruction is in `caching` and it is not
decoration: with no measured latency problem the correct answer is no cache, and
the next is an in-process cache with a short expiry. Nothing below argues that a
repo should have one.

## The engine pick

- **The shared cache engine, where one is needed, is Valkey, pinned by image
  digest.** Valkey is BSD-3-Clause under Linux Foundation governance, and it
  guarantees compatibility with **Redis OSS 7.2 and every earlier open-source
  Redis version**, so existing Redis clients connect unchanged. **The guarantee
  does not run forward:** RDB files written by Redis CE 7.4 and later are not
  compatible, which is the one stated incompatibility and the thing to check
  before moving a repo off a newer Redis.
- **Redis 7.4 through 7.8 is banned by name.** Those releases offer only the
  Redis Source Available License v2 or the Server Side Public License v1, and
  neither is OSI-approved, so that line has **no licence-cost-free exit at all**.
- **Redis 8.0.1 and later are permitted only with a plan decision that records
  which licence branch was taken and who accepted it.** From 8.0 the licence is a
  tri-licence at the recipient's choice — RSALv2, SSPLv1, **or** AGPLv3. **The
  ground is the choice, not the AGPL.** Running an unmodified server as a backing
  service does not trigger AGPLv3 §13, and this design treats AGPLv3 as
  licence-cost-free elsewhere. What disqualifies it by default is that two of the
  three branches are not OSI-approved and somebody must make and record the
  election — and an organisation with no legal function has nobody to run that
  analysis. Valkey has no such analysis to run.
- **On a managed platform the engine is whichever managed cache that platform
  provides**, and the licence question never reaches the repo.
- Licence and version facts were checked 2026-07-29 and are in *Evidence and
  dates* below. **Re-check them at adoption**, not on the calendar.

*(Banned-dependency rule on the client packages plus an image-digest pin —
off-the-shelf hosts; the licence scan over the dependency graph is authored per
repo.)*

## The seam

- **`C-1` — ArchUnit over the cache adapter package.** The ban list must name the
  clients for **the engine this repo actually runs**, plus the in-process
  libraries and Spring's own cache abstraction; a Redis-family-only list on a
  Valkey repo is a gate with a hole, because Valkey's clients are separately
  named packages. (ArchUnit — off-the-shelf host; the package allowlist and the
  long-lived-bean field-type rule for the hand-rolled-memo case are authored per
  repo, **and that field-type rule needs a reviewed per-entry opt-out list** —
  see the named gap below.)
- **`C-2` — ArchUnit, and the annotations are banned by name.** `@Cacheable`,
  `@CachePut`, `@CacheEvict`, `@Caching`, and AOP aspects on domain code are on
  the repo's runtime-silent-behaviour ban list, alongside any caching decorator
  wired behind a domain interface. That ban list is itself an **executable
  ArchUnit test class, not prose**, with a meta-test asserting every entry is
  either enforced by a named test or explicitly marked deferred with a reason.
  (ArchUnit — off-the-shelf host; the domain-interface predicate is authored per
  repo.)
- **`C-3` — javac plus ArchUnit.** The loader port is declared with two abstract
  members, so **a lambda is a compile error** and every loader is a named class
  the architecture test can place; loader implementations and the database client
  are confined to the persistence package. **This wording is forced by a tool
  limit, not chosen for taste:** ArchUnit reads bytecode and cannot follow a
  lambda or a method reference into its body, so a rule of the form "the loader
  must query the database" is unsound by construction and must not be written.
  (Javac plus ArchUnit — off-the-shelf hosts; the port type is this repo's.)

## What a cache may hold

- **`C-4`, `C-5` — one ArchUnit rule over the port's declared methods and
  parameter types.** The port has no bare write and no atomic primitive: no
  set-if-absent, no increment, no list or stream operation. With `C-1` making the
  raw client unreachable, the cache cannot become a lock, a counter, a queue or
  an idempotency record. **The idempotency record the money rules require in the
  same transaction as the money effect must not live in the cache** — see `M-17`
  in the `money-api` skill and `M-40` in `money-storage`. (ArchUnit —
  off-the-shelf host; the predicate is authored per repo.)

## Keys and tenancy

- **`C-6` — ArchUnit on the factory and port signatures, plus two tests.** The
  key type has a private constructor and one static factory per key family; no
  factory and no port method accepts a free-text parameter. The scope type has no
  public constructor, so the request-context accessor is its only source.
  **Do not write this as a ban on string concatenation** — since Java 9 `+` on
  strings compiles to an `invokedynamic`, so the bytecode rule has no operand to
  match. That claim is challenged and unverified (see *Evidence and dates*), and
  the rule does not rest on it: an unwritable signature holds either way.

  The two backstops are not optional, because a signature rule cannot decide that
  the scope passed is the *current caller's*: a jqwik property test that distinct
  argument tuples render distinct keys — which is the injectivity `C-6`'s stated
  property follows from — and a **two-tenant Testcontainers test per cached read
  path** that seeds two tenants, warms as one and reads as the other. The second
  is the outside oracle; the property test only varies what its generator varies.
  (ArchUnit — off-the-shelf host, predicate per repo; the property test and the
  two-tenant test — bespoke.)

## Expiry

- **`C-7` — ArchUnit for the construction confinement, a JUnit test for the
  ceiling.** The expiry type is constructible only in the catalog package, so no
  call site can pass one the lint never sees; a JUnit test over the committed
  catalog asserts every expiry is at or below the repo's committed staleness
  ceiling. **The ceiling's value is this repo's call and must be a
  machine-readable value in the committed catalog** — a test cannot read prose.
  (ArchUnit — off-the-shelf host; the catalog test — bespoke.)
- **`C-8` — type design plus a Testcontainers test per path**: read a missing
  key, create it, read again, assert found. The loader's return type
  distinguishes a value from an absence and the adapter drops an absence by
  default. (Bespoke.)

## Coherence and invalidation

- **`C-9` — ArchUnit for the confinement, a Testcontainers rollback test, and
  spec-and-review for the residue.** The port's invalidate operation is reachable
  only from the transaction seam's post-commit callback. **The ordering is
  enforced by confinement, not by a test** — "a rolled-back write leaves nothing
  cached" and "a committed write leaves nothing stale" are both satisfied by a
  delete-before-commit implementation in a sequential test, so naming only the
  test would ship a gate with a blind spot.

  **Two interlocks this stack must get right.** First, post-commit registration
  is a **named member of the cache port** — `invalidateAfterCommit(key)` — with
  no free-callback form, and any other post-commit registration in the repo is
  banned; a general `afterCommit(Runnable)` would become the hole an
  outbox-confinement rule falls through, and nothing at a call site
  distinguishes "delete a cache key after commit" from "publish after commit".
  Second, **delete-after-commit is correct here and is the wrong shape for a
  broker publish** — a lost delete is a stale read bounded by the ceiling that
  self-heals, a lost publish is an unbounded permanent absence. Do not carry
  either verdict over to the other. That other rule set is not published in this
  skill set. (ArchUnit — off-the-shelf host, predicate per repo; the rollback
  test — bespoke; the residual ordering — spec and review.)

## Serialization

- **`C-10` — Error Prone on source, plus a property test per cached type. This
  is the one place this stack diverges from the rule's natural host, and the
  reason is erasure.** Generics erase, so ArchUnit — reading bytecode — sees the
  cache port's value type parameter as `Object` and would report green while
  protecting nothing. That is the same erasure trap as the unloggable-domain-type
  rule on this stack, where ArchUnit sees a logger's erased `Object...` signature
  rather than the argument's static type — **that rule belongs to a platform rule
  set not published in this skill set**, so the trap is recorded here rather than
  cited. The concrete type
  is known at the **catalog registration site** and a source-level checker sees
  static types, so the check goes there. A stack with reified generics will not
  have this divergence; a structurally typed one will have it worse. (Error Prone
  — off-the-shelf host, the check authored per repo; plus a
  serialize-then-compare property test per cached type — bespoke.)
- **`C-11` — a Maven plugin plus Jackson configuration.** The plugin computes
  each cached value's shape hash into a committed file with a `check` goal that
  diffs it, so an undiffed shape change fails the build; Jackson is configured
  strict — `FAIL_ON_UNKNOWN_PROPERTIES` and constructor-bound deserialization —
  as the backstop where the shape is unchanged but its meaning is not. A
  hand-bumped version integer is rejected: forgetting to bump it is exactly the
  failure this prevents. (The plugin — bespoke; the Jackson configuration —
  off-the-shelf.)

## Failure behaviour

- **`C-12` — Error Prone `EmptyCatch` promoted to `ERROR`, a Toxiproxy test per
  read-path class, and spec-and-review for the rest.** The Toxiproxy test cuts
  the cache connection and asserts either a database answer or a coded error.
  **Named gap, and it is the important one here: a swallowing catch is invisible
  to this toolchain.** ArchUnit exposes a catch block's caught type but not its
  body, and `EmptyCatch` does not fire on `catch (e) { return
  Optional.empty(); }` — that block is not empty. Wiring an ArchUnit rule here
  would report green over the case the rule exists to catch. The general half
  stays spec and review, the same shape and the same reason as the money rule on
  caught exceptions (`M-5`). (Error Prone — off-the-shelf, for the empty case
  only; the Toxiproxy test — bespoke; the general case — spec and review.)

## Evidence gates

- **`C-13` — three maven-failsafe executions**, a test-scoped always-miss cache
  binding, and Toxiproxy for the fault arm. Normal and always-miss must produce
  identical observable results; under fault injection every answer either matches
  the cache-off answer or is a coded error; and the normal run fails if any
  catalogued cache records zero hits. (Bespoke.)
- **`C-14` — hit and miss counters on the port, asserted per configuration**, and
  the fault arm asserts the injected fault was observed. **The two tool facts
  that make this a separate rule rather than a clause are confirmed for this
  stack**: Spring's `NoOpCacheManager` is documented as accepting items and not
  storing them, so the always-miss arm's pass condition is byte-identical to that
  arm never having been applied; and the Testcontainers Toxiproxy module applies
  toxics imperatively with **no toxic-verification API and no assertion helper**.
  Spring Boot's profile validation governs the profile-name *pattern*, not
  whether a profile exists or is used, so a mis-named test profile raises
  nothing. Without this rule, a bean override that does not win makes all three
  runs the normal run and the gate reports green over everything. (Bespoke.)
- **`C-15` — an annotation processor or a test generating the catalog, with
  regenerate-and-diff in CI.** It is machinery, not documentation: the ceiling
  test reads it (`C-7`), the negative-caching opt-in reads it (`C-8`), the
  serialization check reads it (`C-10`), and the three-configuration gate
  enumerates it (`C-13`, `C-14`). (Bespoke.)
- **`C-16` — the Decision Trace line.** The plan or spec introducing the first
  cache records that these rules bind it, at the plan approval gate.
  (Convention — spec and review.)

## Wiring the gates

Run this once per repo, in the PR that lands the first cache — not per cache
change. Instructing an agent does nothing for a gate: **the gate is what catches
the next agent**, and an unwired gate is a rule described as enforced that is
not.

1. **ArchUnit** — the adapter seam with an engine-complete client ban list and
   the long-lived-bean field-type rule (`C-1`); the domain-interface predicate
   and the annotation ban entries (`C-2`); loader and database-client confinement
   (`C-3`); the port's declared methods and parameter types (`C-4`, `C-5`); the
   key factory and port signatures (`C-6`); expiry construction confinement
   (`C-7`); invalidate confinement to the post-commit callback (`C-9`). Fails the
   build.
2. **The loader port with two abstract members** (`C-3`) and the port's absent
   signatures — no bare write, no atomic primitive, no free-text parameter, no
   call-site expiry (`C-4`, `C-5`, `C-6`, `C-7`). **Owning the port is what makes
   these unwritable rather than lint-banned**, which is the stronger gate.
3. **The ban list as an executable ArchUnit test class**, with the caching
   annotations named and the meta-test that every entry is enforced or explicitly
   deferred with a reason (`C-2`).
4. **Error Prone** — the registration-site serialization check (`C-10`), and
   `EmptyCatch` promoted from its default `WARNING` to `ERROR` (`C-12`); at
   `WARNING` it gates nothing.
5. **Jackson strict deserialization** and **the Maven shape-hash plugin** with
   its committed file and `check` goal (`C-11`).
6. **The catalog generator** and its regenerate-and-diff CI step (`C-15`), and
   the committed staleness ceiling as a machine-readable value in it (`C-7`).
7. **The JUnit catalog test** asserting every expiry is at or below the ceiling
   (`C-7`).
8. **The Testcontainers tests** — two-tenant per cached read path (`C-6`),
   negative-caching read-create-read (`C-8`), the rollback test (`C-9`), and the
   Toxiproxy fault test per read-path class (`C-12`).
9. **The jqwik property tests** — distinct tuples render distinct keys (`C-6`)
   and serialize-then-compare per cached type (`C-10`).
10. **Three maven-failsafe executions** with the test-scoped always-miss binding
    and the Toxiproxy arm (`C-13`), plus **hit and miss counters on the port
    asserted per configuration** (`C-14`). Wire `C-14` in the same change as
    `C-13`, never after: until it exists, `C-13` cannot be trusted at all.
11. **The engine pin** — the image digest and the client-package ban list, plus
    the licence scan over the dependency graph.

**Then commit the record**, in the repo's own text — its constitution, its rules
file, or a decision record. One line per directive id: the tool, and either
*wired* or *deferred with the reason and who owns it*. These entries are already
known and belong in that record on the first run:

- **`C-12`'s general half and `C-9`'s residual ordering — spec and review**, with
  `C-12` carrying only the partial `EmptyCatch` gate. Neither has a full build
  gate by design.
- **`C-16` — spec and review** at the plan approval gate.
- **`C-7`'s engine-side eviction gap** — nothing in this build reads the cache
  server's memory policy.
- **`C-1`'s hand-rolled-memo half** — the field-type rule's opt-out list, and how
  many entries it needed. See the named gaps below.
- **`C-15`'s "what invalidates it" field** — prose, and no diff can check it
  against behaviour.
- **The jqwik version pin** — no cache directive owns it. Record the pin this
  repo runs and who owns it, because a repo without the money skills gets no pin
  from a skill at all. See the named gaps below.

A record that lists only what was wired reads as complete coverage. That is the
failure this step exists to prevent.

## Named gaps — where this stack can host no check

Silence reads as coverage, so each is stated.

1. **"The loader reads the authoritative store" is not decidable.** Confinement
   makes the banned *shape* uncompilable and puts loaders where the database
   client is the only reachable data source. It does not decide semantics.
2. **A swallowing catch is invisible** (`C-12`). Spec and review.
3. **Engine-side eviction is invisible to every check in this build** (`C-7`).
   Nothing in the Java toolchain reads the cache server's memory policy, so "has
   an expiry" is not "lives until its expiry".
4. **The three-configuration gate is coverage-shaped** (`C-13`). It proves
   recomputability only for the paths the suite drives. A green run is not a
   proof.
5. **The hand-rolled-memo half of the seam rule is partly undecidable** (`C-1`).
   A dependency ban catches the library case completely; a field-type rule over
   long-lived beans catches the plain-map case **over-broadly** and needs a
   reviewed opt-out list, which is a hole an agent can widen. **Unmeasured:**
   nobody has wired it and counted how many legitimate entries that list needs.
   If the number is large the rule is not carrying its weight, and the honest
   move is to name the gap instead of keeping the rule.
6. **The property-test library carries a version trap, and its pin is not a rule
   here.** `C-6` and `C-10` both name jqwik property tests. That library's
   version pin is a **cross-cutting dependency rule rather than a cache rule** —
   it binds every use of the library in the repo — so it is not stated as a cache
   check. `money-java` carries it, as `M-24`, with the version and the CI
   version-ceiling check; the value is not repeated here, because a pin copied
   into two skills drifts in one. **A repo that installs the caching skills and
   not the money skills therefore has no pin**, and must decide it at its own
   dependency review. Which skill should own it is unsettled.

**Not measured, and it is a real number for a three-person team:** running the
integration suite in three configurations **triples integration CI time**. No
repo has run it.

**In-process libraries — one checked, the rest not.** Caffeine 3.2.4 (2026-05-03,
Apache-2.0, last push 2026-07-28) was verified from its own release API.
**Guava's cache and every other in-process library were not** — no licence,
version or API-surface check. The rules ban them *outside* the seam, which needs
no such check; a repo that permits one *inside* the seam does that evaluation
itself.

## Evidence and dates

Java- and engine-specific claims. The platform-neutral evidence — what each
directive rests on, the full steelman for each rejected shape, the wordings that
must not be reintroduced, the nine-candidate engine survey, and what reopens a
decision — is in the `caching` skill's own `evidence.md`.

**Nothing in `C-1` … `C-16` is confirmed** — all sixteen are convention, and no
marker below promotes any of them. What is confirmed here is tool and licence
evidence.

| Claim | Marker | Date |
| ----- | ------ | ---- |
| Valkey 9.1.1 (published 2026-07-21), BSD-3-Clause in `COPYING`, TSC under LF Projects with a written cap of no more than one third of TSC members from one organisation (GitHub release API; `valkey-io/valkey` `COPYING` and `GOVERNANCE.md`) | confirmed | 2026-07-29 |
| Valkey guarantees compatibility with "Redis OSS 7.2 and all earlier open-source Redis versions" and existing Redis clients connect unchanged; the one stated incompatibility is that "RDB files produced by Redis CE 7.4 and later are not compatible" (`valkey.io/topics/migration/`) | confirmed | 2026-07-29 |
| Redis 8.8.1 (published 2026-07-23) is tri-licensed at the recipient's choice — RSALv2, SSPLv1, or AGPLv3; Redis 7.4–7.8 offer RSALv2 or SSPLv1 only, with no OSI-approved option (`redis/redis` `LICENSE.txt`, at those tags) | confirmed | 2026-07-29 |
| AGPLv3 §13 triggers only "if you modify the Program", and §0 defines modifying as adapting, "other than the making of an exact copy" — so running an unmodified server as a backing service does not trigger it (`gnu.org/licenses/agpl-3.0.txt`) | confirmed | 2026-07-29 |
| ArchUnit cannot follow a lambda or a method reference into its body (TNG/ArchUnit #1258, opened 2024-03-05, closed unresolved) — so "the loader must query the database" is unsound by construction and `C-3` makes the lambda uncompilable instead | confirmed | 2026-07-29 |
| ArchUnit exposes a catch block's caught type but not its body (TNG/ArchUnit #1120, still open), and Error Prone's `EmptyCatch` does not fire on a catch that returns a default — so a swallowing cache-error catch is invisible to this toolchain | confirmed | 2026-07-29 |
| Error Prone's `EmptyCatch` is `WARNING` by default, so it must be promoted to `ERROR` to gate a build, and it skips a commented or `ignored`/`expected` block (errorprone.info) | confirmed | 2026-07-25 |
| Spring's `NoOpCacheManager` "will simply accept any items into the cache, not actually storing them", so the always-miss arm's pass condition is byte-identical to the arm never having been applied | confirmed | 2026-07-29 |
| The Testcontainers Toxiproxy module documents toxics applied imperatively with no toxic-verification API and no assertion helper; its own example verifies at application level instead | confirmed | 2026-07-29 |
| Spring Boot's profile validation setting governs the profile-name *pattern*, not whether the profile exists or is used, so a mis-named test profile raises nothing | confirmed | 2026-07-29 |
| Caffeine 3.2.4, 2026-05-03, Apache-2.0, last push 2026-07-28 (its own release API) | primary-source verified — one researcher, no panel | 2026-07-29 |
| Since Java 9, `+` on strings compiles to an `invokedynamic`, so a bytecode rule banning key concatenation has no operand — **contested, see below** | confirmed by this stack's pass; **challenged and unverified by a later audit** | 2026-07-29 |

**The one contradiction between sources, recorded rather than resolved.** This
stack's pass records the `invokedynamic` claim as confirmed. A later hostile
audit, run for the asynchronous-handoff rule set, argued the claim is too
strong — the concatenation recipe travels as a constant-pool bootstrap argument,
so a bytecode-reading rule may have an operand after all — and **could not reach
the primary specification, which returned HTTP 403**. Neither reading is
adopted here, because **no rule depends on which is right**: `C-6` is a
parameter-type rule, and a factory that cannot take a free-text parameter makes
the wrong call uncompilable regardless. If the challenge is ever verified, delete
the impossibility clause from `C-6`'s entry above and leave the rule unchanged.

**Managed cache pricing — partly checked, and the gap is named.** Prices move, so
each figure carries its source and date and **must be re-checked at adoption**:

- **Azure**, from Microsoft's own retail-prices API, `eastus`, USD,
  `priceType eq 'Consumption'`, read 2026-07-29: Azure Managed Redis **Balanced
  B0 at $0.016/hour**; Azure Cache for Redis **Basic C0 at $0.022/hour** and
  **Standard C0 at $0.055/hour**. No free tier. **Filter on `priceType` and check
  for duplicate meters before quoting** — Premium P1 returns two rows,
  $0.277/hour on a meter effective 2019-05-01 and $0.555/hour on one effective
  2016-01-01, so a naive read of that SKU gives whichever row came first.
- **AWS ElastiCache Serverless**, from the AWS pricing page, US East (N.
  Virginia), read 2026-07-29: **$0.084 per GB-hour** stored and **$0.0023 per
  million ECPUs** for Valkey; Memcached is $0.125 and $0.00340. **The
  discriminator that matters at this scale is the billing floor, not the rate:**
  the minimum is **100 MB per cache for Valkey** against **1 GB for Redis OSS and
  Memcached** — a ten-fold difference in the monthly minimum for a small cache.
- **Not obtained: Google Cloud Memorystore pricing.** Its tables render
  client-side and did not resolve to text. No figure is quoted rather than one
  guessed, and the provider is named so a reader on that platform can tell the
  gap is theirs.

**Do not cite.**

- **"Redis is no longer open source" as the rejection ground.** It was true of
  7.4–7.8 and is **false of 8.x**, which may be taken under the AGPLv3. The real
  grounds are the recorded election, the two non-OSI branches, and having nobody
  to run that analysis.
- **AWS's own "33% lower pricing" claim as a computed saving.** The page states
  it verbatim but publishes Valkey's and Memcached's serverless rates and **not**
  Redis OSS's, so nothing on the page lets a reader verify the comparison. Cite it
  as a vendor claim or not at all. The saving this pass stands behind is the
  billing floor.
- **ArchUnit for anything inside a lambda body, a catch block body, or a generic
  type parameter.** Three separate confirmed limits, three separate rules
  reworded because of them.
- **An in-memory cache substitute for the `C-13` and `C-14` runs.** The
  behaviour under test is the wiring's, and a no-op manager is documented as
  indistinguishable from an unapplied binding.
- **Guava's cache, or any in-process library other than Caffeine, as checked.**
  Only Caffeine was verified this pass.
- **The nine-candidate engine survey as this stack's work.** It is
  platform-neutral and lives once, in the `caching` skill's own `evidence.md`.

**Review by 2027-01-29.** Past that date every **confirmed** marker above reads
as **convention** until a new pass re-dates it. The version pins and the prices
age fastest — re-check Valkey, Redis, Caffeine and the managed pricing at
adoption, not on the calendar.
