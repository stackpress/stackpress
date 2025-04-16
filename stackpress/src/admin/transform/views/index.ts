//modules
import type { Directory } from 'ts-morph';
//schema
import type Registry from '../../../schema/Registry.js';

import createPage from './create.js';
import detailPage from './detail.js';
import removePage from './remove.js';
import restorePage from './restore.js';
import searchPage from './search.js';
import updatePage from './update.js';

export default function generate(directory: Directory, registry: Registry) {
  for (const model of registry.model.values()) {
    createPage(directory, registry, model);
    detailPage(directory, registry, model);
    removePage(directory, registry, model);
    restorePage(directory, registry, model);
    searchPage(directory, registry, model);
    updatePage(directory, registry, model);
  }
};