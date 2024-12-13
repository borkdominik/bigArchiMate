/******************************************************************************
 * This file was generated by langium-cli 3.2.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable */
import type { AstNode, Reference, ReferenceInfo, TypeMetaData } from 'langium';
import { AbstractAstReflection } from 'langium';

export const CrossModelTerminals = {
    STRING: /"[^"]*"|'[^']*'/,
    NUMBER: /(-)?[0-9]+(\.[0-9]*)?/,
    SL_COMMENT: /#[^\n\r]*/,
    INDENT: /:synthetic-indent:/,
    DEDENT: /:synthetic-dedent:/,
    LIST_ITEM: /- /,
    NEWLINE: /[/\r\n|\r|\n/]+/,
    WS: /[ \t]+/,
    ID: /[_a-zA-Z][\w_\-~$#@/\d]*/,
};

export type CrossModelTerminalNames = keyof typeof CrossModelTerminals;

export type CrossModelKeywordNames = 
    | "!="
    | "."
    | ":"
    | "<"
    | "<="
    | "="
    | ">"
    | ">="
    | "Access"
    | "Aggregation"
    | "ApplicationCollaboration"
    | "ApplicationComponent"
    | "ApplicationEvent"
    | "ApplicationFunction"
    | "ApplicationInteraction"
    | "ApplicationInterface"
    | "ApplicationProcess"
    | "ApplicationService"
    | "Artifact"
    | "Assessment"
    | "Assignment"
    | "Association"
    | "BusinessActor"
    | "BusinessCollaboration"
    | "BusinessEvent"
    | "BusinessFunction"
    | "BusinessInteraction"
    | "BusinessInterface"
    | "BusinessObject"
    | "BusinessProcess"
    | "BusinessRole"
    | "BusinessService"
    | "Capability"
    | "CommunicationNetwork"
    | "Composition"
    | "Constraint"
    | "Contract"
    | "CourseOfAction"
    | "DataObject"
    | "Deliverable"
    | "Device"
    | "DistributionNetwork"
    | "Driver"
    | "Equipment"
    | "Facility"
    | "Flow"
    | "Gap"
    | "Goal"
    | "ImplementationEvent"
    | "Influence"
    | "Material"
    | "Meaning"
    | "Node"
    | "Outcome"
    | "Path"
    | "Plateau"
    | "Principle"
    | "Product"
    | "Realization"
    | "Representation"
    | "Requirement"
    | "Resource"
    | "Serving"
    | "Specialization"
    | "Stakeholder"
    | "SystemSoftware"
    | "TRUE"
    | "TechnologyCollaboration"
    | "TechnologyEvent"
    | "TechnologyFunction"
    | "TechnologyInteraction"
    | "TechnologyInterface"
    | "TechnologyProcess"
    | "TechnologyService"
    | "Triggering"
    | "Value"
    | "ValueStream"
    | "WorkPackage"
    | "apply"
    | "archiMateDiagram"
    | "archiMateModel"
    | "attribute"
    | "attributes"
    | "child"
    | "conditions"
    | "cross-join"
    | "customProperties"
    | "datatype"
    | "dependencies"
    | "description"
    | "diagram"
    | "edges"
    | "element"
    | "entity"
    | "expression"
    | "from"
    | "height"
    | "id"
    | "identifier"
    | "inner-join"
    | "join"
    | "left-join"
    | "mapping"
    | "mappings"
    | "name"
    | "nodes"
    | "parent"
    | "relation"
    | "relationship"
    | "source"
    | "sourceNode"
    | "sources"
    | "systemDiagram"
    | "target"
    | "targetNode"
    | "true"
    | "type"
    | "value"
    | "width"
    | "x"
    | "y";

export type CrossModelTokenNames = CrossModelTerminalNames | CrossModelKeywordNames;

export type BooleanExpression = NumberLiteral | SourceObjectAttributeReference | StringLiteral;

export const BooleanExpression = 'BooleanExpression';

