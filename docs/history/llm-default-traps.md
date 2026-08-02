# The `llm-default-traps` skill

*Extracted from `CLAUDE.md` 2026-08-02, unedited except that cross-section pointers became file links. Where older text says "this file", it means the project record, which was one file then.*


Authored 2026-07-30, fourth of five, one pass. Two files:

```
skills/llm-default-traps/  SKILL.md  evidence.md   nine directives, no ids
```

**First pack-derived skill, first single-skill conversion, first skill here with no rule ids.** Listed by `npm run check`. Drawn from the agent-traps paste text (53 lines, nine directives) with evidence from the agent-traps pack evidence notes (five dated notes) + its re-open triggers.

### What was forced by the three precedents

- **Both open questions from [the decomposition record](decomposition.md) answered as every family answered**: instruct agent directly, carry one-time `## Wiring the gates` section, cuz gate = what catch *next* agent.
- **Marker + date inline on every directive**, evidence one hop away — sources, do-not-cite list, re-open triggers, what skill no carry.
- **Lapse rule stated with date** (`review-by` **2027-01-24**), marker ceiling stated near top not only in `evidence.md`.
- **No `P-n`, no `B-n`, no `DECISIONS.md`, no reference into corpus, no link leaving skill dir.**
- **Decision Trace glossed**, per async-handoff review finding that consuming repo may have no such document.

### What this skill decided that no family did

1. **One skill, no neutral/stack split, and [the decomposition record](decomposition.md) predicted this correct.** Split rule closed for cross-stack sources and explicitly no cover pack. Two further grounds: five JVM directives = **dependency + tooling picks not service-code rules**, so bind Java library, CLI or batch job as much as backend — `-java` sibling would carry wrong condition — and pack have no source with per-stack instantiation to defer tool to. JVM group ship as conditioned section, way source text already split it.
2. **No rule ids, first skill in set without them.** Corpus assign ids only to *sources*; pack have none to inherit, so ids here would need invent, making this skill definition of record for numbering corpus no have. Decisive ground = cross-family reference style caching settled — **prefer skill name over id, cuz id resolve for repo that installed skill and dangle for one that no** — and three stack skills need point at one rule here. They point by skill name plus subject. Each directive get `###` heading instead, durable anchor id would have been.
3. **It name both check kind and tool, in one file, split by group.** Any-stack gates named by *kind* with tool left to ecosystem; JVM gates name maven-enforcer + Error Prone. Every other skill here put those two halves in two skills. No second file to put tool in, and invent one = split rejected in point 1.
4. **Marker ceiling inverted.** `money-storage` + `caching` open by warning markers weaker than they look. Here most claims *confirmed* — three refutation votes against primary sources — making this only skill in set not predominantly convention. So top-of-file note say markers run *other* way and name three exceptions: general injection-surface rule = convention with one instance behind it, scanner-compromise record dated and must re-verify at adoption, and slopsquatting *threat* confirmed while lockfile-and-plan-gate *response* = this org convention.
5. **Growth tripwire convert into two obligations not one.** Source own tripwire: newly found trap added to pack with date — its only growth path. Installed skill not file consumer edit, so skill require repo **record new trap in own rules at moment found** *and* **report it back**, and say plainly nothing automate second. First tripwire in set that = maintenance path not arming mechanism, and **`M-29` / `C-16` / `E-28` shape not needed**: plan-gate obligation already directive in source text ("a new dependency appears in the plan's Decision Trace, never silently in a diff"), so native here not conversion artifact.
6. **"Silence about a trap is not evidence the trap is absent"** ship as top-level statement not named gap, cuz incompleteness = property of whole list not any rule in it.

### The jqwik pin — settled, and what the sweep changed

**This skill now owner of record.** Corpus own answer decided it: the Java-backend pack evidence notes record caveat *moved to agent-traps pack* precisely cuz cross-cutting, and all three stack skills already said pin not their rule. Seven edits across four published files:

- **`money-java/SKILL.md`** — `M-24` entry, wiring step 4, evidence table row.
- **`caching-java/SKILL.md`** — wiring record skipped-item bullet, named gap 6.
- **`async-handoff-java/SKILL.md`** — wiring record skipped-item bullet, named gap 7.

**Version removed from `money-java`, one consequence to know.** Before, repo installing only money skills had pin; now no stack skill state it, all three name `llm-default-traps` as owner, all three carry same fallback — if that skill not installed, pin = repo own to state and no skill here supply it. Two grounds. Repo own rule, already stated twice by `caching-java` + `async-handoff-java`: pin stated in *N* skills drift in *N*−1; and `llm-default-traps` bind **every** agent-built repo regardless of stack, so baseline not optional companion. Alternative — leave value in `money-java` too — exactly two-copy drift those two skills refused to create.

