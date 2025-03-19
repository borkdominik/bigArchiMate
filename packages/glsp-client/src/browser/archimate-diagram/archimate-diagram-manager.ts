import { codiconCSSString } from '@eclipse-glsp/client';
import { GLSPDiagramManager } from '@eclipse-glsp/theia-integration';
import { OpenWithHandler } from '@theia/core/lib/browser';
import { injectable } from '@theia/core/shared/inversify';
import { ArchiMateDiagramLanguage } from '../../common/diagram-language';

@injectable()
export class ArchiMateDiagramManager extends GLSPDiagramManager implements OpenWithHandler {
   static readonly ID = 'archimate-diagram-manager';

   get label(): string {
      return ArchiMateDiagramLanguage.label;
   }

   override get iconClass(): string {
      return ArchiMateDiagramLanguage.iconClass ?? codiconCSSString('type-hierarchy-sub');
   }

   override get fileExtensions(): string[] {
      return ArchiMateDiagramLanguage.fileExtensions;
   }

   override get diagramType(): string {
      return ArchiMateDiagramLanguage.diagramType;
   }

   override get contributionId(): string {
      return ArchiMateDiagramLanguage.contributionId;
   }

   override get id(): string {
      return ArchiMateDiagramManager.ID;
   }
}
