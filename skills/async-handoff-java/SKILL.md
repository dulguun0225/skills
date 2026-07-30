---
name: async-handoff-java
description: The Java checks that make the asynchronous-handoff rules fail the build — which tool enforces each directive on Java, Spring Boot, Spring for Apache Kafka, ArchUnit, Error Prone, Jackson, jOOQ, Flyway, Maven, JUnit, jqwik, Testcontainers and Toxiproxy — plus the broker pick (Apache Kafka in KRaft mode, with Redpanda and AutoMQ banned by name), the outbox-library pick, the one-time gate wiring, and the named gaps where this toolchain can host no check. Load in a Java repo alongside the async-handoff skill, before publishing a message, adding a queue or broker client, an in-process event bus, an executor submit, an @Async or @Scheduled task, a polled table, or an outbound webhook. Every check here except the broker and outbox picks is keyed to a directive id that lives in async-handoff; the composite-shape checks are in shapes.md.
---

# Asynchronous-handoff discipline: the Java checks

**Install this skill with `async-handoff`.** Every check below is keyed to a
directive id — `E-1` … `E-28`, `E-32`, `E-33` — and **every one of those ids
lives in `async-handoff`, not here**. This skill names the tool and adds only what
is Java-shaped; it does not restate a directive, its reasoning, or the default it
overrides, so read alongside, not instead.

**The composite-shape checks are in [shapes.md](shapes.md)** — `E-29` … `E-31`,
`E-34` … `E-36`, whose directives live in `async-handoff-shapes`. Read that file
when a flow commits in more than one transaction, when a webhook crosses the
organisation's boundary, or when a payload cannot meet its size limit.

**Two directives here have no id, and that is deliberate: the broker pick and the
outbox-library pick.** Which transport the repo runs and whether the relay is
hand-written are not rules in `async-handoff` — their gates are deployment-shaped
rather than language-shaped, and their right answers vary *within* a stack. So
they are stated here, as this skill's own directives. **Contrast the money skills,
where every `money-java` entry is keyed to an `M-n`:** a reader who assumes that
invariant holds everywhere would hunt for a missing directive. The
platform-neutral nine-candidate transport survey behind the broker pick is in the
`async-handoff` skill's own `evidence.md`.

**The stack.** Java as pinned in the build, Spring Boot, Spring for Apache Kafka,
ArchUnit, Error Prone, Jackson, jOOQ, Flyway, Maven with failsafe, JUnit, jqwik,
Testcontainers with Toxiproxy, PostgreSQL for the outbox and the dedup record.

**The version pairing these checks assume, read from the Spring Boot dependency
manifest 2026-07-29:** Boot 4.1.0 manages spring-kafka 4.1.0, kafka-clients 4.2.1,
jOOQ 3.21.5 and Testcontainers 2.0.5. ArchUnit is 1.4.2 (2026-04-18). **Pin the
gates to these and re-check at adoption.**

**First ask whether the work has to leave the caller's control flow**, and note
one consequence of the broker pick below that is easy to miss: **until the named
cluster owner exists, this service has no compliant asynchronous path, and the
correct response is to keep the work synchronous rather than improvise a
transport.**

## The broker pick

- **The self-hosted broker is Apache Kafka in KRaft mode, pinned by image digest,
  and a named person owns the cluster, its upgrade calendar and its metadata
  version. That owner is a prerequisite, not a condition.** Kafka is Apache-2.0
  under foundation governance and is the only candidate that is both a replayable
  log and a work queue with per-message acknowledgement while holding no feature
  back — every security mechanism ships free, where two rivals put role-based
  access control behind a licence key. Its documented minimum is three or more
  controllers, and the only route to three total nodes is combined mode, which its
  own documentation calls not recommended for critical deployments; **a metadata
  downgrade out of 4.3 is unsupported, so finalising an upgrade is a one-way
  door.** On Kubernetes, Strimzi carries that load.
- **Off Kubernetes the substitute is NATS JetStream at three replicas** —
  Apache-2.0, one static binary, no external dependency, and the smallest
  operational surface of any candidate, which is why it is the substitute where
  the named owner has the least time to give. **It does not remove the ownership
  requirement.** Configure it against two documented traps: its file-sync interval
  defaults to **two minutes** and its own documentation says an operating-system
  failure in a non-replicated setup may lose data, and its storage directory
  defaults to a path under `/tmp`. A single-replica stream has no recovery path
  but a backup.
- **Redpanda is banned by name:** source-available under a business source
  licence rather than OSI open source, its additional-use grant excludes offering
  a queuing service, and role-based access control and identity-provider
  authentication are licence-gated.
- **AutoMQ is banned by name:** it is Apache-2.0, but it makes an object store you
  also operate mandatory, and its low-latency write-ahead log and **its metrics
  export are enterprise features** — a broker whose metrics export is paid cannot
  participate in `E-9`'s or `E-16`'s alerts.
- **RabbitMQ is permitted only where strict message priority is a stated
  requirement** — it is the only licence-cost-free candidate that has it — and then
  the plan records that community support runs roughly four months per minor
  series, that upgrades are strictly one series at a time, and that Erlang is
  pinned to a single major version. **The Erlang pin is a second runtime to track
  in a JVM shop that already tracks one.**
- **On a managed platform the transport is that platform's own queue or
  publish-subscribe service, never managed Kafka, unless a retained log is a
  stated requirement.** The deciding number is the billing floor, not the message
  rate: the queue-shaped and publish-subscribe services carry no minimum fee and a
  standing monthly free allowance, while every cluster-shaped managed service is
  priced per cluster-hour, so an idle cluster costs hundreds of dollars a month and
  the floor dominates a low-volume bill. **One shared cluster across teams is not
  the escape** — it creates a component no role in this organisation owns.
- Three grounds are Java-shaped and belong here rather than in the neutral survey:
  **Kafka's JVM heap, GC and page-cache tuning is a skill no role in this
  organisation holds**; its 4.0 upgrade mechanism removed
  `inter.broker.protocol.version` in favour of `metadata.version` via
  `kafka-features.sh`, so **an agent writing operational tooling from corpus memory
  produces a config key the broker rejects**; and the two bans above are the
  Java-ecosystem forms of the licence findings.
- Versions, licences and support windows checked 2026-07-29. **Re-check them at
  adoption**, not on the calendar. Prices move too, and expect at least one
  vendor's pricing page to render client-side and yield no figure at all.

*(Banned-dependency rules on the client packages plus an image-digest pin —
off-the-shelf hosts; the licence scan over the dependency graph is authored per
repo. The managed-platform pick is a plan decision — convention, spec and
review.)*

## The outbox and relay pick

