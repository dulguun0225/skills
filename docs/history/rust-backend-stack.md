# Rust backend stack — decision record, 2026-09-28

The stack and guardrail toolchain for a second backend language option, Rust, beside the
Java 25 / Spring Boot Web MVC / jOOQ / PostgreSQL stack. **Not a skill.** No directive here
ships to a consumer. This record is the input a later pass converts into Rust skills, the way the
2026-06-11..14 platform pass was the input for the Java ones.

- **Premise.** Code written by LLM agents, reviewed by LLM agents, no human reads a diff;
  development is spec-driven (spec → plan → tasks → implementation). Same premise as every skill here.
- **Criterion.** `backend-stack`'s, applied at the library layer: rank each candidate by the
  defect classes its build can refuse to ship; name the build-failing host and tool for each
  defect class — the host list is taken for Rust as one candidate, not per library candidate;
  prefer the design where the wrong call cannot be written; price corpus gravity;
  record every loser with its ground and a re-open trigger; date each enforcement tool
  separately from the language.
- **The criterion selected here; it did not ratify.** The candidate list and the criterion were
  fixed in the research question before any winner was named; `backend-stack`'s evidence
  records no earlier selection by this criterion (2026-09-28). **It is still not an outcome**: no Rust service has run on this choice. A template carrying its gates was built and ran green on 2026-09-29 ([rust-backend-template](rust-backend-template.md)); that shows the gates can be wired, not how a service fares under them.
- **Status tier: decided, not yet validated.** Researched and decided, no production use.
- **The runs this record lists as not taken were taken on 2026-09-29**, on rustc and clippy 1.98.1
  and PostgreSQL 18.6, while building `dulguun0225/rust-backend-template`. Results are in that
  template's `docs/GATES.md`, *Runs the record owed*, summarised in
  [rust-backend-template](rust-backend-template.md). Where a line below marks one of those
  behaviours *not run* or *uncertain*, that section supersedes it; the lines are left as the
  record of what this pass knew.
- **No operability veto.** Owner, 2026-09-29: no one writes code, so whether anyone on the team has
  run a Rust service is not a question here. Deleted from this record and from `BACKLOG.md`.
- **`review-by`: 2027-03-28.** Six months, because crate releases and maintainer status moved
  within this pass's own window (cargo-mutants' README changed six weeks before it). Past that
  date every *confirmed* marker here reads as *convention*.

## Method and markers

- **Three deep-research runs** on 2026-09-28: web search over six angles per run, 24–29 sources
  fetched per run, 118–143 claims extracted, the top 25 per run put to three independent
  refutation votes against primary sources. Kills needed two refute votes of three.
- **Five follow-up verification passes** the same day, one agent each, on the layers and tools the
  runs left unverified. Where cheap, they **ran** the behaviour: rustc/clippy 1.98.1 (2026-09-01),
  cargo 1.98.1, and a throwaway PostgreSQL 17.11 container. The probe projects lived in a session
  scratch directory and are not kept; re-run before citing a version or behaviour.
- **Markers, refined from `tech-decision-research`:** *confirmed* = a claim that survived three
  refutation votes 3-0 against primary sources. *Primary-source verified* = one agent against a
  primary source, or a 2-1 vote; *(run)* after it means the agent executed the check.
  *Convention* = this record's synthesis or design inference from verified facts, kept because
  each is cheap to settle with one probe and the unsettled ones are listed under *Owed*.
  *Uncertain* = not verified.
- **Every version and date below is crates.io or GitHub as of 2026-09-28** unless marked otherwise.

## The stack, per layer

### Language and toolchain — Rust stable, exact pin, edition 2024

- **Pin**: `rust-toolchain.toml` with an exact `channel` (1.98.1 when this was written), builds with
  `--locked`. *Convention*; the pin mechanics are in *Testing and supply-chain hosts* below.
- **Async runtime: tokio.** Not ranked: axum's default features pull tokio and hyper in
  (*confirmed*), and no alternative was researched. *Convention.*

### Web framework — axum 0.8.9, with tower-http

- **Why it wins.** A malformed handler is a compile error with or without `#[debug_handler]`:
  a body extractor placed before another extractor, a non-`Send` future (an `Rc` held across
  `.await`), and a non-extractor argument each fail with `Handler<_, _> is not satisfied`
  (*primary-source verified (run)*). `#[debug_handler]` adds a readable error naming the cause
  (*primary-source verified (run)*), works only in debug-profile compiles, and must be written on
  each handler (*confirmed*). It is
  built on `tower::Service` with no middleware system of its own (*confirmed*).
- **What it does not do by default, so the stack must.** Panics in a handler drop the connection
  unless tower-http's `CatchPanicLayer` is added; that needs the `catch-panic` feature, off by
  default, and does nothing under `panic = "abort"` (*confirmed*). The 2 MB default body limit
  covers `Bytes`, `String`, `Json`, `Form`; an extractor that reads the `Body` stream directly has
  no limit unless `RequestBodyLimitLayer` is added (*confirmed*). tower-http is 0.7.1
  (2026-08-31) while axum 0.8.9 declares `^0.6.8`; the two share the tower 0.3 traits, but no
  build tested the combination (*confirmed* for the versions, *uncertain* for compatibility).
- **Maintenance.** 0.8.9 released 2026-04-14, nothing since (*confirmed*). Not dormant: 94 commits
  on `main` since that release, the latest 2026-09-28, 38 non-bot authors, an open `0.9`
  milestone with no date (*primary-source verified*).
