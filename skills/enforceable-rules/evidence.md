# Evidence — writing a rule that binds an agent

One hop from [SKILL.md](SKILL.md). The ground behind the directives there, the
claims that must not be repeated as verified, and the conditions that would
reopen one.

## The provenance, and why the markers had to be derived

The premise-specificity test, the eight principles, the marker vocabularies, the
shape of a rule, and the first three incompleteness checks were drawn from a
written authoring bar — the standard every other skill in this set was written
against. **That document is not published here**, so no claim
below can be checked against it by a reader, and where a claim's only ground is
that document, this file says so.

What it lacked, which is what forced every marker in `SKILL.md`:

- **No frontmatter.** No status, no premise list, no verification date, no expiry
  date, no maintainer — while requiring all six of every rule set it governed.
- **No confidence marker on any claim in it.** Not one.
- **Two dates in the whole document, and neither attaches to a directive this
  skill carries.** One, **2026-07-28**, marks an amendment that split
  never-adopted cross-platform rule sets from adopted ones and added the
  accounting checks for the adopted kind — bookkeeping about a corpus structure
  this skill does not convert. The other, **2026-07-29**, is the day the eight
  principles were given stable numbers, which is the one decision this skill
  deliberately reverses. **So no directive here got a date, and none was
  invented.**

**The markers were therefore derived, once, by applying the sibling skill's rule
to this material**: a claim backed by neither execution nor a primary source is
*convention*. An authoring bar recorded by the person who set it is exactly that.
The conversion happened on **2026-07-30**; that is a conversion date and nothing
else.

## The id decision, in full

The source assigns each principle a stable number and states the reason
explicitly: they are cited by number from several documents, and a citation
naming a *list position* instead breaks silently the first time the list is
reordered. It also states the counter-constraint — the numbers belong in the
authoring documents only, because text pasted into a repository that holds no
copy of the corpus reads a cited number as **that repository's own** numbering.

`SKILL.md` drops the numbers. Three grounds, in order of weight:

1. **The counter-constraint is the operative one for an installed skill.** Nothing
   a consumer installs carries the source document, so a number here is a pointer
   into text the reader does not have — the same dangling pointer the source
   itself bans, arriving through a different door.
2. **The other twelve skills in this set already refer to these principles in
   prose**, having been written under the same ban. Shipping numbers now would
   create the asymmetry this skill set has already settled against: an id that
   resolves for a reader who installed this skill and dangles for one who did not.
   A name resolves either way, because it reads as an instruction rather than as a
   pointer.
3. **The transferable half of the rule survives the numbers being dropped.** What
   the never-renumber rule is *for* is that a citation must not depend on list
   position. A stable name satisfies that as well as a number does, and better for
   a reader — which is why `SKILL.md` states the rule as "cite by a stable anchor,
   never by position" and warns that renaming an anchor breaks every citation to
   it.

**What this costs, stated because it is a real loss:** a number is unambiguous and
a name can be paraphrased. A citation reading "the fail-loud principle" is
recognisable; one reading "the principle about not being silently wrong" is a
paraphrase that will drift. The mitigation is the instruction to treat the names
as ids that happen to be readable, and it is weaker than a number.

## The eight principles

**All eight are stated in the source as following from the premise, with no
marker, no date, no vote, and no citation.** They are the author's derivation.
Nothing about them is confirmed, and `SKILL.md` marks them accordingly.

Two things about them *are* checkable, and both are offered as checks a reader can
run rather than as facts to cite:

- **The other skills in this set were written against them**,
  and the worked case named beside each principle in `SKILL.md` is in a published
  skill. Anyone who installed those skills can read the case.
- **No rule in any of them serves none of the eight.** That is a property of
  the rules that were kept, not evidence that the eight are exhaustive — nobody
  recorded a rule that failed all eight and was kept anyway, which is gap 3 in
  `SKILL.md` and the reason exhaustiveness is marked *uncertain*.

**The strongest of the eight, on the evidence available, is the false-green clause
under *Machine-enforced or it is not a rule*** — and it is the only one with
three independent instances rather than an argument. The instances are all
published here: an architecture-test tool that cannot see a static type through an
erased signature, so a "never log this type" rule passes while protecting
nothing; the same false green shipped once already for a serialization rule; and a
published contract-comparison tool that detects incompatibilities, writes a
report, and exits zero. **The clause's ground is therefore better than the
principle's**, and a reader who trusts only one thing in `SKILL.md` should trust
that clause.

## The three inherited incompleteness checks

Each was recorded in the source because **a shipped rule set failed it**, and
each is named there by a decision id in a document that is not published
anywhere. The ids are deliberately not carried; the names in `SKILL.md` are the
source's own names.

