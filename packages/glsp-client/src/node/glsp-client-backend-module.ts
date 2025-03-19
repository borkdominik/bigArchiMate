import { ConnectionHandler } from '@theia/core';
import { ConnectionContainerModule } from '@theia/core/lib/node/messaging/connection-container-module';
import { ContainerModule } from '@theia/core/shared/inversify/index';
import { DiagramConnectionHandler } from './diagram-connection-handler';

const frontendScopedConnectionModule = ConnectionContainerModule.create(({ bind }) => {
   bind(DiagramConnectionHandler).toSelf().inSingletonScope();
   bind(ConnectionHandler)
      .toDynamicValue(context => context.container.get(DiagramConnectionHandler))
      .inSingletonScope();
});

export default new ContainerModule(bind => {
   bind(ConnectionContainerModule).toConstantValue(frontendScopedConnectionModule);
});
