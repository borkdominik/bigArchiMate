import { Property, PropertyType, findNextUnique } from '@big-archimate/protocol';
import { GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import { useElement, useModelDispatch, useReadonly } from '../../ModelContext';
import { ErrorView } from '../ErrorView';
import GridComponent, { GridComponentRow, ValidationFunction } from './GridComponent';

export type ElementPropertyRow = GridComponentRow<Property>;

export function ElementPropertiesDataGrid(): React.ReactElement {
   const element = useElement();
   const dispatch = useModelDispatch();
   const readonly = useReadonly();

   // Callback for when the user stops editing a cell.
   const handleRowUpdate = React.useCallback(
      (property: ElementPropertyRow): ElementPropertyRow => {
         dispatch({
            type: 'element:property:update',
            propertyIdx: property.idx,
            property: GridComponentRow.getData(property)
         });
         return property;
      },
      [dispatch]
   );

   const handleAddProperty = React.useCallback(
      (property: ElementPropertyRow): void => {
         if (property.name) {
            dispatch({
               type: 'element:property:add-property',
               property: { ...property, id: findNextUnique(property.id, element.properties, attr => attr.id!) }
            });
         }
      },
      [dispatch, element.properties]
   );

   const handlePropertyUpward = React.useCallback(
      (property: ElementPropertyRow): void => {
         dispatch({
            type: 'element:property:move-property-up',
            propertyIdx: property.idx
         });
      },
      [dispatch]
   );

   const handlePropertyDownward = React.useCallback(
      (property: ElementPropertyRow): void => {
         dispatch({
            type: 'element:property:move-property-down',
            propertyIdx: property.idx
         });
      },
      [dispatch]
   );

   const handlePropertyDelete = React.useCallback(
      (property: ElementPropertyRow): void => {
         dispatch({
            type: 'element:property:delete-property',
            propertyIdx: property.idx
         });
      },
      [dispatch]
   );

   const validateProperty = React.useCallback<ValidationFunction<Property>>(
      <P extends keyof Property, V extends Property[P]>(field: P, value: V): string | undefined => {
         if (field === 'name' && !value) {
            return 'Invalid Name';
         }
         return undefined;
      },
      []
   );

   const columns = React.useMemo<GridColDef<Property>[]>(
      () => [
         {
            field: 'name',
            headerName: 'Name',
            flex: 200,
            editable: !readonly,
            type: 'string'
         },
         { field: 'value', headerName: 'Value', editable: true, flex: 200 }
      ],
      [readonly]
   );

   const defaultEntry = React.useMemo<Property>(
      () => ({
         $type: PropertyType,
         id: findNextUnique('Property', element.properties, attr => attr.id!),
         $globalId: 'toBeAssigned',
         name: ''
      }),
      [element.properties]
   );

   // Check if model initialized. Has to be here otherwise the compiler complains.
   if (element === undefined) {
      return <ErrorView errorMessage='No Element!' />;
   }
   return (
      <GridComponent<Property>
         autoHeight
         gridColumns={columns}
         gridData={element.properties}
         defaultEntry={defaultEntry}
         onDelete={handlePropertyDelete}
         onMoveDown={handlePropertyDownward}
         onMoveUp={handlePropertyUpward}
         noEntriesText='No Properties'
         newEntryText='Add Property'
         onAdd={handleAddProperty}
         onUpdate={handleRowUpdate}
         validateField={validateProperty}
      />
   );
}
