//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
import { isObject } from '@stackpress/lib/Nest';
//stackpress-schema
import type Column from 'stackpress-schema/Column';
import type Columns from 'stackpress-schema/Columns';
import type Model from 'stackpress-schema/Model';
import type Schema from 'stackpress-schema/Schema';
import { 
  loadProjectFile,
  renderCode
} from 'stackpress-schema/transform/helpers';
//stackpress-mcp
import { getArticle } from '../helpers.js';

export default function generate(directory: Directory, schema: Schema) {
  const filepath = 'mcp/tools/get_model.ts';
  //load Profile/mcp/tools/get_model.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import * as z from 'zod';
  source.addImportDeclaration({
    namespaceImport: 'z',
    moduleSpecifier: 'zod',
  });
  //import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
  source.addImportDeclaration({
    namedImports: ['McpServer'],
    moduleSpecifier: '@modelcontextprotocol/sdk/server/mcp.js',
  });
  
  //------------------------------------------------------------------//
  // Import Stackpress

  //import { toMcpText } from 'stackpress-mcp/helpers.js';
  source.addImportDeclaration({
    namedImports: ['toMcpText'],
    moduleSpecifier: 'stackpress-mcp/helpers',
  });

  //------------------------------------------------------------------//
  // Import Client

  //import { handler as profileHandler} from '../../Profile/mcp/tools/get_model.js';
  for (const model of schema.models.values()) {
    generateModel(directory, model);
    source.addImportDeclaration({
      namedImports: [
        model.name.toPropertyName('handler as %sHandler', false)
      ],
      moduleSpecifier: model.name.toPathName('../../%s/mcp/tools/get_model.js')
    });
  }

  //------------------------------------------------------------------//
  // Exports

  //export type Args = z.infer<typeof args>;
  source.addTypeAlias({
    name: 'Args',
    isExported: true,
    type: 'z.infer<typeof schema>'
  });

  //export const schema = { model: z.string() };
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{ 
      name: 'schema', 
      initializer: `{ model: z.string() }`
    }]
  });

  //export const args = z.object(schema);
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{ name: 'args', initializer: 'z.object(schema)' }]
  });

  //export const info = { title, description, inputSchema };
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'info',
      initializer: renderCode(TEMPLATE.INFO, {
        description: 'Get the model definition, properties '
          + 'and relation information given the model name.'
      })
    }]
  });

  //export async function handler(args: Args) {};
  source.addFunction({
    name: 'handler',
    isExported: true,
    isAsync: true,
    parameters: [{ name: 'args', type: 'Args' }],
    statements: renderCode(TEMPLATE.HANDLER, {
      models: schema.models.map(model => ({
        name: model.name.toString(),
        handler: model.name.toPropertyName('%sHandler', false)
      })).toArray()
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

export function generateModel(directory: Directory, model: Model) {
  const filepath = model.name.toPathName('%s/mcp/tools/get_model.ts');
  //load Profile/mcp/tools/get_model.ts if it exists, if not create it
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
    declarations: [{ 
      name: 'schema', 
      initializer: `{}`
    }]
  });

  //export const info = { title, description, inputSchema };
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'info',
      initializer: renderCode(TEMPLATE.MODEL_INFO, {
        model: model.name.toString()
      })
    }]
  });

  //export default async function handler() {};
  source.addFunction({
    name: 'handler',
    isExported: true,
    isAsync: true,
    statements: 'return toMcpText(docs);'
  });

  //export default function register(server: McpServer) {};
  source.addFunction({
    name: 'register',
    isDefaultExport: true,
    parameters: [{ name: 'server', type: 'McpServer' }],
    statements: renderCode(TEMPLATE.MODEL_REGISTER, {
      model: model.name.toPropertyName('%s', false)
    })
  });

  //export const docs = ``;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{ 
      name: 'docs', 
      initializer: generateDocs(model)
    }]
  });
};

