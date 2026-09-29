#!/usr/bin/env node
// Create a Rust backend from dulguun0225/rust-backend-template, deterministically, in one command.
//
//   node new-backend.mjs --name some_service_1 [--dir <path>] [--ref <sha|tag|branch>] [--standalone] [--skip-verify]
//
// This is the sequence the template's README lists, run as one, with the template pinned to a recorded
// commit instead of whatever `main` is today. Nothing here is a decision: the stack and every gate are fixed
// by the template, the rename is the template's own scripts/init.mjs, and the output for a given (ref, name)
// is byte-identical every time. An agent that is about to scaffold a Rust backend runs this and then starts
// on domain code; anything it would write during scaffolding is the defect.
//
// Two shapes, matching the template's two modes:
//   vendored (default)  <dir>/ is a project root; the template lands in <dir>/backend/ by `git subtree add`
//                       and init.mjs lifts project-root/ (root CI, rulesets, compose, frontend stub, project
//                       CLAUDE.md) one level up.
//   --standalone        <dir>/ is the service itself; the template's own .github/workflows/ci.yml is its CI.
//
// What it does not do, on purpose: create the forge repository, push, apply the branch rulesets, install the
// skills. Each has side effects outside this directory and is printed as the next step. `--skip-verify` skips
// `cargo fmt` and the wall, which need the toolchain, Docker and minutes; the commit it makes then records an
// unverified tree and says so.
//
// Node, standard library only, 22 or newer: the runtime `npx skills add` already needed to install this skill,
// so it runs the same on Linux, macOS and Windows. Needs git; verification also needs rustup's cargo, mise (the
// template's mise.toml pins the tools the wall runs) and a running Docker.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const TEMPLATE_URL = process.env.TEMPLATE_URL || 'https://github.com/dulguun0225/rust-backend-template.git';
// The pinned template commit. Move it deliberately, in a commit that says which gate change it brings in.
const DEFAULT_REF = '5cdc93a004ebe28fcba1d02a2a554eaaf6c75e97';

const [major] = process.versions.node.split('.').map(Number);
if (major < 22) die(`node ${process.versions.node} is too old; this script needs 22 or newer`);

function die(message, status = 1) {
  console.error(message);
  process.exit(status);
}

function spawn(cmd, args, opts) {
  const r = spawnSync(cmd, args, opts);
  if (r.error) throw r.error.code === 'ENOENT' ? new Error(`${cmd} not on PATH`) : r.error;
  return r;
}
/** Run with inherited stdio; a non-zero exit throws, like `set -e`. */
function run(cmd, args, opts = {}) {
  const r = spawn(cmd, args, { stdio: 'inherit', ...opts });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} exited ${r.status}`);
}
function capture(cmd, args, opts = {}) {
  const r = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8', ...opts });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} exited ${r.status}`);
  return r.stdout.trim();
}
const ok = (cmd, args, opts = {}) => {
  try {
    return spawn(cmd, args, { stdio: 'ignore', ...opts }).status === 0;
  } catch {
    return false;
  }
};

let opts;
try {
  ({ values: opts } = parseArgs({
    options: {
      name: { type: 'string' }, dir: { type: 'string' }, ref: { type: 'string' },
      standalone: { type: 'boolean' }, 'skip-verify': { type: 'boolean' }, help: { type: 'boolean', short: 'h' },
    },
  }));
} catch (e) {
  die(e.message, 2);
}
if (opts.help) {
  const header = fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 25);
  console.log(header.map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(0);
}
const name = opts.name ?? '';
const ref = opts.ref ?? DEFAULT_REF;
const mode = opts.standalone ? 'standalone' : 'vendored';
const verify = !opts['skip-verify'];
// The template's init.mjs holds the full rule (no keyword, no name the workspace or Cargo uses); this is its
// shape, checked before anything is created.
if (!/^[a-z][a-z0-9_]{0,63}$/.test(name)) die('--name must be a lowercase letter, then lowercase letters, digits or underscores, 64 characters at most', 2);
const dir = opts.dir || `./${name}`;
if (!ok('git', ['--version'])) die('git not on PATH');
if (verify) {
  if (!ok('cargo', ['--version'])) die('cargo not on PATH; install rustup (it reads the template\'s rust-toolchain.toml), or pass --skip-verify');
  if (!ok('mise', ['--version'])) die('mise not on PATH; the wall runs the tools the template\'s mise.toml pins. Install mise, or pass --skip-verify');
  if (!ok('docker', ['info'])) die('docker is not running; the wall starts a PostgreSQL container. Start it, or pass --skip-verify');
}
if (fs.existsSync(dir)) {
  if (!fs.statSync(dir).isDirectory()) die(`${dir} exists and is not a directory`);
  if (fs.readdirSync(dir).length > 0) die(`${dir} exists and is not empty`);
}

