---
name: enforceable-rules
description: How to write a rule that actually binds an LLM agent — the premise-specificity test that decides whether a rule earns space in an agent's context, eight principles every rule is judged against (machine-enforced or it is not a rule, unwritable beats banned, no ambient modifier, no ambient trigger, fail loud, distrust what the agent picks and reads, deterministic output from committed inputs, gates need an outside oracle), the enforcement markers and status tiers that keep a rule set honest, and five checks a rule set passes while still being silently incomplete — the predicate, composite-shape, layer, enumeration and token-placement checks. Load before writing or revising a coding rule, a constitution, a lint policy, an architecture test, a CLAUDE.md rule, or any text meant to override an agent's default behaviour. This skill defines the enforcement markers and status tiers the rest of this skill set uses.
---

# Writing a rule that binds an agent

A rule that an agent will follow is not the same artifact as a rule a person will
follow. A person reads a rule, disagrees, and asks. An agent reads a rule,
complies with the letter of it, and produces working code that violates its
intent — or does not read it at all, because it was one of four hundred lines of
guidance competing for context. **This is the bar a rule clears before it is
worth writing down**, and the checks that catch a rule set that reads as thorough
while being incomplete.

Two things this is not. It is not the research that produces a verdict — that is
published as `tech-decision-research` in this skill set, and it is the step
before this one. And it is not a style guide: nothing here is about how the rule
is worded, and everything is about whether it can be enforced, whether it earns
its space, and whether the set it belongs to has holes.

**There are no rule ids here, and dropping them was the sharpest call in this
skill.** The material behind the eight principles assigns each one a stable
number for exactly the reason ids exist — so that a citation survives the list
being reordered. Two things override that here. Nothing a consumer installs
carries a copy of that material, so a number would be a pointer into text the
reader does not have; and the other skills in this set already refer to these
principles in prose, so shipping numbers would create the worse case the set has
already settled against — **an id that resolves for a reader who installed this
skill and dangles for one who did not.**

So each principle carries a **stable name** instead, the name is its `###`
heading, and the transferable half of the never-renumber rule ships intact:
**cite a rule by a stable anchor, never by its position in a list.** A citation
that says "principle 3" breaks silently the first time the list is reordered, and
silent breakage is the failure the whole apparatus exists to prevent. Rename an
anchor and you have broken every citation to it; treat these names as ids that
happen to be readable.

## Read the markers first

**Every directive here is *convention*, and the material it was drawn from
carries no confidence marker and no date on any claim.** Nothing here survived a
refutation vote or rests on a primary source. It is an authoring bar recorded by
the person who set it.

- **No `review-by` date, and the lapse rule is vacuous here.** Every other skill
  in this set carries a date past which a *confirmed* marker degrades to
  *convention* on its own. There is no such date in the material behind this
  skill, and none was invented — and the rule would do nothing anyway, since
  there is no *confirmed* claim to demote. **The cost is that nothing makes this
  skill's age visible**, so the reader has to.
- **No directive carries a per-claim date.** The material is undated. **The
  conversion happened on 2026-07-30**, stated once, here; that is not a
  verification date and must not be repeated as one.
- **The five incompleteness checks below are the exception that matters**,
  because each rests on an observed failure rather than on an argument. The
  failures are real, and the predicate, composite-shape and layer checks are
  **verifiable by anyone who installed the other skills in this set** — the
  worked case is named beside each. The *check* is still convention: nobody voted
  on whether it is the right response to the failure.

Status tier: **decided, not yet validated** — researched and decided, with **no
production use yet**. What exists is every other skill in this set, written
against this bar, which is usage rather than validation: no repo has operated any
of them long enough to report whether the bar predicted anything.

## The premise, and the review model that forces this kind of rule

**Code is written by LLM agents and no human reads it line by line.** Two
consequences, and they are what make this a bar rather than a preference:

- **Machine evidence substitutes for code review, so a rule set's evidence rules
  are gates rather than advice.** There is no second reader. If the build does not
  object, nothing objects. Weakening a gate is a stated deviation for a repo where
  a human genuinely reads the code — **that repo is the exception and carries the
  burden of saying so**, rather than the default everyone quietly assumes.
