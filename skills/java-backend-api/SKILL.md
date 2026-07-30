---
name: java-backend-api
description: The HTTP contract rules for a Java backend on Spring Boot Web MVC — one committed OpenAPI document that CI regenerates and diffs, keyset pagination with sealed cursors, RFC 9457 problem responses through one advice with a compile-checked error-code catalog, URL-major versioning, strong ETags with a guarded version-column update, and RFC 3339 wire temporals. Offset and page-number pagination, PATCH and JSON Merge Patch, header or date version pipelines, code-first with nothing committed, response envelopes and HATEOAS, and free-form error JSON are banned by name, each with the check that fails the build. Load before adding or changing an endpoint, a request or response field, a list or paging parameter, an error shape, a cursor, or the API version — and before wiring the contract's generation, lint, diff or fuzz gates.
---

# Java backend — the HTTP contract rules

**These rules bind when the backend exposes an HTTP API described by an OpenAPI
document.**

**Where no such document exists, what goes dormant is a set of gates rather than
a set of rules, and the split is worth knowing before reading on.** Dormant: the
regenerate-and-diff job, the normalizer, the single-OS byte-identity check, the
conformance-fuzz oracle, the breaking-change diff, the one-file-per-major CI file
check, and **all five vacuum lints** — the problem-schema assertion over declared
error responses, the no-offset-parameter rule, the declared `limit` maximum, the
temporal naming-and-format agreement, and the no-`PATCH` operation rule. Those
five are the same five *Wiring the gates* step 2 enumerates; if this list and that
one ever disagree, that one is the build and this one is wrong. Still live,
because ArchUnit or a test hosts them: the
keyset pager and its offset-target ban, the guarded version-column update, the
cursor sealing, the list-response shape, the error-code catalog and its snapshot,
the one-advice rule and its leak test, the wire-temporal serialization tests, the
`@PatchMapping` ban, and the strong-`ETag` test.

**Two directives sit in neither list, and neither is an oversight.** *The pager is
the one carve-out from a synthetic-id sort ban* is dormant on a **different**
condition — whether this repo bans `ORDER BY` on a synthetic id at all — and says
so inline. And *the API version is a URL path segment* splits: its
one-file-per-major half is in the dormant list above, while its ban on a
request-time version-transformation pipeline is spec-and-review and holds with or
without a document.

**The contract is machine-read.** No human reads the generated handlers, and the
committed document is the only place a contract change becomes visible. That is
the whole reason this area has its own gates rather than a review convention.

This skill is one of three for this stack, and a repo exposing an HTTP API
installs all three:

- **`java-backend-rules`** — the platform constitution. The persistence, the
  transaction seam, the concurrency model, the runtime-silent ban list, and the
  test toolchain. **Install it with this skill**: several directives below are
  built in the shape of a rule that lives there — the codegen-diff job, the
  ArchUnit predicate style, and the excluded generated packages — and **six of the
  rules below are ArchUnit bans hosted on that skill's ban-list test class**, the
  six enumerated in *Wiring the gates* step 5.
- **`java-backend-observability`** — logging, metrics and alerting. The
  correlation id that the generic internal problem response carries is only
  useful if it retrieves a log event, and **that rule lives there, not here.**

**There are no rule ids here, and that is deliberate.** Each directive is a
`###` heading, and that heading is how it is cited — *the single conformance
oracle*, *the keyset pager*, *the PATCH ban*. Nothing in this skill set numbers
these rules, so a number invented here would resolve only for a repo that
installed this skill; a skill name plus a subject resolves either way.

## The marker ceiling, before the rules

**Every directive here comes from one pass, on 2026-07-25, and that pass ran a
single researcher against primary sources with no panel.**

**That pass nonetheless wrote *confirmed* against many of its claims, and the
word cannot mean what it normally means.** Confirmed normally means a claim
survived three independent refutation votes; **no vote was ever cast in this
area.** What it means on every marker below is *checked against a published
standard or against vendor documentation by one researcher*. **That usage is the
pass's own and is carried here rather than silently re-marked** — re-grading
someone else's verdict is not what converting it does — but read every
*confirmed* in this skill as a documentation check, and treat the distinction
between it and *primary-source verified* here as one of source quality rather
than of scrutiny.

