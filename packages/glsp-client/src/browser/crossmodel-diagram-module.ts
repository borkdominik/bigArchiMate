import { GRID } from '@crossbreeze/protocol';
import {
   ConsoleLogger,
   GLSPMousePositionTracker,
   GlspCommandPalette,
   LogLevel,
   MetadataPlacer,
   MouseDeleteTool,
   TYPES,
   ToolManager,
   ToolPalette,
   bindAsService,
   bindOrRebind
} from '@eclipse-glsp/client';
import { GlspSelectionDataService } from '@eclipse-glsp/theia-integration';
import { ContainerModule, injectable, interfaces } from '@theia/core/shared/inversify';
import { CmMetadataPlacer } from './cm-metadata-placer';
import { CommandPalette } from './command-palette';
import { CrossModelMouseDeleteTool } from './cross-model-delete-tool';
import { CrossModelDiagramStartup } from './cross-model-diagram-startup';
import { CrossModelErrorExtension } from './cross-model-error-extension';
import { CrossModelToolPalette } from './cross-model-tool-palette';
import { CrossModelGLSPSelectionDataService } from './crossmodel-selection-data-service';
import { MousePositionTracker } from './mouse-position-tracker';

export function createCrossModelDiagramModule(registry: interfaces.ContainerModuleCallBack): ContainerModule {
   return new ContainerModule((bind, unbind, isBound, rebind, unbindAsync, onActivation, onDeactivation) => {
      const context = { bind, unbind, isBound, rebind };
      rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
      rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
      rebind(TYPES.Grid).toConstantValue(GRID);
      bind(CrossModelToolPalette).toSelf().inSingletonScope();
      bind(CrossModelMouseDeleteTool).toSelf().inSingletonScope();
      rebind(MouseDeleteTool).toService(CrossModelMouseDeleteTool);
      rebind(ToolPalette).toService(CrossModelToolPalette);
      bindAsService(context, GlspSelectionDataService, CrossModelGLSPSelectionDataService);
      bindAsService(context, TYPES.IDiagramStartup, CrossModelDiagramStartup);
      registry(bind, unbind, isBound, rebind, unbindAsync, onActivation, onDeactivation);
      bind(CommandPalette).toSelf().inSingletonScope();
      rebind(GlspCommandPalette).toService(CommandPalette);

      bind(MousePositionTracker).toSelf().inSingletonScope();
      bindOrRebind(context, GLSPMousePositionTracker).toService(MousePositionTracker);

      bind(CrossModelToolManager).toSelf().inSingletonScope();
      bindOrRebind(context, TYPES.IToolManager).toService(CrossModelToolManager);

      bindAsService(bind, TYPES.IUIExtension, CrossModelErrorExtension);
      rebind(MetadataPlacer).to(CmMetadataPlacer).inSingletonScope();
   });
}

@injectable()
export class CrossModelToolManager extends ToolManager {
   override enableDefaultTools(): void {
      super.enableDefaultTools();
      // since setting the _defaultToolsEnabled flag to true will short-circuit the enableDefaultTools method
      // we only set it to true if truly all default tools are enabled
      this._defaultToolsEnabled = this.activeTools.length === this.defaultTools.length;
   }
}
