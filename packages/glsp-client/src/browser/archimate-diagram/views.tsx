/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

/* eslint-disable react/no-unknown-property */
/* eslint-disable max-len */
/** @jsx svg */

import { ARCHIMATE_RELATION_TYPE_MAP } from '@crossbreeze/protocol';
import { angleOfPoint, CircularNodeView, GEdge, GEdgeView, Point, RenderingContext, svg, toDegrees } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { DiagramNodeView } from '../views';

@injectable()
export class ElementNodeView extends DiagramNodeView {}

@injectable()
export class JunctionNodeView extends CircularNodeView {}

@injectable()
export class RelationEdgeView extends GEdgeView {
   protected override renderAdditionals(edge: GEdge, segments: Point[], context: RenderingContext): VNode[] {
      const additionals = super.renderAdditionals(edge, segments, context);
      const p1 = segments[segments.length - 2];
      const p2 = segments[segments.length - 1];

      const targetMarker = this.getTargetMarker(edge, p1, p2);
      if (targetMarker !== undefined) {
         additionals.push(targetMarker);
      }

      const sourceMarker = this.getSourceMarker(edge, p1, p2);
      if (sourceMarker !== undefined) {
         additionals.push(sourceMarker);
      }

      return additionals;
   }

   private getTargetMarker(edge: GEdge, p1: Point, p2: Point): VNode | undefined {
      let targetMarkerPath = '';
      const relationType = ARCHIMATE_RELATION_TYPE_MAP.getReverse(edge.type);

      if (relationType === 'Specialization' || relationType === 'Realization') {
         targetMarkerPath = 'M 20 -10 L 2 0 L 20 10 Z';
      } else if (relationType === 'Triggering' || relationType === 'Flow' || relationType === 'Assignment') {
         targetMarkerPath = 'M 14 -7 L 2 0 L 14 7 Z';
      } else if (relationType === 'Serving') {
         targetMarkerPath = 'M 18 9 L 2 0 L 18 -9';
      } else if (relationType === 'Access' || relationType === 'Influence') {
         targetMarkerPath = 'M 14 -7 L 2 0 L 14 7';
      } else if (relationType === 'Composition' || relationType === 'Aggregation') {
         targetMarkerPath = 'M 14 -7 L 2 0 L 14 7 L 26 0 Z';
      }

      if (targetMarkerPath !== '') {
         return (
            <path
               class-sprotty-edge={true}
               class-arrow={true}
               d={targetMarkerPath}
               transform={`rotate(${toDegrees(angleOfPoint(Point.subtract(p1, p2)))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}
            />
         ) as any;
      }

      return undefined;
   }

   private getSourceMarker(edge: GEdge, p1: Point, p2: Point): VNode | undefined {
      let sourceMarkerPath = '';
      const relationType = ARCHIMATE_RELATION_TYPE_MAP.getReverse(edge.type);

      if (relationType === 'Assignment') {
         sourceMarkerPath = 'M 0 0 A 1 1 0 0 0 -14 0 A 1 1 0 0 0 0 0';
      }

      if (sourceMarkerPath !== '') {
         return (
            <path
               class-sprotty-edge={true}
               class-circle={true}
               d={sourceMarkerPath}
               transform={`rotate(${toDegrees(angleOfPoint(Point.subtract(p1, p2)))} ${p1.x} ${p1.y}) translate(${p1.x} ${p1.y})`}
            />
         ) as any;
      }

      return undefined;
   }
}
