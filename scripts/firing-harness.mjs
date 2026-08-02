// Does a skill in this set actually fire?
//
// Every other script here measures text. This one runs sessions: it stands up a
// sandbox holding nothing but this repo's skills, sends a headless `claude -p` a
// prompt an engineer would plausibly type, and records which skills the agent
// chose to load. Firing is decided by frontmatter alone — the `SKILL.md` body and
// every resource file beside it are invisible until after the choice is made — so
// this is the only check here that reaches the `description`.
//
// It is a report, not a gate. It spends money, it is stochastic, and a single
// miss is a coin flip rather than a defect. Never wire it into `npm run gates`.
//
// Usage:
//   node scripts/firing-harness.mjs                       every case, working tree
//   node scripts/firing-harness.mjs --skill money         cases for one skill
//   node scripts/firing-harness.mjs --case money-1        one case
//   node scripts/firing-harness.mjs --repeats 3           firing is stochastic
//   node scripts/firing-harness.mjs --against HEAD~1      A/B a frontmatter edit
//   node scripts/firing-harness.mjs --model opus          pin the model; see below
//   node scripts/firing-harness.mjs --json out.json       machine-readable run
//   node scripts/firing-harness.mjs --dry-run             what it would spend
//
// ACROSS MACHINES: it runs anywhere the `claude` CLI runs and is logged in —
// nothing here is bound to one developer's box. What does not travel is the
// NUMBER. A firing rate is a measurement of one model reading one description
// under one CLI version, so a rate taken on another machine is comparable only
// when both are the same. Every run stamps both, and every rate written down
// anywhere must carry that stamp. Pass --model to pin one deliberately.

