/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/

import { Args, DefaultTypes } from '@eclipse-glsp/protocol';
import { ReversibleMap } from '../util';

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

/**
 * A reversible map of ArchiMate element types to GLSP node types.
 */
export const ARCHIMATE_NODE_TYPE_MAP = new ReversibleMap({
   ApplicationCollaboration: DefaultTypes.NODE + ':application-collaboration',
   ApplicationComponent: DefaultTypes.NODE + ':application-component',
   ApplicationEvent: DefaultTypes.NODE + ':application-event',
   ApplicationFunction: DefaultTypes.NODE + ':application-function',
   ApplicationInterface: DefaultTypes.NODE + ':application-interface',
   ApplicationInteraction: DefaultTypes.NODE + ':application-interaction',
   ApplicationProcess: DefaultTypes.NODE + ':application-process',
   ApplicationService: DefaultTypes.NODE + ':application-service',
   Artifact: DefaultTypes.NODE + ':artifact',
   Assessment: DefaultTypes.NODE + ':assessment',
   BusinessActor: DefaultTypes.NODE + ':business-actor',
   BusinessCollaboration: DefaultTypes.NODE + ':business-collaboration',
   BusinessEvent: DefaultTypes.NODE + ':business-event',
   BusinessFunction: DefaultTypes.NODE + ':business-function',
   BusinessInteraction: DefaultTypes.NODE + ':business-interaction',
   BusinessInterface: DefaultTypes.NODE + ':business-interface',
   BusinessObject: DefaultTypes.NODE + ':business-object',
   BusinessProcess: DefaultTypes.NODE + ':business-process',
   BusinessRole: DefaultTypes.NODE + ':business-role',
   BusinessService: DefaultTypes.NODE + ':business-service',
   Capability: DefaultTypes.NODE + ':capability',
   Constraint: DefaultTypes.NODE + ':constraint',
   CommunicationNetwork: DefaultTypes.NODE + ':communication-network',
   Contract: DefaultTypes.NODE + ':contract',
   CourseOfAction: DefaultTypes.NODE + ':course-of-action',
   DataObject: DefaultTypes.NODE + ':data-object',
   Deliverable: DefaultTypes.NODE + ':deliverable',
   Device: DefaultTypes.NODE + ':device',
   DistributionNetwork: DefaultTypes.NODE + ':distribution-network',
   Driver: DefaultTypes.NODE + ':driver',
   Equipment: DefaultTypes.NODE + ':equipment',
   Facility: DefaultTypes.NODE + ':facility',
   Gap: DefaultTypes.NODE + ':gap',
   Goal: DefaultTypes.NODE + ':goal',
   ImplementationEvent: DefaultTypes.NODE + ':implementation-event',
   Material: DefaultTypes.NODE + ':material',
   Meaning: DefaultTypes.NODE + ':meaning',
   Node: DefaultTypes.NODE + ':node',
   Outcome: DefaultTypes.NODE + ':outcome',
   Path: DefaultTypes.NODE + ':path',
   Plateau: DefaultTypes.NODE + ':plateau',
   Principle: DefaultTypes.NODE + ':principle',
   Product: DefaultTypes.NODE + ':product',
   Requirement: DefaultTypes.NODE + ':requirement',
   Representation: DefaultTypes.NODE + ':representation',
   Resource: DefaultTypes.NODE + ':resource',
   Stakeholder: DefaultTypes.NODE + ':stakeholder',
   SystemSoftware: DefaultTypes.NODE + ':system-software',
   TechnologyCollaboration: DefaultTypes.NODE + ':technology-collaboration',
   TechnologyEvent: DefaultTypes.NODE + ':technology-event',
   TechnologyFunction: DefaultTypes.NODE + ':technology-function',
   TechnologyInteraction: DefaultTypes.NODE + ':technology-interaction',
   TechnologyInterface: DefaultTypes.NODE + ':technology-interface',
   TechnologyProcess: DefaultTypes.NODE + ':technology-process',
   TechnologyService: DefaultTypes.NODE + ':technology-service',
   Value: DefaultTypes.NODE + ':value',
   ValueStream: DefaultTypes.NODE + ':value-stream',
   WorkPackage: DefaultTypes.NODE + ':work-package'
});

/**
 * A reversible map of ArchiMate relation types to GLSP edge types.
 */
export const ARCHIMATE_EDGE_TYPE_MAP = new ReversibleMap({
   Access: DefaultTypes.EDGE + ':access',
   Aggregation: DefaultTypes.EDGE + ':aggregation',
   Assignment: DefaultTypes.EDGE + ':assignment',
   Association: DefaultTypes.EDGE + ':association',
   Composition: DefaultTypes.EDGE + ':composition',
   Flow: DefaultTypes.EDGE + ':flow',
   Influence: DefaultTypes.EDGE + ':influence',
   Realization: DefaultTypes.EDGE + ':realization',
   Serving: DefaultTypes.EDGE + ':serving',
   Specialization: DefaultTypes.EDGE + ':specialization',
   Triggering: DefaultTypes.EDGE + ':triggering'
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
