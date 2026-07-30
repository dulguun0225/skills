# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A skills repository: it publishes the engineering-decision corpus in `raw/` as
Agent Skills, installed with Vercel's `skills` CLI (skills.sh) and **not listed
in the public skills.sh directory**.

State as of 2026-07-30: `raw/` is the only content — no skill has been authored
yet, and there is no build, lint, or test tooling. What does exist is the project
setup (node and the `skills` CLI pinned, LF enforced repo-wide, commands as npm
scripts — see *Commands*) and the decided skill decomposition and layout
(*Where skills live*). **Milestone 1 is to turn the content of `raw/` into
skills.**

**`raw/` is raw data — input material, never output.** It holds source text
imported from elsewhere, to be read and converted; nothing in it is a published
skill and no consumer installs from it. Its contents are edited only to correct
an import, not to author with; conversion writes new files elsewhere and leaves
the raw text as the record of what was imported. Expect more material to be
dropped in there later.

Today's `raw/` is a lifted subtree — it was the `packs/` directory of a larger
spec-driven-development bundle (nc-ears preset over spec-kit). Its internal
relative links resolve here; everything pointing outside it does not (see
*Dangling references* below).

## Commands

Setting up a fresh machine is [README.md](README.md), *Setup on a new machine* —
`mise trust`, `mise install`, `npm ci`, in that order. There is no build, lint, or
test command. The two that exist wrap the distribution CLI, pinned in
`package-lock.json`:

```bash
npm run check                 # list the skills the CLI discovers here — the discovery check
npm run try -- <name>         # run one skill from the working tree without installing it
```

`npm run check` is the only self-check that exists: it answers whether a skill is
in a discoverable location with valid frontmatter. Anything it does not list is
invisible to every consumer. **It exits non-zero while no skill has been
authored** — the CLI treats "no skills found" as a failure, which is the correct
answer today.

Two more CLI commands are not wrapped, because each is a one-off:
`npx skills init <name>` scaffolds `<name>/SKILL.md` at the repo root, so anything
it makes is moved under `skills/`; `npx skills add <owner>/<repo> -a claude-code
-y` is how a consumer installs from here.

Two checks the corpus text refers to are **not in this repo**:
`ci/check_packs.py` (fails the build on mis-grouped evidence subheadings and on
rule ids or links appearing in seed text) and the `bundle-checks.yml` freshness
step (warns when `review-by` has passed). If those gates are wanted here, they
have to be written.

## Distribution constraints (skills.sh)

Verified against `vercel-labs/skills` README on 2026-07-30.

- **Discovery layout.** Skill containers are walked one level deep for the flat
  layout `skills/<name>/SKILL.md`, and one extra level for the catalog layout
  `skills/<category>/<name>/SKILL.md`. A `SKILL.md` at the shallower level
  shadows anything nested below it. `skills/`, `skills/.curated/`,
  `skills/.experimental/`, `skills/.system/` and `.claude/skills/` are all
  scanned; a root `SKILL.md` makes the repo one skill. Recursive search happens
  only when nothing is found in a standard location — do not rely on it.
- **Frontmatter.** `name` (lowercase, hyphens) and `description` are required;
  a file missing either is not a skill. `allowed-tools` is broadly supported;
  `context: fork` is Claude Code only, so it cannot be load-bearing for a skill
  meant to work anywhere.
- **Unlisted, two separate mechanisms.** Absence from the skills.sh directory
  keeps a skill unlisted while `npx skills add <owner>/<repo>` (or a full git
  URL, or a direct tree path) still installs it. `metadata.internal: true` goes
  further: the CLI hides the skill from its own discovery, including `--list`,
  unless `INSTALL_INTERNAL_SKILLS=1` is set. Choose deliberately — the second
  one hides the skill from us too.
