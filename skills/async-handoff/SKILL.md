---
name: async-handoff
description: Asynchronous-handoff discipline for any repo where the caller's control flow does not contain the work's execution, in any language — one outbox row plus one broker and no second mechanism, one messaging-adapter seam guarded by an allow-list of async constructs, no annotation-bound consumers, no publish outside the relay, a deterministic message identity, a governed relay with an oldest-unpublished-row alert, manual acknowledgement only, effect-free and deduplicated handlers as distinct port types, partition keys with an ordering declaration, a five-field failure policy with no silent drop, generated payload types gated against the full schema history, scope carried in the message rather than a thread-local, replay safety, the four-configuration differential gate, a generated subscription catalog, and two architectures banned outright. Load before publishing a message, adding a queue or broker client, an in-process event bus, an executor submit, a fire-and-forget or scheduled task, a polled table, or an outbound webhook — and before deciding whether work should leave the caller's control flow at all. States the kind of check each rule needs; the tool is named in the matching stack skill (async-handoff-java).
---
# Asynchronous-handoff discipline

Thirty directives — `E-1` … `E-28`, plus two bans `E-32` and `E-33`. Each state **kind** of check it need. No tool named here: near none of these checks portable — most rule need different tool per stack, and rule with no named check be wish. Stack skill name tool.

**Six more directives live in `async-handoff-shapes`** — `E-29` … `E-31` and `E-34` … `E-36`. Dormant til further condition hold, so separate skill; two bans here **never dormant**, stay here. See *What is here and what is elsewhere*.

**Read marker ceiling before rules.** All thirty be **convention**, dated 2026-07-29, and **no production use of this rule set anywhere**. Each be design argument, not execution result — nothing here confirmed. Worse than sibling cache rules one specific way: research pass behind these thirty **did not run three independent refutation votes** it should. One hostile audit stand in their place; its planted defect caught, so findings trusted. That pass did confirm *tool* and *transport-default* evidence; tool half live in stack skill. **No marker here promote without new research pass.** Full statement in *Markers, dates, and what they mean*.

## The premise these rules are conditioned on

**LLM agents write code, no human read it line by line, and repo hand work off async — caller's control flow not contain work's execution.**

Async handoff change shape of every failure. Inside caller's control flow, failure be exception: something throw, status code move, user see error. Once work leave that control flow, failures stop be exceptions and become **absences** — message never published, effect ran twice, backlog nobody watch. None throw. Nobody read code, so nothing else notice either.

Verdict portable exactly far as its premise. In repo where human read every messaging change line by line, several rules below drop mandatory → advisable. Where so, say so and carry burden of saying it; not silently drop rule.

**Skill name narrower than scope, on purpose.** "Broker" be word someone search for. Rules bind from **first asynchronous handoff of any shape**, and all these hand work off while importing no broker client:

- table in service's own database, polled by scheduled job;
- in-process event bus, or framework's application-event publisher;
- fire-and-forget submit to thread pool, async annotation, bare thread or virtual-thread start;
- outbound webhook receiver retry;
- scheduled scan that find rows in state and act on them.

Every one produce at-least-once or at-most-once delivery, duplicate execution, poison items, ordering assumptions, failure destination nobody read. **Seam scoped to broker client leave all of them outside every check below** — and since `E-4` make them *forbidden* not merely unguarded, narrow seam also make stepping outside rules cheapest way to satisfy them. Same defect sibling `caching` rules had to correct in own seam, worse here. So seam be **messaging adapter**, and `E-1` be allow-list not ban list.

Rules bind from **first asynchronous handoff**. Before that: dormant, not absent.

## One mechanism: an outbox row and a broker. There is no second option

**Every async handoff go through outbox and broker.** No threshold to evaluate, no cheaper shape to pick. Application code write row in state change's transaction; relay claim row and publish to broker; consumers subscribe. That be whole topology, same whether consumer be another team's service or class in same deployable.

**This reverse earlier answer, and reversal be load-bearing, not historical.** First version recommended polled table in service's own database and made broker conditional escalation above three named thresholds. Thresholds withdrawn 2026-07-29 — not because new fact arrive, but because unusable at gate that must decide them:

1. **Routing decision undecidable, landed on wrong reader.** "Which threshold crossed" had to be argued and judged at plan gate, where readers be team leader, AI solution engineer, domain owner — no distributed-systems engineer, no operations role, no colleague to check answer. Threshold nobody present can evaluate be corpus-favourite wrong pick with extra steps: team take whichever branch agent proposed first.
2. **Branches had different rule surfaces, so wrong branch also less-guarded one.** Three shapes to learn, three sets of checks to wire, nothing at gate saying which shape repo be in.
3. **Discriminating threshold predicted to fire anyway**, so default be branch with misleading name.

**Three withdrawn thresholds must not return in any wording** — see [evidence.md](evidence.md), *Do not reintroduce*. Plan arguing threshold not crossed argue against this section.

### The broker is mandatory and so is the outbox. They stop different failures

**Broker be transport. Outbox be durable record of intent, and making broker mandatory not remove failure outbox exist to stop.** Database commit and publish not one transaction, and process can die between them either order. Publishing after commit **is** dual write: commit succeeded, process died, event never went, nothing anywhere record it should have. `E-5` state this; `E-6`, `E-7`, `E-8`, `E-9` enforce it. **Repo that adopt broker and drop outbox have exactly failure these rules written for, and that be most likely misreading of reversal above.**

Asymmetry against sibling cache rules be ground, worth stating once because it decide two rules opposite directions. Cache entry recomputable from authoritative store, so lost cache delete be **bounded** stale read that self-heal. Message between publish and successful processing exist **only** in broker unless producer-side row retained; losing it be **unbounded permanent absence**, no self-healing path, no gate anywhere that can compare against message never produced. Same shape, opposite verdict. Not carry either over to other.

**Outbox not transport.** Nothing subscribe to it, nothing outside relay read it. Claim shape documented by PostgreSQL for exactly this use — skipping locked rows "provides an inconsistent view of the data, so this is not suitable for general purpose work, but can be used to avoid lock contention with multiple consumers accessing a queue-like table" (its `SELECT` documentation, read 2026-07-29). **Both clauses load-bearing and `E-8` carry them**: claim must be transaction-scoped not status column, and skipping locked rows give **no ordering**, which be why relay claiming rows concurrently destroy order `E-15` then faithfully preserve at broker.

### The org fact this rests on, and what it costs

Eighteen three-person teams, one engineer each, **no platform or operations role**. That fact ground two things: named owner for self-hosted broker be **prerequisite not condition** — self-hosted variant cannot be built without one — and two bans below rest on this organisation, not on techniques being bad engineering.

Costs of single mechanism, stated not hidden. Event consumed only by deployable that produced it still cross broker: database round trip plus publish where bare executor submit cost neither. And three of four arms of `E-24`'s gate were cheap when table be transport, not cheap against real broker in container — which make `E-24` most expensive gate in this rule set or its siblings.

