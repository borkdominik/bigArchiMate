import 'terminals'
import 'element'

Relation:
    'relation' ':'
        INDENT
            'id' ':' id=ID
            ('name' ':' name=STRING)?
            ('description' ':' description=STRING)?
            'type' ':'  type=RelationType
            'source' ':'  source=[Element:ID]
            'target' ':'  target=[Element:ID]
            CustomProperties?
        DEDENT
;

RelationType returns string:
    'Access' |
    'Aggregation' |
    'Association' |
    'Assignment' |
    'Composition' |
    'Flow' |
    'Influence' |
    'Junction' |
    'Realization' |
    'Serving' |
    'Specialization' |
    'Triggering';