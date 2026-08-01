---
name: primary-keys
description: How a row is identified, and what that identity may never be used for — rank key candidates by the surfaces the id lands on rather than by index size, treat a key an outsider can enumerate as a volume disclosure and a forced retrofit, count the manual steps each key mechanism costs a data move because sequences do not replicate and counter rows do, apply one mechanical rule with a computed table classification instead of per-table judgment, check the anti-UUID cost folklore against your own engine because the classic numbers are UUIDv4 numbers and the fat-key-multiplies-every-index claim is InnoDB lore, ban ORDER BY on any id column because a time-ordered key is monotonic per generator and not across a pool, keep the opaque key and the human-facing business number as two identifiers with disjoint namespaces, put the generator default in the schema and the banned generator beside it, give pure-child tables their parent's key plus a sequence, and remember the key is what survives erasure. Carries one repo's UUIDv7-everywhere verdict as its worked case, with bigint identity, the bigint-plus-external-id hybrid and TSID recorded as losers with the ground each lost on. Load before creating a table, choosing or changing a primary key, putting an id in a URL, a log line, a payload or an export, writing an ORDER BY over an id column, or moving tenant data between databases.
---
# Primary keys — what identifies a row, and what that identity may never mean

**Two halves.** Directives portable — hold on any relational store, any language.
Worked case = one repo's verdict, dated **2026-06-12**, with the candidates it
rejected and the ground each lost on. Worked case there as *evidence the criterion
discriminate*, not recommendation to copy the verdict.

**Central claim, and it what the rest hang on: key type is decided by the surfaces
the id land on, not by what it cost to store.** URL, log line, wire payload,
export file, replication stream, escape-hatch store. Index size is real and it is
the last input, not the first.

## The marker ceiling, before anything else

**Everything here is *convention*.** Source = one org's architecture decision
records, 2026-06-12. **Records carry no per-claim confidence marker and cite no
primary source for any claim in them** — including the ones most worth citing:
engine behaviour, a benchmark, an RFC mandate.

- **Central claim is *uncertain*, not convention.** One repo decided this way;
  none decided the other way for comparison, and no key strategy in this set has
  been observed at volume. Argument, with no outcome behind it.
- **This record do name an adversarial structure, and that worth stating precisely
  because sibling skills here could not.** Its own status line record a three-way
  evaluation — a UUIDv7-everywhere steelman, a bigint-identity steelman, and a
  hostile audit of the hybrid and TSID options — and grounds per loser are written
  down. **It still cite no primary source**, and `tech-decision-research` grade
  *confirmed* on refutation votes cast **against primary sources**. So: better
  provenance than an undocumented preference, and still convention.
- **Lapse rule vacuous here, stated not hidden.** Past `review-by` every
  *confirmed* marker read as *convention* with no maintainer action; nothing here
  above convention, so the rule demote nothing. Stated cuz every sibling carry
  `review-by` and silence read as omission. **Cost: nothing make this skill's age
  visible** — and the engine facts below are the fastest-decaying claims in it.
- **No date invented.** Directive carry date of the record that ground it. Where a
  directive state something no record wrote in that form, date is the conversion
  date **2026-08-01** and the directive say so.

Status tier: **decided, not yet validated** — researched and decided, **no
production use yet** at the volume that would test it.

## The premise, and the one thing it make irreversible

**Code written by LLM agents. No human read it line by line.** Every sibling skill
state this. Two consequences specific to keys:

- **The maintainer debug from text.** Its whole sensory channel is committed text
  plus what the build print. An id that is ambiguous in a log line — `42` exist in
  every table and every tenant — cost this maintainer more than it cost a human
  with a debugger attached.
- **Per-table judgment is session-drift.** A key rule that say "surrogate here,
  natural there, depending" is re-decided every session, differently.
  `ai-maintainer-principles` own that ground as *One idiom, imposed mechanically*;
  it is why the directives below insist the classification be **computed**, not
  reasoned about.

