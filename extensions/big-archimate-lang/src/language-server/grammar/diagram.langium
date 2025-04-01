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
                    (LIST_ITEM nodes+=(ElementNode|JunctionNode))+
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
;

JunctionNode:
    IDProperty
    'junction' ':' junction=[Junction:IDReference]
    Coordinates
    Dimensions
;

ElementNodeOrJunctionNode:
    ElementNode | JunctionNode;

RelationRoutingPoint:
    Coordinates;

RelationEdge:
    IDProperty
    'relation' ':' relation=[Relation:IDReference]
    'sourceNode' ':' sourceNode=[ElementNodeOrJunctionNode:IDReference]
    'targetNode' ':' targetNode=[ElementNodeOrJunctionNode:IDReference]
    ('routingPoints' ':'
        INDENT
            (LIST_ITEM routingPoints+=RelationRoutingPoint)+
        DEDENT
    )?
;
