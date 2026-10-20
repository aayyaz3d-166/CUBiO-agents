# CUBiO Agentic AI MCP MVP v1.1 — Desktop Extraction & Verification Report

**Extraction Date:** 2026-10-20  
**Source Repository:** `E:\3D memory studio\packages\cubio-mcp`  
**Target Desktop Folder:** `C:\Users\PC\Desktop\CUBiO-Agentic-AI-MCP-MVP-v1.1`  
**Package:** `@cubio/mcp-server` v1.1.0  
**Authority:** `@PMA` (Project Manager Agent)  
**Safety Invariants:**
- `IS_ACTUATION_BLOCKED = true` (PERMANENTLY LOCKED)
- `publishAllowed = false` (PUBLISHING & DEPLOYMENT DISABLED)

---

## 1. Executive Summary

The updated **CUBiO Agentic AI Model Context Protocol (MCP) MVP v1.1** has been extracted from the main source repository (`E:\3D memory studio`) and installed into a standalone desktop directory at:
`C:\Users\PC\Desktop\CUBiO-Agentic-AI-MCP-MVP-v1.1`

The original Desktop MVP (`C:\Users\PC\Desktop\CUBiO-Agentic-AI-MCP-MVP`) has been left completely intact and untouched.

This v1.1 release upgrades the standalone MCP server from the previous v1.0.0 snapshot, integrating all verified fixes and architectural enhancements from Tasks 1–10 of the CUBiO Distribution Roadmap:
1. **BUG-005:** Stdio stream closure handling (`stdin.on('end')` and `close`) preventing orphaned zombie processes.
2. **BUG-006:** End-to-end parity between `tools/list` and execution across all 17 sovereign tools.
3. **BUG-007:** Deterministic workspace root resolution with containment verification and traversal breakout denial.
4. **Task 9 Security:** Two-step write approval flow with `confirm_write_approval`, timingSafeEqual verification of `CUBIO_HUMAN_OPERATOR_SECRET`, single-use token replay protection (`TOKEN_ALREADY_USED`), and agent self-approval blocking.
5. **Task 8 TypeScript:** Clean ambient declaration files without TS1039 ambient initializers, verified under `strict: true`.
6. **Task 5 Self-Containment:** Standalone bundle pre-bundling all 20 agents and requiring only `@modelcontextprotocol/sdk`.

---

## 2. Included Sovereign Agents (20 Total)

The bundled standalone engine (`dist/index.js`) includes the complete, implemented 20-agent CUBiO sovereign multi-agent architecture:

| Agent Identifier | Name | Version | Lifecycle Status |
| :--- | :--- | :---: | :---: |
| `CUBIO-NATIVE-PMA` | Project Manager Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-001-MEA` | Memory Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-002-DRA` | Dependency & Reuse Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-003-TGA` | Test & Gate Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-004-EIA` | Evidence & Audit Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-005-TheMG` | Evidence & Solution Planning Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-006-BTWA` | Background Task Watchdog Agent | 2.1.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-008-AOA` | Agent Orchestration Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-009-CEA` | Code Execution Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-010-SGA` | Security & Governance Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-011-OMA` | Observability & Monitoring Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-012-RRA` | Research & Retrieval Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-013-CDA` | Coding Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-014-MAA` | Mathematics Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-015-BFA` | Bug-Fixing Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-016-SAA` | System Architecture Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-017-FUA` | Frontend & UI Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-018-DSA` | Data & Storage Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-019-POA` | Performance Optimization Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |
| `AGENT-020-RDA` | Release & Deployment Agent | 1.0.0 | `IMPLEMENTED_CALLABLE` |

---

## 3. Included Sovereign Tools (17 Total)

| # | Tool Name | Category | Tier | Purpose |
| :-: | :--- | :--- | :---: | :--- |
| 1 | `list_agents` | Agent Discovery | `STABLE` | Discover all 20 registered CUBiO agents and statuses. |
| 2 | `get_agent_capabilities` | Agent Discovery | `STABLE` | Retrieve typed contracts and schema references for an agent. |
| 3 | `orchestrate_tasks` | Orchestration | `STABLE` | Dispatch multi-agent DAG task requests to AOA. |
| 4 | `discover_skills` | Skills Framework | `STABLE` | Discover registered skills by ID or capability keyword. |
| 5 | `execute_skill` | Skills Framework | `STABLE` | Execute an authorized skill with cryptographic provenance. |
| 6 | `submit_task` | PMA Pipeline | `STABLE` | Universal single-entry natural-language task intake. |
| 7 | `get_task_status` | PMA Pipeline | `STABLE` | Query planning, routing, and task execution progress. |
| 8 | `execute_task` | PMA Pipeline | `STABLE` | Autonomous specialist delegation and task execution. |
| 9 | `onboard_workspace` | Workspace Management | `STABLE` | Generalized discovery and onboarding of external projects. |
| 10 | `inspect_workspace` | Workspace Management | `STABLE` | Return dynamic discovery profiles and entry points. |
| 11 | `select_workspace` | Workspace Management | `STABLE` | Switch active authorized workspace context. |
| 12 | `list_workspaces` | Workspace Management | `STABLE` | Enumerate registered workspaces and canonical paths. |
| 13 | `authorize_workspace` | Workspace Security | `STABLE` | Configure workspace boundary and read-only policy. |
| 14 | `verify_path_containment`| Workspace Security | `STABLE` | Security audit tool detecting traversal and breakouts. |
| 15 | `request_write_approval` | Workspace Security | `STABLE` | Propose content-bound write modification. |
| 16 | `confirm_write_approval` | Workspace Security | `STABLE` | Authenticate operator and mint single-use approval token. |
| 17 | `write_workspace_file` | Workspace Security | `STABLE` | Perform atomic write with token and readback verification. |

