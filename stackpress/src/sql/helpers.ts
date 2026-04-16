//modules
import { isObject } from '@stackpress/lib/Nest';
//stackpress/sql
import type { StorePath, StoreSelector } from './types.js';

/**
 * Formats an inputted value to an acceptable SQL string
 */
export function toSqlString(value: any, strict: true): string;
export function toSqlString(value: any, strict?: false): string|undefined|null;
export function toSqlString(value: any, strict = false) {
  if (typeof value === 'undefined') {
    return strict ? '' : undefined;
  } else if (value === null) {
    return strict ? '' : null;
  } else if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value.toString() || String(value);
};

/**
 * Formats an inputted value to an acceptable SQL boolean
 */
export function toSqlBoolean(value: any, strict: true): boolean;
export function toSqlBoolean(value: any, strict?: false): boolean|undefined|null;
export function toSqlBoolean(value: any, strict = false) {
  if (typeof value === 'undefined') {
    return strict ? false: undefined;
  } else if (value === null) {
    return strict ? false: null;
  }
  return Boolean(value);
};

/**
 * Formats an inputted value to an acceptable SQL date string
 */
export function toSqlDate(value: any, strict: true): Date;
export function toSqlDate(value: any, strict?: false): Date|null|undefined;
export function toSqlDate(value: any, strict = false) {
  if (!strict) {
    if (typeof value === 'undefined') {
      return undefined;
    } else if (value === null) {
      return null;
    }
  }
  
  let date = value instanceof Date ? value : new Date(value);
  //if invalid date
  if (isNaN(date.getTime())) {
    //soft error
    date = new Date(0);
  }

  return date;
};

/**
 * Formats an inputted value to an acceptable SQL integer
 */
export function toSqlInteger(value: any, strict: true): number;
export function toSqlInteger(value: any, strict?: false): number|null|undefined;
export function toSqlInteger(value: any, strict = false) {
  if (typeof value === 'undefined') {
    return strict ? 0: undefined;
  } else if (value === null) {
    return strict ? 0: null;
  }
  return parseInt(value) || 0;
};

/**
 * Formats an inputted value to an acceptable SQL float
 */
export function toSqlFloat(value: any, strict: true): number;
export function toSqlFloat(value: any, strict?: false): number|null|undefined;
export function toSqlFloat(value: any, strict = false) {
  if (typeof value === 'undefined') {
    return strict ? 0: undefined;
  } else if (value === null) {
    return strict ? 0: null;
  }
  return parseFloat(value) || 0;
};

/**
 * Flattens the entire data into dot notation paths and values. 
 * 
 * For example:
 * { user: { name: 'John', address: { street: '123 Main St' } } }
 * becomes
 * { 'user.name': 'John', 'user.address.street': '123 Main St' }
 * 
 * if arrays flag is true then should also flatten 
 * arrays with the index as the key, for example:
 * { created: [ DateString ], profile: { age: [ 20, 30 ] } }
 * becomes
 * { 'created.0': DateString, 'profile.age.0': 20, 'profile.age.1': 30 }
 * 
 * if array flag is false then should ignore 
 * arrays and not flatten them, for example:
 * { created: [ DateString, DateString ], profile: { age: [ 20, 30 ] } }
 * becomes
 * { created: [ DateString, DateString ], profile.age: [ 20, 30 ] }
 */
export function flatten(
  object: Record<string, unknown>, 
  arrays = false,
  prefix = ''
) {
  const result: Record<string, unknown> = {};
  Object.entries(object).forEach(([ key, value ]) => {
    //append the key to the prefix
    const path = prefix ? `${prefix}.${key}` : key;
    //if the value is an array
    if (Array.isArray(value)) {
      //and if arrays flag
      if (arrays) {
        //then flatten each item in the array with the index as the key
        value.forEach((item, index) => Object.assign(
          result, 
          //recurse
          flatten({ [index]: item }, arrays, path)
        ));
        return;
      }
      result[path] = value;
      return;
    //if the value is a hash object
    } else if (isObject(value) 
      && typeof value === 'object' 
      && value !== null
    ) {
      //recurse and assign the flattened value to the result
      Object.assign(
        result, 
        flatten(value as Record<string, unknown>, arrays, path)
      );
      return;
    }
    result[path] = value;
  });
  return result;
};

/**
 * Converts dot format to snake case (for an SQL query)
 * used by `getColumnInfo()` above
 */
export function getAlias(selector: string) {
  return selector.split('.').map(part => part.trim()
    //replace "someString" to "some_string"
    .replace(/([a-z])([A-Z0-9])/g, '$1_$2')
    //replace multiple lines with a single lines
    .replace(/-{2,}/g, '_')
    //trim lines from the beginning and end of the string
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
  ).join('__');
};

/**
 * Formats a StorePath to an alias format for SQL queries. For example:
 * 
 * {
 *   selector: [ 'auth', 'user_profile' ],
 *   parents: [ 'auth' ],
 *   navigation: [ 'auth', 'user_profile', 'address_location' ],
 *   table: 'user_profile',
 *   column: 'address_location',
 *   json: [ 'references', 'google_id' ]
 * }
 * becomes
 * {
 *   format: 'auth__user_profile__address_location__references__google_id',
 *   selector: [ 'auth', 'user_profile' ],
 *   parents: [ 'auth' ],
 *   navigation: [ 'auth', 'user_profile', 'address_location' ],
 *   table: 'user_profile',
 *   column: 'address_location'
 * }
 */
export function storePathToAlias(path: StorePath) {
  return {
    //feedback_note__author__data__references__google_id
    expression: [ 
      ...path.selector, 
      ...path.json 
    ].filter(Boolean).map(getAlias).join('__'),
    //[ feedback_note, author, data ]
    selector: [ ...path.selector ].map(getAlias),
    //[ category, article ]
    parents: [ ...path.parents ].map(getAlias),
    //ratings
    table: getAlias(path.table),
    //feedback_note
    column: getAlias(path.column),
    //[ author, data ]
    children: [ ...path.children ].map(getAlias)
  };
};

/**
 * Formats a StoreSelector to an SQL selector string. For example:
 * {
 *   parents: [ 'auth' ],
 *   column: 'address_location',
 *   json: [ 'references', 'google_id' ]
 * }
 * becomes
 * auth.address_location:references.google_id 
 */
export function storeSelectorToSqlSelector(selector: StoreSelector, q = '"') {
  //auth__user_profile
  const table = selector.parents.join('__') || selector.table;
  //address_location
  const column = selector.column;
  //references.googleId
  const json = selector.json.join('.');
  //if no column, skip
  if (!column) return null;
  return table.length > 0 && json.length > 0
    //auth__user_profile.address_location:references.googleId
    ? `${table}.${column}:${json}`
    : table.length > 0
    //auth__user_profile.address_location
    ? `${q}${table}${q}.${q}${column}${q}`
    : json.length > 0
    //address_location:references.googleId
    ? `${column}:${json}`
    //address_location
    : `${q}${column}${q}`;
};