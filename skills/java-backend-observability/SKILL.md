---
name: java-backend-observability
description: The logging, metrics and alerting rules for a Java backend on Spring Boot, for a deployed system nobody watches between incidents — one typed logging facade with domain types unloggable by type, compile-checked event and metric catalogs, correlation fields established by visible wrappers and captured explicitly at every virtual-thread fork, bounded metric label cardinality, and committed alert rules that each carry a fire-test. The -javaagent bytecode-weaving path, raw logger APIs with free-form messages, regex PII scrubbing in the pipeline, per-user or per-request metric labels, dashboards as the primary surface, and untested alert rules are banned by name, each with the check that fails the build. Load before adding a log line, a metric, a tag, an alert rule, or a fan-out that logs, and before wiring telemetry or picking a logging backend.
---

# Java backend — the observability rules

**These rules bind when the deployed system has no human watching it
continuously** — no staffed operations rota, and the operator arrives only after
an alert. **They are the other half of failing loud: code that throws into a
channel nobody collects has failed silently.**

This skill is one of three for this stack, and a repo installs all three:

- **`java-backend-rules`** — the platform constitution. **Install it with this
  skill**: the fan-out context rule below is a second obligation on a helper that
  skill specifies, and the ban list it carries is where the logger bans live as
  entries.
- **`java-backend-api`** — the HTTP contract rules. Its generic internal problem
  response carries only a correlation id, and **the rule that makes that id
  retrievable is here, not there.**

**There are no rule ids here, and that is deliberate.** Each directive is a
`###` heading, and that heading is how it is cited — *the weaving-agent ban*,
*domain types are unloggable*, *the fan-out context capture*. Nothing in this
skill set numbers these rules, so a number invented here would resolve only for
a repo that installed this skill; a skill name plus a subject resolves either
way.

## The marker ceiling, before the rules

**One pass wrote this area, on 2026-07-27, and it was short of the panel. Exactly
one claim in it went through an adversarial panel and three refutation votes —
the one about whether a logging context reaches a forked subtask.** Everything
marked *confirmed* below is that claim or a fact the panel established while
examining it, which is why **two** directives carry the marker: *the fan-out
context capture* and *the logging backend is pinned*. The panel produced both —
"pin the backend, and do not depend on inheritance even where it works" is its
own conclusion, not two separate findings.

Every other claim here is **primary-source verified** at best: one researcher
against vendor documentation, with no panel.

The pass also harvested from a prior architecture decision record. **That is
prior art, not independent confirmation.**

Read that as the ceiling on the whole area, not as a per-rule accident. Two
consequences worth acting on:

- **These directives are convention with no external evidence sought or found:**
  the autoconfiguration probe test, the event and metric catalogs, the
  mandatory-correlation-field contract test, the error-id-resolves-to-a-log test,
  the export-facts-from-the-database poller, and the disposability of telemetry.
  Each is stated because it is enforceable and cheap, and each mirrors a rule shape
  this stack already carries. **Enforcement is not confirmation.** One further
  claim is convention without its directive being so: the
  call-site-over-pipeline half of *domain types are unloggable by type*, whose
  tool split is primary-source verified while the reason for preventing at the
  call site is not. Read the marker beside each half, not the directive as a whole.
- **Two *enforcement* markers were corrected upward during the pass** — the
  cardinality gate and the alert fire-test were drafted as **bespoke** and are in
  fact **off-the-shelf**. Nothing about their *confidence* changed. That is
  recorded so a reader who finds an older copy knows which way the correction
  went, and so the correction is not mistaken for a promotion of evidence.

The whole set is `review-by` **2027-01-21**. **Past that date every *confirmed*
marker here reads as *convention*** until a new pass re-dates it, with no
maintainer action needed.

Status tier: **decided, not yet validated** — researched and decided, with **no
production use yet** behind the enforcement shapes.

## Two premises, and only one of them is the stack's

**This area carries a premise the rest of this stack's rules do not**, and the
distinction is not pedantic — it decides who can drop these rules.

- **The stack's premise, which applies here too**: code is written by LLM agents
  and no human reads it line by line.
