import { SelectableTreeNode } from '@theia/core/lib/browser';
import { injectable, interfaces } from '@theia/core/shared/inversify';
import { FileNavigatorWidget } from '@theia/navigator/lib/browser';
import { createFileNavigatorContainer } from '@theia/navigator/lib/browser/navigator-container';

@injectable()
export class CustomFileNavigatorWidget extends FileNavigatorWidget {
   protected override toContextMenuArgs(node: SelectableTreeNode): any[] | undefined {
      const uris = this.model.selectedFileStatNodes.map(selected => selected.uri);
      if (uris.length > 0) {
         return uris;
      }
      return super.toContextMenuArgs(node);
   }
}

export function createCrossModelFileNavigatorWidget(parent: interfaces.Container): FileNavigatorWidget {
   const child = createFileNavigatorContainer(parent);
   child.bind(CustomFileNavigatorWidget).toSelf().inSingletonScope();
   child.rebind(FileNavigatorWidget).toService(CustomFileNavigatorWidget);
   return child.get(FileNavigatorWidget);
}
