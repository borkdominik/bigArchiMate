import { codiconCSSString } from './util';

const ModelFileTypeValues = {
   Element: 'Element',
   Junction: 'Junction',
   Relation: 'Relation',
   Diagram: 'Diagram'
} as const;

export const ModelFileType = {
   ...ModelFileTypeValues,
   getIconClass: (type: ModelFileType) => {
      switch (type) {
         case 'Diagram':
            return ModelStructure.Diagram.ICON_CLASS;
         default:
            return undefined;
      }
   },
   getFileExtension(type: ModelFileType): string | undefined {
      switch (type) {
         case 'Element':
            return ModelFileExtensions.Element;
         case 'Junction':
            return ModelFileExtensions.Junction;
         case 'Relation':
            return ModelFileExtensions.Relation;
         case 'Diagram':
            return ModelFileExtensions.Diagram;
      }
   }
} as const;
export type ModelFileType = (typeof ModelFileTypeValues)[keyof typeof ModelFileTypeValues];

export const ModelFileExtensions = {
   Element: '.element.arch',
   Junction: '.junction.arch',
   Relation: '.relation.arch',
   Diagram: '.view.arch',

   isElementFile(uri: string): boolean {
      return uri.endsWith(this.Element);
   },

   isJunctionFile(uri: string): boolean {
      return uri.endsWith(this.Junction);
   },

   isRelationFile(uri: string): boolean {
      return uri.endsWith(this.Relation);
   },

   isDiagramFile(uri: string): boolean {
      return uri.endsWith(this.Diagram);
   },

   getName(uri: string): string {
      // since we have file extensions with two '.', we cannot use the default implementation that only works for one '.'
      if (uri.endsWith(this.Element)) {
         return uri.substring(0, uri.length - this.Element.length);
      }
      if (uri.endsWith(this.Relation)) {
         return uri.substring(0, uri.length - this.Relation.length);
      }
      if (uri.endsWith(this.Diagram)) {
         return uri.substring(0, uri.length - this.Diagram.length);
      }
      const lastIndex = uri.lastIndexOf('/');
      const extIndex = uri.lastIndexOf('.');
      return uri.substring(lastIndex + 1, extIndex);
   },

   getFileType(uri: string): ModelFileType | undefined {
      if (this.isElementFile(uri)) {
         return 'Element';
      }
      if (this.isJunctionFile(uri)) {
         return 'Junction';
      }
      if (this.isRelationFile(uri)) {
         return 'Relation';
      }
      if (this.isDiagramFile(uri)) {
         return 'Diagram';
      }
      return undefined;
   },

   getFileExtension(uri: string): string | undefined {
      const fileType = this.getFileType(uri);
      return !fileType ? undefined : ModelFileType.getFileExtension(fileType);
   },

   getIconClass(uri: string): string | undefined {
      const fileType = this.getFileType(uri);
      if (!fileType) {
         return undefined;
      }
      switch (fileType) {
         case 'Diagram':
            return ModelStructure.Diagram.ICON_CLASS;
         default:
            return '';
      }
   },

   detectFileType(content: string): ModelFileType | undefined {
      if (content.startsWith('element')) {
         return 'Element';
      }
      if (content.startsWith('junction')) {
         return 'Junction';
      }
      if (content.startsWith('relation')) {
         return 'Relation';
      }
      if (content.startsWith('diagram')) {
         return 'Diagram';
      }
      return undefined;
   },

   detectFileExtension(content: string): string | undefined {
      const type = this.detectFileType(content);
      return type ? this.detectFileExtension(type) : undefined;
   }
} as const;

export const ModelStructure = {
   ArchiMateModel: {
      ICON_CLASS: codiconCSSString('list-tree')
   },

   Diagram: {
      ICON_CLASS: codiconCSSString('type-hierarchy-sub'),
      folderName: 'Views'
   },

   Relation: {
      folderName: 'Relations'
   }
};
