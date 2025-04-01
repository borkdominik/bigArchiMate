import 'terminals'
import 'relation'

Junction:
    'junction' ':'
        INDENT
            'id' ':' id=ID
            'type' ':' type=JunctionType
            ('name' ':' name=STRING)?
            ('documentation' ':' documentation=STRING)?
            Properties?
        DEDENT
;
