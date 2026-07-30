---
name: async-handoff
description: Asynchronous-handoff discipline for any repo where the caller's control flow does not contain the work's execution, in any language — one outbox row plus one broker and no second mechanism, one messaging-adapter seam guarded by an allow-list of async constructs, no annotation-bound consumers, no publish outside the relay, a deterministic message identity, a governed relay with an oldest-unpublished-row alert, manual acknowledgement only, effect-free and deduplicated handlers as distinct port types, partition keys with an ordering declaration, a five-field failure policy with no silent drop, generated payload types gated against the full schema history, scope carried in the message rather than a thread-local, replay safety, the four-configuration differential gate, a generated subscription catalog, and two architectures banned outright. Load before publishing a message, adding a queue or broker client, an in-process event bus, an executor submit, a fire-and-forget or scheduled task, a polled table, or an outbound webhook — and before deciding whether work should leave the caller's control flow at all. States the kind of check each rule needs; the tool is named in the matching stack skill (async-handoff-java).
---

# Asynchronous-handoff discipline

Thirty directives — `E-1` … `E-28`, plus the two bans `E-32` and `E-33`. Each
states the **kind** of check it needs. No tool is named here, because almost
none of these checks is portable: nearly every rule needs a different tool per
stack, and a rule with no named check is a wish. The tool is named in the stack
skill.

**Six more directives live in `async-handoff-shapes`** — `E-29` … `E-31` and
`E-34` … `E-36`. They are dormant until a further condition holds, which is why
they are a separate skill; the two bans here are **never dormant** and stay in
this one. See *What is here and what is elsewhere*.

**Read the marker ceiling before you read the rules.** All thirty are
**convention**, dated 2026-07-29, and **there is no production use of this rule
set anywhere**. Each is a design argument rather than an execution result, so
nothing here is confirmed. Worse than the sibling cache rules in one specific
way: the research pass behind these thirty **did not run the three independent
refutation votes** it was supposed to — one hostile audit stands in their place,
and its planted defect was caught, which is why its findings are trusted. What
that pass did confirm is *tool* and *transport-default* evidence, and the tool
half lives in the stack skill. **No marker here may be promoted without a new
research pass.** The full statement is in *Markers, dates, and what they mean*.

## The premise these rules are conditioned on

**Code is written by LLM agents and no human reads it line by line, and the repo
hands work off asynchronously — the caller's control flow does not contain the
work's execution.**

An asynchronous handoff changes the shape of every failure. Inside a caller's
control flow, a failure is an exception: something throws, a status code moves,
a user sees an error. Once the work leaves that control flow the failures stop
being exceptions and become **absences** — a message that was never published,
an effect that ran twice, a backlog nobody watches. None of them throws. With
nobody reading the code, nothing else notices either.

A verdict is portable exactly as far as its premise. In a repo where a human
reads every messaging change line by line, several rules below drop from
mandatory to merely advisable. Where that is the case, say so and carry the
burden of saying it; do not silently drop the rule.

**The name of this skill is narrower than its scope, deliberately.** "Broker" is
the word someone searches for. The rules bind from **the first asynchronous
handoff of any shape**, and all of these hand work off while importing no broker
client:

- a table in the service's own database, polled by a scheduled job;
- an in-process event bus, or a framework's application-event publisher;
- a fire-and-forget submit to a thread pool, an async annotation, or a bare
  thread or virtual-thread start;
- an outbound webhook the receiver retries;
- a scheduled scan that finds rows in a state and acts on them.

Every one produces at-least-once or at-most-once delivery, duplicate execution,
poison items, ordering assumptions and a failure destination nobody reads. **A
seam scoped to a broker client would leave all of them outside every check
below** — and because `E-4` makes them *forbidden* rather than merely
unguarded, a narrow seam would also make stepping outside the rules the cheapest
way to satisfy them. This is the same defect the sibling `caching` rules had to
correct in their own seam, and it is worse here. So the seam is a **messaging
adapter**, and `E-1` is an allow-list rather than a ban list.

The rules bind from **the first asynchronous handoff**. Before that they are
dormant, not absent.

## One mechanism: an outbox row and a broker. There is no second option

**Every asynchronous handoff goes through the outbox and the broker.** There is
no threshold to evaluate and no cheaper shape to pick. Application code writes a
row in the state change's transaction; the relay claims the row and publishes it
to the broker; consumers subscribe. That is the whole topology, and it is the
same topology whether the consumer is another team's service or a class in the
same deployable.

**This reverses an earlier answer, and the reversal is load-bearing rather than
historical.** The first version of these rules recommended a polled table in the
service's own database and made the broker a conditional escalation above three
named thresholds. The thresholds were withdrawn on 2026-07-29 — not because a
new fact arrived, but because they were unusable at the gate that had to decide
them:

1. **The routing decision was undecidable and landed on the wrong reader.**
   "Which threshold is crossed" had to be argued and judged at the plan gate,
   where the readers are a team leader, an AI solution engineer and a domain
   owner — no distributed-systems engineer, no operations role, and no colleague
   to check the answer. A threshold nobody present can evaluate is the
   corpus-favourite wrong pick with extra steps: the team takes whichever branch
   the agent proposed first.
2. **The branches had different rule surfaces, so the wrong branch was also the
   less-guarded one.** Three shapes to learn, three sets of checks to wire, and
   nothing at the gate saying which shape a given repo was in.
3. **The discriminating threshold was predicted to fire anyway**, so the default
   was a branch with a misleading name.

**The three withdrawn thresholds must not return in any wording** — see
[evidence.md](evidence.md), *Do not reintroduce*. A plan arguing that a
threshold is not crossed is arguing against this section.

### The broker is mandatory and so is the outbox. They stop different failures

**The broker is the transport. The outbox is the durable record of intent, and
making the broker mandatory does not remove the failure the outbox exists to
stop.** A database commit and a publish are not one transaction, and the process
can die between them in either order. Publishing after the commit **is** the
dual write: the commit succeeded, the process died, the event never went, and
nothing anywhere records that it should have. `E-5` states this; `E-6`, `E-7`,
`E-8` and `E-9` enforce it. **A repo that adopts the broker and drops the outbox
has exactly the failure these rules were written for, and it is the most likely
misreading of the reversal above.**

The asymmetry against the sibling cache rules is the ground, and it is worth
stating once because it decides two rules in opposite directions. A cache entry
is recomputable from the authoritative store, so a lost cache delete is a
**bounded** stale read that self-heals. A message between publish and successful
processing exists **only** in the broker unless a producer-side row is retained;
losing it is an **unbounded permanent absence**, with no self-healing path and
no gate anywhere that can compare against a message which was never produced.
Same shape, opposite verdict. Do not carry either one over to the other.

**The outbox is not a transport.** Nothing subscribes to it and nothing outside
the relay reads it. The claim shape is documented by PostgreSQL for exactly this
use — skipping locked rows "provides an inconsistent view of the data, so this is
not suitable for general purpose work, but can be used to avoid lock contention
with multiple consumers accessing a queue-like table" (its `SELECT`
documentation, read 2026-07-29). **Both clauses of that sentence are
load-bearing and `E-8` carries them**: the claim must be transaction-scoped
rather than a status column, and skipping locked rows gives **no ordering**,
which is why a relay claiming rows concurrently destroys the order `E-15` then
faithfully preserves at the broker.

### The org fact this rests on, and what it costs

Eighteen three-person teams, one engineer each, and **no platform or operations
role**. That fact is the ground for two things: a named owner for a self-hosted
broker is a **prerequisite rather than a condition** — the self-hosted variant
cannot be built without one — and the two bans below rest on this organisation
rather than on the techniques being bad engineering.

The costs of the single mechanism, stated rather than hidden. An event consumed
only by the deployable that produced it still crosses the broker: that is a
database round trip plus a publish where a bare executor submit cost neither.
And three of the four arms of `E-24`'s gate were cheap when a table was the
transport and are not cheap against a real broker in a container, which makes
`E-24` the most expensive gate in this rule set or its siblings.