**Constraint this file set** ("whatever it decides must not leave a repo installing one family and not the others unpinned") **met by making install instruction loud in all three and stating fallback in all three.** Not met for repo that ignore instruction — but that outcome now **symmetric across three and stated in each**, where before silently true for two and silently false for third.

**Inside `llm-default-traps` version appear twice, doing two jobs**: directive state ceiling, `evidence.md` state release date of clause-free version = *why* that ceiling. Wiring step deliberately point back at directive not restate number.

### The interlock that only partly resolved — and the new lesson

Two caching sentences — one in `caching/SKILL.md`, one in `caching-java` — said unloggable-domain-type rule belong to "a platform rule set not published in this skill set". This skill publish **tool ban** (Error Prone, never ArchUnit) + erasure ground behind it; **rule itself** = platform Observability rule, unwritten at time. So both sentences **narrowed, not resolved**: named `llm-default-traps` as carrying ban + ground, kept saying domain-type rule unpublished.

**Lesson: publish-obliges-sweep rule need second step — check what new skill actually publish against what old sentence actually claimed.** Three previous publishes replaced such sentences wholesale; first where wholesale replacement would have been **false**. Other two "not published in this skill set" sentences in caching family about telemetry disposability + `rebuildable-cache premise` collision; both read and correctly left alone.

**Both halves resolved later same day**, when `java-backend-observability` authored ([the Java-backend history](java-backend.md)). Domain-type rule now published there, two caching sentences + this skill two matching ones rewritten to name it — each stating why ban stay in `llm-default-traps` not move, since erasure trap bind every JVM repo while that skill bind one backend stack — and **two sentences correctly left alone rewritten too**, cuz that publish resolved telemetry-disposability half as well. **Lesson survive own resolution:** narrowing right call at time, and sentences right to leave alone were right for reason that then changed. Nothing check either step.

### Still open for this skill

- **Trap list grow only when someone notice.** Stated as first named gap, not closable.
- **Registry verification have no host** — convention, agent state it done. First line of defence against one *confirmed* threat in set and least enforced rule in it. Green lockfile gate not registry verification, and skill say so where it would misread.
- **Injection-surface rule generalise from single case.** Second confirmed instance promote it from convention and also first evidence about how often this happen.
- **Any-stack version-ceiling mechanism named by kind only**, = uninstantiated-stack question in mildest form: lockfile gates + action pin-checks off shelf in every major ecosystem, ceilings not. Repo finding no off-the-shelf host for one of three any-stack gates must record which — those records = raw material per-ecosystem section would be authored from.
- **jqwik successor evaluation never run.** Re-open trigger carried from 2026-07-21, and **four skills here now depend on library**, so evaluation worth more than version bump.
- **The agent-traps pack gain no row and need none; this conversion first that does *not* hit corpus-editing conflict** money + async-handoff left open. That conflict about writing sentence into *source* instantiation table; **pack have no such table**, so nothing to write and nothing to decide. Conflict still stand for the money-grade source instantiation table + the event-broker-discipline source instantiation table.
- ~~**No adversarial review has been run on this skill.**~~ **Run 2026-07-30 — see *The adversarial review* below.** What bullet used to say still hold as background: each of three families reviews found content defects in files authoring pass already called clean, and this skill did too. **Structural sweep clean at authoring and clean again after review**: nine directives each carry check + enforcement marker + date; no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into corpus; only two links = `SKILL.md` ↔ `evidence.md`; ten skills listed by `npm run check`. **Two counting errors caught during authoring by re-deriving not re-reading** — "seven of the nine claims are confirmed" (confirmed set neither seven nor nine; sentence now stated by exception with no count) and "the four any-stack gates" against "one of these three" three lines later. Fifth instance of this failure in repo, **and review found sixth: same "four any-stack gates" phrase, uncorrected, in `evidence.md`.**

### The adversarial review, 2026-07-30

Both files re-read against the agent-traps paste text, the agent-traps pack when-this-applies, evidence and re-open-trigger sections, the corpus README marker + status-tier definitions, three stack skills pointing here. **Structure held**: nine directives each carry check kind + enforcement marker + date; nine directive statements diffed against seed with no clause dropped; no `P-n`, no `B-n`, no `DECISIONS.md`, no reference into corpus, only links `SKILL.md` ↔ `evidence.md`; frontmatter still parsing after description edit and ten skills listed by `npm run check`. Content defects fixed in both files — **deliberately no counted here, since count = failure this very review found for sixth time.** **Five findings generalise:**

