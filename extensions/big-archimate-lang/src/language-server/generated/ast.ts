/******************************************************************************
 * This file was generated by langium-cli 3.3.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable */
import type { AstNode, Reference, ReferenceInfo, TypeMetaData } from 'langium';
import { AbstractAstReflection } from 'langium';

export const ArchiMateLanguageTerminals = {
    STRING: /"[^"]*"|'[^']*'/,
    NUMBER: /(-)?[0-9]+(\.[0-9]+)?/,
    _ID: /[_a-zA-Z][\w_\-~$#@/\d]*/,
    SL_COMMENT: /#[^\n\r]*/,
    INDENT: /:synthetic-indent:/,
    DEDENT: /:synthetic-dedent:/,
    LIST_ITEM: /- /,
    NEWLINE: /[/\r\n|\r|\n/]+/,
    WS: /[ \t]+/,
};

export type ArchiMateLanguageTerminalNames = keyof typeof ArchiMateLanguageTerminals;

export type ArchiMateLanguageKeywordNames = 
    | "."
    | ":"
    | "Access"
    | "Aggregation"
    | "And"
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
    | "Grouping"
    | "ImplementationEvent"
    | "Influence"
    | "Location"
    | "Material"
    | "Meaning"
    | "Node"
    | "Or"
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
    | "diagram"
    | "documentation"
    | "edges"
    | "element"
    | "height"
    | "id"
    | "junction"
    | "name"
    | "nodes"
    | "properties"
    | "relation"
    | "routingPoints"
    | "source"
    | "sourceNode"
    | "target"
    | "targetNode"
    | "type"
    | "value"
    | "width"
    | "x"
    | "y";

export type ArchiMateLanguageTokenNames = ArchiMateLanguageTerminalNames | ArchiMateLanguageKeywordNames;

export type ElementNodeOrJunctionNode = ElementNode | JunctionNode;

export const ElementNodeOrJunctionNode = 'ElementNodeOrJunctionNode';

export function isElementNodeOrJunctionNode(item: unknown): item is ElementNodeOrJunctionNode {
    return reflection.isInstance(item, ElementNodeOrJunctionNode);
}

export type ElementOrJunction = Element | Junction;

export const ElementOrJunction = 'ElementOrJunction';

export function isElementOrJunction(item: unknown): item is ElementOrJunction {
    return reflection.isInstance(item, ElementOrJunction);
}

export type ElementType = 'ApplicationCollaboration' | 'ApplicationComponent' | 'ApplicationEvent' | 'ApplicationFunction' | 'ApplicationInteraction' | 'ApplicationInterface' | 'ApplicationProcess' | 'ApplicationService' | 'Artifact' | 'Assessment' | 'BusinessActor' | 'BusinessCollaboration' | 'BusinessEvent' | 'BusinessFunction' | 'BusinessInteraction' | 'BusinessInterface' | 'BusinessObject' | 'BusinessProcess' | 'BusinessRole' | 'BusinessService' | 'Capability' | 'CommunicationNetwork' | 'Constraint' | 'Contract' | 'CourseOfAction' | 'DataObject' | 'Deliverable' | 'Device' | 'DistributionNetwork' | 'Driver' | 'Equipment' | 'Facility' | 'Gap' | 'Goal' | 'Grouping' | 'ImplementationEvent' | 'Location' | 'Material' | 'Meaning' | 'Node' | 'Outcome' | 'Path' | 'Plateau' | 'Principle' | 'Product' | 'Representation' | 'Requirement' | 'Resource' | 'Stakeholder' | 'SystemSoftware' | 'TechnologyCollaboration' | 'TechnologyEvent' | 'TechnologyFunction' | 'TechnologyInteraction' | 'TechnologyInterface' | 'TechnologyProcess' | 'TechnologyService' | 'Value' | 'ValueStream' | 'WorkPackage';

export function isElementType(item: unknown): item is ElementType {
    return item === 'ApplicationCollaboration' || item === 'ApplicationComponent' || item === 'ApplicationEvent' || item === 'ApplicationFunction' || item === 'ApplicationInterface' || item === 'ApplicationInteraction' || item === 'ApplicationProcess' || item === 'ApplicationService' || item === 'Artifact' || item === 'Assessment' || item === 'BusinessActor' || item === 'BusinessCollaboration' || item === 'BusinessEvent' || item === 'BusinessFunction' || item === 'BusinessInteraction' || item === 'BusinessInterface' || item === 'BusinessObject' || item === 'BusinessProcess' || item === 'BusinessRole' || item === 'BusinessService' || item === 'Capability' || item === 'Constraint' || item === 'CommunicationNetwork' || item === 'Contract' || item === 'CourseOfAction' || item === 'DataObject' || item === 'Deliverable' || item === 'Device' || item === 'DistributionNetwork' || item === 'Driver' || item === 'Equipment' || item === 'Facility' || item === 'Gap' || item === 'Goal' || item === 'Grouping' || item === 'ImplementationEvent' || item === 'Location' || item === 'Material' || item === 'Meaning' || item === 'Node' || item === 'Outcome' || item === 'Path' || item === 'Plateau' || item === 'Principle' || item === 'Product' || item === 'Requirement' || item === 'Representation' || item === 'Resource' || item === 'Stakeholder' || item === 'SystemSoftware' || item === 'TechnologyCollaboration' || item === 'TechnologyEvent' || item === 'TechnologyFunction' || item === 'TechnologyInteraction' || item === 'TechnologyInterface' || item === 'TechnologyProcess' || item === 'TechnologyService' || item === 'Value' || item === 'ValueStream' || item === 'WorkPackage';
}

