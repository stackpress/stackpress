//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

export default function generate(directory: Directory, model: Model) {
  const filepath = model.name.toPathName('%s/events/search.ts');
  //load Profile/events/search.ts if it exists, if not create it
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
  //export default async function ProfileSearchEvent(
  //  req: Request, 
  //  res: Response, 
  //  ctx: Server
  //) {}
  source.addFunction({
    name: model.name.toPropertyName('%sSearchEvent', true),
    isDefaultExport: true,
    isAsync: true,
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.SEARCH, { 
      actions: model.name.toClassName('%sActions') 
    })
  });
};

export const TEMPLATE = {

SEARCH:
`//if there is a response body or there is an error code
//then let the response pass through
if (res.body || (res.code && res.code !== 200)) return;

//get the database engine
const engine = ctx.plugin<DatabasePlugin>('database');
//if no engine, then we cant do anything...
//so let the response pass through
if (!engine) return;

const columns = req.data.has('columns') 
  ? req.data<string[]>('columns') 
  : [ '<%columns%>' ];

req.data.set(
  'columns', 
  Array.isArray(columns) && columns.every(
    column => typeof column === 'string' && column.length > 0
  ) ? columns : [ '*' ]
);

//get the database seed (for encrypting)
const seed = ctx.config.path('database.seed', '');
//load the actions
const actions = new <%actions%>(engine, seed);

try { //to search
  const results = await actions.findAll(req.data());
  const total = await actions.count(req.data());
  res.setRows(results, total);
} catch(e) {
  const exception = Exception.upgrade(e as Error);
  res.setError(exception.toResponse());
}`,

};