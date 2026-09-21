// build-feature — one spec-kit feature from a finished spec to a converged,
// wall-green, pushed feature branch, with no human gate.
//
// Run through Claude Code's Workflow tool:
//   Workflow({ scriptPath: "<this skill dir>/workflow.mjs", args: { baseBranch, ... } })
//
// THE SPEC IS NOT THIS RUN'S. A domain expert writes specs/<NNN>-<name>/spec.md in
// the project with /speckit-specify and /speckit-clarify, on the feature branch those
// commands created, and hands the finished spec over; this script starts at plan. No
// stage, review fix or repair pass edits spec.md, and a finding whose only remedy is
// a change to the spec is a needs-human exit naming it, addressed to its author — the
// one artifact in the feature directory this run reads and never writes.
//
// Every stage is a fresh subagent with its own model and effort (the TIERS table
// below; args.tiers overrides any entry). The script is plain JavaScript in the
// Workflow sandbox: no filesystem, no Date, no Node APIs — an agent does every
// read and write, and the script only decides what runs next.
//
// Stages, in order:
//   preflight → plan → review-plan ⇄ fix-plan → tasks → analyze ⇄ remediate
//   → implement (one agent per phase) → converge ⇄ implement → finish
//
// Preflight is also discovery, and it runs on every entry, restarts included: the
// feature directory comes from args.featureDir, else from the checked-out branch name,
// else — on the base branch — from the one directory under specs/ with a written spec
// and no plan, and only then from .specify/feature.json, which is git-ignored local
// state and is the one thing here that can be stale. A run that starts at a later stage
// still gets state.branch and state.featureDir that way (before 2026-09-21 a
// `from: "plan"` restart left the branch null, and the handoff and finish prompts
// degraded to "(unknown)" and HEAD@{1}).
//
// Preflight also puts the repository where the build belongs. The feature's author works
// on the base branch, so a full preflight started there checks out the feature branch —
// making it when it does not exist — and then merges the base into it; so does every
// later entry that finds itself on a feature branch. Without that merge the run plans
// against a spec the author has since moved and fails its final `merge --ff-only` after
// the whole run is paid for. It writes .specify/feature.json to match, because spec-kit's
// own scripts resolve the feature from that file (or SPECIFY_FEATURE_DIRECTORY) and
// never from the branch name.
//
// Review and analyze loops terminate on a clean verdict or on their round cap; a
// cap reached with blocking findings still open ends the run with status
// "needs-human" and the findings, never with a silent approval. The converge loop
// is different: it has no fixed point (evidence.md, 2026-09-18), so its only stop
// test is a severity floor — the loop ends when the round's findings hold nothing
// above args.severityFloor — and reaching its round cap is a reported outcome the
// run carries to finish, not a human question; the wall is still the gate. The
// default floor is NONE: it tolerates no graded finding at all, so the only clean
// stop is a round that appends nothing and grades nothing, and a long run ends at
// maxConvergeRounds rather than at the floor (owner's decision 2026-09-18,
// reversing the LOW default of the same day; evidence.md). A round that reports
// "converged" while grading findings above the floor appended nothing, so every
// further round would repeat it identically — which under NONE is any finding at
// all. Until 2026-09-18 that was a needs-human exit, and it dead-ended the loop on
// cosmetic findings it could have closed itself (feature specs/002-product exited
// on four LOW findings — FR traceability citations, an under-described GATES.md
// table row, two test and naming wordings — every one of them mechanical). The
// loop now has a third move: it appends those findings itself as a forced
// convergence phase and implements them (the `forceAppend` tier row), because a
// floor that refuses converge's non-actionability judgment must also supply the
// work that judgment withheld. Each finding is forced at most once; a finding that
// comes back above the floor after its forced round did go to a human, and the
// handoff says the loop already tried. Like the review and analyze loops, converge
// runs one pass more than its cap — an assess-only round that appends nothing — so
// the findings the run reports are the ones no implement pass has closed.
//
// Every needs-human exit writes a handoff file first — HANDOFF.md in the feature
// directory — carrying the stage, the reason, the full findings rendered legibly,
// the branch, the round counts, the stages run, the run's date and the path of the
// machine-local run journal, committed on the feature branch and pushed when
// args.push is true. Gap observed 2026-09-18 on run wf_7e4e8726-4b5 (converge, three
// findings): the payload existed only in the invoking session's tool result, a /tmp
// file and the run journal under ~/.claude/projects/, so no colleague could reach it.
// The sandbox has no filesystem, so the write is one agent (the `handoff` tier row,
// sonnet low) dispatched on the way out; it is wrapped so that a handoff which fails,
// errors or returns nothing still yields the full needs-human payload, with the
// outcome recorded under `handoff` on the return. An exit before discovery has
// resolved a feature directory, or one taken on the base branch, writes nothing and
// says so there instead: there is no feature branch to carry the file, and a dirty
// tree is one of the states preflight refuses on, so a commit at the repo root — or
// on the base branch — would sweep it up.

export const meta = {
  name: 'build-feature',
  description: 'Build one spec-kit feature from a finished spec with no human gate: plan, review, tasks, analyze, implement per phase, converge until clean, push',
  whenToUse: 'When a feature directory already holds the spec its domain expert wrote, and the project is a spec-kit project whose definition of done is one command',
  phases: [
    { title: 'Preflight', detail: 'feature directory, branch, repo state, definition of done' },
    { title: 'Plan', detail: 'plan, fresh-context review, fix' },
    { title: 'Tasks', detail: 'tasks, analyze, remediate' },
    { title: 'Implement', detail: 'one agent per phase, wall green after each' },
    { title: 'Converge', detail: 'converge, implement appended phase — or append the findings the round graded but did not append, once each — repeat until nothing above the severity floor is left' },
    { title: 'Finish', detail: 'wall, push, optional fast-forward merge' },
    { title: 'Handoff', detail: 'on a needs-human exit: write, commit and push HANDOFF.md in the feature directory' },
  ],
}

// ---------------------------------------------------------------------------
// Tiers. The roster is six (model, effort) pairs — Haiku, Sonnet low, Sonnet
// medium, Opus low, Opus medium, Fable low — and every row, from this table or
// from args.tiers, must be one of them; tier() refuses any other before the
// first agent starts. Model aliases resolve to the latest model of each line.
// Haiku is in the roster with no effort named; a row on it passes low. The
// rationale per row is in SKILL.md.
// ---------------------------------------------------------------------------
const ROSTER = { haiku: ['low'], sonnet: ['low', 'medium'], opus: ['low', 'medium'], fable: ['low'] }

// The severity scale is /speckit-converge's own Step 5 scale, most severe first, and
// the same four values the analyze schema carries. args.severityFloor names the
// highest severity the converge loop tolerates. NONE is the default and tolerates
// nothing: it ranks below every graded severity, so every finding the assessment
// grades is above it. CRITICAL is not offerable: Step 5 defines it as a constitution
// MUST violation or a gap blocking a P1 user story, so a floor there tolerates every
// finding the scale has, stops the loop after one round, and is a foot-gun wearing
// the shape of a knob. The floor is checked beside the tier rows, so a bad one fails
// the run before the first agent starts rather than hours in at the converge stage.
const SEVERITY_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const SEVERITY_FLOORS = ['HIGH', 'MEDIUM', 'LOW', 'NONE']
const TIERS = {
  preflight: { model: 'sonnet', effort: 'low' },
  plan: { model: 'fable', effort: 'low' },
  reviewPlan: { model: 'fable', effort: 'low' },
  fixPlan: { model: 'opus', effort: 'medium' },
  tasks: { model: 'opus', effort: 'medium' },
  analyze: { model: 'opus', effort: 'medium' },
  remediate: { model: 'opus', effort: 'medium' },
  remediateCritical: { model: 'opus', effort: 'medium' },
  phases: { model: 'sonnet', effort: 'low' },
  implement: { model: 'opus', effort: 'medium' },
  converge: { model: 'opus', effort: 'medium' },
  // Writes the tasks a converge round graded and declined to append. Unlike the
  // `handoff` row below, the document is not rendered for it: it is handed findings
  // and must author one task per finding — the imperative work that closes it and its
  // trace back to the finding's location. One closure route, the fix. Until 2026-09-20
  // a task carried a second, "record why it is not a defect", and on product-catalog
  // 004 every task of six forced rounds was closed by it while four of the findings
  // were fixable in code the same day; see evidence.md. That is authorship over text
  // the implement stage then executes, so it is priced with converge and implement
  // rather than with handoff: opus medium. A cheaper row would paraphrase a finding
  // into a task that closes on something else, and nothing downstream would notice.
  // (The roster's fable row is unavailable on billing as of 2026-09-18 and is not
  // considered.)
  forceAppend: { model: 'opus', effort: 'medium' },
  // Runs only when a forced append reports it failed, and answers one question about
  // tasks.md: is the forced phase wholly absent, wholly present, or neither. Git is
  // the oracle — at that instant the only uncommitted change to tasks.md is the failed
  // agent's own partial write — so the evidence is deterministic, but the two things
  // this row must get right are not cheap. It may delete lines from tasks.md (only a
  // partial forced phase, only this round's), where a wrong deletion removes real
  // tasks and nothing downstream would notice; and it must return "unsure" rather
  // than a guess, which is a calibration judgment the cheap tiers are worst at. Priced
  // with every other row in this table that writes: opus medium. Its verdict is not
  // taken on its own word — the parse-only `phases` row re-reads the file afterwards
  // and the loop escalates where the two disagree.
  reconcileTasks: { model: 'opus', effort: 'medium' },
  finish: { model: 'sonnet', effort: 'low' },
  // Writes one file whose whole text this script hands it, commits it, pushes it.
  // Nothing here is a judgment, so it is priced at the cheapest tier that runs a
  // shell and a write; the document is rendered in the script precisely so a tier
  // this low cannot paraphrase a finding or drop one.
  handoff: { model: 'sonnet', effort: 'low' },
}

const STAGES = ['preflight', 'plan', 'review-plan', 'tasks', 'analyze', 'implement', 'converge', 'finish']

// ---------------------------------------------------------------------------
// Args. Nothing is required: preflight discovers the feature directory, the branch
// and the definition-of-done command, and every argument below overrides what it
// would have found. A run on a checked-out feature branch whose spec.md is written
// takes no arguments at all.
// ---------------------------------------------------------------------------
const a = args && typeof args === 'object' ? args : {}

const cfg = {
  featureDir: a.featureDir || null, // discovered by preflight when absent
  branch: a.branch || null, // discovered by preflight when absent
  baseBranch: a.baseBranch || null, // preflight refuses to start elsewhere when set
  wall: a.wall || null, // definition-of-done command; preflight finds it in CLAUDE.md when null
  planGuidance: a.planGuidance || '',
  tasksGuidance: a.tasksGuidance || '',
  push: a.push !== false,
  mergeInto: a.mergeInto || null,
  from: a.from || 'preflight',
  until: a.until || 'finish',
  // 3, not 2, since 2026-09-18. The 2026-09-17 record (evidence.md) is five launches
  // out of seven ending needs-human at a review or analyze round cap, and the operator's
  // resolution every time was to run one more fix agent over the open findings — the
  // exact round the cap had refused. A cap that escalates work one more round would have
  // finished is the loop declining work it could do. 3 is the smallest increment the
  // evidence supports and the largest it supports: that record also says most of the
  // findings at the cap were holes opened by the previous round's fix, so these loops
  // have no fixed point either and a bigger cap buys rounds rather than closure — and
  // the artifact reviews are where both early runs spent their tokens (1.19M and
  // 0.91M). Not measured: no run has taken the third round.
  maxReviewRounds: a.maxReviewRounds ?? 3,
  maxAnalyzeRounds: a.maxAnalyzeRounds ?? 3,
  maxConvergeRounds: a.maxConvergeRounds ?? 6,
  severityFloor: String(a.severityFloor ?? 'NONE').toUpperCase(),
  maxWallAttempts: a.maxWallAttempts ?? 3,
  tiers: Object.assign({}, TIERS, a.tiers || {}),
}
for (const key of ['from', 'until']) {
  if (!STAGES.includes(cfg[key])) throw new Error(`args.${key} must be one of ${STAGES.join(', ')}`)
}
if (STAGES.indexOf(cfg.from) > STAGES.indexOf(cfg.until)) throw new Error('args.from is after args.until')
if (!SEVERITY_FLOORS.includes(cfg.severityFloor)) {
  throw new Error(cfg.severityFloor === 'CRITICAL'
    ? 'args.severityFloor cannot be CRITICAL: a floor there tolerates every finding the scale grades, including a constitution MUST violation, and ends the loop after one round. The floor must be one of ' + SEVERITY_FLOORS.join(', ')
    : `args.severityFloor is "${cfg.severityFloor}", not one of ${SEVERITY_FLOORS.join(', ')}`)
}
// Preflight's checks are the only stage that resolves the definition-of-done command
// (its discovery half runs on every entry and reads CLAUDE.md only there). A run that
// starts after it would hand every later prompt the literal string "null" as the command.
if (STAGES.indexOf(cfg.from) > STAGES.indexOf('preflight') && !cfg.wall) {
  throw new Error(`args.wall is required when starting from "${cfg.from}": preflight resolves it and is skipped`)
}

const runs = stage => {
  const i = STAGES.indexOf(stage)
  return i >= STAGES.indexOf(cfg.from) && i <= STAGES.indexOf(cfg.until)
}
const rosterText = Object.entries(ROSTER).map(([m, es]) => es.map(e => `${m} ${e}`).join(', ')).join(', ')
const tier = name => {
  const t = cfg.tiers[name]
  if (!t || !t.model || !t.effort) throw new Error(`tiers.${name} must be {model, effort}`)
  if (!(ROSTER[t.model] || []).includes(t.effort)) {
    throw new Error(`tiers.${name} is "${t.model} ${t.effort}", outside the roster: ${rosterText}`)
  }
  return { model: t.model, effort: t.effort }
}
// Every row is checked here, not when its stage runs, so a row outside the roster
// fails the run before the first agent starts rather than hours in.
for (const name of Object.keys(cfg.tiers)) tier(name)

