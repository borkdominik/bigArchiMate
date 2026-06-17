import { AddElementOperation } from '@big-archimate/protocol';
import { Command, JsonOperationHandler, ModelState } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { DiagramNode, Element, ElementNode } from '../../../language-server/generated/ast.js';
import { findGroupingContaining } from '../../../language-server/util/ast-util.js';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

/**
 * An operation handler for the 'AddElementOperation' that resolves the referenced element by name
 * and places it in a new node on the diagram. When the position falls inside a grouping, the node
 * is placed as a child of that grouping with coordinates relative to the grouping's origin.
 */
@injectable()
export class AddElementOperationHandler extends JsonOperationHandler {
   override operationType = AddElementOperation.KIND;
   @inject(ModelState) protected override modelState!: ArchiMateModelState;

   createCommand(operation: AddElementOperation): Command {
      return new ArchiMateCommand(this.modelState, () => this.createElementNode(operation));
   }

   protected async createElementNode(operation: AddElementOperation): Promise<void> {
      const diagram = this.modelState.diagram;
      const scope = this.modelState.services.language.references.ScopeProvider.getCompletionScope({
         container: { globalId: diagram.id! },
         syntheticElements: [{ property: 'nodes', type: ElementNode }],
         property: 'element'
      });

      const elementDescription = scope.elementScope.getElement(operation.elementName);
      if (!elementDescription) {
         return;
      }

      const parentGrouping = findGroupingContaining(operation.position, diagram);
      const container = parentGrouping ?? diagram;
      const width = 200;
      const height = 50;
      const x = parentGrouping
         ? Math.max(0, Math.min(operation.position.x - parentGrouping.x, parentGrouping.width - width))
         : operation.position.x;
      const y = parentGrouping
         ? Math.max(0, Math.min(operation.position.y - parentGrouping.y, parentGrouping.height - height))
         : operation.position.y;

      const node: ElementNode = {
         $type: ElementNode,
         $container: container,
         id: this.modelState.idProvider.findNextId(ElementNode, elementDescription.name + 'Node', diagram),
         element: {
            $refText: elementDescription.name,
            ref: elementDescription.node as Element | undefined
         },
         x,
         y,
         width,
         height,
         children: []
      };

      if (parentGrouping) {
         (parentGrouping.children as DiagramNode[]).push(node);
      } else {
         diagram.nodes.push(node);
      }
   }
}