The pass also harvested from a prior architecture decision record and its topic
research. **That is prior art, not independent confirmation**: it means another
repo made the same call, which is weaker evidence than it reads as.

What follows from this, concretely: **the tool facts are well sourced and the
policy choices are not.** That a given linter gates on its exit code, that the
breaking-change differ exits non-zero on breaking changes, that merge-patch
treats null as delete — those are checked. That an over-cap `limit` should be
rejected rather than clamped, that `PATCH` should be banned repo-wide rather
than used carefully, that the error catalog should be snapshotted — those are
this rule set's calls, marked convention, and **each one deliberately overrides a
framework or industry default.** Read the marker beside the rule before treating
it as settled.

The whole set is `review-by` **2027-01-21**. **Past that date every *confirmed*
marker here reads as *convention*** until a new pass re-dates it, with no
maintainer action needed.

Status tier: **decided, not yet validated** — researched and decided, with **no
production use yet** behind the enforcement shapes.

## The premise

**Code is written by LLM agents and no human reads it line by line.**

Plus the condition this area adds: **the backend exposes an HTTP API described
by an OpenAPI document.** Both halves are load-bearing. A verdict is portable
exactly as far as its premise, and in a repo where a human reviews every
endpoint diff, the regenerate-and-diff gate and the error-catalog snapshot drop
from mandatory to merely useful.

**One more condition applies to exactly one directive and is stated there**: the
breaking-change diff binds only where a contract crosses the build boundary —
where a consumer that is not rebuilt in the same pull request binds to it.

## The defaults these rules override

The picks an unbriefed agent statistically makes. **Naming the loser is the
load-bearing half.**

- **Offset and page-number pagination** — the corpus-default paging. Rejected:
  under concurrent inserts and deletes between page fetches it **silently skips
  and duplicates rows**, producing a wrong-but-plausible page no reader catches.
  Keyset with a unique final tiebreak has no such anomaly. Page-number is offset
  internally, so it loses for the same reason.
- **`PATCH` with JSON Merge Patch** — the corpus-default partial update.
  Rejected: the standard gives a `null` member the meaning **delete this
  field**, so a merge-patch body silently drops a field instead of setting it.
- **A header or date versioning pipeline** — the corpus-admired scheme, and the
  one Stripe is famous for. Rejected: it selects the applied
  contract per request from an ambient input and rewrites the response back
  through runtime version-change modules — a runtime-silent transformation — and
  **the version never appears in the committed contract**, defeating
  regenerate-and-diff. URL-major keeps each version a diffable committed file. A
  second scheme, GitHub's, is date-and-header-versioned too but ships **separate
  dated contracts with no transformation modules**; that is not the shape being
  rejected.
- **Code-first with no committed document** — introspecting the running app and
  serving the spec live, with nothing committed. Rejected: with no committed
  artifact **there is no diff to gate and no stable oracle for the fuzzer.** The
  pick is code-first generation *with* the normalized document committed and
  diff-gated.
- **Response envelopes and HATEOAS** — a `{data, meta}` wrapper, `_links`
  hypermedia. Rejected: an absent human reader changes nothing about their
  stakes, so neither earns its place under this premise, and both add surface an
  agent must keep consistent for **no machine-enforced payoff.** The list shape
  is the flat `{items, nextCursor}`; navigation is the cursor, not embedded
  links.
- **Free-form error JSON** — ad-hoc `{error: "..."}` bodies per endpoint.
  Rejected: a machine consumer plus a model review **cannot adapt to divergent
  shapes a human would.** One problem shape through one advice, with a stable
  machine code, is the contract.
- **Integer minor units for money on the wire** — the Stripe and Adyen style.
  Rejected because it **exports exponent arithmetic to every consumer**, and a
  mishandled exponent is a silent 10× or 100× error; exponents vary by currency
  and processor tables deviate from the ISO register — Adyen for CLP, CVE, IDR and
  ISK, PayPal for HUF.
  **The directive that decides this is not here** — it is `M-12` in the
  `money-api` skill, and the widening of it to *every* decimal field, not only
  money, is `M-15` there. See *What is here and what is elsewhere*.

## What is here and what is elsewhere

Three things a reader will look for in this skill and not find.

