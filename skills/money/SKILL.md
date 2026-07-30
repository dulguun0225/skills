---
name: money
description: Money-grade rules for code that holds or computes an amount of money, in any language — one money type, exact-decimal arithmetic, rounding named at every call site, fail-loud money paths, the telemetry a money effect emits, and the evidence gates money code carries. Load before adding or changing a field, a payload, a computation, a rounding step, or a test that carries an amount of money, and before picking a money library. States the kind of check each rule needs; the tool is named in the matching stack skill (money-java).
---

# Money-grade rules

Nineteen directives, `M-1` … `M-9` and `M-20` … `M-29`. Each states the
**kind** of check it needs. No tool is named here, because no tool is portable
across languages — the tool is named in the stack skill.

## The premise these rules are conditioned on

**Code is written by LLM agents and no human reads it line by line, and a
feature carries an amount of money the system computes with** — payments,
billing, ledgers, lending.

Both halves do work. A wrong cent is a defect with a victim; with nobody
reading the code, a wrong cent stays invisible until someone outside the
system complains. A verdict is portable exactly as far as its premise: in a
repo where a human reads every money change line by line, several rules below
drop from mandatory to merely advisable. Where that is the case, say so and
carry the burden of saying it — do not silently drop the rule.

The rules bind from **the first feature that carries an amount of money the
system computes with**. Before that they are dormant, not absent.

## What is here and what is not

- **This skill** — the money type, arithmetic, rounding, the fail-loud rule,
  the telemetry a money effect emits, and the evidence gates.
- **`money-api`** — money on the wire and over an HTTP API (`M-12` … `M-19`).
  `M-26` below names `M-19` as the money cases its fuzz gate must cover, so
  the two skills are read together.
- **`money-java`** — the same rules with Java, Spring Boot MVC, jOOQ and
  PostgreSQL tools named, plus the one-time gate wiring. Install it in a repo
  on that stack; without it, every rule here has a check kind and no tool.
- **`money-storage`** — the store boundary (`M-10`, `M-11`, `M-30` … `M-43`):
  how a money column is declared, what the store must refuse on write, what it
  may not compute, and how a stored row becomes a money value. **Nothing in
  this skill reaches a column type, a query, or a migration**, so install
  `money-storage` in any repo that durably stores an amount. Five rules there
  exist because of rules here — `M-30` reintroduces what `M-7` bans and `M-1`
  rejects, `M-32` covers the class `M-5` exists for, `M-35` is `M-2` over query
  text, `M-40` needs `M-20`'s event, and `M-41` needs `M-25`'s worked example.

## The defaults these rules override, by name

An agent told "use a money type" still drifts to the corpus default. These are
the defaults, and why each lost:

- **Binary floating-point for money** — `float`, `double`, a JSON number, a
  float column. The corpus default by a wide margin, and wrong at the first
  sub-minor-unit result. Banned at four separate layers, because it re-enters at
  each one: the field (`M-2`), the wire (`money-api`, `M-12`), the column
  (`money-storage`, `M-10`), and a **cached copy** of an amount, which is owned
  by the published `caching` skill — install it in any repo that caches an
  amount, because no rule in the money skills reaches a serializer that turns a
  stored amount back into a binary float.
- **A raw decimal for an amount** — an exact decimal type with no currency
  beside it. Rejected by `M-1`: no check can tell which raw decimal holds an
  amount, so a rule scoped to "amounts" is undecidable by the check meant to
  enforce it and reports green over exactly the case it exists to stop. That
  is why `M-2`'s ban on exact-decimal arithmetic outside the money module is
  unqualified.
- **A repo-wide default rounding mode** — the convenient pick, rejected by
  `M-7`. One default silently applies one jurisdiction's rule to another
  jurisdiction's computation, and nothing in the code reads as wrong.
- **Rounding each part when splitting a sum** — the obvious implementation,
  rejected by `M-8`: the parts stop summing to the whole.
- **Reaching for a money library, unexamined** — *not* rejected. The
  evaluation is real and it is per-ecosystem: a library that binds amounts to
  the ISO 4217 minor-unit scale satisfies much of `M-1` natively, while one
  that also ships precision-losing operations on the same public type weakens
  `M-1`. Do the evaluation for the ecosystem in hand and record it. The Java
  evaluation is in `money-java`.

## What to do when this skill fires

