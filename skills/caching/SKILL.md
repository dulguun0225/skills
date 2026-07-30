---
name: caching
description: Cache discipline for any repo that serves a value from memory or a cache server instead of recomputing it from the durable store, in any language — one adapter seam, no caching annotation or decorator, read-through only, nothing correctness-bearing in the cache, keys that carry the caller's scope, a committed staleness ceiling, delete-only invalidation after commit, exact serialization round-trips, no substituted value on a cache error, and the three-configuration differential gate. Load before adding a cache, a memo, a loading cache, a caching annotation or an expiry, before deciding whether a repo needs a cache at all, and before caching a value another rule set governs. States the kind of check each rule needs; the tool is named in the matching stack skill (caching-java).
---

# Cache discipline

Sixteen directives, `C-1` … `C-16`. Each states the **kind** of check it needs.
No tool is named here, because almost none of these checks is portable across
languages — nearly every rule needs a different tool per stack, and a cache rule
with no named check is a wish. The tool is named in the stack skill.

**Read the marker ceiling before you read the rules.** All sixteen are
**convention**, dated 2026-07-29, and **there is no production use of this rule
set anywhere** — each is a design argument rather than an execution result, so
nothing here is confirmed and **no marker may be promoted without a new research
pass.** What the 2026-07-29 pass did confirm is the *tool* evidence, and that
lives in the stack skill. Read this as a defensible, cheap, enforceable design
that fails toward safety, not as a verified finding. The full statement is in
*Markers, dates, and what they mean* below.

## The premise these rules are conditioned on

**Code is written by LLM agents and no human reads it line by line, and the repo
caches a value it could recompute from a durable store.**

Both halves do work. A cache turns a correct answer into a plausible one: the
wrong answer is well-formed, it validates, it violates no constraint, and it
decays away before anyone reproduces it. With nobody reading the code, there is
no second reader to notice that a number is three days old. A verdict is
portable exactly as far as its premise — in a repo where a human reads every
cache change line by line, several rules below drop from mandatory to merely
advisable. Where that is the case, say so and carry the burden of saying it; do
not silently drop the rule.

**The second half covers an in-process cache, not just a cache server.** A hash
map memoized inside a service method, a loading-cache library, or a framework's
simple in-memory cache manager is a cache under these rules. That is deliberate
and it is the case that matters most: the in-process shape is the one most repos
here should take, it imports no cache *client*, and a discipline scoped to a
cache server would leave it outside every check below. This was a real defect
found in a hostile audit of these rules, not a hypothetical.

The rules bind from **the first cached value**. Before that they are dormant, not
absent.

## Start by not caching

**Most repos should run no shared cache at all, and this belongs before any rule
rather than after them.**

The org fact this rests on, stated because it is the ground and not an aside:
eighteen three-person teams, one engineer each, and **no platform or operations
role**. A shared cache is a stateful service somebody patches, sizes, monitors
and fails over, and there is no somebody.

So the ranking, for a repo with no measured latency problem:

1. **No cache.** The cheapest correct answer. Nothing to patch, and a value that
   cannot be stale.
2. **An in-process cache with a short expiry.** Second cheapest. No new service.
   Its limit is per-instance scope, which is `C-9`'s stated condition.
3. **A shared cache server.** Only when a number says so.

Add a cache when a measurement says so, not when the design looks like it wants
one. **Which engine to run, where one is needed, is not a directive here** — it
is a per-stack pick with deployment-shaped and ecosystem-shaped gates, and it is
stated in the stack skill. A nine-candidate survey of the engine landscape, with
licences, release cadence and the ground each candidate lost on, is in
[evidence.md](evidence.md); it is evidence for that pick, not a rule here.

## What is here and what is elsewhere

- **This skill** — the seam, what a cache may hold, keys, expiry, invalidation,
  serialization, failure behaviour, and the evidence gates. Platform-neutral:
  every rule states a check kind and names no tool.
- **`caching-java`** — the same rules with Java, Spring Boot, ArchUnit, Error
  Prone, Jackson, Testcontainers and Toxiproxy named, the engine pick, and the
  one-time gate wiring. Install it in a repo on that stack; without it every
  rule here has a check kind and no tool.
