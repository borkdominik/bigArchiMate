import { FeatureModule, TYPES, edgeCreationToolModule, viewportModule } from '@eclipse-glsp/client';
import { ArchiMateMagicConnectorTool } from './archimate-magic-connector-tool';

export const archiMateMagicConnectorToolModule = new FeatureModule(
   bind => {
      bind(ArchiMateMagicConnectorTool).toSelf().inSingletonScope();
      bind(TYPES.ITool).toService(ArchiMateMagicConnectorTool);
   },
   { requires: [edgeCreationToolModule, viewportModule] }
);