**And the thing that make this decision unlike the others in this set: it is
effectively irreversible once real data exist.** The key leak into every table,
every generated database class, every URL an integrator signed against, every log
line, every export. There is no migration that change it quietly. **Decide it
before the first table, and record the decision where the next session read it** —
which is why this skill's description is written to fire at `CREATE TABLE`, not
after.

## Choosing the key

### Rank key candidates by the surfaces the id lands on

**Enumerate the surfaces the identifier reach before comparing candidates, and
score each candidate per surface.** The list is not generic — it is this repo's:
URL of any API an outsider integrate against, log line the maintainer grep, JSON
or wire payload, analytics or export file, replication stream between databases,
and any escape-hatch store the design have already named as a possible future
home.

**This is the criterion, and the reason it beat the obvious one.** Storage cost is
a number anyone can produce, so it dominate the discussion by default. It is also
the input least likely to decide anything: it is bounded, measurable and
recoverable. The surface inputs are unbounded and irrecoverable — an id published
in a sold API cannot be withdrawn, and a key mechanism that cannot cross a
replication stream become a manual checklist that must be right every time.

Candidate that win on every surface but one, where that one is a surface with an
outside party on it, **have not won**.

*Check: written selection record enumerating the surfaces this repo have and each
candidate's behaviour on each. Convention as enforcement — written artifact, absence
visible, cannot catch a surface nobody listed. **Convention**, 2026-06-12.*

### A key an outsider can enumerate is a disclosure you cannot take back

**Where row ids appear in an API sold to or integrated against by outsiders, a
densely sequential key publish volume and growth rate to every holder of two ids.**
Two invoices a week apart bracket a count. That is the signal a random or
high-entropy key do not carry, and it is commercially sensitive in most businesses
and regulated in some.

**The trap is that the fix is not a fix — it is a second identifier.** Repo that
pick a sequential key and later need opacity on the exposed tables end up adding an
external id to precisely those tables: two identifiers, two indexes, two grep
namespaces, translation at every edge, forever. **That is the hybrid, arrived at by
accident rather than chosen**, and it is a rejected candidate in the worked case
below for reasons that do not improve when it is reached late.

*Check: contract lint over the committed API document — no path template bind an id
parameter whose backing column is a densely sequential type. Bespoke; where no
committed document exist this have no gate at all and is review-only.
**Convention**, 2026-06-12.*

### Count the manual steps each key mechanism costs a data move

**Before adopting a key mechanism, ask what a copy of this data into another
database require of a human, and count the steps.** The asymmetry that decide it
in a PostgreSQL logical-replication move: **counter rows replicate as data;
sequences do not.** Logical replication carry table rows, so a sequence's current
value arrive at zero and must be reset by hand, per sequence, per move, before the
target take writes.

Consequence stated as arithmetic rather than as taste: a schema whose numbering
run on sequences owe one `setval` per sequence on every move, and a schema with
none owe zero. **Zero is a different kind of number than a small one** — a
single-digit checklist still have to be executed correctly at cutover by an agent
that have never done it before, and a checklist with no items cannot be executed
wrongly.

This generalise past PostgreSQL: **any key mechanism whose state live outside the
rows** — a sequence, a broker-assigned block, a node id baked into a generator —
is state that must be moved by a second procedure. Prefer the mechanism whose
entire state is the data.

*Check: grep the committed migrations for sequence-creating DDL (`CREATE SEQUENCE`,
`serial`, `bigserial`, `GENERATED ... AS IDENTITY`), and a written move procedure
whose reset step is enumerated rather than assumed. **Off-the-shelf** for the grep;
convention for the procedure. **Convention**, 2026-06-12.*

### One mechanical key rule, and the exceptions are computed

**State one key rule for every table, and make each exception to it a
machine-decidable classification rather than a judgment call.** "Surrogate key
generally, natural key where it makes sense" is not a rule — it is a decision
re-made in every session by an agent reading one file.

The shape that work: the default apply to every table, and a table fall into an
exception class **only if a check can prove it does** from committed artifacts. The
worked case's pure-child test is the model — no other table declare a foreign key
to it, and its rows appear in no API URL except as a sub-path of its parent. Both
halves are derivable, from the foreign-key graph in `information_schema` and from
the path templates in the committed API document. Neither half is an opinion.

