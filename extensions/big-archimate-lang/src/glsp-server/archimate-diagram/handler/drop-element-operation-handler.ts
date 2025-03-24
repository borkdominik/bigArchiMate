import { DropElementOperation } from '@big-archimate/protocol';
import { Command, JsonOperationHandler, ModelState } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { URI } from 'vscode-uri';
import { ElementNode } from '../../../language-server/generated/ast.js';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

/**
 * An operation handler for the 'DropElementOperation' that finds an element for each of the given file URIs and
 * creates a new node on the diagram for each of the found elements. If multiple elements are placed on the diagram
 * their position is shifted by (10,10) so they do not fully overlap.
 */
@injectable()
export class DropElementOperationHandler extends JsonOperationHandler {
   override operationType = DropElementOperation.KIND;

   @inject(ModelState) protected override modelState!: ArchiMateModelState;

   createCommand(operation: DropElementOperation): Command {
      return new ArchiMateCommand(this.modelState, () => this.createElementNode(operation));
   }

   protected async createElementNode(operation: DropElementOperation): Promise<void> {
      const container = this.modelState.diagram;
      let x = operation.position.x;
      let y = operation.position.y;
      for (const filePath of operation.filePaths) {
         const document = await this.modelState.modelService.request(URI.file(filePath).toString());
         const element = document?.root?.element;
         if (element) {
            // create node for element
            const node: ElementNode = {
               $type: ElementNode,
               $container: container,
               id: this.modelState.idProvider.findNextId(ElementNode, element.id + 'Node', this.modelState.diagram),
               element: {
                  $refText: this.modelState.idProvider.getGlobalId(element) || element.id || '',
                  ref: element
               },
               x: (x += 10),
               y: (y += 10),
               width: 200,
               height: 50
            };
            container.nodes.push(node);
         }
      }
   }
}
