import { ARCHIMATE_RELATION_TYPE_MAP, REFERENCE_CONTAINER_TYPE, REFERENCE_PROPERTY, REFERENCE_VALUE } from '@big-archimate/protocol';
import { GEdge, GEdgeBuilder, Point } from '@eclipse-glsp/server';
import { RelationshipEdge, RelationshipRoutingPoint } from '../../../language-server/generated/ast.js';
import { ArchiMateGModelIndex } from '../../common/gmodel-index.js';

export class GRelationshipEdge extends GEdge {
   static override builder(): GRelationshipEdgeBuilder {
      return new GRelationshipEdgeBuilder(GRelationshipEdge);
   }
}

export class GRelationshipEdgeBuilder extends GEdgeBuilder<GRelationshipEdge> {
   set(edge: RelationshipEdge, index: ArchiMateGModelIndex): this {
      const type = edge.relationship.ref?.type;

      if (type) {
         this.type(ARCHIMATE_RELATION_TYPE_MAP.get(type));
      }

      this.id(index.createId(edge));
      this.addCssClasses('diagram-edge', 'relationship');
      this.addArg('edgePadding', 5);
      this.addArg(REFERENCE_CONTAINER_TYPE, RelationshipEdge);
      this.addArg(REFERENCE_PROPERTY, 'relationship');
      this.addArg(REFERENCE_VALUE, edge.relationship.$refText);

      const sourceId = index.createId(edge.sourceNode?.ref);
      const targetId = index.createId(edge.targetNode?.ref);

      this.sourceId(sourceId || '');
      this.targetId(targetId || '');

      this.addRoutingPoints(edge.routingPoints.map(this.relationshipEdgeRoutingPointToPoint));
      return this;
   }

   private relationshipEdgeRoutingPointToPoint(routingPoint: RelationshipRoutingPoint): Point {
      return { x: routingPoint.x, y: routingPoint.y };
   }
}
