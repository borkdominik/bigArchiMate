import { Action, EdgeCreationToolMouseListener, SetUIExtensionVisibilityAction } from '@eclipse-glsp/client';
import { GModelElement } from '@eclipse-glsp/sprotty';

const EDGE_CONNECTOR_PALETTE_ID = 'archimate.magic-edge-connector-palette';

export class MagicConnectorMouseListener extends EdgeCreationToolMouseListener {
   protected override canConnect(): boolean {
      return true;
   }

   protected override getCreateOperation(
      element: GModelElement,
      event: MouseEvent,
      sourceElementId: string,
      targetElementId: string
   ): Action {
      this.actionDispatcher.dispatch(
         SetUIExtensionVisibilityAction.create({
            extensionId: EDGE_CONNECTOR_PALETTE_ID,
            visible: true,
            contextElementsId: [sourceElementId, targetElementId]
         })
      );
      return super.getCreateOperation(element, event, sourceElementId, targetElementId);
   }
}