export function generateDocs(model: Model) {
  const markdown: string[] = [];
  markdown.push(`# Model: ${model.name.toString()}`);
  if (model.document.description) {
    markdown.push('');
    markdown.push(model.document.description);
  }
  markdown.push('');
  markdown.push(`- Recommended Icon: ${model.name.icon}`);
  markdown.push(`- Singular Label: "${model.name.singular}"`);
  markdown.push(`- Plural Label: "${model.name.plural}"`);
  markdown.push(`- Per Row Display Format: \`${model.name.display}\``);
  if (model.store.ids.size > 0) {
    markdown.push(`- Primary IDs: ${model.store.ids.map(
      column => `\`${column.name.toString()}\``
    ).toArray().join(', ')}`);
  }
  if (model.store.uniques.size > 0) {
    markdown.push(`- Unique value properties: ${model.store.uniques.map(
      column => `\`${column.name.toString()}\``
    ).toArray().join(', ')}`);
  }
  if (model.store.active) {
    markdown.push(`- Active toggle property: \`${model.store.active.name.toString()}\``);
  }
  if (model.store.timestamp) {
    markdown.push(`- Timestamp property: \`${model.store.timestamp.name.toString()}\``);
  }
  if (model.store.sortables.size > 0) {
    markdown.push(`- Sortable properties: ${model.store.sortables.map(
      column => `\`${column.name.toString()}\``
    ).toArray().join(', ')}`);
  }
  if (model.component.filterFields.size > 0
    || model.component.spanFields.size > 0
  ) {
    const filters = model.component.filterFields.map(
      column => `\`${column.name.toString()}\``
    ).toArray();
    const spans = model.component.spanFields.map(
      column => `\`${column.name.toString()}\` (range)`
    ).toArray();
    markdown.push(`- Filterable properties: ${[ ...filters, ...spans ].join(', ')}`);
  }

  markdown.push('');
  markdown.push('## Properties');

  markdown.push('');
  markdown.push('The following properties are defined for this model.');

  model.columns.filter(column => !column.type.model).forEach(column => {
    markdown.push(...generateDocsColumn(column));
  });

  if (model.store.foreignRelationships.size > 0) {
    markdown.push('');
    markdown.push('## Relationships');

    model.store.foreignRelationships.forEach(column => {
      markdown.push(...generateDocsRelation(column));
    });
  }

  markdown.push(...generateDocsTools(model));
  
  return `\`${markdown.join('\n').replace(/`/g, '\\`')}\``;
};

export function generateDocsColumn(column: Column) {
  const markdown: string[] = [];
  const type = [
    column.type.name === 'Hash' || column.type.name === 'Json'
      ? 'Object' 
      : column.type.name,
    column.type.nullable ? '?' : column.type.multiple ? '[]' : ''
  ].join('');

  const assertions = column.assertion.assertions.map(
    assertion => assertion.name === 'array' 
      ? 'Should be an array' 
      : assertion.message.endsWith('.')
      ? assertion.message.substring(0, assertion.message.length - 1)
      : assertion.message
  );
  if (column.store.unique) {
    assertions.push('Should be a unique value');
  }

  const defaults = column.value.default === 'now()'
    ? '*(current datetime)*'
    : typeof column.value.default === 'string' 
      && (column.value.default.startsWith('cuid(')
        || column.value.default.startsWith('nanoid(')
      )
    ? `\`${column.value.default}\``
    : `\`${JSON.stringify(column.value.default)}\``;

  markdown.push('');
  markdown.push(`### ${column.name.label}`);
  if (column.document.description) {
    markdown.push('');
    markdown.push(column.document.description);
  }
  markdown.push('');
  markdown.push(`- Property name: \`${column.name.toString()}\``);
  markdown.push(`- Property label: "${column.name.label}"`);
  column.type.enum || column.type.fieldset
    ? markdown.push(`- Property type: \`${type}\``)
    : markdown.push(`- Property type: \`${type.toLowerCase()}\``);
  column.type.enum
    ? markdown.push(`- Type description: enum with possible values: "${Object.values(column.type.enum).join('", "')}"`)
    : column.type.fieldset
    ? markdown.push(`- Type description: a fieldset object. see: ${column.type.fieldset.name.toString()}`)
    : markdown.push('- Type description: Primitive');   
  markdown.push(`- As multiple values (array): ${column.type.multiple ? 'Yes' : 'No'}`);
  !column.type.nullable && typeof column.value.default === 'undefined'
    ? markdown.push('- Required on creation: Yes')
    : markdown.push('- Required on creation: No');
  if (column.value.default) {
    markdown.push(`- Default value: ${defaults}`);
  }
  if (column.type.name === 'String') {
    column.number.chars && markdown.push(`- Max characters: ${column.number.chars}`);
  } else if (column.type.name === 'Text') {
    column.number.chars && markdown.push(`- Max characters: *(unlimited)*`);
  } else if (column.type.name === 'Number'
    || column.type.name === 'Integer'
    || column.type.name === 'Float'
  ) {
    markdown.push(`- Minimum value: ${column.number.min}`);
    column.number.max > 0 && markdown.push(`- Maximum value: ${column.number.max}`);
    markdown.push(`- Step value: ${column.number.step}`);
  }
  if (assertions.length > 0) {
    markdown.push(`- Assertions: ${assertions.join('; ')}`)
  }
  if (column.document.examples.length === 1) {
    const example = column.document.examples[0]!;
    Array.isArray(example) || isObject(example) 
      ? markdown.push(`- Example: \`${JSON.stringify(example)}\``)
      : markdown.push(`- Example: \`${example}\``);
  } else if (column.document.examples.length > 1) {
    markdown.push('- Examples:')
    column.document.examples.forEach(example => {
      Array.isArray(example) || isObject(example) 
        ? markdown.push(`  - \`${JSON.stringify(example)}\``)
        : markdown.push(`  - \`${example}\``);
    });
  }
  return markdown;
};

