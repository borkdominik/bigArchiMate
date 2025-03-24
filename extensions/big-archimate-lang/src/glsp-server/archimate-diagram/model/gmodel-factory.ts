import { GEdge, GGraph, GModelFactory, GNode, ModelState } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ElementNode, JunctionNode, RelationEdge } from '../../../language-server/generated/ast.js';
import { ArchiMateModelState } from '../../common/model-state.js';
import { GRelationEdge } from './edges.js';
import { GElementNode, GJunctionNode } from './nodes.js';

/**
 * Custom factory that translates the semantic diagram root from Langium to a GLSP graph.
 * Each semantic element in the diagram will be translated to a GModel element on the GLSP side.
 * The GLSP client will later use the GModel to render the SVG elements based on their type.
 */
@injectable()
export class ArchiMateDiagramGModelFactory implements GModelFactory {
   @inject(ModelState) protected readonly modelState!: ArchiMateModelState;

   createModel(): void {
      const newRoot = this.createGraph();
      if (newRoot) {
         // update GLSP root element in state so it can be used in any follow-up actions/commands
         this.modelState.updateRoot(newRoot);
      }
   }

   protected createGraph(): GGraph | undefined {
      const diagramRoot = this.modelState.diagram;
      if (!diagramRoot) {
         return;
      }
      const graphBuilder = GGraph.builder().id(this.modelState.semanticUri);

      diagramRoot.nodes.map(node => this.createNode(node)).forEach(node => graphBuilder.add(node));
      diagramRoot.edges.map(edge => this.createRelationEdge(edge)).forEach(edge => graphBuilder.add(edge));

      return graphBuilder.build();
   }

   protected createNode(node: ElementNode | JunctionNode): GNode {
      if (node.$type === 'ElementNode') {
         return GElementNode.builder().set(node, this.modelState.index).build();
      }
      return GJunctionNode.builder().set(node, this.modelState.index).build();
   }

   protected createRelationEdge(edge: RelationEdge): GEdge {
      return GRelationEdge.builder().set(edge, this.modelState.index).build();
   }
}
