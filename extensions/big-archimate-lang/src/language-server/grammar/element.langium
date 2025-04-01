import 'terminals'
import 'common'

Element:
    'element' ':'
        INDENT
            IDProperty
            'type' ':'  type=ElementType
            Optionals?
        DEDENT
;
