import { EdgeCreationTool } from '@eclipse-glsp/client';
import { injectable } from '@theia/core/shared/inversify';
import { MagicConnectorMouseListener } from './magic-connector-mouse-listener';

@injectable()
export class ArchiMateMagicConnectorTool extends EdgeCreationTool {
   static override readonly ID = 'magic-connector-tool';
   override get id(): string {
      return ArchiMateMagicConnectorTool.ID;
   }

   override enable(): void {
      console.debug('[MagicConnectorTool] enable()');
      super.enable();
   }

   protected override creationListener(): void {
      console.debug('[MagicConnectorTool] creationListener()', this.triggerAction);
      const listener = new MagicConnectorMouseListener(this.triggerAction, this.actionDispatcher, this.typeHintProvider, this);
      this.toDisposeOnDisable.push(listener, this.mouseTool.registerListener(listener));
   }
}
