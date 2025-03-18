grammar CrossModel

import 'element'
import 'relation'
import 'archimate-diagram'

entry CrossModelRoot:
    (element=Element |
    relation=Relation |
    junction=Junction |
    archiMateDiagram=ArchiMateDiagram)?;
