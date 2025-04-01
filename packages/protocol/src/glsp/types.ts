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
 * A list of all ArchiMate junction types.
 */
export const junctionTypes = ['And', 'Or'] as const;

/**
 * A type of an ArchiMate junction.
 */
export type JunctionType = (typeof junctionTypes)[number];

/**
 * A map of ArchiMate junction types to GLSP node types.
 * The node type is prefixed with the default node type.
 * For example, the junction type 'AND' is mapped to 'node:and'.
 */
const ARCHIMATE_JUNCTION_TO_NODE_MAP: Record<JunctionType, string> = junctionTypes.reduce(
   (map, junctionType) => {
      map[junctionType] = DefaultTypes.NODE_CIRCLE + ':' + toKebabCase(junctionType);
      return map;
   },
   {} as Record<JunctionType, string>
);

/**
 * A reversible map of ArchiMate junction types to GLSP node types.
 */
export const ARCHIMATE_JUNCTION_TYPE_MAP = new ReversibleMap(ARCHIMATE_JUNCTION_TO_NODE_MAP);

/**
 * A list of all ArchiMate relation types.
 */
export const relationTypes = [
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
 * A type of an ArchiMate relation.
 */
export type RelationType = (typeof relationTypes)[number];

/**
 * A map of ArchiMate relation types to GLSP edge types.
 * The edge type is prefixed with the default edge type.
 * For example, the relation type 'Access' is mapped to 'edge:access'.
 */
const ARCHIMATE_RELATION_TO_EDGE_MAP: Record<RelationType, string> = relationTypes.reduce(
   (map, relationType) => {
      map[relationType] = DefaultTypes.EDGE + ':' + toKebabCase(relationType);
      return map;
   },
   {} as Record<RelationType, string>
);

/**
 * A reversible map of ArchiMate relation types to GLSP edge types.
 */
export const ARCHIMATE_RELATION_TYPE_MAP = new ReversibleMap(ARCHIMATE_RELATION_TO_EDGE_MAP);

export const ARCHIMATE_NODE_TYPE_MAP = new ReversibleMap({
   ...ARCHIMATE_ELEMENT_TO_NODE_MAP,
   ...ARCHIMATE_JUNCTION_TO_NODE_MAP
});

/**
 * A list of all ArchiMate concepts.
 */
export const concepts = [...elementTypes, ...relationTypes, ...junctionTypes] as const;

/**
 * A type of an ArchiMate concept.
 */
export type ConceptType = ElementType | RelationType | JunctionType;

/**
 * A reversible map of ArchiMate concept types to GLSP edge types.
 */
export const ARCHIMATE_CONCEPT_TYPE_MAP = new ReversibleMap({
   ...ARCHIMATE_RELATION_TO_EDGE_MAP,
   ...ARCHIMATE_ELEMENT_TO_NODE_MAP,
   ...ARCHIMATE_JUNCTION_TO_NODE_MAP
});

// Args
export const REFERENCE_CONTAINER_TYPE = 'reference-container-type';
export const REFERENCE_PROPERTY = 'reference-property';
export const REFERENCE_VALUE = 'reference-value';

export type RenderProps = Record<string, string | number | boolean | undefined> & {
   theme: 'light' | 'dark' | 'hc' | 'hcLight'; // supported ThemeType of Theia
};