- **This area's own additional premise**: **nobody is watching the running system
  between incidents.** The operator is invoked in sessions rather than staffed on
  a rota, and arrives after an alert fires.

**A repo with a staffed operations rota does not discard this skill.** It keeps
every **emission** rule — the facade, the unloggable domain types, the catalogs,
the correlation fields, the cardinality bound, the poller. Those are **code
rules** and they hold under the stack's premise alone. What it re-decides is the
**alerting** side — the fire-tested rules, and the reasoning that rejects
dashboards for having no audience — against how its rota actually works.

Say which of the two you are dropping, and carry the burden of saying it. A
verdict is portable exactly as far as its premise.

## The defaults these rules override

The picks an unbriefed agent statistically makes. **Naming the loser is the
load-bearing half.**

- **The OpenTelemetry Java agent (`-javaagent`)** — the corpus favourite for
  telemetry, and **the vendor's own default recommendation for most Spring Boot
  applications**, in those words. Rejected as runtime-silent: the JVM calls the
  agent's `premain` before the application starts, and the agent registers a
  transformer that **rewrites classes as they load**, so an effect fires from a
  launcher flag and not from any written call — the same grounds that banned
  `@Transactional`. **The cost is honest and real:** the
  SDK-plus-instrumentation-libraries path covers fewer libraries and each
  addition is a written dependency. That is the trade this rule set takes, and a
  repo should take it knowingly.
- **Raw SLF4J with free-form message strings** — the corpus-default logging call.
  Rejected on two counts: an alert rule or a grep targeting a free-form string
  **breaks silently the next time an agent rewords the message**, and a raw
  logger's `Object...` signature accepts a domain object carrying personal data
  from any call site. The typed facade plus the event catalog makes both
  unwritable.
- **Regex scrubbing of personal data in the log pipeline** — the corpus-default
  privacy control. Rejected: **it runs after the value has left the process**, it
  fails open on any format the pattern did not anticipate, and **it reports no
  error when it misses.** A type the facade cannot accept never produces the log
  line.
- **Per-user or per-request metric labels** — what an agent adds when asked to
  "make this observable per customer". Rejected: **every unique label combination
  is a new time series**, and Prometheus's own naming guidance says not to
  use labels for high-cardinality dimensions such as user ids or email addresses.
  **The failure is invisible for weeks and then unbounded** — exactly the class an
  absent reader makes worse.
- **Dashboards as the primary surface** — the corpus image of observability.
  Rejected here for the same reason this area is conditioned on an unwatched
  system: **a dashboard requires someone looking at it.** These rules target what
  fires without an audience — alert rules with fire-tests, and text a responder
  can query.
- **Alert rules committed without tests** — the near-universal practice.
  Rejected: **an alert rule that cannot fire is a gate reporting green over an
  unwatched failure.** The fire-test is off-the-shelf, so **the reason not to
  write one is habit.**

## Instrumentation

### The weaving-agent ban

**Instrumentation is visible program text; the `-javaagent` bytecode-weaving
path is banned** — no agent JAR in the image, the container file, the compose
file, or the build. A weaving agent rewrites classes as they load, so what a call
does is decided by **a launcher flag instead of by the call.**

*Bespoke — a CI grep over launcher arguments, container and compose files, and
the dependency set, in the shape of the `--enable-preview` grep in
`java-backend-rules`. **Not ArchUnit**, which reads bytecode and cannot see
launcher flags or image layers. **Primary-source verified 2026-07-27** on both
halves: the agent mechanism is the vendor's own description, and the
default-pick status is the vendor's own words.*

**Precision, and a correction to a tempting shortcut.** OpenTelemetry files its
own **Spring Boot starter** under "zero-code" as well, **but that starter uses
Spring autoconfiguration, not weaving.** So a `-javaagent` grep **does not ban the
starter**, and this rule must not be described as banning "zero-code
instrumentation" — **the banned thing is bytecode weaving.** That gap is exactly
why the next rule exists.

### Autoconfigured telemetry needs a probe test

