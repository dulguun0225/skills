# nc skills

Agent Skills published from the engineering-decision corpus in `raw/` — dated,
researched technology rules for repos whose code is written by LLM agents. The
skills are installed with Vercel's `skills` CLI and are **not listed in the public
skills.sh directory**; installing by repo name works regardless.

`raw/` is imported source material, not a published skill. What each skill will
be, and where it lives, is recorded in [CLAUDE.md](CLAUDE.md) — read it before
authoring anything here.

## What is published

| Skill | For an agent about to… |
| ----- | ---------------------- |
| `money` | add or change a field, a payload, a computation or a rounding step that carries an amount of money — the money type, arithmetic, rounding, fail-loud money paths, telemetry, and the evidence gates. Any language |
| `money-api` | put an amount of money on the wire — string decimals, required fields, counterparty minor units, constructor-only deserialization, idempotency keys, required preconditions, the money fuzz cases. Any language |
| `money-storage` | store an amount and read it back — column declaration, over-scale writes rejected rather than rounded, constraints the store must carry, arithmetic in the query language banned, one named read boundary, appended effect rows, migrations that compute money, and a verdict on every shape a repo assembles out of stored money. Any engine |
| `money-java` | do any of those in a Java, Spring Boot MVC, jOOQ and PostgreSQL repo — the tool that fails the build for each rule, and the one-time gate wiring. Install it **with** the three above; its checks are keyed to their rule ids |

Forty-three rules, each in exactly one skill, each carrying the kind of check it
needs, its confidence marker, and its date. **`money-storage`'s persistence group
had no review panel and two of its rules are bans** — that ceiling is the first
thing its `SKILL.md` states.

## Setup on a new machine

```bash
mise trust && mise install   # once per machine: mise refuses to run an untrusted config
npm ci                       # exact tool versions from package-lock.json
npm run check
```

`mise` pins node; `package-lock.json` pins the `skills` CLI, whose discovery
behaviour decides what counts as a skill in this repo.

## Commands

| Command | What it does |
| ------- | ------------ |
| `npm run check` | Lists the skills the CLI discovers here — the only self-check that exists. Anything it does not list is invisible to every consumer. |
| `npm run try -- <name>` | Runs one skill straight from the working tree, without installing it. |

`npm run check` lists four skills as of 2026-07-30. It checks discovery and
frontmatter, nothing else: it does not see a skill's resource files, so a broken
link inside one passes.

## Installing from this repo

```bash
npx skills add dulguun0225/skills -a claude-code -y
```
