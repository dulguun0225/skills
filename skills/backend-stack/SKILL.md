---
name: backend-stack
description: How to choose a backend stack for a repo whose code is written by LLM agents and read line by line by nobody — rank candidates by what their build can refuse to ship rather than by what they let you express, count the independent enforcement hosts a stack offers rather than its type-system features, prefer a stack where the wrong call cannot be written over one where it is written and then flagged, price corpus gravity as a cost the winner carries rather than a reason it won, and treat operability as a veto rather than as the deciding criterion. Carries this skill set's own worked case, Java with Spring Boot Web MVC, jOOQ and PostgreSQL, with the enforcement-host census that grounds it and the candidate list the pass never recorded. Load before picking a language, runtime, web framework, persistence library or database for a new backend, before arguing that an existing stack should change, and before writing a rule set for a stack nobody has justified in writing.
---

# Choosing a backend stack for code nobody reviews

**This skill argues the choice.** Every other stack-shaped skill in this set —
`java-backend-rules`, `java-backend-api`, `java-backend-observability`,
`money-java`, `caching-java`, `async-handoff-java` — assumes the choice has
already been made and states the rules that follow from it. This is the one that
says why one stack beats another, on a criterion that only applies when no human
reads the code.

**It is deliberately two halves.** The criterion is portable and is the payload:
it decides a Go, .NET or TypeScript question as readily as it decided this one.
The worked case is Java on Spring Boot Web MVC, jOOQ and PostgreSQL, and it is
here as *evidence that the criterion discriminates*, not as a recommendation to
copy. A reader on another stack should apply the criterion and get their own
answer.

## The marker ceiling, before anything else

**Everything in this skill is *convention*.** Read that literally, because the
argument below is a strong one and a strong argument reads like a verified one.

- **The criterion is this skill set's own synthesis.** No pass put it to a
  source, no panel argued the other side, and no outcome has been measured — no
  backend was built on a stack chosen by a competing criterion and compared. The
  central claim is that ranking stacks by build-refusable defects produces
  better outcomes for machine-written code than ranking them by expressiveness,
  velocity or hiring pool, and **that claim is uncertain, not convention** — it
  is stated as *uncertain* where it appears.
- **The Java verdict inherits one date and no markers.** The platform pass ran
  **2026-06-11..14** and recorded rejections and grounds **with no per-claim
  confidence marker**, which is why *convention* is the floor here rather than a
  verdict anyone wrote down. Its primary sources are not published in this skill
  set and are owed — see *What was never recorded*.
- **The one thing here that is not opinion is the host census**, and it is not
  research: it is a grep over the published skills, dated, and stated with its
  command so anyone can re-run it and watch it change.
- **The lapse rule is vacuous here and is stated rather than omitted.** Past a
  `review-by` every *confirmed* marker reads as *convention* with no maintainer
  action, and **nothing here is above convention**, so the rule would demote
  nothing. It is stated because every other skill in this set carries a
  `review-by` and silence would read as an omission. The cost of its being
  vacuous is real: **nothing makes this skill's age visible.** The conversion
  date is **2026-08-01**, and that is a conversion date, not a verification
  date.

Status tier: **decided, not yet validated** — researched and decided, with **no
production use yet** behind the criterion as a criterion.

## The premise

**Code is written by LLM agents and no human reads it line by line.**

Every directive below is conditioned on it, and this is the one skill in the set
where dropping the premise does not weaken the rules — it **deletes them**. If a
human reads every diff, the reviewer is the enforcement host, the count below is
noise, and a stack should be chosen on velocity, hiring and operability like any
other. A verdict is portable exactly as far as its premise, and this one travels
no further than its first sentence.

**Two things the premise does not say.** It does not say the code is unreviewed
in the sense of unowned — someone answers for it in production. And it does not
say the agent is careless. It says the *line-by-line reading* that historically
caught the defects below has been removed, and nothing was put in its place
except the build.

## The criterion

### Rank a stack by what its build can refuse to ship

**The deciding question about a candidate stack is not what it lets you express.
It is what its build can refuse to ship.** Two stacks that can both express a
correct implementation are not equivalent when no human reads the diff: the one
that can mechanically reject the incorrect implementation has a property the
other does not, and it is the only property the premise leaves standing.

Expressiveness, terseness, velocity and library breadth all describe how easily a
*correct* program can be written. Under this premise the binding constraint is
not how easily a correct program can be written — an agent writes plausible code
at any level of terseness — it is how reliably an incorrect one is stopped
without a reader. **A stack's ceiling is the set of defect classes its build can
name and reject.**