- **The outbox and its relay are not hand-rolled unless the plan says why.** Three
  Apache-2.0 libraries on this stack write the outbox row in the caller's
  transaction and need nothing beyond PostgreSQL: **gruelbox transaction-outbox
  7.0.707**, which has a first-class jOOQ module and whose README states the
  polling loop "is up to you" — so the relay's lifecycle is the bespoke residue;
  **namastack-outbox 1.8.0**, with automatic schema creation; and **Spring
  Modulith's event publication registry 2.1.0**, which writes the log entry "as
  part of the original business transaction" with republication on restart opt-in
  — **its broker-externalization module was not verified.** `raedbh/spring-outbox`
  has no releases and is not recommended.
- **The change-data-capture route is a different trade and is rejected by
  default.** Debezium 3.6.0.Final is Apache-2.0, but its outbox router is a Kafka
  Connect single-message transformation, so it needs a Connect cluster or the
  standalone server, logical replication, a replication slot, and **a connector
  configuration that lives outside this build where no Maven gate can read it.**
  For a team with no operations role that is a second always-on system on top of
  the broker.
- **Match that router's expected outbox columns in the first migration anyway** —
  an aggregate id, an aggregate type, a payload, a timestamp and an event type.
  It costs nothing now, and it makes swapping the hand-written relay for a
  connector, or back, a configuration change rather than a rewrite. **Use a
  standard event envelope for every payload for the same reason:** the transport is
  the thing most likely to change and the payload shape should not have to.
- **A PostgreSQL queue extension is not a Java option, and the usual objection to
  it is wrong.** Its control file sets `superuser = false`, so the superuser claim
  is false; the real barriers are host filesystem access to place the extension
  files — its own documentation marks managed-cloud support as limited — and
  provider allowlisting, and it is **absent from the AWS RDS supported-extensions
  list** for every version checked. Its raw-SQL install works on a managed service
  but is unversioned with no upgrade path. It has no first-party Java client: of
  three third-party JVM clients, one is not on Maven Central and the others were
  last touched in 2024.
- Versions checked 2026-07-29.

*(Convention — a plan decision. The banned-dependency rule for the
change-data-capture path is off-the-shelf; the envelope is a bespoke schema lint
over the committed schema files.)*

## The seam

- **`E-1` — ArchUnit over a committed async-capable type list, plus a
  dependency-manifest check.** The list names the broker and queue clients,
  in-process event buses, `ExecutorService` submits,
  `CompletableFuture.supplyAsync`, `Thread.startVirtualThread`, `@Async`,
  `@Scheduled` and reactive subscribe operators; no class outside the adapter
  package may reference one. **The list is an allow-list, so a construct nobody
  thought of is a missing entry rather than a silent pass**, and the list file is
  reviewed like code. A new dependency matching the committed transport pattern
  fails the build until a catalog entry exists. (ArchUnit plus a
  dependency-manifest check — off-the-shelf hosts; the list, the predicates and
  the long-lived-bean field-type rule for the hand-rolled cases are authored per
  repo.)
- **`E-2` — ArchUnit on methods *and* classes, plus a generated subscription
  list.** Spring documents both binding paths — the reference states messages can
  be received "by configuring a `MessageListenerContainer` and providing a message
  listener or by using the `@KafkaListener` annotation", with container,
  container-properties, factory and endpoint-registry types all present — **so the
  annotation ban has a supported replacement and is not a demand to hand-roll the
  poll loop.** That fact is what the directive depends on.

  **Divergence, and it is the one to get right: the rule must cover the
  meta-annotated and class-level forms.** `@KafkaListener`'s `@Target` includes
  annotation types and classes as well as methods, so a repo can wrap it in its
  own annotation and **a methods-only, direct-annotation rule reports green while
  the banned thing passes.** Use both the annotated and meta-annotated predicates.
  (ArchUnit — off-the-shelf host, predicates per repo; an annotation processor or
  test generating the subscription list with regenerate-and-diff — bespoke.)
- **`E-3` — javac plus ArchUnit.** The handler port is declared with two abstract
  members, so **a lambda is a compile error** and every handler is a named class
  the architecture test can place; implementations are confined to the package
  permitted to depend on the domain services. **This wording is forced by a tool
  limit, not chosen for taste:** ArchUnit reads bytecode and cannot follow a lambda
  into its body. The second member also matters for `E-2`: a lambda handler is
  unnameable in the generated list, so the diff would produce rows nobody can act
  on. (Javac plus ArchUnit — off-the-shelf hosts; the port type is this repo's.)
- **`E-4` — a banned-dependency rule plus the `E-1` allow-list plus an outbox-read
  confinement rule.** An in-process event bus — including Spring's own application
  event publisher used as a handoff — is banned by dependency; reads of the outbox
  table are confined by ArchUnit to the relay package, **which is what makes "the
  table is not a transport" checkable rather than merely stated.** (ArchUnit —
  off-the-shelf host, predicates per repo.)

## The write path

- **`E-5` — ArchUnit for the confinement, plus a config assertion.** The publish
  call is reachable only from the relay package; the producer's acknowledgement and
  durability settings are asserted as committed values rather than relied on as
  defaults. **Nothing off the shelf detects a publish inside a transactional
  method** — see *Static analysis* below — so the confinement rule is the whole
  gate and its predicate is this repo's. (ArchUnit — off-the-shelf host, predicate
  per repo; the config assertion — bespoke. **Named gap:** broker-side durability,
  replica counts and minimum in-sync replicas are invisible to every check in this
  build.)

  **One off-the-shelf rule exists and it is worth wiring:** Error Prone's
  `FutureReturnValueIgnored` fires on a bare `kafkaTemplate.send(...)`, because the
  template returns `CompletableFuture<SendResult<K,V>>` and carries **no**
  `@CanIgnoreReturnValue`. It is `WARNING` by default and **must be raised to
  `ERROR` to gate a build.** Two limits: the idiomatic fix — chaining
  `whenComplete` — returns another future and fires again, so expect the noise; and
  a variable named with the tool's `unused` prefix silences it, **which an agent
  will find.**
- **`E-6` — javac and ArchUnit on the port signature, plus two Testcontainers
  tests. Do not try to check this with ArchUnit.** Whether a transaction is active
  at a call site depends on which callers reach it, on whether the call arrived
  through the Spring proxy at all — self-invocation bypasses it, identical
  bytecode, opposite runtime answer — on the propagation of every intermediate
  frame, and on which data source is in play, since the requirement is *the same*
  transaction and two transaction managers both satisfy "a transaction is active".
  A rule written there reports green over exactly the case it exists to catch.

  **Divergence: the handle cannot be jOOQ's own.** `transaction()` hands back a
  *derived* `Configuration` and the manual warns that using the outer scope inside
  the block will "silently run outside the transaction" — but **both are the same
  static type**, so no compiler, processor or bytecode reader distinguishes them,
  and `jooq-checker` (3.21.6) ships only a dialect checker and a plain-SQL checker.
  Spring offers strictly less: the transaction is thread-bound and ambient. So the
  repo owns a wrapper handle type, the compiler discharges the obligation at the
  call site, and **the rollback test is the thing that actually decides the
  property.** (Javac plus ArchUnit on the port signature and its referencing
  packages — off-the-shelf hosts, the type is this repo's; two Testcontainers tests
  — roll the business transaction back after the append and assert no outbox row
  and no published message, and kill the process after commit and before the relay,
  restart, and assert the message is published and observably once — bespoke. One
  data source and one transaction manager is a committed config fact, not a type
  fact: assert it.)
