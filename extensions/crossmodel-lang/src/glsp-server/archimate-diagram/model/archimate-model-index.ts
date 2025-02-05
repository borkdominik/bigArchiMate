/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/
import { injectable } from 'inversify';
import { AstNode } from 'langium';
import {
   Element,
   ElementNode,
   JunctionNode,
   Relation,
   RelationEdge,
   isElement,
   isElementNode,
   isJunctionNode,
   isRelation,
   isRelationEdge
} from '../../../language-server/generated/ast.js';
import { CrossModelIndex } from '../../common/cross-model-index.js';

@injectable()
export class ArchiMateModelIndex extends CrossModelIndex {
   findElement(id: string): Element | undefined {
      return this.findSemanticElement(id, isElement);
   }

   findJunction(id: string): Element | undefined {
      return this.findSemanticElement(id, isElement);
   }

   findRelation(id: string): Relation | undefined {
      return this.findSemanticElement(id, isRelation);
   }

   findElementNode(id: string): ElementNode | undefined {
      return this.findSemanticElement(id, isElementNode);
   }

   findJunctionNode(id: string): JunctionNode | undefined {
      return this.findSemanticElement(id, isJunctionNode);
   }

   findRelationEdge(id: string): RelationEdge | undefined {
      return this.findSemanticElement(id, isRelationEdge);
   }

   protected override indexAstNode(node: AstNode): void {
      super.indexAstNode(node);
      if (isElementNode(node)) {
         this.indexSemanticElement(`${this.createId(node)}_label`, node);
      }
   }
}