- **The rule that every decimal-valued field on the wire is a string** — rates,
  percentages and FX factors, not only money amounts — **is `M-15` in
  `money-api`, and there is no general directive for it here.** The consequence
  is worth stating plainly: **a repo that installs this skill and not the money
  skills has no decimal-string rule at all**, including for a rate or percentage
  field that carries no money. The rules that decide the wire form of a decimal
  are filed under money, and the widening to every decimal field is filed there
  too. If this repo has a rate field and no money feature, state the rule in the
  repo's own text and own it there.
- **The money-path refinements of two directives below.** The conformance-fuzz
  gate's money edge cases are `M-19` in `money-api`, and the conditional-request
  precondition becomes **required** rather than merely honored on a money-path
  mutation — that is `M-18` there, which reuses the same version column as *the
  guarded version-column update* below and says explicitly that a repo with no
  general rule of that kind must state one. **This skill is that general rule.**
- **The correlation id's other half.** *One advice builds every error body*
  requires the generic internal problem to carry only a correlation id. That is a
  dead end unless the id retrieves a log event, and the rule requiring it to is
  in `java-backend-observability`.

## The document

### One committed OpenAPI document, generated and diffed

**The API contract is one OpenAPI 3.1-or-later document, generated from the code
and committed to the repository.** CI regenerates it and fails the build on any
diff against the committed copy — **the diff is the contract review.**

*Bespoke — a regenerate-and-diff CI job, in the shape of the jOOQ codegen-diff
rule in `java-backend-rules`. The specification facts are **confirmed** — a
3.1-or-later document is itself a JSON Schema a fuzzer can validate against,
which is what makes the document usable as an oracle (2026-07-25). **OpenAPI's
dominance is convention** and self-referential.*

### One hand-owned canonical normalizer

**The committed document is written through one hand-owned canonical
normalizer** — recursive key sort, pinned array-element order, LF line endings,
trailing newline. **The generator's own ordering is not trusted as stable,
including any order-by-keys option it offers.**

*Bespoke — the normalizer. **Primary-source verified 2026-07-25**: the
springdoc's output ordering is non-deterministic run to run, and its
`writer-with-order-by-keys` flag is documented as insufficient. Re-pin springdoc
at adoption.*

### Authoritative generation runs on one operating system

**One operating system in CI produces the artifact of record; a document
regenerated on any other OS is not it.** The gate regenerates **twice**, under
varied timezone and locale, and fails unless both regenerations and the
committed copy are byte-identical.

*Bespoke — the CI generation job, pinned to one container. **Convention**,
2026-07-25. The general non-determinism is verified; **the specific cross-OS
reference-ordering claim is uncertain and must not be cited as confirmed** — the
issue behind it was closed as not reproducible. The rule is kept because
byte-identity is cheap to assert and a flapping diff gate is worse than a strict
one.*

### The committed document is the single conformance oracle

**A spec-derived generator builds requests from this document and runs them
against the running app** — booted in a throwaway container — **checking
response-schema conformance, 500s on edge inputs, validation bypass, and
stateful sequences.** It runs against **one synthetic tenant with deterministic
generation and a pinned seed**, so the case set is reproducible and **never
retried**. **No second spec-independent conformance suite is added.**

*Schemathesis — off-the-shelf tool, bespoke wiring. The tool's capabilities are
**confirmed** 2026-07-25, including that deterministic generation plus a pinned
seed give reproducible runs. **Those two configuration keys are specific to the
4.x line** — re-verify them if the pin moves.*

**This is the general home of the contract-conformance fuzz gate.** The money
rules extend it and **add no second tool**: `M-26` in `money` is the money-side
obligation that the gate exists, and `M-19` in `money-api` is the money edge-case
input set it must cover. One gate, one tool, two sets of inputs.

**Why the gate exists at all is a reasoning step, not a tool fact, and it is
marked convention:** one model wrote both the specification and the
implementation, so self-authored tests share the blind spot, and a generator
that derives cases from the document does not. **The zero-retry rule is this rule
set's own governance choice**, not a precondition the tool imposes.

## Errors

### Every error response is a problem document

**Every error response is an RFC 9457 `application/problem+json` document,
produced only through one exception advice; hand-built error bodies anywhere else
are banned.**