- **Losers.**
  - **actix-web 4.15.0 (2026-08-21)** — calling `Route::to()` after `Route::wrap()` panicked at
    runtime from 4.14.0; before that it silently dropped the route's middleware. The check is a
    runtime flag, not a type (*confirmed*). Juspay Hyperswitch, a production payments switch,
    runs actix-web 4.11.0 with Diesel 2.2.10 (*primary-source verified*) — the only
    funds-handling precedent found on 2026-09-28, and it is not this stack. Re-open if the route-ordering check
    becomes a compile error.
  - **poem 3.1.12 / poem-openapi 5.1.16 (both 2025-07-28)** — no release in 14 months
    (*primary-source verified*). **It has the property the winner lacks**: poem-openapi serves
    and documents from the same `OpenApiService`, and its `Object` derive produces both the JSON
    parsing and the schema, so wire format and spec come from one derive (*primary-source
    verified*, read from the crate source, not run). Re-open if poem-openapi releases again with a
    maintainer in evidence; it would then outrank axum + utoipa on route and schema agreement.
  - **Rocket 0.5.1 (2024-05-23)** — no release in 28 months (*primary-source verified*). Re-open on
    a new release line.
  - **Loco 1.x (1.2.0, 2026-09-24)** — puts Sea-ORM 2.0 between the handler and sqlx, so the
    default path skips the compile-time checked queries chosen below (*confirmed*). Re-open if
    Loco ships a default built on sqlx without Sea-ORM.

### API contract — utoipa 6.0.0 + utoipa-axum 0.3.0, with a route-registration ban

- **The gap every candidate has.** Neither utoipa-axum nor aide guarantees that a served route is
  in the spec: both add a route only when it is registered through their own call, and a plain
  axum `.route(...)` still serves traffic while missing from the document, with no build error
  (*confirmed*). axum's `Router` exposes no route listing to check against (*primary-source
  verified*). So the route-coverage check is this stack's to write: register routes only through
  `OpenApiRouter::routes`, and ban the plain axum routing methods everywhere else
  (clippy `disallowed-methods` on `axum::Router::route`, `route_service`, `nest`,
  `nest_service`, `merge`, `fallback`, `fallback_service`, and on
  `utoipa_axum::router::OpenApiRouter::route`, `route_service`, `nest_service`, `fallback`,
  `fallback_service`, which also bypass the spec — *uncertain*, not run).
- **Second gap.** utoipa's `ToSchema` silently ignores serde attributes it does not recognise —
  `serialize_with`, `transparent`, `into`/`from`, `alias` among them — while they still change the
  JSON at runtime (*confirmed*). The check is a round-trip test per request and response type:
  serialize a value, validate it against the generated schema. *Convention.*
- **The spec is written by a test**, committed, regenerated and diffed in CI, then compared against
  the base branch with **oasdiff v1.32.1 (2026-09-15)**: `oasdiff breaking base.json rev.json
  --fail-on ERR` exits 1 on an ERR-level change (*primary-source verified*, from the docs, not
  run). oasdiff's OpenAPI 3.1 support has open issues on 3.1-only schema keywords
  (*primary-source verified*).
- **Losers.**
  - **aide** — no stable release since 0.15.1 (2025-08-19); schemars 1.x support exists only in
    0.16.0 alphas (latest alpha.4, 2026-04-14); same route-coverage gap (*confirmed*). Re-open
    when 0.16.0 ships stable.
  - **poem-openapi** — see poem above; tied to that framework.

### SQL — sqlx 0.9.0, checked macros only

- **Why it wins.** `query!` / `query_as!` ask a live PostgreSQL server to prepare each query at
  build time and receive the parameter and column types from it, so the check uses the real schema
  (*confirmed*). `cargo sqlx prepare --check` exits non-zero when the committed `.sqlx` metadata
  is stale against the migrated schema or the queries (*confirmed*). Current release 0.9.0
  (crates.io 2026-05-21; the changelog says 2026-05-06). Its `sqlx.toml` can set global type
  overrides for the macros, behind the `sqlx-toml` feature, which is off by default in the `sqlx`
  crate (*confirmed*).
- **Gate wiring, with its traps (all *confirmed*).** CI migrates a fresh database first, since the
  command never reads migration files; it runs with `-- --all-targets --all-features`, or queries
  in tests and behind features are missed; builds set `SQLX_OFFLINE=true`, because a present
  `DATABASE_URL`, including one from `.env`, takes precedence over `.sqlx`. Open bugs #1470 and
  #4117 print a warning and exit 0 on empty fresh output, a possible silent pass.
- **What it does not check.** DDL and queries built at runtime (*confirmed*). sqlx 0.9's `query`,
  `query_as`, `query_scalar`, their `_with` forms and `raw_sql` take `impl SqlSafeStr`, implemented
  for `&'static str`, `AssertSqlSafe` and `SqlStr`, so `sqlx::query(&format!(…))` fails with E0277
  (*primary-source verified (run)*, against the 0-3 vote that refuted this). Runtime SQL enters
  only through `sqlx::AssertSqlSafe` or `sqlx::QueryBuilder`: both banned by `disallowed-types`.
  Static unchecked SQL is refused by `disallowed-methods` on `sqlx::query`, `query_as`,
  `query_scalar`, `query_with`, `query_as_with`, `query_scalar_with`, `raw_sql`; at `deny` that
  ban leaves `query!` and `query_scalar!` alone (*run*). `pool.execute(AssertSqlSafe(q))` passes
  the method ban, which is why the type ban carries the load (*run*).
- **Losers.**
  - **Diesel** — checks queries against a generated `schema.rs` through the type system, and no
    step compares `schema.rs` with the live database (*confirmed* for the mechanism; the drift
    point is a verifier's analysis, and the source page is a competitor's). Re-open if Diesel
    gains a live-schema drift check.
  - **Cornucopia 1.0 (merged with Clorinde; 1.0.0 2026-05-20, 1.0.1 2026-08-14)** — same
    live-database preparation, but one patch release since a revival that followed 3.5 years of
    dormancy (*confirmed* for the dates; the mechanism vote was 2-1, *primary-source verified*).
    Re-open after sustained releases, with a regenerate-and-diff CI step.
  - **Sea-ORM, tokio-postgres** — not ranked. The one claim held about Sea-ORM, that its query
    builder is unchecked, comes from Diesel's comparison page and was not voted (*uncertain*).

