---
name: tech-decision-research
description: The procedure a technology decision clears before it becomes a rule a future agent follows — frame the situation weights, the premises and the decision owner in writing before naming any candidate; run an adversarial panel rather than one agent's survey, with a steelman for the loser and a planted canary in every hostile audit; verify each load-bearing claim by three independent refutation votes and mark the survivors confirmed, primary-source verified, convention or uncertain; date every version fact and name the re-open trigger; and re-verify on adoption rather than on a calendar. Load before picking a library, a framework, a datastore, an architecture or a tool, before grading the evidence behind a decision someone else made, and before re-dating a decision that has gone stale. This skill defines the four confidence markers the rest of this skill set marks its claims in.
---

# Researching a decision an agent will follow without re-deriving it

This is the procedure a verdict clears before it becomes a rule. Skipping a step
produces the one failure the whole shape exists to prevent: **a
plausible-but-unverified verdict that downstream agents follow faithfully.** A
wrong decision that reads as researched is worse than an open question, because
an open question gets asked again and a recorded verdict does not.

The output is a decision someone can act on months later without re-running the
research — which means the output is not the pick. It is the pick, plus the
premises it is conditioned on, plus what lost and why, plus a marker saying how
strongly it is held, plus a date, plus the condition that reopens it. A pick with
none of those is an opinion with a timestamp.

**Writing the decision down as a rule is a separate job with its own bar**, and
it is published as `enforceable-rules` in this skill set: the shape of a rule,
the filter a rule clears before it earns space in an agent's context, the
enforcement markers, and three checks a rule set passes while still being
incomplete. This skill stops at the verdict; that one starts there.

**There are no rule ids here, and that is deliberate.** Every directive is
referred to by its subject — *the frame*, *the canary rule*, *the three votes*,
*the provenance line*. Each is a `###` heading, and the heading is the anchor an
id would have been. Cite one from anywhere else as this skill's name plus the
subject, which resolves whether or not the reader installed this skill; a number
would resolve for one install and dangle for the other.

## Read the markers first — this skill is the weakest-marked in the set

**Every directive here is *convention*, and the material it was drawn from
carries no confidence marker and no date on any claim.** Nothing here survived a
refutation vote; nothing here rests on a primary source. It is a method recorded
by the person who ran it, and by its own rule in *A claim with no execution and
no primary source is convention* below, that lands it at convention. **The
method being self-applied is the whole of its evidentiary standing.**

Two consequences to hold onto:

- **The lapse rule cannot run here, and its absence is not an oversight.** Every
  other skill in this set carries a `review-by` date, past which a *confirmed*
  marker reads as *convention* with no maintainer action. There is no such date
  in the material behind this skill, and none was invented. The rule would be
  vacuous anyway: it demotes *confirmed* to *convention*, and there is no
  *confirmed* claim here to demote. **What that costs is real** — nothing makes
  this skill's age visible, so the reader has to.
- **No directive here carries a per-claim date, and no date was invented for
  one.** The material is undated. What is dated is the conversion: **the text
  below was written on 2026-07-30**, which is when it was *converted*, not when
  anything in it was *verified*. Do not read that date as a verification date;
  no verification happened.

Status tier: **decided, not yet validated** — decided and in use, with **no
production record of the method's outcomes**. Nobody has measured whether a
decision run this way survives longer than one run without it. That measurement
is the single most valuable thing that could happen to this skill, and *Named
gaps* says so.

## The premise, and the two problems

**Code is written by LLM agents and no human reads it line by line.** Every skill
in this set is conditioned on that. Here it bites in a specific place: the one
human gate reads the plan and the spec, **not the code**, so the plan is the last
cheap moment a wrong technology decision can be caught. After implementation, a
review is a model checking model output — it shares the implementer's blind
spots, so it is a backstop and never the gate.

That premise plus two problems is why this procedure exists rather than "just
research it":

- **An LLM implementer left alone picks technology by training-data default.**
  Not carelessly — *confidently*, and with working code. The corpus-dominant pick
  is the statistically likely one whether or not it is the right one, and it is
  often a library that was right five years ago.
