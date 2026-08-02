# The `guardrails-toolchain` skill

*Extracted from `CLAUDE.md` 2026-08-02, unedited except that cross-section pointers became file links. Where older text says "this file", it means the project record, which was one file then.*


Authored 2026-08-01, straight after `backend-stack`. **Second skill not drawn from
deleted corpus, first harvested from `BACKLOG.md` *Researched, unwritten*.** Two
files:

```
skills/guardrails-toolchain/  SKILL.md  evidence.md   14 directives + worked-case map, no ids
```

Seventeenth skill, listed by `npm run check`. **No row in [the decomposition record](decomposition.md)**,
same as `backend-stack` — that table = corpus provenance, this have none. Drawn
from sibling repo `../net-saas`: its consolidated guardrail map (2026-06-13) plus
the decision records folded out of same sweep same day. **Map name nine such
records; authoring read four** — performance regression gating, standing hostile
audit, application-security analysis, release + supply chain — **and hostile
audit found two of five unread ones owned material the skill got wrong**:
verification-strategy record own composition ladder, contract record own
consumer-surface question. **Lesson: source that name its own downstream records
is naming a reading list, not a provenance note.** **`../raw` searched and hold
nothing**: corpus carried the backlog row naming a "toolchain survey" and no
survey text, so external repo was whole source.

### What it decided

1. **Same two-half shape as `backend-stack`** — portable criterion + dated worked
   case. Not re-derived; source is same pass, same premise, same absence of
   per-claim markers, so shape followed.
2. **Subject = gates themselves, which no skill had.** Siblings state rules and
   name check per rule; nothing said what make a check *adoptable* or what whole
   concerns a rule-by-rule stack leave unguarded. Directive set split three ways:
   choosing a guardrail (verdict fail build by itself, no standing server, exit
   codes not vendor plan, non-deterministic reviewer never sole arbiter of
   mechanical class, caveat that bites per tool, licence deny-by-default),
   composing them (earliest gate wins, gate only where measurement honest), and
   the four gap classes a completeness critic found.
3. **Central claim *uncertain*, and it the critic not the gaps.** Four concerns
   are what one run produced; nobody ran comparison arm. Third skill in set whose
   central claim uncertain, after `tech-decision-research` + `backend-stack`.
4. **Write-once forced the worked case's shape, and this was harvest's expensive
   half.** Source map split three ways: rows a sibling already own with its own
   check (architecture tests, nullness, migration lint, contract lint + diff,
   conformance fuzz, property tests, container tests, coverage, mutation, jqwik
   pin), the frontend column **`backend-stack` already publish as its competing
   census**, and rows nothing owned — which is all this skill's table carry.
   Establishing that split cost more than writing did.
5. **Products named in that table, and de-naming caught in own draft.** First
   draft hedged every row behind its category ("free-engine taint scanner",
   "inventory-consuming scanner"). Fixed before publish: OpenGrep, Find-Sec-Bugs,
   OSV-Scanner, CycloneDX, Renovate, Anchore Grant, cosign, SLSA in-toto, Trivy,
   hadolint, distroless, gitleaks, Betterleaks, Picnic error-prone-support,
   OpenRewrite, Jazzer, plus losers (SonarQube, Dependency-Track, pa11y-dashboard,
   Chromatic, Fallow, jQAssistant, Konsist, Deptective, Structurizr, conftest/OPA,
   Checkov). **First instance caught by author applying published check to own
   draft rather than by later review** — no count of instances stated, cuz
   de-naming is now the most-recorded defect class in this file and any total
   written here decay by the next review.
6. **Versions deliberately not carried.** Source pinned them and said itself they
   not load-bearing and must be re-checked at adoption. Copying manufacture
   freshness. One pin that *is* a rule stay in `llm-default-traps` with its value.
7. **No rule ids, `###` headings**; **`## Wiring the gates` present**, unlike
   `backend-stack` + `tech-decision-research` — these directives bind a build, so
   there is something to wire.

### The sweep, and one live gap it exposed

**Prior-art sentences narrowed, not replaced** — `llm-default-traps` lesson
applied. Files that said an internal guardrails document was unpublished:
`java-backend-rules/evidence.md`, `java-backend-api/evidence.md` **and its
`SKILL.md`** — that one **missed by the authoring sweep and caught by the hostile
audit**, always-loaded file left stale while its `evidence.md` was fixed, which
is this repo's own worst-case shape — `money/evidence.md`, `money-api/evidence.md`,
`llm-default-traps/evidence.md`.
Each now say the map's content is restated in `guardrails-toolchain` **and the
decision records + research transcripts still are not** — content published,
weight unchanged, prior art still not a second source.
**`java-backend-observability` deliberately left alone**: its prior art is the
architecture decision record, not the guardrails map, so wholesale replacement
would have been false there.

**Two-sided disagreement published rather than resolved.** `java-backend-api`
scope breaking-change diff to surfaces crossing a build boundary and **dropped**
japicmp for the same atomic-build reason; source record diffed the full document
and proposed japicmp. Both sides now state it, neither pick. Same call money
phase 1 made on exponent-4.

