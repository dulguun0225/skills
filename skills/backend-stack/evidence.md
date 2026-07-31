# Evidence — choosing a backend stack

The ground behind each directive in [SKILL.md](SKILL.md), the claims that must
**not** be cited, and the conditions that reopen a rule. Read the directive
first; this file is for deciding whether to trust it.

## What stands behind this skill, and what does not

**One pass, no panel, no per-claim markers, and its sources are not held here.**

| Pass | Scope | Panel | Markers it recorded |
| ---- | ----- | ----- | ------------------- |
| 2026-06-11..14 | The platform decision — persistence, and the corpus favourites it rejected | full research pass | **none per claim** |
| 2026-08-01 | This conversion. Generalised the pass's practice into a criterion; ran the host census | none | convention throughout |

**The 2026-06-11..14 pass is the same one `java-backend-rules` names**, and its
recorded scope is *persistence*. The language and runtime choice is attributed to
it because no other pass covers that ground, **not because a note says so** —
that attribution is an inference drawn during this conversion, in the same shape
`java-backend-rules/evidence.md` records for its three undated Platform
directives. Treat the date as the best available anchor, not as a verification
date.

**The 2026-08-01 conversion date appears once, at the top of `SKILL.md`, and is
labelled as a conversion date.** No per-directive date was invented. Where a
directive carries 2026-08-01 rather than 2026-06-11..14, it is because the
directive states something the platform pass did not write down in that form —
*Prefer a stack where the wrong call cannot be written*, *Operability is a veto*,
*A rule set is never a reason to adopt a stack*, *Enforcement-tool maturity* —
and the date says so rather than borrowing the pass's authority.

## The criterion

- **The central claim is *uncertain*, and that is the strongest honest marker.**
  No backend has been built on a stack chosen by a competing criterion and
  compared to one chosen this way. No candidate has ever been rejected *by* this
  criterion — it was written after the decision it explains, from that decision's
  practice. A criterion that has only ratified is a criterion that has not been
  tested. This is the second skill in this set whose central claim is marked
  uncertain rather than caveated; `tech-decision-research` was the first, for the
  same reason — no outcome measurement.

- **The eight host categories are this conversion's synthesis, derived by
  reading what the published skills actually use.** They are not drawn from any
  taxonomy a pass wrote down, and no source states that these eight are
  exhaustive or that they are the right cut. What grounds them is narrow: every
  enforcement marker in this skill set resolves to one of the eight, which is a
  property of this skill set and not evidence about stacks in general.

- **Corpus gravity and its asymmetry are reasoning, not measurement.** Nobody has
  counted how often an agent session drifts toward a banned construct on this
  stack, or measured the drift rate against a stack with a smaller corpus. The
  argument — one-time gain per feature against a standing cost paid every
  session — is the platform pass's rejection reasoning generalised, and
  `java-backend-rules` states the specific form of it that pass did write down:
  *the corpus advantage self-cancels*.

- **Operability as a veto is a narrowing of a published sentence, not a new
  claim.** `java-backend-rules` previously stated operability as the *dominant
  criterion* for the platform choice and told a reader with an open platform to
  decide on operability first. That sentence was written when no skill argued the
  choice. It is now narrowed there to a veto, with the ranking moved here. **The
  half of it that survives unchanged is *a rule set is never a reason to adopt a
  stack*** — which is why that sentence appears here as a directive rather than
  being dropped.

## The census

- **It is a grep over the published skills, dated 2026-08-01, and it proves one
  thing.** That a compiler-plugin surface, an architecture-test library, a
  container-test story and an artifact-lint story all exist for this stack and
  are all in use at once. The command is published in `SKILL.md` so the number
  can be re-derived rather than trusted, and **its decay is the point**: a count
  of another document's contents that cannot be re-run is a count that goes
  quietly wrong, which is a failure this skill set has recorded repeatedly.

- **Sixteen hosts, taken 2026-08-01.** ArchUnit, Error Prone, NullAway, JSpecify,
  the Checker Framework, jOOQ's `PlainSQLChecker`, jqwik, Schemathesis,
  Testcontainers, Toxiproxy, squawk, vacuum, promtool, oasdiff, JaCoCo, pitest,
  maven-enforcer. Two of these are load-bearing far beyond the rest — **ArchUnit
  and Error Prone appear in more files than any other host**, which is what
  *Enforcement-tool maturity is a separate question* points at when it names a
  single point of failure the version numbers do not show.

- **Do not cite the census as evidence that Java's enforcement surface is
  *deeper than* any alternative's.** No equivalent census was run for any other
  candidate. The comparison is unmade, and the sentence in `SKILL.md` is worded
  to say so.

- **Do not cite the census as evidence that the platform choice was correct.**
  It is a census of this skill set's own tool names. Reading it as
  justification is the exact circularity *A rule set is never a reason to adopt
  a stack* exists to block.

## Claims that must not be cited

- **That the platform pass compared languages.** Nothing in this skill set
  records a candidate list at the language or runtime layer. The pass's recorded
  scope is persistence, where it *did* record losers and grounds — JPA,
  Hibernate and Spring Data JPA, rejected as runtime-silent — and those are
  stated in `java-backend-rules`, not here.

- **That Java's compile-time guardrails are mature "compared to" a named
  alternative.** No such comparison is held here. What is held is the census
  above.

- **That this skill's criterion has selected against anything.** It has not.

- **The 2026-06-11..14 pass's primary sources.** They are not published in this
  skill set and were not consulted during this conversion. **A reader who wants
  sources for the Java verdict will not find them here, and must treat the
  verdict as convention until they are produced.**

## Re-open triggers

- **The candidate list is recovered.** This is the largest one. The moment a
  record of which languages were compared and on what grounds is available, the
  *What was never recorded* section is replaced by named losers with grounds and
  re-open triggers, and the verdict becomes a contested win rather than an
  unexamined one.
- **A census is run for a second candidate.** Then the census supports a
  comparison, and *Count the independent enforcement hosts* gains its first
  discriminating case.
- **A rule set is instantiated on a second stack.** The instantiation will show
  which rules the second stack can host and which degrade to convention, and
  that is the criterion's first real test — a stack this criterion would rank
  lower should visibly host fewer of them. **This is not the open item the
  language-neutral skills carry.** Theirs asks what a repo on an uninstantiated
  stack receives when no sibling names a tool, which is a question about those
  skills' completeness; this one asks whether the ranking predicts anything. The
  same event answers both, and they are different questions.
- **An outcome is measured.** A defect that reached production on this stack and
  would have been build-rejectable on a candidate, or the reverse, promotes or
  refutes the central claim. Nothing else will.
- **ArchUnit or Error Prone becomes unmaintained.** Both host more rules in this
  skill set than any other tool, and *Enforcement-tool maturity is a separate
  question* is the directive that fires — for the stack as a whole, not only for
  the rules that name them.
- **The premise stops holding.** If humans read the diffs, the criterion is not
  weakened, it is void. See *The premise* in `SKILL.md`.

## What this skill does not carry

- **The rules that follow from the verdict.** `java-backend-rules`,
  `java-backend-api` and `java-backend-observability` carry them, with the tool
  named per rule.
- **The bans that discharge the corpus-gravity cost.** Named in `SKILL.md` by
  the skill that owns each; none is restated.
- **The procedure for running a stack decision.** `tech-decision-research`.
- **The `unwritable beats banned` principle's grounds.** `enforceable-rules`.
- **Any frontend, data-pipeline, infrastructure or LLM-service verdict.** The
  criterion is stated to be portable to them; nothing here has applied it there.