### Migrations — sqlx migrate

- Plain `.sql` files squawk can lint; the migrator returns `VersionMismatch` when an applied
  migration's checksum differs from the file (sqlx-core `migrator.rs` at v0.9.0); a file beginning
  `-- no-transaction` runs outside a transaction, for `CREATE INDEX CONCURRENTLY`; `migrate add -r`
  gives reversible pairs (*primary-source verified*). The checksum refusal fires when migrations
  run, not at build, so the build gate is a diff check that existing migration files are unchanged
  against the base branch (*convention*, bespoke).
- **Loser: refinery 0.9.2 (2026-06-10)** — migrations may be Rust modules returning a string, which
  squawk cannot read; no per-migration no-transaction mode found; no revert (*primary-source
  verified*). Re-open if it gains a SQL-files-only setting and a per-migration no-transaction mode.

### Money — whole-number minor units in memory, `NUMERIC(p,s)` in the column

- **Each decimal crate assessed — rust_decimal, bigdecimal, fastnum, rusty-money — rounds silently
  somewhere** (2026-09-28).
  - **rust_decimal 1.43.0** — `+ - * / %` panic on overflow and division by zero; multiplication
    and division round half-to-even with no signal past scale 28 or a 96-bit mantissa, and
    `checked_mul` returns `Some(rounded)` (*confirmed*). Decoding a `NUMERIC` can fail, round
    silently, and encoding a scale above 28 panics (2-1, *primary-source verified*).
  - **bigdecimal 0.4.11 (2026-09-28)** — `*` is exact; `/` rounds half-up at 100 digits (set at
    build time by `RUST_BIGDECIMAL_DEFAULT_PRECISION`), ignores its own rounding-mode setting, and
    has no checked or exact division; `/` by zero panics; dividing then rounding to scale
    double-rounds (`1/(8+1e-103)` rounded half-up to scale 2 → 0.13 where 0.12 is right); `"1e999999999"` parses in 32 µs and
    the first `+` on it did not finish in 30 s; the scale addition in `*` wraps silently in release
    without `overflow-checks` (*primary-source verified (run)*).
  - **fastnum 0.7.5 (2026-06-11)** — the one crate that can refuse an inexact result (an `INEXACT`
    trap), but a trapped result is a panic only under `debug-assertions`; in release it is `NaN`,
    which sqlx encodes and a `numeric(12,2)` column accepts. One owner, no release since June
    (*primary-source verified (run)*).
  - **rusty-money 0.5.1 (2026-09-25)** — stores rust_decimal and divides through its `checked_div`,
    so it inherits the silent rounding above (*primary-source verified*).
- **The choice.** `Money { minor: i64, currency }` — a whole number of the currency's minor units —
  with no `Mul<Money>` impl (`money * money` is E0369) and only `#[must_use]` checked methods.
  Fractional work (interest, FX, pro-rata) happens in `i128` checked operations through one
  function, `mul_div_round(amount, num, den, mode) -> Option<i128>`, which is the only place
  division is written and names its rounding mode at each call (`money` `M-7`). What the build
  refuses around it (*primary-source verified (run)*): `arithmetic_side_effects` flags `+ - *` on
  integers; `integer_division` and `integer_division_remainder_used` flag `/` and `%` by a
  constant, which `arithmetic_side_effects` misses; `as_conversions` flags `as`; `unused_must_use`
  plus `let_underscore_must_use` flag a discarded checked result, including `let _ =`;
  `disallowed-methods` flags `i64::checked_div`, `div_euclid` and `Iterator::sum`/`product`, since
  `.sum()` over `i64` wraps in release unseen by any arithmetic lint; `overflow-checks = true` in
  the release profile makes that wrap a panic. sqlx 0.9 has no `i128` encoding for PostgreSQL
  (*run*).
- **The column stays `NUMERIC(p,s)`, as `money-storage` `M-10` states.** sqlx maps `NUMERIC` only to
  `BigDecimal` and rust_decimal (*confirmed*), so the one mapper `M-37` names decodes through
  sqlx's `bigdecimal` feature and converts to minor units, failing loud when the value has digits
  past the currency's exponent or does not fit `i64`; `BigDecimal` is banned by
  `disallowed-types` everywhere else. A bounded `NUMERIC(p,s)` column cannot hand the mapper the
  unbounded exponent that stalls bigdecimal. *Convention* — the conversion was not run.
- **The alternative this reopens, recorded and not taken.** `money-storage` lists integer minor
  units as a storage type excluded by `M-10`'s wording, marked *convention*, and **reopening
  "where language decimal support weak enough that `M-1` easier to enforce over integer type."**
  The findings above are that condition, measured. The verifier recommended `BIGINT` columns; this
  record keeps `NUMERIC(p,s)` because the ground that rejected minor units on the wire (`M-12`:
  every reader must know the exponent) applies equally to every reader of the table, and because
  keeping it leaves `M-10`, `M-31` … `M-34` and `M-43` true as published. Changing `M-10` is the
  owner's decision, not this record's; the owner kept `M-10` on 2026-09-29, and `money-storage`
  now states the ground and no longer lists weak decimal support as reopening the column type.
- **Loser grounds and re-open triggers.** rust_decimal: silent rounding (re-open if a release adds
  exact or refusing multiplication and division). bigdecimal as the arithmetic type: silent
  division rounding, no checked division, unbounded work on large exponents (re-open if a release
  adds checked or context division and bounds input exponents; also if amounts outgrow `i64`, as
  18-decimal assets do). fastnum: refusal needs a trap context on each value and a
  `[profile.release.package.fastnum] debug-assertions = true` override (*run*) — a profile
  setting, as the chosen design's `overflow-checks` is, so the ground is the per-value context
  and one owner, pre-1.0 (re-open at 1.0, or with a second owner and a type-level inexact
  refusal). rusty-money: inherits rust_decimal (re-open if it changes its number type).

### JSON — serde with source rules

