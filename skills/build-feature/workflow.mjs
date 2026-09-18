// build-feature — one spec-kit feature from a source description to a converged,
// wall-green, pushed feature branch, with no human gate.
//
// Run through Claude Code's Workflow tool:
//   Workflow({ scriptPath: "<this skill dir>/workflow.mjs", args: { source, shortName, ... } })
//
// Every stage is a fresh subagent with its own model and effort (the TIERS table
// below; args.tiers overrides any entry). The script is plain JavaScript in the
// Workflow sandbox: no filesystem, no Date, no Node APIs — an agent does every
// read and write, and the script only decides what runs next.
//
// Stages, in order:
//   preflight → specify → clarify → review-spec ⇄ fix-spec → plan → review-plan ⇄ fix-plan
//   → tasks → analyze ⇄ remediate → implement (one agent per phase) → converge ⇄ implement
//   → finish
//
// Review and analyze loops terminate on a clean verdict or on their round cap; a
// cap reached with blocking findings still open ends the run with status
// "needs-human" and the findings, never with a silent approval. The converge loop
// is different: it has no fixed point (evidence.md, 2026-09-18), so its only stop
// test is a severity floor — the loop ends when the round's findings hold nothing
// above args.severityFloor, LOW by default — and reaching its round cap is a
// reported outcome the run carries to
// finish, not a human question; the wall is still the gate. A round that reports
// "converged" while grading findings above the floor is a contradiction rather
// than a work state, and ends the run needs-human: nothing was appended, so every
// further round would repeat it. Like the review and analyze loops, converge runs
// one pass more than its cap — an assess-only round that appends nothing — so the
// findings the run reports are the ones no implement pass has closed.

