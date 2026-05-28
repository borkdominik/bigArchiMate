import {
   ActionDispatcher,
   ChangeBoundsOperation,
   Command,
   Dimension,
   JsonOperationHandler,
   MessageAction,
   ModelState,
   Point
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { DiagramNode, ElementNode, JunctionNode, isElementNode } from '../../../language-server/generated/ast.js';
import {
   findGroupingContaining,
   getAbsolutePosition,
   getParentElementNode,
   isGroupingNode
} from '../../../language-server/util/ast-util.js';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

@injectable()
export class ChangeBoundsOperationHandler extends JsonOperationHandler {
   operationType = ChangeBoundsOperation.KIND;
   @inject(ModelState) protected override modelState!: ArchiMateModelState;
   @inject(ActionDispatcher) protected actionDispatcher!: ActionDispatcher;

   createCommand(operation: ChangeBoundsOperation): Command {
      return new ArchiMateCommand(this.modelState, () => this.changeBounds(operation));
   }

   protected async changeBounds(operation: ChangeBoundsOperation): Promise<void> {
      const { nodeTargets, movingInto, movingOut } = this.buildMovingSets(operation);

      for (const elementAndBounds of operation.newBounds) {
         const node =
            this.modelState.index.findElementNode(elementAndBounds.elementId) ??
            this.modelState.index.findJunctionNode(elementAndBounds.elementId);
         if (!node || !elementAndBounds.newPosition) {
            continue;
         }

         const newAbsPos = elementAndBounds.newPosition;
         const newSize = elementAndBounds.newSize;

         // Reparent non-grouping nodes when dragged into or out of a grouping.
         // Groupings themselves are excluded — nested groupings are not supported.
         if (!(isElementNode(node) && isGroupingNode(node))) {
            const targetGrouping = nodeTargets.get(node) ?? undefined;
            const currentGrouping = getParentElementNode(node);

            if (targetGrouping !== currentGrouping) {
               if (targetGrouping && this.hasCrossBoundaryEdges(node, targetGrouping, movingInto.get(targetGrouping))) {
                  await this.actionDispatcher.dispatch(
                     MessageAction.create('Cannot place element inside grouping: it has connections to elements outside the grouping.', {
                        severity: 'WARNING'
                     })
                  );
                  continue;
               }
               if (!targetGrouping && currentGrouping && this.hasInternalEdges(node, currentGrouping, movingOut.get(currentGrouping))) {
                  await this.actionDispatcher.dispatch(
                     MessageAction.create('Cannot remove element from grouping: it has connections to elements inside the grouping.', {
                        severity: 'WARNING'
                     })
                  );
                  continue;
               }
            }
            this.reparentIfNeeded(node, newAbsPos, newSize);
         }

         // Store coordinates relative to the parent grouping, or absolute when at diagram level.
         const parent = getParentElementNode(node);
         if (parent) {
            const parentAbsPos = getAbsolutePosition(parent);
            const relX = newAbsPos.x - parentAbsPos.x;
            const relY = newAbsPos.y - parentAbsPos.y;
            // Clamp so the element body stays fully within the grouping bounds.
            node.x = Math.max(0, Math.min(relX, parent.width - newSize.width));
            node.y = Math.max(0, Math.min(relY, parent.height - newSize.height));
         } else {
            node.x = newAbsPos.x;
            node.y = newAbsPos.y;
         }
         node.width = newSize.width;
         node.height = newSize.height;
      }

      await this.updateContainmentForChangedGroupings(operation);
   }

   /**
    * After all grouping positions/sizes are committed, re-evaluates containment for every
    * non-grouping node not already processed by the operation: adopts those whose center
    * now falls inside a grouping, releases those whose center no longer does.
    */
   protected async updateContainmentForChangedGroupings(operation: ChangeBoundsOperation): Promise<void> {
      const diagram = this.modelState.diagram;

      const processedNodes = new Set<DiagramNode>();
      for (const eb of operation.newBounds) {
         const node = this.modelState.index.findElementNode(eb.elementId) ?? this.modelState.index.findJunctionNode(eb.elementId);
         if (node) {
            processedNodes.add(node);
         }
      }

      for (const eb of operation.newBounds) {
         const grouping = this.modelState.index.findElementNode(eb.elementId);
         if (!grouping || !isGroupingNode(grouping)) {
            continue;
         }

         const candidates = [
            ...(diagram.nodes as DiagramNode[]).filter(n => !processedNodes.has(n) && !(isElementNode(n) && isGroupingNode(n))),
            ...(grouping.children as DiagramNode[]).filter(n => !processedNodes.has(n))
         ] as (ElementNode | JunctionNode)[];

         for (const node of candidates) {
            const currentParent = getParentElementNode(node);
            const absPos: Point = currentParent ? { x: currentParent.x + node.x, y: currentParent.y + node.y } : { x: node.x, y: node.y };
            const size: Dimension = { width: node.width, height: node.height };
            const center: Point = { x: absPos.x + size.width / 2, y: absPos.y + size.height / 2 };
            const newParent = findGroupingContaining(center, diagram);

            if (newParent === currentParent) {
               continue;
            }

            if (newParent && this.hasCrossBoundaryEdges(node, newParent, undefined)) {
               await this.actionDispatcher.dispatch(
                  MessageAction.create('Cannot place element inside grouping: it has connections to elements outside the grouping.', {
                     severity: 'WARNING'
                  })
               );
               continue;
            }
            if (!newParent && currentParent && this.hasInternalEdges(node, currentParent, undefined)) {
               await this.actionDispatcher.dispatch(
                  MessageAction.create('Cannot remove element from grouping: it has connections to elements inside the grouping.', {
                     severity: 'WARNING'
                  })
               );
               continue;
            }

            this.reparentIfNeeded(node, absPos, size);

            if (newParent) {
               node.x = absPos.x - newParent.x;
               node.y = absPos.y - newParent.y;
            } else {
               node.x = absPos.x;
               node.y = absPos.y;
            }
         }
      }
   }

   /**
    * Pre-processes all bounds entries to determine, for each non-grouping node:
    * - nodeTargets: which grouping (or null = diagram root) each node will land in
    * - movingInto:  per target grouping, all nodes moving into it in this operation
    * - movingOut:   per current grouping, all nodes moving out of it in this operation
    */
   protected buildMovingSets(operation: ChangeBoundsOperation): {
      nodeTargets: Map<ElementNode | JunctionNode, ElementNode | undefined>;
      movingInto: Map<ElementNode, Set<DiagramNode>>;
      movingOut: Map<ElementNode, Set<DiagramNode>>;
   } {
      const nodeTargets = new Map<ElementNode | JunctionNode, ElementNode | undefined>();
      const movingInto = new Map<ElementNode, Set<DiagramNode>>();
      const movingOut = new Map<ElementNode, Set<DiagramNode>>();

      for (const elementAndBounds of operation.newBounds) {
         if (!elementAndBounds.newPosition) {
            continue;
         }
         const node =
            this.modelState.index.findElementNode(elementAndBounds.elementId) ??
            this.modelState.index.findJunctionNode(elementAndBounds.elementId);
         if (!node || (isElementNode(node) && isGroupingNode(node))) {
            continue;
         }

         const { newPosition: pos, newSize: size } = elementAndBounds;
         const center = { x: pos.x + size.width / 2, y: pos.y + size.height / 2 };
         const target = findGroupingContaining(center, this.modelState.diagram);
         const current = getParentElementNode(node);

         nodeTargets.set(node, target);

         if (target !== current) {
            if (target) {
               if (!movingInto.has(target)) {
                  movingInto.set(target, new Set());
               }
               movingInto.get(target)!.add(node);
            }
            if (current) {
               if (!movingOut.has(current)) {
                  movingOut.set(current, new Set());
               }
               movingOut.get(current)!.add(node);
            }
         }
      }

      return { nodeTargets, movingInto, movingOut };
   }

   /**
    * Moves the node into the grouping whose bounds contain the element's center point,
    * or promotes it back to the diagram root when dragged outside every grouping.
    * Updates both the containment array and the $container link so that subsequent
    * AST traversals (getParentElementNode, getAbsolutePosition) remain correct.
    */
   protected reparentIfNeeded(node: ElementNode | JunctionNode, newAbsPos: Point, newSize: Dimension): void {
      const diagram = this.modelState.diagram;
      const currentParent = getParentElementNode(node);
      const center: Point = { x: newAbsPos.x + newSize.width / 2, y: newAbsPos.y + newSize.height / 2 };
      const newParent = findGroupingContaining(center, this.modelState.diagram);

      if (currentParent === newParent) {
         return;
      }

      // Remove from current container.
      if (currentParent) {
         const idx = currentParent.children.indexOf(node);
         if (idx >= 0) {
            (currentParent.children as DiagramNode[]).splice(idx, 1);
         }
      } else {
         const idx = diagram.nodes.indexOf(node);
         if (idx >= 0) {
            (diagram.nodes as DiagramNode[]).splice(idx, 1);
         }
      }

      // Add to new container and repair the $container link.
      if (newParent) {
         (newParent.children as DiagramNode[]).push(node);
         (node as any).$container = newParent;
      } else {
         (diagram.nodes as DiagramNode[]).push(node);
         (node as any).$container = diagram;
      }
   }

   /**
    * Returns true if moving the node into targetGrouping would create cross-boundary edges.
    * Nodes in alsoMovingIn are treated as already inside the grouping (co-moved in same operation).
    */
   protected hasCrossBoundaryEdges(
      node: ElementNode | JunctionNode,
      targetGrouping: ElementNode,
      alsoMovingIn: Set<DiagramNode> | undefined
   ): boolean {
      const insideAfterMove = new Set<DiagramNode>([...targetGrouping.children, ...(alsoMovingIn ?? [])]);
      for (const edge of this.modelState.diagram.edges) {
         const src = edge.sourceNode?.ref;
         const tgt = edge.targetNode?.ref;
         const other = src === node ? tgt : tgt === node ? src : undefined;
         if (other !== undefined && !insideAfterMove.has(other)) {
            return true;
         }
      }
      return false;
   }

   /**
    * Returns true if removing the node from currentGrouping would create cross-boundary edges.
    * Nodes in alsoMovingOut are treated as already outside the grouping (co-moved in same operation).
    */
   protected hasInternalEdges(
      node: ElementNode | JunctionNode,
      currentGrouping: ElementNode,
      alsoMovingOut: Set<DiagramNode> | undefined
   ): boolean {
      const remainingInGrouping = new Set<DiagramNode>(
         [...currentGrouping.children].filter(child => !(alsoMovingOut ?? new Set()).has(child))
      );
      for (const edge of this.modelState.diagram.edges) {
         const src = edge.sourceNode?.ref;
         const tgt = edge.targetNode?.ref;
         const other = src === node ? tgt : tgt === node ? src : undefined;
         if (other !== undefined && remainingInGrouping.has(other)) {
            return true;
         }
      }
      return false;
   }
}
