import {
   ARCHIMATE_NODE_TYPE_MAP,
   ARCHIMATE_RELATION_TYPE_MAP,
   ConceptType,
   elementTypes,
   getLabel,
   junctionTypes,
   relationTypes
} from '@big-archimate/protocol';
import { ElementTypeEntry, ElementTypes, ElementTypesProvider } from '@eclipse-glsp/server-mcp';
import { injectable } from 'inversify';

const toEntry = (concept: ConceptType, glspType: string): ElementTypeEntry => ({
   id: glspType,
   label: getLabel(concept)
});

@injectable()
export class ArchiMateElementTypesProvider implements ElementTypesProvider {
   get(): ElementTypes {
      const nodeTypes: ElementTypeEntry[] = [
         ...elementTypes.map(concept => toEntry(concept, ARCHIMATE_NODE_TYPE_MAP.get(concept))),
         ...junctionTypes.map(concept => toEntry(concept, ARCHIMATE_NODE_TYPE_MAP.get(concept)))
      ];
      const edgeTypes: ElementTypeEntry[] = relationTypes.map(concept =>
         toEntry(concept, ARCHIMATE_RELATION_TYPE_MAP.get(concept))
      );
      return { nodeTypes, edgeTypes };
   }
}
