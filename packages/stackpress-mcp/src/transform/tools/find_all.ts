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
import { getQuerySelectors, typemap } from '../helpers.js';

export default function generate(directory: Directory, model: Model) {
  const {
    filters,
    spans,
    strings,
    sortables,
    columns
  } = getQuerySelectors(model);
  const filepath = model.name.toPathName('%s/tools/find_all.ts');
  //load Profile/tools/find_all.ts if it exists, if not create it
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

  //export const schema = searchSchema;
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
        sort: sortables.map(([ name, column ]) => ({
          name: getAlias(name),
          description: [
            `Sort records by ${column.parent!.name.toString()} ${column.name.toString()} in ascending or descending order`,
            column.document.description || ''
          ].filter(Boolean).join('; ')
        })),
        columns: Array.from(columns).join(', '),
        query: JSON.stringify(
          model.store.query.length > 0 ? model.store.query : [ '*' ]
        )
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
      })),
      sort: sortables.map(([ name ]) => ({
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
};

export const TEMPLATE = {

//export const schema = {};
SCHEMA:
`{
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
  <%#@:sort order%>
    sort__<%order.name%>: z.enum(['asc', 'desc']).optional().describe('<%order.description%>'),
  <%/@:sort%>
  skip: z.number().optional().describe('Number of records to skip'),
  take: z.number().optional().describe('Number of records to take'),
  columns: z.array(z.string()).optional().describe('Columns to include in the results (default: <%query%>) valid selectors include: <%columns%>')
}`,

//export const info = { title, description, inputSchema };
INFO:
`{
  title: 'Find All - <%model%>',
  description: 'Search <%model%> records using the generated Stackpress actions class.',
  inputSchema: schema
}`,

//export async function handler(params: Args, ctx: Server) {};
HANDLER:
`const request = args.parse(params);
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
<%#@:sort order%>
  if (typeof request.sort__<%order.name%> !== 'undefined') {
    nest.withPath.set('sort.<%order.path%>', request.sort__<%order.name%>);
  }
<%/@:sort%>
if (typeof request.skip !== 'undefined') {
  nest.set('skip', request.skip);
}
if (typeof request.take !== 'undefined') {
  nest.set('take', request.take);
}
if (typeof request.columns !== 'undefined') {
  nest.set('columns', request.columns);
}
const query = nest.get<StoreSelectQuery>();
const seed = ctx.config.path('database.seed', '');
const engine = ctx.plugin<DatabasePlugin>('database');
const actions = new <%actions%>(engine, seed);
const results = await actions.findAll(query);
const total = await actions.count(query);
return toMcpText({ total, results });`,

//export default function register(server: McpServer, ctx: Server) {};
REGISTER:
`server.registerTool('<%model%>_find_all', info, params => handler(params, ctx));`
};