**Queue-shaped versus log-shaped be real distinction, now transport-pick question, not per-subscription argument.** `E-16`, `E-17`, `E-24`, `E-26` read broker-shape declaration from catalog, because retry shape and acknowledgement granularity genuinely differ. What changed be who decide: shape follow one transport repo run, recorded once, not re-argued per fact at plan gate. **Which broker that be, not directive here** — per-stack pick with deployment-shaped gates, stated in stack skill. Nine-candidate survey of transport landscape — licences, release cadence, documented minimum production shape, ground each candidate lost on — in [evidence.md](evidence.md); evidence for that pick, not rule here.

## What is here and what is elsewhere

- **This skill** — seam, write path, consume path, ordering, poison handling, payload contract, tenancy, replay, evidence gates, catalog, topology, plus two never-dormant bans. Platform-neutral: every rule state check kind, name no tool.
- **`async-handoff-shapes`** — six directives for shapes assembled *out of* publishes and subscriptions, each dormant til own condition hold: flow committing in more than one transaction (`E-29` … `E-31`), HTTP across organisation's boundary either direction (`E-34`, `E-35`), payload that cannot meet subject's committed maximum size (`E-36`). Install when one of three true. **Bans not there**: `E-32` and `E-33` never dormant, so here.
- **`async-handoff-java`** — same rules with Java, Spring Boot, ArchUnit, Error Prone, Jackson, jOOQ, Maven, JUnit, jqwik, Testcontainers, Toxiproxy named; broker pick and outbox-library pick; one-time gate wiring; named gaps where that toolchain host no check. Install in repo on that stack; without it every rule here have check kind and no tool.
- **`caching`** — published, collide with `E-5` at one point. `C-9` require cache invalidation reachable only from transaction seam's post-commit callback. **If repo satisfy that with general-purpose post-commit callback registration, `E-5` defeated entirely** — nothing at call site distinguish "delete cache key after commit" from "publish after commit". Repo installing both must make post-commit registration named member of cache adapter's own port, no free-callback form, and ban every other post-commit registration. Both skills state this from own side.
- **`money-api`** — published. `M-17` require idempotency record written in same transaction as money effect. `E-13` be same record on consume path. **Read `M-17` for what it say and no more:** it require same transaction and mention neither cache nor broker, so bans on those two hosts carried by `C-5` and `E-13`, not by any money skill.
- **`money-storage`** — published. `M-40` require durable row a money event publish from be written in money effect's own transaction, and name outbox as seam. That be `E-5`, two agree; `M-40` record residue this rule set had to exist to discharge.
- **`money`** — published. `E-21`'s blanket float ban be **fifth layer** of same ban, after field, wire, column, cached copy.

## The defaults these rules override, by name

Agent told "publish an event" write one specific thing. Naming it be point; "be careful with messaging" override no instinct.

- **Annotated listener plus annotated transactional publish** — save entity, send event, one annotation each. **Training-corpus favourite by wide margin, what unbriefed agent write.** Banned by `E-2` and `E-5`. Genuinely attractive: three lines, read exactly like requirement, framework own poll loop and rebalance and thread pool — which you should not hand-roll — and transaction annotation mean later failure roll database back. Lose on four grounds: rollback not un-publish, so rolled-back write can have published event and nothing record contradiction; reverse failure worse and more common, because commit succeed, process die, event never go; transaction scope ambient, so code's text not say whether publish inside it; and subscription set exist only in annotations, so nothing enumerate it and eleven directives below lose operand.
- **Catch-log-acknowledge consumer.** Rejected by `E-10` and `E-11`. Catch acknowledge, so effect be silent drop, and process staying up be mechanism by which loss become invisible.
- **`if (exists(id)) return;` as deduplication.** Rejected by `E-13`. Check-then-act outside transaction be race two concurrent deliveries lose — and two concurrent deliveries be what rebalance produce; it dedup on *effect's* identity not *message's*, so cannot distinguish redelivery from genuine second event; and no tool decide this `if` be dedup.
- **Broker-native exactly-once as discharge for consumer idempotence.** Refused by `E-13`, and **both forms must be refused by name**: log-shaped broker's transaction be broker-scoped, so database write inside handler be outside it, and managed FIFO queue's "exactly-once" be five-minute deduplication interval on *send*, not exactly-once processing.
- **Persistence entity as payload.** Rejected by `E-18`. Publish database schema as public contract; lazily loaded relations serialise as nothing, as error, or as full graph depending on session state at publish time; carry decimals as numbers, timestamps without zones, personal data with no retention decision onto destination retained one week by default.
- **Tenant from thread-local request context.** Rejected by `E-22`. No request on consumer thread, so return empty — or, on pooled thread, value left behind by whatever ran there last, which be silent cross-tenant write with no error at any layer. No single-tenant test see either.
- **Unit test with mocked producer asserting send happened.** Rejected by `E-24`. Certify call and nothing about delivery, durability, ordering, duplication, decoding or dual write; mock written by model that wrote code; and it make coverage number rise, worse than no gate because look like one.
- **Hand-bumped schema version integer.** Rejected by `E-19`: forgetting to bump be exactly failure it exist to prevent, and be checklist item for reader who not exist.

Full steelman for each, and wordings that must not be reintroduced, in [evidence.md](evidence.md).

## What to do when this skill fires

1. **First ask whether work must leave caller's control flow.** Synchronous call failing at caller be cheaper than every rule below. If broker's named owner not exist, correct answer be keep work synchronous, not improvise transport.
2. **Name messaging-adapter module.** Every rule here be check on one named module's API surface. Til it exist, nothing for rules to bind.
3. **Write committed async-construct allow-list** (`E-1`) in same change. Til it exist, seam be ban list with hole.
4. **Add row to committed catalog** (`E-26`) in same change. Machinery eleven other rules read, not documentation, and ~twenty fields per subscription.
5. **Declare transport shape, ordering requirement, failure policy, replay safety** as machine-readable values in that catalog. Declaration in prose be declaration no check can read.
6. **Record in plan or spec that these rules bind this feature** (`E-28`).
7. **Wire gates.** This skill state check kinds; kind with no tool be wish. On Java, `async-handoff-java` name tools and have wiring section.

## The seam

**E-1 — Every publish, every subscription registration and every acknowledgement go through one named messaging-adapter module, and permitted async-handoff constructs be allow-list, not ban list. Committed list name every async-capable type and annotation — broker and queue clients, in-process event buses, executor submits, async and scheduling annotations, reactive subscribe operators, thread and virtual-thread starts — and lint fail on any reference to one from outside adapter. List file itself under review gate, and new dependency matching committed transport pattern set fail build til catalog entry exist. Adapter expose no reply-to, correlation or await-response primitive.**

Every other directive here be check on adapter's surface, so second way in be not one bypass — it be whole set reporting green while banned shapes pass. That be false assurance these rules exist to prevent, worse than no rule.

**Allow-list shape not stylistic preference.** Ban list enumerating broker clients be green over every construct nobody thought of, while rule's own prose claim to cover any async shape. Hostile audit found ban-list version green over async-completion helper, bare virtual-thread start, async annotation, scheduling annotation, reactive subscribe, cron entry in deployment manifest. With allow-list, novel mechanism be **missing list entry** and fail closed.

**List must be complete for transport repo actually run**, and for managed queue dependency-level ban not available at all — that client ship in same distribution as object-storage and secrets clients repo legitimately need, so there ban must be type-reference rule.
*Static rule (architecture or dependency check) over committed type list, plus dependency-manifest check, plus field-type rule for hand-rolled cases. Convention, 2026-07-29.*