- **`money` and `money-api`** — published, and `C-5` interlocks with both.
  `M-17`, which lives in `money-api`, requires an idempotency record written in
  the same transaction as the money effect; **a cache cannot host that record**,
  and `C-5` is the only place that ban is stated. Neither money skill states it:
  `M-17`'s same-transaction requirement excludes a cache by implication, and
  `C-5` is what makes it structural. `C-5` also does not weaken `M-20`, which
  lives in `money`: see *Interlocks these rules must not break*.
- **`money-storage`** — published. A cached amount is the one money shape its
  composite-shape table hands to this skill: a copy of a money value that no
  column constraint, no `CHECK` and no schema lint reaches. `C-10` is where the
  float ban re-enters at a fourth layer, after the field, the column and the
  wire.
- **`async-handoff`** — published, and `C-9` collides with it at one point. `C-9`
  needs a post-commit registration point, and that is exactly the seam `E-5`
  confines when it bans a publish outside the outbox relay. **A repo that
  satisfies `C-9` carelessly defeats `E-5` entirely.** The interlock is stated
  below; install `async-handoff` in any repo that hands work off asynchronously.

## The defaults these rules override, by name

An agent told "add caching" writes one specific thing. Naming it is the point;
"cache carefully" overrides no instinct.

- **Annotation-driven declarative caching** — the one-line decorator, attribute
  or annotation every framework ships and every tutorial shows. **This is the
  training-corpus favourite by a wide margin and the single most likely thing an
  agent writes.** Banned by `C-2`. It is genuinely attractive: one line, no
  change to business logic, framework-handled keys and expiry, trivially
  removable. It loses on four separate grounds — the effect fires from no
  written call, so the caller's text is identical whether the value is fresh or
  three days old; key generation is implicit, which makes `C-6`'s dropped-scope
  failure the default rather than a mistake; the framework's error handler
  substitutes a value by design, which is `C-12`'s banned shape shipped as a
  feature; and with no reader, *which methods are cached* becomes a fact only
  the annotations know and nothing enumerates, defeating `C-15`.
- **A caching decorator behind an existing domain interface** — the tasteful
  refactor an agent reaches for when the annotation is banned. Rejected by
  `C-2`'s second half. It is the same ambient modifier in a different costume:
  the caller's written call is unchanged and its answer now turns on cache
  state. It **passes the seam check**, because a decorator legitimately lives in
  an infrastructure module and legitimately imports the adapter, which is why
  `C-2` is a separate rule from `C-1` rather than a clause of it.
- **Write-through and write-behind** — keep the cache coherent with no
  invalidation to forget. Rejected by `C-4`: both make the cache a second write
  target, so *which store is authoritative* stops having a structural answer,
  and write-behind is a hidden dirty-state flush. Both are unwritable under
  `C-4` at no extra cost.
- **The cache as a lock manager** — set-if-absent locking, the canonical recipe
  in every engine's documentation. Rejected by `C-5`. **"Our engine cannot do
  it" is not available as a defence**, and the engine is named because the
  ground is its own documented protocol rather than any check: **memcached** —
  no persistence, no scripting, no transactions — still defines `add`, `cas`,
  `incr` and `decr`, and add-based locking is its canonical lock.
- **Expiry-only invalidation, with no delete** — rejected as a design by `C-9`,
  because it makes every write's effect invisible for the whole expiry window,
  which is a wrong-but-plausible answer by construction. **Kept as the stated
  fallback** for an in-process cache on more than one instance, where a delete
  genuinely cannot cross instances.
- **Picking a restricted engine as the discipline** — one decision instead of
  sixteen. Rejected: the restriction claimed is usually false, the pick's right
  answer varies *within* a stack, and the seam is the enforcement on any engine.

The full steelman for each, and the wordings that must not be reintroduced, are
in [evidence.md](evidence.md).

## What to do when this skill fires

1. **First ask whether to cache at all.** *Start by not caching* above is step
   one, not a preamble.
