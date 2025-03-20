import { beforeAll, describe, expect, test } from '@jest/globals';
import { Reference, URI } from 'langium';

import _ from 'lodash';
import { ArchiMateRoot, Entity, Relationship } from '../../../src/language-server/generated/ast.js';
import { Serializer } from '../../../src/language-server/serializer.js';
import {
   createEntity,
   createEntityAttribute,
   createEntityNode,
   createRelationship,
   createRelationshipEdge,
   createSystemDiagram
} from '../../../src/language-server/util/ast-util.js';
import { customer } from '../test-utils/test-documents/entity/customer.js';
import { sub_customer } from '../test-utils/test-documents/entity/sub_customer.js';
import { sub_customer_cycle } from '../test-utils/test-documents/entity/sub_customer_cycle.js';
import { sub_customer_multi } from '../test-utils/test-documents/entity/sub_customer_multi.js';
import { createTestServices, parseDocuments, parseEntity, testUri } from '../test-utils/utils.js';

const services = createTestServices();

describe('Lexer', () => {
   let serializer: Serializer;

   beforeAll(() => {
      serializer = services.serializer.Serializer;
   });

   describe('Serialize entity', () => {
      let archiMateRoot: ArchiMateRoot;
      let archiMateRootWithoutAttributes: ArchiMateRoot;
      let archiMateRootWithAttributesDifPlace: ArchiMateRoot;

      beforeAll(() => {
         archiMateRoot = { $type: 'ArchiMateRoot' };
         archiMateRoot.entity = createEntity(archiMateRoot, 'testId', 'test Name', {
            description: 'Test description'
         });

         archiMateRootWithoutAttributes = _.cloneDeep(archiMateRoot);

         archiMateRoot.entity.attributes = [
            createEntityAttribute(archiMateRoot.entity, 'Attribute1', 'Attribute 1'),
            createEntityAttribute(archiMateRoot.entity, 'Attribute2', 'Attribute 2')
         ];

         archiMateRootWithAttributesDifPlace = { $type: 'ArchiMateRoot' };
         archiMateRootWithAttributesDifPlace.entity = createEntity(archiMateRoot, 'testId', 'test Name', {
            description: 'Test description'
         });
         archiMateRootWithAttributesDifPlace.entity.attributes = [
            createEntityAttribute(archiMateRoot.entity, 'Attribute1', 'Attribute 1'),
            createEntityAttribute(archiMateRoot.entity, 'Attribute2', 'Attribute 2')
         ];
      });

      test('serialize entity with attributes', () => {
         const parseResult = serializer.serialize(archiMateRoot);
         expect(parseResult).toBe(expected_result);
      });

      test('serialize entity without attributes', () => {
         const parseResult = serializer.serialize(archiMateRootWithoutAttributes);
         expect(parseResult).toBe(expected_result2);
      });

      test('serialize entity with attributes in different place', () => {
         const parseResult = serializer.serialize(archiMateRootWithAttributesDifPlace);
         expect(parseResult).toBe(expected_result3);
      });
   });

   describe('Serialize relationship', () => {
      let archiMateRoot: ArchiMateRoot;

      beforeAll(() => {
         archiMateRoot = {
            $type: 'ArchiMateRoot'
         };

         const ref1: Reference<Entity> = {
            $refText: 'Ref1',
            ref: createEntity(archiMateRoot, 'Ref1', 'test Name', {
               description: 'Test description'
            })
         };

         const ref2: Reference<Entity> = {
            $refText: 'Ref2',
            ref: createEntity(archiMateRoot, 'Ref2', 'test Name', {
               description: 'Test description'
            })
         };

         archiMateRoot.relationship = createRelationship(archiMateRoot, 'testId', 'test Name', ref1, ref2, {
            description: 'Test description'
         });
      });

      test('serialize entity with attributes', () => {
         const parseResult = serializer.serialize(archiMateRoot);
         expect(parseResult).toBe(expected_result4);
      });
   });

   describe('Serialize diagram', () => {
      let archiMateRoot: ArchiMateRoot;

      beforeAll(() => {
         archiMateRoot = {
            $type: 'ArchiMateRoot'
         };

         const ref1: Reference<Entity> = {
            $refText: 'Ref1',
            ref: createEntity(archiMateRoot, 'Ref1', 'test Name', {
               description: 'Test description'
            })
         };

         const ref2: Reference<Entity> = {
            $refText: 'Ref2',
            ref: createEntity(archiMateRoot, 'Ref2', 'test Name', {
               description: 'Test description'
            })
         };

         const ref3: Reference<Relationship> = {
            $refText: 'Ref3',
            ref: createRelationship(archiMateRoot, 'testId', 'test Name', ref1, ref2, {
               description: 'Test description'
            })
         };

         archiMateRoot.systemDiagram = createSystemDiagram(archiMateRoot, 'testId');

         archiMateRoot.systemDiagram.nodes = [
            createEntityNode(archiMateRoot.systemDiagram, 'Node1', ref1, { x: 100, y: 101 }, { width: 102, height: 102 }),
            createEntityNode(archiMateRoot.systemDiagram, 'Node2', ref2, { x: 100, y: 101 }, { width: 102, height: 102 })
         ];

         archiMateRoot.systemDiagram.edges = [
            createRelationshipEdge(archiMateRoot.systemDiagram, 'Edge1', ref3, { $refText: 'A' }, { $refText: 'B' })
         ];
      });

      test('serialize entity with attributes', () => {
         const parseResult = serializer.serialize(archiMateRoot);
         expect(parseResult).toBe(expected_result5);
      });
   });

   describe('Serialize entity with inheritance', () => {
      const customerDocumentUri = testUri('customer');

      beforeAll(async () => {
         await parseDocuments([{ services, text: customer, documentUri: customerDocumentUri }]);
      });

      test('Single inheritance', async () => {
         const subCustomer = await parseEntity({ services, text: sub_customer });
         expect(subCustomer.superEntities).toHaveLength(1);
         expect(subCustomer.superEntities[0].$refText).toBe('Customer');
      });

      test('Multiple inheritance', async () => {
         const subCustomer = await parseEntity({ services, text: sub_customer_multi });
         expect(subCustomer.superEntities).toHaveLength(2);
         expect(subCustomer.superEntities[0].$refText).toBe('Customer');
         expect(subCustomer.superEntities[1].$refText).toBe('SubCustomer');
      });

      test('Inheritance Cycle', async () => {
         services.shared.workspace.LangiumDocuments.deleteDocument(URI.parse(customerDocumentUri));
         const newCustomer = await parseEntity({ services, text: sub_customer_cycle, documentUri: 'customer', validation: true });
         expect(newCustomer.$document.diagnostics).toBeDefined();
         expect(newCustomer.$document.diagnostics).toEqual(
            expect.arrayContaining([
               expect.objectContaining({ message: 'Inheritance cycle detected: Customer -> SubCustomer -> Customer.' })
            ])
         );
      });
   });
});

const expected_result = `entity:
    id: testId
    name: "test Name"
    description: "Test description"
    attributes:
      - id: Attribute1
        name: "Attribute 1"
      - id: Attribute2
        name: "Attribute 2"`;
const expected_result2 = `entity:
    id: testId
    name: "test Name"
    description: "Test description"`;
const expected_result3 = `entity:
    id: testId
    name: "test Name"
    description: "Test description"
    attributes:
      - id: Attribute1
        name: "Attribute 1"
      - id: Attribute2
        name: "Attribute 2"`;

const expected_result4 = `relationship:
    id: testId
    name: "test Name"
    description: "Test description"
    parent: Ref1
    child: Ref2`;
const expected_result5 = `systemDiagram:
    id: testId
    nodes:
      - id: Node1
        entity: Ref1
        x: 100
        y: 101
        width: 102
        height: 102
      - id: Node2
        entity: Ref2
        x: 100
        y: 101
        width: 102
        height: 102
    edges:
      - id: Edge1
        relationship: Ref3
        sourceNode: A
        targetNode: B`;
