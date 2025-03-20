import { ElementType, RelationType } from '../../generated/ast.js';
import { relationConstraints, relationKeyMap } from './relation-constraints.js';

type NodeType = ElementType | 'Junction';

export namespace RelationValidator {
   /**
    * Checks if the given relation is valid for the given source element type.
    * @param relationType the relation type
    * @param sourceNodeType the source node type
    * @returns true if the relation is valid, false otherwise
    */
   export function isValidSource(relationType?: RelationType, sourceNodeType?: NodeType): boolean {
      if (relationType === undefined || sourceNodeType === undefined) {
         return false;
      }

      const relationKeyList = Object.values(relationConstraints[sourceNodeType]);

      for (let i = 0; i < relationKeyList.length; i++) {
         if (relationKeyList[i].includes(relationKeyMap.getReverse(relationType))) {
            return true;
         }
      }

      return false;
   }

   /**
    * Checks if the given relation is valid between the given source and target element types.
    * @param relationType the relation type
    * @param sourceNodeType the source node type
    * @param targetNodeType the target node type
    * @returns true if the relation is valid, false otherwise
    */
   export function isValidTarget(relationType?: RelationType, sourceNodeType?: NodeType, targetNodeType?: NodeType): boolean {
      if (relationType === undefined || sourceNodeType === undefined || targetNodeType === undefined) {
         return false;
      }

      const validRelationKeys = relationConstraints[sourceNodeType][targetNodeType];

      for (let i = 0; i < validRelationKeys.length; i++) {
         if (relationKeyMap.get(validRelationKeys[i]) === relationType) {
            return true;
         }
      }

      return false;
   }
}