export function generateDocsRelation(column: Column) {
  const markdown: string[] = [];
  const relation = column.store.foreignRelationship!
  const { foreign, local } = relation;
  //use relation.foreign.type and relation.local.type
  //to determine cardinality where:
  // 0 = optional
  // 1 = required
  // 2 = multiple
  const rules = foreign.type === 0 && local.type === 0 ? [ 
    `${getArticle(local.model.name.singular, true)} can have one ${foreign.model.name.singular}`,
    `${getArticle(foreign.model.name.singular, true)} can have one ${local.model.name.singular}`,
  ] : foreign.type === 0 && local.type === 1 ? [  
    `${getArticle(local.model.name.singular, true)} can have one ${foreign.model.name.singular}`,
    `${getArticle(foreign.model.name.singular, true)} must have one ${local.model.name.singular}`
  ] : foreign.type === 0 && local.type === 2 ? [ 
    `${getArticle(local.model.name.singular, true)} can have many ${foreign.model.name.plural}`,
    `${getArticle(foreign.model.name.singular, true)} can have one ${local.model.name.singular}`
  ] : foreign.type === 1 && local.type === 0 ? [ 
    `${getArticle(local.model.name.singular, true)} must have one ${foreign.model.name.singular}`, 
    `${getArticle(foreign.model.name.singular, true)} can have one ${local.model.name.singular}` 
  ] : foreign.type === 1 && local.type === 1 ? [ 
    `${getArticle(local.model.name.singular, true)} must have one ${foreign.model.name.singular}`, 
    `${getArticle(foreign.model.name.singular, true)} must have one ${local.model.name.singular}` 
  ] : foreign.type === 1 && local.type === 2 ? [ 
    `${getArticle(local.model.name.singular, true)} can have many ${foreign.model.name.plural}`,
    `${getArticle(foreign.model.name.singular, true)} must have one ${local.model.name.singular}`
  ] : foreign.type === 2 && local.type === 0 ? [ 
    `${getArticle(local.model.name.singular, true)} can have one ${foreign.model.name.singular}`, 
    `${getArticle(foreign.model.name.singular, true)} can have many ${local.model.name.plural}` 
  ] : foreign.type === 2 && local.type === 1 ? [ 
    `${getArticle(local.model.name.singular, true)} must have one ${foreign.model.name.singular}`, 
    `${getArticle(foreign.model.name.singular, true)} can have many ${local.model.name.plural}` 
  ] : [ //foreign.type === 2 && local.type === 2
    `${getArticle(local.model.name.singular, true)} can have many ${foreign.model.name.plural}`, 
    `${getArticle(foreign.model.name.singular, true)} can have many ${local.model.name.plural}` 
  ];

  const cardinality = [
    foreign.type === 2 ? 'N' : foreign.type,
    local.type === 2 ? 'N' : local.type
  ].join(':');
  markdown.push('');
  markdown.push(`### ${column.name.toString()}`);
  markdown.push('');
  markdown.push(`- Foreign model: \`${relation.foreign.model.name.toString()}\``);
  markdown.push(`- Foreign property: \`${relation.foreign.key.name.toString()}\``);
  markdown.push(`- Local property: \`${relation.local.key.name.toString()}\``);
  markdown.push(`- Cardinality: \`${cardinality}\``);
  markdown.push(`  - ${rules[0]}`);
  markdown.push(`  - ${rules[1]}`);
  markdown.push(`- Results namespace: \`${relation.local.column.name.toString()}\``);

  return markdown;
};

