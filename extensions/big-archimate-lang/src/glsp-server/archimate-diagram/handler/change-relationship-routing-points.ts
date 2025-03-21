import { ChangeRoutingPointsOperation, Command, JsonOperationHandler, MaybePromise, ModelState } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { RelationshipRoutingPoint } from '../../../language-server/generated/ast.js';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

@injectable()
export class ChangeRelationshipRoutingPointsOperationHandler extends JsonOperationHandler {
   operationType = ChangeRoutingPointsOperation.KIND;

   @inject(ModelState) protected override modelState!: ArchiMateModelState;

   override createCommand(operation: ChangeRoutingPointsOperation): MaybePromise<Command | undefined> {
      return new ArchiMateCommand(this.modelState, () => this.executeChangeRoutingPoints(operation));
   }

   executeChangeRoutingPoints(operation: ChangeRoutingPointsOperation): MaybePromise<void> {
      const relationshipEdgeId = operation.newRoutingPoints[0].elementId;
      const relationshipEdge = this.modelState.index.findRelationshipEdge(relationshipEdgeId);
      const newRoutingPoints = operation.newRoutingPoints[0].newRoutingPoints;

      if (relationshipEdge && newRoutingPoints) {
         relationshipEdge.routingPoints = newRoutingPoints.map(routingPoint => ({
            $type: RelationshipRoutingPoint,
            $container: relationshipEdge,
            x: routingPoint.x,
            y: routingPoint.y
         }));
      }
   }
}
