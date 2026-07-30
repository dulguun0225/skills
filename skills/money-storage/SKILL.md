---
name: money-storage
description: Money-grade rules for an amount that crosses a store boundary — exact-decimal money columns with explicit precision and scale, over-scale writes rejected rather than rounded, non-finite and free-text-currency constraints, arithmetic in the query language banned, one named read boundary, appended effect rows, version-guarded updates, migrations that compute money, and the verdict on every shape a repo assembles out of stored money. Load before adding or changing a money column, a migration, a view, a query that reads or totals an amount, a row mapper, or a stored balance. States the kind of check each rule needs; the tool is named in the matching stack skill (money-java).
---

# Money-grade rules: the store boundary

Sixteen directives — `M-10`, `M-11`, and `M-30` … `M-43` — plus a verdict on
every composite shape a repo assembles out of stored money. Each states the
**kind** of check it needs. No tool is named here, because no tool is portable
across engines — the tool is named in the stack skill.

**Read the marker ceiling before you read the rules.** This group came out of a
single pass with **no panel**: one researcher against vendor documentation, no
steelman duel, no hostile audit, and no refutation votes. So **nothing here is
confirmed**; the ceiling is *primary-source verified*, and the design arguments
resting on those facts are *convention*. Two of the outputs are **bans**, and
the case against each banned shape was written by whoever rejected it — which is
the exact failure an independent panel exists to prevent. Running that panel is
this group's first re-open trigger, and until it runs **no marker here may be
promoted to confirmed**, least of all the two bans.

## The premise these rules are conditioned on

**Code is written by LLM agents and no human reads it line by line, and a
feature carries an amount of money the system computes with.**

**These rules bind additionally when an amount is durably stored and read back
through a store the repo queries.** A service that only passes money through and
stores none of it skips the group.

**The condition is not "the store is a relational database", and it is not "the
repo uses a client library or an ORM."** These rules must reach a hand-written
query, a view definition, a migration, and a support script — **none of which
imports a client library**. Scoping the seam around the obvious library is the
mistake two neighbouring rule sets — the caching rules and the
asynchronous-handoff rules, neither published here — each had to correct: the
first had scoped its seam to a cache client library, which left every
in-process cache outside every one of its checks. If a check here is written
against a library's API, it reports green over every one of those four.

## Why this group exists at all

Every other money rule is enforced by a check that reads **application
source**: an architecture rule, a compiler or linter check, a parse test, a
property test. A stored amount passes through a **second language** — the
store's own query language — and **no directive outside this group reaches it**:

- `M-2` bans exact-decimal arithmetic outside the money module, and reports
  green over a `SUM`, over a view that multiplies by a rate, and over a
  query-builder expression whose static type is the builder's own.
- `M-1` rejects excess precision at construction, and is bypassed by a write
  that lets the column round instead, and by a read that assigns a raw decimal
  onto a field.
- `M-10` and `M-11` govern how a column is *declared* and stop there.

The gap was never a missing rule. It was a missing **layer**.

## What is here and what is elsewhere

- **This skill** — the column declaration, what the store must refuse on write,
  what it may not compute, how a row becomes a money value on read, and how a
  money row may change.
- **`money`** — the money type, arithmetic, rounding, fail-loud, observability,
  the evidence gates (`M-1` … `M-9`, `M-20` … `M-29`).
- **`money-api`** — the wire and the HTTP contract (`M-12` … `M-19`). Three
  rules here are its mirror image at the store: `M-37` is `M-16` in the read
  direction, `M-39` is `M-18` at the store on the same version column, and
  `M-40` needs the idempotency record `M-17` requires.
- **`money-java`** — the same rules with PostgreSQL, jOOQ, Flyway and a
  containerised engine named; its `storage.md` is the half that matches this
  skill.
- **Two shapes are owned by rule sets that are not published here** — a cached
  amount and a money amount in a message payload or outbox row. The composite
  shape table names the seam for each rather than pretending to a verdict.

## The defaults these rules override, by name

