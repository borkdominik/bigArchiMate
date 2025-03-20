import { AstNode } from 'langium';
import { AbstractSemanticTokenProvider, SemanticTokenAcceptor } from 'langium/lsp';
import { SemanticTokenTypes } from 'vscode-languageserver';
import { isElement } from './generated/ast.js';

export class SemanticTokenProvider extends AbstractSemanticTokenProvider {
   protected override highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void {
      if (isElement(node)) {
         acceptor({
            node,
            property: 'id',
            type: SemanticTokenTypes.string
         });
      }
   }
}
