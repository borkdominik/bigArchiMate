/** @jsx svg */
/* eslint-disable react/no-unknown-property */
/* eslint-disable max-len */
/** @jsx svg */

import { RenderingContext, RoundedCornerNodeView, RoundedCornerWrapper } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class DiagramNodeView extends RoundedCornerNodeView {
   protected override renderPath(wrapper: Readonly<RoundedCornerWrapper>, context: RenderingContext, inset: number): string {
      const path = super.renderPath(wrapper, context, inset);
      const node = wrapper.element;
      // render a separator line
      return node.children[1] && node.children[1].children.length > 0 ? path + ' M 0,28  L ' + wrapper.element.bounds.width + ',28' : path;
   }
}
