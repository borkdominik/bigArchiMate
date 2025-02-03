/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import {
   ARCHIMATE_NODE_TYPE_MAP,
   ELEMENT_ICON_TYPE,
   ELEMENT_LABEL_TYPE,
   elementMetadataMap,
   REFERENCE_CONTAINER_TYPE,
   REFERENCE_PROPERTY,
   REFERENCE_VALUE,
   toKebabCase
} from '@crossbreeze/protocol';
import { ArgsUtil, GCompartment, GNode, GNodeBuilder } from '@eclipse-glsp/server';
import { ElementNode } from '../../../language-server/generated/ast.js';
import { createHeader } from '../../common/nodes.js';
import { ArchiMateModelIndex } from './archimate-model-index.js';

export class GElementNode extends GNode {
   static override builder(): GElementNodeBuilder {
      return new GElementNodeBuilder(GElementNode);
   }
}

export class GElementNodeBuilder extends GNodeBuilder<GElementNode> {
   set(node: ElementNode, index: ArchiMateModelIndex): this {
      const elementType = node.element.ref?.type;

      if (elementType === undefined) {
         return this;
      }

      const elementCornerType = elementMetadataMap[elementType].cornerType;
      const elementLayer = elementMetadataMap[elementType].layer;

      this.id(index.createId(node));
      this.type(ARCHIMATE_NODE_TYPE_MAP.get(elementType));

      // Get the reference that the DiagramNode holds to the Element in the .langium file.
      const elementRef = node.element?.ref;

      // Options which are the same for every node
      this.addCssClasses('diagram-node', 'element', `bg-${toKebabCase(elementLayer)}`);
      this.addArg(REFERENCE_CONTAINER_TYPE, ElementNode);
      this.addArg(REFERENCE_PROPERTY, 'element');
      this.addArg(REFERENCE_VALUE, node.element.$refText);

      // Add the label/name of the node
      this.add(createHeader(elementRef?.name || elementRef?.id || 'unresolved', this.proxy.id, ELEMENT_LABEL_TYPE));

      // The DiagramNode in the langium file holds the coordinates of node
      this.layout('vbox')
         .add(GCompartment.builder().type(ELEMENT_ICON_TYPE).build())
         .addArgs(ArgsUtil.cornerRadius(elementCornerType === 'round' ? 20 : 0))
         .addLayoutOption('prefWidth', node.width || 100)
         .addLayoutOption('prefHeight', node.height || 100)
         .position(node.x || 100, node.y || 100);

      return this;
   }
}
