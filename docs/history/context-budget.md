# Context budget — the per-firing and per-session cost of this skill set

Measured 2026-08-02, and worked the same day. **This file is both the procedure
and the record of what it produced**: each item carries its method, and the ones
that have been done or abandoned carry a dated subsection saying which. What is
still owed lives in [BACKLOG.md](../../BACKLOG.md), the same split
[evidence-owed-longform.md](evidence-owed-longform.md) uses.

**Where it stands, 2026-08-02: item 3 is the only one left, one of its four
descriptions done and the rest paced by use.** Items 1, 2 and 4 are closed by doing
them; item 5 by doing it, measuring it and reverting. The set's **directive text** —
the `SKILL.md` column of `npm run tokens` — has gone **175,380 → 150,835**, the
whole-set total, which counts the resource files item 4 created, **175,380 →
163,856**, and frontmatter **4,481 → 4,383**. The exemption list in
`scripts/evidence-order.mjs` lost two of its files along the way.

## The numbers, and how to get them back

**Every figure here is a count, and counts decay** — the repo's most-recorded
defect class. Each is stated with its date and with the command that regenerates
it, which is the only form the counting rule permits.

Two figures come from committed scripts:

```bash
npm run tokens                # 175,380 at the start of 2026-08-02; 163,541 by the end of it
npm run tokens:frontmatter    #   4,481 at the start of that day, 4,466 by the end
```

The per-section figures came from a one-off counter that was not committed.
**Committed 2026-08-02 as `scripts/token-sections.mjs`, wired as
`npm run tokens:sections`** — that follow-up is closed, and the sweep it obliged
(`CLAUDE.md` *Commands* and the *reports, not gates* paragraph, `README.md`
*Commands* and the three-tier paragraph below it) was paid in the same pass. Two
count claims in prose were false the moment it landed and were rewritten rather
than re-numbered: *the two token scripts* in `CLAUDE.md`, *the two token reports*
in `README.md`.

```bash
npm run tokens:sections                        # every skill, sections over 200 tokens
npm run tokens:sections -- --skill money-java  # one skill
npm run tokens:sections -- --repeated          # roll up by section name across skills
npm run tokens:sections -- --min 0             # fold nothing
```

**`--repeated` is the view items 1, 4 and 5 are argued from**: it sums a section
name across every skill carrying it, which is the number that decides whether a
move is worth designing once. It reproduced `Wiring the gates` at 7,991 over
twelve skills, matching what the one-off counter found, which is the only check
run on the script beyond reading its output.

Per-section counts sum to slightly more than the whole file — each section is
encoded on its own, and the tokenizer merges across a boundary differently than
it does in one pass. Text before the first `##` is charged to
`(frontmatter + intro)`.

## What the tiers mean, and why the target is the second one

`CLAUDE.md` owns this; restated only far enough to make the procedure legible.
Frontmatter is paid **every session whether the skill fires or not**. The
`SKILL.md` body is paid **each time the skill fires**. A resource file is paid only
if the body points at it and the agent opens it — and `evidence.md` is paid
**never**, which is why `npm run tokens` excludes it and why moving text there is
the one edit that costs a reader nothing.

**Consequence that drives items 1, 2 and 4: text moved into `evidence.md` leaves
the measured budget entirely.** It is not compression. Nothing is lost and nothing
is rewritten — it changes which tier pays.

## 1. Evidence tables inside always-loaded bodies — closed, 287 left by decision

**The 16,483-token figure this item was opened with was wrong, and the error is
the repo's own counting class.** Re-measured 2026-08-02 with
`npm run tokens:sections`, after the three moves recorded below: a literal
`| Claim | Marker …|` table survives in **six** `SKILL.md` files —
`java-backend-rules` 643, `java-backend-api` 593, `java-backend-observability`
501, `llm-default-traps` 285, `enforceable-rules` 214, `tech-decision-research`
73 — **2,309 tokens in total**, against 5,525 moved out of the three java skills.
The original figure summed whole `Evidence and dates` and `Markers, dates, and
what they mean` sections, and **most of that mass is the marker-definition block,
which is item 5, not a claim table.** Re-run the split with a scratch counter over
lines from `| Claim` to the end of the table; the section-level view is
`npm run tokens:sections -- --repeated`.

