---
name: ai-maintainer-principles
description: The architecture and process rules a repo commits to because its maintainer is an LLM agent rather than a person — startup-loud magic is acceptable while runtime-silent magic is banned, any correctness requirement needing whole-program reasoning must be designed out rather than documented, operational state lives in the repo or it does not exist, a module is as large as one session can hold and no larger, topology follows the number of independent wills pushing on the codebase rather than the number of services, one idiom is imposed mechanically because a second dialect is a standing drift generator, a human who steers the agent is not a code reviewer and never relaxes a gate, the review substitute is a fresh-context adversarial pass with a committed verdict backed by gates that do not share the author's model, a predecessor system is a capability inventory and never an oracle, retries are zero and quarantine cannot rot, every load-bearing dependency is priced by failure shape with an exit ladder, and a hand-built subtle piece ships with a written safety argument and a dedicated stress test. Carries one repo's worked case, with the products it picked named, and the two re-derivations that repo ran under changed premises. Load before drawing or moving a module boundary, choosing a runtime topology, deciding what a build gate may be relaxed for, adopting a framework whose behaviour is not in the program text, or writing a repo constitution.
---
# Rules for a codebase whose maintainer is an agent

**This skill about decisions that change answer *because* maintainer is an LLM
agent, not a person.** Not how to write a rule — that `enforceable-rules`. Not
which stack — `backend-stack`. Not which gates — `guardrails-toolchain`. This one
about **shape of system those rules bind**: what maintainer can see, how system
cut, what stand in for review, what maintainer able to do alone.

**Two halves.** Directives portable — hold on Go, .NET, TypeScript same way.
Worked case = one repo's decisions, dated **2026-06-11..14**, plus two
re-derivations that repo ran under changed premises. Worked case there as
*evidence directives discriminate*, not template to copy.

## The marker ceiling, before anything else

**Everything here is *convention*.** Source = one org's architecture decision
records, written 2026-06-11..14 by pass that ran adversarial agent panels and
recorded verdicts. **Records carry no per-claim confidence marker and cite no
primary source for any claim in them.** So *convention* is floor, and what
generalise below is reasoning, never measurement.

- **Central claim is *uncertain*, not convention**: that these decisions come out
  different under agent maintainer than under human team. **Nobody built same
  system both ways.** Records argue premise-sensitivity and two of them re-derive
  under a changed axiom — argument, and good one, with no outcome behind it. Marked *uncertain* where it appear.
- **Lapse rule vacuous here, stated not hidden.** Past `review-by` every
  *confirmed* marker read as *convention* with no maintainer action; nothing here
  above convention, so rule demote nothing. Stated cuz every sibling carry
  `review-by` and silence read as omission. **Cost: nothing make this skill's age
  visible.** Conversion date **2026-08-01** — conversion date, not verification
  date.
- **No date invented.** Directive carry date of record that ground it. Where
  directive state something no record wrote in that form, date is conversion date
  and say so.

Status tier: **decided, not yet validated** — researched and decided, **no
production use yet**. One repo build against these; none run long enough to report
whether any of them predicted anything.

## The premise, and the two failure modes under it

**Code written by LLM agents. No human read it line by line.**

Every sibling skill state this premise. Directives here hang on **second half**,
which the records state and no skill had carried as a premise before this one —
`backend-stack`'s evidence file now narrate it as prior art, and that the only other
place it appear:

- **Runtime behaviour absent from program text is invisible to maintainer in
  absolute sense.** Agent simulate framework behaviour from training corpus rather
  than observe it, and **simulation error pass unit test and fail silently in
  production**. Human maintainer read same file and no better off in principle —
  difference is human attach debugger, watch process, ask colleague. Agent's whole
  sensory channel is committed text plus what build print.
- **Context locality is characteristic failure mode.** Maintainer see one file at
  a time. **Any correctness requirement demanding whole-program reasoning degrade
  across sessions** — not once, continuously, cuz every session start over.

Human team drift toward same failures slower and recover from them by talking.
Neither recovery exist here. **Verdict travel exactly as far as premise:** repo
where person read every diff should re-derive most of this and will get different
answers on several.

