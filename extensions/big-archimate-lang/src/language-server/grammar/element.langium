import 'terminals'
import 'common'

Element:
    'element' ':'
        INDENT
            'id' ':' id=ElementID
            'name' ':' name=STRING
            ('documentation' ':' documentation=STRING)?
            'type' ':'  type=ElementType
            Properties?
        DEDENT
;

// See https://langium.org/docs/recipes/keywords-as-identifiers/
ElementID returns string:
    ID | ElementType;

ElementType returns string:
    'ApplicationCollaboration' |
    'ApplicationComponent' |
    'ApplicationEvent' |
    'ApplicationFunction' |
    'ApplicationInterface' |
    'ApplicationInteraction' |
    'ApplicationProcess' |
    'ApplicationService' |
    'Artifact' |
    'Assessment' |
    'BusinessActor' |
    'BusinessCollaboration' |
    'BusinessEvent' |
    'BusinessFunction' |
    'BusinessInteraction' |
    'BusinessInterface' |
    'BusinessObject' |
    'BusinessProcess' |
    'BusinessRole' |
    'BusinessService' |
    'Capability' |
    'Constraint' |
    'CommunicationNetwork' |
    'Contract' |
    'CourseOfAction' |
    'DataObject' |
    'Deliverable' |
    'Device' |
    'DistributionNetwork' |
    'Driver' |
    'Equipment' |
    'Facility' |
    'Gap' |
    'Goal' |
    'Grouping' |
    'ImplementationEvent' |
    'Location' |
    'Material' |
    'Meaning' |
    'Node' |
    'Outcome' |
    'Path' |
    'Plateau' |
    'Principle' |
    'Product' |
    'Requirement' |
    'Representation' |
    'Resource' |
    'Stakeholder' |
    'SystemSoftware' |
    'TechnologyCollaboration' |
    'TechnologyEvent' |
    'TechnologyFunction' |
    'TechnologyInteraction' |
    'TechnologyInterface' |
    'TechnologyProcess' |
    'TechnologyService' |
    'Value' |
    'ValueStream' |
    'WorkPackage';
