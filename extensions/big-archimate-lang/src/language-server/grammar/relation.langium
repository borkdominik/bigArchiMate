import 'terminals'
import 'element'
import 'junction'

ElementOrJunction:
    Element | Junction;

Relation:
    'relation' ':'
        INDENT
            'id' ':' id=ID
            'type' ':'  type=RelationType
            'source' ':'  source=[ElementOrJunction:IDReference]
            'target' ':'  target=[ElementOrJunction:IDReference]
            Optionals?
        DEDENT
;