**Telemetry registered by autoconfiguration is permitted only where a probe test
asserts at startup that each meter, appender and context wrapper it was supposed
to register is present.** Autoconfigured telemetry that silently fails to
register leaves **a green build and a blind production.**

*Bespoke — one context probe test per registered component. **Convention**,
2026-07-27 — no external evidence was sought or found; it is kept because it is
enforceable and cheap, and it closes the gap the weaving ban's grep leaves open.*

## Logging

### Structured JSON on stdout

**Logs are structured JSON on stdout,** from Spring Boot's own structured
logging — `logging.structured.format.console`, set in committed config.

*Config-default assertion — off-the-shelf, the same shape as the virtual-threads
property in `java-backend-rules`. **The check reads the checked-in default, not
the effective runtime value**, which environment variables or external config can
override. **Primary-source verified 2026-07-27** — structured logging with the
Elastic Common Schema and Logstash formats ships natively in Spring Boot since 3.4
and carries forward on the 4.0 line, so this is configuration rather than bespoke
work.*

### One typed logging facade

**One typed logging facade. Raw logger APIs, `System.out` / `System.err`, and
`printStackTrace` are banned.**

*ArchUnit — off-the-shelf for the console-output and wrong-framework halves,
per-repo for the third: ArchUnit ships
`GeneralCodingRules.NO_CLASSES_SHOULD_ACCESS_STANDARD_STREAMS` and
`NO_CLASSES_SHOULD_USE_JAVA_UTIL_LOGGING` as public API, and they work because
**each is a type dependency**, which is what ArchUnit reads soundly from
bytecode. A per-repo predicate bans a direct dependency on the raw logger type.
**Primary-source verified 2026-07-27.***

### Domain types are unloggable by type

**The facade takes catalog keys plus whitelisted scalars and identifiers, so a
type carrying personal data cannot be passed to it. Log entity ids, never names
or account numbers.** Regex scrubbing in the collection pipeline is **not a
substitute** — it runs after the value has left the process.

*Error Prone on source — the check itself is bespoke. **Not ArchUnit**: it sees
the logger's erased `Object...` signature, not the argument's static type, so an
ArchUnit rule here **reports green while protecting nothing.** The tool split is
**primary-source verified 2026-07-27**; the call-site-over-pipeline choice is
**convention** — no primary source survived for it, and it is kept because it is
type-checked at compile time and fails toward safety, where a pattern that misses
reports nothing.*

**This is the rule whose enforcement `llm-default-traps` bans the wrong host
for.** That skill carries the ban on ArchUnit and the erasure ground behind it,
as a cross-cutting trap that binds any JVM repo; **this directive is the rule
itself.** Both are needed: a repo with this rule and not that skill will
eventually host it in the wrong tool and get a green build over an unprotected
type. `caching-java` records the same erasure trap for its own serialization
rule, where a bytecode-reading tool sees an erased type parameter and decides
nothing.

### Event and metric names come from a compile-checked catalog

**Event names at WARN and above, and every metric name and tag key, come from a
compile-checked catalog; inline string-literal event names and meters are
banned.** Alert rules and greps target these names, so **they are API, not
prose** — the same argument as the error-code catalog in `java-backend-api`.

*ArchUnit ban on inline literals at the facade call sites — per-repo predicate —
plus a committed catalog snapshot diffed each build, in the shape of that
skill's error-catalog snapshot. **Convention**, 2026-07-27.*

### Every scoped log event carries the correlation fields

**Every log event emitted in request-scoped or task-scoped code carries the
correlation fields,** established by the same visible wrappers that establish the
rest of the scope — **never by an ambient interceptor.**

*Bespoke — a contract test asserts the mandatory fields on every event emitted
inside a scoped block. **Convention**, 2026-07-27.*

### The correlation id in an error response resolves to a log event

**The correlation id in an error response is the id in the logs.** The HTTP
contract's generic internal problem carries **only** a correlation id, and **an
id that retrieves nothing turns that rule into a dead end.**

*Bespoke — a test reads the id from a 500 response body and asserts the matching
log event is retrievable by it. **Convention**, 2026-07-27. The rule on the other
side of this seam is *one advice builds every error body* in `java-backend-api`;
neither is useful without the other.*