**Reading the other side of a citation found a real gap in a published skill.**
Draft said `java-backend-rules` carry byte-reproducible generation for jOOQ
classes. It carry regenerate-and-**diff** only — no double regeneration, no
varied timezone or locale — so that drift gate assume reproducibility nothing
assert. Directive text corrected, and **gap 9 added to `java-backend-rules`**
stating it rather than leaving it inferable. `java-backend-api` carry stronger
form for its document, which is what made the asymmetry visible.

**One published rule strengthened from recovered material:** ban-coverage
meta-test in `java-backend-rules` now require reconciliation **both directions**
— declared-enforced ban name a test that exists, and a wired test no stay
undeclared — marked prior art 2026-06-13, convention, and explicitly not from
that skill's 2026-07-21 pass.

**`BACKLOG.md`**: row deleted from *Researched, unwritten*, residues promoted to
rows of their own in *Evidence owed on a published skill* (primary source per
tool claim, second completeness-critic run, ruling on the consumer-surface
disagreement, one cost figure for any gate), plus a row in the incompleteness-check
table where the **layer check is the one most likely to bite** — this skill's
whole subject is which layer own which defect class. **`README.md` swept**, per
whole-project review 2026-07-31.

**Enumeration check run on own draft and found two defects**: "forty-odd tools" +
"forty-tool map" = count of another document's contents, now stated without a
number; "roughly two thirds of the source map's rows" in `BACKLOG.md` was wrong
and now states the three-way split by name. **Twelfth instance of counting
failure**, second caught by author before publish.

### The hostile audit, 2026-08-01

**First review in this repo run by a fresh-context subagent rather than by the
authoring session, and first carrying a planted canary** — protocol
`tech-decision-research` publish and no pass here had followed. Canary = cross-family
pointer citing `java-backend-rules` for alert-rules-as-code rule that live in
`java-backend-observability`. Both skills exist, so id, link, marker and
frontmatter sweeps all pass it. **Audit caught it and ranked it first.**

**Structure held**: 14 directives each carry check + marker + date, no `P-n`, no
`B-n`, no `DECISIONS.md`, no ADR number, no external repo path, only
`SKILL.md` ↔ `evidence.md` links, seventeen skills listed matching `ls skills/`.
Fourteen content defects confirmed, fixed across six files. **Five findings
generalise:**

- **Reading the source's *own* downstream records is part of conversion, and
  skipping them look identical to finishing.** Map named nine records folded out
  of same sweep; authoring read four, and two of the five unread ones owned
  material the skill then got wrong — composition ladder dropped its coverage
  layer, and consumer-surface question shipped as flat disagreement when the
  unread contract record show prior-art repo applying **this skill set's own
  ground as an allow policy inside a wider gate**, not opposing it. Both defects
  invisible from the map alone. **Backlog row was scoped to wrong question and is
  now narrowed to japicmp**, the one genuinely contested residue.
- **Worked case can fail the directive it is published as evidence for, silently.**
  Two instances, same audit. Map table shipped with no licence column while the
  skill's own directive require selection record carry one — and the dropped data
  included **Renovate's AGPL-3.0, a licence the deny-by-default gate beside it
  reject**, which is the sharpest row in the table and was the one missing. And
  SAST row said two tools gate where record say one gates and other **advisory
  until a compatibility spike pass**, so worked case reported a class covered
  that its own first directive would have reported uncovered. `backend-stack` set
  precedent of saying "skill fail own directive" out loud; this one had failed
  silently.
- **Universal quantifier refuted three words later.** "Every rejected candidate
  lost on standing server or advisory verdict" followed immediately by four
  rejections on licence, scope and abandonment — plus Fallow listed as instance
  while it was **adopted** advisory, not rejected. Now four named grounds, cuz
  repo screening on first two adopt exactly what sweep rejected. **Superlative-as-
  count class again, and this time the counter-example was in the same sentence.**
- **De-naming survive into a file whose subject is de-naming.** Skill argue for
  naming products, name sixteen in its table, and still shipped "several
  ecosystems" for GitHub Advanced Security, "an open runtime crash" for a JDK 25
  segfault with an issue number, "binary compatibility diff" for japicmp that a
  sibling name, and hadolint described as base-image lint when it read Dockerfile
  text. **Author-applied token check caught the table and missed the prose around
  it** — placement, not presence, exactly as the second Java-backend review said.
- **Sweep that fix `evidence.md` and miss its `SKILL.md` is the repo's worst
  recorded shape, and it happened again.** `java-backend-api/evidence.md` got the
  disagreement note; its always-loaded `SKILL.md` kept the old sentence.
  Consumer read the second one.

**What the audit checked and found clean, stated so blanks no read as coverage:**
markers and dates on every directive, status-tier gloss word-for-word against
`enforceable-rules`, no marker word used as ordinary English, directive count,
every re-derivable count in both new files, the `../raw` claim, and eleven
cross-file citations verified by opening the cited rule — including the two the
skill build its own gap 9 argument on. **Not checked**: every published skill for
sentences this publish should have swept — audit swept only for
`guardrails|prior art|another repository`, which is what surfaced the missed
`SKILL.md`.

### Still open

