---
name: backend-stack
description: How to choose a backend stack for a repo whose code is written by LLM agents and read line by line by nobody — rank candidates by what their build can refuse to ship rather than by what they let you express, count the independent enforcement hosts a stack offers rather than its type-system features, prefer a stack where the wrong call cannot be written over one where it is written and then flagged, price corpus gravity as a cost the winner carries rather than a reason it won, and treat operability as a veto rather than as the deciding criterion. Carries this skill set's own worked case, Java with Spring Boot Web MVC, jOOQ and PostgreSQL, with the enforcement-host census that grounds it and the language-layer candidate list — C#/.NET, Kotlin, Go and TypeScript, each with the ground it lost on. Load before picking a language, runtime, web framework, persistence library or database for a new backend, before arguing that an existing stack should change, and before writing a rule set for a stack nobody has justified in writing.
---
# Choosing a backend stack for code nobody reviews

**This skill argue the choice.** Every other stack-shaped skill here —
`java-backend-rules`, `java-backend-api`, `java-backend-observability`,
`money-java`, `caching-java`, `async-handoff-java` — assume choice already made,
state rules that follow. This one say *why* one stack beat another, on criterion
that only apply when no human read code.

**Two halves on purpose.** Criterion portable, and criterion is payload: it
decide Go, .NET or TypeScript question same as it decide this one. Worked case =
Java on Spring Boot Web MVC, jOOQ, PostgreSQL — there as *evidence criterion
discriminate*, not thing to copy. Reader on other stack apply criterion, get own
answer.

## The marker ceiling, before anything else

**Everything here is *convention*.** Read literal — argument below strong, and
strong argument read like verified one.

- **Criterion is this skill set's synthesis of criteria the pass did write
  down.** Platform pass listed five things stack must maximise — compile-time
  error surface, test-ecosystem quality, exact decimal money math, minimal
  operational surface, idiom stability across sessions — and this skill
  generalise first, second and fifth into one criterion. **Generalisation is
  the part nobody checked**: no panel argue other side, no outcome measured, no
  backend built on stack picked by rival criterion and compared. Central claim:
  ranking stacks by build-refusable defects beat ranking by expressiveness,
  velocity or hiring pool for machine-written code. **That claim uncertain, not
  convention** — marked *uncertain* where it appear.
- **Java verdict inherit one date, no markers.** Platform pass ran
  **2026-06-11..14** and its record is dated **2026-06-12**; it recorded
  rejections + grounds at both layers **with no per-claim confidence marker**.
  So *convention* is floor here, not verdict anyone wrote down. Primary sources
  behind those grounds not published here — owed, see *What is recorded and
  what still is not*.
- **Only non-opinion thing here is host census**, and it not research: it grep
  over published skills, dated, stated with its command so anyone re-run it and
  watch it move.
- **Lapse rule vacuous here — stated, not hidden.** Past `review-by`, every
  *confirmed* marker read as *convention* with no maintainer action, and
  **nothing here above convention**, so rule demote nothing. Stated because
  every sibling skill carry `review-by` and silence look like omission. Cost
  real: **nothing make this skill's age visible.** Conversion date
  **2026-08-01** — conversion date, not verification date.

Status tier: **decided, not yet validated** — researched and decided, **no
production use yet** behind criterion as criterion.

## The premise

**Code written by LLM agents. No human read it line by line.**

Every directive below hang on it. This the one skill where dropping premise
don't weaken rules — it **delete them**. If human read every diff, reviewer is
enforcement host, count below is noise, and stack should be picked on velocity,
hiring, operability like normal. Verdict travel exactly as far as its premise;
this one travel no further than first sentence.

**Two things premise not say.** Not say code unowned — someone answer for it in
production. Not say agent careless. It say the *line-by-line reading* that used
to catch defects below is gone, and nothing replace it but build.

## The criterion

### Rank a stack by what its build can refuse to ship

**Deciding question not what stack let you express. Question is what its build
can refuse to ship.** Two stacks that both express correct implementation are
not equal when no human read diff: the one that mechanically reject the wrong
implementation has property the other lack, and under premise it the only
property left standing.

