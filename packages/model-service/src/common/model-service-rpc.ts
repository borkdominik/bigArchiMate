import {
   ArchiMateDocument,
   CloseModelArgs,
   CrossReference,
   CrossReferenceContext,
   ModelUpdatedEvent,
   OpenModelArgs,
   ReferenceableElement,
   ResolvedElement,
   SaveModelArgs,
   SystemInfo,
   SystemInfoArgs,
   SystemUpdatedEvent,
   UpdateModelArgs
} from '@big-archimate/protocol';
import { Event, RpcServer } from '@theia/core';

/** Path used to communicate between the Theia frontend and backend */
export const MODEL_SERVICE_PATH = '/services/model-service';

export const ModelService = Symbol('ModelService');
export interface ModelService
   extends Omit<ModelServiceServer, 'setClient' | 'getClient' | 'dispose'>,
      Omit<ModelServiceClient, 'getName' | 'updateModel' | 'updateSystem' | 'ready'> {
   systems: SystemInfo[];
}

/**
 * Protocol used by the Theia frontend-backend communication
 */
export const ModelServiceServer = Symbol('ModelServiceServer');
export interface ModelServiceServer extends RpcServer<ModelServiceClient> {
   // Model API
   open(args: OpenModelArgs): Promise<ArchiMateDocument | undefined>;
   close(args: CloseModelArgs): Promise<void>;
   update(args: UpdateModelArgs): Promise<ArchiMateDocument>;
   save(args: SaveModelArgs): Promise<void>;

   // Query API
   request(uri: string): Promise<ArchiMateDocument | undefined>;
   findReferenceableElements(args: CrossReferenceContext): Promise<ReferenceableElement[]>;
   resolveReference(reference: CrossReference): Promise<ResolvedElement | undefined>;

   // System API
   getSystemInfos(): Promise<SystemInfo[]>;
   getSystemInfo(args: SystemInfoArgs): Promise<SystemInfo | undefined>;
}

export const ModelServiceClient = Symbol('ModelServiceClient');
export interface ModelServiceClient {
   getName(): Promise<string>;
   ready(): Promise<void>;
   onReady: Event<void>;
   updateModel(args: ModelUpdatedEvent): Promise<void>;
   onModelUpdate: Event<ModelUpdatedEvent>;
   updateSystem(args: SystemUpdatedEvent): Promise<void>;
   onSystemUpdate: Event<SystemUpdatedEvent>;
}
