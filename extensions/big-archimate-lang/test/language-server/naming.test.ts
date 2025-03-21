import { describe, expect, test } from '@jest/globals';
import { ElementNode } from '../../src/language-server/generated/ast.js';
import { createTestServices, parseDiagram } from './test-utils/utils.js';

const services = createTestServices();

const ex1 = `diagram:
    id: example1`;
const ex2 = `diagram:
    id: example2
    nodes:
        - id: nodeA
          element: NotExisting
          x: 0
          y: 0
          width: 0
          height: 0`;
const ex3 = `diagram:
    id: example3
    nodes:
        - id: nodeA
          element: NotExisting
          x: 0
          y: 0
          width: 0
          height: 0
        - id: nodeA1
          element: NotExisting
          x: 0
          y: 0
          width: 0
          height: 0`;
const ex4 = `diagram:
    id: example4
    nodes:
        - id: nodeA
          element: NotExisting
          x: 0
          y: 0
          width: 0
          height: 0
        - id: nodeA1
          element: NotExisting
          x: 0
          y: 0
          width: 0
          height: 0
        - id: nodeA2
          element: NotExisting
          x: 0
          y: 0
          width: 0
          height: 0
        - id: nodeA4
          element: NotExisting
          x: 0
          y: 0
          width: 0
          height: 0`;

describe('NameUtil', () => {
   describe('findAvailableNodeName', () => {
      test('should return given name if unique', async () => {
         const diagram = await parseDiagram({ services, text: ex1 });
         expect(services.references.IdProvider.findNextId(ElementNode, 'nodeA', diagram)).toBe('nodeA');
      });

      test('should return unique name if given is taken', async () => {
         const diagram = await parseDiagram({ services, text: ex2 });
         expect(services.references.IdProvider.findNextId(ElementNode, 'nodeA', diagram)).toBe('nodeA1');
      });

      test('should properly count up if name is taken', async () => {
         const diagram = await parseDiagram({ services, text: ex3 });
         expect(services.references.IdProvider.findNextId(ElementNode, 'nodeA', diagram)).toBe('nodeA2');
      });

      test('should find lowest count if multiple are taken', async () => {
         const diagram = await parseDiagram({ services, text: ex4 });
         expect(services.references.IdProvider.findNextId(ElementNode, 'nodeA', diagram)).toBe('nodeA3');
      });
   });
});