**Queue-shaped versus log-shaped is a real distinction and it is now a
transport-pick question, not a per-subscription argument.** `E-16`, `E-17`,
`E-24` and `E-26` read a broker-shape declaration from the catalog, because
retry shape and acknowledgement granularity genuinely differ. What changed is
who decides: the shape follows the one transport the repo runs, recorded once,
rather than being re-argued per fact at the plan gate. **Which broker that is,
is not a directive here** — it is a per-stack pick with deployment-shaped gates,
and it is stated in the stack skill. A nine-candidate survey of the transport
landscape, with licences, release cadence, documented minimum production shape
and the ground each candidate lost on, is in [evidence.md](evidence.md); it is
evidence for that pick, not a rule here.

## What is here and what is elsewhere

- **This skill** — the seam, the write path, the consume path, ordering, poison
  handling, the payload contract, tenancy, replay, the evidence gates, the
  catalog and the topology, plus the two never-dormant bans. Platform-neutral:
  every rule states a check kind and names no tool.
- **`async-handoff-shapes`** — the six directives for shapes assembled *out of*
  publishes and subscriptions, each dormant until its own condition holds: a
  flow that commits in more than one transaction (`E-29` … `E-31`), HTTP across
  the organisation's boundary in either direction (`E-34`, `E-35`), and a payload
  that cannot meet its subject's committed maximum size (`E-36`). Install it when
  one of those three is true. **The bans are not there**: `E-32` and `E-33` are
  never dormant, so they are here.
- **`async-handoff-java`** — the same rules with Java, Spring Boot, ArchUnit,
  Error Prone, Jackson, jOOQ, Maven, JUnit, jqwik, Testcontainers and Toxiproxy
  named; the broker pick and the outbox-library pick; the one-time gate wiring;
  and the named gaps where that toolchain can host no check. Install it in a repo
  on that stack; without it every rule here has a check kind and no tool.
- **`caching`** — published, and it collides with `E-5` at one specific point.
  `C-9` requires cache invalidation to be reachable only from the transaction
  seam's post-commit callback. **If a repo satisfies that with a general-purpose
  post-commit callback registration, `E-5` is defeated entirely** — nothing at a
  call site distinguishes "delete a cache key after commit" from "publish after
  commit". A repo installing both must make post-commit registration a named
  member of the cache adapter's own port, with no free-callback form, and ban
  every other post-commit registration. Both skills state this from their own
  side.
- **`money-api`** — published. `M-17` requires an idempotency record written in
  the same transaction as the money effect. `E-13` is that same record on the
  consume path. **Read `M-17` for what it says and not for more:** it requires
  the same transaction and mentions neither a cache nor a broker, so the bans on
  those two hosts are carried by `C-5` and by `E-13`, not by any money skill.
- **`money-storage`** — published. `M-40` requires that the durable row a money
  event will be published from is written in the money effect's own transaction,
  and names the outbox as the seam. That is `E-5`, and the two agree; `M-40`
  records a residue that this rule set had to exist for it to be discharged.
- **`money`** — published. `E-21`'s blanket float ban is the **fifth layer** of
  the same ban, after the field, the wire, the column and a cached copy.

## The defaults these rules override, by name

An agent told "publish an event" writes one specific thing. Naming it is the
point; "be careful with messaging" overrides no instinct.

- **The annotated listener plus the annotated transactional publish** — save the
  entity, send the event, one annotation on each. **This is the training-corpus
  favourite by a wide margin and what an unbriefed agent writes.** Banned by
  `E-2` and `E-5`. It is genuinely attractive: three lines, it reads exactly like
  the requirement, the framework owns the poll loop and the rebalance and the
  thread pool — which you should not hand-roll — and the transaction annotation
  means a later failure rolls the database back. It loses on four grounds: the
  rollback does not un-publish, so a rolled-back write can have a published
  event and nothing records the contradiction; the reverse failure is worse and
  more common, because the commit succeeds, the process dies, and the event
  never goes; the transaction scope is ambient, so the code's text does not say
  whether a publish is inside it; and the subscription set exists only in the
  annotations, so nothing enumerates it and eleven directives below lose their
  operand.
- **The catch-log-acknowledge consumer.** Rejected by `E-10` and `E-11`. The
  catch acknowledges, so the effect is a silent drop, and the process staying up
  is the mechanism by which the loss becomes invisible.
- **`if (exists(id)) return;` as deduplication.** Rejected by `E-13`.
  Check-then-act outside a transaction is a race that two concurrent deliveries
  lose — and two concurrent deliveries is what a rebalance produces; it
  deduplicates on the *effect's* identity rather than the *message's*, so it
  cannot distinguish a redelivery from a genuine second event; and no tool
  decides that this `if` is a dedup.
- **Broker-native exactly-once as a discharge for consumer idempotence.**
  Refused by `E-13`, and **both forms must be refused by name**: a log-shaped
  broker's transaction is broker-scoped, so a database write inside the handler
  is outside it, and a managed FIFO queue's "exactly-once" is a five-minute
  deduplication interval on *send*, not exactly-once processing.
- **The persistence entity as the payload.** Rejected by `E-18`. It publishes
  the database schema as a public contract; lazily loaded relations serialise as
  nothing, as an error, or as a full graph depending on session state at publish
  time; and it carries decimals as numbers, timestamps without zones and personal
  data with no retention decision onto a destination retained for a week by
  default.
- **The tenant from a thread-local request context.** Rejected by `E-22`. There
  is no request on a consumer thread, so it returns empty — or, on a pooled
  thread, the value left behind by whatever ran there last, which is a silent
  cross-tenant write with no error at any layer. No single-tenant test can see
  either.
- **A unit test with a mocked producer asserting the send happened.** Rejected
  by `E-24`. It certifies the call and nothing about delivery, durability,
  ordering, duplication, decoding or the dual write; the mock is written by the
  model that wrote the code; and it makes the coverage number rise, which is
  worse than no gate because it looks like one.
- **A hand-bumped schema version integer.** Rejected by `E-19`: forgetting to
  bump it is exactly the failure it exists to prevent, and it is a checklist item
  for a reader who does not exist.

The full steelman for each, and the wordings that must not be reintroduced, are
in [evidence.md](evidence.md).

## What to do when this skill fires

1. **First ask whether the work has to leave the caller's control flow.** A
   synchronous call that fails at the caller is cheaper than every rule below.
   If the broker's named owner does not exist, the correct answer is to keep the
   work synchronous rather than improvise a transport.
2. **Name the messaging-adapter module.** Every rule here is a check on one named
   module's API surface. Until it exists there is nothing for the rules to bind.
3. **Write the committed async-construct allow-list** (`E-1`) in the same change.
   Until it exists the seam is a ban list with a hole.
4. **Add the row to the committed catalog** (`E-26`) in the same change. It is
   machinery eleven other rules read, not documentation, and it is around twenty
   fields per subscription.
5. **Declare the transport shape, the ordering requirement, the failure policy
   and the replay safety** as machine-readable values in that catalog. A
   declaration in prose is a declaration no check can read.
6. **Record in the plan or spec that these rules bind this feature** (`E-28`).
7. **Wire the gates.** This skill states check kinds; a kind with no tool is a
   wish. On Java, `async-handoff-java` names the tools and has the wiring
   section.

## The seam

**E-1 — Every publish, every subscription registration and every
acknowledgement goes through one named messaging-adapter module, and the
permitted asynchronous-handoff constructs are an allow-list, not a ban list. A
committed list names every async-capable type and annotation — broker and queue
clients, in-process event buses, executor submits, async and scheduling
annotations, reactive subscribe operators, thread and virtual-thread starts — and
a lint fails on any reference to one from outside the adapter. The list file is
itself under a review gate, and a new dependency matching the committed transport
pattern set fails the build until a catalog entry exists. The adapter exposes no
reply-to, correlation or await-response primitive.**

Every other directive here is a check on the adapter's surface, so a second way
in is not one bypass — it is the whole set reporting green while the banned
shapes pass. That is the false assurance these rules exist to prevent, and it is
worse than no rule.

**The allow-list shape is not a stylistic preference.** A ban list enumerating
broker clients is green over every construct nobody thought of, while the rule's
own prose claims to cover any asynchronous shape. A hostile audit found the
ban-list version green over an async-completion helper, a bare virtual-thread
start, an async annotation, a scheduling annotation, a reactive subscribe and a
cron entry in a deployment manifest. With an allow-list, a novel mechanism is a
**missing list entry** and fails closed.