- **`E-7` — javac and ArchUnit for the type and the package ban, a Flyway
  constraint, a jqwik property test and a golden re-derivation test.** The identity
  type has a private constructor and one static factory per strategy; no clock or
  random source is reachable from the factory package; the column is
  `NOT NULL UNIQUE` in a committed migration; and a golden test re-derives every
  identity in the committed corpus from its payload. **The unique constraint alone
  is the wrong check** — a random value assigned at row-write time satisfies
  not-null, unique and "not generated at publish time" — so the re-derivation test
  is the half that matters. (Javac and ArchUnit — off-the-shelf hosts; the
  migration constraint, the property test and the golden test — bespoke.)
- **`E-8` — ArchUnit for the confinement, `FOR UPDATE SKIP LOCKED` in the claim
  query, and a Testcontainers kill test.** The relay claims rows at partition-key
  granularity inside a transaction, publishes before marking sent, never deletes an
  unsent row, and its concurrency and retention window are committed values. The
  claim query and its key granularity are this repo's. (ArchUnit — off-the-shelf
  host; the claim query plus a Testcontainers test that kills the relay between
  publish and mark-sent and asserts one observable effect — bespoke.)
- **`E-9` — Prometheus rules with `promtool` fire-tests, plus a Testcontainers
  outage test.** Two alerts: outbox depth above a committed threshold, and **the
  age of the oldest unpublished row**, which is the most important signal in this
  design and the one every consumer-side alert is blind to. The test holds the
  transport down past the threshold and asserts the alert fired and no business
  transaction was blocked. (`promtool` — off-the-shelf host, fixtures per repo; the
  outage test — bespoke.)

## The consume path

- **`E-10` — a config assertion on **two** settings, javac for the void port, and
  ArchUnit to keep the acknowledgement type out of handler packages. Two settings
  must be pinned, not one, and this is the finding most likely to be missed.**
  Spring's listener acknowledgement mode defaults to **`BATCH`, not `RECORD`** — it
  commits the offsets of all records from the previous poll once all have been
  processed, so a crash after record three of fifty redelivers all fifty, and
  reasoning about "at-least-once per record" is wrong about the **unit**. And the
  **share-consumer acknowledgement mode added in 4.1 has an implicit value under
  which the broker acknowledges every record regardless of processing outcome, with
  no listener involvement**, so a rule inspecting only the listener mode is green
  over it. Pin both, in the shape of a config-default assertion. (The config
  assertions — bespoke; javac for the void port and ArchUnit for the type ban —
  off-the-shelf hosts.)

  **Named gap: a catch that swallows by returning a default stays invisible to
  this toolchain** — ArchUnit exposes a catch block's caught type but not its body,
  and Error Prone's `EmptyCatch` does not fire on a block that returns a value.
  The same gap and the same reason the money rules (`M-5`) and the cache rules
  (`C-12`) record. Spec and review.
- **`E-11` — a sealed exception hierarchy plus a rule on the catch.** Terminal and
  retryable are sealed types, so no third option compiles; a `catch` in a handler
  package must rethrow one of them, which is an Error Prone or ArchUnit rule
  authored per repo. **Do not implement the terminal classification as a marker
  interface on a broad exception type** — if any exception can be re-tagged
  terminal at a catch site outside the handler, `E-16`'s attempt budget stops being
  a bound. (The sealed hierarchy — off-the-shelf via javac; the catch rule —
  bespoke.)
- **`E-12` — a JUnit test over the committed catalog and configuration, plus
  ArchUnit on the handler packages.** The test asserts the budget is at or below
  the lease and that batch size times per-item budget is at or below the budget;
  ArchUnit bans sleep, unbounded wait and un-timed outbound calls in handler
  packages. **The arithmetic is not hypothetical:** `max.poll.records` defaults to
  **500** against a `max.poll.interval.ms` of **300000**, so per-record work above
  roughly **600 ms** guarantees the redelivery loop. (Both hosts off-the-shelf,
  predicates per repo. **Named gap:** a handler that ignores interruption still
  overruns.)
- **`E-13` — ArchUnit on the transitive dependencies of the effect-free port's
  package, plus a Testcontainers duplicate test and a jqwik property test.** The
  effect-free port's package may not depend, transitively, on any repository, the
  outbox, the publish port, an outbound client or a file-write API — **so it has no
  way to have an effect.** The deduplicated port's effect operation takes the
  message identity and writes the dedup row in the same transaction, in this
  service's PostgreSQL — **never in the cache, never in a map field, never in the
  broker.** The idempotency record `M-17` requires in the money effect's own
  transaction is this same record, and `C-5` in the published `caching` skill
  already bans it from the cache. (ArchUnit — off-the-shelf host, predicate per
  repo; a Testcontainers test delivering one message twice and asserting one
  effect, plus a jqwik property test that the dedup key is a function of the
  identity alone — bespoke. **Named gap:** whether two *distinct* messages denote
  one effect is semantic.)
- **`E-14` — a JUnit test over the committed catalog.** It compares the committed
  dedup retention against the committed lease, attempt limit and redrive window on
  one side and the committed upper bound on the other. (Bespoke. **Named gap:** the
  operands are this repo's declarations of broker-side retention, which can be a
  lie.)

## Ordering

- **`E-15` — javac and ArchUnit on the factory and port signatures, a cross-field
  JUnit test over the catalog, and a Testcontainers out-of-sequence test per
  ordered subscription.** The key type has a private constructor and one factory
  per family; no factory and no port method accepts a `String`. **Ground the
  no-free-text clause on unwritability, not on bytecode** — a factory that cannot
  take a `String` makes the wrong call uncompilable, which holds regardless of how
  the compiler emits string concatenation, and the bytecode argument the cache
  rules once used for their key rule is challenged and unverified (see *Evidence
  and dates*).

  **`@RetryableTopic` is permitted only on `unordered` subscriptions**, because its
  own documentation states "By using this strategy you lose Kafka's ordering
  guarantees for that topic". It is also documented as unsupported with batch
  listeners and unable to combine with container transactions. (Javac and ArchUnit
  — off-the-shelf hosts, predicates per repo; the cross-field catalog test and the
  out-of-sequence Testcontainers test — bespoke. **Named gap:** that a handler
  assumes order *across* keys is not decidable.)

## Poison messages and retries