**The source states plainly that none of the three is machine-checkable** — that
a rule set can satisfy every other check, pass its build gate, read as thorough,
and still fail all three. That claim is an argument rather than a measurement, and
it is the load-bearing one behind the whole section.

| Check | The failure behind it | Marker |
| ----- | --------------------- | ------ |
| Predicate | Two rule sets in a row scoped their seam to the obvious client library, leaving the cheapest correct option — which imports no client — outside every check. One had its recommendation reversed within hours of shipping while the widened predicate survived | convention as a rule; the failure is an observed one |
| Composite-shape | One rule set named the undecidable properties inside each directive diligently and passed over **five whole shapes** a repo assembles out of its primitives, in complete silence | convention as a rule; the five shapes are verifiable, see below |
| Layer | A rule set with **twenty-nine directives all enforced over application source**, a section correctly answering "which column type?", and nothing at all about the store's query language. Failed by the **oldest** rule set in the corpus, after it had been read, lifted and re-reconciled three times | convention as a rule; the closure is verifiable, see below |

### The worked cases, and how to verify each

**All three failures produced a published fix in this skill set**, which makes
this the one section here whose ground a reader can check without any unpublished
material. What to read:

- **Predicate** — `money-storage` states its predicate in terms of a hand-written
  query, a view definition, a migration and a support script, **none of which
  imports a client library**, which is the widened predicate in published form.
  `async-handoff` is named for a broker and binds from the first
  asynchronous handoff of any shape; its three recommendation thresholds were
  withdrawn on **2026-07-29** and the predicate needed no change, which is the
  reversal case in published form.
- **Composite-shape** — `money-storage` carries a shape table with a verdict on
  every shape a repo assembles out of stored money, and says in the section head
  that it exists because of the neighbouring rule set's failure. The five missed
  shapes are published as `async-handoff-shapes` plus two bans in
  `async-handoff`: a multi-transaction flow, state reconstructed from message
  history, an aggregate computed across messages, HTTP across the organisation's
  boundary, and a payload too large for the transport.
- **Layer** — `money-storage` bans arithmetic on money in the store's query
  language, and ships the blind spot beside it: the lint cannot reach query text
  assembled at runtime from fragments.

**The fixes existing does not retire any of the three checks**, and the reason is
stated in `money-storage` itself: the defect was never the missing rules, it was
that nothing in the rule set made the absences visible. A rule set that fixes five
shapes and keeps the mechanism that hid them will hide the sixth.

## The two additions, and why they are here

**Neither the enumeration check nor the token-placement check is in the source
material.** Both were derived from the authoring and review of this skill set,
and `SKILL.md` marks both as additions rather than presenting them as inherited.

**The case for adding them:** two of the three inherited checks exist because a
shipped rule set failed them, and these two have the same provenance — a
repeatedly observed failure in rule-set authoring, with a stated response.
Omitting them would have left the skill teaching a bar while withholding the two
defects that applying the bar actually produced.

**The case against, recorded because it is real:** every other skill in this set
converts material rather than authoring it, and these two are authored. A reader
who trusts this skill because the rest of the set is conversion is being given
something with a different provenance. That is why both are marked in the
directive text, in the marker table, and here.

### The enumeration check

**Nine observed instances** during the authoring and review of this skill set, and
a tenth created by publishing this skill — the most reproducible defect in the
effort, and it recurred in files an earlier pass had already declared clean. The five sub-findings in `SKILL.md`
(splits create it, cross-document counts are worse, publishing obliges a sweep,
superlatives are counts in disguise, fixing one copy misses the sibling) are each
drawn from specific instances rather than reasoned out.

**What is not established:** whether the response works. Nobody has written a rule
set under a name-not-count discipline and measured a lower rate. **The instances
are the ground; the practice is unvalidated.**

**One sub-finding is worth more than the others** and is the one to carry if only
one survives: **a note recording that a count was fixed reads as coverage for a
file the fix never reached.** That happened here — an identical decayed phrase
sat in a sibling file while the record said it had been caught.

### The token-placement check

**Two yields, from two passes over one rule set:**

- Extracting identifier-shaped tokens from a rule set's **directive** source and
  requiring each in the converted text surfaced **twelve** tools that the
  conversion had described rather than named. No marker, id or link sweep had seen
  any of them.
- Widening the extraction to the **evidence** source surfaced **twenty-three
  more**, all of them in evidence files. The check was right and its input region
  was too narrow.

And one placement finding: a single tool was **dropped from the two directives its
source names it for and inserted into the two where the source leaves it
generic**. All four inversions passed a per-file check, because the string was
present somewhere in the file. That is the ground for "per directive, not per
file — presence is not placement."

**The inverse case is a finding and not a false positive.** Where source material
deliberately withholds a tool — because the pick was never made — the converted
text must withhold it too. One rule set here promised a pick that its own stack
material declines to make, and the fix was to correct the promise rather than to
invent the pick.

