//modules
import type { SourceFile, ClassDeclaration } from 'ts-morph';
//stackpress-schema
import type Column from '../../../Column.js';
import generateArray from './array.js';
import generateBoolean from './boolean.js';
import generateDate from './date.js';
import generateEnum from './enum.js';
import generateFieldset from './fieldset.js';
import generateNumber from './number.js';
import generateObject from './object.js';
import generateString from './string.js';
import generateUnknown from './unknown.js';

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
    generateArray(definition);
  }
  
  if (column.type.enum) {
    generateEnum(definition, column);
  } else if (column.type.fieldset) {
    generateFieldset(source, definition, column);
  } else if (column.type.name === 'Boolean') {
    generateBoolean(definition, column);
  } else if (dates.includes(column.type.name)) {
    generateDate(definition, column);
  } else if (numbers.includes(column.type.name)) {
    generateNumber(definition, column);
  } else if (objects.includes(column.type.name)) {
    generateObject(source, definition, column);
  } else if (strings.includes(column.type.name)) {
    generateString(source, definition, column);
  } else {
    //NOTE: models are relational fields so don't add serializers
    generateUnknown(definition, column);
  }
};