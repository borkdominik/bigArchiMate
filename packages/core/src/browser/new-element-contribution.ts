/** ******************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { ModelService } from '@crossbreeze/model-service/lib/common';
import { ModelFileExtensions, ModelStructure, quote, toId } from '@crossbreeze/protocol';
import { Command, CommandContribution, CommandRegistry, MaybePromise, MenuContribution, MenuModelRegistry, URI, nls } from '@theia/core';
import { CommonMenus, DialogError, open } from '@theia/core/lib/browser';
import { TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { inject, injectable } from '@theia/core/shared/inversify';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { FileNavigatorContribution, NavigatorContextMenu } from '@theia/navigator/lib/browser/navigator-contribution';
import { WorkspaceCommandContribution } from '@theia/workspace/lib/browser/workspace-commands';
import { WorkspaceInputDialog } from '@theia/workspace/lib/browser/workspace-input-dialog';

const NEW_ELEMENT_NAV_MENU = [...NavigatorContextMenu.NAVIGATION, '0_new'];
const NEW_ELEMENT_MAIN_MENU = [...CommonMenus.FILE, '0_new'];

interface NewElementTemplate extends Command {
   label: string;
   fileExtension: string;
   content: string | ((name: string) => string);
}

const INITIAL_ELEMENT_CONTENT = `element:
   id: \${id}
   name: \${name}
   type: `;

const INITIAL_RELATION_CONTENT = `relation:
    id: \${id}
    type: 
    source: 
    target: `;

const INITIAL_ARCHIMATE_DIAGRAM_CONTENT = `archiMateDiagram:
   id: \${id}
   name: \${name}`;

const TEMPLATE_CATEGORY = 'New Element';

const NEW_ELEMENT_TEMPLATES: NewElementTemplate[] = [
   {
      id: 'crossbreeze.new.element',
      label: 'Element',
      fileExtension: ModelFileExtensions.Element,
      category: TEMPLATE_CATEGORY,
      iconClass: ModelStructure.Element.ICON_CLASS,
      content: name => INITIAL_ELEMENT_CONTENT.replace(/\$\{name\}/gi, quote(name)).replace(/\$\{id\}/gi, toId(name))
   },
   {
      id: 'crossbreeze.new.relation',
      label: 'Relation',
      fileExtension: ModelFileExtensions.Relation,
      category: TEMPLATE_CATEGORY,
      iconClass: ModelStructure.Relation.ICON_CLASS,
      content: name => INITIAL_RELATION_CONTENT.replace(/\$\{name\}/gi, quote(name)).replace(/\$\{id\}/gi, toId(name))
   },
   {
      id: 'crossbreeze.new.archimate-diagram',
      label: 'ArchiMateDiagram',
      fileExtension: ModelFileExtensions.ArchiMateDiagram,
      category: TEMPLATE_CATEGORY,
      iconClass: ModelStructure.ArchiMateDiagram.ICON_CLASS,
      content: name => INITIAL_ARCHIMATE_DIAGRAM_CONTENT.replace(/\$\{name\}/gi, quote(name)).replace(/\$\{id\}/gi, toId(name))
   }
];

const ID_REGEX = /^[_a-zA-Z@][\w_\-@/#]*$/; /* taken from the langium file, in newer Langium versions constants may be generated. */

@injectable()
export class CrossModelWorkspaceContribution extends WorkspaceCommandContribution implements MenuContribution, CommandContribution {
   @inject(ModelService) modelService: ModelService;

   override registerCommands(commands: CommandRegistry): void {
      super.registerCommands(commands);
      for (const template of NEW_ELEMENT_TEMPLATES) {
         commands.registerCommand(
            { ...template, label: template.label + '...' },
            this.newWorkspaceRootUriAwareCommandHandler({ execute: uri => this.createNewElementFile(uri, template) })
         );
      }
   }

   registerMenus(registry: MenuModelRegistry): void {
      // explorer context menu
      registry.registerSubmenu(NEW_ELEMENT_NAV_MENU, TEMPLATE_CATEGORY);
      for (const [id, template] of NEW_ELEMENT_TEMPLATES.entries()) {
         registry.registerMenuAction(NEW_ELEMENT_NAV_MENU, {
            commandId: template.id,
            label: template.label + '...',
            order: id.toString()
         });
      }

      // main menu bar
      registry.registerSubmenu(NEW_ELEMENT_MAIN_MENU, TEMPLATE_CATEGORY);
      for (const [id, template] of NEW_ELEMENT_TEMPLATES.entries()) {
         registry.registerMenuAction(NEW_ELEMENT_MAIN_MENU, {
            commandId: template.id,
            label: template.label + '...',
            order: id.toString()
         });
      }
   }

   protected async createNewElementFile(uri: URI, template: NewElementTemplate): Promise<void> {
      const parent = await this.getDirectory(uri);
      if (parent) {
         const parentUri = parent.resource;
         const dialog = new WorkspaceInputDialog(
            {
               title: 'New ' + template.label + '...',
               parentUri: parentUri,
               initialValue: 'New' + template.label,
               placeholder: 'New ' + template.label,
               validate: newName => this.validateElementFileName(newName, parent, template.fileExtension)
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

   protected validateElementFileName(name: string, parent: FileStat, fileExtension: string): MaybePromise<DialogError> {
      // default behavior for empty strings is like cancel
      if (!name) {
         return '';
      }
      // we automatically may name some part in the initial code after the given name so ensure it is an ID
      if (!ID_REGEX.test(name)) {
         return nls.localizeByDefault(`'${name}' is not a valid name, must match: ${ID_REGEX}.`);
      }
      // automatically apply file extension for better UX
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
export class CrossModelFileNavigatorContribution extends FileNavigatorContribution {
   override registerCommands(registry: CommandRegistry): void {
      super.registerCommands(registry);

      for (const template of NEW_ELEMENT_TEMPLATES) {
         registry.registerCommand(
            { ...template, label: undefined, id: template.id + '.toolbar' },
            {
               execute: (...args) => registry.executeCommand(template.id, ...args),
               isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
               isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
            }
         );
      }
   }

   override async registerToolbarItems(toolbarRegistry: TabBarToolbarRegistry): Promise<void> {
      super.registerToolbarItems(toolbarRegistry);

      for (const [id, template] of NEW_ELEMENT_TEMPLATES.entries()) {
         toolbarRegistry.registerItem({
            id: template.id + '.toolbar',
            command: template.id + '.toolbar',
            tooltip: 'New ' + template.label + '...',
            priority: 2,
            order: id.toString()
         });
      }
   }
}