**What that changes: item 1 is nearly finished, and the mass the miscount
attributed to it belongs to item 5** — `Markers, dates, and what they mean`
measures **8,692 tokens across 18 skills**, up from 8,053 across 15 because the
three java skills below each gained one. **Item 5 was then attempted on that
number and rejected**; read it before reaching for the same conclusion.

**Finding as originally stated, kept because the three-skill part of it was
true:** three skills — `async-handoff-java`, `caching-java`, `money-java` — **had
no `evidence.md` at all**, so their evidence had nowhere to go but the body:

| Skill | `Evidence and dates` section | Share of its body |
| ----- | ---------------------------- | ----------------- |
| `async-handoff-java` | 3,100 | 22% |
| `caching-java` | 1,700 | 26% |
| `money-java` | 725 | 16% |

This is a straight failure of the repo's own invariant — *directive text and
evidence stay separate*, `SKILL.md` the instinct-override payload, `evidence.md`
for a human deciding whether to trust it. A claim table is the second thing by
definition.

**Procedure, per skill:**

1. Create `skills/<name>/evidence.md` where it does not exist. Do **not** create it
   by moving the whole section — move the parts named below and leave the rest.
2. **Move:** the `| Claim | Marker | Date |` table; the *Do not cite* list; source
   URLs and vendor-documentation quotations; pricing paragraphs and their
   collection method; the record of which pass ran which panel; recorded
   contradictions between sources that no directive depends on.
3. **Keep inline, without exception:** the enforcement marker and confidence marker
   **beside each directive**; the `review-by` date; the lapse-rule sentence; the
   *marker ceiling* paragraphs where a skill's evidence is uneven by area, because
   that paragraph changes how an agent reads the directives it is standing next to.
4. Leave a one-line pointer where the table was — `Ground behind each claim, with
   its source and date, is one hop away in [evidence.md](evidence.md).`
   `java-backend-rules` already ends that way and is the model.
5. Run `npm run gates`. The evidence-order check requires **every subheading in
   `evidence.md` to name a real section of the directive text**. Prefer naming the
   sections. Adding the file to the script's declared `PASS_ORGANISED` exemption
   list is available and is a last resort — that list exists for the files
   organised by research pass, and growing it weakens the check for everyone. It
   shrinks instead: `guardrails-toolchain` and `llm-default-traps` both left it on
   2026-08-02.
6. Run `npm run check`. Moving text past frontmatter is where a stray `: ` gets
   introduced.

**Verify done:** `npm run tokens` falls by roughly the moved amount, because
`evidence.md` is excluded from that count by design.

### Done 2026-08-02 — the three skills that had no `evidence.md`

`money-java`, `caching-java` and `async-handoff-java` now each have one, written
to the procedure above. **Every skill in this set now carries an `evidence.md`**,
which the evidence-order gate reports as `20 skill(s) with an evidence.md
checked, 0 without one skipped` — a re-runnable check, not a count to cite.

`npm run tokens` fell from **175,380 to 170,465**, and the three bodies from
4,530 / 6,749 / 14,520 to 3,771 / 5,049 / 11,420. **The saving is smaller than
the sections moved**, by roughly 600 tokens, and deliberately so: each of the
three now ends in a `Markers, dates, and what they mean` section that did not
exist before, carrying the `review-by` date, the lapse sentence and the marker
ceiling that step 3 says never leave the body. Two of those ceilings were load
bearing and would have been lost by moving the section wholesale — *nothing in
`C-1` … `C-16` is confirmed*, and the two-weak-passes paragraph behind
`E-1` … `E-33`.

