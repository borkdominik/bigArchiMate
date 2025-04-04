import { Dimension, Point } from '@eclipse-glsp/server';
import { AstNode, AstUtils, LangiumDocument, Reference, isAstNode } from 'langium';
import {
   ArchiMateRoot,
   Diagram,
   Element,
   ElementNode,
   ElementType,
   Junction,
   JunctionNode,
   JunctionType,
   Relation,
   RelationEdge,
   RelationType,
   isArchiMateRoot,
   isDiagram,
   isElement,
   isJunction,
   isRelation
} from '../generated/ast.js';
import { ID_PROPERTY } from '../id-provider.js';

export type SemanticRoot = Element | Junction | Relation | Diagram;

export const IMPLICIT_OWNER_PROPERTY = '$owner';
export const IMPLICIT_ID_PROPERTY = '$id';

export function getOwner(node?: AstNode): AstNode | undefined;
export function getOwner<T>(node: any): T | undefined {
   return node?.[IMPLICIT_OWNER_PROPERTY] as T;
}

export function setOwner<T>(attribute: T, owner: object): T {
   (attribute as any)[IMPLICIT_OWNER_PROPERTY] = owner;
   return attribute;
}

export function setImplicitId(node: any, id: string): void {
   node[ID_PROPERTY] = id;
   node[IMPLICIT_ID_PROPERTY] = true;
}

export function removeImplicitProperties(node: any): void {
   delete node[IMPLICIT_OWNER_PROPERTY];
   if (node[IMPLICIT_ID_PROPERTY] === true) {
      delete node[ID_PROPERTY];
      delete node[IMPLICIT_ID_PROPERTY];
   }
}

export function isImplicitProperty(prop: string, obj: any): boolean {
   return prop === IMPLICIT_OWNER_PROPERTY || prop === IMPLICIT_ID_PROPERTY || (obj[IMPLICIT_ID_PROPERTY] === true && prop === ID_PROPERTY);
}

/**
 * Retrieve the document in which the given AST node is contained. A reference to the document is
 * usually held by the root node of the AST.
 */
