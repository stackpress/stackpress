//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
import { isObject } from '@stackpress/lib/Nest';
//stackpress-schema
import type Column from 'stackpress-schema/Column';
import type Columns from 'stackpress-schema/Columns';
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile,
  renderCode
} from 'stackpress-schema/transform/helpers';
//stackpress-mcp
import { getArticle } from '../helpers.js';

export default function generate(directory: Directory, model: Model) {
  const filepath = model.name.toPathName('%s/tools/get_model.ts');
  //load Profile/tools/get_model.ts if it exists, if not create it
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
      initializer: renderCode(TEMPLATE.INFO, {
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

  //export function register(server: McpServer) {};
  source.addFunction({
    name: 'register',
    isExported: true,
    parameters: [{ name: 'server', type: 'McpServer' }],
    statements: renderCode(TEMPLATE.REGISTER, {
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

  //export default register;
  source.addStatements('export default register;');
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
  title: 'Get Model - <%model%>',
  description: 'Get the <%model%> model definition, properties and relation information.',
  inputSchema: schema
}`,

//export default function register(server: McpServer) {};
REGISTER:
`server.registerTool('<%model%>_get_model', info, () => handler());`

};
