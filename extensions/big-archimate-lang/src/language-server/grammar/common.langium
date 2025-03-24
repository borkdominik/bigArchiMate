import 'terminals'

fragment Properties:
    'properties' ':'
        INDENT
            (LIST_ITEM properties+=Property)+
        DEDENT
;

Property:
    'id' ':' id=ID
    'name' ':'  name=STRING
    ('value' ':' value=STRING)?;