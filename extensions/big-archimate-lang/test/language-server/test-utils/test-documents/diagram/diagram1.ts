export const diagram1 = `archiMateDiagram:  
    id: ArchiMateDiagram1Id`;

export const diagram1_with_name = `archiMateDiagram:
    id: ArchiMateDiagram1Id
    name: "ArchiMateDiagram1 Name"`;

export const diagram1_with_element_node = `archiMateDiagram:
    id: ArchiMateDiagram1Id
    nodes:
      - id: Element1IdNode
        element: Element1Id
        x: 100
        y: 100
        width: 100
        height: 100`;

export const diagram1_with_junction_node = `archiMateDiagram:
    id: ArchiMateDiagram1Id
    nodes:
      - id: Junction1IdNode
        junction: Junction1Id
        x: 100
        y: 100
        width: 100
        height: 100`;

export const diagram1_with_two_nodes_and_one_edge = `archiMateDiagram:
    id: ArchiMateDiagram1Id
    nodes:
      - id: Element1IdNode
        element: Element1Id
        x: 100
        y: 100
        width: 100
        height: 100
      - id: Junction1IdNode
        junction: Junction1Id
        x: 200
        y: 200
        width: 100
        height: 100
    edges:
      - id: Edge1Id
        relation: Relation1Id
        sourceNode: Element1IdNode
        targetNode: Junction1IdNode`;
