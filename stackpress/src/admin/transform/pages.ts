//modules
import type { Directory } from 'ts-morph';
//schema
import type Registry from '../../schema/Registry';

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
        { name: 'req', type: 'Request' }, 
        { name: 'res', type: 'Response' }, 
        { name: 'ctx', type: 'Server' }
      ],
      statements: (`return ${lower}Page(config)(req, res, ctx);`)
    });
  }
};