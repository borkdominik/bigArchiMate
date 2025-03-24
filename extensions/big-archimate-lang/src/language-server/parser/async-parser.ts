import { LangiumCoreServices } from 'langium';
import { WorkerThreadAsyncParser } from 'langium/node';

const workerUrl = __dirname + '/language-server/parser/worker-thread.cjs';

export class AsyncParser extends WorkerThreadAsyncParser {
   constructor(services: LangiumCoreServices) {
      super(services, workerUrl);
   }
}
