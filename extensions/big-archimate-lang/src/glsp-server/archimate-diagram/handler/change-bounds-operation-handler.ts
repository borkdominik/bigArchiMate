import { ChangeBoundsOperation, Command, JsonOperationHandler, ModelState } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

@injectable()
export class ChangeBoundsOperationHandler extends JsonOperationHandler {
   operationType = ChangeBoundsOperation.KIND;
   @inject(ModelState) protected override modelState!: ArchiMateModelState;

   createCommand(operation: ChangeBoundsOperation): Command {
      return new ArchiMateCommand(this.modelState, () => this.changeBounds(operation));
   }

   protected changeBounds(operation: ChangeBoundsOperation): void {
      operation.newBounds.forEach(elementAndBounds => {
         const node =
            this.modelState.index.findElementNode(elementAndBounds.elementId) ??
            this.modelState.index.findJunctionNode(elementAndBounds.elementId);
         if (node) {
            // we store the given bounds directly in our diagram node
            node.x = elementAndBounds.newPosition?.x || node.x;
            node.y = elementAndBounds.newPosition?.y || node.y;
            node.width = elementAndBounds.newSize.width;
            node.height = elementAndBounds.newSize.height;
         }
      });
   }
}
