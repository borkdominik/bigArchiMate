import { BindingTarget } from '@eclipse-glsp/server';
import {
   DefaultMcpDiagramModule,
   ElementTypesProvider,
   McpLabelProvider,
   McpModelSerializer
} from '@eclipse-glsp/server-mcp';
import { ArchiMateElementTypesProvider } from './archimate-element-types-provider.js';
import { ArchiMateMcpLabelProvider } from './archimate-mcp-label-provider.js';
import { ArchiMateMcpModelSerializer } from './archimate-mcp-model-serializer.js';

/**
 * ArchiMate-specific diagram-scope MCP module. Inherits the default MCP tool set
 * (session-info, query-elements, diagram-model, create-nodes, ...) and binds
 * ArchiMate-aware providers for element-type enumeration, label lookup, and
 * model serialization.
 */
export class ArchiMateMcpDiagramModule extends DefaultMcpDiagramModule {
   protected override bindElementTypesProvider(): BindingTarget<ElementTypesProvider> {
      return ArchiMateElementTypesProvider;
   }

   protected override bindLabelProvider(): BindingTarget<McpLabelProvider> {
      return ArchiMateMcpLabelProvider;
   }

   protected override bindModelSerializer(): BindingTarget<McpModelSerializer> {
      return ArchiMateMcpModelSerializer;
   }
}
