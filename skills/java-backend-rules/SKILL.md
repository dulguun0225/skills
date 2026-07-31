---
name: java-backend-rules
description: The platform constitution for a Java backend on Spring Boot Web MVC, jOOQ and PostgreSQL — the rules that bind every line of code in the repo, each with a named build gate. Reactive WebFlux, JPA and Hibernate, jOOQ's attached-record CRUD, plain-SQL strings, an injectable DSLContext, fixed thread pools for request work, StructuredTaskScope, an extra semaphore over the connection pool, wall-clock reads in domain code, and the runtime-silent Spring annotations — field injection, @Transactional, @Scheduled, @Async, @Cacheable — are banned by name, each with the check that fails the build. Load before writing a query, a transaction, an in-request fan-out, a Flyway migration, a scheduled task, or a test on this stack, and before picking a persistence, concurrency, JSON or nullness library for it.
---

# Java backend — the platform rules

The rules that bind **every line of code** in a Java backend on this stack, with
the named check that enforces each one. Six areas — the platform picks,
concurrency, time, nullness, the runtime-silent ban list, and the test
toolchain.

Two sibling skills carry the areas that state their own condition, and a repo on
this stack installs all three:

- **`java-backend-api`** — the HTTP contract rules. They bind when the backend
  exposes an HTTP API described by an OpenAPI document.
- **`java-backend-observability`** — logging, metrics and alerting. They bind
  when the deployed system has no human watching it continuously.

**There are no rule ids here, and that is deliberate.** Each directive is a
`###` heading, and that heading is how it is referred to — *the transaction
seam*, *the preview-API ban*, *the fan-out helper*. Nothing else in this skill
set numbers these rules, so a number invented here would be a pointer that
resolves only for a repo that installed this skill; a skill name plus a subject
reads as an instruction and resolves either way. Cite these rules from anywhere
else the same way.

## The marker ceiling, before the rules

**The evidence behind these six areas is uneven, and the unevenness runs by
area rather than by rule.** Read this first, because a rule stating a check
looks equally settled whichever group it is in.

- **Every claim under Concurrency was re-verified on 2026-07-24 under a three-vote
  adversarial panel**, and the ones that survived carry **confirmed**. One starting
  claim was **refuted** there and the rule was rewritten around the refutation —
  see *The keep-alive safeguard*. No ranking against the other groups here is
  intended, and none against the other skills in this set: several had panelled
  passes of their own.
- **The persistence claims marked confirmed were checked against primary vendor
  documentation, not put to a panel** (2026-07-25) — jOOQ's attached-record CRUD
  and its fetch cardinality, the plain-SQL injection hazard, the lambda-scoped
  transaction API and autocommit, and the four migration hazards. The **mandates**
  built on them are this rule set's own synthesis and say so.
- **So *confirmed* means two different things in this skill, and the date is the
  only thing that tells you which.** Against a claim dated **2026-07-21** or
  **2026-07-24** it means the claim survived three independent refutation votes —
  both of those passes ran the panel. Against one dated **2026-07-25** it means a
  single researcher checked it against a primary source — **the pass wrote
  "confirmed" while running no panel**, and that usage is carried here rather than
  silently corrected, because re-marking someone else's verdict is not what
  converting it does. Read a 2026-07-25 *confirmed* as a documentation check.
  **2026-07-27** carries one panelled claim, and it belongs to
  `java-backend-observability` rather than to this skill; the correction it made to
  a rule here is dated to it. Nothing here is dated **2026-06-11..14** and marked
  confirmed — that pass recorded no per-claim markers at all.
- **Nullness is confirmed** as mainstream (2026-07-21) — a panelled date, so this
  one is confirmed in the strong sense.
- **Time, the ban list, and the real-database test rule are convention with no
  citation at all.** No external evidence survived for any of them. They are
  kept because they are enforceable, cheap, and fail toward safety —
  **enforcement is never confirmation**, and a green ArchUnit run says nothing
  about whether the ban was a good idea.
- **Three Platform directives carry no evidence note of their own** — the
  WebFlux paradigm ban, the Flyway-migrations rule, and the Jackson pick. Their
  dating is an inference drawn while writing this skill, not a date any research
  pass wrote down. [evidence.md](evidence.md) says so where it states them.

The whole set is `review-by` **2027-01-21**. **Past that date every *confirmed*
marker here reads as *convention*** until a new pass re-dates it, with no
maintainer action needed. That rule only works if the date is visible beside the
claim, which is why every directive carries one.

Status tier: **decided, not yet validated** — researched and decided, with **no
production use yet** behind the enforcement shapes.

## The premise, and the thing it is not

**Code is written by LLM agents and no human reads it line by line.**

