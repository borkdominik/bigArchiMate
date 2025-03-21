import { Property } from '@big-archimate/protocol';
import { DispatchAction, ModelAction, ModelState, moveDown, moveUp, undefinedIfEmpty } from './ModelReducer';

export interface RelationshipChangeNameAction extends ModelAction {
   type: 'relationship:change-name';
   name: string;
}

export interface RelationshipChangeDocumentationAction extends ModelAction {
   type: 'relationship:change-documentation';
   documentation: string;
}

export interface PropertyUpdateAction extends ModelAction {
   type: 'relationship:property:update';
   propertyIdx: number;
   property: Property;
}

export interface PropertyAddEmptyAction extends ModelAction {
   type: 'relationship:property:add-property';
   property: Property;
}

export interface PropertyMoveUpAction extends ModelAction {
   type: 'relationship:property:move-property-up';
   propertyIdx: number;
}

export interface PropertyMoveDownAction extends ModelAction {
   type: 'relationship:property:move-property-down';
   propertyIdx: number;
}

export interface PropertyDeleteAction extends ModelAction {
   type: 'relationship:property:delete-property';
   propertyIdx: number;
}

export type RelationshipDispatchAction =
   | RelationshipChangeNameAction
   | RelationshipChangeDocumentationAction
   | PropertyUpdateAction
   | PropertyAddEmptyAction
   | PropertyMoveUpAction
   | PropertyMoveDownAction
   | PropertyDeleteAction;

export function isRelationshipDispatchAction(action: DispatchAction): action is RelationshipDispatchAction {
   return action.type.startsWith('relationship:');
}

export function RelationshipModelReducer(state: ModelState, action: RelationshipDispatchAction): ModelState {
   const relationship = state.model.relationship;
   if (relationship === undefined) {
      throw Error('Model error: Relationship action applied on undefined relationship');
   }

   state.reason = action.type;

   switch (action.type) {
      case 'relationship:change-name':
         relationship.name = undefinedIfEmpty(action.name);
         break;

      case 'relationship:change-documentation':
         relationship.documentation = undefinedIfEmpty(action.documentation);
         break;

      case 'relationship:property:update':
         relationship.properties[action.propertyIdx] = {
            ...action.property,
            name: undefinedIfEmpty(action.property.name),
            value: undefinedIfEmpty(action.property.value)
         };
         break;

      case 'relationship:property:add-property':
         relationship.properties.push(action.property);
         break;

      case 'relationship:property:delete-property':
         relationship.properties.splice(action.propertyIdx, 1);
         break;

      case 'relationship:property:move-property-up':
         moveUp(relationship.properties, action.propertyIdx);
         break;

      case 'relationship:property:move-property-down':
         moveDown(relationship.properties, action.propertyIdx);
         break;
   }
   return state;
}