Three things learned that the six skills still carrying a claim table will hit:

- **The evidence-order gate is satisfied by writing the evidence file's sections
  in the directive text's order and giving them the directive headings**, which
  is what all three do. No name was added to `PASS_ORGANISED`. Placing a claim
  takes reading the directive it grounds — `awk '/^## /{sec=$0} /^- \*\*`E-[0-9]+`/
  {print $0, sec}'` over the `SKILL.md` maps ids to sections and is quicker than
  scrolling.
- **A `Do not cite` list anchors to nothing and that is fine** — the gate reports
  it as an orphan heading, not a failure, which is the case its own output says
  it cannot tell from a real orphan.
- **The style of a skill is not the style of its evidence file.** These three
  `SKILL.md` bodies are written in the compressed pidgin this set uses for
  directive text; their evidence files are written in full English, matching
  `money/evidence.md` and `java-backend-rules/evidence.md`, because the audience
  is a human deciding whether to trust the rules rather than an agent spending
  context on them.

### Done 2026-08-02 — four more tables, and two that stay

`java-backend-rules` 643, `java-backend-api` 593, `java-backend-observability` 501
and `llm-default-traps` 285 moved into their evidence files, each under a
`## Markers, dates, and what they mean` heading that anchors to the section it came
from — that section is the last one in all four bodies, so the moved heading sorts
last among the anchored ones and the order half of the gate is satisfied by
appending. `npm run tokens` 165,569 → **163,541**.

**`llm-default-traps` cost the second exemption.** Its evidence file was declared
`PASS_ORGANISED`; one anchored heading made the declaration stale and the gate said
so by name. Removed, same as `guardrails-toolchain`. The list is down to six, and
the documents that used to state its size were already rewritten to name the
command instead, so this time the sweep cost nothing.

**Two tables stay in the body, and the procedure's own step 3 is why.**
`enforceable-rules` (214) and `tech-decision-research` (73) each carry a
`| Claim | Marker |` table with no date column, and **each of those tables *is* the
marker ceiling** — *every directive in this skill is convention*, plus the two
claims marked *uncertain* and the gap each points at. Step 3 says a marker ceiling
never leaves the directive text, because it changes how an agent reads the
directives it is standing next to. Moving these would strip the ceiling from the
two skills that define the marker vocabularies. **A claim table is not automatically
evidence; a claim table with no dates and one row per skill-wide statement is a
ceiling wearing a table's clothes.**

**Item 1 is closed at 287 tokens left in the bodies, deliberately.**

**One thing the four moves confirmed, worth keeping for anyone touching a declared
file:** a `PASS_ORGANISED` declaration goes stale the moment one heading anchors,
and the gate fails on the stale declaration by name — so the removal belongs in the
same commit as the move, not in a follow-up.

## 2. Worked cases — 8,143 tokens

**Finding, measured 2026-08-02:** five skills carry a dated one-repo worked case
inside the body.

| Skill | Worked case | Share of its body |
| ----- | ----------- | ----------------- |
| `backend-stack` | 3,114 | **40%** |
| `guardrails-toolchain` | 1,745 | 16% |
| `ai-maintainer-principles` | 1,241 | 13% |
| `primary-keys` | 1,218 | 9% |
| `business-numbering` | 825 | 8% |

**The skills already classify this material as evidence themselves.**
`primary-keys` opens by saying the worked case is there *as evidence the criterion
discriminates, not a recommendation to copy the verdict*; `ai-maintainer-principles`
splits itself into portable directives and one repo's dated decisions in its
second paragraph. Both sentences argue for the move.

**Overlaps item 1** — worked-case sections contain claim tables, so the two
figures must not be added together. Do item 1 first and re-measure.

**Procedure, per skill:**

