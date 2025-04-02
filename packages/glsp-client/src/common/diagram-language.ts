import { ModelFileExtensions } from '@big-archimate/protocol';
import { GLSPDiagramLanguage } from '@eclipse-glsp/theia-integration/lib/common';

// use same contributionId for all languages to ensure we communicate with the same GLSP server
export const ArchiMateLanguageContributionId = 'archimate-contribution';

export const ArchiMateDiagramLanguage: GLSPDiagramLanguage = {
   contributionId: ArchiMateLanguageContributionId,
   label: 'ArchiMate View',
   diagramType: 'archimate-view',
   fileExtensions: [ModelFileExtensions.Diagram]
};
