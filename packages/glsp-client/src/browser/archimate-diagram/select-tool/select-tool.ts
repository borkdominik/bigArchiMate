import { GLSPMouseTool, RankedSelectMouseListener, Tool } from '@eclipse-glsp/client';
import { inject, injectable } from '@theia/core/shared/inversify';

@injectable()
export class ArchiMateSelectTool implements Tool {
   static ID = 'tool_archimate_select';

   id = ArchiMateSelectTool.ID;
   isEditTool = false;

   @inject(GLSPMouseTool) protected mouseTool: GLSPMouseTool;
   @inject(RankedSelectMouseListener) protected listener: RankedSelectMouseListener;

   enable(): void {
      this.mouseTool.registerListener(this.listener);
   }

   disable(): void {
      this.mouseTool.deregister(this.listener);
   }
}