**The list must be complete for the transport the repo actually runs**, and for a
managed queue a dependency-level ban is not available at all — that client ships
in the same distribution as the object-storage and secrets clients the repo
legitimately needs, so there the ban must be a type-reference rule.
*Static rule (architecture or dependency check) over a committed type list, plus
a dependency-manifest check, plus a field-type rule for the hand-rolled cases.
Convention, 2026-07-29.*

**Named gap:** a hand-rolled request-reply built from two subscriptions and a
shared correlation id is synchronous call-and-response wearing a broker, and no
static check decides that two subscriptions form a pair. The no-correlation
clause raises the cost; spec-and-review is the residue.

**E-2 — No ambient consumer dispatch. A handler type carries no listener
annotation or attribute and implements no broker-library handler interface; no
subscription is created by classpath, assembly or module scanning; every
subscription is constructed at exactly one enumerated registration site inside
the adapter module; and the subscription list is generated from those sites and
diffed in CI.**

**State the limit rather than overreaching: a total ban on framework binding is
not writable and should not be.** Something must own the poll loop, the
acknowledgement, the rebalance callbacks and the thread pool, and hand-rolling
those is worse than the annotation. The enforceable rule has two decidable
halves — the *handler* is not the framework's type and carries no framework
annotation, and *binding* happens at one enumerated site in one module — and the
second produces the artifact the annotation destroys. With an annotation, "which
destinations does this service consume" is a fact only the annotations know and
nothing enumerates. Eleven directives below read that inventory, and an
unenumerated subscription has no failure policy, no owner, no alert and no
budget, with nothing reporting its absence.

**Check the meta-annotated and type-level forms, not just the method-level direct
annotation.** Where a framework's listener annotation is itself applicable to
annotation types, a repo can define its own annotation carrying it, and a rule
matching only the direct annotation on methods reports green while the banned
thing passes. Verified against one framework's own documentation — one
researcher, no panel — and that framework is named in the stack skill.
*Static rule plus a golden test (regenerate-and-diff). Convention, 2026-07-29.*

**E-3 — The handler is a nominal port type with at least two abstract members,
and its implementations live only in the module permitted to depend on the domain
services. No lambda or single-abstract-method binding compiles.**

Declare the port with one abstract member and every lambda body becomes a legal
handler, which analysis that reads compiled output cannot follow into. Two
abstract members make the lambda a **compile error**, so every handler is a
named importable type. This is the same construct the sibling cache rules use for
their loader, and it earns its place here for a second reason those do not have:
**a lambda handler is unnameable in the catalog**, so `E-2`'s
regenerate-and-diff produces rows nobody can act on. The second abstract member
has a job — it supplies the subscription id, or the decoded message type.

**Cost accepted, and it is real:** every handler is a class.
*Type design plus a static rule. Convention, 2026-07-29.*

**E-4 — There is no in-process asynchronous handoff and no non-broker transport.
The outbox plus its relay publishing to the broker is the only mechanism. An
in-process event bus is a banned dependency, not a governed shape; a table that
anything other than the relay polls is a banned shape; and a same-deployable
consumer subscribes to the broker like any other consumer.**

Stated as its own directive because a draft left it implied and the audit called
it the rule a three-person team breaks first, silently. `E-5` says application
code contains no publish and the only enqueue is a row in the state-change
transaction; an in-process handoff has no publish to confine and often no
transaction to join, so under `E-1` and `E-5` together the only compliant
in-process asynchrony is already outbox-plus-relay. **Saying it costs a database
round trip plus a publish, and buys the rule an operand.**
*Static rule — the banned dependency, the `E-1` allow-list, and a confinement
rule on who may read the outbox table. Convention, 2026-07-29.*

## The write path

**E-5 — Application code contains no publish. The publish operation is reachable
only from the outbox relay module, and application code's only enqueue path is a
write to the committed outbox table. The adapter exposes no unacknowledged
publish, and the durability setting is a committed value a lint reads rather than
a default relied upon.**

The failure prevented is the dual write, and it is the reason this rule set
exists. **Do not restore the wording "publish after the transaction commits".**
It is the corpus's own best advice and it is actively wrong as the primary rule:
post-commit publish *is* the dual write. Post-commit publish *with a durable
record of intent* is the outbox; without one it is a dual write with a better
name.

Two more wordings rejected. *"Never publish inside a transaction"* is enforceable
and nearly worthless — moving the call one frame down the stack satisfies it and
changes nothing — and it points at the wrong thing, since what *must* be inside
the transaction is the outbox row. *"Use two-phase commit between the database
and the broker"* adds a coordinator to operate for an organisation with nobody to
operate it.
*Static rule (confinement) plus a schema lint over the committed configuration.
Convention, 2026-07-29.*

**Named gap:** broker-side durability — replica counts, quorum size, minimum
in-sync replicas — lives in infrastructure no code-level check can see.
"Publishes with acknowledgement requested" is not "is durably stored". It is the
same class as the sibling cache rules' server-side-eviction gap.

**E-6 — The transaction is not ambient. The outbox-append operation takes a
nominal transaction handle as a written argument — a value constructible only by
the transaction seam, with no ambient-lookup overload and no no-argument form on
the outbox port. A rollback integration test is mandatory, not redundant: force
the state-change transaction to roll back after the append and assert zero
outbox rows and zero published messages.**

**Do not try to decide this with an analyzer, and the reason is recorded because
the unsound version reads better.** A draft claimed a bytecode-reading
architecture tool could decide "the outbox row shares the state change's
transaction" by resolving the ambient transaction scope through interface and
proxy boundaries, and therefore dropped the rollback test. **That claim was a
hostile audit's planted canary and it was caught.** It is false at the tool level
and unsound at the design level, and the grounds generalise to any stack:
whether a transaction is active at a call site depends on which callers reach it,
on whether the call arrived through the framework's proxy at all —
self-invocation bypasses it, same bytecode, opposite runtime answer — on the
propagation setting of every intermediate frame, on programmatic transaction
boundaries, and on **resource identity**, because the requirement is not "a
transaction is active" but "*the same* transaction", which two transaction
managers both satisfy while violating the rule.

So the requirement is discharged by the compiler at the call site and the runtime
test is the evidence.
*Type design plus a static rule (the port's signature and its referencing
modules) plus an integration test — the rollback arm, and the mirror arm: kill
the process after commit and before the relay, restart, and assert the message is
published and observably once. Convention, 2026-07-29.*

**Residue, stated:** one data source and one transaction manager is a committed
configuration fact checked by a config lint, not by a type. A repo adding a
second reopens this directive.

**E-7 — Every outbox row carries a producer-assigned message identity that is a
deterministic function of committed inputs: the aggregate identity plus a
monotonic per-aggregate sequence by default, or a hash of the row's business key
only where the catalog declares that destination idempotent-by-key. The identity
type has no public constructor and exactly one factory per strategy; the
factory's module may not reference a clock or a random source; the column is NOT
NULL UNIQUE; and a gate re-derives every identity in the committed message corpus
from its payload and fails on mismatch.**

At-least-once means the relay republishes a row it already published — it died
between publish and mark-sent. If the identity is minted per attempt the two
copies are **indistinguishable to every consumer**, and `E-13`'s dedup is not
merely absent but impossible. The duplicate is valid, well-formed and
correctly-shaped; nothing errors; the second effect is a second correct-looking
write.

**Do not restore the wording "every message has a unique id".** It is
enforceable, satisfied by a fresh random identifier, and it destroys the property
it appears to provide. **And do not enforce it with the unique constraint alone**
— a random value assigned at row-write time satisfies not-null, unique, and "not
generated at publish time", which is the exact failure the rule exists to stop,
reported green. The deterministic half is the load-bearing half and the
re-derivation gate is what checks it.
*Type design plus a schema lint plus a property test (same row, same identity)
plus a golden test (re-derivation over the committed corpus). Convention,
2026-07-29.*

**The hash-of-business-key strategy is not the default, and the reason is a live
hazard:** a genuinely recurring business event — a second identical order, a
re-subscribe after an unsubscribe, a corrective re-issue — collides, and because
the outbox row is written in the state change's transaction the collision aborts
the **state change**, not just the message. It fails loud, which is the right
direction, but it is a dedup mechanism blocking a valid write.

