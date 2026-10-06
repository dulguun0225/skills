# Evidence — the Java backend platform rules

The ground behind each directive in [SKILL.md](SKILL.md), the claims that must
**not** be cited, and the conditions that reopen a rule. Read the directive
first; this file is for deciding whether to trust it.

## The research passes, and what each one did not cover

The evidence behind these six areas accreted over five passes. **Scope matters,
because a scoped pass re-leases nothing outside its own scope** — so a rule
whose group was not in a pass's scope did not get re-verified that day, however
recent the date beside its neighbour.

| Pass | Scope | Panel |
| ---- | ----- | ----- |
| 2026-06-11..14 | The platform decision — persistence, and the corpus favourites it rejected | full research pass, no per-claim confidence markers recorded |
| 2026-07-21 | The founding pass. Covered Time, Null, the ban list and the evidence toolchain | adversarial, three votes per claim |
| 2026-07-24 | Re-verification of every concurrency claim | adversarial, three votes |
| 2026-07-25 | Only the rules added that day — jOOQ persistence, and the coverage floor. Harvested from a prior deep-research result on guardrails for machine-written code, which is **prior art, not independent confirmation**; every note grounds its rule on a primary source | single researcher against primary sources |
| 2026-07-27 | One correction to a concurrency rule, made by the observability pass | one panelled claim (the fan-out context rule) |

**No scoped pass moved the review clock.** Each verified only the rules it
added or re-ran, so `review-by` stands at **2027-01-21** from the 2026-07-21
pass. Bumping it would silently re-lease claims no pass re-ran.

**Where a note below says "the prior research", it means an internal deep-research
result held by another repository** — so its weight cannot be checked from here.
That is the whole reason the pass table distinguishes it from evidence: a
reference implementation showing the same call is not a second source for the
claim.

**One partial exception.** That research's consolidated output — the tool map,
its selection criteria and the four whole concerns its completeness critic
found — **is restated in `guardrails-toolchain`**, so a reader can see what it
concluded. The research itself is unpublished: no transcript, no per-claim
marker, no primary source. Content is readable there; weight still cannot be
checked, and the skill restating it marks everything **convention** for exactly
the reason this table gives.

**The 2026-06-11..14 platform pass's own record is restated in two skills, and
neither is this one.** `backend-stack` carries its candidate list
and the criteria it ranked on; `ai-maintainer-principles` carries the governing
principle the persistence rejections were reasoned from — startup-loud magic is
acceptable, runtime-silent magic is banned — together with the context-locality
premise under it. **This skill keeps the rejections themselves and the per-mechanism
bans**, which is the split the write-once rule forces: the ground travels once, the
checks stay with the stack. Weight is unchanged in both: prior art, no per-claim
marker, no cited source.

## Platform

The persistence decision is the 2026-06-11..14 pass. **Every note below is the
2026-07-25 additions pass**, except where a note carries its own later date.

- **jOOQ codegen from the committed migrations — convention; the mechanism is
  primary-sourced, the mandate is this rule set's synthesis (verified
  2026-07-25).** jOOQ's own guidance recommends generating from migrations
  applied to a throwaway container database rather than pointing the generator at
  a live database; that mechanism is what makes the committed-and-diff-gated
  claim sound, because the generated tree becomes a pure function of the
  committed Flyway migrations. Marked convention because jOOQ presents it as one
  recommended approach rather than the only one, and the prior research is a
  reference implementation. Its build specifics — a dedicated profile,
  first-party plugins only, a version override — are deliberately **not**
  elevated to rules: that is dependency hygiene, not a repo principle. Source:
  `blog.jooq.org`, "Using Testcontainers to Generate jOOQ Code".

- **jOOQ ships its own runtime-silent CRUD — confirmed against primary jOOQ
  documentation (verified 2026-07-25, cross-checked against the prior
  research).** `UpdatableRecord.store()` runs INSERT when the record was created
  by client code or its primary key was touched, and UPDATE otherwise, and writes
  only the fields explicitly set by client code. Both the INSERT-versus-UPDATE
  choice and the column set come from in-memory record state —
  `changed()` / `touched()` / `modified()` — and never from the query text: dirty
  checking, the exact hazard this stack rejected JPA for. A detached record
  (global `Settings.withAttachRecords(false)`) throws `DetachedException` on
  `store()`, `refresh()` and `delete()`. On the fetch side, `fetchOne()` returns
  null on zero rows and throws `TooManyRowsException` only on more than one, so
  it silently tolerates a missing row; `fetchAny()` returns an arbitrary row when
  several match — silent on both cardinality errors — while `fetchSingle()`
  throws `NoDataFoundException` on zero and `TooManyRowsException` on many, and
  `fetchOptional()` wraps the legitimately-optional case. Sources: the jOOQ
  manual's "Simple CRUD" page; the `UpdatableRecord`, `ResultQuery` and
  `DetachedException` javadoc.

  **Do not cite** the further claim that jOOQ's dirty flags are not reset on
  rollback. It appears in the prior research, was **not verified** by this pass,
  and nothing in the directive rests on it.

