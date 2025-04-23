//stackpress
import { server } from '@stackpress/ingest/Server';
//local
import build from './build.js';
import drop from './drop.js';
import emit from './emit.js';
import generate from './generate.js';
import install from './install.js';
import migrate from './migrate.js';
import purge from './purge.js';
import push from './push.js';
import query from './query.js';
import serve from './serve.js';

export {
  build,
  drop,
  emit,
  generate,
  install,
  migrate,
  purge,
  push,
  query,
  serve
};

export default function listen() {
  const emitter = server();
  emitter.on('build', build);
  emitter.on('drop', drop);
  emitter.on('emit', emit);
  emitter.on('generate', generate);
  emitter.on('install', install);
  emitter.on('migrate', migrate);
  emitter.on('purge', purge);
  emitter.on('push', push);
  emitter.on('query', query);
  emitter.on('serve', serve);
  return emitter;
};