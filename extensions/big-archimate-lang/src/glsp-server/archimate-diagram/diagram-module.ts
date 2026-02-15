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
   ToolPaletteItemProvider
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { ArchiMateGModelIndex } from '../common/gmodel-index.js';
import { ArchiMateModelState } from '../common/model-state.js';
import { ArchiMateModelStorage } from '../common/model-storage.js';
import { ArchiMateModelSubmissionHandler } from '../common/model-submission-handler.js';
import { AddElementActionProvider } from './command-palette/add-element-action-provider.js';
import { ArchiMateContextMenuItemProvider } from './context-menu/context-menu-item-provider.js';
import { ArchiMateDiagramConfiguration } from './diagram-configuration.js';
import { AddElementOperationHandler } from './handler/add-element-operation-handler.js';
import { ApplyLabelEditOperationHandler } from './handler/apply-label-edit-operation-handler.js';
import { ChangeBoundsOperationHandler } from './handler/change-bounds-operation-handler.js';
import { ChangeRelationRoutingPointsOperationHandler } from './handler/change-relation-routing-points.js';
import { CreateElementOperationHandler } from './handler/create-element-operation-handler.js';
import { CreateJunctionOperationHandler } from './handler/create-junction-operation-handler.js';
import { CreateRelationOperationHandler } from './handler/create-relation-operation-handler.js';
import { DeleteOperationHandler } from './handler/delete-operation-handler.js';
import { DropElementOperationHandler } from './handler/drop-element-operation-handler.js';
import { ValidateRelationActionHandler } from './handler/validate-relation-action-handler.js';
import { ArchiMateDiagramGModelFactory } from './model/gmodel-factory.js';
import { ArchiMateToolPaletteProvider } from './tool-palette/tool-palette-provider.js';
import { ArchiMateMagicEdgeConnectorPaletteProvider } from './magic-edge-connector-palette/magic-edge-connector-palette-provider.js';

/**
 * Provides configuration about our archimate diagrams.
 */
@injectable()
export class ArchiMateDiagramModule extends DiagramModule {
   readonly diagramType = 'archimate-view';

   protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
      return ArchiMateDiagramConfiguration;
   }

   protected bindSourceModelStorage(): BindingTarget<SourceModelStorage> {
      return ArchiMateModelStorage;
   }

   protected override bindModelSubmissionHandler(): BindingTarget<ModelSubmissionHandler> {
      return ArchiMateModelSubmissionHandler;
   }

   protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
      super.configureOperationHandlers(binding);
      binding.add(ChangeBoundsOperationHandler); // move + resize behavior
      binding.add(CreateRelationOperationHandler); // create 1:1 relation
      binding.add(ChangeRelationRoutingPointsOperationHandler); // change routing points of a relation
      binding.add(DeleteOperationHandler); // delete elements
      binding.add(DropElementOperationHandler);
      binding.add(AddElementOperationHandler);
      binding.add(CreateElementOperationHandler);
      binding.add(CreateJunctionOperationHandler);
      binding.add(ApplyLabelEditOperationHandler);
   }

   protected override configureContextActionProviders(binding: MultiBinding<ContextActionsProvider>): void {
      super.configureContextActionProviders(binding);
      binding.add(AddElementActionProvider);
      binding.add(ArchiMateMagicEdgeConnectorPaletteProvider);
   }

   protected override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
      super.configureActionHandlers(binding);
      binding.rebind(RequestCheckEdgeActionHandler, ValidateRelationActionHandler);
   }

   protected override bindGModelIndex(): BindingTarget<GModelIndex> {
      return { service: ArchiMateGModelIndex };
   }

   protected bindModelState(): BindingTarget<ModelState> {
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