**Where an exception cannot be computed, it is not an exception — it is the
default with a comment.**

*Check: CI job classifying every table from the foreign-key graph and the committed
API document, and failing on a table whose declared class disagree. Bespoke — the
classifier is per repo, and the API-document half have no host where no document
exist. **Convention**, 2026-06-12.*

### Check the key-cost folklore against your own engine

**The received costs of a wide key are mostly true of a different key and a
different engine, and both errors run in the same direction.** Two specific
corrections, both stated by the source record and both worth re-verifying against
your own engine's documentation before you pay or refuse to pay:

- **The classic anti-UUID performance numbers are UUIDv4 numbers.** A random key
  scatter inserts across the whole index and generate full-page-image write-ahead
  log storms — the record put that at roughly twenty times the log volume. A
  time-ordered key insert at the right edge instead, and the record's own
  controlled benchmark had UUIDv7 and bigint tied on insert throughput, at
  3,420 against 3,480 transactions per second. **Applying the v4 numbers to a v7
  key is the single most common error in this decision.**
- **"A fat primary key multiplies every secondary index" is InnoDB lore.** It
  hold where secondary indexes carry the primary key as their row pointer. In
  PostgreSQL secondary indexes point at heap tuple identifiers, so the claim is
  false there. **Engine-specific, and the wrong engine's rule will be applied by
  default**, because the corpus an agent reason from is not weighted toward yours.

What the record left as the real cost, once the folklore is subtracted: primary-
and foreign-key index entries roughly a quarter to two fifths larger, and about
eight more bytes of heap per key column. **That is a cost, and it is the one to
argue about.**

*Check: the selection record name which cost claims were checked, against which
engine's documentation, on what date. **Convention**, 2026-06-12 — and the
benchmark is the record's own, run by the pass, **not reproduced here**.*

## What the key may never mean

### A time-ordered key is not an ordering

**Ban `ORDER BY` on any id column.** A time-ordered key is monotonic **per
generator**, not globally. PostgreSQL 18's native `uuidv7()` is monotonic per
backend; across a connection pool it is not. Any generator with a sub-millisecond
counter have the same shape — the counter is per producer.

**The failure mode is why this is a ban and not a caution.** `ORDER BY id` is
correct in a single-connection test, correct in local development, correct in the
integration suite, and wrong under a pool in production, silently, on the rows that
happen to interleave. Nothing in the result set is malformed. It just is not in the
order somebody assumed.

**Business ordering come from explicit columns** — a business date, a line number,
a posting sequence. Where the domain have an ordering the design care about, say so
in writing as a **named non-property of the key**: *id order is not posting order*,
recorded so no future session discover the correlation and quietly depend on it.

**One carve-out, and it grant determinism rather than meaning.** A keyset
pagination helper may append the row's key as the **final** tiebreak of its sort,
so cursors are gapless. Four constraints, each enforced:

1. At least one declared business sort column precede it — **the tiebreak is never
   the leading key.**
2. The id never appear in any API sort vocabulary, and cursors are opaque and
   sealed, so no client can observe or request id order.
3. The exemption is scoped to **that one pager class**; an `ORDER BY` touching an
   id column anywhere else remain a build failure.
4. The documented response order is the business ordering; **the relative order of
   ties is an explicit non-promise** in the contract.

*Check: architecture test banning id columns in `ORDER BY` targets, with the
exemption scoped to the single pager class by name; contract lint asserting no id
in any declared sort enum. **Off-the-shelf** host (ArchUnit), predicate authored per
repo. **Convention**, 2026-06-12.*

### A key is never a capability and never a secret

**Holding an id must never be what authorizes access to the row.** RFC 9562 state
this for UUIDs outright — they are not a security mechanism, and unguessability is
not an authorization control. The rule is wider than the format: it hold for a
random key, a hashed key, and a key nobody thinks is guessable.