- **Plain-SQL string constructs defeat jOOQ's compile-time type safety and
  reopen the injection surface — hazard confirmed; the single-seam discipline and
  the checker's wireability are convention (verified 2026-07-25).** jOOQ's
  plain-SQL API — `DSL.sql`, `field(String)`, `condition(String)`,
  `table(String)`, `query(String)`, `resultQuery(String)`, `fetch(String)` —
  splices a raw string into the query tree. The manual states that jOOQ **cannot
  prevent SQL injection** or transform the string, and every such method carries
  an `@org.jooq.PlainSQL` warning. jOOQ also ships an off-the-shelf checker,
  `org.jooq.checker.PlainSQLChecker` — a Checker Framework or Error Prone
  plugin — which turns any `@PlainSQL` use into a compile error unless the scope
  carries `@org.jooq.Allow.PlainSQL`.

  Convention on two counts. The prior research enforces the ban with a bespoke
  ArchUnit predicate (generated packages excluded) rather than the checker, so
  **the checker's wireability against the pinned JDK and Error Prone is
  unverified** — which is why the directive leads with the ArchUnit path and
  names the checker as the stronger option to confirm at adoption. And the
  single-seam scoping is the prior research's practice, not a checker-enforced
  property. Sources: the jOOQ plain-SQL API, SQL-injection and
  checker-framework manual pages.

- **The transaction seam names a real jOOQ shape and a real silent hazard —
  confirmed facts, convention directive (verified 2026-07-25).** jOOQ's own
  transaction API is lambda-scoped:
  `DSLContext.transaction(TransactionalRunnable)` and
  `transactionResult(TransactionalCallable)` pass a transaction-scoped
  `Configuration` into the lambda, normal completion commits and an exception
  rolls back — so "the context arrives as a lambda parameter" is jOOQ's native
  model, not an invention. The hazard is primary-confirmed too: a JDBC
  `Connection` is created in auto-commit mode, so a `DSLContext` used outside a
  transaction commits each statement as its own transaction, invisibly.

  Marked convention for the directive: **no primary source mandates making
  `DSLContext` non-injectable** — that is a governance choice built on the two
  confirmed facts. And the ArchUnit rule bans injecting the `DSLContext`, not
  every path to a `Connection`; the fuller unwritability claim assumes the seam
  owns connection acquisition, which is why the directive marks that half
  convention. Sources: the jOOQ manual's transaction-management page; the
  `TransactionProvider` javadoc; Oracle's JDBC "Using Transactions".

- **Migration lock and rewrite hazards — confirmed for four operations; the tool
  choice is convention (verified 2026-07-25).** From PostgreSQL's own
  documentation: `ALTER TABLE` acquires an `ACCESS EXCLUSIVE` lock unless
  explicitly noted; a column-type change normally rewrites the whole table and
  its indexes; a normal `CREATE INDEX` locks the table against writes whereas
  `CONCURRENTLY` does not; and adding a `NOT NULL` or `CHECK` constraint scans
  the table, which `NOT VALID` followed by a later `VALIDATE CONSTRAINT` — taking
  only a `SHARE UPDATE EXCLUSIVE` lock — avoids.

  **`DROP COLUMN` is deliberately excluded**: it is an expand-and-contract
  compatibility concern, not a documented lock-or-rewrite hazard. Convention for
  the tool — choosing squawk specifically, where Eugene and Atlas are
  alternatives — which is why the directive makes the **hazard class** the rule
  and names the tool only as the enforcement host. Sources: the PostgreSQL
  `ALTER TABLE` and `CREATE INDEX` pages; `squawkhq.com` rules.

- **The Spring Data JDBC and `JdbcTemplate`-family ban — convention, added
  2026-09-01, no research pass behind it.** Written from an observed failure: an
  agent told "JPA banned" scaffolded a service on Spring Data JDBC as the
  compliant alternative, because the recorded ground for the JPA ban — dirty
  checking — does not apply to it. The grounds stated in the directive are query
  derivation from repository method names, reflective row mapping over column
  names, and a second persistence idiom beside jOOQ; none was verified against
  primary Spring Data documentation in that session. In particular the claim
  that `CrudRepository.save()` picks INSERT-versus-UPDATE from in-memory id
  state is marked **uncertain** and must be verified against the pinned Spring
  Data line before anything cites it; the aggregate-write behaviours beyond it
  were deliberately left out rather than shipped unverified. The
  artifact-ban-versus-type-ban split exists because `spring-jdbc` arrives
  transitively under the jOOQ starter — that transitive shape is also to be
  verified against the pinned Boot line at adoption.

- **The pin-creation directive — convention, added 2026-09-01, no research pass
  behind it.** Written from the same observed failure: an agent scaffolding a
  greenfield backend pinned a superseded Java LTS and a superseded Spring Boot
  major, because every version fact in this skill set is a dated record of a
  past pass, no directive stated a floor, and "Java at version pinned in build"
  resolves to nothing where no build file exists yet. The directive's
  enforcement is honestly split: Maven Enforcer owns the floor and the
  no-floating-versions half; "was newest at adoption" is an agent assertion
  against the vendor's release page, dated in the repo — the same shape as
  `llm-default-traps`' registry verification, with the same weakness. Named gap
  11 states that nothing distinguishes a pin that was newest at adoption from a
  pin already stale when written.

### The three Platform directives with no evidence note

**The WebFlux paradigm ban, the Flyway-migrations rule and the Jackson pick
carry no note in the evidence trail.** No pass claimed any of them, and each is
dated in [SKILL.md](SKILL.md) to **2026-06-11..14**, the only pass whose scope
covers them. **That dating is an inference drawn while writing this skill, not a
date a pass wrote down** — treat it as "no later than the platform decision"
rather than as a verification date.

**The same pass is the anchor for the whole platform choice, and `backend-stack`
now states what it did and did not record.** Its scope as recorded in this table
is persistence, where it named losers and grounds. **At the language and runtime
layer it named four candidates too — C#/.NET, Kotlin, Go and a TypeScript
backend — and that list was recovered on 2026-08-01 and published in
`backend-stack`**, which also states what the recovery did not supply: a primary
source for any ground, and a re-open trigger per loser. None of it changes the
three directives above, which no pass claimed at all.