Expressiveness, terseness, velocity, library breadth all describe how easy
*correct* program get written. Under this premise binding constraint is not
that — agent write plausible code at any terseness — it how reliably wrong one
get stopped with no reader. **Stack's ceiling = set of defect classes its build
can name and reject.**

*Check: decision record rank each candidate by defect classes its build reject,
and ranking written before any candidate named winner. Convention as enforcement
— no build host this, check is written artifact, absence visible; record written
after winner picked still pass. Confidence **convention**, 2026-06-11..14.
Criterion itself **uncertain** — no outcome measured against stack picked
another way.*

### Count the independent enforcement hosts, not the type-system features

**Type system is one host. Ask how many independent hosts stack offer, and what
fraction of intended rules each carry.** Stack with strong types but no
architecture-test library, no compiler-plugin surface, no container-test story
is weaker under this premise than raw type comparison suggest, because most
rules a repo need are not expressible as types.

Hosts worth counting are ones that **fail a build**, and they not
interchangeable — each reach different defect class:

- **Compiler**, for what can be type error.
- **Compiler plugin / annotation processor**, for what compiler won't do native
  — nullness, non-loggability, banned API on compile path.
- **Architecture test**, for reachability and layering no type express — which
  package call which, which construct appear where.
- **Bytecode, AST or source-level rule**, for constructs architecture test can't
  see into.
- **Schema, contract or migration lint**, for artifacts that not code.
- **Contract diff**, for changes that compile and still break.
- **Property or fuzz generator**, for input space written test miss.
- **Real-dependency container test**, for behaviour only real engine have.

**Count these, per candidate, before ranking.** Stack missing one entirely has a
rule class it can only carry as convention — and convention is what this premise
strip the reader from.

*Check: decision record list hosts per candidate with named tool for each, and
mark host-less ones as gaps instead of dropping them. Bespoke — record greppable
for tool names, completeness not. **Convention**, 2026-06-11..14.*

### Prefer a stack where the wrong call cannot be written

**Between two stacks that both reject a defect, prefer one that reject it
earlier — at writing, not at building.** Absent method, uninstantiable type,
factory that take no free-text parameter, unreachable constructor: these correct
agent while it write the call. Build failure correct it after, in a run somebody
can be tempted to override.

This is `enforceable-rules`' *unwritable beats banned* principle one altitude up
— platform choice, not rule design. Stated, not restated: **that skill own the
principle and its grounds; this one only say principle discriminate between
stacks, not just between rule designs.** Install `enforceable-rules` for
argument.

Stack property that matter is narrower than "good type system": can a library
author make a call *unrepresentable* — sealed hierarchies, package-private
constructors, absent methods on interface outsider can't implement — and does
ecosystem use that power or route around it with reflection and runtime config.

*Check: for each rule stack must carry, record state whether it land as
type-design constraint or as flag, and count of first category is stated input
to ranking. **Convention**, 2026-08-01 — conversion-dated statement of principle
platform pass did not write in this form.*

### Price corpus gravity as a cost the winner carries

**Idiom LLM generate for a stack by default = that stack's corpus gravity. It
cost, not feature.** Where corpus-dominant idiom is runtime-silent — config that
change behaviour invisibly, annotations whose effect not at call site,
conventions resolved by reflection at startup — every future agent session pull
toward it, and repo pay permanent ban list plus enforcement to make bans stick.

**Asymmetry is what make this decision input, not complaint.** Big-corpus stack
generate more plausible code faster *and* drift harder toward that corpus's
defaults. These don't cancel: first is one-time gain per feature, second is
standing cost at every later session, and second compound while nobody read
diffs.

**Stack may win while carrying heavy gravity cost** — this one did. Criterion
forbid counting big corpus as advantage without booking drift against it, or
finding ban list later and calling it unforeseen tax.

*Check: record name stack's corpus-dominant idiom, state whether it
runtime-silent, and list bans the choice require — before choice final, so ban
list is priced input not discovery. **Convention**, 2026-06-11..14 — platform
pass recorded rejections and grounds; this generalise what it did.*

