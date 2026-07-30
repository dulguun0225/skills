---
name: async-handoff-shapes
description: The six rules for shapes assembled out of asynchronous handoffs rather than out of one publish and one subscription, in any language — a committed flow definition with at most one irreversible step and it is last, a compensating destination per reversible step that tolerates the forward effect never having happened, a bounded timeout on every waiting step carried on its own timer destination, an outbound webhook as a signed consumer with an allowlisted host and no redirects, an inbound webhook that writes to the outbox and does no work in the request, and a claim check whose object outlives the message. Load before writing a saga, a process manager, an orchestration across services, a compensation or undo path, a business timer or timeout, an outbound or inbound webhook, or a payload too large for the transport. Install alongside async-handoff, whose thirty directives every rule here builds on; states the kind of check each rule needs, with the tool named in the matching stack skill (async-handoff-java).
---

# Asynchronous handoff: the composite shapes

**Install this skill with `async-handoff`.** Every rule here is written on top of
that skill's thirty directives and cites them by id — `E-1` … `E-28`, `E-32`,
`E-33` — and **none of those ids is defined here**. Six directives are defined
here: `E-29`, `E-30`, `E-31`, `E-34`, `E-35` and `E-36`.

**Each of the three groups is dormant until its own condition holds.** That is
why they are a separate skill rather than more sections in the core one:

| Group | Directives | Dormant until |
| ----- | ---------- | ------------- |
| A flow that commits in more than one transaction | `E-29`, `E-30`, `E-31` | the repo has a flow whose steps commit in more than one transaction |
| HTTP across the organisation's boundary | `E-34`, `E-35` | the repo sends or receives a webhook |
| A payload the transport will not carry | `E-36` | a payload cannot meet its subject's committed maximum size |

**The two bans are not here.** `E-32` (the broker is not a store of record) and
`E-33` (no stream-processing engine, no in-handler window aggregate) came out of
the same research pass as these six, and they live in `async-handoff` because
**a ban with a precondition is a ban an agent can argue its way past**. They are
never dormant.

**Read the marker ceiling before you read the rules, and it is lower here than in
the core skill.** All six are **convention**, dated 2026-07-29, with **no
production use anywhere** — and the pass that produced them was **one researcher
against primary sources, with no panel, no steelman duel and no hostile audit.**
The core skill's pass at least had an audit whose planted defect was caught. This
one did not, which makes these six weaker *in shape* than the thirty they build
on, even where the individual facts they quote are firmer. **No marker here may be
promoted without a new research pass.** See *Markers, dates, and what they mean*.

## Why this skill exists at all

**A rule set that names its gaps still has to distinguish two kinds of gap, and
an earlier version of these rules did not.**

A **named gap** inside a directive is a property no check can decide — semantic
duplication, a swallowing catch, the cross-repository union check. Naming it is
the whole requirement, because silence there would read as coverage. Every named
gap in `async-handoff` is still open by design.

An **absence** is different: a shape a repo will build, that no directive
mentions at all, so nothing reads as anything. There were five, all of them
composite — patterns assembled *out of* publishes and subscriptions, which is why
a rule set written per publish and per subscription missed them:

1. **A flow whose steps commit in more than one transaction** — a saga or process
   manager. It was *expressible* under the original directives (a consumer that
   publishes writes an outbox row in its own transaction, and that is all a
   process manager is), so nothing forbade it, and nothing governed compensation
   or the wait. Now `E-29`, `E-30`, `E-31`.
2. **State reconstructed from the message history** — event sourcing. Now banned
   by `E-32`, in `async-handoff`.
3. **An aggregate computed across messages** — a stream processor, a join, a time
   window. Now banned by `E-33`, in `async-handoff`.
4. **HTTP across the organisation's boundary** — a webhook, in both directions.
   An outbound webhook was named as an asynchronous handoff from the start, so
   the general rules always bound it; what was missing was every rule *specific*
   to it. Now `E-34` and `E-35`.
5. **A payload too large for the transport** — a claim check. `E-21` required a
   committed maximum payload size and said nothing about what to do when a payload
   cannot meet it, which is a rule that fails closed on the page and opens
   silently in a repo. Now `E-36`.

