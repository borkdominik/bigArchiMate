import { Command, DeleteElementOperation, JsonOperationHandler, ModelState, remove } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {
   ElementNode,
   JunctionNode,
   RelationshipEdge,
   isElementNode,
   isJunctionNode,
   isRelationshipEdge
} from '../../../language-server/generated/ast.js';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

@injectable()
export class DeleteOperationHandler extends JsonOperationHandler {
   operationType = DeleteElementOperation.KIND;

   @inject(ModelState) protected override modelState!: ArchiMateModelState;

   override createCommand(operation: DeleteElementOperation): Command | undefined {
      const deleteInfo = this.findComponentsToRemove(operation);
      if (deleteInfo.nodes.length === 0 && deleteInfo.edges.length === 0) {
         return undefined;
      }
      return new ArchiMateCommand(this.modelState, () => this.removeComponents(deleteInfo));
   }

   protected removeComponents(deleteInfo: DeleteInfo): void {
      const nodes = this.modelState.diagram.nodes;
      remove(nodes, ...deleteInfo.nodes);

      const edges = this.modelState.diagram.edges;
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
               ...this.modelState.diagram.edges.filter(
                  edge => edge.sourceNode?.ref === diagramComponent || edge.targetNode?.ref === diagramComponent
               )
            );
         } else if (isRelationshipEdge(diagramComponent)) {
            deleteInfo.edges.push(diagramComponent);
         }
      }
      return deleteInfo;
   }
}

function isDiagramComponent(item: unknown): item is RelationshipEdge | ElementNode | JunctionNode {
   return isRelationshipEdge(item) || isElementNode(item) || isJunctionNode(item);
}

interface DeleteInfo {
   nodes: (ElementNode | JunctionNode)[];
   edges: RelationshipEdge[];
}
