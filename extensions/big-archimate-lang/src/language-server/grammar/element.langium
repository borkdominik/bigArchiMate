import 'terminals'
import 'common'

Element:
    'element' ':'
        INDENT
            'id' ':' id=ID
            'type' ':'  type=ElementType
            'name' ':' name=STRING
            ('documentation' ':' documentation=STRING)?
            Properties?
        DEDENT
;
