import { ARCHIMATE_JUNCTION_TYPE_MAP } from '@big-archimate/protocol';
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
import { ArchiMateRoot, Junction, JunctionNode } from '../../../language-server/generated/ast.js';
import { Utils } from '../../../language-server/util/uri-util.js';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

@injectable()
export class CreateJunctionOperationHandler extends JsonCreateNodeOperationHandler {
   override label = 'Create Junction';
   elementTypeIds = [...ARCHIMATE_JUNCTION_TYPE_MAP.values()];

   @inject(ModelState) protected declare modelState: ArchiMateModelState;
   @inject(ActionDispatcher) protected actionDispatcher!: ActionDispatcher;

   override createCommand(operation: CreateNodeOperation): MaybePromise<Command | undefined> {
      return new ArchiMateCommand(this.modelState, () => this.createNode(operation));
   }

   protected async createNode(operation: CreateNodeOperation): Promise<void> {
      const junction = await this.createAndSaveJunction(operation);
      if (!junction) {
         return;
      }
      const container = this.modelState.diagram;
      const location = this.getLocation(operation) ?? Point.ORIGIN;
      const node: JunctionNode = {
         $type: JunctionNode,
         $container: container,
         id: this.modelState.idProvider.findNextId(JunctionNode, junction.type + 'Node', container),
         junction: {
            $refText: this.modelState.idProvider.getNodeId(junction) || junction.id || '',
            ref: junction
         },
         x: location.x,
         y: location.y,
         width: 25,
         height: 25
      };
      container.nodes.push(node);
      this.actionDispatcher.dispatchAfterNextUpdate({
         kind: 'EditLabel',
         labelId: `${this.modelState.index.createId(node)}_label`
      } as Action);
   }

   /**
    * Creates a new junction and stores it on a file on the file system.
    */
   protected async createAndSaveJunction(operation: CreateNodeOperation): Promise<Junction | undefined> {
      const junctionType = ARCHIMATE_JUNCTION_TYPE_MAP.getReverse(operation.elementTypeId);

      // create junction, serialize and re-read to ensure everything is up to date and linked properly
      const root: ArchiMateRoot = { $type: 'ArchiMateRoot' };
      const id = this.modelState.idProvider.findNextId(Junction, `${junctionType}_Junction`);

      const junction: Junction = {
         $type: 'Junction',
         $container: root,
         id,
         type: junctionType,
         properties: []
      };

      const dirName = UriUtils.joinPath(UriUtils.dirname(URI.parse(this.modelState.semanticUri)), '..', 'Other');
      const targetUri = UriUtils.joinPath(dirName, id + '.junction.arch');
      const uri = Utils.findNewUri(targetUri);

      root.junction = junction;
      const text = this.modelState.semanticSerializer.serialize(root);

      await this.modelState.modelService.save({ uri: uri.toString(), model: text, clientId: this.modelState.clientId });
      const document = await this.modelState.modelService.request(uri.toString());
      return document?.root?.junction;
   }
}
