import { ModelService } from '@crossbreeze/model-service/lib/common';
import { codiconCSSString, concepts, getIcon, ModelFileExtensions, ModelStructure } from '@crossbreeze/protocol';
import { Emitter, MaybePromise } from '@theia/core';
import { DepthFirstTreeIterator, LabelProvider, LabelProviderContribution, Tree, TreeDecorator, TreeNode } from '@theia/core/lib/browser';
import { WidgetDecoration } from '@theia/core/lib/browser/widget-decoration';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { FileNode, FileStatNode } from '@theia/filesystem/lib/browser';

@injectable()
export class CrossModelLabelProvider implements LabelProviderContribution, TreeDecorator {
   id = 'CrossModelLabelProvider';

   @inject(LabelProvider) protected readonly labelProvider: LabelProvider;
   @inject(ModelService) protected readonly modelService: ModelService;

   protected readonly decorationsChangedEmitter = new Emitter();
   readonly onDidChangeDecorations = this.decorationsChangedEmitter.event;

   @postConstruct()
   protected init(): void {
      this.modelService.onReady(() => this.fireDidChangeDecorations(tree => this.collectDecorators(tree)));
      this.modelService.onSystemUpdate(() => this.fireDidChangeDecorations(tree => this.collectDecorators(tree)));
   }

   canHandle(element: object): number {
      return FileStatNode.is(element) ? 100 : 0;
   }

   getIcon(node: FileStatNode): string {
      if (this.isSystemDirectory(node.parent) && node.fileStat.name === ModelStructure.Element.FOLDER) {
         return ModelStructure.ArchiMateModel.ICON_CLASS + ' default-folder-icon';
      }

      if (FileNode.is(node)) {
         if (ModelFileExtensions.isArchiMateDiagramFile(node.fileStat.name)) {
            return ModelStructure.ArchiMateDiagram.ICON_CLASS + ' default-file-icon';
         }

         if (ModelFileExtensions.isElementFile(node.fileStat.name) || ModelFileExtensions.isJunctionFile(node.fileStat.name)) {
            // very simple name-based matching so we do not have to look into the file
            const matchingType = concepts.find(elementType => node.fileStat.resource.path.name.includes(elementType));
            if (matchingType) {
               return codiconCSSString(getIcon(matchingType)) + ' default-file-icon';
            }
         }
      }
      return this.labelProvider.getIcon(node.fileStat);
   }

   protected fireDidChangeDecorations(event: (tree: Tree) => Map<string, WidgetDecoration.Data>): void {
      this.decorationsChangedEmitter.fire(event);
   }

   decorations(tree: Tree): MaybePromise<Map<string, WidgetDecoration.Data>> {
      return this.collectDecorators(tree);
   }

   // Add workspace root as caption suffix and italicize if PreviewWidget
   protected collectDecorators(tree: Tree): Map<string, WidgetDecoration.Data> {
      const result = new Map<string, WidgetDecoration.Data>();
      if (tree.root === undefined) {
         return result;
      }
      for (const node of new DepthFirstTreeIterator(tree.root)) {
         if (FileStatNode.is(node) && this.isSystemDirectory(node)) {
            const decorations: WidgetDecoration.Data = {
               captionSuffixes: [{ data: this.isInArchiMateDirectory(node) ? 'ArchiMate Model' : 'System' }]
            };
            result.set(node.id, decorations);
         }
      }
      return result;
   }

   protected isSystemDirectory(node?: TreeNode): boolean {
      return (
         FileStatNode.is(node) &&
         node.fileStat.isDirectory &&
         this.modelService.systems.some(system => system.directory === node.fileStat.resource.path.fsPath())
      );
   }

   protected isInArchiMateDirectory(node?: TreeNode): boolean {
      if (node === undefined) {
         return false;
      }

      if (
         FileStatNode.is(node) &&
         FileStatNode.is(node.parent) &&
         node.parent.fileStat.isDirectory &&
         node.parent.fileStat.name === 'archimate-example'
      ) {
         return true;
      }

      return this.isInArchiMateDirectory(node.parent);
   }
}
