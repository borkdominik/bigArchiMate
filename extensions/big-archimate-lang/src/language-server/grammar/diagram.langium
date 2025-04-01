import 'terminals'
import 'common'
import 'element'
import 'relation'

// Diagram defintion
Diagram:
    ('diagram') ':' 
    (
        INDENT
            'id' ':' id=ID
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
    'id' ':' id=ID
    'element' ':' element=[Element:IDReference]
    Coordinates
    Dimensions
;

JunctionNode:
    'id' ':' id=ID
    'junction' ':' junction=[Junction:IDReference]
    Coordinates
    Dimensions
;

ElementNodeOrJunctionNode:
    ElementNode | JunctionNode;

RelationRoutingPoint:
    Coordinates;

RelationEdge:
    'id' ':' id=ID
    'relation' ':' relation=[Relation:IDReference]
    'sourceNode' ':' sourceNode=[ElementNodeOrJunctionNode:IDReference]
    'targetNode' ':' targetNode=[ElementNodeOrJunctionNode:IDReference]
    ('routingPoints' ':'
        INDENT
            (LIST_ITEM routingPoints+=RelationRoutingPoint)+
        DEDENT
    )?
;