- **Every tool fact dated 2026-06-13, none carrying a primary source.** Free-tier
  boundaries, licence terms, compatibility with pinned runtimes and taint-analysis
  limits all decay, and tooling claims decay fastest of anything in this set.
- **Performance three-layer split never built** anywhere, so band width, baseline
  churn and whether the ratchet flake are unobserved. It is a written contract.
- **No cost figure for any gate this skill require.** Same open question `caching`
  and `async-handoff` carry for their own gates.
- **Completeness-critic claim has no control arm** — one run, no comparison
  against ordinary tool-by-tool review.


## The layer and composite-shape checks, 2026-08-02

**Both were owed. The backlog predicted the layer check would bite hardest here** — this skill's whole subject is which layer owns which defect class — **and it was right, though not for the reason it gave.** The failure was not a directive naming one layer and missing another. It was that **every directive's check reads committed files, and a gate's actual authority lives partly outside the repository.**

### What the layer check found

1. **The forge's branch-protection settings**, beside *A guardrail is a tool whose verdict fails a build by itself*. Whether a tool fails the build is decided in the CI configuration, the build file, the tool's own configuration — and past all three, in **which checks are required to merge, which is a settings page nobody diffs**. A gate can exit non-zero, be listed, be recorded in the selection record, and still not block a merge. **That is this directive's own failure — an unwired host that keeps calling itself enforced — one layer above where it looks for it.**
2. **Suppression and baseline files**, beside *Record the caveat that bites, per tool*. The record holds the caveat in prose; the build reads the suppression. **A caveat that gets encoded stops being a caveat and becomes an exemption**, and the generated baseline is the worst shape — made once, exempting an unbounded set, its regeneration invisible to every check here. The remedy is the shape `C-15` and `E-26` already use: commit the inventory and diff it.
3. **The container base image, vendored source, downloaded binaries and submodules**, beside the licence gate. Deny-by-default holds only over the set the inventory enumerates, and the inventory comes from the package manifest. **A green licence gate says nothing about the image the service ships.**
4. **The forge's scheduling lifecycle**, beside *A diff-scoped review cannot see erosion across changes*. The check finds the sweep declared in committed CI configuration; whether it fires is decided by the forge — schedules disabled after repository inactivity, a runner label that stops matching, an expired credential failing every run identically to none. **The erosion failure, landing on the gate whose whole job is erosion**, and worse than a missing sweep because the committed file reads as coverage. **Its remedy is one line of an artifact contract this skill already requires**: the sweep artifact carries its run timestamp, and the milestone gate fails when the newest is older than the declared cadence.

### What the composite-shape check found

The skill decided which tool may occupy a gate and which layer owns which class, **and nothing about what a repo builds out of two gates**.

- **One ban: a gate plus a generated baseline.** Ground, organisation fact, no-panel note and re-open condition are in the section. **The other side is real and stated** — a baseline is how a large existing codebase adopts a strict tool at all — which is why the re-open condition is a committed expiry per entry, at which point it becomes the ratchet the table already permits.
- **The sharpest new entry is a gate scoped by another gate's output.** `money-java`'s mutation-on-money-packages is the published worked instance, already named there as its own gap. Everything outside the scoping gate's output is ungated **and reported by neither gate**, which is how a stack produces a confident blank.
- **Three entries restate an existing directive as a shape**, because each reads as covered otherwise: two gates on one class (the map's stated purpose is exclusion, not just ordering), a diff-scoped gate with no sweep partner (that directive reads as being about agent review and holds for every changed-files-only gate), and a quarantined gate left in the map (the flaky-gate directive names quarantine as the terminal state and never says what happens to the map).
- **One entry is about this organisation specifically**: a gate configuration shared across repositories — a shared workflow, a parent build file — changes every consumer's gates with no diff in any of them. Eighteen teams makes that the normal case, not the exotic one.

### The sweep

Description widened (the shape table, plus triggers for adding a suppression or baseline and for changing branch protection or a shared workflow). Markers section records which checks ran and which did not. **Opening `money-java` rather than citing it found a defect in a third skill.** The shape table needed the mutation-scope instance, and `enforceable-rules` describes it as *scoped, itself a named gap that skill state*. **It is not.** `M-23` states the scope as a fact about the pin and draws no conclusion, and **`money-java` carries no named-gaps section at all** — alone among the stack skills here. So the gap was `enforceable-rules`' own reading, published as a report of what a sibling says. **A follow-the-pointer failure inside the skill that publishes the follow-the-pointer discipline, surviving one adversarial review.** Both sides fixed: `enforceable-rules` carries the correction and attributes the reading to itself, and `M-23` now states the gap on the side that owns the pin, including that its own lack of a named-gaps section is not evidence of coverage.

### Still open on this family

- **The predicate, enumeration and token-placement checks have not been run here.** The token-placement check is the interesting one: this skill's source is a tool map, so identifier-shaped tokens are most of what it carries, and the de-naming defect class is the one it is most exposed to.
- **Four of the five new layer remedies are unbuilt** — the required-check assertion, the suppression inventory, the image licence scan, and the sweep-freshness assertion. The fifth is the shape table itself, which gates nothing.
