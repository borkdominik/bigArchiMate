import { CustomWidget, CustomWidgetOptions } from '@big-archimate/core/lib/browser';
import { FormEditorOpenHandler, FormEditorWidget } from '@big-archimate/form-client/lib/browser';
import { ArchiMateDiagramManager } from '@big-archimate/glsp-client/lib/browser/';
import { ArchiMateDiagramLanguage } from '@big-archimate/glsp-client/lib/common';
import { codiconCSSString, ModelFileType } from '@big-archimate/protocol';
import { FocusStateChangedAction, SetDirtyStateAction, toTypeGuard } from '@eclipse-glsp/client';
import { GLSPDiagramWidget, GLSPDiagramWidgetContainer, GLSPDiagramWidgetOptions, GLSPSaveable } from '@eclipse-glsp/theia-integration';
import { GLSPDiagramLanguage } from '@eclipse-glsp/theia-integration/lib/common';
import { URI } from '@theia/core';
import {
   BaseWidget,
   BoxLayout,
   CompositeSaveable,
   LabelProvider,
   Message,
   Navigatable,
   NavigatableWidgetOptions,
   Saveable,
   SaveableSource,
   SaveOptions,
   TabPanel,
   Widget,
   WidgetManager
} from '@theia/core/lib/browser';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { EditorPreviewWidget } from '@theia/editor-preview/lib/browser/editor-preview-widget';
import { EditorPreviewWidgetFactory } from '@theia/editor-preview/lib/browser/editor-preview-widget-factory';
import { EditorOpenerOptions, EditorWidget } from '@theia/editor/lib/browser';
import * as monaco from '@theia/monaco-editor-core';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { CompositeEditorOptions } from './composite-editor-open-handler';
import { CustomEditorPreviewManager } from './editor-manager';
import { CustomFileResourceResolver } from './file-resource-resolver';

export class ReverseCompositeSaveable extends CompositeSaveable {
   constructor(
      protected editor: CompositeEditor,
      protected fileResourceResolver: CustomFileResourceResolver
   ) {
      super();
   }

   override get saveables(): readonly Saveable[] {
      // reverse order so we save the text editor first as otherwise we'll get a message that something changed on the file system
      return Array.from(this.saveablesMap.keys()).reverse();
   }

   override async save(options?: SaveOptions): Promise<void> {
      // we do not want the overwrite dialog to appear since we are syncing manually
      const autoOverwrite = this.fileResourceResolver.autoOverwrite;
      try {
         this.fileResourceResolver.autoOverwrite = true;
         const activeEditor = this.editor.activeWidget();
         const activeSaveable = Saveable.get(activeEditor);
         activeSaveable?.dirty;
         if (activeSaveable) {
            await activeSaveable.save(options);
            // manually reset the dirty flag on the other editors (saveables) without triggering an actual save
            this.resetDirtyState(activeSaveable);
         } else {
            // could not determine active editor, so execute save sequentially on all editors
            for (const saveable of this.saveables) {
               await saveable.save(options);
            }
         }
      } finally {
         this.fileResourceResolver.autoOverwrite = autoOverwrite;
      }
   }

   /**
    * Reset the dirty state (without triggering an additional save) of the non-active saveables after a save operation.
    */
   protected resetDirtyState(activeSaveable: Saveable): void {
      this.saveables
         .filter(saveable => saveable !== activeSaveable)
         .forEach(saveable => {
            if (saveable instanceof MonacoEditorModel) {
               saveable['setDirty'](false);
            } else if (saveable instanceof GLSPSaveable) {
               saveable['actionDispatcher'].dispatch(SetDirtyStateAction.create(false));
            } else if (saveable instanceof CustomWidget) {
               saveable.setDirty(false);
            }
         });
   }
}

export interface CompositeWidgetOptions extends NavigatableWidgetOptions {
   version?: number;
}

@injectable()
export class CompositeEditor extends BaseWidget implements SaveableSource, Navigatable, Partial<GLSPDiagramWidgetContainer> {
   @inject(CustomWidgetOptions) protected options: CompositeEditorOptions;
   @inject(LabelProvider) protected labelProvider: LabelProvider;
   @inject(WidgetManager) protected widgetManager: WidgetManager;
   @inject(CustomEditorPreviewManager) protected editorManager: CustomEditorPreviewManager;
   @inject(CustomFileResourceResolver) protected fileResourceResolver: CustomFileResourceResolver;

   protected tabPanel: TabPanel;
   saveable: CompositeSaveable;

   protected _resourceUri?: URI;
   protected get resourceUri(): URI {
      if (!this._resourceUri) {
         this._resourceUri = new URI(this.options.uri);
      }
      return this._resourceUri;
   }

   get uri(): string {
      return this.options.uri;
   }

   get fileType(): ModelFileType {
      return this.options.fileType;
   }

   get diagramWidget(): GLSPDiagramWidget | undefined {
      if (this.tabPanel.currentWidget instanceof GLSPDiagramWidget) {
         return this.tabPanel.currentWidget;
      }
      return undefined;
   }

