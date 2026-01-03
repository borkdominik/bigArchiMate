import { injectable } from 'inversify';
import {
   AbstractUIExtension,
   ActionDispatcher,
   EditorContextService,
   FitToScreenAction,
   IDiagramStartup,
   MaybePromise,
   TYPES
} from '@eclipse-glsp/client';
import { inject } from '@theia/core/shared/inversify';

@injectable()
export class EdgeConnectorPalette extends AbstractUIExtension implements IDiagramStartup {
   @inject(TYPES.IActionDispatcher)
   protected readonly actionDispatcher: ActionDispatcher;

   @inject(EditorContextService)
   protected readonly editorContextService: EditorContextService;

   static readonly ID = 'edge-connector-palette';

   id() {
      return EdgeConnectorPalette.ID;
   }

   containerClass() {
      return EdgeConnectorPalette.ID;
   }

   protected initializeContents(containerElement: HTMLElement): void {
      // Beispiel: ein einfacher Button
      const btn = document.createElement('div');
      btn.classList.add('secondary-palette-button');
      btn.innerText = 'Fit to Screen';
      btn.onclick = () => this.actionDispatcher.dispatch(FitToScreenAction.create([]));
      containerElement.appendChild(btn);
   }

   postModelInitialization(): MaybePromise<void> {
      this.show(this.editorContextService.modelRoot);
   }
}
