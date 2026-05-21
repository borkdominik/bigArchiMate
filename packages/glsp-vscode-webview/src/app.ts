import {
   ARCHIMATE_ELEMENT_TYPE_MAP,
   ARCHIMATE_JUNCTION_TYPE_MAP,
   ARCHIMATE_RELATION_TYPE_MAP,
   ELEMENT_ICON_TYPE,
   ELEMENT_LABEL_TYPE,
   GRID,
   getCornerType
} from '@big-archimate/protocol';
import {
   ConsoleLogger,
   ContainerConfiguration,
   DeleteElementContextMenuItemProvider,
   FeatureModule,
   GLabelView,
   GridSnapper,
   LogLevel,
   TYPES,
   bindAsService,
   bindOrRebind,
   configureDefaultModelElements,
   configureModelElement,
   editLabelFeature,
   gridModule,
   initializeDiagramContainer,
   withEditLabelFeature
} from '@eclipse-glsp/client';
import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';
import '@vscode/codicons/dist/codicon.css';
import '@big-archimate/core/style/icons.css';
import '@big-archimate/glsp-client/style/diagram.css';
import '@big-archimate/glsp-client/style/tool-palette.css';
import '@big-archimate/glsp-client/style/magic-edge-connector-palette.css';
import { Container } from 'inversify';

import { CutOffCornerNodeView } from '@big-archimate/glsp-client/lib/browser/archimate-diagram/cut-off-corner-view.js';
import { IconView } from '@big-archimate/glsp-client/lib/browser/archimate-diagram/icon-view.js';
import {
   ElementNode,
   GEditableLabel,
   Icon,
   JunctionNode,
   RelationEdge
} from '@big-archimate/glsp-client/lib/browser/archimate-diagram/model.js';
import {
   ElementNodeView,
   JunctionNodeView,
   RelationEdgeView
} from '@big-archimate/glsp-client/lib/browser/archimate-diagram/views.js';

const archiMateDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
   const context = { bind, unbind, isBound, rebind };
   rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
   rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
   rebind(TYPES.Grid).toConstantValue(GRID);
   bindOrRebind(context, TYPES.ISnapper).to(GridSnapper);
   bindAsService(context, TYPES.IContextMenuItemProvider, DeleteElementContextMenuItemProvider);

   configureDefaultModelElements(context);

   ARCHIMATE_ELEMENT_TYPE_MAP.values().forEach(nodeType => {
      const elementType = ARCHIMATE_ELEMENT_TYPE_MAP.getReverse(nodeType);
      const view = getCornerType(elementType) === 'diamond' ? CutOffCornerNodeView : ElementNodeView;
      configureModelElement(context, nodeType, ElementNode, view, { enable: [withEditLabelFeature] });
   });

   ARCHIMATE_RELATION_TYPE_MAP.values().forEach(edgeType => {
      configureModelElement(context, edgeType, RelationEdge, RelationEdgeView);
   });

   configureModelElement(context, 'magic-connector-edge', RelationEdge, RelationEdgeView);

   ARCHIMATE_JUNCTION_TYPE_MAP.values().forEach(junctionType => {
      configureModelElement(context, junctionType, JunctionNode, JunctionNodeView);
   });

   configureModelElement(context, ELEMENT_LABEL_TYPE, GEditableLabel, GLabelView, { enable: [editLabelFeature] });
   configureModelElement(context, ELEMENT_ICON_TYPE, Icon, IconView);
});

class ArchiMateGLSPStarter extends GLSPStarter {
   createContainer(...containerConfiguration: ContainerConfiguration): Container {
      const container = new Container();
      return initializeDiagramContainer(container, ...containerConfiguration, gridModule, archiMateDiagramModule);
   }
}

export function launch(): void {
   new ArchiMateGLSPStarter();
}
