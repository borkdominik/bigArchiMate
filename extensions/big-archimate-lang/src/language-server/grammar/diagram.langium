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
            ('name' ':'  name=STRING)?
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
            Properties?
        DEDENT
    )*
;

ElementNode:
    'id' ':' id=ID
    'element' ':' element=[Element:IDReference]
    'x' ':' x=NUMBER
    'y' ':' y=NUMBER
    'width' ':' width=NUMBER
    'height' ':' height=NUMBER
;

JunctionNode:
    'id' ':' id=ID
    'junction' ':' junction=[Junction:IDReference]
    'x' ':' x=NUMBER
    'y' ':' y=NUMBER
    'width' ':' width=NUMBER
    'height' ':' height=NUMBER
;

ElementNodeOrJunctionNode:
    ElementNode | JunctionNode;

RelationRoutingPoint:
    'x' ':' x=NUMBER
    'y' ':' y=NUMBER;

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
