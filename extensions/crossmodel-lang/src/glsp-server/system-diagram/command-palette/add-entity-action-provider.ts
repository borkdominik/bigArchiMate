/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { AddEntityOperation } from '@crossbreeze/protocol';
import { EditorContext, LabeledAction } from '@eclipse-glsp/protocol';
import { ContextActionsProvider, ModelState, Point } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { codiconCSSString } from 'sprotty';
import { EntityNode } from '../../../language-server/generated/ast.js';
import { SystemModelState } from '../model/system-model-state.js';

/**
 * An action provider for the command palette (Ctrl+Space) to allow adding entities to an existing diagram.
 * Each action will trigger a 'AddEntityOperation' for the specific entity.
 */
@injectable()
export class SystemDiagramAddEntityActionProvider implements ContextActionsProvider {
   contextId = 'command-palette';

   @inject(ModelState) protected state!: SystemModelState;

   async getActions(editorContext: EditorContext): Promise<LabeledAction[]> {
      const completionItems = this.state.services.language.references.ScopeProvider.complete({
         container: { globalId: this.state.systemDiagram.id! },
         syntheticElements: [{ property: 'nodes', type: EntityNode }],
         property: 'entity'
      });
      return completionItems.map<LabeledAction>(item => ({
         label: item.label,
         actions: [AddEntityOperation.create(item.label, editorContext.lastMousePosition || Point.ORIGIN)],
         icon: codiconCSSString('inspect')
      }));
   }
}
