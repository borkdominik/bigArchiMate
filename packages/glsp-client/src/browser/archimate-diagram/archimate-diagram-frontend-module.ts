/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import {
   ContainerContext,
   DiagramConfiguration,
   GLSPDiagramWidget,
   GLSPTheiaFrontendModule,
   registerDiagramManager
} from '@eclipse-glsp/theia-integration';

import { ArchiMateDiagramLanguage } from '../../common/crossmodel-diagram-language';
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
      // DO NOT BIND ANOTHER GLSP CLIENT CONTRIBUTION, WE ONLY NEED ONE PER SERVER AND WE DO IT IN THE SYSTEM DIAGRAM LANGUAGE
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
