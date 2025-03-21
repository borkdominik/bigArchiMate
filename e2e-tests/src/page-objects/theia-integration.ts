import { ContextMenuIntegration, Integration, IntegrationArgs, TheiaIntegrationOptions } from '@eclipse-glsp/glsp-playwright';
import { Locator, Page } from '@playwright/test';
import { TheiaAppFactory, TheiaAppLoader } from '@theia/playwright';
import { App } from './app';
import { Workspace } from './workspace';

export class TheiaIntegration extends Integration implements ContextMenuIntegration {
   protected theiaApp: App;

   override get page(): Page {
      return this.theiaApp.page;
   }

   get app(): App {
      return this.theiaApp;
   }

   get contextMenuLocator(): Locator {
      return this.page.locator('body > .p-Widget.p-Menu');
   }

   constructor(
      args: IntegrationArgs,
      protected readonly options: TheiaIntegrationOptions
   ) {
      super(args, 'Theia');
   }

   protected override async launch(): Promise<void> {
      const ws = new Workspace(this.options.workspace ? [this.options.workspace] : undefined);
      this.theiaApp = await TheiaAppLoader.load(this.args, ws, App as TheiaAppFactory<App>);
      this.theiaApp.integration = this;
      this.theiaApp.initialize(this.options);
   }
}
