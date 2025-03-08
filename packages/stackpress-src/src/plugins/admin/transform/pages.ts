//modules
import type { Directory } from 'ts-morph';
//schema
import type Registry from '@/schema/Registry';

export default function generate(directory: Directory, registry: Registry) {
  page('create', directory, registry);
  page('detail', directory, registry);
  page('export', directory, registry);
  page('import', directory, registry);
  page('remove', directory, registry);
  page('restore', directory, registry);
  page('search', directory, registry);
  page('update', directory, registry);
};

export function page(action: string, directory: Directory, registry: Registry) {
  const lower = action.toLowerCase();
  const title = action.charAt(0).toUpperCase() + action.slice(1);
  //loop through models
  for (const model of registry.model.values()) {
    const file = `${model.name}/admin/pages/${lower}.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
    // import type { ServerRequest } from '@stackpress/ingest/dist/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/dist/types',
      namedImports: [ 'ServerRequest' ]
    });
    // import type Response from '@stackpress/ingest/dist/Response';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: '@stackpress/ingest/dist/Response',
      defaultImport: 'Response'
    });
    //import create from 'stackpress/plugins/admin/pages/create';
    source.addImportDeclaration({
      moduleSpecifier: `stackpress/plugins/admin/pages/${lower}`,
      //consider import/export keywords
      defaultImport: `${lower}Page`
    });
    // import config from '../../config';
    source.addImportDeclaration({
      moduleSpecifier: `../../config`,
      defaultImport: 'config'
    });
    // export default function AdminProfileCreatePage(req, res) {} 
    source.addFunction({
      name: `Admin${model.title}${title}Page`,
      isDefaultExport: true,
      parameters: [
        { name: 'req', type: 'ServerRequest' }, 
        { name: 'res', type: 'Response' }
      ],
      statements: (`return ${lower}Page(config)(req, res);`)
    });
  }
};