# New Java backend — evidence

For a human deciding whether to trust the directive text. Every claim below is *convention* — a decision recorded with its date and observed ground, no research pass and no refutation panel behind it.

## Run the script; write nothing

The observed failure this procedure answers, 2026-09-01: an agent scaffolding a greenfield Java backend from the directives alone spent its first session on build files, the compile wall, the ArchUnit ban list, lint configuration, CI and the error-response skeleton, and pinned a superseded Java LTS and a superseded Spring Boot major while passing every gate it had written. `java-backend-rules` gained its pin-creation directive from that session; the template, created 2026-09-16, is the second answer, and this skill is the procedure that lands it. The script's determinism claim — byte-identical output for a given commit, package and name — rests on `git subtree add` at a fixed sha plus `init.mjs`, whose substitutions were diffed byte-for-byte against the shell script they replaced on identical input, 2026-09-16.

Alternatives weighed the same day and rejected: keeping the scaffold procedure inside `java-backend-rules`, rejected because that skill's body is the ban lists — several thousand tokens an agent does not need while scaffolding — and the scaffold instruction sat under its gate-wiring section, after every ban, where an agent that has already started a `pom.xml` reads it too late; a resource file inside `java-backend-rules` instead of a template repository, rejected because a skill delivers decisions and a template delivers their deterministic consequences, and a file an agent reads is regenerated differently each time where a tree an agent checks out is not.

## Stop where the script stops

The boundary is the script's own, stated in its header: creating the forge repository, pushing, applying the ruleset, installing the skills and running `specify init` each have side effects outside the directory, so they are printed and not done. This skill relaxes exactly one of them — `specify init --here` — on the ground that spec-kit seeds only missing files, verified 2026-09-16 by the template's own constitution surviving it, so the step is confined to the directory after all.

## Hand off to /speckit.constitution, Article VII only

Owner decision, 2026-09-16, after the owner caught the ordering the first draft of this guidance had assumed: *"Backend-template will only run when I hit the implement stage right? Spec-kit has constitution -> specify -> plan -> tasks -> implement."* If the scaffold ran at implement, the pre-filled constitution would never reach a project, because `init.mjs` lifts `project-root/` without overwriting. The two consistent orderings were scaffold-then-spec-kit, or spec-kit-first with the platform articles restated as input to `/speckit.constitution` — the second being a paste-into-a-consumer-file mechanism, which this skill set's delivery rule bans. The owner chose scaffold first. The template's `README.md`, its project `CLAUDE.md` and the constitution's own header carry the same ordering, and `init.mjs` warns by name when a pre-existing constitution blocks the platform articles.

## What this skill does not do

Frontmatter is paid every session whether a skill fires or not, and this is an inception-cadence skill — the class this set's own history calls the worst trade. It exists anyway because the alternative was loading `java-backend-rules` whole at a moment none of its directives bind, and because a name-invoked skill can carry a description short enough that the trade is small; the number is in the repository's history record for the template, dated, and any description edit invalidates it.
