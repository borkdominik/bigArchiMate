import { Action, DirtyStateChangeReason, ModelState, ModelSubmissionHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ArchiMateModelState } from './model-state.js';

@injectable()
export class ArchiMateModelSubmissionHandler extends ModelSubmissionHandler {
   @inject(ModelState) protected override modelState: ArchiMateModelState;

   override async submitModel(reason?: DirtyStateChangeReason): Promise<Action[]> {
      await this.modelState.ready();
      return super.submitModel(reason);
   }
}
