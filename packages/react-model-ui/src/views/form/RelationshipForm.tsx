import { codiconCSSString, getIcon, getLabel } from '@big-archimate/protocol';
import { Box, TextField } from '@mui/material';
import * as React from 'react';
import { useModelDispatch, useReadonly, useRelationship } from '../../ModelContext';
import { modelComponent } from '../../ModelViewer';
import { themed } from '../../ThemedViewer';
import { RelationshipPropertiesDataGrid } from '../common';
import { FormSection } from '../FormSection';
import { Form } from './Form';

export function RelationshipForm(): React.ReactElement {
   const dispatch = useModelDispatch();
   const relationship = useRelationship();
   const readonly = useReadonly();

   return (
      <Form
         id={relationship.id}
         name={
            relationship.name
               ? `${relationship.name} (${getLabel(relationship.type)} relationship) (${relationship.source} - ${relationship.target})`
               : `${getLabel(relationship.type)} relationship (${relationship.source} - ${relationship.target})`
         }
         iconClass={codiconCSSString(getIcon(relationship.type))}
      >
         <FormSection label='Info'>
            <TextField sx={{ width: '25%' }} label='Type' margin='normal' variant='outlined' disabled value={relationship.type ?? ''} />

            <Box sx={{ display: 'flex', gap: 4 }}>
               <TextField label='Source' margin='normal' variant='outlined' disabled value={relationship.source ?? ''} />
               <TextField label='Target' margin='normal' variant='outlined' disabled value={relationship.target ?? ''} />
            </Box>
         </FormSection>
         <FormSection label='General'>
            <TextField
               fullWidth={true}
               label='Name'
               margin='normal'
               variant='outlined'
               disabled={readonly}
               value={relationship.name ?? ''}
               onChange={event => dispatch({ type: 'relationship:change-name', name: event.target.value ?? '' })}
            />

            <TextField
               fullWidth={true}
               label='Documentation'
               margin='normal'
               variant='outlined'
               disabled={readonly}
               multiline={true}
               rows={2}
               value={relationship.documentation ?? ''}
               onChange={event => dispatch({ type: 'relationship:change-documentation', documentation: event.target.value ?? '' })}
            />
         </FormSection>
         <FormSection label='Properties'>
            <RelationshipPropertiesDataGrid />
         </FormSection>
      </Form>
   );
}

export const RelationshipComponent = themed(modelComponent(RelationshipForm));