### Operability is a veto, not the criterion

**Team must be able to run winner in production. That veto over ranking, not the
thing ranked.** Stack nobody present can operate lose no matter how many defect
classes its build reject, because rules protect a system that must be running to
matter.

Veto not criterion, because they give different answers: as criterion it pick
whatever team already run and guardrail question never get asked; as veto it
kill the unrunnable and let guardrail question decide rest. **Under premise
where nobody read code, "we already know it" is not a guardrail.**

Operability facts that veto are concrete, write them per candidate: who ran it
in production, what deployment target already support, what on-call story is,
whether observability rules this set publish can be hosted at all.

*Check: record state operability veto per candidate as fact about *this team*,
not general property of technology, and state it separate from ranking.
**Convention**, 2026-08-01 — conversion-dated narrowing of sentence
`java-backend-rules` used to carry as dominant criterion.*

### A rule set is never a reason to adopt a stack

**Good rule set existing for a stack is not evidence stack is good choice, and
this skill set is not evidence for its own platform.** Reasoning circular in way
easy to miss when rule set is artifact in front of you — fifteen skills on one
stack look like accumulated justification. They accumulated *consequence*.

Sentence survive from `java-backend-rules`, which carried it before this skill
existed. It the reason host census below is stated as **re-runnable grep with a
date**, not as claim: census of this repo's own tool names is evidence about
**Java's enforcement surface** — fact about ecosystem — and *not* evidence
choosing Java was right.

*Check: no directive anywhere in this skill set cite existence of another skill
here as ground for platform choice. Bespoke and unbuilt — grep find citation
shape, not reasoning. **Convention**, 2026-08-01.*

### Record the losers and their grounds, or it is a preference

**Stack decision with no written losers is preference in decision's clothes.**
Name every candidate, why each lost, and condition that reopen it. Losers are
load-bearing half: "we use Java" override no instinct; "corpus default here is
X, rejected because dominant idiom runtime-silent and no host can reject that"
does.

**Matter more for stack choice than for any rule**, because stack is the one
decision every later rule hang on, and the one nobody re-derive. Agent asked to
add a service two years out will read rule sets, infer stack from them, never
see an argument.

**This skill fail half its own directive**, and say so instead of hiding it.
Losers and their grounds recovered 2026-08-01 and stated below; **re-open
trigger per loser never recorded by the pass and not invented here** — see *What
is recorded and what still is not*.

*Check: decision record name each candidate, its ground for losing, and re-open
trigger. Convention as enforcement — check is written artifact, catch omission,
can't catch rationalisation written after fact. Confidence **convention**,
2026-06-11..14.*

### Enforcement-tool maturity is a separate question from runtime maturity

**Ask how old and how maintained the *enforcement* tools are, separate from
language and runtime.** Mature runtime with young or unmaintained guardrail
tooling score worse under this premise than version numbers suggest — rules
hosted by tools, not by runtime.

Questions per host are ordinary and asked about the tool, not the platform: is
it maintained, what release cadence, does it work on pinned language version,
what happen to every rule it carry if it stop. **Stack where one tool host most
rules has single point of failure version numbers don't show** — live condition
here, where one architecture-test library appear in more files than any other
host.

*Check: record date each named host and state which rules die with it. Bespoke
and unbuilt. **Convention**, 2026-08-01.*

## The worked case — Java, Spring Boot Web MVC, jOOQ, PostgreSQL

**Verdict, dated 2026-06-11..14, marked convention.** This section = criterion
applied once. Not recommendation to adopt this stack, and by *A rule set is
never a reason to adopt a stack* it cannot be read as one.

### The candidate list at the language and runtime layer

**Recovered 2026-08-01 from the platform decision's own record, dated
2026-06-12.** That record is the ADR set of the product repository the pass was
run for; **it is not published in this skill set**, so what follow is the
candidate list restated, not a pointer reader can open. Grounds are the pass's,
verbatim in substance; markers are not — pass wrote none, so every line here is
**convention**.

