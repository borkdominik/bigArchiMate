/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { ELEMENT_LABEL_TYPE, ELEMENT_NODE_TYPE, RELATION_EDGE_TYPE } from '@crossbreeze/protocol';
import {
   ContainerConfiguration,
   GLabelView,
   configureDefaultModelElements,
   configureModelElement,
   editLabelFeature,
   gridModule,
   initializeDiagramContainer,
   withEditLabelFeature
} from '@eclipse-glsp/client';
import { GLSPDiagramConfiguration } from '@eclipse-glsp/theia-integration';
import { Container } from '@theia/core/shared/inversify/index';
import { ArchiMateDiagramLanguage } from '../../common/crossmodel-diagram-language';
import { createCrossModelDiagramModule } from '../crossmodel-diagram-module';
import { archiMateEdgeCreationToolModule } from './edge-creation-tool/edge-creation-tool-module';
import { ElementNode, GEditableLabel, RelationEdge } from './model';
import { archiMateNodeCreationModule } from './node-creation-tool/node-creation-tool-module';
import { archiMateSelectModule } from './select-tool/select-tool-module';
import { ElementNodeView, RelationEdgeView } from './views';

export class ArchiMateDiagramConfiguration extends GLSPDiagramConfiguration {
   diagramType: string = ArchiMateDiagramLanguage.diagramType;

   configureContainer(container: Container, ...containerConfiguration: ContainerConfiguration): Container {
      return initializeDiagramContainer(
         container,
         {
            replace: archiMateSelectModule
         },
         ...containerConfiguration,
         gridModule,
         archiMateDiagramModule,
         archiMateNodeCreationModule,
         archiMateEdgeCreationToolModule
      );
   }
}

const archiMateDiagramModule = createCrossModelDiagramModule((bind, unbind, isBound, rebind) => {
   const context = { bind, unbind, isBound, rebind };

   // Use GLSP default model elements and their views
   // For example the model element with type 'node' (DefaultTypes.NODE) is represented by an SNode and rendered as RoundedCornerNodeView
   configureDefaultModelElements(context);

   // Bind views that can be rendered by the client-side
   // The glsp-server can send a request to render a specific view given a type, e.g. node:element
   // The model class holds the client-side model and properties
   // The view class shows how to draw the svg element given the properties of the model class
   configureModelElement(context, ELEMENT_NODE_TYPE, ElementNode, ElementNodeView, { enable: [withEditLabelFeature] });
   configureModelElement(context, RELATION_EDGE_TYPE, RelationEdge, RelationEdgeView);
   configureModelElement(context, ELEMENT_LABEL_TYPE, GEditableLabel, GLabelView, { enable: [editLabelFeature] });
});
