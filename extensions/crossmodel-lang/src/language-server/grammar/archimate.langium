grammar CrossModel

import 'element'
import 'relation'
import 'diagram'

entry CrossModelRoot:
    (element=Element |
    relation=Relation |
    junction=Junction |
    archiMateDiagram=ArchiMateDiagram)?;
