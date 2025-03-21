import 'terminals'
import 'common'

Element:
    'element' ':'
        INDENT
            'id' ':' id=ID
            'name' ':' name=STRING
            ('documentation' ':' documentation=STRING)?
            'type' ':'  type=ElementType
            Properties?
        DEDENT
;
