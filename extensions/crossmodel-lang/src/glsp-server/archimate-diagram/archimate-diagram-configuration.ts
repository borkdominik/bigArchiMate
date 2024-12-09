/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { ELEMENT_NODE_TYPE, RELATION_EDGE_TYPE } from '@crossbreeze/protocol';
import { DiagramConfiguration, ServerLayoutKind, getDefaultMapping } from '@eclipse-glsp/server';
import { injectable } from 'inversify';

@injectable()
export class ArchiMateDiagramConfiguration implements DiagramConfiguration {
   layoutKind = ServerLayoutKind.MANUAL; // we store layout information manually so no automatic layouting is necessary
   needsClientLayout = true; // require layout information from client
   animatedUpdate = true; // use animations during state updates

   typeMapping = getDefaultMapping();

   shapeTypeHints = [
      {
         elementTypeId: ELEMENT_NODE_TYPE,
         deletable: true,
         reparentable: false,
         repositionable: true,
         resizable: true
      }
   ];
   edgeTypeHints = [
      {
         elementTypeId: RELATION_EDGE_TYPE,
         deletable: true,
         repositionable: false,
         routable: false,
         sourceElementTypeIds: [ELEMENT_NODE_TYPE],
         targetElementTypeIds: [ELEMENT_NODE_TYPE]
      }
   ];
}