- **Fix decayed count in one file no fix its copy in sibling, and repo own record of catching it made that harder to see.** Authoring caught "the four any-stack gates" in `SKILL.md` and *this file* recorded catch; identical phrase sat uncorrected in `evidence.md`, pointing at named gap saying "one of these three". `evidence.md` now **name** them — lockfile gate, pin-check lint, version-ceiling mechanism — and named gap keep "one of these three", cuz there count sit one sentence after enumeration it count. **Sixth instance of counting failure, first where fix note in `CLAUDE.md` read as coverage for file fix never reached.**
- **Cross-family citation carry quantities; those need same verification ids get.** Both files said three stack skills name jqwik "as the check for **one** of their own directives". `money-java` name it for `M-1`, `M-3`, `M-8`, `M-24`; `caching-java` for `C-6`, `C-10`; `async-handoff-java` for `E-7`, `E-13`. Worse, `evidence.md` asserted **"their side was read before this was written"** in same sentence that got number wrong — async-handoff review lesson repeating exactly: **claim to have verified is itself claim to check.**
- **Marker or tier glossed in author own words can invert what it name.** Status tier read "the enforcement shapes have not been run long enough to be production-confirmed", asserting production use; the corpus README define *decided, not yet validated* as **no production use yet**. Gloss must diff against definition, not written from phrase. Same section used **recorded** as third marker value in its table and defined only *confirmed* + *convention* — now defined.
- **Superlative about other skills = count in disguise, and it wrong.** File claimed to be "the only skill in this set that is not predominantly convention". `money-storage` not predominantly convention either — roughly half its directives *primary-source verified* from 2026-07-29 persistence pass. Marker inversion real and worth stating; ranking against nine other files not checkable and gone. It also said exceptions "stated by exception rather than by count" **while counting them**.
- **Conditioned group must be conditioned where premise stated.** Premise section said premise "is the whole of the condition — there is no second half, which is why this skill applies to every agent-built repo regardless of stack", and JVM group dormancy condition arrived 115 lines later. The agent-traps pack when-this-applies section state both together. Python repo reading only premise section told nothing here stack-conditioned = exact reading JVM group exist to prevent.

Rest, no generalise: gap 2 called registry verification defence against "**the** confirmed threat in this set" and "the least enforced rule in it" — two confirmed threat claims exist and two other gaps equally unenforced, so now name slopsquatting and say plainly nothing in any build reach verification; `evidence.md` counted "four skills in this set depend on the library" (three run checks on it, this one pin it — now named not counted); growth-path section opened with "**The source this converts** states its own growth path", consumer-facing pointer at unpublished material = caching review finding — growth rule now stated as this skill own; wiring step 3 said ceiling mechanism have "the jqwik pin **below**" when pin stated above it, and its justification ("the first one is already known") false on every non-JVM stack where mechanism start empty; description + JVM heading called all five JVM rules "dependency and tooling picks" while skill itself say `char[]` directive "bans a **claim** rather than a pick"; two of five re-open triggers = conversion additions not triggers pass wrote down, now marked as such; directive "it is in maintenance mode" had no ground of own — `evidence.md` now say it rest on maintainer *probably*-hedged sentence and that pin no; and `SKILL.md` promised "**Sources** for each" where jqwik entry name no source document, now "the ground behind each claim — with its source where the pass named one".

**Left standing deliberately.** No rule ids (decision 2 hold — three stack skills cite by skill name plus subject, all three resolve); one skill with no neutral/stack split; marker inversion itself = point of top-of-file note; naming Trivy, jqwik, `de.jollyday`, JSR-275, JScience, maven-enforcer, Error Prone; and source blanket claim that **every** trap here = named corpus favourite, loose for registry-verification + injection-surface rules — loser there = habit not package — but source own sentence and hold for all nine on reading that rejected default named inline.


## Where it stood before authoring


**Authored 2026-07-30, fourth of five — this subsection superseded by [the llm-default-traps history](llm-default-traps.md)** = record. It used to hold plan: skill instruct agent directly, no directive check-kind-only, three open questions with recommendation each. **All three recommendations accepted on authoring, none overturned** — five JVM-only directives stayed in this skill as group conditioned on JVM repos, each directive carry marker + date inline with evidence one hop away, name `llm-default-traps` kept. Reasons in new section; no re-derive from here.