- **`E-16` — a JUnit test over the committed catalog, `promtool` fire-tests for
  both alerts, and a Testcontainers exhaustion test.** The five fields are a
  committed catalog row; the test asserts none declares unlimited attempts or a
  drop, and that every backoff has a non-zero minimum interval. **That last clause
  exists because of a specific default:** Spring's `DefaultErrorHandler` is bounded
  and tight-looping — ten total attempts with `FixedBackOff(0, 9)`, a
  **zero-millisecond** interval — so "retries are bounded" and "a backoff is
  configured" **both pass on a zero-delay ten-times hammer.**

  **And the silent drop is the platform default on the queue-shaped broker,
  with the log-shaped one asserted rather than sourced.** RabbitMQ drops the
  message past its delivery limit unless a dead-letter exchange is configured —
  that half is primary-source verified, in the `async-handoff` skill's own
  `evidence.md`. The claim that Kafka's share groups move a record to an archived
  state past the delivery-attempt limit, where it is not eligible for further
  delivery and is routed nowhere, is **this pass's own assertion with no
  primary-source citation recorded** (see the table below). The directive does not
  turn on it — `E-16` bans a `drop` declaration and unlimited attempts on every
  shape — so **do not cite it as documented behaviour; read the share-group
  documentation before relying on it.** (The catalog test and `promtool` —
  off-the-shelf hosts, fixtures per repo; the exhaustion test — bespoke.)
- **`E-17` — ArchUnit plus a catalog test, plus Testcontainers assertions on the
  destination and its partition.** ArchUnit bans sleep and park primitives in
  handler packages; the catalog test compares the terminal destination's retention
  against its source's and asserts the shape-conditional policy.

  **Assert the dead-letter topic's partition count as well as its name.**
  `DeadLetterPublishingRecoverer` **does not create its destination and does not
  fail loudly when it is missing**: the default destination is the source topic
  suffixed `-dlt` on the same partition number, its partition check logs an unknown
  topic at **DEBUG** and a missing partition at **WARN** before letting the
  producer choose one. So a test asserting "the failed record reached the
  dead-letter topic, partition N" **must assert the partition and must not rely on
  the recoverer to fail.** (ArchUnit and the catalog test — off-the-shelf hosts;
  the Testcontainers assertions — bespoke. **Weakest clause:** that a redrive was
  run from a console rather than the committed operation is not visible to this
  build — spec and review.)

## The payload as a published contract

- **`E-18` — a generator bound to the build with a `check` goal, plus ArchUnit on
  the port's parameter type.** Payload classes are generated from the committed
  schemas, the generated code is committed, and the `check` goal diffs it. (The
  generator — bespoke; ArchUnit — off-the-shelf host.)
- **`E-19` — a build-failing compatibility check over the committed history
  directory, and one apparent host must be refused by name.**

  **Divergence: the AsyncAPI route has no build-failing Java host.** The only Java
  Maven AsyncAPI comparator **detects incompatibilities and then passes the
  build** — its plugin declares three parameters, never throws a build-failing
  exception, writes a report file and exits green regardless; its repository has
  one published version, two stars and no commit since 2024. **That is a
  false-green gate shipped as a product, and this skill names it so nobody wires
  it.** The usable routes are the AsyncAPI **CLI** `diff` command, which does fail
  on breaking changes against a committed file with no network unless an opt-out
  flag is passed but is a Node binary invoked through an exec plugin; or **`buf
  breaking`** for Protobuf, which compares against a committed baseline including
  a git ref, needs no network, and is Apache-2.0.

  **And no tool on the JVM validates an actual published message against a
  committed AsyncAPI document** — the official parsers are JavaScript and Go, and
  the payload validators are Node, Python and TypeScript and cover payloads only,
  never headers or channel names.

  **The corpus-favourite schema registry is not usable in the self-hosted
  variant:** its own licence file puts the project under the Confluent Community
  License "except some modules such as the client-* and avro-* libs, which are
  licensed under the Apache 2.0 license", so it is not OSI open source. **Apicurio
  Registry 3.3.1 and Karapace 6.2.1 are Apache-2.0**; whether either is drop-in for
  a given client was **not verified**. Facts checked 2026-07-29. (A build-failing
  compatibility check over the committed history — bespoke host, off-the-shelf
  checker. **Named gap:** a checker decides shape and never meaning, so redefining
  an amount from gross to net passes every level — spec and review at the plan
  gate.)
- **`E-20` — a Jackson configuration assertion plus a parse test over a committed
  corpus.** Configure it in the adapter only, as committed values: **fail on
  missing creator properties, do not fail on unknown properties, and bind through
  constructors** so a missing field cannot be defaulted after construction. The
  parse test covers malformed, truncated, missing-field and extra-field payloads.
  The unknown-field meter and its alert rule are Micrometer plus a Prometheus rule.
  **Note that "counted and alerted" with no threshold and no owner is structurally
  the catch-log-continue `E-10` bans.** (The Jackson assertion and the meter —
  off-the-shelf; the parse test — bespoke.)
- **`E-21` — a bespoke schema lint plus a parse test plus ArchUnit for the
  dereference ban.** The lint reads the committed schema files for every content
  ban; the parse test covers the unrecognised enumeration value; ArchUnit enforces
  that a handler package may not depend on an outbound client for the service it
  consumes from. **The float ban is unqualified**, with any exception listed
  explicitly rather than scoped to "money fields", for the reason `M-2` gives — and
  **this is the float ban's fifth layer**, after the field (`M-2`), the wire
  (`M-12`), the column (`M-10`) and a cached value (`C-10`). **And do not log the
  message payload to make a consumer debuggable:** it copies personal data into a
  log store with its own longer retention and its own access control, and that copy
  is what survives after the destination's retention expires. (The schema lint and
  the parse test — bespoke; ArchUnit — off-the-shelf host. **Named gap:** personal
  data is not decidable without a type-level classification regime — the same gap
  the cache rules record.)

## Tenancy and replay

- **`E-22` — javac and ArchUnit, plus a two-tenant Testcontainers test per
  subscription.** A nominal data-scope type with no public constructor; an
  authorized-actor type whose constructor is unreachable from handler packages, so
  **a privileged call does not compile there**; ArchUnit bans the request-context
  accessor and any ambient scope holder in handler packages. The two-tenant test
  seeds two tenants and asserts each effect lands in its own scope. **That test is
  the outside oracle: its ground truth is the database, not an assertion written by
  the model that wrote the handler.** (Javac and ArchUnit — off-the-shelf hosts,
  predicates per repo; the two-tenant test — bespoke.)
- **`E-23` — ArchUnit on the handler packages plus a double-pass replay test.**
  ArchUnit bans clock and random sources in `replay-safe` packages; the replay test
  processes a committed message corpus twice and asserts the second pass produces
  no additional observable effect. **State the exemption or this contradicts three
  other checks:** what is banned is reading a clock as a value that reaches an
  effect or a payload — expiry windows and telemetry timestamps are computed inside
  the dedup and telemetry adapters, which a handler calls without reading time
  itself. (ArchUnit — off-the-shelf host, predicate per repo; the replay test —
  bespoke. **Named gap:** "the handler is a total function of the message" is not
  decidable; these are proxies.)

## Evidence gates

