/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/
import { ELEMENT_NODE_TYPE, RELATION_EDGE_TYPE, activateDefaultToolsAction, activateDeleteToolAction } from '@crossbreeze/protocol';
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

@injectable()
export class ArchiMateToolPaletteProvider extends ToolPaletteItemProvider {
   override getItems(_args?: Args | undefined): MaybePromise<PaletteItem[]> {
      return [
         {
            id: 'default-tool',
            sortString: '1',
            label: 'Select & Move',
            icon: 'inspect',
            actions: [activateDefaultToolsAction()]
         },
         {
            id: 'hide-tool',
            sortString: '2',
            label: 'Hide',
            icon: 'eye-closed',
            actions: [activateDeleteToolAction()]
         },
         {
            id: 'element-show-tool',
            sortString: '3',
            label: 'Show Element',
            icon: 'eye',
            actions: [TriggerNodeCreationAction.create(ELEMENT_NODE_TYPE, { args: { type: 'show' } })]
         },
         {
            id: 'relations-group',
            sortString: '4',
            label: 'Relations',
            children: Object.entries(relations).map(([relationType]) => getRelationPaletteItem(relationType as RelationType)),
            actions: []
         },
         getElementGroupPaletteItem('ApplicationLayer'),
         getElementGroupPaletteItem('BusinessLayer'),
         getElementGroupPaletteItem('ImplementationAndMigrationLayer'),
         getElementGroupPaletteItem('MotivationLayer'),
         getElementGroupPaletteItem('StrategyLayer'),
         getElementGroupPaletteItem('TechnologyLayer')
      ];
   }
}

/**
 * Information about a ArchiMate concept.
 */
interface ConceptInfo {
   /**
    * The icon to display for the element.
    */
   icon: string;
   /**
    * The label to display for the element.
    */
   label: string;
   /**
    * The specification section of the ArchiMate standard that describes the concept.
    * This is used to order the concepts in the tool palette according to the standard.
    */
   specificationSection: `${number}.${number}.${number}.`;
}

/**
 * Information about an element.
 */
interface ElementInfo extends ConceptInfo {
   /**
    * The group the element belongs to.
    */
   layer: ElementLayer;
}

/**
 * Information about an ArchiMate relation type.
 */
interface RelationInfo extends ConceptInfo {}

/**
 * The element layers in the ArchiMate standard.
 */
type ElementLayer =
   | 'ApplicationLayer'
   | 'BusinessLayer'
   | 'ImplementationAndMigrationLayer'
   | 'MotivationLayer'
   | 'StrategyLayer'
   | 'TechnologyLayer';

/**
 * A mapping of element types to their respective information.
 */