- By default serde ignores unknown fields; `#[serde(deny_unknown_fields)]` is per container, with
  no crate-wide setting, and its guarantee does not hold on a struct using `#[serde(flatten)]`
  (*confirmed*). A missing `Option<T>` field becomes `None` with no error, by the maintainer's
  deliberate choice, with no container switch; the per-field fix is
  `#[serde(deserialize_with = "Deserialize::deserialize")]`, and a field or container
  `#[serde(default)]` undoes it (*confirmed*). A missing non-`Option` field is an error.
- So every request type carries a source rule: `deny_unknown_fields` present, no `flatten`, no
  `default`, and every `Option` field either carries that `deserialize_with` or uses a wrapper
  type. The host is ast-grep, with its false negatives, in *Testing and supply-chain hosts* below.
  *Convention.*

### Errors — thiserror; anyhow only at the edges

- thiserror 2.0.21 (2026-09-23), anyhow 1.0.104 (2026-07-18), snafu 0.9.2 (2026-07-21)
  (*primary-source verified*). A thiserror enum mapped to a problem response by a `match` with no
  wildcard arm is checked for exhaustiveness by the compiler (E0004); `anyhow::Error` is opaque and
  only `downcast` recovers the type, which no check covers (*convention*, language semantics).
  anyhow is allowed in `main`, startup code and tests, and banned from domain crates by
  `disallowed-types` (*uncertain*, not run).
- **Loser: snafu** — pre-1.0, and no compiler guarantee thiserror lacks. Re-open at snafu 1.0, or if
  thiserror goes twelve months without a release.

### Observability — tracing and OpenTelemetry

- tracing 0.1.44 (2025-12-18); opentelemetry, opentelemetry_sdk, opentelemetry-otlp,
  opentelemetry-appender-tracing 0.33.0 (2026-09-18); tracing-opentelemetry 0.34.0 (2026-09-23)
  (*primary-source verified*). The project's own status table: **traces Beta** (API, SDK, OTLP
  exporter); metrics API and SDK Stable, OTLP exporter RC; logs API, SDK and appender Stable, OTLP
  exporter RC (*primary-source verified*). Pin exact 0.x versions. Re-open the trace pin when the
  table marks the trace SDK Stable.

### Async handoff — the repo's own outbox table, Kafka through a relay

- `async-handoff` binds: outbox row written in the state change's transaction, a relay publishing to
  the broker, nothing else polling the table (`E-4`, `E-5`), and an append that takes a nominal
  transaction handle (`E-6`), with `E-6`'s rollback integration test. The broker follows
  `async-handoff-java`'s conditional pick — self-hosted Kafka with a named owner, NATS JetStream
  off Kubernetes, the platform's own queue on a managed platform; the Rust client below covers
  only the Kafka case, and no NATS or managed-queue client was researched.
- **The choice.** The outbox table lives in this repo's migrations; the append is a sqlx `query!`
  taking a newtype over `&mut sqlx::Transaction<'_, Postgres>` that only the transaction seam
  constructs; the relay publishes with **rdkafka 0.39.0 (2026-01-25)** (*primary-source verified*
  for the version). *Convention.* rdkafka binds the C library librdkafka, so `unsafe_code = "forbid"`
  in this workspace does not reach it; no pure-Rust Kafka client was researched.
- **Losers.**
  - **apalis-postgres 1.0.0-rc.9 (2026-09-16)** — can enqueue in the caller's sqlx 0.9 transaction
    (*primary-source verified*), but it is a job queue its workers poll, which `E-4` bans, and it
    has no stable release. As the outbox, only a change to `E-4` reopens it; as a job runner,
    re-open at 1.0.
  - **pgmq 0.33.7 (2026-09-14)** and **sqlxmq 0.6.0 (2025-05-25)** — both depend on sqlx 0.8, and
    two semver-incompatible sqlx versions have distinct `Transaction` types, so neither can join a
    sqlx 0.9 transaction (*primary-source verified* for the dependency; the incompatibility was
    inferred, not compiled); both are consumer-polled queues, which `E-4` bans. As the outbox,
    only a change to `E-4` reopens them.
  - **lapin 4.12.0** — RabbitMQ, which `async-handoff-java` permits only for stated strict priority.
    Re-open only where strict message priority is a stated requirement.

## The guardrail gates

A gate counts only when it fails the build. Each line: the defect class, then the host and setting.

### Compiler and lints — `forbid` where no dependency macro allows the lint, otherwise `deny` plus a source rule

- **Why not `forbid` throughout.** A manifest `deny` can be overridden by `#[allow]` in source;
  `forbid` makes `#[allow]`, `#![allow]` and `#[expect]` on the lint error E0453 (*run*). **E0453
  also fires on an `#[allow]` a dependency's macro emits** (*run*, clippy 1.98.1): `sqlx::query!`
  wraps its expansion in `#[allow(clippy::all)]` and, with a bind parameter,
  `#[allow(clippy::unreachable)]`; `#[tokio::main]` emits `#[allow(clippy::expect_used, …)]`;
  `#[tracing::instrument]` on an `async fn` emits `#[allow(clippy::unreachable, …)]`. So
  `expect_used`, `unreachable`, `await_holding_lock`, `await_holding_invalid_type`,
  `disallowed_methods` and `disallowed_types` — and any lint in clippy's default groups — are
  `deny`, and a source rule fails the build on any `allow` or `expect` attribute in first-party
  source that names a ban lint; macro-emitted attributes are not in the source text
  (*convention*, bespoke, not run). The other ban lints are `forbid`: `unwrap_used`,
  `arithmetic_side_effects`, `indexing_slicing` and `as_conversions` at `forbid` build cleanly
  beside `query!` (*run*). A canary crate using every macro in the stack keeps the `forbid` list
  honest. `clippy::allow_attributes` at deny catches only outer `#[allow]` — not `#![allow]`, not
  `#[expect]` (*confirmed*) — and `allow_attributes_without_reason` accepts any string
  (*primary-source verified*).
