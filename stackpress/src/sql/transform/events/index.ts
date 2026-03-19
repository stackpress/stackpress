//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { loadProjectFile } from '../../../schema/transform/helpers.js';
//stackpress/sql/transform/events
import generateBatch from './batch.js';
import generateCreate from './create.js';
import generateDetail from './detail.js';
import generateGet from './get.js';
import generatePurge from './purge.js';
import generateRemove from './remove.js';
import generateRestore from './restore.js';
import generateSearch from './search.js';
import generateUpdate from './update.js';
import generateUpsert from './upsert.js';

export const actions = [
  'batch',
  'create',
  'detail',
  'get',
  'purge',
  'remove',
  'restore',
  'search',
  'update',
  'upsert'
];

export default function generate(directory: Directory, model: Model) {
  //------------------------------------------------------------------//
  // 1. Address/events/batch.ts

  generateBatch(directory, model);

  //------------------------------------------------------------------//
  // 2. Address/events/create.ts

  generateCreate(directory, model);

  //------------------------------------------------------------------//
  // 3. Address/events/detail.ts

  generateDetail(directory, model);
  
  //------------------------------------------------------------------//
  // 4. Address/events/get.ts
  
  generateGet(directory, model);

  //------------------------------------------------------------------//
  // 5. Address/events/purge.ts

  generatePurge(directory, model);
  
  //------------------------------------------------------------------//
  // 6. Address/events/remove.ts

  generateRemove(directory, model);
  
  //------------------------------------------------------------------//
  // 7. Address/events/restore.ts

  generateRestore(directory, model);

  //------------------------------------------------------------------//
  // 8. Address/events/search.ts

  generateSearch(directory, model);
  
  //------------------------------------------------------------------//
  // 9. Address/events/update.ts

  generateUpdate(directory, model);
  
  //------------------------------------------------------------------//
  // 10. Address/events/upsert.ts

  generateUpsert(directory, model);

  //------------------------------------------------------------------//
  // 11. Address/events/index.ts
  
  const filepath = model.name.toPathName('%s/events/index.ts');
  //load Address/events/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);
  //import batch from './batch.js';
  //import create from './create.js';
  //import detail from './detail.js';
  //import get from './get.js';
  //import purge from './purge.js';
  //import remove from './remove.js';
  //import restore from './restore.js';
  //import search from './search.js';
  //import update from './update.js';
  //import upsert from './upsert.js';
  actions.forEach(event => {
    source.addImportDeclaration({
      moduleSpecifier: `./${event}.js`,
      defaultImport: event
    });  
  });
  
  //export { batch, create, detail, get, purge, remove, restore, search, update, upsert };
  source.addExportDeclaration({ namedExports: actions });

  //export default function listen(
  // emitter: Record<string, any> & { on: (event: string, listener: Function) => any }
  //) {};
  source.addFunction({
    isDefaultExport: true,
    name: 'listen',
    parameters: [{ 
      name: 'emitter', 
      type: 'Record<string, any> & { on: (event: string, listener: Function) => any }' 
    }],
    statements: actions.map(
      event => `emitter.on('${model.name.toEventName()}-${event}', ${event});`
    ).join('\n')
  });
};