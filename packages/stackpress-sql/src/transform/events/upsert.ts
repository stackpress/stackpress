//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';

export default function generate(directory: Directory, model: Model) {
  const filepath = model.name.toPathName('%s/events/upsert.ts');
  //load Profile/events/upsert.ts if it exists, if not create it
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

  //import ProfileActions from '../ProfileActions.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('../%sActions.js'),
    defaultImport: model.name.toClassName('%sActions')
  });

  //------------------------------------------------------------------//
  // Exports

  //export default async function ProfileUpsertEvent({ req, res, ctx }: RouteProps) {}
  const name = model.name.toPropertyName('%sUpsertEvent', true);
  source.addFunction({
    isAsync: true,
    name,
    parameters: [{
      name: '{ req, res, ctx }',
      type: 'RouteProps'
    }],
    statements: renderCode(TEMPLATE.UPSERT, { 
      actions: model.name.toClassName('%sActions') 
    })
  });
  source.addStatements(`export default action(${name});`);
};

export const TEMPLATE = {

UPSERT:
`//if there is a response body or there is an error code
//then let the response pass through
if (res.body || (res.code && res.code !== 200)) return;

//get the database engine
const engine = ctx.plugin<DatabasePlugin>('database');
//if no engine, then we cant do anything...
//so let the response pass through
if (!engine) return;

//get the database seed (for encrypting)
const seed = ctx.config.path('database.seed', '');
//load the actions
const actions = new <%actions%>(engine, seed);

try { //to upsert
  const results = await actions.upsert(req.data());
  res.results(results);
} catch(e) {
  const exception = Exception.upgrade(e as Error);
  res.setError(exception.toResponse());
}`,

};
