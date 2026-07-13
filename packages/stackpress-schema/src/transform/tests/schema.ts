//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Column from '../../Column.js';
import type Fieldset from '../../Fieldset.js';
import { loadProjectFile, renderCode } from '../helpers.js';
import generateColumnTests from './column.js';

export const strings = [ 'String', 'Text' ];
export const numbers = [ 'Number', 'Float', 'Integer' ];
export const dates = [ 'Date', 'Time', 'Datetime' ];
export const objects = [ 'Object', 'Json', 'Hash' ];

function getSample(column: Column) {
  const type = column.type.name;
  const value = column.type.enum
    ? JSON.stringify(Object.values(column.type.enum)[0])
    : strings.includes(type)
    ? JSON.stringify('foobar')
    : numbers.includes(type)
    ? '123'
    : type === 'Boolean'
    ? 'true'
    : dates.includes(type)
    ? "new Date('2024-01-01T00:00:00.000Z')"
    : objects.includes(type)
    ? "{ foo: 'bar' }"
    : JSON.stringify('foobar');
  return column.type.multiple ? `[${value}]` : value;
};

export default function generate(directory: Directory, model: Fieldset) {
  //dont include columns that are models 
  //(those are more of relational information)
  const columns = model.columns.filter(
    column => !column.type.model && !column.type.fieldset
  );

  const validSample = columns.map(column => (
    `${column.name.toString()}: ${getSample(column)}`
  )).toArray();

  const filepath = model.name.toPathName('%s/tests/%sSchema.test.ts');
  //load Profile/index.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

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

  //import ProfileSchema from '../ProfileSchema.js';
  source.addImportDeclaration({
    moduleSpecifier: model.name.toPathName('../%sSchema.js'),
    defaultImport: model.name.toClassName('%sSchema')
  });
  //import AddressSchema from '../Address/AddressSchema.js';
  //import StreetColumn from './columns/StreetColumn.js';
  for (const column of columns.values()) {
    if (column.type.fieldset) {
      //import AddressSchema from '../Address/AddressSchema.js';
      source.addImportDeclaration({
        moduleSpecifier: column.type.fieldset.name.toPathName('../../%s/%sSchema.js'),
        defaultImport: column.type.fieldset.name.toClassName('%sSchema')
      });
    } else {
      generateColumnTests(directory, model, column);
      //import StreetColumn from './columns/StreetColumn.js';
      source.addImportDeclaration({
        moduleSpecifier: column.name.toPathName('../columns/%sColumn.js'),
        defaultImport: column.name.toClassName('%sColumn')
      });
    }
  }
  
  //------------------------------------------------------------------//
  // Exports

  //export default function ProfileSchemaTests() {}
  source.addFunction({
    isDefaultExport: true,
    name: model.name.toClassName('%sSchemaTests'),
    statements: renderCode(TEMPLATE.DESCRIBE, {
      classname: model.name.toClassName('%sSchema'),
      schema: model.name.toClassName(),
      name: model.name.toString(),
      columns: columns.map(column => ({
        column: column.name.toPropertyName(),
        schema: column.name.toClassName('%sColumn')
      })).toArray(),
      defaults: columns.map(column => {
        const defaults = column.value.default;
        const forCuid = String(defaults).match(/^cuid\(([0-9]+)\)$/);
        const forNano = String(defaults).match(/^nanoid\(([0-9]+)\)$/);
        return { 
          expect: column.type.multiple
            ? `expect(defaults.${column.name.toPropertyName()}).to.be.an('array');`
            : typeof defaults === 'undefined'
            ? `expect(defaults.${column.name.toPropertyName()}).to.be.undefined;`
            : defaults === null 
            ? `expect(defaults.${column.name.toPropertyName()}).to.be.null;`
            : defaults === 'nanoid()' || forNano || defaults === 'cuid()' || forCuid 
            ? `expect(typeof defaults.${column.name.toPropertyName()}).to.equal('string');`
            : defaults === 'now()'
            ? `expect(defaults.${column.name.toPropertyName()} instanceof Date).to.be.true;`
            : objects.includes(column.type.name) && defaults && typeof defaults === 'object'
            ? `expect(JSON.stringify(defaults.${column.name.toPropertyName()})).to.equal('${JSON.stringify(defaults)}');`
            : objects.includes(column.type.name) && typeof defaults === 'string'
            ? `expect(JSON.stringify(defaults.${column.name.toPropertyName()})).to.equal('${defaults}');`
            : typeof defaults === 'string'
            ? `expect(defaults.${column.name.toPropertyName()}).to.equal('${defaults}');`
            : `expect(defaults.${column.name.toPropertyName()}).to.equal(${defaults});`
        };
      }).toArray(),
      asserts: [
        {
          input: `const input = { ${validSample.join(', ')} };`,
          actual: `const actual = schema.assert(input);`,
          expect: `expect(actual).to.be.null;`,
          columns: []
        }
      ],
      filter: `{ ${validSample.concat(['__FOO__: true' ]).join(', ')} }`,
      sample: validSample.join(', '),
      populate: columns.map(column => {
        const defaults = column.value.default;
        const forCuid = String(defaults).match(/^cuid\(([0-9]+)\)$/);
        const forNano = String(defaults).match(/^nanoid\(([0-9]+)\)$/);
        return { 
          expect: column.type.multiple
            ? `expect(actual.${column.name.toPropertyName()}).to.be.an('array');`
            : typeof defaults === 'undefined'
            ? `expect(actual.${column.name.toPropertyName()}).to.be.undefined;`
            : defaults === null 
            ? `expect(actual.${column.name.toPropertyName()}).to.be.null;`
            : defaults === 'nanoid()' || forNano || defaults === 'cuid()' || forCuid 
            ? `expect(typeof actual.${column.name.toPropertyName()}).to.equal('string');`
            : defaults === 'now()'
            ? `expect(actual.${column.name.toPropertyName()} instanceof Date).to.be.true;`
            : objects.includes(column.type.name) && defaults && typeof defaults === 'object'
            ? `expect(JSON.stringify(actual.${column.name.toPropertyName()})).to.equal('${JSON.stringify(defaults)}');`
            : objects.includes(column.type.name) && typeof defaults === 'string'
            ? `expect(JSON.stringify(actual.${column.name.toPropertyName()})).to.equal('${defaults}');`
            : typeof defaults === 'string'
            ? `expect(actual.${column.name.toPropertyName()}).to.equal('${defaults}');`
            : `expect(actual.${column.name.toPropertyName()}).to.equal(${defaults});`
        };
      }).toArray(),
    }),

  });
};