Each is a corpus favourite because it is the shortest correct-looking code.

- **Letting the column do the rounding** — write whatever the computation
  produced into the money column and let the engine round it. **The most
  economical of the lot, and the one an agent reaches for without ever deciding
  to.** Rejected by `M-30`: both engines checked round silently, and one
  documents that the loss is not an error even in its strict mode, so the build,
  the test suite and the write all report success.
- **Incrementing in the query** — `UPDATE … SET amount = amount + ?`. The idiom
  every corpus recommends for concurrency, and **correct about concurrency**: it
  is exactly the read-modify-write that read-committed isolation loses, done in
  one statement. Rejected by `M-35` anyway, because it puts the arithmetic in
  the one language no check reads. **This is the sharpest trade-off in the
  group, not a clean win** — the rejected form was safer on the axis it was
  chosen for, which is why the replacement is `M-38`'s append and not a worse
  version of the same shape.
- **A binary floating-point column** — the corpus default one layer down from
  the field. Banned by `M-10`.
- **A vendor "money" column type** — banned by `M-10`, and both vendors checked
  document the ban themselves: PostgreSQL's `money` takes its fractional
  precision from the **`lc_monetary` server setting** rather than from the
  column, and SQL Server's carries a documentation warning against using it in
  calculations plus an inability to store a currency at all.
- **A bare, unconstrained decimal column** — reads as "the flexible choice".
  Rejected by `M-31`: it accepts any scale, so excess precision survives the
  round trip, and it is the one place a non-finite value can be stored at all.
- **Free text for the currency code** — rejected by `M-34`: it admits `usd`,
  `USD ` and `$` as three distinct currencies.
- **A trigger, a rule, or a generated column that computes money** — banned.
  Grounds, and what reopens it, are in *Composite shapes* below.
- **An amount inside a document or JSON column** — banned, same place. The
  attraction is schema-free iteration; the cost is every constraint in this
  group at once.
- **An integer number of minor units as the storage type** — a `bigint` of
  cents. **Excluded by `M-10`'s wording, and never justified on evidence.** Said
  plainly rather than left to read as decided: no evidence survived on which
  decimal precision to pick, let alone against this alternative, and the
  argument on its side is real — an integer column cannot be over-scale, which
  removes `M-30`'s entire failure mode by construction. Its price is moving
  exponent knowledge into every reader, which is the same cost that got minor
  units rejected on the wire at `M-12`. Marked **convention**, and it **reopens**
  where a language's decimal support is weak enough that `M-1` is easier to
  enforce over an integer type.

## What to do when this skill fires

1. Declare the column with both numbers — precision and scale — and the
   currency column beside it (`M-10`, `M-31`, `M-33`, `M-34`).
2. Write the constraints in the same migration: non-finite excluded,
   `NOT NULL` on both halves, currency constrained to a committed list
   (`M-32` … `M-34`).
3. Assert the amount's scale in the application **before** the statement runs.
   Never rely on the store to reject it, and never let it round (`M-30`).
4. Keep arithmetic out of the query. If a total genuinely cannot be computed in
   the money module, take the one permitted exception and give it a golden test
   (`M-35`, `M-36`).
5. Read through the one named mapper, constructing the money value from the
   amount and its currency together (`M-37`).
6. Append the effect. If a mutable balance row exists anyway, guard every write
   with its version and treat zero affected rows as a failure (`M-38`, `M-39`).
7. A migration that computes an amount is money math: worked example, golden
   corpus, real engine (`M-41`).
8. State the maximum amount the precision is chosen against (`M-43`).

## Storage — how a money column is declared

**M-10 — Money columns are an exact decimal type with explicit precision and
scale; scale 4 covers every ISO 4217 currency.** Never a binary floating-point
column type, and never a vendor "money" column type. The currency is stored in
a column beside the amount.
*Schema lint over the committed migrations. Scale 4 confirmed 2026-07-21, and a
second vendor arrived at the same number independently on 2026-07-29; the
precision digits are the repo's call (`M-43`). Convention for the column-type
bans, 2026-07-21 — and each ban gained a documented vendor ground on
2026-07-29; see [evidence.md](evidence.md).*

