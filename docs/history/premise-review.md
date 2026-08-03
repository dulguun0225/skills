# The premise review, 2026-08-03 — the two questions

Asked by the repo owner on 2026-08-03, answered the same day. The questions, in the
owner's framing:

1. **Was creating skills the best solution to the original problem** — eliminating
   per-project re-research without eating the context budget — **or would an LLM
   knowledge-base tool (the owner named Graphify) have been the better choice?**
2. **Does this project contain skills unnecessary for the goal** — "override
   training-data bias with well-researched principles and choices" — under the
   shared premise, code written by LLM agents and no human reading it line by line?

**Short answers: (1) yes, skills were the right mechanism class, and the
knowledge-base category is structurally wrong for this specific problem — but
skills-alone is incomplete, and the two known mitigations for its weak link are not
yet applied here. (2) No skill is off-goal and none should be deleted outright;
thirteen are unanimous keeps, and for about a quarter of the set the accurate verbs
are shrink, merge or demote — with one structural defect worth naming: the five
least-researched skills hold the five most expensive frontmatter slots.**

## How this was answered, and what its figures are worth

The method mirrors what `tech-decision-research` prescribes rather than one agent's
survey: seven readers, each over one skill family's full `SKILL.md` text, forced to
a per-skill verdict; two web researchers (the knowledge-base tool category; the
rule-delivery mechanism landscape); then three adversarial critics, each assigned a
hostile thesis — *a knowledge base would have been better*, *a simpler mechanism
than either would have been better*, *the set contains unnecessary skills* — and
required to record where their assigned side fails. This document is the synthesis.

**Provenance ceiling, stated before any number below is believed:** every
web-sourced claim here is dated 2026-08-03, gathered in one pass, with no
refutation votes — by this repo's own markers that is a *primary-source pointer* at
best and never *confirmed*. Repo-internal figures carry their own dates from
[context-budget.md](context-budget.md) and [firing-harness.md](firing-harness.md).
Re-verify any external figure before acting on it.

## Question 1 — skills against a knowledge base

### What "Graphify" turned out to be

Web research (2026-08-03) identifies the most plausible referent as
**safishamsi/graphify** (github.com/safishamsi/graphify, graphify.com) — an
open-source Python CLI plus coding-agent skill released April 2026, which parses a
project folder into a queryable knowledge graph (tree-sitter over code, an optional
LLM pass over docs) and lets an agent query graph paths instead of grepping. An
older GraphAware "Graphify" Neo4j NLP plugin (~2014) exists and is dormant. If the
owner meant a different product, the verdict below survives anyway: it was checked
against the whole category — Graphiti/Zep, Microsoft GraphRAG, Cognee, Mem0,
Letta/MemGPT, MCP memory servers — and rests on a property they share.

The narrow finding on Graphify itself: **it is a descriptive tool — it maps what a
codebase IS — and this repo's content is prescriptive — what an agent SHOULD pick
before code exists.** Its retrieval is query-shaped, its graph is rebuilt per
project, and its own tagging vocabulary (EXTRACTED / INFERRED) has no slot for a
rule nobody's code exhibits yet. It solves the token cost of reading a large
existing corpus, which is not this repo's problem.

### The failure mode decides the category question

The problem this repo defends against is an **unknown-unknown at decision time**:
the agent about to type `double amount;` or `@Cacheable` does not know it is at a
decision. Its training-data bias is precisely what prevents it from forming a
query. Every surveyed knowledge-base tool retrieves on one of three triggers, and
each fails against that:

- **Explicit query** (Graphify, Graphiti/Zep, Cognee, GraphRAG) — defeated by
  definition; the biased agent never asks.
- **Semantic similarity at lifecycle events** (Mem0, MCP memory servers at session
  start) — fires at session boundaries, not at the choice, and a biased choice
  produces no topical surface text to match against. Similarity search cannot
  retrieve against an absence.
- **Deterministic tool-event hooks** (Graphify's pre-search hooks, PreToolUse-style
  harness hooks) — fire reliably but cannot read intent: they inject everything,
  which re-creates the context blowout that killed the copy-paste `CLAUDE.md`, or
  keyword-matched slices, which is a bespoke system no surveyed tool ships.

Skills attack the failure mode directly: the frontmatter of every installed skill
is unconditionally in context every session — a permanent, topic-specific index —
and the model's own attention during generation is the trigger. **That converts
unknown-unknowns into known-unknowns, which is the only conversion this problem
needs.** The measured price of the conversion is the frontmatter tier
([context-budget.md](context-budget.md), 2026-08-02: 4,383 tokens per session);
the measured reliability is the firing baseline (~70% on the wrong model — see the
bill below). Imperfect — but a knowledge base's delivery rate for the question the
agent never asks is zero by construction.

