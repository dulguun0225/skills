# CLAUDE.md

Guidance for Claude Code when working in this repo.

## What this repo is

Skills repo: publish dated, researched engineering-decision rules as Agent Skills, installed with Vercel `skills` CLI (skills.sh), **not listed in public skills.sh directory**.

No build/lint/test tooling. The discovery check wraps Vercel's `skills` CLI, pinned in `package-lock.json`; the two gates wired 2026-08-02 are this repo's own Node scripts, bespoke. Layout decided 2026-07-30, one skill per topic, flat.

**Milestone 1 — turn imported corpus into skills — done 2026-07-30.** **Source corpus deleted 2026-08-01; repo skills-only now.** It was imported material, never published, and every rule set in it shipped as a skill before it went. Researched-but-unwritten topics salvaged into [BACKLOG.md](BACKLOG.md); whole corpus recoverable from git at `428bd5411884567d68bdf5554a0492977427a815`. **No new material lands anywhere but `skills/`.** Cost of deletion: line-range provenance gone, so no recorded review is re-runnable against source, and the token-placement check has no source input.

Skills authored since are harvested from `BACKLOG.md` and from the sibling repo `../net-saas`, not from corpus.

**Never state a skill count here.** Run `npm run check` and compare against `ls skills/`. A count in this file is a failure the repo has recorded a dozen times.

**This file is loaded every session, so it carries only what is needed every session.** New authoring records, sweeps and review findings go to `docs/history/<family>.md`. Add a line here only when the finding changes an operative rule or names a new recurring defect class. Same split the skills use: `SKILL.md` always loaded, `evidence.md` one hop away.

## Commands

Fresh machine setup = [README.md](README.md), *Setup on a new machine* — `mise trust`, `mise install`, `npm ci`, that order. No build/lint/test command. Two wrap the distribution CLI, pinned in `package-lock.json`; two are this repo's own gates in `scripts/`:

```bash
npm run check                 # list the skills the CLI discovers here — the discovery check
npm run gates                 # both wired gates; fails the build, not advisory
npm run try -- <name>         # run one skill from the working tree without installing it
```

`npm run check` answers whether a skill is in a discoverable location with valid frontmatter. Anything it does not list is invisible to every consumer. **Compare its output against `ls skills/`.** It says nothing about resource files — `evidence.md`, `api.md`, `storage.md`, `shapes.md` unlisted, so **frontmatter is the discovery check's whole reach and always was**.

`npm run gates` = the two `enforceable-rules` calls machine-checkable, wired 2026-08-02, each also runnable alone as `check:evidence-order` and `check:pointers`. **Both print what they do not decide on every run**, which is a requirement of the skill they implement and not decoration. What they reach, and the two design decisions inside them that a reader will otherwise re-litigate — the declared `PASS_ORGANISED` exemption list, and why a rule id is only recognised in code ticks — are in [docs/history/wired-gates.md](docs/history/wired-gates.md). **Neither gate reaches evidence content, marker honesty, or any of the five incompleteness checks.**

**It caught a real defect 2026-07-30 and was the only thing that would.** `llm-default-traps` was written with `: ` — colon then space — inside an unquoted `description`; YAML parsed it as a nested mapping, not a string, so the file was **not a skill at all**. Nothing about it looked wrong when read. **Run `npm run check` after writing or editing any frontmatter; treat a missing name as a frontmatter syntax error before looking anywhere else** — descriptions here are long prose, colons easy to write.

**`npm ci` must run first** — `npm run check` shells out to the pinned CLI in `node_modules`; without it the script fails with `'skills' is not recognized` rather than reporting zero skills.

Two more CLI commands, not wrapped, each one-off: `npx skills init <name>` scaffolds `<name>/SKILL.md` at repo root, so anything it makes must be moved under `skills/`; `npx skills add <owner>/<repo> -a claude-code -y` = how a consumer installs from here.

Two gates the deleted corpus referred to are **still not in this repo under their own names**: `ci/check_packs.py` and a `bundle-checks.yml` freshness step. **`scripts/` now covers what `check_packs.py` was described as doing** — mis-grouped evidence subheadings, and rule ids or links that do not resolve — written against `enforceable-rules` rather than recovered, since the corpus is gone. **The freshness step has no equivalent**: nothing warns when a `review-by` date passes, and the lapse rule is still self-executing on the reader.

## Distribution constraints (skills.sh)

