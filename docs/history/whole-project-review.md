# The whole-project review, 2026-07-31

*Extracted from `CLAUDE.md` 2026-08-02, unedited except that cross-section pointers became file links. Where older text says "this file", it means the project record, which was one file then.*


First review whose unit = repository not family, run day after Milestone 1 closed. **Every structural invariant this file claim re-checked by script and all hold**: 95 directive ids (`M-1` … `M-43`, `C-1` … `C-16`, `E-1` … `E-36`) each defined exactly once as `**id — ` directive and each carry check kind + marker + date; every `M-n`, `C-n`, `E-n` reference resolving to defined id; every id keyed in matching `-java` skill with none missing; no `P-n`, no `B-n`, no `DECISIONS.md`, no `ci/check_packs.py`, no `.specify`, no `speckit`, no reference into corpus; every relative link resolving inside own skill dir; fifteen skills listed by `npm run check`, matching `ls skills/`.

**Token-placement check finally run as check not described**, over all four corpus source regions against converted skills. Close to clean — paste-text identifier tokens present, and handful of absentees = corpus filenames, example type name, detail conversion dropped deliberately (concatenated jOOQ method list whose parts each named, three *retired* Kafka Streams drop-metric names superseded by `dropped-records` metric evidence do carry). **That check now pass = finding**: Java-backend reviews twelve + twenty-three hits real and fixed, nothing re-hedged since.

**Three defects found and fixed, in three files.** Two generalise:

- **Eleventh instance of counting failure, first found by diffing count against *same claim in sibling skill*.** `caching/SKILL.md` *What to do when this skill fires* called catalog "machinery **four** other rules read". `C-15` itself name five readers, and `caching-java` `C-15` entry name same five. So count contradicted two enumerations, one 300 lines below it in own file. Now name `C-7`, `C-8`, `C-10`, `C-13`, `C-14` and state no number. **Mechanical form worth keeping and cheap: for every sentence carrying number word and two or more backticked ids, compare number against ids.** Twenty-line script over all thirty files; surfaced this one and produced only range-notation noise otherwise. Note what it does *not* catch — sibling `async-handoff` sentence ("machinery eleven other rules read") correct and pass for same reason caching one failed: check need ids beside count, and count with no ids beside it still invisible.
- **Pointer can be false against file it sit in.** `async-handoff-java/shapes.md` said three rules worded around Java fact "and all three are in this file", then named third as `E-32` + `E-33` **in `SKILL.md`** three words later. Two failures in one sentence: self-contradicting placement claim, and count of three over four rules cuz one item = pair. Previous reviews follow-the-pointer finding always about pointer into *another* skill; this one refuted by own parenthesis. Now stated by name with no count and with split said plainly.

Third no generalise but largest: **`README.md` still described four-skill repository.** Listed only money family, said "`npm run check` lists four skills as of 2026-07-30", summarised set as forty-three rules. Eleven skills shipped after it written and nothing swept it, cuz every publish sweep this file record was sweep of *skills* for sentences about other skills — repository own front page never in set. All fifteen now in its table, grouped by family, and **count sentence gone**: it say compare `npm run check` against `ls skills/`, what this file already tell agent to do. **General lesson: `README.md` = consumer-facing file carrying claims about skills, so inside publish-obliges-a-sweep rule and never treated that way.**

**What this review no find, stated so silence no read as coverage.** No cross-family citation verified by re-reading every cited rule in defining file — sample checked (`E-26` reader list, `M-17` scope, float ban five layers, `C-9`/`E-5` post-commit collision, contract-tool non-naming, `@KafkaListener` meta-annotation pointer) all held. Marker prose, superlatives, evidence-row provenance spot-checked not swept. **And conversion invariants still enforced by nothing**: this review, like eight before it, = scratch scripts plus reading, and not one of them live in repo.


## The token-placement check, 2026-08-02

**First run of this check over any published skill.** It is one of the two `enforceable-rules` publishes from this skill set's own authoring, and the one with a mechanical form — which is what made its absence hard to defend.

### What could and could not be run

**The forward form cannot be run for any corpus-derived skill.** It requires extracting identifier-shaped tokens from the *source material* and requiring each per directive; the corpus was deleted 2026-08-01, so there is no source to extract from. **This is the deletion's recorded cost arriving in practice** — `CLAUDE.md` said the token-placement check would have no source input, and it now has an instance rather than a prediction.

Two directions ran instead, both scripted and both re-runnable:

1. **Evidence-to-directive token diff, per skill.** Extract backticked identifiers, RFC/CVE/JSR/ISO numbers from each `evidence.md`, report those absent from the `SKILL.md` beside it. **Mostly noise by design** — URLs, page citations and source quotes belong one hop away, which is the split the repo chose. The signal is in tokens naming a *subject a directive governs*.
2. **A scan for anonymised subjects** — "the engine", "one framework", "a library", "the vendor" — filtered against what siblings already name.

### The yield, dated so it is re-runnable rather than cited

**Two described-not-named subjects in published, always-loaded directive text:**

- **`M-10`** said *an exact decimal type* and *never vendor "money" column type*. **A lint author cannot pattern-match either phrase.** Now names `NUMERIC(p,s)` and its `DECIMAL` synonym, and names the banned vendor types — PostgreSQL's `money`, SQL Server's `money` and `smallmoney` — both of which `evidence.md` already carried with the vendor's own warning behind each. The floating-point spellings are supplied by the conversion and marked as such, because no source named them.
- **`M-18`** said *the conditional-request precondition* and named its two status codes while leaving the header described. It is **`If-Match`** with a strong entity tag, and `java-backend-api` names it on both sides — so the two skills now spell it the same way.