Two corroborating findings from the survey:

- **The one tool whose core primitive matches the need validates the design rather
  than beating it.** Letta's pinned memory blocks are always-in-context by
  construction — and they are character-capped, so 150k tokens of rules cannot be
  pinned; the working arrangement would be a pinned index plus pull-loaded bodies,
  which is the skills architecture re-derived inside a heavier runtime with
  agent-editable rules.
- **The content would not survive the pipeline.** Graphiti, Cognee, Mem0 and
  GraphRAG all ingest through LLM extraction or summarization. The sentence this
  repo's invariants call the most important line in a skill — the corpus favourite,
  named, with the ground it lost on — plus the confidence markers, dates and named
  checks, are load-bearing exact wording. Triple-extraction and community
  summarization are precisely the lossy compression the authoring invariants ban,
  and the trade also swaps git provenance (diffs, `review-by` lapse semantics, the
  wired gates) for a database.

### The alternative that was actually close — and it is not a knowledge base

The strongest competitor the critics could construct was **a plain git repo of the
same markdown plus a hand-written, always-loaded directive index per consumer repo**
(`CLAUDE.md` @-imports; "Before touching any field carrying an amount, read
rules/money.md"). The bounded verdict from that critic, after arguing it as hard as
the evidence permits: roughly equal on rule delivery, better on failure visibility
(a broken import is a visible dangling reference; a missed firing is silence) and
standing cost (a ~20-line index against 4,174 tokens of descriptions, measured
2026-08-03), worse on per-project index maintenance and drift — the exact
one-owner problem this repo already polices — and worse on install flow and
portability. Two facts tipped it to skills:

- **The spec travels.** Agent Skills was donated to the Linux Foundation-backed
  Agentic AI Foundation (which also holds AGENTS.md and MCP) in December 2025; the
  agentskills.io client list fetched 2026-08-03 shows roughly 45 supporting
  products, including OpenAI Codex, GitHub Copilot, VS Code, Cursor and Gemini CLI.
  *(Web-sourced, unverified here.)* The bet is no longer Anthropic-only.
- **The content is mechanism-independent markdown either way**, so the delta
  between the two designs is small and reversible, and the winning move — an
  always-loaded pointer — can be adopted *inside* the skills mechanism (below)
  without migrating anything.

**Not worth migrating in either direction.** The skills packaging has already
bought a measured firing baseline, an install path, and cross-harness option value.

### The honest bill — where the challenge lands

Three costs are real, and the first is the one with teeth. Two critics arrived at
it independently:

1. **The delivery layer is a runtime-silent, non-deterministic mechanism deciding
   whether the rules exist at all — the shape this repo's own skills ban.**
   Measured here ([firing-harness.md](firing-harness.md), 2026-08-02,
   `claude-sonnet-5` by accident, CLI 2.1.220): 31/44 baseline cases fired,
   `ai-maintainer-principles` at 5–6/16 with repeats behind it, one case firing
   then missing on the identical prompt twenty minutes apart — and a miss emits no
   signal. External measurements agree the risk is real and, more usefully, that it
   is movable *(web-sourced 2026-08-03, unverified here)*: a 650-trial study
   (2026-02-05, claude-opus-4-5) found ~50% out-of-box activation, ~65% with an
   always-loaded pointer line in the consumer's `CLAUDE.md`, and 94–100% with
   **directive-worded descriptions** ("ALWAYS load X before Y"), directive wording
   20× more likely to activate than passive (OR 20.6). **Neither lever is applied
   here**: these descriptions are relevance prose, and the README's install section
   ships no recommended consumer pointer block. Both are cheap; both are
   measurable with the harness this repo already built; both belong on the backlog
   ahead of any description trim. *(Applied later the same day, 2026-08-03: every
   description's closing `Load …` clause now reads `ALWAYS load …` — an additive
   edit, no hook word removed — and the README install section carries a
   recommended consumer pointer block. "Relevance prose" also overstated the
   before-state: every description already ended in an imperative `Load before …`
   clause; the edit strengthened it to the study's tested wording rather than
   introducing a directive where none was. The A/B ran the same day on `claude-opus-5`,
   CLI 2.1.220, win32, one repeat per case: pre-edit descriptions 19/44, `ALWAYS
   load` descriptions 23/44, eight cases changed — six up, two down — which at
   one repeat is consistent with an improvement, not evidence of one; the four
   negative cases stayed clean on both arms, so the pushier wording caused no
   false firing. The same run's pre-edit arm is the Opus re-baseline the backlog
   owed, and it landed below Sonnet, not above — see
   [firing-harness.md](firing-harness.md) for the platform confound on that
   comparison. Later the same day the owner withdrew the pointer block: delivery
   work on this set is frontmatter or hooks only, and nothing may require a
   consumer to copy text into their `CLAUDE.md` — the rule is in the repo
   `CLAUDE.md`. The pointer-block lever was never measured here.)*
2. **The frontmatter tier has the same growth law as the disease it cured** —
   linear in skill count, paid unconditionally, no ceiling — only with a slower
   onset (4,383 tokens at twenty skills, against a corpus that had grown past
   usefulness). `BACKLOG.md` still carries unharvested topics. This is not an
   argument against the mechanism; it is the number to watch as the set grows, and
   the reason "does this deserve to be a skill" (question 2) stays a live question
   for every future harvest.
3. **A measurable share of recorded labor services the wrapper, not the research** —
   the firing harness, the token reports, the 2026-08-02 tier-arbitrage day. The
   counterpoint the critic conceded: the two wired gates police content invariants
   (pointer resolution, evidence order) any format would need; only the firing
   harness is mechanism-specific, and it exists because the mechanism's weak link
   is measurable at all.

**What would change this verdict:** a knowledge-base tool shipping a deterministic
decision-time injection layer keyed on intent rather than on queries or tool-call
patterns (none surveyed has one); or the owner's work moving to a harness without
skills support; or set growth pushing the frontmatter tier toward the budget that
killed the copy-paste file.

## Question 2 — unnecessary skills

### The verdicts, per skill

Reader verdicts from full-text reads, 2026-08-03. *Core* = directly overrides a
coding-time training-data bias; *supporting* = enables or enforces the core set
under the premise. The action column is this review's recommendation, not a change
made; nothing was edited.

| Skill | Reader verdict | Cadence | Action |
| ----- | -------------- | ------- | ------ |
| `money`, `money-api`, `money-storage`, `money-java` | core | recurring | keep as-is |
| `caching`, `caching-java` | core | recurring | keep as-is |
| `async-handoff`, `async-handoff-shapes`, `async-handoff-java` | core | recurring | keep as-is (heaviest justified family; shrink only on its own terms) |
| `java-backend-rules`, `java-backend-api`, `java-backend-observability` | core | recurring | keep as-is |
| `llm-default-traps` | core | recurring | keep as-is — the goal in its purest form, and the best-researched skill in the set |
| `enforceable-rules` | supporting | mixed | keep — owns the enforcement vocabulary; fires when a consumer agent writes constitution rules |
| `tech-decision-research` | supporting | mixed | keep — owns the confidence vocabulary; fires on the uncovered decision, which is the original problem verbatim. Merging its vocabulary into `enforceable-rules` is defensible but low-value against the disruption |
| `guardrails-toolchain` | core | mixed | keep, shed the 2026-08-02 composite/layer freight that restates directives |
| `ai-maintainer-principles` | core | mixed | keep — carries the only two rules in the set that exist *solely* because the maintainer is an agent — same shed |
| `primary-keys` | core | mixed | keep, shrink: the recurring kernel (`ORDER BY` ban, banned generators, two-identifier split, enumeration disclosure) justifies skill form; the inception freight (worked case, surfaces criterion, composite table) is read roughly once |
| `backend-stack` | core | project-inception | shrink or demote to a constitution chapter — squarely on-goal (the goal's first clause is tech *choices*), worst cadence fit in the set; residual live trigger is the second-language argument |
| `business-numbering` | questionable | mixed | shrink to its kernel — the weakest claim to skill-hood in the set |

**No skill is off-goal, and the right verb is almost never "cut."** The three
critics' cut-list author, arguing the hostile side, ended at the same place:
demote, merge and shrink, applying to about a quarter of the set by count, with the
thirteen-skill recurring core "load-bearing and correctly shaped."

### The two findings that matter more than any single row

**1. The cost/evidence relationship is inverted, and that is a structural defect,
not adversarial framing.** Measured 2026-08-03 (scratch counter over `description`
fields, o200k_base — the committed script is broken, see incidental findings):
`primary-keys` 358, `business-numbering` 306, `guardrails-toolchain` 300,
`ai-maintainer-principles` 277, `backend-stack` 255. **The five largest description
slots are exactly the five converted-record skills — 1,496 of 4,174 description
tokens, 35.8% of the tier every consumer pays unconditionally — and those five are
the least-researched members of the set by its own markers**: everything
*convention*, central claims *uncertain*, source records citing no primary source,
two source searches failed. The best-researched skill in the repo
(`llm-default-traps`, mostly *confirmed*) costs 247. `BACKLOG.md` already owes
trims on three of the five; this review adds the ranking as the reason those rows
should not wait.

**2. "Well-researched" is currently satisfied more by honest labeling than by
verification, and that gap — not skill inventory — is the larger distance from the
stated goal.** By the repo's own tiers: `llm-default-traps` is mostly *confirmed*;
the three big rule families are all-*convention* design arguments with honest
ceilings (one pass skipped its refutation votes, another had no panel at all); the
five conversions are *convention* throughout with central claims *uncertain*. The
skills disclose this impeccably — the disclosure discipline is the set's real
strength — but an owner describing this repo as "well-researched principles" is
today describing the labeling, not the verification. The path is already written:
the evidence-owed table in `BACKLOG.md`, whose cheapest row
(the `primary-keys` benchmark reproduction) has been costed as an afternoon.

### The one "questionable", argued

`business-numbering` is the family's weakest claim to skill-hood versus a product
design record. Its portable bias-override kernel is real but small — Damm not Luhn,
counter row not engine sequence, no parsing meaning from a number, no renumbering —
and two of those bans are already published in full inside `primary-keys` (the
deliberate duplication recorded 2026-08-02), so a consumer installing the sibling
already carries the two most coding-time-recurrent ones. Roughly half its body by
the section counts is one product's milestone spec that was never run — the
contention ceiling and relief ladder ("never fired"), capacity gauges, cutover
gates, the seven-class catalog — serving the authoring org's product line more than
a generic consumer. Defensible to keep whole **if** future projects are all fintech
backends, which is the stated dedup-research use; the honest shape otherwise is the
four-to-five named overrides with the milestone spec living in the product repo.

### Where the hostile case overreached, recorded so it is not re-litigated

- **"Move every Wiring-the-gates section to `gates.md`"** — already measured and
  closed: [context-budget.md](context-budget.md) item 4 moved the two sections over
  ~800 tokens and found that below the floor the pointer and heading eat the
  saving; the floor held on re-measurement.
- **"All-convention proves the five conversions should go"** — the critic conceded
  this proves too much: `caching` (16/16 *convention*) and `async-handoff` (30/30)
  fall to the same axe and are plainly the goal's archetypes. Cadence, not marker
  tier, does the real work in every defensible demotion.
- **Nothing should be cut on the current firing data.** The baseline is
  `claude-sonnet-5` by accident; the only repeated miss was half-exonerated by its
  one Opus retry. The Opus re-baseline in `BACKLOG.md` stays ahead of any
  description or inventory action.

### The founding disease, one level up

Worth naming because the repo names it about others: **always-fired bodies are
accreting meta-apparatus the way the old copy-paste file accreted rules** — marker
ceilings, wiring sections, named-gap lists, and the 2026-08-02 composite-shape and
layer-check tables, which three readers independently flagged as partially
restating directives already present. Some of that mass is load-bearing and
measured so (the marker-block compression was attempted, measured, and reverted;
the ceilings must stay inline). The composite tables added 2026-08-02 have had no
such measurement and are the next candidates for one — a read-through against the
directives they sit beside, not a purge.

## Incidental findings

- **`scripts/frontmatter-tokens.mjs` is broken**: unescaped backticks inside the
  template literal around line 110 throw a `SyntaxError` on Node 26.5.1, so
  `npm run tokens:frontmatter` currently reports nothing — the repo cannot at
  present measure the tier both of this review's questions price. Found
  2026-08-03; deliberately left unfixed, because the owner scoped this pass to
  answering the questions. The description figures above came from a scratch
  counter against the same `gpt-tokenizer` dependency.

## What this review does not decide

- **The set's real firing rate.** Every rate cited in this document is void —
  found 2026-08-03 evening, after this review was written: the harness sandbox
  was not sealed, so 31/44, 19/44, 23/44 and the 5–6/16
  `ai-maintainer-principles` figure all measure sessions that could shell out
  and then ran out of turns. See
  [firing-harness.md](firing-harness.md). **The argument of Question 1 does not
  depend on the rates** — its load-bearing claim is that a knowledge base's
  delivery rate for a question the agent never asks is zero by construction,
  whatever the skills' rate turns out to be. What the void numbers do remove is
  the honest-bill figure in cost 1: the delivery layer's unreliability is still
  real and still runtime-silent, but its size is unmeasured.
- **Whether any shrink, merge or demotion executes.** Every action above is a
  recommendation; no skill, description or file was changed by this review.
- **The truth of the external figures.** The 650-trial activation study, the
  agentskills.io client count, and the Graphify identification are one web pass,
  2026-08-03, no refutation votes.
- **Whether Graphify is what the owner meant.** The category verdict was
  constructed to survive the ambiguity.
