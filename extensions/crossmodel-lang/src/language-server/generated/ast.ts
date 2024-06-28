/******************************************************************************
 * This file was generated by langium-cli 2.1.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable */
import type { AstNode, Reference, ReferenceInfo, TypeMetaData } from 'langium';
import { AbstractAstReflection } from 'langium';

export const CrossModelTerminals = {
    STRING: /"[^"]*"|'[^']*'/,
    NUMBER: /(-)?[0-9]+(\.[0-9]*)?/,
    SL_COMMENT: /#[^\n\r]*/,
    NEWLINE: /this_string_does_not_matter_newline#\$%\^&\*\(\(/,
    DEDENT: /this_string_does_not_matter_dedent#\$%\^&\*\(\(/,
    INDENT: /this_string_does_not_matter_indent#\$%\^&\*\(\(/,
    SPACES: /this_string_does_not_matter_spaces#\$%\^&\*\(\(/,
    ID: /[_a-zA-Z][\w_\-~$#@/\d]*/,
};

export type BooleanExpression = NumberLiteral | SourceObjectAttributeReference | StringLiteral;

export const BooleanExpression = 'BooleanExpression';

export function isBooleanExpression(item: unknown): item is BooleanExpression {
    return reflection.isInstance(item, BooleanExpression);
}

export type IDReference = string;

export function isIDReference(item: unknown): item is IDReference {
    return typeof item === 'string';
}

export type JoinType = 'apply' | 'cross-join' | 'from' | 'inner-join' | 'left-join';

export function isJoinType(item: unknown): item is JoinType {
    return item === 'from' || item === 'inner-join' || item === 'cross-join' || item === 'left-join' || item === 'apply';
}

export type SourceObjectCondition = JoinCondition;

export const SourceObjectCondition = 'SourceObjectCondition';

export function isSourceObjectCondition(item: unknown): item is SourceObjectCondition {
    return reflection.isInstance(item, SourceObjectCondition);
}

export interface Attribute extends AstNode {
    readonly $type: 'Attribute' | 'EntityAttribute' | 'EntityNodeAttribute' | 'SourceObjectAttribute' | 'TargetObjectAttribute';
    datatype: string
    description?: string
    id: string
    name: string
}

export const Attribute = 'Attribute';

export function isAttribute(item: unknown): item is Attribute {
    return reflection.isInstance(item, Attribute);
}

export interface AttributeMapping extends AstNode {
    readonly $container: TargetObject;
    readonly $type: 'AttributeMapping';
    attribute: AttributeMappingTarget
    expression?: string
    sources: Array<AttributeMappingSource>
}

export const AttributeMapping = 'AttributeMapping';

export function isAttributeMapping(item: unknown): item is AttributeMapping {
    return reflection.isInstance(item, AttributeMapping);
}

export interface AttributeMappingSource extends AstNode {
    readonly $container: AttributeMapping;
    readonly $type: 'AttributeMappingSource';
    value: Reference<SourceObjectAttribute>
}

export const AttributeMappingSource = 'AttributeMappingSource';

export function isAttributeMappingSource(item: unknown): item is AttributeMappingSource {
    return reflection.isInstance(item, AttributeMappingSource);
}

export interface AttributeMappingTarget extends AstNode {
    readonly $container: AttributeMapping;
    readonly $type: 'AttributeMappingTarget';
    value: Reference<TargetObjectAttribute>
}

export const AttributeMappingTarget = 'AttributeMappingTarget';

export function isAttributeMappingTarget(item: unknown): item is AttributeMappingTarget {
    return reflection.isInstance(item, AttributeMappingTarget);
}

export interface BinaryExpression extends AstNode {
    readonly $container: JoinCondition;
    readonly $type: 'BinaryExpression';
    left: BooleanExpression
    op: '!=' | '<' | '<=' | '=' | '>' | '>='
    right: BooleanExpression
}

export const BinaryExpression = 'BinaryExpression';

export function isBinaryExpression(item: unknown): item is BinaryExpression {
    return reflection.isInstance(item, BinaryExpression);
}

