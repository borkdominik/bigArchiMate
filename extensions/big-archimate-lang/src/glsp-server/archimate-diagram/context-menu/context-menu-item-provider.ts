/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { ARCHIMATE_ELEMENT_TYPE_MAP, getLabel, getLayerElements, getObjectKeys, layerTypes } from '@big-archimate/protocol';
import { Args, ContextMenuItemProvider, CreateNodeOperation, MenuItem, ModelState, Point } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ArchiMateGrid } from '../../common/grid.js';
import { ArchiMateModelState } from '../../common/model-state.js';

@injectable()
export class ArchiMateContextMenuItemProvider extends ContextMenuItemProvider {
   @inject(ModelState) protected modelState!: ArchiMateModelState;

   getItems(selectedElementIds: string[], position: Point, args?: Args): MenuItem[] {
      if (this.modelState.isReadonly || selectedElementIds.length !== 0) {
         return [];
      }

      const items = layerTypes.map(layerType => {
         const addNewLayerElementMenuItem: MenuItem = {
            id: `new${layerType}`,
            label: `${getLabel(layerType).replace('&', 'And')}`,
            children: getObjectKeys(getLayerElements(layerType)).map(elementType => {
               const addNewElementMenuItem: MenuItem = {
                  id: `new${elementType}`,
                  label: `${getLabel(elementType)}`,
                  actions: [
                     CreateNodeOperation.create(ARCHIMATE_ELEMENT_TYPE_MAP.get(elementType), {
                        location: ArchiMateGrid.snap(position)
                     })
                  ]
               };
               return addNewElementMenuItem;
            }),
            actions: []
         };
         return addNewLayerElementMenuItem;
      });

      const newElementMenu: MenuItem = {
         id: 'new',
         label: 'New',
         actions: [],
         children: items,
         icon: 'add',
         group: '0_new'
      };

      return [newElementMenu];
   }
}
