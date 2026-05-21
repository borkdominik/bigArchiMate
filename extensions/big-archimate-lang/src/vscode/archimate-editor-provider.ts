import { GlspEditorProvider, GlspVscodeConnector } from '@eclipse-glsp/vscode-integration';
import * as vscode from 'vscode';

export class ArchiMateEditorProvider extends GlspEditorProvider {
   diagramType = 'archimate-view';

   constructor(
      protected readonly extensionContext: vscode.ExtensionContext,
      protected override readonly glspVscodeConnector: GlspVscodeConnector
   ) {
      super(glspVscodeConnector);
   }

   setUpWebview(
      _document: vscode.CustomDocument,
      webviewPanel: vscode.WebviewPanel,
      _token: vscode.CancellationToken,
      clientId: string
   ): void {
      const webview = webviewPanel.webview;
      const extensionUri = this.extensionContext.extensionUri;
      const webviewScriptSourceUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'out', 'webview.js'));

      webview.options = {
         enableScripts: true
      };

      webview.html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, height=device-height">
                    <meta http-equiv="Content-Security-Policy" content="
                        default-src ${webview.cspSource} 'unsafe-inline' 'unsafe-eval';
                        img-src ${webview.cspSource} blob: data:;
                    ">
                </head>
                <body>
                    <div id="${clientId}_container" style="height: 100%;"></div>
                    <script src="${webviewScriptSourceUri}"></script>
                </body>
            </html>`;
   }
}
