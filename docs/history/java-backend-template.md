# The Java backend template

*Authored 2026-09-16, one session. A sibling repository, not a skill: [`dulguun0225/java-backend-template`](https://github.com/dulguun0225/java-backend-template), public, flagged as a GitHub template.*

*The sections on `new-java-backend`, `build-feature` and `converge-feature` moved 2026-09-27 to `docs/history/new-java-backend.md` and `docs/history/build-feature.md` in `dulguun0225/scalith`; they are in this file's git history up to `2ab5dc4`.*

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

## What is still open

- The firing case above.
- Schemathesis, the vacuum rulesets and oasdiff: named in the template's gap table with what would wire each; not wired because the first two need a Python or Go binary and authored rulesets, the third needs a consumer.
- Whether the template should carry authentication scaffolding. The skills say nothing about it, and the template says so.
- Renovate is configured but the app is not installed on the repository; until it is, the "named path for moving a pin" is a file, not a process.

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

## 2026-09-25: the project `CLAUDE.md` states the base branch

The owner's decision: `build-feature` reads the base branch from the project's `CLAUDE.md`, the way it already
reads the definition-of-done command, because in the three service repositories `origin/HEAD` is unset and both
`dev` and `main` exist, so its discovery resolved nothing and every run without `baseBranch` stopped at preflight.
The format is one line, `` Base branch: `<branch>` ``, unindented, alone and once, read from the repository root's
`CLAUDE.md` as committed on the branch a run starts on; the record and the stub are in `build-feature`'s evidence.

Template `main` at `00639a9`: `` Base branch: `main` `` in `project-root/CLAUDE.md`, which `init.mjs` lifts to a
project's root, and in the service's own `CLAUDE.md`, the root file of a standalone repo, which also says the line
is not read where the directory is `backend/`. `main` because `new-backend.mjs` runs `git init -b main`, the root
and template CI trigger on `main`, and the ruleset protects `main`. `DEFAULT_REF` moved to it. No build input
changed, so the wall was not run; `check-traceability.mjs` and `check-forbidden-flags.mjs` green in the template,
and a `--skip-verify` vendored scaffold from the pin, with `TEMPLATE_URL` pointed at the local clone, carried the
line at the project root. **The pin names a commit that was not on the template's remote when it was recorded**:
`new-backend.mjs` fetches `main` from GitHub and refuses a pin not reachable from it, so a scaffold from the
default URL fails until the template is pushed. Per-session cost unchanged: no `description` edited.

## 2026-09-25: strict request bodies

Template `main` at `d6c598e`, ported from `netcore-platform/reference-data` `1b74507`, where update endpoints
built across four features carried the path's identifier in the body and refused a mismatch with `*-immutable`
codes; root cause and the skill side are in [java-backend](java-backend.md), *The request-body rules*. Every
`@RequestBody` binds as `BoundBody<T>`, read only by `StrictJsonBodyConverter` (undeclared member, member named
after a path variable, wrong JSON type, collected in one pass; the shared mapper's lenient setting untouched, since
broker decoding must stay tolerant). Gates: `BanListArchTest.requestBodiesBindThroughBoundBody` with fixture, meta
row and negative control; `RequestBodyContractTest`; `StrictBodyEndpointIT`, over the operations Spring's handler
mapping discovers, held equal to the committed document's request-body operations, with a test-only probe
controller for the path-variable case, since `greeting` has no body-taking route with a path variable; the vacuum
rule `request-body-schemas-are-closed`. Constitution Article IV states the rule for the plan stage. Wall green;
`DEFAULT_REF` moved to it after a full vendored scaffold from the pin ran `mvn verify` green. Per-session cost
unchanged: no `description` edited.


## 2026-09-26: any feature reads any table; only the owner writes it

Template `main` at `9fff054`. `TableOwnershipTest` failed any feature naming another feature's table, reads
included, unless it sat on `LICENSED_READERS`, which shipped empty; with `LayeringArchTest` forbidding calls into
another feature's classes, a feature needing another's rows had no path inside the build. On the owner's
instruction the read is allowed and the write stays with the owner: `onlyTheOwnerWritesATable` fails a method that
starts a write and names a table its feature does not own. Method-scoped, like the versioned-update and id-ordering
bans; ArchUnit counts a lambda toward the method declaring it, which a probe with the write inside `tx.write`
confirmed, so a service method that reads a foreign table and writes its own is reported too and the read moves to
its own method. Negative control over `starterfixtures.ownership`: the foreign write is the one violation, the
foreign read and the owner's write are not. Constitution Article VI amended to match; the directive side is in
[ai-maintainer-principles](ai-maintainer-principles.md). Wall green; `DEFAULT_REF` moved to it after a full
vendored scaffold from the pin, against a local clone, ran `mvn verify` green. Projects already built from the
template keep the old test until they pull the template into `backend/`. Per-session cost unchanged: no
`description` edited.
