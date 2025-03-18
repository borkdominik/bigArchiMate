import { EdgeCreationTool, FeatureModule, edgeCreationToolModule, viewportModule } from '@eclipse-glsp/client';
import { ArchiMateEdgeCreationTool } from './archimate-edge-creation-tool';

export const archiMateEdgeCreationToolModule = new FeatureModule(
   (bind, unbind, isBound, rebind) => {
      const context = { bind, unbind, isBound, rebind };
      context.rebind(EdgeCreationTool).to(ArchiMateEdgeCreationTool).inSingletonScope();
   },
   { requires: [edgeCreationToolModule, viewportModule] }
);
