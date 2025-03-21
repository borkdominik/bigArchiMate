import { AstNode, DefaultLinker, DocumentState, LangiumDocument } from 'langium';
import { isDiagram } from '../generated/ast.js';
import { hasSemanticRoot } from '../util/ast-util.js';

export class Linker extends DefaultLinker {
   override unlink(document: LangiumDocument<AstNode>): void {
      super.unlink(document);
      if (hasSemanticRoot(document, isDiagram)) {
         // we want to re-compute the implicit attributes for our nodes
         document.state = Math.min(document.state, DocumentState.IndexedContent);
      }
   }
}
