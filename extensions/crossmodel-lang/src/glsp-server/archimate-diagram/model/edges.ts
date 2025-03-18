import { ARCHIMATE_RELATION_TYPE_MAP, REFERENCE_CONTAINER_TYPE, REFERENCE_PROPERTY, REFERENCE_VALUE } from '@crossbreeze/protocol';
import { GEdge, GEdgeBuilder, Point } from '@eclipse-glsp/server';
import { RelationEdge, RelationRoutingPoint } from '../../../language-server/generated/ast.js';
import { ArchiMateModelIndex } from './archimate-model-index.js';

export class GRelationEdge extends GEdge {
   static override builder(): GRelationEdgeBuilder {
      return new GRelationEdgeBuilder(GRelationEdge);
   }
}

export class GRelationEdgeBuilder extends GEdgeBuilder<GRelationEdge> {
   set(edge: RelationEdge, index: ArchiMateModelIndex): this {
      const type = edge.relation.ref?.type;

      if (type) {
         this.type(ARCHIMATE_RELATION_TYPE_MAP.get(type));
      }

      this.id(index.createId(edge));
      this.addCssClasses('diagram-edge', 'relation');
      this.addArg('edgePadding', 5);
      this.addArg(REFERENCE_CONTAINER_TYPE, RelationEdge);
      this.addArg(REFERENCE_PROPERTY, 'relation');
      this.addArg(REFERENCE_VALUE, edge.relation.$refText);

      const sourceId = index.createId(edge.sourceNode?.ref);
      const targetId = index.createId(edge.targetNode?.ref);

      this.sourceId(sourceId || '');
      this.targetId(targetId || '');

      this.addRoutingPoints(edge.routingPoints.map(this.relationEdgeRoutingPointToPoint));
      return this;
   }

   private relationEdgeRoutingPointToPoint(routingPoint: RelationRoutingPoint): Point {
      return { x: routingPoint.x, y: routingPoint.y };
   }
}