**A time-ordered key disclose its row's creation instant, in milliseconds, to
anyone who hold it.** Decide that deliberately rather than discover it. In most
designs it is contractually redundant — every resource already publish a creation
timestamp — and it leak no counts or rates, which is the disclosure a dense
sequential key make. Where a resource class genuinely must hide its creation time
from its own holder, **that is a business-identifier question**, answered by giving
that class a second, non-time-bearing identifier — not by changing the key
strategy for every table.

*Check: per-endpoint authorization probe asserting a valid id from another tenant or
another principal return the same response as an id that never existed —
byte-identical, no existence oracle. **Off-the-shelf** as a test; the probe matrix
is authored per repo. **Convention**, 2026-06-12.*

### The opaque key and the human-facing number are two identifiers

**A row's key and the number a person read out over the phone are different
identifiers with different jobs, and neither may do the other's.** The key is
opaque, machine-scoped, and the target of every foreign key. The business number —
account number, loan number, voucher number, document number — is short, checkable,
issued under a stated format, and **never a primary key and never a URL
identifier**. It is a filter, a display value and document text, behind its own
unique index.

Three rules that follow, and each of them is a defect somebody shipped:

- **The grep namespaces stay disjoint.** Logs carry keys; the business number is the
  human and API handle. One identifier appearing in both roles make every search
  ambiguous.
- **Parsing meaning out of a business number is banned** — in code, in reports, in
  any pluggable extension. A number is a birth fact: a closed branch's code live on
  in old account numbers forever, and the current branch is a column. Every
  "just parse the prefix" is a bug with a delay fuse.
- **Renumbering is banned, in writing.** Numbers are immutable, never reused, never
  reassigned, and **stored exactly as issued** — canonical form, no separators;
  display grouping is rendering.

**Where an ordering over business numbers is wanted, persist the ordering columns
beside the rendered string** and sort on those, never on the string and never on
the key.

*Check: schema check that no business-number column is a primary key or a foreign-key
target and that each carry a unique index; lint banning substring or pattern reads of
a number column outside its own rendering module. Bespoke. **Convention**, 2026-06-12.*

## Generating it

### The schema default is the backstop, and the banned generator is named beside it

**Declare the key column with the generator as its column default, so a row written
by ad-hoc operator SQL cannot carry a wrong-version or null id.** The application
is not the only writer — a migration, a repair script and a session at a database
prompt all write rows, and none of them go through application code.

**And name the wrong generator, banned, in the same place.** In PostgreSQL that is
`gen_random_uuid()`: a version-4 random key, the exact scatter the time-ordered
choice exist to avoid, and **the function an agent reach for by default** because
it is the one the corpus is full of. `enforceable-rules` state the general form as
*Distrust what the agent picks* — name the favourite and ban it, never a bare "use
the good one".

**Check your engine version before assuming the default exist.** Native `uuidv7()`
is a PostgreSQL 18 function. A repo pinned to an older major have no native
generator at all, and its key column's default is a gap that must be named rather
than assumed away.

*Check: grep over committed migrations for primary-key column shape and for the
banned generator by name; gate on exit code. **Off-the-shelf** as a migration grep,
patterns authored per repo. **Convention**, 2026-06-12.*

### Exactly one application-side producer, adopted rather than hand-rolled

**Where the application assign ids itself, exactly one utility produce them, it
wrap a maintained library rather than a hand-written bit layout, and a golden test
pin the layout it emit.**

Application-side assignment is worth having, and the cases are specific: batch
inserts that would otherwise pay a round trip per row to read the key back;
idempotent-create endpoints where the client supply the id and the key's own unique
index do the deduplication; and any escape-hatch store the design have named whose
API mandate client-generated identifiers.

**Hand-rolling the layout is the trap.** A key format is a bit layout with a
timestamp field, a counter field and a version nibble, and it is exactly the kind of
subtle code an unreviewed agent write confidently and wrongly.
`ai-maintainer-principles` own that ground as *A hand-built subtle piece ships with
a safety argument and a stress test* — and the honest reading here is that the
build-versus-buy answer is **buy**, so the obligation is discharged by adopting a
maintained implementation instead of taking it on. **A candidate key format with no
maintained generator on your stack is asking you to hand-build a subtle piece**,
and that is a cost against the candidate, not a detail.

