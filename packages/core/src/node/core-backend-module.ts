import { EnvVariablesServer } from '@theia/core/lib/common/env-variables/env-variables-protocol';
import { ContainerModule } from '@theia/core/shared/inversify';

export default new ContainerModule((bind, _unbind, _isBound, rebind) => {
   bind(EnvVariablesServer).toSelf().inSingletonScope();
   rebind(EnvVariablesServer).toService(EnvVariablesServer);
});
