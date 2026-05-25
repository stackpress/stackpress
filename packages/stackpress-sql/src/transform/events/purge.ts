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
  //import type { RouteProps } from 'stackpress-server';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-server',
    namedImports: [ 'RouteProps' ]
  });
  //import { action } from 'stackpress-server';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress-server',
    namedImports: [ 'action' ]
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

  //export default async function ProfilePurgeEvent({ res, ctx }: RouteProps) {}
  const name = model.name.toPropertyName('%sPurgeEvent', true);
  source.addFunction({
    isAsync: true,
    name,
    parameters: [{
      name: '{ res, ctx }',
      type: 'RouteProps'
    }],
    statements: renderCode(TEMPLATE.PURGE, { 
      table: model.name.toString() 
    })
  });
  source.addStatements(`export default action(${name});`);
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
res.set('text/plain', '<%table%>');`,

};
