import { ApplicationShell, ApplicationShellOptions, FrontendApplication } from '@theia/core/lib/browser';
import { ContainerModule } from '@theia/core/shared/inversify';
import { ThemeServiceWithDB } from '@theia/monaco/lib/browser/monaco-indexed-db';
import { CustomFrontendApplication } from './frontend-application';
import { ThemeService } from './theme-service';

export default new ContainerModule((bind, _unbind, _isBound, rebind) => {
   bind(ThemeService).toSelf().inSingletonScope();
   rebind(ThemeServiceWithDB).toService(ThemeService);

   rebind(FrontendApplication).to(CustomFrontendApplication).inSingletonScope();
   rebind(ApplicationShellOptions).toConstantValue(<ApplicationShell.Options>{
      bottomPanel: {
         initialSizeRatio: 0.25 // default: 0.382
      }
   });
});