*Off-the-shelf host — Spring's `org.springframework.http.ProblemDetail` plus
`ResponseEntityExceptionHandler`; an ArchUnit ban on constructing an error body
outside the advice, with a per-repo predicate; a vacuum lint asserts every
declared error response uses the problem schema. **Confirmed** 2026-07-25: RFC 9457 is
Standards Track, obsoletes RFC 7807, and requires unknown extension members to
be ignored — which is the property that makes a machine `code` additive. **Do not
cite RFC 7807 as current.** The framework hosts it off the shelf, also
confirmed.*

### One advice builds every error body

**One `@RestControllerAdvice` extending Spring's `ResponseEntityExceptionHandler`
is the only place error bodies are built.** An unknown throwable becomes a
**generic coded internal problem carrying only a correlation id**; the exception
message, the class name and the stack **never reach the wire.**

*Bespoke — a leak test throws a sentinel-message exception and asserts the
message is absent from every response body. The funnel is Spring's and is
confirmed; **the no-message-leak guarantee rests entirely on that bespoke test**
— convention, 2026-07-25.*

### Every error carries a code from one compile-checked catalog

**Every error carries a stable machine code drawn from one compile-checked
catalog enum,** emitted as a problem extension member with a **typed-params
record at the throw site**. Clients integrate against the code, **never against
`title` or `detail` prose.** Ad-hoc error strings are banned.

*Bespoke — an ArchUnit ban on inline wire-code string literals where it reaches
source; the committed catalog snapshot below is the standing gate. **Convention**,
2026-07-25.*

### The catalog is snapshotted and diffed

**Commit a snapshot of every `(code, HTTP status, param-names)` triple and diff
it each build.** The error catalog is **API surface a structural OpenAPI diff
cannot see**: a code added, removed or re-typed becomes a git-visible
re-approval.

*Bespoke — a snapshot generated from the enum, diffed each build. **Convention**,
2026-07-25.*

**One honest correction to that reasoning, worth keeping because the shortcut is
tempting.** `(code, param-names)` associations **are** expressible in OpenAPI if
each problem type gets its own schema, and a structural diff would then catch
them. What has **no** native OpenAPI construct is the catalog-level
`code → status/params` invariant **when the body is a generic problem and the
catalog is an enum** — which is the shape this skill specifies. So the rule is
right for this modeling and would be redundant under a different one.

## Lists and paging

### Keyset pagination only

**List results paginate by keyset (seek) only.** Every paginated query orders by
a **deterministic total order** — the requested sort columns with the primary key
appended as the final tiebreak — and reads the next page with a `WHERE` clause on
the last row's sort values, **never a row-count offset.** **One owned
`KeysetPager` is the only class that renders a paginated query.**

*ArchUnit — off-the-shelf host. **The predicate must ban every offset-emitting
target**: `offset(...)`, the two-argument `limit(offset, count)` overloads,
`SelectQuery.addOffset`, and the two-argument `addLimit`. Generated jOOQ packages
excluded, and the pager scoped, per repo. Both halves **confirmed** 2026-07-25 —
the offset skip-and-duplicate anomaly and keyset's immunity given a unique
tiebreak, and that the query builder emits offset through **several** targets, so
**a naive one-method ban reports green while offset stays writable.***

**Precision that matters when someone tests this:** keyset is **not** a
snapshot. An inserted row still appears on a later page. The property that is
confirmed is only the skip-and-duplicate immunity, and only given a unique total
order.

### No offset parameter in the contract

**No `offset`, `page` or `pageNumber` request parameter appears in the
contract.**

*vacuum lint — off-the-shelf host, bespoke ruleset. That vacuum can ban a
named request parameter is a **confirmed** capability, 2026-07-25; the ruleset
that does it is authored per repo. **Where no OpenAPI document exists this
directive has no gate at all, and the offset-target ArchUnit ban above is the
only thing standing between the repo and offset pagination.** The rule about the
contract goes dormant with the contract; the rule about the query does not.*

### `limit` has a default and a hard maximum

**`limit` carries a default and a hard maximum; a request above the maximum is
rejected with 400, never silently clamped to the cap.**

*Bespoke — a validation test posts `limit = cap + 1` and asserts 400; where an
OpenAPI document exists, the lint asserts the parameter declares its maximum.
**Convention**, 2026-07-25 — a fail-loud choice, because a silent clamp is an
invisible adjustment. **This deliberately overrides the framework's own
default** — `spring.data.web.pageable.max-page-size` clamps — **and Google's
AIP-158**, which says to coerce down. The reject side has prior art at Salesforce,
which rejects a page size above 1000. **Do not cite Stripe either way — its
documentation is silent on over-cap behaviour.***

