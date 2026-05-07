//modules
import { server } from '@stackpress/ingest/Server';
//stackpress-mcp
import serve from './serve.js';

export { serve };

export default function listen() {
  const emitter = server();
  emitter.on('serve', serve);
  return emitter;
};