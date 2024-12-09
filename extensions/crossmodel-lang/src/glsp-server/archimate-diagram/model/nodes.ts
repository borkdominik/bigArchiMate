/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import {
   ELEMENT_LABEL_TYPE,
   ELEMENT_NODE_TYPE,
   REFERENCE_CONTAINER_TYPE,
   REFERENCE_PROPERTY,
   REFERENCE_VALUE
} from '@crossbreeze/protocol';
import { ArgsUtil, GNode, GNodeBuilder } from '@eclipse-glsp/server';
import { ElementNode } from '../../../language-server/generated/ast.js';
import { createHeader } from '../../common/nodes.js';
import { ArchiMateModelIndex } from './archimate-model-index.js';

export class GElementNode extends GNode {
   override type = ELEMENT_NODE_TYPE;

   static override builder(): GElementNodeBuilder {
      return new GElementNodeBuilder(GElementNode).type(ELEMENT_NODE_TYPE);
   }
}

export class GElementNodeBuilder extends GNodeBuilder<GElementNode> {
   set(node: ElementNode, index: ArchiMateModelIndex): this {
      this.id(index.createId(node));

      // Get the reference that the DiagramNode holds to the Element in the .langium file.
      const elementRef = node.element?.ref;

      // Options which are the same for every node
      this.addCssClasses('diagram-node', 'element');
      this.addArg(REFERENCE_CONTAINER_TYPE, ElementNode);
      this.addArg(REFERENCE_PROPERTY, 'element');
      this.addArg(REFERENCE_VALUE, node.element.$refText);

      // Add the label/name of the node
      this.add(createHeader(elementRef?.name || elementRef?.id || 'unresolved', this.proxy.id, ELEMENT_LABEL_TYPE));

      // The DiagramNode in the langium file holds the coordinates of node
      this.layout('vbox')
         .addArgs(ArgsUtil.cornerRadius(3))
         .addLayoutOption('prefWidth', node.width || 100)
         .addLayoutOption('prefHeight', node.height || 100)
         .position(node.x || 100, node.y || 100);

      return this;
   }
}