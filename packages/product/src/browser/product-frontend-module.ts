import { ApplicationShell, ApplicationShellOptions, FrontendApplication, WidgetFactory } from '@theia/core/lib/browser';
import { PreferenceContribution } from '@theia/core/lib/browser/preferences';
import { ContainerModule } from '@theia/core/shared/inversify';
import { ThemeServiceWithDB } from '@theia/monaco/lib/browser/monaco-indexed-db';
import {
   GettingStartedPreferenceContribution,
   GettingStartedPreferenceSchema
} from '@theia/getting-started/lib/browser/getting-started-preferences';
import { CustomFrontendApplication } from './frontend-application';
import { ThemeService } from './theme-service';
import { CustomWelcomeWidget } from './custom-welcome-widget';
import { GettingStartedWidget } from '@theia/getting-started/lib/browser/getting-started-widget';
import '../../style/custom-welcome-widget.css';

const welcomeAlwaysSchema = {
   ...GettingStartedPreferenceSchema,
   properties: {
      ...GettingStartedPreferenceSchema.properties,
      'workbench.startupEditor': {
         ...GettingStartedPreferenceSchema.properties?.['workbench.startupEditor'],
         default: 'welcomePage'
      }
   }
};

export default new ContainerModule((bind, _unbind, _isBound, rebind) => {
   bind(ThemeService).toSelf().inSingletonScope();
   rebind(ThemeServiceWithDB).toService(ThemeService);

   rebind(FrontendApplication).to(CustomFrontendApplication).inSingletonScope();
   rebind(ApplicationShellOptions).toConstantValue(<ApplicationShell.Options>{
      bottomPanel: {
         initialSizeRatio: 0.25 // default: 0.382
      }
   });

   rebind(GettingStartedPreferenceContribution).toConstantValue({ schema: welcomeAlwaysSchema });
   rebind(PreferenceContribution).toService(GettingStartedPreferenceContribution);

   bind(CustomWelcomeWidget).toSelf();

   bind(WidgetFactory)
      .toDynamicValue(ctx => ({
         id: GettingStartedWidget.ID,
         createWidget: () => ctx.container.get(CustomWelcomeWidget)
      }))
      .inSingletonScope();
});
