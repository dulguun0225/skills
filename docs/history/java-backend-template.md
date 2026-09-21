# The Java backend template

*Authored 2026-09-16, one session. A sibling repository, not a skill: [`dulguun0225/java-backend-template`](https://github.com/dulguun0225/java-backend-template), public, flagged as a GitHub template.*

## Why it exists

The owner observed, using these skills with `github/spec-kit`, that the first implementation session of a greenfield project goes to scaffolding: build files, the compile wall, the ArchUnit ban list, lint configuration, CI, the error-response skeleton. That work is expensive in tokens and time, it is regenerated from prose differently each time, and none of it is a decision. The skills deliver decisions at the moment they are made; the scaffolding is the *consequence* of those decisions, identical across every project on the same stack, so it belongs in a template that is instantiated, not in a skill that is read.

The alternative considered and rejected the same day: a `template/` resource inside `java-backend-rules` that a hook or script materialises. A skill directory is the whole world its consumer has, and a hundred-file template is not a context-window artifact. The sibling repo also keeps the owner's 2026-08-03 delivery rule intact: nothing here asks a consumer to paste anything into a `CLAUDE.md`. The template ships its own `CLAUDE.md`, which is the consuming repo's file from the first commit.

## What it is

One Maven module, Spring Boot 4.1.1 Web MVC, jOOQ 3.21.7 over PostgreSQL 18, Flyway, Java 25, exact pins throughout. A `platform` package holds `Money`, `RoundingPolicy`, `Ids` (UUIDv7), `Tx` (the one transaction seam, detached records), the RFC 9457 error contract, the typed logging facade and `KeysetPager`; a `db` package holds the generated jOOQ tree; beside them sit the deployable's entry point, the correlation filter, the exception handler and its catalog, and one package per feature, `greeting` being the worked example. The committed OpenAPI document and every architecture and contract test ride along. `scripts/init.sh` renames package, group and artifact in one command and was exercised on a scratch copy.

**It shipped as two modules and was collapsed to one the same day at the owner's request** ("I don't like it contains two projects"). The split had been inherited from the production repo and defended on three grounds: codegen bootstrap, the platform-tier layering edge as a compile-time fact, and proven configuration carrying over. Only the first was real, and it dissolved: the codegen runner now lives outside `src/` and is launched in the java launcher's source-file mode on the test classpath at `generate-sources`, so `mvn -Pcodegen generate-sources` regenerates the jOOQ tree before anything compiles, proven by deleting the tree and regenerating it. The layering edge is held by `LayeringArchTest` alone, which the skills' own position (no prescribed module layout) already implied. **The lesson is the repo's *follow the pointer* class in a new coat: an inherited structure was justified after the fact with reasons that sounded like requirements, and only one survived being tested.**

Every gate `mvn verify` and the workflow run, mapped to the directive it implements, is the template's own `docs/GATES.md`, together with the directives the skills state that nothing there reaches. That file is the pointer the two skill edits below rely on; it is one hop from the consuming repo, not from here, and this record does not restate it.

Two things in it are worth naming here because they answer defects this repo recorded:

- **One violating fixture per ArchUnit rule, asserted.** `async-handoff-java` `E-25` states that ArchUnit's empty-should guard is one property from being disabled and that a rule pointed at the wrong package passes silently. The template makes every ban rule a static field, and a negative-control test evaluates each over a fixtures package and fails if any finds nothing. Seventeen rules, seventeen fixtures, reconciled by reflection with the ban-coverage meta-test.
- **The jOOQ regenerate-twice check ran and was byte-identical.** `java-backend-rules` named gap 9 said the stronger reproducibility form was never verified against the jOOQ generator on this stack. The template regenerates under `Pacific/Kiritimati` and `tr_TR.UTF-8` and diffs both runs; jOOQ 3.21.7 on a one-table schema came out identical. The gap is narrowed in the skill, not closed: one schema is a sighting.

## Repo shape: one service, one micro-frontend

Later the same day the owner stated the unit: **each repo holds one microservice and one micro-frontend.** The Java module moved under `backend/`; `frontend/` was created and left empty on the owner's choice among three scopes (lift the Angular gates from `../net-saas/FRONTEND.md`; layout only; lift and harvest the Angular skill too). Layout only was chosen, with two further decisions recorded in `frontend/README.md`: a separate static deploy, never served by the Java service, and no micro-frontend mechanism until a shell exists, at one named exposure point. The contract between the halves is `backend/openapi/v1.json`.

CI became two jobs, `backend` and `frontend`, both required on `main`. **The frontend job gates nothing today and says so on every run** rather than passing silently; the moment `frontend/package.json` appears it demands a lockfile-exact install and a `check` script, so a frontend with code and no gate fails. That is `guardrails-toolchain` *Record what stayed advisory* applied to an empty directory, and the template's `docs/GATES.md` carries the row with the note that no published skill governs a frontend. The Angular row in `BACKLOG.md` is where that changes.

## The template is the backend, not the project

The owner's next correction: *"our java-backend-template isn't actually a backend template. You made it a template for the whole project."* Right. The template root now **is** the service module: `pom.xml`, `src/`, `codegen/`, `openapi/`, `scripts/wall.sh`. It is meant to be vendored into a project's `backend/` (`git subtree add --prefix backend … --squash`, which also leaves a path for pulling later gate changes), and `scripts/init.sh` detects that it sits one level below the repository root and, after the rename, lifts a `project-root/` folder up: the root CI with `backend` and `frontend` jobs, the ruleset, `compose.yaml`, the `frontend/` stub, the spec-kit constitution, the project `CLAUDE.md`, the root scripts. It never overwrites a file that exists and removes the template's own `.github/` and `renovate.json` from `backend/`, where they would mean nothing. Standalone use (the repo *is* the service) still works: at a repository root the script renames and stops.

One script, `scripts/wall.sh`, is now the whole backend wall; the template's own workflow and the project-root workflow both call it, so the two cannot drift on what green means. Proven three ways before merging: the wall at the template root, a simulated vendoring into a scratch project with `init.sh` in vendored mode, and `mvn verify` inside that vendored, renamed `backend/`.

## What was lifted, and from where

The wiring came from `../net-saas/monorepo/backend`, the production repo the Java skills were harvested from: the Error Prone and NullAway compiler arguments and `jvm.config`, Spotless with palantir-java-format, the ArchUnit ban list and its coverage meta-test, the error catalog snapshot, the Testcontainers configuration, the codegen runner, the `Tx` seam, `Money`, the logging facade. Everything tenant-specific, ledger-specific and security-specific was removed; the result is single-tenant and every endpoint is open, which `docs/GATES.md` names as a gap. Versions were moved to the newest GA lines on 2026-09-16 (Boot 4.0.7 to 4.1.1, ArchUnit 1.4.2 to 1.5.0, NullAway 0.13.6 to 0.14.1, Spotless 3.6.0 to 3.10.2) and everything compiled and passed on the first build after the move.

Three things the gates caught while the template was being built, each a real defect in freshly written code: NullAway found a nullable dereference in the worked example's validation; the licence gate rejected two licence spellings and forced the merges file to exist; osv-scanner found three critical Tomcat advisories in the Boot-managed 11.0.24 and the pin moved to 11.0.26 rather than into the suppression inventory. **Run the check over the pass that just finished, not only over what it inherited** held again.

## What it changed here

- `java-backend-rules` *Wiring the gates*: opens with the instruction to create a greenfield repo from the template rather than wire the list by hand, with the check that the template's gate map and gap table together cover every directive. Named gaps 9 and 11 narrowed, not removed.
- `guardrails-toolchain` *Wiring the gates*: names which of its nine steps the template wires (3, 4, 5 for two artifacts, the mechanical half of 2) and which stay the repo's (1, 6, 7, 8, the licence-and-caveat half of 2). The template's gap table carries a row per unwired step, added in the same session after this sentence was written and found to promise rows that were not there.
- `README.md`: a consumer-facing paragraph under *Installing from this repo*. `BACKLOG.md`: the bare-fixture firing row now states the second question the template opens.
- **No `description` changed.** The pointer is body text, loaded only when the skill fires.

## What it costs every session, and whether it fires

**Frontmatter: unchanged.** `npm run tokens:frontmatter` reads 4,434 tokens across twenty skills before and after this session, because no description was touched; the template adds nothing to any session that does not load `java-backend-rules` or `guardrails-toolchain`.

**Firing: not measured, and the question changed shape.** The 2026-09-01 trigger on `java-backend-rules` fires *before creating a build file or pinning the Java or Spring Boot version for a new repo*. On a repo created from the template the build file exists and the pin is set, so that trigger's premise is gone before the first session; whether the skill still loads on the template's fixture, and whether it needs to, is the case `BACKLOG.md` now describes. The sealed 2026-08-03 baseline (43/44) stands because it measured descriptions that did not change. No `npm run firing` was spent this session.

## Verification

`mvn verify` green locally on Java 25 / Maven 3.9.16 / Docker 29.8: 19 platform tests, 33 app unit tests, 9 integration tests, both coverage checks met, licence gate passed, osv-scanner clean after the Tomcat move. Every shell step in the workflow was run locally first: action pins, forbidden flags, squawk (which found two missing timeouts in the first migration and they were added), the regenerate-twice drift check, the scan. The main-branch ruleset was applied and demonstrated by blocking a direct push of the second commit, which went through a pull request instead. The first CI run on GitHub (run 35057682788, `ubuntu-latest`, 2026-09-16) passed every step, including the required-checks assertion against the live ruleset and the second OpenAPI run under the other timezone and locale.

## 2026-09-16, later: the scaffold is a script in the skill

The owner observed that instantiating the template is a fully deterministic process and asked whether the
scripts belong in the skill. The answer split on who executes a script. The template's `scripts/` —
`wall` and the four checks it runs, `init`, and the four under `project-root/scripts/` — are run by
CI or by the forge, and CI has no skill installed; a gate that lives only under `~/.claude/skills/` is a
gate the build cannot run, which is the *unwired gate is a rule described as enforced that is not* defect
`java-backend-rules` names. `init` also rewrites strings that only the template's own files contain, so
the write-once rule makes the template its owner. **What the skill was missing was the one script the agent
runs before a repo exists**, and that is what was added.

`skills/java-backend-rules/scripts/new-backend.mjs` (written as `new-backend.sh` first; see the next section) is the README's four-command sequence as one command:
project root with an empty commit, fetch the template, `git subtree add` it into `backend/` (or
`--standalone`), the template's own `init` script, codegen, `mvn verify`, one commit whose message records the
template sha and whether the wall was run. It stops before `gh repo create`, the ruleset, the skills install
and `specify init`, and prints them, because each has side effects outside the directory. The template is
pinned to a recorded commit (`7ea886b`, the vendoring refactor, at first writing) with `--ref` to override; `main` is what the
README fetched, and two projects scaffolded a week apart from `main` start from different templates.

**Writing it found a defect in the template's README.** Its vendored sequence runs `git subtree add`
directly after `git init -b main`, and `git subtree add` refuses a repository with no `HEAD`
(*working tree has modifications. Cannot add.*, which is not the real reason). Reproduced 2026-09-16; the
script makes an empty commit first and the template README now says so. *A claim to have verified is itself
a claim to check*: the template record above says every shell step was run locally, and it was — inside a
repository that already had commits.

Verified: both modes run against a local clone with `--skip-verify`, producing the expected tree, package
directory and three-commit history; the vendored mode was then run in full, codegen and `mvn verify`
included, green on Java 25 / Maven 3.9.16 with Docker, ending in a clean tree and the commit *init:
some_service_1 from java-backend-template 7ea886bc94bf (mvn verify green)*. Run again against GitHub with the default
ref and no flags (`--package com.acme.orders --name orders`): green, and its tree is file-for-file the local
run's tree with the name substituted. Rejected inputs, a non-empty target, an unreachable sha and an unknown
ref each fail before the template is fetched and remove what the run created; a failure after that leaves
the tree for inspection and says so. `npm run gates` green with the new relative
link; `npm run check` still lists the skill.

**What it costs every session: nothing.** No `description` changed, so `npm run tokens:frontmatter` is
unchanged. The script is not a `.md` file, so `npm run tokens` does not count it and no agent loads it into
context; it is executed, not read. The body grew by one sentence naming it. **Firing: not measured**; the
firing case this record already leaves open is unchanged by a body edit, and is where the script's value
would show — a session that fires the skill on a bare fixture and runs the script writes nothing of its own.

## 2026-09-16, later still: the scripts are Node, not bash

The owner, the same day: *"I don't like shell scripts in the java-backend-template and in the skill. I need
something more cross platform. spec-kit uses uv to distribute already, our skills our distributed via npx."*
The scaffold script is run by an agent on whatever machine the developer has, and this repo's own firing
records are stamped win32; a `.sh` there was a Linux assumption in the one file that most needed not to make
one. The template's `osv-scan.sh` had already made it explicitly: it downloaded `osv-scanner_linux_amd64`
with one checksum.

**Decision: Node, standard library only, no `package.json`, in both repos.** Node is on every machine that
matters by construction: a consumer got the skill through `npx skills add`, and the template's frontend gate
already shelled out to `node -e`. Python via uv was the alternative, rejected because it adds a third runtime
to a Java repo for the sake of eleven helper scripts; spec-kit chose uv because spec-kit is a Python project.
Keeping bash under Git for Windows was the cheaper option, rejected because it works only where the Linux
tooling the scripts assumed (`mapfile`, `mktemp`, `sha256sum`, `python3`, the linux-only binary) happens to
be present, which is the surface the template exists to remove. The zero-dependency rule mirrors this repo's
own *the two gates stay dependency-free*.

What changed in the template (squash-merged to `main` as `4c02812`, PR #7): the ten
`.sh` files under `scripts/` and `project-root/scripts/` are `.mjs`, sharing one `scripts/_lib.mjs` (run,
capture, fail with a status; `mvn`, `npm` and `npx` are `.cmd` files on Windows and are spawned through a
shell there, everything else directly). `wall.mjs` runs the four checks as child `node` processes so each
stays runnable alone. `init.mjs` applies the same substitutions in the same order, line-wise where sed was
line-wise, and skips a file holding a NUL byte; its output was diffed byte-for-byte against `init.sh` on
identical input and matched on every file outside `scripts/`. `mise.toml` pins `node = "24.21.0"` and
`osv-scanner = "2.6.0"` beside Java and Maven; the scan script requires the binary on `PATH` and names
`mise install` when it is missing, so one pin serves every platform and mise's aqua backend verifies the
release checksum where the script used to. Both workflows install the toolchain with `jdx/mise-action`
(SHA-pinned, mise version pinned) from the same file, replacing `setup-java`, with `~/.m2` under
`actions/cache`; the `frontend` job installs only `node`. `apply-ruleset` no longer needs `python3`. Every
`.sh` mention in the template's `README.md`, both `CLAUDE.md`s, `docs/GATES.md`, `pom.xml`, `.squawk.toml`
and the frontend README was rewritten; the GATES row for the scanner now says *pinned in `mise.toml`*
rather than *pinned by checksum*, because the checksum is no longer in a file this repo owns.

In the skill: `new-backend.sh` is `new-backend.mjs`, same flags, same cleanup contract, calling the
template's `init.mjs`; it carries its own twenty lines of spawn helpers rather than importing the
template's, because it runs before the template exists on disk. **`DEFAULT_REF` is `4c02812`**, the squash
commit on `main` after PR #7 merged, so the default passes its reachable-from-`main` check without an
override.

Verified, 2026-09-16, Java 25 / Maven 3.9.16 / Node 24.21.0 (template) and 26.5.1 (skill script, the
machine's own) / osv-scanner 2.6.0 / Docker: `node scripts/wall.mjs` green at the template root, every
step. Forbidden-flag, action-pin and frontend gates each fail on a planted violation, the first also on a
`-javaagent` planted in the lifted `compose.yaml` one level above a vendored `backend/`. The scaffold
script: rejected inputs, a non-empty target, an unknown ref and an unreachable sha fail before the fetch and
remove what the run created; vendored and standalone `--skip-verify` runs give the expected tree, lifted
`project-root/`, renamed package directory and three-commit history; the pinned-sha path was exercised
against a clone whose `main` holds the pin; a full vendored run with codegen and `mvn verify` ended in a
clean tree and *init: some_service_1 from java-backend-template 6a7eb02b37ce (mvn verify green)* — that
verification ran against the pre-squash `port/node-scripts` commit, before `DEFAULT_REF` moved to the
post-merge `4c02812`. `git diff 6a7eb02 4c02812` is the four spec-kit-ordering files (`README.md`,
`project-root/CLAUDE.md`, the constitution header, the `init.mjs` warning branch) and nothing `mvn verify`
or codegen reads, so the verification stands for the build; the scaffold's warning path is not re-run.
**Not
verified: a run on Windows or macOS.** The port removes the Linux assumptions that were visible; the claim
that it runs there is the standard library's, not a measurement, until someone runs it.

Per-session cost: still nothing; no `description` changed. Firing: unchanged, not measured.

## Where the scaffold sits in the spec-kit sequence — 2026-09-16

The owner asked what to do with `/speckit.constitution`, then caught the ordering the first answer had
assumed: *"Backend-template will only run when I hit the implement stage right? Spec-kit has constitution ->
specify -> plan -> tasks -> implement."* If the scaffold ran at implement, the pre-filled constitution would
never reach a project: `init.mjs` lifts `project-root/` without overwriting, so the file `/speckit.constitution`
had already written would be kept and the platform articles dropped with a one-line *kept existing*. The two
consistent orderings were scaffold-then-spec-kit, or spec-kit-first with the platform articles restated as
input to `/speckit.constitution` — which is the paste-into-a-consumer-file mechanism the delivery rule bans.

**Owner decision: scaffold first.** The sequence is `new-backend.mjs`, `specify init --here`,
`/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`.
`/speckit.constitution` amends Article VII, the project's own decisions, and leaves I–VI alone; implement is
feature code inside an already-scaffolded `backend/`. Recorded in the template's README, its project
`CLAUDE.md` and the constitution's own header comment, and `new-backend.mjs` now prints `/speckit.constitution`
as the step after `specify init`. `init.mjs` was also changed to warn, rather than merely note, when the kept
file is the constitution, since that is the one file where *kept existing* means the scaffold's decisions did
not land. PR #7 was squash-merged to `main` the same day as `4c02812`, carrying the port and these edits together, and
`DEFAULT_REF` moved to it; the pin-move item recorded above is closed.

## `new-java-backend` — 2026-09-16

The owner, told to invoke `java-backend-rules` to scaffold: *"Or do we create a new skill? That only prepares the
constitution."* Yes. The scaffold instruction sat at the foot of a body that is the ban lists — thousands of
tokens an agent does not need while scaffolding — and behind every one of them, where an agent that has begun a
`pom.xml` reads it too late. `new-java-backend` is the procedure alone: run the script with the three inputs
the user supplies, do the one printed next step that stays inside the directory (`specify init --here`), hand the
rest to the user by name, and stop where `/speckit.constitution` begins with Article VII. `new-backend.mjs`
moved into it, because a skill dir is the whole world its consumer has; `java-backend-rules` now points at the
sibling by name. Marked *decided, not yet validated*: the template has run green and the procedure has been
run by hand, no project has yet been created by an agent invoking it.

Per-session cost, `npm run tokens:frontmatter`, 2026-09-16, o200k_base: `new-java-backend` 147 tokens
(name plus description), set total 4,581 across twenty-one skills, up from 4,434 across twenty. It is an
inception-cadence skill, the class this repo's own rule calls the worst trade; accepted because the alternative
was loading `java-backend-rules` whole at a moment none of its directives bind. Firing: meant to be invoked by
name; unprompted firing on "create a new Java backend here" unmeasured, and the bare-fixture case on the backlog
now has a second candidate skill to point at.

## `converge-feature`, and the severity floor in `build-feature` — 2026-09-18

*Superseded in its default by "The default severity floor is `NONE`" at the foot of this file: the floor stayed the only stop test, but `LOW` is no longer the default. The ground below stands as the record of why `LOW` was chosen.*

Ground: the product-catalog repo's `001-product-hierarchy`, converged by hand on `main` (head `f2b5f1f`): five converge ⇄ implement passes, no fixed point, the fifth appending nothing only because the operator had stopped applying LOW findings. `build-feature`'s converge loop now carries every gap graded on the analyze scale, stops on `converged` or on a round with nothing above LOW, logs which, defaults to six rounds, and reports reaching the cap as `converge.ended: "round-cap"` on a `done` return — the wall stays the gate, red wall and unchecked appended tasks stay `needs-human`. `converge-feature` is a named entry point to that loop from `converge` to `finish` through the sibling's script, no script of its own; the rejected alternative is `/loop` with a retyped sentence, on the three grounds its SKILL.md states. Both marked *decided, not yet validated*: no scripted run has yet reached the converge stage on this table.

Per-session cost, `npm run tokens:frontmatter`, 2026-09-18, o200k_base: `converge-feature` 114 tokens (name plus description; 119 with framing), set total 4,851 across twenty-three skills, up from 4,581 across twenty-one on 2026-09-16, with `build-feature`'s description edit inside that delta. A per-feature-cadence skill like its sibling; accepted because the alternative was a sentence retyped per feature and per project with no written stop rule. Firing: meant to be invoked by name; unprompted firing on "finish this feature" unmeasured.

## The severity-floor commit reviewed — 2026-09-18

An adversarial review of `cc903d0`, the commit recorded directly above, read against `/speckit-converge`'s own
Steps 4, 5 and 7 rather than against a run. **No run: nothing in that commit or this one has been executed
against the Workflow tool, and both skills stay *decided, not yet validated*.** Eight defects, corrected in one
commit.

Three were in the loop's stop logic, and each would have ended a run early or reported something untrue. The
loop read `outcome` before the floor, and `/speckit-converge` Step 7 defines `converged` as *no **actionable**
findings* while Step 4 surfaces `unrequested` gaps for awareness only — so a HIGH gap graded non-actionable
arrived as `converged` and broke the loop before the floor was consulted; the floor is now the only stop test,
and a `converged` return carrying a finding above it ends the run `needs-human`, because nothing was appended
and the next round would repeat it to the cap. The prompt had written a third severity vocabulary beside Step 5
and the analyze schema's, whose LOW clause — *a gap a person would not notice* — graded exactly the class the
hand-driven 001 run kept finding; the ad-hoc clauses are gone and the prompt names Step 5 as the scale. And the
findings carried at the cap were the ones that round had just implemented, so the log line was false: the cap is
now followed by one assess-only round, the `max + 1` shape the review and analyze loops already use, and its
findings are what the run reports.

Three more were smaller and of the classes this repo already records. `findings: []` satisfied the schema's
`required`, so a round that appended tasks and graded nothing stopped at the floor claiming nothing was above
it — unknown is not below the floor, and that shape now continues the loop. `SEVERITY_FLOOR` was compared with
`!==`, a constant named like a knob that would break silently the day the floor is raised; the comparison is by
rank against the declared order. And the `status: "done"` check in `build-feature`'s SKILL.md claimed the finish
wall is green where an `until` before finish returns `done` with `finish: null`, and claimed *no third exit*
about every way the script can stop, where a throw from `must()` or the argument checks is neither return —
**a check line is directive text and overclaims like any other sentence**, which is the class the repo has
recorded under *follow the pointer*.

The last two were in `converge-feature` and are the *evidence.md fixed, SKILL.md missed* shape in a new
direction — a sibling stating a precondition its neighbour drops. `build-feature` states that a user-level
install under `~/.claude/skills/` needs `/add-dir` or a `Read` allow rule before the Workflow tool will accept
its `scriptPath`; `converge-feature` omitted it and diagnosed the same "cannot read" refusal as a missing
sibling, prescribing `npx skills add`, which does nothing for that cause. And `push` and `mergeInto` were named
without their defaults beside an example running on `branch: "main"`, so following the example pushes `main`
directly with nothing on the page saying so. Both corrected; the missing-sibling sentence stays for its own case.

Per-session cost: no `description` changed, so the frontmatter total is unchanged from the line recorded above.
Firing: unchanged, and still unmeasured for both skills.

## What is still open

- The firing case above.
- Schemathesis, the vacuum rulesets and oasdiff: named in the template's gap table with what would wire each; not wired because the first two need a Python or Go binary and authored rulesets, the third needs a consumer.
- Whether the template should carry authentication scaffolding. The skills say nothing about it, and the template says so.
- Renovate is configured but the app is not installed on the repository; until it is, the "named path for moving a pin" is a file, not a process.

## The severity floor became an argument — 2026-09-18

*Superseded in its default by the last entry of this file. Everything else here holds.*

The owner asked for the converge stop level to be chosen per run, `LOW` by default, from both entry points.
**No run: nothing here was executed, and both skills stay *decided, not yet validated*.** `args.severityFloor`
joins `build-feature`'s configuration, uppercased, defaulting to `LOW`, and is checked against the four-value
scale beside the tier rows — before the first agent starts, on the roster's own reasoning: a bad floor must not
cost a run its specify-through-implement spend before it is caught. `converge-feature` carries it in its example
call and names it as the one setting that moves where the loop stops, which is the per-feature call that skill
exists for; it owns no rule about it, and the check stays in the script.

Two things made this a small change rather than a rewrite, and both came from the adversarial review recorded
above. The floor comparison was already by rank against the declared order — written for *the day the floor is
raised to MEDIUM*, which is this one — so the constant became a configuration read and nothing else moved. And
the floor is filtered in the script and never appears in the converge prompt, so moving it cannot move a grade;
that property was not designed for this change but is what makes the argument honest, and it is now stated in
the check line. `converge.floor` on the return already carried the value, so a run's stop level is readable
from its result.

`CRITICAL` was accepted for one edit and refused the same day, when the owner asked whether
`/speckit-converge` has that severity at all. It does: Step 5 grades a constitution MUST violation, or a
`missing`/`contradicts` gap blocking a P1 user story's baseline functionality, as CRITICAL. So a floor there
tolerates every finding the scale has and ends the loop after one round, and it is refused with a message
saying so; the legal floors are `HIGH`, `MEDIUM`, `LOW`. **The first version accepted it because the scale was
read off this script's own schema enum rather than off the skill that grades against it** — *follow the
pointer*, the class this repo has recorded most often after counting, and the second time in two days that a
claim about `/speckit-converge`'s text was written without opening `/speckit-converge`. The other was defect
(2) of the adversarial review above, where a third severity vocabulary was invented beside Step 5's.
Per-session cost unchanged in kind: `build-feature`'s description and `converge-feature`'s are
untouched by this change, deliberately, because both still describe the default truthfully and a description
edit invalidates the firing baseline neither skill has yet measured.

## The example args carried a real feature — 2026-09-18

The owner read `converge-feature`'s `Workflow({…})` block and asked why it names
`specs/001-product-hierarchy`. Because the skill was harvested from that run and the example was copied from
it rather than written. In prose that is provenance and stays — the dated ground for the severity-floor claim,
in this file, in both `evidence.md` files and in the `/loop` rejection. In a fenced call a reader copies it is
a defect: the path resolves in no other repo, and it sat beside `branch: "main"` while `push` defaults to
true, so the copy-paste path pushes the reader's `main`. Now `specs/<nnn>-<feature>` and `<feature-branch>`,
with the sentence below the block rewritten to say finish pushes whatever `branch` names instead of pointing
at the example's `main`. `wall: "node backend/scripts/wall.mjs"` is left real: it is the sibling template's
own path and resolves for the reader this skill is written for.

**The class is the inverse of de-naming.** De-naming strips a real name where the reader needs it; this
leaves a real name where the reader needs a hole. Both are born the same way — writing from the run in front
of you — and the discriminator is whether the text is a claim or a template. A swept grep over `skills/` for
`specs/0`, `featureDir:` and `branch: "main"` found this the only instance. `npm run check` and
`npm run gates` green after; neither reaches the inside of a fenced block, and no gate here ever will.

## The default severity floor is `NONE` — 2026-09-18

The owner reversed the default converge stop level from `LOW` to `NONE` — tolerating nothing — for
`build-feature` and therefore for `converge-feature`, which passes it. The reversal was taken after the
counter-argument was put: the `001-product-hierarchy` run recorded twice above shows converge has no fixed
point, and that is why `LOW` was chosen the same morning. The owner reaffirmed. **The ground it was reversed
on: a tolerated finding is a finding left open, and a stop test that tolerates a class of finding has written
that class out of the definition of done. What the no-fixed-point run shows is that the loop will not
terminate on its own, not that a tolerated finding is closed.** Both earlier entries stand as dated records
and are marked superseded in their default where a reader would otherwise act on them. **No run: nothing here
was executed, and both skills stay *decided, not yet validated*.**

In the script, `NONE` joins `HIGH`, `MEDIUM`, `LOW` as a legal floor and becomes the default; it ranks below
every graded severity (`floorRank = SEVERITY_ORDER.length`), so every graded finding is above it. `CRITICAL`
is still refused on the same Step 5 reading. Nothing about the comparison moved: it was already by rank, and
a severity off the scale (`rank === -1`) still ranks above the floor. Two exits changed meaning rather than
code, and both are now stated where a reader will look. The in-loop `severity-floor` exit is unreachable
under `NONE` — a round that grades nothing already continues as *shown nothing*, and a round that grades
anything has graded above the floor — so it belongs to a run that raised the floor. On the post-cap
assess-only path a zero-finding assessment used to end `severity-floor`; under `NONE` it is labelled
`converged`, because the round found nothing and the other label names a floor that tolerates nothing. Every
log line and the contradiction message that named the floor are floor-aware, so no run prints *nothing above
NONE*.

**The cost is stated rather than argued away.** Under `NONE` the clean `converged` exit needs a round that
appends nothing *and* grades nothing, so a real feature will usually end at `maxConvergeRounds` — unchanged
at 6, and a caller who wants more passes raises the cap, not the floor — with its open findings reported on a
`done` return, or at `needs-human` where converge returns `converged` while still grading a gap. That
`needs-human` was already the contradiction branch; it is now much more likely, because `/speckit-converge`
Step 7 calls a round converged on *no **actionable** findings* and Step 4 surfaces gaps for awareness, and
under this floor the run declines to adopt that judgment. The wall at finish remains the gate.

Per-session cost, `npm run tokens:frontmatter`, 2026-09-18, o200k_base: `build-feature` 132 tokens of name
plus description (139 with framing), `converge-feature` 128 (133 with framing), set total 4,880 across the
skills the script lists, up from 4,851 the same day. **Both descriptions were edited by this change** —
`converge-feature`'s said *until nothing converge reports is above LOW severity*, which the reversal made
false, and `build-feature`'s said the loop *ends when nothing it finds is above LOW severity*. A description
edit invalidates any firing baseline; **neither skill has ever measured one**, so nothing was invalidated in
fact, and the first measurement of either is still owed.

Exercised, not measured: the exits were driven against a stub of the Workflow sandbox — `NONE` with a clean
round, with one LOW on a `converged` return, with an off-scale severity, the cap with a clean and with a
graded assess-only round, and the same cap shapes at a `LOW` floor — and each produced the `converge.ended`
and the log line the skills claim. That is a reading of the script under stubs, not a run: no Workflow run
has reached the converge stage at any floor. `npm run check` and `npm run gates` green after.

## 2026-09-21: the spec↔code traceability gate is born with the template

Built in `product-catalog` over 2026-09-18 to 09-21 and ported up, so a project scaffolded from
`new-java-backend` refuses a bare requirement id from its first commit rather than at whatever point someone
notices that nothing reads the specs. The gate is `scripts/check-traceability.mjs`: no bare `FR`/`SC` id in
the tree, every `NNN/FR-nnn` citation resolving to a feature directory **and** to an id that feature's
`spec.md` defines, a bare id inside a feature's own directory resolving in that feature's spec, every id of a
feature whose `tasks.md` has no open box cited from a file under a test root or waived with a kind
(`external` or `deferred`) and a reason, and every `<QUALIFIER>/FR-nnn` citation of the source document a
feature was specified from naming a qualifier declared in `specs/trace-upstreams.tsv`. The canary
`scripts/check-traceability.selftest.mjs` runs first, over 35 committed fixture trees, and asserts the exit
status *and* that the offending token is named — a gate that cannot fail proves nothing, which is why the
wall runs the two in that order.

Three files — the gate, the canary and `scripts/fixtures/traceability/` — are byte-identical between the
template and `product-catalog`, so the next port in either direction is a copy and a `cmp`. That is what the
layout discovery buys: the backend root is the script's parent, the project root is the git toplevel, and the
specs tree is `<project root>/specs`. In the template the backend *is* the repository and there is no specs
tree at all, so zero ids are defined, every citation dangles, every bare id still fails, and the gate says on
every run which of those it found. It ran unchanged on the first try.

One change the port forced, made in `product-catalog` first so byte-identity held: the gate's header comment
spelled its example citation with real digits, and that file sits inside the gate's own scan root — a live
citation, resolving downstream and dangling in a repo with no specs tree. Every id in that file is a
placeholder now.

None of the three lists the gate reads — `specs/trace-waivers.tsv`, `specs/trace-legacy-files.tsv`,
`specs/trace-upstreams.tsv` — ships in the template. Each is optional to the gate and the first feature that
needs a row is what creates it; the template's `CLAUDE.md`, `project-root/CLAUDE.md` and `docs/GATES.md` each
say so where the rule is stated. Verified end to end on a throwaway repo shaped like a new project (the
template as `backend/`, one `specs/001-demo/` with two ids and no open tasks): the gate fails on the two
uncovered ids, passes once one is cited from `backend/src/test/` in qualified form and the other carries an
`external` waiver row, and fails again on a bare id planted under `backend/src/main/`.

Template `main` at `e6cba05`, `node scripts/wall.mjs` green at its root; `DEFAULT_REF` in
`new-java-backend/scripts/new-backend.mjs` moved to it. No text in this repo enumerates the wall's steps in a
way the new steps falsify — the skills point at the template's `docs/GATES.md` rather than restating it,
which is the property that made this port a one-repo change here.

## 2026-09-21: an upstream citation resolves against a pinned copy of its document

The second half of the same gate, built in `product-catalog` the same day and ported up by copy and `cmp`.
A `<QUALIFIER>/FR-nnn` citation was accepted on its qualifier alone: the repository the qualifier names is
not checked out in CI, so nothing knew that the document still defined that id, and a requirement of it could
vanish out of a project's reading unnoticed. Each declared qualifier now carries a committed copy of its
document at `specs/upstream/<QUALIFIER>.md`, and its row in `specs/trace-upstreams.tsv` grows to five
columns — the feature that reads it, the location, the source commit the copy was taken at, and the copy's
git blob sha, recomputed from the bytes on disk. A hand-edited snapshot fails on that sha;
`scripts/refresh-upstream-snapshot.mjs` re-takes one from a local checkout at a named revision and rewrites
the row, so a moved pin is a reviewable diff of the document and CI still reads only committed files. Both
directions are then held: a citation names an id the snapshot defines, and every FR and SC the snapshot
defines is cited under the feature that reads that document or carries a row in
`specs/trace-upstream-dropped.tsv`, `dropped` or `deferred`, with the committed decision named. Beside it,
spec → tasks: every requirement of every feature that has a `tasks.md` is named by some task there, or waived.

Four files are byte-identical between the template and `product-catalog` now — the gate, the canary,
`scripts/fixtures/traceability/` (48 trees, 53 cases) and `refresh-upstream-snapshot.mjs`. The template ships
none of the four lists and no `specs/upstream/`, the same way it ships no `specs/` tree: each is optional, and
the first feature that needs a row creates it. `wall.mjs` needed no change — the canary already ran before
the gate it proves.

`build-feature`'s prompts learned the new rules in the voice they were already written in. Specify declares a
qualifier by *running* the refresh script — the row first with `-` in both sha columns, then the script, never
a hand-written snapshot or sha — and accounts for every upstream FR and SC, by a `<QUALIFIER>/ID` citation on
the local requirement that carries it, mapped by reading both texts and never by number, or by a dropped row
whose reason names a decision the spec records first. Review-spec gained three blocking findings for exactly
those three failures. The plan stage, the tasks stage and both wall-repair passes are barred from touching the
upstream lists at all: what a feature took from its source document is settled when it is specified, so an
unaccounted id is a finding for that stage and never a row added later to turn a gate green.

Template `main` at `b21dbf9`, `node scripts/wall.mjs` green at its root; `DEFAULT_REF` moved to it and proven
by scaffolding a throwaway project from the pin with a non-`com.*` package.

## 2026-09-21: a tracked file deleted from the working tree carries no citations

The traceability gate's first defect, found by scaffolding rather than by reading: a fresh project made with
`new-java-backend` could not run its own wall. `git ls-files` lists the *index*, and `scripts/init.mjs`
removes the template's own `.github/` before the first commit, so those paths were listed and were not on
disk; the gate opened each listed path unguarded and died with an uncaught `ENOENT` stack trace instead of a
verdict. The gate had been proven on 48 committed fixture trees and none of them could exhibit this, because
a committed tree cannot hold a file that is at once tracked and absent — and because a fixture is pointed at
its roots by flag, and a flag-supplied root is *walked*, so no fixture case read git's listing at all.

A listed path that is not on disk is now skipped: a file that is not there carries no citations, so there is
nothing to read and nothing to claim, which is the verdict and not a leniency. Only absence is skipped, and
only on a listed path; every other read error fails the gate as a gate error naming the file
(`cannot read <path>: EACCES`), never a stack trace, because a file that is there and unreadable is a verdict
the gate cannot reach. The snapshot's own refusal — a declared upstream with no committed copy — is untouched,
and the snapshot's bytes are now hashed and parsed from one read rather than two, so the hash and the text
cannot disagree.

The canary grew the one case it could not hold as a fixture, and it builds what it needs: a throwaway git
repository in a temp directory, laid out the way the gate discovers one, hermetic (identity inline, no global
or system config read, nothing signed) and removed afterwards. It commits, deletes one tracked file from each
listed root — the backend scan root and the spec tree — and asserts the gate still returns its normal verdict.
Both deleted files carry text that would fail the gate if it were read, so the case also pins which copy is
authoritative: the working tree, never the blob the index still holds. **The lesson is the corpus of fixtures
mistaken for the corpus of inputs** — every fixture entered through the one door the defect did not come
through, and the completeness check over the fixture directory could not see a case that has no directory.

Two sibling gates in the template have the same latent shape and are left as found, reported to the owner
rather than folded in: `check-forbidden-flags.mjs` and `squawk-changed-migrations.mjs` both read every path
`git ls-files` hands them. `init.mjs`'s own `ls-files -co` listing was examined and is clean: it takes its
listing and reads it before it removes anything.

Template `main` at `8334581`, `node scripts/wall.mjs` green at its root; four files still byte-identical
between the template and `product-catalog`, and `DEFAULT_REF` moved to the new pin and proven where the
defect was found — a throwaway project scaffolded from it, whose `check-traceability.mjs` runs green over its
138 scanned files after `init.mjs` has removed `backend/.github/`.

## 2026-09-21, later: the two sibling gates, checked rather than left as found

The entry above named `check-forbidden-flags.mjs` and `squawk-changed-migrations.mjs` as having the same
latent shape and reported it rather than folding it in; this closed that report. Each was confirmed against a
scratch git repository — commit, delete a tracked file, run — rather than assumed from reading.

`check-forbidden-flags.mjs` crashed exactly the same way as the traceability gate had: `git ls-files` lists
the index, so a build or deploy file `init.mjs` removes before the first commit is listed and not on disk, and
the unguarded `readFileSync` died with an uncaught `ENOENT` instead of a verdict. Fixed identically — a listed
path that is not on disk is skipped, any other read error fails the gate naming the file — in both
`product-catalog` and the template, keeping the file byte-identical between them (confirmed by `cmp` before
and after).

`squawk-changed-migrations.mjs` does **not** crash: it hands the listed files to `squawk-cli` as arguments, and
a missing one surfaces as squawk's own `Configuration error: No such file or directory`, a controlled non-zero
exit rather than an uncaught exception. What the fix should be there depends on whether another gate already
owns refusing a deleted shipped migration. `product-catalog` has one — `check-migrations-append-only.mjs`,
built for that project's R-16, reading `readdirSync` against the manifest rather than any git listing — and it
runs *after* squawk in the wall, so squawk's confusing error was reached first. There, the fix filters the
absent path out of squawk's file list before invoking it, so the append-only gate produces its named refusal
instead. This template has no such gate: nothing else here would catch a deleted shipped migration, so
`squawk-changed-migrations.mjs` was left as it was rather than made to skip the deletion silently. **The
pattern is not "skip every listed-but-absent path"; it is "skip only where skipping still leaves something
that refuses."**

`init.mjs`'s own `ls-files -co` listing was swept again in both repos and stays clean: it reads every listed
file into memory before it deletes anything, so no ordering lets it observe the tree fixed here.

Template `main` at `f289a52`, `node scripts/wall.mjs` green at its root; `check-forbidden-flags.mjs` stays
byte-identical between the template and `product-catalog` (confirmed by `cmp`), and `squawk-changed-migrations.mjs`
now diverges between them by design — the two repos own different sets of gates around a deleted migration.
`DEFAULT_REF` moved to the new pin.

## 2026-09-21, later still: `build-feature` starts at plan, and the spec is an input it may not write

The owner's decision, settled before the work started: features are no longer specified from a document in
another repository. A domain expert writes `specs/<NNN>-<name>/spec.md` in the service project with stock
`/speckit-specify` and `/speckit-clarify`, so the feature branch, the feature directory and
`.specify/feature.json` exist before any unattended run begins, and the run starts at `/speckit-plan`. The
same day the service repos dropped the upstream-provenance layer of their traceability gate — the pinned
snapshots, the two provenance tables and the refresh script — so everything `build-feature`'s prompts said
about pinning, accounting for and citing an upstream document now names files that do not exist.

`skills/build-feature/workflow.mjs` loses three stages (specify, clarify, and the review that refuted the
spec against its source), their fix agents, their tier rows, their round counter, two schemas, and the
`source` and `shortName` arguments; `STAGES` is `preflight, plan, review-plan, tasks, analyze, implement,
converge, finish`, so `from: "specify"` throws the same way any other unknown stage does. Nothing is kept
behind an argument nobody passes: a stage no run enters is a second way to build a feature that no gate
exercises. The provenance sentences come out of the plan, tasks and implement prompts, and the **waiver**
sentences they were interleaved with stay word for word — a waiver row still originates at the tasks stage
and nowhere else.

Two things replaced them. **Preflight became discovery**, and the discovery half runs on every entry: the
feature directory from `args.featureDir`, else `.specify/feature.json`'s `feature_directory` — which is
where stock spec-kit 1.0.8's `common.sh` reads the current feature from, the branch being a fallback for the
branch name only — else the branch name; the branch from `args.branch` else `git rev-parse`. It refuses when
nothing resolves, when the resolved directory has no readable `spec.md`, when a clarification marker is still
in the spec, and — for a run that actually starts at preflight — when the checkout is on the base branch. A
run that starts later is resuming work that may live on that branch, so it is not refused for it; that is how
`001-product-hierarchy` was converged. The restart defect this closes is old and quiet: `from: "plan"` left
`state.branch` null, the handoff table printed `(unknown)`, and the finish agent was told to fast-forward from
`HEAD@{1}`.

**And the spec is an input the run reads and never writes.** One rendered ban goes into every stage prompt
that can reach the file; the plan-review fixer and the analyze remediator return a finding they cannot resolve
otherwise under `specChanges`, which ends the run addressed to the spec's author; the implement prompt admits
it as the third blocker of a forced convergence task; the wall-repair prompts list a spec edit beside deleting
a test. The rejected alternative is to let the fix agents keep editing it as they always did. It loses on what
the artifact is now for: `spec.md` is the only thing in the feature directory no agent of the run authored,
and an artifact the run may rewrite cannot refute the run.

Needs-human reasons are now thirteen across nineteen exits, five of them preflight's, and `SKILL.md` lists
them; the earlier text said eight across thirteen and had been stale since 2026-09-20. `converge-feature`
passes the same script and needed only its example call and two sentences changed — `featureDir` and `branch`
are now the override rather than the requirement, and its blocked-task sentence gained the third blocker.

Per-session cost, `npm run tokens:frontmatter`, 2026-09-21, o200k_base: `build-feature` 135 tokens of name
plus description (144 with framing), `converge-feature` 124 (133 with framing), set total 4,885 across
twenty-three skills. Both descriptions changed, which invalidates any firing baseline either had — neither has
ever had one measured. `npm run gates` green. The script is exercised by syntax check only, and the check
itself has to be stated honestly: `node --check` rejects this file in both module modes, because the sandbox
evaluates the body inside an async function where its top-level `await` and `return` are legal, so the check
wraps it that way first. **No Workflow run has started from this shape.**

## 2026-09-21, last of the day: the build makes its own branch, syncs it, and distrusts spec-kit's local pointer

The entry above left one assumption in place — that the feature branch exists when the run starts, because its
author made it. The owner's correction: the domain expert may work **only on the base branch** (`dev`), writes
`spec.md` there, and keeps editing it while a build runs. His expectation of the skill, in his words: started on
the base branch, the run ends up on the feature branch, creating it when it does not exist.

Two things were read out of `product-catalog` before anything was written, and the first invalidates part of the
previous entry. `.specify/feature.json` is **git-ignored** (`.specify/.gitignore:6`, spec-kit's own comment
calling it per-checkout state), so it is not a record of the current feature at all — it is whatever this machine
last ran `/speckit-specify` on, which today is `004-product-gl-config` on a repo whose next feature is `005`.
Discovery had put it first. It is now last and never overrides: `args.featureDir`, then the branch name, then —
only on the base branch — the one directory under `specs/` with a non-empty `spec.md` and no `plan.md`, the
feature specified and not yet planned, with zero or several candidates being a `needs-human` exit that lists them
rather than a pick.

The second is that resolving it here was never sufficient. In spec-kit 1.0.8's `.specify/scripts/bash/common.sh`,
`get_feature_paths()` reads `SPECIFY_FEATURE_DIRECTORY`, then `.specify/feature.json`, and nothing else;
`get_current_branch()` returns `$SPECIFY_FEATURE` or the empty string and **never reads git**. So no speckit skill
sees the branch name, no branch name is refused — `feature/005-x` and a bare `005-x` are equally fine, which
settles the naming question the design raised — and a stale pointer sends `/speckit-plan` into the previous
feature's directory however well this script resolved the new one. Preflight therefore writes that one
git-ignored file to match, which is the single write it is allowed. A repository that tracks the file instead gets
the env-var route in the stage prompts, with the caveat stated: `get_feature_paths()` persists the variable into
the file itself unless the caller passed `--no-persist`, which this script cannot prevent.

The base-branch refusal added hours earlier is replaced by the work it was refusing to do. A full preflight on
the base branch checks out `args.branch`, else an existing `feature/<dir>` or `<dir>` local or remote, else a new
`feature/<dir>` — after the dirty-tree check, since all of it moves the tree — and then every entry whose branch
is not the base merges the base in: nothing when it is already an ancestor, `--ff-only` when behind,
`merge --no-edit` when diverged, `merge --abort` plus a `needs-human` with the paths on conflict. Never a rebase;
the branch may be pushed. The merge is conflict-free for the spec by construction, because no stage of the build
writes `spec.md` — and it is what lets the author keep editing on the trunk. A spec that moves under a run
starting later than `plan` is its own exit, restarting `from: "plan"`.

The handoff guard was re-derived rather than reasserted: `HANDOFF.md` is committed on the branch the run is on, so
`writeHandoff` now declines while `state.onBaseBranch` is true as well as when no feature directory is resolved.
A converge run on a trunk-implemented feature keeps its report on the return value and gets no file — named as a
cost, not discovered later.

Needs-human reasons: fifteen across twenty-one exits, seven of them preflight's. Per-session cost,
`npm run tokens:frontmatter`, 2026-09-21, o200k_base: `build-feature` 150 tokens of name plus description (159
with framing), set total 4,900 across twenty-three skills — a second description edit the same day, so any firing
baseline stays unmeasured. `npm run gates` green; the script syntax-checked the wrapped way, no run.

## 2026-09-21, after the day's last: `new-java-backend` stops handing off to `/speckit.constitution`

An agent invoking the skill scaffolded a project, then closed with "Next step: run `/speckit-constitution`", and
on the owner's objection began running it. The owner reported it as the second occurrence and asked for the root
cause rather than another correction. The cause was this repo's own text, read correctly: the skill's third
section was headed *Hand off to /speckit.constitution, Article VII only* and listed the command as the step after
`specify init --here`; `new-backend.mjs` printed it under its next steps; the template's `README.md`, project
`CLAUDE.md` and constitution header comment repeated it. The 2026-09-16 decision above was about which of scaffold
and spec-kit runs first, and the prose built on it turned an ordering into a step.

The step is not needed. Article VII is an optional slot; nothing in the template, in spec-kit 1.0.8 or in
`build-feature` reads whether it is filled. In the projects scaffolded by this date, one's constitution is
unchanged since its `init:` commit, and the other's Article VII was first written from a feature's plan
candidates, after that feature's spec existed — the route `build-feature`'s plan stage already names.

Changed: the section is now *Scaffold before anything writes a constitution; run no spec-kit command*, its
directive ends the skill at the `specify init --here` commit and names the rejected default; its check gained a
second half, *convention*, since nothing reads a session's closing text. The printed line is gone from
`new-backend.mjs`. `README.md` here no longer lists the command as step 2 of starting a project. The description
is untouched, so the frontmatter cost and any firing baseline stand. The template's three sentences change in its
own repo, and `DEFAULT_REF` moves only once that commit is on the template's remote, because the script fetches
the pin from there. A per-project memory note was tried first and does not reach the failure: the next scaffold
runs in a directory that has none.

Found on the same run, not fixed here: neither `new-backend.mjs` nor `init.mjs` formats after the package rename,
so a package that sorts after `java.` fails `spotless:check` and the script stops before its `init:` commit;
`mvn spotless:apply` in `backend/` and a hand-made commit got the run through.

**The pin moved the same day, to `5e75cf7`, for a docs change.** Between the fix above and the template's commit
reaching its remote, the owner scaffolded two more projects from the previous pin, and both carried the old
header, the old `CLAUDE.md` sentence and the old Article VII — the prediction in the paragraph above, observed
within the hour. The template gained a second commit first: Article VII was an empty heading over a comment that
opened with "Add what this product decides" and listed six topics, which the owner named as the thing being read
as "you have to add something here"; it now reads "None. Empty is a complete state for this section". The five
projects scaffolded by then were brought to the same wording by hand, on `main` and `dev`; the one whose Article
VII holds real articles had only its header and `CLAUDE.md` sentence changed. Checked: a `--skip-verify` scaffold
from the new pin into a scratch directory produced the new wording in all three lifted files and printed no
`/speckit.*` step. Not checked: `mvn verify` at the new pin — the diff from `4a1c6fd` touches `README.md`,
`project-root/CLAUDE.md` and `project-root/.specify/memory/constitution.md` and no build input.
