# Evidence — guardrails-toolchain

For someone deciding whether to trust [SKILL.md](SKILL.md). Directive text lives
there; this file carry provenance, what must not be cited, and what would reopen
each directive.

## Provenance, and why everything is convention

**One source, one date.** A consolidated guardrail map produced by a web-verified,
adversarially fit-checked research sweep on **2026-06-13**, plus the decision
records that sweep was folded into the same day — performance regression gating,
standing hostile audit, application-security analysis, release and supply chain.
All belong to one product repository of the same org. **That repository is not
published in this skill set**, so every claim below is restated, and no reader
can open the original.

**Why *convention* is the ceiling, per `tech-decision-research`'s own downgrade
rule:**

- **No per-claim confidence marker anywhere in the record.** It mark rows *Kept*
  or *Decided* — adoption status, not verification status.
- **No primary source cited for any tool claim.** Free-tier boundaries, licence
  terms, intra-file taint limits, compatibility with a pinned runtime version:
  all stated, none referenced.
- **Sweep was adversarially fit-checked, which is not a refutation panel.** Fit
  check ask whether tool fit the constraints. It no cast independent votes
  against a primary source, so *primary-source verified* is unreachable from here
  even for facts that would support it.

**Conversion date 2026-08-01.** Stated once, in the skill, labelled as conversion
date. No per-directive date invented: every directive carry **2026-06-13**, the
one date the record gives, and where a directive generalise the record's wording
the generalisation is named rather than dated forward.

## The org fact, and what it decide

Teams of about three engineers, no platform or operations role, nobody on rota.
Same org fact `caching` state before its ranking, and it decide one directive
outright — *Reject a guardrail that needs a standing server*. **Record's own list
of what that ground rejected**: a server-backed code-quality platform, a hosted
dependency-inventory service, an accessibility dashboard server, and a hosted
visual-review service. All four were rejected on operability, none on analysis
quality.

**This directive is the one that soften elsewhere.** Org with staffed ops has a
cost question, not a rejection. Stated in the skill so a reader on a bigger team
no import a constraint that is not theirs.

## Where each directive's ground sit in the record

| Directive | Ground |
| --------- | ------ |
| Verdict fails a build by itself | Record's first governing principle — deterministic, machine-verifiable, CI-gating, with a typed or exit-code verdict an agent read as repo truth, "never a human will notice" |
| Reject a standing server | Third governing principle, with the four rejections above |
| Exit codes, never a vendor plan | Sixth resolved decision — no hosted-plan dependency; every supply-chain and structural gate gate on exit code plus committed artifact |
| Non-deterministic reviewer never sole arbiter | First governing principle's second half, and the security lens of the standing-audit record, which require a finding in a mechanical class to trip adoption of the deterministic gate rather than be dispositioned inside the audit |
| Caveat that bites | The record's per-concern section is titled with that phrase and carry one per adopted tool |
| Licences deny-by-default | Licence-compliance row, adopted explicitly to close a known gap, with undeclared-licence rejection called out |
| Earliest gate wins | The record's composition ladder, which order layers from compile wall to review and state coverage as floor, mutation as ceiling, invariants as override, reviewer as semantics-only backstop |
| Gate where measurement is honest | Performance-gating record, in full — the flake trap, the wrong-topology argument, and the three-layer split |
| Completeness critic | The record's own framing of its four additions — "the completeness critic surfaced four whole concerns the verification stack omits" |
| Every numeric threshold has a guardian | Same performance record. Its five unguarded thresholds are that product's, so the skill carry the shape and not the numbers |
| End-to-end output stability | Second of the four additions, with its own worked failure — a refactor keeping every invariant and golden green while changing which branch a boundary case take |
| Byte-reproducible generation | Third addition, including checksum-pinning the generator plugins |
| Deterministic diff per consumer-bound surface | Fourth addition, listing internal contract, cross-module published types, event envelope schemas, error catalog and permission catalogs |
| Standing sweep | Standing-hostile-audit record — cadence, cost envelope, lens rotation, evidence contract, the committed artifact a release gate require, the per-lens canary that makes "found nothing" trustworthy, and the mandatory different-vendor panel at the binding gate. **The last two were dropped by the first draft and restored by this skill's own hostile audit**, which is the shape the record predicts: the anti-theatre halves are the ones a self-authored pass omits |

## Do not cite

- **Any tool version, free-tier boundary or compatibility claim from this
  material as current.** The record itself say exact versions are not load-bearing
  and must be re-checked at adoption. Tooling claims decay fastest of any kind in
  this skill set, and these are fourteen months from nothing — they are already
  what one sweep concluded on one day.
- **The four gap classes as a complete set.** They are what one completeness pass
  found in one stack. Skill mark the completeness claim *uncertain* for this
  reason; treating four as exhaustive invert what the marker say.
