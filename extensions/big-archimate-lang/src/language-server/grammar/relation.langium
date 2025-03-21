import 'terminals'
import 'element'
import 'junction'

ElementOrJunction:
    Element | Junction;

Relation:
    'relation' ':'
        INDENT
            'id' ':' id=ID
            ('name' ':' name=STRING)?
            ('documentation' ':' documentation=STRING)?
            'type' ':'  type=RelationType
            'source' ':'  source=[ElementOrJunction:IDReference]
            'target' ':'  target=[ElementOrJunction:IDReference]
            Properties?
        DEDENT
;
