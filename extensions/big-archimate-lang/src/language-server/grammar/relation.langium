import 'terminals'
import 'element'
import 'junction'

ElementOrJunction:
    Element | Junction;

Relation:
    'relation' ':'
        INDENT
            IDProperty
            'type' ':'  type=RelationType
            'source' ':'  source=[ElementOrJunction:IDReference]
            'target' ':'  target=[ElementOrJunction:IDReference]
            Optionals?
        DEDENT
;
