//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
//stackpress/admin
import generateCreate from './create.js';
import generateDetail from './detail.js';
import generateExport from './export.js';
import generateImport from './import.js';
import generateRemove from './remove.js';
import generateRestore from './restore.js';
import generateSearch from './search.js';
import generateUpdate from './update.js';

export default function generate(directory: Directory, model: Model) {
  //------------------------------------------------------------------//
  // 1. Profile/admin/create.ts

  generateCreate(directory, model);

  //------------------------------------------------------------------//
  // 2. Profile/admin/detail.ts

  generateDetail(directory, model);

  //------------------------------------------------------------------//
  // 3. Profile/admin/export.ts

  generateExport(directory, model);

  //------------------------------------------------------------------//
  // 4. Profile/admin/import.ts

  generateImport(directory, model);

  //------------------------------------------------------------------//
  // 5. Profile/admin/remove.ts

  generateRemove(directory, model);

  //------------------------------------------------------------------//
  // 6. Profile/admin/restore.ts

  if (model.store.restorable) {
    generateRestore(directory, model);
  }

  //------------------------------------------------------------------//
  // 7. Profile/admin/search.ts

  generateSearch(directory, model);

  //------------------------------------------------------------------//
  // 8. Profile/admin/update.ts

  generateUpdate(directory, model);
};