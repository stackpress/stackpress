//modules
import type Server from '@stackpress/ingest/Server';

//The Ingest Server generic shape is not exported with concrete defaults here,
// so these anys preserve the existing script boundary while this wrapper only
// calls resolve().
type DesktopScriptServer = Server<any, any, any>;

/**
 * Invoke the desktop dev event through a Stackpress server instance.
 */
export default async function dev(server: DesktopScriptServer) {
  //scripts stay thin wrappers around the event lifecycle
  return await server.resolve('desktop:dev');
}