export interface CrossModelRoot extends AstNode {
    readonly $type: 'CrossModelRoot';
    entity?: Entity
    mapping?: Mapping
    relationship?: Relationship
    systemDiagram?: SystemDiagram
}

export const CrossModelRoot = 'CrossModelRoot';

export function isCrossModelRoot(item: unknown): item is CrossModelRoot {
    return reflection.isInstance(item, CrossModelRoot);
}

export interface Entity extends AstNode {
    readonly $container: CrossModelRoot;
    readonly $type: 'Entity';
    attributes: Array<EntityAttribute>
    description?: string
    id: string
    name?: string
}

export const Entity = 'Entity';

export function isEntity(item: unknown): item is Entity {
    return reflection.isInstance(item, Entity);
}

export interface EntityNode extends AstNode {
    readonly $container: SystemDiagram;
    readonly $type: 'EntityNode';
    description?: string
    entity: Reference<Entity>
    height: number
    id: string
    name?: string
    width: number
    x: number
    y: number
}

export const EntityNode = 'EntityNode';

export function isEntityNode(item: unknown): item is EntityNode {
    return reflection.isInstance(item, EntityNode);
}

export interface JoinCondition extends AstNode {
    readonly $container: SourceObject;
    readonly $type: 'JoinCondition';
    expression: BinaryExpression
}

export const JoinCondition = 'JoinCondition';

export function isJoinCondition(item: unknown): item is JoinCondition {
    return reflection.isInstance(item, JoinCondition);
}

export interface Mapping extends AstNode {
    readonly $container: CrossModelRoot;
    readonly $type: 'Mapping';
    id: string
    sources: Array<SourceObject>
    target: TargetObject
}

export const Mapping = 'Mapping';

export function isMapping(item: unknown): item is Mapping {
    return reflection.isInstance(item, Mapping);
}

export interface NumberLiteral extends AstNode {
    readonly $container: BinaryExpression;
    readonly $type: 'NumberLiteral';
    value: number
}

export const NumberLiteral = 'NumberLiteral';

export function isNumberLiteral(item: unknown): item is NumberLiteral {
    return reflection.isInstance(item, NumberLiteral);
}

export interface Relationship extends AstNode {
    readonly $container: CrossModelRoot;
    readonly $type: 'Relationship';
    attributes: Array<RelationshipAttribute>
    child: Reference<Entity>
    description?: string
    id: string
    name?: string
    parent: Reference<Entity>
    type: string
}

export const Relationship = 'Relationship';

export function isRelationship(item: unknown): item is Relationship {
    return reflection.isInstance(item, Relationship);
}

export interface RelationshipAttribute extends AstNode {
    readonly $container: Relationship;
    readonly $type: 'RelationshipAttribute';
    child: Reference<Attribute>
    parent: Reference<Attribute>
}

export const RelationshipAttribute = 'RelationshipAttribute';

export function isRelationshipAttribute(item: unknown): item is RelationshipAttribute {
    return reflection.isInstance(item, RelationshipAttribute);
}

export interface RelationshipEdge extends AstNode {
    readonly $container: SystemDiagram;
    readonly $type: 'RelationshipEdge';
    id: string
    relationship: Reference<Relationship>
    sourceNode: Reference<EntityNode>
    targetNode: Reference<EntityNode>
}

export const RelationshipEdge = 'RelationshipEdge';

export function isRelationshipEdge(item: unknown): item is RelationshipEdge {
    return reflection.isInstance(item, RelationshipEdge);
}

export interface SourceObject extends AstNode {
    readonly $container: Mapping;
    readonly $type: 'SourceObject';
    conditions: Array<SourceObjectCondition>
    dependencies: Array<SourceObjectDependency>
    entity: Reference<Entity>
    id: string
    join: JoinType
}

export const SourceObject = 'SourceObject';

export function isSourceObject(item: unknown): item is SourceObject {
    return reflection.isInstance(item, SourceObject);
}

export interface SourceObjectAttributeReference extends AstNode {
    readonly $container: BinaryExpression;
    readonly $type: 'SourceObjectAttributeReference';
    value: Reference<SourceObjectAttribute>
}

