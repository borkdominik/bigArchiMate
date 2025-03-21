import { IntegrationArgs, TheiaGLSPApp } from '@eclipse-glsp/glsp-playwright';
import { Page } from '@playwright/test';
import { TheiaNotificationIndicator, TheiaNotificationOverlay, TheiaWorkspace } from '@theia/playwright';
import { TheiaIntegration } from './theia-integration';
import path = require('path');

export interface AppArgs extends Omit<IntegrationArgs, 'page'> {
   workspaceUrl?: string;
   baseUrl?: string;
}
export class App extends TheiaGLSPApp {
   public static async load(args: AppArgs): Promise<App> {
      const integration = new TheiaIntegration(
         { browser: args.browser, page: {} as any, playwright: args.playwright },
         {
            type: 'Theia',
            workspace: args.workspaceUrl ?? path.join(__dirname, '../resources/sample-workspace'),
            widgetId: '',
            url: args.baseUrl ?? 'http://localhost:3000'
         }
      );
      await integration.initialize();
      await integration.start();
      await integration.app.notificationOverlay.waitForEntry('Connected to Model Server on port');
      await integration.app.notificationOverlay.waitForEntry('Connected to Graphical Server on port');
      await integration.app.notificationOverlay.clearAllNotifications();

      return integration.app;
   }

   readonly notificationIndicator: TheiaNotificationIndicator;
   readonly notificationOverlay: TheiaNotificationOverlay;

   public constructor(page: Page, workspace: TheiaWorkspace, isElectron: boolean) {
      super(page, workspace, isElectron);
      this.notificationIndicator = this.notificationIndicator = new TheiaNotificationIndicator(this);
      this.notificationOverlay = this.notificationOverlay = new TheiaNotificationOverlay(this, this.notificationIndicator);
   }

   protected _integration: TheiaIntegration;

   set integration(integration: TheiaIntegration) {
      if (!this._integration) {
         this._integration = integration;
      } else {
         console.warn('Integration already set');
      }
   }

   get integration(): TheiaIntegration {
      return this._integration;
   }
}