1. If the repo has no money type yet, the first money feature builds one
   (`M-1`) before it computes anything. Do not open with a decimal field.
2. Name the money module. Every rule below that says "outside the money
   module" needs that boundary to be one named place.
3. For each rounding step, name the mode at the call site and write the worked
   numeric example into the spec (`M-7`, `M-25`).
4. Record in the plan or spec that these rules bind this feature (`M-29`).
5. Wire the gates. This skill states check kinds; a kind with no tool is a
   wish. On Java, `money-java` names the tools and has the wiring section.

## Money

**M-1 — One money type: an exact decimal amount plus an ISO 4217 currency,
constructed only at that currency's minor-unit scale.** Excess precision is
rejected at construction, never silently rounded. One type, so a check can
find every amount in the repo; the currency inside it, so no amount travels
without one.
*Type design plus a property test. Convention, 2026-07-21.*

**M-2 — All arithmetic on amounts goes through the money type; exact-decimal
arithmetic outside the money module is banned, whether or not the value is an
amount.** The ban is unqualified on purpose. No static rule can tell which
exact-decimal value holds an amount, so a ban scoped to amounts is not
decidable by the check that enforces it and reports green over exactly the
case the rule exists to stop. Binary floating-point on money — field, column,
or wire — is a defect.
*Static rule for the module boundary; compiler or linter check for the float
ban; **`M-10`'s schema lint in `money-storage` covers the column case**, which
no check in this skill reaches. Convention, 2026-07-21.*

**M-3 — Same-currency addition and subtraction are exact: they never round and
take no rounding mode.** Both operands sit at the currency's minor-unit scale,
so their sum or difference does too. Rounding enters only where an operation
produces a sub-minor-unit result — multiply by a rate, divide, percentage —
which names its mode at the call site (`M-7`).
*Property test: same-currency ± is exact and associative. Confirmed
2026-07-25 — scoped to ± only, deliberately not extended to multiply or
divide.*

**M-4 — Cross-currency arithmetic fails loud. There is no implicit
conversion.** A conversion is a rate applied at a named call site, not
something addition does on the way past.
*Type design, exercised by the money type's tests. Convention, 2026-07-21.*

**M-5 — On a money computation path a caught exception fails loud.** It
propagates or is re-thrown as a coded error — never swallowed, never
logged-and-continued to a wrong result, never mapped to a default, zero, or
absent amount. A silent catch turns a loud failure into a wrong number, and a
wrong number on a path nobody reads is invisible forever. Logging the cause
and then re-throwing a coded error is the intended shape, not a violation.
*Spec-and-review; not fully statically decidable. A partial compiler or linter
check on the empty-catch case only is usually available and is wired where it
is. Convention, verified 2026-07-25.*

**M-6 — Rates, factors, and percentages are not money.** Separate types,
higher precision, rounded only at the moment they produce a payable amount. A
rate carried as money is rounded to the minor unit before it is ever applied.
*Static rule. Convention, 2026-07-21.*

## Rounding

**M-7 — There is no repo-wide default rounding mode.** Every rounding names
its mode at the call site, and the operation's spec states the rule with a
worked numeric example. A repo default puts the decision outside the call that
depends on it, where no reader of that call can see it.
*Spec-and-review. Convention, 2026-07-21 — the finding under it, that no
surveyed jurisdiction mandates one method, is confirmed for the surveyed
regimes only; see [evidence.md](evidence.md).*

**M-8 — Splitting a sum uses an allocation that conserves the total**
(largest-remainder or equivalent). Parts are never rounded independently.
*Property test stating conservation. Convention, 2026-07-21.*

**M-9 — Where amounts can be negative, the spec states whether "round up"
means away from zero or toward positive infinity.** Jurisdiction texts and
language libraries disagree on negatives, so the phrase alone decides nothing.
*Spec-and-review. Convention, 2026-07-21.*

## Observability

**Binds additionally when nobody watches the running system between
incidents.** This is a second condition, not the premise above: the premise is
about who reads the code, this is about who watches the running system. Treat
it as holding unless the repo can name who watches — these rules were written
where the operator is invoked in sessions and nobody is watching between them.
A repo with a staffed rota keeps the emission rules, which are code rules, and
re-decides its alerting rules against how its rota actually works.