What the WebFlux ban does rest on is the one-concurrency-model argument, and
that half is sound: the virtual-thread claims under *Concurrency* below are
confirmed, and the cost of a second concurrency model in one repo is that every
subsequent piece of code has to answer which model it is in. What is missing is
any pass that examined WebFlux itself, on its 2026 form, against this
premise. A repo with a genuine reason to want it should read this as an
unexamined ban rather than a refuted alternative.

## Concurrency

**Every claim here was re-verified on 2026-07-24 under a three-vote adversarial
panel.** The last note is a correction the 2026-07-27 observability pass made to
a concurrency rule.

- **Virtual threads are final since JDK 21 — API stability confirmed; the
  corpus-correctness inference is not (verified 2026-07-24).** Virtual threads
  are a final, non-preview feature since JDK 21, and the request-handling API
  (`Thread.ofVirtual`, `Thread.startVirtualThread`,
  `Executors.newVirtualThreadPerTaskExecutor`) has been stable since.

  **Do not cite** the further inference that "the corpus therefore generates
  correct virtual-thread code" — **it was refuted as unverifiable and
  overstated.** A stable API surface only means the *API names* are unlikely to
  be wrong. The corpus still emits the pooling anti-pattern and pre-JDK-24
  `synchronized`-pinning workarounds, which is precisely why the directives ban
  pooling and state the pinning residuals explicitly. Source:
  `docs.oracle.com/en/java/javase/21/core/virtual-threads.html`. The JEP page
  itself returned HTTP 403 to the fetcher, so the API facts were triangulated
  from the Oracle core documentation.

- **`synchronized` no longer pins on JDK 25 — confirmed (verified 2026-07-24).**
  The change was delivered in JDK 24; on JDK 25 the remaining pinning causes are
  native methods and foreign functions, plus blocking class initializers, which
  load classes through native frames and are removed only in JDK 26. Pinning does
  not make an application incorrect but it hinders scalability, and a liveness
  caveat survives: **pinning that exhausts all carriers can stall the
  scheduler**, so sustained pinning is an operability hazard rather than a mere
  slowdown. The single cited page names only the native and foreign causes; the
  `synchronized` and class-initializer facts rest on the JEP. Source:
  `docs.oracle.com/en/java/javase/25/core/virtual-threads.html`.

- **The framework enables virtual threads with one property — confirmed;
  `keep-alive` "required" refuted (verified 2026-07-24).**
  `spring.threads.virtual.enabled=true` enables virtual threads for request
  handling. **The starting claim that `spring.main.keep-alive=true` is
  *required* to stop the JVM exiting was refuted by majority**: the reference
  documentation says keep-alive is *recommended*, and the JVM-exit failure mode
  is scoped to no-web-server and scheduled-task-only applications — a servlet
  Web MVC app's embedded server keeps its own non-daemon thread alive, so it does
  not exit without keep-alive.

  **Do not cite** keep-alive as required for request handling. The introducing
  framework version is **convention**, not confirmed from a primary source —
  re-verify it against the pinned framework line at adoption. Source:
  `docs.spring.io/spring-boot/reference/features/spring-application.html`.

- **Never pool virtual threads; the connection pool is the semaphore — confirmed
  (verified 2026-07-24).** The Oracle JDK 25 guide states that virtual threads
  "should never be pooled" — one per task — and, verbatim, that "Database
  connection pools themselves serve as a semaphore… There is no need to add an
  additional semaphore on top of the connection pool." **The pool bounds only
  database concurrency**; a non-database limited resource still needs its own
  `Semaphore`. Source:
  `docs.oracle.com/en/java/javase/25/core/virtual-threads.html`.

- **Fan-out while holding a connection can deadlock a small pool — convention
  (verified 2026-07-24).** The pool-as-semaphore guarantee holds only for
  one-connection-per-task. A request that holds a connection or an open
  transaction and fans out to subtasks that each check out a connection can
  deadlock a small fixed pool; HikariCP's deadlock-avoidance formula
  `pool size = Tn × (Cm − 1) + 1` covers the multi-connection case, with `Cm`
  read at the logical-request level, and the JDK guide addresses only the flat
  one-connection case. Marked convention: the deadlock mechanics and the formula
  are primary-sourced, but **the mapping onto virtual-thread fan-out —
  connections spread across parent and child threads — is this rule set's
  synthesis**, and the rule is not statically detectable. Source:
  `github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing`.

- **`StructuredTaskScope` is preview on JDK 25 — confirmed (verified
  2026-07-24).** It requires `--enable-preview` to compile and run, and a
  preview-compiled class file is stamped `minor_version` 65535 and **will load
  only on the exact JDK feature release it was built on.** That is the
  load-bearing fact behind deferring structured concurrency: a preview API is a
  poor fit for a stability-seeking rule set whose code is machine-written. The
  API was redesigned across previews — a JDK 24 class with `ShutdownOnFailure`
  and `ShutdownOnSuccess` constructors became a JDK 25 sealed interface with
  static `open()` and `Joiner` factories — and remains preview after JDK 25.

  **The fine-grained per-release API history is convention or uncertain, not
  confirmed** — the JEP pages returned HTTP 403 to the fetcher — and the deferral
  does not rest on it. Source:
  `docs.oracle.com/en/java/javase/25/migrate/significant-changes-jdk-25.html`.

- **The Scoped-Value preference is qualified (2026-07-27).** It stands on the
  bounded lifetime and the write-once binding, **not on child-thread sharing**:
  that property is reachable only through `StructuredTaskScope`, which the
  preview ban forbids — an unqualified preference cites a property this stack
  cannot use. The inheritance facts are confirmed by the fan-out context panel — see
  the `java-backend-observability` skill, which owns that rule.

