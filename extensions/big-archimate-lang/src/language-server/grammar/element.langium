import 'terminals'
import 'common'

Element:
    'element' ':'
        INDENT
            'id' ':' id=ID
            'type' ':'  type=ElementType
            Optionals?
        DEDENT
;
