import { ModelFileExtensions } from '@crossbreeze/protocol';
import { GLSPDiagramLanguage } from '@eclipse-glsp/theia-integration/lib/common';

// use same contributionId for all languages to ensure we communicate with the same GLSP server
export const CrossModelLanguageContributionId = 'crossmodel-contribution';

export const ArchiMateDiagramLanguage: GLSPDiagramLanguage = {
   contributionId: CrossModelLanguageContributionId,
   label: 'ArchiMate Diagram',
   diagramType: 'archimate-diagram',
   fileExtensions: [ModelFileExtensions.ArchiMateDiagram]
};
