import {
   FeatureModule,
   RankedSelectMouseListener,
   SelectAllCommand,
   SelectCommand,
   SelectFeedbackCommand,
   TYPES,
   bindAsService,
   configureCommand,
   selectModule
} from '@eclipse-glsp/client';
import { ArchiMateSelectTool } from './select-tool';

export const archiMateSelectModule = new FeatureModule(
   (bind, _unbind, isBound) => {
      const context = { bind, isBound };
      configureCommand(context, SelectCommand);
      configureCommand(context, SelectAllCommand);
      configureCommand(context, SelectFeedbackCommand);
      bindAsService(context, TYPES.IDefaultTool, ArchiMateSelectTool);
      bind(RankedSelectMouseListener).toSelf().inSingletonScope();
   },
   { featureId: selectModule.featureId }
);
