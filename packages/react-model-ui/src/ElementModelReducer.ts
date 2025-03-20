import { Property } from '@big-archimate/protocol';
import { DispatchAction, ModelAction, ModelState, moveDown, moveUp, undefinedIfEmpty } from './ModelReducer';

export interface ElementChangeNameAction extends ModelAction {
   type: 'element:change-name';
   name: string;
}

export interface ElementChangeDocumentationAction extends ModelAction {
   type: 'element:change-documentation';
   documentation: string;
}

export interface PropertyUpdateAction extends ModelAction {
   type: 'element:property:update';
   propertyIdx: number;
   property: Property;
}

export interface PropertyAddEmptyAction extends ModelAction {
   type: 'element:property:add-property';
   property: Property;
}

export interface PropertyMoveUpAction extends ModelAction {
   type: 'element:property:move-property-up';
   propertyIdx: number;
}

export interface PropertyMoveDownAction extends ModelAction {
   type: 'element:property:move-property-down';
   propertyIdx: number;
}

export interface PropertyDeleteAction extends ModelAction {
   type: 'element:property:delete-property';
   propertyIdx: number;
}

export type ElementDispatchAction =
   | ElementChangeNameAction
   | ElementChangeDocumentationAction
   | PropertyUpdateAction
   | PropertyAddEmptyAction
   | PropertyMoveUpAction
   | PropertyMoveDownAction
   | PropertyDeleteAction;

export function isElementDispatchAction(action: DispatchAction): action is ElementDispatchAction {
   return action.type.startsWith('element:');
}

export function ElementModelReducer(state: ModelState, action: ElementDispatchAction): ModelState {
   const element = state.model.element;
   if (element === undefined) {
      throw Error('Model error: Element action applied on undefined element');
   }

   state.reason = action.type;

   switch (action.type) {
      case 'element:change-name':
         element.name = undefinedIfEmpty(action.name);
         break;

      case 'element:change-documentation':
         element.documentation = undefinedIfEmpty(action.documentation);
         break;

      case 'element:property:update':
         element.properties[action.propertyIdx] = {
            ...action.property,
            name: undefinedIfEmpty(action.property.name),
            value: undefinedIfEmpty(action.property.value)
         };
         break;

      case 'element:property:add-property':
         element.properties.push(action.property);
         break;

      case 'element:property:delete-property':
         element.properties.splice(action.propertyIdx, 1);
         break;

      case 'element:property:move-property-up':
         moveUp(element.properties, action.propertyIdx);
         break;

      case 'element:property:move-property-down':
         moveDown(element.properties, action.propertyIdx);
         break;
   }
   return state;
}