- **`E-24` — four maven-failsafe executions against a Testcontainers broker**,
  with a test-scoped duplicating and reordering harness and Toxiproxy for the
  fault arm. The arms are split by the ordering declaration, per the directive.

  **`EmbeddedKafkaBroker` is not deprecated and the documentation records no
  divergence from a real broker** — `testing.adoc` contains zero occurrences of
  "testcontainer", and since 4.0 only the KRaft implementation exists. **So "prefer
  Testcontainers because the embedded broker diverges" is a bet, not a citation,
  and must not be written as one.** The documented caveats are operational: no
  shutdown mechanism when tests finish, do not mix a global embedded broker with
  per-class ones, and use a distinct topic per test. Containers are still the
  default here because the fault and multi-instance arms need a real network
  surface — state that as the reason. (Bespoke.)
- **`E-25` — counters on the adapter asserted per configuration, `promtool`
  fire-tests, and one violating fixture per ArchUnit rule.** Hit, duplicate,
  reorder and fault counters carry the positive controls; the normal arm fails if
  any subscription **in the committed catalog** processed zero messages.

  **Three tool facts make each clause necessary rather than defensive, and their
  markers differ — read them as marked, not as one block.** Two of the three were
  **confirmed** by the cache rules' pass, which ran the three refutation votes
  this pass did not: the Toxiproxy limit and the no-op cache manager, both
  carried with that marker in `caching-java`. The `failOnEmptyShould` finding is
  this pass's own and is **primary-source verified, not confirmed** — see the
  table below. The Toxiproxy module confirms nothing about itself — its client
  exposes only name, stream, toxicity and remove, with no
  counter, no bytes-affected and no fired flag — **and toxicity is a
  probability**, so a registered toxic can legitimately not affect the call under
  test; a chaos test asserting only "the toxic was added and the call succeeded"
  cannot distinguish tolerance from a fault that never arrived. **ArchUnit rejects
  an empty should-clause by default** (since 0.23.0) **but the guard is one line
  from being disabled** — a property or a per-rule override, neither visible in a
  passing build log — and it does not cover an importer pointed at the wrong path;
  **this finding is not broker-specific and applies to every ArchUnit gate in this
  repo.** And a no-op cache manager is byte-identical to its binding never having
  been applied, which is the same shape the cache rules record. (Bespoke.)

## The catalog, the topology, and the plan

- **`E-26` — one Java `record` with every component required, plus an annotation
  processor or test generating the catalog with regenerate-and-diff.** A record
  with no defaults and no builder is what makes the ~twenty fields per subscription
  exist at the registration site at all; **without it the catalog is generated in
  part and hand-maintained in part, and the diff cannot tell which half drifted.**
  (The record — off-the-shelf via javac; the generator — bespoke. **Named gap:** the
  owning-team field is prose no diff can check against behaviour, **and the catalog
  is repo-local** — the cross-repository union check has no host on this stack.)
- **`E-27` — a bespoke schema lint over the committed topology file**, with the
  partition-count change behind a review gate. (The lint — bespoke; the review gate
  — spec and review.)
- **`E-28` — the Decision Trace line.** The plan or spec introducing the first
  asynchronous handoff records that these rules bind it, and names the
  destination, its catalog row, the ordering declaration and every team expected
  to consume it, at the plan approval gate. (Convention — spec and review.)

## The two bans

- **`E-32` — ArchUnit banned dependencies by group id, plus a query-package
  rule.** Event-store and event-sourcing framework clients are banned from a
  committed group-id list, and no query or read-model package may depend on the
  messaging adapter or on the outbox tables.

  **Both banned architectures have a first-class Java presence, which is exactly
  why the ban has to be a dependency rule.** Axon is a JVM-native event-sourcing
  framework whose **Framework is Apache-2.0 while its Server is not** — an agent
  reading "Axon is open source" is reading something true about the wrong
  artifact — and EventStoreDB moved to the Event Store License v2 with its 24.10
  release, where enterprise features need a licence key. Licences checked
  2026-07-29; re-check at adoption. (ArchUnit — off-the-shelf hosts. **Named
  gap:** whether a projection is being treated as the authority is semantic and
  unreachable; the decidable half is the dependency direction.)
- **`E-33` — ArchUnit banned dependencies plus ArchUnit field rules plus a
  two-instance Testcontainers arm.** Kafka Streams, the framework's Kafka Streams
  binder and the other stream-processing libraries are banned by dependency —
  **Kafka Streams ships in the same ecosystem as the client the repo legitimately
  needs, so it is one dependency line away at all times.** The field rules — no
  non-final field and no static collection in handler or flow packages — catch the
  hand-rolled version, which is what gets written once the dependency is banned.
  The two-instance arm runs a second consumer container and asserts the same
  aggregate query answers identically however the messages were split.
  Documentation checked 2026-07-29. (ArchUnit — off-the-shelf; the two-instance arm
  — bespoke. **Named gap:** a wrong window committed as a parameter passes every
  check; the committed parameter is what puts it in a diff.)

## Static analysis — one usable rule, and a documented absence

A sweep of Error Prone, SpotBugs, all 714 sonar-java rules, PMD, fb-contrib,
find-sec-bugs and error-prone-support, 2026-07-29:

- **One off-the-shelf rule exists and it is worth wiring:** Error Prone's
  `FutureReturnValueIgnored`, on a bare `kafkaTemplate.send(...)`. `WARNING` by
  default, so **promote it to `ERROR`**. Two limits, both recorded above under
  `E-5`.
- **Nothing exists for the three rules that matter most.** No rule in any of those
  indexes detects a publish inside a transactional method, a consumer
  acknowledging before handling, or an unbounded retry; **`acknowledg*` returns
  zero hits across every index.** The nearest transaction rules concern
  self-invocation, non-public proxied methods and rollback-for declarations, and
  **none reasons about what a transactional method calls out to.** So `E-5`,
  `E-6`, `E-10` and `E-16` are **bespoke on this stack** — which is a fact about
  the toolchain, not a weakness of the rules, and it is why their evidence is a
  test rather than a lint.
- **Not searched, and absence is not claimed for them:** Semgrep, CodeQL and
  commercial analysers. A "publish inside `@Transactional`" pattern is plausible in
  either and **would be the cheapest upgrade available** — recorded as a trigger in
  the `async-handoff` skill's own `evidence.md`.

## Wiring the gates

Run this once per repo, in the PR that lands the first asynchronous handoff — not
per messaging change. Instructing an agent does nothing for a gate: **the gate is
what catches the next agent**, and an unwired gate is a rule described as enforced
that is not.

1. **The ports, first, because owning them is what makes the wrong call
   unwritable rather than lint-banned.** The two-abstract-member handler port
   (`E-3`); the void handler port with adapter-private acknowledgement (`E-10`);
   the transaction-handle wrapper this repo owns (`E-6`); the private-constructor
   identity type with one factory per strategy (`E-7`); the private-constructor key
   type with no `String` parameter (`E-15`); the sealed terminal/retryable
   hierarchy (`E-11`); distinct effect-free and deduplicated ports (`E-13`); the
   data-scope and authorized-actor types (`E-22`); and the one required
   registration `record` (`E-26`).
