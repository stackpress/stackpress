//modules
import type Column from 'stackpress-schema/Column';
import type Model from 'stackpress-schema/Model';
//client
import type { JsonSchema, ToolConfig } from '../types.js';

//this narrow operation set is the generated-tool surface approved for the
// first rollout and is intentionally smaller than full CRUD coverage.
export const OPERATIONS = [ 'search', 'detail', 'create', 'update' ] as const;

export type GeneratedModelToolOperation = typeof OPERATIONS[number];

//this primitive map keeps the generated JSON Schema small and serializable
// while still matching the core Stackpress column kinds used by the template.
export const JSON_SCHEMA_TYPES: Record<string, JsonSchema> = {
  Boolean: { type: 'boolean' },
  Date: { type: 'string' },
  Datetime: { type: 'string' },
  Float: { type: 'number' },
  Hash: { type: 'object', additionalProperties: true },
  Integer: { type: 'integer' },
  Json: { type: 'object', additionalProperties: true },
  Number: { type: 'number' },
  Object: { type: 'object', additionalProperties: true },
  String: { type: 'string' },
  Text: { type: 'string' },
  Time: { type: 'string' },
  Unknown: {}
};

//--------------------------------------------------------------------//
// Functions

/**
 * Build one generated tool config for a model operation pair.
 */
export function makeGeneratedTool(
  model: Model,
  operation: GeneratedModelToolOperation
): ToolConfig | null {
  //map the operation into one event-backed tool contract and reject anything
  // outside the rollout's intentionally narrow surface.
  switch (operation) {
    case 'create':
      return {
        data: {},
        description: `Create one ${modelLabel(model, 'singular')} row.`,
        event: model.name.toEventName('%s-create'),
        input: buildCreateInput(model),
        method: 'POST',
        name: model.name.toPropertyName('%s_create', false),
        title: `Create ${modelLabel(model, 'singular')}`,
        type: 'app'
      };
    case 'detail':
      return {
        data: {},
        description: `Return one ${modelLabel(model, 'singular')} row by id.`,
        event: model.name.toEventName('%s-detail'),
        input: buildDetailInput(model),
        method: 'GET',
        name: model.name.toPropertyName('%s_detail', false),
        title: `Get ${modelLabel(model, 'singular')}`,
        type: 'public'
      };
    case 'search':
      return {
        data: {},
        description: `Search ${modelLabel(model, 'plural')} rows.`,
        event: model.name.toEventName('%s-search'),
        input: buildSearchInput(model),
        method: 'GET',
        name: model.name.toPropertyName('%s_search', false),
        title: `Search ${modelLabel(model, 'plural')}`,
        type: 'public'
      };
    case 'update':
      return {
        data: {},
        description: `Update one ${modelLabel(model, 'singular')} row by id.`,
        event: model.name.toEventName('%s-update'),
        input: buildUpdateInput(model),
        method: 'POST',
        name: model.name.toPropertyName('%s_update', false),
        title: `Update ${modelLabel(model, 'singular')}`,
        type: 'app'
      };
  }

  return null;
}

/**
 * Build the generated create-tool input contract.
 */
export function buildCreateInput(model: Model): JsonSchema {
  const properties: Record<string, JsonSchema> = {};
  const required: string[] = [];

  //walk every non-relational column so the generated tool stays close to the
  // writable row shape while still leaving relation objects out of the input.
  for (const column of model.columns.filter(
    column => !column.type.model
  ).values()) {
    properties[column.name.toString()] = columnToJsonSchema(column);

    //only require fields that look user-supplied and do not already come from
    // generated/default database behavior.
    if (shouldRequireCreateColumn(column)) {
      required.push(column.name.toString());
    }
  }

  return objectSchema(properties, required);
}

/**
 * Build the generated detail-tool input contract.
 */
export function buildDetailInput(model: Model): JsonSchema {
  const properties: Record<string, JsonSchema> = {
    columns: {
      description: [
        'Select which columns to include in the detail response.',
        'Leave empty to use the generated default columns.'
      ].join(' '),
      type: 'array',
      items: { type: 'string' }
    }
  };
  const required: string[] = [];

  //detail lookups only need the id columns and optional selector overrides.
  for (const column of model.store.ids.values()) {
    properties[column.name.toString()] = columnToJsonSchema(column);
    required.push(column.name.toString());
  }

  return objectSchema(properties, required);
}

/**
 * Build the generated search-tool input contract.
 */