1. **Keep inline: the sentence naming the corpus favourite and the ground it lost
   on.** This is the invariant that says *"use X" does not override an agent's
   instinct; "the default is Y, rejected because Z" does*, and calls that sentence
   the most important line in a skill. One line per loser, in the directive text.
2. **Move to `evidence.md`:** the candidate list with per-candidate reasoning; what
   the choice cost, booked; the re-open triggers and their shape; *what the record
   does not carry*; counterfactuals and re-derivations; the dated census tables.
3. Keep the date. A worked case with its date stripped stops feeding the lapse rule.
4. Same gate and discovery runs as item 1, step 5 and 6.

### Done 2026-08-02 — `backend-stack`, the largest of the five

**3,114 tokens out of the body, 725 left behind**; the skill went 7,775 → 5,386 and
`npm run tokens` 170,508 → 168,186. What stayed inline is exactly what step 1 says:
the winner and the ground each of the four losers lost on, one line apiece, plus
the corpus-gravity cost and the sibling skills whose ban lists are that cost's
bill. What moved: the pass's full candidate list, the dated host census and the
grep that re-runs it, the competing TypeScript census, and what the record does not
carry.

Four things this pass turned up that the remaining four skills will meet:

- **The move breaks pointers in both directions, and both were live.** Six
  sentences in `SKILL.md` pointed *into* the moved text — *the census below*, *the
  competing census below*, *see What is recorded and what still is not*, *Frontend
  census in section above* — and one sentence in `evidence.md` pointed the other
  way, saying the grep command *is published in `SKILL.md`*, which stopped being
  true the moment the section arrived beside it. **Grep for `below`, `above` and
  the moved heading's own name in both files.**
- **The cost paragraph is directive text, not evidence**, even though it sits
  inside a worked case. It tells an agent which sibling rule sets it is now bound
  by. It stayed in `SKILL.md` and the moved copy of it was deleted from
  `evidence.md` rather than left as a second owner.
- **A count died in the move.** The gap list said *Four named gaps follow* over six
  bullets — wrong before the move, and copying it into a new file is where a stale
  count gets a second life. Both copies now name the gaps.
- **The `description` claimed the census.** Frontmatter said the skill carries *the
  enforcement-host census that grounds it*; after the move it does not. Corrected,
  and `npm run check` re-run — moving text is not supposed to touch frontmatter,
  but a description that enumerates the body is a description the body can falsify.

### Done 2026-08-02 — `guardrails-toolchain`, and it cost an exemption

**1,745 → 720**, the skill 10,653 → 9,628, `npm run tokens` 168,186 → 167,169.
Moved: the dated tool map — every concern, the tool adopted for it, its licence
and the caveat that bites. Kept inline: the rejection grounds with **every product
still named** (SonarQube, Chromatic, Fallow, jQAssistant, CodeQL, Konsist,
Deptective, Structurizr, Spectral, migra, Checkov), the two frontend rows
published in no skill, and a sentence naming what the caveat column found so a
reader knows what opening `evidence.md` buys.

**De-naming was the risk here and it is why the rejection list stayed whole.** A
tool comparison compressed to categories is the defect this repo has recorded most
often after counting, and this skill's own directive text says a reader cannot act
on *a taint-analysis-class scanner*.

**The move made the gate's own exemption stale, which is the interesting part.**
`guardrails-toolchain`'s evidence file was declared `PASS_ORGANISED` — organised by
research pass, anchoring to no directive section. Giving the moved section the
heading it had in the body made **one** heading anchor, and the evidence-order gate
fails on a declaration that has gone stale, by name, on the same run. The
declaration came out of `scripts/evidence-order.mjs` in the same change, with the
reason recorded in [wired-gates.md](wired-gates.md).

**That obliged a sweep of four files that state the exemption count**, and the
count had already moved twice that day: `CLAUDE.md`, `docs/history/wired-gates.md`,
`docs/history/method-skills.md`, and `enforceable-rules` in both `SKILL.md` and
`evidence.md`. **All of them now cite `npm run check:evidence-order` instead of a
figure**, which is what the counting rule asks for and what three rewrites in one
day argue for.