2. **ArchUnit** — the adapter seam over the committed async-capable type list
   (`E-1`); the annotation ban on methods **and** classes with both the annotated
   and meta-annotated predicates (`E-2`); handler-implementation confinement
   (`E-3`); the in-process-bus ban and outbox-read confinement (`E-4`); publish
   confinement to the relay (`E-5`); the port signature and its referencing
   packages (`E-6`); the identity factory's package ban on clocks and random
   sources (`E-7`); relay claim and publish confinement (`E-8`); the
   acknowledgement type out of handler packages (`E-10`); the catch rule (`E-11`);
   no sleep, unbounded wait or un-timed call in handler packages (`E-12`, `E-17`);
   the effect-free port's transitive dependencies (`E-13`); the dereference ban
   (`E-21`); the request-context accessor and ambient scope holders (`E-22`);
   clocks and random sources in `replay-safe` packages (`E-23`); the banned-group-id
   lists and the query-package rule (`E-32`); and the field rules (`E-33`). Fails
   the build.
3. **Every ArchUnit rule ships a committed violating fixture that must fail the
   build** (`E-25`). `failOnEmptyShould` is one line from being disabled and the
   disabling is invisible in a passing log. **This applies to every ArchUnit gate
   in the repo, not only these.**
4. **Error Prone** — `FutureReturnValueIgnored` promoted from `WARNING` to
   `ERROR` (`E-5`), and the handler-catch rule if it is hosted there rather than in
   ArchUnit (`E-11`).
5. **The config-default assertions** — the listener acknowledgement mode **and**
   the share-consumer mode (`E-10`); the producer acknowledgement and durability
   settings (`E-5`); the Jackson strictness settings (`E-20`); the decoder
   configuration in the adapter only (`E-20`).
6. **Flyway** — the outbox table with the `NOT NULL UNIQUE` identity column
   (`E-7`), matched to the change-data-capture router's expected columns, and the
   dedup table.
7. **The catalog generator** and its regenerate-and-diff CI step (`E-26`), plus
   the subscription-list generator and diff (`E-2`), plus the payload generator
   with its `check` goal (`E-18`).
8. **The JUnit catalog tests** — the processing budget against the lease (`E-12`);
   the dedup retention bounds (`E-14`); the cross-field ordering rules (`E-15`);
   the five failure-policy fields (`E-16`); the terminal-destination retention
   comparison (`E-17`); the committed compatibility level against the retention
   declaration (`E-19`).
9. **The compatibility gate over the committed schema-history directory**
   (`E-19`) — the AsyncAPI CLI through an exec plugin, or `buf breaking`. **Not
   the Java Maven AsyncAPI comparator.**
10. **The bespoke schema lints** — the payload content bans (`E-21`); the
    committed topology file (`E-27`); the event envelope.
11. **`promtool` fire-tests** — relay depth and oldest-unpublished-row age
    (`E-9`); terminal-destination arrivals and staleness with a heartbeat
    (`E-16`); the unknown-field alert (`E-20`).
12. **The jqwik property tests** — same row, same identity (`E-7`); the dedup key
    is a function of the identity alone (`E-13`).
13. **The Testcontainers tests** — the rollback and kill-after-commit arms
    (`E-6`); kill the relay between publish and mark-sent (`E-8`); the transport
    outage arm (`E-9`); a throwing handler sees the message again (`E-10`, `E-11`);
    one message twice, one effect (`E-13`); out-of-sequence per ordered
    subscription (`E-15`); attempt-count exhaustion with the dead-letter partition
    asserted (`E-16`, `E-17`); the parse-test corpus (`E-20`, `E-21`); two tenants
    per subscription (`E-22`); the double-pass replay (`E-23`); and the
    two-instance aggregate arm (`E-33`).
14. **Four maven-failsafe executions** with the duplicating and reordering harness
    and the Toxiproxy arm (`E-24`), plus **the per-configuration counters and
    positive controls** (`E-25`). **Wire `E-25` in the same change as `E-24`, never
    after: until it exists, `E-24` cannot be trusted at all.**
15. **The broker pin** — the image digest, the client-package ban list, and the
    licence scan over the dependency graph. **And the named cluster owner**, which
    is a prerequisite rather than a gate: record the person.
16. **If the repo has a flow across transactions, a webhook, or an oversized
    payload**, wire the gates in [shapes.md](shapes.md) too.

**Then commit the record**, in the repo's own text — its constitution, its rules
file, or a decision record. One line per directive id: the tool, and either
*wired* or *deferred with the reason and who owns it*. **These entries are already
known and belong in that record on the first run:**

- **`E-5`, `E-6`, `E-10` and `E-16` are bespoke on this stack** — nothing off the
  shelf detects a publish inside a transactional method, an acknowledgement before
  handling, or an unbounded retry. Their evidence is a test.
- **`E-10`'s swallowing-catch half — spec and review.** Same gap as `M-5` and
  `C-12`.
- **`E-17`'s console-redrive clause — spec and review.** No check in a repository
  sees a button being clicked.
- **`E-19`'s meaning half — spec and review** at the plan gate. A compatibility
  checker decides shape, never meaning.
- **`E-26`'s cross-repository union check — no host.** This is the most
  consequential gap in the set for this organisation.
- **`E-27`'s partition-count review gate and `E-28` — spec and review.**
- **Broker-side and infrastructure configuration is invisible to every check in
  this build** (`E-5`, `E-14`, `E-27`) — durability, replica counts, minimum
  in-sync replicas, retention and delivery limits as actually deployed. **The
  catalog's declarations are the lints' operands and they can be a lie.**
- **The jqwik version pin** — no directive here owns it. Record the pin this repo
  runs and who owns it. See the named gaps below.

**A record that lists only what was wired reads as complete coverage. That is the
failure this step exists to prevent.**

## Named gaps — where this stack can host no check

Silence reads as coverage, so each is stated.

1. **A swallowing catch is invisible** (`E-10`), unchanged from the money and cache
   rules. The void handler port reduces it — there is no default to return — but
   the general case is spec and review.
2. **Broker-side and infrastructure configuration is invisible to every check in
   this build** (`E-5`, `E-14`, `E-27`). The catalog's declarations are the lints'
   operands.
3. **The same-transaction property is decided by a test, not a type** (`E-6`), per
   the jOOQ divergence above.
4. **A hand-rolled request-reply pair** built from two subscriptions and a
   correlation id is not decidable (`E-1`).
5. **The cross-repository union check has no host** (`E-19`, `E-26`). The catalog
   and the schema gate are repo-local, so a producer renaming a subject cannot see
   the other seventeen services. **This is the most consequential gap here and it
   needs infrastructure that does not exist.**
6. **The AsyncAPI path has no build-failing Java host** (`E-19`), and the one that
   looks like it is a false-green gate — named above so nobody wires it.
