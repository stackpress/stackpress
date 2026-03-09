//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Fieldset from '../../Fieldset.js';
import type Column from '../../Column.js';
//stackpress/schema/transform
import { loadProjectFile, renderCode } from '../helpers.js';

export const strings = [ 'String', 'Text' ];
export const numbers = [ 'Number', 'Float', 'Integer' ];
export const dates = [ 'Date', 'Time', 'Datetime' ];
export const objects = [ 'Object', 'Json', 'Hash' ];

//Fri, 04 Dec 2020 13:15:00 GMT
//const date = new Date(Date.UTC(2020, 11, 4, 13, 15));

const asserts = {
  string: {
    string: `expect(schema.assert('foobar')).to.be.null;`,
    number: `expect(typeof schema.assert(123)).to.equal('string');`,
    boolean: `expect(typeof schema.assert(true)).to.equal('string');`,
    date: `expect(typeof schema.assert(new Date())).to.equal('string');`,
    object: `expect(typeof schema.assert({ foo: 'bar' })).to.equal('string');`,
    array: `expect(typeof schema.assert(['foo', 'bar'])).to.equal('string');`
  },
  number: {
    string: `expect(typeof schema.assert('foobar')).to.equal('string');`,
    number: `expect(schema.assert(123)).to.be.null;`,
    boolean: `expect(typeof schema.assert(true)).to.equal('string');`,
    date: `expect(typeof schema.assert(new Date())).to.equal('string');`,
    object: `expect(typeof schema.assert({ foo: 'bar' })).to.equal('string');`,
    array: `expect(typeof schema.assert(['foo', 'bar'])).to.equal('string');`
  },
  boolean: {
    string: `expect(typeof schema.assert('foobar')).to.equal('string');`,
    number: `expect(typeof schema.assert(123)).to.equal('string');`,
    boolean: `expect(schema.assert(true)).to.be.null;`,
    date: `expect(typeof schema.assert(new Date())).to.equal('string');`,
    object: `expect(typeof schema.assert({ foo: 'bar' })).to.equal('string');`,
    array: `expect(typeof schema.assert(['foo', 'bar'])).to.equal('string');`
  },
  date: {
    string: `expect(typeof schema.assert('foobar')).to.equal('string');`,
    number: `expect(typeof schema.assert(123)).to.equal('string');`,
    boolean: `expect(typeof schema.assert(true)).to.equal('string');`,
    date: `expect(schema.assert(new Date())).to.be.null;`,
    object: `expect(typeof schema.assert({ foo: 'bar' })).to.equal('string');`,
    array: `expect(typeof schema.assert(['foo', 'bar'])).to.equal('string');`
  },
  object: {
    string: `expect(typeof schema.assert('foobar')).to.equal('string');`,
    number: `expect(typeof schema.assert(123)).to.equal('string');`,
    boolean: `expect(typeof schema.assert(true)).to.equal('string');`,
    date: `expect(typeof schema.assert(new Date())).to.equal('string');`,
    object: `expect(schema.assert({ foo: 'bar' })).to.be.null;`,
    array: `expect(typeof schema.assert(['foo', 'bar'])).to.equal('string');`
  },
  array: {
    string: `expect(typeof schema.assert('foobar')).to.equal('string');`,
    number: `expect(typeof schema.assert(123)).to.equal('string');`,
    boolean: `expect(typeof schema.assert(true)).to.equal('string');`,
    date: `expect(typeof schema.assert(new Date())).to.equal('string');`,
    object: `expect(typeof schema.assert({ foo: 'bar' })).to.equal('string');`,
    array: `expect(typeof schema.assert(['foo', 'bar'])).to.equal('string');`
  },
};