- **Proper research is slow and gets redone per project.** A decision researched
  once and recorded properly is consulted; a decision researched informally is
  re-derived, and re-derivation lands on the corpus default again.

A verdict is portable exactly as far as its premises. That is not a caveat, it is
the reason *the frame* below records them before any candidate is named — it is
what lets a different repo read a verdict and know it does not apply.

## 1. Frame the decision before naming candidates

State all four in writing **before any candidate is compared**. A frame written
after the candidates are on the table is a rationalisation of a pick already
made, and it will read identically to a real one.

### State the situation weights

**Name what dominates this decision, in writing, before comparing anything.** The
four that recur:

- **Exactness** — a wrong value has a victim.
- **Operability** — who runs this in production, and what happens at 3am.
- **Verification** — what the build can be made to refuse to ship.
- **Corpus depth** — agents implement this, so how well does the model actually
  know the candidate.

An internal tool that can be wrong for a day and a ledger weigh these
differently, and every subsequent step reads differently depending on which
dominates. **Corpus depth is the weight most often left out**, and under this
skill's premise it is the one that changes the answer: a technically superior
candidate the model knows badly produces worse code than an adequate one it knows
well.

*Check: the frame document exists and names the weights before the candidate
list. Convention — no build gate can host this, and the failure mode is a frame
written last and dated first.*

### State the premises the verdict is conditioned on

**Write the conditions the verdict holds under, as a list, and treat that list as
part of the verdict.** Agents implement; no human reads the code; there is no
operations team; this is the money domain; and whatever else this decision leans
on.

This is the single highest-value line in the frame, because it is what a *reader*
needs and the researcher never does. **A verdict with no recorded premises is
either applied where it does not hold or ignored where it does**, and the reader
has no way to tell which mistake they are making.

*Check: the premise list ships with the verdict, not in the researcher's head.
Convention.*

### Name the decision owner, verbatim

**Record who decides — the user, the panel, or a named delegate — and record it
verbatim in the provenance line.** Not paraphrased. A decision whose owner is
unrecorded is re-opened by whoever disagrees with it next, because there is
nobody it can be referred back to.

*Check: the provenance line names the owner. Convention.*

### Strike what an existing rule set already decided

**Read the rule sets that already bind this repo first, and remove their
directives from the frame.** A panel spent re-deriving a decided verdict produces
**a second copy, not a second opinion** — and a second copy is strictly worse than
no work at all, because now two texts state the rule and one of them will drift.

The standing case in this skill set is money: the money skills own those
directives outright, so a decision about a stack covers only **this stack's check
for each of them**, plus whatever the platform needs that no existing rule set
carries. The same holds for caching and for asynchronous handoffs.

**The frame is where the scope narrows, and it is the only place that is
cheap.** Discovering mid-panel that a directive was already decided elsewhere
means the panel's output now has to be reconciled against text nobody read.

*Check: the frame names the rule sets read and what was struck. Convention. When
nothing is struck, say so — an empty strike list and an unread one look
identical.*

## 2. Run an adversarial panel, not a survey

**One agent researching one answer converges on the training-corpus default.** It
will produce a well-written comparison, cite real sources, and recommend what the
corpus recommends. This is the step that exists to break that, and it is the step
most often skipped under time pressure — a survey feels like research and costs a
quarter as much.

### Pick a panel shape with an adversary in it

**Three shapes, each with a hostile lens that is somebody's whole job:**

- **Four agents** — two opposed steelmen, each arguing one candidate on its best
  current form, plus a domain architect, plus a hostile audit of the lot.
- **Three agents** — an evidence miner (legacy-system forensics, law, production
  incidents; facts rather than opinions), plus a design steelman, plus a hostile
  audit.
- **Steelman duel plus hybrid audit** — candidate A's steelman against candidate
  B's, plus a hostile audit aimed specifically at the hybrids and middle roads,
  which is where an unaudited duel lands.

What makes these work is not the count. It is that **no agent in them is asked to
"research the best option"** — each is given a position or a lens and told to
push it, so the disagreement is structural rather than dependent on one agent
happening to be sceptical.

*Check: the provenance line names the shape. Convention.*

### Steelman the loser, and name it