### The fan-out helper's ground is thinner than the rule around it

**The `ExecutorService.close()` semantics the fan-out helper rests on are
asserted in the rejected-alternatives record, not in a dated evidence note with
a primary source.** The claim is that `close()` neither cancels siblings on first
failure nor short-circuits, so the corpus-generated shape either runs every
sibling after one has failed or serializes the fan-out through sequential
`get()` calls.

Nothing in the trail carries a javadoc citation for it, and no pass listed the
fan-out helper in its scope. The directive is marked convention for that reason.
**Re-verify the close semantics against the pinned JDK's
`java.util.concurrent.ExecutorService` javadoc at adoption** — the helper is
worth building either way, because the cancel-on-first-failure and
exception-aggregation behaviour has to live somewhere, but the *ban* on the raw
shape is only as strong as this claim.

## Time

- **The injected `Clock` and the business-date split — convention
  (2026-07-21).** **No external evidence survived for either, and neither
  carries a citation.** Both are kept because they are enforceable and cheap.

## Null

- **JSpecify with NullAway — confirmed mainstream (2026-07-21).** Spring Boot 4
  and Spring Framework 7 (GA 2025-11) ship JSpecify-annotated null-safe APIs
  across roughly twenty portfolio projects, deprecate Spring's own nullability
  annotations, and check Spring's own build with NullAway. **The version pair is
  the ground for the marker**: a repo pinned below that line has not verified this
  claim for itself.

## The runtime-silent ban list

- **The ban list's defect-source claim — convention (2026-07-21).** **No
  external evidence survived, and the claim carries no citation.** It is kept
  because it is enforceable and cheap. The enforcement — a ban-list ArchUnit test
  class plus a meta-test asserting every ban is covered — **is not independent
  confirmation.**

- **Which tool hosts a ban is decided per rule by what each can read soundly.**
  ArchUnit reads bytecode, so it is sound for a type dependency and unsound for
  anything that turns on an argument's static type or on a lambda's body. Error
  Prone reads source, so it is sound for those and cannot see a compiled
  dependency's internals. The worked cases in this skill set are the
  unloggable-domain-type rule in `java-backend-observability` and two rules in
  `caching-java`; `llm-default-traps` carries the general form of the trap.

## Evidence toolchain

- **A real database over an in-memory substitute — convention (2026-07-21).**
  **No external evidence survived and the rule carries no citation.** Kept
  because it is enforceable and cheap.

- **A general coverage floor via JaCoCo's `check` goal — mechanics confirmed;
  thresholds deliberately kept the repo's call (verified 2026-07-25).** JaCoCo's
  documentation confirms that the `check` goal halts the build when a rule is
  violated (`haltOnFailure` defaults to true), declared per element — bundle,
  package, class — over a counter such as instruction, line or branch, on a value
  such as covered ratio with a minimum limit. So **a per-package floor that fails
  CI is off-the-shelf, not bespoke.** JaCoCo trails each Java release, so the pin
  must track the build's JDK.

  **Deliberately not adopted: the prior research's specific ratio numbers.** A
  floor tuned to one product's risk profile is not a platform default, and
  copying it here would present one product's call as researched guidance.
  Sources: the `jacoco.org` check-mojo and changes pages.

### The module boundary is enforced by ArchUnit, not by package naming

**Added 2026-10-06, owner's decision, convention.** The directive came out of a
review of an external research guide, *Software architecture for LLM coding
agents* (dated 2026-09-22, not published here), whose rule *a folder name alone
provides no enforcement* names the default this directive overrides, and from a
gap in this skill set: `ai-maintainer-principles` requires boundary tests for
declared modules, nesting and call direction, and no Java skill named their
host. The guide's §7 led with Spring Modulith's `verify()`, listed ArchUnit beside
it as suitable for module encapsulation, and advised preferring "the module system
or existing checks when they already enforce the desired property"; **the owner
chose ArchUnit** on the one-idiom ground the directive states.

- **The ArchUnit API — primary-source verified (2026-10-06).** The user guide,
  *Slices* and *Modularization Rules* sections,
  `https://www.archunit.org/userguide/html/000_Index.html`, documents
  `SlicesRuleDefinition.slices().matching("..myapp.(*)..").should().beFreeOfCycles()`
  and `ModuleRuleDefinition.modules().definedByPackages(..)`, which "follows the
  same semantics as `slices().matching(..)`". The signatures the directive uses —
  `beFreeOfCycles()`, `onlyDependOnEachOtherThroughClassesThat()`,
  `respectTheirAllowedDependencies(AllowedModuleDependencies, ModuleDependencyScope)`,
  `AllowedModuleDependencies.allow().fromModule(..).toModules(..)` and
  `ModuleDependencyScope.consideringOnlyDependenciesBetweenModules()` — were read
  from the `archunit-1.5.0` jar with `javap`, the version
  `dulguun0225/java-backend-template` pins. The user guide's own allowed-dependency
  example uses a repo-defined annotation and `onlyDependOnEachOtherThroughPackagesDeclaredIn`,
  which exists only for modules defined by annotation; the directive uses the
  package-defined form so module names bind to package names with no
  declaration beside them.