- **Unsafe code** — `[workspace.lints.rust] unsafe_code = "forbid"`; plain `cargo build` fails
  (*run*). Dependencies are not reached; cargo-geiger's last release is 0.13.0 (2025-08-31) and
  probably undercounts edition 2024 `#[unsafe(...)]` attributes (*confirmed*), so it is not a gate.
- **Panics in request paths** — clippy `unwrap_used`, `expect_used`, `panic`, `indexing_slicing`,
  `todo`, `unimplemented`, `unreachable` (*run*). `clippy.toml` keys `allow-unwrap-in-tests`,
  `allow-expect-in-tests`, `allow-panic-in-tests`, `allow-indexing-slicing-in-tests` exempt
  `#[cfg(test)]` code even at forbid; `todo`, `unimplemented`, `unreachable` have no test key; an
  unknown key is a hard error (*run*). Runtime safeguard beside it, not a gate: `CatchPanicLayer`.
- **Integer overflow and lossy casts** — `[profile.release] overflow-checks = true` (*run*: panics;
  without it, wraps); clippy `arithmetic_side_effects`, `integer_division`,
  `integer_division_remainder_used`, `as_conversions`, `cast_possible_truncation`, `cast_sign_loss`,
  `cast_precision_loss`, `cast_possible_wrap` (*run*). `arithmetic_side_effects` ignores floats,
  `Wrapping` and `Saturating`, and its `clippy.toml` allow-lists exempt a named type silently
  (*confirmed*).
- **Float money** — `float_arithmetic`, `float_cmp` (*run*).
- **Discarded results** — `unused_must_use` and clippy `let_underscore_must_use`; `let _ =` passes
  `unused_must_use` alone (*run*).
- **Non-exhaustive matching** — `wildcard_enum_match_arm`; `match_wildcard_for_single_variants`
  fires only when `_` covers one variant (*run*). rustc's `non_exhaustive_omitted_patterns` is
  nightly-only and silently ignored on stable (*run*), so a foreign `#[non_exhaustive]` enum's
  required `_` arm is unchecked; how `wildcard_enum_match_arm` treats that arm was not run
  (*uncertain*).
- **Locks across `.await`** — `await_holding_lock` for std and parking_lot guards (*run*);
  `await_holding_invalid_type` checks nothing until types are listed in `clippy.toml`
  (*confirmed*).
- **Banned APIs and types** — `disallowed-methods`, `disallowed-types` in `clippy.toml`: a
  resolving ban fails the build; **a misspelled path is only a warning, exit 0 even under
  `-D warnings`**, and `allow-invalid = true` silences even that (*run*). Both lints sit at `deny`
  (see above). Initial list: `std::thread::sleep` and each blocking `std::fs` function by full path
  (`std::fs::read`, `std::fs::write`, `std::fs::read_to_string`, …) in async crates — a glob such
  as `std::fs::*` resolves to nothing and fails nothing (*run*) — as the substitute for a
  blocking-in-async lint, crate-wide, not per function; `BigDecimal` outside the money mapper;
  `anyhow::Error` in domain crates; `sqlx::AssertSqlSafe`, `sqlx::QueryBuilder` and the unchecked
  sqlx query functions; the axum and utoipa-axum routing methods; and the money methods listed
  above. *Convention* for the list. **Scoping** ("outside the money mapper", "in domain crates",
  "in async crates") is done by a crate-local `clippy.toml`, which replaces the root file for that
  crate rather than merging with it (*run*); the money mapper is therefore its own crate.

### Guards on the lint configuration itself

- **The CI command** — `--cap-lints allow` or `--cap-lints warn`, on the command line or in
  `RUSTFLAGS`, makes a `forbid` violation exit 0; `-A` does not (*run*). `cargo build` runs no
  clippy lints (*run*). So CI runs one pinned `cargo clippy --workspace --all-targets
  --all-features --locked`, and a script fails when `--cap-lints` appears in CI config, when
  `RUSTFLAGS` is set, or when `.cargo/config.toml` carries `rustflags`. *Convention*, bespoke.
- **Workspace inheritance** — a member without `[lints] workspace = true` inherits nothing and
  passes clippy (*run*); stable Cargo has no check for the omission, `-Zcargo-lints` being
  nightly-only (*run*). A script over `cargo metadata` manifests requiring the line fails the
  build (*run*; it matches text and misses the inline `lints.workspace = true` form).
- **Ban-list canaries** — one committed violation per `disallowed-*` entry that clippy must reject,
  and a ban on `allow-invalid`, because a misspelled path fails nothing. *Convention.*
- **Code hidden from clippy** — `cfg(clippy)`, `cfg(not(clippy))` and `cfg_attr(clippy, …)` in
  first-party source make `cargo build` compile code `cargo clippy` never reads: an `unwrap` and
  an index in a `#[cfg(not(clippy))]` function beside a `#[cfg(clippy)]` stub pass clippy at
  `forbid` (*run*). A source rule fails the build on any of them (*convention*, bespoke).
- **Edits to the configuration** — `Cargo.toml` `[lints]`, every `clippy.toml` or `.clippy.toml`
  in the tree, `CLIPPY_CONF_DIR` in CI config, `rust-toolchain.toml`, `.cargo/config.toml`,
  `deny.toml`, `.squawk.toml` narrow gates with no error when edited.
  `guardrails-toolchain` names this shape under *Record the caveat that bites, per tool*: a
  per-rule override is a suppression, and the decidable half is a committed suppression inventory
  that CI diffs. Here that inventory is these files plus every `#[allow]`, `#[expect]` and
  `squawk-ignore` in the tree. *Convention.*

### Schema, contract and migration hosts

- **Query/schema drift** — sqlx macros plus `cargo sqlx prepare --check`, wired as above
  (*confirmed*).
