//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
//stackpress/admin
import createView from './create.js';
import detailView from './detail.js';
import removeView from './remove.js';
import restoreView from './restore.js';
import searchView from './search.js';
import updateView from './update.js';

export default function generate(directory: Directory, model: Model) {
  const ids = model.store.ids;
  createView(directory, model);
  searchView(directory, model);
  if (ids.size) {
    detailView(directory, model);
    removeView(directory, model);
    if (model.store.restorable) {
      restoreView(directory, model);
    }
    updateView(directory, model);
  }
};