export const meta = {
  name: 'build-feature',
  description: 'Build one spec-kit feature end to end with no human gate: specify, clarify, review, plan, review, tasks, analyze, implement per phase, converge until clean, push',
  whenToUse: 'When a feature has a written source (an upstream spec or a description) and the project is a spec-kit project whose definition of done is one command',
  phases: [
    { title: 'Preflight', detail: 'repo state, branch, definition of done' },
    { title: 'Specify', detail: 'specify, clarify, fresh-context review, fix' },
    { title: 'Plan', detail: 'plan, fresh-context review, fix' },
    { title: 'Tasks', detail: 'tasks, analyze, remediate' },
    { title: 'Implement', detail: 'one agent per phase, wall green after each' },
    { title: 'Converge', detail: 'converge, implement appended phase, repeat until nothing above LOW is left' },
    { title: 'Finish', detail: 'wall, push, optional fast-forward merge' },
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
// highest severity the converge loop tolerates, and CRITICAL is not offerable: Step 5
// defines it as a constitution MUST violation or a gap blocking a P1 user story, so a
// floor there tolerates every finding the scale has, stops the loop after one round,
// and is a foot-gun wearing the shape of a knob. The floor is checked beside the tier
// rows, so a bad one fails the run before the first agent starts rather than hours in
// at the converge stage.
const SEVERITY_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const SEVERITY_FLOORS = ['HIGH', 'MEDIUM', 'LOW']
const TIERS = {
  preflight: { model: 'sonnet', effort: 'low' },
  specify: { model: 'opus', effort: 'medium' },
  clarify: { model: 'opus', effort: 'medium' },
  reviewSpec: { model: 'fable', effort: 'low' },
  fixSpec: { model: 'opus', effort: 'medium' },
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
  finish: { model: 'sonnet', effort: 'low' },
}

const STAGES = ['preflight', 'specify', 'clarify', 'review-spec', 'plan', 'review-plan', 'tasks', 'analyze', 'implement', 'converge', 'finish']

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
const a = args && typeof args === 'object' ? args : {}
if (!a.source && !a.featureDir) throw new Error('args.source is required: the feature description, usually "Create a feature spec from <path to the upstream spec>"')
if (!a.shortName && !a.featureDir) throw new Error('args.shortName is required: the spec-kit short name, e.g. "product-version"')

const cfg = {
  source: a.source || '',
  shortName: a.shortName || '',
  featureDir: a.featureDir || null, // set to skip specify and start from an existing feature
  branch: a.branch || null, // the feature branch when featureDir is given
  baseBranch: a.baseBranch || null, // preflight refuses to start elsewhere when set
  wall: a.wall || null, // definition-of-done command; preflight finds it in CLAUDE.md when null
  planGuidance: a.planGuidance || '',
  tasksGuidance: a.tasksGuidance || '',
  push: a.push !== false,
  mergeInto: a.mergeInto || null,
  from: a.from || 'preflight',
  until: a.until || 'finish',
  maxReviewRounds: a.maxReviewRounds ?? 2,
  maxAnalyzeRounds: a.maxAnalyzeRounds ?? 2,
  maxConvergeRounds: a.maxConvergeRounds ?? 6,
  severityFloor: String(a.severityFloor ?? 'LOW').toUpperCase(),
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
if (STAGES.indexOf(cfg.from) > STAGES.indexOf('specify') && !cfg.featureDir) {
  throw new Error(`args.featureDir is required when starting from "${cfg.from}"`)
}
// Preflight is the only stage that resolves the definition-of-done command. A run that
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
    required: ['ok', 'branch', 'wall', 'problems'],
    properties: {
      ok: { type: 'boolean' },
      branch: { type: 'string' },
      wall: { type: 'string', description: 'the definition-of-done command, empty when none was found' },
      problems: { type: 'array', items: { type: 'string' } },
    },
  },
  specified: {
    type: 'object',
    required: ['featureDir', 'branch', 'assumptions'],
    properties: {
      featureDir: { type: 'string', description: 'repo-relative feature directory, e.g. specs/003-product-version' },
      branch: { type: 'string' },
      assumptions: { type: 'array', items: { type: 'string' }, description: 'every [NEEDS CLARIFICATION] the agent resolved itself' },
    },
  },
  clarified: {
    type: 'object',
    required: ['asked', 'answers'],
    properties: {
      asked: { type: 'integer' },
      answers: { type: 'array', items: { type: 'string' }, description: 'each "Q → A" line as recorded in the spec' },
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
          },
        },
      },
      summary: { type: 'string' },
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

const findingsBlock = findings =>
  findings.map((f, i) => `${i + 1}. [${f.severity}] ${f.artifact} — ${f.location}\n   Problem: ${f.problem}\n   Fix: ${f.fix}`).join('\n')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const state = {
  featureDir: cfg.featureDir,
  branch: cfg.branch,
  wall: cfg.wall,
  rounds: { reviewSpec: 0, reviewPlan: 0, analyze: 0, converge: 0 },
  converge: null, // { ended, rounds, findings } once the converge stage has run
  implemented: [],
  open: [],
  stagesRun: [],
}

const needsHuman = (stage, why, detail) => ({
  status: 'needs-human',
  stage,
  why,
  detail: detail === undefined ? null : detail,
  featureDir: state.featureDir,
  branch: state.branch,
  rounds: state.rounds,
  stagesRun: state.stagesRun,
})

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
        await run(fixer, `fix-${kind} minors`, fixPrompt(review.findings, round, true), S.done, group)
      }
      return { approved: true, rounds: round, findings: review.findings }
    }
    if (round > max) break
    await run(fixer, `fix-${kind} ${round}`, fixPrompt(review.findings, round, false), S.done, group)
  }
  return { approved: false, rounds: max + 1, findings: review ? review.findings : [] }
}

