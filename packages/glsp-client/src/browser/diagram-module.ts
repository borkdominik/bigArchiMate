import { GRID } from '@big-archimate/protocol';
import {
   bindAsService,
   bindOrRebind,
   ConsoleLogger,
   GLSPMousePositionTracker,
   LogLevel,
   MetadataPlacer,
   MouseDeleteTool,
   ToolManager,
   ToolPalette,
   TYPES
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
import { TYPES as SPROTTY_TYPES } from 'sprotty';
import { LibavoidDiamondAnchor, LibavoidEllipseAnchor, LibavoidRectangleAnchor, LibavoidRouter, RouteType } from 'sprotty-routing-libavoid';
import { ArchimateMagicEdgeConnectorPalette } from './archimate-magic-edge-connector-palette';

export function createDiagramModule(registry: interfaces.ContainerModuleCallBack): ContainerModule {
   return new ContainerModule((bind, unbind, isBound, rebind, unbindAsync, onActivation, onDeactivation) => {
      const context = { bind, unbind, isBound, rebind };
      rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
      rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
      rebind(TYPES.Grid).toConstantValue(GRID);
      bind(CustomToolPalette).toSelf().inSingletonScope();
      bind(ArchimateMagicEdgeConnectorPalette).toSelf().inSingletonScope();
      bind(CustomMouseDeleteTool).toSelf().inSingletonScope();
      bind(TYPES.IUIExtension).toService(ArchimateMagicEdgeConnectorPalette);
      rebind(MouseDeleteTool).toService(CustomMouseDeleteTool);
      rebind(ToolPalette).toService(CustomToolPalette);
      bindAsService(context, GlspSelectionDataService, SelectionDataService);
      bindAsService(context, TYPES.IDiagramStartup, DiagramStartup);
      // --- libavoid routing ---
      bind(LibavoidRouter)
         .toSelf()
         .inSingletonScope()
         .onActivation((_ctx, router) => {
            router.setOptions({
               routingType: RouteType.Orthogonal,
               segmentPenalty: 50,
               idealNudgingDistance: 24,
               shapeBufferDistance: 25,
               nudgeOrthogonalSegmentsConnectedToShapes: true,
               nudgeOrthogonalTouchingColinearSegments: false
            });
            return router;
         });
      bind(SPROTTY_TYPES.IEdgeRouter).toService(LibavoidRouter);
      bind(SPROTTY_TYPES.IAnchorComputer).to(LibavoidDiamondAnchor).inSingletonScope();
      bind(SPROTTY_TYPES.IAnchorComputer).to(LibavoidEllipseAnchor).inSingletonScope();
      bind(SPROTTY_TYPES.IAnchorComputer).to(LibavoidRectangleAnchor).inSingletonScope();

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