## What the maintainer cannot see

### Startup-loud magic is acceptable; runtime-silent magic is banned

**Discriminator, not blanket ban. Magic that make app fail to boot is caught by
first integration test, always. Magic that silently change runtime semantics have
no reliable gate.** Constructor wiring resolved at startup, route registration,
typed configuration binding: acceptable, cuz failure is total, immediate and
reproducible in every run. Proxy that skip transaction on self-invocation,
persistence context that flush on read, cache that serve stale value, aspect woven
at load time: banned, cuz failure is partial, conditional and silent.

**This is the allowance half, and it what stop the ban becoming useless.** Repo
that ban "magic" as category ban its own dependency injection, then relax ban
informally, and now nothing is banned. Repo that state discriminator can ban
by mechanism, one by one, with check per mechanism.

**Third branch, and it the one repo skip: accepted runtime trust, priced.** Some
machinery is neither boot-failing nor bannable, cuz hand-rolling replacement is
worse code than trusting library — a security filter chain, an at-least-once event
registry that persist inside caller's transaction. **Those get accepted one at a
time, each with named standing test pinning contract** — kill process between commit
and handler, assert redelivery; test authorization outcome per endpoint rather than
belief that config is right. **Accepted-and-tested, never accepted-and-assumed**;
piece with no such test is runtime-silent wearing an exception.

`enforceable-rules` own the ban half as *No silent runtime behaviour*, with reason
naming mechanisms beat naming category; `java-backend-rules` carry the list for
one stack. **Neither state why the boot-time cousin is fine**, and repo that no
state it will either over-ban or under-ban.

*Check: every accepted piece of framework machinery carry written line saying which
of three classes it in, and each runtime-trust piece name its standing test.
Convention as enforcement for classification — written artifact, absence visible,
cannot catch wrong classification; **off-the-shelf** for the standing tests
themselves. **Convention**, 2026-06-12.*

### Design out any requirement that needs whole-program reasoning

**Where correctness depend on facts spread over files — flush ordering, proxy
reach, cache coherence, lock ordering, initialisation order — requirement is not
documentable. It must be made structurally impossible or accepted as permanent
defect source.** Document it and every session re-derive it from one file, wrong.

**Practical form is question asked before adopting a construct:** to know this
line correct, how many files must be read? Answer above one is design input, not
trivia. Construct whose semantics live at call site survive session boundary;
construct whose semantics live in relationship between a session, an object's
dirty state and a flush point no survive it.

Under human review this cost is real too and pay for itself in expertise that
accumulate in people. **Here nothing accumulate** — every session is first
session — so cost is charged every time and never amortised.

*Check: each rejected construct's record name the whole-program fact it require.
Bespoke and mostly unbuilt — architecture test assert absence of specific named
construct, nothing assert reasoning span. **Convention**, 2026-06-12.*

### Operational state lives in the repo or it does not exist

**Every operational surface — schema, topic, ACL, alert rule, cron, feature flag,
connector config — is committed text the build read, or it is state maintainer
cannot reason about.** State that live only in a broker, a cluster, a dashboard or
a console is state agent no read, no diff and no restore.

Ground is same sensory-channel fact, one layer out: agent asked why production
behave differently from code will read code, find nothing, and conclude code is
right. **Console change is unreviewable by construction**, and unlike silent
runtime behaviour it leave no trace in repo at all.

Consequence to accept openly: infrastructure needing its own out-of-repo control
plane cost more here than its feature list suggest, and that cost belong in the
choice, not in the incident afterward.

*Check: every operational surface have committed artifact and gate that diff it;
surface with no artifact listed as gap. Off-the-shelf per surface — migration
lint, alert-rule test, committed ACL diff. **Convention**, 2026-06-12.*

## How the system is cut

### A module is what one session can hold, and no larger

**Module must be fully understandable — schema, API, invariants, tests — inside
one session's context. Too big to load is as mis-drawn as too small to mean
anything.** Both directions are boundary defects and only one of them get noticed.

This is boundary criterion that human-team literature no have, and it **added
beside the usual ones, never instead of them** — information hiding, bounded
context, one capability, common closure, transactional consistency, exclusive data
ownership, coupling balance. Criterion here rank *loadability*, and it can be
violated by module that pass every other test.

