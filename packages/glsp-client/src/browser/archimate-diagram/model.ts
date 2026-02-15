import {
   boundsFeature,
   CircularNode,
   Dimension,
   EditableLabel,
   fadeFeature,
   GChildElement,
   GEdge,
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

export class ElementNode extends RectangularNode implements WithEditableLabel {
   get editableLabel(): (GChildElement & EditableLabel) | undefined {
      return findElementBy(this, isEditableLabel) as (GChildElement & EditableLabel) | undefined;
   }
}

export function isElementNode(element: GModelElement): element is ElementNode {
   return element instanceof ElementNode || false;
}

export class JunctionNode extends CircularNode {}

export function isJunctionNode(junction: GModelElement): junction is JunctionNode {
   return junction instanceof JunctionNode || false;
}

export class RelationEdge extends GEdge {}

export class GEditableLabel extends GLabel implements EditableLabel {
   get editControlPositionCorrection(): Point {
      const nodeBounds = (this.parent as any).bounds;

      const baseX = (nodeBounds?.x ?? 0) - (this.bounds?.x ?? 0);
      return {
         x: baseX + 5,
         y: -4
      };
   }

   get editControlDimension(): Dimension {
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
