import { expect, test } from '@playwright/test';
import { App } from '../page-objects/app';

test.describe('App', () => {
   let app: App;

   test.beforeAll(async ({ browser, playwright }) => {
      app = await App.load({ browser, playwright });
   });

   test('main content panel visible', async () => {
      expect(await app.isMainContentPanelVisible()).toBe(true);
   });
});
