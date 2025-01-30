/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { ARCHIMATE_EDGE_TYPE_MAP, ARCHIMATE_NODE_TYPE_MAP, ELEMENT_ICON_TYPE, ELEMENT_LABEL_TYPE } from '@crossbreeze/protocol';
import {
   configureDefaultModelElements,
   configureModelElement,
   ContainerConfiguration,
   editLabelFeature,
   GLabelView,
   gridModule,
   initializeDiagramContainer,
   withEditLabelFeature
} from '@eclipse-glsp/client';
import { GLSPDiagramConfiguration } from '@eclipse-glsp/theia-integration';
import { Container } from '@theia/core/shared/inversify/index';
import { ArchiMateDiagramLanguage } from '../../common/crossmodel-diagram-language';
import { createCrossModelDiagramModule } from '../crossmodel-diagram-module';
import { CutOffCornerNodeView } from './cut-off-corner-view';
import { archiMateEdgeCreationToolModule } from './edge-creation-tool/edge-creation-tool-module';
import { IconView } from './icon-view';
import { ElementNode, GEditableLabel, Icon, RelationEdge } from './model';
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

const diamondConcepts = [
   'Assessment',
   'Constraint',
   'Driver',
   'Goal',
   'Meaning',
   'Outcome',
   'Principle',
   'Requirement',
   'Stakeholder',
   'Value'
];

const archiMateDiagramModule = createCrossModelDiagramModule((bind, unbind, isBound, rebind) => {
   const context = { bind, unbind, isBound, rebind };

   // Use GLSP default model elements and their views
   // For example the model element with type 'node' (DefaultTypes.NODE) is represented by an SNode and rendered as RoundedCornerNodeView
   configureDefaultModelElements(context);

   // Bind views that can be rendered by the client-side
   // The glsp-server can send a request to render a specific view given a type, e.g. node:element
   // The model class holds the client-side model and properties
   // The view class shows how to draw the svg element given the properties of the model class

   ARCHIMATE_NODE_TYPE_MAP.values().forEach(nodeType => {
      const concept = ARCHIMATE_NODE_TYPE_MAP.getReverse(nodeType);

      if (diamondConcepts.includes(concept)) {
         configureModelElement(context, nodeType, ElementNode, CutOffCornerNodeView, { enable: [withEditLabelFeature] });
      } else {
         // fallback: normal corner view
         configureModelElement(context, nodeType, ElementNode, ElementNodeView, { enable: [withEditLabelFeature] });
      }
   });

   ARCHIMATE_EDGE_TYPE_MAP.values().forEach(edgeType => {
      configureModelElement(context, edgeType, RelationEdge, RelationEdgeView);
   });

   configureModelElement(context, ELEMENT_LABEL_TYPE, GEditableLabel, GLabelView, { enable: [editLabelFeature] });
   configureModelElement(context, ELEMENT_ICON_TYPE, Icon, IconView);
});