**E-8 — The relay claims outbox rows at partition-key granularity — one in-flight
claim per key — inside a transaction, using row-level skip-locked claiming rather
than a status column. It publishes *before* marking a row sent, treats a
possibly-successful publish as a re-publish that `E-13` deduplicates downstream,
never deletes an unsent row, and retains a sent row for a committed window with a
committed upper bound. Relay concurrency is a committed value.**

**Nothing in a draft governed the relay, and that was the audit's fatal scope
hole.** Twenty-two directives constrained the producer's write and the consumer's
handler while the component the whole design depends on had no rules. Three
failures follow, and the first would have shipped: **concurrent relay workers
claiming rows without regard to key publish out of aggregate order**, so
`E-15`'s partition key faithfully preserves at the broker an order the relay
already destroyed upstream, with every gate green. A status column instead of a
transaction-scoped claim strands rows when a worker dies, with no error anywhere.
And mark-then-publish reintroduces silent loss inside the fix for silent loss.

The retained-sent-row clause exists because of the asymmetry above: once the row
is deleted the broker holds the only copy, and a message is not recomputable from
anywhere.
*Static rule (confinement of the claim and publish operations) plus a schema lint
(retention window, concurrency) plus an integration test — kill the relay between
publish and mark-sent and assert one observable effect. Convention, 2026-07-29.*

**E-9 — The relay's liveness is a committed alert pair with fire-tests: one on
outbox depth above a committed threshold, one on the age of the oldest
unpublished row. A broker outage must not block a state-change transaction from
committing; the outbox absorbs it and the age alert fires.**

Separate from `E-8` for one reason: **it is the one that gets omitted.**
**Oldest-unpublished-row age is the single most important signal in this design
and a draft had it in no directive at all**, because the failure-policy alerts
are per-subscription and therefore consumer-side. A relay that stopped is
indistinguishable from a quiet system by every consumer-side gate.
*Production invariant with a fire-test plus an integration test — hold the
transport down past the threshold and assert the alert fired and no state-change
transaction was blocked. Convention, 2026-07-29.*

## The consume path

**E-10 — Automatic acknowledgement and automatic offset commit are off, and the
setting is a committed value a lint reads rather than a default relied upon. The
acknowledgement primitive is not reachable from handler code: the handler port
returns nothing, the adapter acknowledges only after the handler returns
normally, and a handler signals failure only by throwing.**

**State the premise per transport shape rather than as one claim, because a draft
stated it as one and it is false of the third shape.** The engines are named
because their documented defaults are this rule's **ground**, not its
enforcement:

- **Log-shaped (Apache Kafka).** The shipped default is periodic background
  offset commit — `enable.auto.commit=true` with a five-second interval — so
  records count as consumed when the poll returns them and a crash loses
  in-flight work **silently**.
- **Ack-based (RabbitMQ).** Automatic acknowledgement is documented by the
  project itself as unsafe, and the message is lost when the consumer's channel
  closes before successful delivery.
- **Managed queue (Amazon SQS).** There is **no automatic acknowledgement at
  all**: a message is removed only by an explicit delete, so the default failure
  is **redelivery, not loss**.

The directive holds across all three. **The rationale must not claim silent loss
for the shape that duplicates instead** — that claim was in a draft and is in
*Do not reintroduce*.

The second clause exists because the corpus's failure handler — catch, log,
acknowledge — is that silent drop written deliberately, and it bites harder here
than in a cache: there is no authoritative store to fall back to, so the message
is simply gone.
*Type design (void handler port, adapter-private acknowledgement) plus a schema
lint over the committed configuration plus an integration test — a throwing
handler sees the message again. Convention, 2026-07-29.*

**Named gap, inherited:** a catch that swallows by returning a default is
invisible to analysis that reads compiled output, and an empty-catch linter check
does not fire on it — the same residue the sibling cache rules record. The void
return type is what reduces it: there is no default to return.

**Check the framework's acknowledgement mode *and* any broker-side
acknowledgement setting.** One framework ships a consumer mode whose implicit
value has the broker acknowledge every record regardless of processing outcome,
with no listener involvement, so a rule inspecting only the listener mode is
green over it. Both settings are named in the stack skill.

**E-11 — Failure is classified at the throw site by two nominal types, terminal
and retryable, from a sealed base so no third option compiles. A catch in a
handler module must rethrow one of the two. A terminal failure routes to the
terminal destination on the first attempt without consuming the attempt
budget.**

Without this, `E-10`'s void-and-throw port **deletes the channel `E-20` needs**:
a throw is indistinguishable from a transient failure, so a permanently
undecodable message burns the whole attempt budget and the whole backoff
schedule, fires the retry alert, and on an ordered subscription — which `E-15`
forbids from having a retry destination — blocks the key forever. "Terminal" is
not expressible in the API `E-10` mandates, which is why this is a directive and
not a clause.
*Type design (sealed hierarchy) plus a compiler or linter check on the catch plus
an integration test. Convention, 2026-07-29.*

**E-12 — Every subscription declares a processing budget in the committed
catalog. A lint asserts that the budget is at or below the subscription's
committed lease — poll interval or visibility timeout — and that the declared
batch size times the declared per-item budget is at or below the budget. The
adapter owns the timeout; handler code contains no sleep, no unbounded wait and
no un-timed outbound call.**

A handler slower than the lease becomes a loop: the lease expires, the message is
redelivered, the handler runs again, the group rebalances. **Unbounded**, because
the duplicate count grows with the loop and with a non-idempotent effect every
iteration is another wrong write. **Invisible**, because it presents as **lag**,
which reads as "busy" rather than "executing the same work forever". The
arithmetic is read off two shipped defaults and is not hypothetical: Kafka's
batch default of **500 records** against a five-minute poll interval means any
per-record work above roughly **600 ms** guarantees the loop.
*Schema lint over the committed catalog and configuration plus a static rule over
handler modules. Convention, 2026-07-29.*

**Named gap:** a handler that ignores interruption runs past the adapter's
timeout, and no check decides that. The redelivery observed in `E-24`'s
fail-once arm is the closest mechanical signal.

**E-13 — Effect-free and deduplicated are port *types*, not catalog words. An
effect-free handler registers through a distinct port whose module's transitive
dependencies contain no write port, no publish, no outbound client and no file
write. A deduplicated handler cannot perform its effect except through an
operation that takes the message identity and writes the dedup record in the same
transaction as the effect; the dedup record lives in the consumer's own durable
transactional store, and its repository may not depend on the cache adapter, on
an in-memory map field, or on the broker. The catalog's declaration is generated
from the port type at the registration site and is never hand-written.**

Duplicate execution is certain rather than hypothetical — every transport's own
documentation says so. Invisible forever: a duplicated effect is a second
well-formed write. Two shipments, two emails, two ledger lines, two charges. No
exception, no log line, no metric moves; the only trace is the data, and nobody
is reading the code that produced it.

**Do not restore the wording "consumers must be idempotent".** It is true,
load-bearing and completely undecidable, so a gate worded around it reports green
over exactly the case the rule exists to stop. **And do not let `effect-free` be
a declaration.** A draft gave the deduplicated branch real mechanism and left
effect-free as a catalog field, which is a one-word bypass for this entire
discipline that both the normal and the duplicate evidence arms report green
over — and a behaviour switched by a declaration rather than by what is written
is the ambient dispatch this rule set exists to remove. That is the sibling cache
rules' recorded defect of cutting an undecidable predicate and re-importing it one
rule later.

**Where the dedup record may live, and who carries each ban.** `M-17` in the
published `money-api` skill requires an idempotency record written in the same
transaction as the money effect, and `M-40` in `money-storage` requires the same
of everything that makes a money effect reconstructable. **Read both for what
they say: each constrains *when* the record is written and neither names a store
it may or may not live in** — `M-17` mentions neither a cache nor a broker at
all, and `M-40` reaches the broker only to require that the row an event is
published from shares the effect's transaction, which is `E-5`. Neither bans a
host. `C-5` in the published `caching` skill bans such a record from the cache,
on the ground that a cache write is in no transaction. This directive carries the
broker half on its own: a record in the broker has the transport's durability
contract rather than the store's. A dedup record in a cache is therefore banned
twice, and in the broker once — here.
*Type design plus a static rule (transitive-dependency confinement) plus an
integration test (same message twice, one effect) plus a property test (the dedup
key is a function of the identity alone). Convention, 2026-07-29.*

