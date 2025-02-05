/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { ChangeBoundsOperation, Command, JsonOperationHandler, ModelState } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { CrossModelCommand } from '../../common/cross-model-command.js';
import { ArchiMateModelState } from '../model/archimate-model-state.js';

@injectable()
export class ArchiMateDiagramChangeBoundsOperationHandler extends JsonOperationHandler {
   operationType = ChangeBoundsOperation.KIND;
   @inject(ModelState) protected override modelState!: ArchiMateModelState;

   createCommand(operation: ChangeBoundsOperation): Command {
      return new CrossModelCommand(this.modelState, () => this.changeBounds(operation));
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
