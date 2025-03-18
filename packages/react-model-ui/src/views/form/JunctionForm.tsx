import { getLabel, ModelStructure } from '@crossbreeze/protocol';
import { TextField } from '@mui/material';
import * as React from 'react';
import { useJunction, useModelDispatch, useReadonly } from '../../ModelContext';
import { modelComponent } from '../../ModelViewer';
import { themed } from '../../ThemedViewer';
import { JunctionPropertiesDataGrid } from '../common';
import { FormSection } from '../FormSection';
import { Form } from './Form';

export function JunctionForm(): React.ReactElement {
   const dispatch = useModelDispatch();
   const junction = useJunction();
   const readonly = useReadonly();

   return (
      <Form
         id={junction.id}
         name={junction.name ? `${junction.name} (${getLabel(junction.$type)})` : getLabel(junction.$type)}
         iconClass={ModelStructure.Junction.ICON_CLASS}
      >
         <FormSection label='General'>
            <TextField
               fullWidth={true}
               label='Name'
               margin='normal'
               variant='outlined'
               disabled={readonly}
               value={junction.name ?? ''}
               onChange={event => dispatch({ type: 'junction:change-name', name: event.target.value ?? '' })}
            />

            <TextField
               fullWidth={true}
               label='Documentation'
               margin='normal'
               variant='outlined'
               disabled={readonly}
               multiline={true}
               rows={2}
               value={junction.documentation ?? ''}
               onChange={event => dispatch({ type: 'junction:change-documentation', documentation: event.target.value ?? '' })}
            />
         </FormSection>
         <FormSection label='Properties'>
            <JunctionPropertiesDataGrid />
         </FormSection>
      </Form>
   );
}

export const JunctionComponent = themed(modelComponent(JunctionForm));
