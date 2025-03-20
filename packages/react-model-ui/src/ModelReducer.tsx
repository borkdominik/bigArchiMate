import { ArchiMateRoot } from '@big-archimate/protocol';
import { ElementDispatchAction, ElementModelReducer, isElementDispatchAction } from './ElementModelReducer';
import { JunctionDispatchAction, JunctionModelReducer, isJunctionDispatchAction } from './JunctionModelReducer';
import { RelationDispatchAction, RelationModelReducer, isRelationDispatchAction } from './RelationModelReducer';

export interface ModelAction {
   type: string;
}

export interface ModelUpdateAction extends ModelAction {
   type: 'model:update';
   model: ArchiMateRoot;
}

export type DispatchAction = ModelUpdateAction | ElementDispatchAction | JunctionDispatchAction | RelationDispatchAction;

export type ModelStateReason = DispatchAction['type'] | 'model:initial';

export interface ModelState {
   model: ArchiMateRoot;
   reason: ModelStateReason;
}

export function ModelReducer(state: ModelState, action: DispatchAction): ModelState {
   if (state.model === undefined) {
      throw Error('Model error: Model undefined');
   }
   console.debug('[ModelReducer]', action);
   state.reason = action.type;
   if (action.type === 'model:update') {
      state.model = action.model;
      return state;
   }
   if (isElementDispatchAction(action)) {
      return ElementModelReducer(state, action);
   }
   if (isJunctionDispatchAction(action)) {
      return JunctionModelReducer(state, action);
   }
   if (isRelationDispatchAction(action)) {
      return RelationModelReducer(state, action);
   }
   throw Error('Unknown ModelReducer action');
}

export function moveUp<T>(list: T[], idx: number): void {
   swap(list, idx, idx - 1);
}

export function moveDown<T>(list: T[], idx: number): void {
   swap(list, idx, idx + 1);
}

export function swap<T>(list: T[], firstIdx: number, secondIdx: number): void {
   if (firstIdx >= 0 && firstIdx < list.length && secondIdx >= 0 && secondIdx < list.length) {
      const firstVal = list[firstIdx];
      list[firstIdx] = list[secondIdx];
      list[secondIdx] = firstVal;
   }
}

export function undefinedIfEmpty(string?: string): string | undefined {
   return valueIfEmpty(string, undefined);
}

export function valueIfEmpty<V, T extends V | undefined>(value: V | undefined, defaultValue: T): V | T {
   return !value ? defaultValue : value;
}