**M-11 — Rate and factor columns carry their own, higher precision.** They are
not money columns and do not take the minor-unit scale. This is `M-6` at the
schema.
*Same schema lint. Convention, 2026-07-21.*

## Persistence — the write boundary

**M-30 — An amount whose scale exceeds the column's is rejected before it
reaches the store, never rounded by it.** Stores round, and they do it quietly.
PostgreSQL documents that a value whose scale exceeds the column's declared
scale is rounded to that number of fractional digits. MySQL is worse in one
respect: it names the mode it imposes — round half away from zero — and
documents that the truncation is **not an error, even in strict SQL mode**.
Between them: **the store is a repo-wide default rounding
mode applied at every write** — the thing `M-7` bans outright and `M-1` rejects
at construction, reintroduced one layer down and reported as success.
*Integration test against the real engine: write an amount one digit past the
column's scale and assert an error, not a stored rounded row. An in-memory
substitute cannot check this — the rounding is the engine's. Primary-source
verified 2026-07-29, both engines.*

**M-31 — A money column is a constrained decimal; the store's unconstrained
decimal type is banned.** This sharpens `M-10`'s "explicit precision and scale"
and carries the reason `M-10` shipped without. An unconstrained decimal accepts
any scale, so excess precision survives the round trip and `M-1`'s rejection is
bypassed by writing through the store instead of through the constructor.
PostgreSQL also documents that **an infinity can only be stored in an
unconstrained `numeric` column** — so the unconstrained type is the one place a
non-finite amount can land at all.
*The `M-10` schema lint, extended to fail on a money column declared with no
precision and scale. Primary-source verified 2026-07-29 (PostgreSQL).*

**M-32 — Where the decimal type admits non-finite values, a committed
constraint on the column excludes them.** PostgreSQL's `numeric` accepts `NaN`,
and documents that it treats `NaN` values as equal, and **greater than all
non-`NaN` values**, in order to keep them sortable and usable in tree-based
indexes. So a
`NaN` amount passes an ordering guard, wins a maximum, sorts as the largest
row, and propagates through a sum: a wrong number that **no comparison-based
check can see**, which is the class `M-5` exists for.
*A check constraint per money column, asserted by the schema lint, plus an
integration test writing a non-finite value and asserting rejection.
Primary-source verified 2026-07-29 (PostgreSQL).*

**M-33 — An amount column and its currency column are both `NOT NULL`, and
neither is nullable alone.** An amount and its currency are one value (`M-1`);
a schema that lets one half be null admits a row no money value can be
constructed from, and the read path must then invent a currency or a zero.
Where a money value is genuinely optional the **row** is absent, or the pair
sits in its own table — never one half of a pair.
*Schema lint over the committed migrations. Convention, 2026-07-29, and **not
premise-derived**: the absent reader changes the stakes only through the
invention on the read path, so this is close to ordinary schema hygiene. Kept
because it is cheap and fails toward safety.*

**M-34 — The currency column is constrained to a committed list of the codes
the repo supports.** Free text admits `usd`, `USD ` and `$` as three distinct
currencies. The constraint also carries a pairing the store will not: SQL Server
documents that its own money type "doesn't store any currency information
associated with the symbol, it only stores the numeric value", so **nothing
below the application knows an amount's currency unless the schema says so**.
*A check constraint, or a foreign key to a committed reference table, asserted
by the schema lint, plus an integration test on a rejected code. Convention,
2026-07-29; the SQL Server behaviour is primary-source verified 2026-07-29.*

## Persistence — the query language

