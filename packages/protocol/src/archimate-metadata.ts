import { ConceptType, ElementType, isElementType, JunctionType, LayerType, RelationType } from './glsp/types';
import { getObjectEntries } from './util';

type CornerType = 'round' | 'square' | 'diamond';

interface ConceptMetaData {
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

interface LayeredConceptMetaData extends ConceptMetaData {
   /**
    * The layer the concept belongs to.
    */
   layer: LayerType;
}

/**
 * Metadata of an element.
 */
interface ElementMetaData extends LayeredConceptMetaData {
   /**
    * The corner type of the element.
    */
   cornerType: CornerType;
}

/**
 * Metadata of a junction.
 */
interface JunctionMetaData extends LayeredConceptMetaData {}

/**
 * Metadata of an ArchiMate relation type.
 */
interface RelationMetaData extends ConceptMetaData {}

/**
 * A mapping of element types to their respective metadata.
 */
const elementMetadataMap: Record<ElementType, ElementMetaData> = {
   ApplicationCollaboration: {
      icon: 'archimate-application-collaboration',
      label: 'Application Collaboration',
      layer: 'Application',
      cornerType: 'square',
      specificationSection: '9.2.2.'
   },
   ApplicationComponent: {
      icon: 'archimate-application-component',
      label: 'Application Component',
      layer: 'Application',
      cornerType: 'square',
      specificationSection: '9.2.1.'
   },
   ApplicationEvent: {
      icon: 'archimate-application-event',
      label: 'Application Event',
      layer: 'Application',
      cornerType: 'round',
      specificationSection: '9.3.4.'
   },
   ApplicationFunction: {
      icon: 'archimate-application-function',
      label: 'Application Function',
      layer: 'Application',
      cornerType: 'round',
      specificationSection: '9.3.1.'
   },
   ApplicationInteraction: {
      icon: 'archimate-application-interaction',
      label: 'Application Interaction',
      layer: 'Application',
      cornerType: 'round',
      specificationSection: '9.3.2.'
   },
   ApplicationInterface: {
      icon: 'archimate-application-interface',
      label: 'Application Interface',
      layer: 'Application',
      cornerType: 'square',
      specificationSection: '9.2.3.'
   },
   ApplicationProcess: {
      icon: 'archimate-application-process',
      label: 'Application Process',
      layer: 'Application',
      cornerType: 'round',
      specificationSection: '9.3.3.'
   },
   ApplicationService: {
      icon: 'archimate-application-service',
      label: 'Application Service',
      layer: 'Application',
      cornerType: 'round',
      specificationSection: '9.3.5.'
   },
   Artifact: {
      icon: 'archimate-artifact',
      label: 'Artifact',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.4.1.'
   },
   Assessment: {
      icon: 'archimate-assessment',
      label: 'Assessment',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.2.3.'
   },
   BusinessActor: {
      icon: 'archimate-business-actor',
      label: 'Business Actor',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.2.1.'
   },
   BusinessCollaboration: {
      icon: 'archimate-business-collaboration',
      label: 'Business Collaboration',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.2.3.'
   },
   BusinessEvent: {
      icon: 'archimate-business-event',
      label: 'Business Event',
      layer: 'Business',
      cornerType: 'round',
      specificationSection: '8.3.4.'
   },
   BusinessFunction: {
      icon: 'archimate-business-function',
      label: 'Business Function',
      layer: 'Business',
      cornerType: 'round',
      specificationSection: '8.3.2.'
   },
   BusinessInteraction: {
      icon: 'archimate-business-interaction',
      label: 'Business Interaction',
      layer: 'Business',
      cornerType: 'round',
      specificationSection: '8.3.3.'
   },
   BusinessInterface: {
      icon: 'archimate-business-interface',
      label: 'Business Interface',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.2.4.'
   },
   BusinessObject: {
      icon: 'archimate-business-object',
      label: 'Business Object',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.4.1.'
   },
   BusinessProcess: {
      icon: 'archimate-business-process',
      label: 'Business Process',
      layer: 'Business',
      cornerType: 'round',
      specificationSection: '8.3.1.'
   },
   BusinessRole: {
      icon: 'archimate-business-role',
      label: 'Business Role',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.2.2.'
   },
   BusinessService: {
      icon: 'archimate-business-service',
      label: 'Business Service',
      layer: 'Business',
      cornerType: 'round',
      specificationSection: '8.3.5.'
   },
   Capability: {
      icon: 'archimate-capability',
      label: 'Capability',
      layer: 'Strategy',
      cornerType: 'round',
      specificationSection: '7.3.1.'
   },
   CommunicationNetwork: {
      icon: 'archimate-communication-network',
      label: 'Communication Network',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.7.'
   },
   Constraint: {
      icon: 'archimate-constraint',
      label: 'Constraint',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.3.5.'
   },
   Contract: {
      icon: 'archimate-contract',
      label: 'Contract',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.4.2.'
   },
   CourseOfAction: {
      icon: 'archimate-course-of-action',
      label: 'Course of Action',
      layer: 'Strategy',
      cornerType: 'round',
      specificationSection: '7.3.3.'
   },
   DataObject: {
      icon: 'archimate-data-object',
      label: 'Data Object',
      layer: 'Application',
      cornerType: 'square',
      specificationSection: '9.4.1.'
   },
   Deliverable: {
      icon: 'archimate-deliverable',
      label: 'Deliverable',
      layer: 'ImplementationAndMigration',
      cornerType: 'square',
      specificationSection: '12.2.2.'
   },
   Device: {
      icon: 'archimate-device',
      label: 'Device',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.2.'
   },
   DistributionNetwork: {
      icon: 'archimate-distribution-network',
      label: 'Distribution Network',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.6.3.'
   },
   Driver: {
      icon: 'archimate-driver',
      label: 'Driver',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.2.2.'
   },
   Equipment: {
      icon: 'archimate-equipment',
      label: 'Equipment',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.6.1.'
   },
   Facility: {
      icon: 'archimate-facility',
      label: 'Facility',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.6.2.'
   },
   Gap: {
      icon: 'archimate-gap',
      label: 'Gap',
      layer: 'ImplementationAndMigration',
      cornerType: 'square',
      specificationSection: '12.2.5.'
   },
   Goal: {
      icon: 'archimate-goal',
      label: 'Goal',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.3.1.'
   },
   Grouping: {
      icon: 'archimate-grouping',
      label: 'Grouping',
      layer: 'Other',
      cornerType: 'square',
      specificationSection: '4.5.1.'
   },
   ImplementationEvent: {
      icon: 'archimate-implementation-event',
      label: 'Implementation Event',
      layer: 'ImplementationAndMigration',
      cornerType: 'round',
      specificationSection: '12.2.3.'
   },
   Location: {
      icon: 'archimate-location',
      label: 'Location',
      layer: 'Other',
      cornerType: 'square',
      specificationSection: '4.5.2.'
   },
   Material: {
      icon: 'archimate-material',
      label: 'Material',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.7.1.'
   },
   Meaning: {
      icon: 'archimate-meaning',
      label: 'Meaning',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.4.1.'
   },
   Node: {
      icon: 'archimate-node',
      label: 'Node',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.1.'
   },
   Outcome: {
      icon: 'archimate-outcome',
      label: 'Outcome',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.3.2.'
   },
   Path: {
      icon: 'archimate-path',
      label: 'Path',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.6.'
   },
   Plateau: {
      icon: 'archimate-plateau',
      label: 'Plateau',
      layer: 'ImplementationAndMigration',
      cornerType: 'square',
      specificationSection: '12.2.4.'
   },
   Principle: {
      icon: 'archimate-principle',
      label: 'Principle',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.3.3.'
   },
   Product: {
      icon: 'archimate-product',
      label: 'Product',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.5.1.'
   },
   Representation: {
      icon: 'archimate-representation',
      label: 'Representation',
      layer: 'Business',
      cornerType: 'square',
      specificationSection: '8.4.3.'
   },
   Requirement: {
      icon: 'archimate-requirement',
      label: 'Requirement',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.3.4.'
   },
   Resource: {
      icon: 'archimate-resource',
      label: 'Resource',
      layer: 'Strategy',
      cornerType: 'square',
      specificationSection: '7.2.1.'
   },
   Stakeholder: {
      icon: 'archimate-stakeholder',
      label: 'Stakeholder',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.2.1.'
   },
   SystemSoftware: {
      icon: 'archimate-system-software',
      label: 'System Software',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.3.'
   },
   TechnologyCollaboration: {
      icon: 'archimate-technology-collaboration',
      label: 'Technology Collaboration',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.4.'
   },
   TechnologyEvent: {
      icon: 'archimate-technology-event',
      label: 'Technology Event',
      layer: 'Technology',
      cornerType: 'round',
      specificationSection: '10.3.4.'
   },
   TechnologyFunction: {
      icon: 'archimate-technology-function',
      label: 'Technology Function',
      layer: 'Technology',
      cornerType: 'round',
      specificationSection: '10.3.1.'
   },
   TechnologyInteraction: {
      icon: 'archimate-technology-interaction',
      label: 'Technology Interaction',
      layer: 'Technology',
      cornerType: 'round',
      specificationSection: '10.3.3.'
   },
   TechnologyInterface: {
      icon: 'archimate-technology-interface',
      label: 'Technology Interface',
      layer: 'Technology',
      cornerType: 'square',
      specificationSection: '10.2.5.'
   },
   TechnologyProcess: {
      icon: 'archimate-technology-process',
      label: 'Technology Process',
      layer: 'Technology',
      cornerType: 'round',
      specificationSection: '10.3.2.'
   },
   TechnologyService: {
      icon: 'archimate-technology-service',
      label: 'Technology Service',
      layer: 'Technology',
      cornerType: 'round',
      specificationSection: '10.3.5.'
   },
   Value: {
      icon: 'archimate-value',
      label: 'Value',
      layer: 'Motivation',
      cornerType: 'diamond',
      specificationSection: '6.4.2.'
   },
   ValueStream: {
      icon: 'archimate-value-stream',
      label: 'Value Stream',
      layer: 'Strategy',
      cornerType: 'round',
      specificationSection: '7.3.2.'
   },
   WorkPackage: {
      icon: 'archimate-work-package',
      label: 'Work Package',
      layer: 'ImplementationAndMigration',
      cornerType: 'round',
      specificationSection: '12.2.1.'
   }
};

/**
 * A mapping of relation types to their respective metadata.
 */
const relationMetadataMap: Record<RelationType, RelationMetaData> = {
   Access: {
      icon: 'archimate-access',
      label: 'Access',
      specificationSection: '5.2.2.'
   },
   Aggregation: {
      icon: 'archimate-aggregation',
      label: 'Aggregation',
      specificationSection: '5.1.2.'
   },
   Assignment: {
      icon: 'archimate-assignment',
      label: 'Assignment',
      specificationSection: '5.1.3.'
   },
   Association: {
      icon: 'archimate-association',
      label: 'Association',
      specificationSection: '5.2.4.'
   },
   Composition: {
      icon: 'archimate-composition',
      label: 'Composition',
      specificationSection: '5.1.1.'
   },
   Flow: {
      icon: 'archimate-flow',
      label: 'Flow',
      specificationSection: '5.3.2.'
   },
   Influence: {
      icon: 'archimate-influence',
      label: 'Influence',
      specificationSection: '5.3.1.'
   },
   Realization: {
      icon: 'archimate-realization',
      label: 'Realization',
      specificationSection: '5.1.4.'
   },
   Serving: {
      icon: 'archimate-serving',
      label: 'Serving',
      specificationSection: '5.2.1.'
   },
   Specialization: {
      icon: 'archimate-specialization',
      label: 'Specialization',
      specificationSection: '5.4.1.'
   },
   Triggering: {
      icon: 'archimate-triggering',
      label: 'Triggering',
      specificationSection: '5.3.1.'
   }
};

const junctionMetadataMap: Record<JunctionType, JunctionMetaData> = {
   And: {
      icon: 'archimate-junction-and',
      label: '(And) Junction',
      layer: 'Other',
      specificationSection: '5.5.1.'
   },
   Or: {
      icon: 'archimate-junction-or',
      label: 'Or Junction',
      layer: 'Other',
      specificationSection: '5.5.1.'
   }
};

/**
 * A mapping of all concepts to their respective metadata.
 */
const conceptMetaDataMap = {
   ...elementMetadataMap,
   ...relationMetadataMap,
   ...junctionMetadataMap
};

type LayeredConceptType = ElementType | JunctionType;

/**
 * Returns the elements that belong to the given layer.
 * @param layerType The layerType.
 * @returns The elements that belong to the layer.
 */
export const getLayerConcepts = (layerType: LayerType): Partial<Record<LayeredConceptType, LayeredConceptMetaData>> => {
   const filtered: Partial<Record<LayeredConceptType, LayeredConceptMetaData>> = {};

   getObjectEntries({ ...elementMetadataMap, ...junctionMetadataMap }).forEach(([conceptType, conceptInfo]) => {
      if (conceptInfo.layer === layerType) {
         filtered[conceptType] = conceptInfo;
      }
   });

   return filtered;
};

/**
 * Information about a layer.
 */
interface LayerInfo {
   /**
    * The label to display for the layer.
    */
   label: string;
   /**
    * The children elements of the layer.
    */
   children: Partial<Record<LayeredConceptType, LayeredConceptMetaData>>;
}

/**
 * The layers and their children elements.
 */
export const layers: Record<LayerType, LayerInfo> = {
   Application: {
      label: 'Application',
      children: getLayerConcepts('Application')
   },
   Business: {
      label: 'Business',
      children: getLayerConcepts('Business')
   },
   ImplementationAndMigration: {
      label: 'Implementation & Migration',
      children: getLayerConcepts('ImplementationAndMigration')
   },
   Motivation: {
      label: 'Motivation',
      children: getLayerConcepts('Motivation')
   },
   Strategy: {
      label: 'Strategy',
      children: getLayerConcepts('Strategy')
   },
   Technology: {
      label: 'Technology',
      children: getLayerConcepts('Technology')
   },
   Other: {
      label: 'Other',
      children: getLayerConcepts('Other')
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
export const getLayer = (concept: LayeredConceptType): LayerType =>
   isElementType(concept) ? elementMetadataMap[concept].layer : junctionMetadataMap[concept].layer;
export const getCornerType = (element: ElementType): CornerType => elementMetadataMap[element].cornerType;
export const getChildren = (layer: LayerType): Partial<Record<LayeredConceptType, LayeredConceptMetaData>> => layers[layer].children;
