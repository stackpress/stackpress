//modules
import type { SourceFile, ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Column from '../../Column.js';
//stackpress/schema/transform
import { renderCode } from '../helpers.js';

const dates = [ 'Date', 'Datetime', 'Time' ];
const numbers = [ 'Number', 'Integer', 'Float' ];
const objects = [ 'Object', 'Json', 'Hash' ];
const strings = [ 'String', 'Text' ];

export default function generate(
  source: SourceFile,
  definition: ClassDeclaration, 
  column: Column
) {
  //public serialize<T>(value: T) {}
  //should serialize to JSONable values
  // String   -> string
  // Text     -> string
  // Number   -> number
  // Integer  -> number
  // Float    -> number
  // Boolean  -> boolean
  // Date     -> string
  // Datetime -> string
  // Time     -> string
  // Object   -> string (JSON)
  // Json     -> string (JSON)
  // Hash     -> string (JSON)

  //(only strings can be encrypted and hashed)

  //public unserialize<T>(value: T) {}  
  //should unserialize to primitives
  // String   -> string
  // Text     -> string
  // Number   -> number
  // Integer  -> number
  // Float    -> number
  // Boolean  -> boolean
  // Date     -> Date
  // Datetime -> Date
  // Time     -> Date
  // Object   -> object
  // Json     -> object
  // Hash     -> object

  //(only strings can be decrypted)

  if (column.type.multiple) {
    //public serialize<T>(value: T) {}
    definition.addMethod({
      scope: Scope.Public,
      name: 'serialize',
      typeParameters: [{ name: 'T' }],
      parameters: [{ name: 'value', type: 'T' }],
      statements: TEMPLATE.SERIALIZE_ARRAY
    });
    //public unserialize<T>(value: T) {}
    definition.addMethod({
      scope: Scope.Public,
      name: 'unserialize',
      typeParameters: [{ name: 'T' }],
      parameters: [{
        name: 'value',
        type: 'T',
      }],
      statements: TEMPLATE.UNSERIALIZE_ARRAY
    });
  }

  if (column.type.name === 'Boolean') {
    generateBoolean(definition, column);
  } else if (dates.includes(column.type.name)) {
    generateDate(definition, column);
  } else if (numbers.includes(column.type.name)) {
    generateNumber(definition, column);
  } else if (objects.includes(column.type.name)) {
    generateObject(definition, column);
  } else if (strings.includes(column.type.name) || column.type.enum) {
    generateString(source, definition, column);
  } else {
    //NOTE: models are relational fields so don't add serializers
    generateUnknown(definition, column);
  }
};

export function generateBoolean(
  definition: ClassDeclaration,
  column: Column
) {
  const notation = column.type.multiple ? '_' : '';
  //public serialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}serialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: renderCode(TEMPLATE.SERIALIZE_BOOLEAN, {
      nullable: column.type.nullable
    })
  });
  //public unserialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}unserialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{
      name: 'value',
      type: 'T',
    }],
    statements: renderCode(TEMPLATE.UNSERIALIZE_BOOLEAN, {
      nullable: column.type.nullable
    })
  });
};

export function generateDate(
  definition: ClassDeclaration,
  column: Column
) {
  const notation = column.type.multiple ? '_' : '';
  //public serialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}serialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: renderCode(TEMPLATE.SERIALIZE_DATE, {
      nullable: column.type.nullable
    })
  });
  //public unserialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}unserialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{
      name: 'value',
      type: 'T',
    }],
    statements: renderCode(TEMPLATE.UNSERIALIZE_DATE, {
      nullable: column.type.nullable
    })
  });
};

export function generateNumber(
  definition: ClassDeclaration,
  column: Column
) {
  const notation = column.type.multiple ? '_' : '';
  //public serialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}serialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: renderCode(TEMPLATE.SERIALIZE_NUMBER, {
      nullable: column.type.nullable
    })
  });
  //public unserialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}unserialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{
      name: 'value',
      type: 'T',
    }, {
      name: 'toNumber',
      type: 'boolean',
      initializer: 'false',
    }],
    statements: renderCode(TEMPLATE.UNSERIALIZE_NUMBER, {
      nullable: column.type.nullable
    })
  });
};