### Cursors are opaque, sealed, and carry their sort spec

**Cursors are opaque and integrity-sealed, and encode the sort spec they were
issued for.** A cursor that fails its integrity check, **or whose sort spec no
longer matches the request**, is rejected with 400 — never decoded into a
best-effort seek. **Clients never construct or mutate a cursor.**

*Bespoke — a parse-rejection test on tampered and stale-sort cursors; the
conformance-fuzz gate additionally sends malformed cursors. **Confirmed
enablement, bespoke construction**, 2026-07-25.*

**Three caveats the wording is chosen around.** "Opaque" and "integrity-sealed"
are **distinct**: an HMAC gives integrity, not confidentiality, and true opacity
needs the payload to be non-parseable or encrypted — so a base64 blob with a MAC
is sealed but not opaque, and saying otherwise overstates it. Rejecting with 400
is a **should**, not a must; a graceful reset is a legitimate alternative this
rule set declines. And **no standard specifies cursor pagination at all** — the
exact construction is the repo's own design.

### The list response shape

**A list response is `{ items: [...], nextCursor: <string> | null }`.**
`nextCursor` is **null only on the last page**, and a non-null cursor **always
fetches a further page.** No total count by default; a count is a separate opt-in
endpoint.

*Convention, 2026-07-25 — the shape is generic; **the null-means-end contract is
the fail-loud part**, and it is the half worth testing.*

### The pager is the one carve-out from a synthetic-id sort ban

**If this repo bans `ORDER BY` on a synthetic id column, the `KeysetPager` is
the one carve-out:** it may append the primary key as the **final tiebreak key
only**, never as a leading sort.

*Convention — **dormant where no such ban exists**; the exemption is scoped to
the one pager class by ArchUnit. 2026-07-25.*

## Wire temporals

### Instants on the wire

**Instants on the wire are RFC 3339 date-time, serialized in UTC with the `Z`
designator, and their field names end `At`.** The wire type is
`java.time.Instant` through **one pinned time module**, so a non-UTC offset and
an epoch-number timestamp are both **unwritable**. Numeric or epoch time never
appears.

*Bespoke — the pinned serialization time module plus a serialization test.
**Confirmed** 2026-07-25: RFC 3339 date-time carries a mandatory offset, `Z`
means UTC, and interoperability is best with UTC. The reason a number is banned
is also confirmed — **JSON numbers have no guaranteed precision**, with binary64
the interoperability baseline and integers exact only within roughly ±2^53.*

### Business dates on the wire

**Business dates on the wire are strict `uuuu-MM-dd`, and their field names end
`Date`.** The wire type is `java.time.LocalDate` parsed strictly, so **a value
carrying a time component fails to parse and returns 400** — a datetime is never
silently narrowed to a date across time zones.

*Off-the-shelf — strict `ISO_LOCAL_DATE` on a `LocalDate` field rejects trailing
text, and the stack maps the parse failure to 400; a deserialization test pins
it. **Confirmed** 2026-07-25 for the rejection; **the 400 comes from the Spring
and Jackson stack, not from `java.time` itself.** The
`uuuu`-versus-`yyyy` era rationale is **uncertain** — strict parsing holds
either way, so re-verify only if the exact pattern is pinned in the repo.*

### Temporal naming and declared format agree both ways

**Lint the committed document so that `format: date-time` implies a name ending
`At` and a name ending `At` implies `format: date-time`, and the same for
`format: date` and a name ending `Date`.**

*vacuum lint — off-the-shelf host, bespoke ruleset. **Convention**, 2026-07-25.
**The lint governs the contract's internal consistency, not runtime
strictness**: in JSON Schema 2020-12 `format` is an annotation rather than an
assertion by default, so runtime strictness comes from the typed parser above and
never from the `format` keyword. Reading a green format lint as runtime
validation is this rule's specific misreading.*

## Versioning and change

### The API version is a URL path segment

**The API version is a URL path segment (`/v1`), and one OpenAPI file is
committed per major version.** A version is a **diffable committed file, never a
runtime pipeline**: request or response transformation that selects or rewrites
the applied contract per request from a header, a date or an account setting is
**banned.**

