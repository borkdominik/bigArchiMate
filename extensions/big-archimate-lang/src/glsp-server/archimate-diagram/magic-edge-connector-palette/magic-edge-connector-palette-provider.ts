import { injectable } from 'inversify';
import { MaybePromise, ToolPaletteItemProvider, PaletteItem, TriggerEdgeCreationAction } from '@eclipse-glsp/server';
import {
   ARCHIMATE_RELATION_TYPE_MAP,
   getIcon,
   getLabel,
   getSpecificationSection,
   RelationType,
   relationTypes
} from '@big-archimate/protocol';

@injectable()
export class ArchiMateMagicEdgeConnectorPaletteProvider extends ToolPaletteItemProvider {
   override getItems(): MaybePromise<PaletteItem[]> {
      return [
         ...relationTypes.map(relationType => this.getRelationPaletteItem(relationType, 'B'))
      ];
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
