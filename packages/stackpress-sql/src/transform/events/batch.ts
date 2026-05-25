//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';

export default function generate(directory: Directory, model: Model) {
  const filepath = model.name.toPathName('%s/events/batch.ts');
  //load Profile/events/batch.ts if it exists, if not create it
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

  //export default async function ProfileBatchEvent({ req, res, ctx }: RouteProps) {}
  const name = model.name.toPropertyName('%sBatchEvent', true);
  source.addFunction({
    isAsync: true,
    name,
    parameters: [{
      name: '{ req, res, ctx }',
      type: 'RouteProps'
    }],
    statements: renderCode(TEMPLATE.BATCH, { 
      actions: model.name.toClassName('%sActions') 
    })
  });
  source.addStatements(`export default action(${name});`);
};

export const TEMPLATE = {

BATCH:
`//if there is a response body or there is an error code
//then let the response pass through
if (res.body || (res.code && res.code !== 200)) return;

//get the database engine
const engine = ctx.plugin<DatabasePlugin>('database');
//if no engine, then we cant do anything...
//so let the response pass through
if (!engine) return;

const mode = req.data.path('mode', 'upsert') as 'create' | 'update' | 'upsert';
const rows = req.data('rows');
if (!Array.isArray(rows)) {
  const errors = { rows: 'Missing or invalid value' };
  res.setError('Invalid Parameters', errors).statusCode(400, 'Bad Request');
  return;
}

//get the database seed (for encrypting)
const seed = ctx.config.path('database.seed', '');
//load the actions
const actions = new <%actions%>(engine, seed);

try { //to batch
  const results = await actions.batch(rows, mode);
  res.rows(results, results.length);
  results.every(result => result.code === 200)
    ? res.statusCode(200, 'OK')
    : res.statusCode(400, 'Bad Request');
} catch(e) {
  const exception = Exception.upgrade(e as Error);
  res.setError(exception.toResponse());
}`,

};