export function findDocument<T extends AstNode = AstNode>(node?: AstNode): LangiumDocument<T> | undefined {
   if (!node) {
      return undefined;
   }
   const rootNode = AstUtils.findRootNode(node);
   const result = rootNode.$document;
   return result ? <LangiumDocument<T>>result : undefined;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function fixDocument<T extends AstNode = AstNode, R extends AstNode = AstNode>(
   node: undefined,
   document: LangiumDocument<R> | undefined
): undefined;
export function fixDocument<T extends AstNode = AstNode, R extends AstNode = AstNode>(node: T, document: LangiumDocument<R> | undefined): T;
export function fixDocument<T extends AstNode = AstNode, R extends AstNode = AstNode>(
   node: T | undefined,
   document: LangiumDocument<R> | undefined
): T | undefined;
export function fixDocument<T extends AstNode = AstNode, R extends AstNode = AstNode>(
   node: T | undefined,
   document: LangiumDocument<R> | undefined
): T | undefined {
   if (!node || !document) {
      return node;
   }
   const rootNode = AstUtils.findRootNode(node);
   if (!rootNode.$document) {
      (rootNode as any).$document = document;
   }
   return node;
}

export type WithDocument<T> = T & { $document: LangiumDocument<ArchiMateRoot> };
export type DocumentContent = LangiumDocument | AstNode;
export type TypeGuard<T> = (item: unknown) => item is T;

export function isSemanticRoot(element: unknown): element is SemanticRoot {
   return isElement(element) || isJunction(element) || isRelation(element) || isDiagram(element);
}

export function findSemanticRoot(input: DocumentContent): SemanticRoot | undefined;
export function findSemanticRoot<T extends SemanticRoot>(input: DocumentContent, guard: TypeGuard<T>): T | undefined;
export function findSemanticRoot<T extends SemanticRoot>(input: DocumentContent, guard?: TypeGuard<T>): SemanticRoot | T | undefined {
   const root = isAstNode(input) ? input.$document?.parseResult?.value ?? AstUtils.findRootNode(input) : input.parseResult?.value;
   const semanticRoot = isArchiMateRoot(root) ? root.element ?? root.junction ?? root.relation ?? root.diagram : undefined;
   return !semanticRoot ? undefined : !guard ? semanticRoot : guard(semanticRoot) ? semanticRoot : undefined;
}

export function findElement(input: DocumentContent): Element | undefined {
   return findSemanticRoot(input, isElement);
}

export function findJunction(input: DocumentContent): Junction | undefined {
   return findSemanticRoot(input, isJunction);
}

export function findRelation(input: DocumentContent): Relation | undefined {
   return findSemanticRoot(input, isRelation);
}

export function findDiagram(input: DocumentContent): Diagram | undefined {
   return findSemanticRoot(input, isDiagram);
}

export function hasSemanticRoot<T extends SemanticRoot>(document: LangiumDocument<any>, guard: (item: unknown) => item is T): boolean {
   return guard(findSemanticRoot(document));
}

export function createElement(
   container: ArchiMateRoot,
   id: string,
   type: ElementType,
   name: string,
   opts?: Partial<Omit<Element, '$container' | '$type' | 'id' | 'name' | 'type'>>
): Element {
   return {
      $container: container,
      $type: 'Element',
      id,
      type,
      name,
      properties: [],
      ...opts
   };
}

export function createRelation(
   container: ArchiMateRoot,
   id: string,
   type: RelationType,
   name: string,
   source: Reference<Element>,
   target: Reference<Element>,
   opts?: Partial<Omit<Relation, '$container' | '$type' | 'id' | 'name' | 'type' | 'source' | 'target'>>
): Relation {
   return {
      $container: container,
      $type: 'Relation',
      id,
      type,
      name,
      source,
      target,
      properties: [],
      ...opts
   };
}

export function createJunction(
   container: ArchiMateRoot,
   id: string,
   type: JunctionType,
   name: string,
   opts?: Partial<Omit<Junction, '$container' | '$type' | 'id' | 'name'>>
): Junction {
   return {
      $container: container,
      $type: 'Junction',
      id,
      type,
      name,
      properties: [],
      ...opts
   };
}

export function createDiagram(container: ArchiMateRoot, id: string, opts?: Partial<Omit<Diagram, '$container' | '$type' | 'id'>>): Diagram {
   return {
      $container: container,
      $type: 'Diagram',
      id,
      nodes: [],
      edges: [],
      properties: [],
      ...opts
   };
}

export function createElementNode(
   container: Diagram,
   id: string,
   element: Reference<Element>,
   position: Point,
   dimension: Dimension,
   opts?: Partial<Omit<ElementNode, '$container' | '$type' | 'id' | 'element'>>
): ElementNode {
   return {
      $container: container,
      $type: 'ElementNode',
      id,
      element,
      ...position,
      ...dimension,
      ...opts
   };
}

export function createJunctionNode(
   container: Diagram,
   id: string,
   junction: Reference<Junction>,
   dimension: Dimension,
   position: Point,
   opts?: Partial<Omit<JunctionNode, '$container' | '$type' | 'id' | 'element'>>
): JunctionNode {
   return {
      $container: container,
      $type: 'JunctionNode',
      id,
      junction,
      ...position,
      ...dimension,
      ...opts
   };
}

export function createRelationEdge(
   container: Diagram,
   id: string,
   relation: Reference<Relation>,
   sourceNode: Reference<ElementNode>,
   targetNode: Reference<ElementNode>,
   opts?: Partial<Omit<RelationEdge, '$container' | '$type' | 'id' | 'relation' | 'sourceNode' | 'targetNode'>>
): RelationEdge {
   return {
      $container: container,
      $type: 'RelationEdge',
      id,
      relation,
      sourceNode,
      targetNode,
      routingPoints: [],
      ...opts
   };
}