export function generateDocsTools(model: Model) {
  const markdown: string[] = [];
  markdown.push('');
  markdown.push('## Tools');
  markdown.push('');
  markdown.push('The following tools are available specifically for this model.');
  
  markdown.push(...generateDocsToolsFindAll(model));

  return markdown;
};

export function generateDocsToolsFindAll(model: Model) {
  const markdown: string[] = [];
  markdown.push('');
  markdown.push('### Find All');
  markdown.push('');
  markdown.push(`Tool name: \`${model.name.toPropertyName('%s', false)}_find_all\``);
  markdown.push('');
  markdown.push('### Operators');
  markdown.push('');
  markdown.push('The following operators are optional and can be '
    + 'used in the query object to filter results.'
  );
  markdown.push('');
  markdown.push(`#### \`q\` (Keyword Search)`);
  markdown.push('');
  markdown.push('Searches across searchable text fields.');
  markdown.push('');
  markdown.push('- Type: string');
  markdown.push('- Behavior: full-text keyword match');
  markdown.push('- Example: `{"q":"search term"}`');

  markdown.push('');
  markdown.push(`#### \`eq\` (Equal)`);
  markdown.push('');
  markdown.push('Matches exact values.');
  markdown.push('');
  markdown.push('- Type: object');
  markdown.push('- Behavior:');
  markdown.push('  - Single value → exact match');
  markdown.push('  - Array → OR condition');
  markdown.push('- Examples:');
  getRandomExamples(model.columns).forEach(example => {
    const parameters = {
      eq: {
        [example.key]: example.options.length > 1 
          ? example.options 
          : example.example
      }
    };
    markdown.push(`  - \`${JSON.stringify(parameters)}\``);
  });

  markdown.push('');
  markdown.push(`#### \`ne\` (Not Equal)`);
  markdown.push('');
  markdown.push('Matches values that are not equal.');
  markdown.push('');
  markdown.push('- Type: object');
  markdown.push('- Behavior:');
  markdown.push('  - Single value → not equal');
  markdown.push('  - Array → NOT IN');
  markdown.push('- Examples:');
  getRandomExamples(model.columns).forEach(example => {
    const parameters = {
      ne: {
        [example.key]: example.options.length > 1 
          ? example.options 
          : example.example
      }
    };
    markdown.push(`  - \`${JSON.stringify(parameters)}\``);
  });

  const numerical = model.columns.filter(
    column => column.type.name === 'Number'
      || column.type.name === 'Integer'
      || column.type.name === 'Float'
      || column.type.name === 'Date'
      || column.type.name === 'Datetime'
      || column.type.name === 'Time'
  );

  if (numerical.size > 0) {
    markdown.push('');
    markdown.push(`#### \`ge\` (Greater Than or Equal)`);
    markdown.push('');
    markdown.push('Matches values that are greater than or equal to the specified value.');
    markdown.push('');
    markdown.push('- Type: object');
    markdown.push('- Examples:');
    getNumericalExamples(numerical).forEach(example => {
      const parameters = { ge: { [example.key]: example.example } };
      markdown.push(`  - \`${JSON.stringify(parameters)}\``);
    });

    markdown.push('');
    markdown.push(`#### \`le\` (Less Than or Equal)`);
    markdown.push('');
    markdown.push('Matches values that are less than or equal to the specified value.');
    markdown.push('');
    markdown.push('- Type: object');
    markdown.push('- Examples:');
    getNumericalExamples(numerical).forEach(example => {
      const parameters = { le: { [example.key]: example.example } };
      markdown.push(`  - \`${JSON.stringify(parameters)}\``);
    });
  }

  const strings = model.columns.filter(
    column => column.type.name === 'String' && column.type.multiple
  );

  if (strings.size > 0) {
    markdown.push('');
    markdown.push(`#### \`has\` (Array Contains)`);
    markdown.push('');
    markdown.push('Matches array fields that contain any of the given values.');
    markdown.push('');
    markdown.push('- Type: object');
    markdown.push('- Behavior: OR match within array');
    markdown.push('- Examples:');
    getRandomExamples(strings).forEach(example => {
      const parameters = {
        has: {
          [example.key]: example.options.length > 1 
            ? example.options 
            : example.example
        }
      };
      markdown.push(`  - \`${JSON.stringify(parameters)}\``);
    });
    
    markdown.push('');
    markdown.push(`#### \`hasnt\` (Array Does Not Contain)`);
    markdown.push('');
    markdown.push('Matches array fields that do not contain any of the given values.');
    markdown.push('');
    markdown.push('- Type: object');
    markdown.push('- Behavior: OR match within array');
    markdown.push('- Examples:');
    getRandomExamples(strings).forEach(example => {
      const parameters = {
        hasnt: {
          [example.key]: example.options.length > 1 
            ? example.options 
            : example.example
        }
      };
      markdown.push(`  - \`${JSON.stringify(parameters)}\``);
    });
  }
  
  markdown.push('');
  markdown.push(`#### \`columns\` (Keyword Search)`);
  markdown.push('');
  markdown.push('Searches across searchable text fields.');
  markdown.push('');
  markdown.push('- Type: string');
  markdown.push('- Behavior: full-text keyword match');
  markdown.push('- Example: `{"q":"search term"}`');

  return markdown;
};

