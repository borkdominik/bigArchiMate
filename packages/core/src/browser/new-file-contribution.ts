import { ModelService } from '@big-archimate/model-service/lib/common';
import {
   elementTypes,
   getLabel,
   getLayerElements,
   getObjectKeys,
   getSpecificationSection,
   layerTypes,
   ModelFileExtensions,
   ModelStructure,
   toId
} from '@big-archimate/protocol';
import { Command, CommandContribution, CommandRegistry, MaybePromise, MenuContribution, MenuModelRegistry, nls, URI } from '@theia/core';
import { CommonMenus, DialogError, open } from '@theia/core/lib/browser';
import { TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { inject, injectable } from '@theia/core/shared/inversify';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { FileNavigatorContribution, NavigatorContextMenu } from '@theia/navigator/lib/browser/navigator-contribution';
import { WorkspaceCommandContribution } from '@theia/workspace/lib/browser/workspace-commands';
import { WorkspaceInputDialog } from '@theia/workspace/lib/browser/workspace-input-dialog';

// Menu placement constants
const NAV_MENU_ADD_NEW = [...NavigatorContextMenu.NAVIGATION, '0_new'];
const MAIN_MENU_ADD_NEW = [...CommonMenus.FILE, '0_new'];

interface NewFileTemplate extends Command {
   label: string;
   fileExtension: string;
   content: string | ((name: string) => string);
}

const INITIAL_ARCHIMATE_VIEW_CONTENT = `diagram:
   id: \${id}`;

const INITIAL_ARCHIMATE_ELEMENT_CONTENT = `element:
   id: \${id}
   type: \${type}`;

const TEMPLATE_CATEGORY = 'New';

const NEW_VIEW_TEMPLATE: NewFileTemplate = {
   id: 'new.archimate-diagram',
   label: 'View',
   fileExtension: ModelFileExtensions.Diagram,
   category: TEMPLATE_CATEGORY,
   iconClass: ModelStructure.Diagram.ICON_CLASS,
   content: name => INITIAL_ARCHIMATE_VIEW_CONTENT.replace(/\$\{id\}/gi, toId(name))
};

// New constant for package.json content used when creating models.
const INITIAL_PACKAGE_JSON_CONTENT = `{
  "name": "\${name}",
  "version": "0.0.0"
}`;

// New model template definition.
const NEW_MODEL_TEMPLATE: NewFileTemplate = {
   id: 'new.model',
   label: 'Model',
   fileExtension: '',
   category: TEMPLATE_CATEGORY,
   iconClass: ModelStructure.ArchiMateModel.ICON_CLASS,
   content: name => INITIAL_PACKAGE_JSON_CONTENT.replace(/\$\{name\}/gi, name)
};

// Regular expression for validating names.
const ID_REGEX = /^[_a-zA-Z@][\w_\-@/#]*$/; /* taken from the langium file, in newer Langium versions constants may be generated. */

@injectable()
export class CustomWorkspaceCommandContribution extends WorkspaceCommandContribution implements MenuContribution, CommandContribution {
   @inject(ModelService) modelService: ModelService;

   override registerCommands(commands: CommandRegistry): void {
      super.registerCommands(commands);
      // Register view creation command.
      commands.registerCommand(
         { ...NEW_VIEW_TEMPLATE, label: NEW_VIEW_TEMPLATE.label + '...' },
         this.newWorkspaceRootUriAwareCommandHandler({ execute: uri => this.createNewFile(uri, NEW_VIEW_TEMPLATE) })
      );

      // Register element creation commands.
      elementTypes.forEach(elementType => {
         commands.registerCommand(
            { id: elementType, label: elementType + '...' },
            this.newWorkspaceRootUriAwareCommandHandler({
               execute: uri =>
                  this.createNewFile(uri, {
                     id: elementType,
                     label: elementType,
                     fileExtension: ModelFileExtensions.Element,
                     content: name =>
                        INITIAL_ARCHIMATE_ELEMENT_CONTENT.replace(/\$\{id\}/gi, toId(name)).replace(/\$\{type\}/gi, elementType)
                  })
            })
         );
      });
      // Register model creation command.
      commands.registerCommand(
         { ...NEW_MODEL_TEMPLATE, label: NEW_MODEL_TEMPLATE.label + '...' },
         this.newWorkspaceRootUriAwareCommandHandler({ execute: uri => this.createNewModel(uri, NEW_MODEL_TEMPLATE) })
      );
   }

   registerMenus(registry: MenuModelRegistry): void {
      // Explorer context menu
      registry.registerSubmenu(NAV_MENU_ADD_NEW, TEMPLATE_CATEGORY);

      registry.registerMenuAction(NAV_MENU_ADD_NEW, {
         commandId: NEW_MODEL_TEMPLATE.id,
         label: NEW_MODEL_TEMPLATE.label + '...',
         order: '-1'
      });

      registry.registerMenuAction(NAV_MENU_ADD_NEW, {
         commandId: NEW_VIEW_TEMPLATE.id,
         label: NEW_VIEW_TEMPLATE.label + '...',
         order: '0'
      });

      layerTypes.forEach((layerType, i) => {
         registry.registerSubmenu([...NAV_MENU_ADD_NEW, layerType], getLabel(layerType).replace('&', 'And'));
         getObjectKeys(getLayerElements(layerType)).forEach(elementType => {
            registry.registerMenuAction([...NAV_MENU_ADD_NEW, layerType], {
               commandId: elementType,
               label: getLabel(elementType) + '...',
               order: getSpecificationSection(elementType)
            });
         });
      });

      // Main menu
      registry.registerSubmenu(MAIN_MENU_ADD_NEW, TEMPLATE_CATEGORY);

      registry.registerMenuAction(MAIN_MENU_ADD_NEW, {
         commandId: NEW_MODEL_TEMPLATE.id,
         label: NEW_MODEL_TEMPLATE.label + '...',
         order: '-1'
      });

      registry.registerMenuAction(MAIN_MENU_ADD_NEW, {
         commandId: NEW_VIEW_TEMPLATE.id,
         label: NEW_VIEW_TEMPLATE.label + '...',
         order: '0'
      });

      layerTypes.forEach((layerType, i) => {
         registry.registerSubmenu([...MAIN_MENU_ADD_NEW, layerType], getLabel(layerType).replace('&', 'And'));
         getObjectKeys(getLayerElements(layerType)).forEach(elementType => {
            registry.registerMenuAction([...MAIN_MENU_ADD_NEW, layerType], {
               commandId: elementType,
               label: getLabel(elementType) + '...',
               order: getSpecificationSection(elementType)
            });
         });
      });
   }

   protected async createNewFile(uri: URI, template: NewFileTemplate): Promise<void> {
      const parent = await this.getDirectory(uri);
      if (parent) {
         const parentUri = parent.resource;
         const dialog = new WorkspaceInputDialog(
            {
               title: 'New ' + template.label + '...',
               parentUri: parentUri,
               initialValue: template.label,
               placeholder: template.label,
               validate: newName => this.customValidateFileName(newName, parent, template.fileExtension)
            },
            this.labelProvider
         );
         const name = await dialog.open();
         if (name) {
            const fileName = this.applyFileExtension(name, template.fileExtension);
            const baseFileName = this.removeFileExtension(name, template.fileExtension);
            const elementName = baseFileName.charAt(0).toUpperCase() + baseFileName.substring(1);
            const content = typeof template.content === 'string' ? template.content : template.content(elementName);
            const fileUri = parentUri.resolve(fileName);
            await this.fileService.create(fileUri, content);
            this.fireCreateNewFile({ parent: parentUri, uri: fileUri });
            open(this.openerService, fileUri);
         }
      }
   }

   protected async createNewModel(uri: URI, template: NewFileTemplate): Promise<void> {
      const parent = await this.getDirectory(uri);
      if (parent) {
         const parentUri = parent.resource;
         const dialog = new WorkspaceInputDialog(
            {
               title: 'New ' + template.label + '...',
               parentUri: parentUri,
               initialValue: template.label,
               placeholder: template.label,
               validate: newName => this.customValidateFileName(newName, parent, template.fileExtension)
            },
            this.labelProvider
         );
         const name = await dialog.open();
         if (name) {
            const modelUri = parentUri.resolve(name);
            await this.fileService.createFolder(modelUri);
            const packageFileUri = modelUri.resolve('package.json');
            const packageJsonContent = typeof template.content === 'string' ? template.content : template.content(name);
            await this.fileService.create(packageFileUri, packageJsonContent);

            const viewsFolderUri = modelUri.resolve('Views');
            await this.fileService.createFolder(viewsFolderUri);

            const viewFileName = `${name}.view.arch`;
            const viewFileUri = viewsFolderUri.resolve(viewFileName);
            const viewContent = INITIAL_ARCHIMATE_VIEW_CONTENT.replace(/\$\{id\}/gi, name);
            await this.fileService.create(viewFileUri, viewContent);

            this.fireCreateNewFile({ parent: parentUri, uri: modelUri });
            open(this.openerService, viewFileUri);
         }
      }
   }

   protected customValidateFileName(name: string, parent: FileStat, fileExtension: string): MaybePromise<DialogError> {
      // default behavior for empty strings is like cancel
      if (!name) {
         return '';
      }
      // we automatically may name some part in the initial code after the given name so ensure it is an ID
      if (!ID_REGEX.test(name)) {
         return nls.localizeByDefault(`'${name}' is not a valid name, must match: ${ID_REGEX}.`);
      }
      // automatically apply file extension for better UX (for files; folders have an empty extension)
      return this.validateFileName(this.applyFileExtension(name, fileExtension), parent, true);
   }

   protected applyFileExtension(name: string, fileExtension: string): string {
      return name.endsWith(fileExtension) ? name : name + fileExtension;
   }

   protected removeFileExtension(name: string, fileExtension: string): string {
      return name.endsWith(fileExtension) ? name.slice(0, -fileExtension.length) : name;
   }
}

@injectable()
export class CustomFileNavigatorContribution extends FileNavigatorContribution {
   override registerCommands(registry: CommandRegistry): void {
      super.registerCommands(registry);

      registry.registerCommand(
         { ...NEW_VIEW_TEMPLATE, label: undefined, id: NEW_VIEW_TEMPLATE.id + '.toolbar' },
         {
            execute: (...args) => registry.executeCommand(NEW_VIEW_TEMPLATE.id, ...args),
            isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
            isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
         }
      );

      registry.registerCommand(
         { ...NEW_MODEL_TEMPLATE, label: undefined, id: NEW_MODEL_TEMPLATE.id + '.toolbar' },
         {
            execute: (...args) => registry.executeCommand(NEW_MODEL_TEMPLATE.id, ...args),
            isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
            isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
         }
      );
   }

   override async registerToolbarItems(toolbarRegistry: TabBarToolbarRegistry): Promise<void> {
      await super.registerToolbarItems(toolbarRegistry);

      toolbarRegistry.registerItem({
         id: NEW_VIEW_TEMPLATE.id + '.toolbar',
         command: NEW_VIEW_TEMPLATE.id + '.toolbar',
         tooltip: NEW_VIEW_TEMPLATE.label + '...',
         priority: 2,
         order: '0'
      });

      toolbarRegistry.registerItem({
         id: NEW_MODEL_TEMPLATE.id + '.toolbar',
         command: NEW_MODEL_TEMPLATE.id + '.toolbar',
         tooltip: NEW_MODEL_TEMPLATE.label + '...',
         priority: 2,
         order: '-1'
      });
   }
}