**Named gap:** hand-rolled request-reply built from two subscriptions and shared correlation id be synchronous call-and-response wearing broker, and no static check decide two subscriptions form pair. No-correlation clause raise cost; spec-and-review be residue.

**E-2 — No ambient consumer dispatch. Handler type carry no listener annotation or attribute and implement no broker-library handler interface; no subscription created by classpath, assembly or module scanning; every subscription constructed at exactly one enumerated registration site inside adapter module; and subscription list generated from those sites and diffed in CI.**

**State limit, not overreach: total ban on framework binding not writable and should not be.** Something must own poll loop, acknowledgement, rebalance callbacks, thread pool, and hand-rolling those worse than annotation. Enforceable rule have two decidable halves — *handler* not framework's type and carry no framework annotation, and *binding* happen at one enumerated site in one module — and second produce artifact annotation destroy. With annotation, "which destinations this service consume" be fact only annotations know and nothing enumerate. Eleven directives below read that inventory, and unenumerated subscription have no failure policy, no owner, no alert, no budget, nothing reporting its absence.

**Check meta-annotated and type-level forms, not just method-level direct annotation.** Where framework's listener annotation itself applicable to annotation types, repo can define own annotation carrying it, and rule matching only direct annotation on methods report green while banned thing pass. Verified against one framework's own documentation — one researcher, no panel — and that framework named in stack skill.
*Static rule plus golden test (regenerate-and-diff). Convention, 2026-07-29.*

**E-3 — Handler be nominal port type with at least two abstract members, and its implementations live only in module permitted to depend on domain services. No lambda or single-abstract-method binding compile.**

Declare port with one abstract member and every lambda body become legal handler, which analysis reading compiled output cannot follow into. Two abstract members make lambda **compile error**, so every handler be named importable type. Same construct sibling cache rules use for their loader, and it earn place here for second reason those not have: **lambda handler unnameable in catalog**, so `E-2`'s regenerate-and-diff produce rows nobody can act on. Second abstract member have job — supply subscription id, or decoded message type.

**Cost accepted, and real:** every handler be class.
*Type design plus static rule. Convention, 2026-07-29.*

**E-4 — No in-process async handoff and no non-broker transport. Outbox plus its relay publishing to broker be only mechanism. In-process event bus be banned dependency, not governed shape; table anything other than relay poll be banned shape; and same-deployable consumer subscribe to broker like any other consumer.**

Stated as own directive because draft left it implied and audit called it rule three-person team break first, silently. `E-5` say application code contain no publish and only enqueue be row in state-change transaction; in-process handoff have no publish to confine and often no transaction to join, so under `E-1` and `E-5` together only compliant in-process asynchrony already be outbox-plus-relay. **Saying it cost database round trip plus publish, and buy rule an operand.**
*Static rule — banned dependency, `E-1` allow-list, and confinement rule on who may read outbox table. Convention, 2026-07-29.*

## The write path

**E-5 — Application code contain no publish. Publish operation reachable only from outbox relay module, and application code's only enqueue path be write to committed outbox table. Adapter expose no unacknowledged publish, and durability setting be committed value lint read, not default relied upon.**

Failure prevented be dual write, and be reason this rule set exist. **Not restore wording "publish after the transaction commits".** It be corpus's own best advice and actively wrong as primary rule: post-commit publish *is* dual write. Post-commit publish *with durable record of intent* be outbox; without one be dual write with better name.

Two more wordings rejected. *"Never publish inside a transaction"* be enforceable and near worthless — moving call one frame down stack satisfy it and change nothing — and point at wrong thing, since what *must* be inside transaction be outbox row. *"Use two-phase commit between the database and the broker"* add coordinator to operate for organisation with nobody to operate it.
*Static rule (confinement) plus schema lint over committed configuration. Convention, 2026-07-29.*

**Named gap:** broker-side durability — replica counts, quorum size, minimum in-sync replicas — live in infrastructure no code-level check see. "Publishes with acknowledgement requested" not "is durably stored". Same class as sibling cache rules' server-side-eviction gap.

**E-6 — Transaction not ambient. Outbox-append operation take nominal transaction handle as written argument — value constructible only by transaction seam, no ambient-lookup overload, no no-argument form on outbox port. Rollback integration test mandatory, not redundant: force state-change transaction to roll back after append and assert zero outbox rows and zero published messages.**

**Not try to decide this with analyzer, and reason recorded because unsound version read better.** Draft claimed bytecode-reading architecture tool could decide "outbox row share state change's transaction" by resolving ambient transaction scope through interface and proxy boundaries, and so dropped rollback test. **That claim be hostile audit's planted canary and it be caught.** False at tool level, unsound at design level, and grounds generalise to any stack: whether transaction active at call site depend on which callers reach it, on whether call arrived through framework's proxy at all — self-invocation bypass it, same bytecode, opposite runtime answer — on propagation setting of every intermediate frame, on programmatic transaction boundaries, and on **resource identity**, because requirement be not "a transaction is active" but "*the same* transaction", which two transaction managers both satisfy while violating rule.