**And three in the same session's own additions, which is the finding that generalises.** Layer clauses written hours earlier described **Caffeine's `refreshAfterWrite`**, **Alertmanager's silences, inhibition rules, routes and receivers**, and **GitHub Actions disabling a scheduled workflow after repository inactivity** — each described where the writer knew the name and where a sibling file already carried it. **New prose is where this defect is born.** The check has to run over the pass that just finished, not only over what that pass inherited; recorded in `CLAUDE.md` as a defect class.

### What is still owed

**The enumeration check has not been run over any published skill**, and it is now the only one of the five in that position. This session created candidates for it faster than any previous one: every check clause added carries counts, and two near-superlatives were caught and removed during writing rather than by a later pass.

## The enumeration check, 2026-08-02 — last of the five

**The final incompleteness check to be run over published skills**, and the one `enforceable-rules` calls the most reproducible defect in the whole effort. Three passes: the mechanised half (number words beside two or more cited ids), a superlative scan across `skills/`, and a pass over **the same session's own additions**, which the token-placement run hours earlier had just shown to be where these defects are born.

### What it found

- **One wrong count in published directive text, written the same day.** A `primary-keys` layer clause said *two of the three cases above hand id generation to code this repo does not compile*. **It is one.** The idempotent-create endpoint takes an id from a client; the escape-hatch store is a case where **this application is itself the client that generates**, and batch inserts generate here too. Corrected in place with the miscount stated rather than silently repaired.
- **Three cross-document superlatives, all true when checked, none checkable by a reader.** `money-java` and `enforceable-rules` both said `money-java` is *alone among the stack skills* in carrying no named-gaps section; `ai-maintainer-principles` said *no skill in this set carry* a formatter row. **Both claims survived their greps** — `grep -l "^## Named gaps" skills/*/SKILL.md`, and a search for `Spotless` and `palantir-java-format`. **Being true is not the defect.** The enumeration check's point is that a reader has no way to tell a checked superlative from an unchecked one, so all three now carry the command and the date under the check's own stated exception: where the count *is* the evidence, publish it as a re-runnable check.
- **A count-versus-category mismatch in a clause written this session.** *Two published rules already depend on this ban reaching further than it does* then named one rule (`async-handoff` `E-23`) and one class (regenerate-and-diff gates). Rewritten to name both for what they are.

### The part worth carrying forward

**The correction to that last one existed in three files** — the skill, `BACKLOG.md`, and this history's `java-backend` sibling — because the same finding had been written into each. **Fixing the skill and stopping would have been the repo's worst recorded shape**, and the only reason it was caught is that the check was run over the session's own diff rather than only over inherited text.

**All five incompleteness checks have now been run.** None of them is wired anywhere: every pass recorded across these files was scratch scripts plus reading, and that has not changed.

## Auditing this session's own cross-skill claims, 2026-08-02

**Run because the rate demanded it**: of the cross-skill claims spot-checked earlier in the session, two of three had been wrong when first written. Every claim this session added about another file was re-checked against that file.

**Most held.** The ones verified at the time they were written — `money-storage` `M-35`'s two-part form, `async-handoff` `E-2`'s meta-annotation clause, `E-21`'s timestamp ban, `C-6`'s cache key, `E-6`'s transaction handle, `java-backend-api`'s `If-Match` — were verified because the file was opened then. **The ones that failed were the ones written from memory of a file rather than from a read of it**, without exception.

### Duplicated directive text, and the sentence claiming there was none

`business-numbering`'s authoring pass recorded that `primary-keys` had *four sentences* of numbering material, **all pointed at rather than restated**. Opening the file showed six things, **two of them full directives the new skill also carries**: *numbers are immutable, never reused, never reassigned, stored exactly as issued*, and *parsing meaning out of a number is banned*.

**The claim was a count of another document's contents, made without opening it — inside a sentence describing how carefully the harvest had avoided exactly that.**

Resolved the way the write-once rule prescribes when write-once is not available: **one named owner plus one index.** `business-numbering` is the owner; the index paragraph sits beside the two bullets in `primary-keys`. Deletion was rejected because a repo can install either skill alone and both bans bear on both subjects — the alternative to duplication here is a dangling pointer for half the readers.

**This falsified a claim in `CLAUDE.md` itself**: *each directive's text exists exactly once, which every family did*. Now qualified with the date, the pair, the owner and the index. **Publishing a skill obliges sweeping the project record, not only the sibling skills** — the record makes claims about the set, and a new member can make one false.

### A sweep that greps is not a sweep that reads

The publish-day sweep recorded `primary-keys` as *checked and left alone*. It had grepped for sentences asserting the new material did not exist — the absence-assertion class — and found none, which stands. **It had not read the section it was pointing at.** Grep finds the absence-assertion class; only reading finds the duplication class; **a publish creates both.** Recorded as a defect class in `CLAUDE.md`.

### A dangling pointer in always-loaded directive text

The predicate-check clause added to `money` earlier the same day cited **`BACKLOG.md`** — a repo-internal file **no consumer of the skill has**. The rule it broke is one this set publishes: nothing in directive text may cite material the reader does not have, because a named file that does not resolve reads as *that repo's own*. Rewritten to state the fact — three adjacent exactness domains considered and not shipped — without naming the file. **A grep across `skills/` for repo-internal filenames now returns only `enforceable-rules`' description**, where `CLAUDE.md` names a kind of artifact the consumer writes rather than a file here.