export const SourceObjectAttributeReference = 'SourceObjectAttributeReference';

export function isSourceObjectAttributeReference(item: unknown): item is SourceObjectAttributeReference {
    return reflection.isInstance(item, SourceObjectAttributeReference);
}

export interface SourceObjectDependency extends AstNode {
    readonly $container: SourceObject;
    readonly $type: 'SourceObjectDependency';
    source: Reference<SourceObject>
}

export const SourceObjectDependency = 'SourceObjectDependency';

export function isSourceObjectDependency(item: unknown): item is SourceObjectDependency {
    return reflection.isInstance(item, SourceObjectDependency);
}

export interface StringLiteral extends AstNode {
    readonly $container: BinaryExpression;
    readonly $type: 'StringLiteral';
    value: string
}

export const StringLiteral = 'StringLiteral';

export function isStringLiteral(item: unknown): item is StringLiteral {
    return reflection.isInstance(item, StringLiteral);
}

export interface SystemDiagram extends AstNode {
    readonly $container: CrossModelRoot;
    readonly $type: 'SystemDiagram';
    description?: string
    edges: Array<RelationshipEdge>
    id?: string
    name?: string
    nodes: Array<EntityNode>
}

export const SystemDiagram = 'SystemDiagram';

export function isSystemDiagram(item: unknown): item is SystemDiagram {
    return reflection.isInstance(item, SystemDiagram);
}

export interface TargetObject extends AstNode {
    readonly $container: Mapping;
    readonly $type: 'TargetObject';
    entity: Reference<Entity>
    mappings: Array<AttributeMapping>
}

export const TargetObject = 'TargetObject';

export function isTargetObject(item: unknown): item is TargetObject {
    return reflection.isInstance(item, TargetObject);
}

export interface EntityAttribute extends Attribute {
    readonly $type: 'EntityAttribute' | 'EntityNodeAttribute';
    identifier: boolean
}

export const EntityAttribute = 'EntityAttribute';

export function isEntityAttribute(item: unknown): item is EntityAttribute {
    return reflection.isInstance(item, EntityAttribute);
}

export interface SourceObjectAttribute extends Attribute {
    readonly $type: 'SourceObjectAttribute';
}

export const SourceObjectAttribute = 'SourceObjectAttribute';

export function isSourceObjectAttribute(item: unknown): item is SourceObjectAttribute {
    return reflection.isInstance(item, SourceObjectAttribute);
}

export interface TargetObjectAttribute extends Attribute {
    readonly $type: 'TargetObjectAttribute';
}

export const TargetObjectAttribute = 'TargetObjectAttribute';

export function isTargetObjectAttribute(item: unknown): item is TargetObjectAttribute {
    return reflection.isInstance(item, TargetObjectAttribute);
}

export interface EntityNodeAttribute extends EntityAttribute {
    readonly $type: 'EntityNodeAttribute';
}

export const EntityNodeAttribute = 'EntityNodeAttribute';

export function isEntityNodeAttribute(item: unknown): item is EntityNodeAttribute {
    return reflection.isInstance(item, EntityNodeAttribute);
}

export type CrossModelAstType = {
    Attribute: Attribute
    AttributeMapping: AttributeMapping
    AttributeMappingSource: AttributeMappingSource
    AttributeMappingTarget: AttributeMappingTarget
    BinaryExpression: BinaryExpression
    BooleanExpression: BooleanExpression
    CrossModelRoot: CrossModelRoot
    Entity: Entity
    EntityAttribute: EntityAttribute
    EntityNode: EntityNode
    EntityNodeAttribute: EntityNodeAttribute
    JoinCondition: JoinCondition
    Mapping: Mapping
    NumberLiteral: NumberLiteral
    Relationship: Relationship
    RelationshipAttribute: RelationshipAttribute
    RelationshipEdge: RelationshipEdge
    SourceObject: SourceObject
    SourceObjectAttribute: SourceObjectAttribute
    SourceObjectAttributeReference: SourceObjectAttributeReference
    SourceObjectCondition: SourceObjectCondition
    SourceObjectDependency: SourceObjectDependency
    StringLiteral: StringLiteral
    SystemDiagram: SystemDiagram
    TargetObject: TargetObject
    TargetObjectAttribute: TargetObjectAttribute
}

