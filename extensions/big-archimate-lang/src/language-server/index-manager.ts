import { AstNode, AstNodeDescription, DefaultIndexManager, URI } from 'langium';
import { SharedServices } from './module.js';
import { findSemanticRoot, SemanticRoot } from './util/ast-util.js';

export class IndexManager extends DefaultIndexManager {
   constructor(protected services: SharedServices) {
      super(services);
   }

   getElementById(globalId: string, type?: string): AstNodeDescription | undefined {
      return this.allElements().find(desc => desc.name === globalId && (!type || desc.type === type));
   }

   resolveElement(description?: AstNodeDescription): AstNode | undefined {
      if (!description) {
         return undefined;
      }
      const document = this.services.workspace.LangiumDocuments.getDocument(description.documentUri);
      return document
         ? this.serviceRegistry.getServices(document.uri).workspace.AstNodeLocator.getAstNode(document.parseResult.value, description.path)
         : undefined;
   }

   resolveElementById(globalId: string, type?: string): AstNode | undefined {
      return this.resolveElement(this.getElementById(globalId, type));
   }

   resolveSemanticElement(uri: URI): SemanticRoot | undefined {
      const document = this.services.workspace.LangiumDocuments.getDocument(uri);
      return document ? findSemanticRoot(document) : undefined;
   }
}
