//modules
import type { Directory } from 'ts-morph';
//schema
import type Schema from '../../../schema/Schema.js';

import createView from './create.js';
import detailView from './detail.js';
import removeView from './remove.js';
import restoreView from './restore.js';
import searchView from './search.js';
import updateView from './update.js';

export default function generate(directory: Directory, schema: Schema) {
  for (const model of schema.models.values()) {
    createView(directory, schema, model);
    detailView(directory, schema, model);
    removeView(directory, schema, model);
    restoreView(directory, schema, model);
    searchView(directory, schema, model);
    updateView(directory, schema, model);
  }
};