export const TEMPLATE = {

DESCRIBE:
`describe('<%schema%> Schema', async () => {
  it('should have a name', async () => {
    const schema = new <%classname%>();
    expect(schema.name).to.equal('<%name%>');
  });
  it('should have columns', async () => {
    const schema = new <%classname%>();
    expect(schema.columns).to.be.an('object');
    <%#@:columns%>
      expect(schema.columns.<%column%>).to.be.instanceOf(<%schema%>);
    <%/@:columns%>
  });
  it('should have a shape', async () => {
    const schema = new <%classname%>();
    //its always a zod object schema
    expect(schema.shape).to.be.an('object');
  });
  it('should have defaults', async () => {
    const schema = new <%classname%>();
    const defaults = schema.defaults;
    <%#@:defaults%>
      <%expect%>
    <%/@:defaults%>
  });
  it('should assert', async () => {
    const schema = new <%classname%>();
    <%#@:asserts%>

      <%input%>
      <%actual%>
      <%expect%>
      <%#@:columns%>
        <%column%>
      <%/@:columns%>
    <%/@:asserts%>
  });
  it('should filter', async () => {
    const schema = new <%classname%>();
    const input = <%filter%>;
    expect(schema.filter(input)).to.not.have.property('__FOO__');
  });
  it('should populate', async () => {
    const schema = new <%classname%>();
    const actual = schema.populate({ __FOO__: true });
    expect(actual.__FOO__).to.be.true;
    <%#@:populate%>
      <%expect%>
    <%/@:populate%>
  });
  it('should serialize', async () => {
    const schema = new <%classname%>();
    const actual = schema.serialize({ <%sample%> });
    <%#@:columns%>
      expect(actual).to.have.property('<%column%>');
    <%/@:columns%>
  });
  it('should unserialize', async () => {
    const schema = new <%classname%>();
    const serialized = schema.serialize({ <%sample%> });
    const actual = schema.unserialize(serialized);
    <%#@:columns%>
      expect(actual).to.have.property('<%column%>');
    <%/@:columns%>
  });
});`,

};