Every rule here is conditioned on that. A verdict is portable exactly as far as
its premise: in a repo where a human reads every diff, several of these drop
from mandatory to merely advisable, and a repo in that position should say so
and carry the burden of saying it rather than silently dropping the rule.

**This skill is not an argument for choosing this stack.** It assumes the
platform decision — Java, Spring Boot Web MVC, jOOQ, PostgreSQL — has already
been made, and states the rules that follow from it. **A rule set is never a
reason to adopt a stack**, and this one is not evidence for its own platform:
fifteen sibling skills instantiated on one stack are accumulated *consequence*,
not accumulated justification.

**The argument for the choice lives in `backend-stack`**, which ranks candidates
by what their build can refuse to ship and carries this stack as its worked
case. If the platform is still open, read that skill and come back. Two things
it settles that this paragraph used to state differently: **the deciding
criterion is the stack's enforcement surface, not operability** — operability is
a veto the winner must clear, which is a different thing and produces a
different answer, because "we already know it" is not a guardrail under a
premise where nobody reads the code. And the candidate list behind the Java
verdict **was never recorded in this skill set**, which `backend-stack` states
about itself rather than leaving to be inferred from silence here.

**Three tripwires mean the repo has left this skill's assumptions entirely**,
not merely added a feature: the first LLM call in the product, a hard real-time
deadline, or a shipped SDK. None of the three is covered here, and the rules
below were not written with any of them in view.

## The defaults these rules override

The picks an unbriefed agent statistically makes. **Naming the loser is the
load-bearing half** — "use jOOQ" does not override an instinct, "the corpus
default is JPA with dirty checking, rejected because an accidentally mutated
entity becomes a silent UPDATE" does. Do not compress these when carrying a
rule into a repo's own text.

- **JPA, Hibernate and Spring Data JPA** — the corpus-dominant Java
  persistence. Rejected as runtime-silent: dirty checking turns an
  accidentally mutated entity into a silent `UPDATE`, and silence is most
  expensive where money moves. **The corpus advantage self-cancels** — every
  future agent session generates against corpus gravity toward the banned
  patterns, which is the cost this ban pays for.
- **Annotation-driven transactions, caching and scheduling** — the corpus
  default Spring style, banned as runtime-silent. See *The runtime-silent ban
  list*.
- **A fixed-size platform-thread request pool** — the classic Tomcat and
  executor tuning, and the do-nothing default. Under blocking Web MVC plus jOOQ
  it reintroduces thread-pool exhaustion, because slow database calls starve
  request threads under load. Virtual threads remove exactly that failure mode
  while keeping the identical blocking, top-to-bottom code shape.
- **Manually pooling virtual threads** — a fixed or cached pool of them.
  Defeats the point: pooling reintroduces the scarce-resource bottleneck they
  were designed to remove, and a pooled virtual thread caching per-thread state
  just reallocates per task.
- **A raw `newVirtualThreadPerTaskExecutor` plus a `Future.get` loop for
  in-request fan-out** — compiles, passes happy-path tests, and is silently
  wrong. See *The fan-out helper*.
- **Adopting `StructuredTaskScope` now** — the ergonomically attractive fan-out
  API, and preview on JDK 25. The dominant corpus shape for it (the JDK 21–24
  `ShutdownOnFailure` and `ShutdownOnSuccess` constructors) **does not even
  compile on JDK 25**, which is the corpus-poisoning these rules exist to
  prevent.
- **An extra `Semaphore` on top of the connection pool to limit database
  load** — redundant. The pool already blocks the caller past its size.
- **Regenerating jOOQ classes against a live or shared database** — the
  path of least resistance, and it makes the generated tree a function of
  whatever that database happens to hold.

**More corpus defaults are rejected by rules that live elsewhere in this
skill set**, because their rules do, and they are named here only so a reader
does not conclude this stack has no verdict on them. Binary floating-point for
amounts and reaching for a money library — the `money`, `money-api`,
`money-storage` and `money-java` skills. Spring's `@Cacheable` and cache
abstraction, and reaching for Caffeine or Guava outside a cache adapter — the
`caching` and `caching-java` skills. `@KafkaListener` on a handler and a broker
publish beside a repository save — the `async-handoff` family. And the
cross-cutting dependency traps that bind any agent-built repo on any stack —
`llm-default-traps`, which is also this stack's owner of record for the jqwik
version pin.

## Platform

### Java and Spring Boot Web MVC, with WebFlux banned as a paradigm

**Java at the version pinned in the build, Spring Boot with the servlet Web MVC
stack. Reactive WebFlux is banned as a paradigm** — the one concurrency model
is blocking thread-per-request on virtual threads, and a second model in the
same repo means every subsequent piece of code has to answer which one it is
in.