**M-20 — Every money effect emits one catalog event carrying the correlation
id, the amounts, the currency, and the rounding mode applied** — entity ids
only, never customer personal data. A wrong cent has to be reconstructable
from telemetry alone, because nobody reads the code that produced it.
*Catalog entries plus a test asserting the event on every money-mutating path.
Convention, 2026-07-27.*

**M-21 — The coded error that `M-5` requires is a catalog event with its own
alert rule,** so a money computation that failed is a signal rather than a gap
in a log. This makes `M-5` observable; it is not a second rule.
*Alert rule plus its fire-test. Convention, 2026-07-27.*

**M-22 — The standing invariants (`M-28`) alert at the paging severity, and
staleness pages too.** A check that stopped running is indistinguishable from
one that would have failed.
*A last-run-timestamp gauge per check, and a fire-test on the staleness rule
as well as on the breach rule. Convention, 2026-07-27.*

## Evidence gates

These are the outside checks. After implementation, a model reviewing model
output shares the implementer's blind spots, so a gate whose ground truth
comes only from tests the same model wrote proves nothing about
plausible-but-wrong output. Each gate below draws its ground truth from
outside that model: a schema-derived fuzzer, a human-approved corpus, an
invariant over real data, or mutation testing that probes the tests
themselves.

**M-23 — Mutation testing gates the money modules.** The mutation score is the
ceiling above the repo's general coverage floor; the threshold is the repo's
call, stated in the repo's own text. Coverage says a line ran; a mutation
score says a test would have noticed it change.
*Mutation gate. Off-the-shelf in most stacks — a stack with no maintained
mutation tool says so rather than leaving the rule to read as enforced.
Convention, 2026-07-21.*

**M-24 — Money math carries property tests:** construction rejects excess
precision, allocation conserves the total, rounding stays within one minor
unit.
*Property test. Convention, 2026-07-21.*

**M-25 — Every change to money math carries a worked numeric example in its
spec and a golden test reproducing it.** The example is what a human can check
at the one gate a human reads; the golden test is what stops the next change
from moving the number quietly.
*Golden test. Convention, 2026-07-21.*

**M-26 — Contract conformance is fuzzed, not assumed:** requests built from
the committed schema are sent to the running app. **The money edge cases it
must cover are `M-19` in the `money-api` skill** — this gate is where they
run.
*Conformance fuzz. Convention, 2026-07-25.*

**M-27 — Money paths carry a characterization replay.** A committed corpus of
realistic inputs is recomputed end to end and the full output compared
byte-for-byte against committed, approved output files; any unapproved diff
fails the build, so every numeric change becomes a git-visible re-approval.
Precondition, asserted in CI: generation is deterministic — injected clock,
pinned locale, stable ordering — regenerate twice and require byte-identical
output.
*Characterization replay. Convention, 2026-07-21.*

**M-28 — The domain's standing invariants (the trial-balance-equals-zero
class) run in production on a schedule.** A breach, or a stale run, alerts
(`M-22`). Tests gate what CI runs; invariants catch what only real data does.
*Production invariant. Convention, 2026-07-21.*

**M-29 — The plan or spec that introduces the first money-carrying feature
records that these rules bind it.** Not the arming mechanism — this skill's
description is what fires when an agent is about to add an amount, and it
fires without anyone remembering to re-read anything. What `M-29` adds is that
the decision is written down at the one gate a human reads, so the choice to
adopt or diverge is visible there rather than only in the code.
*Spec-and-review at the plan approval gate. Convention, 2026-07-21.*

## Markers, dates, and what they mean

Every directive above carries a confidence marker and a date:

- **confirmed** — survived three independent refutation votes against
  independent sources, on the stated date.
- **primary-source verified** — one researcher checked it against a primary
  source, with no panel. Not *confirmed*; running the panel is what promotes
  it.
- **convention** — defensible practice the research did not or could not
  confirm from independent sources. Kept because it is cheap, enforceable, and
  fails toward safety. Most of this set is convention, and that is stated
  rather than dressed up.

**The lapse rule.** These rules were last re-dated for a review by
**2027-01-21**. Past that date every **confirmed** marker reads as
**convention** until a new research pass re-dates it. This needs no
maintainer action: read a lapsed rule as written.

One directive here is confirmed (`M-3`). The rest are convention. The sources,
the dated claims, the citations that did not survive, and the conditions that
reopen a decision are in [evidence.md](evidence.md).
