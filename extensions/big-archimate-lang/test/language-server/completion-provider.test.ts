import { expandToString } from 'langium/generate';
import { expectCompletion } from 'langium/test';
import { element1 } from './test-utils/test-documents/element/element1.js';
import { element2 } from './test-utils/test-documents/element/element2.js';
import { element3 } from './test-utils/test-documents/element/element3.js';
import { createTestServices, MockFileSystem, parseProject, testUri } from './test-utils/utils.js';

const services = createTestServices(MockFileSystem);
const assertCompletion = expectCompletion(services);

describe('CompletionProvider', () => {
   const text = expandToString`
    relation:
       id: RelationId
       type: Association
       source: <|>
    `;

   beforeAll(async () => {
      const packageA = await parseProject({
         package: { services, uri: testUri('projectA', 'package.json'), content: { name: 'ProjectA', version: '1.0.0' } },
         documents: [
            { services, text: element1, documentUri: testUri('projectA', 'Element1Id.element.cm') },
            { services, text: element2, documentUri: testUri('projectA', 'Element2Id.element.cm') }
         ]
      });

      await parseProject({
         package: {
            services,
            uri: testUri('projectB', 'package.json'),
            content: { name: 'ProjectB', version: '1.0.0', dependencies: { ...packageA } }
         },
         documents: [{ services, text: element3, documentUri: testUri('projectB', 'Element3Id.element.cm') }]
      });
   });

   test('Completion for element references in project A', async () => {
      await assertCompletion({
         text,
         parseOptions: { documentUri: testUri('projectA', 'rel.relation.arch') },
         index: 0,
         expectedItems: ['Element1Id', 'Element2Id'],
         disposeAfterCheck: true
      });
   });

   test('Completion for element references in project B', async () => {
      await assertCompletion({
         text,
         parseOptions: { documentUri: testUri('projectB', 'rel.relation.arch') },
         index: 0,
         expectedItems: ['Element3Id', 'ProjectA.Element1Id', 'ProjectA.Element2Id'],
         disposeAfterCheck: true
      });
   });
});
