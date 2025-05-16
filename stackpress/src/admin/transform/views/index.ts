//modules
import type { Directory } from 'ts-morph';
//schema
import type Registry from '../../../schema/Registry.js';

import createView from './create.js';
import detailView from './detail.js';
import removeView from './remove.js';
import restoreView from './restore.js';
import searchView from './search.js';
import updateView from './update.js';

export default function generate(directory: Directory, registry: Registry) {
  for (const model of registry.model.values()) {
    createView(directory, registry, model);
    detailView(directory, registry, model);
    removeView(directory, registry, model);
    restoreView(directory, registry, model);
    searchView(directory, registry, model);
    updateView(directory, registry, model);
  }
};