// ---------------------------------------------------------------------------
// Stage: preflight
// ---------------------------------------------------------------------------
if (runs('preflight')) {
  phase('Preflight')
  state.stagesRun.push('preflight')
  const p = await run('preflight', 'preflight', [
    UNATTENDED,
    'Check that this repository is ready for an unattended spec-kit feature build. Run the commands; do not change anything.',
    `1. \`git status --porcelain\` must be empty (untracked files under .specify/workflows/runs/ and .claude/worktrees/ do not count). A dirty tree is a problem.`,
    `2. \`git rev-parse --abbrev-ref HEAD\` is the current branch.${cfg.baseBranch ? ` It must be \`${cfg.baseBranch}\`; anything else is a problem.` : ''}${state.featureDir ? ` When a feature is being resumed it must be the feature branch${state.branch ? ` \`${state.branch}\`` : ''}.` : ''}`,
    `3. \`.specify/\` must exist with \`.specify/memory/constitution.md\`, and \`.claude/skills/speckit-specify/SKILL.md\`, \`speckit-clarify\`, \`speckit-plan\`, \`speckit-tasks\`, \`speckit-analyze\`, \`speckit-implement\`, \`speckit-converge\` must all be installed. Any missing one is a problem.`,
    cfg.wall
      ? `4. The definition-of-done command is \`${cfg.wall}\`. Check that its executable and script exist; do not run it. Return it as \`wall\`.`
      : `4. Find the project's definition-of-done command: read CLAUDE.md at the repo root (and the backend's CLAUDE.md if there is one) for the command it names as the definition of done or as "exactly what CI runs" — for example \`node backend/scripts/wall.mjs\`. Return it as \`wall\`. If no such command is named, return an empty string and add a problem saying so.`,
    cfg.source ? `5. The source of the feature is: ${cfg.source}. If it names a path, that path must exist and be readable; otherwise it is a problem.` : '',
    'Return ok=true only when there are no problems.',
  ].filter(Boolean).join('\n'), S.preflight)
  state.branch = state.branch || p.branch
  state.wall = p.wall || state.wall
  if (!p.ok) return needsHuman('preflight', 'the repository is not ready', p.problems)
  if (!state.wall) return needsHuman('preflight', 'no definition-of-done command: pass args.wall', p.problems)
  log(`preflight ok on ${p.branch}, wall = ${state.wall}`)
}

// ---------------------------------------------------------------------------
// Stage: specify → clarify → review-spec ⇄ fix-spec
// ---------------------------------------------------------------------------
if (runs('specify')) {
  phase('Specify')
  state.stagesRun.push('specify')
  const s = await run('specify', 'specify', [
    UNATTENDED,
    SKILL_HOW('speckit-specify'),
    `Arguments for the skill: ${cfg.source} Use the short name '${cfg.shortName}'.`,
    'Rules for the unattended decisions this skill would otherwise ask about:',
    '- When the skill reaches its [NEEDS CLARIFICATION] step, do not present questions. Resolve every marker yourself: take the answer the source states; where the source is silent, take the most conservative option (the smallest scope, the strictest validation, the behaviour the existing code already has) and record each such decision as a bullet under an "## Assumptions" section of the spec (create the section after the overview if the template has none).',
    '- The before_specify hook creates the feature branch; run it. Run every after_specify hook.',
    '- Do not touch any file outside the feature directory except what the hooks commit.',
    'Return the feature directory (from .specify/feature.json), the branch, and the list of assumptions you made.',
  ].join('\n'), S.specified, 'Specify')
  state.featureDir = s.featureDir
  state.branch = s.branch
  log(`specified ${s.featureDir} on ${s.branch}; ${s.assumptions.length} assumptions`)
}

if (runs('clarify')) {
  state.stagesRun.push('clarify')
  const P = featurePaths(state.featureDir)
  const c = await run('clarify', 'clarify', [
    UNATTENDED,
    SKILL_HOW('speckit-clarify'),
    `The feature is ${state.featureDir}; the spec is ${P.spec}. The source the spec was written from: ${cfg.source || '(none given; use the spec and the constitution)'}. The constitution is ${CONSTITUTION}.`,
    'This skill is written as an interactive question loop. Run it in full, playing both roles:',
    '- Generate the question queue exactly as the skill says (up to 5, highest impact first).',
    '- Answer each question yourself, in this order of authority: what the source document states; what the constitution requires; what the existing code already does; otherwise the option the skill itself recommends.',
    '- Record every question and answer under "## Clarifications" and integrate each answer into the spec sections, exactly as the skill specifies. Never ask, never wait.',
    '- Run the before_clarify and after_clarify hooks.',
    'Return how many questions you asked and the recorded "Q → A" lines.',
  ].join('\n'), S.clarified, 'Specify')
  log(`clarify asked ${c.asked}`)
}

