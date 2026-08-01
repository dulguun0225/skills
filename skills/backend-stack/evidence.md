# Evidence — choosing a backend stack

The ground behind each directive in [SKILL.md](SKILL.md), the claims that must
**not** be cited, and the conditions that reopen a rule. Read the directive
first; this file is for deciding whether to trust it.

## What stands behind this skill, and what does not

**One pass, no panel, no per-claim markers, and its sources are not held here.**

| Pass | Scope | Panel | Markers it recorded |
| ---- | ----- | ----- | ------------------- |
| 2026-06-11..14 | The platform decision — the language and runtime layer, persistence, and the corpus favourites it rejected at both | full research pass | **none per claim** |
| 2026-08-01 | This conversion. Generalised the pass's stated criteria into one criterion; ran the host census | none | convention throughout |
| 2026-08-01 | Recovery, from records outside this repository, of the language-layer candidate list and of one competing enforcement-host census; plus the edits both forced | none | convention throughout |

**The 2026-06-11..14 pass is the same one `java-backend-rules` names.** Its
recorded scope was read as *persistence* when this skill was written, and the
language and runtime choice was attributed to it by inference, in the same shape
`java-backend-rules/evidence.md` records for its three undated Platform
directives. **That inference was correct and is no longer an inference.** The
pass's decision record covers the language and runtime layer explicitly and is
dated **2026-06-12**, inside the window. Treat the date as the date the decision
was accepted, not as a verification date — the record carries no per-claim
marker and cites no source.

### Where the recovered material came from, and why it is restated rather than cited

**It is the ADR set of the product repository the pass was run for.** That
repository is not published in this skill set and a reader of these skills cannot
open it, so `SKILL.md` restates the candidate list in full rather than pointing
at it. This is the same call the money and Java-backend skills make for the
prior-art documents they name — **a consumer-facing pointer at unpublished
material is a pointer nobody can follow**, and the material has to travel or be
dropped.

**Three records carry it.** The stack overview holds the four-candidate list with
the ground each lost on; the persistence ADR holds the JVM's win restated as
*verification-platform merit* with the same host list, plus the persistence
losers `java-backend-rules` already publishes. They agree, which is worth
recording because it means the language-layer grounds were written twice on the
same day and did not drift between the two. The third is the frontend profile,
accepted the same day, which is where the competing census comes from — and a
consolidated toolchain map dated the day after is what makes that census a
per-category comparison rather than a list of tool names. **That map is itself
restated in `guardrails-toolchain` since 2026-08-01**, minus the frontend column,
which stays here because it is this skill's evidence about host counting rather
than that skill's evidence about tool selection.

**The premise is confirmed by an outside record, and that is new.** The stack
overview opens by stating that the AI is the sole developer and maintainer and
that humans never read the code — this skill set's shared premise, written down
by the pass itself rather than carried forward by conversion. It also records
that the evaluation ran on greenfield merit with hiring explicitly irrelevant,
which is why no candidate lost on ecosystem popularity.

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
  criterion — it was written after the decision it explains. A criterion that has
  only ratified is a criterion that has not been tested. This is the second skill
  in this set whose central claim is marked uncertain rather than caveated;
  `tech-decision-research` was the first, for the same reason — no outcome
  measurement.

- **It generalises criteria the pass wrote down; it is not read off its
  practice.** The recovered record lists five things the stack had to maximise —
  compile-time error surface (its own gloss: the compiler is the second
  reviewer), test-ecosystem quality (tests are the only review), exact decimal
  money math, minimal operational surface, and idiom stability across sessions.
  *Rank a stack by what its build can refuse to ship* and *Count the independent
  enforcement hosts* are the first two collapsed into one ranking; *Price corpus
  gravity* is the fifth turned into a cost. **The collapse is the unchecked
  step** — nobody argued that the first two belong under one criterion rather
  than two, and the pass did not say so.

- **The pass ranked operability; this skill vetoes with it, and the two do not
  agree in wording.** Minimal operational surface is listed among the five as a
  thing to maximise. *Operability is a veto, not the criterion* demotes it. What
  supports the demotion is the pass's own outcome — Go is recorded as having the
  best explicitness and ops story of the four candidates and lost anyway, on
  absent mutation testing, statement-only coverage and silent zero-values. **The
  practice matches the veto reading and the wording does not, and `SKILL.md` says
  so rather than picking one.**

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

- **The competing census is real, dated 2026-06-12..13, and it is the same
  pass's frontend profile.** Recovered on 2026-08-01 from the same external
  record set as the candidate list, and restated in `SKILL.md` for the same
  reason. Three things about it have to travel with the number. **It is not
  independent** — one org, one pass, one repository, and the person who wrote the
  Java column wrote this one. **It is role-confounded** — a frontend has no
  migration lint to host and its real-dependency story is a browser driver, so
  two of the eight cells say more about the job than about TypeScript. **And it
  does not rehabilitate the candidate it names**: a TypeScript backend lost the
  language decision on the absence of an enforced decimal type, which is a
  language fact no host count reaches.