export function buildSearchInput(model: Model): JsonSchema {
  const properties: Record<string, JsonSchema> = {
    columns: {
      description: [
        'Select which columns to include in each search result row.',
        'Leave empty to use the generated default columns.'
      ].join(' '),
      type: 'array',
      items: { type: 'string' }
    },
    skip: {
      description: 'Skip this many rows before returning search results.',
      type: 'number'
    },
    take: {
      description: 'Limit the number of rows returned by the search.',
      type: 'number'
    }
  };

  //only add the free-text query when the model actually marks searchable
  // columns. This keeps small models from exposing dead parameters.
  if (model.store.searchables.size > 0) {
    properties.q = {
      description: 'Free-text query matched against the model search fields.',
      type: 'string'
    };
  }

  for (const [ name, column ] of getSelectors('filter', model)) {
    properties[`${getAlias(name)}__eq`] = {
      type: 'array',
      items: columnToJsonSchema(column)
    };
    properties[`${getAlias(name)}__ne`] = {
      type: 'array',
      items: columnToJsonSchema(column)
    };
  }

  for (const [ name, column ] of getSelectors('span', model)) {
    properties[`${getAlias(name)}__ge`] = {
      type: 'array',
      items: columnToJsonSchema(column)
    };
    properties[`${getAlias(name)}__le`] = {
      type: 'array',
      items: columnToJsonSchema(column)
    };
  }

  for (const [ name, column ] of getSelectors('strings', model)) {
    properties[`${getAlias(name)}__has`] = {
      type: 'array',
      items: columnToJsonSchema(column)
    };
    properties[`${getAlias(name)}__hasnt`] = {
      type: 'array',
      items: columnToJsonSchema(column)
    };
  }

  for (const [ name ] of getSelectors('sort', model)) {
    properties[`sort__${getAlias(name)}`] = {
      description: `Sort search results by ${name}.`,
      type: 'string',
      enum: [ 'asc', 'desc' ]
    };
  }

  return objectSchema(properties);
}

/**
 * Build the generated update-tool input contract.
 */
export function buildUpdateInput(model: Model): JsonSchema {
  const properties: Record<string, JsonSchema> = {};
  const required: string[] = [];

  //updates require every id column first so the event knows which row to
  // patch before it reads any of the optional new values.
  for (const column of model.store.ids.values()) {
    properties[column.name.toString()] = columnToJsonSchema(column);
    required.push(column.name.toString());
  }

  for (const column of model.columns.filter(
    column => !column.type.model
  ).values()) {
    properties[column.name.toString()] = columnToJsonSchema(column);
  }

  return objectSchema(properties, required);
}

/**
 * Convert one Stackpress column into a serializable JSON Schema fragment.
 */
export function columnToJsonSchema(column: Column): JsonSchema {
  const base = column.type.enum
    ? {
      type: 'string',
      enum: Object.values(column.type.enum)
    }
    : {
      ...(JSON_SCHEMA_TYPES[column.type.name] || {})
    };

  const schema = column.type.multiple
    ? {
      type: 'array',
      items: base
    }
    : base;

  if (column.document.description) {
    return {
      ...schema,
      description: column.document.description
    };
  }

  return schema;
}

/**
 * Build one compact object schema with an optional required list.
 */
export function objectSchema(
  properties: Record<string, JsonSchema>,
  required: string[] = []
): JsonSchema {
  return required.length > 0
    ? { type: 'object', properties, required }
    : { type: 'object', properties };
}

/**
 * Gather one selector family from a model, recursing into foreign relations.
 */
export function getSelectors(
  type: 'filter' | 'span' | 'sort' | 'strings',
  model: Model,
  prefix: string[] = []
) {
  const selectors = new Map<string, Column>();

  if (type === 'filter') {
    model.columns.filter(
      column => column.store.filterable || column.store.id
    ).forEach(column => {
      selectors.set([...prefix, column.name.toString()].join('.'), column);
    });
  } else if (type === 'sort') {
    model.store.sortables.forEach(column => {
      selectors.set([...prefix, column.name.toString()].join('.'), column);
    });
  } else if (type === 'span') {
    model.columns.filter(
      column => column.store.spannable
    ).forEach(column => {
      selectors.set([...prefix, column.name.toString()].join('.'), column);
    });
  } else {
    model.columns.filter(
      column => column.type.name === 'String' && column.type.multiple
    ).forEach(column => {
      selectors.set([...prefix, column.name.toString()].join('.'), column);
    });
  }

  model.store.foreignRelationships.forEach(column => {
    const relation = column.store.foreignRelationship;
    if (!relation) {
      return;
    }

    //carry selectors from joined foreign models forward so generated search
    // tools can still expose nested query aliases like the old branch did.
    getSelectors(type, relation.foreign.model, [
      ...prefix,
      column.name.toString()
    ]).forEach(([ key, value ]) => {
      selectors.set(key, value);
    });
  });

  return Array.from(selectors.entries());
}

/**
 * Convert a selector path into the SQL-style alias Stackpress already uses.
 */
export function getAlias(selector: string) {
  return selector.split('.').map(part => part.trim()
    .replace(/([a-z])([A-Z0-9])/g, '$1_$2')
    .replace(/-{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
  ).join('__');
}

/**
 * Pick the display label for a model in either singular or plural form.
 */
export function modelLabel(model: Model, mode: 'singular' | 'plural') {
  if (mode === 'plural') {
    return model.name.plural || `${model.name.toString()}s`;
  }

  return model.name.singular || model.name.toString();
}

/**
 * Convert a model label into the default scope prefix for generated tools.
 */
export function modelScope(model: Model) {
  return modelLabel(model, 'plural')
    .replace(/([a-z])([A-Z0-9])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/**
 * Decide whether a column should stay required in generated create inputs.
 */
export function shouldRequireCreateColumn(column: Column) {
  return Boolean(column.component.formField)
    && !column.store.active
    && !column.store.id
    && !column.store.timestamp
    && !column.type.multiple
    && !column.type.nullable
    && !column.value.default
    && !column.value.generator;
}
