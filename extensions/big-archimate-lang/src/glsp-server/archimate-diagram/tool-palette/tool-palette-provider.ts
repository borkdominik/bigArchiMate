import {
   activateDefaultToolsAction,
   activateDeleteToolAction,
   ARCHIMATE_ELEMENT_TYPE_MAP,
   ARCHIMATE_JUNCTION_TYPE_MAP,
   ARCHIMATE_RELATION_TYPE_MAP,
   getChildren,
   getIcon,
   getLabel,
   getObjectKeys,
   getSpecificationSection,
   junctionTypes,
   LayerType,
   relationTypes,
   toKebabCase
} from '@big-archimate/protocol';
import {
   Args,
   MaybePromise,
   PaletteItem,
   ToolPaletteItemProvider,
   TriggerEdgeCreationAction,
   TriggerNodeCreationAction
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { ElementType, JunctionType, RelationType } from '../../../language-server/generated/ast.js';

@injectable()
export class ArchiMateToolPaletteProvider extends ToolPaletteItemProvider {
   override getItems(_args?: Args | undefined): MaybePromise<PaletteItem[]> {
      return [
         {
            id: 'default-tool',
            sortString: 'A',
            label: 'Select & Move',
            icon: 'inspect',
            actions: [activateDefaultToolsAction()]
         },
         {
            id: 'hide-tool',
            sortString: 'AB',
            label: 'Delete from View',
            icon: 'close',
            actions: [activateDeleteToolAction()]
         },
         {
            id: 'relations-group',
            icon: 'chevron-down',
            sortString: 'B',
            label: 'Relationship',
            children: [
               {
                  id: 'magic-connector-tool',
                  sortString: '0',
                  label: 'Magic Connector',
                  icon: 'wand',
                  actions: [TriggerEdgeCreationAction.create('magic-connector-edge', { args: { mode: 'magic' } })]
               },
               ...relationTypes.map(relationType => getRelationPaletteItem(relationType, 'B')),
               ...junctionTypes.map(junctionType => getJunctionPaletteItem(junctionType, 'B'))
            ],
            actions: []
         },
         getElementGroupPaletteItem('Application', 'U'),
         getElementGroupPaletteItem('Business', 'V'),
         getElementGroupPaletteItem('ImplementationAndMigration', 'W'),
         getElementGroupPaletteItem('Motivation', 'X'),
         getElementGroupPaletteItem('Strategy', 'Y'),
         getElementGroupPaletteItem('Technology', 'Z'),
         getElementGroupPaletteItem('Other', 'ZA')
      ];
   }
}

/**
 * Returns a palette item for the given element type.
 * @param elementType The element type.
 * @param groupSortString The sort string of the group.
 * @returns The palette item.
 */
const getElementPaletteItem = (elementType: ElementType, groupSortString: string): PaletteItem => ({
   id: `${elementType}-create-tool`,
   sortString: `${groupSortString}-${getSpecificationSection(elementType)}`,
   label: getLabel(elementType),
   icon: getIcon(elementType),
   actions: [TriggerNodeCreationAction.create(ARCHIMATE_ELEMENT_TYPE_MAP.get(elementType), { args: { type: 'create' } })]
});

/**
 * Returns a palette item for the given relation type.
 * @param relationType The relation type.
 * @param groupSortString The sort string of the group.
 * @returns The palette item.
 */
const getRelationPaletteItem = (relationType: RelationType, groupSortString: string): PaletteItem => ({
   id: `${relationType}-create-tool`,
   sortString: `${groupSortString}-${getSpecificationSection(relationType)}`,
   label: `${getLabel(relationType)}`,
   icon: getIcon(relationType),
   actions: [TriggerEdgeCreationAction.create(ARCHIMATE_RELATION_TYPE_MAP.get(relationType), { args: { type: 'create' } })]
});

/**
 * Returns a palette item for a junction.
 * @param junctionType The junction type.
 * @param groupSortString The sort string of the group.
 * @returns The palette item.
 */
const getJunctionPaletteItem = (junctionType: JunctionType, groupSortString: string): PaletteItem => ({
   id: 'junction-create-tool',
   sortString: `${groupSortString}-${getSpecificationSection(junctionType)}`,
   label: `${getLabel(junctionType)}`,
   icon: getIcon(junctionType),
   actions: [TriggerNodeCreationAction.create(ARCHIMATE_JUNCTION_TYPE_MAP.get(junctionType), { args: { type: 'create' } })]
});

/**
 * Returns a palette item for the given layer.
 * @param layerType The group.
 * @param groupSortString The sort string of the layer.
 * @returns The palette item.
 */
const getElementGroupPaletteItem = (layerType: LayerType, groupSortString: string): PaletteItem => ({
   id: `${toKebabCase(layerType)}-group`,
   icon: 'chevron-down',
   sortString: `${groupSortString}`,
   label: getLabel(layerType),
   children: (() => getObjectKeys(getChildren(layerType)).map(elementType => getElementPaletteItem(elementType, groupSortString)))(),
   actions: []
});