- **Migration hazards** — squawk v2.66.0 (2026-09-23) over the plain-SQL migrations, with rules
  including `require-concurrent-index-creation`, `adding-not-nullable-field`,
  `constraint-missing-not-valid` (*primary-source verified*). An agent can write
  `-- squawk-ignore <rule>` or `-- squawk-ignore-file`, so a grep fails the build on either
  (*convention*). One effective maintainer (*primary-source verified*). Whether squawk exits
  non-zero on a violation was not run (*uncertain*).
- **Edited applied migration** — diff check against the base branch; see *Migrations*.
- **Breaking API change** — oasdiff, see *API contract*. Plus the route-registration ban and the
  schema round-trip test there.

### Dependency hosts

- **cargo-deny, 0.19.1 or later** — advisories, licences, bans, sources. Before 0.19.1
  (2026-04-10) it dropped crates from its graph in two feature cases and printed "bans ok" over a
  banned crate, and its default database staleness limit was about 14.8 years instead of 90 days
  (*confirmed*). `[bans] deny = [{ crate = "x", wrappers = ["y"] }]` is an error when any crate not
  named in `wrappers` depends directly on `x` (*confirmed*) — the crate-graph layering host: sqlx
  only under the database crate, axum only under the HTTP crate. Name-matched, and a wrapper can
  re-export the banned crate's types. Set `multiple-versions` and `wildcards` explicitly; the claim
  about their defaults was refuted. `main` carries version 0.20.2 at commit 74543bb, 2026-09-18
  (*confirmed*); the latest release and its date were not established — the claim naming them was
  refuted 0-3 — so cadence is unknown.
- **cargo-shear v1.14.0 (2026-09-22)** — unused dependencies are errors by default;
  `--deny-warnings` covers the rest (*confirmed*). Declared feature-complete, in maintenance mode,
  one maintainer by authorship (2-1, *primary-source verified*).
- **cargo-semver-checks v0.50.0 (2026-08-01)** — exit 100 for violations, 101 when the check could
  not run (*confirmed*). Applies only to a crate with a published public API; not a gate for the
  service binary.

### Testing and supply-chain hosts

- **Mutation testing — cargo-mutants v27.1.0 (2026-06-02)**, `--in-diff` on each change. The exit
  code order is baseline failure (4), then any timeout (3), then missed mutants (2), so one
  timeout hides every miss; the gate passes exit 0, passes exit 3 only when `mutants.out/missed.txt`
  is empty, fails everything else, and reads the file right after each run (*confirmed*). The
  maintainer changed the README on 2026-08-17 from "actively-maintained" to
  "semi-actively-maintained", no release since 2026-06-02, one person carrying the project
  (*primary-source verified*; three verifiers found it independently while refuting an
  "actively maintained" claim 0-3).

- **Coverage — cargo-llvm-cov 0.9.1 (2026-09-06)**: `--fail-under-lines`, `--fail-under-regions`,
  `--fail-under-functions` exit 1 below the threshold. **Branch coverage requires nightly and has
  no threshold flag** (*primary-source verified*), so only line, region and function thresholds
  are gates on stable.
- **Property tests — proptest 1.11.0 (2026-03-24)**; quickcheck 1.1.0 (2026-02-10) is the
  alternative; bolero 0.13.4 (2025-07-03) is over a year without a release (*primary-source
  verified*). **Fuzzing — cargo-fuzz 0.13.2 (2026-06-09) needs nightly** (*primary-source
  verified*), so it runs as a separate nightly job or not at all.
- **Real-database tests — `#[sqlx::test]`** creates a new database per test and applies the
  `migrations` folder automatically; databases of failed tests are kept until the next run
  (*primary-source verified*). The PostgreSQL server comes from testcontainers 0.28.0
  (2026-08-06) with testcontainers-modules 0.15.0 (2026-02-21); their mutual compatibility was not
  checked (*uncertain*).
- **Source rules — ast-grep 0.45.3 (2026-08-31)**: `ast-grep scan` exits 1 on a match only when the
  rule has `severity: error`; `warning` exits 0 (*run*). Two rules written and run for the serde
  gate — a `struct_item` following a `derive(... Deserialize ...)` attribute and not following
  one containing `deny_unknown_fields`; an `Option` field in such a struct not following
  `deserialize_with = "Deserialize::deserialize"`. They catch `#[derive(serde::Deserialize)]`,
  `cfg_attr(..., derive(Deserialize))` and `std::option::Option`, and leave swapped attribute
  order unflagged. **A doc comment between the derive and the struct stops rule one from matching
  the struct** (*run*). The `flatten` and `default` bans and `enum` request types have no rule
  yet: a `Deserialize` enum without `deny_unknown_fields`, `#[serde(flatten)]` and
  `#[serde(default)]` all pass the scan (*run*); a
  type alias of `Option`, a derive produced by another macro, and attributes added through
  `cfg_attr` are expected misses, not run (*uncertain*). The pattern form `Option<$T>` is a parse
  error; the rule has to match by `kind` and `regex`. Matching is on the syntax tree with no type
  resolution. semgrep lists Rust as generally available, but whether the open-source CLI carries it
  was not established (*primary-source verified* / *uncertain*).
- **Custom compiler lints — dylint 6.1.0 (2026-09-23)**: a lint library is built against a specific
  nightly with `rustc_private`, and the linted project is built with that nightly
  (*primary-source verified*). So a dylint gate needs the project to compile on a pinned nightly
  in a separate job. marker (rust-marker) has had no release since 2023-12-28 (*primary-source
  verified*); not a host.
- **Layering — crate boundaries plus a check on `Cargo.toml`.** A crate cannot use a crate it does
  not declare: `domain` importing `sqlx` fails with E0433, and adding `sqlx` to
  `domain/Cargo.toml` is all it takes to compile (*run*). So the gate reads the declared edges:
  `cargo metadata --no-deps` lists each crate's direct dependencies for an allow-list script
  (*run*), or cargo-deny `wrappers` (above). Inside one crate, only `pub(crate)` visibility reaches
  module layering; cargo-modules 0.27.0 (2026-08-03) is current, cargo-archtest 0.1.8
  (2021-06-15) is stale (*primary-source verified*). **No maintained Rust tool matches ArchUnit's
  in-crate module rules** (*convention*: cargo-modules and cargo-archtest checked, 2026-09-28), so
  layering is carried by crate boundaries.
