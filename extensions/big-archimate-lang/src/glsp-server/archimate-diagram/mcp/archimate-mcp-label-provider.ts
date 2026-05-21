import { DefaultMcpLabelProvider } from '@eclipse-glsp/server-mcp';
import { injectable } from 'inversify';

@injectable()
export class ArchiMateMcpLabelProvider extends DefaultMcpLabelProvider {
   // Inherits default behavior; override getLabel() once ArchiMate-specific
   // label structures (e.g., layer/type prefixes) need to surface to the LLM.
}
