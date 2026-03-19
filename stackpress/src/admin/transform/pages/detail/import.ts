//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Column from '../../../../schema/Column.js';
import type Fieldset from '../../../../schema/Fieldset.js';
import type Model from '../../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../../schema/transform/helpers.js';

export type Relationship = {
  foreign: {
      model: Model,
      column: Column,
      key: Column,
      type: number
  },
  local: {
      model: Fieldset,
      column: Column,
      key: Column,
      type: number
  };
};

export default function generate(
  directory: Directory, 
  model: Model, 
  relationship: Relationship
) {
  const foreign = relationship.local.model as Model;

  const filepath = renderCode(
    '<%model%>/admin/pages/<%relation%>/import.ts', 
    {
      model: model.name.toPathName(),
      relation: foreign.name.toPathName()
    }
  );
  //load Profile/admin/pages/Auth/import.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import type { ProfileExtended } from '../../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../../types.js',
    namedImports: [ model.name.toTypeName('%sExtended') ]
  });
  //import type { Auth } from '../../../../Auth/types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: foreign.name.toPathName('../../../../%s/types.js'),
    namedImports: [ 
      foreign.name.toTypeName() 
    ]
  });

  //import type { Request, Response, Server } from 'stackpress/server';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/server',
    namedImports: [ 'Request', 'Response', 'Server' ]
  });

  //export default async function ProfileAdminImportPage(req: Request, res: Response, ctx: Server) {}
  source.addFunction({
    isDefaultExport: true,
    isAsync: true,
    name: renderCode('<%model%>Admin<%relation%>ImportPage', {
      model: model.name.toComponentName(),
      relation: foreign.name.toComponentName(),
    }),
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.IMPORT, { 
      type: foreign.name.toTypeName(),
      extended: model.name.toClassName('%sExtended'),
      detail: model.name.toEventName('%s-detail'),
      batch: foreign.name.toEventName('%s-batch'),
      id: {
        foreign: relationship.foreign.key.name.toString(),
        local: relationship.local.key.name.toString()
      },
      relation: foreign.name.toPropertyName(),
      hash: model.value.hashed.size > 0,
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
<%#hash%>
  //remove hashed data
  <%#hashes%>
    if (typeof detail.results?.<%column%> !== 'undefined') {
      delete detail.results.<%column%>;
    }
  <%/hashes%>
<%/hash%>

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