**A rejected alternative is argued on its best current form, and the rejection
grounds are numbered.** Then: **record the training-corpus favourite by name and
why it lost.**

That sentence is the most important line the research produces. An agent told
"use X" still drifts to the corpus default. An agent told "the default is Y,
rejected because Z" does not. **Do not compress it away when the verdict becomes
a rule** — the named loser is the load-bearing half, and the reason it works is
that it addresses the instinct rather than talking past it.

Steelmanning on the *best current form* is the part that gets dropped: a
five-year-old objection to a candidate that has since fixed it is not a rejection
ground, it is a stale citation, and it is what an agent's training data is full
of.

*Check: the rejected-alternatives section names the corpus favourite and numbers
the grounds. Convention. Its absence is visible, which is the whole gate.*

### Every hostile audit carries a canary

**Plant a defect of the audit's own class in what it reviews, and require the
audit to find it. "Found nothing" counts only from a lens that caught its
canary.**

This is the one rule here that makes a negative result mean anything. An audit
agent that reports a clean bill of health has either done the work or produced
the most likely text for an agent asked to audit something — and those two
outputs are indistinguishable. A caught canary is the difference.

**An uncanaried "found nothing" is not evidence of correctness and must not be
recorded as one.** Record it as an audit that ran, with no calibration.

*Check: the canary and its detection are recorded per lens. Convention, and it is
the cheapest high-value step in this whole procedure.*

### Evidence is execution or a primary source, not prose

**A claim is evidence when it comes from something run or something
authoritative and dated — not from a well-argued paragraph.** A model's summary
of a library's behaviour is not evidence of that behaviour; the library's own
documentation is, and the library actually doing it under test is better.

A claim backed by neither is not discarded. It is **downgraded**, by the rule in
step 3 below, and kept as convention if it is worth keeping.

*Check: each load-bearing claim's evidence names the execution or the source.
Convention.*

## 3. Verify claims by refutation

### Three independent refutation votes per load-bearing claim

**Each load-bearing claim goes to three fresh-context agents told to refute it.
The claim survives on majority.** Fresh context is the operative word: an agent
that has read the panel's reasoning is defending it, not attacking it.

Refutation rather than confirmation, for the same reason the panel is adversarial:
an agent asked "is this true?" reaches for supporting evidence and finds it. An
agent asked "show this is false" reaches for the counter-case, and either brings
one back or does not.

**Only load-bearing claims get votes.** Three votes are expensive, and spending
them on a claim nothing rests on is what causes the load-bearing ones to be
skipped.

*Check: the vote outcome is recorded per claim, not per decision. Convention.*

### A claim with no execution and no primary source is convention

**A claim backed by neither execution nor a primary source auto-downgrades to
convention, and no vote is spent on it** — there is nothing for a refuter to
attack. This is not a penalty. It is what keeps the marker vocabulary meaning
something, and it is the rule the rest of this skill set leans on hardest.

**A whole rule set can land here honestly.** In this skill set the caching rules
are the worked case: every one of their sixteen directives is marked *convention*
because each is a design argument rather than an execution result, and the rule
set says so at the top rather than in a footnote. That is not a weak rule set. It
is an honestly marked one, and it is more useful than the same text with markers
it did not earn.

*Check: nothing marked above convention lacks a named execution or source.
Convention — and it is the one directive here a reviewer can actually verify by
reading the marker table against the evidence.*

### Mark the outcome per claim, in four values

**Per claim, not per decision** — a decision usually rests on claims of several
strengths, and one marker on the whole thing takes the strongest.

- **confirmed** — survived the three votes, against independent primary sources.
- **primary-source verified** — one researcher checked it against a primary
  source, with no panel. **Whatever its evidentiary strength, this is not
  *confirmed*; running the votes is what promotes it.** A pass that runs out of
  budget lands its claims here honestly rather than promoting them, and says
  which passes stopped short.
- **convention** — kept without surviving external evidence. **Say why it is
  kept**: cheap, enforceable, fails toward safety. A convention marker with no
  reason beside it reads as an admission rather than a decision.
- **uncertain** — a known gap, stated so it is visible.

