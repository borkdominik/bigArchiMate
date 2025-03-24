import 'terminals'
import 'relation'

Junction:
    'junction' ':'
        INDENT
            'id' ':' id=ID
            ('name' ':' name=STRING)?
            ('documentation' ':' documentation=STRING)?
            Properties?
        DEDENT
;