**What the pass was choosing under.** Same premise as this skill — one AI
maintainer, humans never read code — plus its own scoping call that existing
system is capability inventory only, so evaluation ran on **greenfield merit**
and hiring pool counted for nothing.

**Winner — JVM, Java 25 LTS.** Won on verification-platform merit, and every
ground is a host or a fail-loud default, not an expressiveness claim:

- **PIT** = the mutation-testing ratchet against vacuous machine-written tests.
- **Error Prone** = the one platform where *custom* compile-time checks are
  cheap. Pass's own words: when lint is the reviewer, linter extensibility is
  first-order.
- **Sealed interfaces + exhaustive switch** = compiler-checked state machines.
- **`BigDecimal.divide` with no rounding mode throws** — money math fail loud.
- **Spring Modulith** = boundary verification plus a PostgreSQL outbox.
- **Deepest banking-domain corpus** — and see *Price corpus gravity*, which is
  the bill this same fact generate.

**Losers, each with the ground it lost on:**

| Candidate | What it had | Why it lost |
| --------- | ----------- | ----------- |
| **C#/.NET** — close second | Native `decimal`; compile-time project boundaries | Silent zero-defaults on deserialization; **open, non-exhaustive enums**, so state machines are not compiler-checked; commercially drifting outbox landscape |
| **Kotlin** | Better language ergonomics | Mutation testing commercial-or-noisy on Kotlin bytecode; stdlib ship a **silently-rounding `BigDecimal /` operator**; idiom variance hurt fresh-session consistency |
| **Go** | Best explicitness and best ops story of the four | **No maintained mutation testing**; statement-only coverage; pervasive silent zero-values land exactly in money code |
| **TypeScript backend** | — | No enforced decimal type. Disqualified outright for a ledger |

**Two things this list settle about the criterion above, and one it contradict.**
Losers were rejected on **host absence and silent defaults**, not on
expressiveness — which is *Rank a stack by what its build can refuse to ship*
being applied before it was written down. Go lost **despite** best ops story,
which is *Operability is a veto, not the criterion* in practice. The
contradiction: pass **listed** minimal operational surface among things to
maximise, i.e. as a ranked criterion, and this skill demote it to veto. **Pass's
practice support the veto reading, its wording does not.** Stated, not resolved.

*Check: none — this a record of a decision, not a directive. Grounds
**convention**, 2026-06-12. Re-open trigger per loser **not recorded by the
pass**.*

### What the census actually shows

**Java's enforcement-host surface unusually deep — that the ground verdict rest
on.** Sixteen distinct build-failing hosts named across skills here, covering
every category in *Count the independent enforcement hosts*:

| Host category | Named in this skill set |
| ------------- | ----------------------- |
| Compiler plugin / processor | Error Prone, NullAway, JSpecify, the Checker Framework, jOOQ's `PlainSQLChecker` |
| Architecture test | ArchUnit |
| Property / fuzz generator | jqwik, Schemathesis |
| Real-dependency container test | Testcontainers, Toxiproxy |
| Schema / artifact lint | squawk, vacuum, promtool |
| Contract diff | oasdiff |
| Coverage and mutation | JaCoCo, pitest |
| Dependency and build policy | maven-enforcer |

**This a grep, not research, and stated so it can be re-run:**

```bash
grep -rlE 'ArchUnit|Error Prone|NullAway|JSpecify|Checker Framework|PlainSQLChecker|jqwik|Testcontainers|Toxiproxy|pitest|JaCoCo|squawk|vacuum|oasdiff|Schemathesis|promtool|maven-enforcer' skills/*/*.md
```

Taken **2026-08-01**. Counts move whenever skill added — that the point, not a
defect. Census is evidence only with the date it was taken. What it establish is
narrow: **compiler-plugin surface, architecture-test library, container-test
story and artifact-lint story all exist and all in use here at once.** It does
not establish no other stack have them. **One competing census exist, next
section, and it a frontend one** — nothing here compare a stack doing this
stack's job.