*Check: the decision record ranks each candidate by defect classes its build can
reject, and that ranking is written before any candidate is named the winner.
Convention as enforcement — no build can host this, and the check is the written
artifact, whose absence is visible; a record written after the winner was chosen
passes it. Confidence **convention**, 2026-06-11..14. The criterion itself is
**uncertain** — no outcome has been measured against a stack chosen another
way.*

### Count the independent enforcement hosts, not the type-system features

**A type system is one enforcement host. Ask how many independent hosts the
stack offers, and what fraction of your intended rules each can carry.** A stack
with a strong type system and no architecture-test library, no compiler-plugin
surface and no container-test story is weaker under this premise than the raw
type comparison suggests, because most rules a repo needs are not expressible as
types.

The hosts worth counting are the ones that **fail a build**, and they are not
interchangeable — each reaches a different class of defect:

- **The compiler**, for what can be made a type error.
- **A compiler plugin or annotation processor**, for what the compiler will not
  do natively — nullness, non-loggability, a banned API on the compile path.
- **An architecture test**, for reachability and layering rules that no type
  expresses — which package may call which, which construct may appear where.
- **A bytecode, AST or source-level rule**, for constructs the architecture test
  cannot see into.
- **A schema, contract or migration lint**, for artifacts that are not code.
- **A contract diff**, for changes that compile and are still breaking.
- **A property or fuzz generator**, for the input space a written test misses.
- **A real-dependency container test**, for behaviour only the real engine has.

**Count these, per candidate, before ranking.** A stack missing one entirely has
a class of rules it can only carry as convention, and convention is what this
premise removes the reader from.

*Check: the decision record lists the hosts per candidate with a named tool for
each, and marks the ones with no host as gaps rather than omitting them.
Bespoke — the record is greppable for the tool names, its completeness is not.
**Convention**, 2026-06-11..14.*

### Prefer a stack where the wrong call cannot be written

**Between two stacks that can both reject a defect, prefer the one that rejects
it earlier — at the point of writing rather than at the point of building.** An
absent method, an uninstantiable type, a factory that takes no free-text
parameter and a constructor that cannot be reached correct the agent while it is
writing the call. A build failure corrects it afterwards, in a run somebody can
be tempted to override.

This is `enforceable-rules`' *unwritable beats banned* principle applied one
altitude up, to the choice of platform rather than to the design of a rule. It
is stated here rather than restated: **that skill owns the principle and its
grounds, and this one only says the principle discriminates between stacks and
not merely between rule designs.** Install `enforceable-rules` for the argument.

The stack property that matters is therefore narrower than "has a good type
system": it is whether the stack lets a library author make a call
*unrepresentable* — sealed hierarchies, package-private constructors, absent
methods on an interface an outsider cannot implement — and whether the ecosystem
uses that power or routes around it with reflection and runtime configuration.

*Check: for each rule the stack will need to carry, the record states whether it
lands as a type-design constraint or as a flag, and the count of the first
category is a stated input to the ranking. **Convention**, 2026-08-01 — this is
a conversion-dated statement of a principle the platform pass did not write
down in this form.*

### Price corpus gravity as a cost the winner carries

**The idiom an LLM generates for a stack by default is that stack's corpus
gravity, and it is a cost, not a feature.** Where the corpus-dominant idiom for a
stack is runtime-silent — configuration that changes behaviour invisibly,
annotations whose effect is not at the call site, conventions resolved by
reflection at startup — every future agent session pulls toward it, and the repo
pays a permanent ban list plus the enforcement to make the bans stick.

**The asymmetry is what makes this a decision input rather than a complaint.** A
stack with a large corpus generates more plausible code faster *and* drifts
harder toward that corpus's defaults. Those two effects do not cancel: the first
is a one-time gain per feature, the second is a standing cost paid at every
subsequent session, and the second one compounds while nobody reads the diffs.

**A stack may win while carrying a heavy gravity cost** — this one did. What the
criterion forbids is counting the large corpus as an advantage without booking
the drift against it, or discovering the ban list afterwards and treating it as
an unforeseen tax.

*Check: the record names the stack's corpus-dominant idiom, states whether it is
runtime-silent, and lists the bans the choice will require — before the choice
is final, so the ban list is a priced input rather than a discovery.
**Convention**, 2026-06-11..14 — the platform pass recorded the rejections and
their grounds, and this is the generalisation of what it did.*

