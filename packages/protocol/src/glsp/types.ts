/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/

import { Args, DefaultTypes } from '@eclipse-glsp/protocol';
import { ReversibleMap, toKebabCase } from '../util';

// System Diagram
export const ENTITY_NODE_TYPE = DefaultTypes.NODE + ':entity';
export const RELATIONSHIP_EDGE_TYPE = DefaultTypes.EDGE + ':relationship';
export const LABEL_ENTITY = DefaultTypes.LABEL + ':entity';

// Mapping Diagram
export const SOURCE_OBJECT_NODE_TYPE = DefaultTypes.NODE + ':source-object';
export const SOURCE_NUMBER_NODE_TYPE = DefaultTypes.NODE + ':source-number';
export const SOURCE_STRING_NODE_TYPE = DefaultTypes.NODE + ':source-string';
export const TARGET_OBJECT_NODE_TYPE = DefaultTypes.NODE + ':target-object';
export const TARGET_ATTRIBUTE_MAPPING_EDGE_TYPE = DefaultTypes.EDGE + ':target-attribute-mapping';
export const ATTRIBUTE_COMPARTMENT_TYPE = DefaultTypes.COMPARTMENT + ':attribute';

// ArchiMate Diagram
export const ELEMENT_LABEL_TYPE = DefaultTypes.LABEL + ':element';
export const ELEMENT_ICON_TYPE = 'icon';

export const layerTypes = ['Application', 'Business', 'ImplementationAndMigration', 'Motivation', 'Strategy', 'Technology'] as const;

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
   'ImplementationEvent',
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
export const ARCHIMATE_NODE_TYPE_MAP = new ReversibleMap(ARCHIMATE_ELEMENT_TO_NODE_MAP);

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
export const ARCHIMATE_EDGE_TYPE_MAP = new ReversibleMap(ARCHIMATE_RELATION_TO_EDGE_MAP);

/**
 * A list of all ArchiMate concept types that are not relations or elements.
 */
export const otherConcepts = ['Junction'] as const;

export type OtherConceptType = (typeof otherConcepts)[number];

/**
 * A map of ArchiMate concepts that are not relations or elements to GLSP node types.
 */
const ARCHIMATE_CONCEPT_TO_NODE_MAP = {
   Junction: DefaultTypes.NODE + ':junction'
};

/**
 * A list of all ArchiMate concepts.
 */
export const concepts = [...elementTypes, ...relationTypes, ...otherConcepts] as const;

/**
 * A type of an ArchiMate concept.
 */
export type ConceptType = ElementType | RelationType | OtherConceptType;

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

export namespace RenderProps {
   export function key(name: string): string {
      return 'render-prop-' + name;
   }

   export function read(args: Args): Partial<RenderProps> {
      return Object.keys(args).reduce((renderProps, argKey) => {
         if (argKey.startsWith('render-prop-')) {
            renderProps[argKey.substring('render-prop-'.length)] = args[argKey];
         }
         return renderProps;
      }, {} as Args);
   }

   export const TARGET_ATTRIBUTE_MAPPING_IDX = RenderProps.key('mappingIndex');
   export const SOURCE_OBJECT_IDX = RenderProps.key('sourceObjectIndex');
}
