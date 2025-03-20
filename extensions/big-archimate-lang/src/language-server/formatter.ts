import { AstNode } from 'langium';
import { AbstractFormatter } from 'langium/lsp';

export class Formatter extends AbstractFormatter {
   protected format(node: AstNode): void {
      return;
   }
}
