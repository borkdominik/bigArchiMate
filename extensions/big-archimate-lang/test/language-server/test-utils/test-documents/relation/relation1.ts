export const relation1 = `relation:
    id: Relation1Id
    type: Association
    source: Element1Id
    target: Element2Id`;

export const relation1with_name = `relation:
    id: Relation1Id
    type: Association
    source: Element1Id
    target: Element2Id
    name: "Relation1 Name"`;

export const relation1with_documentation = `relation:
    id: Relation1Id
    type: Association
    source: Element1Id
    target: Element2Id
    documentation: "Relation1 Documentation."`;

export const relation1_with_properties = `relation:
    id: Relation1Id
    type: Association
    source: Element1Id
    target: Element2Id
    properties:
      - id: Property1
        name: "Property1 Name"
        value: "Property1 Value"`;
