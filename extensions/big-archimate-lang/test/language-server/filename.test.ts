import { ModelFileExtensions } from '@big-archimate/protocol';
import { element1 } from './test-utils/test-documents/element/element1.js';
import { createTestServices, parseElement, testUri } from './test-utils/utils.js';

const services = createTestServices();

describe('Filename Validation', () => {
   test('Mismatching id and filename does not yield error', async () => {
      const entity = await parseElement({
         services,
         text: element1,
         validation: true,
         documentUri: testUri('Element2Id' + ModelFileExtensions.Element)
      });
      expect(entity.id).toBe('Element1Id');
      expect(entity.$document.diagnostics).toHaveLength(1);
      expect(entity.$document.diagnostics![0].message).toContain('Filename should match element id');
   });
});
