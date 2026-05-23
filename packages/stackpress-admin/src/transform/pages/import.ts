//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';

export default function generate(directory: Directory, model: Model) {
  //------------------------------------------------------------------//
  // Profile/admin/pages/import.ts

  const filepath = model.name.toPathName('%s/admin/pages/import.ts');
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import type { RouteProps } from 'stackpress-server';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-server',
    namedImports: [ 'RouteProps' ]
  });
  //import { action } from '@stackpress/ingest/Server';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/ingest/Server',
    namedImports: [ 'action' ]
  });

  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Exports

  //export default async function ProfileAdminImportPage(req, res, ctx) {}
  const name = model.name.toClassName('%sAdminImportPage');
  source.addFunction({
    isAsync: true,
    name,
    parameters: [{
      name: '{ req, res, ctx }',
      type: 'RouteProps'
    }],
    statements: renderCode(TEMPLATE.IMPORT, { 
      event: model.name.toEventName()
    })
  });
  source.addStatements(`export default action(${name});`);
};

export const TEMPLATE = {

IMPORT:
`//if there is a response body or there is an error code
if (res.body || (res.code && res.code !== 200)) {
  //let the response pass through
  return;
}
//if form submitted
if (req.method === 'POST') {
  //emit the batch event
  await ctx.emit('<%event%>-batch', req, res);
}`,

};
