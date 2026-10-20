/**
 * CUBiO AI — Standalone Model Context Protocol (MCP) Server
 * packages/cubio-mcp/src/server.ts
 *
 * Implements the sovereign 16-tool CUBiO MCP Stdio Server.
 * Reuses verified CUBiO multi-agent orchestration, skills framework, PMA pipeline,
 * and generalized external workspace onboarding.
 *
 * Permanent Safety Invariant: IS_ACTUATION_BLOCKED = true
 * Strict Stdio Discipline: stdout reserved for JSON-RPC; stderr for diagnostics.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createCubiOMcpServer as createInternalCubiOServer } from '../../../src/cubio/mcp/server.js';
import { WorkspaceManager } from '../../../src/cubio/workspace/workspaceManager.js';
import { CubioMcpServerOptions, CUBIO_MCP_TOOLS } from './types.js';

/**
 * Creates and configures the CUBiO MCP Server instance.
 * Exposes all 16 sovereign tools:
 * 1. list_agents
 * 2. get_agent_capabilities
 * 3. orchestrate_tasks
 * 4. discover_skills
 * 5. execute_skill
 * 6. submit_task
 * 7. get_task_status
 * 8. execute_task
 * 9. onboard_workspace
 * 10. inspect_workspace
 * 11. select_workspace
 * 12. list_workspaces
 * 13. authorize_workspace
 * 14. verify_path_containment
 * 15. request_write_approval
 * 16. write_workspace_file
 */
export function createCubiOMcpServer(options?: CubioMcpServerOptions): Server {
  if (options?.defaultWorkspace) {
    try {
      const wsManager = WorkspaceManager.getInstance();
      const ws = wsManager.authorizeWorkspace(options.defaultWorkspace, {
        readOnly: options.readOnly,
        allowedParentDirs: options.allowedRoots,
      });
      console.error(
        `[CUBiO MCP] Pre-authorized default workspace: "${ws.canonicalPath}" (${ws.profile?.architectureStyle || 'UNKNOWN'}) [ReadOnly: ${ws.readOnly}]`
      );
    } catch (err: any) {
      console.error(`[CUBiO MCP] Warning: Failed to pre-authorize default workspace: ${err.message}`);
    }
  }

  return createInternalCubiOServer({
    name: options?.serverName || 'cubio-agentic-ai-mcp',
    version: options?.serverVersion || '1.1.0',
  });
}

/**
 * Connects the CUBiO MCP Server to standard I/O (stdio) transport.
 * Enforces pure JSON-RPC on stdout and diagnostic logs on stderr.
 */
export async function runMcpStdioServer(options?: CubioMcpServerOptions): Promise<void> {
  const server = createCubiOMcpServer(options);
  const transport = new StdioServerTransport();

  // BUG-005: Robust stdio lifecycle listeners to prevent orphaned zombie processes
  // when client host disconnects, terminates, or cancels the session task.
  transport.onclose = () => {
    console.error('[CUBiO MCP] Stdio transport closed by client host. Exiting.');
    process.exit(0);
  };

  process.stdin.on('close', () => {
    console.error('[CUBiO MCP] Stdin closed by client host. Exiting.');
    process.exit(0);
  });

  process.stdin.on('end', () => {
    console.error('[CUBiO MCP] Stdin ended by client host. Exiting.');
    process.exit(0);
  });

  console.error(
    `[CUBiO MCP] Connecting ${options?.serverName || 'cubio-agentic-ai-mcp'} v${options?.serverVersion || '1.1.0'} to StdioServerTransport...`
  );
  console.error('[CUBiO MCP] Hardware Actuation Lockout: IS_ACTUATION_BLOCKED = true (LOCKED)');
  console.error(`[CUBiO MCP] Registered Tools (${CUBIO_MCP_TOOLS.length}): ${CUBIO_MCP_TOOLS.join(', ')}`);

  await server.connect(transport);
  console.error('[CUBiO MCP] Stdio server connected and listening for client requests.');
}
