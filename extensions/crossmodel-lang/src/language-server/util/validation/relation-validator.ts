import { ElementType, RelationType } from '../../generated/ast.js';
import { relationConstraints, relationKeys } from './relation-constraints.js';

export class RelationValidator {
   public static validate(sourceElementType: ElementType, targetElementType: ElementType, relationType: RelationType) {
      const validRelationKeys = relationConstraints[sourceElementType][targetElementType];
      validRelationKeys.split('').forEach(key => {
         if (relationKeys[key] === relationType) {
            // Relation is valid
            return true;
         }
         // Relation is not valid
         return false;
      });
   }
}
