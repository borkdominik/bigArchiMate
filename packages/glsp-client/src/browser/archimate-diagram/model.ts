import {
   boundsFeature,
   CircularNode,
   Dimension,
   EditableLabel,
   fadeFeature,
   GChildElement,
   GLabel,
   GModelElement,
   GParentElement,
   GShapeElement,
   isEditableLabel,
   isParent,
   layoutableChildFeature,
   LayoutContainer,
   layoutContainerFeature,
   ModelFilterPredicate,
   Point,
   RectangularNode,
   WithEditableLabel
} from '@eclipse-glsp/client';
import { LibavoidEdge } from 'sprotty-routing-libavoid';

export class ElementNode extends RectangularNode implements WithEditableLabel {
   get editableLabel(): (GChildElement & EditableLabel) | undefined {
      return findElementBy(this, isEditableLabel) as (GChildElement & EditableLabel) | undefined;
   }
}

export function isElementNode(element: GModelElement): element is ElementNode {
   return element instanceof ElementNode || false;
}

export class GroupingNode extends RectangularNode implements WithEditableLabel {
   get editableLabel(): (GChildElement & EditableLabel) | undefined {
      return this.children.find(child => isEditableLabel(child)) as (GChildElement & EditableLabel) | undefined;
   }
}

export function isGroupingNode(element: GModelElement): element is GroupingNode {
   return element instanceof GroupingNode || false;
}

export class JunctionNode extends CircularNode {}

export function isJunctionNode(junction: GModelElement): junction is JunctionNode {
   return junction instanceof JunctionNode || false;
}

export class RelationEdge extends LibavoidEdge {}

export class GEditableLabel extends GLabel implements EditableLabel {
   get editControlPositionCorrection(): Point {
      const nodeBounds = (this.parent as any).bounds;

      const baseX = (nodeBounds?.x ?? 0) - (this.bounds?.x ?? 0);

      if (this.parent?.type === 'node:grouping') {
         return {
            x: -4,
            y: -4
         };
      }
      return {
         x: baseX + 5,
         y: -4
      };
   }

   get editControlDimension(): Dimension {
      if (this.parent?.type === 'node:grouping') {
         return {
            width: Math.max(80, this.bounds?.width ?? 80),
            height: Math.max(20, this.bounds?.height ?? 20)
         };
      }
      const nb = (this.parent as any).bounds;
      if (!nb) {
         return { width: this.bounds.width, height: this.bounds.height };
      }
      return { width: nb.width, height: Math.max(20, this.bounds.height) };
   }
}

export function findElementBy<T>(parent: GParentElement, predicate: ModelFilterPredicate<T>): (GModelElement & T) | undefined {
   if (predicate(parent)) {
      return parent;
   }
   if (isParent(parent)) {
      for (const child of parent.children) {
         const result = findElementBy(child, predicate);
         if (result !== undefined) {
            return result;
         }
      }
   }
   return undefined;
}

export class Icon extends GShapeElement implements LayoutContainer {
   static readonly DEFAULT_FEATURES = [boundsFeature, layoutContainerFeature, layoutableChildFeature, fadeFeature];

   layout: string;
   override layoutOptions?: { [key: string]: string | number | boolean };
   override size = {
      width: 32,
      height: 32
   };
}
