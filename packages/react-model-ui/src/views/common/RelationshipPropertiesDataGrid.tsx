import { Property, PropertyType, findNextUnique } from '@big-archimate/protocol';
import { GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import { useModelDispatch, useReadonly, useRelationship } from '../../ModelContext';
import { ErrorView } from '../ErrorView';
import GridComponent, { GridComponentRow, ValidationFunction } from './GridComponent';

export type RelationshipPropertyRow = GridComponentRow<Property>;

export function RelationshipPropertiesDataGrid(): React.ReactElement {
   const relationship = useRelationship();
   const dispatch = useModelDispatch();
   const readonly = useReadonly();

   // Callback for when the user stops editing a cell.
   const handleRowUpdate = React.useCallback(
      (property: RelationshipPropertyRow): RelationshipPropertyRow => {
         dispatch({
            type: 'relationship:property:update',
            propertyIdx: property.idx,
            property: GridComponentRow.getData(property)
         });
         return property;
      },
      [dispatch]
   );

   const handleAddProperty = React.useCallback(
      (property: RelationshipPropertyRow): void => {
         if (property.name) {
            dispatch({
               type: 'relationship:property:add-property',
               property: { ...property, id: findNextUnique(property.id, relationship.properties, attr => attr.id!) }
            });
         }
      },
      [dispatch, relationship.properties]
   );

   const handlePropertyUpward = React.useCallback(
      (property: RelationshipPropertyRow): void => {
         dispatch({
            type: 'relationship:property:move-property-up',
            propertyIdx: property.idx
         });
      },
      [dispatch]
   );

   const handlePropertyDownward = React.useCallback(
      (property: RelationshipPropertyRow): void => {
         dispatch({
            type: 'relationship:property:move-property-down',
            propertyIdx: property.idx
         });
      },
      [dispatch]
   );

   const handlePropertyDelete = React.useCallback(
      (property: RelationshipPropertyRow): void => {
         dispatch({
            type: 'relationship:property:delete-property',
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
         id: findNextUnique('Property', relationship.properties, attr => attr.id!),
         $globalId: 'toBeAssigned',
         name: ''
      }),
      [relationship.properties]
   );

   // Check if model initialized. Has to be here otherwise the compiler complains.
   if (relationship === undefined) {
      return <ErrorView errorMessage='No Relationship!' />;
   }
   return (
      <GridComponent<Property>
         autoHeight
         gridColumns={columns}
         gridData={relationship.properties}
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