*ArchUnit — off-the-shelf. **Convention**, 2026-06-11..14 — this is the
platform pass's decision, and no note in the evidence trail addresses the
WebFlux ban directly. **Nothing about this ban is confirmed**: the virtual-thread
claims the alternative model is measured against are, but the
one-concurrency-model argument itself is reasoning no pass put to a source. See
[evidence.md](evidence.md).*

### jOOQ against PostgreSQL, with JPA banned

**Persistence is jOOQ against PostgreSQL; JPA, Hibernate and Spring Data JPA
are banned** — no entity lifecycle, no lazy loading, no query derivation.

*Banned-dependency plus ArchUnit rules — off-the-shelf. **Convention**,
2026-06-11..14. The dirty-checking hazard class is confirmed against jOOQ's own
documentation for the equivalent jOOQ construct — see *jOOQ's own
runtime-silent CRUD* — but the platform pass recorded rejections and grounds
without a per-claim confidence marker, so convention is the floor rather than a
verdict it wrote down.*

### jOOQ classes are generated from the committed migrations

**Regenerate the committed jOOQ classes from the committed Flyway migrations,
never from a live or shared database.** The migrations are applied to a
throwaway real PostgreSQL in a container, so the generated tree is a pure
function of the committed migrations.

*Bespoke — a CI job regenerates and fails on any git diff. **Convention**,
verified 2026-07-25 — the mechanism is jOOQ's own documented recommendation;
that it is mandatory here is this rule set's synthesis, because jOOQ presents it
as one recommended approach rather than the only one.*

### jOOQ's own runtime-silent CRUD is banned

**Attached-record writes are banned; writes are explicit DSL statements.**
`UpdatableRecord.store()`, `insert()`, `update()`, `delete()` and `refresh()`,
together with the `changed()` / `touched()` / `modified()` dirty flags, pick
INSERT-versus-UPDATE **and** which columns to write from in-memory record state
that never appears in the query text. That is dirty checking under another
name — the exact hazard this stack rejected JPA for, shipped inside the library
that replaced it. Records are detached repo-wide with
`Settings.withAttachRecords(false)`, so these methods **throw rather than
guess**.

*ArchUnit — off-the-shelf host; the owner-typed `UpdatableRecord` predicate is
authored per repo, plus a config-default assertion, wired by the repo, that
`withAttachRecords` stays false. Generated jOOQ packages are excluded.
**Confirmed** against primary jOOQ documentation, verified 2026-07-25.*

### Fetch with `fetchSingle` or `fetchOptional`

**`fetchOne()` and `fetchAny()` are banned.** They hide result cardinality:
`fetchOne()` returns null on zero rows and throws only on more than one, so a
query that must match exactly one **silently tolerates zero**; `fetchAny()`
silently returns an arbitrary row when several match. `fetchSingle()` throws on
zero and on more than one; `fetchOptional()` covers the legitimately-optional
case.

*ArchUnit — off-the-shelf host; a ban on the `fetchOne` / `fetchAny` call
targets, or an Error Prone check on source. **Confirmed** against primary jOOQ
documentation, verified 2026-07-25.*

### Plain-SQL `String` constructs are banned

**`DSL.sql`, `field(String)`, `condition(String)`, `table(String)`,
`query(String)`, `resultQuery(String)` and `fetch(String)` are banned.** Each
splices a raw string into the query tree, defeating jOOQ's compile-time type
checking and reopening the SQL-injection surface the type-safe DSL closes. If a
repo needs one, **confine it to as few named seams as possible** — the reference
shape uses one — each a test-pinned named constant, and annotate only that scope
`@Allow.PlainSQL`.

*ArchUnit ban on the plain-SQL API by signature, generated packages excluded —
off-the-shelf host, per-repo predicate. **jOOQ's own `PlainSQLChecker` is the
stronger path**: it turns any plain-SQL use into a compile error unless the
scope is annotated. Verify it wires against the pinned JDK and Error Prone at
adoption — that wiring is unverified here. The hazard is **confirmed** (verified
2026-07-25); the single-seam discipline is **convention**.*

### SQL is reached only through the one transaction seam

**Code touches SQL only inside a lambda-scoped transaction block that receives
the context as its parameter** — `tx.read(dsl -> ...)` and
`tx.write(dsl -> ...)` in the reference shape, the method names the repo's
call — **and read-only intent is the method name, not an annotation.
`DSLContext` is not an injectable bean.** An injected `DSLContext` used outside
a block runs in autocommit and commits each statement on its own, invisibly.
Banning injection makes an unscoped query **unwritable** rather than only
reviewed against.

*ArchUnit — off-the-shelf host; the no-injectable-`DSLContext` predicate is
authored per repo. That the seam also owns connection acquisition, so no
`Connection` or `DSLContext` is reachable outside a transaction block, is
**convention**. The two facts underneath — that jOOQ's own transaction API is
lambda-scoped, and that a JDBC connection is created in autocommit mode — are
**confirmed**, verified 2026-07-25; the mandate is this rule set's governance
choice.*