*Check: architecture test that exactly one type construct key values and nothing else
call a generator; golden test asserting the emitted bit layout — version field,
timestamp field, monotonic counter. **Off-the-shelf** hosts, both predicates authored
per repo. **Convention**, 2026-06-12.*

## Where a surrogate key is the wrong shape

### A pure child takes its parent's key plus a sequence

**A detail table that nothing else reference and that no URL address independently
take a composite natural key — parent key plus an ordinal — and no surrogate at
all.** Both halves of the test are computed, per *One mechanical key rule* above:
no foreign key declared to it anywhere in `information_schema`, and no path template
in the committed API document addressing its rows except as a sub-path of the
parent's.

**The payoff is largest exactly where the cost of a wide key is largest.** The
highest-volume table in a system is usually a pure child — journal lines, order
lines, ledger legs — and under this rule it carry no key column of its own, no
generator, and a primary-key index that **is** its dominant access path rather than
a second structure beside it. The precedent is old: document number plus line
number is how the enterprise accounting systems have keyed line items for decades.

**Its URL follow the same shape** — the child address by its natural key under the
parent's path, never by an id of its own.

*Check: the classification job above, plus a schema check that a table classed pure
child declare a composite primary key and no surrogate column. Bespoke.
**Convention**, 2026-06-12.*

### An externally governed code is already a key

**Where an outside authority own the code space and guarantee its stability —
ISO 4217 currency codes, ISO 3166 country codes, and reference data of that
shape — the code is the primary key.** Adding a surrogate beside it buy nothing:
the code is already short, already stable, already the value every join and every
payload carry, and the surrogate become a second identifier for the same thing.

The condition is **externally governed**, not merely unique-looking. An internal
code somebody promise not to change is not this case.

*Check: reference tables enumerated in the schema record with the governing standard
named per table. Convention — written artifact, absence visible. **Convention**,
2026-06-12.*

### A library's own tables keep the library's key

**Tables a third-party library create and own — a migration tool's history table, a
scheduler's task table, an event-registry or session store — keep whatever key
shape that library ship, and are out of scope of this repo's rule.** Fighting a
library's own schema is a maintenance cost with no return.

**The rule that make that safe: no domain table declare a foreign key into one.**
Without it the exception spread — a library table become a join target, then a
constraint target, and the repo now depend on a schema its own migrations do not
own.

*Check: foreign-key graph assertion that no table outside the library-owned set
reference one. **Off-the-shelf** as a schema query, the owned set listed per repo.
**Convention**, 2026-06-12.*

## The edges every key type pays

### Ids cross the wire as strings whatever the key type is

**Serialize ids as strings on every wire, and do not book that as a cost of the
wide key.** It is a cost of JSON. A 64-bit integer id corrupt silently in a
JavaScript consumer past 2^53, and an OpenAPI `format: int64` map to a
JavaScript `number` by default in the common generators — so a numeric key have to
be a string on the wire too, or it is a silent-truncation defect waiting for a
large enough id.

**Export formats are the second edge, and this one is honest uncertainty.**
Columnar formats have a UUID logical type whose support across writers and readers
is uneven. Until it is verified end to end in the actual export toolchain, a key
render as its 36-character text form in exports — **which is a real size cost, and
it belong in the cost column rather than in a footnote.**

*Check: contract lint asserting every id field declare a string type, and a
round-trip test through the actual export toolchain before any logical-type claim
is made. **Off-the-shelf** for the lint where a committed contract exist.
**Convention**, 2026-06-12.*

### The key is what survives erasure

**Under a right-to-erasure regime the key is usually what remain.** Where a record
is linked to something that must be retained — a ledger, a contract, a statutory
window — the lawful answer is anonymization rather than deletion: personal columns
overwritten with typed tombstones, contact and identifier child rows deleted, and
**the key retained as the pseudonym** that keep the retained rows joinable.

Two consequences for the key itself:

