import { GLSP_PORT_COMMAND, LanguageExtensionChannelName, MODELSERVER_PORT_COMMAND } from '@big-archimate/protocol';
import { GlspVscodeConnector } from '@eclipse-glsp/vscode-integration';
import { GlspMcpServerProvider, SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration/node.js';
import * as path from 'path';
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node.js';
import { ArchiMateEditorProvider } from './vscode/archimate-editor-provider.js';

let client: LanguageClient | undefined;
let glspServer: SocketGlspVscodeServer | undefined;

// This function is called when the extension is activated.
export async function activate(context: vscode.ExtensionContext): Promise<void> {
   const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
   if (!workspacePath) {
      // if no workspace is open, we do not need to start our servers
      return;
   }
   client = launchLanguageClient(context);
   await registerGlspDiagramEditor(context, client);
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
   glspServer?.dispose();
   return client?.stop();
}

let languageClientReady: Promise<void> | undefined;

function launchLanguageClient(context: vscode.ExtensionContext): LanguageClient {
   const serverOptions: ServerOptions = createServerOptions(context);
   const clientOptions: LanguageClientOptions = createClientOptions(context);

   // Start the client. This will also launch the server
   const languageClient = new LanguageClient('big-archimate', LanguageExtensionChannelName, serverOptions, clientOptions);
   languageClientReady = languageClient.start();
   vscode.commands.registerCommand(MODELSERVER_PORT_COMMAND, () => languageClient.sendRequest(MODELSERVER_PORT_COMMAND));
   vscode.commands.registerCommand(GLSP_PORT_COMMAND, () => languageClient.sendRequest(GLSP_PORT_COMMAND));
   return languageClient;
}

/**
 * Wires the GLSP diagram editor and the MCP bridge alongside the existing LSP client.
 *
 * The lang ext's `main.ts` already launches the GLSP server as a child of the LSP host; its port
 * is exposed via the {@link GLSP_PORT_COMMAND} request. We reuse that to connect the VS Code-side
 * GLSP client wrapper, then register the custom editor for `.arch` and bridge the embedded GLSP
 * MCP server into VS Code's built-in MCP host (requires VS Code 1.99+).
 */
async function registerGlspDiagramEditor(context: vscode.ExtensionContext, languageClient: LanguageClient): Promise<void> {
   // The VS Code-side GLSP custom editor + MCP bridge depend on the `vscode.lm` (Language Models)
   // namespace introduced in VS Code 1.99. Theia's VS Code API shim does not yet expose it, so
   // skip the wiring there — the Theia path uses @big-archimate/glsp-client directly.
   if (typeof vscode.lm?.registerMcpServerDefinitionProvider !== 'function') {
      return;
   }
   await languageClientReady;
   const port = await languageClient.sendRequest<number | undefined>(GLSP_PORT_COMMAND).catch(() => undefined);
   if (!port) {
      console.warn('[bigArchiMate] GLSP server did not report a port; skipping GLSP/MCP integration.');
      return;
   }

   // Presence of `mcpServer` (even an empty `{}`) opts the GLSP server into starting an embedded
   // MCP HTTP server. The `name` matches the `mcpServerDefinitionProviders` id below.
   const mcpServer = { name: 'glsp-archimate' };
   glspServer = new SocketGlspVscodeServer({
      clientId: 'glsp.archimate',
      clientName: 'archimate',
      connectionOptions: { port },
      mcpServer
   });

   const connector = new GlspVscodeConnector({ server: glspServer, logging: true });

   const editorProvider = vscode.window.registerCustomEditorProvider(
      'archimate.glspDiagram',
      new ArchiMateEditorProvider(context, connector),
      { webviewOptions: { retainContextWhenHidden: true }, supportsMultipleEditorsPerDocument: false }
   );

   const mcpProvider = new GlspMcpServerProvider();
   const mcpRegistration = vscode.lm.registerMcpServerDefinitionProvider(mcpServer.name, mcpProvider);

   context.subscriptions.push(glspServer, connector, editorProvider, mcpProvider, mcpRegistration);

   // Block activation until the MCP server entry is in the provider. VS Code's MCP host queries
   // mcpServerDefinitionProviders right after activate() resolves; without this await, the first
   // query returns an empty list and some chat extensions cache that, surfacing as a stale
   // tool reference until the user retries.
   glspServer.start();
   try {
      const result = await withTimeout(glspServer.initializeResult, 10_000);
      const server = mcpProvider.addServer(result);
      if (server) {
         notifyMcpConnected(server.name, server.url);
      }
   } catch (err) {
      console.warn('[bigArchiMate] GLSP initialize did not complete in time; MCP bridge not registered:', err);
   }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
   let timer: NodeJS.Timeout | undefined;
   const timeout = new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms);
   });
   return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/** Info notification with a `Copy URL` action; stays until the user dismisses it. */
function notifyMcpConnected(name: string, url: string): void {
   const COPY_URL_ACTION = 'Copy URL';
   vscode.window.showInformationMessage(`MCP server '${name}' auto-registered at ${url}`, COPY_URL_ACTION).then(action => {
      if (action === COPY_URL_ACTION) {
         vscode.env.clipboard.writeText(url);
      }
   });
}

function createServerOptions(context: vscode.ExtensionContext): ServerOptions {
   // needs to match the configuration in tsconfig.json and webpack.config.js
   const serverModule = context.asAbsolutePath(path.join('out', 'main.cjs'));
   // The debug options for the server
   // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
   // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
   const debugOptions = {
      execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`]
   };

   // If the extension is launched in debug mode then the debug server options are used
   // Otherwise the run options are used
   return {
      run: { module: serverModule, transport: TransportKind.ipc },
      debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
   };
}

function createClientOptions(context: vscode.ExtensionContext): LanguageClientOptions {
   const archiMateModelWatcher = vscode.workspace.createFileSystemWatcher('**/*.arch');
   context.subscriptions.push(archiMateModelWatcher);

   // watch changes to package.json as it contains the dependencies between our systems
   const packageWatcher = vscode.workspace.createFileSystemWatcher('**/package.json');
   context.subscriptions.push(packageWatcher);

   // we listen to directories separately as when we import a library, e.g., a directory within node_modules,
   // we only get that notification but not for nested files
   const directoryWatcher = vscode.workspace.createFileSystemWatcher('**/*/');
   context.subscriptions.push(directoryWatcher);

   // Options to control the language client
   return {
      documentSelector: [
         { scheme: 'file', language: 'archimate' },
         { scheme: 'file', pattern: '**/package.json' }
      ],
      synchronize: {
         // Notify the server about file changes to files contained in the workspace
         fileEvents: [archiMateModelWatcher, packageWatcher, directoryWatcher]
      }
   };
}