- **Advisories — cargo-audit 0.22.2 (2026-06-05)** exits 1 on a vulnerable dependency by default
  (*run*, RUSTSEC-2021-0003); cargo-deny's advisories check covers the same database. cargo-vet
  0.10.2 (2026-01-13) is recorded, not chosen.
- **Toolchain pin** — rustup follows `rust-toolchain.toml` with an exact `channel` and installs the
  toolchain when missing; `cargo build --locked` fails when `Cargo.lock` would change (*run*).
- **Mutation-testing alternatives** — mutagen's last release is 0.1.2 (2018-10-10), last commit
  2022-07-29; no maintained alternative to cargo-mutants was found (*primary-source verified*).

## Named gaps — where no Rust tool reaches

- **Rounding correctness inside `mul_div_round`** — mode and point of rounding for day counts and
  FX. Tests against the spec only: `money`'s property, golden and replay directives.
- **sqlx nullability misinference** — a `NOT NULL` column returned through an outer join can be
  inferred non-null and fail at runtime with `UnexpectedNull` (issue #3202 open; fix PR #4285
  unmerged) (*confirmed*). The `col AS "col?"` override is convention; no gate enforces it.
- **Runtime-built SQL** — enters only through `AssertSqlSafe` or `QueryBuilder`, both banned; what a
  permitted exception builds is unchecked (see *SQL*).
- **Blocking calls in async functions** — no clippy lint on 1.98.1 (*run*); the method ban is
  crate-wide, not per function.
- **Cancellation safety and futurelock** — `tokio::select!` drops the losing branches, tokio
  documents cancellation safety as a property authors judge by hand, and the futurelock deadlock
  class (Oxide RFD 609) has no lint (*uncertain*; extracted from tokio docs and the RFD, not voted).
- **Served route versus spec, and serde versus schema** — bespoke ban and round-trip test only.
- **Branch coverage on stable** — nightly-only in cargo-llvm-cov, with no threshold flag.
- **Module layering inside one crate** — no maintained tool; crate boundaries carry it.
- **A foreign `#[non_exhaustive]` enum's `_` arm** — the stable lint that would reach it does not
  exist on stable.
- **Unsafe code in dependencies** — including librdkafka through rdkafka.
- **How LLM agents circumvent Rust lints** — no claim survived in any run. The gates above assume
  `#[allow]`, `#[expect]`, `--cap-lints`, `cfg(clippy)`, config edits and new workspace members
  as the routes, because those are the ones the runs showed to work.

## Against the Java choice's loser grounds