export type ID = ElementType | RelationType | string;

export function isID(item: unknown): item is ID {
    return isRelationType(item) || isElementType(item) || (typeof item === 'string' && (/[_a-zA-Z][\w_\-~$#@/\d]*/.test(item)));
}

export type IDReference = string;

export function isIDReference(item: unknown): item is IDReference {
    return typeof item === 'string';
}

export type JunctionType = 'And' | 'Or';

export function isJunctionType(item: unknown): item is JunctionType {
    return item === 'And' || item === 'Or';
}

export type RelationType = 'Access' | 'Aggregation' | 'Assignment' | 'Association' | 'Composition' | 'Flow' | 'Influence' | 'Realization' | 'Serving' | 'Specialization' | 'Triggering';

export function isRelationType(item: unknown): item is RelationType {
    return item === 'Access' || item === 'Aggregation' || item === 'Association' || item === 'Assignment' || item === 'Composition' || item === 'Flow' || item === 'Influence' || item === 'Realization' || item === 'Serving' || item === 'Specialization' || item === 'Triggering';
}

export interface ArchiMateRoot extends AstNode {
    readonly $type: 'ArchiMateRoot';
    diagram?: Diagram;
    element?: Element;
    junction?: Junction;
    relation?: Relation;
}

export const ArchiMateRoot = 'ArchiMateRoot';

export function isArchiMateRoot(item: unknown): item is ArchiMateRoot {
    return reflection.isInstance(item, ArchiMateRoot);
}

export interface Diagram extends AstNode {
    readonly $container: ArchiMateRoot;
    readonly $type: 'Diagram';
    documentation?: string;
    edges: Array<RelationEdge>;
    id?: ID;
    name?: string;
    nodes: Array<ElementNode | JunctionNode>;
    properties: Array<Property>;
}

export const Diagram = 'Diagram';

export function isDiagram(item: unknown): item is Diagram {
    return reflection.isInstance(item, Diagram);
}

export interface Element extends AstNode {
    readonly $container: ArchiMateRoot;
    readonly $type: 'Element';
    documentation?: string;
    id: ID;
    name?: string;
    properties: Array<Property>;
    type: ElementType;
}

export const Element = 'Element';

export function isElement(item: unknown): item is Element {
    return reflection.isInstance(item, Element);
}

export interface ElementNode extends AstNode {
    readonly $container: Diagram;
    readonly $type: 'ElementNode';
    element: Reference<Element>;
    height: number;
    id: ID;
    width: number;
    x: number;
    y: number;
}

export const ElementNode = 'ElementNode';

export function isElementNode(item: unknown): item is ElementNode {
    return reflection.isInstance(item, ElementNode);
}

export interface Junction extends AstNode {
    readonly $container: ArchiMateRoot;
    readonly $type: 'Junction';
    documentation?: string;
    id: ID;
    name?: string;
    properties: Array<Property>;
    type: JunctionType;
}

export const Junction = 'Junction';

export function isJunction(item: unknown): item is Junction {
    return reflection.isInstance(item, Junction);
}

export interface JunctionNode extends AstNode {
    readonly $container: Diagram;
    readonly $type: 'JunctionNode';
    height: number;
    id: ID;
    junction: Reference<Junction>;
    width: number;
    x: number;
    y: number;
}

export const JunctionNode = 'JunctionNode';

export function isJunctionNode(item: unknown): item is JunctionNode {
    return reflection.isInstance(item, JunctionNode);
}

export interface Property extends AstNode {
    readonly $container: Diagram | Element | Junction | Relation;
    readonly $type: 'Property';
    id: ID;
    name: string;
    value?: string;
}

export const Property = 'Property';

export function isProperty(item: unknown): item is Property {
    return reflection.isInstance(item, Property);
}

export interface Relation extends AstNode {
    readonly $container: ArchiMateRoot;
    readonly $type: 'Relation';
    documentation?: string;
    id: ID;
    name?: string;
    properties: Array<Property>;
    source: Reference<ElementOrJunction>;
    target: Reference<ElementOrJunction>;
    type: RelationType;
}

export const Relation = 'Relation';

export function isRelation(item: unknown): item is Relation {
    return reflection.isInstance(item, Relation);
}

export interface RelationEdge extends AstNode {
    readonly $container: Diagram;
    readonly $type: 'RelationEdge';
    id: ID;
    relation: Reference<Relation>;
    routingPoints: Array<RelationRoutingPoint>;
    sourceNode: Reference<ElementNodeOrJunctionNode>;
    targetNode: Reference<ElementNodeOrJunctionNode>;
}

export const RelationEdge = 'RelationEdge';

export function isRelationEdge(item: unknown): item is RelationEdge {
    return reflection.isInstance(item, RelationEdge);
}

export interface RelationRoutingPoint extends AstNode {
    readonly $container: RelationEdge;
    readonly $type: 'RelationRoutingPoint';
    x: number;
    y: number;
}

export const RelationRoutingPoint = 'RelationRoutingPoint';

export function isRelationRoutingPoint(item: unknown): item is RelationRoutingPoint {
    return reflection.isInstance(item, RelationRoutingPoint);
}

export type ArchiMateLanguageAstType = {
    ArchiMateRoot: ArchiMateRoot
    Diagram: Diagram
    Element: Element
    ElementNode: ElementNode
    ElementNodeOrJunctionNode: ElementNodeOrJunctionNode
    ElementOrJunction: ElementOrJunction
    Junction: Junction
    JunctionNode: JunctionNode
    Property: Property
    Relation: Relation
    RelationEdge: RelationEdge
    RelationRoutingPoint: RelationRoutingPoint
}

export class ArchiMateLanguageAstReflection extends AbstractAstReflection {

    getAllTypes(): string[] {
        return [ArchiMateRoot, Diagram, Element, ElementNode, ElementNodeOrJunctionNode, ElementOrJunction, Junction, JunctionNode, Property, Relation, RelationEdge, RelationRoutingPoint];
    }

    protected override computeIsSubtype(subtype: string, supertype: string): boolean {
        switch (subtype) {
            case Element:
            case Junction: {
                return this.isSubtype(ElementOrJunction, supertype);
            }
            case ElementNode:
            case JunctionNode: {
                return this.isSubtype(ElementNodeOrJunctionNode, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(refInfo: ReferenceInfo): string {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'ElementNode:element': {
                return Element;
            }
            case 'JunctionNode:junction': {
                return Junction;
            }
            case 'Relation:source':
            case 'Relation:target': {
                return ElementOrJunction;
            }
            case 'RelationEdge:relation': {
                return Relation;
            }
            case 'RelationEdge:sourceNode':
            case 'RelationEdge:targetNode': {
                return ElementNodeOrJunctionNode;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }

    getTypeMetaData(type: string): TypeMetaData {
        switch (type) {
            case ArchiMateRoot: {
                return {
                    name: ArchiMateRoot,
                    properties: [
                        { name: 'diagram' },
                        { name: 'element' },
                        { name: 'junction' },
                        { name: 'relation' }
                    ]
                };
            }
            case Diagram: {
                return {
                    name: Diagram,
                    properties: [
                        { name: 'documentation' },
                        { name: 'edges', defaultValue: [] },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'nodes', defaultValue: [] },
                        { name: 'properties', defaultValue: [] }
                    ]
                };
            }
            case Element: {
                return {
                    name: Element,
                    properties: [
                        { name: 'documentation' },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'properties', defaultValue: [] },
                        { name: 'type' }
                    ]
                };
            }
            case ElementNode: {
                return {
                    name: ElementNode,
                    properties: [
                        { name: 'element' },
                        { name: 'height' },
                        { name: 'id' },
                        { name: 'width' },
                        { name: 'x' },
                        { name: 'y' }
                    ]
                };
            }
            case Junction: {
                return {
                    name: Junction,
                    properties: [
                        { name: 'documentation' },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'properties', defaultValue: [] },
                        { name: 'type' }
                    ]
                };
            }
            case JunctionNode: {
                return {
                    name: JunctionNode,
                    properties: [
                        { name: 'height' },
                        { name: 'id' },
                        { name: 'junction' },
                        { name: 'width' },
                        { name: 'x' },
                        { name: 'y' }
                    ]
                };
            }
            case Property: {
                return {
                    name: Property,
                    properties: [
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'value' }
                    ]
                };
            }
            case Relation: {
                return {
                    name: Relation,
                    properties: [
                        { name: 'documentation' },
                        { name: 'id' },
                        { name: 'name' },
                        { name: 'properties', defaultValue: [] },
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
                        { name: 'id' },
                        { name: 'relation' },
                        { name: 'routingPoints', defaultValue: [] },
                        { name: 'sourceNode' },
                        { name: 'targetNode' }
                    ]
                };
            }
            case RelationRoutingPoint: {
                return {
                    name: RelationRoutingPoint,
                    properties: [
                        { name: 'x' },
                        { name: 'y' }
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

export const reflection = new ArchiMateLanguageAstReflection();