**This seam is a shared resource, and two other published skills add
requirements to it that this directive does not state.** `caching` requires
cache invalidation to be reachable only from the seam's **post-commit
registration**, and `async-handoff` requires that a general-purpose
post-commit callback registration **not** exist, because nothing at a call site
would then distinguish a cache delete from a message publish. A repo wiring this
seam alongside either of those skills reads their rules before fixing the seam's
shape — this rule fixes the transaction boundary, not the post-commit surface.

### Schema changes are committed Flyway migrations

**Schema changes are committed Flyway SQL migrations,** applied in integration
tests against real PostgreSQL.

*Convention — the integration-test setup is the check. Dated 2026-06-11..14,
the only pass whose scope covers it; no evidence note in the trail carries this
rule, and that dating is an inference drawn while writing this skill.*

### Every migration is linted for lock and rewrite hazards

**Lint every committed migration for lock and rewrite hazards, not only that it
applies.** A migration that runs clean against an empty test database can still
take an `ACCESS EXCLUSIVE` lock or rewrite a table at production volume — which
is exactly the gap the test-time rule above leaves open. Four operations are
flagged, and unwritable without a reviewed per-migration opt-out: a
non-`CONCURRENT` index build, a table-rewriting column-type change,
`ADD ... NOT NULL` without a default, and a constraint added without `NOT VALID`
followed by a later `VALIDATE`.

*squawk — off-the-shelf. The plain CLI gates on its exit code over the
migrations in the diff, **not the pull-request comment bot**; the enabled rule
set and the per-migration opt-outs are configured per repo. The four hazards are
**confirmed** against PostgreSQL's own documentation (verified 2026-07-25); the
choice of squawk over the alternatives is **convention** — the rule is the
hazard class, not the vendor.*

**`DROP COLUMN` is deliberately not on that list.** It is an expand-and-contract
compatibility concern rather than a documented lock-or-rewrite hazard, and
adding it here would put a rule with a different ground behind a gate that is
not evidence for it.

### JSON is Jackson

**JSON is Jackson.**

*Convention. Dated 2026-06-11..14 by the same inference as the Flyway rule; no
evidence note carries it.*

## Concurrency

The one concurrency model is virtual threads — synchronous, top-to-bottom,
un-colored code. **The win is bounded, not free throughput.** PostgreSQL is the
ceiling, so this removes thread-pool exhaustion and keeps the blocking shape at
scale; it is not a throughput multiplier, and adopting it as one produces a
disappointed team and a rule set nobody trusts.

### Virtual threads are enabled by one property

**`spring.threads.virtual.enabled=true` in committed config.**

*Config-default assertion — off-the-shelf. **Confirmed** 2026-07-24. **The
check reads the checked-in default, not the effective runtime value**, which
environment variables or external config can override — see *Named gaps*. The
introducing framework version is **convention** and should be re-verified
against the pinned Spring Boot line at adoption.*

### The keep-alive safeguard is recommended, not required

**`spring.main.keep-alive=true` is a recommended safeguard, not a requirement
for this stack.** Enabling virtual threads makes Spring's threads daemon
threads, but the embedded servlet server keeps its own non-daemon thread, so an
actively-serving Web MVC app **does not exit without it**. It matters in a
no-web-server or scheduled-task-only mode.

*Convention, 2026-07-24. **The "required" framing was refuted by the panel — do
not restore it**, and do not cite keep-alive as required for request handling.
This is the one directive in this skill written around a refutation rather than
a confirmation.*

### One virtual thread per task, never pooled

**Fork with `Thread.startVirtualThread` or
`Executors.newVirtualThreadPerTaskExecutor()`. A fixed-size `ExecutorService`
for request or in-request work is banned;** one platform-thread executor
factory is whitelisted for the pinning fallback.

*ArchUnit — off-the-shelf host; the whitelist predicate is authored per repo.
**Confirmed** 2026-07-24 — the platform's own guidance states virtual threads
should never be pooled.*

### Bound concurrency at the limited resource, not at the thread count

**Do not throttle load by capping threads.** The HikariCP pool is the
database semaphore — a small fixed size matched to what PostgreSQL can serve,
**never scaled to thread count**; thousands of virtual threads queue on it.
Gate any non-database limited resource with an explicit
`java.util.concurrent.Semaphore`. **Do not add a second semaphore on top of the
pool.**

*Convention — pool sizing is the repo's call; the pool-as-limiter principle is
the rule. The underlying claim is **confirmed** 2026-07-24 and is the platform's
own words — a connection pool already serves as a semaphore and needs no
additional one on top.*