const serialized = {
  string: {
    string: `expect(schema.serialize('foobar')).to.equal('foobar');`,
    number: `expect(schema.serialize(123)).to.equal('123');`,
    boolean: `expect(schema.serialize(true)).to.equal('true');`,
    date: `expect(schema.serialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal('2020-12-04 13:15:00');`,
    array: `expect(schema.serialize(['foo', 'bar'])).to.equal('["foo","bar"]');`,
    object: `expect(schema.serialize({ foo: 'bar' })).to.equal('{"foo":"bar"}');`
  },
  number: {
    string: `expect(schema.serialize('foobar')).to.equal(0);`,
    number: `expect(schema.serialize(123)).to.equal(123);`,
    boolean: `expect(schema.serialize(true)).to.equal(1);`,
    date: `expect(schema.serialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal(1607087700000);`,
    array: `expect(schema.serialize(['foo', 'bar'])).to.equal(0);`,
    object: `expect(schema.serialize({ foo: 'bar' })).to.equal(0);`
  },
  boolean: {
    string: `expect(schema.serialize('foobar')).to.equal(true);`,
    number: `expect(schema.serialize(0)).to.equal(false);`,
    boolean: `expect(schema.serialize(true)).to.equal(true);`,
    date: `expect(schema.serialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal(true);`,
    array: `expect(schema.serialize(['foo', 'bar'])).to.equal(true);`,
    object: `expect(schema.serialize({ foo: 'bar' })).to.equal(true);`
  },
  date: {
    string: `expect(schema.serialize('foobar')).to.equal('1970-01-01 00:00:00');`,
    number: `expect(schema.serialize(0)).to.equal('1970-01-01 00:00:00');`,
    boolean: `expect(schema.serialize(true)).to.equal('1970-01-01 00:00:00');`,
    date: `expect(schema.serialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal('2020-12-04 13:15:00');`,
    array: `expect(schema.serialize(['foo', 'bar'])).to.equal('1970-01-01 00:00:00');`,
    object: `expect(schema.serialize({ foo: 'bar' })).to.equal('1970-01-01 00:00:00');`
  },
  object: {
    string: `expect(schema.serialize('foobar')).to.equal('{}');`,
    number: `expect(schema.serialize(0)).to.equal('{}');`,
    boolean: `expect(schema.serialize(true)).to.equal('{}');`,
    date: `expect(schema.serialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal('{}');`,
    array: `expect(schema.serialize(['foo', 'bar'])).to.equal('{}');`,
    object: `expect(schema.serialize({ foo: 'bar' })).to.equal('{"foo":"bar"}');`
  }
};

const unserialized = {
  string: {
    string: `expect(schema.unserialize('foobar')).to.equal('foobar');`,
    number: `expect(schema.unserialize(123)).to.equal('123');`,
    boolean: `expect(schema.unserialize(true)).to.equal('true');`,
    date: `expect(schema.unserialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal('2020-12-04 13:15:00');`,
    array: `expect(schema.unserialize(['foo', 'bar'])).to.equal('["foo","bar"]');`,
    object: `expect(schema.unserialize({ foo: 'bar' })).to.equal('{"foo":"bar"}');`
  },
  number: {
    string: `expect(schema.unserialize('foobar')).to.equal(0);`,
    number: `expect(schema.unserialize(123)).to.equal(123);`,
    boolean: `expect(schema.unserialize(true)).to.equal(1);`,
    date: `expect(schema.unserialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal(1607087700000);`,
    array: `expect(schema.unserialize(['foo', 'bar'])).to.equal(0);`,
    object: `expect(schema.unserialize({ foo: 'bar' })).to.equal(0);`
  },
  boolean: {
    string: `expect(schema.unserialize('foobar')).to.equal(true);`,
    number: `expect(schema.unserialize(0)).to.equal(false);`,
    boolean: `expect(schema.unserialize(true)).to.equal(true);`,
    date: `expect(schema.unserialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal(true);`,
    array: `expect(schema.unserialize(['foo', 'bar'])).to.equal(true);`,
    object: `expect(schema.unserialize({ foo: 'bar' })).to.equal(true);`
  },
  date: {
    string: `expect(schema.unserialize('foobar') instanceof Date).to.be.true;`,
    number: `expect(schema.unserialize(0) instanceof Date).to.be.true;`,
    boolean: `expect(schema.unserialize(true) instanceof Date).to.be.true;`,
    date: `expect(schema.unserialize(new Date(Date.UTC(2020, 11, 4, 13, 15))) instanceof Date).to.be.true;`,
    array: `expect(schema.unserialize(['foo', 'bar']) instanceof Date).to.be.true;`,
    object: `expect(schema.unserialize({ foo: 'bar' }) instanceof Date).to.be.true;`
  },
  object: {
    string: `expect(typeof schema.unserialize('foobar')).to.equal('object');`,
    number: `expect(typeof schema.unserialize(0)).to.equal('object');`,
    boolean: `expect(typeof schema.unserialize(true)).to.equal('object');`,
    date: `expect(typeof schema.unserialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal('object');`,
    array: `expect(typeof schema.unserialize(['foo', 'bar'])).to.equal('object');`,
    object: `expect(typeof schema.unserialize({ foo: 'bar' })).to.equal('object');`
  }
};