2. **Name the adapter module.** Every rule below is a check on one named
   module's API surface. Until it exists there is nothing for the rules to bind.
3. **Add the entry to the committed catalog** (`C-15`) in the same change. The
   catalog is machinery four other rules read, not documentation.
4. **State the repo's staleness ceiling** as a machine-readable value in a
   committed artifact (`C-7`). A ceiling written in prose is a ceiling no check
   can read.
5. **Record in the plan or spec that these rules bind this feature** (`C-16`).
6. **Wire the gates.** This skill states check kinds; a kind with no tool is a
   wish. On Java, `caching-java` names the tools and has the wiring section.

## The seam

**C-1 — Every cache read and write goes through one named adapter module. No
cache client library, no in-process cache library, and no hand-rolled
memoization construct is reachable outside it.** Every other directive here is a
check on that adapter's API surface, so a second way in is not one bypass — it
is the whole set reporting green while the banned shapes pass. That is the false
assurance these rules exist to prevent, and it is worse than no rule. **The
in-process half is not optional**: a memo inside a service method, a loading
cache, or a framework's in-memory cache manager imports no cache client and
would sit outside all sixteen checks, and that is the shape an agent writes
first. **The client ban list must be complete for the engine the repo actually
runs** — a ban list naming one vendor's clients on a repo running a fork is a
gate with a hole, because the fork's clients are separately named packages. The
engine is named in the stack skill; the completeness obligation is here because
it is the seam's, not the engine pick's.
*Static rule (architecture or dependency check), plus a field-type rule for the
hand-rolled case. Convention, 2026-07-29.*

**C-2 — No ambient cache dispatch. No caching annotation, attribute, decorator
or aspect; and no class implementing a domain interface may depend on the cache
adapter.** An annotation fires an effect from no written call. A decorator wired
behind a domain interface leaves the caller's text unchanged while its answer
turns on cache state. Both are the same defect: behaviour that is not in the
program text, in a repo where the program text is the only record anyone reads.
The second half is a separate rule from `C-1` because **the seam does not catch
it** — a decorator legitimately lives in an infrastructure module and
legitimately imports the adapter, so the seam check passes over exactly this
case.

**State the decidable predicate, not the intent.** Write the rule as *implements
a domain interface and depends on the cache adapter*. "Caching" is not a
property a static rule can read, and a rule worded around it has no operand to
match.

**And state why an explicit read-through call is not the banned modifier**, in
the repo's own text: the call is written and named at the call site, so the
value's provenance is fixed there. Shipping the permissive half without that
sentence leaves the next agent to guess where the line is.
*Static rule. Convention, 2026-07-29.*

**C-3 — The loader is a nominal port type, not a lambda or a single-method
functional interface, and its implementations live only in the module that may
depend on the durable-store client.** This is the most important authoring
instruction in the set, and it exists because the obvious form is undecidable.
Type the loader as a single-abstract-method interface and any lambda body
becomes a legal loader — including one closing over process-local state the
write path populated — and static analysis that reads compiled output cannot
follow it. Declare the port with two abstract members, or as an abstract class,
and the lambda becomes a **compile error**, so every loader is a named
importable type. Confining that type's implementations, and confining the
durable-store client's dependents, are *type dependencies* — the question
architecture tools decide soundly.

Do not write a rule of the form "the loader must read the authoritative store".
It is unsound by construction wherever loaders can be lambdas, and it reports
green over the case it exists to stop.

**Cost accepted, and it is real:** every loader is a class rather than a lambda.
That is the price of the rule being decidable.
*Type design plus a static rule. Convention, 2026-07-29.*

## What a cache may hold

**C-4 — The adapter exposes no bare write. The only way a value enters the cache
is as the return value of a loader on a read-through call.** This makes
write-through and write-behind unwritable, so neither needs a directive of its
own.

**Do not restore the wording "the cache is never the source of truth".** It is
true and undecidable — no check can decide which store is authoritative, so a
gate written against it reports green over exactly the case the rule exists to
stop. What remains decidable is a property of the **write path**, and that is
what is stated here. The undecidable residue is carried structurally by `C-3`'s
confinement and otherwise by spec-and-review. Say that split plainly rather than
claiming the check decides which store is authoritative.
*Type design. Convention, 2026-07-29.*

