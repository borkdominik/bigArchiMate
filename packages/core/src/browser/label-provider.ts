import { ModelService } from '@big-archimate/model-service/lib/common';
import {
   codiconCSSString,
   elementTypes,
   getIcon,
   junctionTypes,
   ModelFileExtensions,
   ModelStructure,
   relationTypes
} from '@big-archimate/protocol';
import { Emitter, MaybePromise } from '@theia/core';
import { DepthFirstTreeIterator, LabelProvider, LabelProviderContribution, Tree, TreeDecorator, TreeNode } from '@theia/core/lib/browser';
import { WidgetDecoration } from '@theia/core/lib/browser/widget-decoration';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { FileNode, FileStatNode } from '@theia/filesystem/lib/browser';

@injectable()
export class CustomLabelProvider implements LabelProviderContribution, TreeDecorator {
   id = 'CustomLabelProvider';

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
      if (this.isSystemDirectory(node)) {
         return ModelStructure.ArchiMateModel.ICON_CLASS + ' default-folder-icon';
      }

      if (FileNode.is(node)) {
         if (ModelFileExtensions.isDiagramFile(node.fileStat.name)) {
            return ModelStructure.Diagram.ICON_CLASS + ' default-file-icon';
         }

         // very simple name-based matching so we do not have to look into the file

         if (ModelFileExtensions.isElementFile(node.fileStat.name)) {
            const derivedElementTypeFromFileName = node.fileStat.resource.path.name.split('.')[0].replace(/\d+$/, '');
            const matchingType = elementTypes.find(elementType => derivedElementTypeFromFileName === elementType);
            if (matchingType) {
               return codiconCSSString(getIcon(matchingType)) + ' default-file-icon';
            }
         }

         if (ModelFileExtensions.isRelationFile(node.fileStat.name)) {
            const derivedRelationTypeFromFileName = node.fileStat.resource.path.name.split('.')[0].split('_')[0];
            const matchingType = relationTypes.find(relationType => derivedRelationTypeFromFileName === relationType);
            if (matchingType) {
               return codiconCSSString(getIcon(matchingType)) + ' default-file-icon';
            }
         }

         if (ModelFileExtensions.isJunctionFile(node.fileStat.name)) {
            const derivedJunctionTypeFromFileName = node.fileStat.resource.path.name.split('.')[0].split('_')[0];
            const matchingType = junctionTypes.find(junctionType => derivedJunctionTypeFromFileName === junctionType);
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
               captionSuffixes: [{ data: 'ArchiMate Model' }]
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
}