So requirement discharged by compiler at call site and runtime test be evidence.
*Type design plus static rule (port's signature and its referencing modules) plus integration test — rollback arm, and mirror arm: kill process after commit and before relay, restart, assert message published and observably once. Convention, 2026-07-29.*

**Residue, stated:** one data source and one transaction manager be committed configuration fact checked by config lint, not by type. Repo adding second reopen this directive.

**E-7 — Every outbox row carry producer-assigned message identity that be deterministic function of committed inputs: aggregate identity plus monotonic per-aggregate sequence by default, or hash of row's business key only where catalog declare that destination idempotent-by-key. Identity type have no public constructor and exactly one factory per strategy; factory's module may not reference clock or random source; column be NOT NULL UNIQUE; and gate re-derive every identity in committed message corpus from its payload and fail on mismatch.**

At-least-once mean relay republish row it already published — it died between publish and mark-sent. If identity minted per attempt, two copies be **indistinguishable to every consumer**, and `E-13`'s dedup be not merely absent but impossible. Duplicate be valid, well-formed, correctly-shaped; nothing error; second effect be second correct-looking write.

**Not restore wording "every message has a unique id".** Enforceable, satisfied by fresh random identifier, and destroy property it appear to provide. **And not enforce with unique constraint alone** — random value assigned at row-write time satisfy not-null, unique, and "not generated at publish time", which be exact failure rule exist to stop, reported green. Deterministic half be load-bearing half and re-derivation gate be what check it.
*Type design plus schema lint plus property test (same row, same identity) plus golden test (re-derivation over committed corpus). Convention, 2026-07-29.*

**Hash-of-business-key strategy not default, and reason be live hazard:** genuinely recurring business event — second identical order, re-subscribe after unsubscribe, corrective re-issue — collide, and since outbox row written in state change's transaction, collision abort **state change**, not just message. Fail loud, right direction, but be dedup mechanism blocking valid write.

**E-8 — Relay claim outbox rows at partition-key granularity — one in-flight claim per key — inside transaction, using row-level skip-locked claiming, not status column. It publish *before* marking row sent, treat possibly-successful publish as re-publish `E-13` dedup downstream, never delete unsent row, and retain sent row for committed window with committed upper bound. Relay concurrency be committed value.**

**Nothing in draft governed relay, and that be audit's fatal scope hole.** Twenty-two directives constrained producer's write and consumer's handler while component whole design depend on had no rules. Three failures follow, first would have shipped: **concurrent relay workers claiming rows without regard to key publish out of aggregate order**, so `E-15`'s partition key faithfully preserve at broker order relay already destroyed upstream, every gate green. Status column instead of transaction-scoped claim strand rows when worker die, no error anywhere. And mark-then-publish reintroduce silent loss inside fix for silent loss.

Retained-sent-row clause exist because of asymmetry above: once row deleted, broker hold only copy, and message not recomputable from anywhere.
*Static rule (confinement of claim and publish operations) plus schema lint (retention window, concurrency) plus integration test — kill relay between publish and mark-sent, assert one observable effect. Convention, 2026-07-29.*

**E-9 — Relay's liveness be committed alert pair with fire-tests: one on outbox depth above committed threshold, one on age of oldest unpublished row. Broker outage must not block state-change transaction from committing; outbox absorb it and age alert fire.**

Separate from `E-8` for one reason: **it be the one that get omitted.** **Oldest-unpublished-row age be single most important signal in this design and draft had it in no directive at all**, because failure-policy alerts be per-subscription and so consumer-side. Relay that stopped be indistinguishable from quiet system by every consumer-side gate.
*Production invariant with fire-test plus integration test — hold transport down past threshold, assert alert fired and no state-change transaction blocked. Convention, 2026-07-29.*

## The consume path

**E-10 — Automatic acknowledgement and automatic offset commit be off, and setting be committed value lint read, not default relied upon. Acknowledgement primitive not reachable from handler code: handler port return nothing, adapter acknowledge only after handler return normally, and handler signal failure only by throwing.**

**State premise per transport shape, not as one claim, because draft stated it as one and it be false of third shape.** Engines named because their documented defaults be this rule's **ground**, not its enforcement:

- **Log-shaped (Apache Kafka).** Shipped default be periodic background offset commit — `enable.auto.commit=true` with five-second interval — so records count as consumed when poll return them and crash lose in-flight work **silently**.
- **Ack-based (RabbitMQ).** Automatic acknowledgement documented by project itself as unsafe, and message lost when consumer's channel close before successful delivery.
- **Managed queue (Amazon SQS).** **No automatic acknowledgement at all**: message removed only by explicit delete, so default failure be **redelivery, not loss**.

Directive hold across all three. **Rationale must not claim silent loss for shape that duplicate instead** — that claim be in draft and be in *Do not reintroduce*.

Second clause exist because corpus's failure handler — catch, log, acknowledge — be that silent drop written deliberately, and bite harder here than in cache: no authoritative store to fall back to, so message simply gone.
*Type design (void handler port, adapter-private acknowledgement) plus schema lint over committed configuration plus integration test — throwing handler see message again. Convention, 2026-07-29.*

**Named gap, inherited:** catch that swallow by returning default be invisible to analysis reading compiled output, and empty-catch linter check not fire on it — same residue sibling cache rules record. Void return type be what reduce it: no default to return.

**Check framework's acknowledgement mode *and* any broker-side acknowledgement setting.** One framework ship consumer mode whose implicit value have broker acknowledge every record regardless of processing outcome, no listener involvement, so rule inspecting only listener mode be green over it. Both settings named in stack skill.

**E-11 — Failure classified at throw site by two nominal types, terminal and retryable, from sealed base so no third option compile. Catch in handler module must rethrow one of two. Terminal failure route to terminal destination on first attempt without consuming attempt budget.**

Without this, `E-10`'s void-and-throw port **delete channel `E-20` need**: throw indistinguishable from transient failure, so permanently undecodable message burn whole attempt budget and whole backoff schedule, fire retry alert, and on ordered subscription — which `E-15` forbid from having retry destination — block key forever. "Terminal" not expressible in API `E-10` mandate, which be why this be directive not clause.
*Type design (sealed hierarchy) plus compiler or linter check on catch plus integration test. Convention, 2026-07-29.*

**E-12 — Every subscription declare processing budget in committed catalog. Lint assert budget at or below subscription's committed lease — poll interval or visibility timeout — and that declared batch size times declared per-item budget be at or below budget. Adapter own timeout; handler code contain no sleep, no unbounded wait, no un-timed outbound call.**

Handler slower than lease become loop: lease expire, message redelivered, handler run again, group rebalance. **Unbounded**, because duplicate count grow with loop and with non-idempotent effect every iteration be another wrong write. **Invisible**, because it present as **lag**, which read as "busy" not "executing the same work forever". Arithmetic read off two shipped defaults, not hypothetical: Kafka's batch default of **500 records** against five-minute poll interval mean any per-record work above roughly **600 ms** guarantee loop.
*Schema lint over committed catalog and configuration plus static rule over handler modules. Convention, 2026-07-29.*

**Named gap:** handler that ignore interruption run past adapter's timeout, and no check decide that. Redelivery observed in `E-24`'s fail-once arm be closest mechanical signal.

**E-13 — Effect-free and deduplicated be port *types*, not catalog words. Effect-free handler register through distinct port whose module's transitive dependencies contain no write port, no publish, no outbound client, no file write. Deduplicated handler cannot perform its effect except through operation that take message identity and write dedup record in same transaction as effect; dedup record live in consumer's own durable transactional store, and its repository may not depend on cache adapter, on in-memory map field, or on broker. Catalog's declaration generated from port type at registration site, never hand-written.**

Duplicate execution certain, not hypothetical — every transport's own documentation say so. Invisible forever: duplicated effect be second well-formed write. Two shipments, two emails, two ledger lines, two charges. No exception, no log line, no metric move; only trace be data, and nobody read code that produced it.

**Not restore wording "consumers must be idempotent".** True, load-bearing, completely undecidable, so gate worded around it report green over exactly case rule exist to stop. **And not let `effect-free` be declaration.** Draft gave deduplicated branch real mechanism and left effect-free as catalog field, which be one-word bypass for this entire discipline that both normal and duplicate evidence arms report green over — and behaviour switched by declaration rather than by what be written be ambient dispatch this rule set exist to remove. That be sibling cache rules' recorded defect of cutting undecidable predicate and re-importing it one rule later.

**Where dedup record may live, and who carry each ban.** `M-17` in published `money-api` skill require idempotency record written in same transaction as money effect, and `M-40` in `money-storage` require same of everything that make money effect reconstructable. **Read both for what they say: each constrain *when* record written and neither name store it may or may not live in** — `M-17` mention neither cache nor broker at all, and `M-40` reach broker only to require row an event published from share effect's transaction, which be `E-5`. Neither ban a host. `C-5` in published `caching` skill ban such record from cache, on ground cache write be in no transaction. This directive carry broker half on its own: record in broker have transport's durability contract, not store's. Dedup record in cache therefore banned twice, in broker once — here.
*Type design plus static rule (transitive-dependency confinement) plus integration test (same message twice, one effect) plus property test (dedup key be function of identity alone). Convention, 2026-07-29.*

**Two named gaps.** Whether two *distinct* messages denote same effect be semantic and no tool decide it — identity make duplicate *delivery* detectable and say nothing about semantic duplication. And exactly-once claims agent will cite must be named and refused: log-shaped broker's transaction be **broker-scoped**, so database write inside handler be outside it, and managed FIFO queue's "exactly-once" be **five-minute deduplication interval on send**, not exactly-once processing.

**E-14 — Dedup record's retention be committed value bounded both sides: at or above subscription's maximum redelivery window — lease times attempt limit, plus terminal destination's redrive window — and at or below committed upper bound. Lint compare committed values.**

"Have a dedup table" be satisfied by table pruned after sixty seconds, which make deduplication coin flip that come up wrong precisely under slow-retry conditions that produce duplicates. Upper bound not decoration: unbounded dedup table nobody vacuum be future outage on team least able to absorb one.
*Schema lint over committed catalog. Convention, 2026-07-29.*

**Named gap:** lint's operands be repo's *declarations* of broker-side retention and delivery limits, which can be lie. Catalog's truth be spec-and-review — same class as `E-5`'s durability gap.

## Ordering

**E-15 — Every publish supply partition or group key of nominal key type constructible only from aggregate identity; adapter have no keyless publish overload and key factory accept no free-text parameter. Every subscription declare its ordering requirement as `ordered-within-key` or `unordered`. `ordered-within-key` subscription receive key-affine execution by construction; its terminal destination take value `halt` — key stop and message not skipped — with committed maximum halt duration and escalation alert; and it declare gap handling, wait-with-timeout or halt, checked by framework inside dedup operation, not by handler code.**

Two failures. Without key, messages about one aggregate land on different partitions or be taken by competing consumers and processed concurrently in arbitrary order; resulting state wrong **only under concurrency**, and test that get written publish one message. And **retry or dead-letter destination added for safety silently destroy ordering handler assume**, because re-published message arrive after messages that were behind it. Documented, not inferred: one framework's non-blocking retry mechanism state outright you lose broker's ordering guarantees for that topic, and Amazon SQS's documentation say not to attach dead-letter queue to FIFO queue for same reason.

**Ordered case carry different *total* field set, not missing one.** Draft forbade ordered subscription from declaring terminal destination while two other directives required field, so ordered subscription both had to and could not have one. Cross-field lint read "ordered implies terminal destination is `halt`", never "ordered implies the field is absent".

**Ground no-free-text clause on unwritability, not on bytecode.** Factory that **cannot take a string** make wrong call unwritable, stronger than any bytecode ban and not turning on tool's capabilities. Sibling cache rules ground their equivalent key rule same way for same reason, and bytecode argument once offered for it be challenged and unverified — see [evidence.md](evidence.md).
*Type design plus schema lint (cross-field over catalog) plus integration test — per ordered subscription, deliver key's messages out of sequence and require detection and rejection, never different silent state. Convention, 2026-07-29.*

**Named gap, required:** "this handler assumes global order across keys" not statically decidable, and neither be causal dependence between events on different keys. What be decidable: declaration exist, adapter cannot violate it, retry policy cannot contradict it, out-of-sequence test exist.

## Poison messages and retries

**E-16 — Every subscription's failure policy be committed catalog row with five required machine-readable fields: finite maximum delivery-attempt count, backoff schedule with non-zero minimum interval, terminal destination, named owning team, and two alert names — one on arrivals at terminal destination, one on staleness (lag or oldest-unprocessed age above committed threshold, with heartbeat so "no traffic" distinguishable from "not running"). No subscription may declare unlimited attempts. No subscription may declare `drop`.**

Three failures, all invisible or unbounded. **Unbounded retry** of message that can never succeed, which on log-shaped subscription hold partition so one malformed message stop every key sharing it — symptom be lag, so diagnosis point at capacity. **Silent drop, which be platform default**: RabbitMQ's quorum queues carry delivery limit defaulting to 20 since 4.0, and past limit message dropped unless dead-letter exchange configured, which nothing require. And **backlog nobody see**, where absent reader be doubled: for synchronous call, failure surface at caller — user see error, error rate move — while for async consumer failure surface **nowhere**. Publisher succeeded; message sit. **Absence of signal be failure mode**, not true of request path, and that be why alerts belong in this rule, not only in observability section.

**Staleness alert with heartbeat not same as lag alert.** Subscription that silently stop — rebalance loop, deserializer failure at startup, renamed group, scaled to zero — produce **no lag because produce nothing**, and every CI-side liveness proof (`E-25`) pass.

**Not restore wording "every consumer has a dead-letter queue".** Enforceable by asserting destination configured, near worthless alone because terminal destination with no owner and no alert be where messages go to be forgotten, and sometimes **actively harmful**, because attaching one to ordered subscription break ordering handler assume.
*Schema lint over committed catalog plus production invariant (both alerts, each with fire-test) plus integration test — exhaust attempt count, assert message at terminal destination. Convention, 2026-07-29.*

**Org-shape defect, stated not hidden:** no operations role, so owning team and both alerts route to one engineer who wrote code. Either terminal destination get automated drain-and-replay path — `E-23`'s machinery can supply it — or five committed fields produce unactioned pages, worse than no alert because train team to ignore channel.

**E-17 — Retry shape be function of broker shape declared in catalog. On log-shaped subscription retry be non-blocking: adapter re-publish to committed delay destination carrying original key and identity, and handler modules may not reference sleep or park primitives. On queue-shaped subscription in-place redelivery with committed backoff permitted. Terminal destination's committed retention strictly longer than source's. Redrive be named operation committed in repository and re-enter through same subscription, so through `E-13`'s dedup path.**

Head-of-line blocking be unbounded and present as lag. Retention clause prevent documented trap: Amazon SQS's own documentation say set dead-letter queue's retention longer than source's, because expiry of standard-queue message based on its **original** enqueue timestamp and moving it not reset clock — so dead-letter queue configured with same retention silently delete evidence sooner than anyone expect, and nobody read that configuration.
*Static rule plus schema lint (retention comparison, shape-conditional policy) plus integration test. Convention, 2026-07-29.*

**Weakest clause in this rule set, marked not dressed up:** "redrive is a committed operation, not a console action" be **spec-and-review**. Console redrive be unreviewed, unlogged replay of arbitrary effects, and no check in repository see someone click button.

## The payload as a published contract

**E-18 — Every message type have committed schema file; payload types adapter accept be generated from those schemas; generated code committed and regenerated-and-diffed in CI; and publish port accept only generated types, so hand-written payload class not compile against it.**

Payload be contract with **no compile-time link to its consumers**. Field renamed by agent compile, publish, and every consumer silently read absent field as its type default — and producer's tests pass.
*Golden test (regenerate-and-diff) plus static rule constraining port's parameter type. Convention, 2026-07-29.*

**E-19 — Schema evolution gated in CI against full committed version history of subject — append-only directory, one file per version, plus committed compatibility level — not against previous version alone and not by setting a running registry enforce at publish time. Gate fail if any existing version file modified or deleted. Where destination retained or replayable, committed level must be transitive one. Subjects be owned: same subject in two repositories fail both builds.**

This be outside oracle these gates need: previous committed schemas plus checker neither model wrote, run at gate human read.

**Draft named "check against the previous committed schema" *and* required transitive level, and those cannot both be true.** Checking against last version **is** non-transitive check — schema registry's own documentation define transitive variants as checking against **every** registered version and non-transitive ones as checking latest only — so draft's gate structurally could only produce answer transitive exist to reject, and would report green over it. Two individually compatible steps can be jointly incompatible with consumer two versions behind, and retained log guarantee older bytes still readable: Kafka's shipped default topic retention be **seven days**, so "the old bytes are gone" not defence.
*Contract lint (compatibility check over history directory) plus schema lint (committed level, conditioned on retention declaration). Convention, 2026-07-29.*

**Extra condition:** owned-subject clause additionally require second independently deployable consumer. Til one exist, clause dormant, not deleted — and see `E-26`'s cross-repository gap, same gap from other side.

**Named gap, and it be the important one:** **compatibility checker decide shape, never meaning.** Redefining amount from gross to net, or status from producer's state machine to coarser one, pass every level including strictest. No mechanical oracle for it, and residue be spec-and-review at plan gate — strongest argument in this rule set for human reading spec.

**E-20 — Decode discipline, deliberately asymmetric. Missing required field, unparseable value or type mismatch be **terminal** failure — never default, never null, never zero — decided against schema version consumer generated from. Unknown extra field be **tolerated**, retained, counted per subject and field name, and alerted under committed threshold with named owner. Decoder configured in adapter only, and its strictness settings be committed values lint read.**

**Not restore wording "deserialization is strict: an unknown or missing field is an error".** That be sibling cache rules' correct rule (`C-11`) and wrong here. For cache value writer and reader be same deployable, so rejecting unknown field cost nothing and catch shape drift. For broker payload writer be different deployable on different release cadence, and **adding optional field be entire mechanism backward compatibility exist to permit** — so consumer rejecting unknown fields turn every additive producer change into outage in every consumer, converting compatibility level's central guarantee into its opposite. Half that stay hard be missing-and-unparseable, because defaulting missing value be silent-wrong-answer path — and for money case that be `M-13` in published `money-api` skill.

**Required-ness move**, which be why reference version named in rule: under backward-compatible producer sequence field can be optional in one version and required in next, so "missing is terminal" undecidable at boundary unless decided against version consumer built against. And tolerated half need its threshold and owner: "counted and alerted" with neither be structurally catch-log-continue `E-10` ban.
*Parse test over committed corpus of malformed, truncated, missing-field and extra-field payloads, plus schema lint over committed decoder configuration, plus production invariant (unknown-field metric and its alert). Convention, 2026-07-29.*

**E-21 — Payload content bans, decidable as lint over committed schema files: no binary floating-point field anywhere in message schema; decimal be string carrying explicit currency where it be amount; no timestamp without explicit offset or zone; no open-ended enumeration without declared unspecified member and consumer branch for it; no field whose only content be identifier consumer must dereference to learn what message mean; no personal data on destination whose committed retention exceed repo's committed personal-data retention ceiling; and committed maximum payload size per subject.**

**Float ban be blanket, with explicitly listed exception set rather than scope limited to money fields**, for reason `M-2` in published `money` skill give: "which fields are money" not decidable by check that would enforce it. **This be float ban's fifth layer** — after field (`M-2`), wire (`M-12`), column (`M-10`), cached copy (`C-10`) — and here because ban re-enter at every layer.

**Unspecified-enumeration** rule be most common real event-schema defect and fully decidable at schema level: producer add member, consumer's generated enumeration map unrecognised value to its zero member, and refund silently processed as pending. **Dereference ban** decidable in form that matter — consuming handler's module may not depend on outbound client for producer it consume from — and its hazard be not coupling but that consumer read *current* state rather than state at event time, so same message replayed later yield different answer.
*Schema lint plus parse test (unrecognised enumeration value) plus static rule (dereference-dependency ban). Convention, 2026-07-29.*

**Named gap:** personal data not decidable without data-classification regime at type level. Til then be schema lint over annotated field list at best, spec-and-review otherwise.

**And one rule banned outright:** *"log every message received"*. It be what agent add to make consumer debuggable, and it copy payload — personal data included — into log store with own longer retention and own access control. That copy be what survive after destination's retention expire, so it convert bounded exposure into unbounded one in name of observability.

## Tenancy and replay

**E-22 — Two nominal scope types, and distinction carried by type system, not by prose. Message carry data scope as required field of nominal type, and it be only source of scope inside handler: handler modules may not reference request-context accessor or any ambient scope holder, and adapter provide no default scope. Any operation whose authority depend on caller take authorized-actor parameter whose constructor unreachable from handler module, so privileged call not compile there. Every subscription carry two-tenant integration test.**

Corpus favourite be thread-local tenant context populated by web request filter. On consumer thread no request, so return empty — or, on pooled thread, **value left behind by whatever ran there last**, which be silent cross-tenant write with no error at any layer. No test with one tenant see any of it.

**Verdict draft recorded in prose — "trust the scope field for data placement but not as authorization for a privileged action" — be right and unenforceable.** "Privileged action" undecidable, and one value carrying two meanings resolved by surrounding context be exactly ambient meaning these rules remove. Two types make it decidable: data scope be key and column material, and authority be value consumer cannot manufacture. Consumer that must act with authority call one named operation that re-derive it from authoritative store using aggregate identity.
*Type design plus static rule plus integration test — two tenants, same logical message, each effect in own scope. Convention, 2026-07-29.*

Two-tenant test be **outside oracle**: its ground truth be underlying store, not assertion written by model that wrote handler.

**E-23 — Every subscription declare `replay-safe` or `replay-unsafe`. Replay-safe handler's module may not read clock **as data**, random source, or producer-current state through outbound client; event time it need arrive in message. `replay-unsafe` subscription may not attach to retained destination.**

Retained log can be replayed, and replay be tool reached for during incident. Handler that call clock, read rate table, or fetch current state produce **different results than original run**, and replay look like it worked — invisible forever, at worst possible moment. `replay-unsafe`-on-retained-destination clause be cross-field catalog lint and be cheap half.

**Clock ban need its exemption stated or it contradict three other directives:** what be banned be reading clock as value that reach effect or payload. Expiry windows and telemetry timestamps computed inside dedup and telemetry adapters, which handler call without reading time itself.
*Static rule plus characterization replay — process committed message corpus twice; second pass produce no additional observable effect. Convention, 2026-07-29.*

**Named gap:** "the handler is a total function of the message" not decidable. Three bans be decidable proxies for it, and they be proxies.

## Evidence gates

These be outside checks. After implementation, model reviewing model output share implementer's blind spots, so gate whose ground truth come only from assertions same model wrote prove nothing about plausible-but-wrong output. **Same system under delivery permutation be one oracle here implementing model did not write**, which be why central gate be differential.

**E-24 — Integration suite run against real transport in container, in four configurations, arms split by ordering declaration rather than applied uniformly: (1) normal; (2) duplicate-everything — every message delivered twice; (3) reorder-and-fail-once — for `unordered` subscriptions, reorder within key and require identical observable results, and for `ordered-within-key` subscriptions, reorder across keys and require identical results, plus reorder *within* key and require out-of-sequence message be detected and rejected; (4) transport-unavailable — every publish path either persist outbox row and return success or return coded error, and no path silently drop or report success without row.**

**Split not refinement, it be correction of unsatisfiable assertion.** Draft required identical observable results from reorder-within-key arm applied to every subscription. For `ordered-within-key` subscription that either reorder only across keys — never exercising ordering at all, green over ordering bugs — or reorder within key, where correct code **must** produce different result and assertion fail on correct code. Lived outcome of second branch: teams declare everything `unordered` to make CI pass, corpus-dominant wrong pick draft did not name.

**Claim only what it catch.** It can decide: duplicate handling on driven paths, ordering assumptions within key, acknowledgement discipline, dedup-record durability across consumer restart, decoder strictness against malformed corpus, terminal routing after declared attempt count, and — where harness can kill relay between publish and mark-sent — `E-7`'s republish path. It **cannot** decide: broker-side configuration living in production infrastructure, since container run repository's committed configuration; rebalance behaviour at production partition counts and timing; multi-instance consumer-group interleaving unless suite genuinely run two consumer instances, which most not; lease expiry mid-handler unless suite compress timeouts, which change thing under test; and any subscription no test drive.
*Integration test (differential — four configurations of one suite, compared against each other). Check kinds this rule set use have no term for differential execution; nearest, characterization replay, compare against committed output files, while this compare four runs of one suite against each other. Parenthetical carry that difference; no new kind invented for it. Convention, 2026-07-29.*

**E-25 — Every configuration prove it took effect, per subscription; every declared alert prove it fire; and every static rule prove it can fail.** Duplicate arm assert, for each subscription catalog declare `deduplicated`, that effect operation invoked twice with same identity, that exactly one dedup record exist, and that effect count be one; for each declared `effect-free`, that effect counts equal across passes. Reorder arm assert out-of-order delivery observed; fail-once arm assert redelivery observed; unavailable arm assert injected fault observed. Normal arm fail if any subscription **enumerated in committed catalog** processed zero messages. `E-23`'s replay gate assert non-zero first-pass effect count before asserting zero second-pass delta. Each alert `E-16` and `E-9` require have committed fire-test. Each architecture rule ship committed violating fixture that must make build fail.

Separate from `E-24` for one reason: **it be the one that get omitted.** Nothing in differential gate verify its own configurations. Duplicate harness that silently not duplicating make three arms same run, results trivially identical, and gate report green over every failure it exist to catch. **Fifteen of directives above lean on `E-24`.**

**Three tool facts make each clause necessary, not defensive**, all three verified for Java, where named in `async-handoff-java`: fault-injection proxy expose no API confirming fault affected given operation, and its toxicity be **probability**, so registered fault can legitimately not fire on operation under test; architecture-rule library reject empty should-clause by default, but setting that restore silent vacuity be one-line property and per-rule override, both invisible in passing build log; and no-op cache manager be byte-identical to its binding never having been applied. Tools named in stack skill.
*Integration test (positive control) plus production invariant with fire-tests plus negative fixture per static rule. Convention, 2026-07-29.*

## The catalog, the topology, and the plan

**E-26 — Committed subscription-and-destination catalog, generated from adapter's registration sites and diffed in CI. Registration take **one nominal specification value with every field required** — no builder defaults, no optional parameters — so compiler enforce completeness and generator can read all of it. Catalog also published as release artifact.**

It name, per publication and subscription: destination; broker shape; schema subject and its committed compatibility level; partition-key source; ordering declaration and gap handling; delivery-attempt limit and backoff; terminal destination and its retention; processing budget and batch size; effect-free-or-deduplicated declaration and identity strategy; dedup-record retention; replay-safety declaration; maximum payload size; owning team; alert names. **That be ~twenty fields per subscription, and count stated not hidden.**

**Load-bearing machinery, not documentation:** `E-2` generate it and `E-9`, `E-12`, `E-14`, `E-15`, `E-16`, `E-17`, `E-19`, `E-20`, `E-23`, `E-24`, `E-25` read it. New subscription cannot appear without git-visible row at gate human read — which, since human never read handler, be only place new async path become visible at all.

**Single-required-value shape be what keep count survivable, and be difference between generated catalog and half-generated one.** Several fields not exist at registration site unless registration API demand them — terminal-destination retention, dedup retention, processing budget, owning team, both alert names. Without one mandatory specification value, catalog generated in part and hand-maintained in part, **and diff gate cannot tell which half drifted** — false green over artifact eleven directives read.
*Type design plus golden test (regenerate-and-diff). Convention, 2026-07-29.*

**One honest limit:** owning-team field and any prose field cannot be compared against behaviour by any regenerate-and-diff. Those be catalog's documentation half and this rule set say so rather than calling them gate.

**Extra condition, same one `E-19` carry:** published-artifact clause and ownership half of this directive be cross-repository ones, and additionally require second independently deployable consumer. Til one exist they dormant, not deleted; generated catalog itself not, because eleven directives read it inside one repo.

**Gap that matter most in eighteen-team organisation, named not solved:** catalog and `E-19`'s compatibility gate be **repo-local**. Producer removing destination, renaming subject or loosening compatibility level cannot see other seventeen repositories. Publishing catalog as artifact be decidable half; union check — producer's CI reading every published consumer catalog and failing when change remove or narrow destination some consumer reference — need org-level infrastructure that not exist. **Til it do, `E-19` and `E-26` be local hygiene wearing clothes of contract.** Not read diff as contract.

**E-27 — Destination topology be committed declarative input applied at deploy — partition count, retention, compaction policy, delivery limit, dead-letter wiring — and partition-count change be behind review gate.**

Otherwise topology created by someone, somewhere, and everything above be checked against artifact nothing pin. Specific hazard: partition-count change **re-map existing keys**, so ordering for already-published aggregates break silently while every gate stay green, and `E-15`'s key type cannot see it.
*Schema lint over committed topology plus spec-and-review at review gate. Convention, 2026-07-29.*

**E-28 — Plan that introduce first async handoff cite these rules and name, for each new destination: destination, its catalog row, ordering declaration, and every team expected to consume it. It not argue whether broker warranted.**

Not arming mechanism — this skill's **description** be what fire when agent about to hand work off, and it fire without anyone remembering to re-read anything. What `E-28` add be that decision written down at one gate human read. **Obligation deliberately smaller than before**: used to require threshold argument, one undecidable judgement in this rule set, made by gate with no distributed-systems reader. What left be four facts plan author can state and reviewer can check against catalog diff in same pull request. **Consuming-teams field be one that cannot be generated**, and only place `E-26`'s cross-repository gap get human's attention.
*Spec-and-review at plan approval gate. Convention, 2026-07-29.*

## Two shapes banned outright

**These two never dormant.** Ban with precondition be ban agent can argue past, so they carry no condition and live in this skill, not in `async-handoff-shapes` with other conditional shapes.

**Neither be bad engineering. Both unaffordable *here*, and grounds be this organisation's** — no operations role, one engineer per team, and licence clause on self-hosted variant that both dedicated event stores and workflow engines fail. **Ban resting on organisation rather than technology must name its re-open trigger**, and [evidence.md](evidence.md) do. Read both as strongest available *argument*, not as survived one: they came out of pass with no panel, no steelman duel, no hostile audit, and case for each rejected option written by whoever rejected it.

**E-32 — Broker not store of record, and current state not fold over message history. State be row in service's own transactional store and that row be authority. No query path, no read model, no recovery path reconstruct state by reading broker or outbox table. Event-store products be banned dependencies. Committed message corpus may be replayed to rebuild **derived** projection whose authority be producer's state, never to establish fact no table hold.**

Three failures, each made permanent by absent reader, none throw. **Retention delete authority on schedule nobody wrote down:** log-shaped topic's shipped default retention be seven days and compacted topic keep only latest value per key, so design whose state *is* log have data-loss policy set by broker default. `E-8` compound it from other side — relay delete sent outbox row after committed window, so producer-side copy not history either, by this rule set's own rules. **Schema change `E-19` legitimately permit applied to bytes written years earlier**, so fold's output change meaning while no code change and every gate stay green; that be `E-19`'s own named gap compounding with age. And symptom of all be **wrong current value**, not exception.

Licence and operations grounds separate and also sufficient, dated in [evidence.md](evidence.md).

**Stated so ban be actionable not merely prohibitive:** keep state table and publish events for notification and projection. That be design other directives already describe, and why this ban cost repo nothing it had.
*Static rule — banned dependency on event-store clients, `E-4`'s outbox-read confinement extended so no query module read outbox, and no query module depending on messaging adapter — plus spec-and-review. Convention, 2026-07-29.*

**Named gap:** "this projection is being treated as the authority" be semantic. Decidable half be dependency direction — query module that cannot reach adapter cannot fold log.

**E-33 — No stream-processing engine, and no time-window aggregate computed inside handler. Stream-processing frameworks be banned dependencies. Consumer's effect be write to its own store; join be two subscriptions writing into one table then read transactionally. Handler hold no cross-message state — no mutable field, no static collection, no accumulating buffer — and compute no aggregate over time window. Where windowed number required it be query over projection table with window as committed parameter, evaluated at read time.**

**Failure be silently wrong number, worst shape there be, and engine's own semantics produce it by design.** Kafka Streams' windowing documentation state records arriving more than grace period after window end be considered late and **will be dropped**, and drop surface only in task-level counter that consolidated three older ones. So windowed aggregate under-count, nothing raise, and only trace be counter nobody here watch, because no operations role. Vendor deprecated its own 24-hour default grace period precisely because default was making that trade on user's behalf; repo would inherit whichever default its version ship.

**In-handler state be same failure without framework**, and be what agent write once dependency banned: value depend on which messages *that instance* happened to see, so differ per consumer and reset on every restart and rebalance. `E-24` record most suites never run two consumer instances, so test that would catch it be test nobody write.

**And engine be second always-on stateful system** — state stores, changelog topics, standby replicas, restore time on rebalance — with no owner here.
*Static rule (banned dependency; no mutable state field or static collection in handler or flow module; no clock-derived window bound in handler code) plus integration test (two-instance arm: same aggregate query return same answer however messages split between instances) plus schema lint (window be committed parameter). Convention, 2026-07-29.*

**Named gap:** aggregate accumulated in database against wrong window not caught by any of these. Making window committed parameter be what put it in diff human read.

## Interlocks these rules must not break

- **Post-commit hook be shared resource, genuine collision with published `caching` skill.** `C-9` require cache invalidation reachable only from transaction seam's post-commit callback. If repo satisfy that with general-purpose post-commit callback registration, **`E-5` defeated entirely** — nothing at call site distinguish "delete a cache key after commit" from "publish after commit". Repo installing both must make post-commit registration **named member of cache adapter's own port**, no free-callback form, and ban every other post-commit registration.
- **Not reuse phrase "derived-store premise" for message.** That be `caching` skill's term for value recomputable from authoritative store, and asymmetry above be precisely that message in flight not one. Message's premise be **producer-side row** be durable record til broker acknowledge; call it that.
- **`E-13` not weaken `M-20`.** Published `money` skill require money effect emit catalog event for reconstruction; `E-13` ban correctness-bearing *use* of broker and say nothing about forensic emission. **Never write directive of form "an asynchronously delivered fact carries no audit obligation".** Note also `M-20`'s catalog event be **telemetry** — metric-and-log entry, not broker message.
- **`E-5` and `E-6` must not be implemented as separable APIs.** One outbox-append operation take transaction handle. Second append overload without it would give `E-5` compliant host and destroy `E-6`.
- **`E-11`'s terminal classification must not be marker interface on broad exception type.** If any exception can be re-tagged terminal at catch site outside handler, `E-16`'s attempt budget stop being bound.
- **`E-32` not contradict `E-23`.** Replay rebuild *derived* projection whose authority be producer's state table; what `E-32` ban be replay as way fact be *established*. **Never write directive of form "the log is the history, so a table is a cache of it"** — that be inversion, and most natural sentence agent will produce here.
- **`E-33`'s ban on in-handler window state not ban scheduled query over projection table.** Relay be only component `E-1` and `E-4` permit to be scheduled at all, so scheduled read-model refresh be adapter-module concern with committed schedule, never scheduling annotation in service class.
- **Fold over stored rows permitted, fold over message history banned, and published `money-storage` skill say so from its side.** `M-38` recommend deriving balance from durable ordered rows inside one transaction domain, which be query; `E-32` ban state rebuilt from **message** stream, where ordering, retention and redelivery be transport's to define. Same word, different mechanism, opposite verdict.

## Markers, dates, and what they mean

**Every one of thirty directives above be convention, dated 2026-07-29, and that be ceiling on whole set, not per-rule accident.** None survived three independent refutation votes against primary sources, because each be **design argument, not execution result**. There be **no production use of this rule set anywhere.**

**Two passes, both fell short of protocol they written under — protocol published in this skill set as `tech-decision-research`, so what they fell short of can be read, not taken on trust.** First wrote `E-1` … `E-28`: ran design steelman, two tool-evidence passes against primary sources, candidate comparison, and hostile audit carrying planted defect of its own class — **canary caught, so that audit's findings count** — but three refutation votes never ran, because session's agent budget exhausted mid-pass. Second wrote composite shapes, including two bans here: **one researcher, no panel, no steelman duel, no hostile audit**, weaker in shape than first even where its facts firmer. **Two of its outputs be bans that remove option from every future repo, and ban be exactly kind of verdict adversarial panel exist to attack.**

- **confirmed** — survived three independent refutation votes against independent sources, on stated date. **No directive here carry it.**
- **primary-source verified** — one researcher checked against primary source, no panel. No directive here carry it either; several *facts* quoted above do, dated in [evidence.md](evidence.md).
- **convention** — defensible practice research did not or could not confirm from independent sources. All thirty.

**Not promote marker here without new research pass.** Strongest material behind these rules be **primary-source verified and still not confirmed** — shipped configuration defaults quoted in `E-10`, `E-12`, `E-16`, `E-17`, `E-19`, and three tool facts behind `E-25`. One researcher read each against primary source and no panel refuted any; running votes be what would promote them. They be per-transport or per-stack and live in [evidence.md](evidence.md) and in stack skill.

**Lapse rule.** These rules last dated for review by **2027-01-29**. Past that date every **confirmed** marker read as **convention** til new pass re-date it. Need no maintainer action: read lapsed claim as written. In directives it change nothing, because nothing confirmed.

Passes, sources, full steelman for each rejected shape, wordings that must not be reintroduced, nine-candidate transport survey, and conditions that reopen decision be in [evidence.md](evidence.md).