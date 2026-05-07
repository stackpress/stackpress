//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import {
  loadProjectFile,
  renderCode
} from 'stackpress-schema/transform/helpers';
//stackpress-sql
import { getAlias } from 'stackpress-sql/helpers';
//stackpress-mcp
import { typemap, getInputShape, getQuerySelectors } from '../helpers.js';

export default function generate(directory: Directory, model: Model) {
  const enums: string[] = [];
  model.columns.forEach(column => {
    if (column.type.enum) {
      enums.push(column.type.name);
    }
  });
  const { filters, spans, strings } = getQuerySelectors(model);

  const filepath = model.name.toPathName('%s/tools/update_rows.ts');
  //load Profile/tools/update_rows.ts if it exists, if not create it
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
  //import Nest from '@stackpress/lib/Nest';
  source.addImportDeclaration({
    defaultImport: 'Nest',
    moduleSpecifier: '@stackpress/lib/Nest'
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { DatabasePlugin, StoreSelectQuery } from 'stackpress-sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    namedImports: [ 'DatabasePlugin', 'StoreSelectQuery' ],
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
        searchable: model.store.searchables.size > 0,
        eq: filters.map(([ name, column ]) => ({
          name: getAlias(name),
          type: column.type.name in typemap
            ? typemap[column.type.name]
            : column.type.enum
            ? typemap.String
            : typemap.Unknown,
          description: [
            `Filter records where ${column.parent!.name.toString()} ${column.name.toString()} is equal to one of the given values`,
            column.document.description || ''
          ].filter(Boolean).join('; ')
        })),
        ne: filters.map(([ name, column ]) => ({
          name: getAlias(name),
          type: column.type.name in typemap
            ? typemap[column.type.name]
            : column.type.enum
            ? typemap.String
            : typemap.Unknown,
          description: [
            `Filter records where ${column.parent!.name.toString()} ${column.name.toString()} is not equal to one of the given values`,
            column.document.description || ''
          ].filter(Boolean).join('; ')
        })),
        ge: spans.map(([ name, column ]) => ({
          name: getAlias(name),
          type: column.type.name in typemap
            ? typemap[column.type.name]
            : column.type.enum
            ? typemap.String
            : typemap.Unknown,
          description: [
            `Filter records where ${column.parent!.name.toString()} ${column.name.toString()} is greater than or equal to one of the given values`,
            column.document.description || ''
          ].filter(Boolean).join('; ')
        })),
        lt: spans.map(([ name, column ]) => ({
          name: getAlias(name),
          type: column.type.name in typemap
            ? typemap[column.type.name]
            : column.type.enum
            ? typemap.String
            : typemap.Unknown,
          description: [
            `Filter records where ${column.parent!.name.toString()} ${column.name.toString()} is less than or equal to one of the given values`,
            column.document.description || ''
          ].filter(Boolean).join('; ')
        })),
        has: strings.map(([ name, column ]) => ({
          name: getAlias(name),
          type: column.type.name in typemap
            ? typemap[column.type.name]
            : column.type.enum
            ? typemap.String
            : typemap.Unknown,
          description: [
            `Filter records where ${column.parent!.name.toString()} ${column.name.toString()} (array) contains a value`,
            column.document.description || ''
          ].filter(Boolean).join('; ')
        })),
        hasnt: strings.map(([ name, column ]) => ({
          name: getAlias(name),
          type: column.type.name in typemap
            ? typemap[column.type.name]
            : column.type.enum
            ? typemap.String
            : typemap.Unknown,
          description: [
            `Filter records where ${column.parent!.name.toString()} ${column.name.toString()} (array) does not contain a value`,
            column.document.description || ''
          ].filter(Boolean).join('; ')
        })),
        columns: model.columns.filter(
          column => !column.type.model
        ).map(column => ({
          name: column.name.toString(),
          shape: getInputShape(column, true)
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
      actions: model.name.toClassName('%sActions'),
      searchable: model.store.searchables.size > 0,
      eq: filters.map(([ name ]) => ({
        path: name,
        name: getAlias(name)
      })),
      ne: filters.map(([ name ]) => ({
        path: name,
        name: getAlias(name)
      })),
      ge: spans.map(([ name ]) => ({
        path: name,
        name: getAlias(name)
      })),
      lt: spans.map(([ name ]) => ({
        path: name,
        name: getAlias(name)
      })),
      has: strings.map(([ name ]) => ({
        path: name,
        name: getAlias(name)
      })),
      hasnt: strings.map(([ name ]) => ({
        path: name,
        name: getAlias(name)
      }))
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
  query: z.object({
    <%#?:searchable%>
      q: z.string().optional().describe('Search query string'),
    <%/?:searchable%>
    <%#@:eq filter%>
      <%filter.name%>__eq: z.array(<%filter.type%>).optional().describe('<%filter.description%>'),
    <%/@:eq%>
    <%#@:ne filter%>
      <%filter.name%>__ne: z.array(<%filter.type%>).optional().describe('<%filter.description%>'),
    <%/@:ne%>
    <%#@:ge filter%>
      <%filter.name%>__ge: z.array(<%filter.type%>).optional().describe('<%filter.description%>'),
    <%/@:ge%>
    <%#@:le filter%>
      <%filter.name%>__le: z.array(<%filter.type%>).optional().describe('<%filter.description%>'),
    <%/@:le%>
    <%#@:has filter%>
      <%filter.name%>__has: z.array(<%filter.type%>).optional().describe('<%filter.description%>'),
    <%/@:has%>
    <%#@:hasnt filter%>
      <%filter.name%>__hasnt: z.array(<%filter.type%>).optional().describe('<%filter.description%>'),
    <%/@:hasnt%>
  }),
  input: z.object({
    <%#@:columns column%>
      <%column.name%>: <%column.shape%>,
    <%/@:columns%>
  }) 
}`,

//export const info = { title, description, inputSchema };
INFO:
`{
  title: 'Update Rows - <%model%>',
  description: 'Update matching <%model%> rows using the generated Stackpress actions class.',
  inputSchema: schema
}`,

//export async function handler(params: Args, ctx: Server) {};
HANDLER:
`const { query: request, input } = args.parse(params);
const nest = new Nest();
<%#?:searchable%>
  if (typeof request.q !== 'undefined') {
    nest.set('q', request.q);
  }
<%/?:searchable%>
<%#@:eq filter%>
  if (typeof request.<%filter.name%>__eq !== 'undefined') {
    nest.withPath.set('eq.<%filter.path%>', request.<%filter.name%>__eq);
  }
<%/@:eq%>
<%#@:ne filter%>
  if (typeof request.<%filter.name%>__ne !== 'undefined') {
    nest.withPath.set('ne.<%filter.path%>', request.<%filter.name%>__ne);
  }
<%/@:ne%>
<%#@:ge filter%>
  if (typeof request.<%filter.name%>__ge !== 'undefined') {
    nest.withPath.set('ge.<%filter.path%>', request.<%filter.name%>__ge);
  }
<%/@:ge%>
<%#@:le filter%>
  if (typeof request.<%filter.name%>__le !== 'undefined') {
    nest.withPath.set('le.<%filter.path%>', request.<%filter.name%>__le);
  }
<%/@:le%>
<%#@:has filter%>
  if (typeof request.<%filter.name%>__has !== 'undefined') {
    nest.withPath.set('has.<%filter.path%>', request.<%filter.name%>__has);
  }
<%/@:has%>
<%#@:hasnt filter%>
  if (typeof request.<%filter.name%>__hasnt !== 'undefined') {
    nest.withPath.set('hasnt.<%filter.path%>', request.<%filter.name%>__hasnt);
  }
<%/@:hasnt%>
const query = nest.get<StoreSelectQuery>();
const seed = ctx.config.path('database.seed', '');
const engine = ctx.plugin<DatabasePlugin>('database');
const actions = new <%actions%>(engine, seed);
const results = await actions.update(query, input);
return toMcpText({ total: results.length, results });`,

//export default function register(server: McpServer, ctx: Server) {};
REGISTER:
`server.registerTool('<%model%>_update_rows', info, params => handler(params, ctx));`
};
