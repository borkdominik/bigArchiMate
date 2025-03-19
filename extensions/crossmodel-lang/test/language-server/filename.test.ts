import { ModelFileExtensions } from '@crossbreeze/protocol';
import { entity1 } from './test-utils/test-documents/entity/entity1.js';
import { createTestServices, parseEntity, testUri } from './test-utils/utils.js';

const services = createTestServices();

describe('Filename Validation', () => {
   test('Mismatching id and filename does not yield error', async () => {
      const entity = await parseEntity({
         services,
         text: entity1,
         validation: true,
         documentUri: testUri('Customer2' + ModelFileExtensions.Entity)
      });
      expect(entity.id).toBe('Customer');
      expect(entity.$document.diagnostics).toHaveLength(1);
      expect(entity.$document.diagnostics![0].message).toContain('Filename should match element id');
   });
});
