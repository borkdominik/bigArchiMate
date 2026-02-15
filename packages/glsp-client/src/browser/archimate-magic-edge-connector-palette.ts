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
   SetContextActions,
   PaletteItem,
   compare,
   EnableDefaultToolsAction,
   DrawFeedbackEdgeAction,
   RemoveFeedbackEdgeAction
} from '@eclipse-glsp/client';
import { inject } from '@theia/core/shared/inversify';

@injectable()
export class ArchimateMagicEdgeConnectorPalette extends AbstractUIExtension {
   static readonly ID = 'archimate.magic-edge-connector-palette';

   @inject(TYPES.IActionDispatcher)
   protected readonly actionDispatcher: ActionDispatcher;

   @inject(EditorContextService)
   protected readonly editorContextService: EditorContextService;

   private paletteItems: PaletteItem[] = [];

   private sourceElementId: string;
   private targetElementId: string;

   private escListener?: (e: KeyboardEvent) => void;

   private headerElement?: HTMLElement;
   private bodyElement?: HTMLElement;

   private root: any;

   id(): string {
      return ArchimateMagicEdgeConnectorPalette.ID;
   }

   containerClass(): string {
      return ArchimateMagicEdgeConnectorPalette.ID;
   }

   protected initializeContents(containerElement: HTMLElement): void {
      containerElement.setAttribute('aria-label', 'edge-connector-palette');

      containerElement.replaceChildren(); // Clear existing contents

      this.headerElement = document.createElement('div');
      this.headerElement.classList.add('palette-header');
      this.headerElement.appendChild(this.createHeaderTools());

      this.bodyElement = document.createElement('div');
      this.bodyElement.classList.add('palette-body');

      this.containerElement.appendChild(this.headerElement);
      this.containerElement.appendChild(this.bodyElement);
   }

   override async show(...args: any[]): Promise<void> {
      const root = args[0];
      this.root = root;
      const contextElementIds = args.slice(1).filter((x): x is string => typeof x === 'string');
      const [sourceId, targetId] = contextElementIds;
      this.sourceElementId = sourceId;
      this.targetElementId = targetId;

      if (!this.sourceElementId || !this.targetElementId) {
         return;
      }
      super.show(root);

      this.registerEscListener();

      await this.setPaletteItems(this.sourceElementId, this.targetElementId);
      this.renderBody();
      this.positionPalette(this.sourceElementId, this.targetElementId);
      this.actionDispatcher.dispatch(
         DrawFeedbackEdgeAction.create({
            elementTypeId: 'magic-connector-edge',
            sourceId: sourceId,
            edgeSchema: {
               sourceId: sourceId,
               targetId: targetId
            }
         })
      );
   }

   protected createHeaderTools(): HTMLElement {
      const headerTools = document.createElement('div');
      headerTools.classList.add('header-tools');

      const left = document.createElement('div');
      left.classList.add('left');
      left.appendChild(this.changeDirectionButton());

      const right = document.createElement('div');
      right.classList.add('right');
      right.appendChild(this.closeButton());

      headerTools.appendChild(left);
      headerTools.appendChild(right);

      return headerTools;
   }

   private changeDirectionButton(): HTMLElement {
      const btn = createIcon('arrow-swap');
      btn.title = 'Change Direction';
      btn.ariaLabel = btn.title;
      btn.onclick = async () => {
         await this.changeDirection();
      };
      return btn;
   }

   private closeButton(): HTMLElement {
      const btn = createIcon('close');
      btn.title = 'Close Palette';
      btn.ariaLabel = btn.title;
      btn.onclick = () => {
         this.closePalette(true);
      };
      return btn;
   }

   private async changeDirection(): Promise<void> {
      if (!this.sourceElementId || !this.targetElementId) {
         return;
      }
      await this.actionDispatcher.dispatch(RemoveFeedbackEdgeAction.create());

      const oldSourceId = this.sourceElementId;
      this.sourceElementId = this.targetElementId;
      this.targetElementId = oldSourceId;

      await this.actionDispatcher.dispatch(
         DrawFeedbackEdgeAction.create({
            elementTypeId: 'magic-connector-edge',
            sourceId: this.sourceElementId,
            edgeSchema: {
               sourceId: this.sourceElementId,
               targetId: this.targetElementId
            }
         })
      );

      await this.setPaletteItems(this.sourceElementId, this.targetElementId);
      this.renderBody();
      this.positionPalette(this.sourceElementId, this.targetElementId);
   }

   renderBody(): void {
      if (!this.bodyElement) {
         return;
      }
      this.bodyElement.replaceChildren();
      if (this.paletteItems.length === 0) {
         const empty = document.createElement('div');
         empty.classList.add('palette-empty');
         empty.textContent = 'No available relations';
         this.bodyElement.appendChild(empty);
         return;
      }

      let tabIndex = 0;
      for (const item of this.paletteItems) {
         this.bodyElement.appendChild(this.createToolButton(item, tabIndex++));
      }
   }

