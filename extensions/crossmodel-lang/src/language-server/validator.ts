import { ModelFileExtensions } from '@crossbreeze/protocol';
import { AstNode, UriUtils, ValidationAcceptor, ValidationChecks } from 'langium';
import { Diagnostic } from 'vscode-languageserver-protocol';
import { CrossModelAstType, isArchiMateDiagram, isElement, isRelation, NamedObject, Relation, RelationEdge } from './generated/ast.js';
import type { Services } from './module.js';
import { ID_PROPERTY, IdentifiableAstNode } from './naming.js';
import { findDocument, isSemanticRoot } from './util/ast-util.js';
import { RelationValidator } from './util/validation/relation-validator.js';

export namespace CrossModelIssueCodes {
   export const FilenameNotMatching = 'filename-not-matching';
}

export interface FilenameNotMatchingDiagnostic extends Diagnostic {
   data: {
      code: typeof CrossModelIssueCodes.FilenameNotMatching;
   };
}

export namespace FilenameNotMatchingDiagnostic {
   export function is(diagnostic: Diagnostic): diagnostic is FilenameNotMatchingDiagnostic {
      return diagnostic.data?.code === CrossModelIssueCodes.FilenameNotMatching;
   }
}

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: Services): void {
   const registry = services.validation.ValidationRegistry;
   const validator = services.validation.CrossModelValidator;

   const checks: ValidationChecks<CrossModelAstType> = {
      AstNode: validator.checkNode,
      Relation: validator.checkRelation,
      RelationEdge: validator.checkRelationEdge,
      NamedObject: validator.checkNamedObject
   };
   registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class Validator {
   constructor(protected services: Services) {}

   checkNamedObject(namedObject: NamedObject, accept: ValidationAcceptor): void {
      if (namedObject.name === undefined || namedObject.name.length === 0) {
         accept('error', 'The name of this object cannot be empty', { node: namedObject, property: 'name' });
      }
   }

   checkNode(node: AstNode, accept: ValidationAcceptor): void {
      this.checkUniqueGlobalId(node, accept);
      this.checkUniqueNodeId(node, accept);
      this.checkMatchingFilename(node, accept);
   }

   protected checkMatchingFilename(node: AstNode, accept: ValidationAcceptor): void {
      if (!isSemanticRoot(node)) {
         return;
      }
      if (!node.id) {
         // diagrams may not have ids set and therefore are not required to match the filename
         return;
      }
      const document = findDocument(node);
      if (!document) {
         return;
      }
      const basename = UriUtils.basename(document.uri);
      const extname = ModelFileExtensions.getFileExtension(basename) ?? UriUtils.extname(document.uri);
      const basenameWithoutExt = basename.slice(0, -extname.length);
      if (basenameWithoutExt.toLowerCase() !== node.id.toLocaleLowerCase()) {
         accept('warning', `Filename should match element id: ${node.id}`, {
            node,
            property: ID_PROPERTY,
            data: { code: CrossModelIssueCodes.FilenameNotMatching }
         });
      }
   }

   protected checkUniqueGlobalId(node: AstNode, accept: ValidationAcceptor): void {
      if (!this.isExportedGlobally(node)) {
         return;
      }
      const globalId = this.services.references.IdProvider.getGlobalId(node);
      if (!globalId) {
         accept('error', 'Missing required id field', { node, property: ID_PROPERTY });
         return;
      }
      const allElements = Array.from(this.services.shared.workspace.IndexManager.allElements());
      const duplicates = allElements.filter(description => description.name === globalId);
      if (duplicates.length > 1) {
         accept('error', 'Must provide a unique id.', { node, property: ID_PROPERTY });
      }
   }

   protected isExportedGlobally(node: AstNode): boolean {
      // we export anything with an id from entities and relationships and all root nodes, see CrossModelScopeComputation
      return isElement(node) || isRelation(node) || isArchiMateDiagram(node);
   }

   protected checkUniqueNodeId(node: AstNode, accept: ValidationAcceptor): void {
      if (isArchiMateDiagram(node)) {
         this.markDuplicateIds(node.edges, accept);
         this.markDuplicateIds(node.nodes, accept);
      }
   }

   protected markDuplicateIds(nodes: IdentifiableAstNode[], accept: ValidationAcceptor): void {
      const knownIds: string[] = [];
      for (const node of nodes) {
         if (node.id && knownIds.includes(node.id)) {
            accept('error', 'Must provide a unique id.', { node, property: ID_PROPERTY });
         } else if (node.id) {
            knownIds.push(node.id);
         }
      }
   }

   checkRelation(relation: Relation, accept: ValidationAcceptor): void {
      const sourceNodeType = relation.source.ref?.$type === 'Element' ? relation.source.ref?.type : 'Junction';
      const targetNodeType = relation.target.ref?.$type === 'Element' ? relation.target.ref?.type : 'Junction';

      if (!RelationValidator.isValidTarget(relation.type, sourceNodeType, targetNodeType)) {
         accept('error', 'Invalid relation.', { node: relation, property: 'type' });
      }
   }

   checkRelationEdge(edge: RelationEdge, accept: ValidationAcceptor): void {
      // if (edge.sourceNode?.ref?.element?.ref?.$type !== edge.relation?.ref?.source?.ref?.$type) {
      //    accept('error', 'Source must match type of parent.', { node: edge, property: 'sourceNode' });
      // }
      // if (edge.targetNode?.ref?.element?.ref?.$type !== edge.relation?.ref?.target?.ref?.$type) {
      //    accept('error', 'Target must match type of child.', { node: edge, property: 'targetNode' });
      // }
   }
}
