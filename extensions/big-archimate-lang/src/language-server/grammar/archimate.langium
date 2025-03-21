grammar ArchiMate

import 'element'
import 'relation'
import 'diagram'

entry ArchiMateRoot:
    (element=Element |
    relation=Relation |
    junction=Junction |
    diagram=Diagram)?;