### Done 2026-08-02 — the last three, and item 2 is closed

`ai-maintainer-principles` 1,241 → 455, `primary-keys` 1,218 → 686,
`business-numbering` 825 → 547. `npm run tokens` 167,169 → **165,569**, which is
**175,380 → 165,569 across the whole item**, 5.6% of the set's per-firing cost.

**The last three saved proportionally less than the first two, and that is the
procedure working rather than failing.** What stays inline is one line per loser
with the ground it lost on, and these three records are mostly losers: a candidate
table, an alternatives table, a decision table. `backend-stack` shed 77% of its
worked case, `guardrails-toolchain` 59%, these three between 33% and 63%. **A
worked case that is nearly all named losers is nearly all directive text**, and
compressing further would cost the sentence the invariant calls the most important
line in a skill.

Two more things worth carrying to the next mover:

- **`ai-maintainer-principles` already had a `## The two counterfactuals` section
  in its evidence file** covering the same two records as the body's subsection,
  written after an audit caught the body fusing them. The move merged the body's
  survival lists into it rather than adding a second section, which would have
  given one subject two owners in one file.
- **A second `description` claimed what the body no longer carries.** `ai-maintainer-principles`' frontmatter advertised *the two re-derivations that repo ran under changed premises*; those are now in `evidence.md`, so the clause was cut. That is two of the five worked-case skills whose description had to follow the text, which makes it a step in the procedure rather than an accident.
- **Each of these three states which directive its own worked case half-fails** —
  Spring never priced by failure shape, no re-open trigger per loser, no re-open
  trigger per rejected alternative. **Those sentences stayed inline.** They are the
  honesty that stops a shrunken worked case reading as a clean one, and two of them
  name the sibling skill that owes the same thing.

**Item 2 is closed.** Nothing is owed on it.

**Watch for the inverse defect while doing this.** A *Named gaps* entry was found
false on 2026-08-02 in `primary-keys` — it claimed a check reached something the
check line beside it did not name. Moving evidence out is exactly when a directive
loses the text that was silently justifying it. **Read each surviving directive
against what is left, not against what you remember was there.**

## 3. Frontmatter descriptions — one of four done, 4,383 per session

> **Withdrawn 2026-08-03. Do not run the procedure below.** The three remaining
> trims came off this page and out of `BACKLOG.md` on the owner's decision, and
> the evidence that made them look safe is void: the A/B that found the first
> trim cost no firing was taken on an unsealed harness
> ([firing-harness.md](firing-harness.md)). The first sealed baseline — 43/44,
> 4/4 negatives clean, `claude-opus-5`, CLI 2.1.220, win32 — was measured on the
> descriptions as they stand, enumerations included. **A trim would now be an
> unforced edit to the only text that makes a skill fire, against a measurement
> that says it is working.** The token counts below remain accurate and the
> procedure remains correct in method; what is gone is the reason to apply it.

**The highest leverage per edit in this file, and the smallest absolute number.**
Nobody chose to load it; it is paid by every session of every consumer, for skills
that never fire.

| Skill | `description` tokens, 2026-08-02 |
| ----- | -------------------------------- |
| `ai-maintainer-principles` | 366 |
| `primary-keys` | 358 |
| `business-numbering` | 306 |
| `guardrails-toolchain` | 300 |

Each of those four has the same three-part shape: a topic clause, **a long
enumeration of the skill's own directives**, and a closing `Load before …` trigger
list. The middle part duplicates what the agent receives in full the moment the
skill fires; the trigger list is what makes it fire at all.

**Procedure:**

1. **Cut the middle enumeration, keep the trigger clause verbatim.** Target roughly
   180 tokens for the four skills above.
2. Keep enough of the topic clause that an agent can judge relevance without the
   body — that judgement is the description's whole job and is why *short is not
   automatically better*. `CLAUDE.md` states the trade-off; do not resolve it by
   trimming to a title.
