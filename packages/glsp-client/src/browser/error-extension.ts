import { ERRONEOUS_MODEL } from '@big-archimate/protocol';
import { createEditorError } from '@big-archimate/react-model-ui/lib/views/common/EditorError';
import { EditorContextService, GLSPAbstractUIExtension } from '@eclipse-glsp/client';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { createRoot } from '@theia/core/shared/react-dom/client';

@injectable()
export class ErrorExtension extends GLSPAbstractUIExtension {
   static readonly ID = 'error-extension';

   @inject(EditorContextService)
   protected editorContext: EditorContextService;

   id(): string {
      return ErrorExtension.ID;
   }

   override containerClass(): string {
      return 'error-extension';
   }

   @postConstruct()
   protected init(): void {
      this.handleEditMode();
      this.editorContext.onEditModeChanged(() => this.handleEditMode());
   }

   protected override initializeContents(containerElement: HTMLElement): void {
      const errorRoot = createRoot(containerElement);
      errorRoot.render(createEditorError(ERRONEOUS_MODEL));
   }

   handleEditMode(): void {
      if (this.editorContext.isReadonly) {
         this.show(this.editorContext.modelRoot);
      } else {
         this.hide();
      }
   }
}
