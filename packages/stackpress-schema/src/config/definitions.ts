//stackpress-schema
import type { 
  AttributeDataMap,
  AttributeDataAssertion,
  AttributeDataComponent,
  TypeAssertionMap
} from '../types.js';
import * as attributes from './attributes.js';
import { assertions as typeAssertions } from './types.js';
import dictionary from '../dictionary.js';

/**
 * Defines attributes from a data map 
 */
export function defineAttributes(kind: string, map: AttributeDataMap) {
  for (const definition of Object.values(map)) {
    const { name, type, description, args } = definition;
    dictionary.attributes.define(name, kind, {
      method: type.includes('method'),
      flag: type.includes('flag'),
      description: description,
      args: args.map(arg => {
        const { spread, type, required, description, examples } = arg;
        return { spread, type, required, description, examples };
      })
    });
  }
};

/**
 * Defines assertion attributes from a data map
 */
export function defineAssertions(
  map: AttributeDataMap<AttributeDataAssertion>
) {
  for (const { name, data } of Object.values(map)) {
    dictionary.assertions.define(name, {
      name: data.name,
      message: data.message
    });
  }
};

/**
 * Defines component attributes from a data map
 */
export function defineComponents(
  kind: string, 
  map: AttributeDataMap<AttributeDataComponent>
) {
  for (const { name, args, data } of Object.values(map)) {
    dictionary.components.define(name, kind, {
      name: data.name,
      import: data.import,
      props: Object.fromEntries(
        args.map(arg => {
          const { name, type, required, description, examples } = arg;
          return [ name, { type, required, description, examples } ];
        })
      ),
      attributes: data.attributes
    });
  }
};

/**
 * Defines type map entries from a data map
 */
export function defineTypes(key: string, map: TypeAssertionMap) {
  for (const [ type, value ] of Object.entries(map)) {
    dictionary.types.define(type, key, value);
  }
};

/**
 * Defines all built-in attributes
 */
export function defineBuiltIn() {
  defineAttributes('schema', attributes.schema);
  defineAttributes('column', attributes.column);
  defineAttributes('column', attributes.assert);
  defineAttributes('column', attributes.field);
  defineAttributes('column', attributes.filter);
  defineAttributes('column', attributes.span);
  defineAttributes('column', attributes.list);
  defineAttributes('column', attributes.view);

  defineAssertions(attributes.assert);

  defineComponents('field', attributes.field);
  defineComponents('filter', attributes.filter);
  defineComponents('span', attributes.span);
  defineComponents('list', attributes.list);
  defineComponents('view', attributes.view);

  defineTypes('assertion', typeAssertions);
};