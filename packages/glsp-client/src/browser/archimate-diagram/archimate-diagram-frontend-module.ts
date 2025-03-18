import {
   ContainerContext,
   DiagramConfiguration,
   GLSPClientContribution,
   GLSPDiagramWidget,
   GLSPTheiaFrontendModule,
   registerDiagramManager
} from '@eclipse-glsp/theia-integration';

import { ArchiMateDiagramLanguage } from '../../common/crossmodel-diagram-language';
import { CrossModelClientContribution } from '../crossmodel-client-contribution';
import { ArchiMateDiagramConfiguration } from './archimate-diagram-configuration';
import { ArchiMateDiagramManager } from './archimate-diagram-manager';
import { ArchiMateDiagramWidget } from './archimate-diagram-widget';

export class ArchiMateDiagramModule extends GLSPTheiaFrontendModule {
   protected override enableCopyPaste = true;
   readonly diagramLanguage = ArchiMateDiagramLanguage;

   bindDiagramConfiguration(context: ContainerContext): void {
      context.bind(DiagramConfiguration).to(ArchiMateDiagramConfiguration);
   }

   override bindGLSPClientContribution(context: ContainerContext): void {
      // override client contribution to delay Theia frontend-backend connection for GLSP (see comments in contribution)
      context.bind(CrossModelClientContribution).toSelf().inSingletonScope();
      context.bind(GLSPClientContribution).toService(CrossModelClientContribution);
   }

   override bindDiagramWidgetFactory(context: ContainerContext): void {
      super.bindDiagramWidgetFactory(context);
      context.rebind(GLSPDiagramWidget).to(ArchiMateDiagramWidget);
   }

   override configureDiagramManager(context: ContainerContext): void {
      context.bind(ArchiMateDiagramManager).toSelf().inSingletonScope();
      registerDiagramManager(context.bind, ArchiMateDiagramManager, false);
   }
}

export default new ArchiMateDiagramModule();
