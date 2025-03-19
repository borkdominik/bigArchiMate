import { AstNode, DefaultServiceRegistry, IndentationAwareLexer, Module, ServiceRegistry, inject } from 'langium';
import {
   DefaultSharedModuleContext,
   LangiumServices,
   LangiumSharedServices,
   PartialLangiumServices,
   PartialLangiumSharedServices,
   createDefaultModule,
   createDefaultSharedModule
} from 'langium/lsp';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';
import { AddedSharedModelServices } from '../model-server/model-module.js';
import { ModelSerializer } from '../model-server/model-serializer.js';
import { ModelService } from '../model-server/model-service.js';
import { OpenTextDocumentManager } from '../model-server/open-text-document-manager.js';
import { OpenableTextDocuments } from '../model-server/openable-text-documents.js';
import { ClientLogger } from './client-logger.js';
import { CodeActionProvider } from './code-action-provider.js';
import { CompletionProvider } from './completion-provider.js';
import { DocumentBuilder } from './document-builder.js';
import { Formatter } from './formatter.js';
import { ArchiMateGeneratedModule, ArchiMateLanguageGeneratedSharedModule } from './generated/module.js';
import { IndexManager } from './index-manager.js';
import { LangiumDocuments } from './langium-documents.js';
import { LanguageServer } from './language-server.js';
import { DefaultIdProvider } from './naming.js';
import { PackageManager } from './package-manager.js';
import { TokenBuilder } from './parser/token-builder.js';
import { Linker } from './references/linker.js';
import { ScopeComputation } from './scope-computation.js';
import { ScopeProvider } from './scope-provider.js';
import { SemanticTokenProvider } from './semantic-token-provider.js';
import { Serializer } from './serializer.js';
import { Validator, registerValidationChecks } from './validator.js';
import { WorkspaceManager } from './workspace-manager.js';

/***************************
 * Shared Module
 ***************************/
export type ExtendedLangiumServices = LangiumServices & {
   serializer: {
      Serializer: ModelSerializer<AstNode>;
   };
};

export class DefaultExtendedServiceRegistry extends DefaultServiceRegistry {
   protected _crossModelService!: CrossModelServices;

   get CrossModel(): CrossModelServices {
      return this._crossModelService;
   }

   set CrossModel(service: CrossModelServices) {
      this._crossModelService = service;
   }

   override register(language: ExtendedLangiumServices): void {
      super.register(language);
   }

   override getServices(uri: URI): ExtendedLangiumServices {
      return super.getServices(uri) as ExtendedLangiumServices;
   }
}

export interface ExtendedServiceRegistry extends ServiceRegistry {
   CrossModel: CrossModelServices;
   register(language: ExtendedLangiumServices): void;
   getServices(uri: URI): ExtendedLangiumServices;
}

/**
 * Declaration of custom services - add your own service classes here.
 */
export interface CrossModelAddedSharedServices {
   /* override */
   ServiceRegistry: ExtendedServiceRegistry;

   workspace: {
      /* override */ WorkspaceManager: WorkspaceManager;
      PackageManager: PackageManager;
      LangiumDocuments: LangiumDocuments;
      IndexManager: IndexManager;
   };
   logger: {
      ClientLogger: ClientLogger;
   };
   lsp: {
      /* override */ LanguageServer: LanguageServer;
   };
}

export const CrossModelSharedServices = Symbol('CrossModelSharedServices');
export type CrossModelSharedServices = Omit<LangiumSharedServices, 'ServiceRegistry'> &
   CrossModelAddedSharedServices &
   AddedSharedModelServices;

export const SharedModule: Module<
   CrossModelSharedServices,
   PartialLangiumSharedServices & CrossModelAddedSharedServices & AddedSharedModelServices
> = {
   ServiceRegistry: () => new DefaultExtendedServiceRegistry(),
   workspace: {
      WorkspaceManager: services => new WorkspaceManager(services),
      PackageManager: services => new PackageManager(services),
      LangiumDocuments: services => new LangiumDocuments(services),
      TextDocuments: services => new OpenableTextDocuments(TextDocument, services),
      TextDocumentManager: services => new OpenTextDocumentManager(services),
      DocumentBuilder: services => new DocumentBuilder(services),
      IndexManager: services => new IndexManager(services)
   },
   logger: {
      ClientLogger: services => new ClientLogger(services)
   },
   lsp: {
      LanguageServer: services => new LanguageServer(services)
   },
   model: {
      ModelService: services => new ModelService(services)
   }
};

/***************************
 * Language Module
 ***************************/

export interface ModuleContext {
   shared: CrossModelSharedServices;
}

/**
 * Declaration of custom services - add your own service classes here.
 */
export interface AddedServices {
   references: {
      IdProvider: DefaultIdProvider;
      Linker: Linker;
      ScopeProvider: ScopeProvider;
   };
   validation: {
      CrossModelValidator: Validator;
   };
   serializer: {
      Serializer: Serializer;
   };
   parser: {
      TokenBuilder: TokenBuilder;
   };
   lsp: {
      /* implement */ CodeActionProvider: CodeActionProvider;
      SemanticTokenProvider: SemanticTokenProvider;
   };
   /* override */ shared: CrossModelSharedServices;
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type CrossModelServices = ExtendedLangiumServices & AddedServices;
export const CrossModelServices = Symbol('CrossModelServices');

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export function createCrossModelModule(context: ModuleContext): Module<CrossModelServices, PartialLangiumServices & AddedServices> {
   return {
      references: {
         ScopeComputation: services => new ScopeComputation(services),
         ScopeProvider: services => new ScopeProvider(services),
         IdProvider: services => new DefaultIdProvider(services),
         NameProvider: services => services.references.IdProvider,
         Linker: services => new Linker(services)
      },
      validation: {
         CrossModelValidator: services => new Validator(services)
      },
      lsp: {
         CodeActionProvider: () => new CodeActionProvider(),
         CompletionProvider: services => new CompletionProvider(services),
         Formatter: () => new Formatter(),
         SemanticTokenProvider: services => new SemanticTokenProvider(services)
      },
      serializer: {
         Serializer: services => new Serializer(services.Grammar)
      },
      parser: {
         TokenBuilder: () => new TokenBuilder(),
         Lexer: services => new IndentationAwareLexer(services)
      },
      shared: () => context.shared
   };
}

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createCrossModelServices(context: DefaultSharedModuleContext): {
   shared: CrossModelSharedServices;
   CrossModel: CrossModelServices;
} {
   const shared = inject(createDefaultSharedModule(context), ArchiMateLanguageGeneratedSharedModule, SharedModule);
   const CrossModel = inject(createDefaultModule({ shared }), ArchiMateGeneratedModule, createCrossModelModule({ shared }));
   shared.ServiceRegistry.CrossModel = CrossModel;
   shared.ServiceRegistry.register(CrossModel);
   registerValidationChecks(CrossModel);
   return { shared, CrossModel };
}