- Spec: [agentskills.io](https://agentskills.io).

## Where skills live

Decided 2026-07-30. **One skill per topic, flat: `skills/<name>/SKILL.md`.**
Resource files sit inside the skill's own directory. The catalog level
(`skills/<category>/<name>/`) is available if the set ever outgrows a flat list;
it is unused, and moving to it later changes installed paths.

**A topic is what an agent is doing when it needs the rules.** It is not how
`raw/` files its material, and the decomposition does not inherit that filing or
its vocabulary — `raw/` is mined for content only. The consequence worth stating:
the language-neutral rule sets are skills in their own right rather than resource
files inside the Java skill, because the money rules have to be reachable from a
repo that is not Java, and the caching rules should load only when something is
about to be cached.

| Skill | Content drawn from |
| ----- | ------------------ |
| `java-backend-rules` | `raw/seed/java-backend.md`, split by area; evidence and dates from `raw/java-backend.md` §4 |
| `llm-default-traps` | `raw/seed/agent-traps.md`; evidence from `raw/agent-traps.md` §3 |
| `money-values` | `raw/rule-sources/money-grade.md` |
| `caching` | `raw/rule-sources/cache-discipline.md` |
| `async-handoff` | `raw/rule-sources/event-broker-discipline.md` |
| `tech-decision-research` | `raw/research-protocol.md` §1–4, §6 |
| `enforceable-rules` | `raw/README.md`'s design principles and premise-specificity test; the portable checks in `raw/research-protocol.md` §5 |

**What becomes no skill**, recorded so its absence is not read as an oversight:

- Corpus bookkeeping — `raw/index.md`'s roster, audits-owed backlog, harvest map,
  candidate list and sunset clock, and `raw/README.md`'s governance. These
  maintain the corpus; they are not a capability anyone installs.
- The six-step adoption procedure in `raw/README.md` and everything around
  `.specify/memory/constitution.md`. That machinery is not in this repo, and its
  files are dangling references here.

**`raw/` stays exactly where it is**, unchanged, as the record of what was
imported. Skills are new files under `skills/`.

**A skill directory is the whole world its consumer has.** Every link in a skill
resolves inside that directory or is an absolute URL. Where a skill carries text
verbatim from `raw/`, the copy is byte-identical and a diff is the gate; where it
is rewritten, it is rewritten wholesale — no half-copies, which a diff cannot
check and a reader cannot trust.

**Two questions are open per skill, not once for the set.** They are decided as
each skill is authored, and the answer is recorded with that skill — a directive
set of nine dependency picks and one of 149 platform rules have no reason to
answer either the same way:

- Whether a directive ships with the *kind* of check it needs and the tool left to
  the adopting repo, or appears only where a tool can be named. This decides how
  much of `money-values`, `caching` and `async-handoff` exists outside
  `java-backend-rules`.
- Whether the skill instructs the agent directly, or its job is to write a rules
  file the consumer repo commits.

### Where the first skill stands

The banned-default-picks skill — nine directives from `raw/seed/agent-traps.md`,
five dated evidence entries in `raw/agent-traps.md` §3 — is the one to author
first: it is the smallest, and every one of its directives already names a real
check with its enforcement marker.

**Settled by the content, not open:**

- **It instructs the agent directly.** These fire when an agent is about to add a
  dependency, pin a tool, or wire CI; there is nothing to generate into a repo
  file.
- **The check question does not arise.** No directive here is check-kind-only, so
  this skill decides nothing for `money-values`, `caching` or `async-handoff`.

**Open. A recommendation is given for each so the next session can accept or
overturn one, not re-derive all three:**

- **The five JVM-only directives** (jqwik pin, the jollyday fork, Error Prone over
  ArchUnit for non-loggability, JSR-385, the `char[]` myth). *Recommended:* keep
  them in this skill as a group conditioned on JVM repos, the way the source text
  already splits them — they are dependency and tooling picks rather than
  service-code rules, so a Java library or CLI that is not a backend still needs
  the jqwik pin. The alternatives are moving them into `java-backend-rules` or
  giving them a skill of their own.
- **Where confidence markers and dates sit.** *Recommended:* each directive
  carries its marker and date inline, with sources, negative citations and re-open
  triggers one hop away in the skill's own reference file. Four of the nine pin a
  version or record an incident, so they decay, and the lapse rule only works on a
  date the reader can see.
- **The name.** `llm-default-traps` in the table above is provisional. It says
  what the content is — the picks an LLM makes by training-data default, banned by
  name — but it is not decided.

## The `raw/` corpus — the model to preserve

Read `raw/README.md` first; it is the authority on the corpus's own rules. The
structure that takes several files to see:

**Three kinds of file, and the directory is the split.**

| Kind | Adopted? | Files |
| ---- | -------- | ----- |
| Stack pack | yes — its seed file is pasted | `raw/java-backend.md` |
| Cross-stack pack | yes — its seed file is pasted | `raw/agent-traps.md` |
| Cross-stack source | **no — has no seed file, nobody adopts it** | everything in `raw/rule-sources/` |

A **pack** is the evidence file: when it applies, the tripwires, rejected
alternatives named by name, dated evidence notes, re-open triggers. The
**seed file** (`raw/seed/<pack-id>.md`) is the paste unit — directives only, no
title, no evidence, no commentary — so adoption is "copy the whole file". A
**source** holds portable directives under stable ids (`M-n` money-grade, `C-n`
cache-discipline, `E-n` event-broker-discipline) and is never pasted; each stack
pack **instantiates** every one of its rules with that stack's named check, or
names the gap with a reason, or records a platform divergence in the source's
instantiation table. Silence about a source rule reads as coverage and is a
defect.

**Frontmatter is the only authority** for `status`, `holds-when`, `verified`,
`review-by`. `raw/index.md`'s Shipped table is the single deliberate mirror of
the dates; `raw/README.md`'s roster carries none, because a date copied into
three files goes stale in two. Do not add a fourth copy.

**Markers, per claim and per rule.** Confidence: *confirmed* (survived three
independent refutation votes against primary sources) / *primary-source
verified* (one researcher, no panel) / *convention* / *uncertain*. Enforcement:
*off-the-shelf* / *bespoke* / *convention*. Status tier: *production-confirmed*
/ *decided, not yet validated* / *deferred — evidence-driven*. The **lapse
rule**: past `review-by`, every *confirmed* marker reads as *convention* until a
new pass re-dates it — no maintainer action needed.

**The authoring bar** is `raw/README.md`'s design principles `P-1` … `P-8` (ids
never renumbered, cited by id) plus the premise-specificity test: a rule earns
its place only when "no human reads the code" changes its stakes — the failure
it prevents turns invisible-forever or unbounded. `raw/research-protocol.md` is
the method (§1–4, §6 apply to any decision at this bar; §5 is the pack-specific
ship checks, including the B-13 predicate, B-15 composite-shape and B-16 layer
checks). `raw/index.md` carries the *Audits owed* backlog for those three —
**an empty cell there is a check nobody ran, not a clean file.**