**M-35 — Arithmetic on money in the store's query language is banned. Queries
read and write amounts; they do not compute them.** `M-2`'s ban is enforced
over application source, and query text is not application source to that
check: a `SUM` in a report query, an `amount * rate` in a view, a hand-written
statement that increments a balance, and a query-builder expression typed as
the builder's own DSL rather than as the language's decimal type **all pass
while the check reports green**. Division in the query language is the worst
case — it rounds, at a scale the engine picks, with no mode named at any call
site, which is `M-7` defeated without a trace.
*A lint over committed query text — query files, view and function definitions,
migrations — plus an architecture rule confining the query builder's arithmetic
constructs to the money module. Convention, 2026-07-29.*

**Named blind spot, stated because a green lint would otherwise read as
coverage:** query text **assembled at runtime from fragments** is reachable by
neither check. On that path the rule's real gates are `M-37`'s read-boundary
construction and `M-27`'s characterization replay, not this lint. Do not
describe the pair as complete coverage.

**M-36 — The one permitted exception is an exact-decimal aggregate over rows,
and it carries a golden test.** Where the row count makes reading the rows into
the money module untenable, the store may total them — over an exact decimal
column, **never a binary float**, and never with an averaging or otherwise
dividing aggregate. The float case is not a matter of taste: PostgreSQL's own
documentation shows a `float8` sum over a window returning `0` where the answer
is `1`, because "adding `1` to `1e20` results in `1e20` again", and states that
this "is a limitation of floating-point arithmetic in general, not a limitation
of PostgreSQL".
**A float total therefore depends on the order the engine happened to add the
rows in.**
*Golden test comparing the store-computed total against the same total computed
in the money module, over a committed corpus. Primary-source verified
2026-07-29 for the float claim; convention for the exception's shape.*

## Persistence — the read boundary and mutation

**M-37 — A stored row becomes a money value only by construction, at one named
read boundary.** The mapper reads an amount and its currency together and calls
the constructor; nothing assigns an amount onto an already-constructed object,
and no code outside that boundary holds a bare decimal that came from the
store. This is `M-16` for the read direction, for the same reason — where
construction is bypassed, the type's checks are bypassed with it.

**The read direction is the weaker of the two**, and the reason is worth
keeping: the value it admits was not necessarily written by this code path at
all. A row may predate `M-32`'s constraint, or have been written by a
migration, a support script, or another service.
*Static rule confining store-to-money conversion to one named mapper in the
persistence module, plus an integration test that writes rows out of band —
wrong scale, non-finite, null currency — and asserts each fails loud on read.
Convention, 2026-07-29.*

**M-38 — The record of a money effect is appended, never updated in place; a
correction is a new row.** This removes the lost-update class instead of
mitigating it. PostgreSQL documents that under read-committed isolation a
`SELECT` "sees only data committed before the query began" and that "two
successive `SELECT` commands can see different data, even though they are within
a single transaction" — so a read-compute-write against a
stored balance drops a concurrent effect unless it locks or carries a version
predicate, and the idiom that would make it safe, incrementing inside the
query, is banned by `M-35`. **An append has no read-modify-write to lose.**

A current balance may still exist as a projection; it is then recomputable from
the appended rows, and it is what `M-28`'s standing invariant checks.
*A committed guarantee that the effect table takes no update or delete — a
rule, a trigger, or a withheld grant, whichever the engine supports — asserted
by an integration test that attempts one; plus a concurrency test running two
effects at once and asserting both are recorded. Convention for the rule,
2026-07-29; the isolation semantics are primary-source verified 2026-07-29.*

**M-39 — A mutable money row, where one exists at all, is written only with its
version as a predicate, and zero affected rows is a failure rather than a
no-op.** This is `M-18`'s precondition at the store instead of at the API, on
the same version column. PostgreSQL documents that under read-committed a second
updater re-evaluates its `WHERE` clause "to see if the updated version of the row
still matches the search condition" and, if it does, "proceeds with its
operation using the updated version of the row" — so an unguarded
`UPDATE … WHERE id = ?` **overwrites a committed concurrent effect and reports
success**. Under repeatable-read the same case instead raises "could not
serialize access due to concurrent update", and the application "should abort
the current transaction and retry the whole transaction from the beginning".
**A repo states which of the two it relies on; relying on neither is the
defect.**
*Integration test with two concurrent transactions asserting exactly one
succeeds and the other fails loud. Primary-source verified 2026-07-29
(PostgreSQL).*