   private createToolButton(item: PaletteItem, index: number): HTMLElement {
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.add('tool-button');
      button.tabIndex = index;

      if (item.icon) {
         button.appendChild(createIcon(item.icon));
      }
      button.insertAdjacentText('beforeend', item.label);

      button.onclick = this.onClickCreateToolButton(button, item);
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
      this.unregisterEscListener();
      this.bodyElement?.replaceChildren();
      super.hide();
   }

   protected registerEscListener(): void {
      if (this.escListener) {
         return;
      }
      this.escListener = (e: KeyboardEvent) => {
         if (e.key !== 'Escape') {
            return;
         }
         e.stopPropagation();
         e.preventDefault();
         this.hide();
         this.closePalette(true);
      };
      window.addEventListener('keydown', this.escListener, true);
   }

   protected unregisterEscListener(): void {
      if (!this.escListener) {
         return;
      }
      window.removeEventListener('keydown', this.escListener, true);
      this.escListener = undefined;
   }

   private closePalette(enableDefaultTools: boolean): void {
      this.actionDispatcher.dispatch(
         SetUIExtensionVisibilityAction.create({
            extensionId: ArchimateMagicEdgeConnectorPalette.ID,
            visible: false,
            contextElementsId: []
         })
      );

      if (enableDefaultTools) {
         this.actionDispatcher.dispatch(EnableDefaultToolsAction.create());
      }
      this.actionDispatcher.dispatch(RemoveFeedbackEdgeAction.create());
   }

   protected async setPaletteItems(sourceId: string, targetId: string): Promise<void> {
      if (this.editorContextService.isReadonly) {
         this.paletteItems = [];
         return;
      }

      const requestAction = RequestContextActions.create({
         contextId: 'archimate.magic-edge-connector',
         editorContext: {
            selectedElementIds: [sourceId, targetId]
         }
      });
      const response = await this.actionDispatcher.request<SetContextActions>(requestAction);

      const items = (response.actions ?? []).filter(isPaletteItem);
      this.paletteItems = items.sort(compare);
   }

   override async onBeforeShow(): Promise<void> {
      if (!this.sourceElementId && !this.targetElementId) {
         this.paletteItems = [];
      }
   }

   private positionPalette(sourceId: string, targetId: string): void {
      const mid = this.getMid(sourceId, targetId);
      if (!mid) {
         return;
      }

      const screen = this.diagramToScreen(mid);

      const element = this.containerElement;

      const offsetParent = (element.offsetParent as HTMLElement) ?? element.parentElement;
      if (!offsetParent) {
         return;
      }
      const parentRect = offsetParent.getBoundingClientRect();

      const left = screen.x - parentRect.left;
      const top = screen.y - parentRect.top;

      element.style.position = 'absolute';
      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
      element.style.transform = 'translate(-50%, -50%)';
      element.style.zIndex = '9999';

      requestAnimationFrame(() => this.clampToCanvasBounds(parentRect));
   }

   private clampToCanvasBounds(parentRect: DOMRect): void {
      const root = this.editorContextService.modelRoot as any;
      const canvasBounds = root?.canvasBounds;
      if (!canvasBounds) {
         return;
      }

      const element = this.containerElement;
      const rect = element.getBoundingClientRect();

      const canvasLeft = canvasBounds.x - parentRect.left;
      const canvasTop = canvasBounds.y - parentRect.top;

      const minX = canvasLeft + rect.width / 2;
      const maxX = canvasLeft + canvasBounds.width - rect.width / 2;
      const minY = canvasTop + rect.height / 2;
      const maxY = canvasTop + canvasBounds.height - rect.height / 2;

      const currentLeft = parseFloat(element.style.left || '0');
      const currentTop = parseFloat(element.style.top || '0');

      const clampedLeft = Math.max(minX, Math.min(maxX, currentLeft));
      const clampedTop = Math.max(minY, Math.min(maxY, currentTop));

      element.style.left = `${clampedLeft}px`;
      element.style.top = `${clampedTop}px`;
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

   private diagramToScreen(p: { x: number; y: number }): { x: number; y: number } {
      const zoom = typeof this.root?.zoom === 'number' ? this.root.zoom : 1;
      const scroll = {
         x: typeof this.root?.scroll.x === 'number' ? this.root?.scroll.x : 0,
         y: typeof this.root?.scroll.y === 'number' ? this.root?.scroll.y : 0
      };

      const cb = this.root?.canvasBounds ?? { x: 0, y: 0 };

      return {
         x: (cb.x ?? 0) + (p.x - (scroll.x ?? 0)) * zoom,
         y: (cb.y ?? 0) + (p.y - (scroll.y ?? 0)) * zoom
      };
   }
}

function isPaletteItem(x: any): x is PaletteItem {
   return !!x && typeof x.label === 'string' && Array.isArray(x.actions);
}
