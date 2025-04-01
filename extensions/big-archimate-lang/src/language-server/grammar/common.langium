import 'terminals'

fragment IDProperty:
    'id' ':' id=ID;

Property:
    IDProperty
    'name' ':'  name=STRING
    ('value' ':' value=STRING)?;

fragment Optionals:
    ('name' ':' name=STRING)?
    ('documentation' ':' documentation=STRING)?
    ('properties' ':'
        INDENT
            (LIST_ITEM properties+=Property)+
        DEDENT)?;