- **What each rule reports — primary-source verified by one local run
  (2026-10-06).** The code block in the directive was compiled against ArchUnit
  1.5.0 on JDK 25 and run over two fixture trees of the same shape. Over the
  clean one — `orders` reaching only `inventory.api`, both reaching `platform` —
  all three rules and the slices cycle rule pass. Over the violating one —
  `orders.internal` holding `inventory.internal.Stock`, and `inventory.internal`
  holding `orders.api.Orders` — every rule reports: the cycle
  `inventory -> orders -> inventory`, the three references into
  `inventory.internal`, and `Module Dependency [inventory -> orders]`. **Over an
  import matching no class, every rule throws** the empty-should
  `AssertionError`. **Over the violating tree with the pattern one level too
  shallow** (`com.example.(*)..`, so one module), **the cycle and API-only rules
  pass with no violation and no empty-should error** — the ground for the
  violating-fixture requirement. One run, one author, no panel.
- **What the rules do not see, and the strictest map — primary-source verified by
  a second local run (2026-10-06, the adversarial review).** Same ArchUnit 1.5.0
  jar, JDK 25. Pass with no violation under all three rules and the slices cycle
  rule: a class directly in the base package referencing `inventory.internal.Stock`
  (it belongs to no module); and a new module package with no cross-module edge.
  Under the shallow pattern the map rule passes too, beside the cycle and API-only
  rules above. A map naming a module that matches no package passes over the
  clean tree. `allow().fromModule("orders").toModules("platform")
  .fromModule("inventory").toModules("platform")` — no feature-to-feature edge —
  reports `orders -> inventory` over the clean tree, so the strictest map is
  expressible in the modules API; a map with no edge at all, written
  `allow().fromModule("platform").toModules()` because `allow()` alone does not
  compile, reports `inventory -> platform`, so it refuses the shared tier. A copy
  of the template's `featuresDoNotDependOnEachOther` at `20d913a` passes a feature
  `feedback` depending on `greeting` and reports `billing` doing the same, since
  its filter is `getDescription().contains("db")`; over one feature slice it passes, and over
  an empty import it throws the empty-should error.
- **The empty-should guard — primary-source verified (2026-10-06).** The user
  guide states a rule whose should-clause receives no class fails by default,
  and that `ArchRule.allowEmptyShould(true)` per rule or
  `archRule.failOnEmptyShould=false` in `archunit.properties` turns that off.
  `async-handoff-java` records the same guard and its one-line override, and
  states that it applies to every ArchUnit gate in a repo, not to broker rules
  alone.
- **Spring Modulith's verification — primary-source verified (2026-10-06).**
  The reference, version 2.1.1,
  `https://docs.spring.io/spring-modulith/reference/verification.html`, states
  that `ApplicationModules.of(Application.class).verify()` checks: no cycles on
  the application module level; efferent module access via API packages only,
  "all references to types that reside in application module internal packages
  are rejected", with dependencies into internals of open application modules
  allowed; and, optionally, explicitly allowed dependencies declared through
  `@ApplicationModule(allowedDependencies = …)`. It throws on any violation.
  The `spring-modulith-core` 2.1.1 POM on Maven Central declares
  `com.tngtech.archunit:archunit` 1.4.2 at compile scope.
- **Why ArchUnit won — convention (2026-10-06).** Not on capability: both
  express the three rules. Modulith adds a dependency carrying a second ArchUnit
  version line and its own declaration idiom, where ArchUnit already hosts this
  skill's ban list — `ai-maintainer-principles` *One idiom, imposed mechanically*. No run
  compared the two in a repo, and a repo already carrying Modulith for its event
  publication registry keeps the idiom ground and loses the dependency ground.
- **The template state — read 2026-10-06.** `dulguun0225/java-backend-template`
  at `20d913a`: `LayeringArchTest.featuresDoNotDependOnEachOther` uses
  `slices().matching(BASE + ".(*)..")` with platform and generated packages
  excluded and `notDependOnEachOther()`, and `platformDependsOnNoFeature` refuses
  a platform-to-feature dependency — the strictest map, in the slices idiom. The
  feature rule's only feature package is `greeting`. `BanListNegativeControlTest`
  evaluates only the `ArchRule` fields of `BanListArchTest`, so no fixture proves
  the layering rules fire, and the `docs/GATES.md` row for them cites
  *java-backend-rules package confinement*, a heading this skill does not have.
  The template owed the fixtures; the next two bullets record how that closed.
- **The by-consequence claim, corrected — read 2026-10-06 against the template's
  review.** As first written, the directive said the no-feature-edge map meets
  the three rules by consequence. **False as stated**: a review of the
  template's negative controls found that nothing constrained the generated jOOQ
  tree's own references, so a generated class naming a feature, or naming a
  platform class while the platform tier reads the tree — what a jOOQ forced
  type's converter does — closes a module cycle through the tree and passes every
  feature-edge and platform rule. Template commit
  `f161b43ce49e64cbff989857f1095c85be669b15` (*gates: the generated tree names
  nothing outside it*) records the finding and adds
  `generatedTreeDependsOnNothingOutsideIt`. The claim holds only where every
  module's outgoing dependencies are constrained, the generated tree included,
  the shared tier depends on no feature, and dependencies between shared-tier
  modules run one direction; the directive now says so, and names the template's
  rules as an instance of it.
