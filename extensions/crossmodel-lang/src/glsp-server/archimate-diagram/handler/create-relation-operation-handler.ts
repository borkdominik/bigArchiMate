/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { ARCHIMATE_RELATION_TYPE_MAP } from '@crossbreeze/protocol';
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
import { CrossModelRoot, ElementNode, JunctionNode, Relation, RelationEdge } from '../../../language-server/generated/ast.js';
import { Utils } from '../../../language-server/util/uri-util.js';
import { CrossModelCommand } from '../../common/cross-model-command.js';
import { ArchiMateModelState } from '../model/archimate-model-state.js';

@injectable()
export class ArchiMateDiagramCreateRelationOperationHandler extends JsonCreateEdgeOperationHandler {
   override label = 'Relation';
   elementTypeIds = [...ARCHIMATE_RELATION_TYPE_MAP.values()];

   @inject(ModelState) protected override modelState!: ArchiMateModelState;
   @inject(ActionDispatcher) protected actionDispatcher!: ActionDispatcher;

   createCommand(operation: CreateEdgeOperation): Command {
      return new CrossModelCommand(this.modelState, () => this.createEdge(operation));
   }

   protected async createEdge(operation: CreateEdgeOperation): Promise<void> {
      const sourceNode =
         this.modelState.index.findElementNode(operation.sourceElementId) ??
         this.modelState.index.findJunctionNode(operation.sourceElementId);
      const targetNode =
         this.modelState.index.findElementNode(operation.targetElementId) ??
         this.modelState.index.findJunctionNode(operation.targetElementId);

      if (sourceNode && targetNode) {
         // before we can create a diagram edge, we need to create the corresponding relation that it is based on
         const relation = await this.createAndSaveRelation(operation, sourceNode, targetNode);
         if (relation) {
            const edge: RelationEdge = {
               $type: RelationEdge,
               $container: this.modelState.archiMateDiagram,
               id: this.modelState.idProvider.findNextId(RelationEdge, relation.id + 'Edge', this.modelState.archiMateDiagram),
               relation: {
                  ref: relation,
                  $refText: this.modelState.idProvider.getGlobalId(relation) || relation.id || ''
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
            this.modelState.archiMateDiagram.edges.push(edge);
            this.actionDispatcher.dispatchAfterNextUpdate(
               SelectAction.create({ selectedElementsIDs: [this.modelState.idProvider.getLocalId(edge) ?? edge.id] })
            );
         }
      }
   }

   /**
    * Creates a new relation and stores it on a file on the file system.
    */
   protected async createAndSaveRelation(
      operation: CreateEdgeOperation,
      sourceNode: ElementNode | JunctionNode,
      targetNode: ElementNode | JunctionNode
   ): Promise<Relation | undefined> {
      const sourceConcept = sourceNode.$type === 'ElementNode' ? sourceNode.element : sourceNode.junction;
      const targetConcept = targetNode.$type === 'ElementNode' ? targetNode.element : targetNode.junction;
      const source = sourceConcept.ref?.id || sourceConcept.$refText;
      const target = targetConcept.ref?.id || targetConcept.$refText;

      // create relation, serialize and re-read to ensure everything is up to date and linked properly
      const relationRoot: CrossModelRoot = { $type: 'CrossModelRoot' };
      const relation: Relation = {
         $type: Relation,
         $container: relationRoot,
         id: this.modelState.idProvider.findNextId(Relation, source + 'To' + target),
         type: ARCHIMATE_RELATION_TYPE_MAP.getReverse(operation.elementTypeId),
         source: { $refText: sourceConcept.$refText || '' },
         target: { $refText: targetConcept.$refText || '' },
         properties: []
      };

      // search for unique file name for the relation and use file base name as relation name
      // if the user doesn't rename any files we should end up with unique names ;-)
      const dirName = UriUtils.joinPath(UriUtils.dirname(URI.parse(this.modelState.semanticUri)), '..', 'Relations');
      const targetUri = UriUtils.joinPath(dirName, relation.id + '.relation.cm');
      const uri = Utils.findNewUri(targetUri);

      relationRoot.relation = relation;
      const text = this.modelState.semanticSerializer.serialize(relationRoot);

      await this.modelState.modelService.save({ uri: uri.toString(), model: text, clientId: this.modelState.clientId });
      const document = await this.modelState.modelService.request(uri.toString());
      return document?.root.relation;
   }
}
