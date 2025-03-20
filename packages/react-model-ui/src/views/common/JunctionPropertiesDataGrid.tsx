import { Property, PropertyType, findNextUnique } from '@big-archimate/protocol';
import { GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import { useJunction, useModelDispatch, useReadonly } from '../../ModelContext';
import { ErrorView } from '../ErrorView';
import GridComponent, { GridComponentRow, ValidationFunction } from './GridComponent';

export type JunctionPropertyRow = GridComponentRow<Property>;

export function JunctionPropertiesDataGrid(): React.ReactElement {
   const junction = useJunction();
   const dispatch = useModelDispatch();
   const readonly = useReadonly();

   // Callback for when the user stops editing a cell.
   const handleRowUpdate = React.useCallback(
      (property: JunctionPropertyRow): JunctionPropertyRow => {
         dispatch({
            type: 'junction:property:update',
            propertyIdx: property.idx,
            property: GridComponentRow.getData(property)
         });
         return property;
      },
      [dispatch]
   );

   const handleAddProperty = React.useCallback(
      (property: JunctionPropertyRow): void => {
         if (property.name) {
            dispatch({
               type: 'junction:property:add-property',
               property: { ...property, id: findNextUnique(property.id, junction.properties, attr => attr.id!) }
            });
         }
      },
      [dispatch, junction.properties]
   );

   const handlePropertyUpward = React.useCallback(
      (property: JunctionPropertyRow): void => {
         dispatch({
            type: 'junction:property:move-property-up',
            propertyIdx: property.idx
         });
      },
      [dispatch]
   );

   const handlePropertyDownward = React.useCallback(
      (property: JunctionPropertyRow): void => {
         dispatch({
            type: 'junction:property:move-property-down',
            propertyIdx: property.idx
         });
      },
      [dispatch]
   );

   const handlePropertyDelete = React.useCallback(
      (property: JunctionPropertyRow): void => {
         dispatch({
            type: 'junction:property:delete-property',
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
         id: findNextUnique('Property', junction.properties, attr => attr.id!),
         $globalId: 'toBeAssigned',
         name: ''
      }),
      [junction.properties]
   );

   // Check if model initialized. Has to be here otherwise the compiler complains.
   if (junction === undefined) {
      return <ErrorView errorMessage='No Junction!' />;
   }
   return (
      <GridComponent<Property>
         autoHeight
         gridColumns={columns}
         gridData={junction.properties}
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
