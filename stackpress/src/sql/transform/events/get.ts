//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

export default function generate(directory: Directory, model: Model) {
  const filepath = model.name.toPathName('%s/events/get.ts');
  //load Profile/events/get.ts if it exists, if not create it
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

  //export default async function ProfileGetEvent(
  //  req: Request, 
  //  res: Response, 
  //  ctx: Server
  //) {}
  source.addFunction({
    name: model.name.toPropertyName('%sGetEvent', true),
    isDefaultExport: true,
    isAsync: true,
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.GET, { 
      actions: model.name.toClassName('%sActions')
    })
  });
};

export const TEMPLATE = {

GET:
`//if there is a response body or there is an error code
//then let the response pass through
if (res.body || (res.code && res.code !== 200)) return;

//get the database engine
const engine = ctx.plugin<DatabasePlugin>('database');
//if no engine, then we cant do anything...
//so let the response pass through
if (!engine) return;

//collect errors manually
const errors: Record<string, string> = {};
//get the value
const value = req.data('value');
if (typeof value === 'undefined') {
  errors['value'] = 'Missing or invalid value';
}
//get the key
const key = req.data('key');  
if (typeof key === 'undefined') {
  errors['key'] = 'Missing or invalid key';
}
//any errors?
if (Object.keys(errors).length > 0) {
  res.setError('Invalid Parameters', errors).setStatus(400, 'Bad Request');
  return;
}

const selectors = req.data.has('columns') 
  ? req.data<string[]>('columns') 
  : [ '<%columns%>' ];
//determine the selectors from the columns
const columns = Array.isArray(selectors) && selectors.every(
  column => typeof column === 'string' && column.length > 0
) ? selectors : [ '*' ];
const eq = { [key]: value };

//get the database seed (for encrypting)
const seed = ctx.config.path('database.seed', '');
//load the actions
const actions = new <%actions%>(engine, seed);

try { //to get
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