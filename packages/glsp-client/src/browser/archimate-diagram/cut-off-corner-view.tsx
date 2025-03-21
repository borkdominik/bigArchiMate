/* eslint-disable react/no-unknown-property */
/* eslint-disable max-len */
/** @jsx svg */
import { GNode, Hoverable, RectangularNodeView, RenderingContext, Selectable, svg } from '@eclipse-glsp/client';
import { ReactNode } from '@theia/core/shared/react';
import { injectable } from 'inversify';
import { Classes, VNode } from 'snabbdom';

@injectable()
export class CutOffCornerNodeView extends RectangularNodeView {
   override render(node: Readonly<GNode & Hoverable & Selectable>, context: RenderingContext): VNode | undefined {
      const wrapper = new CutOffCornerWrapper(node);
      const Vnode: any = (
         <g class-node={true}>
            <defs>
               <clipPath id={toClipPathId(node)}>
                  <path d={this.renderPath(wrapper, context, this.getClipPathInsets() || 0)}></path>
               </clipPath>
            </defs>
            {this.renderPathNode(wrapper, context)}
            {context.renderChildren(node) as ReactNode}
         </g>
      );
      return Vnode;
   }

   protected getClipPathInsets(): number | undefined {
      return 2;
   }

   protected renderPathNode(wrapper: Readonly<CutOffCornerWrapper>, context: RenderingContext): ReactNode {
      return (
         <path
            d={this.renderPath(wrapper, context, 0)}
            class-sprotty-node={wrapper.element instanceof GNode}
            class-mouseover={wrapper.element.hoverFeedback}
            class-selected={wrapper.element.selected}
            {...this.additionalClasses(wrapper.element, context)}
         />
      );
   }

   protected additionalClasses(_node: Readonly<GNode & Hoverable & Selectable>, _context: RenderingContext): Classes {
      return {};
   }

   protected renderPath(wrapper: Readonly<CutOffCornerWrapper>, _context: RenderingContext, inset: number): string {
      const width = wrapper.size.width - inset * 2;
      const height = wrapper.size.height - inset * 2;
      const cutOff = wrapper.cutOffSize;

      return `M ${cutOff},0 
                  L ${width - cutOff},0 
                  L ${width},${cutOff} 
                  L ${width},${height - cutOff} 
                  L ${width - cutOff},${height} 
                  L ${cutOff},${height} 
                  L 0,${height - cutOff} 
                  L 0,${cutOff} 
                  Z`;
   }
}

/**
 * Wrapper class for handling cut-off corner calculations and size.
 */
class CutOffCornerWrapper {
   readonly size: { width: number; height: number };
   readonly cutOffSize: number;
   readonly element: GNode & Hoverable & Selectable;

   constructor(element: Readonly<GNode & Hoverable & Selectable>) {
      this.element = element as GNode & Hoverable & Selectable;
      this.size = {
         width: element.bounds.width,
         height: element.bounds.height
      };

      const minDim = Math.min(this.size.width, this.size.height);
      // percentage to cut
      this.cutOffSize = minDim * 0.3;
   }
}

function toClipPathId(node: Readonly<GNode & Hoverable & Selectable>): string {
   return `${node.id}_clip_path`;
}
