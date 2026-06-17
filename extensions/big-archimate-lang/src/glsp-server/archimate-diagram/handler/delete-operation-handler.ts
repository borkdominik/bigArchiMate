import { Command, DeleteElementOperation, JsonOperationHandler, ModelState, remove } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {
   DiagramNode,
   ElementNode,
   JunctionNode,
   RelationEdge,
   isElementNode,
   isJunctionNode,
   isRelationEdge
} from '../../../language-server/generated/ast.js';
import { isGroupingNode } from '../../../language-server/util/ast-util.js';
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
      const diagram = this.modelState.diagram;
      for (const node of deleteInfo.nodes) {
         const container = node.$container;
         if (isElementNode(container)) {
            remove(container.children as DiagramNode[], node);
         } else {
            remove(diagram.nodes, node);
         }
      }
      remove(diagram.edges, ...deleteInfo.edges);
   }

   protected findComponentsToRemove(operation: DeleteElementOperation): DeleteInfo {
      const deleteInfo: DeleteInfo = { edges: [], nodes: [] };

      for (const elementId of operation.elementIds) {
         const diagramComponent = this.modelState.index.findSemanticElement(elementId, isDiagramComponent);
         if (isElementNode(diagramComponent) || isJunctionNode(diagramComponent)) {
            deleteInfo.nodes.push(diagramComponent);
            deleteInfo.edges.push(...this.edgesConnectedTo(diagramComponent));
            // When deleting a grouping, also clean up edges connected to its children.
            if (isElementNode(diagramComponent) && isGroupingNode(diagramComponent)) {
               for (const child of diagramComponent.children) {
                  deleteInfo.edges.push(...this.edgesConnectedTo(child));
               }
            }
         } else if (isRelationEdge(diagramComponent)) {
            deleteInfo.edges.push(diagramComponent);
         }
      }
      return deleteInfo;
   }

   private edgesConnectedTo(node: DiagramNode): RelationEdge[] {
      return this.modelState.diagram.edges.filter(edge => edge.sourceNode?.ref === node || edge.targetNode?.ref === node);
   }
}

function isDiagramComponent(item: unknown): item is RelationEdge | ElementNode | JunctionNode {
   return isRelationEdge(item) || isElementNode(item) || isJunctionNode(item);
}

interface DeleteInfo {
   nodes: (ElementNode | JunctionNode)[];
   edges: RelationEdge[];
}
