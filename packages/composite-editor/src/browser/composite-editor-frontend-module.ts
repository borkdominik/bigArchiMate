import { CustomWidgetOptions } from '@big-archimate/core/lib/browser';
import { FrontendApplicationContribution, OpenHandler, WidgetFactory } from '@theia/core/lib/browser';
import { ContainerModule } from '@theia/core/shared/inversify';
import { EditorPreviewManager } from '@theia/editor-preview/lib/browser/editor-preview-manager';
import { FileResourceResolver } from '@theia/filesystem/lib/browser';
import { CompositeEditor } from './composite-editor';
import { CompositeEditorOpenHandler, CompositeEditorOptions } from './composite-editor-open-handler';
import { CustomEditorPreviewManager } from './editor-manager';
import { CustomFileResourceResolver } from './file-resource-resolver';

export default new ContainerModule((bind, _unbind, _isBound, rebind) => {
   bind(CustomEditorPreviewManager).toSelf().inSingletonScope();
   rebind(EditorPreviewManager).toService(CustomEditorPreviewManager);

   bind(CompositeEditorOpenHandler).toSelf().inSingletonScope();
   bind(OpenHandler).toService(CompositeEditorOpenHandler);
   bind(FrontendApplicationContribution).toService(CompositeEditorOpenHandler);
   bind<WidgetFactory>(WidgetFactory).toDynamicValue(context => ({
      id: CompositeEditorOpenHandler.ID, // must match the id in the open handler
      createWidget: (options: CompositeEditorOptions) => {
         const container = context.container.createChild();
         container.bind(CustomWidgetOptions).toConstantValue(options);
         return container.resolve(CompositeEditor);
      }
   }));

   bind(CustomFileResourceResolver).toSelf().inSingletonScope();
   rebind(FileResourceResolver).toService(CustomFileResourceResolver);
});
