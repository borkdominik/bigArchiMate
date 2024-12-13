/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/
import { ElementType, RelationType } from '../../generated/ast.js';
import { relationConstraints, relationKeyToRelationType } from './relation-constraints.js';

export namespace RelationValidator {
   /**
    * Checks if the given relation is valid between the given source and target element types.
    * @param sourceElementType the source element type
    * @param targetElementType the target element type
    * @param relationType the relation type
    * @returns true if the relation is valid, false otherwise
    */
   export function isValid(sourceElementType?: ElementType, targetElementType?: ElementType, relationType?: RelationType): boolean {
      if (sourceElementType === undefined || targetElementType === undefined || relationType === undefined) {
         return false;
      }

      const validRelationKeys = relationConstraints[sourceElementType][targetElementType];

      for (let i = 0; i < validRelationKeys.length; i++) {
         if (relationKeyToRelationType[validRelationKeys[i]] === relationType) {
            // Relation is valid
            return true;
         }
      }
      // Relation is not valid
      return false;
   }
}