// ---------------------------------------------------------------------------
// Schemas — every stage returns data, never prose.
// ---------------------------------------------------------------------------
const S = {
  preflight: {
    type: 'object',
    required: ['ok', 'branch', 'baseBranch', 'featureDir', 'wall', 'onBaseBranch', 'synced', 'clarifications', 'problems'],
    properties: {
      ok: { type: 'boolean' },
      branch: { type: 'string', description: 'the branch checked out when you finish, which is the feature branch whenever you checked one out or made one' },
      baseBranch: { type: 'string', description: 'the base branch you worked against, empty when none could be determined' },
      onBaseBranch: { type: 'boolean', description: 'true when the branch you finish on is the base branch' },
      featureDir: {
        type: 'string',
        description: 'repo-relative feature directory holding spec.md, e.g. specs/003-product-version; empty when it could not be resolved or holds no readable spec.md',
      },
      candidates: {
        type: 'array',
        items: { type: 'string' },
        description: 'when the feature had to be resolved by looking under specs/ and the answer was not exactly one directory: every directory you considered, with what made it a candidate or not. Empty otherwise.',
      },
      createdBranch: { type: 'boolean', description: 'true only when you created the feature branch in this run' },
      checkedOut: { type: 'string', description: 'the branch you checked out, empty when you checked nothing out' },
      synced: {
        type: 'string',
        enum: ['none', 'fast-forward', 'merge', 'conflict', 'not-applicable'],
        description: '"not-applicable" when the branch you finish on is the base branch or no base branch is known; "none" when the base was already an ancestor; otherwise what you did, or "conflict" when the merge was aborted',
      },
      specChanged: { type: 'boolean', description: 'true only when the sync brought a change to the feature\'s spec.md' },
      conflicts: { type: 'array', items: { type: 'string' }, description: 'the conflicted paths when synced is "conflict", empty otherwise' },
      featureJson: {
        type: 'string',
        enum: ['written', 'unchanged', 'tracked', 'unknown'],
        description: 'what you did with .specify/feature.json: "written" when you pointed it at the resolved feature, "unchanged" when it already named it, "tracked" when the repository tracks the file so you left it alone',
      },
      wall: { type: 'string', description: 'the definition-of-done command, empty when none was found' },
      clarifications: {
        type: 'array',
        items: { type: 'string' },
        description: 'every "[NEEDS CLARIFICATION]" marker still in spec.md, quoted with its line number; empty when there are none',
      },
      problems: { type: 'array', items: { type: 'string' } },
    },
  },
  review: {
    type: 'object',
    required: ['verdict', 'findings'],
    properties: {
      verdict: { type: 'string', enum: ['approve', 'fix'] },
      findings: {
        type: 'array',
        items: {
          type: 'object',
          required: ['severity', 'artifact', 'location', 'problem', 'fix'],
          properties: {
            severity: { type: 'string', enum: ['blocking', 'major', 'minor'] },
            artifact: { type: 'string', description: 'repo-relative path of the file the finding is in' },
            location: { type: 'string', description: 'heading, requirement id or line' },
            problem: { type: 'string' },
            fix: { type: 'string', description: 'the concrete edit that resolves it' },
          },
        },
      },
    },
  },
  done: {
    type: 'object',
    required: ['done', 'summary'],
    properties: {
      done: { type: 'boolean' },
      summary: { type: 'string' },
      commit: { type: 'string', description: 'short sha of the commit that holds the work, empty if nothing was committed' },
      skipped: { type: 'array', items: { type: 'string' }, description: 'findings not applied, each with the reason' },
      specChanges: {
        type: 'array',
        items: { type: 'string' },
        description: 'findings whose only remedy is an edit to the feature\'s spec.md, which no stage of this run may make: one entry per finding, naming the requirement or section and the change the spec needs. Each one stops the run and goes to the spec\'s author, so put here only what cannot be resolved in the artifacts you may write.',
      },
    },
  },
  analysis: {
    type: 'object',
    required: ['findings', 'coverage'],
    properties: {
      findings: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'severity', 'artifact', 'location', 'summary', 'recommendation'],
          properties: {
            id: { type: 'string' },
            severity: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
            artifact: { type: 'string', enum: ['spec', 'plan', 'tasks', 'constitution', 'other'] },
            location: { type: 'string' },
            summary: { type: 'string' },
            recommendation: { type: 'string' },
          },
        },
      },
      coverage: { type: 'string', description: 'requirements with at least one task, as "n/m"' },
    },
  },
  phases: {
    type: 'object',
    required: ['phases'],
    properties: {
      phases: {
        type: 'array',
        items: {
          type: 'object',
          required: ['number', 'title', 'taskIds', 'unchecked'],
          properties: {
            number: { type: 'integer' },
            title: { type: 'string' },
            taskIds: { type: 'array', items: { type: 'string' } },
            unchecked: { type: 'integer', description: 'how many of taskIds are still "- [ ]"' },
          },
        },
      },
    },
  },
  implemented: {
    type: 'object',
    required: ['wallGreen', 'unchecked', 'summary'],
    properties: {
      wallGreen: { type: 'boolean' },
      unchecked: { type: 'array', items: { type: 'string' }, description: 'task ids of this phase still unchecked' },
      summary: { type: 'string' },
      commit: { type: 'string' },
      wallOutput: { type: 'string', description: 'the failing part of the wall output when wallGreen is false' },
      blocked: {
        type: 'array',
        description: 'forced convergence phases only: one entry per task left unchecked because its fix is blocked, with the blocker quoted',
        items: {
          type: 'object',
          required: ['taskId', 'blocker'],
          properties: {
            taskId: { type: 'string' },
            blocker: { type: 'string', description: 'the requirement or constitution article that forbids the fix, quoted with its id; the system outside this repository that does not exist; or the change the feature\'s spec.md would need, which no stage of this run makes' },
          },
        },
      },
    },
  },
  converged: {
    type: 'object',
    required: ['outcome', 'findings', 'summary'],
    properties: {
      outcome: { type: 'string', enum: ['converged', 'tasks_appended'] },
      phase: { type: 'integer', description: 'the appended phase number when outcome is tasks_appended' },
      taskIds: { type: 'array', items: { type: 'string' } },
      findings: {
        type: 'array',
        description: 'every gap the assessment found, appended or not, including the ones it judged non-actionable',
        items: {
          type: 'object',
          required: ['severity', 'location', 'summary'],
          properties: {
            // /speckit-converge's own Step 5 scale, which is also the four values the
            // analyze schema carries; a third vocabulary is not admitted.
            severity: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
            location: { type: 'string', description: 'the requirement id, plan section or file the gap is against' },
            summary: { type: 'string' },
            taskId: { type: 'string', description: 'the appended task that closes it, empty if none was appended' },
            repeatOf: { type: 'integer', description: 'the number of the already-forced finding this one restates, from the numbered list in the prompt; 0 or absent when it is new or no list was given' },
          },
        },
      },
      summary: { type: 'string' },
    },
  },
  forceAppended: {
    type: 'object',
    required: ['appended', 'phase', 'tasks'],
    properties: {
      appended: {
        type: 'boolean',
        description: 'true only when the new phase and one task per finding are in tasks.md on disk and committed',
      },
      phase: { type: 'integer', description: 'the appended phase number' },
      tasks: {
        type: 'array',
        description: 'one entry per finding this prompt handed you, in the order it gave them — a finding with no task is a failed append, not an omission to report here',
        items: {
          type: 'object',
          required: ['taskId', 'location'],
          properties: {
            taskId: { type: 'string', description: 'the appended task id, e.g. T104' },
            location: { type: 'string', description: "the finding's location, copied from the prompt, so the task is traceable to the finding it was written from" },
          },
        },
      },
      commit: { type: 'string', description: 'short sha of the commit that holds tasks.md, empty if nothing was committed' },
      note: { type: 'string', description: 'when appended is false, why; otherwise anything the writer had to decide' },
    },
  },
  reconciled: {
    type: 'object',
    required: ['state', 'evidence', 'summary'],
    properties: {
      state: {
        type: 'string',
        enum: ['absent', 'present', 'unsure'],
        description: 'the state tasks.md is in when you finish: "absent" — it holds no part of the forced phase for this round and is well-formed; "present" — it holds the whole forced phase, well-formed, one task per finding, none of them ticked; "unsure" — you could not establish either with confidence, including any case where you cannot tell a line of the partial phase from work that was already there. "unsure" is a correct answer and the run handles it; a guess is not recoverable.',
      },
      phase: { type: 'integer', description: 'the forced phase number when state is present, 0 otherwise' },
      taskIds: { type: 'array', items: { type: 'string' }, description: 'the forced phase task ids when state is present, empty otherwise' },
      removed: { type: 'boolean', description: 'true when you removed a partial forced phase to reach the absent state, false when the file already held none' },
      commit: { type: 'string', description: 'short sha of the commit that holds a removal, empty when nothing was committed' },
      evidence: { type: 'string', description: 'what the verdict rests on, quoted: the git status, diff and log lines you read and the tasks.md lines you saw. A person reading a handoff gets this instead of being sent to look at the file.' },
      summary: { type: 'string' },
    },
  },
  handoff: {
    type: 'object',
    required: ['written', 'path'],
    properties: {
      written: { type: 'boolean', description: 'true only when the whole document is on disk at path' },
      path: { type: 'string', description: 'repo-relative path written, empty when written is false' },
      commit: { type: 'string', description: 'short sha of the commit that holds it, empty if nothing was committed' },
      pushed: { type: 'boolean' },
      note: { type: 'string', description: 'when written is false, why; otherwise anything the writer had to decide' },
    },
  },
  finished: {
    type: 'object',
    required: ['wallGreen', 'clean', 'allTasksChecked', 'pushed', 'merged', 'head', 'summary'],
    properties: {
      wallGreen: { type: 'boolean' },
      clean: { type: 'boolean' },
      allTasksChecked: { type: 'boolean' },
      pushed: { type: 'boolean' },
      merged: { type: 'boolean' },
      head: { type: 'string' },
      summary: { type: 'string' },
    },
  },
}

// ---------------------------------------------------------------------------
// Prompt fragments
// ---------------------------------------------------------------------------
const UNATTENDED = [
  'UNATTENDED RUN. No human is present and nothing you print reaches one.',
  'Never ask a question, never wait for a reply, never stop for a confirmation, never present options.',
  'Where a skill tells you to ask the user, decide yourself by the rule this prompt gives, apply the decision, and write it down in the artifact.',
  'Where a skill says a hook is optional, run it. Where a skill offers a remediation, do not offer it: return the findings as data.',
  'Your final message is not read by a person: it is the return value, and it must match the schema you were given.',
].join(' ')

// The spec belongs to the domain expert who wrote it, and this run reads it and never
// writes it (owner's decision, 2026-09-21: features are specified by a person in the
// project with stock spec-kit, and the unattended build starts at plan). Every stage
// that could reach the file is handed this, in these words, so the ban reads the same
// wherever an agent meets it; the stages that can return a finding carry `specChanges`
// beside it, which is the route out — the run stops and the finding goes to the author.
const SPEC_IS_NOT_OURS = spec =>
  `THE SPEC IS NOT YOURS TO EDIT. \`${spec}\` was written by the feature's domain expert and is the fixed input to this run: never edit it, never regenerate it, never "align" it with anything, and never add, reword, renumber or delete a requirement, a success criterion, a clarification or an assumption in it. Every other artifact under the feature directory is yours to fix.`

// Stock spec-kit resolves the feature from SPECIFY_FEATURE_DIRECTORY, then from
// .specify/feature.json, and never from the branch name (its own common.sh:
// get_current_branch() returns $SPECIFY_FEATURE or nothing and reads no git). Preflight
// normally points that file at the resolved feature, which is the whole fix — the file
// is git-ignored state. Where a repository tracks it instead, preflight leaves it alone
// and every stage that invokes a speckit skill carries the variable instead, because
// rewriting a tracked file would dirty a tree the run is about to commit from.
const FEATURE_CONTEXT = () => state.featureJsonTracked
  ? `This repository tracks \`.specify/feature.json\`, so it was not rewritten and may name another feature. Spec-kit resolves the feature from \`SPECIFY_FEATURE_DIRECTORY\` before it reads that file, so export \`SPECIFY_FEATURE_DIRECTORY=${state.featureDir}\` in every shell you run a spec-kit script or hook in, in the same command. Never work in a feature directory other than ${state.featureDir}, whatever a script resolves.`
  : ''

const SKILL_HOW = name =>
  `Invoke the skill \`${name}\` with the Skill tool. If the Skill tool is not available to you, read \`.claude/skills/${name}/SKILL.md\` and follow it exactly as that skill, hooks included.`

const featurePaths = dir => ({
  spec: `${dir}/spec.md`,
  plan: `${dir}/plan.md`,
  tasks: `${dir}/tasks.md`,
  research: `${dir}/research.md`,
  dataModel: `${dir}/data-model.md`,
  contracts: `${dir}/contracts/`,
  quickstart: `${dir}/quickstart.md`,
  checklists: `${dir}/checklists/`,
})

const CONSTITUTION = '.specify/memory/constitution.md'

// The traceability convention's qualification prefix — feature ids are per-feature
// and collide across features, so every citation outside the feature's own specs/
// directory is qualified NNN/FR-nnn or NNN/SC-nnn. featureDir is specs/<NNN>-<name>;
// falling back to 'NNN' rather than throwing lets a caller with a differently-shaped
// featureDir still get a prompt, just one that names the placeholder instead of a number.
const featureNum = dir => (/^specs\/(\d+)-/.exec(dir || '') || [])[1] || 'NNN'

const findingsBlock = findings =>
  findings.map((f, i) => `${i + 1}. [${f.severity}] ${f.artifact} — ${f.location}\n   Problem: ${f.problem}\n   Fix: ${f.fix}`).join('\n')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const state = {
  featureDir: cfg.featureDir,
  branch: cfg.branch,
  baseBranch: cfg.baseBranch,
  onBaseBranch: false, // set by preflight; no handoff is committed while it is true
  featureJsonTracked: false, // set by preflight; true means the stages carry the env var instead
  wall: cfg.wall,
  rounds: { reviewPlan: 0, analyze: 0, converge: 0 },
  converge: null, // { ended, rounds, findings } once the converge stage has run
  implemented: [],
  finishRepaired: false, // true once the finish wall was red and the one repair pass ran
  open: [],
  stagesRun: [],
}

// ---------------------------------------------------------------------------
// The handoff artifact.
//
// A needs-human exit is a decision handed back to a person, and until 2026-09-18 it
// was handed back only to the session that started the run: the payload lived in
// that session's tool result, in a file under /tmp, and in the run journal under
// ~/.claude/projects/ — three machine-local places, none of them in the repository.
// Run wf_7e4e8726-4b5 stopped at converge with three findings no colleague could
// read. So every needs-human exit now leaves one committed file behind.
//
// The document is rendered here rather than described to the agent. The sandbox has
// no filesystem, so an agent must do the write; making that agent compose the report
// would let the cheapest tier in the table paraphrase a finding, reorder it or drop
// it. It gets finished Markdown and two placeholders it can only substitute, because
// the script has no Date and does not know its own run id.
// ---------------------------------------------------------------------------
const HANDOFF_FILE = 'HANDOFF.md'

