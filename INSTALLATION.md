# CUBiO MCP Server — Installation & Onboarding Guide

This guide details how to install, configure, onboard workspaces, and connect `@cubio/mcp-server` to AI developer tools and desktop clients over standard I/O (stdio).

---

## 1. System Requirements & Prerequisites

- **Node.js Runtime:** `>= 20.0.0` (required for native `node:sqlite` built-in support).
  - Verify with: `node -v`
- **Supported Platforms Tested:**
  - Windows 10/11 (x64) — *Fully Tested & Verified*
  - Linux (Ubuntu/Debian x64) — *Fully Tested & Verified*
  - macOS (x64 / Apple Silicon) — Standard Node.js ESM execution
- **Zero Native Build Tool Requirements:**
  - Python is **NOT** required.
  - C++ compilers (`gcc`, `visual studio`, `node-gyp`) are **NOT** required.
  - External database engines (Postgres, Redis, external SQLite) are **NOT** required.
- **Package Managers:** `npm` (bundled with Node), `pnpm`, or `yarn`.

---

## 2. Installation Options

### Option A: Install from Tarball (Isolated / Production / Air-Gapped)
```bash
# In your target consumer repository or workspace directory:
npm install /path/to/cubio-mcp-server-1.1.0.tgz

# Verify installed CLI binary:
npx cubio-mcp --help
```

### Option B: Clone Standalone Repository (Developer Mode)
```bash
# Clone the standalone distribution repository:
git clone https://github.com/aayyaz3d-166/Cubio-Agentic-Ai.git
cd Cubio-Agentic-Ai

# Install production dependencies (only @modelcontextprotocol/sdk is required):
npm install --omit=dev

# Test CLI entry point:
node bin/cubio-mcp.js --help
node bin/cubio-mcp.js --version
```

---

## 3. CLI Command Line Flags

The executable entry point `cubio-mcp` accepts the following options:

| Flag | Description | Example |
|---|---|---|
| `-h`, `--help` | Show command line options and exit | `cubio-mcp --help` |
| `-v`, `--version` | Show package version and exit | `cubio-mcp --version` |
| `-w`, `--workspace <path>` | Pre-authorize and onboard a workspace directory | `cubio-mcp -w /home/user/project` |
| `--read-only` | Mount pre-authorized workspace in read-only mode (strictly blocks all writes) | `cubio-mcp -w /app --read-only` |
| `--allowed-roots <paths>` | Comma-separated list of allowed parent directory roots | `cubio-mcp --allowed-roots /home/user,/work` |
| `--verbose` | Enable verbose diagnostic logging to stderr | `cubio-mcp --verbose` |

---

## 4. MCP Client Configuration

### Claude Desktop (`claude_desktop_config.json`)

**Config File Location:**
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

**Configuration:**
```json
{
  "mcpServers": {
    "cubio": {
      "command": "node",
      "args": [
        "<path-to-cubio-mcp>/bin/cubio-mcp.js",
        "--workspace",
        "/path/to/your/project",
        "--read-only"
      ]
    }
  }
}
```

---

### Cursor IDE (`.cursor/mcp.json`)

**Config File Location:** In your project root under `.cursor/mcp.json` or globally in Cursor settings:

```json
{
  "mcpServers": {
    "cubio": {
      "command": "node",
      "args": [
        "<path-to-cubio-mcp>/bin/cubio-mcp.js",
        "--workspace",
        "${workspaceFolder}"
      ]
    }
  }
}
```

---

### Antigravity / Custom JSON-RPC Client

```json
{
  "mcpServers": {
    "cubio-agentic-ai": {
      "command": "node",
      "args": [
        "<path-to-cubio-mcp>/bin/cubio-mcp.js",
        "--workspace",
        "/path/to/your/project"
      ],
      "env": {
        "CUBIO_HUMAN_OPERATOR_SECRET": "YOUR_SECURE_OPERATOR_KEY_MIN_16_CHARS"
      }
    }
  }
}
```

---

## 5. Workspace Security, Secret Provisioning & Governance

> [!IMPORTANT]
> **Onboarding a workspace NEVER implicitly authorizes file modifications.**

CUBiO enforces a strict three-tier containment model with server-side human operator authorization:

1. **Read-Only Mode (`--read-only`):**
   - When launched with `--read-only` or authorized with `readOnly: true`, all write tools immediately fail-closed with `READ_ONLY_VIOLATION`.

2. **Standard Governed Mode (`REQUIRE_APPROVAL_TOKEN`):**
   - By default, workspaces are mounted in governed mode.
   - Calling `write_workspace_file` without a valid, authenticated approval token fails closed with `APPROVAL_REQUIRED`.
   - Modifying files requires a two-step human approval handshake:
     1. Agent calls `request_write_approval` with `taskId`, `targetFilePath`, and `content` to obtain a cryptographic proposal record (`PROP-...`) and content SHA-256 hash. No active write token is emitted.
     2. Human operator confirms via `confirm_write_approval` providing `operatorId` and `operatorAuthKey`.
        - Autonomous agent IDs (`AGENT-*`, `CUBIO-*`, `PMA`, etc.) are rejected fail-closed with `AGENT_SELF_APPROVAL_DETECTED`.
        - `operatorAuthKey` is compared using constant-time `crypto.timingSafeEqual`.
        - Upon verification, an ephemeral, workspace-bound, single-use signed `AUTH-...` token is generated.
     3. Only with this token will `write_workspace_file` write atomically to disk with immediate post-write readback.
     4. Replaying a consumed token is rejected fail-closed with `TOKEN_ALREADY_USED`.