**What that pass did not do, stated because it is the same honesty the rest of
this rule set carries:** it closed **no** named gap inside `E-1` … `E-28`. Those
are undecidable by any check a repository can host, which is why they are named
rather than solved — and that pass added **seven named gaps of its own**: five
belong to the six directives here (`E-29`, `E-31`, `E-34`, `E-35`, `E-36`) and
two to the bans it also produced (`E-32`, `E-33`, in `async-handoff`). The count
of open residues went **up**.

## The premise, and what carries over

**Code is written by LLM agents and no human reads it line by line, and the repo
hands work off asynchronously.** Same premise as `async-handoff`, plus the
per-group condition above.

Everything in the core skill still binds, and two consequences are worth stating
because each is a rule an agent will try to make an exception to:

- **A compensation, a timer, a webhook delivery and a claim-check publish are all
  ordinary messages.** They go through the outbox and the relay (`E-5`), they
  carry a deterministic identity (`E-7`), they are consumed through the
  deduplicated port (`E-13`), they declare a failure policy (`E-16`), and they
  appear as catalog rows (`E-26`). Nothing here is a side channel.
- **A money step inside a flow keeps every money obligation.** `M-17` in the
  published `money-api` skill still requires the idempotency record in the money
  effect's own transaction, and `M-20` in `money` still requires the catalog
  event — which is **telemetry**, a metric-and-log entry, not a broker message.
  So emitting it does not satisfy `E-30`'s compensating destination, and `E-30`
  does not satisfy `M-20`. **An irreversible money capture is the exact case
  `E-29`'s last-step rule exists for.**

## The defaults these rules override, by name

Each is what an agent produces when asked for one of these shapes. Naming it is
the point.

- **The orchestrator with a try/catch around the steps.** *Steelman:* it reads
  exactly like the requirement, the happy path is obvious, and the catch is where
  a reviewer's eye goes — it looks like the most careful version available.
  Rejected by `E-29` and `E-30`: the catch runs in a process that may already be
  gone, so the compensation it performs is conditional on surviving; it
  compensates effects in other services by calling them synchronously, so a
  failure mid-compensation leaves a partly-compensated flow with no record; and
  there is no committed list of steps, so `E-29`'s ordering rule and `E-26`'s
  catalog have nothing to read.
- **A scheduled scan for flow rows that have gone stale, as the timeout
  mechanism.** *Steelman:* no timer destination, no scheduling infrastructure,
  one method, and it cannot lose a timer because it re-derives from state every
  time. Rejected by `E-31`: the scan interval silently becomes the timeout's real
  resolution and no committed value records it; a scheduled scan that finds rows
  in a state and acts on them **is an asynchronous handoff by `E-1`'s own
  predicate**, so it sits outside the allow-list; and it makes every flow's
  timing a property of one cron expression nobody reviews.
- **A shared secret in the webhook URL instead of a signature.** *Steelman:* the
  receiver needs no verification code at all, it works with any HTTP endpoint,
  and the URL is only known to the two parties. Rejected by `E-34`: the secret
  travels in a request target, **which is the one part of an HTTP request that is
  logged by default at every hop**; there is no replay protection, because a
  captured URL works forever; and rotation means re-registering the endpoint.
  Every one of those is invisible to the sender.
- **Doing the work inside the inbound webhook request.** *Steelman:* the sender
  gets a truthful status code — a 500 means it really failed — and there is no
  extra hop or table. Rejected by `E-35`: it couples an external caller's timeout
  to our transaction, so the sender's retry arrives while the first attempt is
  still committing and the effect happens twice; and "the sender gets a truthful
  status" is worth less than it looks, because at-least-once senders retry on a
  timeout they *caused*.
- **A presigned URL as the claim check.** *Steelman:* the consumer needs no
  storage credentials and no adapter, which is genuinely less machinery. Rejected
  by `E-36`: a presigned URL has a bounded lifetime, so **the pointer expires
  while the message is still valid, still retained and still redrivable** — the
  exact failure `E-36` exists to prevent, arriving through the convenient option
  — and it is free text, so it is an egress destination taken from a message
  field, which `E-34` bans.

