/**
 * CUBiO AI — Standalone Model Context Protocol (MCP) Server
 * packages/cubio-mcp/src/types.ts
 *
 * Public types and interfaces for the standalone CUBiO MCP package.
 */

export interface CubioMcpServerOptions {
  readonly serverName?: string;
  readonly serverVersion?: string;
  readonly verbose?: boolean;
  readonly defaultWorkspace?: string;
  readonly allowedRoots?: readonly string[];
  readonly readOnly?: boolean;
}

export type CubioMcpToolName =
  | 'list_agents'
  | 'get_agent_capabilities'
  | 'orchestrate_tasks'
  | 'discover_skills'
  | 'execute_skill'
  | 'submit_task'
  | 'get_task_status'
  | 'execute_task'
  | 'onboard_workspace'
  | 'inspect_workspace'
  | 'select_workspace'
  | 'list_workspaces'
  | 'authorize_workspace'
  | 'verify_path_containment'
  | 'request_write_approval'
  | 'confirm_write_approval'
  | 'write_workspace_file';

export const CUBIO_MCP_TOOLS: readonly CubioMcpToolName[] = Object.freeze([
  'list_agents',
  'get_agent_capabilities',
  'orchestrate_tasks',
  'discover_skills',
  'execute_skill',
  'submit_task',
  'get_task_status',
  'execute_task',
  'onboard_workspace',
  'inspect_workspace',
  'select_workspace',
  'list_workspaces',
  'authorize_workspace',
  'verify_path_containment',
  'request_write_approval',
  'confirm_write_approval',
  'write_workspace_file',
]);

export interface ListAgentsToolArgs {
  readonly statusFilter?: string;
}

export interface GetAgentCapabilitiesToolArgs {
  readonly agentId: string;
}

export interface OrchestrateTasksToolArgs {
  readonly orchestrationId: string;
  readonly objective: string;
  readonly subtasks: readonly {
    readonly subtaskId: string;
    readonly targetAgentId: string;
    readonly objective: string;
    readonly payload: Record<string, unknown>;
    readonly dependencies?: readonly string[];
    readonly timeoutMs?: number;
    readonly handoffBindings?: readonly {
      readonly sourceTaskId: string;
      readonly sourceAgentId: string;
      readonly outputKeyPath: string;
      readonly targetParameterKey?: string;
      readonly expectedSchemaRef?: string;
      readonly integritySha256?: string;
      readonly requiredPermission?: string;
    }[];
  }[];
  readonly overallTimeoutMs?: number;
}

export interface DiscoverSkillsToolArgs {
  readonly skillId?: string;
  readonly capability?: string;
}

export interface ExecuteSkillToolArgs {
  readonly skillId: string;
  readonly agentId: string;
  readonly input: Record<string, unknown>;
  readonly callerPermissions?: readonly string[];
}

export interface SubmitTaskToolArgs {
  readonly objective: string;
  readonly projectContext?: string;
  readonly relevantFiles?: readonly string[];
  readonly callerId?: string;
  readonly autoExecute?: boolean;
  readonly workspacePath?: string;
}

export interface GetTaskStatusToolArgs {
  readonly taskId: string;
}

export interface ExecuteTaskToolArgs {
  readonly taskId: string;
  readonly workspacePath?: string;
}

export interface OnboardWorkspaceToolArgs {
  readonly workspacePath: string;
  readonly label?: string;
}

export interface InspectWorkspaceToolArgs {
  readonly workspacePath?: string;
  readonly includeSubsystems?: boolean;
}

export interface SelectWorkspaceToolArgs {
  readonly workspaceIdOrPath: string;
}

export interface ListWorkspacesToolArgs {
  readonly detailed?: boolean;
}

export interface AuthorizeWorkspaceToolArgs {
  readonly workspacePath: string;
  readonly label?: string;
  readonly readOnly?: boolean;
  readonly allowedParentDirs?: readonly string[];
  readonly policy?: 'READ_ONLY' | 'REQUIRE_APPROVAL_TOKEN' | 'PERMITTED_IN_DISPOSABLE';
}

export interface VerifyPathContainmentToolArgs {
  readonly targetPath: string;
  readonly workspacePath?: string;
}

export interface RequestWriteApprovalToolArgs {
  readonly taskId: string;
  readonly targetFilePath: string;
  readonly content: string;
  readonly workspacePath?: string;
}

export interface ConfirmWriteApprovalToolArgs {
  readonly proposalId: string;
  readonly decision: 'APPROVE' | 'REJECT';
  readonly operatorId: string;
  readonly operatorAuthKey: string;
  readonly rationale?: string;
  readonly notes?: string;
}

export interface WriteWorkspaceFileToolArgs {
  readonly taskId: string;
  readonly targetFilePath: string;
  readonly content: string;
  readonly approvalToken?: string;
  readonly workspacePath?: string;
  readonly rationale?: string;
}