- **The key must contain no personal data and must not be derivable from any.** A
  key computed from an email address, a national identifier or a name is not
  pseudonymous after erasure — it is the erased data, encoded.
- **The key is what appear in places the erasure sweep cannot reach**: object-storage
  paths, external audit trails of the storage provider, anything already exported.
  So object keys and log lines carry the key, **never a name** — a naming scheme
  that embed a human-readable identifier put personal data in a control-plane log
  nobody owns.

**One interaction the source records do not state, added here and marked as this
conversion's own.** A time-ordered key retain the row's creation instant *after*
anonymization, so a repo whose erasure story lean on the key as pseudonym have
retained one more fact than it may have intended. In most designs that is
acceptable and already published — but it is a decision, and no record read for
this skill made it.

*Check: schema record naming the erasure class per table and the retained-identifier
set; grep asserting object-storage key templates and log field sets carry the key and
no name field. Bespoke. **Convention**, 2026-06-12 — except the time-ordered-key
clause, **2026-08-01, conversion-dated**.*

## The worked case — one repo, 2026-06-12

**One org's verdict, listed as evidence the directives above discriminate. Not a
template.** That repo is a single multi-tenant financial backend on PostgreSQL,
agent as sole maintainer, whose REST API is a sold product banks integrate against
and whose tenants move between database cells by logical replication.

**The verdict: every table's surrogate key is `id uuid NOT NULL DEFAULT uuidv7()`.**
Pure children take a composite natural key instead. Standards-defined codes stay
natural. Library tables keep their own. Sequences banned everywhere — `serial`,
`bigserial`, `GENERATED ... AS IDENTITY`, `CREATE SEQUENCE` — with sequential
business numbers implemented as transactional counter rows in the tenant schema,
so a tenant move carry **zero** sequence-reset obligations.

### The candidate list and the ground each lost on

| Candidate | What it won on | What it lost on |
| --------- | -------------- | --------------- |
| **UUIDv7 everywhere** *(winner)* | one mechanical rule; no sequence state to move; unambiguous in a grep across tables and tenants; client-assignable, which the named escape-hatch store (TigerBeetle behind a posting seam) require | index and heap size, and 36-character ids in every URL and log line |
| **bigint `GENERATED ALWAYS AS IDENTITY` everywhere** | smallest indexes — roughly a quarter less footprint on hot tables; best token ergonomics in logs; loud failure modes; per-schema sequences isolate tenant id spaces hermetically | **the sold API**: raw sequential ids in URLs are enumerable and leak volume and growth, forcing an external-id retrofit later anyway. Plus a two-to-four-hundred-sequence reset obligation per tenant move, log-wide id ambiguity, string serialization needed regardless, and an id-remapping layer at the escape-hatch seam at the worst moment |
| **Hybrid — bigint key internally, uuid `external_id` on API-exposed roots** | the strongest-sounding compromise, and its table-classification problem **is** solvable mechanically by the same document-derived ratchet | its enforcement core — an internal-id wrapper type with no JSON serializer — **collide with the repo's own outbox**: cross-module events legitimately carry internal ids, so the rule become serialization-context-dependent, two DTO tiers with scoped bans, and "which context is this DTO in" is the standing judgment call the constitution forbid. Also keep bigint's per-move sequence obligation, double identifier bookkeeping forever, and pay the wide-key cost anyway on precisely the API-visible tables |
| **TSID / Snowflake, 64-bit time-sorted** | eight bytes **and** time-sorted — the only candidate that get both | node-id coordination is a hand-wired per-deployment obligation whose failure mode is **silent key collisions on the money path**; the libraries on that stack are single-maintainer; no native generation in the engine, so the generator is a hand-built subtle piece by that repo's own rule; and near-zero entropy mean a sold API need an external id anyway — **it collapse into the hybrid with worse dependencies** |

**Precedent the pass recorded**, and it is the two-identifier split of *The opaque
key and the human-facing number*: **Mambu**, the closest comparable multi-tenant
core-banking product, key every table with an application-generated UUID and carry
separate short business identifiers. **SWIFT gpi** track every cross-border payment
by a mandated UUID.