### Never fan out to database work while holding a connection

**Never fan out to database-touching subtasks while holding a connection or an
open transaction.** A held connection plus subtasks that each check out a
connection can **deadlock a small pool**. Acquire after the fan-out joins, or
size the pool by the deadlock-avoidance formula.

*Convention — spec and review; **not statically detectable**, and this is the
one rule here with no possible build gate. Verified 2026-07-24 — the deadlock
mechanics and the sizing formula are primary-sourced, and the mapping onto
virtual-thread fan-out is this rule set's synthesis.*

### The fan-out helper

**In-request fan-out goes through the repo's one canonical virtual-thread
fan-out helper.** It forks one virtual thread per subtask in try-with-resources,
cancels siblings on first failure, joins all, and aggregates exceptions.
**Hand-rolled `Future.get` loops and raw executor fan-out in request code are
banned** — `ExecutorService.close()` neither cancels siblings nor
short-circuits, so the corpus-generated shape either runs every sibling after
one has already failed, or serializes the fan-out through sequential `get()`
calls. It trades a safe compile error for a silent latency-and-correctness
defect.

*Bespoke — one owned helper plus an ArchUnit ban on raw executor fan-out in
request paths. **Convention**, 2026-07-24. The `close()` semantics this rests on
are stated in the rejected-alternatives record rather than in a dated evidence
note with a primary source — see [evidence.md](evidence.md).*

**This helper carries a second obligation stated in `java-backend-observability`
— establishing each subtask's logging context at fork time.** That rests on the
one claim in that skill's area put to an adversarial panel; the panel produced
**two** rules there, the context capture and the logging-backend pin, and that
skill marks both **confirmed**. A repo that
builds the helper from this directive alone builds it without the context
capture, and every subtask log line then loses its correlation fields silently.

### No preview APIs

**Do not use preview APIs; never pass `--enable-preview` to `javac` or to the
`java` launcher,** in Maven or in Gradle. This **categorically** forbids
`StructuredTaskScope` — preview on JDK 25 — and every other preview API. A
preview-compiled class file is stamped so that it loads only on the exact JDK
feature release it was built on, which makes the artifact version-locked.

*Off-the-shelf plus bespoke — preview code fails to compile without the flag,
so the build fails closed; a bespoke CI grep also scans compiler and launcher
arguments across Maven and Gradle. **Not ArchUnit**, which reads bytecode and
cannot see compiler or launcher flags. The preview status and the version-locked
class file are **confirmed** 2026-07-24; the per-release API history behind it
is **uncertain** and nothing here rests on it.*

### Per-request context, and never a cached object in a `ThreadLocal`

**Put per-request context in a `ThreadLocal` or, preferably, a Scoped Value**
(final in JDK 25) — **preferably for its bounded lifetime and write-once
binding, not for child-thread sharing.** A Scoped Value binding is inherited
only by threads forked inside a `StructuredTaskScope`, which the preview ban
above forbids, so **it never reaches a subtask here.** An
`InheritableThreadLocal` does reach one, but do not rely on that: the platform
does not specify which thread constructs the child in a per-task executor.
Context that must reach a subtask is established there by the fan-out helper.
**Never cache a reusable object in a `ThreadLocal`** — virtual threads are never
pooled, so a per-thread cache just reallocates per task.

*Convention. The child-thread-sharing correction is dated 2026-07-27 and the
inheritance facts behind it are **confirmed** 2026-07-27 by the fan-out context
panel; the preference for a Scoped Value on its other two properties is
convention.*

### Keep the pinning event on, and alert on it

**Keep the `jdk.VirtualThreadPinned` JFR event on** (default 20 ms threshold)
**and alert on it in deployment.** Residual pinning on JDK 25 is native-only —
native methods, foreign functions, and blocking class initializers. Pinning does
not make an application incorrect, but pinning that exhausts all carriers can
stall the scheduler, so treat sustained pinning as an operability hazard rather
than a mere slowdown.

*Convention — monitoring wiring, 2026-07-24. **A tripwire, not a guarantee**:
many short sub-threshold pins can accumulate cost without ever firing. The
residual pinning causes are **confirmed** 2026-07-24.*

## Time

### `Clock` is injected

**Wall-clock reads in domain code are banned** — `Instant.now()`,
`LocalDate.now()`, `new Date()`, `System.currentTimeMillis()`.

*ArchUnit — off-the-shelf. **Convention**, 2026-07-21 — no external evidence
survived and the rule carries no citation. Kept because it is enforceable and
cheap.*

### Business dates are their own concept

**A business date is a `LocalDate` from an explicit business-date source, never
derived from the wall clock. Timestamps are UTC `Instant`, stored as
`timestamptz`.**

*Convention, 2026-07-21 — same standing as the injected clock, and no
citation.*

