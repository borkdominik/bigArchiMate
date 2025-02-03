import 'terminals'
import 'relation'

Junction:
    'Junction' ':'
        INDENT
            'id' ':' id=ID
            ('name' ':' name=STRING)?
            ('documentation' ':' documentation=STRING)?
            'relations' ':'  relations+=[Relation:RelationID]
            Properties?
        DEDENT
;
