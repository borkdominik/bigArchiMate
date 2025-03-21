import { ElementType, RelationshipType } from '../../generated/ast.js';
import { relationshipConstraints, relationshipKeyMap } from './relationship-constraints.js';

type NodeType = ElementType | 'Junction';

export namespace RelationshipValidator {
   /**
    * Checks if the given relationship is valid for the given source element type.
    * @param relationshipType the relationship type
    * @param sourceNodeType the source node type
    * @returns true if the relationship is valid, false otherwise
    */
   export function isValidSource(relationshipType?: RelationshipType, sourceNodeType?: NodeType): boolean {
      if (relationshipType === undefined || sourceNodeType === undefined) {
         return false;
      }

      const relationshipKeyList = Object.values(relationshipConstraints[sourceNodeType]);

      for (let i = 0; i < relationshipKeyList.length; i++) {
         if (relationshipKeyList[i].includes(relationshipKeyMap.getReverse(relationshipType))) {
            return true;
         }
      }

      return false;
   }

   /**
    * Checks if the given relationship is valid between the given source and target element types.
    * @param relationshipType the relationship type
    * @param sourceNodeType the source node type
    * @param targetNodeType the target node type
    * @returns true if the relationship is valid, false otherwise
    */
   export function isValidTarget(relationshipType?: RelationshipType, sourceNodeType?: NodeType, targetNodeType?: NodeType): boolean {
      if (relationshipType === undefined || sourceNodeType === undefined || targetNodeType === undefined) {
         return false;
      }

      const validRelationshipKeys = relationshipConstraints[sourceNodeType][targetNodeType];

      for (let i = 0; i < validRelationshipKeys.length; i++) {
         if (relationshipKeyMap.get(validRelationshipKeys[i]) === relationshipType) {
            return true;
         }
      }

      return false;
   }
}
