import { MarkdownMcpModelSerializer } from '@eclipse-glsp/server-mcp';
import { injectable } from 'inversify';

/**
 * Subclasses MarkdownMcpModelSerializer (no overrides) so MCP serialization runs
 * the default Markdown pipeline without triggering the framework's "bare generic
 * default" warning. Override the serialize* hooks once ArchiMate-specific layer
 * grouping or relationship rendering is needed.
 */
@injectable()
export class ArchiMateMcpModelSerializer extends MarkdownMcpModelSerializer {}
