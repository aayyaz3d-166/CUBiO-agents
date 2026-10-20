/**
 * CUBiO AI — Standalone Model Context Protocol (MCP) Build Runner
 * packages/cubio-mcp/build.mjs
 *
 * Compiles and bundles @cubio/mcp-server into dist/ using esbuild.
 */

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

console.log('[BUILD] Bundling @cubio/mcp-server via esbuild...');

// 1. Bundle ESM JavaScript (with fixed absWorkingDir for deterministic reproducibility)
const projectRoot = path.resolve(__dirname, '../..');
await esbuild.build({
  entryPoints: [path.resolve(__dirname, 'src/index.ts')],
  outfile: path.resolve(distDir, 'index.js'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  sourcemap: true,
  absWorkingDir: projectRoot,
  external: [
    '@modelcontextprotocol/sdk*',
    'node:*',
  ],
  banner: {
    js: '// CUBiO AI Sovereign MCP Server — Standalone Distribution\n',
  },
  logLevel: 'info',
});

console.log('[BUILD] Emitting TypeScript declaration files...');

// 2. Generate clean declaration files
const typesSrc = fs.readFileSync(path.resolve(__dirname, 'src/types.ts'), 'utf8');
// In ambient declaration files (.d.ts), initializers are not permitted (TS1039).
// Transform constant initializers to clean ambient declarations.
const typesDts = typesSrc.replace(
  /export const (\w+): (readonly \w+(?:\[\])?)\s*=\s*Object\.freeze\(\[[^\]]*\]\);/s,
  'export declare const $1: $2;'
);
fs.writeFileSync(path.resolve(distDir, 'types.d.ts'), typesDts, 'utf8');

const wsDistDir = path.resolve(distDir, 'workspace');
fs.mkdirSync(wsDistDir, { recursive: true });
const wsTypesPath = path.resolve(__dirname, '../../src/cubio/workspace/types.ts');
let wsTypesSrc = '';
if (fs.existsSync(wsTypesPath)) {
  wsTypesSrc = fs.readFileSync(wsTypesPath, 'utf8');
} else if (fs.existsSync(path.resolve(wsDistDir, 'types.d.ts'))) {
  wsTypesSrc = fs.readFileSync(path.resolve(wsDistDir, 'types.d.ts'), 'utf8');
} else {
  wsTypesSrc = '// CUBiO Sovereign Workspace Types\nexport * from "../types.js";\n';
}
fs.writeFileSync(path.resolve(wsDistDir, 'types.d.ts'), wsTypesSrc, 'utf8');
fs.writeFileSync(
  path.resolve(wsDistDir, 'index.d.ts'),
  `export * from './types.js';\nexport * from './projectDiscoveryEngine.js';\nexport * from './workspaceManager.js';\n`,
  'utf8'
);

const indexDts = `/**
 * CUBiO AI — Standalone Model Context Protocol (MCP) Server
 * Type Declarations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CubioMcpServerOptions } from './types.js';

export * from './types.js';
export * from './workspace/types.js';
export declare function createCubiOMcpServer(options?: CubioMcpServerOptions): Server;
export declare function runMcpStdioServer(options?: CubioMcpServerOptions): Promise<void>;
`;
fs.writeFileSync(path.resolve(distDir, 'index.d.ts'), indexDts, 'utf8');

console.log('[BUILD] Standalone MCP package build complete: dist/index.js & dist/index.d.ts generated.');
