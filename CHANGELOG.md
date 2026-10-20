# Changelog

All notable changes to the `@cubio/mcp-server` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-10-20

### Distribution MVP Developer Preview Release

#### Added & Improved
- **BUG-005 Session Lifecycle & Disconnect Hardening:**
  - Added robust `process.stdin.on('end')` and `process.stdin.on('close')` stream listeners in `bin/cubio-mcp.js` and `src/server.ts`.
  - Clean process termination on client host disconnect or session cancellation, preventing orphaned zombie Node.js processes.
- **BUG-006 End-to-End Tool Parity (17 Tools):**
  - Full parity between `tools/list` advertisement and actual execution for all 17 sovereign MCP tools.
  - Added and verified `confirm_write_approval` schema and dispatch for two-step human operator confirmation.
- **BUG-007 Deterministic Workspace Root Resolution:**
  - Hardened workspace root resolution against ambiguous `process.cwd()` fallback; fail-closed rejection when root is not explicitly selected or authorized.
  - Containment verification blocking directory breakout (`../../`) and root filesystem mounts.
- **Two-Step Authenticated Write Flow & Replay Protection (Task 9):**
  - Added `confirm_write_approval` tool requiring server-side human operator key (`CUBIO_HUMAN_OPERATOR_SECRET`).
  - Single-use token replay protection (`TOKEN_ALREADY_USED`); modification of proposed content invalidates approval token.
  - Autonomous agent self-approval attempts detected and blocked (`AGENT_SELF_APPROVAL_DETECTED`).
  - Universal redaction of operator secret across stderr diagnostics, JSON responses, and logs.
- **Strict TypeScript Build & Ambient Type Cleanup (Task 8):**
  - Fixed `dist/types.d.ts` by transforming constant initializers into clean ambient declarations, resolving TS1039 in strict external consumer projects.
  - Verified compilation under `strict: true` and `skipLibCheck: false`.
- **Dependency Closure & Self-Containment (BUG-015 / Task 5):**
  - All monorepo internal modules pre-bundled into `dist/index.js` (2.4 MB); standalone package requires only `@modelcontextprotocol/sdk`.
- **Enhanced Documentation & Fresh-Machine Onboarding (Task 6):**
  - Updated `README.md` and `INSTALLATION.md` with complete client configuration snippets for Claude Desktop, Cursor, and VS Code.
  - Documented secure operator credential provisioning, rotation/revocation guidelines, and file permission hardening (`chmod 600`).

---

## [1.0.0] - 2026-10-19

### Initial Standalone Release (Production MVP)

#### Added
- **Sovereign Multi-Agent Stdio Server:** Exposes CUBiO's 20-agent architecture and autonomous task management through standard I/O transport compliant with the Model Context Protocol (MCP).
- **17 Sovereign MCP Tools:**
  1. `list_agents`: Enumerate all 20 sovereign CUBiO agents with lifecycle states and versions.
  2. `get_agent_capabilities`: Retrieve typed contracts, capability definitions, and JSON schemas for any agent.
  3. `orchestrate_tasks`: Dispatch DAG subtask workflows through Agent Orchestration Agent (AOA).
  4. `discover_skills`: Dynamic skill discovery by ID or capability keyword.
  5. `execute_skill`: Permissioned agent skill execution with cryptographic provenance.
  6. `submit_task`: Universal single-entry natural-language engineering task intake via Native PMA.
  7. `get_task_status`: Query planning, routing state, constraints, and execution status.
  8. `execute_task`: Autonomous specialist selection, DAG generation, and verifiable execution.
  9. `onboard_workspace`: Generalized repository discovery and onboarding for arbitrary external projects.
  10. `inspect_workspace`: Inspect dynamic subsystems, entry points, architecture topology, and test harnesses.
  11. `select_workspace`: Select active authorized workspace for subsequent operations.
  12. `list_workspaces`: List all registered workspaces, canonical paths, and timestamps.
  13. `authorize_workspace`: Explicitly configure workspace boundaries, read-only mode, and write approval policies.
  14. `verify_path_containment`: Security audit tool detecting traversal attacks, root escapes, symlink/junction breakouts, and protected baseline tampering.
  15. `request_write_approval`: Register write proposal and require human operator confirmation (Finding A / BUG-009).
  16. `confirm_write_approval`: Authenticate human operator server-side and mint single-use, workspace-bound approval token.
  17. `write_workspace_file`: Secure atomic workspace file modification with token verification and post-write disk readback.
- **Generalized Project Discovery Engine:**
  - Multi-language AST and heuristic analysis for Node.js, Python, Rust, Go, and Web static/SPA projects.
  - Automatic detection of entry points (`index.ts`, `main.py`, `src/main.rs`, `main.go`, `index.html`).
  - Automatic test command detection (`npm test`, `pytest`, `cargo test`, `go test ./...`).
  - Dynamic functional subsystem generation in PMA replacing hardcoded internal catalogs.
  - Honest reporting of empty repositories and unsupported binary trees.
- **Enterprise Security & Workspace Containment:**
  - Strict path canonicalization (`fs.realpathSync`) preventing drive root breakout (`C:\`, `/`).
  - Allowed parent directory roots configuration (`allowedParentDirs` / `--allowed-roots`).
  - Protection against direct (`../`), Windows backslash (`..\`), URL-encoded (`%2e%2e`), and null-byte (`\0`, `%00`) path traversal.
  - Recursive segment inspection for Windows NTFS directory junctions and symbolic link breakouts.
  - Read-only workspace mounting mode (`--read-only` / `policy: READ_ONLY`).
  - Content-bound HMAC-SHA256 user approval tokens for workspace modifications.
  - Atomic sibling writing (`.tmp.<timestamp>`) and immediate disk readback verification.
- **Universal Secret Redaction Engine:**
  - Automatic mask replacement across 11 credential classes (OpenAI/Anthropic keys, Google keys, GitHub tokens, AWS keys, webhook secrets, Bearer tokens, passwords, private keys, and environment secret assignments).
  - Sanitization applied fail-closed to all MCP tool outputs and error logs.
- **CLI Options:**
  - `--workspace <path>` / `-w <path>`: Pre-authorize external repository workspace on server startup.
  - `--read-only`: Mount pre-authorized workspace in read-only mode.
  - `--allowed-roots <paths>`: Comma-separated allowed parent directory boundaries.
  - `--verbose`: Enable diagnostic telemetry on standard error.
  - `--help`, `--version`: Help and version documentation.

#### Security & Safety Invariants
- **Hardware Actuation Lockout:** `IS_ACTUATION_BLOCKED = true` permanently active across all operations.
- **Strict Stdio Discipline:** `stdout` is reserved exclusively for JSON-RPC 2.0 frames; all diagnostics, logs, and telemetry are routed to `stderr`.
- **Zero Baseline Drift:** Core repository assets (`data/cubio_studio.db`, `src/core/address369.ts`, `data/checkpoints/phase16_production_final_sealed_1m.3dmemory`) are shielded from any modification.
