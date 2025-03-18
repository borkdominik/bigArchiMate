import { Command, DeleteElementOperation, JsonOperationHandler, ModelState, remove } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {
   ElementNode,
   JunctionNode,
   RelationEdge,
   isElementNode,
   isJunctionNode,
   isRelationEdge
} from '../../../language-server/generated/ast.js';
import { CrossModelCommand } from '../../common/cross-model-command.js';
import { ArchiMateModelState } from '../model/archimate-model-state.js';

@injectable()
export class ArchiMateDiagramDeleteOperationHandler extends JsonOperationHandler {
   operationType = DeleteElementOperation.KIND;

   @inject(ModelState) protected override modelState!: ArchiMateModelState;

   override createCommand(operation: DeleteElementOperation): Command | undefined {
      const deleteInfo = this.findComponentsToRemove(operation);
      if (deleteInfo.nodes.length === 0 && deleteInfo.edges.length === 0) {
         return undefined;
      }
      return new CrossModelCommand(this.modelState, () => this.removeComponents(deleteInfo));
   }

   protected removeComponents(deleteInfo: DeleteInfo): void {
      const nodes = this.modelState.archiMateDiagram.nodes;
      remove(nodes, ...deleteInfo.nodes);

      const edges = this.modelState.archiMateDiagram.edges;
      remove(edges, ...deleteInfo.edges);
   }

   protected findComponentsToRemove(operation: DeleteElementOperation): DeleteInfo {
      const deleteInfo: DeleteInfo = { edges: [], nodes: [] };

      for (const elementId of operation.elementIds) {
         const diagramComponent = this.modelState.index.findSemanticElement(elementId, isDiagramComponent);
         // simply remove any diagram nodes or edges from the diagram
         if (isElementNode(diagramComponent) || isJunctionNode(diagramComponent)) {
            deleteInfo.nodes.push(diagramComponent);
            deleteInfo.edges.push(
               ...this.modelState.archiMateDiagram.edges.filter(
                  edge => edge.sourceNode?.ref === diagramComponent || edge.targetNode?.ref === diagramComponent
               )
            );
         } else if (isRelationEdge(diagramComponent)) {
            deleteInfo.edges.push(diagramComponent);
         }
      }
      return deleteInfo;
   }
}

function isDiagramComponent(item: unknown): item is RelationEdge | ElementNode | JunctionNode {
   return isRelationEdge(item) || isElementNode(item) || isJunctionNode(item);
}

interface DeleteInfo {
   nodes: (ElementNode | JunctionNode)[];
   edges: RelationEdge[];
}