**M-40 — Everything that makes a money effect reconstructable is written in the
effect's own transaction:** the effect row, the idempotency record `M-17`
requires, and — where the effect's `M-20` event leaves the process — the
durable row that event will be published from. **A publish after commit does
not satisfy it.**

This adds no mechanism. It is stated because it is the one place these rules
and a repo's asynchronous-handoff rules must agree, and the money path is where
a lost event costs a cent nobody can reconstruct.
*The same-transaction integration test `M-17` already requires, extended to
assert the event's durable row. Convention, 2026-07-29.* **Named residue:** this
rule depends on a second rule set agreeing, and that rule set is not published
here.

## Persistence — migrations and precision

**M-41 — A migration that computes a money value is money math, and carries
money math's evidence:** the worked numeric example `M-25` requires, and a
golden test running the migration against the real engine over a committed
before-and-after corpus. A backfill applying a rate, a re-denomination, a split
of one column into two — each is a computation that `M-23`'s mutation gate,
`M-24`'s property tests and `M-27`'s replay **do not reach**, because all three
gate application code.
*Golden test against the real engine over a committed corpus. Convention,
2026-07-29.*

**M-42 — A change to an existing money column's type, precision or scale is
never silent, and never narrows scale.** Narrowing rounds every stored row on
the spot, by `M-30`'s evidence, and the one-line migration is the whole diff a
reviewer sees.
*A migration-hazard lint that flags any alteration of a money column and
requires an explicit per-migration acknowledgement. Where the stack's lint
already flags every column-type change for the lock it takes, no extension is
needed and the record says so; the half no such lint covers is what happens to
the values already stored, which stays spec-and-review. Primary-source verified
2026-07-29 for the rounding.*

**M-43 — The precision digits are stated against a named maximum amount, and
exceeding it fails loud.** `M-10` leaves the digits to the repo, and no evidence
survived on which to pick. What this adds is that the choice is **written down
beside the largest amount and the largest aggregate the repo intends to hold**.
PostgreSQL raises an error when the digits left of the decimal point exceed the
declared precision minus the declared scale, which is the failure wanted — loud
on the integer side, silent on the fractional side, which is why `M-30` asks for
a rejection and this rule asks for a stated ceiling. A fixed-width vendor money
type instead has a ceiling that cannot be widened at all — PostgreSQL's `money`
runs to ±92233720368547758.07 and SQL Server's to ±922,337,203,685,477.5807 —
which is a second, independent ground for `M-10`'s ban on those types.
*Spec-and-review for the stated maximum, plus an integration test at it and one
digit past it. Primary-source verified 2026-07-29 for both the error behaviour
and the vendor ceilings.*

## Composite shapes a repo assembles out of stored money

**This section is required, and the reason is a defect in a neighbouring rule
set.** The asynchronous-handoff rules named the undecidable properties inside
each of their directives, read as thorough because of it, and still passed over
five whole shapes a repo assembles *out of* their primitives in complete
silence. Naming gaps rule by rule does nothing to surface a shape nobody wrote
a rule about. So
every shape below is marked, and **silence about a shape is a defect in this
section rather than the reader's problem**.

| Shape | Verdict |
| ----- | ------- |
| A total the store computes — aggregate, view, materialized view | **permitted with conditions** — `M-36` |
| A money value computed by a trigger, a rule, or a generated column | **banned** — grounds below |
| A balance rebuilt by folding the stored effect rows | **permitted, and the recommended shape** — `M-38` |
| A mutable balance row kept beside the effect rows | **permitted with conditions** — `M-38`'s projection clause, then `M-39` |
| A money amount inside a document or JSON column | **banned** — grounds below |
| A void or reversal of a posted effect | **permitted** — it is an append (`M-38`), never a flag flipped on the original row |
| A money amount in a cache | **out of scope here** — a repo's caching rules own it, and they are not published in this skill set. The seam to name: a cached amount is a copy that no column constraint reaches |
| A money amount in a message payload or an outbox row | **out of scope here** — a repo's asynchronous-handoff rules own it, and they are not published in this skill set. `M-40` names the seam |
| Money rows in a read replica or a reporting store | **permitted for reads that are not inputs to a money effect; banned as an input to one** — replica lag makes the input stale, and the reporting store's columns sit outside this repo's schema lint |
| Money columns spread over per-tenant schemas or table partitions | **permitted — and this is where this group's checks silently under-cover.** Every constraint here is per table, so the schema lint must enumerate every schema and every partition or it reports green over the ones it never visited |