**A future legal deadline is neither of these**, and `llm-default-traps`
carries that rule — it is stored as local wall time plus its governing zone and
resolved at evaluation time, because zone rules change between now and the
deadline. Reading "timestamps are UTC" as covering a deadline is the specific
mistake that rule exists to prevent.

## Null

### JSpecify, checked by NullAway, as compile errors

**JSpecify annotations, checked by NullAway running on Error Prone, as compile
errors.** A nullness violation never reaches review.

*Off-the-shelf. **Confirmed** mainstream, 2026-07-21 — Spring Boot 4 and Spring
Framework 7 ship JSpecify-annotated null-safe APIs across the portfolio,
deprecate Spring's own nullability annotations, and check Spring's own build with
NullAway.*

## The runtime-silent ban list

**Behavior that never appears in program text is behavior an implementer
guesses at.** Each entry below is banned with a named enforcing check.

*The list as a whole is **convention**, 2026-07-21 — the defect-source claim
carries no citation and no external evidence survived for it. It is kept because
it is enforceable and cheap, and because every entry has a named check.
**Enforcement is not confirmation**, and the ArchUnit class below is enforcement.*

**The marker, the date and the check are stated once here for the whole list,
which is the one place in this skill they are not inline per directive.** That is
deliberate rather than a dropped marker: the entries below share a single ground
and a single enforcement host, named in *Every ban names the check that enforces
it* at the end of the list. Read each entry as carrying **convention, 2026-07-21**
and that host.

### Field and setter injection

**Banned — constructor injection only.**

### `@Transactional`

**Banned.** Transactions are explicit visible blocks reached only through the
one transaction seam above; annotation-driven ambient transactions are the
thing being removed.

### `@Scheduled` and `@Async`

**Banned.** Scheduling and asynchronous work go through one explicit, named
mechanism. **On this stack that mechanism is specified by the `async-handoff`
family**, which treats a bare executor submit as an asynchronous handoff with
the full rule set attached — including the outbox requirement. This ban is the
half that says the annotation is not the mechanism; it does not say what the
mechanism is.

### `@Cacheable`, `@CachePut`, `@CacheEvict`, `@Caching`, and AOP aspects on domain code

**Banned, together with any caching decorator wired behind a domain
interface.** This entry puts them on the list; **the `caching` and `caching-java`
skills are where the ban gets its checks, its four grounds, and its
replacement**, and they are not restated here because a rule stated in two
skills drifts in one.

**What this stack adds to those grounds is the size of the pull:** Spring's cache
abstraction is the corpus default for "add caching" on this stack **by a wide
margin**, which is why it needs a ban with a check rather than a note. **A repo
that installs this skill and not `caching` has the ban and no replacement** — no
adapter seam, no staleness ceiling, no invalidation rule — so an agent told only
"the annotation is banned" will hand-roll something worse. Install `caching`
even if the repo caches nothing today; the first cached value is the tripwire.

### Reflection-based dispatch and stringly-typed behavior lookups

**Banned.**

### Every ban names the check that enforces it

**A ban with no named check is not on this list.** ArchUnit hosts a ban on
bytecode, Error Prone hosts one on source, and **which tool hosts which ban is
decided per rule by what each can read soundly** — not by preference. The worked
case is in `java-backend-observability`, where the unloggable-domain-type rule
must be Error Prone because ArchUnit sees the logger's erased signature rather
than the argument's static type; `caching-java` has two more of the same shape.
**A meta-test keeps the list honest:** each ban is either enforced by a named
test or **explicitly marked deferred with a reason**.

*ArchUnit on bytecode and Error Prone on source — off-the-shelf hosts; some
predicates are authored per repo.*

## Evidence toolchain

**Tests are the code review.** No rule in this skill assumes a human reads the
generated code line by line.

### Integration tests run against real PostgreSQL

**Integration tests run against real PostgreSQL in a throwaway container,
applying the real migrations. No in-memory substitute database.**

*Convention, 2026-07-21 — no external evidence survived and the rule carries no
citation. Kept because it is enforceable and cheap.*

### The ban list is an executable test class

**The ban list is an ArchUnit test class — executable, not prose.**

*Off-the-shelf host; some predicates are authored per repo. **Convention**,
2026-07-21 — the trail makes no confidence claim about this rule beyond noting
that a ban-list test class plus its meta-test **is not independent
confirmation** of the bans it hosts.*

### Coverage is gated by JaCoCo

**Coverage is gated by JaCoCo — the `jacoco-maven-plugin` `check` goal — failing
the build below a per-package `COVEREDRATIO` floor.** Coverage is the floor under
every package:
**it proves a line ran, not that a test asserted on it**, so a green floor is
necessary and never sufficient. The ratio and its per-package split are the
adopting repo's call, stated in the repo. Pin JaCoCo to a release that supports
the build's Java version — it trails each Java release.

