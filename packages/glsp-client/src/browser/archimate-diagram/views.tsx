/* eslint-disable react/no-unknown-property */
/* eslint-disable max-len */
/** @jsx svg */

import { ARCHIMATE_RELATION_TYPE_MAP } from '@big-archimate/protocol';
import {
   angleOfPoint,
   CircularNodeView,
   GEdge,
   GNode,
   hiddenBoundingRect,
   Point,
   PolylineEdgeView,
   RenderingContext,
   ShapeView,
   svg,
   toDegrees
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { DiagramNodeView } from '../views';

@injectable()
export class ElementNodeView extends DiagramNodeView {}

export class GroupingNodeView extends ShapeView {
   override render(node: Readonly<GNode>, context: RenderingContext): VNode {
      const bounds = node.bounds;
      const width = bounds?.width ?? 200;
      const height = bounds?.height ?? 120;

      const labelChild = node.children.find(child => child.id === `${node.id}_label`);
      const contentChildren = node.children.filter(child => child.id !== `${node.id}_label`);

      const label = (labelChild as any)?.text ?? '';

      // Character-width approximation: no DOM access in virtual render, so exact metrics aren't available.
      const labelBackgroundWidth = Math.max(60, label.length * 8 + 16);
      const labelBackgroundHeight = 20;

      const renderedLabel = labelChild ? context.renderElement(labelChild) : undefined;
      const renderedContentChildren = contentChildren.map(child => context.renderElement(child));

      return (
         <g class-diagram-node={true} class-element={true} class-grouping={true} data-svg-metadata-type={node.type}>
            {hiddenBoundingRect(node, context) as any}
            <rect
               class-sprotty-node={true}
               x={0}
               y={labelBackgroundHeight + 0.75}
               width={width}
               height={height - labelBackgroundHeight - 0.75}
            />
            <rect class-grouping-label-background={true} x={0} y={0} width={labelBackgroundWidth} height={labelBackgroundHeight} />

            {/* Top border of label */}
            <line class-grouping-label-border={true} x1={0} y1={0} x2={labelBackgroundWidth} y2={0} />

            {/* Left border of label */}
            <line class-grouping-label-border={true} x1={0} y1={0} x2={0} y2={labelBackgroundHeight} />

            {/* Right border of label */}
            <line
               class-grouping-label-border={true}
               x1={labelBackgroundWidth}
               y1={0}
               x2={labelBackgroundWidth}
               y2={labelBackgroundHeight}
            />

            {renderedLabel as any}
            {renderedContentChildren as any}
         </g>
      ) as any;
   }
}

@injectable()
export class JunctionNodeView extends CircularNodeView {}

@injectable()
export class RelationEdgeView extends PolylineEdgeView {
   protected override renderAdditionals(edge: GEdge, segments: Point[], context: RenderingContext): VNode[] {
      const additionals = super.renderAdditionals(edge, segments, context);

      const sourceP1 = segments[0];
      const sourceP2 = segments[1];

      const targetP1 = segments[segments.length - 2];
      const targetP2 = segments[segments.length - 1];

      const targetMarker = this.getTargetMarker(edge, targetP1, targetP2);
      if (targetMarker !== undefined) {
         additionals.push(targetMarker);
      }

      const sourceMarker = this.getSourceMarker(edge, sourceP1, sourceP2);
      if (sourceMarker !== undefined) {
         additionals.push(sourceMarker);
      }

      return additionals;
   }

   private effectiveType(edge: GEdge): string {
      return edge.type.startsWith('proxy-') ? edge.type.substring('proxy-'.length) : edge.type;
   }

   private getTargetMarker(edge: GEdge, p1: Point, p2: Point): VNode | undefined {
      let targetMarkerPath = '';
      if (edge.type === 'magic-connector-edge') {
         targetMarkerPath = 'M 14 -7 L 2 0 L 14 7 Z';

         return (
            <path
               class-sprotty-edge={true}
               class-arrow={true}
               class-magic-connector-arrow={true}
               d={targetMarkerPath}
               transform={`rotate(${toDegrees(angleOfPoint(Point.subtract(p1, p2)))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}
            />
         ) as any;
      }

      const relationType = ARCHIMATE_RELATION_TYPE_MAP.getReverse(this.effectiveType(edge));

      if (relationType === 'Specialization' || relationType === 'Realization') {
         targetMarkerPath = 'M 20 -10 L 2 0 L 20 10 Z';
      } else if (relationType === 'Triggering' || relationType === 'Flow' || relationType === 'Assignment') {
         targetMarkerPath = 'M 14 -7 L 2 0 L 14 7 Z';
      } else if (relationType === 'Serving') {
         targetMarkerPath = 'M 18 9 L 2 0 L 18 -9';
      } else if (relationType === 'Access' || relationType === 'Influence') {
         targetMarkerPath = 'M 14 -7 L 2 0 L 14 7';
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
      const relationType = ARCHIMATE_RELATION_TYPE_MAP.getReverse(this.effectiveType(edge));

      if (relationType === 'Assignment') {
         sourceMarkerPath = 'M 0 0 A 1 1 0 0 0 -14 0 A 1 1 0 0 0 0 0';
      } else if (relationType === 'Composition' || relationType === 'Aggregation') {
         sourceMarkerPath = 'M -14 7 L -2 0 L -14 -7 L -26 0 Z';
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
