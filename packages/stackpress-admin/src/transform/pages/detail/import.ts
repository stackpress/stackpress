//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';
//stackpress-admin
import type { Relationship } from '../../types.js';

export default function generate(
  directory: Directory, 
  model: Model, 
  relationship: Relationship
) {
  //NOTE: in related, the local model is the foreign 
  // model, and the foreign model is this model
  const foreignModel = relationship.local.model as Model;
  //relation used for filepaths and function names
  const relatedColumn = relationship.foreign.column;

  //------------------------------------------------------------------//
  // Profile/admin/pages/Auth/import.ts

  const filepath = renderCode(
    '<%model%>/admin/pages/<%relation%>/import.ts', 
    {
      model: model.name.toPathName(),
      relation: relatedColumn.name.toString()
    }
  );
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules
  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { Request, Response, Server } from 'stackpress-server';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-server',
    namedImports: [ 'Request', 'Response', 'Server' ]
  });

  //------------------------------------------------------------------//
  // Import Client

  //import type { Auth } from '../../../../Auth/types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: foreignModel.name.toPathName('../../../../%s/types.js'),
    namedImports: [ 
      foreignModel.name.toTypeName() 
    ]
  });
  //import type { ProfileExtended } from '../../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../../types.js',
    namedImports: [ model.name.toTypeName('%sExtended') ]
  });

  //------------------------------------------------------------------//
  // Exports

  //export default async function ProfileAdminImportPage(req, res, ctx) {}
  source.addFunction({
    isDefaultExport: true,
    isAsync: true,
    name: renderCode('<%model%>Admin<%relation%>ImportPage', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName(),
    }),
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.IMPORT, { 
      type: foreignModel.name.toTypeName(),
      extended: model.name.toClassName('%sExtended'),
      detail: model.name.toEventName('%s-detail'),
      batch: foreignModel.name.toEventName('%s-batch'),
      id: {
        foreign: relationship.foreign.key.name.toString(),
        local: relationship.local.key.name.toString()
      },
      hashes: model.value.hashed?.map(
        column => ({ column: column.name.toString() })
      ).toArray() || []
    })
  });
};

export const TEMPLATE = {

IMPORT:
`//if there is a response body or there is an error code
if (res.body || (res.code && res.code !== 200)) {
  //let the response pass through
  return;
}

//first get the detail
const detail = await ctx.resolve<Partial<<%extended%>>>('<%detail%>', req);
//if there's an error, let it pass
if (detail.code !== 200) {
  res.fromStatusResponse(detail);
  return;
}
<%#?:hashes.length%>
  //remove hashed data
  <%#@:hashes%>
    if (typeof detail.results?.<%column%> !== 'undefined') {
      delete detail.results.<%column%>;
    }
  <%/@:hashes%>
<%/?:hashes.length%>

//if form submitted
if (req.method === 'POST') {
  const rows = req.data.path<Array<Partial<<%type%>>>>('rows', []);
  const batch = Array.isArray(rows) ? rows.map(row => ({
    ...row,
    <%id.local%>: req.data('<%id.foreign%>'),
  })) : [];
  //emit the batch event
  await ctx.resolve('<%batch%>', { rows: batch }, res);
}`,

};