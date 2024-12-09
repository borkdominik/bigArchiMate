grammar CrossModel

import 'entity'
import 'relationship'
import 'system-diagram'
import 'mapping'
import 'element'
import 'relation'
import 'archimate-model'
import 'archimate-diagram'

entry CrossModelRoot:
    (entity=Entity | 
    relationship=Relationship | 
    systemDiagram=SystemDiagram |
    mapping=Mapping |
    element=Element |
    relation=Relation |
    archiMateModel=ArchiMateModel |
    archiMateDiagram=ArchiMateDiagram)?;
