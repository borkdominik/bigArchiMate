import { describe } from '@jest/globals';

import { Junction } from '../../src/language-server/generated/ast.js';
import { WithDocument } from '../../src/language-server/util/ast-util.js';
import { element1 } from './test-utils/test-documents/element/element1.js';
import { element2 } from './test-utils/test-documents/element/element2.js';
import {
   junction1,
   junction1_with_properties,
   junction1with_documentation,
   junction1with_name
} from './test-utils/test-documents/junction/junction1.js';
import { createTestServices, parseDocuments, parseJunction } from './test-utils/utils.js';

const services = createTestServices();

describe('Language junction', () => {
   beforeAll(async () => {
      await parseDocuments([
         { services, text: junction1 },
         { services, text: element1 },
         { services, text: element2 }
      ]);
   });

   describe('Valid junction files', () => {
      const testValidJunction = async (junction: WithDocument<Junction>) => {
         expect(junction.id).toBe('Junction1Id');
      };

      test('Valid junction file', async () => {
         const junction = await parseJunction({ services, text: junction1 });
         testValidJunction(junction);
         expect(junction.name).toBeUndefined();
         expect(junction.documentation).toBeUndefined();
         expect(junction.properties).toHaveLength(0);
      });

      test('Valid junction file with name', async () => {
         const junction = await parseJunction({ services, text: junction1with_name });
         testValidJunction(junction);
         expect(junction.name).toBe('Junction1 Name');
         expect(junction.documentation).toBeUndefined();
         expect(junction.properties).toHaveLength(0);
      });

      test('Valid junction file with documentation', async () => {
         const junction = await parseJunction({ services, text: junction1with_documentation });
         testValidJunction(junction);
         expect(junction.name).toBeUndefined();
         expect(junction.documentation).toBe('Junction1 Documentation.');
         expect(junction.properties).toHaveLength(0);
      });

      test('Valid junction file with properties', async () => {
         const junction = await parseJunction({ services, text: junction1_with_properties });
         testValidJunction(junction);
         expect(junction.name).toBeUndefined();
         expect(junction.documentation).toBeUndefined;
         expect(junction.properties).toHaveLength(1);
         expect(junction.properties[0].id).toBe('Property1');
         expect(junction.properties[0].name).toBe('Property1 Name');
         expect(junction.properties[0].value).toBe('Property1 Value');
      });
   });
});
