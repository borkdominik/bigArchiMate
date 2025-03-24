import {
   Action,
   DeleteElementOperation,
   DeleteToolMouseListener,
   GModelElement,
   MouseDeleteTool,
   findParentByFeature,
   isDeletable
} from '@eclipse-glsp/client';
import { injectable } from '@theia/core/shared/inversify';

export class CustomMouseDeleteTool extends MouseDeleteTool {
   protected override deleteToolMouseListener: DeleteToolMouseListener = new CustomDeleteMouseListener();
}

@injectable()
class CustomDeleteMouseListener extends DeleteToolMouseListener {
   override mouseUp(target: GModelElement, event: MouseEvent): Action[] {
      const deletableParent = findParentByFeature(target, isDeletable);
      if (deletableParent === undefined) {
         return [];
      }
      const result: Action[] = [];
      result.push(DeleteElementOperation.create([deletableParent.id]));
      return result;
   }
}