- **The plan is the last cheap place a wrong decision is caught.** After
  implementation, a review is a model checking model output; it shares the
  implementer's blind spots, so it is a backstop and never the gate. Which is why
  a rule that only a reviewer could enforce is barely a rule at all.

A verdict is portable exactly as far as its premises. Record them with the rule
set, so a repo reading it can tell whether it applies.

## The premise-specificity test

**The filter every rule clears before it ships. A rule earns its place only when
the absent reader changes its *stakes*: the failure it prevents turns
invisible-forever or unbounded once no human reads the code.**

The part that is misread in both directions:

- **Many rules worth keeping are also generic good engineering.** That does not
  disqualify them. What earns the place is that no-human-reading **raises them
  from advisable to mandatory** — the same rule, at a different stake.
- **Cut a rule only when the absent reader changes nothing about its stakes.**
  If the failure it prevents is equally visible either way, it is advice. Advice
  in an agent's context window is not free: it displaces the rules that are doing
  work, and a rule set long enough to be skimmed enforces nothing.

**A rule that fails the test has exactly two honest fates**: cut it, or keep it
because it is cheap and fails safe — and then **mark it *convention* and never
dress it up as premise-derived.** The dishonest third option, which is what
actually happens, is to write a premise-shaped justification for a rule that
would be equally sensible in a human-reviewed repo. That inflates the rule set
and, worse, teaches the next author that the test is a formality.

*Check: each rule's text says what turns invisible or unbounded under the
premise. Bespoke at best — a reviewer or an agent reads the rule and the
justification together. **Convention** in practice, because nothing can decide
whether a justification is real.*

## The eight principles

**Every rule is written and judged against these, and a rule that serves none of
them is advice rather than a rule** — cut it, or mark it *convention* and say
plainly it is not premise-derived. They run from how a rule is enforced, through
how the code must read, to who wrote it, to how the gates stay honest.

### Machine-enforced or it is not a rule

**Ship a rule only with a named check that fails the build. A ban with no check
is a wish.**

Then the clause that gets left off, and it is the more important half: **never
wire a gate whose blind spot lets the banned thing pass while it reports green.
False assurance is worse than none.** A rule with no gate is a known gap that a
reader can act on. A gate with a blind spot is a *green build* over the thing it
was installed to prevent, and it also removes the pressure to build a real one.

**Every worked case published in this skill set is a false green rather than a
missing gate** — which is the ratio worth noticing. There are two, and the first
of them recurs:

- **The erasure false green.** `llm-default-traps` bans **ArchUnit** as the host
  for a "never log this type" rule, because it reads an erased signature and so
  the rule passes while protecting nothing; **Error Prone** is the host instead.
  That gate was shipped before it was caught. `caching` then reaches the identical
  trap from a different rule — a value-round-trip check written against the cache
  adapter's type parameter would read the same erased top type — and refuses that
  host by name, citing the earlier shipment. **One defect, two rules, and it was
  only stopped the second time because the first was written down.**
- **The false-green gate shipped as a product.** `async-handoff-java` records a
  published contract-comparison tool that detects incompatibilities, writes a
  report file, and exits green regardless. That skill refuses it and names two
  usable alternatives, but **identifies the refused product by ecosystem and
  repository signature rather than by name** — so the instance is real and the
  product is not citable by name from anywhere in this skill set. That is the
  anonymised-subject defect `tech-decision-research` states under *Record the
  negative results*, surviving in the one place a reader would go to obey it.

*Check: every rule has a named check and an enforcement marker; every gate's
blind spot is stated. Bespoke — the marker is greppable, the blind spot is not.*

### Unwritable beats banned

**Prefer a construct that cannot be written — an absent method, a compile error,
an uninjectable object — over one that is written and then flagged.** A flag
fires after the code exists, in a build somebody can be tempted to override. An
absent method fires while the agent is writing the call, which is the only moment
the correction is free.

