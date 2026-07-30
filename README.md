# nc skills

Agent Skills published from the engineering-decision corpus in `raw/` — dated,
researched technology rules for repos whose code is written by LLM agents. The
skills are installed with Vercel's `skills` CLI and are **not listed in the public
skills.sh directory**; installing by repo name works regardless.

`raw/` is imported source material, not a published skill. What each skill will
be, and where it lives, is recorded in [CLAUDE.md](CLAUDE.md) — read it before
authoring anything here.

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

`npm run check` **exits non-zero while no skill has been authored** — the CLI
treats "no skills found" as a failure. That is the correct answer for this repo
today; it turns green when the first skill lands.

## Installing from this repo

```bash
npx skills add dulguun0225/skills -a claude-code -y
```
