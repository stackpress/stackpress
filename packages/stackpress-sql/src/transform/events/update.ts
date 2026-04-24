//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';

export default function generate(directory: Directory, model: Model) {
  const ids = model.store.ids;
  if (ids.size === 0) return;
  const filepath = model.name.toPathName('%s/events/update.ts');
  //load Profile/events/update.ts if it exists, if not create it
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

  //import ProfileActions from '../ProfileActions.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('../%sActions.js'),
    defaultImport: model.name.toClassName('%sActions')
  });

  //------------------------------------------------------------------//
  // Exports
  
  //export default async function ProfileUpdateEvent(
  //  req: Request, 
  //  res: Response, 
  //  ctx: Server
  //) {}
  source.addFunction({
    name: model.name.toPropertyName('%sUpdateEvent', true),
    isDefaultExport: true,
    isAsync: true,
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.UPDATE, { 
      actions: model.name.toClassName('%sActions'),
      ids: ids.map(column => ({
        column: column.name.toPropertyName()
      })).toArray()
    })
  });
};

export const TEMPLATE = {

UPDATE:
`//if there is a response body or there is an error code
//then let the response pass through
if (res.body || (res.code && res.code !== 200)) return;

//get the database engine
const engine = ctx.plugin<DatabasePlugin>('database');
//if no engine, then we cant do anything...
//so let the response pass through
if (!engine) return;

//check for id/s
<%#@:ids%>
  //get id
  const <%column%> = req.data<string>('<%column%>');
  //let it naturally 404 if invalid id
  if (typeof <%column%> === 'undefined' 
    || <%column%> === null 
    || <%column%> === ''
  ) {
    const errors = { <%column%>: 'Missing or invalid value' };
    res.setError('Invalid Parameters', errors).setStatus(400, 'Bad Request');
    return;
  }
<%/@:ids%>

//get the database seed (for encrypting)
const seed = ctx.config.path('database.seed', '');
//load the actions
const actions = new <%actions%>(engine, seed);

try { //to update
  const eq = { 
    <%#@:ids%>
      <%column%>,
    <%/@:ids%> 
  };
  const results = await actions.update({ eq }, req.data());
  res.setResults(results[0] || null);
} catch(e) {
  const exception = Exception.upgrade(e as Error);
  res.setError(exception.toResponse());
}`,

};