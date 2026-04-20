//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Fieldset from '../../Fieldset.js';
import type Column from '../../Column.js';
import { loadProjectFile, renderCode } from '../helpers.js';

export const strings = [ 'String', 'Text' ];
export const numbers = [ 'Number', 'Float', 'Integer' ];
export const dates = [ 'Date', 'Time', 'Datetime' ];
export const objects = [ 'Object', 'Json', 'Hash' ];

//Fri, 04 Dec 2020 13:15:00 GMT
//const date = new Date(Date.UTC(2020, 11, 4, 13, 15));

const asserts = {
  string: {
    string: `expect(column.assert('foobar')).to.be.null;`,
    number: `expect(typeof column.assert(123)).to.equal('string');`,
    boolean: `expect(typeof column.assert(true)).to.equal('string');`,
    date: `expect(typeof column.assert(new Date())).to.equal('string');`,
    object: `expect(typeof column.assert({ foo: 'bar' })).to.equal('string');`,
    array: `expect(typeof column.assert(['foo', 'bar'])).to.equal('string');`
  },
  number: {
    string: `expect(typeof column.assert('foobar')).to.equal('string');`,
    number: `expect(column.assert(123)).to.be.null;`,
    boolean: `expect(typeof column.assert(true)).to.equal('string');`,
    date: `expect(typeof column.assert(new Date())).to.equal('string');`,
    object: `expect(typeof column.assert({ foo: 'bar' })).to.equal('string');`,
    array: `expect(typeof column.assert(['foo', 'bar'])).to.equal('string');`
  },
  boolean: {
    string: `expect(typeof column.assert('foobar')).to.equal('string');`,
    number: `expect(typeof column.assert(123)).to.equal('string');`,
    boolean: `expect(column.assert(true)).to.be.null;`,
    date: `expect(typeof column.assert(new Date())).to.equal('string');`,
    object: `expect(typeof column.assert({ foo: 'bar' })).to.equal('string');`,
    array: `expect(typeof column.assert(['foo', 'bar'])).to.equal('string');`
  },
  date: {
    string: `expect(typeof column.assert('foobar')).to.equal('string');`,
    number: `expect(typeof column.assert(123)).to.equal('string');`,
    boolean: `expect(typeof column.assert(true)).to.equal('string');`,
    date: `expect(column.assert(new Date())).to.be.null;`,
    object: `expect(typeof column.assert({ foo: 'bar' })).to.equal('string');`,
    array: `expect(typeof column.assert(['foo', 'bar'])).to.equal('string');`
  },
  object: {
    string: `expect(typeof column.assert('foobar')).to.equal('string');`,
    number: `expect(typeof column.assert(123)).to.equal('string');`,
    boolean: `expect(typeof column.assert(true)).to.equal('string');`,
    date: `expect(typeof column.assert(new Date())).to.equal('string');`,
    object: `expect(column.assert({ foo: 'bar' })).to.be.null;`,
    array: `expect(typeof column.assert(['foo', 'bar'])).to.equal('string');`
  },
  array: {
    string: `expect(typeof column.assert('foobar')).to.equal('string');`,
    number: `expect(typeof column.assert(123)).to.equal('string');`,
    boolean: `expect(typeof column.assert(true)).to.equal('string');`,
    date: `expect(typeof column.assert(new Date())).to.equal('string');`,
    object: `expect(typeof column.assert({ foo: 'bar' })).to.equal('string');`,
    array: `expect(typeof column.assert(['foo', 'bar'])).to.equal('string');`
  },
};

