/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/
import { activateDefaultToolsAction, ARCHIMATE_EDGE_TYPE_MAP, ARCHIMATE_NODE_TYPE_MAP } from '@crossbreeze/protocol';
import {
   Args,
   MaybePromise,
   PaletteItem,
   ToolPaletteItemProvider,
   TriggerEdgeCreationAction,
   TriggerNodeCreationAction
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { ElementLayer, ElementMetaData, elementMetadataMap, relationMetadataMap } from '../../../archimate-metadata.js';
import { ElementType, RelationType } from '../../../language-server/generated/ast.js';
import { toKebabCase } from '../../../util.js';

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
            id: 'relations-group',
            sortString: 'B',
            label: 'Relations',
            children: Object.keys(relationMetadataMap).map(relationType => getRelationPaletteItem(relationType as RelationType, 'B')),
            actions: []
         },
         getElementGroupPaletteItem('ApplicationLayer', 'U'),
         getElementGroupPaletteItem('BusinessLayer', 'V'),
         getElementGroupPaletteItem('ImplementationAndMigrationLayer', 'W'),
         getElementGroupPaletteItem('MotivationLayer', 'X'),
         getElementGroupPaletteItem('StrategyLayer', 'Y'),
         getElementGroupPaletteItem('TechnologyLayer', 'Z')
      ];
   }
}

/**
 * Returns a palette item for the given element type.
 * @param elementType The element type.
 * @param groupSortString The sort string of the group.
 * @returns The palette item.
 */
const getElementPaletteItem = (elementType: ElementType, groupSortString: string): PaletteItem => {
   const elementMetadata = elementMetadataMap[elementType];
   return {
      id: `${elementType}-create-tool`,
      sortString: `${groupSortString}-${elementMetadata.specificationSection}`,
      label: elementMetadata.label,
      icon: elementMetadata.icon,
      actions: [TriggerNodeCreationAction.create(ARCHIMATE_NODE_TYPE_MAP.get(elementType), { args: { type: 'create', elementType } })]
   };
};

/**
 * Returns a palette item for the given relation type.
 * @param relationType The relation type.
 * @param groupSortString The sort string of the group.
 * @returns The palette item.
 */
const getRelationPaletteItem = (relationType: RelationType, groupSortString: string): PaletteItem => {
   const relationMetadata = relationMetadataMap[relationType];
   return {
      id: `${relationType}-create-tool`,
      sortString: `${groupSortString}-${relationMetadata.specificationSection}`,
      label: `${relationMetadata.label} Relationship`,
      icon: relationMetadata.icon,
      actions: [TriggerEdgeCreationAction.create(ARCHIMATE_EDGE_TYPE_MAP.get(relationType), { args: { type: 'create', relationType } })]
   };
};

/**
 * Returns a palette item for the given group.
 * @param group The group.
 * @param groupSortString The sort string of the group.
 * @returns The palette item.
 */
const getElementGroupPaletteItem = (group: ElementLayer, groupSortString: string): PaletteItem => {
   const elementGroup = elementGroups[group];
   return {
      id: `${toKebabCase(group)}-group`,
      sortString: `${groupSortString}`,
      label: elementGroup.label,
      children: Object.keys(elementGroup.children).map(elementType => getElementPaletteItem(elementType as ElementType, groupSortString)),
      actions: []
   };
};

/**
 * Returns the elements that belong to the given group.
 * @param group The group.
 * @returns The elements that belong to the group.
 */
const getGroupElements = (group: ElementLayer): Partial<Record<ElementType, ElementMetaData>> => {
   const filtered: Partial<Record<ElementType, ElementMetaData>> = {};

   Object.entries(elementMetadataMap).forEach(([elementType, elementInfo]) => {
      if (elementInfo.layer === group) {
         filtered[elementType as ElementType] = elementInfo;
      }
   });

   return filtered;
};

/**
 * Information about a group.
 */
interface ElementGroupInfo {
   /**
    * The label to display for the group.
    */
   label: string;
   /**
    * The children elements of the group.
    */
   children: Partial<Record<ElementType, ElementMetaData>>;
}

/**
 * The groups and their children elements.
 */
const elementGroups: Record<ElementLayer, ElementGroupInfo> = {
   ApplicationLayer: {
      label: 'Application Layer',
      children: getGroupElements('ApplicationLayer')
   },
   BusinessLayer: {
      label: 'Business Layer',
      children: getGroupElements('BusinessLayer')
   },
   ImplementationAndMigrationLayer: {
      label: 'Implementation & Migration Layer',
      children: getGroupElements('ImplementationAndMigrationLayer')
   },
   MotivationLayer: {
      label: 'Motivation Layer',
      children: getGroupElements('MotivationLayer')
   },
   StrategyLayer: {
      label: 'Strategy Layer',
      children: getGroupElements('StrategyLayer')
   },
   TechnologyLayer: {
      label: 'Technology Layer',
      children: getGroupElements('TechnologyLayer')
   }
};
