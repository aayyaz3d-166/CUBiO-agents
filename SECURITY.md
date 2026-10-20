# CUBiO MCP Server v1.1 — Security & Permissions Policy

## 1. Safety Architecture & Core Invariants

The CUBiO Agentic AI MCP MVP v1.1 operates under strict safety and isolation guarantees designed to prevent unauthorized code execution, arbitrary disk modifications, and credential leakage.

### Permanent Invariants
- **Hardware Actuation Lockout (`IS_ACTUATION_BLOCKED = true`):** Hardware actuation hooks, external robot triggers, physical relays, and external production web hooks are permanently disabled and locked.
- **Strict Stdio Protocol Discipline:** All Model Context Protocol communications occur via pure JSON-RPC 2.0 frames on `stdout`. Diagnostic logging, lifecycle events, and telemetry are strictly emitted to `stderr` to prevent protocol framing corruption in MCP host clients (Claude Desktop, Cursor, Antigravity).
- **Session Lifecycle & Signal Resilience (BUG-005):** Clean process termination and resource release on `process.stdin` `end` and `close` events, preventing orphaned zombie Node.js processes upon client host disconnect or session cancellation.

---

## 2. Workspace Containment & Permissions

### Path Containment & Traversal Defense (BUG-007)
- All filesystem operations are strictly sandboxed within the explicitly authorized workspace root directory.
- Relative paths are canonicalized using `fs.realpathSync` to evaluate symlinks and junctions.
- Directory traversal patterns (`../`, `..\`), root escapes (`C:\`, `/`), and attempts to write outside the workspace boundaries are intercepted and rejected fail-closed (`PATH_TRAVERSAL_DETECTED`).
- Workspace root resolution rejects ambiguous `process.cwd()` fallbacks to launcher directories when an intended workspace root is not explicitly selected.

---

## 3. Two-Step Authenticated Write Approval Flow (Task 9)

Workspaces can be mounted in `--read-only` mode, which completely disallows write operations (`READ_ONLY_VIOLATION`). In mutable mode, writing or modifying files requires a strict two-step authenticated authorization flow:

```mermaid
sequenceDiagram
    autonumber
    actor Client as AI Agent / MCP Client
    participant Server as CUBiO MCP Server
    actor Operator as Human Operator

    Client->>Server: request_write_approval(taskId, relativePath, content)
    Server-->>Client: Returns proposalId (State: PENDING_HUMAN_CONFIRMATION)

    Note over Operator,Server: Operator provides CUBIO_HUMAN_OPERATOR_SECRET out-of-band
    Operator->>Server: confirm_write_approval(proposalId, decision: APPROVE, operatorAuthKey)
    Server->>Server: Validate operatorAuthKey via crypto.timingSafeEqual
    Server-->>Operator: Mint single-use approvalToken (AUTH-...)

    Client->>Server: write_workspace_file(taskId, relativePath, content, approvalToken)
    Server->>Server: Verify token, consume token (single-use), write atomically, read back
    Server-->>Client: Write confirmed & token marked TOKEN_ALREADY_USED
```

### Security Properties
1. **No Autonomous Self-Approval:** Autonomous agents cannot approve write proposals. Invocations of `confirm_write_approval` without the authentic operator credential fail closed (`AGENT_SELF_APPROVAL_DETECTED` / `UNAUTHORIZED_OPERATOR`).
2. **Timing-Safe Credential Verification:** Human operator authentication employs `crypto.timingSafeEqual` with constant-time SHA-256 digests, eliminating side-channel timing attacks.
3. **Single-Use Replay Protection:** Approval tokens (`AUTH-...`) are strictly single-use. Replaying a used token immediately triggers `TOKEN_ALREADY_USED`.
4. **Content-Binding Invariant:** Approval tokens are cryptographically bound to the SHA-256 hash of the exact proposed content. Any alteration to content invalidates the token (`CONTENT_HASH_MISMATCH`).

---

## 4. Universal Secret Redaction Engine

- **Universal Redactor:** All outgoing MCP tool payloads, diagnostic error messages, and log streams pass through an automated secret redactor (`SecretRedactor`).
- **Redaction Coverage:** Universal mask replacement across 11 credential classes:
  - Human operator authentication keys (`CUBIO_HUMAN_OPERATOR_SECRET`, `operatorAuthKey`)
  - Private API keys (OpenAI, Anthropic, Google Gemini, GitHub, AWS, Stripe)
  - RSA/OpenSSH private keys and certificates (`-----BEGIN PRIVATE KEY-----`)
  - Database connection URIs containing embedded passwords
  - High-entropy authentication bearer tokens
- **Masking Format:** Detected secrets are replaced with `[REDACTED_SECRET:<type>]` or `[REDACTED_OPERATOR_KEY]`.

---

## 5. Protected Assets & Data Custody

The standalone MCP MVP contains no embedded production checkpoints, SQLite training datasets, or `.env` configuration files.

When executing against any workspace, the server permanently forbids modifying or inspecting protected authorities:
- `*.db`, `*.sqlite`, `*.3dmemory`
- `.env`, `.env.*`
- `.git` internal configuration

---

## 6. Vulnerability Reporting

If you identify any security issue or vulnerability in `@cubio/mcp-server`, please report it directly to the CUBiO AI Security and Governance Engineering Team via internal repository issue gates.
