import { GRID } from '@big-archimate/protocol';
import {
   ConsoleLogger,
   GLSPMousePositionTracker,
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
import { CustomMouseDeleteTool } from './delete-tool';
import { DiagramStartup } from './diagram-startup';
import { ErrorExtension } from './error-extension';
import { CustomMetadataPlacer } from './metadata-placer';
import { MousePositionTracker } from './mouse-position-tracker';
import { SelectionDataService } from './selection-data-service';
import { CustomToolPalette } from './tool-palette';

export function createDiagramModule(registry: interfaces.ContainerModuleCallBack): ContainerModule {
   return new ContainerModule((bind, unbind, isBound, rebind, unbindAsync, onActivation, onDeactivation) => {
      const context = { bind, unbind, isBound, rebind };
      rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
      rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
      rebind(TYPES.Grid).toConstantValue(GRID);
      bind(CustomToolPalette).toSelf().inSingletonScope();
      bind(CustomMouseDeleteTool).toSelf().inSingletonScope();
      rebind(MouseDeleteTool).toService(CustomMouseDeleteTool);
      rebind(ToolPalette).toService(CustomToolPalette);
      bindAsService(context, GlspSelectionDataService, SelectionDataService);
      bindAsService(context, TYPES.IDiagramStartup, DiagramStartup);
      registry(bind, unbind, isBound, rebind, unbindAsync, onActivation, onDeactivation);
      // bind(CustomCommandPalette).toSelf().inSingletonScope();
      // rebind(GlspCommandPalette).toService(CustomCommandPalette);

      bind(MousePositionTracker).toSelf().inSingletonScope();
      bindOrRebind(context, GLSPMousePositionTracker).toService(MousePositionTracker);

      bind(CustomToolManager).toSelf().inSingletonScope();
      bindOrRebind(context, TYPES.IToolManager).toService(CustomToolManager);

      bindAsService(bind, TYPES.IUIExtension, ErrorExtension);
      rebind(MetadataPlacer).to(CustomMetadataPlacer).inSingletonScope();
   });
}

@injectable()
export class CustomToolManager extends ToolManager {
   override enableDefaultTools(): void {
      super.enableDefaultTools();
      // since setting the _defaultToolsEnabled flag to true will short-circuit the enableDefaultTools method
      // we only set it to true if truly all default tools are enabled
      this._defaultToolsEnabled = this.activeTools.length === this.defaultTools.length;
   }
}
