# The Java backend template

*Authored 2026-09-16, one session. A sibling repository, not a skill: [`dulguun0225/java-backend-template`](https://github.com/dulguun0225/java-backend-template), public, flagged as a GitHub template.*

## Why it exists

The owner observed, using these skills with `github/spec-kit`, that the first implementation session of a greenfield project goes to scaffolding: build files, the compile wall, the ArchUnit ban list, lint configuration, CI, the error-response skeleton. That work is expensive in tokens and time, it is regenerated from prose differently each time, and none of it is a decision. The skills deliver decisions at the moment they are made; the scaffolding is the *consequence* of those decisions, identical across every project on the same stack, so it belongs in a template that is instantiated, not in a skill that is read.

The alternative considered and rejected the same day: a `template/` resource inside `java-backend-rules` that a hook or script materialises. A skill directory is the whole world its consumer has, and a hundred-file template is not a context-window artifact. The sibling repo also keeps the owner's 2026-08-03 delivery rule intact: nothing here asks a consumer to paste anything into a `CLAUDE.md`. The template ships its own `CLAUDE.md`, which is the consuming repo's file from the first commit.

## What it is

Maven reactor, two modules, Spring Boot 4.1.1 Web MVC, jOOQ 3.21.7 over PostgreSQL 18, Flyway, Java 25, exact pins throughout. `starter-platform` holds `Money`, `RoundingPolicy`, `Ids` (UUIDv7), `Tx` (the one transaction seam, detached records), the RFC 9457 error contract, the typed logging facade, `KeysetPager`, the migrations and the generated jOOQ tree. `starter-app` holds the deployable, the correlation filter, the exception handler and its catalog, a `greeting` worked-example feature, the committed OpenAPI document, and every architecture and contract test. `scripts/init.sh` renames package, group and modules in one command and was exercised on a scratch copy before the first commit.

Every gate `mvn verify` and the workflow run, mapped to the directive it implements, is the template's own `docs/GATES.md`, together with the directives the skills state that nothing there reaches. That file is the pointer the two skill edits below rely on; it is one hop from the consuming repo, not from here, and this record does not restate it.

Two things in it are worth naming here because they answer defects this repo recorded:

- **One violating fixture per ArchUnit rule, asserted.** `async-handoff-java` `E-25` states that ArchUnit's empty-should guard is one property from being disabled and that a rule pointed at the wrong package passes silently. The template makes every ban rule a static field, and a negative-control test evaluates each over a fixtures package and fails if any finds nothing. Seventeen rules, seventeen fixtures, reconciled by reflection with the ban-coverage meta-test.
- **The jOOQ regenerate-twice check ran and was byte-identical.** `java-backend-rules` named gap 9 said the stronger reproducibility form was never verified against the jOOQ generator on this stack. The template regenerates under `Pacific/Kiritimati` and `tr_TR.UTF-8` and diffs both runs; jOOQ 3.21.7 on a one-table schema came out identical. The gap is narrowed in the skill, not closed: one schema is a sighting.

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