### Operability is a veto, not the criterion

**The team must be able to run the winner in production. That is a veto over the
ranking, not the thing being ranked.** A stack nobody present can operate loses
regardless of how many defect classes its build rejects, because the rules
protect a system that has to be running to matter.

Stated as a veto rather than as the deciding criterion because those two produce
different answers: as a criterion it selects whatever the team already runs and
the guardrail question is never asked; as a veto it eliminates the unrunnable
and lets the guardrail question decide the rest. **Under a premise where nobody
reads the code, "we already know it" is not a guardrail.**

The operability facts that veto are concrete and worth writing down per
candidate: who has run it in production, what the deployment target already
supports, what the on-call story is, and whether the observability rules this
set publishes can be hosted at all.

*Check: the record states the operability veto per candidate as a fact about
this team rather than as a general property of the technology, and states it
separately from the ranking. **Convention**, 2026-08-01 — a conversion-dated
narrowing of a sentence `java-backend-rules` previously carried as the dominant
criterion.*

### A rule set is never a reason to adopt a stack

**That a good rule set exists for a stack is not evidence the stack is a good
choice, and this skill set is not evidence for its own platform.** The reasoning
is circular in a way that is easy to miss when the rule set is the artifact in
front of you — fifteen skills instantiated on one stack look like accumulated
justification and are not. They are accumulated *consequence*.

This sentence survives from `java-backend-rules`, which carried it before this
skill existed, and it is the reason the host census below is stated as a
**re-runnable grep with a date** rather than as a claim: a census of this
repository's own tool names is evidence about **Java's enforcement surface**,
which is a fact about the ecosystem, and is *not* evidence that choosing Java
was correct.

*Check: no directive anywhere in this skill set cites the existence of another
skill in this set as a ground for the platform choice. Bespoke and unbuilt — a
grep would find the citation shape but not the reasoning. **Convention**,
2026-08-01.*

### Record the losers and their grounds, or it is a preference

**A stack decision with no written losers is a preference wearing a decision's
clothes.** Name every candidate considered, why each lost, and the condition
that reopens it. The losers are the load-bearing half: "we use Java" overrides
no instinct, and "the corpus default here is X, rejected because its dominant
idiom is runtime-silent and no host can reject that" does.

**This matters more for a stack choice than for any rule**, because the stack is
the one decision every later rule is conditioned on, and it is the one nobody
re-derives. An agent asked to add a service two years from now will read the
rule sets, infer the stack from them, and never see an argument.

**This skill fails its own directive**, and says so rather than hiding it — see
*What was never recorded*.

*Check: the decision record names each candidate, its ground for losing, and a
re-open trigger. Convention as enforcement — the check is the written artifact,
and it catches omission and cannot catch a rationalisation written after the
fact. Confidence **convention**, 2026-06-11..14.*

### Enforcement-tool maturity is a separate question from runtime maturity

**Ask how old and how maintained the *enforcement* tools are, separately from
the language and runtime.** A mature runtime with young or unmaintained
guardrail tooling scores worse under this premise than the version numbers
suggest, because the rules are hosted by the tools, not by the runtime.

The questions per host are the ordinary ones and they are asked about the tool,
not the platform: is it maintained, what is its release cadence, does it work on
the pinned language version, and what happens to every rule it carries if it
stops. **A stack where one tool hosts most of the rules has a single point of
failure the version numbers do not show** — which is a live condition in this
skill set, where one architecture-test library appears in more files than any
other host.

*Check: the record dates each named host and states which rules die with it.
Bespoke and unbuilt. **Convention**, 2026-08-01.*

## The worked case — Java, Spring Boot Web MVC, jOOQ, PostgreSQL

**The verdict, dated 2026-06-11..14, marked convention.** This section is the
criterion applied once. It is not a recommendation to adopt this stack, and by
*A rule set is never a reason to adopt a stack* it cannot be read as one.

### What the census actually shows

**Java's enforcement-host surface is unusually deep, and that is the ground the
verdict rests on.** Sixteen distinct build-failing hosts are named across the
skills in this set, covering every category in *Count the independent
enforcement hosts*:

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

**This is a grep, not research, and it is stated so it can be re-run:**

```bash
grep -rlE 'ArchUnit|Error Prone|NullAway|JSpecify|Checker Framework|PlainSQLChecker|jqwik|Testcontainers|Toxiproxy|pitest|JaCoCo|squawk|vacuum|oasdiff|Schemathesis|promtool|maven-enforcer' skills/*/*.md
```