const scalar = v => (typeof v === 'string' ? v : JSON.stringify(v))

// One renderer for every detail payload the twelve call sites pass: a list of
// strings (problems, unchecked task ids), a list of finding objects on any of the
// three finding shapes this script carries, or a plain object ({unchecked, wallOutput}).
// Unknown keys are printed rather than skipped — a reader who was not in the session
// is owed everything the stage returned, not the fields this function knew about.
const renderFinding = (f, i) => {
  const head = [f.severity ? `[${f.severity}]` : '', f.id || '', f.artifact || '', f.location || '']
    .filter(Boolean).join(' — ')
  const seen = { severity: 1, id: 1, artifact: 1, location: 1 }
  const body = []
  for (const key of ['summary', 'problem', 'recommendation', 'fix', 'taskId']) {
    seen[key] = 1
    if (f[key] !== undefined && f[key] !== null && f[key] !== '') body.push(`   - ${key}: ${scalar(f[key])}`)
  }
  for (const key of Object.keys(f)) {
    if (!seen[key] && f[key] !== undefined && f[key] !== null && f[key] !== '') body.push(`   - ${key}: ${scalar(f[key])}`)
  }
  return [`${i + 1}. ${head || '(no location given)'}`].concat(body).join('\n')
}

const detailBlock = detail => {
  if (detail === null || detail === undefined) return '_The stage returned no detail payload._'
  if (Array.isArray(detail)) {
    if (!detail.length) return '_The stage returned an empty list._'
    return detail.map((d, i) => (d && typeof d === 'object' ? renderFinding(d, i) : `${i + 1}. ${scalar(d)}`)).join('\n')
  }
  if (typeof detail === 'object') {
    return Object.keys(detail).map(key => {
      const v = detail[key]
      if (Array.isArray(v)) return `- ${key}: ${v.length ? v.map(scalar).join(', ') : '(none)'}`
      if (v === '' || v === null || v === undefined) return `- ${key}: (empty)`
      if (typeof v === 'object') return `- ${key}:\n\n\`\`\`json\n${JSON.stringify(v, null, 2)}\n\`\`\`\n`
      if (typeof v === 'string' && v.indexOf('\n') !== -1) return `- ${key}:\n\n\`\`\`\n${v}\n\`\`\`\n`
      return `- ${key}: ${scalar(v)}`
    }).join('\n')
  }
  return scalar(detail)
}

const handoffDoc = (stage, why, detail) => [
  `# Handoff — the unattended build of ${state.featureDir} stopped at ${stage}`,
  '',
  `**This run has stopped and is waiting on a person.** \`build-feature\` runs the spec-kit cycle with no human gate: it reached the \`${stage}\` stage, found something no rule it carries can decide, and ended there. Nothing reported below was fixed.`,
  '',
  `**The decision being asked of you:** read each item under *What the stage reported*, decide whether it is real, and either apply the fix or record why it is not a defect. Then restart the run (below). It will not resume by itself, and outside this file the report exists only on the machine that ran it.`,
  '',
  '| | |',
  '|---|---|',
  `| Stopped at stage | \`${stage}\` |`,
  `| Reason | ${why} |`,
  `| Feature directory | \`${state.featureDir}\` |`,
  `| Branch | \`${state.branch || '(unknown)'}\` |`,
  `| Base branch | \`${state.baseBranch || '(unknown)'}\` |`,
  `| Stages run | ${state.stagesRun.length ? state.stagesRun.join(' → ') : '(none)'} |`,
  `| Rounds | ${Object.keys(state.rounds).map(k => `${k} ${state.rounds[k]}`).join(', ')} |`,
  `| Definition of done | \`${state.wall || '(not resolved)'}\` |`,
  `| Converge severity floor | \`${cfg.severityFloor}\` |`,
  '| Run date | {{RUN_DATE}} |',
  '',
  '## What the stage reported',
  '',
  detailBlock(detail),
  '',
  '## Restarting the run',
  '',
  `Once the decision is applied, check out \`${state.branch || 'the feature branch'}\` and restart at this stage through the \`build-feature\` skill with \`from: "${stage}"\` and \`wall: "${state.wall || ''}"\`; \`wall\` is required on any start after preflight, and the feature directory and branch are discovered from the checkout unless you pass \`featureDir: "${state.featureDir}"\` and \`branch: "${state.branch || ''}"\`. A decision that was a change to \`${state.featureDir}/spec.md\` restarts at \`from: "plan"\`, because every later artifact was planned from the old text. To replay this run instead of restarting it, pass \`resumeFromRunId\` with the run id in the journal path below.`,
  '',
  '## Run journal',
  '',
  '{{RUN_JOURNAL}}',
  '',
  'The journal holds every agent prompt and every agent return value of this run. It is machine-local and is not in this repository: if you are reading this anywhere else, this file is the whole of what the run reported.',
  '',
  `_Written by \`build-feature\`'s handoff stage. The next needs-human exit on this feature overwrites it; \`git log -p -- ${state.featureDir}/${HANDOFF_FILE}\` holds the earlier ones._`,
].join('\n')

// Returns the handoff record for the return value and never throws: a handoff that
// fails must not cost the caller the verdict, because losing the findings because the
// write failed is strictly worse than the behaviour this replaced. Every failure path
// — no feature directory, a thrown dispatch, a skipped or dead agent, an agent that
// reports it could not write — ends in a record saying so, and the caller returns its
// full payload regardless.
const writeHandoff = async (stage, why, detail) => {
  // Every preflight exit lands here: no feature has been created, so there is no
  // feature directory and no feature branch to carry the file. The write is skipped
  // rather than aimed at the repo root. A preflight refusal is a repo-state fact the
  // next person reproduces in one command — a dirty tree, the wrong branch, a missing
  // speckit skill, no definition-of-done command — not a finding that exists nowhere
  // else; and a dirty tree is one of the things preflight refuses on, so a commit at
  // the root would sweep somebody's uncommitted work into a handoff commit.
  if (!state.featureDir) {
    log(`no handoff file: the run stopped at ${stage} before a feature directory was resolved; the detail on the return value is the whole report`)
    return { written: false, path: null, note: 'no feature directory — the run stopped before discovery resolved one, so there is nowhere in the repo the file belongs. The detail on this return value is the whole report.' }
  }
  // The file is committed on whatever branch the run is standing on, so a run that
  // never left the base branch — a later-stage start on a feature implemented on the
  // trunk, and every failure before preflight checked a feature branch out — gets no
  // handoff. A commit on the trunk is not this script's to make, and a dirty tree is
  // one of the states preflight refuses on.
  if (state.onBaseBranch) {
    log(`no handoff file: the run is standing on the base branch (${state.baseBranch || 'unknown'}), where this script commits nothing; the detail on the return value is the whole report`)
    return { written: false, path: null, note: `the run is on the base branch (${state.baseBranch || 'unknown'}), and a handoff is committed on the branch the run is on — this script does not commit to the trunk. The detail on this return value is the whole report.` }
  }
  const path = `${state.featureDir}/${HANDOFF_FILE}`
  let r = null
  try {
    const t = tier('handoff')
    r = await agent([
      UNATTENDED,
      `The unattended feature build has stopped at the "${stage}" stage and needs a person. Your only job is to leave a durable handoff file in the repository, so that somebody who was not in this session can pick the decision up. Fix nothing, run no build, and change no file other than the one named here.`,
      '1. Get today\'s date: run `date -I`.',
      '2. Find this run\'s journal — the newest `wf_*.json` under this project\'s Claude directory: `ls -t ~/.claude/projects/$(pwd | sed \'s#/#-#g\')/*/workflows/wf_*.json 2>/dev/null | head -1`. If it finds nothing, use the literal text `(not found on this machine)`.',
      `3. Write the document between the BEGIN and END markers below to \`${path}\`, byte for byte, replacing exactly two placeholders and nothing else: \`{{RUN_DATE}}\` with the date from step 1, and \`{{RUN_JOURNAL}}\` with the absolute journal path from step 2 wrapped in single backticks. Do not summarise it, re-word it, reorder it, shorten it or add to it — it is the report, not a draft of one. Do not write the BEGIN and END marker lines themselves. Overwrite the file if it already exists.`,
      `4. Commit that one file and nothing else: \`git add -- ${path} && git commit -m "handoff: the ${stage} stage stopped and needs a person" -- ${path}\`. The pathspec matters: the working tree may hold the run's unfinished or failing work, and none of it belongs in this commit.`,
      cfg.push
        ? '5. Push it: `git push -u origin HEAD`. Set pushed=true only if the push succeeded; a push that fails is not a failed handoff, so report it in note and leave written=true.'
        : '5. Do not push; return pushed=false. This run was started with pushing disabled.',
      'Return written=true only when the whole document is on disk at that path. If any step fails, return written=false with the reason in note; never return written=true for a partial or paraphrased file.',
      '--- BEGIN DOCUMENT ---',
      handoffDoc(stage, why, detail),
      '--- END DOCUMENT ---',
    ].join('\n'), { label: `handoff (${t.model} ${t.effort})`, phase: 'Handoff', schema: S.handoff, model: t.model, effort: t.effort })
  } catch (e) {
    r = null
    log(`the handoff agent threw: ${e && e.message ? e.message : String(e)}`)
  }
  if (r && r.written && r.path) {
    log(`handoff written to ${r.path}${r.commit ? ` (${r.commit})` : ''}${r.pushed ? ', pushed' : ''}`)
    return { written: true, path: r.path, commit: r.commit || '', pushed: !!r.pushed, note: r.note || '' }
  }
  log(`NO handoff file was written: the findings of this run exist only on its return value and in its journal`)
  return {
    written: false,
    path: null,
    note: (r && r.note) || 'the handoff agent failed, was skipped, or returned nothing. The detail on this return value is the whole report.',
  }
}

// Keeps the shape every caller and reader already relies on — status, stage, why,
// detail, featureDir, branch, rounds, stagesRun — and adds `handoff`, which is the
// record of the artifact, never a condition on the verdict.
const needsHuman = async (stage, why, detail) => {
  const handoff = await writeHandoff(stage, why, detail)
  return {
    status: 'needs-human',
    stage,
    why,
    detail: detail === undefined ? null : detail,
    featureDir: state.featureDir,
    branch: state.branch,
    rounds: state.rounds,
    stagesRun: state.stagesRun,
    handoff,
  }
}

const must = (result, stage) => {
  if (result === null || result === undefined) {
    throw new Error(`stage "${stage}" returned nothing: the agent was skipped or died on a terminal error. Resume with resumeFromRunId once the cause is fixed.`)
  }
  return result
}

const run = async (name, stage, prompt, schema, group) => {
  const t = tier(name)
  const label = `${stage} (${t.model} ${t.effort})`
  return must(await agent(prompt, { label, phase: group, schema, model: t.model, effort: t.effort }), stage)
}

// A review/fix loop: review with the reviewer tier; when it returns a blocking
// or major finding, the fixer applies every finding and the review runs again.
// The cap counts fix rounds; the review after the last fix still runs, so the
// run never continues on an unreviewed fix.
//
// A fix round that reports `specChanges` ends the loop with them: the only remedy the
// fixer could see for those findings is an edit to spec.md, which this run does not
// make, so the caller takes them to the spec's author rather than running another
// round that would find the same thing.
const specChangesOf = r => (r && Array.isArray(r.specChanges) ? r.specChanges.filter(Boolean) : [])

async function reviewLoop({ kind, group, reviewer, fixer, reviewPrompt, fixPrompt, max }) {
  let review = null
  for (let round = 1; round <= max + 1; round++) {
    review = await run(reviewer, `review-${kind} ${round}`, reviewPrompt(round), S.review, group)
    state.rounds[reviewer] = round
    const serious = review.findings.filter(f => f.severity !== 'minor')
    const blocking = review.findings.filter(f => f.severity === 'blocking')
    log(`review-${kind} round ${round}: ${review.verdict}, ${blocking.length} blocking, ${serious.length - blocking.length} major, ${review.findings.length - serious.length} minor`)
    if (review.verdict === 'approve' && serious.length === 0) {
      if (review.findings.length) {
        const fixed = await run(fixer, `fix-${kind} minors`, fixPrompt(review.findings, round, true), S.done, group)
        const specChanges = specChangesOf(fixed)
        if (specChanges.length) return { approved: false, rounds: round, findings: review.findings, specChanges }
      }
      return { approved: true, rounds: round, findings: review.findings, specChanges: [] }
    }
    if (round > max) break
    const fixed = await run(fixer, `fix-${kind} ${round}`, fixPrompt(review.findings, round, false), S.done, group)
    const specChanges = specChangesOf(fixed)
    if (specChanges.length) return { approved: false, rounds: round, findings: review.findings, specChanges }
  }
  return { approved: false, rounds: max + 1, findings: review ? review.findings : [], specChanges: [] }
}

