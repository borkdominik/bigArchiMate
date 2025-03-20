import { DefaultLanguageServer } from 'langium/lsp';
import { TextDocumentSyncKind, type InitializeParams, type InitializeResult } from 'vscode-languageserver-protocol';

export class LanguageServer extends DefaultLanguageServer {
   override async initialize(params: InitializeParams): Promise<InitializeResult> {
      const result = await super.initialize(params);
      result.capabilities.textDocumentSync = TextDocumentSyncKind.Full;
      return result;
   }
}
