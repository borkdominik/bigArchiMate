import { codiconCSSString, getIcon, getLabel } from '@big-archimate/protocol';
import { Box, TextField } from '@mui/material';
import * as React from 'react';
import { useModelDispatch, useReadonly, useRelation } from '../../ModelContext';
import { modelComponent } from '../../ModelViewer';
import { themed } from '../../ThemedViewer';
import { RelationPropertiesDataGrid } from '../common';
import { FormSection } from '../FormSection';
import { Form } from './Form';

export function RelationForm(): React.ReactElement {
   const dispatch = useModelDispatch();
   const relation = useRelation();
   const readonly = useReadonly();

   return (
      <Form
         id={relation.id}
         name={
            relation.name
               ? `${relation.name} (${getLabel(relation.type)} relation) (${relation.source} - ${relation.target})`
               : `${getLabel(relation.type)} relation (${relation.source} - ${relation.target})`
         }
         iconClass={codiconCSSString(getIcon(relation.type))}
      >
         <FormSection label='Info'>
            <TextField sx={{ width: '25%' }} label='Type' margin='normal' variant='outlined' disabled value={relation.type ?? ''} />

            <Box sx={{ display: 'flex', gap: 4 }}>
               <TextField label='Source' margin='normal' variant='outlined' disabled value={relation.source ?? ''} />
               <TextField label='Target' margin='normal' variant='outlined' disabled value={relation.target ?? ''} />
            </Box>
         </FormSection>
         <FormSection label='General'>
            <TextField
               fullWidth={true}
               label='Name'
               margin='normal'
               variant='outlined'
               disabled={readonly}
               value={relation.name ?? ''}
               onChange={event => dispatch({ type: 'relation:change-name', name: event.target.value ?? '' })}
            />

            <TextField
               fullWidth={true}
               label='Documentation'
               margin='normal'
               variant='outlined'
               disabled={readonly}
               multiline={true}
               rows={2}
               value={relation.documentation ?? ''}
               onChange={event => dispatch({ type: 'relation:change-documentation', documentation: event.target.value ?? '' })}
            />
         </FormSection>
         <FormSection label='Properties'>
            <RelationPropertiesDataGrid />
         </FormSection>
      </Form>
   );
}

export const RelationComponent = themed(modelComponent(RelationForm));