The full steelman for each, the standards evidence, and the wordings that must
not be reintroduced are in [evidence.md](evidence.md).

## A flow whose steps commit in more than one transaction

**E-29 — A flow that commits in more than one transaction has a committed flow
definition: an ordered list of named steps, each declaring the destination it
publishes, the destination it waits for if any, and whether its effect is
`reversible` or `irreversible`. A lint asserts at most one `irreversible` step per
flow and that it is the last step. The flow's own state is a row in the initiating
service's transactional store carrying the flow identity and the current step as a
value of an enumerated type; no code decides which step a flow is on by looking at
business data.**

Two failures, and the first is structural rather than operational. **An
irreversible step in the middle of a flow means a later failure has nothing that
can undo it** — money captured, a message sent to a counterparty, a third-party
booking confirmed — so the flow ends part-done, every service internally
consistent, and the business fact wrong. Nothing throws: each step succeeded.
Nothing compares across services, because no gate in this design can. **Ordering
the irreversible step last is the only structural fix available, and it is
*decidable* the moment reversibility is a declared field** — which is the whole
reason the declaration exists.

**And deciding the current step from business data is the ambient modifier at the
flow level.** "If the payment row exists we must be past step 2" is a rule whose
answer depends on writes made by other steps, other flows and repair scripts, so
the same code reaches different conclusions over time and a retry re-runs a step
that already ran. The explicit column is what makes the flow's position a fact
rather than an inference.
*Schema lint over the committed flow definition — the
at-most-one-irreversible-and-last rule, and that every named destination exists in
the `E-26` catalog — plus type design (the step enumeration, the flow-state row)
plus a static rule (the flow module decides its step from the state column only).
Convention, 2026-07-29.*

**Named gap:** whether a step's effect is **actually** reversible is a semantic
claim, and no tool decides it. Declaring a refund-capable capture `reversible` is
a judgement; the lint enforces only the *consequence* of the declaration. This is
the residue that belongs in front of a human at the plan gate, and `E-28`'s
citation obligation is where it lands.

**E-30 — Every `reversible` step declares a compensating destination in the flow
definition. Compensation is a published message like any other — an outbox row,
the relay, the broker — consumed by the service that owns the effect, through the
deduplicated port. A compensation handler may not require that the forward effect
succeeded: it is correct when the effect never happened and correct when it has
already been compensated. No compensation is a synchronous call, and none is a
write to another service's data.**

**A framework's own documentation is the reason this needs a directive.** The
transaction guidance an agent will read tells the application to "take remedial
action … to compensate for the committed primary transaction" and **supplies no
mechanism for it**. Without a rule, what gets written is a `catch` around the
orchestration that logs, and the committed effects of every earlier step stay
committed forever with nothing recording that they should not have.

**The tolerate-absence clause is the half that gets missed, and it is not
idempotence.** `E-13` already makes the handler run-once-per-identity. This is a
different property: the compensation may arrive for a forward effect that **never
committed** — because the step's own state change succeeded and its confirmation
never came back, or because `E-31`'s timer fired first. So compensation is
**"cancel if present"**, never "undo the row I know is there". A compensation that
throws on a missing row burns its attempt budget and lands on the terminal
destination, where a message that correctly had nothing to do now looks like a
failure.
*Schema lint (every `reversible` step names a compensating destination that
exists in the catalog) plus a static rule (the compensation handler registers
through the deduplicated port; no outbound synchronous client is reachable from
the flow module) plus an integration test per reversible step — compensate with no
forward effect, and compensate twice; one observable outcome in both. Convention,
2026-07-29.*

**E-31 — Every step that waits declares a timeout in the flow definition, and
there is no unbounded wait. The timeout is a message on a committed timer
destination that is **not** the retry delay destination; its due time is computed
inside the timer adapter from event time carried in the message, never from a
clock read in flow or handler code; and its maximum is a committed value. Where
the transport's own delay primitive is shorter than a declared timeout, the timer
is a committed re-publish schedule owned by the relay and the schedule is a
committed value a lint reads. A timeout that fires after the awaited message
arrived is a no-op decided by the flow-state row.**

