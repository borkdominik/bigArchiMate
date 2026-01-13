import { injectable } from 'inversify';
import {
   MaybePromise,
   PaletteItem,
   TriggerEdgeCreationAction,
   ContextActionsProvider,
   EditorContext
} from '@eclipse-glsp/server';
import {
   ARCHIMATE_RELATION_TYPE_MAP,
   getIcon,
   getLabel,
   getSpecificationSection,
   RelationType,
   relationTypes
} from '@big-archimate/protocol';

export const MAGIC_CONNECTOR_CONTEXT_ID = 'archimate.magic-edge-connector';

@injectable()
export class ArchiMateMagicEdgeConnectorPaletteProvider implements ContextActionsProvider {
   readonly contextId = MAGIC_CONNECTOR_CONTEXT_ID;

   getActions(editorContext: EditorContext): MaybePromise<PaletteItem[]> {
      const args = (editorContext.args ?? {}) as Partial<{ sourceId: string; targetId: string }>;
      const sourceId = args.sourceId;
      const targetId = args.targetId;
      console.log('MagicEdgeConnectorPaletteProvider getActions for sourceId:', sourceId, 'targetId:', targetId);

      // TODO: filtering
      return this.getItems();
   }

   getItems(): MaybePromise<PaletteItem[]> {
      return [...relationTypes.map(relationType => this.getRelationPaletteItem(relationType, 'B'))];
   }

   /**
    * Returns a palette item for the given relation type.
    * @param relationType The relation type.
    * @param groupSortString The sort string of the group.
    * @returns The palette item.
    */
   getRelationPaletteItem = (relationType: RelationType, groupSortString: string): PaletteItem => ({
      id: `${relationType}-create-tool`,
      sortString: `${groupSortString}-${getSpecificationSection(relationType)}`,
      label: `${getLabel(relationType)}`,
      icon: getIcon(relationType),
      actions: [TriggerEdgeCreationAction.create(ARCHIMATE_RELATION_TYPE_MAP.get(relationType), { args: { type: 'create' } })]
   });
}
