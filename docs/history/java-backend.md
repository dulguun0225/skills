# The Java-backend skill family

*Extracted from `CLAUDE.md` 2026-08-02, unedited except that cross-section pointers became file links. Where older text says "this file", it means the project record, which was one file then.*


Authored 2026-07-30, straight after `llm-default-traps`, one pass. Six files:

```
skills/java-backend-rules/          SKILL.md  evidence.md   Platform, Concurrency, Time, Null, ban list, evidence toolchain  31
skills/java-backend-api/            SKILL.md  evidence.md   the general API contract                                        22
skills/java-backend-observability/  SKILL.md  evidence.md   the general Observability section                               14
```

67 directives, each defined exactly once, one `###` heading each. All three listed by `npm run check`, which listed thirteen when family shipped. Drawn from the Java-backend paste text **minus its money, cache and broker sections**, three already-converted conditional groups — with evidence from the Java-backend pack evidence notes under same eight headings, plus its rejected-alternatives + re-open-trigger sections.

### What was forced by the four precedents

- **Both open questions from [the decomposition record](decomposition.md) answered as every skill answered**: each skill instruct agent directly, each carry one-time `## Wiring the gates` section with record of what wired and what skipped, cuz **gate = what catch next agent.**
- **No rule ids**, following `llm-default-traps` decision 2 — pack have none to inherit, `###` headings = durable anchor, cross-skill citation by skill name plus subject. **No `P-n`, no `B-n`, no `DECISIONS.md`, no reference into corpus, no link leaving skill dir** — verified by script.
- **Marker + date inline on every directive**, evidence one hop away, marker ceiling stated near top of each file, `review-by` **2027-01-21** with lapse rule, status tier **decided, not yet validated** glossed as *no production use yet* — checked against definition not written from phrase.

### What this family decided that no predecessor did

1. **Stack-only family: three skills, no neutral sibling, split rule in [the decomposition record](decomposition.md) no reach this case.** That rule closed for cross-stack sources and no cover pack; `llm-default-traps` shipped as one skill. Here pack **is** stack — every directive name Java tool, so nothing portable to lift out and no per-stack instantiation to defer tool to. **Consequence that bite: tool named only in evidence trail must be named in directive, cuz no stack sibling to name it in.** Money audit finding arriving through different door, and review below found twelve instances.
2. **Cut by *what agent doing*, and two of three lines = source own stated conditions.** API-contract section state it bind when OpenAPI document exist; Observability section state it bind when nobody watch running system. Those became skills. **Unlike `async-handoff-shapes` this no pure dormancy cut**, difference recorded cuz it look like one: the Java-backend pack when-this-applies section explicit that repo with staffed rota **keep observability emission rules** — code rules under pack main premise — and re-decide only alerting ones. So that skill condition partial, and skill say which half survive dropping premise. **Only place in set where dropping premise drop part of rule set.**
3. **Third ground for cut = progressive disclosure, stated cuz dormancy argument alone no carry it.** Agent writing jOOQ query should not load 22 contract directives or 14 telemetry directives. Always-loaded bodies ~700, ~640, ~460 lines not one ~1800-line file, and three descriptions each fire at own moment — add endpoint, add log line, write query.
4. **Names keep `java-backend-` prefix so family visible in flat list**, and `java-backend-rules` keep name table already carried. `java-backend` alone rejected: read as "everything about Java backends" for skill excluding contracts, telemetry, money, caching, async handoffs.
5. **Ban list = one place marker + date *not* inline per directive, and skill say so.** Its six entries share one ground + one enforcement host — source state check once, in last bullet — so marker (**convention, 2026-07-21**) + host stated once at group head with explicit note this deliberate not dropped marker. Every other directive in family carry both inline.
6. **Three Platform directives have no evidence note anywhere**, dates = inference not verification. WebFlux paradigm ban, Flyway-migrations rule, Jackson pick dated **2026-06-11..14** cuz only pass whose scope cover them, and all three skills say dating drawn during conversion. **WebFlux ban = consequential one** — no pass ever examined alternative it ban, so `evidence.md` state it as unexamined ban not refuted alternative and add re-open trigger passes no write down.
7. **`confirmed` mean two different things inside `java-backend-rules`, and date tell them apart.** 2026-07-24 concurrency pass ran three refutation votes; 2026-07-25 persistence pass wrote *confirmed* against single-researcher documentation checks. Both usages carried not re-graded — **re-mark someone else verdict not what converting do** — with ambiguity stated at top of file. `java-backend-api` = pure case: **every** *confirmed* there = documentation check, cuz that pass cast no vote at all.

### The interlocks, and which ones now resolve

- **`llm-default-traps` → resolved, interlock previous conversion could only narrow.** That skill publish ban on ArchUnit as host for non-loggability rule; **rule itself now *domain types are unloggable by type* in `java-backend-observability`.** Both sentences saying domain-type rule unpublished rewritten, in `llm-default-traps/SKILL.md` + its `evidence.md`, each stating why ban stay there not move here — erasure trap bind every JVM repo, this skill bind one backend stack.
- **`caching` → resolved twice.** Its erasure-trap paragraph + `caching-java` `C-10` both said domain-type rule belonged to unpublished platform rule set; both now name skill. And **"rebuildable-cache premise" naming collision now have both sides published** — `caching` deliberately say *derived-store premise* to avoid redefining telemetry disposability, and that directive now *telemetry is rebuildable, disposable data* here, stating collision from own side. Three edits in `caching/SKILL.md` + `caching/evidence.md`, one in `caching-java`.
- **`money` + `money-api` → pointers added, not resolutions.** `M-26` note in `money/evidence.md` said contract conformance fuzzing "is now a general rule" with no published home; now name *the committed document is the single conformance oracle*. `M-18` said "a repo with no such general rule states one here"; now name general rule. **Both original sentences stay true and neither replaced wholesale** — `llm-default-traps` lesson applied: check what new skill publish against what old sentence claimed, cuz wholesale replacement sometimes false.
- **`java-backend-rules` → `caching` + `async-handoff`, new outbound interlock.** Transaction seam = shared resource and **two published skills add requirements to it this family directive no state** — `C-9` need cache invalidation reachable only from its post-commit registration, `E-5` need general-purpose post-commit callback *not* exist. Seam directive name both and say plainly it fix transaction boundary and not post-commit surface.
- **Cross-family reference style unchanged: name skill, never link to it.** No relative link leave any skill dir in family.

### Still open for this family

