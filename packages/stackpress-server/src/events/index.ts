//modules
import { server } from '@stackpress/ingest/Server';
//stackpress-server
import develop from './develop.js';
import emit from './emit.js';
import serve from './serve.js';

export { develop, emit, serve };

export default function listen() {
  const emitter = server();
  emitter.on('develop', develop);
  emitter.on('emit', emit);
  emitter.on('serve', serve);
  return emitter;
};