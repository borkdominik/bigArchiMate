import { beforeAll, describe, expect, test } from '@jest/globals';
import { Reference } from 'langium';

import { ArchiMateRoot, Element, Relation } from '../../../src/language-server/generated/ast.js';
import { Serializer } from '../../../src/language-server/serializer.js';
import {
   createArchiMateDiagram,
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
         archiMateRoot.element = createElement(archiMateRoot, 'testId', 'test Name', 'ApplicationCollaboration', {
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
            ref: createElement(archiMateRoot, 'Ref1', 'test Name', 'ApplicationCollaboration', {
               documentation: 'Test documentation'
            })
         };

         const ref2: Reference<Element> = {
            $refText: 'Ref2',
            ref: createElement(archiMateRoot, 'Ref2', 'test Name', 'ApplicationCollaboration', {
               documentation: 'Test documentation'
            })
         };

         archiMateRoot.relation = createRelation(archiMateRoot, 'testId', 'test Name', 'Association', ref1, ref2, {
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
            ref: createElement(archiMateRoot, 'Ref1', 'test Name', 'ApplicationCollaboration', {
               documentation: 'Test documentation'
            })
         };

         const ref2: Reference<Element> = {
            $refText: 'Ref2',
            ref: createElement(archiMateRoot, 'Ref2', 'test Name', 'ApplicationCollaboration', {
               documentation: 'Test documentation'
            })
         };

         const ref3: Reference<Relation> = {
            $refText: 'Ref3',
            ref: createRelation(archiMateRoot, 'testId', 'test Name', 'Association', ref1, ref2, {
               documentation: 'Test documentation'
            })
         };

         archiMateRoot.archiMateDiagram = createArchiMateDiagram(archiMateRoot, 'testId');

         archiMateRoot.archiMateDiagram.nodes = [
            createElementNode(archiMateRoot.archiMateDiagram, 'Node1', ref1, { x: 100, y: 101 }, { width: 102, height: 102 }),
            createElementNode(archiMateRoot.archiMateDiagram, 'Node2', ref2, { x: 100, y: 101 }, { width: 102, height: 102 })
         ];

         archiMateRoot.archiMateDiagram.edges = [
            createRelationEdge(archiMateRoot.archiMateDiagram, 'Edge1', ref3, { $refText: 'A' }, { $refText: 'B' })
         ];
      });

      test('serialize diagram', () => {
         const parseResult = serializer.serialize(archiMateRoot);
         expect(parseResult).toBe(expected_result2);
      });
   });
});

const expected_result = `element:
    id: testId
    name: "test Name"
    documentation: "Test documentation"
    type: ApplicationCollaboration`;

const expected_result1 = `relation:
    id: testId
    name: "test Name"
    documentation: "Test documentation"
    type: Association
    source: Ref1
    target: Ref2`;

const expected_result2 = `archiMateDiagram:
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