### The logging backend is pinned

**The logging backend is pinned in the build, and Logback is the default pick.**
The correlation rules turn on **whether the backend's context map is inherited by
a child thread, and that answer differs per backend**: Logback has not inherited
it since 1.1.5 and offers **no switch**; Log4j 2 inherits **only when a system
property is set**; and the JUL and reload4j bindings **inherit by default.** An
unpinned backend makes the guarantee unpinned too.

*Banned-dependency rule — off-the-shelf, in the same enforcer configuration as
the platform bans. **Confirmed 2026-07-27** for the per-backend inheritance
facts, as part of the fan-out context panel below.*

### The fan-out context capture

**The owned virtual-thread fan-out helper establishes each subtask's logging
context at fork time, and never relies on inheritance to carry it.**

**Three grounds, and the rule stands on any one of them.**

1. **A Scoped Value never crosses.** Bindings are inherited only by threads
   forked in a `StructuredTaskScope`, which `java-backend-rules` bans as preview.
2. **Logback's context map is never inherited by a child thread**, and no
   configuration restores it — the 2016 change removed inheritance outright
   rather than making it configurable, and the proposed flag never shipped.
3. **And where a backend *can* inherit, depending on it would still be wrong.**
   What a log call records would then turn on an ambient system property **and**
   on which thread happened to construct the child — and the platform specifies
   neither for a per-task executor. That is an ambient modifier deciding
   behaviour, the class these rules exist to remove, **so the capture stays
   explicit even on a backend that would inherit.**

**Without it, every subtask log line silently loses its correlation fields:** a
missing key renders as the empty string and throws nothing, so no compiler,
linter or runtime error catches it. **Only an assertion does.**

*Bespoke — the capture lives in the one owned helper, and a test asserts that a
subtask's log event carries the forking thread's correlation fields.
**Confirmed 2026-07-27 under a three-vote adversarial panel — this is the one
claim in this area that has one**, and the panel corrected the claim's wording in
the process. Off-the-shelf mechanism, if the repo prefers it to a hand-written
copy: Micrometer `context-propagation` executor wrapping — but **register the
SLF4J accessor programmatically, it is not discovered automatically**, and note
that it covers the context map only, **never a Scoped Value.** See
[evidence.md](evidence.md) for why the hand-written capture is the more
principle-consistent route and what else does *not* do this for you.*

## Metrics and alerts

### Metric label cardinality is bounded and budgeted

**A label whose value set is not O(1) — user id, request id, correlation id,
unbounded path — is banned; a label bounded by a known small set is allowed and
its ceiling is stated in the repo.**

*Off-the-shelf on **both** sides: Micrometer's `MeterFilter`
maximum-allowable-tags bound with a deny action at runtime, and Micrometer's
high-cardinality-tags detector (`withHighCardinalityTagsDetector()`) run as a
one-time check in a test over the registry after the app has been exercised — a form its own documentation supports
for verifying instrumentation. **Primary-source verified 2026-07-27.** **The
detector documents no default threshold — the repo sets it**, and no number is
supplied here.*

### Database facts are exported by one poller

**Facts already recorded in the database are exported by one explicit poller,
never re-instrumented in the write path.** A counter incremented beside the row
it counts **drifts from that row on every rollback and retry.**

*Convention, 2026-07-27.*

### Alert rules are committed code with a fire-test

**Alert rules are committed code, and each carries a fire-test:** the rule fires
at its threshold plus a margin and **stays silent below it.** A rule that cannot
fire is **a gate reporting green over an unwatched failure.**

*Off-the-shelf host — `promtool test rules` and its `alert_rule_test` form,
**including the empty-expected-alerts case for must-not-fire**; the fixtures are
authored per repo. A rule-file validation step
runs in CI. **Primary-source verified 2026-07-27** — an earlier draft marked this
bespoke, which was wrong.*

### Telemetry is rebuildable, disposable data

**No correctness rule, audit claim, or business record depends on telemetry; the
audit trail is transactional tables.**

