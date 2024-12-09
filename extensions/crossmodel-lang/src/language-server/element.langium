import 'terminals'

Element:
    'element' ':'
        INDENT
            'id' ':' id=ID
            'name' ':' name=STRING
            ('description' ':' description=STRING)?
            'type' ':'  type=ElementType
            CustomProperties?
        DEDENT
;

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
    'ImplementationEvent' |
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
