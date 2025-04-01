import 'terminals'
import 'relation'

Junction:
    'junction' ':'
        INDENT
            'id' ':' id=ID
            'type' ':' type=JunctionType
            Optionals?
        DEDENT
;