**Relief valve matter more than criterion**, cuz obvious cure is wrong one:
oversized module split into two top-level modules trade loadability problem for
coupling problem, and coupling problem is worse — it permanent. **Cure is named
nested sub-module inside same module**: own table prefix, own API package,
boundary test pinned to it. Sub-module already own its tables and its API, so later
promotion to top level is cheap if named trigger ever fire.

**Names must bind mechanically.** Package name, artifact name, module name one-to-
one, so boundary test key off name with no translation table. Translation table is
one more whole-program fact.

*Check: boundary test assert declared module set and its nesting; module over
budget commit its sub-module map before its build milestone. Off-the-shelf for
boundary test, **convention** for budget itself — nothing measure "fits one
session". **Convention**, 2026-06-12.*

### Count the independent wills, not the services

**Topology question is how many independent wills push on codebase. One will:
in-process boundary unbeatable — coordination cost near zero, consistency free,
cross-module break caught at compile. N wills: network boundary start buying
something real, cuz contracts let teams stop talking.**

**Parallel agents are not N wills.** They share one codebase perfectly, have no
release politics, and benefit maximally from whole-system compile-time checking.
Argument that "AI works like many people, so build like many teams" invert the
conclusion: microservices were invented for human organisation problem — independent
teams that cannot share codebase or deploy cadence, accepting runtime failure as
price of autonomy. **Adopt them for agents and you pay coordination tax of human
teams without having human teams.**

Decisive half is where failure surface. One compiled codebase: cross-module break
fail build before merge, detection instant and free. Separately deployed services:
same break become runtime contract failure between versions, surfacing in an
environment. **Under premise build is the review**, so moving failure off compile
path weaken exact mechanism substituting for reviewer.

What enable parallel work is **enforced ownership boundary, not network boundary**
— typed module API, no cross-module data access, violation fail build. Agents work
those boundaries concurrently in one repo today.

**Direction asymmetric, and that why this decided early:** start as one deployable
and extract on named trigger is routine; start as N and merge back never happen.
So record split trigger and extraction procedure at start, and let trigger fire.

*Check: record state will count and name split triggers with extraction procedure;
boundary tests exist from first commit, cuz they what keep later extraction cheap.
Convention as enforcement — written artifact. **Convention**, 2026-06-12..13.*

### One idiom, imposed mechanically

**Second dialect for same job is standing session-drift generator. One idiom
everywhere is self-stabilizing; boundary between two is not, cuz boundary itself
is whole-program fact each session re-derive.** Two persistence dialects, two error
shapes, two test styles, two formatting conventions — each cost is not the second
idiom, it is the *judgment call about which applies here*, made fresh, differently,
every session.

Human team converge by habit and by reading each other's code. **Neither mechanism
exist here**, so convergence must be mechanical: deterministic zero-configuration
formatter that fail build on unformatted file, and canonical-form rewriting where
ecosystem offer it, so equivalent constructs collapse to one shape before they
accrete.

**This is why a "flexible" convention cost more than a rigid one here** — cost of
rigidity is occasional worse line, and it paid once; cost of flexibility is a
decision re-made every session, and it compound.

*Check: formatter run in build with fail-on-diff, zero per-file configuration;
where two dialects genuinely required, boundary is enforced by test, never by
convention. Off-the-shelf — formatter and canonical-form rewriter both fail a
build; **`guardrails-toolchain` carry the canonical-form rewriter's row and no
formatter row — no skill in this set carry one.** **Convention**, 2026-06-12..13.*

## The review model

### A human who steers the agent is not a code reviewer

**Person who direct agent, read its summaries, accept its demos do *requirements*
review. That never a substitute for a gate, and their presence never a reason to
relax one.**

Trap is specific and it arrive as reasonable sentence: *the owner looked at it, so
relax the gate*. Owner looked at behaviour, spec, demo. **They will not catch a
rounding-mode drift, a swallowed exception, a cache serving stale money any better
than nobody**, cuz they never read the line. Humans add better specs and faster
acceptance. They no add second reader.

