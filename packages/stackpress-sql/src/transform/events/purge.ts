//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';

export default function generate(directory: Directory, model: Model) {
  const filepath = model.name.toPathName('%s/events/purge.ts');
  //load Profile/events/purge.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules
  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { DatabasePlugin } from 'stackpress-sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-sql/types',
    namedImports: [ 'DatabasePlugin' ]
  });
  //import type { Request, Response, Server } from 'stackpress-server';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-server',
    namedImports: [ 'Request', 'Response', 'Server' ]
  });
  //import Exception from 'stackpress-sql/Exception';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress-sql/Exception',
    defaultImport: 'Exception'
  });

  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Exports

  //export default async function ProfilePurgeEvent(
  //  _req: Request, 
  //  res: Response, 
  //  ctx: Server
  //) {}
  source.addFunction({
    name: model.name.toPropertyName('%sPurgeEvent', true),
    isDefaultExport: true,
    isAsync: true,
    parameters: [
      { name: '_req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.PURGE, { 
      table: model.name.toString() 
    })
  });
};

export const TEMPLATE = {

PURGE:
`//if there is a response body or there is an error code
//then let the response pass through
if (res.body || (res.code && res.code !== 200)) return;

//get the database engine
const engine = ctx.plugin<DatabasePlugin>('database');
//if no engine, then we cant do anything...
//so let the response pass through
if (!engine) return;

try { //to purge
  await engine.truncate('<%table%>');
} catch(e) {
  const exception = Exception.upgrade(e as Error);
  res.setError(exception.toResponse());
}
res.setBody('text/plain', '<%table%>');`,

};