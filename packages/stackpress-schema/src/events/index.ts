//modules
import { server } from '@stackpress/ingest/Server';
//stackpress-schema
import generate from './generate.js';

export { generate };

export default function listen() {
  const emitter = server();
  emitter.on('generate', generate);
  return emitter;
};