**Where a capability cannot be designed out, confine it to the fewest named
seams**, so the static check over those seams is *complete* rather than
best-effort. A capability reachable from anywhere needs a check that reads
everything; a capability reachable from one factory needs a check that reads one
file.

In this skill set the caching rules lean on this hardest, with several directives
that are type design rather than prohibition: an expiry value constructible only
at catalog registration and never at a call site, and a cache factory that
accepts no free-text parameter, so the wrong call does not compile. The seam
version is `async-handoff`'s post-commit rule, which requires that a
*general-purpose* post-commit callback **not exist**, because one such method
defeats every check over the seam it confines.

*Check: this is a design principle rather than a rule, so its check is the
absence itself — the method is not there, and a test asserts it cannot be called.
Off-the-shelf where an architecture test can assert the absence; **bespoke** where
the construct is a type shape.*

### The source is the whole behaviour

**What a written call does is fixed by the call and its arguments at that call
site — never by an ambient modifier: a mode, a surrounding scope, configuration,
or in-memory object state.**

This governs **where a call's inputs come from**. It is the rule behind naming
rounding at every call site rather than configuring it once, and behind rejecting
an ambient session that changes what an identical statement does. Under the
premise it matters because reading the call is all anybody does: a reader — human
or agent — who has to reconstruct an ambient mode to know what a line does will
get it wrong, and there is no second reader to catch it.

*Check: bans on the specific ambient mechanism, per stack. **Off-the-shelf**
where an architecture test can forbid the injection point.*

### No silent runtime behaviour

**An effect fires only from a written, named call — never from an ambient
trigger.** And then the operative instruction: **ban ambient dispatch by name.**
Annotation-driven aspects, field or setter injection, aspect-oriented weaving,
reflective dispatch, classpath scanning, hidden dirty-state flush.

This governs **what fires the call**, where the previous principle governs where
its inputs come from. Naming the mechanisms is not decoration — a general
prohibition on "magic" is unenforceable and an agent will not recognise its own
code as an instance. `java-backend-rules` is the worked case: it bans field
injection, transaction annotations, scheduling annotations, async annotations and
caching annotations **individually, each with the check that fails the build**,
rather than banning the category.

*Check: a banned-annotation or banned-construct rule per mechanism.
**Off-the-shelf** — this is the principle with the best tool support of the
eight.*

### Fail loud, never silently wrong

**On a value-bearing path, throw or reject rather than take the silent default** —
null, an arbitrary row, a swallowed catch, a silent round, a defaulted-missing
field.

The premise argument is exact and worth carrying verbatim: **a wrong-but-plausible
value on an unread path is invisible forever; a crash is caught by any test.**
That asymmetry is the whole principle. It also explains why this one produces
rules that look hostile to operability — a service that throws is worse than one
that limps, right up until the limp is a wrong number nobody sees.

The money rules are built on it end to end: fail-loud money paths, an
over-scale write rejected by the store rather than quietly rounded, a JSON number
on a money field rejected at parse rather than coerced.

*Check: per instance — a lint on the swallowing catch, a store constraint, a
parse-time rejection. Mixed **off-the-shelf** and **bespoke**; the swallowing
catch is the one with a named gap in every rule set here that touches it.*

### Distrust what the agent picks and what it reads

Two halves, and both are about the agent as an untrusted input channel.

**Where the corpus-dominant pick is wrong, name that favourite and ban it.** "The
default is Y, rejected because Z" overrides an instinct that a bare "use X" does
not. That sentence is the most important line a rule set contains — **do not
compress it away**, and do not replace the named loser with a category.

**And treat every input the agent selects or reads as untrusted until pinned,
verified to exist, and shielded from the channels the agent reads** —
dependencies, tool versions, generated code. The second half is the one authors
forget: an agent reads test output, CI logs and release notes, so anything that
can write into those channels can write instructions to the maintainer.
`llm-default-traps` is this principle as a whole skill.

*Check: a banned-dependency rule, a lockfile gate, a pin check, a version
ceiling. **Off-the-shelf** for the pinning half; the "verified to exist" half is
**convention** in every ecosystem, and that skill says so.*