**Two named gaps.** Whether two *distinct* messages denote the same effect is
semantic and no tool decides it — the identity makes duplicate *delivery*
detectable and says nothing about semantic duplication. And the exactly-once
claims an agent will cite must be named and refused: a log-shaped broker's
transaction is **broker-scoped**, so a database write inside the handler is
outside it, and a managed FIFO queue's "exactly-once" is a **five-minute
deduplication interval on send**, not exactly-once processing.

**E-14 — The dedup record's retention is a committed value bounded on both sides:
at or above the subscription's maximum redelivery window — lease times attempt
limit, plus the terminal destination's redrive window — and at or below a
committed upper bound. A lint compares the committed values.**

"Have a dedup table" is satisfied by a table pruned after sixty seconds, which
makes deduplication a coin flip that comes up wrong precisely under the
slow-retry conditions that produce duplicates. The upper bound is not decoration:
an unbounded dedup table nobody vacuums is a future outage on the team least able
to absorb one.
*Schema lint over the committed catalog. Convention, 2026-07-29.*

**Named gap:** the lint's operands are the repo's *declarations* of broker-side
retention and delivery limits, which can be a lie. The catalog's truth is
spec-and-review — the same class as `E-5`'s durability gap.

## Ordering

**E-15 — Every publish supplies a partition or group key of a nominal key type
constructible only from the aggregate identity; the adapter has no keyless
publish overload and the key factory accepts no free-text parameter. Every
subscription declares its ordering requirement as `ordered-within-key` or
`unordered`. An `ordered-within-key` subscription receives key-affine execution
by construction; its terminal destination takes the value `halt` — the key stops
and the message is not skipped — with a committed maximum halt duration and an
escalation alert; and it declares gap handling, wait-with-timeout or halt,
checked by the framework inside the dedup operation rather than by handler
code.**

Two failures. Without a key, messages about one aggregate land on different
partitions or are taken by competing consumers and processed concurrently in
arbitrary order; the resulting state is wrong **only under concurrency**, and the
test that gets written publishes one message. And **the retry or dead-letter
destination added for safety silently destroys the ordering the handler
assumes**, because a re-published message arrives after messages that were behind
it. That is documented rather than inferred: one framework's non-blocking retry
mechanism states outright that you lose the broker's ordering guarantees for that
topic, and Amazon SQS's documentation says not to attach a dead-letter queue to a
FIFO queue for the same reason.

**The ordered case carries a different *total* field set, not a missing one.** A
draft forbade an ordered subscription from declaring a terminal destination while
two other directives required the field, so an ordered subscription both had to
and could not have one. The cross-field lint reads "ordered implies terminal
destination is `halt`", never "ordered implies the field is absent".

**Ground the no-free-text clause on unwritability, not on bytecode.** A factory
that **cannot take a string** makes the wrong call unwritable, which is stronger
than any bytecode ban and does not turn on a tool's capabilities. The sibling
cache rules ground their equivalent key rule the same way for the same reason,
and the bytecode argument once offered for it is challenged and unverified — see
[evidence.md](evidence.md).
*Type design plus a schema lint (cross-field over the catalog) plus an
integration test — per ordered subscription, deliver a key's messages out of
sequence and require detection and rejection, never a different silent state.
Convention, 2026-07-29.*

**Named gap, required:** "this handler assumes global order across keys" is not
statically decidable, and neither is causal dependence between events on
different keys. What is decidable is that the declaration exists, that the
adapter cannot violate it, that the retry policy cannot contradict it, and that
the out-of-sequence test exists.

## Poison messages and retries