// ---------------------------------------------------------------------------
// Stage: preflight — discovery, the feature branch, and the sync, on every entry.
//
// The feature this run builds already exists when the run starts: its domain expert
// wrote specs/<NNN>-<name>/spec.md with /speckit-specify and /speckit-clarify. What he
// does NOT necessarily do is leave the repository on a feature branch — he works on the
// base branch (owner's statement of how the team works, 2026-09-21) — so preflight
// establishes the feature, puts the repository on the feature branch, making it when it
// does not exist, and brings that branch in step with the base.
//
// Resolution order, and why it is not spec-kit's own: `.specify/feature.json` is
// git-ignored machine-local state (`.specify/.gitignore` ships the rule), rewritten
// whenever a machine runs /speckit-specify. Ours is whatever OUR last local run left —
// on a fresh pull it names the previous feature — so trusting it first would build the
// wrong feature from a file no commit ever touched. The branch name is the authority
// where there is one; on the base branch the answer is the one specified-but-unplanned
// feature under specs/, which is a rule and not a guess, and ambiguity stops the run.
// feature.json is consulted last and never overrides.
//
// Then the run makes spec-kit agree, because resolving it here is not enough. Stock
// spec-kit 1.0.8's `.specify/scripts/bash/common.sh` resolves the feature from
// SPECIFY_FEATURE_DIRECTORY, then from .specify/feature.json, and from NOTHING else:
// `get_current_branch()` returns $SPECIFY_FEATURE or the empty string and never reads
// git, so the branch name reaches no speckit skill and no branch name is refused. A
// stale feature.json therefore sends /speckit-plan into the previous feature's directory
// however well this script resolved the new one. Writing that one git-ignored file is
// the single write preflight is allowed. Where a repository tracks it instead, it is
// left alone and every stage prompt carries SPECIFY_FEATURE_DIRECTORY, which common.sh
// honours first — and which it then persists into feature.json itself unless the caller
// passed --no-persist, a write this script cannot prevent and does not pretend to.
//
// The sync runs on every entry: the expert keeps editing spec.md on the base branch
// while the build's commits pile up on the feature branch, so without it a run plans
// against a spec that has moved and ends in a failed `git merge --ff-only` at finish,
// after the whole run has been paid for. It is a merge and never a rebase, because the
// branch may already be pushed. It is conflict-free by construction for the spec — the
// build never writes spec.md — and a conflict anywhere else stops the run with the
// paths. A spec that changed under an already-written plan is a needs-human exit whose
// restart is `from: "plan"`.
//
// The discovery half runs even on a start at a later stage: before 2026-09-21 a
// `from: "plan"` restart left state.branch null, the handoff table said "(unknown)" and
// finish merged from HEAD@{1}. A later-stage run standing on the base branch — which is
// converge-feature closing out a feature implemented on the trunk, as 001 was — is
// reported and not refused, and gets no branch creation and no sync: it is resuming work
// that already lives there. args.wall is still required on a start after preflight,
// because only the full check reads CLAUDE.md for it.
// ---------------------------------------------------------------------------
{
  const full = runs('preflight')
  phase('Preflight')
  if (full) state.stagesRun.push('preflight')
  const dirName = '<the last path segment of the feature directory, e.g. 004-product-gl-config>'
  const p = await run('preflight', full ? 'preflight' : 'preflight (discovery and sync)', [
    UNATTENDED,
    full
      ? 'Establish which spec-kit feature this unattended build is for, put the repository on that feature\'s branch, bring the branch in step with the base, and check that the repository is ready to build. Everything you may write is named in the steps below — one branch checkout, one merge, one machine-local state file — and nothing else. Never write to spec.md or to anything else in the feature directory: the spec is its author\'s.'
      : 'Establish which spec-kit feature this unattended build is for and bring its branch in step with the base. This run starts at a later stage, so the readiness checks belong to the start it is resuming, and you create no branch and check nothing out. Everything you may write is named in the steps below — one merge and one machine-local state file — and nothing else. Never write to spec.md or to anything else in the feature directory: the spec is its author\'s.',
    `1. \`git rev-parse --abbrev-ref HEAD\` is the branch you start on${cfg.branch ? `. This run names \`${cfg.branch}\` as the feature branch, so that is where you must end up` : ''}.`,
    `2. The base branch — the trunk a feature merges into, and the branch the feature's author works on. ${cfg.baseBranch ? `This run names it: \`${cfg.baseBranch}\`.` : 'This run names none, so take it from `git symbolic-ref --short refs/remotes/origin/HEAD` with the remote prefix stripped, falling back to whichever of `main` or `master` the repository has. If none of those resolves, return `baseBranch` empty and carry on: steps 5 and 6 then do nothing.'} Return it as \`baseBranch\`.`,
    full ? '3. `git status --porcelain` must be empty (untracked files under .specify/workflows/runs/ and .claude/worktrees/ do not count). A dirty tree is a problem and you stop there: check nothing out, merge nothing, write nothing, and return what you have. Every step after this one moves the tree, and somebody\'s uncommitted work is not this run\'s to carry onto another branch.' : '',
    '4. Resolve the feature directory and return it as `featureDir`, in this order, taking the first that answers:',
    cfg.featureDir
      ? `   (a) this run names it: \`${cfg.featureDir}\`. If the branch you started on names a different feature by the rule in (b), that disagreement is a problem — say which two — and you stop rather than choose.`
      : '   (a) — this run names no feature directory, so start at (b).',
    '   (b) the branch you started on, when it is not the base branch: `feature/<NNN>-<name>` or a bare `<NNN>-<name>` becomes `specs/<NNN>-<name>`.',
    '   (c) only when you started on the base branch: the one directory under `specs/` that holds a non-empty `spec.md` and no `plan.md` — the feature that has been specified and not yet planned, which is what this run exists to build. List them (`ls -d specs/*/`) and test each. Exactly one is the answer. Zero or more than one is a problem: return every directory you considered in `candidates` with what made it a candidate or not, leave `featureDir` empty, and stop. Never pick one of several, and never take the newest or the highest-numbered — a person passes `args.featureDir` instead.',
    '   (d) only when nothing above resolved: the `feature_directory` value in `.specify/feature.json`. It is machine-local, git-ignored state written by whichever machine last ran /speckit-specify, so it is the last resort and never overrides (a), (b) or (c).',
    '   The resolved directory must exist and hold a `spec.md` that is present and not empty (`wc -c`). A missing directory, a missing spec.md or an empty one is a problem, and `featureDir` comes back empty — this run builds a spec somebody has already written, and it writes no spec of its own.',
    full
      ? `5. When the branch you started on IS the base branch, put the repository on the feature branch. Let DIR be the last path segment of the feature directory (${dirName}). The target branch is${cfg.branch ? ` \`${cfg.branch}\`, which this run names` : ': an existing branch named `feature/DIR` or `DIR` — look for both locally (`git branch --list`) and on the remote (`git branch -r --list \'origin/*\'`) — and otherwise a new `feature/DIR`'}. Then: a branch that exists locally, \`git checkout <target>\`; one that exists only on the remote, \`git checkout --track origin/<target>\`; one that does not exist, \`git checkout -b <target>\` from where you are standing, and return \`createdBranch\` true. Return the branch you end on as \`branch\` and the one you checked out as \`checkedOut\`. When you did not start on the base branch, check nothing out: you are already on the feature branch.`
      : '5. Check nothing out and create nothing: this run starts at a later stage, on the branch it was given. Return `branch` as the branch you are on, `createdBranch` false and `checkedOut` empty.',
    '6. Sync with the base branch, whenever the branch you are now on is not the base branch and a base branch is known. Do not fetch; the local base branch is what this run merges. Note `git rev-parse HEAD` first, then:',
    '   - `git merge-base --is-ancestor <base> HEAD` succeeds — the base is already in this branch. Do nothing; `synced` is "none".',
    '   - otherwise `git merge-base --is-ancestor HEAD <base>` succeeds — this branch is strictly behind. `git merge --ff-only <base>`; `synced` is "fast-forward".',
    '   - otherwise the two have diverged. `git merge --no-edit <base>`; `synced` is "merge". If it conflicts, `git merge --abort` immediately, set `synced` to "conflict", return the conflicted paths in `conflicts` and add a problem. Never resolve a conflict yourself, and never rebase: this branch may already be pushed.',
    '   Then `git diff --name-only <the sha you noted> HEAD -- <featureDir>/spec.md`: a non-empty result means the sync brought a change to the spec, and `specChanged` is true. Where you finish on the base branch, or no base branch is known, `synced` is "not-applicable".',
    '7. Make spec-kit agree with the feature you resolved. Its own scripts resolve the feature from the `SPECIFY_FEATURE_DIRECTORY` environment variable, then from `.specify/feature.json`, and from nothing else — never from the branch name — so a stale file sends every later stage into another feature\'s directory. Run `git check-ignore -q .specify/feature.json`. Exit 0 (the file is git-ignored, which is how spec-kit ships it): if its `feature_directory` is not the directory you resolved, write the file as exactly `{"feature_directory":"<the resolved directory>"}` and return `featureJson` "written"; if it already names it, write nothing and return "unchanged". A non-zero exit means the repository tracks the file: leave it untouched, return "tracked", and add no problem — the run carries the environment variable to its stages instead.',
    full ? '8. `grep -n "\\[NEEDS CLARIFICATION" <featureDir>/spec.md` — return every hit in `clarifications`, quoted with its line number. Those markers are the spec author\'s to resolve with `/speckit-clarify`, and this run never answers one.' : '',
    full ? '9. `.specify/` must exist with `.specify/memory/constitution.md`, and `.claude/skills/speckit-plan/SKILL.md`, `speckit-tasks`, `speckit-analyze`, `speckit-implement`, `speckit-converge` must all be installed. Any missing one is a problem.' : '',
    full
      ? (cfg.wall
        ? `10. The definition-of-done command is \`${cfg.wall}\`. Check that its executable and script exist; do not run it. Return it as \`wall\`.`
        : `10. Find the project's definition-of-done command: read CLAUDE.md at the repo root (and the backend's CLAUDE.md if there is one) for the command it names as the definition of done or as "exactly what CI runs" — for example \`node backend/scripts/wall.mjs\`. Return it as \`wall\`. If no such command is named, return an empty string and add a problem saying so.`)
      : `8. Return \`wall\` as \`${cfg.wall || ''}\` and \`clarifications\` empty: the checks this run skipped are not yours to redo.`,
    'Return ok=true only when there are no problems.',
  ].filter(Boolean).join('\n'), S.preflight, 'Preflight')
  state.branch = p.branch || state.branch
  state.baseBranch = p.baseBranch || cfg.baseBranch || null
  // Where the run finishes preflight standing on the base branch — a later-stage start
  // on a trunk-implemented feature — no handoff file is written, whatever else goes
  // wrong afterwards: HANDOFF.md is committed on the branch the run is on, and a commit
  // on the trunk is not this script's to make. The report then lives on the return value,
  // which is what every preflight exit did before there was a feature directory to write
  // into at all.
  state.onBaseBranch = !!p.onBaseBranch
  state.featureJsonTracked = p.featureJson === 'tracked'
  state.featureDir = p.featureDir || null
  if (!p.featureDir && Array.isArray(p.candidates) && p.candidates.length) {
    return await needsHuman('preflight',
      `the run was started on the base branch and the feature could not be resolved from it: exactly one directory under specs/ should hold a written spec.md and no plan.md — the feature specified and not yet planned — and ${p.candidates.length} were considered. The loop will not pick one of several, because building the wrong feature is not something a later stage would notice. Pass args.featureDir, or check the feature branch out`,
      p.candidates)
  }
  if (p.synced === 'conflict') {
    return await needsHuman('preflight',
      `merging \`${state.baseBranch || 'the base branch'}\` into \`${state.branch || 'the feature branch'}\` conflicted, and the merge was aborted, so the tree is as it was. The build never edits spec.md, so a conflict here is between the base branch and this feature's own committed work in the files below — a person's to resolve, on the branch, before the run restarts`,
      { conflicts: p.conflicts || [], problems: p.problems })
  }
  if (!p.ok) return await needsHuman('preflight', full ? 'the repository is not ready' : 'the repository does not match what this restart was given', p.problems)
  if (!p.featureDir) {
    return await needsHuman('preflight', cfg.featureDir
      ? `\`${cfg.featureDir}\` is not a feature directory this run can build: it does not exist, or it holds no readable, non-empty spec.md. A feature is specified before this run starts — /speckit-specify and /speckit-clarify are the author's, not this script's`
      : `no feature directory could be resolved, so there is no spec to build: the branch \`${p.branch || '(none reported)'}\` does not name one, no single specified-but-unplanned directory under specs/ answered for it, and .specify/feature.json — machine-local state, and the last thing this run trusts — named nothing usable either. Pass args.featureDir, or check the feature branch out`,
      p.problems)
  }
  if (!state.wall) return await needsHuman('preflight', 'no definition-of-done command: pass args.wall', p.problems)
  if (Array.isArray(p.clarifications) && p.clarifications.length) {
    return await needsHuman('preflight',
      `${p.clarifications.length} "[NEEDS CLARIFICATION]" marker(s) are still in ${state.featureDir}/spec.md. They are the spec author's to resolve, with \`/speckit-clarify\` in the project, and this run answers none: it does not edit the spec, and planning against an unresolved marker decides by accident what the marker exists to decide. Restart the build once the spec is clarified`,
      p.clarifications)
  }
  // A spec that moved under artifacts already written is not something a later stage
  // reconciles: plan.md, tasks.md and the code were all derived from the old text, and
  // the analyze stage would report it as a dozen findings against the wrong artifact.
  // A run that starts at plan is about to read the new text anyway, so it carries on.
  if (p.specChanged && STAGES.indexOf(cfg.from) > STAGES.indexOf('plan')) {
    return await needsHuman('preflight',
      `the sync with \`${state.baseBranch || 'the base branch'}\` brought a change to ${state.featureDir}/spec.md, and this run was told to start at "${cfg.from}" — after the plan that was written from the old text. Every artifact from plan.md onwards is now derived from a spec that has moved. The merge is done and committed on \`${state.branch}\`, so nothing is lost: restart with \`from: "plan"\``,
      [`${state.featureDir}/spec.md changed in the merge from ${state.baseBranch || 'the base branch'}`])
  }
  log(`${full ? 'preflight ok' : 'discovery'}: feature ${state.featureDir} on ${state.branch}${p.createdBranch ? ' (branch created)' : p.checkedOut ? ' (checked out)' : ''}, base ${state.baseBranch || '(none)'}, sync ${p.synced}${p.specChanged ? ' and the spec changed' : ''}, feature.json ${p.featureJson || 'unknown'}, wall = ${state.wall}`)
}