**These four are the vocabulary the rest of this skill set marks its claims
in**, which is why they are defined here and not in each skill. All four are in
live use across the published skills, *production-confirmed* only in order to
record that nothing has reached it. One skill adds a fifth value, **recorded**,
for a dated observation carried as history rather than as a current fact — that is
a local extension, defined where it is used, and not part of this vocabulary.

**The failure this vocabulary exists to prevent is a one-word one.** Dropping a
*convention* marker promotes a design argument to a verified fact, silently, and
nothing downstream can tell. Treat a marker as part of the claim's text.

*Check: every claim in the evidence trail carries one of these. Convention.*

### Record the negative results

**A source that did not survive verification is recorded as "do not cite", by
name, so the next pass does not re-import it.** So is a claim that turned out to
be about a different version, a different product, or a neighbouring issue.

This is the cheapest step here and the one with the longest payoff: the next pass
is usually run by an agent whose training data contains the same discredited
source, and it will reach for it again. **A do-not-cite entry whose subject is
anonymised cannot be obeyed** — it announces that a trap exists and withholds
which thing is the trap, which is worse than no entry, so name the source, the
version, and the issue.

*Check: the evidence trail has a do-not-cite list, and every entry names its
subject. Convention.*

## 4. Date everything, name the exits

### Every version fact and tool verdict carries its verification date

**And release dates too, where decay matters.** A version fact with no date is
unusable within months, because the reader cannot tell whether to trust it or
re-check it, and re-checking everything is the same as trusting nothing.

Dates are what make staleness **visible**, not impossible. That is the whole
ambition — nobody is claiming a dated fact stays true.

*Check: no version number or tool verdict without a date beside it. Convention,
and it is mechanically checkable in a way most of this procedure is not: a
version-shaped token with no nearby date is a grep.*

### Every decision names its re-open triggers

**Name the condition that reopens the decision — and where the stakes justify it,
an escape hatch: the named fallback, plus the tripwire that activates it.**

Then the payoff clause, which is the point of the whole step: **absent the
trigger, the decision is not re-litigated. Record it once, point at it
forever.** A decision with no trigger gets re-argued whenever someone feels
uneasy, and the re-argument lands on the corpus default, because that is what an
unframed re-derivation lands on.

A trigger is a *condition*, not a date. "Revisit in six months" is not a trigger;
"a maintained implementation appears on this stack" is.

*Check: every verdict has at least one trigger. Convention.*

### The provenance line

**One line on the verdict: who decided, by what method — the panel shape — and on
what date.** It is what makes every marker above auditable, and it is what a
later reader uses to decide how much of the research to redo.

*Check: the verdict has a provenance line. Convention. Its absence is the
cheapest thing to spot in a review and the most commonly missing.*

## 5. The re-verification pass, on adoption or on lapse

**Smaller than the original pass, deliberately, and scoped rather than
re-run.** A full re-run is what makes re-verification never happen.

- **Re-check the dated version facts and every claim marked *uncertain*.**
- **Re-run refutation votes only on claims whose ground shifted** — a new major
  version, a maintainer change, a withdrawn standard, a named trigger firing.
  Not on everything.
- **Re-date `verified`, move `review-by`.**
- **Note superseded verdicts with dated notes pointing at the successor — never
  silent edits.** A silently edited verdict destroys the only record of what was
  believed and when, which is what every marker above was for.

**Adoption is the real re-verification checkpoint, not the calendar.** A decision
is re-verified when someone needs it. The `review-by` date is there so that a
lapsed decision degrades honestly on its own — past it, every *confirmed* marker
reads as *convention* until a pass re-dates it, and that holds by definition with
no maintainer action.

*Check: the re-verification pass re-dates the frontmatter and records what it did
not re-check. Convention. A pass that re-dates everything while re-checking some
of it is worse than no pass.*

## What checks this — and the principle this skill cannot satisfy

**Nothing in a build checks any directive above, and one of them is the reason
that is worth stating rather than glossing over.**

`enforceable-rules` in this skill set publishes the principle that a rule ships
with a named check that fails the build, or it is not a rule — a ban with no
check is a wish. **By that standard nothing here is a rule.** That is not a
defect in either skill, and the resolution is a scope distinction worth being
explicit about:

- **That principle governs rules that bind code.** Its subject is a construct in
  a repository, which a linter, a compiler, an architecture test or a fuzzer can
  reach.
- **This skill's subject is the decision, which happens before there is any code
  to check.** Its directives bind a process, and every check named above is the
  same kind: **a written artifact whose absence is visible.** The frame document,
  the numbered rejection grounds, the canary record, the marker per claim, the
  do-not-cite list, the provenance line, the trigger.

That is a real gate, and it is weaker than a build gate in one specific way that
matters: **it catches an omission and cannot catch a lie.** A frame document
written after the candidates were chosen passes every check here. A provenance
line naming a panel that never ran passes. **The only defence is that the
artifacts are cheap to produce honestly and expensive to fake convincingly**, and
that a reader who doubts one can read the panel's own output.

So: **no `## Wiring the gates` section in this skill, because there is nothing to
wire** — the first skill in this set without one, and the absence is deliberate
rather than unfinished work. What a repo adopting this should do instead is name
the place these artifacts live, so that "the frame is missing" is a sentence
someone can say about a specific file.

## Named gaps — where this procedure does not reach

Silence reads as coverage, so each is stated.

1. **The method has no outcome measurement.** Nobody has compared a decision made
   this way against one made without it, on any axis — how long the verdict
   survived, whether the panel changed the pick, whether the votes ever
   overturned a claim. **This is the largest gap here**, and it is why the status
   tier is *decided, not yet validated* rather than production-confirmed.
2. **Every check here catches an omission and not a fabrication** — see the
   section above. A dishonest pass is indistinguishable from an honest one by
   inspection of the artifacts alone.
3. **The panel shapes are three that were used, not three that were compared.**
   Nobody ran the same decision through two shapes to see whether the shape
   changes the answer. Treat the choice between them as a cost decision.
4. **Three votes is a number, not a finding.** It is odd, so majority resolves,
   and it is affordable. Nothing establishes that three is where the returns
   flatten, and no pass has recorded a claim that survived two votes and failed
   the third.
5. **Independence between refuters is asserted, not enforced.** Fresh context is
   what is meant by *independent*, and three fresh contexts of the **same model**
   share the same training corpus. Where the corpus itself holds the wrong
   consensus, three votes reproduce it three times. **This is the failure mode
   this procedure is least protected against**, and the mitigation is the one in
   *Evidence is execution or a primary source* — a primary source is outside the
   model, and a vote against one is worth more than a vote against reasoning.
6. **The cost is real and unbudgeted.** A four-agent panel plus three votes per
   load-bearing claim is expensive enough that the honest failure mode is not a
   skipped step but a pass that quietly reclassifies its claims as
   non-load-bearing. **A pass that ran out of budget says so and lands its claims
   at *primary-source verified*** — that value exists for exactly this, and using
   it is the honest exit.

## Markers, dates, and what they mean

**Confidence, per claim** — the four values are defined above, in *Mark the
outcome per claim, in four values*, and that is this skill's own subject rather
than a restatement.

**Enforcement, per rule** — *off-the-shelf*, *bespoke*, *convention*. Those three
are defined by `enforceable-rules`, which owns them, because they are a property
of a rule's check rather than of a research claim. Every check named in this
skill is the third of them.

**Status tier, per rule set** — *production-confirmed*, *decided, not yet
validated*, *deferred*. Also defined by `enforceable-rules`. **A repo that
installs this skill and not that one has this skill's confidence vocabulary and
neither of the other two**, and no skill here supplies them in that case; they
are stated where they are used, once.

**The marker table for this skill is short, and its shortness is the point:**

| Claim | Marker |
| ----- | ------ |
| Every directive in this skill | convention — no execution, no primary source, no vote |
| That this procedure improves decision outcomes | **uncertain** — never measured, see gap 1 |
| That three independent refuters of one model are independent enough | **uncertain** — see gap 5 |

No column for dates, because the material carries none and none was invented.
**The conversion date is 2026-07-30**, stated once, above, and it is not a
verification date.

The ground behind these directives, the reasoning that was left out of the
directive text, and the conditions that would reopen any of them are one hop away
in **[evidence.md](evidence.md)**.