**This is `E-16`'s absent-signal failure in its worst form.** A subscription that
stops produces lag, and `E-16`'s staleness alert catches it. **A flow waiting for
a reply that will never come produces *nothing*:** no lag, because the message it
waits for was never published; no terminal-destination arrival, because nothing
failed; no error anywhere. The only trace is a row sitting in one step, and rows
are what nobody reads. **Every other alert in this rule set watches a message that
exists.**

**The transport forces the re-publish clause rather than design taste.** Amazon
SQS caps a message timer at **15 minutes** (its own quota page, read 2026-07-29),
so a business timeout of hours or days cannot be expressed as a delay primitive at
all and has to be a schedule — which is a thing that can be forgotten, hence the
committed value.

**And the separate-destination clause is not tidiness:** sharing `E-17`'s retry
delay destination makes a normal business wait indistinguishable from a retry
backlog, so `E-16`'s terminal-arrival alert fires on healthy traffic and gets
muted, **which is how both signals die.**
*Schema lint (every awaiting step has a timeout at or below the committed
maximum; the timer destination differs from every retry delay destination) plus a
static rule (no clock read in the flow module) plus an integration test — let the
timeout fire and assert a terminal flow state, then deliver the awaited message
after the timeout and assert exactly one outcome. Convention, 2026-07-29.*

**Named gap:** a flow whose timeout is committed but absurd — thirty days on a
checkout — is not decidable. The committed maximum bounds it; whether the number
is right is spec-and-review.

## HTTP across the organisation's boundary

**E-34 — An outbound webhook is a consumer, never a call from application code.
It is a subscription whose handler performs the HTTP call, so every consume-path
rule already binds it. The call is signed with a committed algorithm over a
committed component set including a timestamp and the message identity; the
destination host comes from a committed allowlist, never from a message field or
any user-supplied value; the client follows no redirects, and resolves the host
and checks the resolved address against a committed deny list — private,
loopback, link-local and the cloud metadata address — before connecting; every
call has a committed timeout; and the receiver's response body is never parsed as
authority for anything, only its status code decides success.**

Four failures, two of them security failures.

- **An unsigned delivery is indistinguishable at the receiver from anyone else's
  POST**, so whatever the receiver does on trust is unfounded, and nothing in
  either system reports the absence of a signature.
- **A destination taken from data is server-side request forgery.** The
  enumerated defences are the ones OWASP names for exactly this case: allowlist
  the host by strict comparison, disable redirect following in the client, resolve
  the name and verify the resolved addresses before connecting (against DNS
  rebinding), and block private, loopback and link-local ranges **and the cloud
  metadata endpoint, where the prize is cloud credentials.** They are enumerated
  rather than summarised as "prevent SSRF", because the general wording is a wish
  and each of these is a committed value or a client setting.
- **Following a redirect defeats the allowlist by construction**, which is why it
  is a separate clause and not an implementation detail.
- **Parsing the receiver's body makes an outside party's output an input to our
  state** with no schema gate anywhere: `E-18` and `E-19` govern broker payloads,
  not an HTTP response.

**Two named standards exist and which one the repo signs with is a per-stack pick,
not a directive here** — RFC 9421 signs HTTP message components and survives
transformation by intermediaries; Standard Webhooks specifies three headers, signs
identity-dot-timestamp-dot-payload with HMAC-SHA256 or ed25519, and carries
several signatures at once so a secret rotates with no downtime. **No skill here
names a winner**, and the stack skill says why rather than picking: the pass that
produced these rules never checked what maintained implementations either standard
has on any stack, so a pick made here would rest on a belief nobody verified. The
repo commits one, records which and why in the plan, and re-checks implementation
availability at adoption. **What is a directive** is that one of them is
committed, that the secret is rotatable without downtime, and that **the tolerance
is a committed number** — the specification requires the receiver to check the
timestamp and **names no window**, so an uncommitted tolerance is an unbounded
replay window.
*Static rule (no HTTP client reachable from application or flow modules; the
handler registers through the deduplicated port; no redirect-following
configuration) plus a schema lint (the allowlist, the deny list, the timeout, the
algorithm, the tolerance) plus an integration test — a redirect toward a private
address is refused; a delivery with a stale timestamp or a broken signature is
rejected by the repo's own verifier fixture; a host absent from the allowlist is
refused. Convention, 2026-07-29.*

