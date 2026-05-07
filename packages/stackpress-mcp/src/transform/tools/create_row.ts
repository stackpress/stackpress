//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import {
  loadProjectFile,
  renderCode
} from 'stackpress-schema/transform/helpers';
//stackpress-mcp
import { getInputShape } from '../helpers.js';

export default function generate(directory: Directory, model: Model) {
  const enums: string[] = [];
  model.columns.forEach(column => {
    if (column.type.enum) {
      enums.push(column.type.name);
    }
  });

  const filepath = model.name.toPathName('%s/tools/create_row.ts');
  //load Profile/tools/create_row.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import type Server from '@stackpress/ingest/Server';
  source.addImportDeclaration({
    isTypeOnly: true,
    defaultImport: 'Server',
    moduleSpecifier: '@stackpress/ingest/Server'
  });
  //import * as z from 'zod';
  source.addImportDeclaration({
    namespaceImport: 'z',
    moduleSpecifier: 'zod'
  });
  //import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
  source.addImportDeclaration({
    namedImports: [ 'McpServer' ],
    moduleSpecifier: '@modelcontextprotocol/sdk/server/mcp.js'
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { DatabasePlugin } from 'stackpress-sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    namedImports: [ 'DatabasePlugin' ],
    moduleSpecifier: 'stackpress-sql/types'
  });
  //import { toMcpText } from 'stackpress-mcp/helpers';
  source.addImportDeclaration({
    namedImports: [ 'toMcpText' ],
    moduleSpecifier: 'stackpress-mcp/helpers'
  });

  //------------------------------------------------------------------//
  // Import Client

  //import type { Role } from '../../enum.js';
  if (enums.length > 0) {
    source.addImportDeclaration({
      moduleSpecifier: '../../enums.js',
      namedImports: enums
    });
  }
  //import ProfileActions from '../ProfileActions.js';
  source.addImportDeclaration({
    defaultImport: model.name.toClassName('%sActions'),
    moduleSpecifier: model.name.toPathName('../%sActions.js')
  });

  //------------------------------------------------------------------//
  // Exports

  //export type Args = z.infer<typeof args>;
  source.addTypeAlias({
    name: 'Args',
    isExported: true,
    type: 'z.infer<typeof args>'
  });

  //export const schema = {};
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'schema',
      initializer: renderCode(TEMPLATE.SCHEMA, {
        columns: model.columns.filter(
          column => !column.type.model
        ).map(column => ({
          name: column.name.toString(),
          shape: getInputShape(column)
        })).toArray()
      })
    }]
  });

  //export const args = z.object(schema);
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'args',
      initializer: 'z.object(schema)'
    }]
  });

  //export const info = { title, description, inputSchema };
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'info',
      initializer: renderCode(TEMPLATE.INFO, {
        model: model.name.toString()
      })
    }]
  });

  //export async function handler(params: Args, ctx: Server) {};
  source.addFunction({
    name: 'handler',
    isExported: true,
    isAsync: true,
    parameters: [
      { name: 'params', type: 'Args' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.HANDLER, {
      actions: model.name.toClassName('%sActions')
    })
  });

  //export function register(server: McpServer, ctx: Server) {};
  source.addFunction({
    name: 'register',
    isExported: true,
    parameters: [
      { name: 'server', type: 'McpServer' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.REGISTER, {
      model: model.name.toPropertyName('%s', false)
    })
  });

  //export default register;
  source.addStatements('export default register;');
}

export const TEMPLATE = {

//export const schema = {};
SCHEMA:
`{ 
  input: z.object({
    <%#@:columns column%>
      <%column.name%>: <%column.shape%>,
    <%/@:columns%>
  }) 
}`,

//export const info = { title, description, inputSchema };
INFO:
`{
  title: 'Create Row - <%model%>',
  description: 'Create one <%model%> row using the generated Stackpress actions class.',
  inputSchema: schema
}`,

//export async function handler(params: Args, ctx: Server) {};
HANDLER:
`const { input } = args.parse(params);
const seed = ctx.config.path('database.seed', '');
const engine = ctx.plugin<DatabasePlugin>('database');
const actions = new <%actions%>(engine, seed);
const result = await actions.create(input);
return toMcpText(result);`,

//export default function register(server: McpServer, ctx: Server) {};
REGISTER:
`server.registerTool('<%model%>_create_row', info, params => handler(params, ctx));`
};
