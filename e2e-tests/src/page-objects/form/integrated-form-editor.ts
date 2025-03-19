import { OSUtil, normalizeId, urlEncodePath } from '@theia/playwright';
import { join } from 'path';
import { CompositeEditor, hasViewError } from '../composite-editor';
import { IntegratedEditor } from '../integrated-editor';
import { EntityForm } from './entiy-form';
import { Form } from './form';
import { RelationshipForm } from './relationship-form';
export class IntegratedFormEditor extends IntegratedEditor {
   constructor(filePath: string, parent: CompositeEditor, tabSelector: string) {
      super(
         {
            tabSelector,
            viewSelector: normalizeId(
               `#form-editor-opener:file://${urlEncodePath(join(parent.app.workspace.escapedPath, OSUtil.fileSeparator, filePath))}`
            )
         },
         parent
      );
   }

   async hasError(errorMessage: string): Promise<boolean> {
      return hasViewError(this.page, this.viewSelector, errorMessage);
   }

   async formFor(entity: 'entity'): Promise<EntityForm>;
   async formFor(relationship: 'relationship'): Promise<RelationshipForm>;
   async formFor(string: 'entity' | 'relationship'): Promise<Form> {
      if (string === 'entity') {
         const form = new EntityForm(this, '');
         await form.waitForVisible();
         return form;
      } else {
         const form = new RelationshipForm(this, '');
         await form.waitForVisible();
         return form;
      }
   }
}
