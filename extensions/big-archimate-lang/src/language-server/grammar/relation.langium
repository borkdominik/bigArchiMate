import 'terminals'
import 'element'
import 'junction'

ElementOrJunction:
    Element | Junction;

ElementOrJunctionID returns string:
    ElementID | ID;

Relation:
    'relation' ':'
        INDENT
            'id' ':' id=ID
            ('name' ':' name=STRING)?
            ('documentation' ':' documentation=STRING)?
            'type' ':'  type=RelationType
            'source' ':'  source=[ElementOrJunction:ElementOrJunctionID]
            'target' ':'  target=[ElementOrJunction:ElementOrJunctionID]
            Properties?
        DEDENT
;

// See https://langium.org/docs/recipes/keywords-as-identifiers/
RelationID returns string:
    ID | RelationType;

RelationType returns string:
    'Access' |
    'Aggregation' |
    'Association' |
    'Assignment' |
    'Composition' |
    'Flow' |
    'Influence' |
    'Realization' |
    'Serving' |
    'Specialization' |
    'Triggering';