if (runs('review-spec')) {
  state.stagesRun.push('review-spec')
  const P = featurePaths(state.featureDir)
  const r = await reviewLoop({
    kind: 'spec',
    group: 'Specify',
    reviewer: 'reviewSpec',
    fixer: 'fixSpec',
    max: cfg.maxReviewRounds,
    reviewPrompt: round => [
      UNATTENDED,
      `You are a fresh-context reviewer with no memory of how ${P.spec} was written. Your job is to REFUTE the claim that it is a complete, faithful and testable specification of its source. Read-only: change nothing.`,
      `Read, in full: the source (${cfg.source || 'none given — review against the constitution and internal consistency only'}), ${P.spec}, ${P.checklists}requirements.md if present, and ${CONSTITUTION}.`,
      'Report a finding for each of these, with the severity given:',
      '- a requirement, scenario, acceptance criterion, state, transition, error case, limit or field in the source that has no counterpart in the spec — blocking',
      '- a spec statement the source contradicts — blocking',
      '- a "[NEEDS CLARIFICATION]" or template placeholder left in the spec — blocking',
      '- a requirement that violates a constitution article — blocking, and say which article',
      '- a requirement invented beyond the source and the recorded Clarifications and Assumptions — major (blocking if it widens scope)',
      '- a requirement not testable as written, or a success criterion with no measure — major',
      '- an Assumption or Clarification answer the source actually decides differently — major',
      '- wording, ordering, duplication — minor',
      'Each finding names the exact location and the concrete edit that resolves it. Verdict "fix" when any finding is blocking or major; "approve" otherwise.',
      round > 1 ? `This is review round ${round}; earlier findings were applied. Check they were applied correctly and look for what the fix broke.` : '',
    ].filter(Boolean).join('\n'),
    fixPrompt: (findings, round, minorsOnly) => [
      UNATTENDED,
      `Apply the following review findings to ${P.spec} (and ${P.checklists}requirements.md where a checklist item's state changes). Keep the spec-kit structure and heading hierarchy; edit in place; do not regenerate the file.`,
      minorsOnly ? 'These are minor findings; apply each unless it would change meaning.' : 'Apply every finding. If a finding is wrong against the source, do not apply it and list it under skipped with the reason.',
      findingsBlock(findings),
      `Then commit with the message "spec: review round ${round}" (git add the feature directory only). Return done=true with the short sha.`,
    ].join('\n'),
  })
  if (!r.approved) return needsHuman('review-spec', `blocking findings remain after ${cfg.maxReviewRounds} fix rounds`, r.findings)
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
    `The feature is ${state.featureDir}; the spec is ${P.spec}; the constitution is ${CONSTITUTION}.`,
    cfg.planGuidance ? `Arguments for the skill (planning guidance): ${cfg.planGuidance}` : 'Arguments for the skill: none.',
    'Rules: read the constitution first and treat every article as binding; read the existing code the feature touches before deciding on a design; leave no "[NEEDS CLARIFICATION]" — decide from the spec, the constitution and the code, and record the decision in research.md. An "Article VII candidate" is admissible only under the constitution\'s Governance admission test: it binds two or more feature packages, or a table or package this feature does not own; a rule about this feature\'s own tables, columns, endpoints or error codes is a plan decision recorded in plan.md and docs/GATES.md, never a candidate; a pre-positioned or placeholder structure is never the subject of one. Run the before_plan and after_plan hooks.',
    'Return done=true with a one-paragraph summary of the design and the artifacts written.',
  ].join('\n'), S.done, 'Plan')

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
      '- naming, ordering, duplication — minor',
      'Each finding names the exact file and location and the concrete edit that resolves it. Verdict "fix" when any finding is blocking or major; "approve" otherwise.',
      round > 1 ? `This is review round ${round}; earlier findings were applied. Check they were applied correctly and look for what the fix broke.` : '',
    ].filter(Boolean).join('\n'),
    fixPrompt: (findings, round, minorsOnly) => [
      UNATTENDED,
      `Apply the following review findings to the plan artifacts under ${state.featureDir}. Edit in place; do not regenerate a file. When a finding says the constitution needs an amendment, amend ${CONSTITUTION} only if the amendment passes the constitution's Governance admission test (it binds two or more features, or a table the feature does not own — otherwise change the plan instead and say so under skipped), following the constitution's own amendment and versioning rules and only in the articles it marks as the project's own, and record the amendment in ${P.research}.`,
      minorsOnly ? 'These are minor findings; apply each unless it would change meaning.' : 'Apply every finding. If a finding is wrong against the spec or the code, do not apply it and list it under skipped with the reason.',
      findingsBlock(findings),
      `Then commit with the message "plan: review round ${round}". Return done=true with the short sha.`,
    ].join('\n'),
  })
  if (!r.approved) return needsHuman('review-plan', `blocking findings remain after ${cfg.maxReviewRounds} fix rounds`, r.findings)
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
    `The feature is ${state.featureDir}.`,
    cfg.tasksGuidance ? `Arguments for the skill (task generation constraints): ${cfg.tasksGuidance}` : 'Arguments for the skill: none.',
    `Rules: every task names the file it touches; every phase ends with a task that runs the definition of done, \`${state.wall}\`, and fixes until it is green; the phases follow the template ("## Phase N: ..."). Run the before_tasks and after_tasks hooks.`,
    `Return done=true with the number of tasks and phases written to ${P.tasks}.`,
  ].join('\n'), S.done, 'Tasks')
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
      `The feature is ${state.featureDir}. Read-only: change nothing.`,
      'Run the analysis in full and produce its report, then instead of offering remediation return every finding as data: id, severity as the skill grades it, the artifact it lives in (spec, plan, tasks, constitution, other), the location, a one-sentence summary and the concrete recommendation. Include the coverage figure.',
    ].join('\n'), S.analysis, 'Tasks')
    state.rounds.analyze = round
    const critical = analysis.findings.filter(f => f.severity === 'CRITICAL')
    const high = analysis.findings.filter(f => f.severity === 'HIGH')
    log(`analyze round ${round}: ${critical.length} critical, ${high.length} high, ${analysis.findings.length - critical.length - high.length} medium/low, coverage ${analysis.coverage}`)
    const serious = critical.concat(high)
    if (serious.length === 0) { approved = true; break }
    if (round > cfg.maxAnalyzeRounds) break
    const fixer = critical.length ? 'remediateCritical' : 'remediate'
    await run(fixer, `remediate ${round}`, [
      UNATTENDED,
      `Resolve the following analysis findings by editing the artifact each one names under ${state.featureDir} (spec.md, plan.md and its companions, or tasks.md) or ${CONSTITUTION} for a constitution finding. Edit in place. A coverage gap is resolved by adding tasks to the right phase of ${P.tasks} with new ids after the current maximum, never by renumbering. A constitution violation is resolved by changing the plan or spec, not the constitution, unless the finding says the constitution is what is wrong.`,
      'Apply every CRITICAL and HIGH finding; apply MEDIUM and LOW ones when the edit is local and safe, otherwise leave them.',
      analysis.findings.map(f => `${f.id} [${f.severity}] ${f.artifact} — ${f.location}: ${f.summary}\n   Recommendation: ${f.recommendation}`).join('\n'),
      `Then commit with the message "tasks: analysis round ${round}". Return done=true with the short sha and the findings you left unapplied under skipped.`,
    ].join('\n'), S.done, 'Tasks')
  }
  if (!approved) return needsHuman('analyze', `CRITICAL or HIGH analysis findings remain after ${cfg.maxAnalyzeRounds} remediation rounds`, analysis.findings)
}

