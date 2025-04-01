import { beforeAll, describe, expect, test } from '@jest/globals';
import { Reference } from 'langium';

import { ArchiMateRoot, Element, Relation } from '../../../src/language-server/generated/ast.js';
import { Serializer } from '../../../src/language-server/serializer.js';
import {
   createDiagram,
   createElement,
   createElementNode,
   createRelation,
   createRelationEdge
} from '../../../src/language-server/util/ast-util.js';
import { createTestServices } from '../test-utils/utils.js';

const services = createTestServices();

describe('Lexer', () => {
   let serializer: Serializer;

   beforeAll(() => {
      serializer = services.serializer.Serializer;
   });

   describe('Serialize element', () => {
      let archiMateRoot: ArchiMateRoot;

      beforeAll(() => {
         archiMateRoot = { $type: 'ArchiMateRoot' };
         archiMateRoot.element = createElement(archiMateRoot, 'testId', 'ApplicationCollaboration', 'test Name', {
            documentation: 'Test documentation'
         });
      });

      test('serialize element', () => {
         const parseResult = serializer.serialize(archiMateRoot);
         expect(parseResult).toBe(expected_result);
      });
   });

   describe('Serialize relation', () => {
      let archiMateRoot: ArchiMateRoot;

      beforeAll(() => {
         archiMateRoot = {
            $type: 'ArchiMateRoot'
         };

         const ref1: Reference<Element> = {
            $refText: 'Ref1',
            ref: createElement(archiMateRoot, 'Ref1', 'ApplicationCollaboration', 'test Name', {
               documentation: 'Test documentation'
            })
         };

         const ref2: Reference<Element> = {
            $refText: 'Ref2',
            ref: createElement(archiMateRoot, 'Ref2', 'ApplicationCollaboration', 'test Name', {
               documentation: 'Test documentation'
            })
         };

         archiMateRoot.relation = createRelation(archiMateRoot, 'testId', 'Association', 'test Name', ref1, ref2, {
            documentation: 'Test documentation'
         });
      });

      test('serialize relation', () => {
         const parseResult = serializer.serialize(archiMateRoot);
         expect(parseResult).toBe(expected_result1);
      });
   });

   describe('Serialize diagram', () => {
      let archiMateRoot: ArchiMateRoot;

      beforeAll(() => {
         archiMateRoot = {
            $type: 'ArchiMateRoot'
         };

         const ref1: Reference<Element> = {
            $refText: 'Ref1',
            ref: createElement(archiMateRoot, 'Ref1', 'ApplicationCollaboration', 'test Name', {
               documentation: 'Test documentation'
            })
         };

         const ref2: Reference<Element> = {
            $refText: 'Ref2',
            ref: createElement(archiMateRoot, 'Ref2', 'ApplicationCollaboration', 'test Name', {
               documentation: 'Test documentation'
            })
         };

         const ref3: Reference<Relation> = {
            $refText: 'Ref3',
            ref: createRelation(archiMateRoot, 'testId', 'Association', 'test Name', ref1, ref2, {
               documentation: 'Test documentation'
            })
         };

         archiMateRoot.diagram = createDiagram(archiMateRoot, 'testId');

         archiMateRoot.diagram.nodes = [
            createElementNode(archiMateRoot.diagram, 'Node1', ref1, { x: 100, y: 101 }, { width: 102, height: 102 }),
            createElementNode(archiMateRoot.diagram, 'Node2', ref2, { x: 100, y: 101 }, { width: 102, height: 102 })
         ];

         archiMateRoot.diagram.edges = [createRelationEdge(archiMateRoot.diagram, 'Edge1', ref3, { $refText: 'A' }, { $refText: 'B' })];
      });

      test('serialize diagram', () => {
         const parseResult = serializer.serialize(archiMateRoot);
         expect(parseResult).toBe(expected_result2);
      });
   });
});

const expected_result = `element:
    id: testId
    type: ApplicationCollaboration
    name: "test Name"
    documentation: "Test documentation"`;

const expected_result1 = `relation:
    id: testId
    type: Association
    source: Ref1
    target: Ref2
    name: "test Name"
    documentation: "Test documentation"`;

const expected_result2 = `diagram:
    id: testId
    nodes:
      - id: Node1
        element: Ref1
        x: 100
        y: 101
        width: 102
        height: 102
      - id: Node2
        element: Ref2
        x: 100
        y: 101
        width: 102
        height: 102
    edges:
      - id: Edge1
        relation: Ref3
        sourceNode: A
        targetNode: B`;