// ---------------------------------------------------------------------------
// Stage: plan → review-plan ⇄ fix-plan
// ---------------------------------------------------------------------------
if (runs('plan')) {
  phase('Plan')
  state.stagesRun.push('plan')
  const P = featurePaths(state.featureDir)
  await run('plan', 'plan', [
    UNATTENDED,
    SKILL_HOW('speckit-plan'),
    FEATURE_CONTEXT(),
    `The feature is ${state.featureDir}; the spec is ${P.spec}; the constitution is ${CONSTITUTION}.`,
    SPEC_IS_NOT_OURS(P.spec),
    cfg.planGuidance ? `Arguments for the skill (planning guidance): ${cfg.planGuidance}` : 'Arguments for the skill: none.',
    `Rules: read the constitution first and treat every article as binding; read the existing code the feature touches before deciding on a design; leave no "[NEEDS CLARIFICATION]" in the plan artifacts — decide from the spec, the constitution and the code, and record the decision in research.md. An "Article VII candidate" is admissible only under the constitution's Governance admission test: it binds two or more feature packages, or a table or package this feature does not own; a rule about this feature's own tables, columns, endpoints or error codes is a plan decision recorded in plan.md and docs/GATES.md, never a candidate; a pre-positioned or placeholder structure is never the subject of one. Cite an FR or SC id of the spec qualified \`${featureNum(state.featureDir)}/FR-nnn\` or \`${featureNum(state.featureDir)}/SC-nnn\`, never bare, wherever plan.md or research.md names one. A requirement the plan puts out of this feature's scope names that boundary in plan.md — the tasks stage waives it as \`deferred\` from exactly that sentence. Run the before_plan and after_plan hooks.`,
    'Return done=true with a one-paragraph summary of the design and the artifacts written.',
  ].filter(Boolean).join('\n'), S.done, 'Plan')

  const r = await reviewLoop({
    kind: 'plan',
    group: 'Plan',
    reviewer: 'reviewPlan',
    fixer: 'fixPlan',
    max: cfg.maxReviewRounds,
    reviewPrompt: round => [
      UNATTENDED,
      `You are a fresh-context reviewer with no memory of how the plan was written. Your job is to REFUTE the claim that ${P.plan} (with ${P.research}, ${P.dataModel}, ${P.contracts} and ${P.quickstart} where present) fully and correctly realises ${P.spec} under ${CONSTITUTION}. Read-only: change nothing.`,
      'Read the spec, every plan artifact, the constitution, the project CLAUDE.md files, and the existing code and schema the plan touches or depends on.',
      'Report a finding for each of these, with the severity given:',
      '- a functional requirement, success criterion, state, transition or error case in the spec that no plan element realises — blocking',
      '- a plan decision that violates a constitution article or a build gate the project documents — blocking, naming the article or gate; propose a constitution amendment only when the rule passes the constitution\'s Governance admission test (it binds two or more features, or a table the feature does not own), otherwise the finding is against the plan',
      '- a contract, data model or migration that contradicts the existing schema, an existing endpoint, or another plan artifact — blocking',
      '- a decision that contradicts what the existing code already does without saying so and migrating it — major',
      '- a "[NEEDS CLARIFICATION]", a template placeholder, or a research question left open — major',
      '- a decision with no stated alternative and rationale where the constitution or the project rules require one — major',
      '- a decision that the plan defers to implementation without a task-sized statement of what to build — major',
      `- a requirement of ${P.spec} that no plan can realise because the spec contradicts itself, the constitution or the existing code — blocking, and say in the fix that the remedy is a change to the spec: ${P.spec} is the feature author's and neither you nor the agent that applies your findings edits it`,
      '- naming, ordering, duplication — minor',
      `Each finding names the exact file and location and the concrete edit that resolves it, and no finding's fix is an edit to ${P.spec}. Verdict "fix" when any finding is blocking or major; "approve" otherwise.`,
      round > 1 ? `This is review round ${round}; earlier findings were applied. Check they were applied correctly and look for what the fix broke.` : '',
    ].filter(Boolean).join('\n'),
    fixPrompt: (findings, round, minorsOnly) => [
      UNATTENDED,
      `Apply the following review findings to the plan artifacts under ${state.featureDir}. Edit in place; do not regenerate a file. When a finding says the constitution needs an amendment, amend ${CONSTITUTION} only if the amendment passes the constitution's Governance admission test (it binds two or more features, or a table the feature does not own — otherwise change the plan instead and say so under skipped), following the constitution's own amendment and versioning rules and only in the articles it marks as the project's own, and record the amendment in ${P.research}.`,
      SPEC_IS_NOT_OURS(P.spec),
      `Where a finding cannot be resolved in the plan artifacts or the constitution because the only remedy is a change to ${P.spec} — the spec contradicts itself, the constitution or the code, or it is silent on something no plan can decide — do not apply it and do not work around it: put it in \`specChanges\`, naming the requirement and the change the spec needs. That stops the run and takes the finding to the spec's author, so put there only what you genuinely cannot resolve in the files you may write.`,
      minorsOnly ? 'These are minor findings; apply each unless it would change meaning.' : 'Apply every finding. If a finding is wrong against the spec or the code, do not apply it and list it under skipped with the reason.',
      findingsBlock(findings),
      `Then commit with the message "plan: review round ${round}". Return done=true with the short sha.`,
    ].join('\n'),
  })
  if (r.specChanges && r.specChanges.length) {
    return await needsHuman('review-plan',
      `a review finding of the plan can only be resolved by changing ${P.spec}, and no stage of this run edits the spec: it is the feature author's, written before the build started. The ${r.specChanges.length} change(s) below go to that author — with /speckit-clarify or an edit to the spec — and the build restarts at plan afterwards. Nothing else in the plan was left unapplied`,
      r.specChanges)
  }
  if (!r.approved) return await needsHuman('review-plan', `blocking or major findings remain after ${cfg.maxReviewRounds} fix rounds and ${cfg.maxReviewRounds + 1} fresh-context refutation reviews: the loop applied every finding of every round and the review after the last fix still reports these. A plan finding that survives that is usually a decision the run is not authorised to take — a constitution amendment that fails its admission test, or a design the spec and the code disagree about`, r.findings)
}

// ---------------------------------------------------------------------------
// Stage: tasks → analyze ⇄ remediate
// ---------------------------------------------------------------------------
if (runs('tasks')) {
  phase('Tasks')
  state.stagesRun.push('tasks')
  const P = featurePaths(state.featureDir)
  await run('tasks', 'tasks', [
    UNATTENDED,
    SKILL_HOW('speckit-tasks'),
    FEATURE_CONTEXT(),
    `The feature is ${state.featureDir}.`,
    `${SPEC_IS_NOT_OURS(P.spec)} No task you write edits it either: a gap that could only be closed by changing the spec is not a task, and a task that would reword a requirement to match the plan is the same edit at one remove.`,
    cfg.tasksGuidance ? `Arguments for the skill (task generation constraints): ${cfg.tasksGuidance}` : 'Arguments for the skill: none.',
    `Rules: every task names the file it touches; every phase ends with a task that runs the definition of done, \`${state.wall}\`, and fixes until it is green; the phases follow the template ("## Phase N: ..."). Every FR and SC of ${P.spec} is named by at least one task in this file — the gate refuses an id no task names — in qualified form \`${featureNum(state.featureDir)}/FR-nnn\` or \`${featureNum(state.featureDir)}/SC-nnn\`, and that task writes a test citing it — or, it is named by a task that adds its row to specs/trace-waivers.tsv (\`${featureNum(state.featureDir)}/ID<TAB>kind<TAB>reason\`, rows sorted), where kind is exactly \`external\` (the criterion cannot be witnessed from inside this repository at all — a production latency figure, an operator procedure) or \`deferred\` (specified but deliberately not built in this feature; the reason names where that deferral is recorded — a plan.md scope boundary, a GATES.md named-gap row, the owning capability). A requirement that is merely untested is neither: it gets a test, not a waiver row. This tasks stage is the only place a waiver task may originate: no later stage adds one. A task that dictates Javadoc or comment wording also uses the qualified form, never the bare id. Run the before_tasks and after_tasks hooks.`,
    `Return done=true with the number of tasks and phases written to ${P.tasks}.`,
  ].filter(Boolean).join('\n'), S.done, 'Tasks')
}

if (runs('analyze')) {
  state.stagesRun.push('analyze')
  const P = featurePaths(state.featureDir)
  let analysis = null
  let approved = false
  for (let round = 1; round <= cfg.maxAnalyzeRounds + 1; round++) {
    analysis = await run('analyze', `analyze ${round}`, [
      UNATTENDED,
      SKILL_HOW('speckit-analyze'),
      FEATURE_CONTEXT(),
      `The feature is ${state.featureDir}. Read-only: change nothing.`,
      'Run the analysis in full and produce its report, then instead of offering remediation return every finding as data: id, severity as the skill grades it, the artifact it lives in (spec, plan, tasks, constitution, other), the location, a one-sentence summary and the concrete recommendation. Include the coverage figure.',
    ].filter(Boolean).join('\n'), S.analysis, 'Tasks')
    state.rounds.analyze = round
    const critical = analysis.findings.filter(f => f.severity === 'CRITICAL')
    const high = analysis.findings.filter(f => f.severity === 'HIGH')
    log(`analyze round ${round}: ${critical.length} critical, ${high.length} high, ${analysis.findings.length - critical.length - high.length} medium/low, coverage ${analysis.coverage}`)
    const serious = critical.concat(high)
    if (serious.length === 0) { approved = true; break }
    if (round > cfg.maxAnalyzeRounds) break
    const fixer = critical.length ? 'remediateCritical' : 'remediate'
    const remedied = await run(fixer, `remediate ${round}`, [
      UNATTENDED,
      `Resolve the following analysis findings by editing the artifact each one names under ${state.featureDir} (plan.md and its companions, or tasks.md) or ${CONSTITUTION} for a constitution finding. Edit in place. A coverage gap is resolved by adding tasks to the right phase of ${P.tasks} with new ids after the current maximum, never by renumbering. A constitution violation is resolved by changing the plan, not the constitution, unless the finding says the constitution is what is wrong.`,
      SPEC_IS_NOT_OURS(P.spec),
      `So a finding the analysis files against the spec is resolved in the plan or the tasks where it can be — the spec is the authority the other artifacts are wrong against — and where it genuinely cannot be, put it in \`specChanges\` naming the requirement and the change the spec needs, apply the rest, and change nothing in ${P.spec}. \`specChanges\` stops the run and takes those findings to the spec's author, so put there only what no edit you are allowed to make can resolve.`,
      'Apply every CRITICAL and HIGH finding; apply MEDIUM and LOW ones when the edit is local and safe, otherwise leave them.',
      analysis.findings.map(f => `${f.id} [${f.severity}] ${f.artifact} — ${f.location}: ${f.summary}\n   Recommendation: ${f.recommendation}`).join('\n'),
      `Then commit with the message "tasks: analysis round ${round}". Return done=true with the short sha and the findings you left unapplied under skipped.`,
    ].join('\n'), S.done, 'Tasks')
    const specChanges = specChangesOf(remedied)
    if (specChanges.length) {
      return await needsHuman('analyze',
        `an analysis finding can only be resolved by changing ${P.spec}, and no stage of this run edits the spec: it is the feature author's, written before the build started. The ${specChanges.length} change(s) below go to that author — with /speckit-clarify or an edit to the spec — and the build restarts at plan afterwards. Every other finding of this round was applied`,
        specChanges)
    }
  }
  if (!approved) return await needsHuman('analyze', `CRITICAL or HIGH analysis findings remain after ${cfg.maxAnalyzeRounds} remediation rounds and ${cfg.maxAnalyzeRounds + 1} analyses: the loop ran a remediation agent over every finding of every round — the critical-tier one where a CRITICAL was open — and the analysis after the last one still grades these CRITICAL or HIGH`, analysis.findings)
}

// ---------------------------------------------------------------------------
// Stage: implement, one agent per phase
// ---------------------------------------------------------------------------
// NO GATE IS EVER WEAKENED TO MAKE A WALL GREEN. The prohibition is in the ordinary
// prompt and enumerated in the repair prompt below, because the repair pass is where
// the temptation lives: an agent told to turn a red wall green, with no task list
// left to do it through, can always delete the test instead. A green wall bought that
// way is strictly worse than the needs-human exit it replaced, so the repair prompt
// names every move it may not make and tells the agent to return wallGreen=false and
// leave the tree alone when the only route it can see is one of them.
// A forced convergence task is closed by the fix (owner's rule, 2026-09-20: a severity
// floor of NONE means a LOW finding is fixed). The three blockers admitted are the ones
// an agent cannot work past from inside the feature — the third being a fix that would
// have to edit spec.md, which is the feature author's (2026-09-21); everything else claimed on
// product-catalog 004 — "this toolchain cannot express it", "a deployment decision",
// "the artifacts already name it as a gap", "the file is append-only" — was fixed by
// hand the same day, so none of those is a blocker and the prompt says so by name.
const FORCED_RULE = [
  '- FORCED CONVERGENCE PHASE. Every task in this phase is a finding the loop will not tolerate, and each is closed by the change that makes the finding untrue — code, a test, a migration, a gate, a document edit. It is never closed by writing down why it was not fixed: do not add a rationale entry anywhere, do not tick a task on the strength of one, and do not tick a task because an earlier rationale, a named gap in plan.md or a row in a gates document already describes the finding. Those describe the gap; the task is to close it.',
  '- A fix is blocked in exactly three cases: (a) a numbered requirement in spec.md or an article of the constitution forbids the change — quote it with its id; (b) the change needs a system outside this repository that does not exist; (c) the only fix is an edit to spec.md, which no stage of this run makes — name the requirement and the change the spec needs, and it goes to the spec\'s author. Nothing else is a blocker. "The toolchain cannot express this check", "this is a deployment decision", "the plan already names this as a gap", "no feature has proposed it yet" and "the file is append-only" are not blockers: find another shape for the check, make the decision and wire it, close the named gap, edit the file. A finding you believe is simply wrong is not ticked either: it stays unchecked and the reason goes in `blocked`.',
  '- A blocked task stays "- [ ]". Fix every task that is not blocked, tick those, and return the blocked ones in `blocked` with the blocker quoted. Never tick a task whose finding is still true.',
].join('\n')