**Every pack's shared premise** (`holds-when`): code is written by LLM agents
and no human reads it line by line. Rules are conditioned on it; verdicts are
portable exactly as far as their premises.

### File map

| File | Lines | Role |
| ---- | ----- | ---- |
| `raw/README.md` | 343 | how packs work, anatomy, markers, adoption procedure, `P-1` … `P-8`, governance |
| `raw/index.md` | 320 | shipped-date mirror, audits-owed backlog, candidate sources, harvest map, sunset |
| `raw/research-protocol.md` | 189 | the evidence bar and the ship checks |
| `raw/agent-traps.md` | 81 | cross-stack pack — corpus defaults banned by name |
| `raw/seed/agent-traps.md` | 53 | its paste text (any-stack group + Java-family group) |
| `raw/java-backend.md` | 1835 | stack pack — Java, Spring Boot MVC, jOOQ, PostgreSQL; §4 is the evidence trail, grouped by seed section |
| `raw/seed/java-backend.md` | 1757 | its paste text; sections Platform … Event broker discipline |
| `raw/rule-sources/money-grade.md` | 889 | source, `M-1` … `M-43` |
| `raw/rule-sources/cache-discipline.md` | 734 | source, `C-1` … `C-16`; every directive is *convention* |
| `raw/rule-sources/event-broker-discipline.md` | 2533 | source, `E-1` … `E-36`; every directive is *convention*, and its pass was short of the three refutation votes |

## Invariants when converting `raw/` into skills

These are the corpus's own rules, and the conversion is where they break
quietly.

- **A rule ships with its named check and enforcement marker, or it is not a
  rule** (`P-1`). Never restate a directive without the parenthesised check.
- **Dates and markers travel with the claim.** Dropping a *convention* marker
  promotes a design argument to a verified fact; dropping a date disables the
  lapse rule.
- **Directive text and evidence stay separate.** Seed text is instinct-override
  payload for a scarce context window; evidence is for the human deciding
  whether to trust it. Progressive disclosure maps onto this directly — but the
  Java seed text alone is 1757 lines, so a single always-loaded `SKILL.md` body
  cannot hold it.
- **Rule ids (`P-n`, `M-n`, `C-n`, `E-n`) and links back into this corpus never
  appear in anything that leaves this repo** — neither text a consumer pastes nor
  a file a consumer installs. The consumer has no copy of this corpus, so a cited
  id or a relative link lands there as a dangling pointer. Ids stay in `raw/`.
- **Name the corpus favourite and why it lost** (`P-6`). "Use X" does not
  override an agent's instinct; "the default is Y, rejected because Z" does.
  That sentence is the most important line in a pack — do not compress it away.
- **Duplication between stack packs is deliberate**; the source's instantiation
  table is the only thing between it and drift.
- Directive shape in seed text: **bold directive**, then the reasoning, then the
  check in parentheses with its enforcement marker.

Where the converted skills live, and what one skill is: *Where skills live*
above. Two questions about the shape of a directive in a skill are still open and
are listed at the end of that section.

## Dangling references in `raw/`

Cited but absent from this repo. Do not send an agent looking for them, and do
not resolve a citation by guessing:

- `DECISIONS.md` — cited by id throughout (**B-3, B-8, B-10, B-11, B-13, B-14,
  B-15, B-16**). These ids carry the reasons behind the corpus's structure and
  cannot be resolved here.
- `ci/check_packs.py`, `bundle-checks.yml` — the machine checks.
- `../../../CLAUDE.md`, `../../../reference/open-questions.md`, `GOVERNANCE.md`,
  `docs/BREAKING-CHANGES.md` — bundle-root files.
- `.specify/memory/constitution.md`, `spec.md`, `plan.md`, the
  `speckit.plan` / `speckit.nc.review` commands, the nc-ears preset — the
  consuming repo's machinery, which is what pack text is written to land in.
- **Paths in the prose are stale**: `raw/README.md` and `raw/index.md` still say
  `packs/*.md` and `packs/rule-sources/` for what is now `raw/` and
  `raw/rule-sources/`.
