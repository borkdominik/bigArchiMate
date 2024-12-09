import 'terminals'
import 'element'
import 'relation'

// Diagram defintion
ArchiMateDiagram:
    ('archiMateDiagram') ':' 
    (
        INDENT
            'id' ':' id=ID
            ('name' ':'  name=STRING)?
            ('nodes' ':'
                INDENT 
                    (LIST_ITEM nodes+=ElementNode)+
                DEDENT
            )?
            ('edges' ':'
                INDENT 
                    (LIST_ITEM edges+=RelationEdge)+
                DEDENT
            )?
            CustomProperties?
        DEDENT
    )*
;


ElementNode:
    'id' ':' id=ID
    ('name' ':'  name=STRING)?
    ('description' ':' description=STRING)?
    'element' ':' element=[Element:IDReference]
    'x' ':' x=NUMBER
    'y' ':' y=NUMBER
    'width' ':' width=NUMBER
    'height' ':' height=NUMBER
    CustomProperties?
;

RelationEdge:
    'id' ':' id=ID
    'relation' ':' relation=[Relation:IDReference]
    'sourceNode' ':' sourceNode=[ElementNode:IDReference]
    'targetNode' ':' targetNode=[ElementNode:IDReference]
    CustomProperties?
;