*Off-the-shelf host — the ratio thresholds and the per-package split are
authored per repo. The mechanics are **confirmed**, verified 2026-07-25; no
threshold numbers are supplied here, deliberately, because a floor tuned to one
product's risk profile is not a platform default.*

## Wiring the gates

**Run this once per repo, in the first pull request that touches the build.**
These directives are two kinds welded together: instinct-overrides that fire
while an agent is writing code, and build gates that have to exist in the repo.
Instructing an agent does nothing for the second kind — **the gate is what
catches the next agent**, and an unwired gate is a rule described as enforced
that is not.

1. **The ban-list ArchUnit test class**, with the meta-test asserting every
   entry is either enforced by a named test or marked deferred with a reason.
   This is the host for the runtime-silent bans, the WebFlux ban, the
   attached-record and plain-SQL bans, the `fetchOne` / `fetchAny` ban, the
   no-injectable-`DSLContext` rule, the wall-clock ban, and the raw-executor
   fan-out ban. **Generated jOOQ packages are excluded** from all of them.
2. **Banned-dependency rules** for JPA, Hibernate and Spring Data JPA. The
   sibling skills add their own entries to the same configuration — the logging
   backend pin in `java-backend-observability`, the cache and broker client bans
   in `caching-java` and `async-handoff-java`, and the JVM dependency bans in
   `llm-default-traps`.
3. **The jOOQ codegen-diff job** — regenerate from the committed migrations
   against a throwaway PostgreSQL container, fail on any git diff.
4. **Config-default assertions** for `spring.threads.virtual.enabled=true` and
   for `Settings.withAttachRecords(false)`. Both read the checked-in default and
   neither sees a runtime override.
5. **Error Prone on the compile path**, with NullAway and JSpecify configured to
   fail compilation. This is also the host for any non-loggability check and for
   the `fetchOne` / `fetchAny` ban if the repo prefers source over bytecode —
   and **not** ArchUnit for the first of those.
6. **squawk** over the migrations in the diff, gating on the CLI's exit code,
   with the enabled rule set and per-migration opt-outs committed.
7. **The Testcontainers integration-test setup** applying the real migrations
   against real PostgreSQL.
8. **The `jacoco-maven-plugin` `check` goal** with the per-package
   `COVEREDRATIO` limits this repo states, and
   the version pinned to a release supporting the build's JDK.
9. **A CI grep for `--enable-preview`** across Maven and Gradle compiler and
   launcher arguments. Not ArchUnit, which cannot see them.
10. **The `jdk.VirtualThreadPinned` JFR event and its alert**, in deployment
    rather than in the build.

**Then record what was wired and what was skipped, with the reason.** These are
the entries **nothing above gates**, and each must be listed as ungated:

- **Never fanning out while holding a connection** — spec and review. Not
  statically detectable by anything.
- **Pool sizing**, and the ban on a second semaphore over the pool — the
  pool-as-limiter principle is the rule and no check reads a pool size against
  what PostgreSQL can serve.
- **The single-seam discipline for plain SQL** — the ban is gated; that the
  exempted seams are few, named and test-pinned is not.
- **That the transaction seam owns connection acquisition** — ArchUnit bans
  injecting the `DSLContext`, not every path to a `Connection`.
- **The business-date and `ThreadLocal`-caching rules**, and the Jackson and
  Flyway picks — convention, no check.
- **Whether `PlainSQLChecker` was wired**, if the repo chose it over the
  ArchUnit path. Its compatibility with the pinned JDK and Error Prone is
  unverified here and must be established by the adopting repo.

**A record that lists only what was wired reads as complete coverage.** That is
the failure this step exists to prevent.

## Named gaps — where no check reaches

Silence reads as coverage, so each is stated.

1. **A config-default assertion is not a runtime assertion.** Both of them —
   the virtual-threads property and the attached-records setting — read the
   checked-in default. An environment variable or an external config source can
   override either in a deployed process, and **no gate here notices.** The same
   limitation applies to the structured-logging property in
   `java-backend-observability`.
2. **The fan-out-while-holding-a-connection rule has no possible gate.** It is
   the one rule here that is stated as undetectable rather than merely ungated.
3. **Generated jOOQ packages are excluded from every ArchUnit ban.** A rule
   written into a generated package is unreached by design. This is correct — the
   generator's output is not hand-written code — but it means the exclusion
   boundary is load-bearing, and a hand-written class placed in a generated
   package escapes the whole ban list.
4. **The `--enable-preview` grep covers what the grep covers.** The compile
   failure is the real gate and it fails closed; the grep exists for the case
   where a flag is added deliberately, and it is bespoke text-matching over build
   files, not analysis.
