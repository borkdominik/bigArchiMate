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
import { IdProvider } from './id-provider.js';
import { IndexManager } from './index-manager.js';
import { LangiumDocuments } from './langium-documents.js';
import { LanguageServer } from './language-server.js';
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
   protected _services!: Services;

   get services(): Services {
      return this._services;
   }

   set services(service: Services) {
      this._services = service;
   }

   override register(language: ExtendedLangiumServices): void {
      super.register(language);
   }

   override getServices(uri: URI): ExtendedLangiumServices {
      return super.getServices(uri) as ExtendedLangiumServices;
   }
}

export interface ExtendedServiceRegistry extends ServiceRegistry {
   services: Services;
   register(language: ExtendedLangiumServices): void;
   getServices(uri: URI): ExtendedLangiumServices;
}

/**
 * Declaration of custom services - add your own service classes here.
 */
export interface AddedSharedServices {
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

export const SharedServices = Symbol('SharedServices');
export type SharedServices = Omit<LangiumSharedServices, 'ServiceRegistry'> & AddedSharedServices & AddedSharedModelServices;

export const SharedModule: Module<SharedServices, PartialLangiumSharedServices & AddedSharedServices & AddedSharedModelServices> = {
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
   shared: SharedServices;
}

/**
 * Declaration of custom services - add your own service classes here.
 */
export interface AddedServices {
   references: {
      IdProvider: IdProvider;
      Linker: Linker;
      ScopeProvider: ScopeProvider;
   };
   validation: {
      Validator: Validator;
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
   /* override */ shared: SharedServices;
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type Services = ExtendedLangiumServices & AddedServices;
export const Services = Symbol('Services');

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export function createModule(context: ModuleContext): Module<Services, PartialLangiumServices & AddedServices> {
   return {
      references: {
         ScopeComputation: services => new ScopeComputation(services),
         ScopeProvider: services => new ScopeProvider(services),
         IdProvider: services => new IdProvider(services),
         NameProvider: services => services.references.IdProvider,
         Linker: services => new Linker(services)
      },
      validation: {
         Validator: services => new Validator(services)
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
export function createServices(context: DefaultSharedModuleContext): {
   shared: SharedServices;
   services: Services;
} {
   const shared = inject(createDefaultSharedModule(context), ArchiMateLanguageGeneratedSharedModule, SharedModule);
   const services = inject(createDefaultModule({ shared }), ArchiMateGeneratedModule, createModule({ shared }));
   shared.ServiceRegistry.services = services;
   shared.ServiceRegistry.register(services);
   registerValidationChecks(services);
   return { shared, services };
}