### What the choice cost, booked rather than discovered

- Primary- and foreign-key indexes roughly a quarter larger on keyed tables — with
  the heaviest table exempted by the pure-child rule, and per-tenant schemas keeping
  each index tenant-sized.
- Joins single-digit percent larger.
- 36-character ids in every URL and log line.
- Export columns rendering as text until the columnar logical type is verified in
  that toolchain.

### The re-open triggers, and the shape of them

**Named on the winner, and both narrow deliberately:** journal-line read latency
at the 99th percentile degrading past twice the bigint baseline at the projected
ceiling, or a sustained ledger-insert requirement above fifty thousand per second on
a single stream — **either flip only the ledger tables to a named exception behind
the posting seam, never the universal rule.** And separately, a regulatory or
customer-contract prohibition on timestamp-bearing identifiers — none found at the
time — would swap the default for the affected class only.

**What make the first of those executable rather than aspirational, and it is the
part worth copying**: it is measured against a **committed baseline for the losing
candidate**. The bigint number is kept rather than discarded at the moment bigint
loses. A trigger phrased as "if it gets too slow" have nothing to compare against
and never fire.

### What the record do not carry

- **No re-open trigger per loser.** The triggers above are conditions on the
  winner. Nothing state what would make the hybrid or TSID worth re-examining.
  `backend-stack`'s *Record the losers and their grounds* require one per loser, so
  **this worked case half-fail that directive, exactly as `backend-stack`'s own
  does** — and inventing a trigger nobody set would author the pass's verdict rather
  than record it.
- **No primary source for any of it.** The engine behaviours, the write-ahead-log
  multiplier, the RFC mandate, the index-pointer difference between engines are all
  checkable and none are cited.
- **The benchmark is the pass's own**, run at that repo's scale on that repo's
  hardware, and not reproduced anywhere in this skill set.

## Wiring the gates

Run once, in a repo adopting this skill. Record what got wired and what got skipped
with reason — skipped item with no reason read as done by the next session.

1. **Migration grep** — primary-key column shape, the sequence ban, the banned
   random generator by name. Exit code, over migrations in the diff.
2. **Table classification job** — foreign-key graph from `information_schema` crossed
   with the committed API document's path templates; fail on a table whose declared
   class disagree with the computed one.
3. **`ORDER BY` ban on id columns** in the architecture-test host, with the pagination
   helper named as the single scoped exemption.
4. **Contract lint** — every id field declare a string type; no id in any declared
   sort vocabulary; no path template bind a densely sequential id.
5. **Key-producer test** — exactly one type produce key values; golden test pinning
   the emitted bit layout.
6. **Cross-tenant and cross-principal probe** — a valid foreign id return the same
   bytes as an id that never existed.
7. **Generated database classes** — assert the key column's generated type match the
   declared one, and run the generation twice under varied timezone and locale, per
   `guardrails-toolchain`'s *Every committed generated artifact is byte-reproducible*.
8. **Write the move procedure now, with its reset step count**, even if no move is
   planned. A procedure written after the first move is a procedure written under
   pressure.

**Which of these fail a build off the shelf, named rather than counted:** the
migration grep, the `ORDER BY` architecture test, the contract lints where a
committed document exist, the key-producer and golden tests, the probe suite, and
the generated-class assertions. **Bespoke:** the table classification job, and the
move-procedure artifact, which gate nothing by itself.

## Named gaps — where no check reaches

- **No check catch a surface nobody listed.** The criterion is an enumeration, and
  `enforceable-rules`' predicate check is the one most likely to bite here: the
  surface list is given by example — URL, log, payload, export, replication stream,
  escape-hatch store — and a repo with a surface outside it get a green selection
  record and a wrong key.
- **The classification job need a committed API document for half its input.** Where
  none exist, the pure-child test have only its foreign-key half, and the exception
  class silently widen.
- **Nothing verify the ordering non-property.** The `ORDER BY` ban catch the SQL. It
  do not catch application code that read rows in key order from a set and assume it,
  nor a report that sort in memory. The ban is over one construct; the assumption is
  a belief.
