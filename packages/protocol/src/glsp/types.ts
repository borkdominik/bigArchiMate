import { DefaultTypes } from '@eclipse-glsp/protocol';
import { ReversibleMap, toKebabCase } from '../util';

// ArchiMate Diagram
export const ELEMENT_LABEL_TYPE = DefaultTypes.LABEL + ':element';
export const ELEMENT_ICON_TYPE = 'icon';

export const layerTypes = [
   'Application',
   'Business',
   'ImplementationAndMigration',
   'Motivation',
   'Strategy',
   'Technology',
   'Other'
] as const;

export type LayerType = (typeof layerTypes)[number];

/**
 * A list of all ArchiMate element types.
 */
export const elementTypes = [
   'ApplicationCollaboration',
   'ApplicationComponent',
   'ApplicationEvent',
   'ApplicationFunction',
   'ApplicationInteraction',
   'ApplicationInterface',
   'ApplicationProcess',
   'ApplicationService',
   'Artifact',
   'Assessment',
   'BusinessActor',
   'BusinessCollaboration',
   'BusinessEvent',
   'BusinessFunction',
   'BusinessInteraction',
   'BusinessInterface',
   'BusinessObject',
   'BusinessProcess',
   'BusinessRole',
   'BusinessService',
   'Capability',
   'CommunicationNetwork',
   'Constraint',
   'Contract',
   'CourseOfAction',
   'DataObject',
   'Deliverable',
   'Device',
   'DistributionNetwork',
   'Driver',
   'Equipment',
   'Facility',
   'Gap',
   'Goal',
   'Grouping',
   'ImplementationEvent',
   'Location',
   'Material',
   'Meaning',
   'Node',
   'Outcome',
   'Path',
   'Plateau',
   'Principle',
   'Product',
   'Representation',
   'Requirement',
   'Resource',
   'Stakeholder',
   'SystemSoftware',
   'TechnologyCollaboration',
   'TechnologyEvent',
   'TechnologyFunction',
   'TechnologyInteraction',
   'TechnologyInterface',
   'TechnologyProcess',
   'TechnologyService',
   'Value',
   'ValueStream',
   'WorkPackage'
] as const;

/**
 * A type of an ArchiMate element.
 */
export type ElementType = (typeof elementTypes)[number];

/**
 * A map of ArchiMate element types to GLSP node types.
 * The node type is prefixed with the default node type.
 * For example, the element type 'ApplicationComponent' is mapped to 'node:application-component'.
 */
const ARCHIMATE_ELEMENT_TO_NODE_MAP: Record<ElementType, string> = elementTypes.reduce(
   (map, elementType) => {
      map[elementType] = DefaultTypes.NODE + ':' + toKebabCase(elementType);
      return map;
   },
   {} as Record<ElementType, string>
);

/**
 * A reversible map of ArchiMate element types to GLSP node types.
 */
export const ARCHIMATE_ELEMENT_TYPE_MAP = new ReversibleMap(ARCHIMATE_ELEMENT_TO_NODE_MAP);

/**
 * A list of all ArchiMate relationship types.
 */
export const relationshipTypes = [
   'Access',
   'Aggregation',
   'Assignment',
   'Association',
   'Composition',
   'Flow',
   'Influence',
   'Realization',
   'Serving',
   'Specialization',
   'Triggering'
] as const;

/**
 * A type of an ArchiMate relationship.
 */
export type RelationshipType = (typeof relationshipTypes)[number];

/**
 * A map of ArchiMate relationship types to GLSP edge types.
 * The edge type is prefixed with the default edge type.
 * For example, the relationship type 'Access' is mapped to 'edge:access'.
 */
const ARCHIMATE_RELATION_TO_EDGE_MAP: Record<RelationshipType, string> = relationshipTypes.reduce(
   (map, relationshipType) => {
      map[relationshipType] = DefaultTypes.EDGE + ':' + toKebabCase(relationshipType);
      return map;
   },
   {} as Record<RelationshipType, string>
);

/**
 * A reversible map of ArchiMate relationship types to GLSP edge types.
 */
export const ARCHIMATE_RELATION_TYPE_MAP = new ReversibleMap(ARCHIMATE_RELATION_TO_EDGE_MAP);

/**
 * A list of all ArchiMate concept types that are not relationships or elements.
 */
export const otherConcepts = ['Junction'] as const;

export type OtherConceptType = (typeof otherConcepts)[number];

/**
 * A map of ArchiMate concepts that are not relationships or elements to GLSP node types.
 * The node type is prefixed with the default node type.
 * For example, the concept type 'Junction' is mapped to 'node:junction'.
 */
const ARCHIMATE_CONCEPT_TO_NODE_MAP = {
   Junction: DefaultTypes.NODE_CIRCLE + ':junction'
};

export const ARCHIMATE_NODE_TYPE_MAP = new ReversibleMap({
   ...ARCHIMATE_ELEMENT_TO_NODE_MAP,
   ...ARCHIMATE_CONCEPT_TO_NODE_MAP
});

/**
 * A list of all ArchiMate concepts.
 */
export const concepts = [...elementTypes, ...relationshipTypes, ...otherConcepts] as const;

/**
 * A type of an ArchiMate concept.
 */
export type ConceptType = ElementType | RelationshipType | OtherConceptType;

/**
 * A reversible map of ArchiMate concept types to GLSP edge types.
 */
export const ARCHIMATE_CONCEPT_TYPE_MAP = new ReversibleMap({
   ...ARCHIMATE_RELATION_TO_EDGE_MAP,
   ...ARCHIMATE_ELEMENT_TO_NODE_MAP,
   ...ARCHIMATE_CONCEPT_TO_NODE_MAP
});

// Args
export const REFERENCE_CONTAINER_TYPE = 'reference-container-type';
export const REFERENCE_PROPERTY = 'reference-property';
export const REFERENCE_VALUE = 'reference-value';

export type RenderProps = Record<string, string | number | boolean | undefined> & {
   theme: 'light' | 'dark' | 'hc' | 'hcLight'; // supported ThemeType of Theia
};