**A fold over stored rows is permitted; a fold over a message history is
banned.** Those two read as a contradiction, so state it once: `M-38` recommends
deriving a balance from durable, ordered rows inside one transaction domain,
which is a query. A repo's asynchronous-handoff rules ban state rebuilt from a
**message** stream, where ordering, retention and redelivery are the
transport's to define. Same word, different mechanism, opposite verdict.

### The two bans

Neither shape is bad engineering. **Both are ungateable *here*, which is a fact
about this organisation and not about the technique.** Each carries its ground,
the org fact it rests on, the fact that no independent panel argued the other
side, and the condition that reopens it.

**A money value computed by a trigger, a rule, or a generated column —
banned.**

- *Ground.* The effect fires from no written call, and its arithmetic is
  invisible to every check in this group and in `M-1` … `M-9`: the stored value
  simply differs from what the money module would have produced.
- *The org fact it rests on.* No human reads the code line by line — so nobody
  notices that the two disagree, in a repo where nobody read either one.
- *No panel.* The case against this shape was written by whoever rejected it. No
  independent reviewer argued the other side.
- *Reopens when* a store's generated-column expression can be driven by the same
  golden corpus as application money math — then it is gated rather than
  invisible.

**A money amount inside a document or JSON column — banned.**

- *Ground.* A JSON document has one number type; the corpus default serializes
  an amount into it as a floating-point number, which is `M-12`'s rejected
  alternative one layer down. A document column defeats every constraint in this
  group at once: no scale, no per-field `NOT NULL`, no check constraint, no
  currency pairing.
- *The org fact it rests on.* Those constraints are the only gate on a stored
  amount, and no reader compensates when they are absent.
- *No panel.* Same as above — rejected and argued by the same person.
- *Reopens when* the store enforces a committed schema over the document, with
  an exact-decimal type per field that a schema lint can read.

## Markers, dates, and what they mean

`M-10` and `M-11` are from the 2026-07-21 founding pass. **`M-30` … `M-43` and
the composite-shape table are the 2026-07-29 pass, which had no panel** — see
the ceiling stated at the top of this file.

- **primary-source verified** — one researcher checked the claim against the
  vendor's own documentation, with no panel. Whatever its evidentiary strength,
  this is **not** *confirmed*; running the panel is what would promote it.
- **convention** — defensible practice no independent source confirms. Kept
  because it is cheap, enforceable, and fails toward safety.
- **confirmed** — appears exactly once in this file, on `M-10`'s scale-4 clause,
  and it comes from the earlier pass.

**The lapse rule.** These rules were last re-dated for a review by
**2027-01-21** — governed by the oldest unrefreshed pass, deliberately not moved
to 2027-01-29 by the persistence pass, because that would have re-leased
twenty-nine rules nobody re-checked. Past that date the one **confirmed**
marker reads as **convention** until a new pass re-dates it.

**Read this group as a layer that was missing and is now covered thinly, not as
one that is finished.** It closed no gap in `M-1` … `M-29`, and it added
residues of its own: `M-35`'s blind spot on runtime-assembled query text,
`M-37`'s inability to see a value written by a system outside the repo, and
`M-40`'s dependence on a second rule set agreeing.

The vendor quotations, the dated claims, the citations that did not survive, and
the conditions that reopen a decision are in [evidence.md](evidence.md).
