/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

/* eslint-disable react/no-unknown-property */
/* eslint-disable max-len */

import { GEdgeView } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { DiagramNodeView } from '../views';

@injectable()
export class ElementNodeView extends DiagramNodeView {}

@injectable()
export class RelationEdgeView extends GEdgeView {}
