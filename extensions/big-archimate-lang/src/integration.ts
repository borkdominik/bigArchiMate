import { Services, SharedServices } from './language-server/module.js';

/**
 * Language services required in GLSP.
 */
export const LSPServices = Symbol('LSPServices');
export interface LSPServices {
   /** Language services shared across all languages. */
   shared: SharedServices;
   /** ArchiMate language-specific services. */
   language: Services;
}
