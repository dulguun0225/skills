# The two wired gates — 2026-08-02

The first executable checks this repository has ever carried, in `scripts/`.
`BACKLOG.md` had held the row *the two wireable checks that skill describes are
still not in this repo* since the incompleteness sweep, priced at a bounded
session. It was a bounded session. **The row is gone from the backlog, and this
file is what it left behind.**

Both implement `enforceable-rules`, *Wiring the gates*, items 1 and 2. Both exit
non-zero — that skill says a check that warns is a check ignored by the second
week. Both print what they do not decide on every run, which the same skill
requires and which is not decoration: it is the guard against the false assurance
its first principle bans.

```bash
npm run gates                    # both
npm run check:evidence-order     # --orphans lists the headings that anchor to nothing
npm run check:pointers           # --pairs lists the cross-skill id citations
```

`scripts/lib/md.mjs` is shared and deliberately dependency-free: headings, links
and a code-fence stripper. A dependency here would be a dependency in the only
gates this repo hosts.

## The finding that outranks the code

**The evidence-order check, as `enforceable-rules` states it, does not hold over
the skills that published it.** The rule is *every subheading in the evidence
file names a real section of the directive text, and the subheadings run in the
directive text's order*. Measured, the day it was wired:

| Anchoring | Skills |
| --------- | ------ |
| Most headings anchor | `ai-maintainer-principles`, `business-numbering`, `primary-keys` |
| Some anchor | `backend-stack`, `enforceable-rules`, `java-backend-api`, `java-backend-observability`, `java-backend-rules`, `money` |
| **None anchor** | `async-handoff`, `async-handoff-shapes`, `caching`, `guardrails-toolchain`, `llm-default-traps`, `money-api`, `money-storage`, `tech-decision-research` |

Eight evidence files name no directive section at all. They are not disordered —
they are organised by research pass, by hostile audit, by rejected alternative,
by dated claim, which is how the research actually happened and how the files
were reviewed. The directive-by-directive shape arrived later, with the harvested
skills.

**The gate ships with those eight declared by name and by reason, in
`PASS_ORGANISED` in `scripts/evidence-order.mjs`, rather than with the rule bent
to fit them.** Consequences, both deliberate:

- The order half binds nine skills. On the other eight it binds nothing, and the
  declaration is what makes that visible instead of silent — an evidence file
  anchoring to nothing is exactly what a silent reorganisation looks like, so the
  difference between these eight and a defect is a written line.
- **A new skill fails by default.** Zero anchors and no declaration is a
  failure, so the choice gets made in the open rather than skipped.

What is owed and is not closed by this: nothing decides whether those eight
*should* be reorganised. That is a call about published skills, and this pass did
not take it.

## The heuristic that was written and dropped

The first evidence-order draft scored heading similarity — Dice coefficient over
content words — to catch a section renamed away from the directive it grounds.
**It produced five hits against this repo and all five were coincidences**:
`Re-open triggers` against `The re-open triggers, and the shape of them`, `What
this skill does not carry` against `What the record does not carry`, `The wire
format` against `Wire`, `Computation in the query language` against `Persistence
— the query language`, twice more of the same kind. Every one was a structural
evidence section sharing vocabulary with a directive it has nothing to do with.

Dropped whole rather than tuned. **A gate whose every finding to date is false
teaches its reader to skip it**, which is the same failure as a warning-only
check. What remains is three exact conditions: order inversion among headings
that do anchor, two evidence sections anchoring to one directive, and the
undeclared-zero-anchor case above. A merged evidence heading — one section
covering two directive sections — anchors to the first directive it names in
full, so `primary-keys`' merged externally-governed-code section is not a
finding.

## Why a rule id is only recognised in code ticks

The dangling-pointer check's first draft matched the bare shape `[A-Z]{1,3}-\d+`
and reported 25 failures, **every one of them an identifier of the world**: ECJ
case C-302/07, `JSR-385`, `JSR-275`, `AIP-158`, `AIP-136`, `JDK-24`, `BSD-3`,
`MPL-2`. The `C-` collision is the instructive one — a European court case
number sits in the same shape as this set's caching ids.

Two conditions separate this set's numbering from the world's, and both are
conventions the skills already follow rather than rules invented for the gate: a
rule id is **cited in code ticks** and **defined in bold** (`` `M-35` `` against
`**M-35 — …**`). Measured the day it was wired, so it is re-runnable rather than
a fact to cite: 1,373 ticked citations against 96 bare occurrences in the `M`,
`C` and `E` namespaces, and **95 of the 96 are definitions. The single exception
is the ECJ case above**, which is the collision itself and not a counterexample
to the convention. The prefix must also be one this set actually defines, derived
from the definitions rather than hard-coded.

`P-n` and `B-n` fail on sight, ticked or not, because the ban on them is
absolute — they are the deleted corpus's principle and decision-log numbering,
they resolve for whoever wrote them and dangle for every reader, and a definition
happening to exist would not change that.

## Both gates were proven to fail

Injected into `primary-keys`, then reverted: two evidence headings swapped, and
one line carrying `` `M-999` ``, `P-4`, `](../money/SKILL.md)` and `BACKLOG.md`.
The order inversion, the undefined id, the banned id, the escaping link and the
repo-only filename were each reported, one line apiece. **A gate never seen to
fail is a gate nobody has tested**, and this repo publishes that rule in
`guardrails-toolchain`.

Clean state: 0 failures on both, 17 evidence files checked, 95 rule ids defined,
52 skill pairs citing ids across a dir boundary.

## What this closes, and what it does not

Closed: the `BACKLOG.md` row, and `CLAUDE.md`'s claim that the corpus's
`check_packs.py` had no equivalent here.

**Not closed, and stated so a blank does not read as coverage.** All five
incompleteness checks remain unhostable by construction. Neither gate reads
evidence content, marker honesty, or whether a rule marked *off-the-shelf* has
its gate wired. **And nothing runs either of them automatically: there is no CI
in this repository, so `npm run gates` is a command someone has to type, which is
a weaker thing than a gate and should not be described as a stronger one.**

**The `bundle-checks.yml` freshness step still has no equivalent** — nothing
warns when a `review-by` date passes, and the lapse rule remains self-executing
on the reader. **Decided the same day not to write it, which is why it sits here
and not on `BACKLOG.md`**: it is cheaper than either gate above, but unlike them
it is worthless unless something runs it on a schedule, and the paragraph above
says what this repository has for that. Reopens the day this repo gains CI. As of
2026-08-02 no `review-by` date in the set has passed — the earliest is
2027-01-21 — so nothing is mis-marked today by the absence.
