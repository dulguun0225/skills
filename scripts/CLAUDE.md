# scripts/

Loaded when a session works under `scripts/`. The repo root `CLAUDE.md` says what each script reports and how to read it; this file holds the rules for changing them.

- **Every gate stays dependency-free.** The `tokens` family is the only code here with an npm dependency (`gpt-tokenizer`, o200k_base).
- **Each gate prints what it does not decide, on every run.** That is a requirement of `enforceable-rules`, not decoration.
- **`--allowed-tools` auto-approves; it does not restrict. Only `--disallowed-tools` removes a tool**, and an enumeration beside it missed the Windows shell, `ToolSearch` and further tools — which is why every firing rate before 2026-08-03 evening is void. Two guards now exist in `firing-harness.mjs`: the preflight refuses to run when the session's own `init` tool list holds anything the mode does not permit, and a session that uses such a tool fails as an error, not a miss. Keep both.
- **A case prompt may only point at something its fixture contains.** Prompts named a `TaxService`, a `GET /customers` and an ADR no fixture held, and the model asked for them and stopped.
- **Check a configuration flag; do not believe it.** Every earlier guard tested whether the session succeeded, never whether it was the session that was asked for. Record: [firing-harness](../docs/history/firing-harness.md).
