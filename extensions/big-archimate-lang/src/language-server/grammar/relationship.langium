import 'terminals'
import 'element'
import 'junction'

ElementOrJunction:
    Element | Junction;

Relationship:
    'relationship' ':'
        INDENT
            'id' ':' id=ID
            'type' ':'  type=RelationshipType
            'source' ':'  source=[ElementOrJunction:IDReference]
            'target' ':'  target=[ElementOrJunction:IDReference]
            ('name' ':' name=STRING)?
            ('documentation' ':' documentation=STRING)?
            Properties?
        DEDENT
;
