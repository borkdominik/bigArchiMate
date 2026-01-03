import {
   Action,
   CSS_HIDDEN_EXTENSION_CLASS,
   CSS_UI_EXTENSION_CLASS,
   EnableDefaultToolsAction,
   FitToScreenAction,
   ICommand,
   PaletteItem,
   RequestContextActions,
   SetContextActions,
   SetModelAction,
   ToolPalette,
   UpdateModelAction,
   changeCSSClass,
   changeCodiconClass,
   compare,
   createIcon
   // SetUIExtensionVisibilityAction
} from '@eclipse-glsp/client';
import { injectable } from '@theia/core/shared/inversify';
// import { EdgeConnectorPalette } from './edge-connector-palette';

const CLICKED_CSS_CLASS = 'clicked';
const PALETTE_ICON_ID = 'tools';
const CHEVRON_DOWN_ICON_ID = 'chevron-right';

@injectable()
export class CustomToolPalette extends ToolPalette {
   protected readonly defaultToolsBtnId = 'default-tool';
   protected override initializeContents(containerElement: HTMLElement): void {
      this.createHeader();
      this.createBody();
      this.changeActiveButton(this.defaultToolsButton);
      containerElement.setAttribute('aria-label', 'Tool-Palette');
   }

   protected override createBody(): void {
      const bodyDiv = document.createElement('div');
      bodyDiv.classList.add('palette-body');
      let tabIndex = 0;
      this.paletteItems.sort(compare).forEach(item => {
         if (item.children) {
            const group = createToolGroup(item);
            item.children.sort(compare).forEach(child => group.appendChild(this.createToolButton(child, tabIndex++)));
            bodyDiv.appendChild(group);
         } else {
            bodyDiv.appendChild(this.createToolButton(item, tabIndex++));
         }
      });
      if (this.paletteItems.length === 0) {
         const noResultsDiv = document.createElement('div');
         noResultsDiv.innerText = 'No results found.';
         noResultsDiv.classList.add('tool-button');
         bodyDiv.appendChild(noResultsDiv);
      }
      // Remove existing body to refresh filtered entries
      if (this.bodyDiv) {
         this.containerElement.removeChild(this.bodyDiv);
      }
      this.containerElement.appendChild(bodyDiv);
      this.bodyDiv = bodyDiv;
   }

   protected override addMinimizePaletteButton(): void {
      const baseDiv = document.getElementById(this.options.baseDiv);
      const minPaletteDiv = document.createElement('div');
      minPaletteDiv.classList.add('minimize-palette-button');
      this.containerElement.classList.add('collapsible-palette');
      if (baseDiv) {
         const insertedDiv = baseDiv.insertBefore(minPaletteDiv, baseDiv.firstChild);
         const minimizeIcon = createIcon(CHEVRON_DOWN_ICON_ID);
         this.updateMinimizePaletteButtonTooltip(minPaletteDiv);
         minimizeIcon.onclick = _event => {
            if (this.isPaletteMaximized()) {
               this.containerElement.style.transform = 'translateX(270px)';
            } else {
               this.containerElement.style.transform = 'none';
            }
            this.updateMinimizePaletteButtonTooltip(minPaletteDiv);
            setTimeout(() => {
               changeCodiconClass(minimizeIcon, PALETTE_ICON_ID);
               changeCodiconClass(minimizeIcon, CHEVRON_DOWN_ICON_ID);
            }, 200);
         };
         insertedDiv.appendChild(minimizeIcon);
      }
   }

   protected override isPaletteMaximized(): boolean {
      return this.containerElement && this.containerElement.style.transform !== 'translateX(270px)';
   }

   protected override createHeaderTitle(): HTMLElement {
      const header = document.createElement('div');
      header.classList.add('header-icon');
      header.appendChild(createIcon('tools'));
      header.insertAdjacentText('beforeend', 'Toolbox');
      return header;
   }

