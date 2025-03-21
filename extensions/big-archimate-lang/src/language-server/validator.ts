import { ModelFileExtensions } from '@big-archimate/protocol';
import { AstNode, UriUtils, ValidationAcceptor, ValidationChecks } from 'langium';
import { Diagnostic } from 'vscode-languageserver-protocol';
import { ArchiMateLanguageAstType, Element, isDiagram, isElement, isRelation, Relation } from './generated/ast.js';
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
      Relation: validator.checkRelation,
      Element: validator.checkElement
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

   checkElement(element: Element, accept: ValidationAcceptor): void {
      if (!element.name) {
         accept('error', 'The name of an element cannot be empty', { node: element, property: 'name' });
      }
   }

   checkRelation(relation: Relation, accept: ValidationAcceptor): void {
      const sourceNodeType = relation.source.ref?.$type === 'Element' ? relation.source.ref?.type : 'Junction';
      const targetNodeType = relation.target.ref?.$type === 'Element' ? relation.target.ref?.type : 'Junction';

      if (!RelationValidator.isValidTarget(relation.type, sourceNodeType, targetNodeType)) {
         accept('error', 'Invalid relation.', { node: relation, property: 'type' });
      }
   }
}