- **Silent zero-defaults on deserialization (C#'s ground).** Rust shares half of it: serde errors on
  a missing required field, but silently maps a missing `Option` to `None` and ignores unknown
  fields, with no crate-wide switch, so the rule is per type. Worse than one global setting.
- **Open, non-exhaustive enums (C#'s ground).** Rust does not share it: local enums are closed,
  a non-exhaustive `match` is E0004, and `wildcard_enum_match_arm` refuses the `_` escape. The
  exception is foreign `#[non_exhaustive]` enums.
- **Silently rounding decimal operators (Kotlin's ground).** Rust shares it — in a stronger form
  than Kotlin's for rust_decimal, where `*` rounds too; bigdecimal's form is Kotlin's, `/` only.
  Java's `BigDecimal.multiply` is exact. Closed only by the minor-units choice and the arithmetic
  lints.
- **No maintained mutation testing (Go's ground).** Rust has one mutation tool, maintained through
  2026-06, and its maintainer lowered its status in 2026-08. Maintained, single point of failure.
- **Statement-only coverage (Go's other ground).** Rust gates line, region and function coverage on
  stable; branch coverage is nightly-only with no threshold. Between Go and Java.

**No language-layer verdict is taken.** Rust shares two grounds the Java pass rejected candidates
on. The closure used here, integer minor units, is equally available to Kotlin and Go, so it weakens
those losers' grounds as much as it rescues Rust's.

## Corpus gravity, priced before the choice is final

**No claim about which crates or idioms LLMs default to in Rust survived any run.** The list
below is this record's expectation, *convention*, and each item already has its ban above:
`.unwrap()` and `.expect()`; `anyhow::Result` everywhere; `f64` for money; rust_decimal for money;
`#[derive(Deserialize)]` with serde's defaults; `sqlx::query(&format!(...))`; `std::sync::Mutex`
held across `.await`; `#[allow(...)]` to clear a lint; `unsafe` to clear a borrow error. One
measured data point from this repo: on 2026-08-11 bare `claude-sonnet-5` sessions wrote `bigint`
minor units for money storage 2/2 (`money-storage`, its defaults list). **Unlike the Java
stack, the Rust corpus defaults are mostly loud** — a panic, a compile error — rather than
runtime-silent configuration; the silent ones are serde's defaults, decimal rounding, `as` casts,
`let _ =` on a checked result, and integer wrap in release (`.sum()` over `i64` gave
`-9223372036854775808`, *run*).

## Refuted — do not restate as fact

- sqlx nullability inference errs only toward nullable (1-2).
- Queries with `IN` lists built from a vector are not compile-time checked (0-3).
- rust_decimal's `round_dp` defaults to banker's rounding (1-2).
- `#[serde(default)]` is opt-in and serde never zero-defaults (1-2).
- `deny_unknown_fields` "cannot be combined" with `flatten` (0-3; the combination compiles, the
  guarantee fails).
- cargo-mutants is "actively maintained" (0-3).
- A `RUSTFLAGS -A` overrides a manifest lint level (1-2; the run agrees for `forbid`; `deny` was not run).
- A misspelled `disallowed-methods` path fails loudly (0-3; the run agrees: warning, exit 0).
- cargo-deny's release cadence and its `multiple-versions` / `wildcards` defaults (both 0-3).
- utoipa's `routes!` makes served and documented paths unable to drift (1-2).
- aide derives routes and parameters from the router (0-3).
- A sqlx `BigDecimal` too large for `NUMERIC` encodes a sentinel and fails at the server (0-3; the
  run shows a client-side encode error once weight or scale exceeds `i16`, and a server `22P03`
  only for a scale from 16384 to 32767).
- The full axum 0.8.x release list, Loco's 1.0.0 date and author, aide's owner list (each refuted).

## Refuted by the vote, contradicted by a run — the run stands

- sqlx 0.9's `SqlSafeStr` makes a `format!()` query fail to compile (vote 0-3; E0277 on sqlx 0.9.0,
  run 2026-09-28).
- `#[debug_handler]` adds no check beyond diagnostics (vote 0-3; the three malformed-handler cases
  fail to compile without it, run 2026-09-28; other cases not run).

## Owed before the Rust skills are written

Closed on 2026-09-29 and removed from this list: the money column decision (the owner kept `M-10`;
[money](money.md)), the runs not taken and the template repository (both in
[rust-backend-template](rust-backend-template.md)).

- **Unresearched**: a pure-Rust Kafka client; a production service holding funds on axum + sqlx
  (none verified); LLM circumvention of Rust lints.
- **The rules skills**: the Rust counterparts of `java-backend-rules`, `java-backend-api`,
  `java-backend-observability` and the `-java` stack skills.

## Sources

Primary sources the surviving claims rest on, checked 2026-09-28:

- sqlx: https://docs.rs/crate/sqlx/latest/source/FAQ.md, https://docs.rs/sqlx/latest/sqlx/macro.query.html,
  https://github.com/launchbadge/sqlx/blob/main/sqlx-cli/README.md,
  https://github.com/launchbadge/sqlx/blob/main/sqlx-cli/src/prepare.rs,
  https://github.com/launchbadge/sqlx/blob/main/CHANGELOG.md,
  https://github.com/launchbadge/sqlx/blob/v0.9.0/sqlx-core/src/migrate/migrator.rs,
  https://github.com/launchbadge/sqlx/blob/v0.9.0/sqlx-core/src/migrate/source.rs,
  https://docs.rs/sqlx/latest/sqlx/postgres/types/index.html,
  https://github.com/launchbadge/sqlx/issues/3202, https://github.com/launchbadge/sqlx/pull/4285
- Diesel, Cornucopia, refinery: https://diesel.rs/compare/compare_diesel/,
  https://github.com/cornucopia-rs/cornucopia, https://github.com/rust-db/refinery
- Money: https://github.com/paupino/rust-decimal/blob/master/src/ops/mul.rs,
  https://github.com/paupino/rust-decimal/blob/master/src/arithmetic_impls.rs,
  https://github.com/paupino/rust-decimal/issues/834,
  https://github.com/akubera/bigdecimal-rs (commit 374b2a2),
  https://github.com/neogenie/fastnum (commit abb12de),
  https://github.com/varunsrin/rusty_money (commit 55c8dfe)
- serde: https://serde.rs/container-attrs.html, https://github.com/serde-rs/serde/issues/2214,
  https://github.com/serde-rs/serde/issues/2283, https://github.com/serde-rs/serde/blob/master/serde_derive/src/de.rs
- axum, tower-http, actix-web, Loco, poem, Rocket: https://docs.rs/axum/latest/axum/attr.debug_handler.html,
  https://docs.rs/axum/latest/axum/extract/struct.DefaultBodyLimit.html,
  https://docs.rs/tower-http/latest/tower_http/catch_panic/struct.CatchPanicLayer.html,
  https://github.com/tokio-rs/axum, https://github.com/actix/actix-web/blob/main/actix-web/CHANGES.md,
  https://github.com/loco-rs/loco/releases/tag/v1.0.0, https://crates.io/crates/poem-openapi,
  https://github.com/rwf2/Rocket, https://github.com/juspay/hyperswitch/blob/main/crates/router/Cargo.toml
- API contract: https://docs.rs/utoipa-axum/latest/utoipa_axum/macro.routes.html,
  https://docs.rs/utoipa/latest/utoipa/derive.ToSchema.html,
  https://github.com/tamasfe/aide/blob/master/crates/aide/CHANGELOG.md, https://github.com/oasdiff/oasdiff
- Lints and Cargo: https://rust-lang.github.io/rust-clippy/master/index.html,
  https://doc.rust-lang.org/clippy/lint_configuration.html,
  https://github.com/rust-lang/rust-clippy/issues/13425,
  https://rust-lang.github.io/rfcs/3389-manifest-lint.html,
  https://doc.rust-lang.org/cargo/reference/lints.html
- Supply chain and mutation: https://embarkstudios.github.io/cargo-deny/checks/bans/cfg.html,
  https://raw.githubusercontent.com/EmbarkStudios/cargo-deny/main/CHANGELOG.md,
  https://github.com/obi1kenobi/cargo-semver-checks/releases, https://github.com/Boshen/cargo-shear/releases,
  https://github.com/geiger-rs/cargo-geiger/releases, https://github.com/sourcefrog/cargo-mutants,
  https://github.com/stratalab/strata-core/issues/3225
- Migration lint, observability, handoff: https://squawkhq.com/docs/,
  https://github.com/open-telemetry/opentelemetry-rust/blob/main/README.md,
  https://github.com/apalis-dev/apalis-postgres, https://github.com/Diggsey/sqlxmq,
  https://crates.io/crates/pgmq, https://crates.io/crates/rdkafka
- Async gaps: https://docs.rs/tokio/latest/tokio/macro.select.html,
  https://rfd.shared.oxide.computer/rfd/0609, https://github.com/rust-lang/rust-clippy/issues/10794