**What is not established:** the check has never been run against a rule set
written by anyone else, and both yields come from one corpus with one author and
one review style. It is also the one check here with an obvious mechanical form
and no implementation, which `SKILL.md` states as a gap rather than a plan.

## Do not cite

- **Do not cite this skill, or the bar behind it, as production-validated.** The
  status tier is *decided, not yet validated*: every other skill in this set was
  written against it, which is usage. No repo has operated them long enough to report
  whether the bar predicted anything.
- **Do not cite the eight principles as exhaustive.** Nothing tests them by
  exclusion. See gap 3.
- **Do not cite the premise-specificity test as a demonstrated filter.** No rule
  cut by it has been recorded, so its discriminating power is unmeasured, and it
  may be functioning as a justification format. See gap 4.
- **Do not cite the enumeration or token-placement checks as inherited practice.**
  Both are additions from this skill set's own authoring, and saying otherwise
  borrows credibility the source material never lent them.
- **Do not cite "ten instances", "twelve tools" or "twenty-three more" as
  general rates.** They are counts from one corpus. Repeating them as a finding
  about rule-set authoring in general is the precise failure the enumeration check
  is about.
- **Do not cite 2026-07-30 as a verification date**, nor 2026-07-28 or 2026-07-29
  as verification dates for anything here. The first is when this text was
  written; the other two mark amendments to material this skill does not carry.
- **Do not describe the premise-specificity test, the accounting walk, or any of
  the five incompleteness checks as enforced.** All six are judgements with no
  host, and `SKILL.md`'s wiring step requires them to be recorded as skipped.

## Re-open triggers

- **A rule that serves none of the eight principles and is worth keeping
  anyway.** It is the only thing that can promote gap 3, and it either produces a
  ninth principle or shows that the eight are the wrong axis.
- **A recorded rule cut by the premise-specificity test.** The first one
  calibrates the test; a year without one is evidence that it is not filtering.
- **A rule set written by someone outside this corpus, run through the five
  incompleteness checks.** All five ground out in failures of rule sets written by
  one author under one bar. An outside rule set either reproduces the failures or
  narrows the checks.
- **Either wireable check actually being built.** Gap 2 says a reader is being
  told to build something the author has not; building it closes the gap and, more
  usefully, produces the first evidence about how often the two failures they
  catch actually occur.
- **A false-green gate found in this skill set's own rules.** The first principle's
  strongest clause has three instances, all of them tools this set bans or names.
  One inside the set would be worth more than all three, and would test whether
  the bar catches its own violations.
- **A count decaying in a rule set written under the name-not-count practice.**
  That is the enumeration check's own refutation, and nothing else can supply it.
- *Conversion addition, not a trigger the source recorded:* **a measurement of the
  gap between rule sets' enforcement markers and adopting repos' actual builds.**
  Gap 5 says that gap is checkable in principle and checked nowhere; one
  measurement would establish whether *off-the-shelf* markers are honest in
  practice or decorative.

## What this skill deliberately does not carry

Recorded so the absences are not read as oversights.

- **The mechanism a rule set is pasted into.** The source is written around a
  specific project scaffold — a constitution file, a plan document with a decision
  table, a wrapped planning command, a preset. That machinery is not published
  here and would be a dangling reference; a repo adopting these directives names
  its own place for rules and its own approval gate. `SKILL.md` says a rule set
  ships in text the reader has, and stops there.
- **The corpus bookkeeping** — a roster of rule sets, which one has had which
  audit, a candidate list, a retirement clock for a rule set nobody adopted, and
  the governance capping the corpus at what one maintainer can re-verify. That
  machinery maintains a corpus; it is not a capability anyone installs.
- **The distinction between a rule set that is pasted and one that is only ever
  instantiated by another.** It is real and load-bearing in the source — it is why
  some rules live under stable ids and are never adopted directly — but it is a
  fact about how *that* corpus is filed. What generalises from it is in *When the
  same rule lives in more than one place*: prefer one owner; where duplication is
  deliberate, one index is the only thing that catches drift.
- **The six-step adoption procedure**, which names files in that scaffold. Two of
  its steps do generalise and are carried: re-verify the dated facts at adoption
  rather than on a calendar, and wire the checks in the same change — a rule whose
  check is not wired yet is marked as deferred with a reason, **never described as
  enforced.**
- **The research method itself** — framing a decision, panel shapes, refutation
  votes, the confidence markers, the provenance line, the re-verification pass.
  **That is published as `tech-decision-research` in this skill set**, and it is
  the step before this one: it produces a verdict, this skill turns the verdict
  into a rule. A repo writing rules needs both, and a repo installing only this
  one has the enforcement markers and the status tiers but not the confidence
  vocabulary — which `SKILL.md` states where the markers are defined.
