# Decomposition — provenance and the two questions

*Extracted from `CLAUDE.md` 2026-08-02, unedited except that cross-section pointers became file links. Where older text says "this file", it means the project record, which was one file then.*

Corpus deleted 2026-08-01. Table below = provenance only; sources named, no file to open.

**Table = provenance, and history since 2026-08-01.** Sources named, no file to open; line ranges that used to anchor each row deleted with them.

| Skill | Drawn from |
| ----- | ---------- |
| `java-backend-rules`, `java-backend-api`, `java-backend-observability` | Java-backend pack paste text minus its money, cache and broker sections, already converted; evidence + dates from that pack evidence notes under same eight `###` headings, plus its rejected-alternatives + re-open-trigger sections. Split in [the Java-backend history](java-backend.md) |
| `llm-default-traps` | agent-traps pack paste text; evidence from that pack evidence notes |
| `money`, `money-api`, `money-storage`, `money-java` | money-grade source + money section of Java-backend paste text — per-skill split + evidence map in [the money history](money.md) |
| `caching`, `caching-java` | cache-discipline source + cache section of Java-backend paste text; Java evidence from that pack evidence notes under `Cache discipline`. Split in [the caching history](caching.md) |
| `async-handoff`, `async-handoff-shapes`, `async-handoff-java` | event-broker-discipline source + broker section of Java-backend paste text; Java evidence from that pack evidence notes under `Event broker discipline`. Split in [the async-handoff history](async-handoff.md) |
| `tech-decision-research` | research protocol, its framing / panel / refutation / dating / re-verification sections. Its confidence markers land here; corpus README duplicate definition of same four not carried twice. Split in [the method-skills history](method-skills.md) |
| `enforceable-rules` | corpus README design principles + premise-specificity test; portable ship checks from research protocol; plus that README *Markers* — **enforcement** markers + **status tier** only — and its Anatomy tripwire, which table no assign. Split in [the method-skills history](method-skills.md) |

**What became no skill**, recorded so absence no read as oversight:

- Corpus bookkeeping — pack roster, shipped-date mirror, audits-owed backlog, harvest map, candidate list, sunset clock; corpus governance. These maintain corpus; not capability anyone install. **Two of them outlive it**: harvest map + candidate list salvaged into [BACKLOG.md](BACKLOG.md), audits-owed backlog re-keyed there from files to skills.
- Six-step adoption procedure + everything around `.specify/memory/constitution.md`. Machinery never in this repo. **Narrowed 2026-07-30**: two steps generalise and `enforceable-rules` carry them — re-verify dated facts at adoption not on calendar, and wire checks in same change, unwired check marked deferred and **never described as enforced**. Stayed out: every step naming file in that scaffold.
- Pack-versus-source distinction itself + roster of which is which. Load-bearing inside corpus — why some rules live under stable ids and never pasted — but fact about how *that* corpus filed. `enforceable-rules` carry only what generalise: prefer one owner, and where duplication deliberate, one index only thing that catch drift.

**Skill dir = whole world its consumer have.** Every link in skill resolve inside that dir or absolute URL. Rule used to run: text carried verbatim copy byte-identical and diff = gate; text rewritten, rewritten wholesale — no half-copies, which diff cannot check and reader cannot trust. **Wholesale half survive; diff half no.** Skills rewrote nearly everything, but few phrases did ride over verbatim — `C-14` Java wording, one re-open trigger in `java-backend-rules` — and other side of that diff deleted 2026-08-01, so nothing can check them again.

**Two questions open per skill, not once for set.** Decided as each skill authored, answer recorded with that skill — directive set of nine dependency picks and one of 149 platform rules have no reason to answer same way:

- Whether directive ship with *kind* of check it need and tool left to adopting repo, or appear only where tool can be named. Decide how much of money skills, `caching`, `async-handoff` exist outside `java-backend-rules`.
- Whether skill instruct agent directly, or its job = write rules file consumer repo commit.

**Both answered for money family and caching family** (2026-07-30 — [the money history](money.md), [the caching history](caching.md)), and **both families answered same way**. Q1: directive ship with check *kind* in language-neutral skill, tool named in per-stack skill → each directive text exist exactly once. Q2: skill instruct agent, stack skill additionally carry one-time section that wire build gates in.

**All three cross-stack families answered identical, third confirmed it not merely inherit** (2026-07-30 — [the async-handoff history](async-handoff.md)). Settled by shape all three share: portable directive set whose enforcement per stack. **Rule now closed for cross-stack sources, cuz no fourth one.** Skill drawn from *pack* have no such split and not covered. **Both packs confirmed that on authoring; rule now closed for them too, cuz no third pack:**

- **`llm-default-traps`** (2026-07-30) shipped as **one** skill naming both check kind and tool in one file. [the llm-default-traps history](llm-default-traps.md) record two grounds beyond this one.
- **Java-backend family** (2026-07-30) shipped as **three** skills — not counter-example: **split by what agent doing, not neutral-versus-stack.** All three name tools, cuz pack *is* stack, no sibling to defer tool to. [the Java-backend history](java-backend.md) record consequence that bit — stack skill with no neutral sibling still hedge tool names out of habit, twelve did.

**Two corpus-derived skills answered Q1 third way; this close both questions for every row of table** (2026-07-30 — [the method-skills history](method-skills.md)). Neither neutral-versus-stack, neither pack. **Subject = process not code, so most directives have no build gate at all and cannot get one** — check = written artifact whose absence visible. Both say so at top not hedge tool name; `tech-decision-research` have no `## Wiring the gates` section, cuz nothing to wire. **Not first skill in set without one — that claim written here and copied into skill, both false**: six neutral skills (`money`, `money-api`, `money-storage`, `caching`, `async-handoff`, `async-handoff-shapes`) carry no such section either, cuz their gates real and stack sibling wire them. New here: no sibling + no gate to defer, which skill now say. `enforceable-rules` have one, hold two checks that genuinely can mechanise. Q2 both answer as everything else: instruct agent. **Nothing in corpus left to raise either question again.**
