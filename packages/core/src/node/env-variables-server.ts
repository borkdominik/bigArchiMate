import { FileUri } from '@theia/core/lib/common/file-uri';
import { EnvVariablesServerImpl } from '@theia/core/lib/node/env-variables';
import { injectable } from 'inversify';
import { homedir } from 'os';
import * as path from 'path';

@injectable()
export class EnvVariablesServer extends EnvVariablesServerImpl {
   // do not use the default configuration directory of Theia (<home>/.theia) but instead use our own
   // to avoid any conflicts and allow for easier customizations
   protected readonly _configDirUri: string = FileUri.create(path.join(homedir(), '.big-archimate')).toString(true);

   override async getConfigDirUri(): Promise<string> {
      return this._configDirUri;
   }
}
