import {
   EdgeCreationTool,
   EdgeCreationToolMouseListener,
   GModelElement,
   isConnectable,
   RequestCheckEdgeAction
} from '@eclipse-glsp/client';
import { injectable } from '@theia/core/shared/inversify';
import { MagicConnectorMouseListener } from '../magic-connector-tool/magic-connector-mouse-listener';

@injectable()
export class ArchiMateEdgeCreationTool extends EdgeCreationTool {
   protected override creationListener(): void {
      let creationListener: EdgeCreationToolMouseListener;
      if (this.triggerAction?.elementTypeId === 'magic-connector-edge') {
         creationListener = new MagicConnectorMouseListener(this.triggerAction, this.actionDispatcher, this.typeHintProvider, this);
         this.toDisposeOnDisable.push(creationListener, this.mouseTool.registerListener(creationListener));
         return;
      }
      creationListener = new ArchiMateEdgeCreationToolMouseListener(this.triggerAction, this.actionDispatcher, this.typeHintProvider, this);
      this.toDisposeOnDisable.push(creationListener, this.mouseTool.registerListener(creationListener));
   }
}

export class ArchiMateEdgeCreationToolMouseListener extends EdgeCreationToolMouseListener {
   protected override canConnect(element: GModelElement | undefined, role: 'source' | 'target'): boolean {
      if (!element || !isConnectable(element) || !element.canConnect(this.proxyEdge, role)) {
         return false;
      }
      if (!this.isDynamic(this.proxyEdge.type)) {
         return true;
      }
      const sourceElement = this.source ?? element;
      const targetElement = this.source ? element : undefined;

      this.pendingDynamicCheck = true;
      // Request server edge check
      this.actionDispatcher
         .request(RequestCheckEdgeAction.create({ edgeType: this.proxyEdge.type, sourceElement, targetElement }))
         .then(result => {
            if (this.pendingDynamicCheck) {
               this.allowedTarget = result.isValid;
               this.actionDispatcher.dispatch(this.updateEdgeFeedback());
               this.pendingDynamicCheck = false;
            }
         })
         .catch(err => console.error('Dynamic edge check failed with: ', err));
      // Temporarily mark the target as invalid while we wait for the server response,
      // so a fast-clicking user doesn't get a chance to create the edge in the meantime.
      return false;
   }
}
