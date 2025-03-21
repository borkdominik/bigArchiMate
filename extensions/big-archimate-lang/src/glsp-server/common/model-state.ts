import { DefaultModelState, JsonModelState, ModelState, hasFunctionProp } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { DocumentState } from 'langium';
import { URI } from 'vscode-uri';
import { LSPServices } from '../../integration.js';
import { ArchiMateRoot, Diagram } from '../../language-server/generated/ast.js';
import { IdProvider } from '../../language-server/naming.js';
import { ModelSerializer } from '../../model-server/model-serializer.js';
import { ModelService } from '../../model-server/model-service.js';
import { ArchiMateGModelIndex } from './gmodel-index.js';

export interface SourceModel {
   text: string;
}

/**
 * Custom model state that does not only keep track of the GModel root but also the semantic root.
 * It also provides convenience methods for accessing specific language services.
 */
@injectable()
export class ArchiMateModelState extends DefaultModelState implements JsonModelState<SourceModel> {
   @inject(ArchiMateGModelIndex) override readonly index: ArchiMateGModelIndex;
   @inject(LSPServices) readonly services!: LSPServices;

   protected _semanticUri!: string;
   protected _semanticRoot!: ArchiMateRoot;
   protected _packageId!: string;

   setSemanticRoot(uri: string, semanticRoot: ArchiMateRoot): void {
      this._semanticUri = uri;
      this._semanticRoot = semanticRoot;
      this._packageId = this.services.shared.workspace.PackageManager.getPackageIdByUri(URI.parse(uri));
      this.index.indexSemanticRoot(this.semanticRoot);
   }

   get semanticUri(): string {
      return this._semanticUri;
   }

   get semanticRoot(): ArchiMateRoot {
      return this._semanticRoot;
   }

   get packageId(): string {
      return this._packageId;
   }

   get modelService(): ModelService {
      return this.services.shared.model.ModelService;
   }

   get semanticSerializer(): ModelSerializer<ArchiMateRoot> {
      return this.services.language.serializer.Serializer;
   }

   get idProvider(): IdProvider {
      return this.services.language.references.IdProvider;
   }

   get sourceModel(): SourceModel {
      return { text: this.semanticText() };
   }

   get diagram(): Diagram {
      return this.semanticRoot.diagram!;
   }

   async updateSourceModel(sourceModel: SourceModel): Promise<void> {
      const document = await this.modelService.update({
         uri: this.semanticUri,
         model: sourceModel.text ?? this.semanticRoot,
         clientId: this.clientId
      });
      this._semanticRoot = document.root;
      this.index.indexSemanticRoot(this.semanticRoot);
   }

   /** Textual representation of the current semantic root. */
   semanticText(): string {
      return this.services.language.serializer.Serializer.serialize(this.semanticRoot);
   }

   ready(state = DocumentState.Validated): Promise<void> {
      return this.modelService.ready(state, this.semanticUri);
   }
}

export namespace ArchiMateModelState {
   export function is(modelState: ModelState): modelState is ArchiMateModelState {
      return JsonModelState.is(modelState) && hasFunctionProp(modelState, 'setSemanticRoot');
   }
}