export function isBooleanExpression(item: unknown): item is BooleanExpression {
    return reflection.isInstance(item, BooleanExpression);
}

export type ElementType = 'ApplicationCollaboration' | 'ApplicationComponent' | 'ApplicationEvent' | 'ApplicationFunction' | 'ApplicationInteraction' | 'ApplicationInterface' | 'ApplicationProcess' | 'ApplicationService' | 'Artifact' | 'Assessment' | 'BusinessActor' | 'BusinessCollaboration' | 'BusinessEvent' | 'BusinessFunction' | 'BusinessInteraction' | 'BusinessInterface' | 'BusinessObject' | 'BusinessProcess' | 'BusinessRole' | 'BusinessService' | 'Capability' | 'CommunicationNetwork' | 'Constraint' | 'Contract' | 'CourseOfAction' | 'DataObject' | 'Deliverable' | 'Device' | 'DistributionNetwork' | 'Driver' | 'Equipment' | 'Facility' | 'Gap' | 'Goal' | 'ImplementationEvent' | 'Material' | 'Meaning' | 'Node' | 'Outcome' | 'Path' | 'Plateau' | 'Principle' | 'Product' | 'Representation' | 'Requirement' | 'Resource' | 'Stakeholder' | 'SystemSoftware' | 'TechnologyCollaboration' | 'TechnologyEvent' | 'TechnologyFunction' | 'TechnologyInteraction' | 'TechnologyInterface' | 'TechnologyProcess' | 'TechnologyService' | 'Value' | 'ValueStream' | 'WorkPackage';

export function isElementType(item: unknown): item is ElementType {
    return item === 'ApplicationCollaboration' || item === 'ApplicationComponent' || item === 'ApplicationEvent' || item === 'ApplicationFunction' || item === 'ApplicationInterface' || item === 'ApplicationInteraction' || item === 'ApplicationProcess' || item === 'ApplicationService' || item === 'Artifact' || item === 'Assessment' || item === 'BusinessActor' || item === 'BusinessCollaboration' || item === 'BusinessEvent' || item === 'BusinessFunction' || item === 'BusinessInteraction' || item === 'BusinessInterface' || item === 'BusinessObject' || item === 'BusinessProcess' || item === 'BusinessRole' || item === 'BusinessService' || item === 'Capability' || item === 'Constraint' || item === 'CommunicationNetwork' || item === 'Contract' || item === 'CourseOfAction' || item === 'DataObject' || item === 'Deliverable' || item === 'Device' || item === 'DistributionNetwork' || item === 'Driver' || item === 'Equipment' || item === 'Facility' || item === 'Gap' || item === 'Goal' || item === 'ImplementationEvent' || item === 'Material' || item === 'Meaning' || item === 'Node' || item === 'Outcome' || item === 'Path' || item === 'Plateau' || item === 'Principle' || item === 'Product' || item === 'Requirement' || item === 'Representation' || item === 'Resource' || item === 'Stakeholder' || item === 'SystemSoftware' || item === 'TechnologyCollaboration' || item === 'TechnologyEvent' || item === 'TechnologyFunction' || item === 'TechnologyInteraction' || item === 'TechnologyInterface' || item === 'TechnologyProcess' || item === 'TechnologyService' || item === 'Value' || item === 'ValueStream' || item === 'WorkPackage';
}

export type IDReference = string;

export function isIDReference(item: unknown): item is IDReference {
    return typeof item === 'string';
}

export type JoinType = 'apply' | 'cross-join' | 'from' | 'inner-join' | 'left-join';

export function isJoinType(item: unknown): item is JoinType {
    return item === 'from' || item === 'inner-join' || item === 'cross-join' || item === 'left-join' || item === 'apply';
}

export type RelationType = 'Access' | 'Aggregation' | 'Assignment' | 'Association' | 'Composition' | 'Flow' | 'Influence' | 'Realization' | 'Serving' | 'Specialization' | 'Triggering';

