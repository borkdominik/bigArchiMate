/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { ARCHIMATE_EDGE_TYPE_MAP, ARCHIMATE_NODE_TYPE_MAP } from '@crossbreeze/protocol';
import { DiagramConfiguration, ServerLayoutKind, getDefaultMapping } from '@eclipse-glsp/server';
import { injectable } from 'inversify';

@injectable()
export class ArchiMateDiagramConfiguration implements DiagramConfiguration {
   layoutKind = ServerLayoutKind.MANUAL; // we store layout information manually so no automatic layouting is necessary
   needsClientLayout = true; // require layout information from client
   animatedUpdate = true; // use animations during state updates

   typeMapping = getDefaultMapping();

   shapeTypeHints = [
      ...Object.values(ARCHIMATE_NODE_TYPE_MAP).map(nodeType => ({
         elementTypeId: nodeType,
         deletable: true,
         reparentable: false,
         repositionable: true,
         resizable: true
      }))
   ];

   edgeTypeHints = [
      ...ARCHIMATE_EDGE_TYPE_MAP.values().map(edgeType => ({
         elementTypeId: edgeType,
         deletable: true,
         repositionable: false,
         routable: false,
         sourceElementTypeIds: [...ARCHIMATE_NODE_TYPE_MAP.values()],
         targetElementTypeIds: [...ARCHIMATE_NODE_TYPE_MAP.values()],
         dynamic: true
      }))
   ];
}
