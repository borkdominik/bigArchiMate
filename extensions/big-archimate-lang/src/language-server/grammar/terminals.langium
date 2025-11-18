// Terminals

// ArchiMate Types
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

JunctionType returns string:
    'And' |
    'Or';

RelationType returns string:
    'Access' |
    'Aggregation' |
    'Association' |
    'Assignment' |
    'Composition' |
    'Flow' |
    'Influence' |
    'Realization' |
    'Serving' |
    'Specialization' |
    'Triggering';

// Scalar values
terminal STRING: /"[^"]*"|'[^']*'/;
terminal NUMBER returns number: /(-)?[0-9]+(\.[0-9]+)?/;
terminal _ID: /[_a-zA-Z][\w_\-~$#@/\d]*/;

// See https://langium.org/docs/recipes/keywords-as-identifiers/
ID returns string:
    _ID | RelationType | ElementType;

// Identification for cross references
IDReference returns string:
    ID ('.' ID)*;

// Misc
hidden terminal SL_COMMENT: /#[^\n\r]*/;

// Terminals to get the indentation working
terminal INDENT: ':synthetic-indent:';
terminal DEDENT: ':synthetic-dedent:';
terminal LIST_ITEM: '- '; // block sequence entry
hidden terminal NEWLINE: /[/\r\n|\r|\n/]+/;
hidden terminal WS: /[ \t]+/; 