- **The template state at `f161b43` — read and run 2026-10-06.**
  `LayeringArchTest` holds four rules, each a static factory over a base package:
  `platformDependsOnNoFeature` (the platform tier depends on nothing in the base
  package but itself and the generated tree), `generatedTreeDependsOnNothingOutsideIt`,
  `featuresDoNotDependOnEachOther` (feature slices compared by whole name,
  `Slice.getNamePart(1)`, not by description substring) and
  `controllersLiveInFeaturePackages` (any class meta-annotated with `@Controller`).
  Reflection finds every method returning an `ArchRule` or a subtype and fails one
  that is not a static factory taking the base package;
  `everyLayeringRuleHoldsOverTheMainCode` runs each over the main code and
  `everyLayeringRuleReportsTheFixtureTree` fails any that reports nothing over
  the test-only tree `starterfixtures.layering`, whose generated-tree stand-ins
  and the platform and feature classes reading them form the cycles above. Four
  further tests pin each rule to exactly its fixtures, so the other three rules
  are asserted to report neither generated-tree fixture. The template's
  `docs/GATES.md` row cites this directive, records the owner's decision that the
  no-feature-edge map stays, and lists what the rules do not reach: an undeclared
  module set, a base-package class's reference into a feature and a feature's into
  it, a reference with no type in the bytecode (reflection, a bean by name, an
  inlined compile-time constant), and a foreign-table write, which
  `TableOwnershipTest` owns. Vendored from the GitHub URL at that pin, all six
  `LayeringArchTest` tests ran green inside `mvn verify`.
- **Two references the rules do not see — primary-source verified by a third
  local run (2026-10-06).** ArchUnit 1.5.0, JDK 25 (`javac` 25.0.4.1). A class
  returning another package's `static final int` and `static final String`
  constants is not reported by a `dependOnClassesThat` rule into that package,
  while a class calling a static method there is: `javac` inlines the value, and
  no bytecode instruction names the declaring class — `javap -v` shows the
  constant pool keeping an unreferenced class entry for it, and the run shows
  ArchUnit does not count that entry as a dependency. And a
  feature module's internal class calling a class directly in the base package
  passes the cycle, `api`-only and map rules of the directive's code block, since
  that class belongs to no module.
- **Correction, and the template's three rules — read and run 2026-10-06.** The
  `f161b43` bullet above says the template's `docs/GATES.md` "records the owner's
  decision that the no-feature-edge map stays", and the directive called that map
  the strictest legitimate one. **The record was an error**: the strict map was
  the assistant's call, made in a task brief and mislabelled as the owner's
  decision — in that `docs/GATES.md` row, in the message of template commit
  `e3db6bf`, and in this skill's history. **The owner's decision, the same day:
  the ban on every feature-to-feature dependency is too strict as the template's
  permanent rule**, because a spec-kit spec can need one feature to call another,
  such as orders reserving stock from inventory; under the ban such a spec cannot
  pass the build without an edit to the boundary test. The generated-tree ban was
  the owner's explicit decision and stays. Template
  commit `a61aecd` (local and unpushed at writing, under review; it landed
  unchanged, with its review after it, next bullet) replaces `featuresDoNotDependOnEachOther` with the directive's
  three rules — `modulesAreFreeOfCycles` over every direct child of the base
  package, `featuresReachAnotherFeatureOnlyThroughItsApi` (the callee's `api`
  package itself) and `featureDependenciesAreInTheAllowedMap` over
  `ALLOWED_FEATURE_DEPENDENCIES`, one `caller -> callee` line per edge, empty —
  and adds `basePackageDependsOnNoFeature`, owner-approved. Every factory takes a
  `Layout`, the base package and its map, and the fixture tree is read with a map
  of its own. **Each new assertion was seen to fail under a temporary break of its
  rule** (ArchUnit 1.5.0, JDK 25): the cycle rule restricted to the shared tier
  missed the `orders`–`inventory` cycle the fixture map allows both ways; the
  `api` rule accepting any package of the callee went silent, and comparing
  against a wrong package reported the clean `billing` edge; the map rule waiving
  edges into an `api` package went silent; dropping `billing -> greeting` or
  `inventory -> orders` from the fixture map made the map rule report them; the
  base-package rule pointed at the platform tier went silent; and a substring
  feature filter silenced both feature-name fixtures. Probes, then reverted: a
  feature's reference into a base-package class and a map line naming no package
  both pass at `a61aecd` (the second closed by the review in the next bullet); a
  malformed main-map line fails the build; an array of another
  feature's internal type is reported. `node scripts/wall.mjs` green at the
  template root. In the directive, the strictest-map paragraph is gone; what
  stays true — the rules must reach the generated tree, by listing the shared tier
  in the map or by rules of its own — stays, and the blanket ban is the named
  loser.
- **The review of `a61aecd`, and the pin — read and run 2026-10-06.** An
  adversarial review of that commit landed as template commit
  `20ba55c7e4facd226d9aea160f409650710741d1`, pushed to `main` with it as a
  fast-forward; `new-java-backend` pins it. Three holes, each closed with a
  fixture or test: **a map line no dependency takes passed**, a line naming a
  feature that does not exist among them, so a typo or a line left after the last
  call stood as a permission no code had asked for — `featureDependenciesAreInTheAllowedMap`
  now reports each such line once every class is checked, and a repeated line
  throws like the other malformed forms; **a subpackage of `api` was refused but no
  fixture held it**, so widening the comparison to a prefix passed every test —
  `PartnerPlatformCallsGreetingApiSubpackage` now holds it; and **the reflection
  tests took any violation in the fixture tree as proof**, so a new rule could pass
  on another rule's fixture, the shape of the substring escape before `e3db6bf`,
  and a rule built inside a test method escaped both — `everyLayeringRuleIsAFactoryWithATestOfItsOwn`
  reads the test class's own bytecode and requires every rule to be built in a
  factory and every factory to be called by a test of its own. Each new assertion
  failed under a temporary break of its rule. Its `docs/GATES.md` row now states
  the boundary-test edit as a mechanism, not as a run that happened, since no
  record of such a run was found, and marks as the template's reading, not the
  owner's words: the `Money`-converter consequence of the generated-tree ban, a
  subpackage of `api` being internal, and an untaken map line failing. Template
  wall green locally; GitHub Actions run 37430316888 on `20ba55c`. Vendored from
  the GitHub URL at that pin under `com.acme.pinproof`, all eleven
  `LayeringArchTest` tests ran green inside `mvn verify`, the fixture map and the
  empty main map surviving the rename.

