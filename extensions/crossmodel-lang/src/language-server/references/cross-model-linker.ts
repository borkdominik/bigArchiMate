import { AstNode, DefaultLinker, DocumentState, LangiumDocument } from 'langium';
import { isArchiMateDiagram } from '../generated/ast.js';
import { hasSemanticRoot } from '../util/ast-util.js';

export class CrossModelLinker extends DefaultLinker {
   override unlink(document: LangiumDocument<AstNode>): void {
      super.unlink(document);
      if (hasSemanticRoot(document, isArchiMateDiagram)) {
         // we want to re-compute the implicit attributes for our nodes
         document.state = Math.min(document.state, DocumentState.IndexedContent);
      }
   }
}