Taken **2026-08-01**. Counts move whenever a skill is added, and that is the
point rather than a defect — a census is evidence only with the date it was
taken. What it establishes is narrow and worth stating exactly: **a
compiler-plugin surface, an architecture-test library, a container-test story
and an artifact-lint story all exist and are all in use here at once.** It does
not establish that no other stack has them, because **no census was run for any
other candidate** — which is the largest gap in this section.

*Check: the grep above, re-run with a fresh date. Off-the-shelf — it is a grep.
**Convention**, 2026-08-01 — the census is a fact, the inference from it is not.*

### What the choice costs, booked rather than discovered

**Java on Spring Boot is close to the worst case for corpus gravity, and the ban
lists in this skill set are the bill.** The corpus-dominant idiom for this stack
is runtime-silent almost everywhere it matters — annotation-driven transactions,
caching and scheduling, JPA dirty checking, field injection, annotation-bound
message consumers, `-javaagent` bytecode weaving. Every one of those is banned by
name in a sibling skill, each with a check, and **the bans exist because the
corpus advantage self-cancels**: every future agent session generates against
gravity toward exactly the constructs the rules forbid.

**Those bans are published elsewhere and are not restated here.**
`java-backend-rules` owns the platform and annotation bans, `caching` and
`caching-java` own the caching-annotation ban, `async-handoff` owns the
annotation-bound-consumer ban, `java-backend-observability` owns the
bytecode-weaving ban, and `llm-default-traps` owns the cross-stack dependency
traps. This section names the cost; those skills carry the rules.

*Check: none — this is a statement about a cost, and the rules that discharge it
carry their own checks in the skills named above. **Convention**,
2026-06-11..14.*

### What was never recorded

*This heading states a gap rather than a directive, which is why it carries no
check line. Every other `###` in this skill carries one.*

**The candidate list is not held in this skill set, and neither are the
platform pass's primary sources.** The pass ran 2026-06-11..14 and recorded
rejections and grounds at the persistence layer — JPA, Hibernate and Spring Data
JPA, rejected as runtime-silent — which is why those losers are named and
grounded in `java-backend-rules`. **At the language and runtime layer no
candidate list survives here at all.**

So this skill states its own verdict as an **unexamined win, not a contested
one**: nothing published here shows which languages were compared, on what
grounds, or whether any was steelmanned. That is the same honesty
`java-backend-rules/evidence.md` already applies to the WebFlux ban, and it has
the same consequence — **nothing here may promote above convention until the
candidate list and its sources are recovered and recorded.**

Two named gaps follow directly and neither is closable from inside this
repository:

- **No competing census.** The host count above was taken for one stack. Until
  the same grep-equivalent is run for at least one serious competitor, the
  census shows Java's surface is deep and **not** that it is deeper.
- **The criterion has never selected against a real alternative.** It was
  written after the choice it explains. A criterion that has only ever ratified
  one decision has not been tested, which is why the central claim is marked
  *uncertain* and not *convention*.

## What this skill does not carry

**There is no `## Wiring the gates` section, and its absence is deliberate.**
Every directive here binds a decision made before there is code to check, so
there is nothing to wire into a build — the check is a written artifact whose
absence is visible. `tech-decision-research` is in the same position and says
the same thing; six of the language-neutral skills in this set also carry no
wiring section, for the different reason that their gates are real and a stack
sibling wires them.

**The honest limit, stated rather than glossed:** these checks catch omission
and cannot catch a rationalisation. A decision record written after the winner
was chosen, listing losers nobody seriously considered, passes every check in
this skill. `tech-decision-research` publishes the procedure that makes the
record trustworthy — the framing written before candidates are named, the
adversarial panel, the steelman for the loser — and **this skill is downstream
of that one**. Install it alongside.

## Where the rest of this lives

- **`tech-decision-research`** — how to run the decision this skill's directives
  say to record. It defines the four confidence markers used above.
- **`enforceable-rules`** — the *unwritable beats banned* principle, the
  enforcement markers, and the premise-specificity test that decides whether a
  rule earns context space at all.
- **`java-backend-rules`, `java-backend-api`, `java-backend-observability`** —
  what follows from the worked case, once it is chosen.
- **`llm-default-traps`** — the picks an agent makes by training-data default on
  any stack, including the ones a fresh stack choice will hit first.

[evidence.md](evidence.md) carries the grounds, the claims that must not be
cited, and the conditions that reopen each directive.
