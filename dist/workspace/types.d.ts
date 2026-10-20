/**
 * CUBiO AI — 3D Memory Studio
 * src/cubio/workspace/types.ts
 *
 * Authoritative type definitions for Generalized External Project Discovery,
 * Onboarding, Language Analysis, Architecture Topology, and Test Detection.
 */

export type ProjectManifestType =
  | 'NODE_PACKAGE_JSON'
  | 'PYTHON_PYPROJECT'
  | 'PYTHON_SETUP_PY'
  | 'PYTHON_REQUIREMENTS'
  | 'RUST_CARGO'
  | 'GO_MOD'
  | 'WEB_INDEX_HTML'
  | 'WEB_CONFIG'
  | 'DOCKERFILE'
  | 'MAKEFILE'
  | 'UNKNOWN';

export interface ManifestInfo {
  readonly type: ProjectManifestType;
  readonly path: string;
  readonly relativePath: string;
  readonly isValid: boolean;
  readonly parseError?: string;
  readonly contentSummary?: Record<string, unknown>;
}

export type SupportedLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'rust'
  | 'go'
  | 'html'
  | 'css'
  | 'c'
  | 'cpp'
  | 'java'
  | 'shell'
  | 'json'
  | 'yaml'
  | 'markdown'
  | 'unsupported';

export interface DetectedLanguageBreakdown {
  readonly language: SupportedLanguage;
  readonly fileCount: number;
  readonly percentage: number;
}

export interface LanguageDetectionResult {
  readonly primaryLanguage: SupportedLanguage;
  readonly detectedLanguages: readonly DetectedLanguageBreakdown[];
  readonly totalSourceFiles: number;
}

export interface EntryPointInfo {
  readonly path: string;
  readonly relativePath: string;
  readonly language: SupportedLanguage;
  readonly role: 'application_entry' | 'library_entry' | 'cli_entry' | 'web_index' | 'test_entry';
}

export type ArchitectureStyle =
  | 'NODE_APPLICATION'
  | 'NODE_LIBRARY'
  | 'PYTHON_APPLICATION'
  | 'PYTHON_PACKAGE'
  | 'RUST_BINARY'
  | 'RUST_LIBRARY'
  | 'GO_SERVICE'
  | 'GO_MODULE'
  | 'WEB_APPLICATION'
  | 'WEB_STATIC'
  | 'MONOREPO'
  | 'MULTI_LANGUAGE'
  | 'EMPTY_PROJECT'
  | 'UNSUPPORTED_PROJECT_TYPE'
  | 'GENERIC_SOURCE_TREE';

export interface DynamicSubsystem {
  readonly id: string;
  readonly name: string;
  readonly primaryDir: string;
  readonly keyFiles: readonly string[];
  readonly tests: readonly string[];
  readonly keywords: readonly string[];
  readonly fileCount: number;
}

export interface TestCommandInfo {
  readonly framework?: string;
  readonly testCommand?: string;
  readonly testFilesPattern?: string;
  readonly detectedTestFileCount: number;
  readonly isSupported: boolean;
  readonly notes?: string;
}

export interface ProjectSupportVerdict {
  readonly isSupported: boolean;
  readonly explanation: string;
  readonly detectedFeatures: readonly string[];
  readonly unsupportedFeatures: readonly string[];
  readonly recommendations: readonly string[];
}

export interface ProjectDiscoveryProfile {
  readonly workspaceRoot: string;
  readonly workspaceName: string;
  readonly scanTimestamp: string;
  readonly architectureStyle: ArchitectureStyle;
  readonly manifests: readonly ManifestInfo[];
  readonly languages: LanguageDetectionResult;
  readonly entryPoints: readonly EntryPointInfo[];
  readonly subsystems: readonly DynamicSubsystem[];
  readonly testInfo: TestCommandInfo;
  readonly supportVerdict: ProjectSupportVerdict;
}

export interface AuthorizedWorkspace {
  readonly workspaceId: string;
  readonly canonicalPath: string;
  readonly label: string;
  readonly authorizedAt: string;
  readonly lastInspectedAt?: string;
  readonly profile?: ProjectDiscoveryProfile;
  readonly isActive: boolean;
  readonly readOnly: boolean;
  readonly securityConfig: WorkspaceSecurityConfig;
}

export type WorkspaceWritePolicy =
  | 'READ_ONLY'
  | 'REQUIRE_APPROVAL_TOKEN'
  | 'PERMITTED_IN_DISPOSABLE';

export interface WorkspaceSecurityConfig {
  readonly policy: WorkspaceWritePolicy;
  readonly allowedParentDirs?: readonly string[];
  readonly blockedPatterns?: readonly string[];
  readonly allowSymlinks?: boolean;
}

export interface WorkspaceAuthorizationOptions {
  readonly label?: string;
  readonly allowedParentDirs?: readonly string[];
  readonly readOnly?: boolean;
  readonly policy?: WorkspaceWritePolicy;
}

export type ContainmentViolationType =
  | 'PATH_TRAVERSAL_DETECTED'
  | 'NULL_BYTE_INJECTION'
  | 'ROOT_ESCAPE_DETECTED'
  | 'SYMLINK_ESCAPE_DETECTED'
  | 'JUNCTION_ESCAPE_DETECTED'
  | 'PROTECTED_AUTHORITY_TAMPER'
  | 'OUTSIDE_ALLOWED_PARENT'
  | 'SYSTEM_DIRECTORY_ACCESS';

export interface PathValidationResult {
  readonly isValid: boolean;
  readonly canonicalPath?: string;
  readonly relativePath?: string;
  readonly violationType?: ContainmentViolationType;
  readonly reason?: string;
}

export interface ControlledWriteRequest {
  readonly taskId: string;
  readonly targetFilePath: string;
  readonly content: string;
  readonly approvalToken?: string;
  readonly rationale?: string;
}

export interface WorkspaceWriteResult {
  readonly success: boolean;
  readonly canonicalPath?: string;
  readonly relativePath?: string;
  readonly bytesWritten: number;
  readonly sha256?: string;
  readonly status: 'APPLIED_AND_VERIFIED' | 'REJECTED' | 'APPROVAL_REQUIRED' | 'FAILED';
  readonly approvalRequired?: boolean;
  readonly approvalAction?: string;
  readonly approvalTokenExpected?: string;
  readonly errorMessage?: string;
}

export interface WriteApprovalProposal {
  readonly proposalId: string;
  readonly taskId: string;
  readonly targetFilePath: string;
  readonly relativePath: string;
  readonly contentSha256: string;
  readonly requestedAt: number;
  readonly workspaceId?: string;
  readonly approvalAction: string;
  readonly requiresConfirmation: boolean;
  readonly status: 'PENDING_HUMAN_APPROVAL' | 'APPROVED' | 'REJECTED';
  readonly message?: string;
}

export interface ConfirmWriteApprovalRequest {
  readonly proposalId: string;
  readonly decision: 'APPROVE' | 'REJECT';
  readonly operatorId?: string;
  readonly operatorAuthKey?: string;
  readonly rationale?: string;
  readonly notes?: string;
}

export interface ConfirmWriteApprovalResult {
  readonly success: boolean;
  readonly status:
    | 'APPROVED'
    | 'REJECTED_BY_OPERATOR'
    | 'REJECTED_UNAUTHORIZED_OPERATOR'
    | 'PROPOSAL_NOT_FOUND'
    | 'PROPOSAL_EXPIRED';
  readonly proposalId: string;
  readonly approvalToken?: string;
  readonly expiresInSeconds?: number;
  readonly message?: string;
}

