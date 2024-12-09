/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/
import { inject, injectable } from 'inversify';
import { ArchiMateDiagram } from '../../../language-server/generated/ast.js';
import { CrossModelState } from '../../common/cross-model-state.js';
import { ArchiMateModelIndex } from './archimate-model-index.js';

@injectable()
export class ArchiMateModelState extends CrossModelState {
   @inject(ArchiMateModelIndex) declare readonly index: ArchiMateModelIndex;

   get archiMateDiagram(): ArchiMateDiagram {
      return this.semanticRoot.archiMateDiagram!;
   }
}