*Convention plus a CI file check — one committed file per major; the
transformation-pipeline ban is spec and review. 2026-07-25. The mechanism behind
the ban is **confirmed** from Stripe's own engineering write-up — the
rejected scheme really does select the contract from an ambient input and rewrite
responses through runtime version-change modules.*

### `PATCH` is banned on every endpoint

**`PATCH` is banned on every endpoint.** JSON Merge Patch reads a `null` member
as **delete this field**, so a `PATCH` body silently drops a field instead of
setting it. Cover update with **full-replace `PUT` under a precondition** — see
*the guarded version-column update*. **Reopen only by a recorded decision.**

*Off-the-shelf — a vacuum lint permits no `PATCH` operation, plus an ArchUnit ban
on `@PatchMapping`. **The null-means-remove fact is confirmed**
2026-07-25 against RFC 7396; **the categorical repo-wide ban is convention**
built on it. The narrower JSON Patch standard lacks the footgun, but merge-patch
is the corpus-default body, which is why the ban is categorical rather than
per-format.*

### Breaking-change diff where a contract crosses the build boundary

**Where a contract crosses the build boundary** — a consumer that is not rebuilt
in the same pull request binds to it — **run a breaking-change diff against the
last released document each build and fail on any incompatible change:** a
removed path or field, a narrowed type, a dropped enum member, a newly-required
response field. **Changed semantics ship as a new endpoint beside the old, never
as a mutation of the released one.** A contract regenerated atomically with its
only clients needs no such gate — **the client compile is the check.**

*oasdiff, `breaking --fail-on ERR` — off-the-shelf. **Confirmed** 2026-07-25 for
the exit behaviour. **Precision:** `--fail-on ERR` is a no-breaking-change gate,
not literally an additive-only gate — warning-level changes pass. The
per-change approve-and-reject commit-status flow is the vendor's hosted service,
**not the free CLI.** The **scope** — gating only the cross-boundary surface — is
**convention**; the prior-art repo ran the full-document diff internally too.*

**A related tool was evaluated and dropped, and the reason is a re-open
trigger.** A binary-and-source compatibility differ for JVM artifacts is a real,
maintained, build-breaking gate — and it adds nothing in an atomically-built
repo, because a source-incompatible change to an in-repo API type **already
fails the consuming module's compile.** It is named in
[evidence.md](evidence.md) with the trigger that would adopt it.

## Concurrency on the wire

### The guarded version-column update

**One owned helper is the only construct that renders an `UPDATE` on a
version-columned table:** it sets `version = version + 1` guarded by
`WHERE id = ? AND version = ?`. **Zero affected rows is a signal, not a
no-op** — re-read, then return **412** if the row moved to a newer version and
**404** if it is absent; a blind overwrite is **never** applied. A hand-written
`UPDATE` on a versioned table does not pass the architecture test.

*ArchUnit — off-the-shelf host; the versioned-table predicate is authored per
repo, in the shape of the transaction seam and the pager. Generated packages
excluded. **Confirmed mechanism** 2026-07-25 — a guarded update affects zero rows
when the row is stale or absent, and **treating zero rows as a no-op is the named
lost-update failure.** **The 412-versus-404 split is convention and needs a
re-read**: zero rows alone cannot distinguish stale from absent, which is why the
directive says re-read first, and returning 404 for absent is a governance choice
rather than a standard's requirement.*

### Strong ETags, and when the precondition is honored

**GET and mutation responses on API-mutable resources carry a strong `ETag`,
never a weak `W/` validator** — `If-Match` uses **strong comparison**, so a weak
validator would **silently fail every precondition.** `If-Match` is honored on
any mutation where a client supplies it.

*Convention — a response-header test asserts strong ETags; honored-when-present
is spec and review. 2026-07-25. The comparison semantics are **confirmed** from
RFC 9110 — `If-Match` uses strong comparison, a false precondition yields 412,
and `If-Match` never matches a weak validator.*

**Where the precondition becomes *required* rather than honored, and 428 is
returned when it is absent, is a money-path rule** — `M-18` in `money-api`,
which reuses this same version column. **A repo with no money feature has no
required-precondition rule**, which is the correct scope: this directive makes
the precondition work, and the money rules make it mandatory. The
precondition-required status code is defined by RFC 6585, not RFC 9110.

## Wiring the gates

