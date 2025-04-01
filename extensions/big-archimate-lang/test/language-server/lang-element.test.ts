import { describe, expect, test } from '@jest/globals';

import { Element } from '../../src/language-server/generated/ast.js';
import { WithDocument } from '../../src/language-server/util/ast-util.js';
import {
   element1,
   element1_with_properties,
   element1with_documentation,
   element1with_name
} from './test-utils/test-documents/element/element1.js';
import { createTestServices, parseElement } from './test-utils/utils.js';

const services = createTestServices();

describe('Language element', () => {
   describe('Valid element files', () => {
      const testValidElement = async (element: WithDocument<Element>) => {
         expect(element.id).toBe('Element1Id');
         expect(element.type).toBe('BusinessActor');
      };

      test('Valid element file', async () => {
         const element = await parseElement({ services, text: element1 });
         testValidElement(element);
         expect(element.name).toBeUndefined();
         expect(element.documentation).toBeUndefined();
         expect(element.properties).toHaveLength(0);
      });

      test('Valid element file with name', async () => {
         const element = await parseElement({ services, text: element1with_name });
         testValidElement(element);
         expect(element.name).toBe('Element1 Name');
         expect(element.documentation).toBeUndefined();
         expect(element.properties).toHaveLength(0);
      });

      test('Valid element file with documentation', async () => {
         const element = await parseElement({ services, text: element1with_documentation });
         testValidElement(element);
         expect(element.name).toBeUndefined();
         expect(element.documentation).toBe('Element1 Documentation.');
         expect(element.properties).toHaveLength(0);
      });

      test('Valid element file with properties', async () => {
         const element = await parseElement({ services, text: element1_with_properties });
         testValidElement(element);
         expect(element.documentation).toBeUndefined();
         expect(element.properties).toHaveLength(1);
         expect(element.properties[0].id).toBe('Property1');
         expect(element.properties[0].name).toBe('Property1 Name');
         expect(element.properties[0].value).toBe('Property1 Value');
      });
   });
});
