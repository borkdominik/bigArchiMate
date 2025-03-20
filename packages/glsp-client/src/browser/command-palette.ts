import { AddEntityOperation } from '@big-archimate/protocol';
import {
   Action,
   GModelRoot,
   GlspCommandPalette,
   InsertIndicator,
   LabeledAction,
   Point,
   getAbsoluteClientBounds
} from '@eclipse-glsp/client';
import { inject, injectable } from '@theia/core/shared/inversify';
import { MousePositionTracker } from './mouse-position-tracker';

@injectable()
export class CustomCommandPalette extends GlspCommandPalette {
   protected visible = false;
   protected creationPosition?: Point;

   @inject(MousePositionTracker) protected positionTracker: MousePositionTracker;

   protected override onBeforeShow(containerElement: HTMLElement, root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
      if (contextElementIds.length === 1) {
         const element = root.index.getById(contextElementIds[0]);
         if (element instanceof InsertIndicator) {
            this.creationPosition = element.position;
            const bounds = getAbsoluteClientBounds(element, this.domHelper, this.viewerOptions);
            containerElement.style.left = `${bounds.x}px`;
            containerElement.style.top = `${bounds.y}px`;
            containerElement.style.width = `${this.defaultWidth}px`;
            return;
         }
      }
      const diagramOffset = this.positionTracker.diagramOffset;
      if (diagramOffset) {
         this.creationPosition = this.positionTracker.lastPositionOnDiagram;
         containerElement.style.left = `${diagramOffset.x}px`;
         containerElement.style.top = `${diagramOffset.y}px`;
         containerElement.style.width = `${this.defaultWidth}px`;
         return;
      }
      super.onBeforeShow(containerElement, root, ...contextElementIds);
   }

   protected override executeAction(input: LabeledAction | Action | Action[]): void {
      if (this.creationPosition && LabeledAction.is(input) && AddEntityOperation.is(input.actions[0])) {
         const action = input.actions[0];
         action.position = this.creationPosition;
         return super.executeAction(action);
      }
      super.executeAction(input);
   }

   override hide(): void {
      super.hide();
      this.creationPosition = undefined;
      this.visible = false;
   }
}