3. **Do not blanket-shorten the other sixteen.** `money-java` at 120 tokens and
   `money-storage` at 138 are already at the floor; cutting them buys nothing and
   risks the skill not firing.
4. Run `npm run check` **after every frontmatter edit**. A `description` here is
   long prose, and a colon-space inside an unquoted value parses as a nested
   mapping — the file stops being a skill and nothing about it looks wrong when
   read. That defect is on record from 2026-07-30, in `llm-default-traps`.
5. Re-run `npm run tokens:frontmatter` and compare against the table above.

**~~Unmeasurable half, and it is the real risk.~~ Measured 2026-08-02 — see
[firing-harness.md](firing-harness.md).** When this was written, nothing here tested
whether a shortened description still fires the skill on the cases it should, and
**a description that saves 200 tokens per session and stops a skill firing has cost
the consumer the entire skill**. `npm run firing --against <ref>` now runs both
frontmatter versions over the same prompts and reports the rate. The advice below
to shorten one and live with it survives the measurement — the harness costs money
and needs repeats to say anything — but *live with it* is no longer the only
instrument.

### Done 2026-08-02 — one of the four, and the other three deliberately not

`ai-maintainer-principles`, the longest at 360, is now **277**; frontmatter across
the set 4,466 → 4,383. What was cut is the explanatory half of each of the twelve
enumerated directives — *startup-loud magic is acceptable while runtime-silent
magic is banned, any correctness requirement needing whole-program reasoning must
be designed out rather than documented* became *startup-loud magic allowed and
runtime-silent magic banned, whole-program reasoning designed out*. What went is
mostly the grammar around the hook words. The `Load before …` trigger list is
untouched, verbatim, because that is what makes the skill fire at all.

**Correction, 2026-08-02: this paragraph said "every hook word survives" and that
was false.** A word-level diff of the two descriptions — 45 words dropped — finds
four that are not grammar: **`stress test`, `exit ladder`, `dialect`, `drift`**.
Each situation is still named in the untouched trigger clause (*code subtle enough
to need a safety argument*, *adopting a framework, database, managed service or
vendor API*, *introducing a second way to do something the repo already does*), so
the loss is vocabulary surface rather than situation surface — but the sentence as
written was a claim about the diff, made without running one. **The compression
method below tells the next person to keep every distinctive token, and the pass
that wrote it did not.** `backend-stack` lost `census`, `enforcement-host`,
`grounds` and `list`; `enforcement` and `hosts` survive in its opening clause.

**Neither loss cost a firing**, measured the same day at 16 sessions per variant:
[firing-harness.md](firing-harness.md).

**`primary-keys` 358, `business-numbering` 306 and `guardrails-toolchain` 300 were
left alone, and that is the finding rather than an omission.** The paragraph above
this one says to shorten one, live with it, then shorten the next — and *live with
it* means real sessions where the skill either fires or does not. **A session that
edits all four learns nothing from any of them**, because nothing here observes
firing and a later miss could not be attributed to one edit. The remaining three
are cheap and the method is written down; what they need is use between them, not
another pass.

**The compression method, for whoever takes the next one:** keep every
identifier-shaped and distinctive token in the enumeration, drop the clause that
explains it, keep the trigger list byte-for-byte. The body carries the explanation
in full the moment the skill fires — that is the whole argument for the cut.

## 4. `Wiring the gates` → a `gates.md` resource file — closed, two skills moved

**Finding, measured 2026-08-02:** twelve skills carry a `Wiring the gates` section,
7,991 tokens in total. Largest: `async-handoff-java` 1,711 (12% of its body),
`caching-java` 886 (14%), `java-backend-rules` 729, `java-backend-observability`
718, `java-backend-api` 699, `money-java` 638.

