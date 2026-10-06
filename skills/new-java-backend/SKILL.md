---
name: new-java-backend
description: Create a new Java backend project from the pinned dulguun0225/java-backend-template with one script. ALWAYS load before creating a new Java backend repository or project directory, or writing a pom.xml or any build file for one.
---
# New Java backend — from an empty directory to the template's init commit

**Premise, shared with every skill in this set:** the code is written by LLM agents and no human reads it line by line. The consequence for the first session of a project is specific: **scaffolding is not a decision, so nothing an agent writes during it is wanted.** The stack is decided in `backend-stack`, the rules that bind every line are in `java-backend-rules`, and the template `dulguun0225/java-backend-template` is those rules' consequence with its build-enforceable gates wired and green — the template's `docs/GATES.md` names each one it does not wire, and its module-boundary test is wired, each rule with a violating fixture asserted to fire, since the pin moved on 2026-10-06 — `java-backend-rules`' module-boundary check line says which form the pinned commit carries and how a feature adds an edge to another. This skill is the procedure that lands it, and it ends at the script's `init:` commit.

## Run the script; write nothing

**Run [`scripts/new-backend.mjs`](scripts/new-backend.mjs) from this skill's own directory, with the three inputs the user supplies, and write no file yourself.** The inputs are the base package, the artifact name and the Maven group — the only three things about a scaffold that are the project's to decide. Ask for them rather than inventing them: the package rename is permanent once the tree exists.

```
node <this skill dir>/scripts/new-backend.mjs --package <pkg> --name <artifact> --group <group> --dir .
```

The default is vendored: the directory is the project root, the template lands in `backend/` by `git subtree add` at the pinned commit, and its own `init.mjs` renames the package and lifts the project-level files one level up — root CI with `backend` and `frontend` jobs, the branch ruleset, `compose.yaml`, the `frontend/` stub, the project `CLAUDE.md`. Then jOOQ codegen, `mvn spotless:apply` — the rename moves the project's own imports and re-wraps lines, so the tree is unformatted until the formatter has run — and `mvn verify` against a real PostgreSQL, committed as `init: <artifact> from java-backend-template <sha> (mvn verify green)`. `--standalone` is for a repository that *is* the service; `--skip-verify` defers codegen and verify, and the commit message says so. The script checks its own preconditions: the directory is empty or absent, `git` and `mvn` are on `PATH`, and verify needs Docker.

The default an agent reaches for — a `pom.xml`, an ArchUnit ban list, a CI file and an error-response skeleton written from the directives in `java-backend-rules` — is rejected on three grounds: it costs the first session, it produces a different ban list each time, and on 2026-09-01 it pinned a superseded Java LTS and a superseded Spring Boot major while passing every gate it had just written. The template is one tree, byte-identical for a given commit, package and name.

**A service works on `dev`, never on `main`.** `dev` is the branch the script's `git init -b dev` makes, and the project `CLAUDE.md` it lifts states it in one line, `` Base branch: `dev` ``, beside the definition-of-done command. The script also makes `main` at the same commit, and the printed steps push both and make `dev` the forge's default branch. Everyone commits to `dev` directly — its ruleset forbids only deletion and a force-push; an existing service re-runs `node scripts/apply-ruleset.mjs` to get it. `main` takes pull requests from `dev` only, by merge commit, when `dev` is stable: the lifted `.github/rulesets/main.json` forbids a push to it, and the `backend` CI job fails a pull request into it from any other branch. Tools that read the `Base branch:` line read it from the root `CLAUDE.md` only, so the vendored `backend/CLAUDE.md`'s line is not the project's.

The pinned commit is `DEFAULT_REF` inside the script. It moves deliberately, in a commit that says which gate change it brings in; `--ref` overrides it for one run.

(Check: after the run, the directory's `git log` holds the script's `init:` commit and nothing hand-written precedes it; a build file that exists before that commit is the finding — *convention*, 2026-09-16.)

## Stop where the script stops

**Do only the printed next step that has no side effect outside the directory, and hand the rest to the user by name.** The script stops, on purpose, before anything that touches the forge or the wider machine, and prints those steps: `gh repo create`, `gh repo edit --default-branch dev`, `node scripts/apply-ruleset.mjs`, `npx skills add dulguun0225/skills -g -a claude-code -y`. Skip `npx skills add` when this skill is already installed, which it is if you are reading this. Do not create the forge repository or apply the ruleset unless the user has named the organisation and asked for it in this session.

The skill ends at the script's `init:` commit. The closing report says what was run, what failed, and which forge steps were left to the user, and stops there.

(Check: the session's tool calls contain no `gh repo create` and no `apply-ruleset` the user did not ask for by name — *convention*.)

## What this skill does not do

It does not choose the stack — `backend-stack` does, and it has. It does not state or explain a rule — `java-backend-rules`, `java-backend-api` and `java-backend-observability` do, and the template's own `docs/GATES.md` maps each wired gate to the directive it implements and names what no gate reaches. It does not verify that the template's pins were newest at its recorded date; that is the convention `java-backend-rules` names under its gate-wiring section, performed once in the template and decaying the same way. It has not been run on Windows or macOS: the script is Node on the standard library and removes the Linux assumptions that were visible, and the claim that it runs there is the standard library's until someone runs it.

**Status: *decided, not yet validated*** as a skill — the template it lands ran green on Java 25 and Spring Boot 4.1.1 on 2026-09-16, and an agent invoking this skill first created a project on 2026-09-21; that run is where the missing formatter step was found, and it is fixed above. **Firing:** whether the description earns the load unprompted on "create a new Java backend here" is unmeasured. Grounds and dates in [evidence.md](evidence.md).
