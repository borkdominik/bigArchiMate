import { CrossModelSharedServices, Services } from './language-server/module.js';

/**
 * Language services required in GLSP.
 */
export const CrossModelLSPServices = Symbol('CrossModelLSPServices');
export interface CrossModelLSPServices {
   /** Language services shared across all languages. */
   shared: CrossModelSharedServices;
   /** CrossModel language-specific services. */
   language: Services;
}
