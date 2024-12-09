import 'terminals'
import 'element'
import 'relation'

ArchiMateModel:
    'archiMateModel' ':'
        INDENT
            'id' ':' id=ID
            'name' ':' name=STRING
            'nodes' ':'
                INDENT
                    (LIST_ITEM nodes+=Element)+
                DEDENT
            'edges' ':'
                INDENT
                    (LIST_ITEM edges+=Relation)+
                DEDENT
        DEDENT;
