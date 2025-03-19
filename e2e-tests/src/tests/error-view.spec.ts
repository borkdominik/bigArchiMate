import { expect, test } from '@playwright/test';
import { App } from '../page-objects/app';
import { CompositeEditor } from '../page-objects/composite-editor';

test.describe('Error Views', () => {
   let app: App;

   test.beforeAll(async ({ browser, playwright }) => {
      app = await App.load({ browser, playwright });
   });
   test('Form Editor should show error if model code is broken', async () => {
      const editor = await app.openEditor('example-entity.entity.cm', CompositeEditor);
      expect(editor).toBeDefined();

      const codeEditor = await editor.switchToCodeEditor();
      expect(codeEditor).toBeDefined();
      await codeEditor.addTextToNewLineAfterLineByLineNumber(2, 'break-model');

      const formEditor = await editor.switchToFormEditor();
      expect(
         await formEditor.hasError(
            // eslint-disable-next-line max-len
            "The file contains one or more errors. Please fix the error(s) using the 'Code Editor'. This perspective will be read-only until the errors are resolved."
         )
      ).toBeTruthy();
   });

   test('System Diagram Editor should show error if model code is broken', async () => {
      const editor = await app.openEditor('example-diagram.diagram.cm', CompositeEditor);
      expect(editor).toBeDefined();

      const codeEditor = await editor.switchToCodeEditor();
      await codeEditor.addTextToNewLineAfterLineByLineNumber(2, 'break-model');

      const diagramEditor = await editor.switchToSystemDiagram();
      expect(
         await diagramEditor.hasError(
            // eslint-disable-next-line max-len
            "The file contains one or more errors. Please fix the error(s) using the 'Code Editor'. This perspective will be read-only until the errors are resolved."
         )
      ).toBeTruthy();
   });
});
