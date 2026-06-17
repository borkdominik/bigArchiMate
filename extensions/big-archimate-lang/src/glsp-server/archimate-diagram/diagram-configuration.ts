import {
   ARCHIMATE_ELEMENT_TYPE_MAP,
   ARCHIMATE_JUNCTION_TYPE_MAP,
   ARCHIMATE_NODE_TYPE_MAP,
   ARCHIMATE_RELATION_TYPE_MAP
} from '@big-archimate/protocol';
import { DiagramConfiguration, ServerLayoutKind, getDefaultMapping } from '@eclipse-glsp/server';
import { injectable } from 'inversify';

const GROUPING_NODE_TYPE = ARCHIMATE_ELEMENT_TYPE_MAP.get('Grouping')!;

@injectable()
export class ArchiMateDiagramConfiguration implements DiagramConfiguration {
   layoutKind = ServerLayoutKind.MANUAL; // we store layout information manually so no automatic layouting is necessary
   needsClientLayout = true; // require layout information from client
   animatedUpdate = true; // use animations during state updates

   typeMapping = getDefaultMapping();

   shapeTypeHints = [
      ...ARCHIMATE_NODE_TYPE_MAP.values().map(nodeType => {
         const isGrouping = nodeType === GROUPING_NODE_TYPE;
         return {
            elementTypeId: nodeType,
            deletable: true,
            reparentable: !isGrouping,
            repositionable: true,
            resizable: true,
            ...(isGrouping && {
               containableElementTypeIds: [
                  ...[...ARCHIMATE_NODE_TYPE_MAP.values()].filter(t => t !== GROUPING_NODE_TYPE),
                  ...ARCHIMATE_JUNCTION_TYPE_MAP.values()
               ]
            })
         };
      })
   ];

   edgeTypeHints = [
      ...ARCHIMATE_RELATION_TYPE_MAP.values().map(edgeType => ({
         elementTypeId: edgeType,
         deletable: true,
         repositionable: false,
         routable: true,
         sourceElementTypeIds: [...ARCHIMATE_NODE_TYPE_MAP.values()],
         targetElementTypeIds: [...ARCHIMATE_NODE_TYPE_MAP.values()],
         dynamic: true
      }))
   ];
}
