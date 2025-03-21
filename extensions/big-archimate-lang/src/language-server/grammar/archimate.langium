grammar ArchiMate

import 'element'
import 'relationship'
import 'diagram'

entry ArchiMateRoot:
    (element=Element |
    relationship=Relationship |
    junction=Junction |
    diagram=Diagram)?;