5. **The coverage floor cannot see whether a test asserted anything.** Mutation
   testing, which can, is **deliberately scoped to money packages only** by the
   `money-java` skill. So a package in the general tier can sit green at the
   floor over vacuous machine-written tests, and **nothing in this skill
   detects that.** Extending mutation testing beyond money is a decision with a
   named trigger, not an oversight — a general-tier defect traced to vacuous
   tests, or diff-scoped mutation testing becoming affordable.
6. **Three Platform directives rest on no evidence note.** The WebFlux ban, the
   Flyway rule and the Jackson pick. Their dates are inferred from pass scope,
   and a reader treating them as researched to the same standard as the jOOQ
   claims is reading more than is there.
7. **The plain-SQL checker's wireability is unverified.** The ArchUnit path
   works and is what ships; the stronger compile-error path is named as stronger
   without having been tried against this stack's pinned versions.
8. **The pinning alert is a threshold tripwire.** Accumulated short pins below
   the threshold cost real scheduler time and fire nothing.

## Markers, dates, and what they mean

Confidence, per claim: **confirmed** means the claim survived three independent
refutation votes against primary sources on the date it states.
**Primary-source verified** means one researcher checked it against a primary
source with **no panel** — it is not confirmed whatever its evidentiary
strength, and running the panel is what promotes it. **Convention** means the
research did not, or could not, confirm the claim from independent sources; the
rule is kept because it is enforceable, cheap, and fails toward safety.
**Uncertain** means a claim was examined and left unsettled, and nothing here is
allowed to rest on one.

Enforcement, per rule: **off-the-shelf** means a tool does it with
configuration; **bespoke** means the check must be written; **convention** means
a human or an agent asserting it is all there is.

**The lapse rule:** past `review-by` **2027-01-21**, every *confirmed* marker in
this skill reads as *convention* until a new pass re-dates it, with no
maintainer action needed. That is why a date sits beside every claim.

| Claim | Marker | Date |
| ----- | ------ | ---- |
| jOOQ's attached-record writes choose INSERT-versus-UPDATE and the column set from in-memory state | confirmed | 2026-07-25 |
| `fetchOne` tolerates zero rows and `fetchAny` picks arbitrarily; `fetchSingle` throws on both | confirmed | 2026-07-25 |
| Plain SQL defeats jOOQ's type checking and reopens the injection surface | confirmed | 2026-07-25 |
| jOOQ's transaction API is lambda-scoped, and a JDBC connection starts in autocommit | confirmed | 2026-07-25 |
| The four flagged migration operations lock or rewrite | confirmed | 2026-07-25 |
| Generating jOOQ code from migrations in a throwaway container | convention (mechanism primary-sourced) | 2026-07-25 |
| The single-seam plain-SQL discipline, and the checker's wireability | convention | 2026-07-25 |
| Making `DSLContext` non-injectable | convention | 2026-07-25 |
| Choosing squawk over the alternative migration linters | convention | 2026-07-25 |
| Virtual threads are final and their request-handling API stable | confirmed | 2026-07-24 |
| Virtual threads should never be pooled | confirmed | 2026-07-24 |
| The connection pool is already a semaphore and needs no second one | confirmed | 2026-07-24 |
| The virtual-threads enablement property | confirmed | 2026-07-24 |
| `keep-alive` is *required* | **refuted** — do not restore | 2026-07-24 |
| `StructuredTaskScope` is preview and its artifacts are version-locked | confirmed | 2026-07-24 |
| Residual pinning on JDK 25 is native-only | confirmed | 2026-07-24 |
| Fan-out while holding a connection can deadlock a small pool | convention (mechanics primary-sourced) | 2026-07-24 |
| The fan-out helper's necessity, from the executor's close semantics | convention | 2026-07-24 |
| A Scoped Value binding never reaches a subtask on this stack | confirmed | 2026-07-27 |
| JSpecify with NullAway is mainstream on this stack | confirmed | 2026-07-21 |
| JaCoCo's `check` goal halts the build on a ratio floor | confirmed | 2026-07-25 |
| The injected clock and the business-date split | convention, no citation | 2026-07-21 |
| The ban list's defect-source claim | convention, no citation | 2026-07-21 |
| Real PostgreSQL over an in-memory substitute | convention, no citation | 2026-07-21 |
| The choice of jOOQ over JPA | convention (no per-claim marker recorded) | 2026-06-11..14 |
| The WebFlux paradigm ban, the Flyway rule, the Jackson pick | convention, no evidence note | 2026-06-11..14 (inferred) |

The ground behind each claim — with its source where a pass named one — the
claims that must **not** be cited, and the conditions that reopen a rule are one
hop away in **[evidence.md](evidence.md)**.
