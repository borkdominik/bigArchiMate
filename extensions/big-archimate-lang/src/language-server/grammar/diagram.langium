import 'terminals'
import 'common'
import 'element'
import 'relation'

// Diagram defintion
Diagram:
    ('diagram') ':'
    (
        INDENT
            IDProperty
            ('nodes' ':'
                INDENT
                    (LIST_ITEM nodes+=(DiagramNode))+
                DEDENT
            )?
            ('edges' ':'
                INDENT
                    (LIST_ITEM edges+=RelationEdge)+
                DEDENT
            )?
            Optionals?
        DEDENT
    )*
;

fragment Coordinates:
    'x' ':' x=NUMBER
    'y' ':' y=NUMBER
;

fragment Dimensions:
    'width' ':' width=NUMBER
    'height' ':' height=NUMBER
;

ElementNode:
    IDProperty
    'element' ':' element=[Element:IDReference]
    Coordinates
    Dimensions
    ('children' ':'
        INDENT
            (LIST_ITEM children+=(DiagramNode))+
        DEDENT
    )?
;

JunctionNode:
    IDProperty
    'junction' ':' junction=[Junction:IDReference]
    Coordinates
    Dimensions
;

DiagramNode:
    ElementNode | JunctionNode;

RelationRoutingPoint:
    Coordinates;

RelationEdge:
    IDProperty
    'relation' ':' relation=[Relation:IDReference]
    'sourceNode' ':' sourceNode=[DiagramNode:IDReference]
    'targetNode' ':' targetNode=[DiagramNode:IDReference]
    ('routingPoints' ':'
        INDENT
            (LIST_ITEM routingPoints+=RelationRoutingPoint)+
        DEDENT
    )?
;
