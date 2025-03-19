import { ElementHandle } from '@playwright/test';
import { TheiaApp, TheiaEditor, isElementVisible } from '@theia/playwright';
import { EntityForm } from './form/entiy-form';
import { Form } from './form/form';
import { RelationshipForm } from './form/relationship-form';

const PropertiesViewData = {
   tabSelector: '#shell-tab-property-view',
   viewSelector: '#property-view',
   viewName: 'Properties'
};

export abstract class PropertiesView<F extends Form> extends TheiaEditor {
   protected modelRootSelector = '#model-property-view';

   abstract form(): Promise<F>;

   constructor(app: TheiaApp) {
      super(PropertiesViewData, app);
   }

   protected async modelPropertyElement(): Promise<ElementHandle<SVGElement | HTMLElement> | null> {
      return this.page.$(this.viewSelector + ' ' + this.modelRootSelector);
   }

   isModelPropertyElement(): Promise<boolean> {
      return isElementVisible(this.modelPropertyElement());
   }

   override async isDirty(): Promise<boolean> {
      const form = await this.form();
      return form.isDirty();
   }
}

export class EntityPropertiesView extends PropertiesView<EntityForm> {
   async form(): Promise<EntityForm> {
      const entityForm = new EntityForm(this, this.modelRootSelector);
      await entityForm.waitForVisible();
      return entityForm;
   }
}

export class RelationshipPropertiesView extends PropertiesView<RelationshipForm> {
   async form(): Promise<RelationshipForm> {
      const relationshipForm = new RelationshipForm(this, this.modelRootSelector);
      await relationshipForm.waitForVisible();
      return relationshipForm;
   }
}
