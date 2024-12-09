/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/
import { ELEMENT_NODE_TYPE } from '@crossbreeze/protocol';
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
import { CrossModelRoot, Element, ElementNode, ElementType } from '../../../language-server/generated/ast.js';
import { Utils } from '../../../language-server/util/uri-util.js';
import { CrossModelCommand } from '../../common/cross-model-command.js';
import { ArchiMateModelState } from '../model/archimate-model-state.js';

@injectable()
export class ArchiMateDiagramCreateElementOperationHandler extends JsonCreateNodeOperationHandler {
   override label = 'Create Element';
   elementTypeIds = [ELEMENT_NODE_TYPE];

   @inject(ModelState) protected declare modelState: ArchiMateModelState;
   @inject(ActionDispatcher) protected actionDispatcher!: ActionDispatcher;

   override createCommand(operation: CreateNodeOperation): MaybePromise<Command | undefined> {
      return new CrossModelCommand(this.modelState, () => this.createNode(operation));
   }

   protected async createNode(operation: CreateNodeOperation): Promise<void> {
      const element = await this.createAndSaveElement(operation);
      if (!element) {
         return;
      }
      const container = this.modelState.archiMateDiagram;
      const location = this.getLocation(operation) ?? Point.ORIGIN;
      const node: ElementNode = {
         $type: ElementNode,
         $container: container,
         id: this.modelState.idProvider.findNextId(ElementNode, element.name + 'Node', container),
         element: {
            $refText: this.modelState.idProvider.getNodeId(element) || element.id || '',
            ref: element
         },
         x: location.x,
         y: location.y,
         width: 10,
         height: 10,
         customProperties: []
      };
      container.nodes.push(node);
      this.actionDispatcher.dispatchAfterNextUpdate({
         kind: 'EditLabel',
         labelId: `${this.modelState.index.createId(node)}_label`
      } as Action);
   }

   /**
    * Creates a new element and stores it on a file on the file system.
    */
   protected async createAndSaveElement(operation: CreateNodeOperation): Promise<Element | undefined> {
      const elementType = operation.args?.elementType as ElementType;

      // create element, serialize and re-read to ensure everything is up to date and linked properly
      const elementRoot: CrossModelRoot = { $type: 'CrossModelRoot' };
      const id = this.modelState.idProvider.findNextId(Element, `New${elementType}`);

      const element: Element = {
         $type: 'Element',
         $container: elementRoot,
         id,
         name: elementType,
         type: elementType,
         customProperties: []
      };

      const dirName = UriUtils.joinPath(UriUtils.dirname(URI.parse(this.modelState.semanticUri)), '..', 'elements');
      const targetUri = UriUtils.joinPath(dirName, id + '.element.cm');
      const uri = Utils.findNewUri(targetUri);

      elementRoot.element = element;
      const text = this.modelState.semanticSerializer.serialize(elementRoot);

      await this.modelState.modelService.save({ uri: uri.toString(), model: text, clientId: this.modelState.clientId });
      const document = await this.modelState.modelService.request(uri.toString());
      return document?.root?.element;
   }
}
