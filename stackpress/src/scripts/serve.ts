//stackpress
import type Server from '@stackpress/ingest/Server';

export default async function serve(server: Server<any, any, any>, port = 3000) {
  const service = server.create();
  service.listen(port);
  return service;
};