export const relationship1 = `relationship:
    id: Relationship1Id
    type: Association
    source: Element1Id
    target: Element2Id`;

export const relationship1with_name = `relationship:
    id: Relationship1Id
    type: Association
    source: Element1Id
    target: Element2Id
    name: "Relationship1 Name"`;

export const relationship1with_documentation = `relationship:
    id: Relationship1Id
    type: Association
    source: Element1Id
    target: Element2Id
    documentation: "Relationship1 Documentation."`;

export const relationship1_with_properties = `relationship:
    id: Relationship1Id
    type: Association
    source: Element1Id
    target: Element2Id
    properties:
      - id: Property1
        name: "Property1 Name"
        value: "Property1 Value"`;
