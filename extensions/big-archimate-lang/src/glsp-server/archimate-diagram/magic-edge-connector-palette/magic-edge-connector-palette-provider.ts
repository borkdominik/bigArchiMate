import { injectable, inject } from 'inversify';
import {
   MaybePromise,
   PaletteItem,
   ContextActionsProvider,
   EditorContext,
   GModelElement,
   ModelState,
   CreateEdgeOperation
} from '@eclipse-glsp/server';
import {
   ARCHIMATE_NODE_TYPE_MAP,
   ARCHIMATE_RELATION_TYPE_MAP,
   ElementType,
   getIcon,
   getLabel,
   getSpecificationSection,
   isElementType,
   JunctionType,
   RelationType
} from '@big-archimate/protocol';
import { RelationValidator } from '../../../language-server/util/validation/relation-validator.js';

type NodeType = ElementType | JunctionType;

export const MAGIC_CONNECTOR_CONTEXT_ID = 'archimate.magic-edge-connector';

@injectable()
export class ArchiMateMagicEdgeConnectorPaletteProvider implements ContextActionsProvider {
   readonly contextId = MAGIC_CONNECTOR_CONTEXT_ID;

   @inject(ModelState)
   protected readonly modelState: ModelState;

   getActions(editorContext: EditorContext): MaybePromise<PaletteItem[]> {
      const [sourceId, targetId] = (editorContext.selectedElementIds ?? []) as string[];
      if (!sourceId || !targetId) {
         return [];
      }

      const sourceNodeType = this.getNodeType(sourceId);
      const targetNodeType = this.getNodeType(targetId);

      if (!sourceNodeType || !targetNodeType) {
         return [];
      }

      const validRelations = RelationValidator.getValidRelations(sourceNodeType, targetNodeType);
      return validRelations.map(relationType => this.getRelationPaletteItem(relationType, 'B', sourceId, targetId));
   }

   protected getNodeType(elementId: string): NodeType | undefined {
      const indexAny = (this.modelState as any).index;
      const element = indexAny?.idToElement?.get(elementId) as GModelElement | undefined;

      if (!element) {
         return undefined;
      }

      const elementTypeId = (element as any).type;

      const nodeType = ARCHIMATE_NODE_TYPE_MAP.getReverse(elementTypeId);
      if (!nodeType) {
         return undefined;
      }
      if (isElementType(nodeType)) {
         return nodeType as ElementType;
      }
      if (nodeType === 'And' || nodeType === 'Or') {
         return nodeType as JunctionType;
      }
      return undefined;
   }

   /**
    * Returns a palette item for the given relation type.
    * @param relationType The relation type.
    * @param groupSortString The sort string of the group.
    * @param sourceId The source element ID.
    * @param targetId The target element ID.
    * @return The palette item.
    */
   getRelationPaletteItem = (relationType: RelationType, groupSortString: string, sourceId: string, targetId: string): PaletteItem => {
      const elementTypeId = ARCHIMATE_RELATION_TYPE_MAP.get(relationType);
      if (!elementTypeId) {
         throw new Error(`No element type mapping found for relation type: ${relationType}`);
      }
      return {
         id: `${relationType}-create-tool`,
         sortString: `${groupSortString}-${getSpecificationSection(relationType)}`,
         label: `${getLabel(relationType)}`,
         icon: getIcon(relationType),
         actions: [
            CreateEdgeOperation.create({
               elementTypeId,
               sourceElementId: sourceId,
               targetElementId: targetId
            })
         ]
      };
   };
}