export function isRelationType(item: unknown): item is RelationType {
    return item === 'Access' || item === 'Aggregation' || item === 'Association' || item === 'Assignment' || item === 'Composition' || item === 'Flow' || item === 'Influence' || item === 'Realization' || item === 'Serving' || item === 'Specialization' || item === 'Triggering';
}

export type SourceObjectCondition = JoinCondition;

export const SourceObjectCondition = 'SourceObjectCondition';

export function isSourceObjectCondition(item: unknown): item is SourceObjectCondition {
    return reflection.isInstance(item, SourceObjectCondition);
}

export interface ArchiMateDiagram extends AstNode {
    readonly $container: CrossModelRoot;
    readonly $type: 'ArchiMateDiagram';
    customProperties: Array<CustomProperty>;
    edges: Array<RelationEdge>;
    id?: string;
    name?: string;
    nodes: Array<ElementNode>;
}

export const ArchiMateDiagram = 'ArchiMateDiagram';

export function isArchiMateDiagram(item: unknown): item is ArchiMateDiagram {
    return reflection.isInstance(item, ArchiMateDiagram);
}

export interface ArchiMateModel extends AstNode {
    readonly $container: CrossModelRoot;
    readonly $type: 'ArchiMateModel';
    edges: Array<Relation>;
    id: string;
    name: string;
    nodes: Array<Element>;
}

export const ArchiMateModel = 'ArchiMateModel';

export function isArchiMateModel(item: unknown): item is ArchiMateModel {
    return reflection.isInstance(item, ArchiMateModel);
}

export interface Attribute extends AstNode {
    readonly $type: 'Attribute' | 'EntityAttribute' | 'EntityNodeAttribute' | 'SourceObjectAttribute' | 'TargetObjectAttribute';
    datatype: string;
    description?: string;
    id: string;
    name: string;
}

export const Attribute = 'Attribute';

export function isAttribute(item: unknown): item is Attribute {
    return reflection.isInstance(item, Attribute);
}

export interface AttributeMapping extends AstNode {
    readonly $container: TargetObject;
    readonly $type: 'AttributeMapping';
    attribute: AttributeMappingTarget;
    customProperties: Array<CustomProperty>;
    expression?: string;
    sources: Array<AttributeMappingSource>;
}

export const AttributeMapping = 'AttributeMapping';

export function isAttributeMapping(item: unknown): item is AttributeMapping {
    return reflection.isInstance(item, AttributeMapping);
}

export interface AttributeMappingSource extends AstNode {
    readonly $container: AttributeMapping;
    readonly $type: 'AttributeMappingSource';
    value: Reference<SourceObjectAttribute>;
}

export const AttributeMappingSource = 'AttributeMappingSource';

export function isAttributeMappingSource(item: unknown): item is AttributeMappingSource {
    return reflection.isInstance(item, AttributeMappingSource);
}

export interface AttributeMappingTarget extends AstNode {
    readonly $container: AttributeMapping;
    readonly $type: 'AttributeMappingTarget';
    value: Reference<TargetObjectAttribute>;
}

export const AttributeMappingTarget = 'AttributeMappingTarget';

export function isAttributeMappingTarget(item: unknown): item is AttributeMappingTarget {
    return reflection.isInstance(item, AttributeMappingTarget);
}

export interface BinaryExpression extends AstNode {
    readonly $container: JoinCondition;
    readonly $type: 'BinaryExpression';
    left: BooleanExpression;
    op: '!=' | '<' | '<=' | '=' | '>' | '>=';
    right: BooleanExpression;
}

export const BinaryExpression = 'BinaryExpression';

export function isBinaryExpression(item: unknown): item is BinaryExpression {
    return reflection.isInstance(item, BinaryExpression);
}

export interface CrossModelRoot extends AstNode {
    readonly $type: 'CrossModelRoot';
    archiMateDiagram?: ArchiMateDiagram;
    archiMateModel?: ArchiMateModel;
    element?: Element;
    entity?: Entity;
    mapping?: Mapping;
    relation?: Relation;
    relationship?: Relationship;
    systemDiagram?: SystemDiagram;
}

