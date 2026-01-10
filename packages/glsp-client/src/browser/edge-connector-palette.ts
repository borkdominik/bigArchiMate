import { injectable } from 'inversify';
import {
   AbstractUIExtension,
   ActionDispatcher,
   EditorContextService,
   GNode,
   SetUIExtensionVisibilityAction,
   TYPES
} from '@eclipse-glsp/client';
import { inject } from '@theia/core/shared/inversify';

@injectable()
export class EdgeConnectorPalette extends AbstractUIExtension {
   @inject(TYPES.IActionDispatcher)
   protected readonly actionDispatcher: ActionDispatcher;

   @inject(EditorContextService)
   protected readonly editorContextService: EditorContextService;


   static readonly ID = 'edge-connector-palette';

   private contextIds: string[] = [];

   private escListener?: (e: KeyboardEvent) => void;

   id() {
      return EdgeConnectorPalette.ID;
   }

   containerClass() {
      return EdgeConnectorPalette.ID;
   }

   override show(...args: any[]): void {
      const root = args[0];
      const contextElementIds = args.slice(1).filter((x): x is string => typeof x === 'string');
      const [sourceId, targetId] = contextElementIds;

      super.show(root);
      this.contextIds = contextElementIds;

      if (!sourceId || !targetId) {
         return;
      }

      const midpoint = this.getMid(sourceId, targetId);
      if (!midpoint) {
         return;
      }

      const screenPos = this.diagramToScreen(root, midpoint);

      this.containerElement.style.position = 'absolute';
      this.containerElement.style.left = `${screenPos.x}px`;
      this.containerElement.style.top = `${screenPos.y}px`;
      this.containerElement.style.transform = 'translate(-50%, -50%)';
      this.containerElement.style.zIndex = '9999';

   }

   protected initializeContents(containerElement: HTMLElement): void {
      this.registerEscListener();
      containerElement.setAttribute('aria-label', 'edge-connector-palette');
      const btn = document.createElement('div');
      btn.classList.add('secondary-palette-button');
      btn.innerText = 'Dummy Button';
      btn.onclick = () => this.onEdgeSelected();
      containerElement.appendChild(btn);
   }

   override hide(): void {
      super.hide();
      if (this.escListener) {
         window.removeEventListener('keydown', this.escListener, true);
         this.escListener = undefined;
      }
   }

   protected registerEscListener(): void {
      this.escListener = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            this.closePalette(true);
         }
      };
      window.addEventListener('keydown', this.escListener, true);
   }

   private onEdgeSelected(): void {
      const [sourceId, targetId] = this.contextIds;
      console.log('Edge selected:', sourceId, targetId);
      this.closePalette(true);
   }

   private closePalette(enableDefaultTools: boolean): void {
      this.actionDispatcher.dispatch(
         SetUIExtensionVisibilityAction.create({
            extensionId: EdgeConnectorPalette.ID,
            visible: false,
            contextElementsId: []
         })
      );

      if (enableDefaultTools) {
         this.actionDispatcher.dispatch({ kind: 'enableDefaultTools' });
      }
   }

   private getNodeCenter(nodeId: string): { x: number; y: number } | undefined {
      const root = this.editorContextService.modelRoot;
      if (!root) {
         return undefined;
      }

      const node = root.index.getById(nodeId);
      if (!(node instanceof GNode)) {
         return undefined;
      }
      console.log('getNodeCenter:', nodeId, 'x:', node.position.x, ' y:', node.position.y);
      return {
         x: node.position.x + node.size.width / 2,
         y: node.position.y + node.size.height / 2
      };
   }

   private getMid(sourceId: string, targetId: string): { x: number; y: number } | undefined {
      const a = this.getNodeCenter(sourceId);
      const b = this.getNodeCenter(targetId);
      if (!a || !b) {
         return undefined;
      }

      return {
         x: (a.x + b.x) / 2,
         y: (a.y + b.y) / 2
      };
   }

   private diagramToScreen(root: any, p: {x: number; y: number}): { x: number; y: number} {
      const zoom = typeof root?.zoom === 'number' ? root.zoom : 1;
      const scroll = {
         x: typeof root?.scroll.x === 'number' ? root?.scroll.x : 0,
         y: typeof root?.scroll.y === 'number' ? root?.scroll.y : 0
      };

      const cb = root?.canvasBounds ?? { x: 0, y: 0 };;

      return {
         x: (cb.x ?? 0) + (p.x - (scroll.x ?? 0)) * zoom,
         y: (cb.y ?? 0) + (p.y - (scroll.y ?? 0)) * zoom
      };
   }

   // TODO: Clamp when at the edge
}
