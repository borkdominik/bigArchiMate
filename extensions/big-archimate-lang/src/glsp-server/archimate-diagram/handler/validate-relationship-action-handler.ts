import { ARCHIMATE_NODE_TYPE_MAP, ARCHIMATE_RELATION_TYPE_MAP } from '@big-archimate/protocol';
import { DiagramConfiguration, EdgeCreationChecker, ModelState, RequestCheckEdgeActionHandler } from '@eclipse-glsp/server';
import { inject, injectable, optional } from 'inversify';
import { RelationshipValidator } from '../../../language-server/util/validation/relationship-validator.js';

@injectable()
export class ValidateRelationshipActionHandler extends RequestCheckEdgeActionHandler {
   @inject(ModelState)
   protected override modelState!: ModelState;

   @inject(DiagramConfiguration)
   protected override diagramConfiguration!: DiagramConfiguration;

   @inject(EdgeCreationChecker)
   @optional()
   protected override edgeCreationChecker?: EdgeCreationChecker = {
      isValidSource(edgeType, sourceElement) {
         return RelationshipValidator.isValidSource(
            ARCHIMATE_RELATION_TYPE_MAP.getReverse(edgeType),
            ARCHIMATE_NODE_TYPE_MAP.getReverse(sourceElement.type)
         );
      },
      isValidTarget(edgeType, sourceElement, targetElement) {
         return RelationshipValidator.isValidTarget(
            ARCHIMATE_RELATION_TYPE_MAP.getReverse(edgeType),
            ARCHIMATE_NODE_TYPE_MAP.getReverse(sourceElement.type),
            ARCHIMATE_NODE_TYPE_MAP.getReverse(targetElement.type)
         );
      }
   };
}
