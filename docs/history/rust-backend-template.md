# The Rust backend template

*Authored 2026-09-29, one session for the template and one for the skill. A sibling repository, not a skill: [`dulguun0225/rust-backend-template`](https://github.com/dulguun0225/rust-backend-template), public, flagged as a GitHub template, `main` at `e230ed905a0a753d04ba911289009006a69a103c`. The skill that lands it is `new-rust-backend`.*

## Why it exists

The [Rust stack record](rust-backend-stack.md) of 2026-09-28 chose the stack and the gate list and owed two things before any Rust skill: the runs it had read or inferred rather than taken, and a template carrying the gates as `java-backend-template` does for Java. The reason for a template is the one [java-backend-template](java-backend-template.md) records: scaffolding is the consequence of decisions, identical across projects on one stack, and regenerated from prose it costs the first session and comes out different each time. The record adds a Rust-specific reason from its own runs: a hand-written lint configuration on this stack can pass while enforcing nothing — a misspelled `disallowed-methods` path exits 0 under `-D warnings`, `--cap-lints` silences `forbid`, a member without `[lints] workspace = true` inherits nothing.

## What it is

A Cargo workspace on Rust 1.98.1, edition 2024, one crate per layer: `platform` (clock, UUIDv7 ids, the typed logging facade, the wire-code catalogs, the keyset pager), `money` and `money-sql` (the one `NUMERIC` mapper), `db` (the migrator and `Tx`, the one transaction seam), `store` (feature SQL, checked macros only), `web` and `api` (RFC 9457 problems, the strict body reader, one module per feature with `greeting` as the worked example), `server` (the binary). One Node script, `scripts/wall.mjs`, is the whole wall; the template's own CI and a project's `backend` job both run it. It starts one throwaway PostgreSQL 18.6 container per run. The template's `docs/GATES.md` maps every gate to the record section or published directive it implements and to what shows it failing, lists the record's deviations, and names what no gate reaches; this record does not restate it.

It has the Java template's two modes and branch model: vendored into a project's `backend/` by `git subtree add`, with `scripts/init.mjs` lifting `project-root/` (root CI with `backend` and `frontend` jobs for GitHub and GitLab, `dev` and `main` rulesets, `compose.yaml`, the `frontend/` stub, the project `CLAUDE.md`) one level up; or standalone, where `init.mjs` moves the base branch to `dev`. `--name` is its only project input.

**Every gate in the record's list is wired, green, and shown failing** by a committed canary, a negative fixture, a negative control inside a test, or a hand mutation seen failing and reverted — 142 marked ban-list canaries, and a coverage check that fails when a `clippy.toml` entry has no canary, which turns a misspelled path from a warning into a failure.

## What was lifted, and from where

From the [Rust stack record](rust-backend-stack.md): the stack, the pins' starting points, the `forbid`/`deny` split, the ban list and every guard on the lint configuration. From `java-backend-template`: the parity items — the RFC 9457 problem edge with its catalog snapshot, strict request bodies, table ownership, the guarded version-column update, the `ORDER BY id` and `OFFSET` bans, the OpenAPI snapshot with vacuum (its `rules/openapi.yaml`) and oasdiff, the serde-to-schema round trip, the `Money` properties, the read-only transaction — plus the migration fixtures, `frontend-gate.mjs`, the `project-root/` shape and the `dev`/`main` model. The skill's script is `new-java-backend`'s, with one input instead of three, `cargo fmt` and the wall in place of codegen, `spotless:apply` and `mvn verify`, and the wall run through `mise` when it is on `PATH`.

**The runs the record owed were taken, 2026-09-29, on rustc and clippy 1.98.1 and PostgreSQL 18.6**, and are recorded in the template's `docs/GATES.md` under *Runs the record owed*, each beside the gate that re-runs it. In short: every lint in the `forbid` list builds beside the stack's macros, while `expect_used`, `unreachable` and the default-group lints must stay `deny` (E0453 on the `#[allow]` that `#[tokio::main]`, `query!` and `#[tracing::instrument]` emit), and `tokio::select!` trips `integer_division_remainder_used` in its own expansion, so the template uses `poll_fn`; confining anyhow takes four ban entries, and a ban path whose crate is not a dependency is ignored silently; `NUMERIC` round-trips to minor units, refusing excess precision, values past `i64` and NaN, with a `sqlx.toml` override decoding every NUMERIC as `DbAmount`; squawk exits 1 on a finding and 0 on a file carrying a file-level ignore, hence the ban on it; all twelve routing-method bans fire; tower-http 0.7.1 builds with axum 0.8.9 and the panic and body-limit layers answer 500 and 413; `wildcard_enum_match_arm` over a foreign `#[non_exhaustive]` enum fires when `_` covers a known variant and passes when every known variant is listed. Found beside them: `pool.execute("…")` compiles in sqlx 0.9 and is now banned, and `sqlx prepare --check` passes with a warning on an empty regeneration, so the wall compares the regenerated files with `.sqlx` itself.

**Deviations from the record**, each in `docs/GATES.md`: the wall-managed PostgreSQL container instead of testcontainers; ban and `forbid` lists longer than the record's, from the runs; axum's `json` and `form` features refused in `deny.toml` instead of path bans; `platform` exempting `tracing::event` and `tracing::span`.

## What it changed here

- **`new-rust-backend`**, new: `SKILL.md`, `evidence.md` and `scripts/new-backend.mjs`, `DEFAULT_REF` = `e230ed9`. It states that no Rust rules skill exists and points at the record and the template's `docs/GATES.md` by absolute URL.
- **`npm run gates`' dangling-pointer check**: its repo-only filename rule matched `docs/history` inside an absolute URL, so the one form the authoring invariants allow for a link leaving the skill dir failed the build. It now removes URLs from the line before matching, and its *does not decide* list gains the case it gives up: an absolute URL into this repository is not checked against the files here. Shown still failing a bare `docs/history/…` and `BACKLOG.md` by an injected line, reverted.
- **`backend-stack`**: the opening list of stack-shaped skills that assume the choice gains both scaffold skills, and *Where the rest of this lives* gains `new-rust-backend`. **`guardrails-toolchain`** *Wiring the gates*: a Rust sentence beside the Java one, naming which steps the Rust template wires and that its gap table, unlike the Java one, has no row for the steps it leaves to the repo.
- **`java-backend-rules`**: read, left alone. Its greenfield instruction is scoped to its own stack and names no scaffold as the only one.
- `README.md`: a `new-rust-backend` row and a Rust paragraph beside the Java template's. `BACKLOG.md`: the runs row removed, *The Rust skills* narrowed to the rules skills, a row for the template's missing gap rows (below), the bare-fixture firing row given the Rust number, and the corpus-audit row's case count replaced by *every case*. The [stack record](rust-backend-stack.md): its *Owed* section narrowed the same way, a status line saying its runs were taken and where the results are, and its *not an outcome* line narrowed to say a template now exists and no service has run. `CLAUDE.md`: one line in the history index. [wired-gates](wired-gates.md): the gate change above.
- `scripts/firing-cases.json`: two bare-fixture cases, `new-rust-backend-1` and `-2`.

## What it costs every session, and whether it fires

**Frontmatter: 61 tokens** for `new-rust-backend` (`npm run tokens:frontmatter`, 2026-09-29, o200k_base; 1,651 across the set with it). Its description is 231 characters; the set total is 6,848 of the 8,000 `check:descriptions` allows. An inception-cadence skill — loaded once per project — which this set's history calls the worst trade; it is kept because the description is short and the default it replaces writes lint configuration that can pass while enforcing nothing.

**Firing: 6/6**, first-move mode, `claude-opus-5`, Claude Code 2.1.284, linux, 2026-09-29, $1.19: two bare-fixture cases written as engineer requests (a Rust service in an empty directory; a Cargo workspace and CI for an axum and sqlx API), three repeats each. Explore mode and other models were not measured. `new-java-backend` has no case and remains unmeasured.

## Verification

- The template, by the session that built it, 2026-09-29, 32 cores, Docker 29.8.1: the wall green, 55 s cold with dependencies and images cached and 18 s warm; the scaffold vendored with verification, wall green, 62 s; `--standalone --skip-verify`, 0.4 s, its wall green afterwards, 85 s.
- **The template's first GitHub Actions run**, 36506117148 on `e230ed9`, passed, the `backend` job in 4 min 53 s on `ubuntu-latest`. The project-root workflows and the rulesets have not run on a forge.
- This session: the script run twice per mode with `--skip-verify`, same name, gave the same tree hash for the `init:` commit each time (vendored `15a02e7`, standalone `d69a3d8`), and the vendored tree's root `CLAUDE.md` read `` Base branch: `dev` ``.
- This repo: `npm run check` lists `new-rust-backend`; `npm run gates` passes.

## What is still open

- **The Rust rules skills** — `BACKLOG.md`, *Harvest owed — Rust*. Until one exists the template's `docs/GATES.md` is where a Rust rule is read.
- **The template's gap table has no row for `guardrails-toolchain`'s unwired items.** The Java template's table carries one each for the defect-class-to-layer map, the enumeration of consumer-bound surfaces, the threshold guardians and the per-tool selection record; the Rust one has none, and neither wires nor names a secrets scan or an image scan over its `Dockerfile`. The rows belong in the template, in a commit that moves `DEFAULT_REF`.
- The record's *Unresearched* items: a pure-Rust Kafka client, a production service holding funds on axum and sqlx, how LLM agents circumvent Rust lints.
- The script has not run on Windows or macOS, and no agent has yet created a project by invoking the skill.