*Convention, 2026-07-27.*

**This directive owns the phrase "rebuildable-cache premise" in this skill
set**, and the collision is worth knowing about because it is invisible from
either side. The `caching` skill deliberately says **"derived-store premise"**
for a store that can be rebuilt from the authoritative store, precisely to avoid
redefining this one — and the two are **different properties**: yesterday's
histogram is not recomputable from the database, whereas a derived store is.
**Redefining this phrase would make this directive's re-open trigger
incoherent**, and that trigger is live: it fires the moment someone proposes
reading a business answer out of metrics or logs.

## Wiring the gates

**Run this once per repo, in the first pull request that emits telemetry.** These
directives are two kinds welded together: instinct-overrides that fire while an
agent is writing a log line, and build gates that have to exist in the repo.
**The gate is what catches the next agent**, and an unwired gate is a rule
described as enforced that is not.

1. **The weaving-agent CI grep** over launcher arguments, container and compose
   files, and the dependency set. Not ArchUnit.
2. **A config-default assertion** for the structured-logging format. It reads the
   checked-in default and sees no runtime override.
3. **ArchUnit rules** on the platform ban list's test class: the standard-stream
   and wrong-framework rules off the shelf, the raw-logger-type dependency ban,
   and the inline event-name and meter-name literal bans.
4. **Error Prone** as the host for the unloggable-domain-type check — **and an
   explicit note that ArchUnit is not the host**, so the next agent does not add
   one there.
5. **The event and metric catalog snapshot**, generated from the catalog and
   diffed each build.
6. **The banned-dependency rule pinning the logging backend**, in the same
   enforcer configuration as the platform bans.
7. **The context capture inside the owned fan-out helper**, plus the test
   asserting a subtask's log event carries the forking thread's correlation
   fields. If the repo uses the off-the-shelf executor wrapping instead,
   **register the accessor programmatically** and record that a Scoped Value is
   not covered.
8. **Micrometer's `MeterFilter` maximum-allowable-tags bound with a deny
   action**, and `withHighCardinalityTagsDetector()` as a one-time test over the
   registry after the app is exercised. **The repo states the threshold** — the
   detector documents no default.
9. **Probe tests**, one per autoconfigured component, asserting registration at
   startup.
10. **The contract test** for mandatory correlation fields inside a scoped block,
    and **the test** that reads a correlation id from a 500 response body and
    resolves it to a log event.
11. **The alert-rule fire-tests** and the rule-file validation step in CI,
    including at least one must-not-fire case expressed as an empty expected-alert
    list.

**Then record what was wired and what was skipped, with the reason.** These are
the entries **nothing above gates**, and each must be listed as ungated:

- **The call-site-over-pipeline privacy argument.** The Error Prone check gates
  what the facade accepts; that no other path logs a domain type depends on the
  facade being the only logging path, which the ArchUnit rules cover only as far
  as their predicates reach.
- **The database-export poller.** Convention. Nothing detects a counter
  incremented in a write path beside the row it counts.
- **Telemetry's disposability.** Convention, and unenforceable by construction —
  it is a constraint on what future rules may depend on, not on any code that
  exists now.
- **Whether the alert thresholds are right.** The fire-test proves a rule fires
  at its threshold; **nothing proves the threshold is the right one**, and a
  fire-tested rule with a threshold nothing reaches is still a gate reporting
  green.
- **The cardinality ceiling for each allowed label**, which the repo states in
  prose. The runtime deny action bounds the total; it does not check any
  individual label against a stated ceiling.

**A record that lists only what was wired reads as complete coverage.** That is
the failure this step exists to prevent.

## Named gaps — where no check reaches

Silence reads as coverage, so each is stated.

1. **A config-default assertion is not a runtime assertion.** The
   structured-logging format is read from committed config; an environment
   variable or external config source can override it in a deployed process and
   **no gate here notices.** The same limitation applies to the virtual-threads
   property in `java-backend-rules`.
