//stackpress
import { server } from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/model/Model.js';
//local
import batch from './batch.js';
import create from './create.js';
import detail from './detail.js';
import get from './get.js';
import purge from './purge.js';
import remove from './remove.js';
import restore from './restore.js';
import search from './search.js';
import update from './update.js';
import upsert from './upsert.js';

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
  emitter.on(`${model.name.dashCase}-batch`, batch(model));
  emitter.on(`${model.name.dashCase}-create`, create(model));
  emitter.on(`${model.name.dashCase}-detail`, detail(model));
  emitter.on(`${model.name.dashCase}-get`, get(model));
  emitter.on(`${model.name.dashCase}-purge`, purge(model));
  emitter.on(`${model.name.dashCase}-remove`, remove(model));
  emitter.on(`${model.name.dashCase}-restore`, restore(model));
  emitter.on(`${model.name.dashCase}-search`, search(model));
  emitter.on(`${model.name.dashCase}-update`, update(model));
  emitter.on(`${model.name.dashCase}-upsert`, upsert(model));
  return emitter;
};