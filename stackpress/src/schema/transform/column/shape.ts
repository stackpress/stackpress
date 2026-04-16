//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress/schema
import type Column from '../../Column.js';
//stackpress/schema/transform
import { renderCode } from '../helpers.js';

const numbers = [ 'Number', 'Integer', 'Float' ];

export const typemap: Record<string, string> = {
  Boolean: 'z.boolean()',
  Integer: 'z.int()',
  Date: 'z.date()',
  Datetime: 'z.date()',
  Time: 'z.date()',
  Number: 'z.number()',
  Float: 'z.number()',
  Object: 'z.object({})',
  Json: 'z.object({})',
  Hash: 'z.object({})',
  String: 'z.string()',
  Text: 'z.string()',
  Unknown: 'z.unknown()'
};

export const assertions: Record<string, string> = {
  'required': `.refine(
    (data: any) => typeof data !== 'undefined' && data !== null && String(data) !== '', 
    { message: '<%m%>' }
  )`,
  'ne': `.nonempty({ message: '<%m%>' })`,
  'eq': `.eq(<%s%>, { message: '<%m%>' })`,
  'neq': `.neq(<%s%>, { message: '<%m%>' })`,
  'gt': `.gt(<%s%>, { message: '<%m%>' })`,
  'ge': `.gte(<%s%>, { message: '<%m%>' })`,
  'lt': `.lt(<%s%>, { message: '<%m%>' })`,
  'le': `.lte(<%s%>, { message: '<%m%>' })`,
  'ceq': `.length(<%s%>, { message: '<%m%>' })`,
  'cgt': `.min(<%s%>, { exclusive: true, message: '<%m%>' })`,
  'cge': `.min(<%s%>, { message: '<%m%>' })`,
  'clt': `.max(<%s%>, { exclusive: true, message: '<%m%>' })`,
  'cle': `.max(<%s%>, { message: '<%m%>' })`,
  'wgt': `.refine(value => value.split(" ").length > <%s%>, { message: '<%m%>' })`,
  'wge': `.refine(value => value.split(" ").length >= <%s%>, { message: '<%m%>' })`,
  'wlt': `.refine(value => value.split(" ").length < <%s%>, { message: '<%m%>' })`,
  'wle': `.refine(value => value.split(" ").length <= <%s%>, { message: '<%m%>' })`,
  'lowercase': `.regex(/^[a-z]+$/, { message: '<%m%>' })`,
  'uppercase': `.regex(/^[A-Z]+$/, { message: '<%m%>' })`,
  'slug': `.regex(/^[a-z0-9_-]+$/, { message: '<%m%>' })`,
  'email': `.email({ message: '<%m%>' })`,
  'url': `.url({ message: '<%m%>' })`,
  'regex': `.regex(<%s%>, { message: '<%m%>' })`,
  'option': `.refine(data => [ <%s%> ].flat().includes(data), { message: '<%m%>' })`,
  'starting': `.startsWith(<%s%>, { message: '<%m%>' })`,
  'ending': `.endsWith(<%s%>, { message: '<%m%>' })`,
  'including': `.includes(<%s%>, { message: '<%m%>' })`,
  'date': `.refine(value => !isNaN(Date.parse(value.toString())), { message: '<%m%>' })`,
  'future': `.refine(value => new Date(value) > new Date(), { message: '<%m%>' })`,
  'past': `.refine(value => new Date(value) < new Date(), { message: '<%m%>' })`,
  'present': `.refine(value => {
    const now = new Date();
    const date = new Date(value);
    return date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
  }, { message: '<%m%>' })`,
  'cc': `.regex(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}`
    + `|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]`
    + `|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/, { message: '<%m%>' })`,
  'color': `.regex(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, { message: '<%m%>' })`,
  'hex': `.regex(/^[a-f0-9]+$/, { message: '<%m%>' })`,
  'price': `.refine(value => value.toString().match(/^-?\d+(\.\d{2})?$/), { message: '<%m%>' })`,
};

export default function generate(
  definition: ClassDeclaration, 
  column: Column
) {
  //type: ie. z.string(), z.number(), z.array(z.string()), z.enum(['a', 'b']), etc.
  let shape = column.type.name in typemap
    ? typemap[column.type.name]
    : column.type.enum
    ? `z.enum(${column.type.name})`
    : column.type.fieldset
    ? 'this._fieldset.shape'
    : typemap.Unknown;
  //add description
  shape += column.document.description 
    ? `.describe(${JSON.stringify(column.document.description)})` 
    : '';
  //add min
  shape += numbers.includes(column.type.name) 
    ? `.min(${column.number.min})` 
    : '';
  //add max
  shape += numbers.includes(column.type.name) 
    && column.number.max > column.number.min
    ? `.max(${column.number.max})` 
    : '';
  //add step
  shape += numbers.includes(column.type.name) 
    ? `.step(${column.number.step})` 
    : ''; 
  //add assertions
  column.assertion.assertions.forEach(assertion => {
    if (assertion.name in assertions) {
      const template = assertions[assertion.name];
      shape += renderCode(template, { 
        m: assertion.message
          .replaceAll('{{name}}', column.name.toString())
          .replaceAll('{{label}}', column.name.label)
          .replaceAll('{{arg}}', String(assertion.args[0]) || '')
          .replaceAll('{{arg1}}', String(assertion.args[0]) || '')
          .replaceAll('{{arg2}}', String(assertion.args[1]) || '')
          .replaceAll('{{arg3}}', String(assertion.args[2]) || ''), 
        s: assertion.args.map(arg => JSON.stringify(arg)).join(', ')
      });
    }
  });
  //if array, wrap array
  //z.array(z.string())
  if (column.type.multiple) {
    shape = `z.array(${shape})`;
  //add optional if not required and not multiple
  } else if (column.type.nullable) {
    shape += '.nullable().optional()'; 
  //not multiple and required...
  //if no required assertion was specified
  } else if (!column.assertion.assertions.find(
    assertion => assertion.name === 'required'
  )) {
    shape += renderCode(assertions['required'], { m: 'Required' });
  }
  //public readonly shape = z.string()...
  definition.addProperty({
    scope: Scope.Public,
    isReadonly: true,
    name: 'shape'
  });
  return shape;
};