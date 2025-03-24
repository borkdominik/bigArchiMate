import { AddElementOperation } from '@big-archimate/protocol';
import { Command, JsonOperationHandler, ModelState } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { Element, ElementNode } from '../../../language-server/generated/ast.js';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

/**
 * An operation handler for the 'AddElementOperation' that resolves the referenced element by name
 * and places it in a new node on the diagram.
 */
@injectable()
export class AddElementOperationHandler extends JsonOperationHandler {
   override operationType = AddElementOperation.KIND;
   @inject(ModelState) protected override modelState!: ArchiMateModelState;

   createCommand(operation: AddElementOperation): Command {
      return new ArchiMateCommand(this.modelState, () => this.createElementNode(operation));
   }

   protected async createElementNode(operation: AddElementOperation): Promise<void> {
      const scope = this.modelState.services.language.references.ScopeProvider.getCompletionScope({
         container: { globalId: this.modelState.diagram.id! },
         syntheticElements: [{ property: 'nodes', type: ElementNode }],
         property: 'element'
      });

      const container = this.modelState.diagram;
      const elementDescription = scope.elementScope.getElement(operation.elementName);

      if (elementDescription) {
         const node: ElementNode = {
            $type: ElementNode,
            $container: container,
            id: this.modelState.idProvider.findNextId(ElementNode, elementDescription.name + 'Node', container),
            element: {
               $refText: elementDescription.name,
               ref: elementDescription.node as Element | undefined
            },
            x: operation.position.x,
            y: operation.position.y,
            width: 200,
            height: 50
         };
         container.nodes.push(node);
      }
   }
}