**Weaker case than items 1 and 2, and it should be treated as such.** This is
operative text, not evidence. What makes it a candidate is that it is a **per-repo
one-time setup ordering** — `async-handoff-java` opens its section saying *run once
per repo, in the PR that lands the first async handoff* — and that it re-enumerates
rule ids whose checks are already stated beside each directive.

**Procedure:**

1. **Only where the section exceeds ~800 tokens.** Below that the pointer and the
   heading cost most of what the move saves. That is `async-handoff-java` and
   `caching-java` today; re-measure before extending the list.
2. Move the numbered wiring order into `skills/<name>/gates.md`.
3. **Keep inline:** the sentence that says an unwired gate is a rule described as
   enforced that is not, and the pointer to `gates.md`. The pointer must be a
   relative link inside the skill dir.
4. `gates.md` is a resource file, so it is **counted by `npm run tokens`** — the
   saving only materialises for the agent that never opens it, and the report will
   show the tokens moving from the `SKILL.md` column to the `other` column rather
   than disappearing. **Read the `SKILL.md` column for this item, not the total.**
5. Run `npm run gates` — the pointer check verifies the link resolves inside the
   skill dir and that every rule id cited in `gates.md` is one this set defines.

### Done 2026-08-02 — the two skills over the threshold, and nothing else

`async-handoff-java` 1,711 and `caching-java` 886 moved to
`skills/<name>/gates.md`. **Read the `SKILL.md` column**: those two bodies went
11,420 → 9,786 and 5,049 → 4,236, and the set's directive-text column 153,355 →
150,918. The `npm run tokens` **total went up**, 163,541 → 163,939, because the two
resource files carry an intro each and the total counts them — exactly what step 4
says to expect, and the reason this item is weaker than the ones above it.

**No third skill was moved.** `java-backend-rules` 729, `java-backend-observability`
718, `java-backend-api` 699, `money-java` 638 and `primary-keys` 547 are all under
the ~800 floor, where the heading and the pointer eat most of what the move saves.
The floor held on re-measurement rather than being taken on trust.

**One relative pointer broke in each file and both were the same sentence:** *see
named gaps below*, which stopped being below the moment the list left the body.
Both now read *see Named gaps in [SKILL.md](SKILL.md)*.

**`gates.md` is a new resource-file kind, and four files enumerate those.**
`README.md` twice, `CLAUDE.md` once, and the header comments of
`scripts/token-count.mjs`, `scripts/frontmatter-tokens.mjs` and
`scripts/token-sections.mjs` — each listed `evidence.md`, `api.md`, `storage.md`,
`shapes.md` and would have read as exhaustive. All updated. **A new file type is a
sweep, not just a file.**

**Item 4 is closed.**

## 5. The marker definition block — attempted 2026-08-02, measured, rejected

**Re-measured 2026-08-02 after item 1's three moves**, with
`npm run tokens:sections -- --repeated`: the `Markers, dates, and what they mean`
section runs to 8,692 tokens across 18 skills, and the separate *marker ceiling*
sections add 2,101 over five plus 1,460 over three. **On that number this looked
like the largest row on the list**, which is why it was done next — and the number
is real but does not mean what it was read to mean. See the attempt below.

Confidence markers, enforcement markers and the lapse rule are restated in full in
every skill. `java-backend-rules` spends 1,503 tokens — 15% of its body — on its
*marker ceiling* plus its *Markers, dates* tail.

**This cannot be fixed by cross-linking, and the reason is structural.** The skill
dir is the whole world its consumer has: a repo installing `caching-java` alone has
no `tech-decision-research` to link to. The duplication is deliberate and correct.

**Procedure — compress, never delete:**

1. Write one canonical short form of the four confidence markers, the three
   enforcement markers and the lapse rule. Three or four lines.
2. Substitute it into each skill **by diffing against the marker definitions
   published in `tech-decision-research` and `enforceable-rules`**, which own that
   vocabulary. Never by rewriting from the phrase — *marker words leak into prose*
   is a recorded defect class, and glossing a marker from memory is how it happens.
