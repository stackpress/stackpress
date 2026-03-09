//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

export default function generate(directory: Directory, model: Model) {
  const filepath = model.name.toPathName('%s/admin/pages/import.ts');
  //load Profile/admin/pages/import.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

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
    name: model.name.toClassName('%sAdminImportPage'),
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.IMPORT, { 
      event: model.name.toEventName()
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
//if form submitted
if (req.method === 'POST') {
  //emit the batch event
  await ctx.emit('<%event%>-batch', req, res);
}`,

};