const serialized = {
  string: {
    string: `expect(column.serialize('foobar')).to.equal('foobar');`,
    number: `expect(column.serialize(123)).to.equal('123');`,
    boolean: `expect(column.serialize(true)).to.equal('true');`,
    date: `expect(column.serialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal('2020-12-04 13:15:00');`,
    array: `expect(column.serialize(['foo', 'bar'])).to.equal('["foo","bar"]');`,
    object: `expect(column.serialize({ foo: 'bar' })).to.equal('{"foo":"bar"}');`
  },
  number: {
    string: `expect(column.serialize('foobar')).to.equal(0);`,
    number: `expect(column.serialize(123)).to.equal(123);`,
    boolean: `expect(column.serialize(true)).to.equal(1);`,
    date: `expect(column.serialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal(1607087700000);`,
    array: `expect(column.serialize(['foo', 'bar'])).to.equal(0);`,
    object: `expect(column.serialize({ foo: 'bar' })).to.equal(0);`
  },
  boolean: {
    string: `expect(column.serialize('foobar')).to.equal(true);`,
    number: `expect(column.serialize(0)).to.equal(false);`,
    boolean: `expect(column.serialize(true)).to.equal(true);`,
    date: `expect(column.serialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal(true);`,
    array: `expect(column.serialize(['foo', 'bar'])).to.equal(true);`,
    object: `expect(column.serialize({ foo: 'bar' })).to.equal(true);`
  },
  date: {
    string: `expect(column.serialize('foobar')).to.equal('1970-01-01 00:00:00');`,
    number: `expect(column.serialize(0)).to.equal('1970-01-01 00:00:00');`,
    boolean: `expect(column.serialize(true)).to.equal('1970-01-01 00:00:00');`,
    date: `expect(column.serialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal('2020-12-04 13:15:00');`,
    array: `expect(column.serialize(['foo', 'bar'])).to.equal('1970-01-01 00:00:00');`,
    object: `expect(column.serialize({ foo: 'bar' })).to.equal('1970-01-01 00:00:00');`
  },
  object: {
    string: `expect(column.serialize('foobar')).to.equal('{}');`,
    number: `expect(column.serialize(0)).to.equal('{}');`,
    boolean: `expect(column.serialize(true)).to.equal('{}');`,
    date: `expect(column.serialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal('{}');`,
    array: `expect(column.serialize(['foo', 'bar'])).to.equal('{}');`,
    object: `expect(column.serialize({ foo: 'bar' })).to.equal('{"foo":"bar"}');`
  }
};

