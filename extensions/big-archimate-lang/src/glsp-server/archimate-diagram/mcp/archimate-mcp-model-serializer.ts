import {
   ARCHIMATE_NODE_TYPE_MAP,
   ARCHIMATE_RELATION_TYPE_MAP,
   getLayer,
   isElementType,
   isJunctionType,
   isRelationType,
   layerTypes
} from '@big-archimate/protocol';
import { DefaultTypes, GModelElement } from '@eclipse-glsp/server';
import { MarkdownMcpModelSerializer, SerializedElement } from '@eclipse-glsp/server-mcp';
import { injectable } from 'inversify';

const RELATIONS_BUCKET = 'Relations';
const OTHER_BUCKET = 'Other';

/**
 * Groups ArchiMate elements by their layer (Business, Application, Technology, ...) with
 * relations in a dedicated section, so the Markdown the LLM sees mirrors the way an
 * enterprise architect reads a model. Each element gets its ArchiMate concept name
 * attached so the LLM can refer to a 'BusinessActor' rather than 'node:business-actor'.
 */
@injectable()
export class ArchiMateMcpModelSerializer extends MarkdownMcpModelSerializer {
   protected override prepareElement(element: GModelElement): Record<string, SerializedElement[]> {
      const flat = this.flattenStructure(element as unknown as SerializedElement, element.parent?.id);
      const buckets: Record<string, SerializedElement[]> = {
         ...Object.fromEntries(layerTypes.map(layer => [layer, []] as const)),
         [RELATIONS_BUCKET]: [],
         [OTHER_BUCKET]: []
      };
      for (const serialized of flat) {
         this.combinePositionAndSize(serialized);
         const adjusted = this.adjustElement(serialized);
         if (!adjusted) {
            continue;
         }
         buckets[this.bucketFor(adjusted)].push(adjusted);
      }
      return buckets;
   }

   protected bucketFor(element: SerializedElement): string {
      const concept = element.concept;
      if (typeof concept !== 'string') {
         return OTHER_BUCKET;
      }
      if (isRelationType(concept)) {
         return RELATIONS_BUCKET;
      }
      if (isElementType(concept) || isJunctionType(concept)) {
         return getLayer(concept);
      }
      return OTHER_BUCKET;
   }

   protected adjustElement(element: SerializedElement): SerializedElement | undefined {
      const type = element.type;
      if (typeof type !== 'string') {
         return undefined;
      }

      if (type === DefaultTypes.GRAPH) {
         return { id: element.id, type, isContainer: true };
      }

      const relationConcept = ARCHIMATE_RELATION_TYPE_MAP.getReverse(type);
      if (relationConcept) {
         return {
            id: element.id,
            type,
            concept: relationConcept,
            sourceId: element.sourceId,
            targetId: element.targetId,
            parentId: element.parentId
         };
      }

      const nodeConcept = ARCHIMATE_NODE_TYPE_MAP.getReverse(type);
      if (nodeConcept) {
         return {
            id: element.id,
            type,
            concept: nodeConcept,
            label: this.readChildLabel(element),
            position: element.position,
            size: element.size,
            bounds: element.bounds,
            parentId: element.parentId
         };
      }

      // Labels, icons, and anything else GLSP emits are dropped from MCP output to reduce
      // context noise; the LLM does not need to know about visual sub-elements.
      return undefined;
   }

   protected readChildLabel(element: SerializedElement): string | undefined {
      const children = Array.isArray(element.children) ? (element.children as SerializedElement[]) : [];
      for (const child of children) {
         if (typeof child.text === 'string' && child.text.length > 0) {
            return child.text;
         }
      }
      return undefined;
   }
}