- **"Adversarially fit-checked" as an adversarial panel.** It is not, and the
  distinction is the whole difference between *convention* and anything above it
  here. `tech-decision-research` define the panel this material did not run.
- **The intra-file taint limit, the unverified analyser compatibility, or the
  inventory-format lag as facts about named products today.** They are the
  record's caveats, dated, and each is exactly the kind of thing a vendor fix in
  a release.
- **This skill as evidence that the stack it draw from is well guarded.**
  `backend-stack` publish the directive that a rule set is never a reason to
  adopt a stack; a guardrail map is the same shape of circularity one layer down.
- **The performance three-layer split as a tested design.** It is a written
  contract. Nobody built it, so band width and baseline churn are unobserved —
  named as a gap in the skill.

## What the record contradict, and what stay unresolved

- **Consumer-bound surfaces, against `java-backend-api` — and narrower than the
  first draft of this file said.** That skill scope breaking-change diff to
  surfaces crossing a build boundary, on ground that an atomically-rebuilt
  consumer's compile is the check. **The record does not contradict that ground —
  it applies it as a carve-out inside a wider gate**: its full-document diff runs
  under a calibrated allow policy whose allowed set is additive change the
  same-change client regeneration and frontend compile already absorb, with the
  stricter published-surface contract layered on top. So the two positions share a
  premise *and* share the reasoning, and differ on whether that reasoning removes
  the gate or configures it. **Corrected 2026-08-01 during hostile audit**, which
  found the first draft had presented a flat disagreement by reading only the
  consolidated map and not the contract record behind it.
- **japicmp is the residue that really is contested.** The record proposes a
  source-and-binary compatibility check on each module's published package;
  `java-backend-api` evaluated japicmp and **dropped it as a default rule**,
  keeping it as a re-open trigger. **Not resolved here** — picking one would be
  authoring a verdict neither pass wrote. Same call the money family made on the
  exponent-4 disagreement.
- **Advisory adoption, against this skill's own first directive.** Record adopt
  one young analyser as an advisory lane while its first governing principle
  demand a build-failing verdict. Record's reason is explicit and worth carrying:
  the tool's verdict class is one an agent might act on **by deleting live code**,
  so a blocking gate on a syntactic dead-code verdict is a hazard, not a
  guardrail. Skill carry the resolution — advisory is a named lane and never an
  answer for a defect class — rather than the contradiction.

## Re-open triggers

- **Any tool row, on adoption.** Re-verify the caveat before relying on the tool,
  per `tech-decision-research`'s re-verification rule. A caveat that is fixed
  upstream change the selection, not just the note.
- **The completeness-critic claim.** A second run, on a different stack, that
  either find a fifth class or find nothing. Either outcome is the first evidence
  about the method rather than about the four concerns.
- **The performance split.** First repo that build layers one and two and record
  band width, how often the baseline re-ratchet, and whether the gate ever flake.
  That is also the first cost figure for any gate in this skill set.
- **The standing sweep.** First sweep whose committed artifact exist. Its cost per
  run and its finding classes decide whether cadence and budget defaults here are
  worth stating as numbers at all.
- **The consumer-surface disagreement.** A repo where an in-repo consumer's
  compile did **not** catch an incompatible change to a published type. That
  settle it in one direction; nothing available settle it in the other.
- **The org fact.** A team with a platform or operations role re-opens *Reject a
  guardrail that needs a standing server* as a cost question.

## What this skill does not carry

- **Version pins.** Deliberate — see *Do not cite*. The one pin that is itself a
  rule live in `llm-default-traps`, with its value.
- **The frontend column of the map.** Restated in `backend-stack` as the one
  competing enforcement-host census that exist, where it is that skill's evidence.
  Carried in two places it would drift in one — **and it did drift, in the
  direction of a claim rather than a copy**: this file's first draft described
  that census as carrying the column row for row, where it carries host
  categories. Two rows, the component test runner and the visual-regression
  baselines, are in neither skill. `SKILL.md` names them as a gap.
- **Tool rows a sibling skill already owns.** Architecture and boundary tests,
  compile-time nullness, migration lint, contract lint and diff, conformance
  fuzzing, property tests, container tests, coverage, mutation and the one
  dependency ceiling are all named with their checks in the stack skills. Named
  here rather than restated, so no directive text exist twice.

  **Products in the rows nothing owned are named, not hedged** — de-naming a tool
  behind its category is the defect this skill set's reviews have recorded more
  often than any other, in every form: a hedge in a stack skill whose own evidence
  named the tool, a pointer promising a name the target withheld, an anonymised
  vendor, an anonymised issue number in a do-not-cite entry, and two token sweeps
  that between them found dozens in one family. The
  guard against reading a dated pick as a current verdict is the *Do not cite*
  entry above, not vagueness in the table.
- **Thresholds.** No coverage ratio, no mutation score, no latency budget, no
  sweep budget. Every one is a per-product call, and the record's numbers are that
  product's.
