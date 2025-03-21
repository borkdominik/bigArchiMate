import {
   ARCHIMATE_CONCEPT_TYPE_MAP,
   ARCHIMATE_ELEMENT_TYPE_MAP,
   ELEMENT_ICON_TYPE,
   ELEMENT_LABEL_TYPE,
   getCornerType,
   getLayer,
   REFERENCE_CONTAINER_TYPE,
   REFERENCE_PROPERTY,
   REFERENCE_VALUE,
   toKebabCase
} from '@big-archimate/protocol';
import { ArgsUtil, GCompartment, GLabel, GNode, GNodeBuilder } from '@eclipse-glsp/server';
import { ElementNode, JunctionNode } from '../../../language-server/generated/ast.js';
import { ArchiMateGModelIndex } from '../../common/gmodel-index.js';

export class GElementNode extends GNode {
   static override builder(): GElementNodeBuilder {
      return new GElementNodeBuilder(GElementNode);
   }
}

const ICON_SIZE = 16;
const H_GAP = 5;

export class GElementNodeBuilder extends GNodeBuilder<GElementNode> {
   set(node: ElementNode, index: ArchiMateGModelIndex): this {
      const elementType = node.element.ref?.type;

      if (elementType === undefined) {
         return this;
      }

      const elementCornerType = getCornerType(elementType);
      const elementLayer = getLayer(elementType);

      this.id(index.createId(node));
      this.type(ARCHIMATE_ELEMENT_TYPE_MAP.get(elementType));

      // Get the reference that the DiagramNode holds to the Element in the .langium file.
      const elementRef = node.element?.ref;

      const getBackgroundCssClass = (): string => {
         if (elementLayer !== 'Other') {
            return `bg-${toKebabCase(elementLayer)}`;
         } else if (elementType === 'Location') {
            return 'bg-location';
         }
         return 'bg-default';
      };

      // Options which are the same for every node
      this.addCssClasses('diagram-node', 'element', getBackgroundCssClass());
      this.addArg(REFERENCE_CONTAINER_TYPE, ElementNode);
      this.addArg(REFERENCE_PROPERTY, 'element');
      this.addArg(REFERENCE_VALUE, node.element.$refText);

      // The DiagramNode in the langium file holds the coordinates of node
      this.layout('hbox')
         .add(
            GCompartment.builder()
               .id(`${this.proxy.id}_header`)
               .addLayoutOption('vAlign', 'center') // center the label vertically
               .addLayoutOption('hGrab', true) // take all available space
               .addLayoutOption('paddingRight', -ICON_SIZE - H_GAP) // compensate for size of the icon to get full width
               .addLayoutOption('paddingLeft', 0)
               .layout('vbox')
               .add(
                  GLabel.builder()
                     .type(ELEMENT_LABEL_TYPE)
                     .text(elementRef?.name || elementRef?.id || 'unresolved')
                     .id(`${this.proxy.id}_label`)
                     .addCssClass('header-label')
                     .addLayoutOption('hAlign', 'center')
                     .build()
               )
               .build()
         )
         .add(GCompartment.builder().type(ELEMENT_ICON_TYPE).addLayoutOption('vAlign', 'top').build())
         .addArgs(ArgsUtil.cornerRadius(elementCornerType === 'round' ? 20 : 0))
         .addLayoutOption('hGap', H_GAP)
         .addLayoutOption('prefWidth', node.width || 100)
         .addLayoutOption('prefHeight', node.height || 100)
         .position(node.x || 100, node.y || 100);

      return this;
   }
}

export class GJunctionNode extends GNode {
   static override builder(): GJunctionNodeBuilder {
      return new GJunctionNodeBuilder(GJunctionNode);
   }
}

export class GJunctionNodeBuilder extends GNodeBuilder<GJunctionNode> {
   set(node: JunctionNode, index: ArchiMateGModelIndex): this {
      this.id(index.createId(node));
      this.type(ARCHIMATE_CONCEPT_TYPE_MAP.get('Junction'));

      // Options which are the same for every node
      this.addCssClasses('diagram-node', 'junction', 'bg-junction');
      this.addArg(REFERENCE_CONTAINER_TYPE, JunctionNode);
      this.addArg(REFERENCE_PROPERTY, 'junction');
      this.addArg(REFERENCE_VALUE, node.junction.$refText);

      // The DiagramNode in the langium file holds the coordinates of node
      this.layout('vbox')
         .size(25, 25)
         .position(node.x || 100, node.y || 100);

      return this;
   }
}