   protected override createHeaderTools(): HTMLElement {
      const headerTools = document.createElement('div');
      headerTools.classList.add('header-tools');

      const resetViewportButton = this.createResetViewportButton();
      headerTools.appendChild(resetViewportButton);

      const fitToScreenButton = this.createFitToScreenButton();
      headerTools.appendChild(fitToScreenButton);

      if (this.gridManager) {
         const toggleGridButton = this.createToggleGridButton();
         headerTools.appendChild(toggleGridButton);
      }

      return headerTools;
   }

   protected override createToolButton(item: PaletteItem, index: number): HTMLElement {
      const button = super.createToolButton(item, index);
      if (item.id === this.defaultToolsBtnId) {
         this.defaultToolsButton = button;
      }
      return button;
   }

   protected createFitToScreenButton(): HTMLElement {
      const fitToScreenButton = createIcon('screen-full');
      fitToScreenButton.title = 'Fit to Screen';
      fitToScreenButton.onclick = _event => {
         this.actionDispatcher.dispatch(FitToScreenAction.create([]));
         fitToScreenButton.focus();
      };
      fitToScreenButton.ariaLabel = fitToScreenButton.title;
      fitToScreenButton.tabIndex = 1;
      return fitToScreenButton;
   }

   protected override async setPaletteItems(): Promise<void> {
      super.setPaletteItems();
      this.changeActiveButton();
      const requestAction = RequestContextActions.create({
         contextId: ToolPalette.ID,
         editorContext: {
            selectedElementIds: []
         }
      });
      const response = await this.actionDispatcher.request<SetContextActions>(requestAction);
      this.paletteItems = response.actions.map(action => action as PaletteItem);
      this.dynamic = this.paletteItems.some(item => this.hasDynamicAction(item));
   }

   override changeActiveButton(button?: HTMLElement): void {
      if (this.lastActiveButton) {
         this.lastActiveButton.classList.remove(CLICKED_CSS_CLASS);
      }
      if (button) {
         button.classList.add(CLICKED_CSS_CLASS);
         this.lastActiveButton = button;
      } else if (this.defaultToolsButton) {
         this.defaultToolsButton.classList.add(CLICKED_CSS_CLASS);
         this.lastActiveButton = this.defaultToolsButton;
         this.defaultToolsButton.focus();
      }
   }

   override handle(action: Action): ICommand | Action | void {
      if (UpdateModelAction.is(action) || SetModelAction.is(action)) {
         this.reloadPaletteBody();
      } else if (EnableDefaultToolsAction.is(action)) {
         this.changeActiveButton(this.defaultToolsButton);
         if (this.focusTracker.hasFocus) {
            // if focus was deliberately taken do not restore focus to the palette
            this.focusTracker.diagramElement?.focus();
         }
         /*
         this.actionDispatcher.dispatch(
            SetUIExtensionVisibilityAction.create({
               extensionId: EdgeConnectorPalette.ID,
               visible: false,
               contextElementsId: []
            })
         );

          */
      }
   }

   protected override setContainerVisible(visible: boolean): void {
      super.setContainerVisible(visible);
      // also toggle the visibility of the palette button
      const minimizePaletteButton = document.getElementById(this.options.baseDiv)?.getElementsByClassName('minimize-palette-button')[0];
      if (visible) {
         minimizePaletteButton?.classList.remove(CSS_HIDDEN_EXTENSION_CLASS, CSS_UI_EXTENSION_CLASS);
      } else {
         minimizePaletteButton?.classList.add(CSS_HIDDEN_EXTENSION_CLASS, CSS_UI_EXTENSION_CLASS);
      }
   }
}

function createToolGroup(item: PaletteItem): HTMLElement {
   const group = document.createElement('div');
   group.classList.add('tool-group');
   group.id = item.id;
   const header = document.createElement('div');
   header.classList.add('group-header');
   if (item.icon) {
      header.appendChild(createIcon(item.icon));
   }
   header.insertAdjacentText('beforeend', item.label);
   header.onclick = _ev => {
      const css = 'collapsed';
      changeCSSClass(group, css);
      Array.from(group.children).forEach(child => changeCSSClass(child, css));
      window!.getSelection()!.removeAllRanges();
   };

   group.appendChild(header);
   return group;
}
