//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress-schema
import type Schema from 'stackpress-schema/Schema';
import { 
  loadProjectFile,
  renderCode
} from 'stackpress-schema/transform/helpers';

export default function generate(directory: Directory, schema: Schema) {
  const filepath = 'mcp/tools/list_models.ts';
  //load mcp/tools/list_models.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
  source.addImportDeclaration({
    namedImports: ['McpServer'],
    moduleSpecifier: '@modelcontextprotocol/sdk/server/mcp.js',
  });
  
  //------------------------------------------------------------------//
  // Import Stackpress

  //import { toMcpText } from 'stackpress-mcp/helpers';
  source.addImportDeclaration({
    namedImports: ['toMcpText'],
    moduleSpecifier: 'stackpress-mcp/helpers',
  });

  //------------------------------------------------------------------//
  // Import Client
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
          + 'specific model, properties, and relations.'
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

  //export default function register(server: McpServer) {};
  source.addFunction({
    name: 'register',
    isDefaultExport: true,
    parameters: [{ name: 'server', type: 'McpServer' }],
    statements: TEMPLATE.REGISTER
  });
};

export const TEMPLATE = {

//export const info = { title, description, inputSchema };
INFO:
`{
  title: 'List Models',
  description: '<%description%>',
  inputSchema: schema
}`,

//export async function handler() {};
HANDLER:
`return toMcpText(<%models%>);`,

//export default function register(server: McpServer) {};
REGISTER:
`server.registerTool('list_models', info, () => handler());`

};