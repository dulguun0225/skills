// Per-session usage read from the `result` event a headless `claude -p
// --output-format stream-json` session ends with, and the end-of-run block the
// two session scripts print from it. Shared by firing-harness.mjs and
// redundancy-probes.mjs so both record and summarise the same fields.
//
// The model a session ran on is read per session. Before this, each script
// stamped the run with the first session's `init.model` and nothing checked the
// rest, so a run that changed model part-way read as a run on one model.

const METERS = ["input_tokens", "cache_creation_input_tokens", "cache_read_input_tokens", "output_tokens"];

/**
 * The usage fields of one session. `result` is the session's `result` event or
 * null when it never arrived; `initModel` is the session's own `init.model`.
 * A field the CLI did not report is null, never 0: an older CLI that omits a
 * meter must not read as a session that used none.
 *
 * `models` are the keys of `result.modelUsage` (the models that actually ran,
 * reported by CLI 2.1.294), falling back to `init.model` when that is absent;
 * `modelSource` says which of the two it came from. Claude Code also calls a
 * small model in the background, so `model`, the primary, is the key with the
 * most output tokens, and the other keys are `auxModels`.
 */
export function sessionUsage(result, initModel) {
  const reported = result?.usage && typeof result.usage === "object" ? result.usage : {};
  const usage = Object.fromEntries(METERS.map((k) => [k, numberOrNull(reported[k])]));
  const modelUsage = result?.modelUsage && typeof result.modelUsage === "object" ? result.modelUsage : {};
  const byModel = Object.keys(modelUsage);
  const outputOf = (id) => numberOrNull(modelUsage[id]?.outputTokens) ?? -1;
  const primary = byModel.length ? byModel.reduce((a, id) => (outputOf(id) > outputOf(a) ? id : a)) : initModel ?? null;
  const models = byModel.length ? byModel : primary ? [primary] : [];
  const auxModels = models.filter((id) => id !== primary);
  const modelSource = byModel.length ? "modelUsage" : initModel ? "init.model" : null;
  return { usage, numTurns: numberOrNull(result?.num_turns), durationMs: numberOrNull(result?.duration_ms), model: primary, models, auxModels, modelSource };
}

/** The per-session fields to copy into a written result. */
export function usageFields(s) {
  return { model: s.model, models: s.models, auxModels: s.auxModels, usage: s.usage, numTurns: s.numTurns, durationMs: s.durationMs, modelSource: s.modelSource };
}

/** Every primary model id seen across sessions, sorted. */
export function modelSet(sessions) {
  return [...new Set(sessions.map((s) => s.model).filter(Boolean))].sort();
}

/** Every background model id seen across sessions, sorted. */
export function auxModelSet(sessions) {
  return [...new Set(sessions.flatMap((s) => s.auxModels ?? []))].sort();
}

/** The run-level `model` value: the one primary id, or several joined, or null. */
export function modelStamp(sessions) {
  const models = modelSet(sessions);
  return models.length ? models.join(" + ") : null;
}

/**
 * The end-of-run block: sessions counted, mean and p90 of each meter, mean
 * turns and duration, the cache-read share of input, the primary and
 * background model sets, and a warning when primary models differ across
 * sessions or one differs from a pinned `--model`. Background models never warn.
 * `pinned` is the `--model` argument or null.
 */
export function usageLines(sessions, pinned) {
  const lines = [`Usage over ${sessions.length} session(s):`];
  for (const k of METERS) lines.push(`  ${k.padEnd(28)} ${stats(sessions.map((s) => s.usage?.[k]))}`);
  lines.push(`  ${"num_turns".padEnd(28)} ${mean(sessions.map((s) => s.numTurns))}`);
  lines.push(`  ${"duration_ms".padEnd(28)} ${mean(sessions.map((s) => s.durationMs))}`);

  // Share over sessions that reported all three input meters; a session that
  // reported only some would bias the ratio towards whichever it reported.
  const full = sessions.filter((s) => ["input_tokens", "cache_creation_input_tokens", "cache_read_input_tokens"].every((k) => s.usage?.[k] !== null && s.usage?.[k] !== undefined));
  const read = full.reduce((a, s) => a + s.usage.cache_read_input_tokens, 0);
  const total = full.reduce((a, s) => a + s.usage.cache_read_input_tokens + s.usage.cache_creation_input_tokens + s.usage.input_tokens, 0);
  lines.push(`  ${"cache-read share of input".padEnd(28)} ${full.length && total ? `${((100 * read) / total).toFixed(1)}% (${full.length}/${sessions.length} reported)` : "not reported"}`);

  const models = modelSet(sessions);
  const fromInit = sessions.filter((s) => s.modelSource !== "modelUsage").length;
  const aux = auxModelSet(sessions);
  lines.push(`  ${"primary models".padEnd(28)} ${models.length ? models.join(", ") : "not reported"}${fromInit ? ` (${fromInit} session(s) without modelUsage: read from init.model or not reported)` : ""}`);
  lines.push(`  ${"background models".padEnd(28)} ${aux.length ? aux.join(", ") : "none reported"}`);
  if (models.length > 1) {
    lines.push(`  WARNING: ${models.length} primary model ids across sessions (${models.join(", ")}). Numbers above mix models.`);
  }
  if (pinned) {
    const off = models.filter((m) => !matchesPinned(m, pinned));
    if (off.length) lines.push(`  WARNING: --model ${pinned} was passed but session(s) ran ${off.join(", ")}.`);
  }
  return lines;
}

/** `--model` takes an alias (`opus`) or a full id; an alias matches any id containing it. */
function matchesPinned(id, pinned) {
  return id === pinned || id.includes(pinned);
}

function numberOrNull(v) {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function reportedValues(values) {
  return values.filter((v) => typeof v === "number");
}

function mean(values) {
  const xs = reportedValues(values);
  if (!xs.length) return "not reported";
  return `mean ${round(xs.reduce((a, v) => a + v, 0) / xs.length)}${xs.length < values.length ? ` (${xs.length}/${values.length} reported)` : ""}`;
}

function stats(values) {
  const xs = reportedValues(values).sort((a, b) => a - b);
  if (!xs.length) return "not reported";
  // Nearest-rank p90.
  const p90 = xs[Math.ceil(0.9 * xs.length) - 1];
  return `mean ${round(xs.reduce((a, v) => a + v, 0) / xs.length)}  p90 ${round(p90)}${xs.length < values.length ? ` (${xs.length}/${values.length} reported)` : ""}`;
}

function round(v) {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}