**C-5 — Nothing correctness-bearing goes in the cache: no mutual exclusion, no
counter a limit or a balance depends on, no queue, no idempotency record, no
state whose loss changes an answer.** An eviction, a failover or a restart drops
the entry with no error, so a lock silently stops excluding and a limit silently
stops limiting.

Enforced **by shape**: the adapter exposes no atomic primitive at all — no
set-if-absent, no increment, no list or stream operation — and `C-1` makes the
raw primitive unreachable.

**The enforcement is the seam, not the engine.** Do not write this as "the engine
cannot do it". The engine is named here because its documented protocol is this
clause's **ground** rather than its enforcement: **memcached** — no persistence,
no scripting, no transactions — nonetheless defines `add`, `cas`, `incr` and
`decr`, and add-based locking is its canonical lock. The seam is therefore what
holds even on the most restricted engine a repo here would pick, and a repo
running memcached can tell that this clause is about it.

**Money interlock, and those rule sets are published.** `M-17`, in the
`money-api` skill, requires an idempotency record written in the same transaction
as the money effect, and `M-40` in `money-storage` requires the same of
everything that makes a money effect reconstructable. **That record cannot live
here**, and the ban is stated on this side only: a cache write is in no
transaction, so `M-17` already excludes it by implication, and `C-5` is what
makes it structural. Do not read either money skill as carrying this ban — see
[evidence.md](evidence.md).
*Type design plus a static rule. Convention, 2026-07-29.*

## Keys and tenancy

**C-6 — The cache key is the loader's full argument tuple, and the caller's
authorization scope is one of those arguments. Hand-built key strings are
banned; the scope value is obtainable only from the request-context accessor.** A
key assembled independently of the loader's arguments can omit one, and a key
missing the tenant returns a well-formed answer belonging to someone else — no
exception, no constraint violation, nothing to notice. A key that *is* the tuple
makes that omission a compile error.

**Word the ban as unwritability, not impossibility.** State it as *the key
factory accepts no free-text parameter*, and give the scope type no public
constructor so the request context is its only source. Both make the wrong call
uncompilable, which holds regardless of what any particular tool can inspect. Do
**not** word it as "no string concatenation" and do not rest it on a claim that
concatenation is unmatchable by static analysis — that ground is challenged and
unverified ([evidence.md](evidence.md)), and the rule does not need it.

**Two honest limits, and both are stated rather than papered over.** Type design
decides that a scope-typed parameter is *present*, never that the value passed
is the current caller's — closing that needs the constructor confinement above,
which is decidable. And the type system decides nothing about whether two
distinct tuples render distinct keys. So two backstops, in order: a property
test that equal keys imply equal uncached results, and — because that test
varies only what its generator varies — a **two-tenant integration test per
cached read path**, seeding different data for two tenants, warming as one and
reading as the other. The second is the outside oracle: its ground truth is the
underlying store, not an assertion written by the model that wrote the key.
*Type design plus a property test plus an integration test. Convention,
2026-07-29.*

## Expiry

**C-7 — Every entry's expiry comes from the committed cache catalog, and every
catalog expiry is at or below the repo's committed staleness ceiling. Expiry
values are constructible only at catalog registration, never at a call site.**

**Do not restore the wording "no entry without a TTL".** It is enforceable and
nearly worthless alone: a thirty-day expiry satisfies it, which is the case the
rule exists to stop.

**The ceiling is the enforceable half, and it must be a machine-readable value
in a committed artifact.** A lint cannot read prose, and with no committed
operand it passes over every catalog value and reproduces the defect. The
ceiling's value is the repo's own call, stated in the repo's own text. The
registration-only constraint is what stops an inline expiry the lint never sees.

**State the expiry's actual job honestly:** it is not the invalidation
mechanism. It is the **bound on a missing invalidation**, which is the bug that
gets written when one of four write paths is forgotten.

