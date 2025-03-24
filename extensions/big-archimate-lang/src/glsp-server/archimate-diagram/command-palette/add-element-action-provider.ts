import { AddElementOperation, codiconCSSString } from '@big-archimate/protocol';
import { ContextActionsProvider, EditorContext, LabeledAction, ModelState, Point } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ElementNode } from '../../../language-server/generated/ast.js';
import { ArchiMateModelState } from '../../common/model-state.js';

/**
 * An action provider for the command palette (Ctrl+Space) to allow adding elements to an existing diagram.
 * Each action will trigger a 'AddElementOperation' for the specific element.
 */
@injectable()
export class AddElementActionProvider implements ContextActionsProvider {
   contextId = 'command-palette';

   @inject(ModelState) protected state!: ArchiMateModelState;

   async getActions(editorContext: EditorContext): Promise<LabeledAction[]> {
      const completionItems = this.state.services.language.references.ScopeProvider.complete({
         container: { globalId: this.state.diagram.id! },
         syntheticElements: [{ property: 'nodes', type: ElementNode }],
         property: 'element'
      });
      return completionItems.map<LabeledAction>(item => ({
         label: item.label,
         actions: [AddElementOperation.create(item.label, editorContext.lastMousePosition || Point.ORIGIN)],
         icon: codiconCSSString('inspect')
      }));
   }
}
