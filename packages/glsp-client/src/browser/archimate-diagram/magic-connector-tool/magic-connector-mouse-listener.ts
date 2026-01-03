import {
   Action,
   DrawFeedbackEdgeAction,RemoveFeedbackEdgeAction,
   EdgeCreationToolMouseListener, EnableDefaultToolsAction,
   GModelElement,
   SetUIExtensionVisibilityAction
} from '@eclipse-glsp/client';

const EDGE_CONNECTOR_PALETTE_ID = 'edge-connector-palette';

export class MagicConnectorMouseListener extends EdgeCreationToolMouseListener {

   override nonDraggingMouseUp(element: GModelElement, event: MouseEvent): Action[] {
      const result: Action[] = [];

      if (event.button === 0){
         if(!this.isSourceSelected()) {
            // && this.allowedTarget
            if (this.currentTarget) {
               this.source = this.currentTarget.id;

               this.feedbackEdgeFeedback
                  .add(
                     DrawFeedbackEdgeAction.create({
                        elementTypeId: this.triggerAction.elementTypeId,
                        sourceId: this.source
                     }),
                     RemoveFeedbackEdgeAction.create
                  )
                  .submit();
            }
         } else if (this.currentTarget && this.allowedTarget) {
            this.target = this.currentTarget.id;
         }

         if (this.source && this.target) {
            result.push(
               SetUIExtensionVisibilityAction.create({
                  extensionId: EDGE_CONNECTOR_PALETTE_ID,
                  visible: true,
                  contextElementsId: [this.source, this.target]
               })
            );

            if (!this.isContinuousMode(element, event)) {
               result.push(EnableDefaultToolsAction.create());
            } else {
               this.source = undefined;
               this.target = undefined;

               this.feedbackEdgeFeedback.add(RemoveFeedbackEdgeAction.create()).submit();
            }
         }
   } else if(event.button === 2) {
         this.dispose();
         result.push(
            SetUIExtensionVisibilityAction.create({
               extensionId: EDGE_CONNECTOR_PALETTE_ID,
               visible: false,
               contextElementsId: []
            })
         );
         result.push(EnableDefaultToolsAction.create());
      }
      return result;
   }
}
