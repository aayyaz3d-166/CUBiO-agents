/**
 * CUBiO AI — Standalone Model Context Protocol (MCP) Server
 * Type Declarations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CubioMcpServerOptions } from './types.js';

export * from './types.js';
export * from './workspace/types.js';
export declare function createCubiOMcpServer(options?: CubioMcpServerOptions): Server;
export declare function runMcpStdioServer(options?: CubioMcpServerOptions): Promise<void>;