- **No panel run over two of three areas.** Contract pass ran one researcher and cast no refutation vote; observability pass panelled exactly one claim. Only 2026-07-24 concurrency group + 2026-07-21 founding group had votes. **Run panels = what promote those markers**, and both skills say so at top not only in `evidence.md`.
- **`java-backend-api` have no decimal-string directive, and source claim it do.** The Java-backend pack rejected-alternatives section, integer-minor-units rejection say API-contract rules "extend the string-decimal choice to every decimal field" — but no directive in general section state it. Rule that do = `M-15` in `money-api`, filed under money-grade. **So repo with rate or percentage field on wire and no money feature have no rule at all.** Found while authoring, stated as that skill first named gap, family clearest content gap not enforcement one.
- **Mutation-testing gap in general tier.** Coverage floor cannot see whether test asserted anything, and mutation testing scoped to money packages only — verified in `money-java`, which pin pitest "scoped to the money packages". So general-tier package can sit green over vacuous machine-written tests with nothing detecting it. Source name triggers that would extend it; none fired.
- **`ExecutorService.close()` ground thinner than rule built on it.** Fan-out helper ban on raw shape rest on close semantics asserted only in rejected-alternatives record, with **no javadoc citation anywhere in trail and no pass listing helper in scope.** Marked convention, with re-verify-at-adoption instruction. Helper worth building regardless; *ban* only as strong as that claim.
- **Three-Platform-directives gap + WebFlux question** — item 6 above.
- **The Java-backend pack rejected-alternatives + re-open-trigger sections gain no row, hit no rule conflict.** Unlike the money-grade source instantiation table + the event-broker-discipline source instantiation table, **pack** have no instantiation table, so nothing to write into corpus and nothing to decide. That conflict stood for two sources until corpus deleted 2026-08-01, which closed it unwritten.
- **No check enforce any conversion invariant**, same as after every previous family. Sweep over these six files run **by script** 2026-07-30, clean: 67 directives across three skills totalling exactly 67 directive bullets in that region; every directive carry check + marker + date except six ban-list entries covered by group-level marker; no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into corpus, no link leaving skill dir, no reference to unpublished prior-art documents by name. `npm run check` see none of three `evidence.md` files.

### The adversarial review, 2026-07-30

Run against the Java-backend paste text platform sections, the Java-backend pack when-this-applies, rejected-alternatives, evidence and re-open-trigger sections, and ten previously published skills. **Structure held and checked mechanically**: 67 directive statements distinctive tokens — every backticked identifier, RFC number, status code in seed directive region — diffed against three skills, 121 distinct tokens checked. **Five findings generalise:**

- **Stack skill with no neutral sibling will hedge tool names anyway, and hedge invisible to every other check.** Twelve of 121 paste-text tokens missing, and **every one a tool skill described instead of naming**: `ProblemDetail`, `ResponseEntityExceptionHandler`, `@PatchMapping`, `ISO_LOCAL_DATE`, `MeterFilter`, `promtool test rules`, `GeneralCodingRules.NO_CLASSES_SHOULD_ACCESS_STANDARD_STREAMS`, `NO_CLASSES_SHOULD_USE_JAVA_UTIL_LOGGING`, `jacoco-maven-plugin`, `COVEREDRATIO`. Plus springdoc, HikariCP, Prometheus, which seed name unbackticked and skills reduced to "the code-first generator", "the connection pool", "the metrics vendor". **Cause = style carried from neutral skills, where withhold tool correct** — and money audit found same defect from other direction, as hedge in stack skill whose evidence named tool. **Mechanical form of check = finding worth keeping: extract every identifier-shaped token from source directive region and require each in converted text.** Caught all twelve; no marker, id or link sweep would catch any.
- **Superlative about other skills = count in disguise — async-handoff review finding, repeating on very next conversion.** `java-backend-rules` called fan-out context rule "the one rule in this skill set with a full three-vote adversarial panel behind it." **False**: money founding pass ran three votes per claim, caching pass ran three on load-bearing claims, and this family own 2026-07-24 concurrency group had one. Narrowed to "the one rule in that skill's area." **Seventh instance of counting failure in repo.**
- **Ceiling stated as "exactly one confirmed claim" must check against marker table, not pass note.** `java-backend-observability` said one claim alone carry *confirmed* while own table gave marker to two directives — fan-out capture + backend pin — cuz panel produced **both** ("pin the backend, and do not depend on inheritance even where it works" = one conclusion not two findings). Three places said one; named gap said "thirteen of these fourteen." All now say two, and gap **name** exception instead of counting remainder.
- **Dormancy claim need enforcement halves enumerated, or wrong in both directions.** `java-backend-api` said that without OpenAPI document "most of them are dormant, and the two directives that survive say so inline." Neither half true: most directives survive in some form cuz ArchUnit or test host them, and more than two do. Replaced with actual split — six gates plus every lint go dormant; eleven ArchUnit-or-test-hosted rules no — **stated before first directive, cuz reader without document need it to know whether skill apply at all.**
- **Write-once violation between new skill and published one hide inside rejected-alternatives bullet.** Ban-list entry for caching annotations restated **all four** of `caching` rejection grounds, which that skill already carry as language-neutral rejected alternative. Source own division: neutral grounds live in cache source and *pack add Spring-specific one*. Now entry state ban, add only stack-shaped ground (size of corpus pull on this stack), defer four, warn that repo installing this skill without `caching` **have ban and no replacement**. **Rejected-alternative prose = where duplication survive id-uniqueness sweep**, cuz carry no id.

Rest, no generalise: exponent-4 contradiction attributed to "the same pass's storage note" when disagreement **between** 2026-07-21 storage pass and 2026-07-25 contract pass — cross-file citation getting *provenance* wrong not id; five vendors anonymised as "one large vendor", "a well-known payments API", "a second well-known API", "one payments vendor", "the metrics vendor" where `money-api` name Stripe, Adyen, PayPal outright, so all now named (Stripe, GitHub, Salesforce, Google AIP-158, Prometheus) for consistency and cuz named loser = load-bearing half; "two of the three halves" of logger ban conflated ArchUnit two public rules with per-repo raw-logger predicate, now stated without count; three directives lacked date or confidence marker (*the ban list is an executable test class*, *no offset parameter in the contract*, ban-list group), all now carrying one; and prior-art references — internal decision record + deep-research result of another repository — were consumer-facing pointers at unpublished material, now stated as such in all three `evidence.md` files = caching review finding applied to provenance note not claim.

**Left standing deliberately.** Three-way split + its non-dormancy third ground; no rule ids; naming PostgreSQL, jOOQ, Flyway, squawk, springdoc, vacuum, oasdiff, Schemathesis, Logback, Log4j 2, reload4j, Micrometer, Prometheus, promtool, JaCoCo, HikariCP, ArchUnit, Error Prone, NullAway, JSpecify, Jackson, Testcontainers in what are stack skills by construction; carrying source own inconsistent use of *confirmed* not re-grading it, with inconsistency stated; ban list group-level marker.

