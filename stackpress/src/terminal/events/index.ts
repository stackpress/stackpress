//modules
import { server } from '@stackpress/ingest/Server';
//stackpress/terminal/events
import build from './build.js';
import emit from './emit.js';
import generate from './generate.js';
import install from './install.js';
import migrate from './migrate.js';
import purge from './purge.js';
import push from './push.js';
import query from './query.js';
import serve from './serve.js';
import uninstall from './uninstall.js';
import upgrade from './upgrade.js';

export {
  build,
  emit,
  generate,
  install,
  migrate,
  purge,
  push,
  query,
  serve,
  uninstall,
  upgrade
};

export default function listen() {
  const emitter = server();
  emitter.on('build', build);
  emitter.on('emit', emit);
  emitter.on('generate', generate);
  emitter.on('install', install);
  emitter.on('migrate', migrate);
  emitter.on('purge', purge);
  emitter.on('push', push);
  emitter.on('query', query);
  emitter.on('serve', serve);
  emitter.on('uninstall', uninstall);
  emitter.on('upgrade', upgrade);
  return emitter;
};