export default function generate(
  directory: Directory, 
  model: Fieldset,
  column: Column
) {
  const defaults = column.value.default;
  const forCuid = String(defaults).match(/^cuid\(([0-9]+)\)$/);
  const forNano = String(defaults).match(/^nanoid\(([0-9]+)\)$/);

  const filepath = renderCode('<%model%>/tests/columns/<%column%>', {
    model: model.name.toPathName(),
    column: column.name.toPathName('%sSchema.test.ts')
  });
  //load Profile/tests/columns/NameSchema.test.ts 
  //if it exists, if not create it
  const source = loadProjectFile(directory, filepath);
  
  //import { describe, it } from 'mocha';
  source.addImportDeclaration({
    moduleSpecifier: 'mocha',
    namedImports: ['describe', 'it']
  });
  //import { expect } from 'chai';
  source.addImportDeclaration({
    moduleSpecifier: 'chai',
    namedImports: [ 'expect' ]
  });
  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
  //import NameSchema from '../../columns/NameSchema.js';
  source.addImportDeclaration({
    moduleSpecifier: column.name.toPathName('../../columns/%sSchema.js'),
    defaultImport: column.name.toClassName('%sSchema')
  });

  //export default function NameSchemaTests(engine: Engine) {}
  source.addFunction({
    isDefaultExport: true,
    name: column.name.toClassName('%sSchemaTests'),
    parameters: [{ name: 'engine', type: 'Engine' }],
    statements: renderCode(TEMPLATE.DESCRIBE, {
      classname: column.name.toClassName('%sSchema'),
      column: column.name.toClassName(),
      name: column.name.toString(),
      defaults: typeof defaults === 'undefined' 
        ? 'expect(schema.defaults).to.be.undefined;'
        : defaults === null 
        ? 'expect(schema.defaults).to.be.null;'
        : defaults === 'nanoid()' || forNano || defaults === 'cuid()' || forCuid 
        ? 'expect(typeof schema.defaults).to.equal(\'string\');'
        : defaults === 'now()'
        ? 'expect(schema.defaults instanceof Date).to.be.true;'
        : objects.includes(column.type.name) && defaults && typeof defaults === 'object'
        ? `expect(JSON.stringify(schema.defaults)).to.equal('${JSON.stringify(defaults)}');`
        : objects.includes(column.type.name) && typeof defaults === 'string'
        ? `expect(JSON.stringify(schema.defaults)).to.equal('${defaults}');`
        : typeof defaults === 'string'
        ? `expect(schema.defaults).to.equal('${defaults}');`
        : `expect(schema.defaults).to.equal(${defaults});`,
      assert: objects.includes(column.type.name)
        ? Object.values(asserts.object).map(expect => ({ expect }))
        : strings.includes(column.type.name)
        ? Object.values(asserts.string).map(expect => ({ expect }))
        : numbers.includes(column.type.name)
        ? Object.values(asserts.number).map(expect => ({ expect }))
        : dates.includes(column.type.name)
        ? Object.values(asserts.date).map(expect => ({ expect }))
        : column.type.name === 'Boolean'
        ? Object.values(asserts.boolean).map(expect => ({ expect }))
        : column.type.multiple
        ? Object.values(asserts.array).map(expect => ({ expect }))
        : column.type.enum
        ? [
          `expect(typeof schema.assert('foobarzoo')).to.equal('string');`,
          ...Object.values(column.type.enum).map(option => ({ 
            expect: `expect(schema.assert('${option}')).to.be.null;`
          }))
        ]
        : [],
      serialize: objects.includes(column.type.name)
        ? Object.values(serialized.object).map(expect => ({ expect }))
        : strings.includes(column.type.name) || column.type.enum
        ? Object.values(serialized.string).map(expect => ({ expect }))
        : numbers.includes(column.type.name)
        ? Object.values(serialized.number).map(expect => ({ expect }))
        : dates.includes(column.type.name)
        ? Object.values(serialized.date).map(expect => ({ expect }))
        : column.type.name === 'Boolean'
        ? Object.values(serialized.boolean).map(expect => ({ expect }))
        : [],
      unserialize: objects.includes(column.type.name)
        ? Object.values(unserialized.object).map(expect => ({ expect }))
        : strings.includes(column.type.name) || column.type.enum
        ? Object.values(unserialized.string).map(expect => ({ expect }))
        : numbers.includes(column.type.name)
        ? Object.values(unserialized.number).map(expect => ({ expect }))
        : dates.includes(column.type.name)
        ? Object.values(unserialized.date).map(expect => ({ expect }))
        : column.type.name === 'Boolean'
        ? Object.values(unserialized.boolean).map(expect => ({ expect }))
        : [],
    })
  });
};

export const TEMPLATE = {

DESCRIBE:
`describe('<%column%> Schema', async () => {
  it('should have a name', async () => {
    const schema = new <%classname%>();
    expect(schema.name).to.equal('<%name%>');
  });
  it('should have defaults', async () => {
    const schema = new <%classname%>();
    <%defaults%>
  });
  it('should assert', async () => {
    const schema = new <%classname%>();
    <%#assert%>
      <%expect%>
    <%/assert%>
  });
  it('should serialize', async () => {
    const schema = new <%classname%>();
    <%#serialize%>
      <%expect%>
    <%/serialize%>
  });
  it('should unserialize', async () => {
    const schema = new <%classname%>();
    <%#unserialize%>
      <%expect%>
    <%/unserialize%>
  });
});`,

};