import { execFileSync, spawn } from "node:child_process";
import { chmodSync, copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { fileExists, skillDirs } from "./lib/md.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TIMEOUT_MS = 300_000;
const CREDENTIALS = join(homedir(), ".claude", ".credentials.json");

const args = parseArgs(process.argv.slice(2));
const corpus = JSON.parse(readFileSync(join(ROOT, "scripts", "firing-cases.json"), "utf8"));

const cases = corpus.cases.filter((c) => {
  if (args.case.length && !args.case.includes(c.id)) return false;
  if (args.skill.length && !args.skill.includes(c.skill)) return false;
  return true;
});

if (cases.length === 0) {
  console.error("No cases matched. Known skills under test:");
  console.error("  " + [...new Set(corpus.cases.map((c) => c.skill).filter(Boolean))].join(", "));
  process.exit(2);
}

const variants = [{ label: "worktree", ref: null, skills: join(ROOT, "skills") }];
if (args.against) variants.push({ label: args.against, ref: args.against, skills: null });

const runCount = cases.length * variants.length * args.repeats;
console.log(`${cases.length} case(s) x ${variants.length} variant(s) x ${args.repeats} repeat(s) = ${runCount} session(s).`);
if (args.dryRun) {
  for (const c of cases) console.log(`  ${c.id.padEnd(32)} [${c.fixture}] ${c.prompt}`);
  process.exit(0);
}

const work = mkdtempSync(join(tmpdir(), "firing-harness-"));
const stamp = { model: null, cli: null };
try {
  for (const v of variants) {
    if (v.ref) v.skills = exportRef(v.ref, join(work, "src-" + sanitise(v.label)));
    v.sandboxes = buildSandboxes(v, join(work, "box-" + sanitise(v.label)));
    v.results = [];
  }

  await preflight(variants[0].sandboxes[cases[0].fixture]);

  for (const v of variants) {
    console.log(`\n--- ${v.label} (${skillDirs(dirname(v.skills)).length} skills) ---`);
    const queue = [];
    for (const c of cases) for (let i = 0; i < args.repeats; i++) queue.push({ c, i });
    v.results = await pool(queue, args.concurrency, async ({ c, i }) => {
      const fired = await runOne(v.sandboxes[c.fixture], c.prompt);
      const line = verdict(c, fired);
      console.log(`  ${symbol(line.status)} ${c.id}${args.repeats > 1 ? `#${i + 1}` : ""}`.padEnd(30) + describe(c, fired));
      return { case: c, run: i, fired: fired.skills, cost: fired.cost, error: fired.error, ...line };
    });
  }

  report(variants, cases);
  if (args.json) {
    writeFileSync(
      args.json,
      JSON.stringify({ ran: new Date().toISOString(), model: stamp.model, cli: stamp.cli, host: process.platform, variants: variants.map(strip) }, null, 2),
    );
    console.log(`\nWrote ${args.json}`);
  }
} finally {
  // The credential copy goes even under --keep. A kept sandbox is for reading
  // prompts and fixtures back; it is not a place to leave a login.
  for (const v of variants) rmSync(join(work, "box-" + sanitise(v.label), "cfg", ".credentials.json"), { force: true });
  if (args.keep) console.log(`\nSandboxes kept at ${work} (credentials removed)`);
  else rmSync(work, { recursive: true, force: true });
}

// --- running -----------------------------------------------------------------

/**
 * One headless session. Every tool but Skill is denied, so the model's first
 * response is the relevance judgement with nothing else it could usefully do —
 * which is the thing under test and also the reason this is not a real session.
 */
function runOne(cwd, prompt) {
  return new Promise((done) => {
    const child = spawn(
      "claude",
      [
        "-p", prompt,
        "--output-format", "stream-json",
        "--verbose",
        "--max-turns", "2",
        "--allowed-tools", "Skill",
        "--disallowed-tools", "Bash", "Read", "Write", "Edit", "Grep", "Glob", "WebFetch", "WebSearch", "Task", "Agent",
        ...(args.model ? ["--model", args.model] : []),
      ],
      { cwd, env: { ...process.env, CLAUDE_CONFIG_DIR: join(cwd, "..", "cfg") }, stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32" },
    );
    const timer = setTimeout(() => child.kill("SIGKILL"), TIMEOUT_MS);
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("close", () => {
      clearTimeout(timer);
      done(parseSession(out, err));
    });
  });
}

function parseSession(stdout, stderr) {
  const skills = [];
  let cost = 0;
  let error = null;
  for (const line of stdout.split("\n")) {
    if (!line.startsWith("{")) continue;
    let ev;
    try {
      ev = JSON.parse(line);
    } catch {
      continue;
    }
    if (ev.subtype === "init") {
      // Which model read the descriptions, and which CLI injected them. A
      // firing rate without both is not comparable to a rate from any other
      // machine, so record them from the session rather than from the operator.
      stamp.model ??= ev.model;
      stamp.cli ??= ev.claude_code_version;
    }
    for (const block of ev?.message?.content ?? []) {
      if (block.type === "tool_use" && block.name === "Skill" && block.input?.skill) {
        if (!skills.includes(block.input.skill)) skills.push(block.input.skill);
      }
    }
    if (ev.error) error = ev.error;
    if (typeof ev.total_cost_usd === "number") cost = ev.total_cost_usd;
  }
  if (!stdout.trim()) error = error ?? (stderr.trim().split("\n").pop() || "no output");
  return { skills, cost, error };
}

/**
 * One cheap session before spending the rest. Without it a machine that has the
 * CLI but is not logged in burns the whole queue producing the same error 44
 * times, and the operator reads it as a firing result rather than a setup one.
 */
async function preflight(cwd) {
  const probe = await runOne(cwd, "Reply with the single word: ready.");
  if (probe.error) {
    console.error(`\nPreflight failed: ${probe.error}`);
    console.error(`
This harness needs the \`claude\` CLI on PATH and a logged-in account, and it runs
each session under an isolated CLAUDE_CONFIG_DIR so that skills installed globally
on this machine do not compete with the ones under test. That isolation is why a
working \`claude\` in your terminal is not sufficient on its own:

  - Credentials at ~/.claude/.credentials.json are copied into the sandbox. If
    your machine authenticates some other way -- an OS keychain, ANTHROPIC_API_KEY,
    Bedrock or Vertex -- there is no file to copy. An API key in the environment is
    inherited and works; a keychain login may not be.
  - Run \`claude -p ok\` first. If that works and this does not, the isolated config
    dir is the difference.`);
    process.exit(1);
  }
  console.log(`Preflight ok. model=${stamp.model ?? "unknown"} cli=${stamp.cli ?? "unknown"} platform=${process.platform}`);
  if (!args.model) console.log("No --model pinned: this run's rate is comparable only to runs on the same model.");
}

/**
 * A case passes when the skill under test fired. Other skills firing is
 * recorded and not scored — a Java money prompt pulling in three money skills
 * is the set working. `forbid` is the only cross-skill assertion.
 */
function verdict(c, fired) {
  if (fired.error) return { status: "error" };
  const violated = (c.forbid ?? []).filter((f) => fired.skills.includes(f));
  if (violated.length) return { status: "forbidden", violated };
  if (c.skill === null) return { status: "pass" };
  return { status: fired.skills.includes(c.skill) ? "pass" : "miss" };
}

// --- sandboxes ---------------------------------------------------------------

/**
 * A sandbox per fixture, holding this repo's skills and nothing else. The
 * isolated `CLAUDE_CONFIG_DIR` is the point: whatever skills the operator has
 * installed globally would otherwise compete for every prompt here, and the
 * result would measure their machine rather than this set.
 */
function buildSandboxes(variant, base) {
  const cfg = join(base, "cfg");
  mkdirSync(cfg, { recursive: true });
  writeFileSync(join(cfg, "settings.json"), "{}\n");
  if (fileExists(CREDENTIALS)) {
    // Copied, not symlinked: a symlink needs privileges on Windows that a
    // developer machine may not grant, and this file is the one thing here that
    // must work identically everywhere. Deleted in the finally block, always.
    const dest = join(cfg, ".credentials.json");
    copyFileSync(CREDENTIALS, dest);
    try {
      chmodSync(dest, 0o600);
    } catch {
      // Windows ignores POSIX modes; the temp dir is the protection there.
    }
  }

  const boxes = {};
  for (const fixture of new Set(cases.map((c) => c.fixture))) {
    const dir = join(base, fixture);
    mkdirSync(join(dir, ".claude", "skills"), { recursive: true });
    for (const { name, dir: src } of skillDirs(dirname(variant.skills))) {
      // Copy rather than symlink, same reason. The whole set is 45 small
      // markdown files, so the copy is not worth optimising away.
      cpSync(src, join(dir, ".claude", "skills", name), { recursive: true });
    }
    if (fixture === "java") writeJavaFixture(dir);
    boxes[fixture] = dir;
  }
  return boxes;
}

/**
 * Minimum that makes a repo read as Java. Four skills say `Load in a Java repo`
 * and are entitled to see one; running them against an empty directory would
 * measure the fixture rather than the description.
 */
function writeJavaFixture(dir) {
  const pkg = join(dir, "src", "main", "java", "com", "example", "order");
  mkdirSync(pkg, { recursive: true });
  writeFileSync(
    join(dir, "pom.xml"),
    `<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>orders</artifactId>
  <version>0.1.0</version>
  <properties><maven.compiler.release>21</maven.compiler.release></properties>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.0</version>
  </parent>
</project>
`,
  );
  writeFileSync(
    join(pkg, "Order.java"),
    `package com.example.order;

public record Order(long id, String customerRef, double subtotal) {}
`,
  );
  writeFileSync(
    join(pkg, "OrderService.java"),
    `package com.example.order;

import org.springframework.stereotype.Service;

@Service
public class OrderService {
    public Order find(long id) {
        throw new UnsupportedOperationException("stub");
    }
}
`,
  );
}

/**
 * A ref's `skills/` tree, materialised so a variant can be run without checking
 * out. `git ls-tree` plus `git show` per file rather than `git archive | tar`,
 * because `tar` is one more thing that has to exist and behave the same on every
 * machine this repo is developed on. 45 files; the loop is not the slow part.
 */
function exportRef(ref, dest) {
  const listing = execFileSync("git", ["ls-tree", "-r", "--name-only", ref, "skills"], { cwd: ROOT, encoding: "utf8" });
  const paths = listing.split("\n").filter(Boolean);
  if (paths.length === 0) throw new Error(`${ref} has no skills/ tree — is it a valid ref in this repo?`);
  for (const path of paths) {
    const out = join(dest, path);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, execFileSync("git", ["show", `${ref}:${path}`], { cwd: ROOT, maxBuffer: 1 << 26 }));
  }
  return join(dest, "skills");
}

// --- reporting ---------------------------------------------------------------

function report(variants, cases) {
  for (const v of variants) {
    const pass = v.results.filter((r) => r.status === "pass").length;
    const miss = v.results.filter((r) => r.status === "miss");
    const forb = v.results.filter((r) => r.status === "forbidden");
    const errs = v.results.filter((r) => r.status === "error");
    const cost = v.results.reduce((a, r) => a + (r.cost ?? 0), 0);
    console.log(`\n=== ${v.label} [${stamp.model ?? "?"} / cli ${stamp.cli ?? "?"}]: ${pass}/${v.results.length} fired as expected, ${forb.length} forbidden, ${errs.length} error, $${cost.toFixed(2)} ===`);
    for (const r of miss) console.log(`  MISS      ${r.case.id.padEnd(30)} wanted ${r.case.skill}, got ${r.fired.join(", ") || "nothing"}`);
    for (const r of forb) console.log(`  FORBIDDEN ${r.case.id.padEnd(30)} ${r.violated.join(", ")} fired`);
    for (const r of errs) console.log(`  ERROR     ${r.case.id.padEnd(30)} ${r.error}`);
  }

  if (variants.length === 2) {
    const [a, b] = variants;
    const rows = [];
    for (const c of cases) {
      const ra = rate(a, c.id);
      const rb = rate(b, c.id);
      if (ra !== rb) rows.push([c.id, c.skill ?? "(negative)", `${rb}`, `${ra}`]);
    }
    console.log(`\n=== ${b.label} -> ${a.label}: ${rows.length} case(s) changed ===`);
    if (rows.length === 0) console.log("  No case fired differently. With one repeat per case that is weak evidence, not none.");
    for (const [id, skill, before, after] of rows) console.log(`  ${id.padEnd(30)} ${skill.padEnd(28)} ${before} -> ${after}`);
  }

  console.log(`
Every rate above is for ${stamp.model ?? "an unrecorded model"} under CLI ${stamp.cli ?? "unknown"} on ${process.platform}.
Carry that stamp with any number you write down: a rate measured on another
machine, model or CLI version is a different measurement, not a later one.

What this run does not decide:
  - whether a miss is a defect. Firing is stochastic; one miss is a coin flip.
    Re-run the case with --repeats before touching a description
  - what a real session does. Every tool but Skill was denied, so the model
    could not read the repo before choosing, and a real agent often can
  - whether the skill that fired was the right one to fire. This scores the
    skill under test and records the rest; it never says a skill was wrong to load
  - anything about the body. Firing is decided by frontmatter alone, so a skill
    can fire perfectly and still be wrong once open
  - whether the corpus is fair. A prompt written from a description tests string
    matching; these were written as engineer requests, and that is a judgement
    call renewed every time a case is added`);

  const failed = variants.some((v) => v.results.some((r) => r.status === "error"));
  if (failed) process.exitCode = 1;
}

function rate(variant, id) {
  const rs = variant.results.filter((r) => r.case.id === id);
  return `${rs.filter((r) => r.status === "pass").length}/${rs.length}`;
}

function describe(c, fired) {
  if (fired.error) return fired.error;
  return fired.skills.length ? fired.skills.join(", ") : "(nothing fired)";
}

function symbol(status) {
  return { pass: "ok  ", miss: "MISS", forbidden: "FORB", error: "ERR " }[status] ?? status;
}

function strip(v) {
  return {
    label: v.label,
    results: v.results.map((r) => ({ id: r.case.id, skill: r.case.skill, run: r.run, status: r.status, fired: r.fired, cost: r.cost, error: r.error })),
  };
}

// --- plumbing ----------------------------------------------------------------

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      for (let i = next++; i < items.length; i = next++) out[i] = await fn(items[i]);
    }),
  );
  return out;
}

function parseArgs(argv) {
  const out = { skill: [], case: [], repeats: 1, concurrency: 4, against: null, model: null, json: null, keep: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--skill") out.skill.push(argv[++i]);
    else if (a === "--case") out.case.push(argv[++i]);
    else if (a === "--repeats") out.repeats = Number(argv[++i]);
    else if (a === "--concurrency") out.concurrency = Number(argv[++i]);
    else if (a === "--against") out.against = argv[++i];
    else if (a === "--model") out.model = argv[++i];
    else if (a === "--json") out.json = argv[++i];
    else if (a === "--keep") out.keep = true;
    else if (a === "--dry-run") out.dryRun = true;
    else {
      console.error(`Unknown argument: ${a}`);
      process.exit(2);
    }
  }
  return out;
}

function sanitise(s) {
  return s.replace(/[^a-zA-Z0-9._-]/g, "_");
}
