# CUBiO MCP Server — Versioning & Release Strategy

This document establishes the official versioning, stability, and deprecation policy for the `@cubio/mcp-server` standalone package.

---

## 1. Semantic Versioning Specification (SemVer 2.0.0)

`@cubio/mcp-server` strictly complies with [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html). Version numbers follow the format `MAJOR.MINOR.PATCH`:

```
v MAJOR . MINOR . PATCH
    │       │       │
    │       │       └── Backward-compatible bug fixes and internal security enhancements
    │       └────────── Backward-compatible new features, new MCP tools, or option flags
    └────────────────── Incompatible API / protocol breaks or security policy changes
```

### Major Version Increments (`X.0.0`)
A major release is triggered when:
- Any existing MCP tool name is removed or renamed.
- A required property is added to an existing tool's `inputSchema`, or an existing accepted property is rejected.
- The structure or schema of a tool's JSON output payload breaks backwards compatibility.
- Workspace security boundaries or approval token generation algorithms change incompatibly.
- Minimum supported Node.js version is increased.

### Minor Version Increments (`x.Y.0`)
A minor release is triggered when:
- New sovereign MCP tools are added to the server registry.
- New optional parameters or optional tool capabilities are introduced.
- Support for new programming languages, project manifests, or architecture styles is added to `ProjectDiscoveryEngine`.
- New CLI options or configuration parameters are supported.
- Diagnostic, memory, or caching performance improvements are made without changing schema contracts.

### Patch Version Increments (`x.y.Z`)
A patch release is triggered when:
- Internal bug fixes or edge-case handling improvements are made without altering schemas.
- Documentation, README, or example configurations are improved.
- Secret redaction regexes are expanded to catch newly identified credential patterns.
- Internal dependency updates for `@modelcontextprotocol/sdk` or devDependencies.

---

## 2. Model Context Protocol (MCP) Contract Stability

All 16 sovereign tools exposed by `@cubio/mcp-server` are governed by stability guarantees:

| Tool Name | Stability Tier | Schema Compatibility Guarantee |
|---|---|---|
| `list_agents` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `get_agent_capabilities` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `orchestrate_tasks` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `discover_skills` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `execute_skill` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `submit_task` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `get_task_status` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `execute_task` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `onboard_workspace` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `inspect_workspace` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `select_workspace` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `list_workspaces` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `authorize_workspace` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `verify_path_containment`| Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `request_write_approval` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `confirm_write_approval` | Stable (Tier 1) | Backward-compatible across all 1.x releases |
| `write_workspace_file` | Stable (Tier 1) | Backward-compatible across all 1.x releases |

---

## 3. Deprecation Policy

1. **Advance Notice:** Any tool or parameter scheduled for removal will be marked as deprecated in `inputSchema` description and documentation for at least one minor release cycle (`>= 3 months`) prior to removal in a major version.
2. **Fail-Closed Migration:** Deprecated features will continue functioning safely until the major release, emitting a non-intrusive diagnostic deprecation notice on `stderr`.
3. **Zero Silent Breaking Changes:** No tool or schema will ever be broken or removed in a minor or patch release.

---

## 4. Release Validation Gate & Authorized Release Process

Every release of `@cubio/mcp-server` must satisfy the following four gates before publication:
1. **Automated Test Certification:** 100% pass rate across all Stage 4 test suites (`test_task4_1`, `test_task4_2`, `test_task4_3`, `test_task4_5`, and `test_task4_6`).
2. **Clean Tarball Verification:** Validation that `cubio-mcp-server-<version>.tgz` contains only whitelisted distribution files and zero private project databases or credentials.
3. **Dry-Run Certification:** Successful execution of `npm publish --dry-run` with exit code `0`.
4. **Explicit Release Authorization:** Human authorization is mandatory before executing `npm publish`.
