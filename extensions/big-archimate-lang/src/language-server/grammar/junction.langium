import 'terminals'
import 'relationship'

Junction:
    'junction' ':'
        INDENT
            'id' ':' id=ID
            ('name' ':' name=STRING)?
            ('documentation' ':' documentation=STRING)?
            Properties?
        DEDENT
;