- **The benchmark is unreproduced and the engine facts are undated beyond the
  record's own date.** They are the fastest-decaying claims here — a major engine
  release change generator availability, index behaviour and the numbers together.
- **Cost measured on one shape only.** The recorded costs come from one schema at one
  scale. Nothing in this set have measured a key strategy at the volume where its
  re-open trigger would fire, which is the only place the decision is actually tested.
- **No outcome measured anywhere.** One repo decided this way; none decided the other
  way. Central claim marked *uncertain* for exactly that.

## Where the rest of this lives

- **`java-backend-rules`** — the migration and generated-class rules the gates above
  sit on for one stack: committed Flyway migrations, migration lint for lock and
  rewrite hazards, generated database classes regenerated and diffed. **It carry no
  primary-key rule of its own**, which is the gap this skill fill.
- **`java-backend-api`** — keyset pagination and the pager carve-out on that stack.
  Its carve-out directive is written conditionally, on whether the repo ban
  `ORDER BY` on a synthetic id at all. **This skill is where that ban is published**,
  and the condition stay real for a repo that install one and not the other.
- **`async-handoff`** — message identity, and **it is a different identifier from
  this skill's key.** `E-7` require a message identity that is a *deterministic
  function of committed inputs*, so redelivery re-derive the same value. A row key
  is deliberately **not** that — it is assigned once, from a clock and a counter, and
  nothing re-derive it. **Do not carry either rule over to the other**: a
  deterministically derived row key give up the insert locality this skill's verdict
  rest on, and a clock-assigned message identity break deduplication on replay.
- **`money-storage`** — what the money columns of those tables must be, appended
  effect rows, and the guarded update. It constrain the row's contents; this skill
  constrain its identity.
- **`ai-maintainer-principles`** — *One idiom, imposed mechanically*, which is the
  ground under this skill's insistence on a computed classification, and *A
  hand-built subtle piece*, which is the ground under adopting a key generator rather
  than writing one.
- **`guardrails-toolchain`** — which tool may occupy a gate at all, and the
  byte-reproducibility rule the generated-class step above defer to.
- **`backend-stack`** — *Record the losers and their grounds*, the bar this skill's
  worked case is measured against and half-fail.
- **`enforceable-rules`** — *Distrust what the agent picks*, the incompleteness
  checks, and **the enforcement markers and status tier** every check line here
  carry.
- **`tech-decision-research`** — **defines the four confidence markers** every claim
  here is graded in, and the downgrade rule that land all of them at convention.

## Markers, dates, and what they mean

**Every directive is *convention*.** The source record ran a three-way adversarial
evaluation and recorded grounds per loser, which is more structure than most
prior art in this set carry — and it still **cite no primary source for any claim
in it**, so nothing here reach *primary-source verified*, let alone *confirmed*. A
reader who need more must re-verify from the engine documentation and the RFC
directly.

**Central claim — that key type is decided by the surfaces the id land on rather
than by storage cost — is *uncertain*.** Argued, never measured.

**Dates below are the record's, not a verification date:**

| Directive | Date |
| --------- | ---- |
| Every directive under *Choosing the key*, *What the key may never mean*, *Generating it*, *Where a surrogate key is the wrong shape*, and *Ids cross the wire as strings* | 2026-06-12 |
| *The key is what survives erasure*, apart from its final clause | 2026-06-12 |
| The time-ordered-key-survives-anonymization clause of that directive | 2026-08-01 — conversion-dated, stated in the directive |

**Enforcement markers sit beside each check.** The ones carrying an off-the-shelf
host are named rather than counted: the migration grep, the `ORDER BY` architecture
test, the key-producer and golden-layout tests, the authorization probe, the
library-table foreign-key assertion, and the wire-type contract lint. The table
classification job, the business-number checks, the erasure-scheme greps and the
selection and move records are **bespoke or convention**, and each check line say
which.

Evidence, sources, the reading window and the do-not-cite list are in `evidence.md`.
