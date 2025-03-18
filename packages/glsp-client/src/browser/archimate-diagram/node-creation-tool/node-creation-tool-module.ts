import { FeatureModule, NodeCreationTool, nodeCreationToolModule, viewportModule } from '@eclipse-glsp/client';
import { ArchiMateNodeCreationTool } from './archimate-node-creation-tool';

export const archiMateNodeCreationModule = new FeatureModule(
   (bind, unbind, isBound, rebind) => {
      const context = { bind, unbind, isBound, rebind };
      context.rebind(NodeCreationTool).to(ArchiMateNodeCreationTool).inSingletonScope();
   },
   { requires: [nodeCreationToolModule, viewportModule] }
);
