import { BindingTarget, InstanceMultiBinding } from '@eclipse-glsp/server';
import {
   DefaultMcpDiagramModule,
   ElementTypesProvider,
   McpDiagramToolHandlerConstructor,
   McpLabelProvider,
   McpModelSerializer
} from '@eclipse-glsp/server-mcp';
import { ArchiMateElementTypesProvider } from './archimate-element-types-provider.js';
import { ArchiMateLayerSummaryMcpToolHandler } from './archimate-layer-summary-tool-handler.js';
import { ArchiMateMcpLabelProvider } from './archimate-mcp-label-provider.js';
import { ArchiMateMcpModelSerializer } from './archimate-mcp-model-serializer.js';

/**
 * ArchiMate-specific diagram-scope MCP module. Inherits the default MCP tool set
 * (session-info, query-elements, diagram-model, create-nodes, ...) and binds
 * ArchiMate-aware providers for element-type enumeration, label lookup, and
 * model serialization. Adds the archimate-layer-summary tool.
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

   protected override configureToolHandlers(binding: InstanceMultiBinding<McpDiagramToolHandlerConstructor>): void {
      super.configureToolHandlers(binding);
      binding.add(ArchiMateLayerSummaryMcpToolHandler);
   }
}
