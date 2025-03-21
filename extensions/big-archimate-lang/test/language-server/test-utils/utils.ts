import { EmptyFileSystem, FileSystemNode, FileSystemProvider, LangiumDocument, URI } from 'langium';
import { DefaultSharedModuleContext, LangiumServices } from 'langium/lsp';
import { ParseHelperOptions, parseDocument as langiumParseDocument } from 'langium/test';
import path from 'path';
import { PackageJson } from 'type-fest';
import {
   ArchiMateRoot,
   Diagram,
   Element,
   Junction,
   Relation,
   isDiagram,
   isElement,
   isJunction,
   isRelation
} from '../../../src/language-server/generated/ast.js';
import { Services, createServices } from '../../../src/language-server/module.js';
import { SemanticRoot, TypeGuard, WithDocument, findSemanticRoot } from '../../../src/language-server/util/ast-util.js';

export function createTestServices(context: DefaultSharedModuleContext = EmptyFileSystem): Services {
   return createServices(context).services;
}

export interface ProjectInput {
   package: PackageInput;
   documents: DocumentInput[];
}

export interface PackageInput {
   services: LangiumServices;
   uri: string;
   content: PackageJson & { name: string; version: string };
}

export type PackageDependency = Record<string, string>;

export interface DocumentInput extends ParseHelperOptions {
   services: LangiumServices;
   text: string;
}

export interface ParseAssert {
   lexerErrors?: number;
   parserErrors?: number;
}

export async function parseProject(input: ProjectInput): Promise<PackageDependency> {
   const projectDependency = await parsePackage(input.package);
   await parseDocuments(input.documents);
   return projectDependency;
}

export async function parsePackage(input: PackageInput): Promise<PackageDependency> {
   await parseDocument({ text: JSON.stringify(input.content), documentUri: input.uri, services: input.services });
   return { [input.content.name]: input.content.version };
}

export async function parseDocument(input: DocumentInput): Promise<LangiumDocument<ArchiMateRoot>> {
   if (input.documentUri) {
      const fileSystemProvider = input.services.shared.workspace.FileSystemProvider;
      if (fileSystemProvider instanceof MockFileSystemProvider) {
         fileSystemProvider.setFile(URI.parse(input.documentUri), input.text);
      }
   }
   return langiumParseDocument<ArchiMateRoot>(input.services, input.text, input);
}

export async function parseDocuments(inputs: DocumentInput[]): Promise<LangiumDocument<ArchiMateRoot>[]> {
   return Promise.all(inputs.map(parseDocument));
}

export async function parseSemanticRoot<T extends SemanticRoot>(
   input: DocumentInput,
   assert: ParseAssert,
   guard: TypeGuard<T>
): Promise<WithDocument<T>> {
   const document = await parseDocument(input);
   expect(document.parseResult.lexerErrors).toHaveLength(assert.lexerErrors ?? 0);
   expect(document.parseResult.parserErrors).toHaveLength(assert.parserErrors ?? 0);
   const semanticRoot = findSemanticRoot(document, guard);
   expect(semanticRoot).toBeDefined();
   (semanticRoot as any).$document = document;
   return semanticRoot as WithDocument<T>;
}

export async function parseElement(input: DocumentInput, assert: ParseAssert = {}): Promise<WithDocument<Element>> {
   return parseSemanticRoot(input, assert, isElement);
}

export async function parseJunction(input: DocumentInput, assert: ParseAssert = {}): Promise<WithDocument<Junction>> {
   return parseSemanticRoot(input, assert, isJunction);
}

export async function parseRelation(input: DocumentInput, assert: ParseAssert = {}): Promise<WithDocument<Relation>> {
   return parseSemanticRoot(input, assert, isRelation);
}

export async function parseDiagram(input: DocumentInput, assert: ParseAssert = {}): Promise<WithDocument<Diagram>> {
   return parseSemanticRoot(input, assert, isDiagram);
}

export const MockFileSystem: DefaultSharedModuleContext = {
   fileSystemProvider: () => new MockFileSystemProvider()
};

export class MockFileSystemProvider implements FileSystemProvider {
   protected fileContent = new Map<string, string>();

   setFile(uri: URI, content: string): void {
      this.fileContent.set(uri.toString(), content);
   }

   async readFile(uri: URI): Promise<string> {
      return this.fileContent.get(uri.toString()) ?? '';
   }

   async readDirectory(uri: URI): Promise<FileSystemNode[]> {
      return [];
   }
}

export function testUri(...segments: string[]): string {
   // making sure the URI works on both Windows and Unix
   return 'test:///' + path.posix.join(...segments);
}
