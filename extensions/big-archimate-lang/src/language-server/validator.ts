import { ModelFileExtensions } from '@big-archimate/protocol';
import { AstNode, UriUtils, ValidationAcceptor, ValidationChecks } from 'langium';
import { Diagnostic } from 'vscode-languageserver-protocol';
import { ArchiMateLanguageAstType, isDiagram, isElement, isElementType, isJunctionType, isRelation, Relation } from './generated/ast.js';
import type { Services } from './module.js';
import { ID_PROPERTY, IdentifiableAstNode } from './naming.js';
import { findDocument, isSemanticRoot } from './util/ast-util.js';
import { RelationValidator } from './util/validation/relation-validator.js';

export namespace IssueCodes {
   export const FilenameNotMatching = 'filename-not-matching';
}

export interface FilenameNotMatchingDiagnostic extends Diagnostic {
   data: {
      code: typeof IssueCodes.FilenameNotMatching;
   };
}

export namespace FilenameNotMatchingDiagnostic {
   export function is(diagnostic: Diagnostic): diagnostic is FilenameNotMatchingDiagnostic {
      return diagnostic.data?.code === IssueCodes.FilenameNotMatching;
   }
}

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: Services): void {
   const registry = services.validation.ValidationRegistry;
   const validator = services.validation.Validator;

   const checks: ValidationChecks<ArchiMateLanguageAstType> = {
      AstNode: validator.checkNode,
      Relation: validator.checkRelation
   };
   registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class Validator {
   constructor(protected services: Services) {}

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
            data: { code: IssueCodes.FilenameNotMatching }
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
      return isElement(node) || isRelation(node) || isDiagram(node);
   }

   protected checkUniqueNodeId(node: AstNode, accept: ValidationAcceptor): void {
      if (isDiagram(node)) {
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
      if (!relation.type) {
         accept('error', 'The type of a relation must not be empty', { node: relation, property: 'type' });
      } else if (!relation.source) {
         accept('error', 'The source of a relation must not be empty', { node: relation, property: 'source' });
      } else if (!relation.target) {
         accept('error', 'The target of a relation must not be empty', { node: relation, property: 'target' });
      } else {
         const relationType = relation.type;
         const sourceType = relation.source.ref?.type;
         const targetType = relation.target.ref?.type;

         if (!isElementType(sourceType) && !isJunctionType(sourceType)) {
            accept('error', 'Invalid relation source. The source of a relation must be an element or a junction', {
               node: relation,
               property: 'source'
            });
         }

         if (!RelationValidator.isValidSource(relationType, sourceType)) {
            accept(
               'error',
               `Invalid relation source. ${
                  isElementType(sourceType) ? `An element of type ${sourceType}` : 'A junction'
               } cannot be assigned as a source ` + `to a relation of type ${relationType}`,
               { node: relation, property: 'source' }
            );
         } else if (!RelationValidator.isValidTarget(relationType, sourceType, targetType)) {
            accept(
               'error',
               `Invalid relation target. ${
                  isElementType(targetType) ? `An element of type ${targetType}` : 'A junction'
               } cannot be assigned to a relation of type ${relationType} ` +
                  `with ${isElementType(sourceType) ? `an element of type ${sourceType}` : 'a junction'} as source.`,
               { node: relation, property: 'target' }
            );
         }
      }
   }
}