// ---------------------------------------------------------------------------
// Stage: implement, one agent per phase
// ---------------------------------------------------------------------------
const implementPhase = async (ph, phaseLabel) => {
  const P = featurePaths(state.featureDir)
  const ids = ph.taskIds.length ? `${ph.taskIds[0]}–${ph.taskIds[ph.taskIds.length - 1]}` : 'none'
  const r = await run('implement', `implement phase ${ph.number}`, [
    UNATTENDED,
    SKILL_HOW('speckit-implement'),
    `The feature is ${state.featureDir}. Arguments for the skill: "Execute only Phase ${ph.number}: ${ph.title} (tasks ${ids}). Every other phase is out of scope: do not start it, do not tick it."`,
    'Rules for the unattended decisions this skill would otherwise ask about:',
    '- If a checklist has unchecked items, proceed anyway (the spec and plan were already reviewed) and list the unchecked items in your summary.',
    `- Definition of done for this phase: after its tasks, run \`${state.wall}\` and fix what it reports until it passes. Fix root causes in the code, never by weakening a gate, deleting a test or adding a suppression. Give up only after ${cfg.maxWallAttempts} full attempts, and then return wallGreen=false with the failing output.`,
    `- Tick each finished task in ${P.tasks} ("- [ ]" → "- [x]"). Wait for the wall to finish before you return; never leave it running in the background.`,
    '- Run the before_implement and after_implement hooks; if nothing committed the work, commit it yourself with a message naming the phase.',
    'Return wallGreen, the task ids of this phase still unchecked, the commit sha and a short summary.',
  ].join('\n'), S.implemented, phaseLabel)
  state.implemented.push({ phase: ph.number, title: ph.title, wallGreen: r.wallGreen, unchecked: r.unchecked, commit: r.commit || '' })
  log(`phase ${ph.number} ${ph.title}: wall ${r.wallGreen ? 'green' : 'RED'}, ${r.unchecked.length} unchecked`)
  return r
}