// 1. project root with one empty commit: `git subtree add` refuses a repository that has no HEAD. The branch is
// dev, where a service works; main is made at the end, at the same commit, and takes pull requests from dev only.
// Until the template is in place and renamed there is nothing worth keeping, so a failure before then (a name
// init.mjs refuses included) removes everything this run created; after it, the tree is left for inspection and
// said so.
const madeDir = !fs.existsSync(dir);
fs.mkdirSync(dir, { recursive: true });
process.chdir(dir);
const absDir = fs.realpathSync(process.cwd());
let keep = false;
try {
  run('git', ['init', '-q', '-b', 'dev']);
  run('git', ['commit', '-q', '--allow-empty', '-m', 'init: empty root']);

  // 2. fetch the template and resolve the ref to a commit, so the record says exactly what was instantiated.
  let sha;
  if (/^[0-9a-f]{40}$/.test(ref)) {
    // A bare sha is not fetchable by name from every server; fetch main and require the sha to be reachable.
    run('git', ['fetch', '-q', '--no-tags', TEMPLATE_URL, 'main']);
    if (!ok('git', ['cat-file', '-e', `${ref}^{commit}`])) throw new Error(`template commit ${ref} is not reachable from main of ${TEMPLATE_URL}`);
    sha = ref;
  } else {
    run('git', ['fetch', '-q', '--no-tags', TEMPLATE_URL, ref]);
    sha = capture('git', ['rev-parse', 'FETCH_HEAD']);
  }
  const short = sha.slice(0, 12);

  // 3. instantiate.
  let service;
  if (mode === 'vendored') {
    run('git', ['subtree', 'add', '-q', '--prefix', 'backend', sha, '--squash', '-m', `vendor: rust-backend-template ${short} into backend/`]);
    service = path.join(absDir, 'backend');
  } else {
    run('git', ['read-tree', '-u', '--reset', sha]);
    run('git', ['commit', '-q', '-m', `init: rust-backend-template ${short}`]);
    service = absDir;
  }

  // 4. rename, and in vendored mode lift project-root/ to here. The template owns this script; it is not copied.
  run(process.execPath, [path.join('scripts', 'init.mjs'), '--name', name, ...(mode === 'standalone' ? ['--standalone'] : [])], { cwd: service });
  keep = true;

  // 5. format and run the wall: the template's definition of done. The rename moves no Rust line past
  // rustfmt's width, so `cargo fmt` changes nothing today; it runs anyway, so a future template whose rename
  // does is formatted before the wall's formatter check reads it.
  let verified = 'unverified: --skip-verify';
  if (verify) {
    run('cargo', ['fmt', '--all'], { cwd: service });
    // Trusted for these two calls only, through the environment, so no trust entry is written anywhere.
    const env = { ...process.env, MISE_TRUSTED_CONFIG_PATHS: service, MISE_YES: '1' };
    run('mise', ['install'], { cwd: service, env });
    run('mise', ['exec', '--', 'node', path.join('scripts', 'wall.mjs')], { cwd: service, env });
    verified = 'wall green';
  }

  run('git', ['add', '-A']);
  run('git', ['commit', '-q', '-m', `init: ${name} from rust-backend-template ${short} (${verified})`]);
  run('git', ['branch', 'main']);

  const next = [`gh repo create <org>/${name} --private --source=. --push && git push -u origin main`];
  next.push(`gh repo edit <org>/${name} --default-branch dev     # work happens on dev; main takes pull requests from dev only`);
  if (mode === 'vendored') next.push('node scripts/apply-ruleset.mjs     # main: pull requests from dev, with the checks; dev: direct pushes, no deletion, no force-push');
  next.push('npx skills add dulguun0225/skills -g -a claude-code -y     # the engineering-decision skills');
  if (!verify) next.push(`(cd ${mode === 'vendored' ? 'backend' : '.'} && mise trust && mise install && cargo fmt --all && mise exec -- node scripts/wall.mjs)   # skipped above; run before the first push`);
  console.log(`created ${dir} (${mode}): name ${name}, template ${sha} — ${verified}`);
  console.log("next, each outside this directory's control and so not done here:");
  for (const n of next) console.log(`  ${n}`);
} catch (e) {
  process.chdir(path.dirname(absDir));
  if (keep) {
    console.error(`failed (${e.message}); ${absDir} left in place for inspection`);
  } else if (madeDir) {
    fs.rmSync(absDir, { recursive: true, force: true });
    console.error(`failed (${e.message}) before the template was in place and renamed; removed ${absDir}`);
  } else {
    // The directory was empty before this run, so everything in it is this run's.
    for (const entry of fs.readdirSync(absDir)) fs.rmSync(path.join(absDir, entry), { recursive: true, force: true });
    console.error(`failed (${e.message}) before the template was in place and renamed; emptied ${absDir}`);
  }
  process.exit(1);
}