const implementPhase = async (ph, phaseLabel, repair, forced) => {
  const P = featurePaths(state.featureDir)
  const ids = ph.taskIds.length ? `${ph.taskIds[0]}–${ph.taskIds[ph.taskIds.length - 1]}` : 'none'
  const r = await run('implement', `implement phase ${ph.number}${repair ? ' (wall repair)' : ''}`, [
    UNATTENDED,
    SKILL_HOW('speckit-implement'),
    FEATURE_CONTEXT(),
    `The feature is ${state.featureDir}. Arguments for the skill: "Execute only Phase ${ph.number}: ${ph.title} (tasks ${ids}). Every other phase is out of scope: do not start it, do not tick it."`,
    'Rules for the unattended decisions this skill would otherwise ask about:',
    `- ${SPEC_IS_NOT_OURS(P.spec)} Where the only way you can see to finish a task is an edit to the spec, the task is not done: leave it "- [ ]" and say so, quoting the requirement. A run that reshapes the spec to fit the code has deleted its own definition of done.`,
    '- If a checklist has unchecked items, proceed anyway (the spec and plan were already reviewed) and list the unchecked items in your summary.',
    `- Definition of done for this phase: after its tasks, run \`${state.wall}\` and fix what it reports until it passes. Fix root causes in the code, never by weakening a gate, deleting a test or adding a suppression. Give up only after ${cfg.maxWallAttempts} full attempts, and then return wallGreen=false with the failing output.`,
    `- Requirement ids: cite an FR or SC only in qualified form \`${featureNum(state.featureDir)}/FR-nnn\` or \`${featureNum(state.featureDir)}/SC-nnn\`, never bare, outside ${state.featureDir}/ — code, tests, SQL, OpenAPI descriptions and docs/GATES.md included. Prove an id by citing it, in qualified form, in a test under a test root. If the wall's traceability gate fails on a missing citation, fix it by writing or citing the test that proves it. Write a row to specs/trace-waivers.tsv only when the task you are executing says to; never add one on your own judgment to turn the gate green.`,
    `- Tick each finished task in ${P.tasks} ("- [ ]" → "- [x]"). Wait for the wall to finish before you return; never leave it running in the background.`,
    '- Run the before_implement and after_implement hooks; if nothing committed the work, commit it yourself with a message naming the phase.',
    forced ? FORCED_RULE : '',
    repair ? [
      `WALL REPAIR PASS. A previous agent ran this phase and left \`${state.wall}\` RED after ${cfg.maxWallAttempts} attempts. You are a fresh context on the same phase and the same tree: read what it reported below, find the root cause in the code, fix that, and run the wall until it passes. Whatever of the phase's work is already done and committed stays done — do not redo it.`,
      `What the previous agent reported: ${repair.summary || '(no summary)'}`,
      'The failing wall output it returned:',
      '```',
      repair.wallOutput || '(the previous agent returned no output)',
      '```',
      'How you may NOT make it pass, in any circumstances: skipping, ignoring, disabling, quarantining or deleting a test; adding a suppression, an exclusion, a baseline entry, a traceability waiver row, or an ignore comment; editing the spec.md of the feature directory; lowering a threshold or a coverage figure; relaxing, reordering or removing a gate; editing the wall script, the build file or any gate configuration to stop it reporting; or passing a force flag. A green wall bought any of those ways is a worse outcome than the red wall you were given, and it is the one result this run cannot accept. If the only route you can see is one of them, change nothing, leave the tree as you found it, and return wallGreen=false naming the gate and why.',
    ].join('\n') : '',
    `Return wallGreen, the task ids of this phase still unchecked, the commit sha and a short summary${forced ? ', and in `blocked` one entry per task you left unchecked with its blocker quoted' : ''}.`,
  ].filter(Boolean).join('\n'), S.implemented, phaseLabel)
  state.implemented.push({ phase: ph.number, title: ph.title, wallGreen: r.wallGreen, unchecked: r.unchecked, commit: r.commit || '' })
  log(`phase ${ph.number} ${ph.title}${repair ? ' (wall repair)' : ''}: wall ${r.wallGreen ? 'green' : 'RED'}, ${r.unchecked.length} unchecked`)
  return r
}

// One phase run to a green wall and a fully ticked task list, with the two bounded
// retries the loop is allowed and no third. Both exist because the alternative was a
// needs-human exit on work the loop had the agents to finish (owner's rule,
// 2026-09-18: a run must not hand back what it could have fixed itself).
//   - A red wall gets ONE fresh-context repair pass carrying the failing output. The
//     first agent had already run the wall maxWallAttempts times inside its own
//     context, so a second attempt by that context is not what is missing; a second
//     context reading the same failure is, and that is this skill's own premise for
//     every review gate. Nothing in the pass may weaken a gate — see implementPhase.
//   - Tasks left unchecked get ONE second pass over exactly those ids: the shape the
//     implement stage already ran, which the convergence phases did not have.
// Ceiling: three implement agents per phase, no recursion, no retry of a retry. The
// loop escalates rather than inventing a fourth shape, and the `why` it returns says
// what was attempted and how often, so a person reading HANDOFF.md can tell "nobody
// tried" from "tried three ways". `what` names the phase for those messages.
const runPhaseToDone = async (ph, phaseLabel, what, forced) => {
  let r = await implementPhase(ph, phaseLabel, null, forced)
  if (!r.wallGreen) {
    log(`${what}: the wall is RED after ${cfg.maxWallAttempts} attempts inside one agent — one fresh-context repair pass, and the loop escalates if that fails too`)
    const repaired = await implementPhase(ph, phaseLabel, { wallOutput: r.wallOutput || '', summary: r.summary || '' }, forced)
    if (!repaired.wallGreen) {
      return {
        ok: false,
        why: `the wall is red at ${what}, and the loop has tried twice: the implementing agent ran \`${state.wall}\` up to ${cfg.maxWallAttempts} times and failed, then a second agent with a fresh context and that failing output fixed and re-ran it and failed as well. Neither was permitted to make it pass by weakening a gate`,
        detail: { unchecked: repaired.unchecked, wallOutput: repaired.wallOutput || r.wallOutput || '' },
      }
    }
    r = repaired
  }
  if (r.unchecked.length) {
    const again = await implementPhase({ ...ph, taskIds: r.unchecked }, phaseLabel, null, forced)
    if (!again.wallGreen) {
      return {
        ok: false,
        why: `the wall is red at ${what} after a second implement pass over the ${r.unchecked.length} task(s) the first one left unchecked`,
        detail: { unchecked: again.unchecked, wallOutput: again.wallOutput || '' },
      }
    }
    if (again.unchecked.length) {
      return {
        ok: false,
        why: `tasks of ${what} stay unchecked after two implement passes over them, both with the wall green: the loop ran the phase, then ran a second agent over exactly the ids left, and these are still "- [ ]". A task that two passes decline to tick is one the agents will not claim done${forced ? '. This is a forced convergence phase, where a task is closed only by the fix: each of these is a finding two agents tried to fix and returned as blocked, and the blocker each named is in the detail — a requirement that forbids the change, or a system that does not exist. Every other task of the phase was fixed and committed. What is left is a decision about the spec, not work the loop withheld' : ''}`,
        detail: forced ? { unchecked: again.unchecked, blocked: (again.blocked && again.blocked.length ? again.blocked : r.blocked) || [] } : again.unchecked,
      }
    }
  }
  return { ok: true }
}

const readPhases = async (label, group) => {
  const P = featurePaths(state.featureDir)
  const p = await run('phases', label, [
    UNATTENDED,
    `Read ${P.tasks} and return its phases: each "## Phase N: title" heading with N, the title, every task id (Txxx) under it in order, and how many of them are still unchecked ("- [ ]"). Parse only; change nothing.`,
  ].join('\n'), S.phases, group)
  return p.phases
}

// The phase an append just wrote is found by its number or not at all. The reader is a
// parse-only agent on the cheapest tier, and on 2026-09-20 it returned 13 phases of a
// 31-phase tasks.md; the fallback then in place — the last phase the reader returned —
// sent implement at phase 13, already complete, which came back green, and the forced
// phase's thirteen tasks stayed unchecked through four further rounds that each reported
// them. So: one re-read that names the miss, then a person. A wrong phase implemented
// green is worse than a stop. Where the append gave no number, the last phase stands in
// only while it holds unchecked tasks, which a phase just appended always does.
const readAppendedPhase = async (number, label, group) => {
  const numbered = Number.isInteger(number)
  const pick = phases => numbered
    ? phases.find(p => p.number === number)
    : (phases.length && phases[phases.length - 1].unchecked > 0 ? phases[phases.length - 1] : undefined)
  const first = await readPhases(label, group)
  const hit = pick(first)
  if (hit) return hit
  const P = featurePaths(state.featureDir)
  const want = numbered ? `phase ${number}` : 'a last phase with unchecked tasks'
  log(`${label}: the reader returned ${first.length} phase(s), highest ${first.reduce((m, p) => Math.max(m, p.number), 0)}, and not ${want} — one re-read, and the loop escalates if that misses too`)
  const again = await run('phases', `${label} (re-read)`, [
    UNATTENDED,
    `Read ${P.tasks} to its last line and return its phases: each "## Phase N: title" heading with N, the title, every task id (Txxx) under it in order, and how many of them are still unchecked ("- [ ]"). Parse only; change nothing.`,
    `An earlier read of this file returned ${first.length} phase(s) and stopped short: it did not return ${want}, which was appended to the end of the file moments ago. The file is long. Count the "## Phase" headings first (\`grep -c '^## Phase ' ${P.tasks}\`) and return exactly that many phases, the last of them included.`,
  ].join('\n'), S.phases, group)
  return pick(again.phases) || null
}

if (runs('implement')) {
  phase('Implement')
  state.stagesRun.push('implement')
  const phases = await readPhases('phases', 'Implement')
  log(`${phases.length} phases, ${phases.reduce((n, p) => n + p.unchecked, 0)} unchecked tasks`)
  for (const ph of phases) {
    if (ph.unchecked === 0) { log(`phase ${ph.number} already complete, skipped`); continue }
    const done = await runPhaseToDone(ph, 'Implement', `phase ${ph.number} (${ph.title})`)
    if (!done.ok) return await needsHuman('implement', done.why, done.detail)
  }
}

