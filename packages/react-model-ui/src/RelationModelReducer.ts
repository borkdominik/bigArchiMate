import { Property } from '@big-archimate/protocol';
import { DispatchAction, ModelAction, ModelState, moveDown, moveUp, undefinedIfEmpty } from './ModelReducer';

export interface RelationChangeNameAction extends ModelAction {
   type: 'relation:change-name';
   name: string;
}

export interface RelationChangeDocumentationAction extends ModelAction {
   type: 'relation:change-documentation';
   documentation: string;
}

export interface PropertyUpdateAction extends ModelAction {
   type: 'relation:property:update';
   propertyIdx: number;
   property: Property;
}

export interface PropertyAddEmptyAction extends ModelAction {
   type: 'relation:property:add-property';
   property: Property;
}

export interface PropertyMoveUpAction extends ModelAction {
   type: 'relation:property:move-property-up';
   propertyIdx: number;
}

export interface PropertyMoveDownAction extends ModelAction {
   type: 'relation:property:move-property-down';
   propertyIdx: number;
}

export interface PropertyDeleteAction extends ModelAction {
   type: 'relation:property:delete-property';
   propertyIdx: number;
}

export type RelationDispatchAction =
   | RelationChangeNameAction
   | RelationChangeDocumentationAction
   | PropertyUpdateAction
   | PropertyAddEmptyAction
   | PropertyMoveUpAction
   | PropertyMoveDownAction
   | PropertyDeleteAction;

export function isRelationDispatchAction(action: DispatchAction): action is RelationDispatchAction {
   return action.type.startsWith('relation:');
}

export function RelationModelReducer(state: ModelState, action: RelationDispatchAction): ModelState {
   const relation = state.model.relation;
   if (relation === undefined) {
      throw Error('Model error: Relation action applied on undefined relation');
   }

   state.reason = action.type;

   switch (action.type) {
      case 'relation:change-name':
         relation.name = undefinedIfEmpty(action.name);
         break;

      case 'relation:change-documentation':
         relation.documentation = undefinedIfEmpty(action.documentation);
         break;

      case 'relation:property:update':
         relation.properties[action.propertyIdx] = {
            ...action.property,
            name: undefinedIfEmpty(action.property.name),
            value: undefinedIfEmpty(action.property.value)
         };
         break;

      case 'relation:property:add-property':
         relation.properties.push(action.property);
         break;

      case 'relation:property:delete-property':
         relation.properties.splice(action.propertyIdx, 1);
         break;

      case 'relation:property:move-property-up':
         moveUp(relation.properties, action.propertyIdx);
         break;

      case 'relation:property:move-property-down':
         moveDown(relation.properties, action.propertyIdx);
         break;
   }
   return state;
}