7. **The property-test library carries a version trap, and its pin is not a rule
   here.** `E-7` and `E-13` both name jqwik property tests. That library's version
   pin is a **cross-cutting dependency rule rather than an asynchronous-handoff
   rule** — it binds every use of the library in the repo — so it is not stated as a
   check here. `money-java` carries it, as `M-24`, with the version and the CI
   version-ceiling check; the value is **deliberately not repeated here, because a
   pin copied into two skills drifts in one.** **A repo that installs these skills
   and not the money skills therefore has no pin**, and must decide it at its own
   dependency review. `caching-java` records the same gap for the same reason.
   Which skill should own it is unsettled.

**Two costs, stated rather than absorbed, and both are real numbers for a
three-person team.** The cache rules already **triple** integration CI time; this
set runs the suite in **four** configurations against a real broker in a
container, **which makes it the most expensive gate in this skill set. Nobody has
run it.** And `E-33`'s two-instance arm means a second consumer container the
four-configuration gate did not previously need. **If the gate is cut, `E-10`,
`E-13`, `E-15`, `E-22` and `E-23` degrade to declarations while the catalog still
reports green** — which is exactly what `E-25`'s per-subscription positive
controls exist to make visible.

## Evidence and dates

Java-specific claims. The platform-neutral evidence — what each directive rests
on, the transport defaults, the hostile audit, the full steelman for each rejected
shape, the wordings that must not be reintroduced, the nine-candidate transport
survey, and what reopens a decision — is in the `async-handoff` skill's own
`evidence.md`.

**Two passes, both 2026-07-29, and between them the two weakest passes behind any
skill in this set.** Pass 1 wrote `E-1` … `E-28` and did not finish the protocol:
the three refutation votes were not run, because the session's agent budget was
exhausted mid-pass. **A hostile audit carrying a planted canary stands in their
place, and the canary was caught, so the audit's findings count.** Pass 2 closed
the composite shapes — including `E-32` and `E-33` here — with **one researcher,
no panel and no audit at all.**

**Read every tool claim below as primary-source verified by one researcher, not
confirmed** — running the votes is what promotes them, and that is a named trigger
in the neutral skill's evidence. **Nothing in `E-1` … `E-33` is confirmed**; all
of them are convention, and no marker below promotes any of them.

