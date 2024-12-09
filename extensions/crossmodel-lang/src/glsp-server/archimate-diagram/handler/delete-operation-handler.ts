/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Command, DeleteElementOperation, JsonOperationHandler, ModelState, remove } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ElementNode, RelationEdge, isElementNode, isRelationEdge } from '../../../language-server/generated/ast.js';
import { CrossModelCommand } from '../../common/cross-model-command.js';
import { ArchiMateModelState } from '../model/archimate-model-state.js';

@injectable()
export class ArchiMateDiagramDeleteOperationHandler extends JsonOperationHandler {
   operationType = DeleteElementOperation.KIND;

   @inject(ModelState) protected override modelState!: ArchiMateModelState;

   override createCommand(operation: DeleteElementOperation): Command | undefined {
      const deleteInfo = this.findElementsToDelete(operation);
      if (deleteInfo.nodes.length === 0 && deleteInfo.edges.length === 0) {
         return undefined;
      }
      return new CrossModelCommand(this.modelState, () => this.deleteElements(deleteInfo));
   }

   protected deleteElements(deleteInfo: DeleteInfo): void {
      const nodes = this.modelState.archiMateDiagram.nodes;
      remove(nodes, ...deleteInfo.nodes);

      const edges = this.modelState.archiMateDiagram.edges;
      remove(edges, ...deleteInfo.edges);
   }

   protected findElementsToDelete(operation: DeleteElementOperation): DeleteInfo {
      const deleteInfo: DeleteInfo = { edges: [], nodes: [] };

      for (const elementId of operation.elementIds) {
         const element = this.modelState.index.findSemanticElement(elementId, isDiagramElement);
         // simply remove any diagram nodes or edges from the diagram
         if (isElementNode(element)) {
            deleteInfo.nodes.push(element);
            deleteInfo.edges.push(
               ...this.modelState.archiMateDiagram.edges.filter(
                  edge => edge.sourceNode?.ref === element || edge.targetNode?.ref === element
               )
            );
         } else if (isRelationEdge(element)) {
            deleteInfo.edges.push(element);
         }
      }
      return deleteInfo;
   }
}

function isDiagramElement(item: unknown): item is RelationEdge | ElementNode {
   return isRelationEdge(item) || isElementNode(item);
}

interface DeleteInfo {
   nodes: ElementNode[];
   edges: RelationEdge[];
}
