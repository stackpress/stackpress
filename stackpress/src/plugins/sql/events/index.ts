//stackpress
import { server } from '@stackpress/ingest/Server';
//schema
import type Model from '../../../schema/spec/Model';
//local
import batch from './batch';
import create from './create';
import detail from './detail';
import get from './get';
import purge from './purge';
import remove from './remove';
import restore from './restore';
import search from './search';
import update from './update';
import upsert from './upsert';

export {
  batch,
  create,
  detail,
  get,
  purge,
  remove,
  restore,
  search,
  update,
  upsert
};

export function handlers(model: Model) {
  return {
    batch: batch(model),
    create: create(model),
    detail: detail(model),
    get: get(model),
    purge: purge(model),
    remove: remove(model),
    restore: restore(model),
    search: search(model),
    update: update(model),
    upsert: upsert(model)
  };
}

export default function listen(model: Model) {
  const emitter = server();
  emitter.on(`${model.dash}-batch`, batch(model));
  emitter.on(`${model.dash}-create`, create(model));
  emitter.on(`${model.dash}-detail`, detail(model));
  emitter.on(`${model.dash}-get`, get(model));
  emitter.on(`${model.dash}-purge`, purge(model));
  emitter.on(`${model.dash}-remove`, remove(model));
  emitter.on(`${model.dash}-restore`, restore(model));
  emitter.on(`${model.dash}-search`, search(model));
  emitter.on(`${model.dash}-update`, update(model));
  emitter.on(`${model.dash}-upsert`, upsert(model));
  return emitter;
};