import 'terminals'

Property:
    'id' ':' id=ID
    'name' ':'  name=STRING
    ('value' ':' value=STRING)?;

fragment Optionals:
    ('name' ':' name=STRING)?
    ('documentation' ':' documentation=STRING)?
    ('properties' ':'
        INDENT
            (LIST_ITEM properties+=Property)+
        DEDENT)?;