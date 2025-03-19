grammar CrossModel

import 'element'
import 'relation'
import 'diagram'

entry ArchiMateRoot:
    (element=Element |
    relation=Relation |
    junction=Junction |
    archiMateDiagram=ArchiMateDiagram)?;