**Candidate list give this its first discriminating data, and only for two host
categories.** Pass recorded, per loser, that mutation testing is absent and
unmaintained on Go, commercial-or-noisy on Kotlin bytecode, and that Go coverage
is statement-only. That is the *coverage and mutation* host compared across
three candidates — **not a census**, which would need all eight categories
counted per candidate with a tool named for each.

### The one competing census that exist, and what it actually discriminate

**Recovered 2026-08-01, dated 2026-06-12..13, and it is a TypeScript census in a
frontend role.** Same pass, same org, same premise, one repo — so it is not an
independent evaluation, and its role confound is stated before its result, not
after. Restated here, cuz that record not published in this skill set.

| Host category | TypeScript, as that pass equipped it | Against the Java column |
| ------------- | ------------------------------------ | ----------------------- |
| Compiler | TypeScript strict, plus template type checking on by default | Parity |
| Compiler plugin / processor | **None.** Lint run beside type checker, not inside it — no host for custom check on compile path | **Java-only category** |
| Architecture test | dependency-cruiser, blocking. Pass's own words: the frontend's ArchUnit-equivalent | Parity |
| Source-level rule | eslint wall plus framework template rules; dead-code gate blocking | Parity |
| Property / fuzz | fast-check | Parity |
| Real-dependency test | Browser-driver E2E per surface, accessibility assertions in same session | Analogue, not container |
| Contract diff | Types generated from committed contract, so contract drift is a compile error | Parity, and shared contract lint sit above both |
| Coverage and mutation | Coverage thresholds blocking. **Mutation host advisory, never blocking, narrow scope, adoption conditioned on unresolved upstream issue** | **Java blocking at 75% on money modules** |

**Result cut against naive reading of this skill's own criterion.** Counting
hosts, the two stacks near parity — seven of eight categories filled either
side. Difference is **not count, it is gate strength and tool maturity**: one
category absent entirely, and mutation host present-but-advisory with an open
upstream issue gating its adoption. **That is *Enforcement-tool maturity is a
separate question from runtime maturity* landing on real data**, and it the
first case where a host category counted and then didn't decide anything.

**What this census cannot settle.** It is a frontend, so schema-lint and
container-test categories are role-shaped not language-shaped; browser E2E is
not real-dependency container test; and TypeScript **backend** lost the language
decision on absent decimal type, which no host count touch. **A backend-role
census on a serious competitor is still owed** — this one narrow it, no close
it.

*Check: same grep discipline as census above — enumerate categories, name tool
per cell, mark empty cell as gap not omission. **Convention**, 2026-06-12..13.*

*Check: grep above, re-run with fresh date. Off-the-shelf — it a grep.
**Convention**, 2026-08-01 — census is fact, inference from it is not.*

### What the choice costs, booked rather than discovered

**Java on Spring Boot near worst case for corpus gravity, and ban lists here are
the bill.** Corpus-dominant idiom for this stack is runtime-silent almost
everywhere it matter — annotation-driven transactions, caching and scheduling,
JPA dirty checking, field injection, annotation-bound message consumers,
`-javaagent` bytecode weaving. Every one banned by name in a sibling skill, each
with a check, and **bans exist because corpus advantage self-cancel**: every
future agent session generate with gravity toward exactly the constructs rules
forbid.

**Those bans published elsewhere, not restated here.** `java-backend-rules` own
platform and annotation bans; `caching` and `caching-java` own
caching-annotation ban; `async-handoff` own annotation-bound-consumer ban;
`java-backend-observability` own bytecode-weaving ban; `llm-default-traps` own
cross-stack dependency traps. This section name the cost; those skills carry the
rules.

*Check: none — this a statement about a cost, and rules that discharge it carry
own checks in skills named above. **Convention**, 2026-06-11..14.*

### What is recorded and what still is not

*This heading state a gap, not a directive — why it carry no check line. Every
other `###` here carry one.*

