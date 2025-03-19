import { MenuContribution } from '@theia/core';
import { LabelProviderContribution } from '@theia/core/lib/browser';
import { ContainerModule } from '@theia/core/shared/inversify';
import { SaveFileDialog, SaveFileDialogFactory, SaveFileDialogProps } from '@theia/filesystem/lib/browser';
import { FileNavigatorWidget, NavigatorTreeDecorator } from '@theia/navigator/lib/browser';
import { FileNavigatorContribution } from '@theia/navigator/lib/browser/navigator-contribution';
import { WorkspaceCommandContribution } from '@theia/workspace/lib/browser/workspace-commands';
import '../../style/icons.css';
import '../../style/index.css';
import { createCrossModelFileNavigatorWidget } from './file-navigator-tree-widget';
import { CustomLabelProvider } from './label-provider';
import { CrossModelFileNavigatorContribution, CrossModelWorkspaceContribution } from './new-element-contribution';
import { createCrossModelSaveFileDialogContainer } from './save-file-dialog';

export default new ContainerModule((bind, _unbind, _isBound, rebind) => {
   bind(CrossModelWorkspaceContribution).toSelf().inSingletonScope();
   rebind(WorkspaceCommandContribution).toService(CrossModelWorkspaceContribution);
   bind(MenuContribution).toService(CrossModelWorkspaceContribution);

   bind(CrossModelFileNavigatorContribution).toSelf().inSingletonScope();
   rebind(FileNavigatorContribution).toService(CrossModelFileNavigatorContribution);

   rebind(FileNavigatorWidget).toDynamicValue(ctx => createCrossModelFileNavigatorWidget(ctx.container));
   bind(CustomLabelProvider).toSelf().inSingletonScope();
   bind(LabelProviderContribution).toService(CustomLabelProvider);
   bind(NavigatorTreeDecorator).toService(CustomLabelProvider);

   rebind(SaveFileDialogFactory).toFactory(
      ctx => (props: SaveFileDialogProps) => createCrossModelSaveFileDialogContainer(ctx.container, props).get(SaveFileDialog)
   );
});
