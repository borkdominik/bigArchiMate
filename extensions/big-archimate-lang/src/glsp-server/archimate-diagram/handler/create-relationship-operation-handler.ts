import { ARCHIMATE_RELATION_TYPE_MAP } from '@big-archimate/protocol';
import {
   ActionDispatcher,
   Command,
   CreateEdgeOperation,
   JsonCreateEdgeOperationHandler,
   ModelState,
   SelectAction
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { URI, Utils as UriUtils } from 'vscode-uri';
import { ArchiMateRoot, ElementNode, JunctionNode, Relationship, RelationshipEdge } from '../../../language-server/generated/ast.js';
import { Utils } from '../../../language-server/util/uri-util.js';
import { ArchiMateCommand } from '../../common/command.js';
import { ArchiMateModelState } from '../../common/model-state.js';

@injectable()
export class CreateRelationshipOperationHandler extends JsonCreateEdgeOperationHandler {
   override label = 'Relationship';
   elementTypeIds = [...ARCHIMATE_RELATION_TYPE_MAP.values()];

   @inject(ModelState) protected override modelState!: ArchiMateModelState;
   @inject(ActionDispatcher) protected actionDispatcher!: ActionDispatcher;

   createCommand(operation: CreateEdgeOperation): Command {
      return new ArchiMateCommand(this.modelState, () => this.createEdge(operation));
   }

   protected async createEdge(operation: CreateEdgeOperation): Promise<void> {
      const sourceNode =
         this.modelState.index.findElementNode(operation.sourceElementId) ??
         this.modelState.index.findJunctionNode(operation.sourceElementId);
      const targetNode =
         this.modelState.index.findElementNode(operation.targetElementId) ??
         this.modelState.index.findJunctionNode(operation.targetElementId);

      if (sourceNode && targetNode) {
         // before we can create a diagram edge, we need to create the corresponding relationship that it is based on
         const relationship = await this.createAndSaveRelationship(operation, sourceNode, targetNode);
         if (relationship) {
            const edge: RelationshipEdge = {
               $type: RelationshipEdge,
               $container: this.modelState.diagram,
               id: this.modelState.idProvider.findNextId(RelationshipEdge, relationship.id + 'Edge', this.modelState.diagram),
               relationship: {
                  ref: relationship,
                  $refText: this.modelState.idProvider.getNodeId(relationship) || relationship.id || ''
               },
               sourceNode: {
                  ref: sourceNode,
                  $refText: this.modelState.idProvider.getNodeId(sourceNode) || sourceNode.id || ''
               },
               targetNode: {
                  ref: targetNode,
                  $refText: this.modelState.idProvider.getNodeId(targetNode) || targetNode.id || ''
               },
               routingPoints: []
            };
            this.modelState.diagram.edges.push(edge);
            this.actionDispatcher.dispatchAfterNextUpdate(
               SelectAction.create({ selectedElementsIDs: [this.modelState.idProvider.getLocalId(edge) ?? edge.id] })
            );
         }
      }
   }

   /**
    * Creates a new relationship and stores it on a file on the file system.
    */
   protected async createAndSaveRelationship(
      operation: CreateEdgeOperation,
      sourceNode: ElementNode | JunctionNode,
      targetNode: ElementNode | JunctionNode
   ): Promise<Relationship | undefined> {
      const sourceConcept = sourceNode.$type === 'ElementNode' ? sourceNode.element : sourceNode.junction;
      const targetConcept = targetNode.$type === 'ElementNode' ? targetNode.element : targetNode.junction;
      const source = sourceConcept.ref?.id || sourceConcept.$refText;
      const target = targetConcept.ref?.id || targetConcept.$refText;
      const relationshipType = ARCHIMATE_RELATION_TYPE_MAP.getReverse(operation.elementTypeId);

      // create relationship, serialize and re-read to ensure everything is up to date and linked properly
      const relationshipRoot: ArchiMateRoot = { $type: 'ArchiMateRoot' };
      const relationship: Relationship = {
         $type: Relationship,
         $container: relationshipRoot,
         id: this.modelState.idProvider.findNextId(Relationship, `${relationshipType}_${source}-${target}`),
         type: relationshipType,
         source: { $refText: sourceConcept.$refText || '' },
         target: { $refText: targetConcept.$refText || '' },
         properties: []
      };

      // search for unique file name for the relationship and use file base name as relationship name
      // if the user doesn't rename any files we should end up with unique names ;-)
      const dirName = UriUtils.joinPath(UriUtils.dirname(URI.parse(this.modelState.semanticUri)), '..', 'Relationships');
      const targetUri = UriUtils.joinPath(dirName, relationship.id + '.relationship.arch');
      const uri = Utils.findNewUri(targetUri);

      relationshipRoot.relationship = relationship;
      const text = this.modelState.semanticSerializer.serialize(relationshipRoot);

      await this.modelState.modelService.save({ uri: uri.toString(), model: text, clientId: this.modelState.clientId });
      const document = await this.modelState.modelService.request(uri.toString());
      return document?.root.relationship;
   }
}