- **What it discriminated is not what the criterion predicted it would.** Both
  columns fill seven of eight categories. The differences are one absent
  category — no host for custom checks on the compile path, because lint runs
  beside the type checker rather than inside it — and one category where the tool
  exists but the gate does not: mutation testing advisory, narrowly scoped, never
  blocking, with adoption conditioned on an unresolved upstream issue, against a
  blocking score on the money modules. **A count of hosts would have called this
  parity.** *Enforcement-tool maturity is a separate question from runtime
  maturity* is the directive that reads it correctly, and this is the first data
  either directive has been tested against.

- **One recorded expectation points away from the winner, and no skill carries
  it.** The material behind `caching` and `async-handoff` recorded, per
  candidate, what a second stack would do to their type-design directives. The
  generic half is published in those skills — a structurally or dynamically typed
  stack hosts fewer of them. **The per-candidate half was never carried
  anywhere**: it expected Go to host them *more* strongly than Java does, on a
  compiler-enforced package boundary and an unexported method that makes outside
  implementation impossible. It is restated in `SKILL.md` because a skill that
  publishes a census favouring its own stack should carry the one recorded claim
  against it. **It is a prediction and nothing ran it**, and Go lost the actual
  decision on a different category — mutation testing, coverage granularity and
  zero-values — so the two records are not in conflict. They are evidence that
  the categories are not interchangeable, which is what *Count the independent
  enforcement hosts* asserts and had no case for until now.

- **The candidate list supplies one host category's worth of comparison, and it
  is not a census.** The pass recorded, per loser, that mutation testing is
  absent and unmaintained on Go and commercial-or-noisy on Kotlin bytecode, and
  that Go's coverage is statement-only. That compares the *coverage and mutation*
  host across three candidates. The other seven categories are uncompared on
  every alternative, so *Count the independent enforcement hosts* still has no
  case where a full count decided anything.

- **Do not cite the census as evidence that the platform choice was correct.**
  It is a census of this skill set's own tool names. Reading it as
  justification is the exact circularity *A rule set is never a reason to adopt
  a stack* exists to block.

## Claims that must not be cited

- **Any ground in the candidate list, as a current fact about another
  ecosystem.** *Go has no maintained mutation testing*, *Kotlin's mutation
  tooling is commercial-or-noisy*, *.NET enums are open and its deserialization
  zero-defaults are silent*, *Kotlin's stdlib `BigDecimal /` rounds silently* —
  every one is a claim the pass made in June 2026 about a tool landscape it
  cited no source for. They are recorded here as **the grounds the decision was
  taken on**, which is a different thing from being true today. Tooling claims
  are the fastest-decaying kind this skill set carries. Verify before repeating
  one in an argument, and say who is verifying it.

- **That Java's compile-time guardrails are mature "compared to" a named
  alternative.** No such comparison is held here. What is held is the census
  above plus one host category from the candidate list.

- **That this skill's criterion has selected against anything.** It has not. The
  candidate list is a decision the criterion was later written to describe, not a
  decision the criterion made.

- **The 2026-06-11..14 pass's primary sources.** The recovered decision record
  cites none, and none are published in this skill set. **A reader who wants
  sources for the Java verdict will not find them here, and must treat the
  verdict as convention until they are produced.** Recovering the candidate list
  did not change this. **Two external records were searched on 2026-08-01** — the
  pass's own decision records, and the material this skill set was converted
  from, which says the steelmen and grounds "are recorded in the research pass"
  and points at transcripts published nowhere. **Treat the sources as possibly
  non-existent rather than merely unlocated**, and do not cite the pointer as
  though it were the source.

- **The competing census, as evidence that TypeScript is close to Java for
  backend work.** It is a frontend profile. Two of its cells are role-shaped, and
  the language lost the backend decision on a fact no host count reaches.

## Re-open triggers

- ~~**The candidate list is recovered.**~~ **Fired 2026-08-01.** The record was
  found in the product repository the pass was run for, and `SKILL.md` now
  carries the four candidates with the ground each lost on. The verdict is a
  contested win rather than an unexamined one. **Two halves of this trigger did
  not close**: the record cites no primary source, and it set no re-open trigger
  per loser, so *Record the losers* is still half-failed by this skill about
  itself. The replacement trigger is the next one below.
- **A primary source is produced for any candidate-list ground.** The grounds are
  checkable — mutation-tool support per language, enum exhaustiveness, decimal
  division semantics — and each one verified against a primary source promotes
  that ground, and only that ground, from convention to primary-source verified.
  Nothing promotes the verdict as a whole.
- ~~**A census is run for a second candidate.**~~ **Fired 2026-08-01, partially.**
  One exists, for TypeScript in a frontend role, and it is in `SKILL.md`. It gave
  *Count the independent enforcement hosts* a case where the count came out level
  and something else decided — which tests the directive rather than confirming
  it. **The replacement trigger is a backend-role census on a competitor**,
  ideally one this pass did not run, since the existing one shares its author
  with the Java column.
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
