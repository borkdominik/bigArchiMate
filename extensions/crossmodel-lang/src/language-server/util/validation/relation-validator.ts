/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/
import { ElementType, RelationType } from '../../generated/ast.js';
import { relationConstraints, relationKeyMap } from './relation-constraints.js';

export namespace RelationValidator {
   /**
    * Checks if the given relation is valid for the given source element type.
    * @param relationType the relation type
    * @param sourceElementType the source element type
    * @returns true if the relation is valid, false otherwise
    */
   export function isValidSource(relationType?: RelationType, sourceElementType?: ElementType): boolean {
      if (relationType === undefined || sourceElementType === undefined) {
         return false;
      }

      const relationKeyList = Object.values(relationConstraints[sourceElementType]);

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
    * @param sourceElementType the source element type
    * @param targetElementType the target element type
    * @returns true if the relation is valid, false otherwise
    */
   export function isValidTarget(relationType?: RelationType, sourceElementType?: ElementType, targetElementType?: ElementType): boolean {
      if (relationType === undefined || sourceElementType === undefined || targetElementType === undefined) {
         return false;
      }

      const validRelationKeys = relationConstraints[sourceElementType][targetElementType];

      for (let i = 0; i < validRelationKeys.length; i++) {
         if (relationKeyMap.get(validRelationKeys[i]) === relationType) {
            return true;
         }
      }

      return false;
   }
}