**Run this once per repo, in the first pull request that exposes or changes an
HTTP contract.** These directives are two kinds welded together:
instinct-overrides that fire while an agent is writing an endpoint, and build
gates that have to exist in the repo. **The gate is what catches the next
agent**, and an unwired gate is a rule described as enforced that is not.

1. **The regenerate-and-diff job** — springdoc, pinned to the line matching the
   Spring Boot major, writing through the hand-owned normalizer, run
   in **one** pinned container, **twice** under varied timezone and locale, with
   the committed document required to be byte-identical to both.
2. **The vacuum lint** — one host, and all five rulesets for it are **bespoke**: no
   offset or page parameter, no `PATCH` operation, `limit` declares its maximum,
   every declared error response uses the problem schema, and the temporal
   naming-versus-format agreement in both directions.
3. **The breaking-change diff**, `--fail-on ERR`, **scoped to the surface whose
   clients are not rebuilt in the same pull request.** If nothing crosses the
   build boundary, record that this gate is deliberately absent and that the
   compile is the check — do not wire it and describe it as protecting an
   internal contract it adds nothing to.
4. **The conformance-fuzz job** — Schemathesis against the app booted in a
   throwaway container, one synthetic tenant, deterministic generation and a
   pinned seed, **retries off**. If the money skills are installed, this is also
   where their edge-case input set runs; **it is not a second job.**
5. **ArchUnit rules**, on the same test class the platform ban list uses: the
   error-body-construction ban, the inline wire-code literal ban, the
   patch-mapping ban, the offset-target ban with **every** offset-emitting target
   enumerated, the pager scoping, and the versioned-table update predicate.
   **Generated packages excluded** throughout.
6. **The error-catalog snapshot**, generated from the enum and diffed each build.
7. **The leak test** — a sentinel-message exception, asserting the message,
   class name and stack are absent from every response body.
8. **The serialization and deserialization tests** for the wire temporals, and
   the pinned time module they depend on.
9. **The validation test** posting `limit = cap + 1` and asserting 400, and the
   **cursor parse-rejection tests** for a tampered cursor and a stale sort spec.

**Then record what was wired and what was skipped, with the reason.** These are
the entries **nothing above gates**, and each must be listed as ungated:

- **That `If-Match` is honored wherever a client supplies it.** The strong-ETag
  half has a test; the honored-when-present half is spec and review.
- **The version-transformation-pipeline ban.** The one-file-per-major half has a
  CI file check; that no request-time contract rewriting exists is spec and
  review.
- **The list response shape's null-means-end contract**, unless a test actually
  asserts that a non-null cursor fetches a further page and a null one is the
  last.
- **The 412-versus-404 split**, which rests on a re-read the helper performs and
  which no static check can verify.
- **The single-seam discipline for the pager and the update helper** — ArchUnit
  scopes them; that they are the *only* such constructs depends on the predicate
  being complete.
- **The decimal-string rule, if the money skills are not installed.** There is
  no general one here. Say so rather than leaving the wire-format area reading as
  covered.

**A record that lists only what was wired reads as complete coverage.** That is
the failure this step exists to prevent.

## Named gaps — where no check reaches

Silence reads as coverage, so each is stated.

1. **No decimal-string directive exists in this skill.** The rule covering every
   decimal field is filed under money, so a repo with a rate or percentage field
   and no money feature is uncovered by this skill set — see *What is here and
   what is elsewhere*. **The rejected-alternatives record for this stack asserts
   that the contract rules extend the string-decimal choice to every decimal
   field; the general contract directives do not carry that rule.** This gap was
   found while writing this skill, not inherited from a pass.
2. **A structural contract diff cannot see the error catalog** — which is why the
   snapshot exists — and **the snapshot in turn cannot see anything the enum does
   not model.** A code whose meaning changes while its status and params stay
   identical passes both gates.
3. **The conformance fuzzer's coverage is the document's coverage.** It derives
   cases from the committed document, so a behaviour the document does not
   describe is not fuzzed, and an endpoint absent from the document is invisible
   to the one gate that would otherwise catch a 500 on edge input.
4. **The cross-OS byte-identity claim is uncertain.** The gate is kept because
   byte-identity is cheap; the specific cross-platform ordering defect it was
   originally justified by was not reproducible.
5. **Cursors are sealed, not opaque**, unless the repo additionally encrypts the
   payload. A client can read the sort spec and the last-row values out of a
   base64 cursor; it cannot forge one.
