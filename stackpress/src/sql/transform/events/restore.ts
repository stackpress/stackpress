//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

export default function generate(directory: Directory, model: Model) {
  const ids = model.store.ids;
  if (ids.size === 0) return;
  const filepath = model.name.toPathName('%s/events/restore.ts');
  //load Profile/events/restore.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import type { DatabasePlugin } from 'stackpress/sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql/types',
    namedImports: [ 'DatabasePlugin' ]
  });
  //import type { Request, Response, Server } from 'stackpress/server';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/server',
    namedImports: [ 'Request', 'Response', 'Server' ]
  });
  //import type { StoreSelectFilters } from 'stackpress/sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql/types',
    namedImports: [ 'StoreSelectFilters' ]
  });
  //import Exception from 'stackpress/Exception';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/Exception',
    defaultImport: 'Exception'
  });
  //import ProfileActions from '../ProfileActions.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('../%sActions.js'),
    defaultImport: model.name.toClassName('%sActions')
  });
  //export default async function ProfileRestoreEvent(
  //  req: Request, 
  //  res: Response, 
  //  ctx: Server
  //) {}
  source.addFunction({
    name: model.name.toPropertyName('%sRestoreEvent', true),
    isDefaultExport: true,
    isAsync: true,
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.RESTORE, { 
      actions: model.name.toClassName('%sActions'),
      ids: ids.map(column => ({
        column: column.name.toPropertyName()
      })).toArray(),
      active: model.store.active 
        ? { column: model.store.active.name.toString() }
        : null
    })
  });
};

export const TEMPLATE = {

RESTORE:
`//if there is a response body or there is an error code
//then let the response pass through
if (res.body || (res.code && res.code !== 200)) return;

//get the database engine
const engine = ctx.plugin<DatabasePlugin>('database');
//if no engine, then we cant do anything...
//so let the response pass through
if (!engine) return;

const filter: StoreSelectFilters = {};
//check for id/s
<%#ids%>
  //get id
  filter.<%column%> = req.data<string>('<%column%>');
  //let it naturally 404 if invalid id
  if (typeof filter.<%column%> === 'undefined' 
    || filter.<%column%> === null 
    || filter.<%column%> === ''
  ) {
    const errors = { <%column%>: 'Missing or invalid value' };
    res.setError('Invalid Parameters', errors).setStatus(400, 'Bad Request');
    return;
  }
<%/ids%>
<%#active%>
  //include soft-deleted records
  filter.<%column%> = -1; 
<%/active%>
//get the database seed (for encrypting)
const seed = ctx.config.path('database.seed', '');
//load the actions
const actions = new <%actions%>(engine, seed);

try { //to restore
  const results = await actions.restore({ filter });
  res.setResults(results);
} catch(e) {
  const exception = Exception.upgrade(e as Error);
  res.setError(exception.toResponse());
}`,

};