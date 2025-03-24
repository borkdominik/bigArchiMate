import { DefaultLangiumDocuments, DocumentState, LangiumDocument } from 'langium';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';
import { ArchiMateRoot } from './generated/ast.js';
import { isPackageUri } from './package-manager.js';
import { fixDocument } from './util/ast-util.js';
import { Utils } from './util/uri-util.js';

export class LangiumDocuments extends DefaultLangiumDocuments {
   override async getOrCreateDocument(uri: URI): Promise<LangiumDocument> {
      const document = this.getDocument(uri);
      if (document) {
         return document;
      }
      const documentUri = this.getDocumentUri(uri);
      if (documentUri) {
         return super.getOrCreateDocument(documentUri);
      }
      return this.createEmptyDocument(uri);
   }

   protected getDocumentUri(uri: URI): URI | undefined {
      // we register for package.json files because our package scoping mechanism depends on it
      // but we do not want actually want to parse them
      if (isPackageUri(uri)) {
         return undefined;
      }
      // we want to resolve existing URIs to properly deal with linked files and folders and not create duplicates for them
      return Utils.toRealURIorUndefined(uri);
   }

   createEmptyDocument(uri: URI, rootType = ArchiMateRoot): LangiumDocument {
      const document: LangiumDocument = {
         uri,
         parseResult: { lexerErrors: [], parserErrors: [], value: { $type: rootType } },
         references: [],
         state: DocumentState.Validated,
         textDocument: TextDocument.create(uri.toString(), '', 1, ''),
         diagnostics: []
      };
      fixDocument(document.parseResult.value, document);
      return document;
   }
}
