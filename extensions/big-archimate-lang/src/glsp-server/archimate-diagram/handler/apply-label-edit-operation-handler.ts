import { getSuggestedElementId, toId } from '@big-archimate/protocol';
import { ApplyLabelEditOperation, Command, getOrThrow, JsonOperationHandler, ModelState } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ArchiMateRoot, Element, ElementNode } from '../../../language-server/generated/ast.js';
import { findDocument } from '../../../language-server/util/ast-util.js';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

@injectable()
export class ApplyLabelEditOperationHandler extends JsonOperationHandler {
   readonly operationType = ApplyLabelEditOperation.KIND;
   @inject(ModelState) declare modelState: ArchiMateModelState;

   createCommand(operation: ApplyLabelEditOperation): Command {
      const elementNode = getOrThrow(this.modelState.index.findElementNode(operation.labelId), 'Element node not found');
      const element = getOrThrow(elementNode.element.ref, 'Element not found');
      const oldName = element.name;
      return new ArchiMateCommand(
         this.modelState,
         () => this.renameElement(elementNode, element, operation.text),
         () =>
            this.renameElement(
               getOrThrow(this.modelState.index.findElementNode(operation.labelId), 'Element node not found'),
               getOrThrow(elementNode.element.ref, 'Element not found'),
               oldName ?? this.modelState.idProvider.findNextId(Element, 'NewElement', this.modelState.packageId)
            ),
         () =>
            this.renameElement(
               getOrThrow(this.modelState.index.findElementNode(operation.labelId), 'Element node not found'),
               getOrThrow(elementNode.element.ref, 'Element not found'),
               operation.text
            )
      );
   }

   protected async renameElement(elementNode: ElementNode, element: Element, name: string): Promise<void> {
      element.name = name;
      const document = findDocument<ArchiMateRoot>(element)!;
      const references = Array.from(
         this.modelState.services.language.references.References.findReferences(element, { includeDeclaration: false })
      );

      // If the current diagram is the only reference to the element, we can safely change its id.
      // Otherwise we need to ensure to implement proper rename behavior.
      if (references.length === 0 || (references.length === 1 && references[0].sourceUri.fsPath === this.modelState.sourceUri)) {
         element.id = this.modelState.idProvider.findNextId(
            Element,
            toId(getSuggestedElementId(element.type, element.name)),
            this.modelState.packageId
         );
         elementNode.element = { $refText: element.id, ref: element };
      }

      await this.modelState.modelService.save({
         uri: document.uri.toString(),
         model: document.parseResult.value,
         clientId: this.modelState.clientId
      });
   }
}