   @postConstruct()
   protected init(): void {
      this.id = this.options.widgetId;
      this.addClass('composite-editor');
      this.title.closable = true;
      this.title.label = this.labelProvider.getName(this.resourceUri);
      this.title.iconClass = ModelFileType.getIconClass(this.fileType) ?? '';
      this.saveable = new ReverseCompositeSaveable(this, this.fileResourceResolver);
      this.initializeContent();
   }

   protected async initializeContent(): Promise<void> {
      const layout = (this.layout = new BoxLayout({ direction: 'top-to-bottom', spacing: 0 }));
      this.tabPanel = new TabPanel({ tabPlacement: 'bottom', tabsMovable: false });
      this.tabPanel.tabBar.addClass('theia-app-centers');
      BoxLayout.setStretch(this.tabPanel, 1);
      this.tabPanel.currentChanged.connect((_, event) => this.handleCurrentWidgetChanged(event));
      layout.addWidget(this.tabPanel);

      // create code editor first as Monaco has it's own version number management
      const codeWidget = await this.createCodeWidget(this.options);
      const version = monaco.editor.getModel(monaco.Uri.parse(this.options.uri))?.getVersionId() ?? 0;
      const options: CompositeWidgetOptions = { ...this.options, version };
      const primateWidget = await this.createPrimaryWidget(options);

      this.addWidget(primateWidget);
      this.addWidget(codeWidget);

      this.update();
   }

   protected addWidget(widget: Widget): void {
      this.tabPanel.addWidget(widget);
      const saveable = Saveable.get(widget);
      if (saveable) {
         this.saveable.add(saveable);
      }
   }

   getResourceUri(): URI {
      return new URI(this.options.uri);
   }

   protected override onAfterAttach(msg: Message): void {
      super.onAfterAttach(msg);
   }

   protected override onActivateRequest(msg: Message): void {
      super.onActivateRequest(msg);
      this.tabPanel.currentWidget?.activate();
   }

   protected handleCurrentWidgetChanged(event: TabPanel.ICurrentChangedArgs): void {
      // Forward focus state changes to the diagram widget
      if (event.previousWidget instanceof GLSPDiagramWidget && event.previousWidget.hasFocus) {
         event.previousWidget.actionDispatcher.dispatch(FocusStateChangedAction.create(false));
      } else if (event.currentWidget instanceof GLSPDiagramWidget && !event.currentWidget.hasFocus) {
         event.currentWidget.actionDispatcher.dispatch(FocusStateChangedAction.create(true));
      }
   }

   protected override onCloseRequest(msg: Message): void {
      this.tabPanel.widgets.forEach(widget => widget.close());
      super.onCloseRequest(msg);
      this.dispose();
   }

   protected createDiagramWidgetOptions(language: GLSPDiagramLanguage, label?: string): GLSPDiagramWidgetOptions {
      return {
         diagramType: language.diagramType,
         kind: 'navigatable',
         uri: this.uri,
         iconClass: language.iconClass ?? codiconCSSString('type-hierarchy-sub'),
         label: label ?? this.labelProvider.getName(this.resourceUri),
         editMode: 'editable'
      };
   }

   protected async createPrimaryWidget(options: CompositeWidgetOptions): Promise<Widget> {
      switch (this.fileType) {
         case 'Element':
            return this.createFormWidget(options);
         case 'Junction':
            return this.createFormWidget(options);
         case 'Relation':
            return this.createFormWidget(options);
         case 'Diagram':
            return this.createDiagramWidget();
      }
   }

   protected async createCodeWidget(options: CompositeWidgetOptions): Promise<Widget> {
      const codeWidget = await this.widgetManager.getOrCreateWidget<EditorPreviewWidget>(EditorPreviewWidgetFactory.ID, { ...options });
      codeWidget.title.label = 'Code Editor';
      codeWidget.title.iconClass = codiconCSSString('code');
      codeWidget.title.closable = false;
      return codeWidget;
   }

   protected async createFormWidget(options: CompositeWidgetOptions): Promise<Widget> {
      const formEditor = await this.widgetManager.getOrCreateWidget<FormEditorWidget>(FormEditorOpenHandler.ID, { ...options });
      formEditor.title.label = 'Form Editor';
      formEditor.title.iconClass = codiconCSSString('symbol-keyword');
      formEditor.title.closable = false;
      return formEditor;
   }

   protected async createDiagramWidget(): Promise<Widget> {
      const diagramOptions = this.createDiagramWidgetOptions(ArchiMateDiagramLanguage, 'Diagram Editor');
      const widget = await this.widgetManager.getOrCreateWidget<GLSPDiagramWidget>(ArchiMateDiagramManager.ID, diagramOptions);
      widget.title.closable = false;
      return widget;
   }

   getCodeWidget(): EditorWidget | undefined {
      return this.tabPanel.widgets.find<EditorWidget>(toTypeGuard(EditorWidget));
   }

   createMoveToUri(resourceUri: URI): URI | undefined {
      return resourceUri;
   }

   revealCodeTab(options: EditorOpenerOptions): void {
      const codeWidget = this.getCodeWidget();
      if (codeWidget) {
         this.tabPanel.currentWidget = codeWidget;
         this.editorManager.revealSelection(codeWidget, this.resourceUri, options);
      }
   }

   activeWidget(): Widget | undefined {
      return this.tabPanel.currentWidget ?? undefined;
   }
}