## Do not cite

Each of these was examined and either failed, or says something narrower than it
appears to.

- **"The corpus generates correct virtual-thread code."** Refuted 2026-07-24 as
  unverifiable and overstated.
- **`keep-alive` as required for request handling.** Refuted 2026-07-24; it is
  recommended, and the failure mode it guards is a different application shape.
- **The JEP pages** at `openjdk.org/jeps/*` — HTTP 403 to the fetcher on two
  separate passes. Use the Oracle javadoc and the `openjdk/jdk` sources instead.
- **jOOQ's dirty flags "not reset on rollback".** Unverified; nothing rests on
  it.
- **The per-release `StructuredTaskScope` API history** as a confirmed fact.
- **The introducing framework version for the virtual-threads property** as
  primary-sourced.
- **`Thread.ofVirtual()` javadoc for the inheritance default** — it does not
  state one. Cite `Thread.Builder.OfVirtual.inheritInheritableThreadLocals`.
- **`Executors.newThreadPerTaskExecutor` javadoc for when and on which thread a
  thread is created** — it is silent, which is precisely why the per-request
  context directive treats that path as unspecified.
- **A primary source for `ExecutorService.close()`'s sibling-cancellation
  behaviour.** None is recorded here; see *The fan-out helper's ground* above.

## What this skill does not carry

- **The HTTP contract rules and the observability rules.** They state their own
  conditions and are the `java-backend-api` and `java-backend-observability`
  skills. Both are keyed to this skill by subject rather than by id.
- **The money, caching and asynchronous-handoff rule sets.** Each states its own
  additional condition and each is its own published skill family. This skill's
  ban list puts the annotations on the list; those skills carry the replacements
  and the checks.
- **The cross-cutting dependency traps** that bind any agent-built repo on any
  stack, including this stack's jqwik version pin — `llm-default-traps`.
- **Threshold numbers.** No coverage ratio, no pool size, no pinning budget.
  Each is named as the adopting repo's call, deliberately, and **a gate with no
  committed operand passes over every case** — so a repo that leaves one unset
  has a rule reading as enforced that is not.

## Re-open triggers

- **jOOQ stewardship or vendor risk fires.** The named exit is Spring Data
  JDBC — explicit persistence with no dirty checking and no lazy loading, so the
  property that chose jOOQ still holds — **not JPA or Hibernate.** Taking that
  exit **replaces jOOQ repo-wide** as a platform decision; the directive's ban
  on Spring Data JDBC is on running the two beside each other, not on the exit
  itself. Absent that trigger, the persistence choice is not re-litigated.
- **jOOQ API or tooling drift.** If the pinned jOOQ version renames or adds
  record-mutation or fetch methods, changes its dirty-tracking defaults (the
  `changed()`-to-`touched()` rename and the record-dirty-tracking settings landed
  around 3.20), or stops shipping the plain-SQL checker and the `@PlainSQL` and
  `@Allow.PlainSQL` annotations, re-verify the banned method set, the
  `fetchSingle` and `fetchOptional` replacements, that `withAttachRecords(false)`
  remains the detaching default, and the plain-SQL enforcement path against the
  pinned manual.
- **Structured concurrency finalizes** — a JEP drops "preview" and the
  `--enable-preview` requirement for `StructuredTaskScope` in the pinned JDK.
  Re-run a small refutation pass on the then-current API shape, then reconsider
  adopting it and retiring the owned fan-out helper. **The same event reopens the
  fan-out context rule in `java-backend-observability`**, because that scope is
  the one construct that inherits a Scoped Value binding into a forked thread.
- **A pinning regression** — JFR shows sustained `jdk.VirtualThreadPinned` under
  load, traced to a specific library's native, JNI or foreign-function path.
  Isolate **that library** behind the whitelisted bounded platform-thread pool;
  **do not abandon virtual threads globally.**
- **The framework changes the enablement default or the daemon-thread and
  keep-alive behaviour**, or the introducing version needs confirming. Re-verify
  both against the pinned line.
- **Connection-pool saturation** — a load test shows a p99 regression tracing to
  the pool. **Tune the pool size, not the thread count**, and check for the
  hold-a-connection-while-fanning-out deadlock pattern.
- **Migration-lint stewardship** — if squawk's stewardship or its PostgreSQL
  dialect currency lapses, the named exits are Eugene or Atlas; the rule is the
  hazard class, not the vendor. And **if a PostgreSQL release makes a
  currently-flagged operation lock-free** — as PG 11 did for column adds with a
  non-volatile default — **drop that rule rather than carry a false positive.**
- **Coverage tooling or JDK coupling** — the build's JDK advances past the pinned
  JaCoCo release's support, or a package sits green at the floor while a mutation
  ceiling or a characterization replay shows its tests are vacuous. Bump JaCoCo,
  or re-tune that package's ratio — **never lower the floor to make CI green.**
- **Mutation-testing scope.** Mutation testing stays money-only by design.
  Reopen extending it only on a concrete trigger: a general-tier defect traced to
  vacuous machine-written tests, or diff-scoped mutation testing becoming
  affordable across the portfolio.
- **The JDK pin moves past 25.** Re-verify the pinning residuals, the enablement
  flags, and the structured-concurrency status at the new version.