**Named gap:** whether the receiver verifies anything is outside this repository.
**Signing proves that we signed, never that anyone checked.**

**E-35 — An inbound webhook is a message, not a request that does work. The
endpoint verifies the signature and the timestamp against a committed tolerance,
rejects on failure with no side effect, writes the payload inside one transaction
to the outbox — or to a committed ingress table that only the relay reads — and
returns. It performs no business effect in the request. The sender's own message
identity is the deduplication key, retained for the window `E-14` requires. The
payload is decoded against a committed schema for that sender under `E-20`'s
asymmetry, and an unverifiable sender is a terminal failure, never a default.**

**An inbound webhook is an at-least-once delivery from a system nobody here
controls or can ask.** Senders retry, so duplicates are **certain** rather than
possible; nothing guarantees order; and a signed payload captured earlier is
accepted forever unless the timestamp is checked, **which is what makes the
tolerance a correctness rule and not hardening.**

**Doing the work inside the request couples an external caller's timeout to our
transaction:** the sender gives up, retries, and the effect runs a second time
while the first is still committing — and each run is a well-formed write, so the
trace is in the data and nowhere else.
*Static rule (the ingress module may depend on the outbox port and on no effect
port) plus an integration test — the same signed delivery twice yields one effect;
a tampered signature is rejected with no row written; a stale timestamp is
rejected — plus a schema lint (the tolerance, the per-sender schema, the identity
field). Convention, 2026-07-29.*

**Named gap:** the sender's retry policy is the sender's. **Ingress can be made
idempotent; it cannot be made guaranteed**, and a sender that gives up after one
attempt is a fact no check here can see.

## A payload the transport will not carry

**E-36 — Where a payload cannot meet its subject's committed maximum size, the
message carries a claim check under committed conditions, or the design changes.
The pointer is a nominal type and never free text; it names an immutable object
written and committed **before** the outbox row commits; it resolves through one
storage adapter that follows no redirects. The object's committed retention is
strictly longer than the destination's retention plus the terminal destination's
redrive window, and a lint compares the committed values. The message still
carries the semantic fields the consumer branches on — only bulk content moves.
The consuming handler's module may depend on the storage adapter and still may not
depend on any client for the producing service.**

**The pattern manufactures this rule set's signature failure unless it is
constrained: the message decodes perfectly and the payload is gone.** Two
retentions decide that, configured independently — the transport's, and an
object-lifecycle rule typically written in another repository by someone else —
with nothing comparing them, **which is why the comparison is a lint rather than
advice.** Amazon SQS retains a message up to 14 days; an object lifecycle rule of
7 days silently wins, and the symptom is a terminal failure weeks later on a
redrive.

**Writing the object after the outbox row commits is the dual write one layer
down**, with the same shape `E-5` exists for: the row commits, the process dies,
the object is never written, and the message is undeliverable forever with no
record of what it should have carried.

**Why this does not violate `E-21`'s dereference ban, stated because it looks like
it does.** That ban exists because a consumer that reads the producer's *current*
state gets a different answer on replay. An immutable object written **before** the
fact was published is state **at event time**, so a replay reads the same bytes
and `E-23`'s property survives. The clause carrying that distinction is the
dependency ban in the last sentence: **object storage yes, the producer's API
no.**

**The transport facts make the rule necessary rather than defensive, and the first
of them is a correction.** Amazon SQS's maximum message size is **1 MiB**, raised
from 256 KiB in 2025 — **so the figure any agent supplies from memory is wrong**,
and a repo pinning the old one under-uses the transport and reaches for a claim
check it does not need. Above that limit the vendor's own answer *is* this
pattern: an extended client that stores the payload in object storage and puts a
reference in the message, capped at 2 GB and documented as working only for
synchronous clients, which is a real constraint. A self-hosted NATS server's
default maximum payload is 1 MB, with values above 8 MB not recommended by its own
documentation.
*Type design (the pointer type; no free-text URL) plus a schema lint (the
per-subject maximum, the retention comparison, the storage adapter's redirect and
allowlist settings) plus a static rule (the dependency ban) plus an integration
test — the object is present when the message is processed, and a claim check whose
object is absent is a terminal failure and not a silent skip. Convention,
2026-07-29.*