const readPhases = async (label, group) => {
  const P = featurePaths(state.featureDir)
  const p = await run('phases', label, [
    UNATTENDED,
    `Read ${P.tasks} and return its phases: each "## Phase N: title" heading with N, the title, every task id (Txxx) under it in order, and how many of them are still unchecked ("- [ ]"). Parse only; change nothing.`,
  ].join('\n'), S.phases, group)
  return p.phases
}

if (runs('implement')) {
  phase('Implement')
  state.stagesRun.push('implement')
  const phases = await readPhases('phases', 'Implement')
  log(`${phases.length} phases, ${phases.reduce((n, p) => n + p.unchecked, 0)} unchecked tasks`)
  for (const ph of phases) {
    if (ph.unchecked === 0) { log(`phase ${ph.number} already complete, skipped`); continue }
    const r = await implementPhase(ph, 'Implement')
    if (!r.wallGreen) return needsHuman('implement', `the wall is red after phase ${ph.number} (${ph.title})`, { unchecked: r.unchecked, wallOutput: r.wallOutput || '' })
    if (r.unchecked.length) {
      const again = await implementPhase({ ...ph, taskIds: r.unchecked }, 'Implement')
      if (!again.wallGreen) return needsHuman('implement', `the wall is red after the second pass over phase ${ph.number}`, { unchecked: again.unchecked, wallOutput: again.wallOutput || '' })
      if (again.unchecked.length) return needsHuman('implement', `tasks of phase ${ph.number} stay unchecked after two passes`, again.unchecked)
    }
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
  const SEVERITY_FLOOR = cfg.severityFloor
  const floorRank = SEVERITY_ORDER.indexOf(SEVERITY_FLOOR)
  // Rank-based against the declared order, so the floor means what its name says and
  // args.severityFloor moves it: MEDIUM stops the loop only once nothing is above
  // MEDIUM. A severity off the scale ranks above the floor — an ungradeable finding
  // is not a finding below it.
  const aboveFloorSev = f => {
    const rank = SEVERITY_ORDER.indexOf(f.severity)
    return rank === -1 || rank < floorRank
  }
  const gradeOf = findings => SEVERITY_ORDER.map(sev => `${findings.filter(f => f.severity === sev).length} ${sev.toLowerCase()}`).join(', ')
  // The floor is never in the prompt: the assessment grades on Step 5's scale alone
  // and the script filters afterwards, so moving args.severityFloor cannot move a
  // grade. One prompt for both kinds of round. assessOnly is the extra round after the cap:
  // same assessment, no append, no commit, so its findings are open work rather than
  // work the round that found it has already closed.
  const convergePrompt = (round, assessOnly) => [
    UNATTENDED,
    SKILL_HOW('speckit-converge'),
    `The feature is ${state.featureDir}.`,
    assessOnly
      ? 'ASSESS ONLY. Run the skill\'s assessment through its findings summary and stop there. Append nothing: tasks.md and every other file must be byte-for-byte unchanged when you finish, nothing is committed, and you run no hook that writes or commits. Return the outcome "converged", because nothing was appended; the findings below are the whole value of this round.'
      : `Run the assessment in full. Return the outcome exactly as the skill defines it: "converged" when nothing was appended, "tasks_appended" with the new phase number and the appended task ids otherwise. When tasks were appended, commit tasks.md with the message "tasks: convergence round ${round}".`,
    'Also return every gap the assessment found as findings — appended or not, actionable or not, including every gap it surfaced only for awareness — each graded by the severity rule in the skill\'s own Step 5 and by no other scale: CRITICAL, HIGH, MEDIUM or LOW exactly as that step defines them. For each appended one, name the task id that closes it; leave the task id empty for a gap no task closes.',
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
      // "converged" return. Nothing was appended, so continuing would repeat this
      // round identically to the cap, so the contradiction goes to a human.
      if (aboveFloor.length) {
        return needsHuman('converge', `converge reported converged while grading findings above ${SEVERITY_FLOOR}`, aboveFloor)
      }
      ended = 'converged'
      endingFindings = findings
      log(`converge round ${round}: converged — nothing appended and nothing above ${SEVERITY_FLOOR} (${grade})`)
      break
    }
    log(`converge round ${round}: ${last.taskIds ? last.taskIds.length : '?'} tasks appended as phase ${last.phase} (${grade})`)
    // What was appended is implemented even when the loop is about to stop at the
    // floor: the tasks are already in tasks.md, and finish reports them unchecked otherwise.
    const phases = await readPhases(`phases after converge ${round}`, 'Converge')
    const ph = phases.find(p => p.number === last.phase) || phases[phases.length - 1]
    const r = await implementPhase(ph, 'Converge')
    if (!r.wallGreen) return needsHuman('converge', `the wall is red after implementing convergence phase ${ph.number}`, { unchecked: r.unchecked, wallOutput: r.wallOutput || '' })
    if (r.unchecked.length) return needsHuman('converge', `convergence tasks stay unchecked`, r.unchecked)
    // A round that appends tasks and grades nothing has not shown the floor was
    // reached; it has shown nothing. Counted as above the floor, so the loop goes on.
    if (findings.length === 0) {
      log(`converge round ${round}: appended tasks as phase ${ph.number} and graded nothing — what is left is unknown, not below the floor, so the loop continues`)
      continue
    }
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
      ended = 'severity-floor'
      log(`converge: ${cfg.maxConvergeRounds} rounds implemented, and the assess-only round after them graded nothing above ${SEVERITY_FLOOR} (${gradeOf(findings)}) — stopped at the severity floor`)
    } else {
      ended = 'round-cap'
      log(`converge round cap ${cfg.maxConvergeRounds} reached: the assess-only round after the last implemented phase graded ${aboveFloor.length} finding(s) above ${SEVERITY_FLOOR} (${gradeOf(findings)}), open and unimplemented — carried to finish; the wall is the gate`)
    }
  }
  // The findings of whichever assessment ended the loop, never of an earlier one.
  state.converge = { ended, rounds: state.rounds.converge, floor: SEVERITY_FLOOR, findings: endingFindings }
}

