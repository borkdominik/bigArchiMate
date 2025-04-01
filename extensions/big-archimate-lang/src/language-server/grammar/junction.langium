import 'terminals'
import 'relation'

Junction:
    'junction' ':'
        INDENT
            IDProperty
            'type' ':' type=JunctionType
            Optionals?
        DEDENT
;
