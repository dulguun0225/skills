# New Java backend — evidence

For a human deciding whether to trust the directive text. Every claim below is *convention* — a decision recorded with its date and observed ground, no research pass and no refutation panel behind it.

## Run the script; write nothing

The observed failure this procedure answers, 2026-09-01: an agent scaffolding a greenfield Java backend from the directives alone spent its first session on build files, the compile wall, the ArchUnit ban list, lint configuration, CI and the error-response skeleton, and pinned a superseded Java LTS and a superseded Spring Boot major while passing every gate it had written. `java-backend-rules` gained its pin-creation directive from that session; the template, created 2026-09-16, is the second answer, and this skill is the procedure that lands it. The script's determinism claim — byte-identical output for a given commit, package and name — rests on `git subtree add` at a fixed sha plus `init.mjs`, whose substitutions were diffed byte-for-byte against the shell script they replaced on identical input, 2026-09-16.

Alternatives weighed the same day and rejected: keeping the scaffold procedure inside `java-backend-rules`, rejected because that skill's body is the ban lists — several thousand tokens an agent does not need while scaffolding — and the scaffold instruction sat under its gate-wiring section, after every ban, where an agent that has already started a `pom.xml` reads it too late; a resource file inside `java-backend-rules` instead of a template repository, rejected because a skill delivers decisions and a template delivers their deterministic consequences, and a file an agent reads is regenerated differently each time where a tree an agent checks out is not.

The formatter step, 2026-09-21: the first project an agent created with this skill failed `spotless:check` inside `mvn verify`, because the package rename moves the project's own imports and re-wraps lines. The script runs `mvn spotless:apply` between codegen and verify since.

The `dev`/`main` branch model, 2026-09-28: a service works on `dev` and `main` takes pull requests from `dev` only, so the script makes `dev` with `git init -b dev` and `main` at the same commit after the `init:` commit.

The tool lock, 2026-09-29: `DEFAULT_REF` moved from `52ee4d7` to `20d913a526adaab68f7b91320c23111d462a8a20`, which records every tool the template's `mise.toml` pins in a committed `mise.lock` with a checksum for Linux x64 and arm64, macOS x64 and arm64, and Windows x64 — sha256 for Node, osv-scanner and vacuum, sha512 for Maven, SHA-1 for the Liberica JDK, the only digest BellSoft publishes — and whose wall refuses a lock out of date with `mise.toml` or an entry without an accepted checksum. `mise install` refused a changed digit in the osv-scanner, Maven and JDK checksums when run by hand with mise 2026.9.7, the template's CI pin. The same move brings Jackson 3.1.7 and 2.21.7 over Spring Boot 4.1.1's 3.1.5 and 2.21.5, because three jackson-databind advisories published 2026-09-28 failed the template's osv-scanner step. From the GitHub URL at the new pin, vendored with verification: `mvn verify` green and a clean tree after the `init:` commit; the template's wall, run afterwards in `backend/`, green, with the lock checked there and at the project root. The template's GitHub Actions run 36521068269 on `20d913a` passed, `backend` in 1 min 47 s, its mise-action running `mise install --locked`.

## Stop where the script stops

The boundary is the script's own, stated in its header: creating the forge repository, pushing, applying the ruleset and installing the skills each have side effects outside the directory, so they are printed and not done.

On 2026-09-28 the spec-kit steps this skill used to carry — `specify init --here`, disabling spec-kit's `git` extension, the pre-filled constitution and the instruction to run no `/speckit.*` command after the scaffold — moved to `init-pipeline` in `dulguun0225/scalith`, and the template stopped shipping the constitution. The skill now ends at the script's `init:` commit.

## What this skill does not do

Frontmatter is paid every session whether a skill fires or not, and this is an inception-cadence skill — the class this set's own history calls the worst trade. It exists anyway because the alternative was loading `java-backend-rules` whole at a moment none of its directives bind, and because its description is short; the number is in the repository's history record for the template, dated, and any description edit invalidates it.