**Named gap:** the object store's actual lifecycle configuration is
infrastructure — the same class as `E-5`'s durability gap and `E-14`'s retention
gap. The lint reads the repository's *declaration* of it, and the declaration can
be a lie.

## Interlocks these rules must not break

- **`E-30`'s compensation must not become one generic undo handler taking any
  message type.** Compensation is per step and per destination, or `E-29`'s flow
  definition has nothing to lint and `E-26`'s catalog has nothing to enumerate. A
  single `CompensationHandler` satisfies the prose and destroys both checks.
- **`E-31`'s timer destination is not `E-17`'s retry delay destination, and a
  stack must not economise by sharing one.** They carry different alerts: arrivals
  at a retry destination mean something failed, arrivals at a timer destination
  mean time passed. Merged, the only alert that survives is one nobody can act on.
- **`E-34`'s webhook handler is not an exception to `E-5`.** If it needs to record
  the delivery outcome as a fact other services consume, it writes an outbox row
  in its own transaction like any other consumer. **"It already made an HTTP call,
  so a publish here is the same kind of thing" is the reasoning to refuse.**
- **`E-36`'s pointer type is not a licence to reintroduce a dereference.** The
  permitted dependency is the storage adapter and nothing else; a handler that
  gains an API client for the producing service has re-created `E-21`'s hazard
  with a pointer as the excuse.
- **`E-33`'s ban on in-handler cross-message state binds the flow module too.** No
  mutable field, no static collection, no accumulating buffer — and a scheduled
  read-model refresh is an adapter concern with a committed schedule, never a
  scheduling annotation in a flow or service class.
- **A money step keeps every money obligation.** See *The premise, and what
  carries over* above. `E-30` and `M-20` do not substitute for each other in
  either direction.

## Markers, dates, and what they mean

**All six directives above are convention, dated 2026-07-29**, and that is a
ceiling on the whole group rather than a per-rule accident. None survived three
independent refutation votes against primary sources, because each is a **design
argument rather than an execution result**. **There is no production use of this
rule set anywhere.**

**The pass behind these six is the weakest behind any skill in this set, and that
is the first thing to know about them.** One researcher, against primary sources —
vendor licence announcements and licence files, framework reference documentation
and javadoc, a design-proposal pair, a queue-quota page, a server-configuration
reference, and OWASP prevention guidance — with **no panel, no steelman duel and
no hostile audit.** The core skill's pass fell short of the three refutation votes
but did have an audit, and its planted canary was caught. This one has nothing
standing in for the votes at all. Where a fact quoted above is firmer than the
core skill's — the SQS quotas, the signing standards, the OWASP enumeration — that
is a property of the *facts*, not of the pass shape.

- **confirmed** — survived three independent refutation votes against independent
  sources. **No directive here carries it.**
- **primary-source verified** — one researcher checked it against a primary
  source, with no panel. No directive carries it; several *facts* quoted above
  do, and they are dated in [evidence.md](evidence.md).
- **convention** — defensible practice the research did not or could not confirm
  from independent sources. All six.

**Do not promote a marker here without a new research pass**, and the specific
condition is in [evidence.md](evidence.md): a steelman duel plus a hostile audit
over this pass's output. That trigger is also the one the two bans in
`async-handoff` carry, because they came out of the same pass.

**The lapse rule.** These rules were last dated for a review by **2027-01-29**.
Past that date every **confirmed** marker reads as **convention** until a new pass
re-dates it. This needs no maintainer action, and here it changes nothing, because
nothing is confirmed.

The pass, the sources, the full steelman for each rejected shape, the wordings
that must not be reintroduced, and the conditions that reopen a decision are in
[evidence.md](evidence.md).
