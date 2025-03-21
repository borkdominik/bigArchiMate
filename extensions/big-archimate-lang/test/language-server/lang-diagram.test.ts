import { describe, expect, test } from '@jest/globals';

import { isReference } from 'langium';
import { Diagram, ElementNode, JunctionNode } from '../../src/language-server/generated/ast.js';
import { WithDocument } from '../../src/language-server/util/ast-util.js';
import {
   diagram1,
   diagram1_with_element_node,
   diagram1_with_junction_node,
   diagram1_with_name,
   diagram1_with_two_nodes_and_one_edge
} from './test-utils/test-documents/diagram/index.js';
import { createTestServices, parseDiagram } from './test-utils/utils.js';

const services = createTestServices();

describe('Language diagram', () => {
   describe('Valid diagram files', () => {
      const testValidDiagram = async (diagram: WithDocument<Diagram>) => {
         expect(diagram.id).toBe('Diagram1Id');
      };

      test('Valid diagram file', async () => {
         const diagram = await parseDiagram({ services, text: diagram1 });
         testValidDiagram(diagram);
         expect(diagram.name).toBeUndefined();
         expect(diagram.nodes).toHaveLength(0);
         expect(diagram.edges).toHaveLength(0);
         expect(diagram.properties).toHaveLength(0);
      });

      test('Valid diagram file with name', async () => {
         const diagram = await parseDiagram({ services, text: diagram1_with_name });
         testValidDiagram(diagram);
         expect(diagram.name).toBe('Diagram1 Name');
         expect(diagram.nodes).toHaveLength(0);
         expect(diagram.edges).toHaveLength(0);
         expect(diagram.properties).toHaveLength(0);
      });

      test('Valid diagram file with element node', async () => {
         const diagram = await parseDiagram({ services, text: diagram1_with_element_node });
         testValidDiagram(diagram);
         expect(diagram.name).toBeUndefined();
         expect(diagram.nodes).toHaveLength(1);

         const node1 = diagram.nodes[0];
         expect(node1.id).toBe('Element1IdNode');
         expect(isReference((node1 as ElementNode).element)).toBe(true);
         expect((node1 as ElementNode).element.$refText).toBe('Element1Id');
         expect(node1.x).toBe(100);
         expect(node1.y).toBe(100);
         expect(node1.width).toBe(100);
         expect(node1.height).toBe(100);

         expect(diagram.edges).toHaveLength(0);
         expect(diagram.properties).toHaveLength(0);
      });

      test('Valid diagram file with junction node', async () => {
         const diagram = await parseDiagram({ services, text: diagram1_with_junction_node });
         testValidDiagram(diagram);
         expect(diagram.name).toBeUndefined();
         expect(diagram.nodes).toHaveLength(1);

         const node1 = diagram.nodes[0];
         expect(node1.id).toBe('Junction1IdNode');
         expect(isReference((node1 as JunctionNode).junction)).toBe(true);
         expect((node1 as JunctionNode).junction.$refText).toBe('Junction1Id');
         expect(node1.x).toBe(100);
         expect(node1.y).toBe(100);
         expect(node1.width).toBe(100);
         expect(node1.height).toBe(100);

         expect(diagram.edges).toHaveLength(0);
         expect(diagram.properties).toHaveLength(0);
      });

      test('Valid diagram file with two nodes and one edge connecting them', async () => {
         const diagram = await parseDiagram({ services, text: diagram1_with_two_nodes_and_one_edge });
         testValidDiagram(diagram);
         expect(diagram.name).toBeUndefined();
         expect(diagram.nodes).toHaveLength(2);

         const node1 = diagram.nodes[0];
         expect(node1.id).toBe('Element1IdNode');
         expect(isReference((node1 as ElementNode).element)).toBe(true);
         expect((node1 as ElementNode).element.$refText).toBe('Element1Id');
         expect(node1.x).toBe(100);
         expect(node1.y).toBe(100);
         expect(node1.width).toBe(100);
         expect(node1.height).toBe(100);

         const node2 = diagram.nodes[1];
         expect(node2.id).toBe('Junction1IdNode');
         expect(isReference((node2 as JunctionNode).junction)).toBe(true);
         expect((node2 as JunctionNode).junction.$refText).toBe('Junction1Id');
         expect(node2.x).toBe(200);
         expect(node2.y).toBe(200);
         expect(node2.width).toBe(100);
         expect(node2.height).toBe(100);

         expect(diagram.edges).toHaveLength(1);

         const edge1 = diagram.edges[0];
         expect(edge1.id).toBe('Edge1Id');
         expect(isReference(edge1.relation)).toBe(true);
         expect(edge1.relation.$refText).toBe('Relation1Id');
         expect(isReference(edge1.sourceNode)).toBe(true);
         expect(edge1.sourceNode.$refText).toBe('Element1IdNode');
         expect(isReference(edge1.targetNode)).toBe(true);
         expect(edge1.targetNode.$refText).toBe('Junction1IdNode');

         expect(diagram.properties).toHaveLength(0);
      });
   });
});
