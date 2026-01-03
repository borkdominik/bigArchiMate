import { Action, Operation, Point, hasArrayProp, hasObjectProp, hasStringProp, TriggerEdgeCreationAction } from '@eclipse-glsp/protocol';

export interface DropElementOperation extends Operation {
   kind: typeof DropElementOperation.KIND;

   /** Insert position for dropped elements. */
   position: Point;
   /** List of file paths that contain elements to be added.  */
   filePaths: string[];
}

export namespace DropElementOperation {
   export const KIND = 'dropElementOperation';

   export function is(object: any): object is DropElementOperation {
      return Operation.hasKind(object, KIND) && hasArrayProp(object, 'filePaths') && hasObjectProp(object, 'position');
   }

   export function create(filePaths: string[], position: Point): DropElementOperation {
      return {
         kind: KIND,
         isOperation: true,
         filePaths,
         position
      };
   }
}

export interface AddElementOperation extends Operation {
   kind: typeof AddElementOperation.KIND;

   /** Insert position for dropped element. */
   position: Point;
   /** Name of the element to be added. */
   elementName: string;
}

export namespace AddElementOperation {
   export const KIND = 'addElementOperation';

   export function is(object: any): object is AddElementOperation {
      return Operation.hasKind(object, KIND) && hasStringProp(object, 'elementName') && hasObjectProp(object, 'position');
   }

   export function create(elementName: string, position: Point): AddElementOperation {
      return {
         kind: KIND,
         isOperation: true,
         elementName,
         position
      };
   }
}

// Copy definitions from (default) client-local glsp tool actions that we want to send from the server as well
export interface EnableToolsAction extends Action {
   kind: typeof EnableToolsAction.KIND;
   toolIds: string[];
}

export namespace EnableToolsAction {
   export const KIND = 'enable-tools';

   export function is(object: unknown): object is EnableToolsAction {
      return Action.hasKind(object, KIND) && hasArrayProp(object, 'toolIds');
   }

   export function create(toolIds: string[]): EnableToolsAction {
      return {
         kind: KIND,
         toolIds
      };
   }
}

/**
 * Action to disable the currently active tools and enable the default tools instead.
 */
export interface EnableDefaultToolsAction extends Action {
   kind: typeof EnableDefaultToolsAction.KIND;
}

export namespace EnableDefaultToolsAction {
   export const KIND = 'enable-default-tools';

   export function is(object: unknown): object is EnableToolsAction {
      return Action.hasKind(object, KIND);
   }

   export function create(): EnableDefaultToolsAction {
      return {
         kind: KIND
      };
   }
}

/**
 * Action to set the visibility state of the UI extension with the specified `id`.
 */
export interface SetUIExtensionVisibilityAction extends Action {
   kind: typeof SetUIExtensionVisibilityAction.KIND;
   extensionId: string;
   visible: boolean;
   contextElementsId: string[];
}

export namespace SetUIExtensionVisibilityAction {
   export const KIND = 'setUIExtensionVisibility';

   export function create(options: {
      extensionId: string;
      visible: boolean;
      contextElementsId?: string[];
   }): SetUIExtensionVisibilityAction {
      return {
         kind: KIND,
         extensionId: options.extensionId,
         visible: options.visible,
         contextElementsId: options.contextElementsId ?? []
      };
   }
}

export function activateDefaultToolsAction(): Action {
   return EnableDefaultToolsAction.create();
}

export function activateDeleteToolAction(): Action {
   return EnableToolsAction.create(['glsp.delete-mouse']);
}

export function activateMagicConnectorToolAction(): Action {
   return TriggerEdgeCreationAction.create(
      'magic-connector-edge', // Proxy-Edge-Type
      { args: { mode: 'magic' } }
   );
}