export const CrossModelRoot = 'CrossModelRoot';

export function isCrossModelRoot(item: unknown): item is CrossModelRoot {
    return reflection.isInstance(item, CrossModelRoot);
}

export interface CustomProperty extends AstNode {
    readonly $container: ArchiMateDiagram | AttributeMapping | Element | ElementNode | Entity | EntityNode | Mapping | Relation | RelationEdge | Relationship | RelationshipAttribute | RelationshipEdge | SourceObject | SystemDiagram | TargetObject | WithCustomProperties;
    readonly $type: 'CustomProperty';
    name: string;
    value?: string;
}

export const CustomProperty = 'CustomProperty';

export function isCustomProperty(item: unknown): item is CustomProperty {
    return reflection.isInstance(item, CustomProperty);
}

export interface Element extends AstNode {
    readonly $container: ArchiMateModel | CrossModelRoot;
    readonly $type: 'Element';
    customProperties: Array<CustomProperty>;
    description?: string;
    id: string;
    name: string;
    type: ElementType;
}

export const Element = 'Element';

export function isElement(item: unknown): item is Element {
    return reflection.isInstance(item, Element);
}

export interface ElementNode extends AstNode {
    readonly $container: ArchiMateDiagram;
    readonly $type: 'ElementNode';
    customProperties: Array<CustomProperty>;
    description?: string;
    element: Reference<Element>;
    height: number;
    id: string;
    name?: string;
    width: number;
    x: number;
    y: number;
}

export const ElementNode = 'ElementNode';

export function isElementNode(item: unknown): item is ElementNode {
    return reflection.isInstance(item, ElementNode);
}

export interface Entity extends AstNode {
    readonly $container: CrossModelRoot;
    readonly $type: 'Entity';
    attributes: Array<EntityAttribute>;
    customProperties: Array<CustomProperty>;
    description?: string;
    id: string;
    name?: string;
}

export const Entity = 'Entity';

export function isEntity(item: unknown): item is Entity {
    return reflection.isInstance(item, Entity);
}

export interface EntityNode extends AstNode {
    readonly $container: SystemDiagram;
    readonly $type: 'EntityNode';
    customProperties: Array<CustomProperty>;
    description?: string;
    entity: Reference<Entity>;
    height: number;
    id: string;
    name?: string;
    width: number;
    x: number;
    y: number;
}

export const EntityNode = 'EntityNode';

export function isEntityNode(item: unknown): item is EntityNode {
    return reflection.isInstance(item, EntityNode);
}

export interface JoinCondition extends AstNode {
    readonly $container: SourceObject;
    readonly $type: 'JoinCondition';
    expression: BinaryExpression;
}

export const JoinCondition = 'JoinCondition';

export function isJoinCondition(item: unknown): item is JoinCondition {
    return reflection.isInstance(item, JoinCondition);
}

export interface Mapping extends AstNode {
    readonly $container: CrossModelRoot;
    readonly $type: 'Mapping';
    customProperties: Array<CustomProperty>;
    id: string;
    sources: Array<SourceObject>;
    target: TargetObject;
}

export const Mapping = 'Mapping';

export function isMapping(item: unknown): item is Mapping {
    return reflection.isInstance(item, Mapping);
}

export interface NumberLiteral extends AstNode {
    readonly $container: BinaryExpression;
    readonly $type: 'NumberLiteral';
    value: number;
}

export const NumberLiteral = 'NumberLiteral';

export function isNumberLiteral(item: unknown): item is NumberLiteral {
    return reflection.isInstance(item, NumberLiteral);
}

export interface Relation extends AstNode {
    readonly $container: ArchiMateModel | CrossModelRoot;
    readonly $type: 'Relation';
    customProperties: Array<CustomProperty>;
    description?: string;
    id: string;
    name?: string;
    source: Reference<Element>;
    target: Reference<Element>;
    type: RelationType;
}

