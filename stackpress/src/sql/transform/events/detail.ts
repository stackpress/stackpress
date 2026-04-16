//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'number',
  Date: 'number',
  Time: 'number',
  Datetime: 'number',
  Json: 'string',
  Object: 'string',
  Hash: 'string'
};

export default function generate(directory: Directory, model: Model) {
  const ids = model.store.ids;
  if (ids.size === 0) return;
  const filepath = model.name.toPathName('%s/events/detail.ts');
  //load Profile/events/detail.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules
  //------------------------------------------------------------------//
  // Import Stackpress

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

  //------------------------------------------------------------------//
  // Import Client

  //import ProfileActions from '../ProfileActions.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('../%sActions.js'),
    defaultImport: model.name.toClassName('%sActions')
  });

  //------------------------------------------------------------------//
  // Exports

  //export default async function ProfileDetailEvent(
  //  req: Request, 
  //  res: Response, 
  //  ctx: Server
  //) {}
  source.addFunction({
    name: model.name.toPropertyName('%sDetailEvent', true),
    isDefaultExport: true,
    isAsync: true,
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.DETAIL, { 
      actions: model.name.toClassName('%sActions'),
      ids: ids.map(column => ({
        column: column.name.toPropertyName(),
        type: typemap[column.type.name] || 'string'
      })).toArray(),
      columns: model.store.query.length > 0 
        ? model.store.query.join("', '") 
        : [ '*' ].join("', '") 
    })
  });
};

export const TEMPLATE = {

DETAIL:
`//if there is a response body or there is an error code
//then let the response pass through
if (res.body || (res.code && res.code !== 200)) return;

//get the database engine
const engine = ctx.plugin<DatabasePlugin>('database');
//if no engine, then we cant do anything...
//so let the response pass through
if (!engine) return;

//get all the current filters
const eq = req.data.path<StoreSelectFilters["eq"]>('eq', {});

//check for id/s
<%#ids%>
  //get id
  eq.<%column%> = req.data<<%type%>>('<%column%>');
  //let it naturally 404 if invalid id
  if (typeof eq.<%column%> === 'undefined' 
    || eq.<%column%> === null 
    || eq.<%column%> === ''
  ) {
    const errors = { <%column%>: 'Missing or invalid value' };
    res.setError('Invalid Parameters', errors).setStatus(400, 'Bad Request');
    return;
  }
<%/ids%>

const selectors = req.data<string[]>('columns');
const columns = Array.isArray(selectors) && selectors.every(
  column => typeof column === 'string' && column.length > 0
) ? selectors : [ '<%columns%>' ];

//get the database seed (for encrypting)
const seed = ctx.config.path('database.seed', '');
//load the actions
const actions = new <%actions%>(engine, seed);

try { //to fetch
  const results = await actions.find({ columns, eq });
  if (!results) {
    res.setError('Not Found').setStatus(404, 'Not Found');
  } else {
    res.setResults(results);
  }
} catch(e) {
  const exception = Exception.upgrade(e as Error);
  res.setError(exception.toResponse());
}`,

};