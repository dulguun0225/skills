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

Ground: the product-catalog repo's `001-product-hierarchy`, converged by hand on `main` (head `f2b5f1f`): five converge ⇄ implement passes, no fixed point, the fifth appending nothing only because the operator had stopped applying LOW findings. `build-feature`'s converge loop now carries every gap graded on the analyze scale, stops on `converged` or on a round with nothing above LOW, logs which, defaults to six rounds, and reports reaching the cap as `converge.ended: "round-cap"` on a `done` return — the wall stays the gate, red wall and unchecked appended tasks stay `needs-human`. `converge-feature` is a named entry point to that loop from `converge` to `finish` through the sibling's script, no script of its own; the rejected alternative is `/loop` with a retyped sentence, on the three grounds its SKILL.md states. Both marked *decided, not yet validated*: no scripted run has yet reached the converge stage on this table.

Per-session cost, `npm run tokens:frontmatter`, 2026-09-18, o200k_base: `converge-feature` 114 tokens (name plus description; 119 with framing), set total 4,851 across twenty-three skills, up from 4,581 across twenty-one on 2026-09-16, with `build-feature`'s description edit inside that delta. A per-feature-cadence skill like its sibling; accepted because the alternative was a sentence retyped per feature and per project with no written stop rule. Firing: meant to be invoked by name; unprompted firing on "finish this feature" unmeasured.

## What is still open

- The firing case above.
- Schemathesis, the vacuum rulesets and oasdiff: named in the template's gap table with what would wire each; not wired because the first two need a Python or Go binary and authored rulesets, the third needs a consumer.
- Whether the template should carry authentication scaffolding. The skills say nothing about it, and the template says so.
- Renovate is configured but the app is not installed on the repository; until it is, the "named path for moving a pin" is a file, not a process.