6. **Keyset pagination is not a snapshot.** Rows inserted after the first page
   appear on later pages. Nothing here provides a consistent point-in-time list,
   and a consumer that needs one needs a different mechanism.
7. **vacuum's rulesets are bespoke in every case.** The host is off the shelf;
   every one of the five rules it runs here was authored, so a rule nobody wrote
   is a rule nobody is protected by, and vacuum passes either way.
8. **A colon-verb routing lint is deliberately absent.** A silent mis-route
   mechanism for Google AIP-136's `{id}:verb` request paths was identified but
   **not verified against the pinned Spring version**, so no vacuum lint ships for
   it. A bare 404
   makes the untested case fail loud, which is why leaving it out is acceptable —
   see the re-open trigger in [evidence.md](evidence.md).

## Markers, dates, and what they mean

Confidence, per claim: **confirmed** means the claim survived three independent
refutation votes against primary sources on the date it states — in this area
that status comes from published standards and vendor documentation checked by
the pass, not from a refutation panel, because **this pass ran none.**
**Primary-source verified** means one researcher checked it against a primary
source with no panel. **Convention** means the research did not, or could not,
confirm the claim from independent sources; the rule is kept because it is
enforceable, cheap, and fails toward safety. **Uncertain** means a claim was
examined and left unsettled, and nothing here rests on one.

Enforcement, per rule: **off-the-shelf** means a tool does it with
configuration; **bespoke** means the check must be written; **convention** means
a human or an agent asserting it is all there is.

**The lapse rule:** past `review-by` **2027-01-21**, every *confirmed* marker in
this skill reads as *convention* until a new pass re-dates it, with no maintainer
action needed.

| Claim | Marker | Date |
| ----- | ------ | ---- |
| A 3.1-or-later document is a JSON Schema a fuzzer can validate against | confirmed | 2026-07-25 |
| OpenAPI's dominance as a contract format | convention | 2026-07-25 |
| springdoc's output ordering is non-deterministic run to run | primary-source verified | 2026-07-25 |
| The specific cross-OS reference-ordering defect | uncertain — do not cite | 2026-07-25 |
| The conformance fuzzer's capabilities, determinism and seed keys | confirmed (keys are 4.x-specific) | 2026-07-25 |
| Promoting the fuzz gate from money-only to general | convention | 2026-07-25 |
| RFC 9457 obsoletes RFC 7807 and requires unknown members to be ignored | confirmed | 2026-07-25 |
| The framework ships the problem type and the exception funnel | confirmed | 2026-07-25 |
| The no-message-leak guarantee | convention (rests on a bespoke test) | 2026-07-25 |
| The error catalog is invisible to a structural contract diff | convention (the diff's scope is confirmed) | 2026-07-25 |
| Offset skips and duplicates; keyset is immune given a unique tiebreak | confirmed | 2026-07-25 |
| The query builder emits offset through several targets | confirmed | 2026-07-25 |
| Rejecting an over-cap `limit` with 400 | convention — overrides Spring Boot's clamp default | 2026-07-25 |
| Cursor tamper and stale-sort rejection | confirmed enablement, bespoke construction | 2026-07-25 |
| RFC 3339 instants, JSON number imprecision, strict local-date parsing | confirmed | 2026-07-25 |
| The `uuuu`-versus-`yyyy` era rationale | uncertain | 2026-07-25 |
| Merge Patch treats a null member as delete | confirmed | 2026-07-25 |
| The categorical repo-wide `PATCH` ban | convention | 2026-07-25 |
| The rejected versioning scheme rewrites responses at runtime | confirmed | 2026-07-25 |
| The breaking-change differ's exit behaviour | confirmed | 2026-07-25 |
| The scope of the breaking-change gate | convention | 2026-07-25 |
| A guarded update affects zero rows when stale or absent | confirmed | 2026-07-25 |
| `If-Match` uses strong comparison and never matches a weak validator | confirmed | 2026-07-25 |
| The 412-versus-404 split | convention — needs a re-read | 2026-07-25 |
| The flat list-response shape, and the pager carve-out | convention | 2026-07-25 |

The ground behind each claim — with its source — the claims that must **not** be
cited, and the conditions that reopen a rule are one hop away in
**[evidence.md](evidence.md)**.