### Deterministic output from committed inputs

**Make every generated artifact and computed output a pure function of committed
inputs — an injected clock, stable ordering, no wall-clock read, no live
database — so that a regenerate-and-diff or a replay gate is trustworthy.**

The reason is one sentence: **here the diff is the review.** A regenerate-and-diff
gate is the closest thing available to a second reader, and any nondeterminism
anywhere in the pipeline destroys it — not by producing a wrong answer, but by
producing noise that trains everyone to ignore the gate.

`java-backend-rules` carries the clock half (wall-clock reads banned in domain
code, an injected clock instead) and `money-storage` the committed-input half (a
schema lint asserted over committed migrations rather than against a live
database).

*Check: a clock ban, an ordering rule, and the regenerate-and-diff gate itself.
**Off-the-shelf** for the gate; **bespoke** for the clock ban on most stacks.*

### Gates need an outside oracle

**Draw a semantic gate's ground truth from outside the implementer model** — a
spec-derived fuzzer, a human-approved golden corpus, an invariant asserted on
real data, mutation testing that probes the tests — **never only from tests the
same model wrote to describe its own output.**

This is the principle that decides whether a green build means anything. A model
writes an implementation and then writes tests describing what it wrote; both
pass; nothing has been verified except internal consistency. **A coverage floor
does not fix this**, because coverage cannot see whether a test asserted
anything.

The two worked cases here are `java-backend-api`, whose committed interface
document is the single conformance oracle a fuzzer generates against, and
`money-java`, which pins mutation testing scoped to the money packages —
scoped, which is itself a named gap that skill states, because everything outside
that scope can sit green over vacuous tests.

*Check: the oracle is named per gate, and a gate with no outside oracle says so.
**Off-the-shelf** for the fuzzer and mutation tooling; naming the oracle is
**convention**.*

## The shape of a rule, and where the evidence goes

**Directive first, in bold. Then the reasoning. Then the enforcing check in
parentheses, with its enforcement marker.** In that order, because an agent
reading under context pressure reads the first clause of each item and the shape
has to put the instruction there.

- **Directive text and evidence are separate artifacts.** Directive text is
  instinct-override payload for a scarce context window; **only an
  instinct-overriding rule justifies space there.** Evidence is for whoever is
  deciding whether to trust the rule — a different reader, a different moment,
  one hop away.
- **Group the evidence by the section of the directive text each rule lives in —
  never by research pass.** A rule set that accretes over several passes and files
  its evidence by pass ends up ordered by its own history rather than by what a
  reader is looking for. Put the passes and each one's scope in a table at the top
  of the evidence file instead, where the provenance is available without becoming
  the index.
- **Every ban names its enforcing check and its enforcement marker.** No
  exceptions, and where a group of rules genuinely shares one check and one
  marker, state that once at the group head **and say the sharing is
  deliberate** — otherwise it reads as a dropped marker.
- **Every rule clears the premise-specificity test and serves at least one of the
  eight principles.**
- **Nothing in the directive text may cite an id or link back to material the
  reader does not have.** A rule set pasted into a repo that holds no copy of the
  source lands there with a dangling pointer, and a cited number reads as *that
  repo's own* numbering, which is worse than an obviously broken link. **Ids
  belong in the evidence file, or in text the reader demonstrably has.**
- **Set `verified` and `review-by` in the frontmatter**, and let the frontmatter
  be the only authority for them — the date of the last research pass, and the
  date after which the rule set is stale. A status copied into three files is a
  status that goes stale in two.
- **State the condition each conditional group is dormant under, and say
  *dormant* rather than *inapplicable*.** A rule for a capability the repo does
  not have yet is a rule with a **tripwire** in it: the moment the first instance
  of that capability appears, the group activates, and the cheapest place to say
  so is the change that introduces it. **An adopting repo deletes a rule when the
  capability is absent by design and keeps it when it is merely absent so far** —
  and it can only tell the two apart if the group states its condition. Deleting
  a dormant group removes the tripwire, which is the whole reason the group was
  written before anything triggered it.

