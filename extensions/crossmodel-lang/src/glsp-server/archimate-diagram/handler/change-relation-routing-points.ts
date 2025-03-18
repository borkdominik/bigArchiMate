import { ChangeRoutingPointsOperation, Command, JsonOperationHandler, MaybePromise, ModelState } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { RelationRoutingPoint } from '../../../language-server/generated/ast.js';
import { CrossModelCommand } from '../../common/cross-model-command.js';
import { ArchiMateModelState } from '../model/archimate-model-state.js';

@injectable()
export class ArchiMateDiagramChangeRelationRoutingPointsOperationHandler extends JsonOperationHandler {
   operationType = ChangeRoutingPointsOperation.KIND;

   @inject(ModelState) protected override modelState!: ArchiMateModelState;

   override createCommand(operation: ChangeRoutingPointsOperation): MaybePromise<Command | undefined> {
      return new CrossModelCommand(this.modelState, () => this.executeChangeRoutingPoints(operation));
   }

   executeChangeRoutingPoints(operation: ChangeRoutingPointsOperation): MaybePromise<void> {
      const relationEdgeId = operation.newRoutingPoints[0].elementId;
      const relationEdge = this.modelState.index.findRelationEdge(relationEdgeId);
      const newRoutingPoints = operation.newRoutingPoints[0].newRoutingPoints;

      if (relationEdge && newRoutingPoints) {
         relationEdge.routingPoints = newRoutingPoints.map(routingPoint => ({
            $type: RelationRoutingPoint,
            $container: relationEdge,
            x: routingPoint.x,
            y: routingPoint.y
         }));
      }
   }
}
