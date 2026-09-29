# New Rust backend — evidence

For a human deciding whether to trust the directive text. Every claim below is *convention* — a decision recorded with its date and observed ground, no research pass and no refutation panel behind the procedure — except where a line says *(run)*: the behaviour was executed on the pinned toolchain and seen. The stack itself carries the markers of the [Rust stack record](https://github.com/dulguun0225/skills/blob/master/docs/history/rust-backend-stack.md) (2026-09-28, `review-by` 2027-03-28), which this file does not restate.

## Run the script; write nothing

**Why a template and a script rather than directives.** The same ground as `new-java-backend`: scaffolding regenerated from prose costs the first session and comes out different each time, and none of it is a decision. For Java that was observed in an agent session on 2026-09-01. **For Rust no such session was observed**; the ground here is the record's own runs, which show that on this stack a hand-written lint configuration can pass while enforcing nothing. Each was run on rustc and clippy 1.98.1 on 2026-09-28 *(run)*:

- a path under `disallowed-methods` or `disallowed-types` that does not resolve is a warning, and the build exits 0 even under `-D warnings`; `allow-invalid = true` silences the warning too; a glob such as `std::fs::*` resolves to nothing;
- `--cap-lints allow` or `--cap-lints warn`, on the command line or in `RUSTFLAGS`, makes a `forbid` violation exit 0;
- a workspace member without `[lints] workspace = true` inherits nothing and passes clippy, and stable Cargo has no check for the omission;
- a crate-local `clippy.toml` replaces the root file for that crate rather than merging with it.

The template's runs of 2026-09-29, on the same toolchain, found three more *(run)*, each recorded in its `docs/GATES.md` under *Runs the record owed*: `expect_used`, `unreachable` and every default-group lint cannot sit at `forbid`, because `#[tokio::main]`, `query!` and `#[tracing::instrument]` emit `#[allow]` attributes that `forbid` turns into E0453; confining anyhow takes four entries across `disallowed-types`, `disallowed-macros` and `disallowed-methods` (`anyhow::Error`, `anyhow::Result`, the macros, `anyhow::Context::context`); a ban path whose crate is not in a crate's dependency graph is ignored with no warning.

**What the template holds, 2026-09-29.** `dulguun0225/rust-backend-template`, public, flagged as a GitHub template, `main` at `e230ed905a0a753d04ba911289009006a69a103c`, which is the script's `DEFAULT_REF`. Every gate in the record's list is wired and shown failing by a committed canary, a negative fixture, a negative control inside a test, or a hand mutation seen failing and reverted; 142 marked ban-list canaries, and a coverage check that fails when a `clippy.toml` entry has none, so a misspelled path fails the wall. The Java template's parity items are carried: the RFC 9457 problem edge with its catalog snapshot, strict request bodies, table ownership, the guarded version-column update, the `ORDER BY id` and `OFFSET` bans, the OpenAPI snapshot with vacuum and oasdiff, the serde-to-schema round trip, the `Money` properties, the one `NUMERIC` mapper and the read-only transaction. Pins, each checked newest on 2026-09-29 against crates.io, GitHub releases and the rustup stable manifest: Rust 1.98.1 (released 2026-09-01), edition 2024, tokio 1.53.1, axum 0.8.9, tower-http 0.7.1, utoipa 6.0.0, utoipa-axum 0.3.0, sqlx 0.9.0, PostgreSQL `18.6-alpine` by digest; the rest are in the template's `README.md` *Provenance*.

**Where the template departs from the record**, each stated in its `docs/GATES.md` *Deviations from the record*: the wall starts one throwaway PostgreSQL container instead of using testcontainers, because `#[sqlx::test]` needs only `DATABASE_URL` and creates a database per test itself; the ban and `forbid` lists are longer than the record's, from the runs (among them `sqlx::Executor` methods, since `pool.execute("…")` compiles in sqlx 0.9 *(run)*); axum's `json` and `form` features are refused in `deny.toml` instead of banning the types by path; `platform` also exempts `tracing::event` and `tracing::span`, because clippy checks every macro in an expansion chain *(run)*.

**Determinism** *(run, 2026-09-29)*: the script run twice with the same name, in each mode with `--skip-verify`, produced the same tree hash for its `init:` commit (vendored twice, standalone twice). It rests on `git subtree add` or `git read-tree` at a fixed commit plus `init.mjs`, whose substitutions are a fixed list that each must match. The session that built the template reports that `cargo fmt --all` leaves the renamed tree unchanged, a 64-character name included; the script runs it anyway so a later template whose rename does move a line is formatted before the wall reads it.

**End-to-end runs**, by the session that built the template, 2026-09-29, 32 cores, dependencies and images cached: vendored with verification, wall green, 62 s; `--standalone --skip-verify`, 0.4 s, and its wall green afterwards, 85 s. The wall alone: 55 s cold, 18 s warm.

**The `dev`/`main` branch model** is carried from `new-java-backend` (2026-09-28): the script makes `dev` with `git init -b dev` and `main` at the same commit after the `init:` commit; the lifted project `CLAUDE.md` states `` Base branch: `dev` ``; `.github/rulesets/main.json` and the source check in the project-root `backend` job hold `main` to pull requests from `dev`.

## Stop where the script stops

The boundary is the script's own, stated in its header: creating the forge repository, pushing, applying the rulesets and installing the skills each have side effects outside the directory, so they are printed and not done. The printed ruleset step appears in vendored mode only, because the standalone template ships no rulesets at its root.

## What this skill does not do

**No Rust rules skill.** The record's *Owed* section lists the Rust counterparts of `java-backend-rules`, `java-backend-api`, `java-backend-observability` and the `-java` stack skills; none is written as of 2026-09-29. The template's `docs/GATES.md` cites a directive in a Java-named skill where its content is language-neutral and gives the Rust form in the row; that is the interim, and it is why this skill points there.

**Not reached by any gate in the template**, from its gap table: module layering inside one crate; branch coverage, dylint custom lints and cargo-fuzz, which are nightly-only while the build refuses nightly; OpenTelemetry export; an SBOM with osv-scanner; the outbox and Kafka relay, and caching; authentication and authorization; required checks and rulesets shown failing, which need the forge. The workflow files were not run locally; their actions are SHA-pinned.

**CI on the forge**: the template's first GitHub Actions run, 36506117148 on `e230ed9`, passed on 2026-09-29, its `backend` job in 4 min 53 s on `ubuntu-latest`. That is the template's own workflow. The project-root workflow a vendored project gets, its GitLab mirror, and the rulesets have not run on a forge.

Frontmatter is paid every session whether a skill fires or not, and this is an inception-cadence skill. It exists anyway because its description is short and the alternative is an agent writing the lint configuration the runs above show can pass while enforcing nothing; the number is in the repository's history record for the template, dated, and any description edit invalidates it.