**Named gap, and it is a gap in every stack.** Server-side eviction under a
memory policy can drop an entry *before* its expiry, and no code-level check in
any language reads engine configuration. "Has an expiry" is not "lives until its
expiry".
*Type design plus a schema lint over the committed catalog. Convention,
2026-07-29.*

**C-8 — Caching an absent result is opt-in per catalog entry, and that entry
carries its own shorter expiry.** A read-through adapter caches whatever the
loader returns, including "not found", unless it is built not to — and then the
row exists in the store while the API says it does not, intermittently and
unreproducibly. The loader's return type distinguishes a value from an absence,
and the adapter drops an absence by default.
*Type design plus an integration test: read a missing key, create it, read
again, assert found. Convention, 2026-07-29.*

## Coherence and invalidation

**C-9 — Invalidate by delete only, and only from the transaction seam's
post-commit registration. Never populate the cache from a write path.** This
sharpens `C-4` rather than adding a rule.

Populating on write races a concurrent read that already loaded the old value
and is about to store it, and it makes the cache a second write target. Deleting
*before* commit lets a concurrent read repopulate pre-commit state, which then
lives until the expiry. Delete-after-commit degrades to a miss, which is always
correct.

**The ordering is made decidable by confinement, not by a test.** The adapter's
invalidate operation is reachable only from the one transaction seam's
post-commit callback. A test cannot decide it: "a rolled-back write leaves
nothing cached" and "a committed write leaves nothing stale" are **both
satisfied by a delete-before-commit implementation** in a sequential test, so a
repo that names only that test has a gate with a blind spot exactly where it
matters.

**Two residual exposures, accepted and stated.** The crash window between commit
and delete is bounded by the expiry ceiling and by nothing else. And **on an
in-process cache a delete does not cross instances**, so above one instance the
ceiling is the entire coherence guarantee — which is the one place
expiry-only invalidation is the honest answer rather than the rejected one.
*Type design plus a static rule (confinement) plus an integration test (a
rolled-back write leaves nothing cached). Convention, 2026-07-29.*

## Serialization

**C-10 — Cached values are immutable and round-trip through the cache's
serializer exactly. The check reads the concrete type at its catalog
registration site.** An in-process cache handing one instance to two callers
turns one caller's mutation into the other's wrong answer, with no error. A
lossy round-trip does the same across a remote cache: a decimal that loses
scale, an instant that loses its zone, an amount that becomes a binary float —
**the money float ban re-entering at a fourth layer**, after the field, the
column and the wire.

**Do not write the check against the adapter's value type parameter.** In an
erasing type system a tool that reads compiled output sees only the erased top
type there and decides nothing. That false green has been shipped once already,
by a rule banning unloggable domain types on an erasing stack. **The
`llm-default-traps` skill carries that case's tool ban and the erasure ground
behind it; the domain-type rule the ban enforces belongs to a platform rule set
not published in this skill set**, so the trap is recorded here and in the stack
skill rather than left to a pointer. The concrete type is known at the **registration
site**, and a source-level checker sees static types; that is where the check
goes.
*Static rule at the registration site plus a property test (serialize, then
deserialize, equals the original) per cached type. Convention, 2026-07-29.*

**C-11 — A build-computed hash of each cached value's shape is part of its key
namespace; the hash is committed and any undiffed change fails the build.
Deserialization is strict: an unknown or missing field is an error, never a
default.** After a deploy the cache holds bytes written by the previous shape,
and the silent case is a field added since — defaulting to zero, false or empty
on read, wrong but plausible, only on hits, decaying away before anyone
reproduces it.

Strict deserialization turns that into a loud failure; the shape hash turns it
into a **cold cache**, which is the better failure. So the hash is primary and
strict parsing is the backstop for the case where the shape is unchanged but its
meaning is not. The regenerate-and-diff is what makes a shape change visible at
the one gate a human reads.

**The rejected alternative is a hand-bumped version integer.** Forgetting to
bump it is exactly the failure this prevents, so it is a checklist item for a
reader who does not exist.
*Golden test (regenerate-and-diff) plus a parse test. Convention, 2026-07-29.*