2. **The weaving-agent grep does not ban the OpenTelemetry Spring Boot starter,
   and should not be described as banning zero-code instrumentation.** That
   starter uses Spring autoconfiguration, not weaving, and the vendor files it
   under "zero-code" too. The probe-test rule is what covers its failure mode,
   and it is convention.
3. **Nothing here bounds what a log line costs.** There is no rule about volume,
   sampling, or retention, and an unbounded-cardinality *log field* — as opposed
   to a metric label — is not covered by the cardinality rule at all.
4. **The fire-test proves a rule can fire, not that it should.** Threshold
   correctness is outside every gate here.
5. **Distributed tracing is deliberately absent, not overlooked.** This area
   ships correlation-id-only. The reason and the adoption trigger are in
   [evidence.md](evidence.md), together with a status claim about the relevant
   standard that **must not be cited as settled.**
6. **Only one claim in this area has survived a panel**, and the two directives
   it produced are the only ones carrying *confirmed*. Everything else is a
   documentation check or a design argument, which is the ceiling stated at the
   top of this file and repeated here because it is a gap in the ordinary sense:
   **for every directive other than those two, a reader looking for independent
   verification will find none.**
7. **The high-cardinality detector needs the app to have been exercised.** It
   runs over the registry after a test drives the application, so it sees the
   labels that test produced and nothing about a code path no test reaches.

## Markers, dates, and what they mean

Confidence, per claim: **confirmed** means the claim survived three independent
refutation votes against primary sources on the date it states — **one claim
here has that.** **Primary-source verified** means one researcher checked it
against a primary source with **no panel**; it is not confirmed whatever its
evidentiary strength, and running the panel is what promotes it. **Convention**
means the research did not, or could not, confirm the claim from independent
sources; the rule is kept because it is enforceable, cheap, and fails toward
safety.

Enforcement, per rule: **off-the-shelf** means a tool does it with
configuration; **bespoke** means the check must be written; **convention** means
a human or an agent asserting it is all there is.

**The lapse rule:** past `review-by` **2027-01-21**, every *confirmed* marker in
this skill reads as *convention* until a new pass re-dates it, with no maintainer
action needed.

| Claim | Marker | Date |
| ----- | ------ | ---- |
| A Scoped Value binding never reaches a forked subtask on this stack | confirmed | 2026-07-27 |
| Logback never inherits its context map into a child thread, and offers no flag | confirmed | 2026-07-27 |
| Log4j 2 inherits only under a system property; the JUL and reload4j bindings inherit by default | confirmed | 2026-07-27 |
| A missing context key renders as the empty string and throws nothing | confirmed | 2026-07-27 |
| The weaving agent's mechanism, and its vendor-default status | primary-source verified | 2026-07-27 |
| The starter uses autoconfiguration, not weaving | primary-source verified | 2026-07-27 |
| Structured JSON logging ships natively in Spring Boot since 3.4 | primary-source verified | 2026-07-27 |
| ArchUnit's standard-stream and logging-framework rules are public API | primary-source verified | 2026-07-27 |
| ArchUnit cannot host the unloggable-domain-type rule | primary-source verified | 2026-07-27 |
| Every unique label combination is a new time series; high-cardinality labels are advised against | primary-source verified | 2026-07-27 |
| Cardinality is boundable off the shelf on both sides | primary-source verified — corrected from bespoke | 2026-07-27 |
| Alert fire-tests are off-the-shelf, must-not-fire included | primary-source verified — corrected from bespoke | 2026-07-27 |
| The off-the-shelf context-propagation library's three caveats | primary-source verified | 2026-07-27 |
| Call-site prevention over pipeline scrubbing | convention | 2026-07-27 |
| The autoconfiguration probe test | convention | 2026-07-27 |
| The event and metric catalogs | convention | 2026-07-27 |
| The mandatory-correlation-field contract test | convention | 2026-07-27 |
| The error-id-resolves-to-a-log-event test | convention | 2026-07-27 |
| The database-export poller | convention | 2026-07-27 |
| Telemetry's disposability | convention | 2026-07-27 |

The ground behind each claim — with its sources — the claims that must **not** be
cited, and the conditions that reopen a rule are one hop away in
**[evidence.md](evidence.md)**.