Verified against `vercel-labs/skills` README 2026-07-30.

- **Discovery layout.** Skill containers walked one level deep for flat layout `skills/<name>/SKILL.md`, one extra level for catalog layout `skills/<category>/<name>/SKILL.md`. A `SKILL.md` at a shallower level shadows anything nested below. `skills/`, `skills/.curated/`, `skills/.experimental/`, `skills/.system/`, `.claude/skills/` all scanned; a root `SKILL.md` makes the repo one skill. Recursive search happens only when nothing is found in a standard location — do not rely on it.
- **Frontmatter.** `name` (lowercase, hyphens) + `description` required; a file missing either is not a skill. `allowed-tools` broadly supported; `context: fork` is Claude Code only, so it cannot be load-bearing for a skill meant to work anywhere.
- **Unlisted, two separate mechanisms.** Absence from the skills.sh directory keeps a skill unlisted while `npx skills add <owner>/<repo>` (or full git URL, or direct tree path) still installs it. `metadata.internal: true` goes further: the CLI hides the skill from its own discovery, including `--list`, unless `INSTALL_INTERNAL_SKILLS=1` is set. Choose deliberately — the second one hides the skill from us too. It stays **unset** here, because `npm run check` depends on `--list`.
- Spec: [agentskills.io](https://agentskills.io).

## Where skills live

**One skill per topic, flat: `skills/<name>/SKILL.md`.** Resource files sit inside the skill's own dir. Catalog level (`skills/<category>/<name>/`) is available if the set outgrows a flat list; unused, and moving to it later changes installed paths.

**Topic = what the agent is doing when it needs the rules.** Consequence: language-neutral rule sets are skills in their own right, not resource files inside a Java skill — money rules must reach a non-Java repo, and caching rules should load only when something is about to be cached.

**Skill dir = the whole world its consumer has.** Every link in a skill resolves inside that dir or is an absolute URL. Text is rewritten wholesale, never half-copied.

Provenance table, what became no skill, and the two shape questions (both closed, every skill answered them) are in [docs/history/decomposition.md](docs/history/decomposition.md).

## Authoring invariants

Rules every skill here is held to. They came from the deleted corpus; **published skills are the authority now** — `tech-decision-research` defines confidence markers and method, `enforceable-rules` defines enforcement markers, status tier, the premise-specificity test, the design principles, and the predicate, composite-shape, layer, enumeration and token-placement checks. Read those before authoring, not this summary.

- **A rule ships with a named check + enforcement marker, or it is not a rule.** Never restate a directive without its parenthesised check.
- **Dates and markers travel with the claim.** Dropping a *convention* marker promotes a design argument to verified fact; dropping the date disables the lapse rule.
- **Directive text and evidence stay separate.** `SKILL.md` = instinct-override payload for a scarce context window; `evidence.md` = for a human deciding whether to trust it. Progressive disclosure maps onto this directly, and it is why no family fits one always-loaded body.
- **Ids resolve inside the installed skill dir, or they do not ship.** `M-n`, `C-n`, `E-n` ship because a consumer installing `money-java` has `money/`, `money-api/`, `money-storage/` on the same disk. `P-n` **never** ships, and the rule is absolute not contingent: an id resolves for one reader and dangles for another, and a stable `###` heading name carries the whole point of never renumbering. `DECISIONS.md` `B-n` is unreachable and never appears. No relative link leaves its own skill dir.
- **Name the corpus favourite and why it lost.** "Use X" does not override an agent's instinct; "the default is Y, rejected because Z" does. That sentence is the most important line in a skill — never compress it away.
- **Where duplication is deliberate, one owner + one index** — the only thing that catches drift. Preferred fix is write-once: each directive's text exists exactly once, **which every family did until 2026-08-02**. `primary-keys` and `business-numbering` now state two directives in full each — the immutability rule and the parsing ban — because a repo can install either alone and both bans bear on both subjects. **`business-numbering` is the owner; the index is the paragraph beside those bullets in `primary-keys`.** That is the first deliberate duplication in this set, and it exists because the alternative was a dangling pointer for half its readers.
- Directive shape: **bold directive**, then reasoning, then the check in parentheses with its enforcement marker.

**Markers, per claim and per rule.** Confidence: *confirmed* (survived three independent refutation votes against primary sources) / *primary-source verified* (one researcher, no panel) / *convention* / *uncertain*. Enforcement: *off-the-shelf* / *bespoke* / *convention*. Status tier: *production-confirmed* / *decided, not yet validated* (= researched and decided, **no production use yet**) / *deferred — evidence-driven*. **Lapse rule**: past `review-by`, every *confirmed* marker reads as *convention* until a new pass re-dates it — no maintainer action needed.

**Shared premise** every skill states: code written by LLM agents, and no human reads it line by line. Rules are conditioned on it; verdicts are portable exactly as far as their premises.

**Two invariants narrowed by the method-skill conversion:**

- **"Dates and markers travel with the claim" assumes the source has a date.** Where material carries no frontmatter, marker or date, the rule holds by being applied honestly not literally: **invent no date**, state the conversion date once and label it as such, derive markers by applying the downgrade rule. Inventing a per-directive date is the exact failure this invariant exists to prevent, in reverse.
- **"A rule ships with its named check" is about rules that bind code.** Process directives' check = a written artifact whose absence is visible. State the contradiction inside the skill rather than hiding it behind a hedged tool name.

## Recurring defect classes

Every review found defects in files the authoring pass had called clean. These are the classes that repeat — check for them before declaring a pass done. Their mechanised forms are published in `enforceable-rules`.

- **Counting.** Most-recorded failure here, a dozen instances. A count in prose decays; enumerations split across files decay fastest, and a count can be invalidated by publishing the document that states it. **Name the contents, never the number** — except where the count *is* evidence, and then state it with its date and call it a re-runnable check. Superlatives ("the only skill that…", "the strongest group") are counts in disguise and were false every time.
- **De-naming.** A tool or product reduced to its category ("the lint host", "a classic-protocol cache"). Caused by carrying neutral-skill style into a skill with no stack sibling. Catch it by extracting identifier-shaped tokens from **every** source region and requiring each **per directive** — presence somewhere in the file is not placement.
- **Follow the pointer.** "Named in the stack skill", "both say the same thing", "the issues named above" — every one is a claim about another file's contents, and each failed in both polarities (promising a name that was withheld, and withholding one that was needed). Open the cited file. **A claim to have verified is itself a claim to check.**
- **Publish obliges a sweep, in both directions.** Publishing a skill obliges finding every sentence in every other file that says the thing does not exist — **including `README.md`**, which is consumer-facing and was missed for eleven skills. **Narrow, do not replace wholesale**: check what the new skill actually publishes against what the old sentence actually claimed, because wholesale replacement is sometimes false. Recoveries of external material oblige the same sweep. **So does building something a skill names as missing**, and that is where it failed next: wiring the two gates on 2026-08-02 swept `CLAUDE.md`, `README.md` and `BACKLOG.md` and left `enforceable-rules` still telling every consumer that **nothing in this skill set runs either check** — a false sentence in always-loaded directive text, in the one skill the work implemented. **The repo files are the easy half of the sweep; the published skills are the half that reaches a consumer.**
- **`evidence.md` fixed, `SKILL.md` missed.** The repo's worst recorded shape, and it has happened three times: the always-loaded file keeps the stale sentence while the file one hop away is corrected. The consumer reads the stale one.
- **Marker words leak into prose.** *confirmed* used as ordinary English over material its own table marks otherwise. Gloss a marker or tier by diffing against its definition, never by writing from the phrase.
- **A named gap can be false, and it fails in the flattering direction.** Found 2026-08-02 running the layer check on `primary-keys`: a *Named gaps* entry claimed the `ORDER BY` ban "catch the SQL" while the check line beside it named an architecture test reading bytecode as its only host. **A gap list is text like any other** — read each entry against the check line beside it, not only against the directives. **The same shape recurred twice in `BACKLOG.md` the same day**: the `caching` and `async-handoff` layer-check cells each stated a crossing the directives already named, because the cells were written from memory of those skills rather than from a read of them. **The verdict *owed* is reliable; the reason beside it is not.** The remedy for the two-language problem is usually already published in a sibling (`money-storage` `M-35`), so look there before naming a host.
- **De-naming is born in new prose, not only inherited in old.** The token-placement check run 2026-08-02 found two described-not-named subjects in published directive text (`M-10`, `M-18`) and **three in the additions that same session had just written** — Caffeine's `refreshAfterWrite`, Alertmanager's silences and inhibition rules, GitHub's scheduled-workflow disablement, each described where the writer knew the name. **Run the check over the pass that just finished, not only over what it inherited.**
- **A sweep that greps is not a sweep that reads.** Publishing `business-numbering` on 2026-08-02 swept `primary-keys` for sentences claiming the new material did not exist — the absence-assertion class — found none, and recorded the sibling as *checked and left alone*. **It had not opened the section it was pointing at**, which publishes two of the new skill's directives in full. **Grep finds the absence-assertion class; only reading finds the duplication class**, and a publish creates both. Resolved the way the write-once rule says: one named owner plus an index paragraph, not a deletion.
- **A published check may not hold over the skills that published it.** Wiring the evidence-order check 2026-08-02: `enforceable-rules` states it as *every subheading in the evidence file names a real section of the directive text*, and **8 of the 17 evidence files here name none** — they are organised by research pass, which is how the research happened. The gate ships with those eight declared by name and reason rather than with the rule bent to fit. **Writing a check is the first honest test of the rule it enforces**, and the finding is about the rule, not the files.
- **A note in this file is evidence a defect was seen, never that it was fixed.** Only the file is the check.

**One narrow slice of one class above is now enforced.** `npm run gates` fails the build on a pointer that does not resolve — a rule id no skill defines, a link out of the skill dir, a repo-only filename — which is the mechanical half of *follow the pointer*. **Its expensive half is untouched**: a claim about another file's contents still needs the file opened. Every other class here is reading, and every recorded review remains scratch scripts plus a human or agent looking.

## History — open the one you need

Per-skill records: what each authoring pass decided, its sweeps, its adversarial reviews, and what is still open for it. Read the file for the family you are touching, not all of them.

- [money](docs/history/money.md) — `money`, `money-api`, `money-storage`, `money-java`; `M-1` … `M-43`
- [caching](docs/history/caching.md) — `caching`, `caching-java`; `C-1` … `C-16`
- [async-handoff](docs/history/async-handoff.md) — `async-handoff`, `async-handoff-shapes`, `async-handoff-java`; `E-1` … `E-36`
- [llm-default-traps](docs/history/llm-default-traps.md) — owner of record for the jqwik pin
- [java-backend](docs/history/java-backend.md) — `java-backend-rules`, `java-backend-api`, `java-backend-observability`
- [method-skills](docs/history/method-skills.md) — `tech-decision-research`, `enforceable-rules`; the marker vocabularies split between them
- [backend-stack](docs/history/backend-stack.md) — the stack argument, its candidate list and competing census
- [guardrails-toolchain](docs/history/guardrails-toolchain.md) — what makes a gate adoptable
- [ai-maintainer-principles](docs/history/ai-maintainer-principles.md) — system shape under an agent maintainer
- [primary-keys](docs/history/primary-keys.md) — no adversarial review run on it
- [business-numbering](docs/history/business-numbering.md) — newest; harvested from the same external record `primary-keys` read for one fact. No adversarial review run on it either
- [decomposition](docs/history/decomposition.md) — corpus provenance table, what became no skill, the two shape questions
- [incompleteness-checks](docs/history/incompleteness-checks.md) — what all five checks found, per skill, 2026-08-02
- [wired-gates](docs/history/wired-gates.md) — the two executable checks in `scripts/`, and the finding that one of them does not hold over 8 of the 17 evidence files
- [harvests](docs/history/harvests.md) — what each closed backlog harvest cost and changed: `guardrails-toolchain`, `ai-maintainer-principles`, `primary-keys`, `business-numbering`
- [evidence-owed-longform](docs/history/evidence-owed-longform.md) — the prose the backlog's owed-evidence table was compressed from
- [whole-project-review](docs/history/whole-project-review.md) — 2026-07-31, first review whose unit was the repo

Live owed work is in [BACKLOG.md](BACKLOG.md), not in these files: a history file records what a pass closed, the backlog carries what is still owed.

**That split failed on 2026-08-02 and the failure mode is worth naming: `BACKLOG.md` grew during the session that closed every check on it**, because each closed check wrote its findings into the row it was closing. **A backlog that grows as work completes is recording closure, not obligation.** Restored by moving the closure records to `docs/history/` — [incompleteness-checks](docs/history/incompleteness-checks.md), [harvests](docs/history/harvests.md), [evidence-owed-longform](docs/history/evidence-owed-longform.md) — and the same trim recurred on 2026-08-02 when the *closed* checks section itself was still sitting on the page announcing its own closure. **When a row closes, the finding leaves this page with it, and so does the row.**
