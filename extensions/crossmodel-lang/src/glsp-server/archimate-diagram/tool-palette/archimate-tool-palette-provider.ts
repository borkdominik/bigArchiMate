/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/
import {
   activateDefaultToolsAction,
   activateDeleteToolAction,
   ARCHIMATE_CONCEPT_TYPE_MAP,
   ARCHIMATE_ELEMENT_TYPE_MAP,
   ARCHIMATE_RELATION_TYPE_MAP,
   getChildren,
   getIcon,
   getLabel,
   getSpecificationSection,
   LayerType,
   relationTypes,
   toKebabCase
} from '@crossbreeze/protocol';
import {
   Args,
   MaybePromise,
   PaletteItem,
   ToolPaletteItemProvider,
   TriggerEdgeCreationAction,
   TriggerNodeCreationAction
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { ElementType, RelationType } from '../../../language-server/generated/ast.js';
import { getObjectKeys } from '../../../util.js';

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
            id: 'hide-tool',
            sortString: 'AC',
            label: 'Delete from Model',
            icon: 'trash',
            actions: [activateDeleteToolAction()]
         },
         {
            id: 'relations-group',
            sortString: 'B',
            label: 'Relationship',
            children: [...relationTypes.map(relationType => getRelationPaletteItem(relationType, 'B')), getJunctionPaletteItem('B')],
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
 * @param groupSortString The sort string of the group.
 * @returns The palette item.
 */
const getJunctionPaletteItem = (groupSortString: string): PaletteItem => ({
   id: 'junction-create-tool',
   sortString: `${groupSortString}-${getSpecificationSection('Junction')}`,
   label: `${getLabel('Junction')}`,
   icon: getIcon('Junction'),
   actions: [TriggerNodeCreationAction.create(ARCHIMATE_CONCEPT_TYPE_MAP.get('Junction'), { args: { type: 'create' } })]
});

/**
 * Returns a palette item for the given layer.
 * @param layerType The group.
 * @param groupSortString The sort string of the layer.
 * @returns The palette item.
 */
const getElementGroupPaletteItem = (layerType: LayerType, groupSortString: string): PaletteItem => ({
   id: `${toKebabCase(layerType)}-group`,
   sortString: `${groupSortString}`,
   label: getLabel(layerType),
   children: (() => getObjectKeys(getChildren(layerType)).map(elementType => getElementPaletteItem(elementType, groupSortString)))(),
   actions: []
});