**Verdict is a contested win now, not an unexamined one.** Pass recorded
rejections and grounds at **both** layers — persistence (JPA, Hibernate, Spring
Data JPA, rejected as runtime-silent, named and grounded in
`java-backend-rules`) and language/runtime (four candidates, table above,
recovered 2026-08-01). Until that recovery this skill said no candidate list
survived and stated its verdict as unexamined, same honesty
`java-backend-rules/evidence.md` apply to the WebFlux ban. **That sentence
retired, cuz the list exist.**

**Nothing promote above convention anyway, and reason changed.** Before: no list.
Now: list is a decision record with **no per-claim marker and no primary source
cited anywhere in it**. Grounds are checkable claims — mutation-tool coverage per
language, `BigDecimal` division semantics, enum exhaustiveness in .NET — and
**none of them verified here against a primary source.** Anyone treating this
verdict as verified is reading a dated decision as research.

Four named gaps follow, none closable from inside this repo:

- **Primary sources still owed, and now searched-for.** Record cite none, and
  the material this skill set was converted from cite none either — it point at
  the pass's own transcripts for steelmen and grounds, and those transcripts are
  published nowhere. **Two records searched, both silent**, so treat sources as
  possibly non-existent rather than merely unlocated. Every ground above is
  therefore a claim someone made in June 2026 about another ecosystem's tooling,
  and tooling claims decay fastest of any kind here.
- **No competing census in a backend role.** One competing census exist and it
  above — TypeScript, frontend, same pass and same org, so role-confounded and
  not independent. Until an equivalent run for a competitor doing this stack's
  job, census show Java's surface deep and **not** that it deeper.
- **One recorded expectation point the other way, and no skill carry it.** The
  material behind `caching` and `async-handoff` predicted a second stack would
  host their type-design directives worse — that prediction is published in
  those skills. **What is not published anywhere is its per-candidate half**,
  which expected **Go** to host them *more* strongly than Java, on compiler-
  enforced package boundaries and an unexported method making outside
  implementation impossible. Restated here because it the only recorded claim in
  this material pointing away from the winner; it is a prediction, nobody ran
  it, and Go lost the actual decision on a different host category entirely.
- **No re-open trigger per loser.** *Record the losers* require one and pass
  wrote none, so nothing say what would make Go or C# worth re-examining. Not
  invented here — inventing a trigger nobody set would be authoring the pass's
  verdict, not recording it.
- **Criterion never selected against a real alternative.** Written after the
  choice it explain, generalising criteria that choice stated. Criterion that
  only ever ratified one decision has not been tested — why central claim marked
  *uncertain*, not *convention*.

## What this skill does not carry

**No `## Wiring the gates` section, and absence deliberate.** Every directive
here bind a decision made before there is code to check, so nothing to wire into
a build — check is written artifact whose absence is visible.
`tech-decision-research` in same position and say same thing; six of the
language-neutral skills here also carry no wiring section, for different reason
— their gates real and a stack sibling wire them.

**Honest limit, stated not glossed:** these checks catch omission, cannot catch
rationalisation. Decision record written after winner picked, listing losers
nobody seriously considered, pass every check here. `tech-decision-research`
publish the procedure that make record trustworthy — framing written before
candidates named, adversarial panel, steelman for loser — and **this skill
downstream of that one**. Install it alongside.

## Where the rest of this lives

- **`tech-decision-research`** — how to run the decision this skill's directives
  say to record. Define the four confidence markers used above.
- **`enforceable-rules`** — *unwritable beats banned* principle, enforcement
  markers, and premise-specificity test that decide whether a rule earn context
  space at all.
- **`java-backend-rules`, `java-backend-api`, `java-backend-observability`** —
  what follow from worked case, once chosen.
- **`guardrails-toolchain`** — once stack picked, which tool may occupy a host
  and what disqualify one, plus four defect classes a host count never reach.
  **Frontend census in section above is that skill's map read from other side**;
  same record, published once, here.
- **`llm-default-traps`** — picks an agent make by training-data default on any
  stack, including ones a fresh stack choice hit first.

[evidence.md](evidence.md) carry the grounds, the claims that must not be cited,
and the conditions that reopen each directive.