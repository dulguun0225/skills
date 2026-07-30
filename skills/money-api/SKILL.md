---
name: money-api
description: Money-grade rules for money crossing a process boundary — a string decimal plus an explicit currency on the wire, a JSON number on a money field rejected at parse, required money fields, counterparty minor-unit tables, constructor-only deserialization, idempotency keys on money-mutating POSTs, required preconditions, and the money edge cases the conformance fuzzer must send. Load before adding or changing a request or response payload, a schema, or an endpoint that carries an amount of money. States the kind of check each rule needs; the tool is named in the matching stack skill (money-java).
---

# Money-grade rules: the wire and the API contract

Eight directives, `M-12` … `M-19`. Each states the **kind** of check it needs.
No tool is named here, because no tool is portable across languages — the tool
is named in the stack skill.

## The premise these rules are conditioned on

**Code is written by LLM agents and no human reads it line by line, and a
feature carries an amount of money the system computes with.** A wrong cent is
a defect with a victim, and with nobody reading the code it stays invisible
until someone outside the system complains.

**`M-15` … `M-19` bind additionally when money moves over an HTTP API
described by a committed schema.** They are HTTP-shaped, not language-shaped. A
repo with no HTTP surface skips that group and keeps `M-12` … `M-14`, which
bind wherever an amount is serialized.

## What is here and what is elsewhere

- **This skill** — money on the wire, and the money-grade parts of an HTTP
  contract.
- **`money`** — the money type, arithmetic, rounding, the fail-loud rule,
  observability, and the evidence gates (`M-1` … `M-9`, `M-20` … `M-29`).
  Install it with this skill: `M-19` below is the money input set for `M-26`
  there, and `M-26` names `M-19` as the cases it must cover. Neither is
  complete alone.
- **`money-java`** — the same rules with Java, Spring Boot MVC and Jackson
  tools named; its `api.md` is the half that matches this skill.
- **`money-storage`** — the store boundary (`M-10`, `M-11`, `M-30` … `M-43`).
  Three of its rules are these rules in the other direction: `M-37` is `M-16` on
  read, `M-39` is `M-18` at the store on the same version column, and `M-40`
  requires the idempotency record `M-17` defines to be written in the money
  effect's own transaction. Nothing in this skill reaches a column, a query, or
  a migration.

## The defaults these rules override, by name

- **A JSON number on a money field** — the corpus default, and binary
  floating-point re-entering one layer up from the field. A JSON number has no
  guaranteed precision. Rejected by `M-12`, and by `M-15` for every decimal
  field, not only money.
- **Integer minor units on the wire** — the Stripe and Adyen style.
  Evaluated, **not wrong**, and rejected for `M-12`: it moves exponent
  knowledge to every reader, and readers disagree about exponents. `M-14`
  exists because processor exponent tables deviate from ISO 4217. A string
  decimal carries its own scale. This is a chosen convention, not an industry
  standard — real public APIs go both ways, and the split is in
  [evidence.md](evidence.md).
- **A mutable payload object with setters** — the corpus default shape for a
  DTO, rejected by `M-16`. Required-field enforcement fires only for
  constructor-bound properties in most serialization libraries, so a
  setter-bound money payload ignores the required marker silently and a missing
  amount arrives as zero or null.
- **Honoring a precondition when the client sends one** — the framework
  default, rejected by `M-18`. Honored-when-present means the client decides
  whether the guard runs.
- **Serving the first response for a repeated idempotency key without
  comparing the request** — the shortest correct-looking implementation,
  rejected by `M-17`. The same key with a different body is a different
  command, and answering it with the first command's result reports success for
  something that never ran.
- **Writing the idempotency record after the money effect commits** —
  rejected by `M-17`. A committed effect whose response was never stored cannot
  be replayed, and the retry re-executes it.

## What to do when this skill fires

1. Every decimal field on the payload is a string. Counts and line numbers
   stay integers. No per-field judgment (`M-15`).
2. The payload deserializes through a constructor. If the language's
   serialization library enforces required fields only for constructor-bound
   properties, that is not a detail — it is the whole enforcement of `M-13`
   (`M-16`).
3. A money-mutating `POST` gets an idempotency key and a precondition, both
   required, both failing loud when absent (`M-17`, `M-18`).
4. Add the money edge cases to the conformance fuzzer's input set (`M-19`).
   The gate itself is `M-26` in `money`.
5. State the wire format in the contract — every contract, not one of them
   (`M-12`).

## Wire

