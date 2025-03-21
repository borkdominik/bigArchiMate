import { describe } from '@jest/globals';

import { isReference } from 'langium';
import { Relationship } from '../../src/language-server/generated/ast.js';
import { WithDocument } from '../../src/language-server/util/ast-util.js';
import { element1 } from './test-utils/test-documents/element/element1.js';
import { element2 } from './test-utils/test-documents/element/element2.js';
import {
   relationship1,
   relationship1_with_properties,
   relationship1with_documentation,
   relationship1with_name
} from './test-utils/test-documents/relationship/relationship1.js';
import { createTestServices, parseDocuments, parseRelationship } from './test-utils/utils.js';

const services = createTestServices();

describe('Language relationship', () => {
   beforeAll(async () => {
      await parseDocuments([
         { services, text: relationship1 },
         { services, text: element1 },
         { services, text: element2 }
      ]);
   });

   describe('Valid relationship files', () => {
      const testValidRelationship = async (relationship: WithDocument<Relationship>) => {
         expect(relationship.id).toBe('Relationship1Id');
         expect(relationship.type).toBe('Association');
         expect(isReference(relationship.source)).toBe(true);
         expect(isReference(relationship.target)).toBe(true);
         expect(relationship.source.$refText).toBe('Element1Id');
         expect(relationship.target.$refText).toBe('Element2Id');
      };

      test('Valid relationship file', async () => {
         const relationship = await parseRelationship({ services, text: relationship1 });
         testValidRelationship(relationship);
         expect(relationship.name).toBeUndefined();
         expect(relationship.documentation).toBeUndefined();
         expect(relationship.properties).toHaveLength(0);
      });

      test('Valid relationship file with name', async () => {
         const relationship = await parseRelationship({ services, text: relationship1with_name });
         testValidRelationship(relationship);
         expect(relationship.name).toBe('Relationship1 Name');
         expect(relationship.documentation).toBeUndefined();
         expect(relationship.properties).toHaveLength(0);
      });

      test('Valid relationship file with documentation', async () => {
         const relationship = await parseRelationship({ services, text: relationship1with_documentation });
         testValidRelationship(relationship);
         expect(relationship.name).toBeUndefined();
         expect(relationship.documentation).toBe('Relationship1 Documentation.');
         expect(relationship.properties).toHaveLength(0);
      });

      test('Valid relationship file with properties', async () => {
         const relationship = await parseRelationship({ services, text: relationship1_with_properties });
         testValidRelationship(relationship);
         expect(relationship.name).toBeUndefined();
         expect(relationship.documentation).toBeUndefined();
         expect(relationship.properties).toHaveLength(1);
         expect(relationship.properties[0].id).toBe('Property1');
         expect(relationship.properties[0].name).toBe('Property1 Name');
         expect(relationship.properties[0].value).toBe('Property1 Value');
      });
   });
});
