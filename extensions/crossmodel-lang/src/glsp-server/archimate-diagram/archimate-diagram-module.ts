import {
   ActionHandlerConstructor,
   BindingTarget,
   ContextActionsProvider,
   ContextMenuItemProvider,
   DiagramConfiguration,
   DiagramModule,
   GModelFactory,
   GModelIndex,
   InstanceMultiBinding,
   ModelState,
   ModelSubmissionHandler,
   MultiBinding,
   OperationHandlerConstructor,
   RequestCheckEdgeActionHandler,
   SourceModelStorage,
   ToolPaletteItemProvider,
   bindAsService
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { CrossModelIndex } from '../common/cross-model-index.js';
import { CrossModelState } from '../common/cross-model-state.js';
import { CrossModelStorage } from '../common/cross-model-storage.js';
import { CrossModelSubmissionHandler } from '../common/cross-model-submission-handler.js';
import { ArchiMateDiagramConfiguration } from './archimate-diagram-configuration.js';
import { ArchiMateDiagramAddElementActionProvider } from './command-palette/add-element-action-provider.js';
import { ArchiMateContextMenuItemProvider } from './context-menu/context-menu-item-provider.js';
import { ArchiMateDiagramAddElementOperationHandler } from './handler/add-element-operation-handler.js';
import { ArchiMateDiagramApplyLabelEditOperationHandler } from './handler/apply-edit-operation-handler.js';
import { ArchiMateDiagramChangeBoundsOperationHandler } from './handler/change-bounds-operation-handler.js';
import { ArchiMateDiagramChangeRelationRoutingPointsOperationHandler } from './handler/change-relation-routing-points.js';
import { ArchiMateDiagramCreateElementOperationHandler } from './handler/create-element-operation-handler.js';
import { ArchiMateDiagramCreateJunctionOperationHandler } from './handler/create-junction-operation-handler.js';
import { ArchiMateDiagramCreateRelationOperationHandler } from './handler/create-relation-operation-handler.js';
import { ArchiMateDiagramDeleteOperationHandler } from './handler/delete-operation-handler.js';
import { ArchiMateDiagramDropElementOperationHandler } from './handler/drop-element-operation-handler.js';
import { ArchiMateDiagramValidateRelationActionHandler } from './handler/validate-relation-action-handler.js';
import { ArchiMateDiagramGModelFactory } from './model/archimate-diagram-gmodel-factory.js';
import { ArchiMateModelIndex } from './model/archimate-model-index.js';
import { ArchiMateModelState } from './model/archimate-model-state.js';
import { ArchiMateToolPaletteProvider } from './tool-palette/archimate-tool-palette-provider.js';

/**
 * Provides configuration about our archimate diagrams.
 */
@injectable()
export class ArchiMateDiagramModule extends DiagramModule {
   readonly diagramType = 'archimate-diagram';

   protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
      return ArchiMateDiagramConfiguration;
   }

   protected bindSourceModelStorage(): BindingTarget<SourceModelStorage> {
      return CrossModelStorage;
   }

   protected override bindModelSubmissionHandler(): BindingTarget<ModelSubmissionHandler> {
      return CrossModelSubmissionHandler;
   }

   protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
      super.configureOperationHandlers(binding);
      binding.add(ArchiMateDiagramChangeBoundsOperationHandler); // move + resize behavior
      binding.add(ArchiMateDiagramCreateRelationOperationHandler); // create 1:1 relation
      binding.add(ArchiMateDiagramChangeRelationRoutingPointsOperationHandler); // change routing points of a relation
      binding.add(ArchiMateDiagramDeleteOperationHandler); // delete elements
      binding.add(ArchiMateDiagramDropElementOperationHandler);
      binding.add(ArchiMateDiagramAddElementOperationHandler);
      binding.add(ArchiMateDiagramCreateElementOperationHandler);
      binding.add(ArchiMateDiagramCreateJunctionOperationHandler);
      binding.add(ArchiMateDiagramApplyLabelEditOperationHandler);
   }

   protected override configureContextActionProviders(binding: MultiBinding<ContextActionsProvider>): void {
      super.configureContextActionProviders(binding);
      binding.add(ArchiMateDiagramAddElementActionProvider);
   }

   protected override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
      super.configureActionHandlers(binding);
      binding.rebind(RequestCheckEdgeActionHandler, ArchiMateDiagramValidateRelationActionHandler);
   }

   protected override bindGModelIndex(): BindingTarget<GModelIndex> {
      bindAsService(this.context, CrossModelIndex, ArchiMateModelIndex);
      return { service: ArchiMateModelIndex };
   }

   protected bindModelState(): BindingTarget<ModelState> {
      bindAsService(this.context, CrossModelState, ArchiMateModelState);
      return { service: ArchiMateModelState };
   }

   protected bindGModelFactory(): BindingTarget<GModelFactory> {
      return ArchiMateDiagramGModelFactory;
   }

   protected override bindToolPaletteItemProvider(): BindingTarget<ToolPaletteItemProvider> | undefined {
      return ArchiMateToolPaletteProvider;
   }

   protected override bindContextMenuItemProvider(): BindingTarget<ContextMenuItemProvider> | undefined {
      return ArchiMateContextMenuItemProvider;
   }
}