// ---------------------------------------------------------------------------
// Stage: finish
// ---------------------------------------------------------------------------
let finished = null
if (runs('finish')) {
  phase('Finish')
  state.stagesRun.push('finish')
  const P = featurePaths(state.featureDir)
  finished = await run('finish', 'finish', [
    UNATTENDED,
    `Close out the feature on branch ${state.branch || '(current branch)'}:`,
    `1. Run \`${state.wall}\` and wait for it; wallGreen is whether it passed. Do not fix anything.`,
    `2. \`git status --porcelain\` is empty → clean=true. If it is not, commit the leftovers with the message "feature: leftovers after converge" and report clean=true only if that commit succeeded.`,
    `3. Every task in ${P.tasks} is "- [x]" → allTasksChecked=true; otherwise false, and name the unchecked ids in the summary.`,
    cfg.push ? '4. Push the branch: `git push -u origin HEAD`. pushed=true only if the push succeeded.' : '4. Do not push; pushed=false.',
    cfg.mergeInto
      ? `5. Fast-forward \`${cfg.mergeInto}\` onto this branch: \`git checkout ${cfg.mergeInto} && git merge --ff-only ${state.branch || 'HEAD@{1}'} && git push origin ${cfg.mergeInto}\`, then check the feature branch out again. merged=true only if every command succeeded; a non-fast-forward is merged=false with the reason in the summary.`
      : '5. Do not merge; merged=false.',
    '6. head is the short sha of the feature branch.',
  ].join('\n'), S.finished, 'Finish')
  log(`finish: wall ${finished.wallGreen ? 'green' : 'RED'}, ${finished.pushed ? 'pushed' : 'not pushed'}${finished.merged ? `, merged into ${cfg.mergeInto}` : ''}`)
}

return {
  status: finished && !finished.wallGreen ? 'needs-human' : 'done',
  featureDir: state.featureDir,
  branch: state.branch,
  wall: state.wall,
  rounds: state.rounds,
  converge: state.converge,
  implemented: state.implemented,
  finish: finished,
  stagesRun: state.stagesRun,
}
