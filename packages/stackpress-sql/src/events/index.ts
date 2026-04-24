//modules
import { server } from '@stackpress/ingest/Server';
//stackpress-sql
import install from './install.js';
import migrate from './migrate.js';
import purge from './purge.js';
import push from './push.js';
import query from './query.js';
import populate from './populate.js';
import uninstall from './uninstall.js';
import upgrade from './upgrade.js';

export {
  install,
  migrate,
  purge,
  push,
  query,
  populate,
  uninstall,
  upgrade
};

export default function listen() {
  const emitter = server();
  emitter.on('install', install);
  emitter.on('migrate', migrate);
  emitter.on('purge', purge);
  emitter.on('push', push);
  emitter.on('query', query);
  emitter.on('populate', populate);
  emitter.on('uninstall', uninstall);
  emitter.on('upgrade', upgrade);
  return emitter;
};