- **A named enforcement host gains or loses support for the newest LTS** —
  JaCoCo, Error Prone, NullAway or pitest starts or stops supporting the LTS a
  greenfield repo would pin today. Re-open which LTS the next repo pins; the
  pin-creation directive's one-LTS-back escape exists for exactly this state.
- **The WebFlux ban is examined.** Not a trigger the passes wrote down — it is
  added here, because no pass examined the alternative it bans. A repo with a
  genuine requirement for a reactive stack should raise it as a platform decision
  rather than satisfy the letter of this ban — and `backend-stack` is where a
  platform decision is argued, on the criterion that a second concurrency model
  is a class of defect no build can reject.

## Markers, dates, and what they mean

**Moved here from `SKILL.md` on 2026-08-02, verbatim.** The marker definitions, the
per-claim markers beside each directive, the marker ceiling and the lapse rule all
stayed in the directive text; this is the claim ledger they refer to — what each
claim is, what marker it carries, and the date it was taken.

| Claim | Marker | Date |
| ----- | ------ | ---- |
| jOOQ attached-record writes choose INSERT-versus-UPDATE and column set from in-memory state | confirmed | 2026-07-25 |
| `fetchOne` tolerate zero rows, `fetchAny` pick arbitrarily; `fetchSingle` throw on both | confirmed | 2026-07-25 |
| Plain SQL defeat jOOQ type checking, reopen injection surface | confirmed | 2026-07-25 |
| jOOQ transaction API lambda-scoped, JDBC connection start in autocommit | confirmed | 2026-07-25 |
| Four flagged migration operations lock or rewrite | confirmed | 2026-07-25 |
| Generating jOOQ code from migrations in throwaway container | convention (mechanism primary-sourced) | 2026-07-25 |
| Single-seam plain-SQL discipline, and checker wireability | convention | 2026-07-25 |
| Making `DSLContext` non-injectable | convention | 2026-07-25 |
| Choosing squawk over alternative migration linters | convention | 2026-07-25 |
| Virtual threads final, request-handling API stable | confirmed | 2026-07-24 |
| Virtual threads should never be pooled | confirmed | 2026-07-24 |
| Connection pool already semaphore, need no second one | confirmed | 2026-07-24 |
| Virtual-threads enablement property | confirmed | 2026-07-24 |
| `keep-alive` be *required* | **refuted** — do not restore | 2026-07-24 |
| `StructuredTaskScope` preview, artifacts version-locked | confirmed | 2026-07-24 |
| Residual pinning on JDK 25 native-only | confirmed | 2026-07-24 |
| Fan-out while holding connection can deadlock small pool | convention (mechanics primary-sourced) | 2026-07-24 |
| Fan-out helper necessity, from executor close semantics | convention | 2026-07-24 |
| Scoped Value binding never reach subtask on this stack | confirmed | 2026-07-27 |
| JSpecify with NullAway mainstream on this stack | confirmed | 2026-07-21 |
| JaCoCo `check` goal halt build on ratio floor | confirmed | 2026-07-25 |
| Injected clock and business-date split | convention, no citation | 2026-07-21 |
| Ban list defect-source claim | convention, no citation | 2026-07-21 |
| Real PostgreSQL over in-memory substitute | convention, no citation | 2026-07-21 |
| Choice of jOOQ over JPA | convention (no per-claim marker recorded) | 2026-06-11..14 |
| Spring Data JDBC grounds — query derivation, reflective mapping, second idiom | convention, no research pass | 2026-09-01 |
| `CrudRepository.save()` picks INSERT-versus-UPDATE from in-memory id state | **uncertain** — verify before citing | 2026-09-01 |
| Pin created at newest supported LTS and newest Boot GA at adoption | convention, no research pass | 2026-09-01 |
| WebFlux paradigm ban, Flyway rule, Jackson pick | convention, no evidence note | 2026-06-11..14 (inferred) |
| Module boundary enforced by ArchUnit, Spring Modulith rejected on idiom | convention, owner's decision | 2026-10-06 |
| ArchUnit 1.5.0 modules API, the three rules' reports, the shallow-pattern pass | primary-source verified (user guide, `javap`, one local run) | 2026-10-06 |
| Spring Modulith `verify()` rules, open modules, ArchUnit 1.4.2 dependency | primary-source verified | 2026-10-06 |
| Base-package classes, an edgeless new module and a map naming no module pass; the no-feature-edge map refuses a feature edge; the template's substring filter at `20d913a` passed `feedback` | primary-source verified (a second local run) | 2026-10-06 |
| The no-feature-edge map meets the three rules by consequence only with every module, the generated tree included, constrained, the shared tier depending on no feature and one way inside itself | convention, from the template review recorded in `java-backend-template` `f161b43` | 2026-10-06 |
| An inlined compile-time constant and a feature's reference into the base package pass | primary-source verified (a third local run) | 2026-10-06 |
| "The no-feature-edge map stays" as the owner's decision | **error** — the assistant's call, recorded as the owner's; corrected | 2026-10-06 |
| The ban on every feature-to-feature edge rejected as the shipped form; an edge is one map line | convention, owner's decision | 2026-10-06 |
| The template's three rules over an empty feature map and its base-package rule, each fixture failing under a break of its rule; a feature's reference into the base package and a map line naming no package pass (the second at `a61aecd` only) | primary-source verified (local runs on template `a61aecd`, unpushed) | 2026-10-06 |
| Template `20ba55c`: a map line no dependency takes fails, one naming no feature among them; a reference into a subpackage of `api` is reported; every layering rule is built in a factory with a test of its own | primary-source verified (local runs, each assertion failing under a break of its rule; CI run 37430316888; vendored under a renamed package) | 2026-10-06 |