**E-16 — Every subscription's failure policy is a committed catalog row with five
required machine-readable fields: a finite maximum delivery-attempt count, a
backoff schedule with a non-zero minimum interval, a terminal destination, a
named owning team, and two alert names — one on arrivals at the terminal
destination, one on staleness (lag or oldest-unprocessed age above a committed
threshold, with a heartbeat so "no traffic" is distinguishable from "not
running"). No subscription may declare unlimited attempts. No subscription may
declare `drop`.**

Three failures, all invisible or unbounded. **Unbounded retry** of a message that
can never succeed, which on a log-shaped subscription holds the partition so one
malformed message stops every key that shares it — and the symptom is lag, so the
diagnosis points at capacity. **Silent drop, which is the platform default**:
RabbitMQ's quorum queues carry a delivery limit defaulting to 20 since 4.0, and
past the limit the message is dropped unless a dead-letter exchange is
configured, which nothing requires. And **a backlog nobody sees**, which is where
the absent reader is doubled: for a synchronous call, failure surfaces at the
caller — a user sees an error, an error rate moves — while for an asynchronous
consumer failure surfaces **nowhere**. The publisher succeeded; the message sits.
**The absence of a signal is the failure mode**, which is not true of a request
path, and that is why the alerts belong in this rule rather than only in an
observability section.

**The staleness alert with a heartbeat is not the same as a lag alert.** A
subscription that silently stops — a rebalance loop, a deserializer failure at
startup, a renamed group, scaled to zero — produces **no lag because it produces
nothing**, and every CI-side liveness proof (`E-25`) passes.

**Do not restore the wording "every consumer has a dead-letter queue".** It is
enforceable by asserting a destination is configured, nearly worthless alone
because a terminal destination with no owner and no alert is where messages go to
be forgotten, and sometimes **actively harmful**, because attaching one to an
ordered subscription breaks the ordering the handler assumes.
*Schema lint over the committed catalog plus a production invariant (both alerts,
each with a fire-test) plus an integration test — exhaust the attempt count and
assert the message is at the terminal destination. Convention, 2026-07-29.*

**The org-shape defect, stated rather than hidden:** there is no operations role,
so the owning team and both alerts route to the one engineer who wrote the code.
Either the terminal destination gets an automated drain-and-replay path — `E-23`'s
machinery can supply it — or the five committed fields produce unactioned pages,
which is worse than no alert because it trains the team to ignore the channel.

**E-17 — Retry shape is a function of the broker shape declared in the catalog.
On a log-shaped subscription retry is non-blocking: the adapter re-publishes to a
committed delay destination carrying the original key and identity, and handler
modules may not reference sleep or park primitives. On a queue-shaped
subscription in-place redelivery with the committed backoff is permitted. The
terminal destination's committed retention is strictly longer than the source's.
Redrive is a named operation committed in the repository and re-enters through the
same subscription, and therefore through `E-13`'s dedup path.**

Head-of-line blocking is unbounded and presents as lag. The retention clause
prevents a documented trap: Amazon SQS's own documentation says to set a
dead-letter queue's retention longer than the source's, because the expiry of a
standard-queue message is based on its **original** enqueue timestamp and moving
it does not reset the clock — so a dead-letter queue configured with the same
retention silently deletes the evidence sooner than anyone expects, and nobody
reads that configuration.
*Static rule plus a schema lint (retention comparison, shape-conditional policy)
plus an integration test. Convention, 2026-07-29.*

**The weakest clause in this rule set, marked rather than dressed up:** "redrive
is a committed operation, not a console action" is **spec-and-review**. A console
redrive is an unreviewed, unlogged replay of arbitrary effects, and no check in a
repository can see that someone clicked a button.

## The payload as a published contract

**E-18 — Every message type has a committed schema file; the payload types the
adapter accepts are generated from those schemas; the generated code is committed
and regenerated-and-diffed in CI; and the publish port accepts only generated
types, so a hand-written payload class does not compile against it.**

The payload is a contract with **no compile-time link to its consumers**. A field
renamed by an agent compiles, publishes, and every consumer silently reads the
absent field as its type default — and the producer's tests pass.
*Golden test (regenerate-and-diff) plus a static rule constraining the port's
parameter type. Convention, 2026-07-29.*

**E-19 — Schema evolution is gated in CI against the full committed version
history of the subject — an append-only directory, one file per version, plus a
committed compatibility level — not against the previous version alone and not by
a setting a running registry enforces at publish time. The gate fails if any
existing version file is modified or deleted. Where the destination is retained
or replayable the committed level must be a transitive one. Subjects are owned:
the same subject in two repositories fails both builds.**

This is the outside oracle these gates need: the previous committed schemas plus
a checker neither model wrote, run at the gate a human reads.

**A draft named "check against the previous committed schema" *and* required a
transitive level, and those cannot both be true.** Checking against the last
version **is** the non-transitive check — a schema registry's own documentation
defines the transitive variants as checking against **every** registered version
and the non-transitive ones as checking the latest only — so the draft's gate
structurally could only produce the answer transitive exists to reject, and would
report green over it. Two individually compatible steps can be jointly
incompatible with a consumer two versions behind, and a retained log guarantees
the older bytes are still readable: Kafka's shipped default topic retention is
**seven days**, so "the old bytes are gone" is not a defence.
*Contract lint (the compatibility check over the history directory) plus a schema
lint (the committed level, conditioned on the retention declaration).
Convention, 2026-07-29.*

**Extra condition:** the owned-subject clause additionally requires a second
independently deployable consumer. Until one exists the clause is dormant, not
deleted — and see `E-26`'s cross-repository gap, which is the same gap from the
other side.

**Named gap, and it is the important one:** **a compatibility checker decides
shape, never meaning.** Redefining an amount from gross to net, or a status from
the producer's state machine to a coarser one, passes every level including the
strictest. There is no mechanical oracle for it, and the residue is
spec-and-review at the plan gate — which is the strongest argument in this rule
set for a human reading the spec.

**E-20 — Decode discipline, deliberately asymmetric. A missing required field, an
unparseable value or a type mismatch is a **terminal** failure — never a default,
never null, never zero — decided against the schema version the consumer was
generated from. An unknown extra field is **tolerated**, retained, counted per
subject and field name, and alerted under a committed threshold with a named
owner. The decoder is configured in the adapter only, and its strictness settings
are committed values a lint reads.**

**Do not restore the wording "deserialization is strict: an unknown or missing
field is an error".** It is the sibling cache rules' correct rule (`C-11`) and it
is wrong here. For a cache value the writer and the reader are the same
deployable, so rejecting an unknown field costs nothing and catches shape drift.
For a broker payload the writer is a different deployable on a different release
cadence, and **adding an optional field is the entire mechanism backward
compatibility exists to permit** — so a consumer that rejects unknown fields
turns every additive producer change into an outage in every consumer, converting
the compatibility level's central guarantee into its opposite. The half that
stays hard is missing-and-unparseable, because defaulting a missing value is the
silent-wrong-answer path — and for the money case that is `M-13` in the published
`money-api` skill.

**Required-ness moves**, which is why the reference version is named in the rule:
under a backward-compatible producer sequence a field can be optional in one
version and required in the next, so "missing is terminal" is undecidable at the
boundary unless it is decided against the version the consumer was built against.
And the tolerated half needs its threshold and owner: "counted and alerted" with
neither is structurally the catch-log-continue `E-10` bans.
*Parse test over a committed corpus of malformed, truncated, missing-field and
extra-field payloads, plus a schema lint over the committed decoder
configuration, plus a production invariant (the unknown-field metric and its
alert). Convention, 2026-07-29.*

**E-21 — Payload content bans, decidable as a lint over the committed schema
files: no binary floating-point field anywhere in a message schema; a decimal is
a string carrying an explicit currency where it is an amount; no timestamp
without an explicit offset or zone; no open-ended enumeration without a declared
unspecified member and a consumer branch for it; no field whose only content is
an identifier the consumer must dereference to learn what the message means; no
personal data on a destination whose committed retention exceeds the repo's
committed personal-data retention ceiling; and a committed maximum payload size
per subject.**

**The float ban is blanket, with an explicitly listed exception set rather than a
scope limited to money fields**, for the reason `M-2` in the published `money`
skill gives: "which fields are money" is not decidable by the check that would
enforce it. **This is the float ban's fifth layer** — after the field (`M-2`),
the wire (`M-12`), the column (`M-10`) and a cached copy (`C-10`) — and it is
here because the ban re-enters at every layer.

The **unspecified-enumeration** rule is the most common real event-schema defect
and is fully decidable at the schema level: the producer adds a member, the
consumer's generated enumeration maps the unrecognised value to its zero member,
and a refund is silently processed as pending. The **dereference ban** is
decidable in the form that matters — the consuming handler's module may not
depend on an outbound client for the producer it consumes from — and its hazard
is not coupling but that the consumer reads *current* state rather than state at
event time, so the same message replayed later yields a different answer.
*Schema lint plus a parse test (the unrecognised enumeration value) plus a static
rule (the dereference-dependency ban). Convention, 2026-07-29.*

**Named gap:** personal data is not decidable without a data-classification
regime at the type level. Until then it is a schema lint over an annotated field
list at best, and spec-and-review otherwise.

**And one rule is banned outright:** *"log every message received"*. It is what
an agent adds to make a consumer debuggable, and it copies the payload — personal
data included — into a log store with its own longer retention and its own access
control. That copy is what survives after the destination's retention expires, so
it converts a bounded exposure into an unbounded one in the name of
observability.

## Tenancy and replay

**E-22 — Two nominal scope types, and the distinction is carried by the type
system rather than by prose. The message carries a data scope as a required field
of a nominal type, and it is the only source of scope inside a handler: handler
modules may not reference the request-context accessor or any ambient scope
holder, and the adapter provides no default scope. Any operation whose authority
depends on the caller takes an authorized-actor parameter whose constructor is
unreachable from a handler module, so a privileged call does not compile there.
Every subscription carries a two-tenant integration test.**

The corpus favourite is a thread-local tenant context populated by a web request
filter. On a consumer thread there is no request, so it returns empty — or, on a
pooled thread, **the value left behind by whatever ran there last**, which is a
silent cross-tenant write with no error at any layer. No test with one tenant can
see any of it.

**The verdict a draft recorded in prose — "trust the scope field for data
placement but not as authorization for a privileged action" — is right and was
unenforceable.** "Privileged action" is undecidable, and one value carrying two
meanings resolved by surrounding context is exactly the ambient meaning these
rules remove. Two types make it decidable: the data scope is key and column
material, and authority is a value a consumer cannot manufacture. A consumer that
must act with authority calls one named operation that re-derives it from the
authoritative store using the aggregate identity.
*Type design plus a static rule plus an integration test — two tenants, the same
logical message, each effect in its own scope. Convention, 2026-07-29.*

The two-tenant test is the **outside oracle**: its ground truth is the underlying
store, not an assertion written by the model that wrote the handler.

**E-23 — Every subscription declares `replay-safe` or `replay-unsafe`. A
replay-safe handler's module may not read a clock **as data**, a random source,
or producer-current state through an outbound client; the event time it needs
arrives in the message. A `replay-unsafe` subscription may not be attached to a
retained destination.**

A retained log can be replayed, and replay is the tool reached for during an
incident. A handler that calls the clock, reads a rate table, or fetches current
state produces **different results than the original run**, and the replay looks
like it worked — invisible forever, at the worst possible moment. The
`replay-unsafe`-on-retained-destination clause is a cross-field catalog lint and
is the cheap half.

**The clock ban needs its exemption stated or it contradicts three other
directives:** what is banned is reading a clock as a value that reaches an effect
or a payload. Expiry windows and telemetry timestamps are computed inside the
dedup and telemetry adapters, which a handler calls without reading time itself.
*Static rule plus a characterization replay — process a committed message corpus
twice; the second pass produces no additional observable effect. Convention,
2026-07-29.*

**Named gap:** "the handler is a total function of the message" is not decidable.
The three bans are decidable proxies for it, and they are proxies.

## Evidence gates

These are the outside checks. After implementation, a model reviewing model
output shares the implementer's blind spots, so a gate whose ground truth comes
only from assertions the same model wrote proves nothing about
plausible-but-wrong output. **The same system under a delivery permutation is the
one oracle here that the implementing model did not write**, which is why the
central gate is differential.

**E-24 — The integration suite runs against a real transport in a container, in
four configurations, and the arms are split by the ordering declaration rather
than applied uniformly: (1) normal; (2) duplicate-everything — every message
delivered twice; (3) reorder-and-fail-once — for `unordered` subscriptions,
reorder within a key and require identical observable results, and for
`ordered-within-key` subscriptions, reorder across keys and require identical
results, plus reorder *within* a key and require that the out-of-sequence message
was detected and rejected; (4) transport-unavailable — every publish path either
persists an outbox row and returns success or returns a coded error, and no path
silently drops or reports success without a row.**

**The split is not a refinement, it is a correction of an unsatisfiable
assertion.** A draft required identical observable results from a
reorder-within-key arm applied to every subscription. For an
`ordered-within-key` subscription that either reorders only across keys — never
exercising ordering at all, green over ordering bugs — or reorders within a key,
in which case correct code **must** produce a different result and the assertion
fails on correct code. The lived outcome of the second branch is that teams
declare everything `unordered` to make CI pass, which is a corpus-dominant wrong
pick the draft did not name.

**Claim only what it catches.** It can decide: duplicate handling on driven
paths, ordering assumptions within a key, acknowledgement discipline,
dedup-record durability across a consumer restart, decoder strictness against a
malformed corpus, terminal routing after the declared attempt count, and — where
the harness can kill the relay between publish and mark-sent — `E-7`'s republish
path. It **cannot** decide: broker-side configuration that lives in production
infrastructure, since the container runs the repository's committed
configuration; rebalance behaviour at production partition counts and timing;
multi-instance consumer-group interleaving unless the suite genuinely runs two
consumer instances, which most do not; lease expiry mid-handler unless the suite
compresses the timeouts, which changes the thing under test; and any subscription
no test drives.
*Integration test (differential — four configurations of one suite, compared
against each other). The check kinds this rule set uses have no term for
differential execution; the nearest, a characterization replay, compares against
committed output files, while this compares four runs of one suite against each
other. The parenthetical carries that difference; no new kind is invented for it.
Convention, 2026-07-29.*

**E-25 — Every configuration proves it took effect, per subscription; every
declared alert proves it fires; and every static rule proves it can fail.** The
duplicate arm asserts, for each subscription the catalog declares
`deduplicated`, that the effect operation was invoked twice with the same
identity, that exactly one dedup record exists, and that the effect count is one;
for each declared `effect-free`, that effect counts are equal across passes. The
reorder arm asserts an out-of-order delivery was observed; the fail-once arm
asserts a redelivery was observed; the unavailable arm asserts the injected fault
was observed. The normal arm fails if any subscription **enumerated in the
committed catalog** processed zero messages. `E-23`'s replay gate asserts a
non-zero first-pass effect count before asserting a zero second-pass delta. Each
alert `E-16` and `E-9` require has a committed fire-test. Each architecture rule
ships a committed violating fixture that must make the build fail.

Separate from `E-24` for one reason: **it is the one that gets omitted.**
Nothing in a differential gate verifies its own configurations. A duplicate
harness that silently is not duplicating makes three arms the same run, results
are trivially identical, and the gate reports green over every failure it exists
to catch. **Fifteen of the directives above lean on `E-24`.**

**Three tool facts make each clause necessary rather than defensive**, and all
three are verified for Java, where they are named in `async-handoff-java`: a
fault-injection
proxy exposes no API confirming that a fault affected a given operation, and its
toxicity is a **probability**, so a registered fault can legitimately not fire on
the operation under test; an architecture-rule library rejects an empty
should-clause by default, but the setting that restores silent vacuity is a
one-line property and a per-rule override, both invisible in a passing build log;
and a no-op cache manager is byte-identical to its binding never having been
applied. The tools are named in the stack skill.
*Integration test (positive control) plus a production invariant with fire-tests
plus a negative fixture per static rule. Convention, 2026-07-29.*

## The catalog, the topology, and the plan

**E-26 — A committed subscription-and-destination catalog, generated from the
adapter's registration sites and diffed in CI. Registration takes **one nominal
specification value with every field required** — no builder defaults, no
optional parameters — so the compiler enforces completeness and the generator can
read all of it. The catalog is also published as a release artifact.**

It names, per publication and subscription: the destination; the broker shape;
the schema subject and its committed compatibility level; the partition-key
source; the ordering declaration and gap handling; the delivery-attempt limit and
backoff; the terminal destination and its retention; the processing budget and
batch size; the effect-free-or-deduplicated declaration and the identity
strategy; the dedup-record retention; the replay-safety declaration; the maximum
payload size; the owning team; and the alert names. **That is around twenty
fields per subscription, and the count is stated rather than hidden.**

**Load-bearing machinery, not documentation:** `E-2` generates it and `E-9`,
`E-12`, `E-14`, `E-15`, `E-16`, `E-17`, `E-19`, `E-20`, `E-23`, `E-24` and
`E-25` read it. A new subscription cannot appear without a git-visible row at the
gate a human reads — which, since the human never reads the handler, is the only
place a new asynchronous path becomes visible at all.

**The single-required-value shape is what keeps the count survivable, and it is
the difference between a generated catalog and a half-generated one.** Several
fields do not exist at a registration site unless the registration API demands
them — terminal-destination retention, dedup retention, processing budget, owning
team, both alert names. Without one mandatory specification value the catalog is
generated in part and hand-maintained in part, **and the diff gate cannot tell
which half drifted** — a false green over the artifact eleven directives read.
*Type design plus a golden test (regenerate-and-diff). Convention, 2026-07-29.*

**One honest limit:** the owning-team field and any prose field cannot be
compared against behaviour by any regenerate-and-diff. Those are the catalog's
documentation half and this rule set says so rather than calling them a gate.

**Extra condition, the same one `E-19` carries:** the published-artifact clause
and the ownership half of this directive are the cross-repository ones, and they
additionally require a second independently deployable consumer. Until one exists
they are dormant, not deleted; the generated catalog itself is not, because
eleven directives read it inside one repo.

**The gap that matters most in an eighteen-team organisation, and it is named
rather than solved:** the catalog and `E-19`'s compatibility gate are
**repo-local**. A producer removing a destination, renaming a subject or
loosening a compatibility level cannot see the other seventeen repositories.
Publishing the catalog as an artifact is the decidable half; the union check — a
producer's CI reading every published consumer catalog and failing when a change
removes or narrows a destination some consumer references — needs org-level
infrastructure that does not exist. **Until it does, `E-19` and `E-26` are
local hygiene wearing the clothes of a contract.** Do not read the diff as a
contract.

**E-27 — Destination topology is a committed declarative input applied at
deploy — partition count, retention, compaction policy, delivery limit and
dead-letter wiring — and a partition-count change is behind a review gate.**

Otherwise the topology is created by someone, somewhere, and everything above is
checked against an artifact nothing pins. The specific hazard: a partition-count
change **re-maps existing keys**, so ordering for already-published aggregates
breaks silently while every gate stays green, and `E-15`'s key type cannot see
it.
*Schema lint over the committed topology plus spec-and-review at the review gate.
Convention, 2026-07-29.*

**E-28 — The plan that introduces the first asynchronous handoff cites these
rules and names, for each new destination: the destination, its catalog row, the
ordering declaration, and every team expected to consume it. It does not argue
whether a broker is warranted.**

Not the arming mechanism — this skill's **description** is what fires when an
agent is about to hand work off, and it fires without anyone remembering to
re-read anything. What `E-28` adds is that the decision is written down at the
one gate a human reads. **The obligation is deliberately smaller than it was**:
it used to require a threshold argument, which was the one undecidable judgement
in this rule set, made by a gate with no distributed-systems reader. What is left
is four facts a plan author can state and a reviewer can check against the
catalog diff in the same pull request. **The consuming-teams field is the one
that cannot be generated**, and it is the only place `E-26`'s cross-repository
gap gets a human's attention.
*Spec-and-review at the plan approval gate. Convention, 2026-07-29.*

## Two shapes banned outright

**These two are never dormant.** A ban with a precondition is a ban an agent can
argue its way past, so they carry no condition and they live in this skill rather
than in `async-handoff-shapes` with the other conditional shapes.

**Neither is bad engineering. Both are unaffordable *here*, and the grounds are
this organisation's** — no operations role, one engineer per team, and a licence
clause on the self-hosted variant that both dedicated event stores and the
workflow engines fail. **A ban that rests on the organisation rather than on the
technology has to name its re-open trigger**, and [evidence.md](evidence.md)
does. Read both as the strongest available *argument*, not as a survived one:
they came out of a pass with no panel, no steelman duel and no hostile audit, and
the case for each rejected option was written by whoever rejected it.

**E-32 — The broker is not a store of record, and current state is not a fold
over the message history. State is a row in a service's own transactional store
and that row is the authority. No query path, no read model and no recovery path
reconstructs state by reading the broker or the outbox table. Event-store
products are banned dependencies. A committed message corpus may be replayed to
rebuild a **derived** projection whose authority is the producer's state, never to
establish a fact that no table holds.**

Three failures, each of which the absent reader makes permanent, and none of
which throws. **Retention deletes the authority on a schedule nobody wrote
down:** a log-shaped topic's shipped default retention is seven days and a
compacted topic keeps only the latest value per key, so a design whose state *is*
the log has a data-loss policy set by a broker default. `E-8` compounds it from
the other side — the relay deletes a sent outbox row after a committed window, so
the producer-side copy is not a history either, by this rule set's own rules. **A
schema change that `E-19` legitimately permits is applied to bytes written years
earlier**, so the fold's output changes meaning while no code changes and every
gate stays green; that is `E-19`'s own named gap compounding with age. And the
symptom of all of it is a **wrong current value**, not an exception.

The licence and operations grounds are separate and also sufficient, and they are
dated in [evidence.md](evidence.md).

**Stated so the ban is actionable rather than merely prohibitive:** keep the
state table and publish events for notification and projection. That is the
design the other directives already describe, and it is why this ban costs a repo
nothing it had.
*Static rule — a banned dependency on event-store clients, `E-4`'s
outbox-read confinement extended so no query module reads the outbox, and no
query module depending on the messaging adapter — plus spec-and-review.
Convention, 2026-07-29.*

**Named gap:** "this projection is being treated as the authority" is semantic.
The decidable half is the dependency direction — a query module that cannot reach
the adapter cannot fold the log.

**E-33 — No stream-processing engine, and no time-window aggregate computed
inside a handler. Stream-processing frameworks are banned dependencies. A
consumer's effect is a write to its own store; a join is two subscriptions
writing into one table that is then read transactionally. A handler holds no
cross-message state — no mutable field, no static collection, no accumulating
buffer — and computes no aggregate over a time window. Where a windowed number is
required it is a query over the projection table with the window as a committed
parameter, evaluated at read time.**

**The failure is a silently wrong number, which is the worst shape there is, and
the engine's own semantics produce it by design.** Kafka Streams' windowing
documentation states that records arriving more than the grace period after a
window ends are considered late and **will be dropped**, and the drop surfaces
only in a task-level counter that consolidated three older ones. So a windowed
aggregate under-counts, nothing raises, and the only trace is a counter nobody
here is watching, because there is no operations role. The vendor deprecated its
own 24-hour default grace period precisely because a default was making that
trade on the user's behalf; a repo would inherit whichever default its version
ships.

**In-handler state is the same failure without the framework**, and it is what an
agent writes once the dependency is banned: the value depends on which messages
*that instance* happened to see, so it differs per consumer and resets on every
restart and rebalance. `E-24` records that most suites never run two consumer
instances, so the test that would catch it is the test nobody writes.

**And an engine is a second always-on stateful system** — state stores, changelog
topics, standby replicas, restore time on rebalance — with no owner here.
*Static rule (banned dependency; no mutable state field or static collection in a
handler or flow module; no clock-derived window bound in handler code) plus an
integration test (the two-instance arm: the same aggregate query returns the same
answer however the messages were split between instances) plus a schema lint (the
window is a committed parameter). Convention, 2026-07-29.*

**Named gap:** an aggregate accumulated in the database against a wrong window is
not caught by any of these. Making the window a committed parameter is what puts
it in a diff a human reads.

## Interlocks these rules must not break

- **The post-commit hook is a shared resource, and this is a genuine collision
  with the published `caching` skill.** `C-9` requires cache invalidation to be
  reachable only from the transaction seam's post-commit callback. If a repo
  satisfies that with a general-purpose post-commit callback registration, **`E-5`
  is defeated entirely** — nothing at a call site distinguishes "delete a cache
  key after commit" from "publish after commit". A repo installing both must make
  post-commit registration a **named member of the cache adapter's own port**,
  with no free-callback form, and ban every other post-commit registration.
- **Do not reuse the phrase "derived-store premise" for a message.** That is the
  `caching` skill's term for a value recomputable from the authoritative store,
  and the asymmetry above is precisely that a message in flight is not one. A
  message's premise is that the **producer-side row** is the durable record until
  the broker acknowledges; call it that.
- **`E-13` does not weaken `M-20`.** The published `money` skill requires a money
  effect to emit a catalog event for reconstruction; `E-13` bans
  correctness-bearing *use* of the broker and says nothing about forensic
  emission. **Never write a directive of the form "an asynchronously delivered
  fact carries no audit obligation".** Note also that `M-20`'s catalog event is
  **telemetry** — a metric-and-log entry, not a broker message.
- **`E-5` and `E-6` must not be implemented as separable APIs.** One
  outbox-append operation takes the transaction handle. A second append overload
  without it would give `E-5` a compliant host and destroy `E-6`.
- **`E-11`'s terminal classification must not be a marker interface on a broad
  exception type.** If any exception can be re-tagged terminal at a catch site
  outside the handler, `E-16`'s attempt budget stops being a bound.
- **`E-32` does not contradict `E-23`.** Replay rebuilds a *derived* projection
  whose authority is the producer's state table; what `E-32` bans is replay as the
  way a fact is *established*. **Never write a directive of the form "the log is
  the history, so a table is a cache of it"** — that is the inversion, and it is
  the most natural sentence an agent will produce here.
- **`E-33`'s ban on in-handler window state does not ban a scheduled query over a
  projection table.** The relay is the only component `E-1` and `E-4` permit to be
  scheduled at all, so a scheduled read-model refresh is an adapter-module concern
  with a committed schedule, never a scheduling annotation in a service class.
- **A fold over stored rows is permitted and a fold over a message history is
  banned, and the published `money-storage` skill says so from its side.** `M-38`
  recommends deriving a balance from durable ordered rows inside one transaction
  domain, which is a query; `E-32` bans state rebuilt from a **message** stream,
  where ordering, retention and redelivery are the transport's to define. Same
  word, different mechanism, opposite verdict.

## Markers, dates, and what they mean

**Every one of the thirty directives above is convention, dated 2026-07-29, and
that is a ceiling on the whole set rather than a per-rule accident.** None
survived three independent refutation votes against primary sources, because each
is a **design argument rather than an execution result**. There is **no
production use of this rule set anywhere.**

**Two passes, and both fell short of the protocol they were written under — which
is published in this skill set as `tech-decision-research`, so what they fell
short of can be read rather than taken on trust.** The
first wrote `E-1` … `E-28`: it ran a design steelman, two tool-evidence passes
against primary sources, a candidate comparison, and a hostile audit carrying a
planted defect of its own class — **the canary was caught, so that audit's
findings count** — but the three refutation votes were never run, because the
session's agent budget was exhausted mid-pass. The second wrote the composite
shapes, including the two bans here: **one researcher, no panel, no steelman duel
and no hostile audit**, which is weaker in shape than the first even where its
facts are firmer. **Two of its outputs are bans that remove an option from every
future repo, and a ban is exactly the kind of verdict an adversarial panel exists
to attack.**

- **confirmed** — survived three independent refutation votes against independent
  sources, on the stated date. **No directive here carries it.**
- **primary-source verified** — one researcher checked it against a primary
  source, with no panel. No directive here carries it either; several *facts*
  quoted above do, and they are dated in [evidence.md](evidence.md).
- **convention** — defensible practice the research did not or could not confirm
  from independent sources. All thirty.

**Do not promote a marker here without a new research pass.** The strongest
material behind these rules is **primary-source verified and still not
confirmed** — the shipped configuration defaults quoted in `E-10`, `E-12`,
`E-16`, `E-17` and `E-19`, and the three tool facts behind `E-25`. One
researcher read each against a primary source and no panel refuted any of them;
running the votes is what would promote them. They are per-transport or
per-stack and live in [evidence.md](evidence.md) and in the stack skill.

**The lapse rule.** These rules were last dated for a review by **2027-01-29**.
Past that date every **confirmed** marker reads as **convention** until a new
pass re-dates it. This needs no maintainer action: read a lapsed claim as
written. In the directives it changes nothing, because nothing is confirmed.

The passes, the sources, the full steelman for each rejected shape, the wordings
that must not be reintroduced, the nine-candidate transport survey, and the
conditions that reopen a decision are in [evidence.md](evidence.md).
