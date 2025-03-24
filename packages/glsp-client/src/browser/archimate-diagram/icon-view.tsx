/* eslint-disable react/no-unknown-property */
/* eslint-disable max-len */
/** @jsx svg */
import { ARCHIMATE_ELEMENT_TYPE_MAP } from '@big-archimate/protocol';
import { RenderingContext, ShapeView, findParentByFeature, svg } from '@eclipse-glsp/client';
import { injectable } from '@theia/core/shared/inversify';
import { VNode } from 'snabbdom';
import { icons } from './icons';
import { Icon, isElementNode } from './model';

@injectable()
export class IconView extends ShapeView {
   render(element: Icon, context: RenderingContext): VNode | undefined {
      const elementNode = findParentByFeature(element, isElementNode);
      if (!elementNode || !this.isVisible(element, context)) {
         return undefined;
      }

      const nodeType = ARCHIMATE_ELEMENT_TYPE_MAP.getReverse(elementNode.type);
      const icon: any = icons[nodeType];

      return (<g>{icon}</g>) as any;
   }
}
