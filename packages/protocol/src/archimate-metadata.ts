/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/

import { ConceptType, ElementType, LayerType, OtherConceptType, RelationType } from './glsp/types';

type CornerType = 'round' | 'square' | 'diamond';

export interface ConceptMetaData {
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
 * Metadata of an element.
 */
export interface ElementMetaData extends ConceptMetaData {
   /**
    * The group the element belongs to.
    */
   layer: LayerType;
   /**
    * The aspect group the element belongs to.
    */
   cornerType: CornerType;
}

/**
 * Metadata of an ArchiMate relation type.
 */
export interface RelationMetaData extends ConceptMetaData {}

/**
 * A mapping of element types to their respective metadata.
 */
export const elementMetadataMap: Record<ElementType, ElementMetaData> = {
   ApplicationCollaboration: {
      icon: 'reactions',
      label: 'Application Collaboration',
      layer: 'Application',
      cornerType: 'square',
      specificationSection: '9.2.2.'
   },
   ApplicationComponent: {
      icon: 'reactions',
      label: 'Application Component',
      layer: 'Application',
      cornerType: 'square',
      specificationSection: '9.2.1.'
   },
   ApplicationEvent: {
      icon: 'reactions',
      label: 'Application Event',
      layer: 'Application',
      cornerType: 'round',
      specificationSection: '9.3.4.'
   },
   ApplicationFunction: {
      icon: 'reactions',
      label: 'Application Function',
      layer: 'Application',
      cornerType: 'round',
      specificationSection: '9.3.1.'
   },
   ApplicationInteraction: {
      icon: 'reactions',
      label: 'Application Interaction',
      layer: 'Application',
      cornerType: 'round',
      specificationSection: '9.3.2.'
   },
   ApplicationInterface: {
      icon: 'reactions',
      label: 'Application Interface',
      layer: 'Application',
      cornerType: 'square',
      specificationSection: '9.2.3.'
   },
   ApplicationProcess: {
      icon: 'reactions',
      label: 'Application Process',
      layer: 'Application',
      cornerType: 'round',
      specificationSection: '9.3.3.'
   },
   ApplicationService: {
      icon: 'reactions',
      label: 'Application Service',
      layer: 'Application',
      cornerType: 'round',
      specificationSection: '9.3.5.'
   },
   Artifact: {
      icon: 'reactions',
      label: 'Artifact',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.4.1.'
   },
   Assessment: {
      icon: 'reactions',
      label: 'Assessment',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.2.3.'
   },
   BusinessActor: {
      icon: 'reactions',
      label: 'Business Actor',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.2.1.'
   },
   BusinessCollaboration: {
      icon: 'reactions',
      label: 'Business Collaboration',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.2.3.'
   },
   BusinessEvent: {
      icon: 'reactions',
      label: 'Business Event',
      layer: 'Business',
      cornerType: 'round',
      specificationSection: '8.3.4.'
   },
   BusinessFunction: {
      icon: 'reactions',
      label: 'Business Function',
      layer: 'Business',
      cornerType: 'round',
      specificationSection: '8.3.2.'
   },
   BusinessInteraction: {
      icon: 'reactions',
      label: 'Business Interaction',
      layer: 'Business',
      cornerType: 'round',
      specificationSection: '8.3.3.'
   },
   BusinessInterface: {
      icon: 'reactions',
      label: 'Business Interface',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.2.4.'
   },
   BusinessObject: {
      icon: 'reactions',
      label: 'Business Object',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.4.1.'
   },
   BusinessProcess: {
      icon: 'reactions',
      label: 'Business Process',
      layer: 'Business',
      cornerType: 'round',
      specificationSection: '8.3.1.'
   },
   BusinessRole: {
      icon: 'reactions',
      label: 'Business Role',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.2.2.'
   },
   BusinessService: {
      icon: 'reactions',
      label: 'Business Service',
      layer: 'Business',
      cornerType: 'round',
      specificationSection: '8.3.5.'
   },
   Capability: {
      icon: 'reactions',
      label: 'Capability',
      layer: 'Strategy',
      cornerType: 'round',
      specificationSection: '7.3.1.'
   },
   CommunicationNetwork: {
      icon: 'reactions',
      label: 'Communication Network',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.7.'
   },
   Constraint: {
      icon: 'reactions',
      label: 'Constraint',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.3.5.'
   },
   Contract: {
      icon: 'reactions',
      label: 'Contract',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.4.2.'
   },
   CourseOfAction: {
      icon: 'reactions',
      label: 'Course of Action',
      layer: 'Strategy',
      cornerType: 'round',
      specificationSection: '7.3.3.'
   },
   DataObject: {
      icon: 'reactions',
      label: 'Data Object',
      layer: 'Application',
      cornerType: 'square',
      specificationSection: '9.4.1.'
   },
   Deliverable: {
      icon: 'reactions',
      label: 'Deliverable',
      layer: 'ImplementationAndMigration',
      cornerType: 'square',
      specificationSection: '12.2.2.'
   },
   Device: {
      icon: 'reactions',
      label: 'Device',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.2.'
   },
   DistributionNetwork: {
      icon: 'reactions',
      label: 'Distribution Network',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.6.3.'
   },
   Driver: {
      icon: 'reactions',
      label: 'Driver',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.2.2.'
   },
   Equipment: {
      icon: 'reactions',
      label: 'Equipment',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.6.1.'
   },
   Facility: {
      icon: 'reactions',
      label: 'Facility',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.6.2.'
   },
   Gap: {
      icon: 'reactions',
      label: 'Gap',
      layer: 'ImplementationAndMigration',
      cornerType: 'square',
      specificationSection: '12.2.5.'
   },
   Goal: {
      icon: 'reactions',
      label: 'Goal',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.3.1.'
   },
   ImplementationEvent: {
      icon: 'reactions',
      label: 'Implementation Event',
      layer: 'ImplementationAndMigration',
      cornerType: 'round',
      specificationSection: '12.2.3.'
   },
   Material: {
      icon: 'reactions',
      label: 'Material',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.7.1.'
   },
   Meaning: {
      icon: 'reactions',
      label: 'Meaning',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.4.1.'
   },
   Node: {
      icon: 'reactions',
      label: 'Node',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.1.'
   },
   Outcome: {
      icon: 'reactions',
      label: 'Outcome',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.3.2.'
   },
   Path: {
      icon: 'reactions',
      label: 'Path',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.6.'
   },
   Plateau: {
      icon: 'reactions',
      label: 'Plateau',
      layer: 'ImplementationAndMigration',
      cornerType: 'square',
      specificationSection: '12.2.4.'
   },
   Principle: {
      icon: 'reactions',
      label: 'Principle',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.3.3.'
   },
   Product: {
      icon: 'reactions',
      label: 'Product',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.5.1.'
   },
   Representation: {
      icon: 'reactions',
      label: 'Representation',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.4.3.'
   },
   Requirement: {
      icon: 'reactions',
      label: 'Requirement',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.3.4.'
   },
   Resource: {
      icon: 'reactions',
      label: 'Resource',
      layer: 'Strategy',
      cornerType: 'square',
      specificationSection: '7.2.1.'
   },
   Stakeholder: {
      icon: 'reactions',
      label: 'Stakeholder',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.2.1.'
   },
   SystemSoftware: {
      icon: 'reactions',
      label: 'System Software',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.3.'
   },
   TechnologyCollaboration: {
      icon: 'reactions',
      label: 'Technology Collaboration',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.4.'
   },
   TechnologyEvent: {
      icon: 'reactions',
      label: 'Technology Event',
      layer: 'Technology',
      cornerType: 'round',
      specificationSection: '10.3.4.'
   },
   TechnologyFunction: {
      icon: 'reactions',
      label: 'Technology Function',
      layer: 'Technology',
      cornerType: 'round',
      specificationSection: '10.3.1.'
   },
   TechnologyInteraction: {
      icon: 'reactions',
      label: 'Technology Interaction',
      layer: 'Technology',
      cornerType: 'round',
      specificationSection: '10.3.3.'
   },
   TechnologyInterface: {
      icon: 'reactions',
      label: 'Technology Interface',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.5.'
   },
   TechnologyProcess: {
      icon: 'reactions',
      label: 'Technology Process',
      layer: 'Technology',
      cornerType: 'round',
      specificationSection: '10.3.2.'
   },
   TechnologyService: {
      icon: 'reactions',
      label: 'Technology Service',
      layer: 'Technology',
      cornerType: 'round',
      specificationSection: '10.3.5.'
   },
   Value: {
      icon: 'reactions',
      label: 'Value',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.4.2.'
   },
   ValueStream: {
      icon: 'reactions',
      label: 'Value Stream',
      layer: 'Strategy',
      cornerType: 'round',
      specificationSection: '7.3.2.'
   },
   WorkPackage: {
      icon: 'reactions',
      label: 'Work Package',
      layer: 'ImplementationAndMigration',
      cornerType: 'round',
      specificationSection: '12.2.1.'
   }
};

/**
 * A mapping of relation types to their respective metadata.
 */
export const relationMetadataMap: Record<RelationType, RelationMetaData> = {
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

const otherConceptMetaDataMap: Record<OtherConceptType, ConceptMetaData> = {
   Junction: {
      icon: 'git-compare',
      label: 'Junction',
      specificationSection: '5.5.1.'
   }
};

/**
 * A mapping of all concepts to their respective metadata.
 */
export const conceptMetaDataMap = {
   ...elementMetadataMap,
   ...relationMetadataMap,
   ...otherConceptMetaDataMap
};

/**
 * Returns the elements that belong to the given layer.
 * @param layerType The layerType.
 * @returns The elements that belong to the layer.
 */
export const getLayerElements = (layerType: LayerType): Partial<Record<ElementType, ElementMetaData>> => {
   const filtered: Partial<Record<ElementType, ElementMetaData>> = {};

   Object.entries(elementMetadataMap).forEach(([elementType, elementInfo]) => {
      if (elementInfo.layer === layerType) {
         filtered[elementType as ElementType] = elementInfo;
      }
   });

   return filtered;
};

/**
 * Information about a layer.
 */
interface ElementLayerInfo {
   /**
    * The label to display for the layer.
    */
   label: string;
   /**
    * The children elements of the layer.
    */
   children: Partial<Record<ElementType, ElementMetaData>>;
}

/**
 * The layers and their children elements.
 */
export const layers: Record<LayerType, ElementLayerInfo> = {
   Application: {
      label: 'Application',
      children: getLayerElements('Application')
   },
   Business: {
      label: 'Business',
      children: getLayerElements('Business')
   },
   ImplementationAndMigration: {
      label: 'Implementation & Migration',
      children: getLayerElements('ImplementationAndMigration')
   },
   Motivation: {
      label: 'Motivation',
      children: getLayerElements('Motivation')
   },
   Strategy: {
      label: 'Strategy',
      children: getLayerElements('Strategy')
   },
   Technology: {
      label: 'Technology',
      children: getLayerElements('Technology')
   }
};

export const getLabel = (conceptOrLayer: ConceptType | LayerType): string => {
   if (conceptOrLayer in layers) {
      return layers[conceptOrLayer as LayerType].label;
   } else {
      return conceptMetaDataMap[conceptOrLayer as ConceptType].label;
   }
};
export const getIcon = (concept: ConceptType): string => conceptMetaDataMap[concept].icon;
export const getSpecificationSection = (concept: ConceptType): string => conceptMetaDataMap[concept].specificationSection;
export const getLayer = (element: ElementType): LayerType => elementMetadataMap[element].layer;
export const getChildren = (layer: LayerType): Partial<Record<ElementType, ElementMetaData>> => layers[layer].children;