// ---------------------------------------------------------------------------
// Stage: converge ⇄ implement
// ---------------------------------------------------------------------------
if (runs('converge')) {
  phase('Converge')
  state.stagesRun.push('converge')
  // Converge has no fixed point: on the hand-driven 001-product-hierarchy run
  // (2026-09-18) it took five passes, and the fifth appended nothing only because
  // the operator stopped applying findings below the floor. So the severity floor
  // is the loop's only stop test, and reaching the cap is reported, not escalated.
  // The default floor is NONE (owner's decision 2026-09-18, reversing the LOW
  // default taken earlier the same day on that run's evidence): a tolerated finding
  // is a finding left open, so the loop tolerates none and the cap is what ends a
  // long run.
  const SEVERITY_FLOOR = cfg.severityFloor
  // NONE ranks below every graded severity, so every graded finding is above it.
  const floorRank = SEVERITY_FLOOR === 'NONE' ? SEVERITY_ORDER.length : SEVERITY_ORDER.indexOf(SEVERITY_FLOOR)
  // Rank-based against the declared order, so the floor means what its name says and
  // args.severityFloor moves it: MEDIUM stops the loop only once nothing is above
  // MEDIUM. A severity off the scale ranks above the floor — an ungradeable finding
  // is not a finding below it.
  const aboveFloorSev = f => {
    const rank = SEVERITY_ORDER.indexOf(f.severity)
    return rank === -1 || rank < floorRank
  }
  // Every log and exit message that names the floor: under NONE "nothing above NONE"
  // is not what the run means, and the reader is owed the rule rather than the name.
  const noneFloor = SEVERITY_FLOOR === 'NONE'
  const floorPhrase = noneFloor ? 'no finding is tolerated' : `nothing above ${SEVERITY_FLOOR}`
  const nothingLeft = noneFloor ? 'nothing graded at all' : `nothing graded above ${SEVERITY_FLOOR}`
  const gradeOf = findings => SEVERITY_ORDER.map(sev => `${findings.filter(f => f.severity === sev).length} ${sev.toLowerCase()}`).join(', ')
  // The floor is never in the prompt: the assessment grades on Step 5's scale alone
  // and the script filters afterwards, so moving args.severityFloor cannot move a
  // grade. One prompt for both kinds of round. assessOnly is the extra round after the cap:
  // same assessment, no append, no commit, so its findings are open work rather than
  // work the round that found it has already closed.
  const convergePrompt = (round, assessOnly) => [
    UNATTENDED,
    SKILL_HOW('speckit-converge'),
    FEATURE_CONTEXT(),
    `The feature is ${state.featureDir}.`,
    SPEC_IS_NOT_OURS(P.spec),
    assessOnly
      ? 'ASSESS ONLY. Run the skill\'s assessment through its findings summary and stop there. Append nothing: tasks.md and every other file must be byte-for-byte unchanged when you finish, nothing is committed, and you run no hook that writes or commits. Return the outcome "converged", because nothing was appended; the findings below are the whole value of this round.'
      : `Run the assessment in full. Return the outcome exactly as the skill defines it: "converged" when nothing was appended, "tasks_appended" with the new phase number and the appended task ids otherwise. When tasks were appended, commit tasks.md with the message "tasks: convergence round ${round}".`,
    forcedSoFarBlock(),
    'Also return every gap the assessment found as findings — appended or not, actionable or not, including every gap it surfaced only for awareness — each graded by the severity rule in the skill\'s own Step 5 and by no other scale: CRITICAL, HIGH, MEDIUM or LOW exactly as that step defines them. For each appended one, name the task id that closes it; leave the task id empty for a gap no task closes.',
    'An FR or SC the wall\'s traceability gate reports as uncovered is unbuilt work, not a documentation finding: grade it like any other gap and, when it is actionable, append the task that writes the missing test — never a note explaining the absence.',
  ].filter(Boolean).join('\n')

  // -------------------------------------------------------------------------
  // The forced convergence round (2026-09-18).
  //
  // /speckit-converge Step 7 appends tasks only for the findings it judges
  // *actionable*, and Step 4 surfaces `unrequested` gaps for awareness alone, so a
  // "converged" return routinely carries graded findings that nothing in the
  // repository closes. Until today the loop escalated that to a person, and the
  // comment beside the escalation admitted the trap: the floor exists precisely to
  // refuse converge's non-actionability judgment, and under the NONE default the
  // branch fired on any finding at all. Observed on feature specs/002-product: the
  // run stopped on four LOW findings — FR traceability citations, one GATES.md table
  // row described too thinly, two test and naming wordings — and every one of them
  // was a mechanical edit the loop had the agents to make.
  //
  // So the loop gets the move it was missing. A floor that declines converge's
  // judgment must supply the work that judgment withheld: the script appends those
  // findings itself, one task per finding, and implements the phase through the same
  // implementPhase the appended rounds use, with the same wall gate.
  //
  // Round accounting: a forced round is done inside the slot of the round that
  // discovered it, and the loop then continues to its next round, exactly as a
  // `tasks_appended` round does. So maxConvergeRounds stays the single bound on the
  // stage — at most that many converge agents and at most that many
  // append-and-implement cycles, forced or not — and no pathological run can spin.
  // The extra cost of a forced round over an appended one is one forceAppend agent.
  // -------------------------------------------------------------------------
  const P = featurePaths(state.featureDir)

  // A finding's identity, so the loop can tell a finding it already forced from a new
  // one. Severity, location and summary, lowercased with whitespace collapsed and a
  // trailing full stop dropped, because those three are the whole of what the schema
  // makes a converge round return about a finding and the wording arrives re-typed by
  // a fresh agent each round. This is exact-match identity: a finding whose summary
  // the next round re-words is a new identity and can be forced again. That is not
  // the bound — maxConvergeRounds is — and it is the honest reading of "already
  // tried": the loop claims a survivor only where it can show the same finding twice.
  const findingId = f => [
    String(f.severity || '').toUpperCase(),
    String(f.location || '').toLowerCase().replace(/\s+/g, ' ').trim().replace(/\.$/, ''),
    String(f.summary || '').toLowerCase().replace(/\s+/g, ' ').trim().replace(/\.$/, ''),
  ].join(' | ')
  // The set already forced in this run, keyed by that identity and valued with the
  // round that forced it; forcedList is the same record in order, for the return value
  // and for the handoff a survivor writes.
  const forcedIds = {}
  const forcedList = []
  // Exact match alone never fired: on product-catalog 004 (2026-09-20) the same
  // thirteen findings came back six rounds running, re-worded each time, and were
  // forced six times. So the assessment is also handed the numbered list of what this
  // run already forced and labels each finding it returns with the entry it restates
  // (repeatOf). The label is asked for after the assessment and changes nothing about
  // what is assessed or graded; it is the only reader placed to say "same gap".
  const forcedRoundOf = f => forcedIds[findingId(f)] ||
    (Number.isInteger(f.repeatOf) && f.repeatOf > 0 && forcedList[f.repeatOf - 1] ? forcedList[f.repeatOf - 1].round : 0)
  const survivorsOf = findings => findings.filter(f => forcedRoundOf(f))
  const forcedSoFarBlock = () => forcedList.length ? [
    'This run has already appended a task against each finding below and implemented it with the wall green. Assess exactly as you would without this list. Then, for every finding you return, set `repeatOf` to the number of the entry it restates — the same gap at the same place, however either is worded — or to 0 where it is new:',
    forcedList.map((f, i) => `${i + 1}. [${f.severity}] ${f.location} — ${f.summary}`).join('\n'),
  ].join('\n') : ''

  // The findings are rendered here and never described, for the reason the handoff
  // document is rendered here: the agent downstream must not be able to paraphrase a
  // finding, reorder them or drop one. It is told nothing about the severity floor —
  // it receives what the script already filtered, and re-grading is not its job.
  const forcedFindingsBlock = fs => fs.map((f, i) => [
    `${i + 1}. [${f.severity}] ${f.location || '(no location given)'}`,
    `   summary: ${f.summary}`,
    f.taskId ? `   the assessment named this existing task against it: ${f.taskId}` : '   the assessment named no task against it',
  ].join('\n')).join('\n')

  // The forced phase's title is fixed here rather than left to the agent, because three
  // separate things key off it: the append writes it, the reconcile looks for it, and
  // the parse-only reader certifies the verdict by finding it or not finding it.
  const forcedTitle = round => `Convergence (forced round ${round})`
  const holdsForcedPhase = (phases, round) =>
    phases.filter(p => String(p.title || '').toLowerCase().indexOf(`forced round ${round}`) !== -1)

  const forceAppendPrompt = (round, fs) => [
    UNATTENDED,
    `The feature is ${state.featureDir}; its tasks file is ${P.tasks}.`,
    `A convergence assessment of this feature has just reported that it appended no tasks, and reported the findings below all the same. They are open work: nothing in ${P.tasks} closes them. Your only job is to append them to ${P.tasks} as one new convergence phase, one task per finding, so that the implement stage runs them. You are not assessing anything. Do not read the code to re-check a finding, do not re-grade one, do not judge one non-actionable, do not drop, merge, split or reorder them, do not add a finding of your own, and do not fix anything. Every finding below gets exactly one task, in the order given.`,
    `${SPEC_IS_NOT_OURS(P.spec)} No task you write asks anyone else to either: a task worded to reconcile the spec with the code is that edit at one remove. Write each task against the code, the tests, the gates, the documents or the plan.`,
    'The findings, exactly as the assessment returned them:',
    forcedFindingsBlock(fs),
    `Append to the end of ${P.tasks}, following /speckit-converge's own append contract and nothing else: append only, rewrite nothing, renumber nothing, touch no existing task and no earlier convergence phase, and change no file but ${P.tasks}.`,
    `1. Scan every existing task id; let M be the maximum, and let N be the highest existing phase number plus one.`,
    `2. Write one new section header: \`## Phase N: ${forcedTitle(round)}\`. Write that title exactly: the rest of this run finds this phase by it.`,
    '3. Emit one checklist item per finding, in the order above, with zero-padded ids T{M+1:03d}, T{M+2:03d}, …, on this template:',
    '',
    '   ```markdown',
    '   - [ ] T042 <imperative work that closes the finding> per <the finding\'s location, copied> (forced)',
    '   ```',
    '',
    "   Substitute `<the finding's location, copied>` with the finding's location exactly as given above. The parenthetical is the literal word `forced` where an ordinary convergence task carries its gap type: the assessment gave you a severity, a location and a summary and no gap type, and inventing one would be a classification you made up.",
    '4. **One closure route: the change.** Every task names work that closes its finding — code, a test, a migration, a gate, a document edit — and is closed by that work being in the tree. Do not write a task that can be closed by recording why the finding is not a defect, by a rationale entry, or by pointing at a place that already declares the gap: a finding the artifacts already name as a gap is still a finding, and the task is to close the gap. Where the finding is about an *absence* ("no approval gate lives here"), the work is the check that fails when the absence stops being true, not a citation. Whether a fix turns out to be impossible is the implementer\'s to find by trying, not yours to predict in the task text.',
    `5. Commit ${P.tasks} and nothing else: \`git add -- ${P.tasks} && git commit -m "tasks: forced convergence round ${round}" -- ${P.tasks}\`. The pathspec matters: the tree may hold this run's other work.`,
    `Return appended=true only when the phase header and one task per finding are in ${P.tasks} on disk and committed, with the phase number and every task id paired with the location of the finding it was written from. If any step fails, return appended=false with the reason in note; never return appended=true for a partial append.`,
  ].join('\n')

  // Reconcile, 2026-09-19. A forced append that reports it failed used to end the run:
  // the reasoning was that the agent may have written part of the phase first, so a
  // blind retry would duplicate it. That is an argument against a *blind* retry and
  // not against a retry — and "somebody needs to look at tasks.md" is not a human-only
  // act, which is the owner's rule (2026-09-18) applied to the one site that had
  // survived it. Git is the oracle: at this instant nothing else in the run has
  // touched tasks.md since the last round's implement committed, so an uncommitted
  // change to it is the failed agent's own partial write and `git checkout` restores
  // the known-absent state exactly, with nothing judged by eye.
  const reconcilePrompt = (round, fs, fa) => [
    UNATTENDED,
    `The feature is ${state.featureDir}; its tasks file is ${P.tasks}.`,
    `An agent was asked to append a phase titled \`${forcedTitle(round)}\` to ${P.tasks}, holding ${fs.length} task(s) — one per finding — and to commit it. It reported that it failed: ${fa.note || '(it gave no reason)'}. ${fa.tasks && fa.tasks.length ? `Before failing it said it had written these ids: ${fa.tasks.map(t => t.taskId).filter(Boolean).join(', ') || '(none)'}.` : 'It named no task ids.'}`,
    `Your only job is to establish what state ${P.tasks} is actually in, bring it to one of two known states, and report which. You do not author a task, you do not decide anything about the findings, and you do not implement anything.`,
    'Read the evidence before you touch anything. Git is the record and your eye is not:',
    `1. \`git status --porcelain -- ${P.tasks}\` — an uncommitted change here is that agent's partial write. Nothing else in this run has touched the file since the previous round's work was committed.`,
    `2. \`git diff -- ${P.tasks}\` and \`git diff --staged -- ${P.tasks}\` — exactly what it wrote and did not commit.`,
    `3. \`git log -3 --oneline -- ${P.tasks}\` — whether it committed anything after all, for instance a commit named "tasks: forced convergence round ${round}".`,
    `4. Then read the end of ${P.tasks} itself, and look for a \`## Phase N: ${forcedTitle(round)}\` heading.`,
    'Bring the file to exactly one of two states, and nothing in between:',
    `- **absent** — no part of that phase is in ${P.tasks} and the file is well-formed. Where the partial write is uncommitted, reach this with \`git checkout -- ${P.tasks}\`, which restores the committed file byte for byte and is the whole of the repair: prefer it to editing. Where the partial phase was committed, remove exactly that phase — its heading and the task lines under it, nothing above it, nothing after it — and commit with the message "tasks: remove a partial forced convergence round ${round}".`,
    `- **present** — that phase is wholly there and well-formed: the heading, ${fs.length} task line(s) under it, each "- [ ] T###", none of them ticked, and no earlier phase or task altered. If it is committed, leave it; if it is only in the working tree, commit it with the message "tasks: forced convergence round ${round}". Report the phase number and the task ids.`,
    '**If you cannot establish either state with confidence, return state="unsure" and change nothing.** That is a correct answer, and the run has a path for it. In particular: if you cannot tell a line of the partial phase from work that was already in the file, if the diff touches anything outside the new phase, or if the git evidence and the file disagree, it is unsure. A guess here either deletes real tasks or leaves a duplicate phase behind, and nothing downstream can undo either.',
    `Hard limits. You may write to ${P.tasks} and to no other file: not spec.md, not plan.md, not the constitution, not any code. You never tick or untick a task ("- [ ]" stays "- [ ]", "- [x]" stays "- [x]"). You never renumber, reorder or reword an existing task, and you never touch a phase other than this round's forced one. You run no build and no hook.`,
    'Return the state, the phase number and task ids when it is present, whether you removed anything, the commit sha if you committed, and — in `evidence` — the git and file lines your verdict rests on, quoted. Somebody may read that instead of opening the file.',
  ].join('\n')

  let ended = null
  let endingFindings = []
  for (let round = 1; round <= cfg.maxConvergeRounds; round++) {
    const last = await run('converge', `converge ${round}`, convergePrompt(round, false), S.converged, 'Converge')
    state.rounds.converge = round
    const findings = Array.isArray(last.findings) ? last.findings : []
    const aboveFloor = findings.filter(aboveFloorSev)
    const grade = gradeOf(findings)
    if (last.outcome === 'converged') {
      // The floor is consulted before the outcome. /speckit-converge Step 7 calls a
      // round converged when it judges its findings non-actionable, and Step 4
      // surfaces `unrequested` gaps for awareness, so a HIGH finding can arrive on a
      // "converged" return. Nothing was appended, so another assessment would repeat
      // this round identically — but that is an argument for the loop authoring the
      // work, not for handing it to a person: converge judging a gap non-actionable
      // is exactly the judgment this floor refuses to make on its behalf, so the
      // floor owes the work that judgment withheld. The forced round supplies it.
      if (aboveFloor.length) {
        const survivors = survivorsOf(aboveFloor)
        if (survivors.length) {
          // The loop already appended and implemented a forced task against this
          // finding and the finding came back: the attempt did not take, and the
          // difference between "nobody tried" and "the loop tried and failed" is the
          // whole value of this handoff. Both sets go in the detail, survivors first.
          return await needsHuman('converge',
            `converge reported converged while still grading ${aboveFloor.length} finding(s) the floor ${SEVERITY_FLOOR} does not tolerate, and ${survivors.length} of them survived a forced convergence round: the loop had already appended a task against each and implemented it with the wall green, and the assessment reports it again. Forced and survived: ${survivors.map(f => `[${f.severity}] ${f.location} (forced in round ${forcedRoundOf(f)})`).join('; ')}. A finding is forced once, so this one is a person's.`,
            survivors.concat(aboveFloor.filter(f => !forcedRoundOf(f))))
        }
        log(`converge round ${round}: converged with nothing appended and ${aboveFloor.length} finding(s) above the floor (${grade}) — appending them as a forced convergence round; ${floorPhrase}, so converge's non-actionable judgment is not this loop's`)
        let fa = await run('forceAppend', `force-append converge ${round}`, forceAppendPrompt(round, aboveFloor), S.forceAppended, 'Converge')
        // A failed append is reconciled and retried once, never escalated blind. The
        // sequence is: one reconcile agent brings tasks.md to a known state, the
        // parse-only `phases` reader certifies that state independently — the same
        // separation the finish wall repair uses, because the agent that cleans up is
        // not the one that may certify the result — and then the loop either
        // implements a phase that turned out to be wholly there, or appends once more
        // against a file that is wholly clean. Exactly one reconcile and one retry;
        // there is no retry of a retry, and the forced-once identity rule still
        // governs which findings may be forced at all.
        const failedAppend = fa.appended ? null : fa
        let recon = null
        // Set only where the certification read has already established the phase, so
        // the loop does not pay a second parse of a file nothing has touched since.
        let certifiedPhase = null
        if (!fa.appended) {
          log(`converge round ${round}: the forced append reported failure (${fa.note || 'no reason given'}) — reconciling ${P.tasks} against git before anything else touches it`)
          recon = await run('reconcileTasks', `reconcile tasks.md after forced append ${round}`, reconcilePrompt(round, aboveFloor, fa), S.reconciled, 'Converge')
          log(`reconcile after forced append ${round}: ${recon.state}${recon.removed ? ', a partial phase was removed' : ''}${recon.commit ? ` (${recon.commit})` : ''}`)
          if (recon.state === 'unsure') {
            // The legitimate escalation on this path, and the only one the reconcile
            // itself can produce: acting on a guess about this file either deletes
            // real tasks or leaves a duplicate phase, and neither is recoverable.
            return await needsHuman('converge',
              `the forced convergence round could not append its ${aboveFloor.length} finding(s) to tasks.md (${fa.note || 'the forced append reported no reason'}), and the reconcile that read tasks.md against git could not establish whether the forced phase is wholly absent or wholly present: ${recon.summary || 'it gave no summary'}. It changed nothing, deliberately — a guess here deletes real tasks or leaves a duplicate phase. What it saw is below, so tasks.md does not need to be worked out from scratch`,
              { state: recon.state, evidence: recon.evidence, summary: recon.summary, appendNote: fa.note || '', findings: aboveFloor })
          }
          // The certification is a different agent, and a parse-only one: the reconcile
          // does not get to be the witness to its own repair.
          const certPhases = await readPhases(`phases after reconciling tasks.md ${round}`, 'Converge')
          const seen = holdsForcedPhase(certPhases, round)
          const disagreement = recon.state === 'present'
            ? (seen.length !== 1
              ? `it reported the phase wholly present, and the reader finds ${seen.length} phase(s) titled for this forced round`
              : (seen[0].taskIds.length !== aboveFloor.length
                ? `it reported the phase wholly present with ${aboveFloor.length} task(s), and the reader finds ${seen[0].taskIds.length}`
                : (seen[0].unchecked !== seen[0].taskIds.length
                  ? `it reported the phase wholly present and unticked, and the reader finds ${seen[0].taskIds.length - seen[0].unchecked} of its ${seen[0].taskIds.length} task(s) already ticked`
                  : '')))
            : (seen.length ? `it reported the phase wholly absent, and the reader still finds ${seen.length} phase(s) titled for this forced round` : '')
          if (disagreement) {
            return await needsHuman('converge',
              `the forced convergence round could not append its ${aboveFloor.length} finding(s) to tasks.md, and the reconcile and the parse-only reader disagree about what is in the file afterwards: ${disagreement}. The loop stops rather than act on either account, because appending over a phase that is there duplicates it and implementing a phase that is not there does nothing. The reconcile's evidence is below`,
              { reconcileState: recon.state, evidence: recon.evidence, summary: recon.summary, appendNote: fa.note || '', findings: aboveFloor })
          }
          if (recon.state === 'present') {
            // The work is in the file and well-formed: the first agent wrote the phase
            // and then failed to say so. Re-appending would be exactly the duplication
            // this path exists to prevent, so the loop proceeds as if it had succeeded.
            log(`reconcile after forced append ${round}: the phase is wholly present as phase ${seen[0].number} with ${seen[0].taskIds.length} unticked task(s) — proceeding to implement it rather than appending it twice`)
            certifiedPhase = seen[0]
            fa = { appended: true, phase: seen[0].number, tasks: recon.taskIds && recon.taskIds.length ? recon.taskIds.map(id => ({ taskId: id, location: '' })) : [], commit: recon.commit || '' }
          } else {
            log(`reconcile after forced append ${round}: tasks.md holds no part of the forced phase${recon.removed ? ' (a partial one was removed)' : ''} — one retry of the forced append, and the loop escalates if that fails too`)
            const retry = await run('forceAppend', `force-append converge ${round} (retry)`, forceAppendPrompt(round, aboveFloor), S.forceAppended, 'Converge')
            if (!retry.appended) {
              return await needsHuman('converge',
                `the forced convergence round could not append its ${aboveFloor.length} finding(s) to tasks.md, and the loop has tried twice: the first append failed (${failedAppend.note || 'no reason given'}), a reconcile read tasks.md against git and left it with no part of the forced phase in it${recon.removed ? ', having removed a partial one' : ''}, and a second append against that clean file failed as well (${retry.note || 'no reason given'}). tasks.md is in the known state the reconcile reports below — it does not need to be worked out`,
                { reconcileState: recon.state, removed: !!recon.removed, evidence: recon.evidence, firstAppendNote: failedAppend.note || '', retryNote: retry.note || '', findings: aboveFloor })
            }
            fa = retry
          }
        }
        // Forced once, whatever the implement pass then does with it: every finding
        // handed to that agent is marked, so a second pass at the same finding is a
        // person's and not another round's.
        for (const f of aboveFloor) {
          const id = findingId(f)
          if (!forcedIds[id]) {
            forcedIds[id] = round
            forcedList.push({ round, severity: f.severity, location: f.location, summary: f.summary })
          }
        }
        log(`converge round ${round}: forced ${fa.tasks ? fa.tasks.length : '?'} task(s) as phase ${fa.phase} (${(fa.tasks || []).map(t => t.taskId).join(', ')}) — each closable by the fix and by nothing else`)
        let fph = certifiedPhase
        if (!fph) {
          fph = await readAppendedPhase(fa.phase, `phases after forced append ${round}`, 'Converge')
          if (!fph) {
            return await needsHuman('converge',
              `the forced convergence round appended phase ${fa.phase} to tasks.md and two parse-only reads of the file did not return it, so there is no phase to hand to implement; the phase is in the file and committed (${fa.commit || 'no commit named'}) and its tasks are unimplemented`,
              { phase: fa.phase, tasks: fa.tasks || [], findings: aboveFloor })
          }
        }
        const fdone = await runPhaseToDone(fph, 'Converge', `forced convergence phase ${fph.number}`, true)
        if (!fdone.ok) return await needsHuman('converge', fdone.why, fdone.detail)
        // The forced round used this round's slot; the next round re-assesses, exactly
        // as it does after an appended one, so maxConvergeRounds bounds both alike.
        continue
      }
      ended = 'converged'
      endingFindings = findings
      log(`converge round ${round}: converged — nothing appended and ${nothingLeft} (${grade})`)
      break
    }
    log(`converge round ${round}: ${last.taskIds ? last.taskIds.length : '?'} tasks appended as phase ${last.phase} (${grade})`)
    // What was appended is implemented even when the loop is about to stop at the
    // floor: the tasks are already in tasks.md, and finish reports them unchecked otherwise.
    const ph = await readAppendedPhase(last.phase, `phases after converge ${round}`, 'Converge')
    if (!ph) {
      return await needsHuman('converge',
        `converge appended ${last.taskIds ? last.taskIds.length : 'some'} task(s) as phase ${last.phase} and two parse-only reads of tasks.md did not return that phase, so there is no phase to hand to implement; the tasks are in the file and unimplemented`,
        { phase: last.phase, taskIds: last.taskIds || [], findings })
    }
    const cdone = await runPhaseToDone(ph, 'Converge', `convergence phase ${ph.number}`)
    if (!cdone.ok) return await needsHuman('converge', cdone.why, cdone.detail)
    // A round that appends tasks and grades nothing has not shown the floor was
    // reached; it has shown nothing. Counted as above the floor, so the loop goes on.
    if (findings.length === 0) {
      log(`converge round ${round}: appended tasks as phase ${ph.number} and graded nothing — what is left is unknown, not below the floor, so the loop continues`)
      continue
    }
    // Unreachable under the NONE default: a round that graded nothing has already
    // continued above, and under NONE every graded finding is above the floor. It
    // is the in-loop exit for a run that raised the floor to LOW, MEDIUM or HIGH.
    if (aboveFloor.length === 0) {
      ended = 'severity-floor'
      endingFindings = findings
      log(`converge round ${round}: nothing above ${SEVERITY_FLOOR} (${grade}) — every gap this round graded was appended as phase ${ph.number} and implemented, so the loop stops at the severity floor`)
      break
    }
  }
  if (!ended) {
    // Every round above implemented its appended phase before the loop re-checked, so
    // that round's findings are closed work and cannot say what the cap leaves open.
    // One assess-only round — the shape the review and analyze loops already run as
    // max + 1 — reports what no implement pass has closed.
    const assessRound = state.rounds.converge + 1
    const assess = await run('converge', `converge ${assessRound} (assess only)`, convergePrompt(assessRound, true), S.converged, 'Converge')
    const findings = Array.isArray(assess.findings) ? assess.findings : []
    const aboveFloor = findings.filter(aboveFloorSev)
    endingFindings = findings
    if (aboveFloor.length === 0) {
      // Under NONE this round graded nothing at all, so the run stopped because
      // converge found nothing — not because a floor tolerated what it found. The
      // label would otherwise name a floor that tolerates nothing.
      ended = noneFloor ? 'converged' : 'severity-floor'
      log(noneFloor
        ? `converge: ${cfg.maxConvergeRounds} rounds implemented, and the assess-only round after them graded nothing at all — converged`
        : `converge: ${cfg.maxConvergeRounds} rounds implemented, and the assess-only round after them graded nothing above ${SEVERITY_FLOOR} (${gradeOf(findings)}) — stopped at the severity floor`)
    } else {
      // The assess-only round appends nothing by construction, so a finding it reports
      // is never forced here — a forced round exists only inside the loop, where a
      // later round can re-assess what it wrote. The cap stays a reported outcome
      // rather than a human question, and the log says which of the open findings the
      // loop had already forced and lost, because that is what a reader needs.
      const survived = survivorsOf(aboveFloor)
      ended = 'round-cap'
      log(`converge round cap ${cfg.maxConvergeRounds} reached (floor ${SEVERITY_FLOOR}, ${floorPhrase}): the assess-only round after the last implemented phase graded ${aboveFloor.length} open finding(s) (${gradeOf(findings)}), unimplemented${survived.length ? `, ${survived.length} of them already forced and implemented in an earlier round and still reported` : ''} — carried to finish; the wall is the gate`)
    }
  }
  // The findings of whichever assessment ended the loop, never of an earlier one;
  // `forced` is every finding this run appended itself, with the round that did it.
  state.converge = { ended, rounds: state.rounds.converge, floor: SEVERITY_FLOOR, forced: forcedList, findings: endingFindings }
}

