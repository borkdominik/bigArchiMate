import {
   ARCHIMATE_ELEMENT_TYPE_MAP,
   ARCHIMATE_JUNCTION_TYPE_MAP,
   ARCHIMATE_RELATION_TYPE_MAP,
   ELEMENT_ICON_TYPE,
   ELEMENT_LABEL_TYPE,
   getCornerType
} from '@big-archimate/protocol';
import {
   bindAsService,
   bindOrRebind,
   configureDefaultModelElements,
   configureModelElement,
   ContainerConfiguration,
   DeleteElementContextMenuItemProvider,
   editLabelFeature,
   GLabelView,
   gridModule,
   GridSnapper,
   initializeDiagramContainer,
   TYPES,
   withEditLabelFeature
} from '@eclipse-glsp/client';
import { GLSPDiagramConfiguration } from '@eclipse-glsp/theia-integration';
import { Container } from '@theia/core/shared/inversify/index';
import { ArchiMateDiagramLanguage } from '../../common/diagram-language';
import { createDiagramModule } from '../diagram-module';
import { CutOffCornerNodeView } from './cut-off-corner-view';
import { archiMateEdgeCreationToolModule } from './edge-creation-tool/edge-creation-tool-module';
import { IconView } from './icon-view';
import { ElementNode, GEditableLabel, Icon, JunctionNode, RelationEdge } from './model';
import { archiMateNodeCreationModule } from './node-creation-tool/node-creation-tool-module';
import { archiMateSelectModule } from './select-tool/select-tool-module';
import { ElementNodeView, JunctionNodeView, RelationEdgeView } from './views';

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
         diagramModule,
         archiMateNodeCreationModule,
         archiMateEdgeCreationToolModule
      );
   }
}

const diagramModule = createDiagramModule((bind, unbind, isBound, rebind) => {
   const context = { bind, unbind, isBound, rebind };

   // Use GLSP default model elements and their views
   // For example the model element with type 'node' (DefaultTypes.NODE) is represented by an SNode and rendered as RoundedCornerNodeView
   configureDefaultModelElements(context);
   bindOrRebind(context, TYPES.ISnapper).to(GridSnapper);
   bindAsService(context, TYPES.IContextMenuItemProvider, DeleteElementContextMenuItemProvider);

   // Bind views that can be rendered by the client-side
   // The glsp-server can send a request to render a specific view given a type, e.g. node:element
   // The model class holds the client-side model and properties
   // The view class shows how to draw the svg belement given the properties of the model class

   ARCHIMATE_ELEMENT_TYPE_MAP.values().forEach(nodeType => {
      const elementType = ARCHIMATE_ELEMENT_TYPE_MAP.getReverse(nodeType);

      if (getCornerType(elementType) === 'diamond') {
         configureModelElement(context, nodeType, ElementNode, CutOffCornerNodeView, { enable: [withEditLabelFeature] });
      } else {
         configureModelElement(context, nodeType, ElementNode, ElementNodeView, { enable: [withEditLabelFeature] });
      }
   });

   ARCHIMATE_RELATION_TYPE_MAP.values().forEach(edgeType => {
      configureModelElement(context, edgeType, RelationEdge, RelationEdgeView);
   });

   ARCHIMATE_JUNCTION_TYPE_MAP.values().forEach(junctionType => {
      configureModelElement(context, junctionType, JunctionNode, JunctionNodeView);
   });

   configureModelElement(context, ELEMENT_LABEL_TYPE, GEditableLabel, GLabelView, { enable: [editLabelFeature] });
   configureModelElement(context, ELEMENT_ICON_TYPE, Icon, IconView);
});