export class CrossModelAstReflection extends AbstractAstReflection {

    getAllTypes(): string[] {
        return ['Attribute', 'AttributeMapping', 'AttributeMappingSource', 'AttributeMappingTarget', 'BinaryExpression', 'BooleanExpression', 'CrossModelRoot', 'Entity', 'EntityAttribute', 'EntityNode', 'EntityNodeAttribute', 'JoinCondition', 'Mapping', 'NumberLiteral', 'Relationship', 'RelationshipAttribute', 'RelationshipEdge', 'SourceObject', 'SourceObjectAttribute', 'SourceObjectAttributeReference', 'SourceObjectCondition', 'SourceObjectDependency', 'StringLiteral', 'SystemDiagram', 'TargetObject', 'TargetObjectAttribute'];
    }

    protected override computeIsSubtype(subtype: string, supertype: string): boolean {
        switch (subtype) {
            case EntityAttribute:
            case SourceObjectAttribute:
            case TargetObjectAttribute: {
                return this.isSubtype(Attribute, supertype);
            }
            case EntityNodeAttribute: {
                return this.isSubtype(EntityAttribute, supertype);
            }
            case JoinCondition: {
                return this.isSubtype(SourceObjectCondition, supertype);
            }
            case NumberLiteral:
            case SourceObjectAttributeReference:
            case StringLiteral: {
                return this.isSubtype(BooleanExpression, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(refInfo: ReferenceInfo): string {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'AttributeMappingSource:value':
            case 'SourceObjectAttributeReference:value': {
                return SourceObjectAttribute;
            }
            case 'AttributeMappingTarget:value': {
                return TargetObjectAttribute;
            }
            case 'EntityNode:entity':
            case 'Relationship:child':
            case 'Relationship:parent':
            case 'SourceObject:entity':
            case 'TargetObject:entity': {
                return Entity;
            }
            case 'RelationshipAttribute:child':
            case 'RelationshipAttribute:parent': {
                return Attribute;
            }
            case 'RelationshipEdge:relationship': {
                return Relationship;
            }
            case 'RelationshipEdge:sourceNode':
            case 'RelationshipEdge:targetNode': {
                return EntityNode;
            }
            case 'SourceObjectDependency:source': {
                return SourceObject;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }

    getTypeMetaData(type: string): TypeMetaData {
        switch (type) {
            case 'AttributeMapping': {
                return {
                    name: 'AttributeMapping',
                    mandatory: [
                        { name: 'sources', type: 'array' }
                    ]
                };
            }
            case 'Entity': {
                return {
                    name: 'Entity',
                    mandatory: [
                        { name: 'attributes', type: 'array' }
                    ]
                };
            }
            case 'Mapping': {
                return {
                    name: 'Mapping',
                    mandatory: [
                        { name: 'sources', type: 'array' }
                    ]
                };
            }
            case 'Relationship': {
                return {
                    name: 'Relationship',
                    mandatory: [
                        { name: 'attributes', type: 'array' }
                    ]
                };
            }
            case 'SourceObject': {
                return {
                    name: 'SourceObject',
                    mandatory: [
                        { name: 'conditions', type: 'array' },
                        { name: 'dependencies', type: 'array' }
                    ]
                };
            }
            case 'SystemDiagram': {
                return {
                    name: 'SystemDiagram',
                    mandatory: [
                        { name: 'edges', type: 'array' },
                        { name: 'nodes', type: 'array' }
                    ]
                };
            }
            case 'TargetObject': {
                return {
                    name: 'TargetObject',
                    mandatory: [
                        { name: 'mappings', type: 'array' }
                    ]
                };
            }
            case 'EntityAttribute': {
                return {
                    name: 'EntityAttribute',
                    mandatory: [
                        { name: 'identifier', type: 'boolean' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    mandatory: []
                };
            }
        }
    }
}

export const reflection = new CrossModelAstReflection();