## Failure behaviour

**C-12 — On a cache error, answer from the authoritative store or fail with a
coded error. Never a stale entry, a default, an empty collection, or a partly
populated result.** Falling back to the store is correct and stays legal; what
is banned is **substituting a value**. The defensive catch returning an empty
list reads as robustness and returns the wrong answer with a success status.

**Do not restore the wording "a cache failure fails loud".** As worded it is
actively wrong twice over: it bans falling back to the authoritative store,
which is the correct behaviour, while permitting the real hazard — substituting
a value — as long as something is logged.
*Integration test under a fault-injected configuration. A partial compiler or
linter check on the empty-catch case only, where one exists; the general case is
spec-and-review, because a handler that logs and returns a default is not an
empty handler. Convention, 2026-07-29.*

## Evidence gates

These are the outside checks. After implementation, a model reviewing model
output shares the implementer's blind spots, so a gate whose ground truth comes
only from assertions the same model wrote proves nothing about
plausible-but-wrong output. **The uncached system is the one oracle here that
the implementing model did not write**, which is why the central gate is
differential.

**C-13 — The integration suite runs in three cache configurations — normal,
always-miss, and every-operation-errors. The normal and always-miss runs must
produce identical observable results; under fault injection every answer either
matches the cache-off answer or is a coded error; and the normal run fails if
any catalogued cache records zero hits.** The zero-hit assertion is not
optional: a suite that never warms a cache passes all three runs trivially.

**Claim only what it catches.** It catches a value that exists only in the cache
on driven paths, an unintended cached absence, a lossy round-trip, and a
substituted value on error. It does **not** catch a key that drops the tenant —
a single-tenant suite returns the same answer in both runs, which is why `C-6`
carries its own two-tenant test. It does **not** catch a stale read after a
write unless the suite writes and re-reads one key inside its expiry, and
nothing here asserts that any suite does. It is coverage-shaped: it proves
recomputability for the paths the suite drives and no others. Never describe it
as catching most of this rule set.
*Integration test (differential — three configurations of one suite, compared
against each other). The check kinds this rule set uses have no term for
differential execution; the nearest, a characterization replay, compares against
committed output files, while this compares against the same system with the
cache removed. The parenthetical carries that difference; no new kind is
invented for it. Convention, 2026-07-29.*

**C-14 — Each of the three configurations proves it took effect. The always-miss
run asserts zero hits on every catalogued cache and fails if any hit is
recorded; the normal run asserts at least one; the fault run asserts the
injected fault was observed at least once.** This is a separate rule rather than
a clause of `C-13`, for one reason: **it is the one that gets omitted.**

Nothing in a differential gate verifies its own configurations. A test-scoped
binding that does not win, a profile never activated, a fault never applied —
and all three runs are the normal run, results are trivially identical, and the
gate reports green over every failure it exists to catch. Six of the sixteen
directives lean on `C-13`; `C-14` is what makes that lean safe.
*Integration test (positive control). Convention for the rule; two tool facts
behind it are confirmed and are named in the stack skill, because both are facts
about specific tools. Convention, 2026-07-29.*

**C-15 — A committed cache catalog names every cache, its key shape, its expiry,
its negative-caching decision and what invalidates it, generated from the
adapter's registrations and diffed in CI.** The catalog is the inventory a
reader would have carried in their head, and it is **load-bearing machinery
rather than documentation**: `C-7`'s ceiling lint reads it, `C-8`'s opt-in reads
it, `C-10`'s registration-site check reads it, and `C-13` and `C-14` enumerate
it. Without it an agent adds a fifth cache inside a helper method and the first
symptom is an inexplicable stale answer months later with no list of suspects. A
new cache cannot appear without a git-visible line at the gate a human reads.

**One honest limit:** "what invalidates it" is free prose that no
regenerate-and-diff can compare against behaviour. That field is the catalog's
documentation half, and calling it a gate would be a lie.
*Golden test (regenerate-and-diff). Convention, 2026-07-29.*

