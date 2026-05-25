import { ARCHIMATE_ELEMENT_TYPE_MAP, getLabel, getLayer, getSuggestedElementId } from '@big-archimate/protocol';
import {
   Action,
   ActionDispatcher,
   Command,
   CreateNodeOperation,
   JsonCreateNodeOperationHandler,
   MaybePromise,
   ModelState,
   Point
} from '@eclipse-glsp/server';
import { inject, injectable } from '@theia/core/shared/inversify';
import { URI, Utils as UriUtils } from 'vscode-uri';
import { DiagramNode, ElementNode, ArchiMateRoot, Element } from '../../../language-server/generated/ast.js';
import { findGroupingContaining } from '../../../language-server/util/ast-util.js';
import { Utils } from '../../../language-server/util/uri-util.js';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

@injectable()
export class CreateElementOperationHandler extends JsonCreateNodeOperationHandler {
   override label = 'Create Element';
   elementTypeIds = [...ARCHIMATE_ELEMENT_TYPE_MAP.values()];

   @inject(ModelState) protected declare modelState: ArchiMateModelState;
   @inject(ActionDispatcher) protected actionDispatcher!: ActionDispatcher;

   override createCommand(operation: CreateNodeOperation): MaybePromise<Command | undefined> {
      return new ArchiMateCommand(this.modelState, () => this.createNode(operation));
   }

   protected async createNode(operation: CreateNodeOperation): Promise<void> {
      const element = await this.createAndSaveElement(operation);
      if (!element) {
         return;
      }
      const diagram = this.modelState.diagram;
      const location = this.getLocation(operation) ?? Point.ORIGIN;

      const isGrouping = element.type === 'Grouping';
      const width = isGrouping ? 400 : 200;
      const height = isGrouping ? 250 : 50;

      // Groupings are never placed inside other groupings.
      const parentGrouping = isGrouping ? undefined : findGroupingContaining(location, diagram);
      const container = parentGrouping ?? diagram;
      const x = parentGrouping ? Math.max(0, Math.min(location.x - parentGrouping.x, parentGrouping.width - width)) : location.x;
      const y = parentGrouping ? Math.max(0, Math.min(location.y - parentGrouping.y, parentGrouping.height - height)) : location.y;

      const node: ElementNode = {
         $type: ElementNode,
         $container: container,
         id: this.modelState.idProvider.findNextId(ElementNode, element.name + 'Node', diagram),
         element: {
            $refText: this.modelState.idProvider.getNodeId(element) || element.id || '',
            ref: element
         },
         x,
         y,
         width,
         height,
         children: []
      };

      if (parentGrouping) {
         (parentGrouping.children as DiagramNode[]).push(node);
      } else {
         diagram.nodes.push(node);
      }

      this.actionDispatcher.dispatchAfterNextUpdate({
         kind: 'EditLabel',
         labelId: `${this.modelState.index.createId(node)}_label`
      } as Action);
   }

   /**
    * Creates a new element and stores it on a file on the file system.
    */
   protected async createAndSaveElement(operation: CreateNodeOperation): Promise<Element | undefined> {
      const elementType = ARCHIMATE_ELEMENT_TYPE_MAP.getReverse(operation.elementTypeId);

      // create element, serialize and re-read to ensure everything is up to date and linked properly
      const elementRoot: ArchiMateRoot = { $type: 'ArchiMateRoot' };
      const id = this.modelState.idProvider.findNextId(Element, getSuggestedElementId(elementType, elementType), this.modelState.packageId);

      const element: Element = {
         $type: Element,
         $container: elementRoot,
         id,
         name: id,
         type: elementType,
         properties: []
      };

      const dirName = UriUtils.joinPath(
         UriUtils.dirname(URI.parse(this.modelState.semanticUri)),
         '..',
         `${getLabel(getLayer(elementType))}`
      );
      const targetUri = UriUtils.joinPath(dirName, id + '.element.arch');
      const uri = Utils.findNewUri(targetUri);

      elementRoot.element = element;
      const text = this.modelState.semanticSerializer.serialize(elementRoot);

      await this.modelState.modelService.save({ uri: uri.toString(), model: text, clientId: this.modelState.clientId });
      const document = await this.modelState.modelService.request(uri.toString());
      return document?.root?.element;
   }
}
