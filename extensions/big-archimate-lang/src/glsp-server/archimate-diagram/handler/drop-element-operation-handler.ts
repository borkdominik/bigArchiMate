import { DropElementOperation } from '@big-archimate/protocol';
import { Command, JsonOperationHandler, ModelState } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { URI } from 'vscode-uri';
import { Diagram, DiagramNode, ElementNode, JunctionNode } from '../../../language-server/generated/ast.js';
import { findGroupingContaining } from '../../../language-server/util/ast-util.js';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

const JUNCTION_SIZE = 25;

/**
 * An operation handler for the 'DropElementOperation' that finds an element for each of the given file URIs and
 * creates a new node on the diagram for each of the found elements. If multiple elements are placed on the diagram
 * their position is shifted by (10,10) so they do not fully overlap.
 * When the drop position falls inside a grouping, the new node is placed as a child of that grouping
 * with coordinates relative to the grouping's origin.
 */
@injectable()
export class DropElementOperationHandler extends JsonOperationHandler {
   override operationType = DropElementOperation.KIND;

   @inject(ModelState) protected override modelState!: ArchiMateModelState;

   createCommand(operation: DropElementOperation): Command {
      return new ArchiMateCommand(this.modelState, () => this.createElementNode(operation));
   }

   protected async createElementNode(operation: DropElementOperation): Promise<void> {
      const diagram = this.modelState.diagram;
      const grouping = findGroupingContaining(operation.position, diagram);
      const container: Diagram | ElementNode = grouping ?? diagram;
      let x = grouping ? operation.position.x - grouping.x : operation.position.x;
      let y = grouping ? operation.position.y - grouping.y : operation.position.y;

      for (const filePath of operation.filePaths) {
         const document = await this.modelState.modelService.request(URI.file(filePath).toString());
         const element = document?.root?.element;
         const junction = document?.root?.junction;
         if (element) {
            const node: ElementNode = {
               $type: ElementNode,
               $container: container,
               id: this.modelState.idProvider.findNextId(ElementNode, element.id + 'Node', diagram),
               element: {
                  $refText:
                     (this.modelState.idProvider.getPackageName(diagram) === this.modelState.idProvider.getPackageName(element)
                        ? this.modelState.idProvider.getLocalId(element)
                        : this.modelState.idProvider.getGlobalId(element)) ||
                     element.id ||
                     '',
                  ref: element
               },
               x: (x += 10),
               y: (y += 10),
               width: 200,
               height: 50,
               children: []
            };
            if (grouping) {
               (grouping.children as DiagramNode[]).push(node);
            } else {
               diagram.nodes.push(node);
            }
         } else if (junction) {
            const node: JunctionNode = {
               $type: JunctionNode,
               $container: container,
               id: this.modelState.idProvider.findNextId(JunctionNode, junction.type + 'Node', diagram),
               junction: {
                  $refText:
                     (this.modelState.idProvider.getPackageName(diagram) === this.modelState.idProvider.getPackageName(junction)
                        ? this.modelState.idProvider.getLocalId(junction)
                        : this.modelState.idProvider.getGlobalId(junction)) ||
                     junction.id ||
                     '',
                  ref: junction
               },
               x: (x += 10),
               y: (y += 10),
               width: JUNCTION_SIZE,
               height: JUNCTION_SIZE
            };
            if (grouping) {
               (grouping.children as DiagramNode[]).push(node);
            } else {
               diagram.nodes.push(node);
            }
         }
      }
   }
}
