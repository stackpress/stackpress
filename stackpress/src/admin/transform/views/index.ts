//modules
import type { Directory } from 'ts-morph';
//schema
import type Registry from '../../../schema/Registry';

import createPage from './create';
import detailPage from './detail';
import removePage from './remove';
import restorePage from './restore';
import searchPage from './search';
import updatePage from './update';

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