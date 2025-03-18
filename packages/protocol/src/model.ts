/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/

const ModelFileTypeValues = {
   Generic: 'Generic',
   Element: 'Element',
   Junctin: 'Junction',
   Relation: 'Relation',
   ArchiMateDiagram: 'ArchiMateDiagram'
} as const;

export const ModelFileType = {
   ...ModelFileTypeValues,
   getIconClass: (type: ModelFileType) => {
      switch (type) {
         case 'Element':
            return ModelStructure.Element.ICON_CLASS;
         case 'Junction':
            return ModelStructure.Junction.ICON_CLASS;
         case 'Relation':
            return ModelStructure.Relation.ICON_CLASS;
         case 'ArchiMateDiagram':
            return ModelStructure.ArchiMateDiagram.ICON_CLASS;
         default:
            return undefined;
      }
   },
   getFileExtension(type: ModelFileType): string | undefined {
      switch (type) {
         case 'Generic':
            return ModelFileExtensions.Generic;
         case 'Element':
            return ModelFileExtensions.Element;
         case 'Junction':
            return ModelFileExtensions.Junction;
         case 'Relation':
            return ModelFileExtensions.Relation;
         case 'ArchiMateDiagram':
            return ModelFileExtensions.ArchiMateDiagram;
      }
   }
} as const;
export type ModelFileType = (typeof ModelFileTypeValues)[keyof typeof ModelFileTypeValues];

export const ModelFileExtensions = {
   Generic: '.arch',
   Element: '.element.arch',
   Junction: '.junction.arch',
   Relation: '.relation.arch',
   ArchiMateDiagram: '.view.arch',

   isModelFile(uri: string): boolean {
      return uri.endsWith(this.Generic);
   },

   isElementFile(uri: string): boolean {
      return uri.endsWith(this.Element);
   },

   isJunctionFile(uri: string): boolean {
      return uri.endsWith(this.Junction);
   },

   isRelationFile(uri: string): boolean {
      return uri.endsWith(this.Relation);
   },

   isArchiMateDiagramFile(uri: string): boolean {
      return uri.endsWith(this.ArchiMateDiagram);
   },

   getName(uri: string): string {
      // since we have file extensions with two '.', we cannot use the default implementation that only works for one '.'
      if (uri.endsWith(this.Element)) {
         return uri.substring(0, uri.length - this.Element.length);
      }
      if (uri.endsWith(this.Relation)) {
         return uri.substring(0, uri.length - this.Relation.length);
      }
      if (uri.endsWith(this.ArchiMateDiagram)) {
         return uri.substring(0, uri.length - this.ArchiMateDiagram.length);
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
      if (this.isArchiMateDiagramFile(uri)) {
         return 'ArchiMateDiagram';
      }
      if (this.isModelFile(uri)) {
         return 'Generic';
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
         case 'Element':
            return ModelStructure.Element.ICON_CLASS;
         case 'Junction':
            return ModelStructure.Junction.ICON_CLASS;
         case 'Relation':
            return ModelStructure.Relation.ICON_CLASS;
         case 'ArchiMateDiagram':
            return ModelStructure.ArchiMateDiagram.ICON_CLASS;
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
      if (content.startsWith('archiMateDiagram')) {
         return 'ArchiMateDiagram';
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
      ICON_CLASS: 'codicon codicon-globe',
      ICON: 'globe'
   },

   Element: {
      FOLDER: 'Elements',
      ICON_CLASS: 'codicon codicon-git-commit',
      ICON: 'git-commit'
   },

   Junction: {
      FOLDER: 'Other',
      ICON_CLASS: 'codicon codicon-git-compare',
      ICON: 'git-compare'
   },

   Relation: {
      FOLDER: 'Relations',
      ICON_CLASS: 'codicon codicon-git-compare',
      ICON: 'git-compare'
   },

   ArchiMateDiagram: {
      FOLDER: 'Views',
      ICON_CLASS: 'codicon codicon-type-hierarchy-sub',
      ICON: 'type-hierarchy-sub'
   }
};
