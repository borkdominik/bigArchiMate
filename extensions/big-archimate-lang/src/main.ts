import 'reflect-metadata';

import { startLanguageServer } from 'langium/lsp';
import { NodeFileSystem } from 'langium/node';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node.js';
import { startGLSPServer } from './glsp-server/launch.js';
import { createServices } from './language-server/module.js';
import { startModelServer } from './model-server/launch.js';

/**
 * This module will be spawned as a separate language server process by the 'extension.ts'.
 * In the extension it is declared as 'server-main' (see webpack.config.js for the packaging).
 *
 * This module does the following:
 * - Establishing the connection with the language client that is running in the extension
 * - Create a Langium-based language server that fulfills the language server protocol based on that connection
 * - Create a Node-based GLSP server that can access the language server directly and runs on a dedicated port
 * - Create a RPC-based model server that exposes an API to access the Langium AST/semantic model on a dedicated port, e.g., for form-access
 */

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// Inject the shared services and language-specific services
const { shared, services } = createServices({ connection, ...NodeFileSystem });

// Start the language server with the shared services
startLanguageServer(shared);

shared.workspace.WorkspaceManager.onWorkspaceInitialized(workspaceFolders => {
   // Start the graphical language server with the shared services
   startGLSPServer({ shared, language: services }, workspaceFolders[0]);
   // Start the JSON server with the shared services
   startModelServer({ shared, language: services }, workspaceFolders[0]);
});