---

## 4. Inventory of Files & SHA-256 Checksums

| File Path | Size (Bytes) | SHA-256 Cryptographic Checksum | Purpose |
| :--- | :---: | :--- | :--- |
| `bin/cubio-mcp.js` | 3,413 | `54A052AA27E167AA35C5CA6A0E6A737E48FC6F1735D270BF3BBE41256FBFC793` | Executable CLI entry point with BUG-005 stream listeners |
| `dist/index.js` | 2,470,471 | `7EAAE723BE01DA9C316BAFB446CA2B63E6D7FD48A2CE9DCEA546CF7D10C8D7E7` | Self-contained ESM bundle with 20 agents & 17 tools |
| `dist/index.js.map` | 4,474,429 | `DA1EE93F77068D9B64C9F4D37841748D94FE522CFAF6A98EC17AFB74F4F94843` | Full source maps for diagnostic traces |
| `dist/index.d.ts` | 458 | `15D5905E9E2F68C772518CE3543A76E0F00FD5A31F9EED1C4C0CBC7C34274849` | Public barrel type declarations |
| `dist/types.d.ts` | 4,025 | `25ABC98A26D85AEA29034C93AAE9CF67BC54F38BF8A747FBBF9F4AE49525AA5F` | Clean ambient declarations without TS1039 initializers |
| `dist/workspace/index.d.ts` | 112 | `7267AAED4B7D7DB5A97C6B37E1D1EAC067E20F3CF2FF7B36867624F1097B9DE6` | Workspace types barrel export |
| `dist/workspace/types.d.ts` | 6,214 | `69FEFB8826F442EF73CC5239B5A7078E4CE0576736DC600A1631BCDFE2588FC4` | Workspace profiling and discovery type contracts |
| `src/server.ts` | 3,559 | `38A37B3EED42211BF1F305F8B3A95212750305E1C3F977027AE1F9AC961EC70F` | MCP Stdio server wrapper with versioning options |
| `src/types.ts` | 4,427 | `1CE37BCFFA219E9866861D05A8F1E7DAEDFB51A20BDB6F0956AD33487487B987` | Tool schema types including confirm_write_approval |
| `package.json` | 1,262 | `52EF166317AAD2FAB9EDA38DC623F7FF509395A081EFF02927E187957D06D769` | Manifest declaring version 1.1.0 & runtime dependencies |
| `package-lock.json` | 58,550 | `82BC92BB7A539A38EE274AF1540524D1C6C2AF10E9B9552429D49981FDC4C8DD` | Resolved dependency lockfile for @modelcontextprotocol/sdk |
| `README.md` | 7,130 | `02C900F7B3BCE8C28D3155F888DA0FE0E8549AE4C936E5681C6AFA8A02FBC93C` | Quickstart, desktop client configurations, and usage |
| `INSTALLATION.md` | 9,658 | `8C44B1490FEBFD875FCDD20C9625BD122EF97D40BC0AC10B9A46606DE4EBE9E7` | Comprehensive installation and permission hardening guide |
| `SECURITY.md` | 5,101 | `DC4875A541E0F0EA80B3B5C2186A79F6D3B8AA4D735D24052FF5DA8C57554A9A` | Security invariants, two-step write flow, and redactor |
| `CHANGELOG.md` | 7,154 | `3050451D402603331E7E62126AA2EA7D05D76B0538BB3F6B22AA64289F4A8A8E` | Release notes for v1.1.0 and v1.0.0 |
| `VERSIONING.md` | 5,168 | `C3C3EF658B7B97A9318334C72D19185161EEBE3C4A3AB2E7A181A3F764E26C68` | SemVer 2.0.0 specification and release gate policy |
| `LICENSE` | 7,135 | `387377FA063CA3485B68D97BDF62C086070CCFC698E289966BF8F029356A6D5A` | Apache-2.0 open source license |
| `release-manifest.json` | 4,261 | `7EEB758347CEDF09783918F5169E88E667D292462FDE1C53A08777A11E3335EB` | Reconciled release manifest with 17 tools & fingerprints |
| `cubio-mcp-server-1.1.0.tgz` | 1,576,676 | `E6106F5D697DB0F392B6A346066B13DD8C32637574BCFF7E4CBBC664AC15EF71` | Production distribution tarball |

---

## 5. Verification & Test Evidence

The following test suites were executed directly against the files in `C:\Users\PC\Desktop\CUBiO-Agentic-AI-MCP-MVP-v1.1`:

1. **CLI Execution Test:**
   - Command: `node bin/cubio-mcp.js --version`
   - Exit Code: `0`
   - Output: `cubio-mcp-server v1.1.0 (CUBiO Standalone MVP)`
   - Command: `node bin/cubio-mcp.js --help`
   - Exit Code: `0`

2. **Real Stdio Handshake & Tool Parity Test:**
   - Stdio transport connected successfully.
   - Initialized with protocol version `2024-11-05`, server name `cubio-agentic-ai-mcp` v`1.1.0`.
   - `tools/list` returned all 17 tools with valid JSON schemas.

3. **Two-Step Write Approval & Operator Auth Test:**
   - Proposal generated via `request_write_approval`.
   - Operator authenticated via `confirm_write_approval` using `CUBIO_HUMAN_OPERATOR_SECRET`.
   - Single-use token replay blocked with `TOKEN_ALREADY_USED`.

4. **Containment & Traversal Defense Test:**
   - Relative breakout `../../` rejected fail-closed (`isContained: false`).
