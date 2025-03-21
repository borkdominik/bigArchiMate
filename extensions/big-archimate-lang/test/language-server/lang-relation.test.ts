import { describe } from '@jest/globals';

import { isReference } from 'langium';
import { Relation } from '../../src/language-server/generated/ast.js';
import { WithDocument } from '../../src/language-server/util/ast-util.js';
import { element1 } from './test-utils/test-documents/element/element1.js';
import { element2 } from './test-utils/test-documents/element/element2.js';
import {
   relation1,
   relation1_with_properties,
   relation1with_documentation,
   relation1with_name
} from './test-utils/test-documents/relation/relation1.js';
import { createTestServices, parseDocuments, parseRelation } from './test-utils/utils.js';

const services = createTestServices();

describe('Language relation', () => {
   beforeAll(async () => {
      await parseDocuments([
         { services, text: relation1 },
         { services, text: element1 },
         { services, text: element2 }
      ]);
   });

   describe('Valid relation files', () => {
      const testValidRelation = async (relation: WithDocument<Relation>) => {
         expect(relation.id).toBe('Relation1Id');
         expect(relation.type).toBe('Association');
         expect(isReference(relation.source)).toBe(true);
         expect(isReference(relation.target)).toBe(true);
         expect(relation.source.$refText).toBe('Element1Id');
         expect(relation.target.$refText).toBe('Element2Id');
      };

      test('Valid relation file', async () => {
         const relation = await parseRelation({ services, text: relation1 });
         testValidRelation(relation);
         expect(relation.name).toBeUndefined();
         expect(relation.documentation).toBeUndefined();
         expect(relation.properties).toHaveLength(0);
      });

      test('Valid relation file with name', async () => {
         const relation = await parseRelation({ services, text: relation1with_name });
         testValidRelation(relation);
         expect(relation.name).toBe('Relation1 Name');
         expect(relation.documentation).toBeUndefined();
         expect(relation.properties).toHaveLength(0);
      });

      test('Valid relation file with documentation', async () => {
         const relation = await parseRelation({ services, text: relation1with_documentation });
         testValidRelation(relation);
         expect(relation.name).toBeUndefined();
         expect(relation.documentation).toBe('Relation1 Documentation.');
         expect(relation.properties).toHaveLength(0);
      });

      test('Valid relation file with properties', async () => {
         const relation = await parseRelation({ services, text: relation1_with_properties });
         testValidRelation(relation);
         expect(relation.name).toBeUndefined();
         expect(relation.documentation).toBeUndefined();
         expect(relation.properties).toHaveLength(1);
         expect(relation.properties[0].id).toBe('Property1');
         expect(relation.properties[0].name).toBe('Property1 Name');
         expect(relation.properties[0].value).toBe('Property1 Value');
      });
   });
});