| Claim | Marker | Date |
| ----- | ------ | ---- |
| Boot 4.1.0 manages spring-kafka 4.1.0, kafka-clients 4.2.1, jOOQ 3.21.5 and Testcontainers 2.0.5; ArchUnit 1.4.2 (2026-04-18) — read from the Boot dependency manifest | primary-source verified | 2026-07-29 |
| **The listener acknowledgement mode defaults to `BATCH`, not `RECORD`.** It commits the offsets of all records from the previous poll once all have been processed, so a crash after record three of fifty redelivers all fifty. A rule reasoning "the default is at-least-once per record" is wrong about the *unit* | primary-source verified | 2026-07-29 |
| **A share-consumer acknowledgement mode was added in 4.1 whose implicit value has the broker acknowledge every record regardless of processing outcome**, with no listener involvement — so a rule inspecting only the listener mode reports green over it. This is why `E-10` pins two settings | primary-source verified | 2026-07-29 |
| **`DefaultErrorHandler` is bounded and tight-looping:** ten total attempts with `FixedBackOff(0, 9)` — a zero-millisecond interval | primary-source verified | 2026-07-29 |
| **`DeadLetterPublishingRecoverer` does not create its destination and does not fail loudly when it is missing.** Default destination is the source topic suffixed `-dlt` on the same partition number; its partition check logs an unknown topic at DEBUG and a missing partition at WARN before letting the producer choose one | primary-source verified | 2026-07-29 |
| **`@RetryableTopic` documents its own ordering cost:** "By using this strategy you lose Kafka's ordering guarantees for that topic." Also documented as unsupported with batch listeners and unable to combine with container transactions | primary-source verified | 2026-07-29 |
| **An explicit non-annotation registration path exists and is documented** — messages can be received "by configuring a `MessageListenerContainer` and providing a message listener or by using the `@KafkaListener` annotation". **`E-2`'s ban depends on this fact** | primary-source verified | 2026-07-29 |
| **ArchUnit can read annotations** — `@KafkaListener` has runtime retention and "no annotated method outside package P" is directly expressible — **but its `@Target` includes annotation types and classes**, so a repo-defined meta-annotation and the class-level form both escape a methods-only direct-annotation rule | primary-source verified | 2026-07-29 |
| **ArchUnit rules do not pass vacuously by default** (an empty should-clause is rejected since 0.23.0) **but the guard is one line from being disabled** — a property or a per-rule override — and it does not cover an importer pointed at the wrong path. **Not broker-specific: this applies to every ArchUnit gate in the repo** | primary-source verified | 2026-07-29 |
| **The Toxiproxy module confirms nothing about itself.** Its client exposes only name, stream, toxicity and remove — no counter, no bytes-affected, no fired flag — **and toxicity is a probability**, so a registered toxic can legitimately not affect the call under test | primary-source verified | 2026-07-29 |
| **Error Prone's `FutureReturnValueIgnored` fires on a bare `kafkaTemplate.send(...)`** — the template returns `CompletableFuture<SendResult<K,V>>` and carries **no** `@CanIgnoreReturnValue` (checked in its source). `WARNING` by default; must be raised to `ERROR`. Two limits: chaining `whenComplete` returns another future and fires again, and a variable named with the tool's `unused` prefix silences it | primary-source verified | 2026-07-29 |
| **Nothing in Error Prone, SpotBugs, all 714 sonar-java rules, PMD, fb-contrib, find-sec-bugs or error-prone-support detects a publish inside a transactional method, a consumer acknowledging before handling, or an unbounded retry.** `acknowledg*` returns zero hits across every index. **Semgrep, CodeQL and commercial analysers were not searched and absence is not claimed for them** | primary-source verified | 2026-07-29 |
| **The same-transaction property cannot be type-designed on jOOQ's own types.** `transaction()` hands back a *derived* `Configuration` and the manual warns that using the outer scope inside the block will "silently run outside the transaction" — but both are the same static type, and `jooq-checker` (3.21.6) ships only a dialect checker and a plain-SQL checker | primary-source verified | 2026-07-29 |
| **The framework's transaction documentation is the argument for the outbox, and its silence is the load-bearing part.** The recommended shape synchronises the Kafka transaction with the database one and states "The DB transaction is committed first; if the Kafka transaction fails to commit, the record will be redelivered so the DB update should be idempotent", and that a failed synchronized commit now throws to the caller where it was previously logged at debug, so applications "should take remedial action … to compensate for the committed primary transaction". **It never analyses a crash between the two commits and never quantifies the window** — that absence is the basis for choosing an outbox, and **this skill must not present it as a documented probability** | primary-source verified | 2026-07-29 |
| **`ChainedKafkaTransactionManager` is deprecated since 2.7 and still shipping** in 4.1.0. It is **not** removed | primary-source verified | 2026-07-29 |
| Outbox libraries: gruelbox transaction-outbox **7.0.707** (Apache-2.0, jOOQ module, writes the row in the caller's transaction; its README states the polling loop "is up to you"); namastack-outbox **1.8.0** (Apache-2.0, automatic schema creation); Spring Modulith event publication registry **2.1.0** (Apache-2.0, writes the entry "as part of the original business transaction", republication on restart opt-in — **its broker-externalization module was not verified**). `raedbh/spring-outbox` has no releases. Debezium **3.6.0.Final** (Apache-2.0), whose outbox router is a Kafka Connect transformation | primary-source verified | 2026-07-29 |
| **The only Java Maven AsyncAPI comparator detects incompatibilities and then passes the build** — three declared parameters, no build-failing exception, a report file, exit green. One published version, two stars, no commit since 2024. **A false-green gate shipped as a product** | primary-source verified | 2026-07-29 |
| The AsyncAPI **CLI** `diff` command does fail on breaking changes against a committed file with no network unless an opt-out flag is passed; it is a Node binary with no official Maven plugin. **`buf breaking`** for Protobuf compares against a committed baseline including a git ref, needs no network, and is Apache-2.0. **No tool on the JVM validates an actual published message against a committed AsyncAPI document** | primary-source verified | 2026-07-29 |
| **The corpus-favourite schema registry is not OSI-licensed:** its own licence file puts the project under the Confluent Community License "except some modules such as the client-* and avro-* libs, which are licensed under the Apache 2.0 license". **Apicurio Registry 3.3.1 and Karapace 6.2.1 are Apache-2.0**; drop-in compatibility for a given client was **not verified** | primary-source verified | 2026-07-29 |
| **`EmbeddedKafkaBroker` is not deprecated, and the documentation records no divergence from a real broker** — `testing.adoc` contains zero occurrences of "testcontainer"; since 4.0 only the KRaft implementation exists. Documented caveats are operational: no shutdown mechanism when tests finish, do not mix a global embedded broker with per-class ones, use a distinct topic per test | primary-source verified | 2026-07-29 |
| **The LocalStack image has required an authentication token since 2026-03-23**, with a CI-specific token injected from a secret store. Any managed-queue gate built on it needs an account and a CI secret | primary-source verified | 2026-07-29 |
| **A PostgreSQL queue extension is not a Java option, and the usual objection is wrong.** Its control file sets `superuser = false`; the real barriers are host filesystem access and provider allowlisting, and it is absent from the AWS RDS supported-extensions list for every version checked. No first-party Java client; of three third-party JVM clients one is not on Maven Central and the others were last touched in 2024 | primary-source verified | 2026-07-29 |
| **Axon Framework is Apache-2.0 and Axon Server is not** — an agent reading "Axon is open source" is reading something true about the wrong artifact. EventStoreDB moved to the Event Store License v2 with its 24.10 release, enterprise features behind a licence key | primary-source verified | 2026-07-29 |
| **Kafka Streams ships in the same ecosystem as the client the repo legitimately needs**, so it is one dependency line away at all times — which is why `E-33` is a banned-dependency rule plus field rules rather than a code-shape rule | primary-source verified | 2026-07-29 |
| Since Java 9, `+` on strings compiles to an `invokedynamic`, so a bytecode rule banning key concatenation has no operand — **contested, see below** | challenged and unverified | 2026-07-29 |
| Kafka share groups move a record to an **archived state** past the delivery-attempt limit, where it is not eligible for further delivery and is routed nowhere. **Asserted by this pass with no primary-source citation recorded**, unlike the RabbitMQ delivery-limit fact beside it in `E-16`. No rule depends on it | **not verified — do not cite as documented** | 2026-07-29 |

**A research-method note worth keeping, because it invalidates a habit.** The
Maven Central **search** API under-reports: it returned no 7.x for an artifact
whose `maven-metadata.xml` lists 7.0.707, and zero results for a group whose
metadata lists a current release. **Use
`repo1.maven.org/maven2/<path>/maven-metadata.xml` for existence claims**, not the
search endpoint.

**The one contradiction between sources, recorded rather than resolved.** The
`caching-java` skill's pass records the `invokedynamic` claim as confirmed. **This
rule set's hostile audit argued the claim is too strong** — the concatenation
recipe travels as a constant-pool bootstrap argument, so a bytecode-reading rule
may have an operand after all — and **could not reach the primary specification,
which returned HTTP 403.** Neither reading is adopted, because **no rule depends
on which is right:** `E-15`'s key rule is a parameter-type rule, and a factory that
cannot take a `String` makes the wrong call uncompilable regardless. If the
challenge is ever verified, drop the impossibility clause wherever it survives and
leave the rules unchanged.

**Do not cite.**

- **"The framework documentation warns that a blocking retry holds up the rest of
  the partition."** No such sentence exists. The consequence is derivable from the
  retained-and-resubmitted text and the pausing back-off handler note, but **must
  not be cited as documented.**
- **"The embedded test broker is deprecated, or the documentation recommends
  containers because it diverges."** Neither is stated anywhere. The divergence
  argument is a bet, not a citation.
- **"The dead-letter publishing recoverer fails loudly if its topic is
  missing."** DEBUG for an unknown topic, WARN plus a producer-chosen partition
  for a missing one.
- **"The default listener acknowledgement mode is per record."** It is per poll
  batch.
- **"`ChainedKafkaTransactionManager` was removed."** Deprecated since 2.7 and
  still shipping.
- **"A PostgreSQL queue extension needs superuser."** Its control file says
  otherwise.
- **"The Maven Central search API can establish that an artifact is not
  published."** It under-reports.
- **"Axon Server is Apache-2.0."** Axon *Framework* is.
- **ArchUnit for anything inside a lambda body, a catch block body, or a generic
  type parameter.** Three separate limits, each of which reworded a rule in this
  skill set. The lambda-body and catch-body limits are **confirmed**, by the cache
  rules' pass rather than this one, and `caching-java` carries them with their
  issue references; the erasure limit on a generic type parameter is recorded
  there too. **This pass confirmed none of them** — it reused them.
- **The framework's commit-then-commit documentation as a quantified risk.** It
  never analyses a crash between the two commits and never quantifies the window.
  Its **silence** is the argument for the outbox.
- **The nine-candidate transport survey as this stack's work.** It is
  platform-neutral and lives once, in the `async-handoff` skill's own
  `evidence.md`.

**Review by 2027-01-29.** Past that date every **confirmed** marker above reads as
**convention** until a new pass re-dates it — and nothing above is confirmed
today, so the lapse rule bites only if a future pass promotes something. The
version pins and the licences age fastest: **re-check Boot, spring-kafka, jOOQ,
ArchUnit, Testcontainers, the outbox libraries and every licence at adoption, not
on the calendar.**