export const Relation = 'Relation';

export function isRelation(item: unknown): item is Relation {
    return reflection.isInstance(item, Relation);
}

export interface RelationEdge extends AstNode {
    readonly $container: ArchiMateDiagram;
    readonly $type: 'RelationEdge';
    customProperties: Array<CustomProperty>;
    id: string;
    relation: Reference<Relation>;
    sourceNode: Reference<ElementNode>;
    targetNode: Reference<ElementNode>;
}

export const RelationEdge = 'RelationEdge';

export function isRelationEdge(item: unknown): item is RelationEdge {
    return reflection.isInstance(item, RelationEdge);
}

export interface Relationship extends AstNode {
    readonly $container: CrossModelRoot;
    readonly $type: 'Relationship';
    attributes: Array<RelationshipAttribute>;
    child: Reference<Entity>;
    customProperties: Array<CustomProperty>;
    description?: string;
    id: string;
    name?: string;
    parent: Reference<Entity>;
    type: string;
}

export const Relationship = 'Relationship';

export function isRelationship(item: unknown): item is Relationship {
    return reflection.isInstance(item, Relationship);
}

export interface RelationshipAttribute extends AstNode {
    readonly $container: Relationship;
    readonly $type: 'RelationshipAttribute';
    child: Reference<Attribute>;
    customProperties: Array<CustomProperty>;
    parent: Reference<Attribute>;
}

export const RelationshipAttribute = 'RelationshipAttribute';

export function isRelationshipAttribute(item: unknown): item is RelationshipAttribute {
    return reflection.isInstance(item, RelationshipAttribute);
}

export interface RelationshipEdge extends AstNode {
    readonly $container: SystemDiagram;
    readonly $type: 'RelationshipEdge';
    customProperties: Array<CustomProperty>;
    id: string;
    relationship: Reference<Relationship>;
    sourceNode: Reference<EntityNode>;
    targetNode: Reference<EntityNode>;
}

export const RelationshipEdge = 'RelationshipEdge';

export function isRelationshipEdge(item: unknown): item is RelationshipEdge {
    return reflection.isInstance(item, RelationshipEdge);
}

export interface SourceObject extends AstNode {
    readonly $container: Mapping;
    readonly $type: 'SourceObject';
    conditions: Array<SourceObjectCondition>;
    customProperties: Array<CustomProperty>;
    dependencies: Array<SourceObjectDependency>;
    entity: Reference<Entity>;
    id: string;
    join: JoinType;
}

export const SourceObject = 'SourceObject';

export function isSourceObject(item: unknown): item is SourceObject {
    return reflection.isInstance(item, SourceObject);
}

export interface SourceObjectAttributeReference extends AstNode {
    readonly $container: BinaryExpression;
    readonly $type: 'SourceObjectAttributeReference';
    value: Reference<SourceObjectAttribute>;
}

export const SourceObjectAttributeReference = 'SourceObjectAttributeReference';

export function isSourceObjectAttributeReference(item: unknown): item is SourceObjectAttributeReference {
    return reflection.isInstance(item, SourceObjectAttributeReference);
}

export interface SourceObjectDependency extends AstNode {
    readonly $container: SourceObject;
    readonly $type: 'SourceObjectDependency';
    source: Reference<SourceObject>;
}

export const SourceObjectDependency = 'SourceObjectDependency';

export function isSourceObjectDependency(item: unknown): item is SourceObjectDependency {
    return reflection.isInstance(item, SourceObjectDependency);
}

export interface StringLiteral extends AstNode {
    readonly $container: BinaryExpression;
    readonly $type: 'StringLiteral';
    value: string;
}

export const StringLiteral = 'StringLiteral';

export function isStringLiteral(item: unknown): item is StringLiteral {
    return reflection.isInstance(item, StringLiteral);
}

export interface SystemDiagram extends AstNode {
    readonly $container: CrossModelRoot;
    readonly $type: 'SystemDiagram';
    customProperties: Array<CustomProperty>;
    description?: string;
    edges: Array<RelationshipEdge>;
    id?: string;
    name?: string;
    nodes: Array<EntityNode>;
}