// ---------------------------------------------------------------------------
// Stage: finish
// ---------------------------------------------------------------------------
let finished = null
if (runs('finish')) {
  phase('Finish')
  state.stagesRun.push('finish')
  const P = featurePaths(state.featureDir)
  const finishPrompt = [
    UNATTENDED,
    `Close out the feature on branch ${state.branch || '(current branch)'}:`,
    `1. Run \`${state.wall}\` and wait for it; wallGreen is whether it passed. Do not fix anything.`,
    `2. \`git status --porcelain\` is empty → clean=true. If it is not, commit the leftovers with the message "feature: leftovers after converge" and report clean=true only if that commit succeeded.`,
    `3. Every task in ${P.tasks} is "- [x]" → allTasksChecked=true; otherwise false, and name the unchecked ids in the summary.`,
    cfg.push ? '4. Push the branch: `git push -u origin HEAD`. pushed=true only if the push succeeded.' : '4. Do not push; pushed=false.',
    cfg.mergeInto
      ? `5. Fast-forward \`${cfg.mergeInto}\` onto this branch: \`git checkout ${cfg.mergeInto} && git merge --ff-only ${state.branch} && git push origin ${cfg.mergeInto}\`, then check ${state.branch} out again. merged=true only if every command succeeded; a non-fast-forward is merged=false with the reason in the summary.`
      : '5. Do not merge; merged=false.',
    '6. head is the short sha of the feature branch.',
  ].join('\n')
  finished = await run('finish', 'finish', finishPrompt, S.finished, 'Finish')
  log(`finish: wall ${finished.wallGreen ? 'green' : 'RED'}, ${finished.pushed ? 'pushed' : 'not pushed'}${finished.merged ? `, merged into ${cfg.mergeInto}` : ''}`)
  // A red wall at finish is not a question for a person either: the loop turned this
  // same wall green after every implemented phase, with the same agents, and a wall
  // that was green at the last phase and is red here is a defect in the feature and
  // not a decision (owner's rule, 2026-09-18). So it gets ONE bounded repair pass —
  // and the re-check is a second finish agent rather than the repairing agent's own
  // word, because an agent that repairs a gate is not the one that may declare it
  // green. That separation is the whole safety of this path: the repair prompt
  // enumerates the moves that are forbidden, and the verdict still comes from an
  // agent that only runs the wall and reports. Exactly one repair and one re-verify;
  // a still-red wall after them is the needs-human exit below, which now says the
  // loop tried.
  if (!finished.wallGreen) {
    log('finish: the wall is RED — one fresh-context repair pass, then a second finish agent re-runs the wall to verify')
    const repair = await run('implement', 'finish wall repair', [
      UNATTENDED,
      `The feature ${state.featureDir} on branch ${state.branch || '(current branch)'} is implemented and every convergence round is done, but its definition of done is red: \`${state.wall}\` failed at the close-out check. It was green after the last implemented phase, so something later broke it. Find the root cause in the code and fix it.`,
      `1. Run \`${state.wall}\` and read what fails. What the close-out agent reported: ${finished.summary || '(no summary)'}`,
      `2. Fix the root cause in the code, then run the wall again, up to ${cfg.maxWallAttempts} full attempts.`,
      'How you may NOT make it pass, in any circumstances: skipping, ignoring, disabling, quarantining or deleting a test; adding a suppression, an exclusion, a baseline entry, a traceability waiver row, or an ignore comment; editing the spec.md of the feature directory; lowering a threshold or a coverage figure; relaxing, reordering or removing a gate; editing the wall script, the build file or any gate configuration to stop it reporting; or passing a force flag. A green wall bought any of those ways is a worse outcome than the red wall you were given, and it is the one result this run cannot accept. If the only route you can see is one of them, change nothing, leave the tree as you found it, and return wallGreen=false naming the gate and why.',
      `3. Tick nothing in ${P.tasks} and add no task: this is a repair, not a phase. Commit your fix with a message naming what was broken.`,
      'Return wallGreen as you saw it, an empty unchecked list, the commit sha and a short summary of the root cause. Your verdict is not final — a separate agent re-runs the wall after you.',
    ].join('\n'), S.implemented, 'Finish')
    log(`finish wall repair: the repairing agent saw the wall ${repair.wallGreen ? 'green' : 'RED'} — re-verifying with a finish agent`)
    finished = await run('finish', 'finish (re-verify after wall repair)', finishPrompt, S.finished, 'Finish')
    log(`finish re-verify: wall ${finished.wallGreen ? 'green' : 'RED'}, ${finished.pushed ? 'pushed' : 'not pushed'}${finished.merged ? `, merged into ${cfg.mergeInto}` : ''}`)
    state.finishRepaired = true
  }
}

// The thirteenth needs-human exit, and the one that does not go through needsHuman():
// finish ran and its wall is red. It gets the same artifact for the same reason — a
// red wall at finish is the whole verdict of the run and it must not live only in the
// invoking session — while this return keeps its own shape, with `handoff` added
// beside the rest. On a `done` return there is nothing to hand off and no agent runs.
const finishNeedsHuman = !!(finished && !finished.wallGreen)
const finishHandoff = finishNeedsHuman
  ? await writeHandoff('finish', state.finishRepaired
    ? `the definition of done is red at finish and the loop has tried twice: \`${state.wall}\` failed at close-out, one fresh-context agent fixed what it could and re-ran it, and the finish agent that re-verified afterwards still reports it red. Neither was permitted to make it pass by weakening a gate`
    : `the definition of done is red at finish: \`${state.wall}\``, {
    summary: finished.summary,
    allTasksChecked: finished.allTasksChecked,
    clean: finished.clean,
    pushed: finished.pushed,
    merged: finished.merged,
    head: finished.head,
    convergeEnded: state.converge ? state.converge.ended : null,
    convergeFindings: state.converge ? state.converge.findings : null,
  })
  : null

return {
  status: finishNeedsHuman ? 'needs-human' : 'done',
  featureDir: state.featureDir,
  branch: state.branch,
  baseBranch: state.baseBranch,
  wall: state.wall,
  rounds: state.rounds,
  converge: state.converge,
  implemented: state.implemented,
  finish: finished,
  handoff: finishHandoff,
  stagesRun: state.stagesRun,
}
