//modules
import type { Directory, SourceFile } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import type Schema from 'stackpress-schema/Schema';
import { 
  loadProjectFile,
  renderCode 
} from 'stackpress-schema/transform/helpers';
//stackpress-mcp
import generateGetModel from './tools/get_model.js';
import generateFindAll from './tools/find_all.js';
import generateFindFirst from './tools/find_first.js';
import generateCreateRow from './tools/create_row.js';
import generateUpdateRows from './tools/update_rows.js';
import generateRemoveRows from './tools/remove_rows.js';

export default async function generate(directory: Directory, schema: Schema) {
  for (const model of schema.models.values()) {
    generateGetModel(directory, model);
    generateFindAll(directory, model);
    generateFindFirst(directory, model);
    generateCreateRow(directory, model);
    generateUpdateRows(directory, model);
    generateRemoveRows(directory, model);
    generateIndex(directory, model);
  }

  const filepath = 'tools.ts';
  //load tools.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  generateListModels(source, schema);
};

export function generateIndex(directory: Directory, model: Model) {
  const filepath = model.name.toPathName('%s/tools/index.ts');
  //load Profile/tools/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules
  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client

  //import * as create_row from './create_row.js';
  source.addImportDeclaration({
    namespaceImport: 'create_row',
    moduleSpecifier: './create_row.js'
  });

  //import * as find_all from './find_all.js';
  source.addImportDeclaration({
    namespaceImport: 'find_all',
    moduleSpecifier: './find_all.js'
  });

  //import * as find_first from './find_first.js';
  source.addImportDeclaration({
    namespaceImport: 'find_first',
    moduleSpecifier: './find_first.js'
  });

  //import * as get_model from './get_model.js';
  source.addImportDeclaration({
    namespaceImport: 'get_model',
    moduleSpecifier: './get_model.js'
  });

  //import * as remove_rows from './remove_rows.js';
  source.addImportDeclaration({
    namespaceImport: 'remove_rows',
    moduleSpecifier: './remove_rows.js'
  });

  //import * as update_rows from './update_rows.js';
  source.addImportDeclaration({
    namespaceImport: 'update_rows',
    moduleSpecifier: './update_rows.js'
  });

  //------------------------------------------------------------------//
  // Exports

  //export { create_row, find_all, find_first, get_model, remove_rows, update_rows };
  source.addExportDeclaration({
    namedExports: [ 
      'create_row', 
      'find_all', 
      'find_first', 
      'get_model', 
      'remove_rows', 
      'update_rows' 
    ]
  });
};

export function generateListModels(source: SourceFile, schema: Schema) {
  //------------------------------------------------------------------//
  // Import Modules

  //import type Server from '@stackpress/ingest/Server';
  source.addImportDeclaration({
    isTypeOnly: true,
    defaultImport: 'Server',
    moduleSpecifier: '@stackpress/ingest/Server'
  });
  //import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
  source.addImportDeclaration({
    namedImports: [ 'McpServer' ],
    moduleSpecifier: '@modelcontextprotocol/sdk/server/mcp.js'
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import { toMcpText } from 'stackpress-mcp/helpers';
  source.addImportDeclaration({
    namedImports: [ 'toMcpText' ],
    moduleSpecifier: 'stackpress-mcp/helpers'
  });

  //------------------------------------------------------------------//
  // Import Client

  //import * as profileTools from './Profile/tools/index.js';
  for (const model of schema.models.values()) {
    source.addImportDeclaration({
      namespaceImport: model.name.toPropertyName('%sTools', false),
      moduleSpecifier: model.name.toPathName('./%s/tools/index.js')
    });
  }

  //------------------------------------------------------------------//
  // Exports

  //export const schema = {};
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{ name: 'schema', initializer: '{}' }]
  });

  //export const info = { title, description, inputSchema };
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'info',
      initializer: renderCode(TEMPLATE.INFO, {
        description: 'Returns a list of all models used in this project. '
          + 'Models represent the main data structure, organized by '
          + 'properties (columns) and their relations to other models. '
          + 'Use `get_model` to retrieve detailed information about a '
          + 'specific model, properties, and relations.',
      })
    }]
  });

  //export async function handler() {};
  source.addFunction({
    name: 'handler',
    isExported: true,
    isAsync: true,
    statements: renderCode(TEMPLATE.HANDLER, {
      models: JSON.stringify(
        schema.models.map(model => model.name.toString()).toArray()
      )
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
      models: schema.models.map(model => ({
        lower: model.name.toPropertyName(),
        tools: model.name.toPropertyName('%sTools', false)
      })).toArray()
    })
  });

  //export default register;
  source.addStatements('export default register;');
};

export const TEMPLATE = {

//export const info = { title, description, inputSchema };
INFO:
`{
  title: 'List Models',
  description: '<%description%>',
  inputSchema: schema
};`,

//export async function handler() {};
HANDLER:
`return toMcpText(<%models%>);`,

REGISTER:
`
//tool: list_models
server.registerTool('list_models', info, () => handler());
<%#@:models model%>//
  //tool: <%model.lower%>_get_model
  <%model.tools%>.get_model.register(server);
  //tool: <%model.lower%>_create_row
  <%model.tools%>.create_row.register(server, ctx);
  //tool: <%model.lower%>_find_all
  <%model.tools%>.find_all.register(server, ctx);
  //tool: <%model.lower%>_find_first
  <%model.tools%>.find_first.register(server, ctx);
  //tool: <%model.lower%>_remove_rows
  <%model.tools%>.remove_rows.register(server, ctx);
  //tool: <%model.lower%>_update_rows
  <%model.tools%>.update_rows.register(server, ctx);
<%/@:models%>`
};