**C-16 — The plan or spec that introduces the first cache records that these
rules bind it.** Not the arming mechanism — this skill's **description** is what
fires when an agent is about to cache something, and it fires without anyone
remembering to re-read anything. What `C-16` adds is that the decision is
written down at the one gate a human reads, so the choice to adopt or diverge is
visible there rather than only in the code.
*Spec-and-review at the plan approval gate. Convention, 2026-07-29.*

## Interlocks these rules must not break

- **`C-5` does not weaken the money observability rules.** `C-5` bans
  correctness-bearing *use* of the cache and says nothing about forensic
  emission. The `money` skill keeps telemetry disposable for correctness and
  load-bearing for reconstruction (`M-20`), and that split must survive. **Never
  write a directive of the form "a rebuildable store carries no forensic or
  audit obligation."**
- **`C-4` and `C-7` must not be instantiated as incompatible APIs.** One
  read-through call carries the expiry. A separate bare write taking an expiry
  would give `C-7` a host and destroy `C-4`.
- **`C-9`'s post-commit callback must not become a general-purpose hook, and
  this one has teeth.** A repo that satisfies `C-9` with a general
  `afterCommit(Runnable)` registration **defeats `E-5` in the published
  `async-handoff` skill entirely**: nothing at a call site distinguishes "delete a
  cache key after commit" from "publish after commit", so the one hook `C-9` needs
  becomes the hole that skill's publish-confinement rule falls through. Make
  post-commit registration a **named member of this adapter's port** —
  `invalidateAfterCommit(key)` — with no free-callback form, and ban any other
  post-commit registration in the repo. Both skills state this from their own
  side.
- **A delete-after-commit is correct here and is the wrong shape for a broker
  publish. Do not carry either verdict over to the other.** A lost cache delete
  leaves a stale read bounded by the staleness ceiling, and it self-heals. A
  lost publish is an unbounded permanent absence with no self-healing path and
  nothing anywhere that can compare against a message which was never produced.
  Same shape, opposite verdict, and the reason is the bound. `E-5` in
  `async-handoff` carries the same contrast from the other direction, and its
  `E-20` inverts `C-11` for the same class of reason — a cache's writer and reader
  are one deployable and a message's are not.
- **This skill says "derived-store premise"** for a store that can be rebuilt
  from the authoritative store. It deliberately avoids the phrase
  "rebuildable-cache premise": that phrase is already taken, for **telemetry's
  disposability**, by a platform rule set **not published in this skill set**, so
  the collision is one no consumer here can see and it is recorded so nobody
  reintroduces it — see [evidence.md](evidence.md).

## Markers, dates, and what they mean

**Every one of the sixteen directives above is convention, dated 2026-07-29, and
that is a ceiling on the whole set rather than a per-rule accident.** None
survived three independent refutation votes against primary sources, because
each is a **design argument rather than an execution result** — and the research
protocol these rules were written under downgrades those automatically. There is
**no production use of this rule set anywhere.** Read it as a defensible, cheap,
enforceable design that fails toward safety, not as a verified finding.

- **confirmed** — survived three independent refutation votes against
  independent sources, on the stated date. **No directive here carries it.**
- **primary-source verified** — one researcher checked it against a primary
  source, with no panel. No directive here carries it either.
- **convention** — defensible practice the research did not or could not confirm
  from independent sources. All sixteen.

**Do not promote a marker here without a new research pass.** The confirmed
material from the 2026-07-29 pass is the *tool* evidence, not the rules: two
tool facts behind `C-14`, three tool limits that each forced a rule to be
worded differently, and the engine licence and release facts. All of those are
per-stack or per-engine and live in the stack skill and in
[evidence.md](evidence.md).

**The lapse rule.** These rules were last dated for a review by **2027-01-29**.
Past that date every **confirmed** marker reads as **convention** until a new
pass re-dates it. This needs no maintainer action: read a lapsed claim as
written. Here it changes nothing, because nothing is confirmed.

The passes, the sources, the full steelman for each rejected shape, the wordings
that must not be reintroduced, the engine survey, and the conditions that reopen
a decision are in [evidence.md](evidence.md).