**M-12 — Money on the wire is a string decimal plus an explicit currency; a
JSON number on a money field is rejected at parse.** A chosen convention,
holding repo-wide and stated in every contract. Rejecting at parse, rather than
coercing, is the difference between a loud failure and a silently truncated
amount.
*Parse test; `M-19` probes it. Convention, 2026-07-21.*

**M-13 — Fields that carry money are required.** A missing amount fails
deserialization, never defaults. A defaulted amount is a wrong number that no
later check can distinguish from a real one.
*Parse test or compiler or linter check. Convention, 2026-07-21.*

**M-14 — Converting to a counterparty's minor units uses that counterparty's
published exponent table, never an ISO 4217 assumption.** Processor tables
deviate from ISO for specific currencies, so an ISO-derived exponent silently
multiplies or divides an amount by ten or a hundred for exactly those
currencies.
*Spec-and-review. The premise — that processor tables deviate — is confirmed
2026-07-21 with the deviations named in [evidence.md](evidence.md); the rule
built on it is convention.*

## API contract

Binds additionally when money moves over an HTTP API described by a committed
schema.

**M-15 — Every decimal-valued field on the wire is a string, not only money
amounts** — rates, percentages and FX factors too; a JSON number on any
decimal field is rejected at parse. Counts and line numbers stay integers. One
rule, no per-field judgment, because per-field judgment is where a rate field
gets missed. Extends `M-12`; it is the same rule widened, stated once.
*Parse test; `M-19` probes it. Convention, 2026-07-25.*

**M-16 — Money-carrying payloads deserialize only through construction, not
through mutation after construction.** The required-field rule (`M-13`) is
enforced only for constructor-bound properties in most serialization
libraries, so a setter-bound money payload would ignore it silently. This
sharpens `M-13`; it is not a second rule.
*Parse test posting a missing amount and asserting the failure. Convention,
2026-07-25 — the constructor-only enforcement behaviour is confirmed for the
serialization library named in the stack skill.*

**M-17 — Every money-mutating `POST` requires an idempotency key.** The
idempotency record — the key, a hash of the raw request body, the response
status, and the response bytes — is written in the same transaction as the
money effect, so a committed effect can never lack its stored response. A
retry replays the original bytes instead of re-executing; a failed command
releases its key so a retry re-executes; the same key with a different body
hash is rejected, with a status the repo pins, and is never served the first
result. The table is scoped per tenant.
*Contract lint requiring the key on every money-path `POST`, a
same-transaction integration test, and a replay test. Convention, 2026-07-25 —
no standard fixes the semantics or the status, which is why the repo pins its
own; see [evidence.md](evidence.md).*

**M-18 — On a money-path mutation the conditional-request precondition is
required, not merely honored:** absent → **428**, stale → **412**, and the
effect never runs. This is the money-grade refinement of the repo's
optimistic-concurrency rule and reuses the same version column, so a repo with
no such general rule states one here rather than assuming one. **On a Java
backend that general rule is published** — *the guarded version-column update*
and *strong ETags* in `java-backend-api`, which name this directive as the money
refinement of both.
*Contract lint keyed off the money tag. Convention, 2026-07-25 — the mechanism
it rests on is confirmed: a guarded update affects zero rows when the row is
stale or absent, and treating zero rows as a no-op is the lost-update failure.*

**M-19 — The conformance-fuzz gate's input set includes the money edge
cases** — boundary decimals at and beyond the currency's minor-unit scale, a
JSON number on a money field, and oversized amounts — each rejected with a
coded error or conforming to the schema, **never a 500**. Extends `M-26` in
the `money` skill; it adds no second tool, only inputs.
*Conformance fuzz, with bespoke money cases. Convention, 2026-07-25.*

## Markers, dates, and what they mean

Every directive above carries a confidence marker and a date. **confirmed**
means it survived three independent refutation votes against independent
sources on that date; **convention** means the research did not or could not
confirm it from independent sources, and it is kept because it is cheap,
enforceable, and fails toward safety.

Every directive here is **convention**. Two rest on confirmed *facts* —
`M-14`'s deviating processor tables and `M-18`'s zero-affected-rows mechanism —
and the rule built on each fact is still the repo's choice, not an external
mandate. That distinction is kept because collapsing it would promote a design
argument to a verified fact.

**The lapse rule.** These rules were last re-dated for a review by
**2027-01-21**. Past that date every **confirmed** marker reads as
**convention** until a new research pass re-dates it, with no maintainer
action required.

The sources, the dated claims, the citations that did not survive, and the
conditions that reopen a decision are in [evidence.md](evidence.md).
