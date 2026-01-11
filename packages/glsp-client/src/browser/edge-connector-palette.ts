import { injectable } from 'inversify';
import {
   AbstractUIExtension,
   ActionDispatcher,
   EditorContextService,
   GNode,
   SetUIExtensionVisibilityAction,
   TYPES,
   createIcon,
   RequestContextActions,
   ToolPalette,
   SetContextActions,
   PaletteItem,
   compare
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

   private paletteItems: PaletteItem[] = [];

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

      const src = document.createElement('div');
      src.innerText = `Source: ${this.contextIds[0]}`;
      this.containerElement.appendChild(src);
      const tgt = document.createElement('div');
      tgt.innerText = `Target: ${this.contextIds[1]}`;
      this.containerElement.appendChild(tgt);
   }

   protected initializeContents(containerElement: HTMLElement): void {
      this.registerEscListener();

      this.createHeader();
      this.createBody();
      containerElement.setAttribute('aria-label', 'edge-connector-palette');
   }

   private createHeader(): void {
      const headerCompartment = document.createElement('div');
      headerCompartment.classList.add('palette-header');
      //headerCompartment.append(this.createHeaderTitle());
      headerCompartment.appendChild(this.createHeaderTools());
      // headerCompartment.appendChild((this.searchField = this.createHeaderSearchField()));
      this.containerElement.appendChild(headerCompartment);
   }

   protected createHeaderTitle(): HTMLElement {
      const header = document.createElement('div');
      header.classList.add('header-icon');
      header.appendChild(createIcon('wand'));
      header.insertAdjacentText('beforeend', 'Palette');
      return header;
   }

   protected createHeaderTools(): HTMLElement {
      const headerTools = document.createElement('div');
      headerTools.classList.add('header-tools');
      headerTools.appendChild(this.changeDirectionButton());
      return headerTools;
   }

   private changeDirectionButton(): HTMLElement {
      const btn = document.createElement('div');
      btn.classList.add('secondary-palette-button');
      btn.innerText = 'Change Direction';
      btn.onclick = () => {
         this.changeDirection();
      };
      return btn;
   }

   private changeDirection(): void {
      const [sourceId, targetId] = this.contextIds;
      this.contextIds = [targetId, sourceId];
   }

   private createBody(): void {
      const bodyDiv = document.createElement('div');
      bodyDiv.classList.add('palette-body');
      let tabIndex = 0;
      this.paletteItems.sort(compare).forEach((item) => {
         bodyDiv.appendChild(this.createToolButton(item, tabIndex++));
      });
      this.containerElement.appendChild(bodyDiv);
      //TODO: store bodyDiv reference to remove later
      //TODO: handle empty palette case
   }

   private createToolButton(item: PaletteItem, index: number): HTMLElement {
      const button = document.createElement('div');
      button.tabIndex = index;
      button.classList.add('tool-button');
      if (item.icon) {
         button.appendChild(createIcon(item.icon));
      }
      button.insertAdjacentText('beforeend', item.label);
      button.onclick = this.onClickCreateToolButton(button, item);
      //button.onkeydown = ev => this.clearToolOnEscape(ev);
      return button;
   }

   private onClickCreateToolButton(button: HTMLElement, item: PaletteItem) {
      return (_ev: MouseEvent) => {
         if (!this.editorContextService.isReadonly) {
            this.actionDispatcher.dispatchAll(item.actions);
            this.closePalette(true);
         }
      };
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
   /*
   private onEdgeSelected(): void {
      const [sourceId, targetId] = this.contextIds;
      console.log('Edge selected:', sourceId, targetId);
      this.closePalette(true);
   }

    */

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

   protected async setPaletteItems(): Promise<void> {
      const requestAction = RequestContextActions.create({
         contextId: ToolPalette.ID,
         editorContext: {
            selectedElementIds: []
         }
      });
      const response = await this.actionDispatcher.request<SetContextActions>(requestAction);
      this.paletteItems = response.actions.map(action => action as PaletteItem);
      // this.dynamic = this.paletteItems.some(item => this.hasDynamicAction(item));
   }

   override async onBeforeShow(): Promise<void> {
      await this.setPaletteItems();
      console.log('EdgeConnectorPalette onBeforeShow, items=', this.paletteItems);
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
      return {
         x: node.position.x,
         y: node.position.y
      };
      /*
      return {
         x: node.position.x + node.size.width / 2,
         y: node.position.y + node.size.height / 2
      };
             */
   }

   private getMid(sourceId: string, targetId: string): { x: number; y: number } | undefined {
      const a = this.getNodeCenter(sourceId);
      const b = this.getNodeCenter(targetId);
      if (!a || !b) {
         return undefined;
      }
      console.log('getMid: x=', (a.x + b.x) / 2, ', y=', (a.y + b.y) / 2);
      return {
         x: (a.x + b.x) / 2,
         y: (a.y + b.y) / 2
      };
   }

   private diagramToScreen(root: any, p: { x: number; y: number }): { x: number; y: number } {
      const zoom = typeof root?.zoom === 'number' ? root.zoom : 1;
      const scroll = {
         x: typeof root?.scroll.x === 'number' ? root?.scroll.x : 0,
         y: typeof root?.scroll.y === 'number' ? root?.scroll.y : 0
      };

      const cb = root?.canvasBounds ?? { x: 0, y: 0 };

      return {
         x: (cb.x ?? 0) + (p.x - (scroll.x ?? 0)) * zoom,
         y: (cb.y ?? 0) + (p.y - (scroll.y ?? 0)) * zoom
      };
   }

   // TODO: Clamp when at the edge
}
