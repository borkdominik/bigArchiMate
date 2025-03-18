import { AstNode, GenericAstNode, Grammar, isAstNode, isReference } from 'langium';
import { collectAst } from 'langium/grammar';
import { Serializer } from '../model-server/serializer.js';
import {
   ArchiMateDiagram,
   CrossModelRoot,
   Element,
   isElement,
   isJunction,
   isProperty,
   isRelation,
   Junction,
   reflection,
   Relation
} from './generated/ast.js';
import { isImplicitProperty } from './util/ast-util.js';

/**
 * Hand-written map of the order of properties for serialization.
 * This must match the order in which the properties appear in the grammar.
 * It cannot be derived for interfaces as the interface order does not reflect property order in grammar due to inheritance.
 */
const PROPERTY_ORDER = new Map<string, string[]>([
   [Element, ['id', 'name', 'documentation', 'type', 'properties']],
   [Junction, ['id', 'name', 'documentation', 'properties']],
   [Relation, ['id', 'name', 'documentation', 'type', 'source', 'target', 'properties']],
   [ArchiMateDiagram, ['id', 'name', 'nodes', 'edges', 'properties']]
]);

/**
 * Hand-written AST serializer as there is currently no out-of-the box serializer from Langium, but it is on the roadmap.
 * cf. https://github.com/langium/langium/discussions/683
 * cf. https://github.com/langium/langium/discussions/863
 */
export class CrossModelSerializer implements Serializer<CrossModelRoot> {
   // New line character.
   static readonly CHAR_NEWLINE = '\n';
   // Indentation character.
   static readonly CHAR_INDENTATION = ' ';
   // The amount of spaces to use to indent an object.
   static readonly INDENTATION_AMOUNT_OBJECT = 4;
   // The amount of spaces to use to indent an array.
   static readonly INDENTATION_AMOUNT_ARRAY = 2;

   private propertyCache = new Map<string, string[]>();

   constructor(
      readonly grammar: Grammar,
      readonly astTypes = collectAst(grammar)
   ) {}

   serialize(root: CrossModelRoot): string {
      return this.toYaml(root, '', root)?.trim() ?? '';
   }

   private toYaml(parent: AstNode | any[], key: string, value: any, indentationLevel = 0): string | undefined {
      if (key.startsWith('$') || isImplicitProperty(key, parent)) {
         return undefined;
      }
      if (isReference(value)) {
         return value.$refText ?? value.$nodeDescription?.name;
      }
      if (
         key === 'id' ||
         propertyOf(parent, key, isProperty, 'name') ||
         (!Array.isArray(value) && this.isValidReference(parent, key, value)) ||
         (isElement(parent) && key === 'type') ||
         (isRelation(parent) && key === 'type') ||
         (isJunction(parent) && key === 'type')
      ) {
         // values that we do not want to quote because they are ids or references
         return value;
      }
      if (isAstNode(value)) {
         let isFirstNested = isAstNode(parent);
         const properties = this.getPropertyNames(value.$type)
            .map(prop => {
               const propValue = (value as GenericAstNode)[prop];
               // eslint-disable-next-line no-null/no-null
               if (propValue === undefined || propValue === null) {
                  return undefined;
               }
               if (Array.isArray(propValue) && propValue.length === 0) {
                  // skip empty arrays
                  return undefined;
               }
               // arrays and objects start on a new line -- skip some objects that we do not actually serialize in object structure
               const onNewLine = Array.isArray(propValue) || isAstNode(propValue);
               const serializedPropValue = this.toYaml(value, prop, propValue, onNewLine ? indentationLevel + 1 : 0);
               if (!serializedPropValue) {
                  return undefined;
               }
               const separator = onNewLine ? CrossModelSerializer.CHAR_NEWLINE : ' ';
               const serializedProp = `${this.toKeyword(prop)}:${separator}${serializedPropValue}`;
               const serialized = isFirstNested ? this.indent(serializedProp, indentationLevel) : serializedProp;
               isFirstNested = false;
               return serialized;
            })
            .filter(serializedProp => serializedProp !== undefined)
            .join(CrossModelSerializer.CHAR_NEWLINE + this.indent('', indentationLevel));
         return properties;
      }
      if (Array.isArray(value)) {
         return value
            .filter(item => item !== undefined)
            .map(item => this.toYaml(value, key, item, indentationLevel))
            .filter(serializedItem => serializedItem !== undefined)
            .map(serializedItem => this.indent(`  - ${serializedItem}`, indentationLevel - 1))
            .join(CrossModelSerializer.CHAR_NEWLINE);
      }
      return JSON.stringify(value);
   }

   protected toKeyword(prop: string): string {
      if (prop === 'superEntities') {
         return 'inherits';
      }
      return prop;
   }

   protected indent(text: string, level: number): string {
      return `${CrossModelSerializer.CHAR_INDENTATION.repeat(level * CrossModelSerializer.INDENTATION_AMOUNT_OBJECT)}${text}`;
   }

   protected isValidReference(node: AstNode | any[], key: string, value: any): value is string {
      if (!isAstNode(node)) {
         return false;
      }
      try {
         // if finding the reference type fails, is it not a valid reference
         reflection.getReferenceType({ container: node, property: key, reference: { $refText: value } });
         return true;
      } catch (error) {
         return false;
      }
   }

   protected getPropertyNames(elementType: string, kind: 'all' | 'mandatory' | 'optional' = 'all'): string[] {
      const key = elementType + '$' + kind;
      let cachedProperties = this.propertyCache.get(key);
      if (!cachedProperties) {
         cachedProperties = this.calcProperties(elementType, kind);
         this.propertyCache.set(key, cachedProperties);
      }
      return cachedProperties;
   }

   protected calcProperties(elementType: string, kind: 'all' | 'mandatory' | 'optional'): string[] {
      const interfaceType = this.astTypes.interfaces.find(type => type.name === elementType);
      const allProperties = interfaceType?.allProperties;
      const order = PROPERTY_ORDER.get(elementType);
      if (order) {
         allProperties?.sort((left, right) => order.indexOf(left.name) - order.indexOf(right.name));
      }
      return !allProperties
         ? []
         : kind === 'all'
           ? allProperties.map(prop => prop.name)
           : kind === 'optional'
             ? allProperties.filter(prop => prop.optional).map(prop => prop.name)
             : allProperties.filter(prop => !prop.optional).map(prop => prop.name);
   }
}

function propertyOf<T extends AstNode, K extends keyof T>(
   obj: unknown,
   key: string,
   guard: (type: unknown) => type is T,
   property: K
): obj is T {
   // type-safe check for a specific property
   return guard(obj) && key === property;
}
