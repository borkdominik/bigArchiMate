import { injectable, inject } from 'inversify';
import {
   MaybePromise,
   PaletteItem,
   TriggerEdgeCreationAction,
   ContextActionsProvider,
   EditorContext,
   GModelElement,
   ModelState
} from '@eclipse-glsp/server';
import {
   ARCHIMATE_RELATION_TYPE_MAP,
   ElementType,
   getIcon,
   getLabel,
   getSpecificationSection, isElementType,
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
      return validRelations.map(relationType => this.getRelationPaletteItem(relationType, 'B'));
   }

   protected getNodeType(elementId: string): NodeType | undefined {
      const indexAny = (this.modelState as any).index;
      const element = indexAny?.idToElement?.get(elementId) as GModelElement | undefined;

      if (!element) {
         return undefined;
      }

      const refValue = (element as any).args?.['reference-value'];
      if (typeof refValue === 'string' && isElementType(refValue)) {
         return refValue;
      }

      if (refValue === 'And' || refValue === 'Or') {
         return refValue as JunctionType;
      }
      return undefined;
   }

   /**
    * Returns a palette item for the given relation type.
    * @param relationType The relation type.
    * @param groupSortString The sort string of the group.
    * @returns The palette item.
    */
   getRelationPaletteItem = (relationType: RelationType, groupSortString: string): PaletteItem => ({
      id: `${relationType}-create-tool`,
      sortString: `${groupSortString}-${getSpecificationSection(relationType)}`,
      label: `${getLabel(relationType)}`,
      icon: getIcon(relationType),
      actions: [TriggerEdgeCreationAction.create(ARCHIMATE_RELATION_TYPE_MAP.get(relationType), { args: { type: 'create' } })]
   });
}
