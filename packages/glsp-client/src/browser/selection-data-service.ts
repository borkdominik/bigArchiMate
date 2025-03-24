import { CrossReference, REFERENCE_CONTAINER_TYPE, REFERENCE_PROPERTY, REFERENCE_VALUE, RenderProps } from '@big-archimate/protocol';
import { GModelElement, GModelRoot, hasArgs } from '@eclipse-glsp/client';
import { GlspSelectionDataService } from '@eclipse-glsp/theia-integration';
import { isDefined } from '@theia/core';
import { injectable } from '@theia/core/shared/inversify';

@injectable()
export class SelectionDataService extends GlspSelectionDataService {
   async getSelectionData(root: Readonly<GModelRoot>, selectedElementIds: string[]): Promise<SelectionData> {
      const selection = selectedElementIds.map(id => root.index.getById(id)).filter(isDefined);
      return getSelectionDataFor(selection);
   }
}

export interface GModelElementInfo {
   type: string;
   reference?: CrossReference;
   renderProps?: Partial<RenderProps>;
}

export interface SelectionData {
   selectionDataMap: Map<string, GModelElementInfo>;
}

export function getSelectionDataFor(selection: GModelElement[]): SelectionData {
   const selectionDataMap = new Map<string, GModelElementInfo>();
   selection.forEach(element => selectionDataMap.set(element.id, getElementInfo(element)));
   return { selectionDataMap };
}

export function getElementInfo(element: GModelElement): GModelElementInfo {
   return { type: element.type, reference: getCrossReference(element) };
}

export function getCrossReference(element: GModelElement): CrossReference | undefined {
   if (hasArgs(element)) {
      const referenceContainerType = element.args[REFERENCE_CONTAINER_TYPE];
      const referenceProperty = element.args[REFERENCE_PROPERTY];
      const referenceValue = element.args[REFERENCE_VALUE];
      if (referenceProperty && referenceContainerType && referenceValue) {
         return {
            container: { globalId: element.id, type: referenceContainerType.toString() },
            property: referenceProperty.toString(),
            value: referenceValue.toString()
         };
      }
   }
   return undefined;
}