export function generateObject(
  definition: ClassDeclaration,
  column: Column
) {
  const notation = column.type.multiple ? '_' : '';
  //public serialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}serialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: renderCode(TEMPLATE.SERIALIZE_OBJECT, {
      nullable: column.type.nullable
    })
  });
  //public unserialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}unserialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: renderCode(TEMPLATE.UNSERIALIZE_OBJECT, {
      nullable: column.type.nullable
    })
  });
};

export function generateString(
  source: SourceFile,
  definition: ClassDeclaration, 
  column: Column
) {
  const notation = column.type.multiple ? '_' : '';
  //import { encrypt, decrypt, hash } from 'stackpress/schema/helpers';
  if (column.value.encrypted || column.value.hashed) {
    source.addImportDeclaration({
      namedImports: [ 
        ...column.value.encrypted ? [ 'encrypt', 'decrypt' ] : [],
        ...column.value.hashed ? [ 'hash' ] : [],
      ],
      moduleSpecifier: 'stackpress/schema/helpers'
    });
  }

  //protected _seed: string;
  //public constructor(seed = '') {}
  if (column.value.encrypted) {
    //protected _seed: string;
    definition.addProperty({
      scope: Scope.Protected,
      name: '_seed',
      type: 'string'
    });
    //public constructor(seed = '') {}
    definition.addConstructor({
      scope: Scope.Public,
      parameters: [{
        name: 'seed',
        initializer: "''"
      }],
      statements: 'this._seed = seed;'
    });
  }
  //public serialize<T>(value: T) {}
  //public serialize<T>(value: T, doEncrypt = false) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}serialize`,
    typeParameters: [{ name: 'T' }],
    parameters: column.value.encrypted || column.value.hashed ? [
      { name: 'value', type: 'T' },
      { name: 'doEncrypt', initializer: 'false' }
    ] : [
      { name: 'value', type: 'T' }
    ],
    statements: renderCode(TEMPLATE.SERIALIZE_STRING, {
      nullable: column.type.nullable,
      hashed: column.value.hashed,
      encrypted: column.value.encrypted,
      decrypted: !column.value.hashed && !column.value.encrypted
    })
  });
  //public unserialize<T>(value: T) {}
  //public unserialize<T>(value: T, doDecrypt = false) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}unserialize`,
    typeParameters: [{ name: 'T' }],
    parameters: column.value.encrypted ? [
      { name: 'value', type: 'T' }, 
      { name: 'doDecrypt', initializer: 'false' }
    ] : [
      { name: 'value', type: 'T' }
    ],
    statements: renderCode(TEMPLATE.UNSERIALIZE_STRING, {
      nullable: column.type.nullable,
      encrypted: column.value.encrypted 
        ? `return this._seed && value.length > 0 ? decrypt(String(value), this._seed) : String(value);` 
        : '',
      decrypted: !column.value.encrypted 
        ? 'return String(value);'
        : '',
    })
  });
};

export function generateUnknown(
  definition: ClassDeclaration,
  column: Column
) {
  const notation = column.type.multiple ? '_' : '';
   // public serialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}serialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: TEMPLATE.SERIALIZE_UNKNOWN
  });
  // public unserialize<T>(value: T) {}
  definition.addMethod({
    scope: notation === '_' ? Scope.Protected : Scope.Public,
    name: `${notation}unserialize`,
    typeParameters: [{ name: 'T' }],
    parameters: [{ name: 'value', type: 'T' }],
    statements: TEMPLATE.UNSERIALIZE_UNKNOWN
  });
};