## Enforcement markers, and the status tier

**This skill owns both vocabularies**, because both are properties of a rule's
check rather than of a research claim. The four **confidence** markers —
*confirmed*, *primary-source verified*, *convention*, *uncertain* — are owned by
`tech-decision-research`, which is where they are defined and where the
refutation votes that promote one live. **A repo that installs this skill and not
that one has these two vocabularies and not the confidence one**, and no skill
here supplies it in that case.

**Enforcement, per rule — a ban without a named check is a wish, not a rule:**

- **off-the-shelf** — a named tool rule exists (an ArchUnit rule, an Error Prone
  check, a linter rule — those two are the material's own examples, and any
  ecosystem's equivalents count); the adopting repo copies it and wires it.
- **bespoke** — the check has to be authored by the adopting repo. **The rule set
  says so and names the tool that can host it** — "bespoke" with no named host is
  an admission dressed as a marker.
- **convention** — no gate exists. **The rule states why it is kept anyway.**

**Status tier, per rule set, and per rule where they differ:**

- **production-confirmed** — a named repo operates the discipline, and the rule
  set cites it.
- **decided, not yet validated** — researched and decided, **no production use
  yet.** Gloss it that way and not as "not yet proven at scale" or "not run long
  enough": those imply a production record that does not exist.
- **deferred — evidence-driven** — recorded for a future decision. Not directive
  text, and it does not go in the context window.

**The enforcement marker is the one that decays without anyone touching it.** A
rule marked *off-the-shelf* whose gate was never actually wired reads as enforced
forever, and nothing detects the gap between the marker and the build. Which is
why a rule set's wiring step records **what was skipped, with the reason** — a
record listing only what was wired reads as complete coverage.

## Five checks a rule set passes while still being incomplete

**A rule set can satisfy every principle above, pass every machine check over it,
read as thorough, and fail all five of these.** None of the five is
machine-checkable, because each is about what is **absent** from the text, and
absence is not a property a checker can extract. Each exists because a shipped
rule set failed it.

**Run all five over rule sets that already shipped, not only over the next
one.** The layer check was failed by the **oldest** rule set in the corpus these
skills came from, which had been read, lifted and re-reconciled three times
without anyone noticing. And keep a record of which rule set has had which check
— **an unaudited entry is a check nobody ran, not a clean rule set.**

The first three were recorded in the material this skill converts. **The last two
are additions, drawn from the authoring of this skill set itself** and marked as
such below rather than presented as inherited.

### The predicate check

**Frame the rule set's applicability predicate on *what the rules must reach* —
never on the technology in its name, and never on what the rule set currently
recommends.**

Two rule sets in a row scoped their seam to the obvious client library and left
**the cheapest correct option — which imports no client at all — outside every
check.** One of them had its recommendation reversed within hours of shipping,
while the widened predicate survived untouched. **That is the argument for the
rule in one sentence:** a predicate written around a recommendation dies with the
recommendation; a predicate written around the reach of the rules does not.

Both worked cases are published here and can be read. `money-storage`'s predicate
is written so the rules reach a hand-written query, a view definition, a
migration and a support script — **none of which imports a client library** — and
the money rules were deliberately *not* named for a persistence layer, because in
a typical shop that name scopes them to the code that does import one.
`async-handoff` is named for a broker and binds from **the first asynchronous
handoff of any shape**: a polled table, an in-process bus, a bare executor
submit, a webhook. Its three recommendation thresholds were withdrawn on
2026-07-29; the predicate needed no change.

*Check: read the predicate and ask what it excludes, then find the cheapest way
to do the governed thing that the predicate misses. **Convention** — a human or
agent judgement, with no host.*

### The composite-shape check

**List the shapes a repo will assemble *out of* the primitives the directives
govern, and mark each one: permitted, permitted with conditions, banned, or out
of scope.**

**Naming the undecidable properties *inside* each directive does not surface a
shape nobody wrote a rule about.** One rule set did the former diligently — every
directive carrying its own honest named gap — and passed over **five whole
shapes** in silence. And silence about a shape is worse than the usual failure:
a gap named inside a directive at least reads as a gap, whereas **silence about a
shape reads as nothing at all.**

**Every ban this check produces names the organisation fact it rests on and the
trigger that reopens it.** A ban removes an option from every future repo, so it
carries more than a ground.

The worked case is published in both halves. `money-storage` carries a
composite-shape table with a verdict on every shape a repo assembles out of
stored money, and states that it exists *because* of the neighbouring rule set's
failure. Those five missed shapes are now published as `async-handoff-shapes`
plus two bans in `async-handoff` — which does not retire the lesson, because the
defect was never the missing rules. It was that nothing in the rule set made the
absences visible.

*Check: the rule set has a shape table, and every entry is marked. **Convention.**
Producing the list is the work; nothing can tell you the list is complete.*

### The layer check

**For each directive, name the language its check reads — then name every other
language the same value passes through.** Query text. Migration text. View and
function definitions. A template. A serialized document. A script somebody runs
by hand.

**A value that crosses into any of them has left the reach of the rule that
governs it, and the rule still reads as complete.** The rule set this was found in
had **twenty-nine directives all enforced over application source**, a section
that correctly answered "which column type?", and **nothing at all about the
store's query language.** The finding is the sentence to carry: **the gap was not
a missing rule; it was a missing layer.**

Published worked case: `money-storage` bans arithmetic on money in the store's
query language outright, and ships the blind spot beside it — the lint cannot
reach query text assembled at runtime from fragments — **because a green lint
otherwise reads as coverage.**

*Check: per directive, enumerate the languages. **Convention**, and it is the
most mechanical of the five to *perform* while remaining impossible to automate:
the languages are enumerable, but only a reader knows which ones a value reaches.*

### The enumeration check

**Not inherited — an observation from writing this skill set.** State a rule set's
contents **by name, not by count.** A sentence that counts or enumerates decays
silently when the set changes, and **has no id to grep for.**

**Every authoring and review pass over this skill set has found new instances,
without exception — including the review of this skill, which found them inside
the two files publishing this very check.** It is the most reproducible defect in
the whole effort, and it recurs in files an earlier pass has already called
clean. The running total stood at **ten as of 2026-07-30**; treat that as a floor
and a dated observation, not a rate. What was learned about where it strikes:

- **A split is the highest-risk moment**, because each half inherits the whole's
  number and nothing re-derives it. Two instances were created by a single split.
- **A cross-document count is worse than a local one**, because the author cannot
  see the thing being counted. Several were counts of *another* document's
  contents, wrong at the moment they were written.
- **Publishing a new document obliges a sweep** of every sentence elsewhere that
  counts, and of every sentence that says the new thing does not exist. That sweep
  has been run after every publish in this set and has still left stale sentences
  behind — each time caught by a later adversarial review rather than by the
  sweep.
- **A superlative is a count in disguise** — "the one rule here with a panel
  behind it", "the strongest group in this set", "the only rule set here that is
  not predominantly convention", "the weakest-marked skill in the set", "the
  first skill in this set with no wiring section". Every one of those was false
  when written, and a reader has no way to tell a checked superlative from an
  unchecked one.
- **Fixing a count in one file does not fix its copy in the sibling**, and a note
  recording the fix reads as coverage for a file the fix never reached.

The practice: **prefer naming to counting.** Where a count must appear, put it
adjacent to the enumeration it counts, so the two are read together. **Never state
a count of another document's contents.** State an exception list rather than a
remainder — "these two are convention" survives a rule being added, and "thirteen
of these fourteen" does not.

**One exception, and it has to be stated or the rule is unusable**: where the count
*is* the evidence, state it with the date it was taken and say plainly it is a
check the reader can re-run rather than a fact to cite. Its decay is then the point
rather than the defect.

**Publishing this skill produced the sharpest evidence available for the check,
twice over.** First: a draft of `tech-decision-research`'s evidence file grounded
a claim about this set's marker vocabulary in four tallies of other files'
contents. Publishing these two skills changed all four within the hour, because
both files use the vocabulary they were counting. The counts were correct when
measured, correct when written, and false on arrival — **and nothing but
re-running the grep could have told anyone.** They were replaced by the grep
itself.

Second, and worse: **the review of these two skills found the failure throughout
both of them**, hours after they shipped the check against it.
`tech-decision-research` told its reader that this skill carries **three**
incompleteness checks when it carries five, in two files; both evidence files
named five frontmatter fields and called them six; a count of the other skills in
this set was two short; and a count already corrected in one file survived
untouched in its sibling — the sub-finding directly above, reproduced by the pair
of files that state it. **Publishing a check does not exempt the publisher**, and
nothing in the authoring of these two skills caught any of it.

*Check: a lint over number words adjacent to list structures is possible and
noisy. **Convention** in practice, plus the publish-time sweep. **The observed
instances are the ground — a dated floor of ten as of 2026-07-30, with more found
in every pass since; the response is unvalidated.***

### The token-placement check

**Not inherited — the same origin, and the one check here with a mechanical
form.** **Extract every identifier-shaped token from the source material —
backticked identifiers, product names, RFC numbers, status codes, configuration
keys — and require each to appear in the converted text, per directive rather
than per file.**

The failure it catches is a rule set **describing a tool where its own source
names one**: "the connection pool", "the metrics vendor", "a generator of that
class". This is invisible to every marker, id and link sweep, and it defeats the
rule that a ban ships with a *named* check — a described tool is not a named one,
and the reader cannot wire it.

Three things were learned about running it, and each cost a pass:

- **It works.** Run over one rule set's directive text it surfaced twelve
  described-not-named tools, and no other check had seen any of them.
- **Run it over every source region the text draws from, not only the directive
  text.** Widening the extraction to the *evidence* material surfaced
  twenty-three more, all of them in evidence files.
- **Per directive, not per file — presence is not placement.** One tool was
  dropped from the two directives its source names it for and inserted into the
  two where the source deliberately leaves it generic. All four inversions passed
  a per-file check, because the string was present somewhere.

**And the inverse case is a real finding, not a false positive**: where the source
withholds a tool on purpose, the converted text must withhold it too. A rule set
promising a pick that its own stack material deliberately declines to make is the
same defect with the sign flipped.

*Check: token extraction and per-directive presence — **bespoke**, and no
published tool does it. The check itself is scriptable in an afternoon, which is
what makes its absence hard to defend.*

## When the same rule lives in more than one place

**Prefer one owner.** Where a rule is genuinely cross-cutting, one document states
it and every other one points at it by name **without repeating the value** —
because a value stated in *N* documents drifts in *N*−1. The worked case here is a
dependency version ceiling that three stack skills need and one skill owns:
`llm-default-traps` states the version, the other three name that skill and
deliberately omit the number, and each carries the same fallback for a repo that
installs one and not the other.

**Where duplication is genuinely deliberate** — the same rule instantiated with a
different check on each platform, which cannot be centralised without separating
the rule from its gate — then **one index of every instantiation is the only thing
between deliberate duplication and drift.** Not a convention, not review: an index
that is updated in the same change as the rule. Nothing else catches it.

And the accounting rule that makes an inherited rule set safe to build on:
**every rule in it is accounted for.** Walk it rule by rule. Each one is either
carried with this platform's named check, or **named as a gap with the reason no
check can be hosted**, or recorded as a divergence the platform's type system or
database forces. **A rule passed over in silence reads as covered**, which is why
naming the gap is the requirement rather than a courtesy.

## Wiring the gates

Run once per rule set, not per rule. **Two of everything above can be machine
checked, and both are worth building before the rule set grows** — most of this
skill is convention by construction, so the two exceptions carry weight.

1. **The evidence-order check.** Every subheading in the evidence file names a
   real section of the directive text, and the subheadings run in the directive
   text's order. Fail the build on either. This is what stops an accreting rule
   set from silently reorganising itself by research date. **Bespoke** — a short
   script over two files, and no published tool does it.
2. **The dangling-pointer check.** No directive text cites a rule id, a principle
   by number, or a relative link back to material the reader does not have. Fail
   the build. **Bespoke**, and cheap: it is a pattern match over one file set.

**Then make the check print what it does not decide, on every run.** This is the
step that keeps the two above from becoming the false assurance the first
principle bans. Neither can decide:

- whether a note is filed under the **right** heading, only that the heading
  exists and is in order;
- whether the accounting walk over an inherited rule set was actually done;
- **any of the five checks above** — all five are about absence;
- whether the marker table is honest, or whether a rule marked *off-the-shelf*
  has its gate wired.

**It fails the build; it is not advisory.** A check that warns is a check that is
ignored by the second week.

**Then record what was wired and what was skipped, with the reason.** The entries
that are *not* gated by anything above and must be listed as such: the
premise-specificity test, the accounting walk, and all five of the incompleteness
checks. Every one of them is a human or agent judgement with no host.

## Named gaps — where no check reaches

Silence reads as coverage, so each is stated.

1. **All five incompleteness checks are unhostable, permanently.** Each asks what
   is *missing* from a text, and no checker can extract an absence. This is the
   largest gap here and it does not close — the mitigation is that the checks are
   cheap to run by hand and that a record of which rule set has had which one
   makes a skipped check visible.
2. **The two wireable checks are described here and not shipped.** They are not
   hypothetical — the material behind this skill records both of them implemented
   as one script in its own build, failing the build and printing what it does not
   decide. **That implementation is not published, and nothing in this skill set
   runs either check**: the invariant sweeps behind these skills were run by hand
   and by throwaway scripts. So a reader is told to build something that has been
   built before and that they cannot obtain, which is a shorter distance than
   starting from nothing and still a gap.
3. **The eight principles have never been tested by exclusion.** Nobody has
   recorded a rule that served none of them and was kept anyway, so nothing
   establishes that the eight are exhaustive — only that no rule so far needed a
   ninth.
4. **The premise-specificity test has no calibration.** No rule cut by it has been
   recorded, which means the test's discriminating power is unmeasured, and the
   honest reading is that it may be functioning as a justification format rather
   than as a filter.
5. **The enforcement marker decays with nothing watching.** A rule marked
   *off-the-shelf* whose gate was never wired reads as enforced forever. **The gap
   between a rule set's markers and a repo's actual build is checkable in
   principle and checked nowhere.**
6. **The enumeration and token-placement checks rest on observations from one
   effort.** The enumeration instances and the two token-sweep yields are a real
   ground and a narrow one: one corpus, one author, one review style. Neither
   check has been run against a rule set written by anyone else.

## Markers

**Enforcement, per rule** — the three values are defined above, in *Enforcement
markers, and the status tier*, which is this skill's own subject.

**Confidence, per claim** — *confirmed*, *primary-source verified*, *convention*,
*uncertain*, defined by `tech-decision-research`, which owns them.

| Claim | Marker |
| ----- | ------ |
| Every directive in this skill | convention — no execution, no primary source, no vote |
| That a rule set can pass every machine check and fail the predicate, composite-shape and layer checks | convention — but each rests on an observed failure of a shipped rule set, and each has a worked case published in this skill set |
| That the enumeration failure recurs — a dated floor of ten instances as of 2026-07-30, one of them created by publishing this skill and more found in its own review the same day | convention as a rule; the instances are observations from this skill set's own authoring, and the response to them is unvalidated |
| That token extraction catches described-not-named tools — twelve and twenty-three found, 2026-07-30 | convention as a rule; the yields are observations from two passes over one corpus |
| That the eight principles are exhaustive | **uncertain** — see gap 3 |
| That the premise-specificity test discriminates | **uncertain** — see gap 4 |

No date column: the material carries none and none was invented. **The conversion
date is 2026-07-30**, and it is not a verification date.

The ground behind each of these, the claims that must not be cited, and the
conditions that reopen one are one hop away in **[evidence.md](evidence.md)**.