**Rule bind hardest exactly when org grow**, cuz that when people appear beside
agent and premise look weaker than it is. Premise is about *line-by-line reading*,
and it hold until somebody actually do it, on every diff, as their job.

`enforceable-rules` state converse from rule-authoring side: repo where human truly
read code may weaken gates, and that repo carry burden of saying so. **This is same
line seen from org side, and pressure comes from here.**

*Check: repo state who read code line by line, by role, and gate relaxation cite
that statement. Convention as enforcement — written artifact, catch omission, cannot
catch wishful claim. **Convention**, 2026-06-13.*

### The review substitute is a fresh-context pass with a committed verdict

**Where no human read code, review substitute is adversarial pass run in fresh
context, given diff, spec and rules and *none of authoring history*, returning
structured verdict committed to repo.** Three properties load-bearing, and dropping
any one make it theatre:

- **Fresh context** — reviewer sharing authoring session share its assumptions and
  ratify its own reasoning.
- **Inputs only** — diff, spec, rule set, defect-class checklist. Authoring
  rationale is exactly what must be re-derived, not read.
- **Committed verdict** — skipped or softened review is invisible unless its output
  is artifact in repo. Verdict in repo make omission a diff.

**Honest limit stated with it, always: reviewer share author's model**, so its
misses correlate with author's misses. Backstops carrying real weight are gates
that **no share that model** — mutation testing that probe whether tests assert
anything, goldens from worked examples a person computed and validated, invariant
suites over real data. **Change on a value-bearing path is done when those pass
*and* verdict is approve** — that conjunction is what the record scope to its money
paths, and widening it past them is this skill's choice, not the record's.

`guardrails-toolchain` own the harder half of same seam — **non-deterministic
reviewer never sole arbiter of mechanical defect class**, and its finding in such
class is trigger to build a gate rather than a disposition. Install it; this
directive only say what positive shape of review substitute is.

*Check: verdict schema committed, verdict file required per change, inputs list
pinned in process document. Bespoke — file presence greppable, reviewer's blindness
not. **Convention**, 2026-06-14.*

### A predecessor system is an inventory, not an oracle

**Old system document what capabilities exist. It never ground truth for what
correct behaviour is, and no test may assert parity with its output.** Oracle is
worked example somebody computed by hand and a person validated.

Passes `enforceable-rules`' *gates need an outside oracle* by letter — predecessor
output *is* outside authoring model — and fail it in substance, cuz **oracle's
authority come from being right, not from being external**. Legacy output encode
every bug nobody found. Under premise, agent that find predecessor will treat it as
specification, cuz it the most specification-shaped artifact available, and
resulting parity fixture lock in behaviour nobody ever chose.

Keep predecessor as capability checklist: what business does, what must be ported,
replaced, or consciously dropped. **Record dropped ones**, else next session
re-import them as gaps.

*Check: no test compare against predecessor output; capability map exist and mark
each item ported, replaced or dropped. Off-the-shelf — absent fixture layer is
greppable. **Convention**, 2026-06-12.*

### Zero retries, and a quarantine that cannot rot

**Test never retried to green. Flaky test quarantined explicitly, in committed file
with owner and expiry, and named set never quarantinable at all** — isolation
probes, money invariants, crash-recovery.

Retry is cheap everywhere and expensive here. **Build is only signal, so retry
convert the signal into noise**, and noise train reader — human or agent — to
disregard the one mechanism substituting for review. Retried flake also hide real
concurrency defect exactly where they cost most.

**Quarantine file must be structurally un-rottable**: entry carry expiry, and build
fail when entry outlive it. Quarantine list with no expiry become permanent
disable list within a quarter, and its green build is a false green
`enforceable-rules` warn is worse than no gate.

*Check: runner configured with zero retries; quarantine file schema-checked, expiry
enforced in build, non-quarantinable set listed by name. Off-the-shelf for retry
setting, bespoke for expiry gate. **Convention**, 2026-06-14.*

## What the maintainer must be able to do alone

### Price the bus factor by failure shape, with an exit ladder