const unserialized = {
  string: {
    string: `expect(column.unserialize('foobar')).to.equal('foobar');`,
    number: `expect(column.unserialize(123)).to.equal('123');`,
    boolean: `expect(column.unserialize(true)).to.equal('true');`,
    date: `expect(column.unserialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal('2020-12-04 13:15:00');`,
    array: `expect(column.unserialize(['foo', 'bar'])).to.equal('["foo","bar"]');`,
    object: `expect(column.unserialize({ foo: 'bar' })).to.equal('{"foo":"bar"}');`
  },
  number: {
    string: `expect(column.unserialize('foobar')).to.equal(0);`,
    number: `expect(column.unserialize(123)).to.equal(123);`,
    boolean: `expect(column.unserialize(true)).to.equal(1);`,
    date: `expect(column.unserialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal(1607087700000);`,
    array: `expect(column.unserialize(['foo', 'bar'])).to.equal(0);`,
    object: `expect(column.unserialize({ foo: 'bar' })).to.equal(0);`
  },
  boolean: {
    string: `expect(column.unserialize('foobar')).to.equal(true);`,
    number: `expect(column.unserialize(0)).to.equal(false);`,
    boolean: `expect(column.unserialize(true)).to.equal(true);`,
    date: `expect(column.unserialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal(true);`,
    array: `expect(column.unserialize(['foo', 'bar'])).to.equal(true);`,
    object: `expect(column.unserialize({ foo: 'bar' })).to.equal(true);`
  },
  date: {
    string: `expect(column.unserialize('foobar') instanceof Date).to.be.true;`,
    number: `expect(column.unserialize(0) instanceof Date).to.be.true;`,
    boolean: `expect(column.unserialize(true) instanceof Date).to.be.true;`,
    date: `expect(column.unserialize(new Date(Date.UTC(2020, 11, 4, 13, 15))) instanceof Date).to.be.true;`,
    array: `expect(column.unserialize(['foo', 'bar']) instanceof Date).to.be.true;`,
    object: `expect(column.unserialize({ foo: 'bar' }) instanceof Date).to.be.true;`
  },
  object: {
    string: `expect(typeof column.unserialize('foobar')).to.equal('object');`,
    number: `expect(typeof column.unserialize(0)).to.equal('object');`,
    boolean: `expect(typeof column.unserialize(true)).to.equal('object');`,
    date: `expect(typeof column.unserialize(new Date(Date.UTC(2020, 11, 4, 13, 15)))).to.equal('object');`,
    array: `expect(typeof column.unserialize(['foo', 'bar'])).to.equal('object');`,
    object: `expect(typeof column.unserialize({ foo: 'bar' })).to.equal('object');`
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
    column: column.name.toPathName('%sColumn.test.ts')
  });
  //load Profile/tests/columns/NameColumn.test.ts 
  //if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import type Engine from '@stackpress/inquire/Engine';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/inquire/Engine',
    defaultImport: 'Engine'
  });
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

  //------------------------------------------------------------------//
  // Import Stackpress
  //------------------------------------------------------------------//
  // Import Client
  
  //import NameColumn from '../../columns/NameColumn.js';
  source.addImportDeclaration({
    moduleSpecifier: column.name.toPathName('../../columns/%sColumn.js'),
    defaultImport: column.name.toClassName('%sColumn')
  });

  //------------------------------------------------------------------//
  // Exports

  //export default function NameColumnTests(engine: Engine) {}
  source.addFunction({
    isDefaultExport: true,
    name: column.name.toClassName('%sColumnTests'),
    parameters: [{ name: 'engine', type: 'Engine' }],
    statements: renderCode(TEMPLATE.DESCRIBE, {
      classname: column.name.toClassName('%sColumn'),
      column: column.name.toClassName(),
      name: column.name.toString(),
      defaults: typeof defaults === 'undefined' 
        ? 'expect(column.defaults).to.be.undefined;'
        : defaults === null 
        ? 'expect(column.defaults).to.be.null;'
        : defaults === 'nanoid()' || forNano || defaults === 'cuid()' || forCuid 
        ? 'expect(typeof column.defaults).to.equal(\'string\');'
        : defaults === 'now()'
        ? 'expect(column.defaults instanceof Date).to.be.true;'
        : objects.includes(column.type.name) && defaults && typeof defaults === 'object'
        ? `expect(JSON.stringify(column.defaults)).to.equal('${JSON.stringify(defaults)}');`
        : objects.includes(column.type.name) && typeof defaults === 'string'
        ? `expect(JSON.stringify(column.defaults)).to.equal('${defaults}');`
        : typeof defaults === 'string'
        ? `expect(column.defaults).to.equal('${defaults}');`
        : `expect(column.defaults).to.equal(${defaults});`,
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
          `expect(typeof column.assert('foobarzoo')).to.equal('string');`,
          ...Object.values(column.type.enum).map(option => ({ 
            expect: `expect(column.assert('${option}')).to.be.null;`
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
`describe('<%column%> Column', async () => {
  it('should have a name', async () => {
    const column = new <%classname%>();
    expect(column.name).to.equal('<%name%>');
  });
  it('should have defaults', async () => {
    const column = new <%classname%>();
    <%defaults%>
  });
  it('should assert', async () => {
    const column = new <%classname%>();
    <%#@:assert%>
      <%expect%>
    <%/@:assert%>
  });
  it('should serialize', async () => {
    const column = new <%classname%>();
    <%#@:serialize%>
      <%expect%>
    <%/@:serialize%>
  });
  it('should unserialize', async () => {
    const column = new <%classname%>();
    <%#@:unserialize%>
      <%expect%>
    <%/@:unserialize%>
  });
});`,

};