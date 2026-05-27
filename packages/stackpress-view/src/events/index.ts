//modules
import { server } from '@stackpress/ingest/Server';
//stackpress-schema
import build from './build.js';

export { build };

export default function listen() {
  const emitter = server();
  emitter.on('build', build);
  return emitter;
};