### The second review, 2026-07-30

Run straight after first, against same sources. **Structure re-verified by script and held**: 67 directive headings totalling paste text 67 bullets, each carry check + marker + date except six ban-list entries group-level marker cover; 115 of seed 116 directive-region tokens present, one absentee = concatenated method list whose parts each named; no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into corpus, no prior-art document named, every link `SKILL.md` ↔ `evidence.md` inside own dir, thirteen skills existing then listed by `npm run check`. **Five findings generalise, first three = one finding wearing three faces:**

- **De-naming defect have second home, and first review check could not see it.** That check extracted identifier tokens from **paste-text directive region** and caught twelve hedges. Run same extraction over the Java-backend pack evidence notes — *evidence* source — surface **23 more, every one in an `evidence.md`**: `Byte Buddy`, `LogbackMDCAdapter`, `BasicMDCAdapter`, `ContextPropagatingTaskDecorator`, `spring.task.execution.propagate-context`, `Slf4jThreadLocalAccessor`, `ContextSnapshot`, `MDC.setContextMap(null)`, `CommonStructuredLogFormat`, `@JsonCreator`, Jackson `required`, idempotency draft full name, Fowler Optimistic Offline Lock, JPA `@Version`, springdoc issue numbers. **Check was right and its input region too narrow** — previous session recorded mechanical form as finding worth keeping, and form worth keeping; run it over every source region skill draw from, not only paste text.
- **Do-not-cite entry whose subject anonymised cannot be obeyed, worse than no entry** — tell reader trap exist and withhold which thing = trap. Four shipped: "Cite the order-flag issue, not the earlier unrelated one" (#1362 versus #857), "Cite the fix version and the commit" (LOGBACK-624, 1.1.5, `aa7d584`), "Cite the repository" (`micrometer-metrics/context-propagation`), and — sharpest — "its two open or closed issues **named above**", which name neither, in sentence claiming they named. **Async-handoff review rule: claim to have verified is itself claim to check; this add that claim to have *named* is too.**
- **Tool paste text name dropped in exactly two places it name, and inserted in two places it leave generic.** `vacuum` host all five OpenAPI lints; paste text name it for offset-parameter + temporal-naming rules and say only "a lint" / "an OpenAPI lint" for problem-schema + `PATCH` rules. Conversion inverted all four, and wiring step, named gap, re-open trigger hedged it as "the lint host" besides. **First review sweep passed cuz string present somewhere in file. Presence not placement — token check must be per-directive, not per-file**, one respect in which mechanical form recorded above insufficient as recorded.
- **Eighth instance of counting failure, first where skill count contradict own `evidence.md` *and* source.** `java-backend-observability` said "**Seven** of the directives below are convention"; six are, seventh item = *claim* inside directive whose tool split primary-source verified. Own `evidence.md` list six and so do the Java-backend pack evidence notes. Now stated by name with no count, mixed directive called out separately with instruction to read marker beside each half. **New lesson: count can be wrong by silently promoting claim to directive**, which no id or marker sweep see cuz both halves correctly marked where they sit.
- **"*confirmed* means N things and the date tells you which" gloss = enumeration, and decay like one.** `java-backend-rules` mapped **2026-07-24** + **2026-07-25** and omitted **2026-07-21**, which also ran three-vote panel — so reader holding one 2026-07-21 *confirmed* in file (nullness) told nothing by sentence written to tell them. Now every date appearing in file mapped, including 2026-07-27 (whose panelled claim belong to sibling skill) + 2026-06-11..14 (carrying no *confirmed* at all, stated so absence no read as omission). **Marker-gloss finding from `llm-default-traps` review arriving through date axis not definition axis.**

Rest, no generalise: `java-backend-rules` called fan-out context capture "the one rule in that skill's area with an adversarial panel behind it" while `java-backend-observability` say **twice** panel produced **two** rules there — ninth instance of counting failure, second time this exact cross-reference needed narrowing; "Concurrency is the strongest group in **this skill set**" = superlative in disguise twice over (nullness panelled too, and "this skill set" read as all thirteen), now stated as fact with ranking dropped; "**Four** more corpus defaults are rejected elsewhere" counted sentences not defaults, count gone; "**one of them** is an ArchUnit ban that reuses the same host" where six are; dormancy split claimed "**every** lint" while enumerating four of five — omitting problem-schema lint own wiring step list — and two lists now cross-reference each other with explicit tie-breaker (**when same set must be enumerated twice, say which copy authoritative**), plus two directives sitting in neither list now named as sitting in neither and why; WebFlux ban said "the one-concurrency-model ground it rests on is the confirmed part" when no pass examined that argument, now stated as nothing about ban being confirmed; "two markers were corrected **downward-to-upward**" garbled *enforcement* correction (bespoke → off-the-shelf) into confidence one, now stated as enforcement change with "nothing about their confidence changed"; and *the closed page catalog*, carried verbatim from source re-open trigger, = consumer-facing pointer at construct **no directive in skill establish** — now kept with that said = caching review finding applied to trigger not claim.

**Still unbuilt, unchanged.** No check enforce any of this; both sweeps run from scratch script, and neither widened token extraction nor per-directive placement check exist in repo.


## The layer check, 2026-08-02

**The only check owed on this family** — the predicate check is n/a (a stack rule set has no portable predicate) and the composite-shape check is n/a (it instantiates other rule sets' shapes). Run over **each skill's own rules**, the ones that are not an instantiation of another skill. **No marker promoted.**

### `java-backend-rules` took all three findings

1. **`Clock` is injected reaches one language, and this skill owns the stack's clock ban.** ArchUnit matches the four banned calls in bytecode. **`now()` and `current_timestamp` in query text, a column `DEFAULT` of one, and a trigger that sets one are each a wall-clock read** reaching the row the application writes — and on this stack they are *more* likely than the banned Java calls **precisely because the Java calls fail the build.** **`async-handoff` `E-23` already depends on this ban reaching further than it does**, and its own layer clause points here; so do the regenerate-and-diff gates that assume committed inputs, which are a class rather than a rule and are named as one. **The count that stood here — *two published rules* — was corrected by the enumeration check the same day**, because one of the two was a category. The host exists one family over — `money-java` `M-35` already pairs an ArchUnit predicate with a lint over committed query text, view and function definitions and migrations — and what it needs added is clock functions in query text and clock defaults on columns — named, not counted. Not wired.
2. **The ban list matches spellings.** Every predicate matches a banned annotation **directly on a member**; a repo-defined annotation meta-annotated with a banned one resolves identically at runtime and passes. **`async-handoff` `E-2` states the requirement outright** — *check meta-annotated and type-level forms, not just method-level direct annotation*, verified there against one framework's own documentation — and **this list, which every other stack rule in the family points at, carries no such clause.** One sibling learned the lesson and the sibling that owns the list did not. The configuration half is the same shape: a scheduler, cache manager or aspect declared in a properties file produces the banned behaviour with no annotation present, which `caching-java` records from its own side.
3. **The migration lint parses SQL and a migration need not be SQL.** A Java-based migration or callback does the same DDL through JDBC and presents squawk no text. **The second-order effect is the larger one**: the regenerate-jOOQ-from-committed-migrations chain assumes the migrations are the complete schema history, so DDL applied outside the tool makes that generation **wrong rather than merely incomplete**. The drift check that would catch it is not carried anywhere here.

### `java-backend-observability` took two

- **Error Prone reads this repo's source, and two other things emit log lines.** A dependency logging a domain type never imports the facade, and the appender's own configuration — a pattern rendering the whole context map, a structured layout serialising an object's fields — decides what a line contains. **Only a converter at the logging backend reaches a dependency at all.**
- **A rule that fires in a test and a rule that reaches somebody are two claims.** The fire-test proves the expression fires; a silence, an inhibition, a routing tree that drops the label set, or an expired receiver decides whether anything happens. **Under this skill's own premise — no staffed rota, operator comes only after an alert fires — the alert is the whole channel**, so a silenced rule is exactly the failure the directive exists to prevent, with a green fire-test beside it. `ai-maintainer-principles` names alert rules in its own operational-surface list and `guardrails-toolchain` requires a gate to state its environment; **neither covers the routing configuration**, and committing and diffing it is what makes a silence a git-visible line.

### `java-backend-api` largely cleared, and the clear is structural

Its central artefact is **generated from code and diffed**, not checked against code — so a route cannot exist that the document misses. Its temporal rules name **the pinned serialization time module** as the mechanism rather than the document as the check, which is exactly the crossing that bit `caching` `C-10` and the wire-string rule in `primary-keys`. Its cursor rule already rejects a cursor whose sort spec no longer matches.

**That clear narrowed a finding from an earlier run the same day.** `primary-keys`' layer check had left open that the enumerable-key contract lint reads a committed document while a route declared only in framework annotations binds an id the document never mentions. **A stack that generates the document from the routes has that for free**, so the gap is real for a hand-written or separately-specified document and closed otherwise. Narrowed in `primary-keys` by opening this skill rather than assuming — **the sweep obligation running in the direction that removes a finding rather than adds one.**

## The Spring Data JDBC ban and the pin-creation directive, 2026-09-01

Written in the sibling `../asdlc` repository while it held these skills, ported
here 2026-09-16 ([asdlc-port](asdlc-port.md)). **No research pass behind either;
both are convention, written from one observed failure**: an agent told *JPA
banned* scaffolded a greenfield service on Spring Data JDBC, a superseded Java
LTS and a superseded Spring Boot major — because the recorded ground for the JPA
ban, dirty checking, does not carry to Spring Data JDBC, and because *Java at
version pinned in build* resolves to nothing where no build file exists yet.

- **Spring Data JDBC and the `JdbcTemplate` family are banned on their own
  grounds** — query derivation from repository method names, reflective row
  mapping, a second persistence idiom beside jOOQ — and the ban is scoped: Spring
  Data JDBC stays the named exit if jOOQ stewardship risk fires, and taking the
  exit replaces jOOQ repo-wide rather than running beside it. That scoping moved
  into `SKILL.md` because consumers vendor the skill with `evidence.md` stripped.
  Two hosts, per what each reads soundly: artifact bans for the Spring Data
  starters, a type ban on the ArchUnit ban-list class for `JdbcTemplate`,
  `NamedParameterJdbcTemplate`, `JdbcClient` and `SimpleJdbcInsert`, since
  `spring-jdbc` arrives transitively under the jOOQ starter and an artifact ban
  would break the build. A review the same day found wiring item 2 delegating to
  a ban-list entry item 1 never named — the *rule described as enforced that is
  not* shape — and item 1 now names the type ban.
- **The pin is created at the newest supported LTS.** Greenfield pins the newest
  Java LTS and newest Boot GA, verified against the vendor's release page and
  dated in the repo; an existing pin wins over every version fact in this skill
  set; no floating versions; one LTS back where a named enforcement host cannot
  gate the newest, host recorded. Maven Enforcer (`requireJavaVersion`,
  `banDynamicVersions`) is wiring item 11 and pins what was chosen; **named gap
  11: nothing distinguishes a pin that was newest at adoption from one already
  stale when written**, the same class as `llm-default-traps`' registry check.
- **One claim ships uncertain in both files**: that `CrudRepository.save()` picks
  INSERT-versus-UPDATE from in-memory id state. Nothing rests on it; the
  evidence ledger carries it as *verify before citing*, and `BACKLOG.md` owes
  the verification.
- **The description grew** by *before creating a build file or pinning the Java
  or Spring Boot version for a new repo*. Unmeasured: both firing cases for this
  skill use an existing-repo fixture, which is exactly the hole — owed on
  `BACKLOG.md` under *Firing owed*.


## The request-body rules, 2026-09-25

Written from one observed failure, no research pass; the ground, with its markers,
is `java-backend-api/evidence.md` under *Request bodies*. In
`netcore-platform/reference-data`, built by `build-feature` from
`java-backend-template`, update endpoints across four features accepted the path's
identifier in the body and refused a differing value — nine echo members, five
`*-immutable` codes — until the service's own commit `1b74507` replaced them with a
strict request reader. The echo started in the first feature's plan artifacts
(`1f28db6`), not in the human-written spec, which asks only that an attempt to change
the code be refused; later plans copied it by analogy and one plan-review round
re-added it for consistency. Root cause as recorded: **Spring Boot's lenient reader
leaves an echo compared against the path as the only refusal a plan can design**,
and no skill said otherwise. The owner's decision was a root-cause fix here; the
service is not changed again.

- **`java-backend-api` gained `## Request bodies`**, three directives: *A request
  body refuses every member its type does not declare*; *An identifier travels in
  the path only*; *Each operation binds its own request type, and an update type
  declares only what it writes*. The checks are written against the mechanism
  `1b74507` built and the template port keeps its names — `StrictJsonBodyConverter`,
  `BoundBody<T>`, `BanListArchTest.requestBodiesBindThroughBoundBody`,
  `RequestBodyContractTest`, `StrictBodyEndpointIT`, and a vacuum rule for closed
  request schemas. **Strictness is scoped to the request reader, not the global
  Jackson flag**, and the directive says why against `async-handoff`'s tolerant
  decode rule for messages, cited by skill and content rather than by id alone.
- **Two tool facts were checked against the tools, 2026-09-25**: Boot 4.1.1's
  Jackson auto-configuration disables `FAIL_ON_UNKNOWN_PROPERTIES` (bytecode), and
  vacuum 0.30.5 core functions can assert `additionalProperties: false` on every
  top-level request-body schema (run against the service's document before and
  after its fix: exit 1, one error per body-taking operation, then exit 0).
  Comparing path parameter names with request-body properties in vacuum needs a
  custom function, not tried.
- **Amended in the same skill**: the `PATCH` directive's "full-replace `PUT`" now
  says the body declares only the fields the update may change; the marker ceiling
  and status tier say the new section comes from a failure, not the 2026-07-25
  pass; two rejected defaults added (tolerant reading, echo-and-refuse); a
  *What is here and what is elsewhere* entry points the storage half of
  immutability at `business-numbering`; wiring step 10 (greenfield: the template;
  existing repo: port, and the removal is a wire change subject to the
  breaking-change directive); three named gaps (name matching only, the undecidable
  half of the third directive, plan-stage prose reached only by plan review).
  **Counts removed while there**: "six rules below are ArchUnit bans", "all five
  vacuum lints" and "all five rules it runs" each became false with this edit and
  now name their contents instead.
- **Left unchanged, on a read, not a grep**: `business-numbering` and
  `primary-keys` (their immutability checks are storage-level and did not cause
  the echo); `build-feature` (not in this pass's scope; its plan reviewer's rule that a
  decision contradicting existing code is a major finding is what carried the
  first feature's echo into the next three, recorded here, not changed);
  `java-backend-rules` *JSON is Jackson* (a pick, no configuration claim to
  contradict); `async-handoff`'s decode rule and its *do not restore "deserialization
  is strict"* note (messages only, still true); `caching` `C-11` and
  `caching-java` (strict parsing of cache values through the cache's serializer, a
  different reader); `guardrails-toolchain` (names `java-backend-api` as owner of
  contract lint and diff, still true). `README.md`'s row for the skill gained the
  new subject.
- **Frontmatter unchanged**: `java-backend-api` 71 tokens, set 1,842,
  `npm run tokens:frontmatter`, 2026-09-25. **Body grew from 7,440 to 9,555
  tokens** (`npm run tokens:sections`), the new section the largest in the skill.
  **Firing not re-measured**: the description already names *a request or response
  field* and was not edited.
- **The template carries it from `d6c598e`**, "gates: strict request bodies —
  identifiers in the path only, one request type per operation", pushed the same
  day: the port above under the same names, `noRecordIsTheRequestBodyOfTwoHandlers`
  for the decidable half of the third directive, the vacuum rule
  `request-body-schemas-are-closed`, and the rule stated in constitution Article IV,
  the article the 001 plan agent read for API shape. `node scripts/wall.mjs` green
  there. `new-java-backend`'s `DEFAULT_REF` moved to it after a full vendored
  scaffold from the pin ran `mvn verify` green. The port also carried
  reference-data's `everyMemberIsAStringABooleanANumberOrReadByItsOwnDeserializer`,
  which fails a `UUID`, date, list or nested-record member that has no deserializer
  of its own; left as ported, flagged in the template's `GATES.md` as a choice to
  revisit. **Not done**: no adversarial review of the new section, and no service
  built from the new pin yet.


## The module-boundary directive, 2026-10-06

**Where it came from.** An external research guide, *Software architecture for LLM
coding agents* (version 1.0, dated 2026-09-22), was reviewed on 2026-10-06 as an
untracked file at the repo root and is deleted after the review; it is not
published anywhere here, so every source below is carried by URL. **Owner's
decision: not shipped as a skill.** Three things were taken from it and one
backlog topic opened:

- **This directive** — its rule *a folder name alone provides no enforcement*, and
  its §7, which leads with Spring Modulith `ApplicationModules.of(..).verify()`
  (https://docs.spring.io/spring-modulith/reference/verification.html) and lists
  ArchUnit (https://www.archunit.org/userguide/html/000_Index.html) beside it as
  suitable for module encapsulation. The owner chose ArchUnit.
- **The AGENTS.md study** it cited as S1 — Gloaguen et al., arXiv 2602.11988
  (https://arxiv.org/abs/2602.11988), cited by the guide at v2 and read here at v3
  (2026-09-29) — now evidence in `enforceable-rules/evidence.md` *The
  premise-specificity test* and in [premise-review](premise-review.md).
- **Its §9 evaluation method**, added to the `ai-maintainer-principles` row
  *A second repo built to these directives* in `BACKLOG.md`.
- **A candidate topic**, *invariant-concurrency*, from its R6 and §6 stock
  example, which names the gap and does not choose between a conditional update
  and a lock; its PostgreSQL sources
  (https://www.postgresql.org/docs/18/transaction-iso.html,
  https://www.postgresql.org/docs/18/explicit-locking.html) are on the row.

**Rejected, with the reason each lost:**

- **As a skill.** Its trigger — drawing module boundaries, structuring a repo for
  agents — is `ai-maintainer-principles`' trigger; a second description on the same
  moment spends the listing budget `check:descriptions` guards for no new firing;
  and its rules, R1 to R8, carry *evidence of completion* lines, not named checks
  with enforcement markers, so by `enforceable-rules` none of them is a rule.
- **Conflicts with published directives.** *Ordinary framework conventions are
  acceptable* (its R5) against *No silent runtime behaviour* and this skill's ban
  list; an outbox as one option among durable publication mechanisms (R6) against
  `async-handoff`, which makes the outbox row the only application path; the
  stock example's conditional update or lock, whose analysis §6 says applies to
  *payment capture* too, against `money-storage` `M-35` (no arithmetic on money in the query language)
  and `M-38` (money effects appended, never updated in place); and review by a
  person as a backstop (R8) against the shared premise that no human reads the
  code line by line.
- **Its §8 templates** — an architecture document, a module contract and an
  agent-instructions file to copy into a repo — are the copy-paste delivery route
  the 2026-08-03 owner decision rejected; frontmatter or hooks only.

**The directive.** `java-backend-rules` gained *The module boundary is enforced by
ArchUnit, not by package naming* under *Evidence toolchain*: no cycle between
modules, cross-module references only into the target's `api` package (a
whitelist, so a package not named `internal` is not an escape), and the
allowed-dependency map where a repo declares one (made required by the review
below), all three in ArchUnit's
`modules()` API, each with a committed violating fixture asserted to fire.
Spring Modulith's `verify()` is the named loser, on the second-idiom ground
`ai-maintainer-principles` *One idiom, imposed mechanically* states, not on
capability. Also added: wiring item 12, named gap 12 (bytecode type references
only; reflection, bean lookup by name, broker messages and writes through the
shared generated jOOQ tier pass), a marker-ceiling bullet, an evidence section and
three ledger rows. **Marker**: the directive is *convention*, owner's decision; its
tool facts are *primary-source verified* — the first use of that marker in this
skill, whose 2026-07-25 pass wrote *confirmed* for the same kind of single-reader
check. Status tier unchanged, *decided, not yet validated*.

**What was run, not only read.** The rule code was compiled against ArchUnit 1.5.0
(the template's pin) on JDK 25 and run over a clean and a violating fixture: all
rules green over the first, each reporting over the second, every rule throwing the
empty-should error over an empty import — and **with the module pattern one level
too shallow, the cycle and `api`-only rules passed over the violating tree with no
error**, which is why the negative-control requirement is stated in full rather
than cited from `async-handoff`, whose `E-25` does not resolve for a consumer
installing this skill alone. `spring-modulith-core` 2.1.1's POM declares ArchUnit
1.4.2 at compile scope. The nested sub-module form (`app.inventory.(*)..`) was not
run.

**Sweep, read rather than grepped.** `ai-maintainer-principles` wiring step 1 now
names this host for the module half and *Where the rest of this lives* mentions
it; nothing there had claimed no host existed. `new-java-backend`'s opening
paragraph and `README.md` (the `new-java-backend` skill-table row and the
greenfield paragraph) said the template carries every build-enforceable gate; each
now excepts this one (reworded by the review below). `README.md`'s `java-backend-rules` row gained the subject. `java-backend-api` and
`java-backend-observability` say nothing about module boundaries and were left
alone; `money-java` `M-2` names ArchUnit for its own money-package boundary,
consistent, left alone; `guardrails-toolchain`'s template paragraph makes no
every-gate claim, left alone. **The template was read, not edited**:
`dulguun0225/java-backend-template` at `20d913a` bans every feature-to-feature
dependency in `LayeringArchTest` and has no violating fixture for it, so
`BACKLOG.md` *Template owed* carries the wiring and the `new-java-backend`
re-pin after it.

**Cost.** Per firing, `npm run tokens`, 2026-10-06: `java-backend-rules`
11,721 → 12,985 tokens; the sweep added 95 to `ai-maintainer-principles`
(8,781 → 8,876) and 31 to `new-java-backend` (1,535 → 1,566). **Per session,
unchanged**: no `description` was edited; `npm run tokens:frontmatter` reads 97 for
`java-backend-rules` and 1,651 for the set, the same before and after. **Firing
not re-measured** — no description changed, and whether an agent drawing a module
boundary in a Java repo loads this skill rather than only
`ai-maintainer-principles` is unmeasured. No adversarial review ran in this pass;
one ran the same day, below.

**Adversarial review, same day, before commit.** One reviewer, the whole diff, with
the repo's recurring defect classes as the checklist; every cited file and heading
opened, the arXiv paper, the Modulith reference and POM and the ArchUnit user guide
re-read, and the rules re-run on ArchUnit 1.5.0 with JDK 25 over new fixtures.
Found and fixed:

- **The map was optional and the directive claimed to host a requirement that makes
  it mandatory.** *Where repo declare one* left call direction undeclared, while the
  directive cited `ai-maintainer-principles` requiring allowed call direction from
  the first commit. The map is now required; the strictest legitimate map — no
  feature-to-feature edge, shared tier only — is named as satisfying all three rules
  by consequence, so the template's stricter `LayeringArchTest` meets the directive
  rather than reading as stale beside it. *Empty allowed map* was wrong under the
  directive's own shared-tier rule: a map with no edge refuses the shared tier too,
  and `AllowedModuleDependencies.allow()` alone does not compile (run).
- **"Not wired in the template" was overstated.** The template refuses every
  feature-to-feature and platform-to-feature dependency; what it lacks is the
  violating fixture, and its rule is vacuous today (one feature package) and has a
  substring filter that lets a feature named `feedback` through (run). The check
  line, *Wiring the gates*, `new-java-backend`, both `README.md` sentences and the
  `BACKLOG.md` row now say so; the `README.md` and `new-java-backend` sentences had
  also kept *every gate*, which the template's own not-wired table contradicts, and
  now point at it.
- **Flattering host claim.** `ai-maintainer-principles` step 1 said the Java
  directive hosts *the module half*; it hosts call direction and asserts neither the
  declared module set nor nesting. Named gap 12 now states three runs that pass every
  rule: a base-package class reaching another module's internals, an edgeless new
  module, a map naming a module that no longer exists.
- **Smaller.** *Every other architecture rule the Java skills name* (a superlative;
  Error Prone hosts several) narrowed to the ban list, in `SKILL.md` and
  `evidence.md`; *the guide's own allowed-dependency example* was the ArchUnit user
  guide's, not the external guide's, which has no ArchUnit code; the external guide
  was said to offer the two tools *as equals* where its §7 leads with Modulith; the
  `async-handoff-java` guard was said to cover *its own rules* where it states every
  ArchUnit gate; [premise-review](premise-review.md) quoted the guide's *primarily
  Python* as *mostly*.

Checked and left: the arXiv figures (−0.5% and −2%, two-sided p = 87% and 37%;
+2.4%, p = 21%; cost 20%, 23%, up to 19%, significant; Appendix B on length; Python
focus; the four agent-and-model pairs), the Modulith 2.1.1 rules and its ArchUnit
1.4.2 compile dependency, the ArchUnit signatures, `async-handoff` `E-25` as the
source of the fixture requirement, `money-java` `M-2`, the `java-backend-api`, `money-api`
and `money-storage` pointers on the `BACKLOG.md` rows, and the authoring pass's token
figures. **Cost after the review**, `npm run tokens`, 2026-10-06: `java-backend-rules`
13,254, `ai-maintainer-principles` 8,895, `new-java-backend` 1,580; frontmatter
unchanged at 97 and 1,651. Firing still not measured.

**Closed later the same day: the template wires the directive, and the
by-consequence claim is corrected.** The `BACKLOG.md` row *Template owed —
opened 2026-10-06* is removed with its section, and its finding with it.

- **What the template fixed.** `dulguun0225/java-backend-template` `main` moved
  from `20d913a` to `f161b43ce49e64cbff989857f1095c85be669b15` in two commits,
  `e3db6bf` and `f161b43`. `LayeringArchTest`'s rules became static factories over
  a base package, each run over the main code and over a test-only fixture tree,
  `starterfixtures.layering`, with a negative control per rule and reflection tests
  that fail on a factory reporting nothing; the feature filter compares whole slice
  names, closing the `feedback` escape; the controller rule matches any class
  meta-annotated with `@Controller` and requires a feature package; and
  `generatedTreeDependsOnNothingOutsideIt` keeps the generated jOOQ tree from naming
  anything outside it. Its `docs/GATES.md` layering row now cites this directive
  and lists what the rules do not reach.
- **The review that found the jOOQ-tree gap.** A review of the template's layering
  negative controls, run at `e3db6bf`, found that nothing constrained the generated
  tree's own references: a generated class naming a feature, or a platform class
  the platform tier reads back, closed a module cycle through the tree and passed
  every rule. The same review found the reflection skipping a factory declared as
  `SliceRule`. **Here, it made this directive's sentence that the strictest map
  meets the three rules by consequence false as stated.** The directive now states
  what the claim requires — every module's outgoing dependencies constrained, the
  generated tree included; the shared tier depending on no feature; dependencies
  between shared-tier modules running one direction — and names the template's
  rules as an instance. Mirrored in `evidence.md` with a ledger row.
- **Owner's decisions, 2026-10-06.** The no-feature-edge map stays. **The generated
  jOOQ tree stays banned from depending on platform classes**, so a converter for a
  platform type such as `Money` arrives as a committed map change — confirmed by
  the owner explicitly, not the reviewer's call. Both template commits were pushed
  to `main` directly, a fast-forward with no pull request, on the owner's
  instruction; CI run 37424988191 on `f161b43` passed.
- **Vendoring result.** `new-java-backend`'s `DEFAULT_REF` moved to `f161b43`;
  vendored from the GitHub URL into a fresh `/tmp` directory, removed afterwards:
  `mvn verify` green with all six `LayeringArchTest` tests, a clean tree after the
  `init:` commit, and the template's wall green in `backend/`. Commands in
  `new-java-backend/evidence.md`; the pin in
  [java-backend-template](java-backend-template.md).
- **Narrowed back, read rather than grepped.** In `java-backend-rules`: the
  directive's check line, the *Wiring the gates* template pointer and wiring item
  12. In `new-java-backend`: its opening paragraph. In `README.md`: the
  `new-java-backend` skill-table row and the greenfield paragraph. Each now says
  the gate is wired in the strictest form with a violating fixture per rule; none
  says every gate is wired, since the template's `docs/GATES.md` still carries
  gates it does not wire. A grep for *without the violating*, *lacks*, *owes*,
  *unproven* and *module-boundary test* over `README.md`, `BACKLOG.md`, `skills/`
  and `docs/` found no other sentence denying the gate;
  `ai-maintainer-principles` names the host without a template claim, left alone.
- **Named gap 12 checked against the template's not-reached list.** Added: an
  inlined compile-time constant, and a module's reference into a class directly
  in the base package — each run on ArchUnit 1.5.0 and JDK 25 (a class reading
  another package's `static final` constants is not reported, a static call is; a
  feature's internal class calling a base-package class passes the cycle,
  `api`-only and map rules). Stated with it: the template's platform rule refuses
  the platform tier's reference into the base package, and no rule there refuses a
  feature's. The undeclared module set, the base-package class's reference into a
  module and the foreign-table write were already there.
- **Cost.** Per firing, `npm run tokens`, 2026-10-06, before and after this step:
  `java-backend-rules` 13,254 → 13,524; `new-java-backend` 1,580 → 1,597.
  **Per session, unchanged**: no `description` was edited, and
  `npm run tokens:frontmatter` printed identical output before and after — 97 for
  `java-backend-rules`, 58 for `new-java-backend`, 1,651 for the set. **Firing not
  re-measured.**
- **Adversarial review of this step, 2026-10-06.** Read against `LayeringArchTest`
  and `docs/GATES.md` at `f161b43`, GitHub Actions run 37424988191 and the
  vendoring transcript. **The by-consequence sentence holds**, and the template is
  an instance of it: `generatedTreeDependsOnNothingOutsideIt` refuses the generated
  tree's reference into the platform tier while the platform rule allows the
  reverse, so the shared tier runs one way; a class directly in the base package
  belongs to no module in the template and in the directive's code block alike, and
  named gap 12 states both directions of that. Named gap 12 and the template's
  not-reached list match both ways. Run 37424988191 is a `push` to `main` with
  head `f161b43`, `backend` 06:39:47 to 06:41:09 UTC, success. The vendoring
  transcript shows `mise trust -q . ..` refused as a usage error (`mise trust`
  takes one file) before the wall; the script and this skill run no `mise`
  command, and mise 2026.10.2 applied the template's `mise.toml` in a fresh
  untrusted `/tmp` directory (`node` 24.21.0, `vacuum` 0.30.5), so the wall ran on
  the pinned tools and the evidence entry stands without it. Fixed: the marker
  ceiling's *one local run*, where the evidence records the second and third
  runs too (counting); the check line's
  *exactly classes*, where the feature rule's test asserts slice pairs, now
  *exactly fixtures* (follow the pointer); and the evidence bullet and ledger row
  that stated the template's substring filter in the present tense, now dated to
  `20d913a`. Per firing, `java-backend-rules` 13,524 → 13,527; per session
  unchanged, no `description` edited.

**Correction, later 2026-10-06: the no-feature-edge map was never the owner's
decision.** The bullet *Owner's decisions, 2026-10-06* above records "the
no-feature-edge map stays" as the owner's. **It was the assistant's call,
mislabelled**: the strict map was chosen in an assistant's task brief and written
down as the owner's decision, here, in the template's `docs/GATES.md` layering row,
and in the message of template commit `e3db6bf`. The other half of that bullet
stands: **the generated jOOQ tree naming nothing outside itself is the owner's
explicit decision**, and stays.

- **The owner's decision.** A blanket ban on feature-to-feature dependencies is too
  strict as the template's permanent rule, because a spec-kit spec can need one
  feature to call another, such as orders reserving stock from inventory; under the
  ban such a spec cannot pass the build without an edit to the boundary test. The
  template's boundary is the
  directive's three rules — no cycle between modules, a feature reaching another
  only through that feature's `api` package, every feature-to-feature dependency
  listed in one committed map that starts empty — and adding an edge is one map
  line in the commit that needs it. A class directly in the base package depending
  on no feature was approved the same day.
- **What the template changed.** Commit `a61aecd`, local and unpushed at writing,
  under review, so the SHA that lands may differ (it landed unchanged, with its
  review `20ba55c` after it, below); record in
  [java-backend-template](java-backend-template.md). `DEFAULT_REF` not moved.
- **What the directive changed.** The *strictest legitimate map … by consequence*
  paragraph described no shipped form and is cut. What was true in it stays, in
  general form: the rules must reach every module's outgoing dependencies, the
  generated tree included — by listing the shared tier in the map, as the code
  block does, or by rules of its own beside a feature-only map, as the template
  does — and a map with no edge in the first form refuses the shared tier. The
  blanket ban is now the named loser, with the owner's reason. The directive says
  how an edge is added in the template, so a consumer agent adds a map line instead
  of rewriting the gate. The check line names each of the template's rules and
  states that `new-java-backend`'s pin, `f161b43`, still carries the ban; wiring
  item 12 and the *Wiring the gates* pointer follow; named gap 12 now records the
  base-package half closed in the template, a feature's reference into the base
  package still passing there, nothing checking what a module puts in its `api`
  package, and a cycle inside one module passing. `evidence.md` carries a dated
  correction bullet and three ledger rows, one marking the mislabelled record an
  error.
- **Sweep, read.** `README.md` (the `new-java-backend` skill-table row and the
  greenfield paragraph) and `new-java-backend`'s opening paragraph each said the
  template's test is in "the strictest form `java-backend-rules` allows"; each now
  says it is wired with a fixture per rule and points at the directive's check line
  for the form each pin carries, so the sentence survives the re-pin.
  `ai-maintainer-principles` wiring step 1 names the three rules and a committed
  map with no template claim, left alone. `new-java-backend/evidence.md`'s
  `f161b43` entry is a dated record of that pin and left alone. A grep for
  *strictest*, *no-feature-edge*, *feature-to-feature*, *each other* and
  `LayeringArchTest` over `README.md`, `BACKLOG.md`, `CLAUDE.md` and `skills/`
  found no other sentence describing the template's boundary as the strict map.
- **Cost.** Per firing, `npm run tokens`, 2026-10-06, before (reconstructed from
  the pre-edit text, matching the 13,527 recorded above) and after:
  `java-backend-rules` 13,527 → 13,873; `new-java-backend` 1,597 → 1,614. **Per
  session, unchanged**: no `description` edited; `npm run tokens:frontmatter` reads
  97 for `java-backend-rules`, 58 for `new-java-backend`, 1,651 for the set.
  **Firing not re-measured.** No adversarial review had run on this correction
  when it was written; one ran the same day, below.

**Review of template `a61aecd`, the pin, and the correction above, later 2026-10-06.**
One adversarial reviewer: the template diff `f161b43..a61aecd`, then this repo's
uncommitted diff with *Recurring defect classes* as the checklist, every cited
template file opened at the commit that landed.

- **Template, found and fixed in `20ba55c7e4facd226d9aea160f409650710741d1`**,
  pushed to `main` with `a61aecd` as a fast-forward, no pull request, on the
  owner's instruction; GitHub Actions run 37430316888 on it passed. A map line no
  dependency takes passed, one naming a feature that does not exist among them; a
  reference into a subpackage of `api` was refused with no fixture holding it; the
  reflection tests took any fixture violation as a rule's proof and missed a rule
  built inside a test method. Each is now held by a fixture or a test, each seen to
  fail under a break of its rule. Record:
  [java-backend-template](java-backend-template.md).
- **The assistant's calls in that review, not the owner's**: an untaken map line
  fails, which holds the owner's *one line in the commit that needs it* in both
  directions and leaves the line to go with the last call; a subpackage of `api` is
  internal, matching the directive code block's `*.api`. The template's
  `docs/GATES.md` marks both as its reading, not the owner's words.
- **This repo, found and fixed.**
  - *A claim about another file, from memory*: the directive said the template
    shipped the ban "from 2026-10-06 until that decision". It shipped it from its
    first commit, `829a895`, 2026-09-16 (`git log -S featuresDoNotDependOnEachOther`
    in the template).
  - *An event stated without a record*: "under the ban the build fails and the
    implementing agent has to rewrite the boundary test to get through", in the
    directive, `evidence.md`, this file and
    [java-backend-template](java-backend-template.md), each inside the owner's
    decision. The owner's recorded words are that the ban is too strict because a
    spec-kit spec can need one feature to call another; no record of an agent
    rewriting the test was found in this repo, `scalith` or the template. Each now
    states the mechanism: such a spec cannot pass the build without an edit to the
    boundary test.
  - *Attribution*: the evidence correction bullet said the strict map was "chosen
    in an assistant's task brief"; it now says plainly it was the assistant's call,
    mislabelled as the owner's. **The `Money`-converter sentence is the assistant's
    wording too** — "arrives as a committed map change" in the bullet *Owner's
    decisions, 2026-10-06* above, "a committed change to
    `generatedTreeDependsOnNothingOutsideIt`" in the template and the directive
    since: a consequence of the owner's generated-tree ban, not the owner's words.
  - *Directive looser than the template*: the template refuses a reference into a
    subpackage of `api`, and now a map line no code takes; the directive said
    neither, and *Wiring the gates* lets a directive win over the template where
    they disagree, which reads as licence to loosen it. The directive now names both
    as stricter forms that satisfy it.
  - *Pin sentences*: the check line carried `a61aecd` as local and `f161b43` as the
    pin, and the *Wiring the gates* pointer "the template commit after `f161b43`";
    both now name `20ba55c`, and the check line says pins up to `f161b43` carry the
    ban. Named gap 12 records the stale-map half closed in the template; the
    general modules-API form still passes a map naming a module that no longer
    exists, as run.
- **Pin.** `DEFAULT_REF` moved from `f161b43` to `20ba55c`. Vendored from the
  GitHub URL into a fresh `/tmp` directory, removed afterwards: `mvn verify` green
  with all eleven `LayeringArchTest` tests under `com.acme.pinproof`, the empty main
  map and the fixture map intact after the rename; a clean tree after the `init:`
  commit, `dev` and `main` at it; the template's wall green in `backend/`. Commands
  in `new-java-backend/evidence.md`.
- **Sweep, read.** A grep for *rewrite the boundary*, *after `f161b43`*, *under
  review at writing*, *still pin*, *naming no package* and *under its `api`
  package* over `README.md`, `BACKLOG.md`, `CLAUDE.md`, `skills/` and `docs/`; each
  hit read. Left as dated records: the `f161b43` pin entry in
  `new-java-backend/evidence.md`, which the new entry beside it corrects, and the
  evidence bullet on `a61aecd`'s probes, now marked as closed. `README.md`'s
  greenfield paragraph and skill-table row and `new-java-backend`'s opening
  paragraph point at the directive's check line for the form each pin carries, so
  they stay true across the re-pin, and were left alone; `ai-maintainer-principles`
  step 1 makes no template claim. `scalith`'s constitution Article VI, which banned
  every feature-to-feature dependency and is read as binding by `build-feature`'s
  plan step, is amended in that repo the same day.
- **Cost.** Per firing, `npm run tokens`, 2026-10-06: `java-backend-rules` 13,873 →
  13,999; `new-java-backend` 1,614, unchanged. **Per session, unchanged**: no
  `description` edited; `npm run tokens:frontmatter` reads 97 for
  `java-backend-rules`, 58 for `new-java-backend`, 1,651 for the set. **Firing not
  re-measured.**