const elements: Record<ElementType, ElementInfo> = {
   ApplicationCollaboration: {
      icon: 'reactions',
      label: 'Application Collaboration',
      layer: 'ApplicationLayer',
      specificationSection: '9.2.2.'
   },
   ApplicationComponent: {
      icon: 'reactions',
      label: 'Application Component',
      layer: 'ApplicationLayer',
      specificationSection: '9.2.1.'
   },
   ApplicationEvent: {
      icon: 'reactions',
      label: 'Application Event',
      layer: 'ApplicationLayer',
      specificationSection: '9.3.4.'
   },
   ApplicationFunction: {
      icon: 'reactions',
      label: 'Application Function',
      layer: 'ApplicationLayer',
      specificationSection: '9.3.1.'
   },
   ApplicationInteraction: {
      icon: 'reactions',
      label: 'Application Interaction',
      layer: 'ApplicationLayer',
      specificationSection: '9.3.2.'
   },
   ApplicationInterface: {
      icon: 'reactions',
      label: 'Application Interface',
      layer: 'ApplicationLayer',
      specificationSection: '9.2.3.'
   },
   ApplicationProcess: {
      icon: 'reactions',
      label: 'Application Process',
      layer: 'ApplicationLayer',
      specificationSection: '9.3.3.'
   },
   ApplicationService: {
      icon: 'reactions',
      label: 'Application Service',
      layer: 'ApplicationLayer',
      specificationSection: '9.3.5.'
   },
   Artifact: {
      icon: 'reactions',
      label: 'Artifact',
      layer: 'TechnologyLayer',
      specificationSection: '10.4.1.'
   },
   Assessment: {
      icon: 'reactions',
      label: 'Assessment',
      layer: 'MotivationLayer',
      specificationSection: '6.2.3.'
   },
   BusinessActor: {
      icon: 'reactions',
      label: 'Business Actor',
      layer: 'BusinessLayer',
      specificationSection: '8.2.1.'
   },
   BusinessCollaboration: {
      icon: 'reactions',
      label: 'Business Collaboration',
      layer: 'BusinessLayer',
      specificationSection: '8.2.3.'
   },
   BusinessEvent: {
      icon: 'reactions',
      label: 'Business Event',
      layer: 'BusinessLayer',
      specificationSection: '8.3.4.'
   },
   BusinessFunction: {
      icon: 'reactions',
      label: 'Business Function',
      layer: 'BusinessLayer',
      specificationSection: '8.3.2.'
   },
   BusinessInteraction: {
      icon: 'reactions',
      label: 'Business Interaction',
      layer: 'BusinessLayer',
      specificationSection: '8.3.3.'
   },
   BusinessInterface: {
      icon: 'reactions',
      label: 'Business Interface',
      layer: 'BusinessLayer',
      specificationSection: '8.2.4.'
   },
   BusinessObject: {
      icon: 'reactions',
      label: 'Business Object',
      layer: 'BusinessLayer',
      specificationSection: '8.4.1.'
   },
   BusinessProcess: {
      icon: 'reactions',
      label: 'Business Process',
      layer: 'BusinessLayer',
      specificationSection: '8.3.1.'
   },
   BusinessRole: {
      icon: 'reactions',
      label: 'Business Role',
      layer: 'BusinessLayer',
      specificationSection: '8.2.2.'
   },
   BusinessService: {
      icon: 'reactions',
      label: 'Business Service',
      layer: 'BusinessLayer',
      specificationSection: '8.3.5.'
   },
   Capability: {
      icon: 'reactions',
      label: 'Capability',
      layer: 'StrategyLayer',
      specificationSection: '7.3.1.'
   },
   CommunicationNetwork: {
      icon: 'reactions',
      label: 'Communication Network',
      layer: 'TechnologyLayer',
      specificationSection: '10.2.7.'
   },
   Constraint: {
      icon: 'reactions',
      label: 'Constraint',
      layer: 'MotivationLayer',
      specificationSection: '6.3.5.'
   },
   Contract: {
      icon: 'reactions',
      label: 'Contract',
      layer: 'BusinessLayer',
      specificationSection: '8.4.2.'
   },
   CourseOfAction: {
      icon: 'reactions',
      label: 'Course of Action',
      layer: 'StrategyLayer',
      specificationSection: '7.3.3.'
   },
   DataObject: {
      icon: 'reactions',
      label: 'Data Object',
      layer: 'ApplicationLayer',
      specificationSection: '9.4.1.'
   },
   Deliverable: {
      icon: 'reactions',
      label: 'Deliverable',
      layer: 'ImplementationAndMigrationLayer',
      specificationSection: '12.2.2.'
   },
   Device: {
      icon: 'reactions',
      label: 'Device',
      layer: 'TechnologyLayer',
      specificationSection: '10.2.2.'
   },
   DistributionNetwork: {
      icon: 'reactions',
      label: 'Distribution Network',
      layer: 'TechnologyLayer',
      specificationSection: '10.6.3.'
   },
   Driver: {
      icon: 'reactions',
      label: 'Driver',
      layer: 'MotivationLayer',
      specificationSection: '6.2.2.'
   },
   Equipment: {
      icon: 'reactions',
      label: 'Equipment',
      layer: 'TechnologyLayer',
      specificationSection: '10.6.1.'
   },
   Facility: {
      icon: 'reactions',
      label: 'Facility',
      layer: 'TechnologyLayer',
      specificationSection: '10.6.2.'
   },
   Gap: {
      icon: 'reactions',
      label: 'Gap',
      layer: 'ImplementationAndMigrationLayer',
      specificationSection: '12.2.5.'
   },
   Goal: {
      icon: 'reactions',
      label: 'Goal',
      layer: 'MotivationLayer',
      specificationSection: '6.3.1.'
   },
   ImplementationEvent: {
      icon: 'reactions',
      label: 'Implementation Event',
      layer: 'ImplementationAndMigrationLayer',
      specificationSection: '12.2.3.'
   },
   Material: {
      icon: 'reactions',
      label: 'Material',
      layer: 'TechnologyLayer',
      specificationSection: '10.7.1.'
   },
   Meaning: {
      icon: 'reactions',
      label: 'Meaning',
      layer: 'MotivationLayer',
      specificationSection: '6.4.1.'
   },
   Node: {
      icon: 'reactions',
      label: 'Node',
      layer: 'TechnologyLayer',
      specificationSection: '10.2.1.'
   },
   Outcome: {
      icon: 'reactions',
      label: 'Outcome',
      layer: 'MotivationLayer',
      specificationSection: '6.3.2.'
   },
   Path: {
      icon: 'reactions',
      label: 'Path',
      layer: 'TechnologyLayer',
      specificationSection: '10.2.6.'
   },
   Plateau: {
      icon: 'reactions',
      label: 'Plateau',
      layer: 'ImplementationAndMigrationLayer',
      specificationSection: '12.2.4.'
   },
   Principle: {
      icon: 'reactions',
      label: 'Principle',
      layer: 'MotivationLayer',
      specificationSection: '6.3.3.'
   },
   Product: {
      icon: 'reactions',
      label: 'Product',
      layer: 'BusinessLayer',
      specificationSection: '8.5.1.'
   },
   Representation: {
      icon: 'reactions',
      label: 'Representation',
      layer: 'BusinessLayer',
      specificationSection: '8.4.3.'
   },
   Requirement: {
      icon: 'reactions',
      label: 'Requirement',
      layer: 'MotivationLayer',
      specificationSection: '6.3.4.'
   },
   Resource: {
      icon: 'reactions',
      label: 'Resource',
      layer: 'StrategyLayer',
      specificationSection: '7.2.1.'
   },
   Stakeholder: {
      icon: 'reactions',
      label: 'Stakeholder',
      layer: 'MotivationLayer',
      specificationSection: '6.2.1.'
   },
   SystemSoftware: {
      icon: 'reactions',
      label: 'System Software',
      layer: 'TechnologyLayer',
      specificationSection: '10.2.3.'
   },
   TechnologyCollaboration: {
      icon: 'reactions',
      label: 'Technology Collaboration',
      layer: 'TechnologyLayer',
      specificationSection: '10.2.4.'
   },
   TechnologyEvent: {
      icon: 'reactions',
      label: 'Technology Event',
      layer: 'TechnologyLayer',
      specificationSection: '10.3.4.'
   },
   TechnologyFunction: {
      icon: 'reactions',
      label: 'Technology Function',
      layer: 'TechnologyLayer',
      specificationSection: '10.3.1.'
   },
   TechnologyInteraction: {
      icon: 'reactions',
      label: 'Technology Interaction',
      layer: 'TechnologyLayer',
      specificationSection: '10.3.3.'
   },
   TechnologyInterface: {
      icon: 'reactions',
      label: 'Technology Interface',
      layer: 'TechnologyLayer',
      specificationSection: '10.2.5.'
   },
   TechnologyProcess: {
      icon: 'reactions',
      label: 'Technology Process',
      layer: 'TechnologyLayer',
      specificationSection: '10.3.2.'
   },
   TechnologyService: {
      icon: 'reactions',
      label: 'Technology Service',
      layer: 'TechnologyLayer',
      specificationSection: '10.3.5.'
   },
   Value: {
      icon: 'reactions',
      label: 'Value',
      layer: 'MotivationLayer',
      specificationSection: '6.4.2.'
   },
   ValueStream: {
      icon: 'reactions',
      label: 'Value Stream',
      layer: 'StrategyLayer',
      specificationSection: '7.3.2.'
   },
   WorkPackage: {
      icon: 'reactions',
      label: 'Work Package',
      layer: 'ImplementationAndMigrationLayer',
      specificationSection: '12.2.1.'
   }
};