**For every load-bearing dependency, price abandonment once, deliberately, by
*shape* of failure rather than by likelihood — and record exit ladder cheapest step
first, with the trigger that step down it.**

Shape is what maintainer control; likelihood is what nobody know. Compile-time
dependency with committed generated output fail benignly: pinned artifact keep
compiling for years, decay vectors slow and on your own schedule. Runtime framework
in request path no freeze-safe same way. **Two dependencies with identical
maintenance signals can carry opposite risk, and only shape tell them apart.**

Ladder is where premise bite: **steps must be ones an agent can execute**. Freeze
and pin, then fork and apply targeted compatibility patch, then migrate
incrementally behind a seam already in the code. Step requiring a team, a rewrite,
or standing operational judgment is not an exit — it is an outage with a plan
attached.

**Popularity metric mislead and should be named as rejected**, cuz agent reach for
them first: star counts compare badly across ecosystems, and commercial licensing
that fund maintenance is opposite sustainability profile from volunteer project
that abandon when attention move.

**Weakest directive here on premise-specificity, and it say so rather than dress
up.** Pricing dependency risk is ordinary engineering, sensible in any repo. Only
ladder-executability clause turn on the premise — and **that clause is this skill's
addition, not something a research pass wrote or tested**, which its check line
date record. Kept anyway cuz it cheap and fail safe; **read it as *convention* in
the strict sense `enforceable-rules` mean, no as premise-derived rule.**

*Check: each load-bearing dependency's record state failure shape, ladder, and
trigger to step down. Convention as enforcement — written artifact. **Convention**,
2026-06-12, and ladder-executability half **2026-08-01**, conversion-dated
statement of what record's steps were chosen by.*

### A hand-built subtle piece ships with a safety argument and a stress test

**Where repo hand-build something subtle — concurrency control, crash recovery,
gapless counter, retention sweep, compensation logic — piece ship with written
safety argument in its record *and* dedicated stress test. Without both it not
done.**

Build-versus-buy corollary, and it exist cuz **hand-built subtle code is precisely
what an unreviewed agent write most confidently and most wrongly**. Library got
adversarial users; this got one author simulating concurrency in its head.

Safety argument is not a comment. It the enumeration of interleavings, crash points
and failure modes considered, written where next session read it — else next
session re-derive it, differently, from one file.

**Test must be stress-shaped, not example-shaped**: injected crash between commit
and acknowledge, contention at real parallelism, volume above the sweep's cap.
Example test over hand-built concurrency is false green.

*Check: rule list constructs classed subtle; each carry record section and named
test class; meta-test assert every listed construct have both. Bespoke.
**Convention**, 2026-06-12.*

## The worked case — one repo, 2026-06-11..14

**One org's decisions, listed as evidence directives above discriminate. Not
template.** That repo is single multi-tenant financial backend, agent as sole
maintainer, no operations role, no human code reader.

| Decision | Directive it instantiate |
| -------- | ------------------------ |
| Fourteen enforced modules, one deployable, roles selected at startup | *Count the independent wills* |
| Boundary criteria set of eight, last one "fits one session", with nested sub-modules as relief valve — seven such sub-modules declared | *A module is what one session can hold* |
| **jOOQ** chosen for zero runtime-silent machinery; **Hibernate ORM and Spring Data JPA** rejected — even in a stateless profile with no persistence context, no dirty checking, no lazy loading and no cascades — on the four grounds in `evidence.md`, of which the load-bearing pair are corpus gravity toward the banned idioms and the silent `UPDATE` any lapse back into the stateful API reintroduces | *Design out any requirement that needs whole-program reasoning* |
| Constructor injection, Spring MVC route registration and `@ConfigurationProperties` kept as boot-failing; **Spring Security and the Modulith event registry kept as priced runtime trust**, each pinned by a standing test — per-endpoint authorization probes, and a kill-between-commit-and-handler redelivery test | *Startup-loud magic is acceptable*, all three branches |
| `@Transactional` banned; **`DSLContext` not an injectable bean**, reachable only as the lambda parameter of a transaction wrapper, so a query outside a transaction is unwritable rather than merely banned | *Startup-loud / runtime-silent*, with `enforceable-rules`' *unwritable beats banned* |
| **palantir-java-format via Spotless**, zero per-file configuration, `spotless:check` failing the build; **Picnic error-prone-support Refaster rules** rewriting equivalent constructs to one canonical shape on the compile pass | *One idiom, imposed mechanically* |
| Every schema change a committed Flyway migration; alert rules committed with a `promtool` fire-test; no application surface managed from a console | *Operational state lives in the repo* |
| Verification stack declared to *be* the code review; fresh-context adversarial pass with committed verdict; **PIT mutation testing on the money modules**, goldens from hand-computed worked examples, and the ledger invariant suite named as the non-model backstops | *The review substitute* |
| Predecessor system declared capability inventory with no parity fixture layer | *A predecessor system is an inventory* |
| Zero retries, un-rottable quarantine file, named non-quarantinable set | *Zero retries* |
| **jOOQ's** single-maintainer vendor priced once: health signals, failure shape, three-step exit ladder, trigger to step down. **The repo's other load-bearing dependency, Spring, was never priced this way** — so the worked case half-fails the directive it is published under, exactly as its runtime-framework clause predicts | *Price the bus factor by failure shape* |
| Concurrency suite, crash injection, counter contention, sweep volume caps each named as obligation beside the piece they cover | *A hand-built subtle piece* |

