import { codiconCSSString, getIcon, getLabel } from '@big-archimate/protocol';
import { TextField } from '@mui/material';
import * as React from 'react';
import { useElement, useModelDispatch, useReadonly } from '../../ModelContext';
import { modelComponent } from '../../ModelViewer';
import { themed } from '../../ThemedViewer';
import { ElementPropertiesDataGrid } from '../common';
import { FormSection } from '../FormSection';
import { Form } from './Form';

export function ElementForm(): React.ReactElement {
   const dispatch = useModelDispatch();
   const element = useElement();
   const readonly = useReadonly();

   return (
      <Form
         id={element.id}
         name={element.name ? `${element.name} (${getLabel(element.type)})` : getLabel(element.type)}
         iconClass={codiconCSSString(getIcon(element.type))}
      >
         <FormSection label='General'>
            <TextField
               fullWidth={true}
               label='Name'
               margin='normal'
               variant='outlined'
               disabled={readonly}
               value={element.name ?? ''}
               onChange={event => dispatch({ type: 'element:change-name', name: event.target.value ?? '' })}
            />

            <TextField
               fullWidth={true}
               label='Documentation'
               margin='normal'
               variant='outlined'
               disabled={readonly}
               multiline={true}
               rows={2}
               value={element.documentation ?? ''}
               onChange={event => dispatch({ type: 'element:change-documentation', documentation: event.target.value ?? '' })}
            />
         </FormSection>
         <FormSection label='Properties'>
            <ElementPropertiesDataGrid />
         </FormSection>
      </Form>
   );
}

export const ElementComponent = themed(modelComponent(ElementForm));