export const SystemDiagram = 'SystemDiagram';

export function isSystemDiagram(item: unknown): item is SystemDiagram {
    return reflection.isInstance(item, SystemDiagram);
}

export interface TargetObject extends AstNode {
    readonly $container: Mapping;
    readonly $type: 'TargetObject';
    customProperties: Array<CustomProperty>;
    entity: Reference<Entity>;
    mappings: Array<AttributeMapping>;
}

export const TargetObject = 'TargetObject';

export function isTargetObject(item: unknown): item is TargetObject {
    return reflection.isInstance(item, TargetObject);
}

export interface WithCustomProperties extends AstNode {
    readonly $type: 'EntityAttribute' | 'EntityNodeAttribute' | 'SourceObjectAttribute' | 'TargetObjectAttribute' | 'WithCustomProperties';
    customProperties: Array<CustomProperty>;
}

export const WithCustomProperties = 'WithCustomProperties';

export function isWithCustomProperties(item: unknown): item is WithCustomProperties {
    return reflection.isInstance(item, WithCustomProperties);
}

export interface EntityAttribute extends Attribute, WithCustomProperties {
    readonly $type: 'EntityAttribute' | 'EntityNodeAttribute';
    identifier: boolean;
}

export const EntityAttribute = 'EntityAttribute';

export function isEntityAttribute(item: unknown): item is EntityAttribute {
    return reflection.isInstance(item, EntityAttribute);
}

export interface SourceObjectAttribute extends Attribute, WithCustomProperties {
    readonly $type: 'SourceObjectAttribute';
}

export const SourceObjectAttribute = 'SourceObjectAttribute';

export function isSourceObjectAttribute(item: unknown): item is SourceObjectAttribute {
    return reflection.isInstance(item, SourceObjectAttribute);
}

export interface TargetObjectAttribute extends Attribute, WithCustomProperties {
    readonly $type: 'TargetObjectAttribute';
}

export const TargetObjectAttribute = 'TargetObjectAttribute';

export function isTargetObjectAttribute(item: unknown): item is TargetObjectAttribute {
    return reflection.isInstance(item, TargetObjectAttribute);
}

export interface EntityNodeAttribute extends EntityAttribute, WithCustomProperties {
    readonly $type: 'EntityNodeAttribute';
}

export const EntityNodeAttribute = 'EntityNodeAttribute';

export function isEntityNodeAttribute(item: unknown): item is EntityNodeAttribute {
    return reflection.isInstance(item, EntityNodeAttribute);
}

export type CrossModelAstType = {
    ArchiMateDiagram: ArchiMateDiagram
    ArchiMateModel: ArchiMateModel
    Attribute: Attribute
    AttributeMapping: AttributeMapping
    AttributeMappingSource: AttributeMappingSource
    AttributeMappingTarget: AttributeMappingTarget
    BinaryExpression: BinaryExpression
    BooleanExpression: BooleanExpression
    CrossModelRoot: CrossModelRoot
    CustomProperty: CustomProperty
    Element: Element
    ElementNode: ElementNode
    Entity: Entity
    EntityAttribute: EntityAttribute
    EntityNode: EntityNode
    EntityNodeAttribute: EntityNodeAttribute
    JoinCondition: JoinCondition
    Mapping: Mapping
    NumberLiteral: NumberLiteral
    Relation: Relation
    RelationEdge: RelationEdge
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
    WithCustomProperties: WithCustomProperties
}

export class CrossModelAstReflection extends AbstractAstReflection {