### The two counterfactuals, and they change different axioms

**Same repo ran the exercise twice, on two different axioms, and result differ
enough that merging them would misreport both.** Worked case for
premise-specificity, and more useful than decisions themselves, cuz it show *which*
of them premise carry.

**First: many independent teams, each owning one deployable.** Non-authoritative
variant, deliberately kept out of that repo's index, undated. Under it **almost
everything move.** Every module become separately deployed service, so
transactional core split, and record's own heading call that **"the one consequence
that is genuinely forced"** — cross-service posting become orchestrated saga with
holds, deterministic idempotency keys and compensation, plus broker backbone,
schema registry, and service identity as new infrastructure nobody previously
operated. Boundary criterion "fits one session" replaced by team cognitive load.
**What survive: boundaries themselves** — drawn on criteria that hold either way —
and money-on-the-wire rules, which the variant restate on every new transport.

**Second: fourteen human owners, each steering an agent, one deployable kept.**
Scenario analysis inside a note written for management, 2026-06-13. Weaker axiom
change, and it what produce the transferable findings:

- **What no move:** transactional core still inseparable, cuz physics no care who
  maintain it. **No money or data decision move at all.**
- **What appear:** release-cadence conflict, ops burden multiplied across teams of
  one, and **idiom drift as first-order force** — one maintainer hold one idiom
  nearly free; fourteen owners with fourteen agents drift fast, and ban lists plus
  compile-checked catalogs become the only thing keeping codebase one system.
  **Verification stack matter *more* under relaxed premise, not less.**
- **What it conclude:** you would still start where the real repo is and let
  recorded triggers fire. **Decision robust to premise it was not optimised for.**

**Read both as method, not verdict:** change exactly one premise, keep everything
else, re-derive, list what survived. `tech-decision-research` require premises be
recorded with verdict; this is what recording them buy. **And note the two
exercises disagree about the transactional core** — first split it under force,
second no — cuz they changed different axioms. Merging them into one "what
survives" list is exactly the error that make a counterfactual read as reassurance.

## Wiring the gates

Run once, in a repo adopting this skill. Record what got wired and what got skipped
with reason — skipped item with no reason read as done by next session.

1. **Boundary tests from first commit** — declared module set, nesting, allowed call
   direction, no cross-module data access. Cheap now, unaffordable later, and they
   what make extraction cheap if a split trigger ever fire.
2. **Formatter with fail-on-diff, zero per-file configuration**, plus canonical-form
   rewriting where the ecosystem host it.
3. **Zero retries in the test runner**, quarantine file with schema and expiry gate,
   non-quarantinable set listed by name.
4. **Verdict artifact required per change** — schema committed, path fixed, absence
   fail the change.
5. **One committed artifact per operational surface**, each with its diff or lint.
   Surface with no artifact goes on the gap list, named.
