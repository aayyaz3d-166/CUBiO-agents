#!/usr/bin/env node
/**
 * CUBiO AI — Standalone Model Context Protocol (MCP) CLI Executable
 * packages/cubio-mcp/bin/cubio-mcp.js
 *
 * Exposes CUBiO's 20-Agent sovereign multi-agent architecture and PMA task intake
 * over standard I/O (stdio) transport compliant with the Model Context Protocol (MCP).
 * Supports external project workspace onboarding and inspection.
 *
 * CRITICAL STDIO DISCIPLINE:
 * stdout is strictly reserved for JSON-RPC MCP protocol communication.
 * All logging, diagnostic, and lifecycle messages MUST be emitted to stderr.
 */

import { runMcpStdioServer } from '../dist/index.js';

// CLI argument parsing
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  process.stderr.write(`
CUBiO Sovereign MCP Server (Standalone MVP)

Usage:
  cubio-mcp [options]

Options:
  -h, --help              Show this help message
  -v, --version           Show version information
  -w, --workspace <path>  Pre-authorize and onboard an external workspace directory
  --read-only             Mount workspace in read-only mode (blocks writes)
  --allowed-roots <paths> Comma-separated allowed parent directory roots
  --verbose               Enable verbose diagnostic logging to stderr

Standard Input / Output:
  Communicates via JSON-RPC 2.0 over stdin/stdout.
  Configure in client (Claude Desktop, Cursor, Antigravity):
  {
    "mcpServers": {
      "cubio": {
        "command": "node",
        "args": ["<path-to-cubio-mcp>/bin/cubio-mcp.js", "--workspace", "/path/to/project"]
      }
    }
  }
\n`);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  process.stderr.write('cubio-mcp-server v1.1.0 (CUBiO Standalone MVP)\n');
  process.exit(0);
}

// Extract workspace flags if provided
let defaultWorkspace = undefined;
let isReadOnly = args.includes('--read-only');
let allowedRoots = undefined;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--workspace' || args[i] === '-w') {
    defaultWorkspace = args[i + 1];
    i++;
  } else if (args[i] === '--allowed-roots') {
    allowedRoots = args[i + 1] ? args[i + 1].split(',').map((p) => p.trim()) : undefined;
    i++;
  }
}

// Global safety invariant announcement
process.stderr.write('[CUBiO MCP CLI] Starting CUBiO Sovereign MCP Server...\n');
process.stderr.write('[CUBiO MCP CLI] Safety Invariant: IS_ACTUATION_BLOCKED = true (LOCKED)\n');

// Handle process termination signals and stdin stream closure cleanly (BUG-005)
process.on('SIGINT', () => {
  process.stderr.write('\n[CUBiO MCP CLI] Received SIGINT. Shutting down cleanly...\n');
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.stderr.write('\n[CUBiO MCP CLI] Received SIGTERM. Shutting down cleanly...\n');
  process.exit(0);
});

process.stdin.on('close', () => {
  process.stderr.write('[CUBiO MCP CLI] Stdin stream closed by host. Exiting cleanly.\n');
  process.exit(0);
});

process.stdin.on('end', () => {
  process.stderr.write('[CUBiO MCP CLI] Stdin stream ended by host. Exiting cleanly.\n');
  process.exit(0);
});

const isVerbose = args.includes('--verbose');

runMcpStdioServer({
  serverName: 'cubio-agentic-ai-mcp',
  serverVersion: '1.1.0',
  verbose: isVerbose,
  defaultWorkspace,
  readOnly: isReadOnly,
  allowedRoots,
}).catch((err) => {
  process.stderr.write(`[CUBiO MCP CLI] Fatal server error: ${err?.message || err}\n`);
  process.exit(1);
});