3. **Human Operator Secret Provisioning & Lifecycle:**
   - **Environment Variable:** Set `CUBIO_HUMAN_OPERATOR_SECRET` or `CUBIO_HUMAN_OPERATOR_KEY` in your client's host environment.
   - **Fail-Closed Default:** If omitted, an ephemeral unguessable random key is generated in memory, preventing unauthorized writes.
   - **Subprocess Isolation:** Subprocesses spawned by CEA receive a sanitized environment containing only `PATH`, `SYSTEMROOT`, `TEMP`, `TMP`, and `NODE_ENV`. Host credentials and operator secrets are never exposed to child execution contexts.
   - **Universal Redaction:** `SecretRedactor` masks all credentials in tool responses, error messages, and stderr diagnostic streams (`[REDACTED_API_KEY]`, `[REDACTED_SECRET]`, `[REDACTED_OPERATOR_SECRET]`).
   - **Rotation & Revocation:** Secrets can be rotated via `rotateHumanOperatorSecret` or revoked via `revokeHumanOperatorSecret`, immediately invalidating all pending proposals and active tokens.

4. **Hardware Actuation Lockout:**
   - Permanent safety invariant: `IS_ACTUATION_BLOCKED = true` is permanently active. Hardware execution is strictly locked.

---

## 6. First Safe Task Walkthrough (5-Minute Quickstart)

Once your client is connected, try these four safe read-only operations to verify your setup:

### Step 1: Discover All 20 Registered Agents
Call the tool `list_agents` with no arguments:
```json
{}
```
*Expected Output:* Returns all 20 sovereign CUBiO agents (PMA, AOA, CDA, SGA, RDA, etc.) with declared capabilities and lifecycle status.

### Step 2: Inspect Your Workspace Topology
Call `inspect_workspace` targeting your project:
```json
{
  "workspacePath": "/path/to/your/project"
}
```
*Expected Output:* Returns automatic language detection breakdown, architecture topology, detected manifests (`package.json`, `Cargo.toml`, etc.), and test discovery info.

### Step 3: Discover Agent Skills
Call `discover_skills` to find relevant capabilities:
```json
{
  "keyword": "audit"
}
```
*Expected Output:* Lists registered skills, including `SKILL-011` (Security Architecture Audit), `SKILL-014` (Testing Gate), etc.

### Step 4: Submit a Read-Only Natural Language Task
Submit an analysis objective to the Native Project Manager Agent (PMA):
```json
{
  "objective": "Analyze project architecture and detect entry points",
  "workspacePath": "/path/to/your/project"
}
```
*Expected Output:* PMA accepts the task, decomposes the objective, assigns appropriate specialists (e.g. SAA or CDA), and records verifiable task memory without modifying any files.

---

## 7. Troubleshooting & Frequently Asked Questions (FAQ)

### Q1: I see `ExperimentalWarning: SQLite is an experimental feature...` in stderr. Is something broken?
**No.** Node.js versions 20–24 emit an informational warning when initializing native `node:sqlite`. CUBiO strictly adheres to MCP stdio discipline: all diagnostic logging goes to `stderr`, leaving `stdout` 100% clean for JSON-RPC frames. The warning is completely harmless and does not affect operation.

### Q2: Why does my MCP client fail to connect or report a JSON-RPC timeout?
1. Ensure your config points to `bin/cubio-mcp.js`, not `dist/index.js` or `src/server.ts`.
2. Check that the `node` binary path is accessible in your system PATH.
3. Avoid wrapping `cubio-mcp` in custom shell scripts that emit `echo` or debugging text to `stdout`, as any non-JSON-RPC text on `stdout` breaks the MCP protocol.

### Q3: Why does `write_workspace_file` return `READ_ONLY_VIOLATION`?
Your server was started with `--read-only` or the workspace was authorized with `readOnly: true`. This is intentional safety behavior to protect your repository from unwanted changes. To allow governed writes, remove `--read-only` from your client config args.

### Q4: Why does `write_workspace_file` return `WRITE_APPROVAL_REQUIRED`?
CUBiO prevents autonomous agents from writing files without human confirmation. Follow the two-step flow:
1. `request_write_approval({ taskId, targetFilePath, content })`
2. `confirm_write_approval({ proposalHash, operatorId, operatorSecret })`
3. Pass the generated token to `write_workspace_file`.

### Q5: Can I run CUBiO against directories outside my home folder?
By default, CUBiO allows paths inside standard workspace trees and blocks system root directories (`C:\`, `/`). Use `--allowed-roots /path1,/path2` to explicitly grant access to specific parent directories.