6. **Meta-test over the subtle-piece list** — every construct declared subtle have a
   record section and a named stress test, both directions reconciled.
7. **Record, in repo, who read code line by line, by role.** Empty is the honest
   answer in most repos here, and it what every gate relaxation must cite.

**Which of these fail a build off the shelf, stated per step rather than by range:**
boundary tests, the formatter and canonical-form rewriter, the retry setting, the
operational-surface lints, and the absent-fixture grep. **Bespoke:** the quarantine
expiry gate, the verdict-artifact requirement, the subtle-piece meta-test. **Step 7
gates nothing by itself** — it is a written artifact every gate relaxation must
cite.

## Named gaps — where no check reaches

- **"Fits one session" is unmeasured.** No tool report whether module load. Budget
  is judgment, and criterion's own record give no threshold — no file count, no line
  count, no token count. **Its boundary test is off-the-shelf; its budget is
  judgment**, so the gate assert the shape and not the size — and the size is the
  half most easily applied after the fact to justify a split already wanted.
- **Whole-program-reasoning span is not measurable either.** Check name constructs
  already rejected; nothing detect a new one.
- **Classification of a piece of machinery as startup-loud is unverified.** Nothing
  assert a boot-failing mechanism actually fail boot in every configuration, and
  configuration is exactly where such a claim rot.
- **Review substitute is self-invoked.** Where no infrastructure guarantee it ran or
  that its inputs were not softened, committed verdict make omission visible and
  nothing make softening visible.
- **Will count is not observable.** Nothing detect that a second will appeared —
  a second team, an outsourced module, a vendor — and topology decision built on
  one will silently stop matching.
- **No outcome measured anywhere.** No repo built both ways, so every directive
  here is an argument about a counterfactual. Central claim marked *uncertain* for
  exactly this.

## Where the rest of this lives

- **`enforceable-rules`** — how to write a rule that bind an agent, the eight design
  principles including *no silent runtime behaviour* and *unwritable beats banned*,
  the incompleteness checks, and **the enforcement markers and status tier** every
  check line here carry. **Install it with this skill**: this one state what shape system take, that one state what shape a rule
  take.
- **`backend-stack`** — which stack, ranked by what its build can refuse to ship.
  Corpus gravity and drift asymmetry are its directives, not this skill's.
- **`guardrails-toolchain`** — which gates, how they compose, and the
  non-deterministic-reviewer rule this skill's review directive defer to.
- **`tech-decision-research`** — how to reach a verdict worth recording, including
  the requirement that premises be recorded with it. **Defines the four confidence
  markers** every claim here is graded in.
- **`java-backend-rules`** — one stack's runtime-silent ban list, with a check per
  banned mechanism.

## Markers, dates, and what they mean

**Every directive is *convention*.** Source records ran adversarial agent panels and
recorded verdicts, and carry **no per-claim confidence marker and no primary source
citation**. So nothing here reach *primary-source verified*, let alone *confirmed*,
and a reader who need that must re-verify from primary material.

**Central claim, that these decisions differ under an agent maintainer, is
*uncertain*** — argued, never measured.

**Dates below are the record's, not a verification date:**

| Directive | Date |
| --------- | ---- |
| Startup-loud / runtime-silent; design out whole-program reasoning; operational state in repo; module fits one session; predecessor is inventory; bus factor by failure shape; hand-built subtle piece | 2026-06-12 |
| Count the independent wills | 2026-06-12..13 |
| One idiom imposed mechanically | 2026-06-12..13 |
| A steering human is not a reviewer | 2026-06-13 |
| Review substitute; zero retries and quarantine | 2026-06-14 |
| Exit-ladder executability clause | 2026-08-01 — conversion-dated |

**Enforcement markers sit beside each check**, and most are *convention* — these
directives bind decisions taken before code exist, so their check is a written
artifact whose absence is visible. **The ones carrying an off-the-shelf check are
named rather than counted:** boundary tests, the formatter and canonical-form
rewriter, the operational-surface lints, the absent-fixture grep, and the retry
setting. The quarantine expiry gate beside that last one is **bespoke**, and its
own check line say so.

Evidence, sources and the do-not-cite list are in `evidence.md`.