    getAllTypes(): string[] {
        return [ArchiMateDiagram, ArchiMateModel, Attribute, AttributeMapping, AttributeMappingSource, AttributeMappingTarget, BinaryExpression, BooleanExpression, CrossModelRoot, CustomProperty, Element, ElementNode, Entity, EntityAttribute, EntityNode, EntityNodeAttribute, JoinCondition, Mapping, NumberLiteral, Relation, RelationEdge, Relationship, RelationshipAttribute, RelationshipEdge, SourceObject, SourceObjectAttribute, SourceObjectAttributeReference, SourceObjectCondition, SourceObjectDependency, StringLiteral, SystemDiagram, TargetObject, TargetObjectAttribute, WithCustomProperties];
    }

    protected override computeIsSubtype(subtype: string, supertype: string): boolean {
        switch (subtype) {
            case EntityAttribute:
            case SourceObjectAttribute:
            case TargetObjectAttribute: {
                return this.isSubtype(Attribute, supertype) || this.isSubtype(WithCustomProperties, supertype);
            }
            case EntityNodeAttribute: {
                return this.isSubtype(EntityAttribute, supertype) || this.isSubtype(WithCustomProperties, supertype);
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
            case 'ElementNode:element':
            case 'Relation:source':
            case 'Relation:target': {
                return Element;
            }
            case 'EntityNode:entity':
            case 'Relationship:child':
            case 'Relationship:parent':
            case 'SourceObject:entity':
            case 'TargetObject:entity': {
                return Entity;
            }
            case 'RelationEdge:relation': {
                return Relation;
            }
            case 'RelationEdge:sourceNode':
            case 'RelationEdge:targetNode': {
                return ElementNode;
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
            case ArchiMateDiagram: {
                return {
                    name: ArchiMateDiagram,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'edges', defaultValue: [] },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'nodes', defaultValue: [] }
                    ]
                };
            }
            case ArchiMateModel: {
                return {
                    name: ArchiMateModel,
                    properties: [
                        { name: 'edges', defaultValue: [] },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'nodes', defaultValue: [] }
                    ]
                };
            }
            case Attribute: {
                return {
                    name: Attribute,
                    properties: [
                        { name: 'datatype' },
                        { name: 'description' },
                        { name: 'id' },
                        { name: 'name' }
                    ]
                };
            }
            case AttributeMapping: {
                return {
                    name: AttributeMapping,
                    properties: [
                        { name: 'attribute' },
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'expression' },
                        { name: 'sources', defaultValue: [] }
                    ]
                };
            }
            case AttributeMappingSource: {
                return {
                    name: AttributeMappingSource,
                    properties: [
                        { name: 'value' }
                    ]
                };
            }
            case AttributeMappingTarget: {
                return {
                    name: AttributeMappingTarget,
                    properties: [
                        { name: 'value' }
                    ]
                };
            }
            case BinaryExpression: {
                return {
                    name: BinaryExpression,
                    properties: [
                        { name: 'left' },
                        { name: 'op' },
                        { name: 'right' }
                    ]
                };
            }
            case CrossModelRoot: {
                return {
                    name: CrossModelRoot,
                    properties: [
                        { name: 'archiMateDiagram' },
                        { name: 'archiMateModel' },
                        { name: 'element' },
                        { name: 'entity' },
                        { name: 'mapping' },
                        { name: 'relation' },
                        { name: 'relationship' },
                        { name: 'systemDiagram' }
                    ]
                };
            }
            case CustomProperty: {
                return {
                    name: CustomProperty,
                    properties: [
                        { name: 'name' },
                        { name: 'value' }
                    ]
                };
            }
            case Element: {
                return {
                    name: Element,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'description' },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'type' }
                    ]
                };
            }
            case ElementNode: {
                return {
                    name: ElementNode,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'description' },
                        { name: 'element' },
                        { name: 'height' },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'width' },
                        { name: 'x' },
                        { name: 'y' }
                    ]
                };
            }
            case Entity: {
                return {
                    name: Entity,
                    properties: [
                        { name: 'attributes', defaultValue: [] },
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'description' },
                        { name: 'id' },
                        { name: 'name' }
                    ]
                };
            }
            case EntityNode: {
                return {
                    name: EntityNode,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'description' },
                        { name: 'entity' },
                        { name: 'height' },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'width' },
                        { name: 'x' },
                        { name: 'y' }
                    ]
                };
            }
            case JoinCondition: {
                return {
                    name: JoinCondition,
                    properties: [
                        { name: 'expression' }
                    ]
                };
            }
            case Mapping: {
                return {
                    name: Mapping,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'id' },
                        { name: 'sources', defaultValue: [] },
                        { name: 'target' }
                    ]
                };
            }
            case NumberLiteral: {
                return {
                    name: NumberLiteral,
                    properties: [
                        { name: 'value' }
                    ]
                };
            }
            case Relation: {
                return {
                    name: Relation,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'description' },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'source' },
                        { name: 'target' },
                        { name: 'type' }
                    ]
                };
            }
            case RelationEdge: {
                return {
                    name: RelationEdge,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'id' },
                        { name: 'relation' },
                        { name: 'sourceNode' },
                        { name: 'targetNode' }
                    ]
                };
            }
            case Relationship: {
                return {
                    name: Relationship,
                    properties: [
                        { name: 'attributes', defaultValue: [] },
                        { name: 'child' },
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'description' },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'parent' },
                        { name: 'type' }
                    ]
                };
            }
            case RelationshipAttribute: {
                return {
                    name: RelationshipAttribute,
                    properties: [
                        { name: 'child' },
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'parent' }
                    ]
                };
            }
            case RelationshipEdge: {
                return {
                    name: RelationshipEdge,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'id' },
                        { name: 'relationship' },
                        { name: 'sourceNode' },
                        { name: 'targetNode' }
                    ]
                };
            }
            case SourceObject: {
                return {
                    name: SourceObject,
                    properties: [
                        { name: 'conditions', defaultValue: [] },
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'dependencies', defaultValue: [] },
                        { name: 'entity' },
                        { name: 'id' },
                        { name: 'join' }
                    ]
                };
            }
            case SourceObjectAttributeReference: {
                return {
                    name: SourceObjectAttributeReference,
                    properties: [
                        { name: 'value' }
                    ]
                };
            }
            case SourceObjectDependency: {
                return {
                    name: SourceObjectDependency,
                    properties: [
                        { name: 'source' }
                    ]
                };
            }
            case StringLiteral: {
                return {
                    name: StringLiteral,
                    properties: [
                        { name: 'value' }
                    ]
                };
            }
            case SystemDiagram: {
                return {
                    name: SystemDiagram,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'description' },
                        { name: 'edges', defaultValue: [] },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'nodes', defaultValue: [] }
                    ]
                };
            }
            case TargetObject: {
                return {
                    name: TargetObject,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'entity' },
                        { name: 'mappings', defaultValue: [] }
                    ]
                };
            }
            case WithCustomProperties: {
                return {
                    name: WithCustomProperties,
                    properties: [
                        { name: 'customProperties', defaultValue: [] }
                    ]
                };
            }
            case EntityAttribute: {
                return {
                    name: EntityAttribute,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'datatype' },
                        { name: 'description' },
                        { name: 'id' },
                        { name: 'identifier', defaultValue: false },
                        { name: 'name' }
                    ]
                };
            }
            case SourceObjectAttribute: {
                return {
                    name: SourceObjectAttribute,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'datatype' },
                        { name: 'description' },
                        { name: 'id' },
                        { name: 'name' }
                    ]
                };
            }
            case TargetObjectAttribute: {
                return {
                    name: TargetObjectAttribute,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'datatype' },
                        { name: 'description' },
                        { name: 'id' },
                        { name: 'name' }
                    ]
                };
            }
            case EntityNodeAttribute: {
                return {
                    name: EntityNodeAttribute,
                    properties: [
                        { name: 'customProperties', defaultValue: [] },
                        { name: 'datatype' },
                        { name: 'description' },
                        { name: 'id' },
                        { name: 'identifier', defaultValue: false },
                        { name: 'name' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    properties: []
                };
            }
        }
    }
}

export const reflection = new CrossModelAstReflection();