3. **The per-skill *marker ceiling* paragraphs are not boilerplate and do not get
   compressed.** They say where a particular skill's evidence is uneven and why one
   date's *confirmed* means something different from another's. That is
   skill-specific directive-adjacent text.
4. It was listed last on an expectation of a modest saving.

### Attempted and rejected 2026-08-02 — the canonical block is bigger than what it replaces

**Written, substituted into eight skills, measured, reverted.** A canonical block
covering all four confidence markers, all three enforcement markers and the lapse
rule was substituted into `async-handoff`, `async-handoff-shapes`, `caching`,
`money`, `money-storage`, `java-backend-rules`, `java-backend-api` and
`java-backend-observability`. `npm run tokens` went **up**, 170,508 → 170,811, and
**every one of the eight got larger.** A second, tighter wording — clause
fragments rather than sentences — was then tried on the most verbose of them,
`java-backend-observability`, and saved **five tokens**.

**Why the item was wrong.** Two reasons, and both are visible only after the
measurement:

- **These definitions are already at the floor.** They are written in the
  compressed register the set uses for directive text, and most run three or four
  clauses. There is no boilerplate to squeeze — the canonical block was longer
  because it was written in full English.
- **Uniformity costs tokens.** A canonical block defines all four confidence
  markers and all three enforcement markers; several skills define only the ones
  they use — `money-api` two, `money-storage` three, `llm-default-traps` its own
  three plus the local `recorded` extension. Substituting a complete block adds
  definitions of markers those skills never carry.

**What the 8,692 tokens actually are**, having read all eighteen sections: the
per-skill **marker ceiling** — which pass ran, what it skipped, which directives
carry which marker and why — plus the dates table, the lapse sentence, the pointer
to `evidence.md`, and in six skills a claim table (item 1). **Step 3 above already
said the ceilings do not get compressed.** With them excluded, what remained was
never 8,692 tokens; it is the few hundred this attempt failed to save.

**Closed. Nothing is owed here** — not a deferral, a measured negative. The
`Markers, dates, and what they mean` section stays the size it is, and the way to
shrink it is item 1's remaining six claim tables, not the definitions.

## Checked negatives — 2026-08-02

- **No verbatim duplication between a neutral skill and its Java sibling.** Zero
  identical lines over 60 characters in all three pairs: `async-handoff` against
  `async-handoff-java`, `caching` against `caching-java`, `money` against
  `money-java`. The write-once rule holds across the stack split. Re-run with
  `comm -12` over the sorted long lines of each pair.
- **`Composite shapes` (9,543 tokens over 8 skills) and `Named gaps` (7,880 over
  12) were examined and left alone.** Both are directive: a composite-shape entry
  is a verdict on a combination the directives do not separately decide, and a
  named gap tells an agent where the checks do not reach. Removing either makes the
  skill quietly wrong rather than shorter.

## What this file does not decide

- **Whether any of it is waste.** Every figure measures size. A long rule set can
  be exactly as long as it needs to be, and no directive here is judged redundant
  on its token count.
- **What a consumer actually pays.** The 175,380 total is every skill installed and
  every one firing. Nobody installs all twenty.
- **The true Claude count.** `o200k_base` is a different tokenizer; the ranking is
  the usable part, not the absolute number.
- ~~**Whether a shortened description still fires its skill.** Item 3 has no check,
  and that is the one place in this file where the fix can cost more than it saves.~~
  **Closed 2026-08-02**: `npm run firing` does decide it, at $0.115 a session and
  only with repeats behind it. What it decided about item 3's one edit, and the
  worse thing it found while deciding, are in [firing-harness.md](firing-harness.md).
- **Anything about `evidence.md` size.** It is excluded by design and unmeasured —
  which is the premise items 1, 2 and 4 rest on, and the reason those moves are
  free rather than merely cheap.