export const TEMPLATE = {

SERIALIZE_ARRAY:
`if (!Array.isArray(value)) {
  return '[]';
}
const values = value
  .map(item => this._serialize(item))
  .filter(item => typeof item !== 'undefined' && item !== null);
return JSON.stringify(values);
`,

UNSERIALIZE_ARRAY:
`if (Array.isArray(value)) {
  return value
    .map(item => this._unserialize(item))
    .filter(item => typeof item !== 'undefined' && item !== null);
}
if (typeof value !== 'string') {
  return [];
}
try {
  const values = JSON.parse(value);
  if (!Array.isArray(values)) {
    return [];
  }
  return values
    .map(item => this._unserialize(item))
    .filter(item => typeof item !== 'undefined' && item !== null);
} catch (e) {
  return [];
}`,

SERIALIZE_BOOLEAN:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
return value === 'false' ? false
  : value === 'true' ? true
  : value === '0' ? false
  : value === '1' ? true
  : Boolean(value);`,

UNSERIALIZE_BOOLEAN:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
return Boolean(value);`,

SERIALIZE_DATE:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
//if value is a date
if (value instanceof Date) {
  return [
    value.toISOString().split('T')[0],
    value.toTimeString().split(' ')[0]
  ].join(' ');
  //if value is a number
} else if (typeof value === "number") {
  const stamp = new Date(value);
  return [
    stamp.toISOString().split('T')[0],
    stamp.toTimeString().split(' ')[0]
  ].join(' ');
}
//either way, try to convert to date (or date string)
let stamp = new Date(String(value));
if (isNaN(stamp.getTime())) {
  stamp = new Date(0);
}
return [
  stamp.toISOString().split('T')[0],
  stamp.toTimeString().split(' ')[0]
].join(' ');`,

UNSERIALIZE_DATE:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
//if value is a date
if (value instanceof Date) {
  return value;
//if value is a number
} else if (typeof value === 'number') {
  return new Date(value);
}
//either way, try to convert to date (or date string)
let stamp = new Date(String(value));
if (isNaN(stamp.getTime())) {
  stamp = new Date(0);
}
return stamp;`,

SERIALIZE_NUMBER:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
return value instanceof Date 
  ? value.getTime()
  : this.unserialize(value);`,

UNSERIALIZE_NUMBER:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
//either way, try to convert to number
const number = Number(value);
return !isNaN(number) ? number : 0;`,

SERIALIZE_OBJECT:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
//if value is a string
if (typeof value === 'string') {
  try { //to see if it's a valid JSON string
    JSON.parse(value);
  //let JSON serialize the value
  } catch (e) {
    return '{}';
  }
  return value;
}
//let JSON serialize the value
return JSON.stringify(value);`,

UNSERIALIZE_OBJECT:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
//if value is a string
if (typeof value === 'string') {
  try { //to parse the value
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
}
return typeof value === 'object' 
  && value?.constructor?.name === 'Object' 
  ? value 
  : {};`,

SERIALIZE_STRING:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
let string = String(value);
//if value is a date
if (value instanceof Date) {
  string = [
    value.toISOString().split('T')[0],
    value.toTimeString().split(' ')[0]
  ].join(' ');
} else if (typeof value === 'object' && value?.constructor?.name === 'Object') {
  string = JSON.stringify(value);
} else if (typeof value?.toString === 'function') {
  string = value.toString();
}
<%#decrypted%>
  return string;
<%/decrypted%>
<%#encrypted%>
  if (doEncrypt) {
    return string.length > 0 ? encrypt(string, this._seed) : string;
  }
  return string;
<%/encrypted%>
<%#hashed%>
  if (doEncrypt) {
    return string.length > 0 ? hash(string, this._seed) : string;
  }
  return string;
<%/hashed%>`,

UNSERIALIZE_STRING:
`if (typeof value === 'undefined') {
  return undefined;
}
<%#nullable%>
  if (value === null) {
    return null;
  }
<%/nullable%>
//if value is a date
if (value instanceof Date) {
  return [
    value.toISOString().split('T')[0],
    value.toTimeString().split(' ')[0]
  ].join(' ');
} else if (typeof value === 'object' && value?.constructor?.name === 'Object') {
  return JSON.stringify(value);
} else if (typeof value?.toString === 'function') {
  value = value.toString() as T;
}
<%#decrypted%>
  return String(value);
<%/decrypted%>
<%#encrypted%>
  if (doDecrypt) {
    return String(value).length > 0 ? decrypt(String(value), this._seed) : String(value);
  }
  return String(value);
<%/encrypted%>`,

SERIALIZE_UNKNOWN:
`return value;`,

UNSERIALIZE_UNKNOWN:
`return value;`

};