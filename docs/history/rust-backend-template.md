# The Rust backend template

*Authored 2026-09-29, one session for the template and one for the skill. A sibling repository, not a skill: [`dulguun0225/rust-backend-template`](https://github.com/dulguun0225/rust-backend-template), public, flagged as a GitHub template, first published at `e230ed905a0a753d04ba911289009006a69a103c`, pinned at `c7e4ce213431dae1ea61791729ab6786c66c77bf` after the adversarial review below, and at `c5a25907efb2e4ceb376b19374c7952d6705dea8` after the image scan (last section). The skill that lands it is `new-rust-backend`. The sections before the review's describe the template at `e230ed9`.*

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

- **`new-rust-backend`**, new: `SKILL.md`, `evidence.md` and `scripts/new-backend.mjs`, `DEFAULT_REF` = `e230ed9` at first, `c7e4ce2` after the review. It states that no Rust rules skill exists and points at the record and the template's `docs/GATES.md` by absolute URL.
- **`npm run gates`' dangling-pointer check**: its repo-only filename rule matched `docs/history` inside an absolute URL, so the one form the authoring invariants allow for a link leaving the skill dir failed the build. It now removes URLs from the line before matching, and its *does not decide* list gains the case it gives up: an absolute URL into this repository is not checked against the files here. Shown still failing a bare `docs/history/…` and `BACKLOG.md` by an injected line, reverted.
- **`backend-stack`**: the opening list of stack-shaped skills that assume the choice gains both scaffold skills, and *Where the rest of this lives* gains `new-rust-backend`. **`guardrails-toolchain`** *Wiring the gates*: a Rust sentence beside the Java one, naming which steps the Rust template wires and that its gap table, unlike the Java one, has no row for the steps it leaves to the repo.
- **`java-backend-rules`**: read, left alone. Its greenfield instruction is scoped to its own stack and names no scaffold as the only one.
- `README.md`: a `new-rust-backend` row and a Rust paragraph beside the Java template's. `BACKLOG.md`: the runs row removed, *The Rust skills* narrowed to the rules skills, a row for the template's missing gap rows (closed by the review, last section), the bare-fixture firing row given the Rust number, and the corpus-audit row's case count replaced by *every case*. The [stack record](rust-backend-stack.md): its *Owed* section narrowed the same way, a status line saying its runs were taken and where the results are, and its *not an outcome* line narrowed to say a template now exists and no service has run. `CLAUDE.md`: one line in the history index. [wired-gates](wired-gates.md): the gate change above.
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
- The record's *Unresearched* items: a pure-Rust Kafka client, a production service holding funds on axum and sqlx, how LLM agents circumvent Rust lints.
- The script has not run on Windows or macOS, and no agent has yet created a project by invoking the skill.
- What the review left is the template's *Not reached* table. The container image scan left it the same day (last section); the licences of the image's packages and the integrity of trivy's database are named there instead.

## 2026-09-29, later: the adversarial review of record

One adversarial review of the template ran after its first publish; it is the review of record for the template and for `new-rust-backend`. Its fixes are fifteen template commits, `e230ed9..c7e4ce2`, each gate change with what shows it failing in the template's `docs/GATES.md`.

**What it found in the template.** About fifteen routes that built banned code while every check stayed green, each run on a scaffolded service: `#![warn(warnings)]`; code under `cfg(not(debug_assertions))`, a negated feature or `cfg(coverage)`; `#[path]` and `include!`; a build-script cfg; a path dependency outside the workspace; renamed lint names; profile, `CARGO_*`, `--config` and `.cargo` overrides of the overflow and panic settings. SQL rules defeated by quoted or qualified names, and SQL clocks and `uuidv7()`. `connect_lazy` running statements outside a transaction. A stale `Cargo.lock` passing, because cargo-deny ran without `--locked`. The pager's `$1 IS NULL OR` seek becoming a filter under a generic plan (199,990 of 200,000 rows read), and a zero page limit. A log-capture test failing 3 times in 100 runs, 0 in 200 after its fix. A renamed `Deserialize`, and flow-style `uses:` missed by the action-pin check. The suppression inventory not hashing the gates' own files, and documentation claims the code did not bear out. **Every one was a route the first publish's canaries and fixtures called covered**, which is the *run the check over the pass that just finished* class on a template: the gates had been shown failing on the inputs their author chose.

**What it added.** gitleaks 8.30.1 in the wall, with two canaries; a row in the template's gap table for each `guardrails-toolchain` step it leaves to the repo (steps 1, 2, 6, 7 and 8), mirroring the Java template; a container image scan named there as a gap, because trivy could not be downloaded where the review ran. Ban canaries went from 142 to 160 marked lines.

**What it found in the script, fixed here.** A name `init.mjs` refuses left a half-made directory, because the script set its keep flag before the rename; the printed `--skip-verify` step ran the wall outside mise, and now prints `mise trust && mise install && cargo fmt --all && mise exec -- node scripts/wall.mjs`; verification did not check for mise before creating anything, and mise is now required for it; a `--dir` naming a file threw `ENOTDIR`, and is now refused first; `DEFAULT_REF` moved to `c7e4ce2`. One more, found while fixing the first: a failure before the rename in an existing empty directory removed only `.git`, leaving the template's files; it now empties the directory.

**Verification.** The template's wall green in 49 s after the review, by the reviewing session; GitHub Actions run 36511569716 on `c7e4ce2` passed, `backend` in 3 min 12 s. This session, from the GitHub URL with no `TEMPLATE_URL`: vendored with verification, wall green in 56 s, 60 s in all, clean tree after the `init:` commit; `--name api` refused by `init.mjs` and nothing left behind, both in a directory the script made and in an existing empty one; a `--dir` naming a file refused before anything was created. The BACKLOG row for the missing gap rows closed, and `guardrails-toolchain`'s Rust sentence now says step 4's secrets half is wired, the image scan is a named gap, and each step left to the repo has its row. Frontmatter unchanged: no description was edited.

## 2026-09-29, later: the image scan

The review had left the container image scan in the template's *Not reached* table because the trivy download timed out where it ran. It downloaded here, and the scan is wired in template commit `c5a2590`; `DEFAULT_REF` moved to it.

**The pin.** trivy 0.74.0 in `mise.toml`, the newest release on 2026-09-29 (2026-08-14). Checked against Aqua's advisory for the 2026-03 compromise, GHSA-69fq-xp46-6x23, read through the GitHub API: the affected binary is v0.69.4 only, with the Docker Hub images 0.69.5 and 0.69.6. v0.74.0 is an immutable GitHub release whose tag commit, `e1fd17a`, is an ancestor of trivy's `main`. A debug install showed mise's aqua backend verifying the checksums file's sigstore bundle and then the archive's checksum; separately, the archive's sha256 matched the checksums file and GitHub's asset digest, the bundle's certificate names `https://github.com/aquasecurity/trivy/.github/workflows/reusable-release.yaml@refs/tags/v0.74.0`, its Rekor entry is dated 2026-08-14 11:27 UTC, and the extracted binary is byte-identical to the one mise installed *(run)*. The pin is a version, not a hash in the repository; a `mise.lock` would carry one, and the template's gap table says so.

**The gate.** `scripts/image-scan.mjs` builds the `Dockerfile` as `<binary>:wall` and runs `trivy image --scanners vuln` over it. HIGH and CRITICAL fail whether or not a fix exists: an unfixed one is exposed all the same, and `--ignore-unfixed` would hide it with no record. The one exception is a `.trivyignore` entry, `<id> exp:<yyyy-mm-dd>` under a line giving its reason, which the script parses strictly and the suppression inventory lists with its reason — the Java template's `osv-scanner.toml` shape. trivy gets no `TRIVY_*` variable but the cache directory and no `trivy.yaml`; with `TRIVY_IGNORE_STATUS=fixed` set, trivy run directly passed the canary and the script still refused it *(run)*. The scan must find the operating system and its packages, and fails on a release past its end of support. The database is trivy's default cache locally and an `actions/cache` entry per UTC day in both GitHub workflows; GitLab keeps it under `backend/target`. It changes daily, so an unchanged tree can fail on a new advisory, as with cargo-deny.

**Shown failing, every run.** The `Dockerfile`'s final base plus a dpkg record for openssl 3.5.1-1 must be refused naming a HIGH or CRITICAL in that package (nine on 2026-09-29, CVE-2025-15467 among them), pass with every finding in a generated ignore file, and be refused again with each entry expired; the ignore-file parser has one fixture per rule; the suppression selftest reports a new `.trivyignore` entry, and an unlisted entry in the real tree failed the inventory *(run)*. The service image had no HIGH or CRITICAL finding, fixed or not: debian 13.7, 14 packages.

**Not reached, named in the template's table.** The licences of the image's packages: trivy's `license` scanner rates the base's GPL and LGPL packages HIGH *(run)*, so wiring it means choosing an allowlist, which is the project's call. The integrity of trivy's database, fetched by tag with no signature check.

**Cost.** Local, 32 cores, Docker 29.8.1: the wall green in 106 s with no trivy database and no service image (the image step 83 s: the database download in the canary's 29 s, the release build 53 s, the scan 1 s), and 24 s warm, up from 18 s. Any change to a file the build context holds rebuilds the image in about a minute here, since the `Dockerfile` has no cache mount. GitHub Actions run 36515259994 on `c5a2590` passed, `backend` in 4 min 4 s against 3 min 12 s on `c7e4ce2`, the wall 134 s of it and the image step 100 s (canary with the database download 16 s, build 84 s), with no trivy cache; the day's cache was saved at its end.

**Here.** `new-rust-backend`: `DEFAULT_REF`, `SKILL.md` and `evidence.md`. `guardrails-toolchain`'s Rust sentence: step 4 now names the trivy scan, its pin, and the two new gaps; the licence paragraph under *Licences gate deny-by-default* was left, since the image's licences are still not read. Swept and left: `BACKLOG.md`, `README.md` and the [stack record](rust-backend-stack.md) never called the image scan missing. The scaffold, from the GitHub URL at the new pin, vendored with verification: wall green in 227 s, the image build 148 s of it, 232 s in all, clean tree after the `init:` commit *(run)*. Frontmatter unchanged: no description was edited.

## 2026-09-29, later: every mise tool pinned by checksum

Owner-approved the same day. `guardrails-toolchain` step 4 says every scanner is pinned by digest; the template
pinned its tools by version in `mise.toml` and nothing in the repository held their bytes, so a replaced release
artifact would have installed silently. *The image scan*'s "the pin is a version, not a hash in the repository"
held until this section. Template commit `5cdc93a`.

**The mechanism, run with mise 2026.9.16, the version the template's CI pins.** `mise lock` writes `mise.lock`;
no setting enables it, and `mise install` uses a lock that exists. `mise install` refused an artifact whose
recorded checksum had one changed digit — trivy in the template's lock, gitleaks (aqua backend) and squawk
(github backend) in a scratch one — exit 1, naming the expected and the actual sha256. With
`[tool_config] locked = true` in `mise.toml` it refused a tool at a version the lock lacks; without it, the same
install took the new version and rewrote the lock. An entry with its checksum line removed installed unverified,
and mise wrote the computed checksum back. `jdx/mise-action` adds `--locked` when a lock is present (read from its
source at the pinned SHA; the run's log says so). *(run)*

**Lock format.** 2026.9.16 writes format 3 for a new lock, which 2026.9.15 and 2026.9.7 reject; `mise lock`
keeps an existing lock's format. The lock was written with 2026.9.7 as format 2, which 2026.9.7, 2026.9.15 and
2026.9.16 read *(run)*, so a developer's older mise and the Java template's CI pin can read it. Its checksums and
urls equal those of a separate 2026.9.16 run. Writing the five platforms took about fourteen minutes on this
machine: `mise lock` downloads each artifact to verify its provenance before recording it.

**The gate.** `scripts/check-mise-lock.mjs`, the wall's first step, reads `mise.toml` with the `mise.lock` beside
it here, in `project-root/` while the template carries it, and at the project root when vendored. It refuses a
listed tool with no entry at its exact version and options, an entry `mise.toml` does not list or a second
version of one, a platform among linux-x64, linux-arm64, macos-x64, macos-arm64 and windows-x64 without a url or
a sha256, sha512 or blake3 checksum, a missing lock, `locked` or `lockfile_platforms` unset, and a declared
exemption that no longer applies. Eighteen fixtures under `scripts/fixtures/mise-lock/`, each refused by its rule
alone, every run; the stale lock is `stale--version`, the missing checksum `checksum`.

**Exemptions, each a row in *Not reached*.** `cargo:sqlx-cli`: mise's cargo backend records no artifact; cargo
checks each crate it downloads against the crates.io index. cargo-mutants on linux-arm64 and macos-arm64: 27.1.0
publishes x86_64 builds only, so there is nothing to record or install there. Not in the lock at all: the Rust
toolchain, which rustup checks against its channel manifest, and mise itself, which `jdx/mise-action` checks
against the release's minisign-signed `SHASUMS256.txt`.

**The suppression inventory hashes `mise.lock`.** Until now the inventory left out every file Renovate moves, so
a pin move would not fail it; `mise.lock` is the exception, because it holds the checksum each tool installs
against. The cost: a Renovate pull request that moves a mise pin fails the inventory until
`node scripts/check-suppressions.mjs --write` is pushed to it. Renovate's mise manager refreshes the lock itself:
its `updateArtifacts` runs `mise lock <tool>`, under `MISE_SAFE=1` when the mise it runs is 2026.7.12 or newer
(read from `lib/modules/manager/mise/artifacts.ts` on Renovate's `main`, 2026-09-29). `MISE_SAFE=1 mise lock
gitleaks` after moving the pin, on an untrusted config holding `[tool_config]` and `[settings]`, refreshed all
five platforms *(run)*; Renovate itself was not run. GitLab CI's mise cache now keys on `mise.lock`.

**Verification.** The wall green locally in 230 s. GitHub Actions run 36521097208 on `5cdc93a` passed, `backend`
in 4 min 30 s, mise-action running `mise install --locked`. The scaffold from the GitHub URL at the new pin,
vendored with verification: wall green in 182 s, the lock checked in `backend/` and at the project root, 187 s
in all, clean tree after the `init:` commit *(run)*.

**Here.** `new-rust-backend`: `DEFAULT_REF`, `SKILL.md` (the pinned commit carries the lock; sqlx-cli's checksum
among the gaps) and `evidence.md` (*The tool lock*). `guardrails-toolchain`'s template paragraph: trivy "pinned by
version to a release whose checksums mise checks" narrowed to the lock, with its two exemptions, and the Java
sentence given the same. Swept and left: `README.md`, `BACKLOG.md` and `CLAUDE.md` say nothing of how the
templates pin tools. Frontmatter unchanged: no description was edited.

## 2026-10-07: the duplicate member at any depth, typed field params, and the pin at `b6e9f07`

Template commits `aacc689`, `626180d`, `4bb47f4` and `b6e9f07`, pushed to `main` before this pin moved. `aacc689`
moves the runtime base image's digest: the wall's image scan refused `libssl3t64` 3.5.7-1~deb13u2 for CVE-2026-75804
and CVE-2026-84782, fixed in deb13u3. `626180d` closes the gap `java-backend-api` *A member given twice is refused*
recorded the same day against `5cdc93a` — the reader refused a repeated top-level member only, and kept one of two
values of a repeated nested one — and declares each field code's params as typed fields carried in the field error
and in the catalog snapshot. Directive side: [java-backend](java-backend.md).

**The intermediate commits failed on the forge, and why.** Run 37560089618 on `626180d`: cargo-deny refused
`yoke-derive` 0.8.3 as yanked — a yank after `5cdc93a`, whose lock holds the same version; a local wall passed the
same step against a cached index. `4bb47f4` moves the crate to 0.8.4; its run 37560854932 failed because the lock
canary ran offline and needed a warm cargo index, which a cold runner lacks. `b6e9f07` runs the canary with the
check's own command, online. A pin to `626180d` was committed here and rewritten to `b6e9f07` before it was pushed.

`DEFAULT_REF` moved from `5cdc93a` to `b6e9f07`. GitHub Actions run 37561471844 on `b6e9f07` passed on a cold cargo
cache, `backend` in 4 min 58 s. The scaffold from the GitHub URL at the new pin, vendored with verification into a
fresh scratch directory, removed afterwards: wall green in 141 s, clean tree after the `init:` commit *(run)*.
Per-session cost unchanged: no `description` edited.