/**
 * Returns a palette item for the given element type.
 * @param elementType The element type.
 * @returns The palette item.
 */
const getElementPaletteItem = (elementType: ElementType): PaletteItem => {
   const elementInfo = elements[elementType];
   return {
      id: `${elementType}-create-tool`,
      sortString: elementInfo.specificationSection,
      label: elementInfo.label,
      icon: elementInfo.icon,
      actions: [TriggerNodeCreationAction.create(ELEMENT_NODE_TYPE, { args: { type: 'create', elementType } })]
   };
};

/**
 * Returns the elements that belong to the given group.
 * @param group The group.
 * @returns The elements that belong to the group.
 */
const getGroupElements = (group: ElementLayer): Partial<Record<ElementType, ElementInfo>> => {
   const filtered: Partial<Record<ElementType, ElementInfo>> = {};

   Object.entries(elements).forEach(([elementType, elementInfo]) => {
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
   children: Partial<Record<ElementType, ElementInfo>>;
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

/**
 * Returns a palette item for the given group.
 * @param group The group.
 * @returns The palette item.
 */
const getElementGroupPaletteItem = (group: ElementLayer): PaletteItem => {
   const info = elementGroups[group];
   return {
      id: `${group}-group`,
      sortString: '7',
      label: info.label,
      children: Object.entries(info.children).map(([elementType]) => getElementPaletteItem(elementType as ElementType)),
      actions: []
   };
};

const relations: Record<RelationType, RelationInfo> = {
   Access: {
      icon: 'git-compare',
      label: 'Access',
      specificationSection: '5.2.2.'
   },
   Aggregation: {
      icon: 'git-compare',
      label: 'Aggregation',
      specificationSection: '5.1.2.'
   },
   Association: {
      icon: 'git-compare',
      label: 'Association',
      specificationSection: '5.2.4.'
   },
   Assignment: {
      icon: 'git-compare',
      label: 'Assignment',
      specificationSection: '5.1.3.'
   },
   Composition: {
      icon: 'git-compare',
      label: 'Composition',
      specificationSection: '5.1.1.'
   },
   Flow: {
      icon: 'git-compare',
      label: 'Flow',
      specificationSection: '5.3.2.'
   },
   Influence: {
      icon: 'git-compare',
      label: 'Influence',
      specificationSection: '5.3.1.'
   },
   Junction: {
      icon: 'git-compare',
      label: 'Junction',
      specificationSection: '5.5.1.'
   },
   Realization: {
      icon: 'git-compare',
      label: 'Realization',
      specificationSection: '5.1.4.'
   },
   Serving: {
      icon: 'git-compare',
      label: 'Serving',
      specificationSection: '5.2.1.'
   },
   Specialization: {
      icon: 'git-compare',
      label: 'Specialization',
      specificationSection: '5.4.1.'
   },
   Triggering: {
      icon: 'git-compare',
      label: 'Triggering',
      specificationSection: '5.3.1.'
   }
};

const getRelationPaletteItem = (relationType: RelationType): PaletteItem => ({
   id: `${relationType}-create-tool`,
   sortString: '5',
   label: `${relations[relationType].label} Relationship`,
   icon: relations[relationType].icon,
   actions: [TriggerEdgeCreationAction.create(RELATION_EDGE_TYPE, { args: { type: 'create', relationType } })]
});