export function getNumericalExamples(columns: Columns) {
  return getRandomExamples(
    columns.filter(
      column => column.type.name === 'Number'
        || column.type.name === 'Integer'
        || column.type.name === 'Float'
        || column.type.name === 'Date'
        || column.type.name === 'Datetime'
        || column.type.name === 'Time'
    )
  );
};

export function getRandomExamples(columns: Columns) {
  const examples = columns.map(column => {
    const examples = column.document.examples;
    const options = column.type.enum ? Object.values(column.type.enum): [];
    return { 
      key: column.name.toString(), 
      //pick 2 random options
      options: options.length > 2 
        ? options.sort(() => Math.random() - 0.5).slice(0, 2) 
        : options,
      //return a random example from the list of examples for this column
      example: examples[Math.floor(Math.random() * examples.length)]!
    };
  }).toArray().filter(example => example.options.length > 0 || (
    typeof example.example !== 'undefined' && example.example !== null
  ));
  //sort examples (first, the ones with options, then random)
  examples.sort((a, b) => {
    if (a.options.length && !b.options.length) return -1;
    if (!a.options.length && b.options.length) return 1;
    if (!a.options.length && !b.options.length) {
      return Math.random() - 0.5;
    }
    return 0;
  });
  //only return up to 3 examples
  return examples.slice(0, 3);
};

export const TEMPLATE = {

//export const info = { title, description, inputSchema };
INFO:
`{
  title: 'Get Model',
  description: '<%description%>',
  inputSchema: schema
}`,

//export async function handler(args: Args) {};
HANDLER:
`const { model } = z.object(schema).parse(args);
<%#@:models model%>
  if (model === '<%model.name%>') {
    return <%model.handler%>();
  }
<%/@:models%>
return toMcpText({ error: 'not_found' });`,

//export default function register(server: McpServer) {};
REGISTER:
`server.registerTool('get_model', info, args => handler(args));`,

//export const info = { title, description, inputSchema };
MODEL_INFO:
`{
  title: 'Get Model - <%model%>',
  description: 'Get the <%model%> model definition, properties and relation information.',
  inputSchema: schema
}`,

//export default function register(server: McpServer) {};
MODEL_REGISTER:
`server.registerTool('<%model%>_get_model', info, () => handler());`

};