//modules
import type { Directory } from 'ts-morph';
//schema
import type Schema from '../../schema/Schema.js';
import { loadProjectFile } from '../../schema/transform/helpers.js';

export const idActions = [ 'detail', 'remove', 'restore', 'update' ];

export default function generate(directory: Directory, registry: Schema) {
  generatePage('create', directory, registry);
  generatePage('detail', directory, registry);
  generatePage('export', directory, registry);
  generatePage('import', directory, registry);
  generatePage('remove', directory, registry);
  generatePage('restore', directory, registry);
  generatePage('search', directory, registry);
  generatePage('update', directory, registry);
};

export function generatePage(action: string, directory: Directory, schema: Schema) {
  const lower = action.toLowerCase();
  const title = action.charAt(0).toUpperCase() + action.slice(1);
  //loop through models
  for (const model of schema.models.values()) {
    const ids = model.store.ids;
    if (ids.size === 0 && idActions.includes(lower)) {
      continue;
    }

    const filepath = model.name.toPathName(`%s/admin/pages/${lower}.ts`);
    //load Profile/index.ts if it exists, if not create it
    const source = loadProjectFile(directory, filepath);
    
    // import type Request from '@stackpress/ingest/Request';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/Request',
      defaultImport: 'Request'
    });
    // import type Response from '@stackpress/ingest/Response';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/Response',
      defaultImport: 'Response'
    });
    // import type Server from '@stackpress/ingest/Server';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/Server',
      defaultImport: 'Server'
    });
    //import create from 'stackpress/admin/pages/create';
    source.addImportDeclaration({
      moduleSpecifier: `stackpress/admin/pages/${lower}`,
      //consider import/export keywords
      defaultImport: `${lower}Page`
    });
    // import config from '../../config.js';
    source.addImportDeclaration({
      moduleSpecifier: '../../config.js',
      defaultImport: 'config'
    });
    // export default function AdminProfileCreatePage(req, res) {} 
    source.addFunction({
      name: `Admin${model.name.titleCase}${title}Page`,
      isDefaultExport: true,
      parameters: [
        { name: 'req', type: 'Request' }, 
        { name: 'res', type: 'Response' }, 
        { name: 'ctx', type: 'Server' }
      ],
      statements: (`return ${lower}Page(config)(req, res, ctx);`)
    });
  }
};