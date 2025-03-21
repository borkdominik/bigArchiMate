import { Property } from '@big-archimate/protocol';
import { DispatchAction, ModelAction, ModelState, moveDown, moveUp, undefinedIfEmpty } from './ModelReducer';

export interface JunctionChangeNameAction extends ModelAction {
   type: 'junction:change-name';
   name: string;
}

export interface JunctionChangeDocumentationAction extends ModelAction {
   type: 'junction:change-documentation';
   documentation: string;
}

export interface PropertyUpdateAction extends ModelAction {
   type: 'junction:property:update';
   propertyIdx: number;
   property: Property;
}

export interface PropertyAddEmptyAction extends ModelAction {
   type: 'junction:property:add-property';
   property: Property;
}

export interface PropertyMoveUpAction extends ModelAction {
   type: 'junction:property:move-property-up';
   propertyIdx: number;
}

export interface PropertyMoveDownAction extends ModelAction {
   type: 'junction:property:move-property-down';
   propertyIdx: number;
}

export interface PropertyDeleteAction extends ModelAction {
   type: 'junction:property:delete-property';
   propertyIdx: number;
}

export type JunctionDispatchAction =
   | JunctionChangeNameAction
   | JunctionChangeDocumentationAction
   | PropertyUpdateAction
   | PropertyAddEmptyAction
   | PropertyMoveUpAction
   | PropertyMoveDownAction
   | PropertyDeleteAction;

export function isJunctionDispatchAction(action: DispatchAction): action is JunctionDispatchAction {
   return action.type.startsWith('junction:');
}

export function JunctionModelReducer(state: ModelState, action: JunctionDispatchAction): ModelState {
   const junction = state.model.junction;
   if (junction === undefined) {
      throw Error('Model error: Junction action applied on undefined junction');
   }

   state.reason = action.type;

   switch (action.type) {
      case 'junction:change-name':
         junction.name = undefinedIfEmpty(action.name);
         break;

      case 'junction:change-documentation':
         junction.documentation = undefinedIfEmpty(action.documentation);
         break;

      case 'junction:property:update':
         junction.properties[action.propertyIdx] = {
            ...action.property,
            name: undefinedIfEmpty(action.property.name),
            value: undefinedIfEmpty(action.property.value)
         };
         break;

      case 'junction:property:add-property':
         junction.properties.push(action.property);
         break;

      case 'junction:property:delete-property':
         junction.properties.splice(action.propertyIdx, 1);
         break;

      case 'junction:property:move-property-up':
         moveUp(junction.properties, action.propertyIdx);
         break;

      case 'junction:property:move-property-down':
         moveDown(junction.properties, action.propertyIdx);
         break;
   }
   return state;
}
