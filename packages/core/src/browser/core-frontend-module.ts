import { MenuContribution } from '@theia/core';
import { LabelProviderContribution } from '@theia/core/lib/browser';
import { ContainerModule } from '@theia/core/shared/inversify';
import { SaveFileDialog, SaveFileDialogFactory, SaveFileDialogProps } from '@theia/filesystem/lib/browser';
import { FileNavigatorWidget, NavigatorTreeDecorator } from '@theia/navigator/lib/browser';
import { FileNavigatorContribution } from '@theia/navigator/lib/browser/navigator-contribution';
import { WorkspaceCommandContribution } from '@theia/workspace/lib/browser/workspace-commands';
import '../../style/icons.css';
import '../../style/index.css';
import { createFileNavigatorWidget } from './file-navigator-tree-widget';
import { CustomLabelProvider } from './label-provider';
import { CustomFileNavigatorContribution, CustomWorkspaceCommandContribution } from './new-file-contribution';
import { createCustomSaveFileDialogContainer } from './save-file-dialog';

export default new ContainerModule((bind, _unbind, _isBound, rebind) => {
   bind(CustomWorkspaceCommandContribution).toSelf().inSingletonScope();
   rebind(WorkspaceCommandContribution).toService(CustomWorkspaceCommandContribution);
   bind(MenuContribution).toService(CustomWorkspaceCommandContribution);

   bind(CustomFileNavigatorContribution).toSelf().inSingletonScope();
   rebind(FileNavigatorContribution).toService(CustomFileNavigatorContribution);

   rebind(FileNavigatorWidget).toDynamicValue(ctx => createFileNavigatorWidget(ctx.container));
   bind(CustomLabelProvider).toSelf().inSingletonScope();
   bind(LabelProviderContribution).toService(CustomLabelProvider);
   bind(NavigatorTreeDecorator).toService(CustomLabelProvider);

   rebind(SaveFileDialogFactory).toFactory(
      ctx => (props: SaveFileDialogProps) => createCustomSaveFileDialogContainer(ctx.container, props).get(SaveFileDialog)
   );
});
