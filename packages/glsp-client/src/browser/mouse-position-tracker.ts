import { Action, GLSPMousePositionTracker, GModelElement, Point } from '@eclipse-glsp/client';
import { injectable } from '@theia/core/shared/inversify';

@injectable()
export class MousePositionTracker extends GLSPMousePositionTracker {
   clientPosition: Point | undefined;
   diagramOffset: Point | undefined;

   override mouseMove(target: GModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
      this.clientPosition = { x: event.clientX, y: event.clientY };
      this.diagramOffset = { x: event.offsetX, y: event.offsetY };
      return super.mouseMove(target, event);
   }
}
