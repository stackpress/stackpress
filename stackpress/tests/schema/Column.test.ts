//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mockColumn } from '../helpers.js';

describe('schema/spec/Column', () => {
  it('should determine active column', async () => {
    const active = await mockColumn('active Boolean @active');
    expect(active.active).to.be.true;
    const inactive = await mockColumn('name String');
    expect(inactive.active).to.be.false;
  });

  it('should return admin attributes', async () => {
    const column = await mockColumn([
      'age Number',
      '@active',
      '@is.gt(4)',
      '@admin.is.gt(4)',
      '@field.input',
      '@filter.input',
      '@span.input',
      '@admin.active',
      '@list.text',
      '@view.text',
      '@admin.list.text'
    ].join(' '));
    const actual = Array.from(column.admin.keys());
    expect(actual).to.include('admin.is.gt');
    expect(actual).to.include('admin.active');
    expect(actual).to.include('admin.list.text');
    expect(actual).to.not.include('active');
    expect(actual).to.not.include('is.gt');
    expect(actual).to.not.include('field.input');
    expect(actual).to.not.include('filter.input');
    expect(actual).to.not.include('span.input');
    expect(actual).to.not.include('list.text');
    expect(actual).to.not.include('view.text');
  });

  it('should return assertions', async () => {
    const references = await mockColumn('references Any?');
    expect(references.assertions).to.be.empty;
    const age = await mockColumn('age Number');
    expect(age.assertions.length).to.equal(2);
    // expect(mockColumn('name String').assertions.length).to.equal(2);

    // const column = mockColumn([
    //   'age Number',
    //   '@active',
    //   '@is.gt(4)',
    //   '@is.cc("Invalid CC")',
    //   '@field.input',
    //   '@filter.input',
    //   '@span.input',
    //   '@list.text',
    //   '@view.text',
    //   '@is.required'
    // ].join(' '));
    // const actual = column.assertions;
    // expect(actual[0].method).to.equal('number');
    // expect(actual[0].message).to.equal('Must be a number.');
    // expect(actual[0].config.name).to.equal('is.number');
    // expect(actual[1].method).to.equal('gt');
    // expect(actual[1].args).to.include(4);
    // expect(actual[1].message).to.be.null;
    // expect(actual[1].config.name).to.equal('is.gt');
    // expect(actual[2].method).to.equal('cc');
    // expect(actual[2].args).to.be.empty;
    // expect(actual[2].message).to.equal('Invalid CC');
    // expect(actual[2].config.name).to.equal('is.cc');
    // expect(actual[3].method).to.equal('required');
    // expect(actual[3].args).to.be.empty;
    // expect(actual[3].message).to.be.null;
    // expect(actual[3].config.name).to.equal('is.required');
  });

  it('should return char length', async () => {
    const column = await mockColumn('name String');
    expect(column.chars).to.equal(255);

    const ceq = await mockColumn('name String @is.ceq(4)');
    expect(ceq.chars).to.equal(4);

    const clt = await mockColumn('name String @is.clt(5)');
    expect(clt.chars).to.equal(5);

    const cle = await mockColumn('name String @is.cle(6)');
    expect(cle.chars).to.equal(6);
  });

  it('should return default value', async () => {
    const column = await mockColumn('name String');
    expect(column.default).to.be.undefined;

    const number = await mockColumn('age Number @default(4)');
    expect(number.default).to.equal(4);

    const string = await mockColumn('name String @default("some default")');
    expect(string.default).to.equal('some default');

    const boolean = await mockColumn('active Boolean @default(true)');
    expect(boolean.default).to.equal(true);
  });

  it('should describe column', async () => {
    const column = await mockColumn('name String');
    expect(column.description).to.be.undefined;

    const actual = await mockColumn('name String @description("Please describe")');
    expect(actual.description).to.equal('Please describe');
  });

  it('should enable flags', async () => {
    const column = await mockColumn('name String');
    expect(column.encrypted).to.be.false;
    expect(column.generated).to.be.false;
    expect(column.hashed).to.be.false;
    expect(column.id).to.be.false;
    expect(column.sortable).to.be.false;
    expect(column.searchable).to.be.false;
    expect(column.unique).to.be.false;
    expect(column.updated).to.be.false;

    const actual = await mockColumn([
      'name String',
      '@encrypted',
      '@generated',
      '@hashed',
      '@id',
      '@searchable',
      '@sortable',
      '@unique',
      '@updated'
    ].join(' '));
    expect(actual.encrypted).to.be.true;
    expect(actual.generated).to.be.true;
    expect(actual.hashed).to.be.true;
    expect(actual.id).to.be.true;
    expect(actual.searchable).to.be.true;
    expect(actual.sortable).to.be.true;
    expect(actual.unique).to.be.true;
    expect(actual.updated).to.be.true;
  });

  it('should have examples', async () => {
    const column = await mockColumn('name String');
    expect(column.examples).to.be.empty;

    const actual = await mockColumn('name String @examples("Example 1" 42 true)');
    expect(actual.examples).to.include('Example 1');
    expect(actual.examples).to.include(42);
    expect(actual.examples).to.include(true);
  });

  it('should return label', async () => {
    const column = await mockColumn('name String');
    expect(column.label).to.be.undefined;

    const actual = await mockColumn('name String @label("Full Name")');
    expect(actual.label).to.equal('Full Name');
  });

  it('should return relation', async () => {
    const column = await mockColumn('name String');
    expect(column.relation).to.be.undefined;

    const actual = await mockColumn([
      'userId String',
      '@relation({',
      'name "connections"',
      'local "userId"',
      'foreign "id"',
      '})'
    ].join(' '));
    expect(actual.relation?.name).to.equal('connections');
    expect(actual.relation?.local).to.equal('userId');
    expect(actual.relation?.foreign).to.equal('id');
  });

  it('should get component tokens', async () => {
    const column = await mockColumn('name String');
    expect(column.field).to.be.null;
    expect(column.filter).to.be.null;

    const name = await mockColumn('name String @field.none');
    expect(name.field).to.be.null;

    const actual = await mockColumn([
      'name String',
      '@field.input({ type "text" })',
      '@filter.input({ type "text" })',
      '@span.input({ type "text" })',
      '@list.text({ format "none" })',
      '@view.text({ format "none" })'
    ].join(' '));
    expect(actual.field?.component).to.equal('Input');
    expect(actual.field?.name).to.equal('field.input');
    expect(actual.field?.import.from).to.equal('frui/form/Input');
    expect(actual.field?.props.type).to.equal('text');
    
    expect(actual.filter?.component).to.equal('Input');
    expect(actual.filter?.name).to.equal('filter.input');
    expect(actual.filter?.import.from).to.equal('frui/form/Input');
    expect(actual.filter?.props.type).to.equal('text');

    expect(actual.span?.component).to.equal('Input');
    expect(actual.span?.name).to.equal('span.input');
    expect(actual.span?.import.from).to.equal('frui/form/Input');
    expect(actual.span?.props.type).to.equal('text');

    expect(actual.list?.component).to.equal('TextTransform');
    expect(actual.list?.name).to.equal('list.text');
    expect(actual.list?.import.from).to.equal('frui/view/TextTransform');
    expect(actual.list?.props.format).to.equal('none');

    expect(actual.view?.component).to.equal('TextTransform');
    expect(actual.view?.name).to.equal('view.text');
    expect(actual.view?.import.from).to.equal('frui/view/TextTransform');
    expect(actual.view?.props.format).to.equal('none');
  });

  it('should get min/max/step', async () => {
    const column = await mockColumn('age Number');
    expect(column.max).to.equal(0);
    expect(column.min).to.equal(0);
    expect(column.step).to.equal(1);

    const explicit = await mockColumn([
      'age Number',
      '@max(10)',
      '@min(2)',
      '@step(0.5)'
    ].join(' '));
    expect(explicit.max).to.equal(10);
    expect(explicit.min).to.equal(2);
    expect(explicit.step).to.equal(0.5);

    const implicit = await mockColumn([
      'age Number',
      '@is.le(8.5)',
      //note this quirk
      '@is.lt(7.04)',
      '@is.gt(4)',
      '@is.ge(3)'
    ].join(' '));
    expect(implicit.max).to.equal(8.5);
    expect(implicit.min).to.equal(3);
    expect(implicit.step).to.equal(0.1);
  });

  it('should find errors', async () => {
    //type assertions
    const name1 = await mockColumn('name String');
    expect(name1.assert(4)).to.equal('Must be a string.');

    const name2 = await mockColumn('name Text');
    expect(name2.assert(4)).to.equal('Must be a string.');
    const age = await mockColumn('age Number');
    expect(age.assert('not a number')).to.equal('Must be a number.');
    const age2 = await mockColumn('age Integer');
    expect(age2.assert('not a number')).to.equal('Must be a valid integer format.');
    const height = await mockColumn('height Float');
    expect(height.assert('not a number')).to.equal('Must be a valid float number.');
    const active = await mockColumn('active Boolean');
    expect(active.assert('not a boolean')).to.equal('Must be a boolean.');
    const created = await mockColumn('created Date');
    expect(created.assert('not a date')).to.equal('Must be a valid date.');
    const data1 = await mockColumn('data Hash');
    expect(data1.assert('not a date')).to.equal('Must be an object.');
    const data2 = await mockColumn('data Object');
    expect(data2.assert('not a date')).to.equal('Must be an object.');
    const data3 = await mockColumn('data Json');
    expect(data3.assert('not a date')).to.equal('Must be an object.');
    //TODO:
    //expect(mockColumn('tags String[]').assert(4)).to.equal('Must be an array.');

    //explicit assertions
    const age3 = await mockColumn('age Number @is.gt(4)');
    expect(age3.assert(2)).to.equal('Must be greater than 4.');

    //override messages
    const name3 = await mockColumn('name String @is.string("Should be string")');
    expect(name3.assert(4)).to.equal('Should be string');
  });

  //fixtures
  const date = new Date('2020-01-01 12:00:00');
  
  it('should serialize unknown values', async () => {
    //unknown type
    const unknown = await mockColumn('name Unknown');
    
    let actual = unknown.serialize('Some Name');
    expect(actual).to.equal('Some Name');

    actual = unknown.serialize(4);
    expect(actual).to.equal(4);

    actual = unknown.serialize(true);
    expect(actual).to.equal(true);

    actual = unknown.serialize(false);
    expect(actual).to.equal(false);

    actual = unknown.serialize(date);
    expect(actual).to.equal(date);
  });

  it('should serialize string values', async () => {
    //string type
    const string = await mockColumn('name String');

    let actual = string.serialize('Some Name');
    expect(actual).to.equal('Some Name');

    actual = string.serialize(4);
    expect(actual).to.equal('4');

    actual = string.serialize(true);
    expect(actual).to.equal('true');

    actual = string.serialize(false);
    expect(actual).to.equal('false');

    actual = string.serialize(null);
    expect(actual).to.equal('null');

    const name = await mockColumn('name String?');
    actual = name.serialize(null);
    expect(actual).to.be.null;

    
    actual = string.serialize(date);
    expect(actual).to.equal('2020-01-01 12:00:00');

    actual = string.serialize(undefined);
    expect(actual).to.be.undefined;
  });

  it('should serialize number values', async () => {
    //number type (Number, Integer, Float)
    const number = await mockColumn('age Number');
    
    let actual = number.serialize('Some Name');
    expect(actual).to.equal(0);
    
    actual = number.serialize(4);
    expect(actual).to.equal(4);
    
    actual = number.serialize(true);
    expect(actual).to.equal(1);
    
    actual = number.serialize(false);
    expect(actual).to.equal(0);
    //unix...
    actual = number.serialize(date);
    expect(actual).to.equal(1577851200000);
    
    actual = number.serialize(null);
    expect(actual).to.equal(0);

    actual = number.serialize(undefined);
    expect(actual).to.be.undefined;
  });

  it('should serialize boolean values', async () => {
    //boolean type
    const boolean = await mockColumn('active Boolean');

    let actual = boolean.serialize('Some Name');
    expect(actual).to.equal(true);

    actual = boolean.serialize(4);
    expect(actual).to.equal(true);

    actual = boolean.serialize(0);
    expect(actual).to.equal(false);

    actual = boolean.serialize(true);
    expect(actual).to.equal(true);

    actual = boolean.serialize(false);
    expect(actual).to.equal(false);

    actual = boolean.serialize(date);
    expect(actual).to.equal(true);

    actual = boolean.serialize(null);
    expect(actual).to.equal(false);

    actual = boolean.serialize('Some Name', true);
    expect(actual).to.equal(1);

    actual = boolean.serialize(4, true);
    expect(actual).to.equal(1);

    actual = boolean.serialize(0, true);
    expect(actual).to.equal(0);

    actual = boolean.serialize(true, true);
    expect(actual).to.equal(1);

    actual = boolean.serialize(false, true);
    expect(actual).to.equal(0);

    actual = boolean.serialize(date, true);
    expect(actual).to.equal(1);

    actual = boolean.serialize(null, true);
    expect(actual).to.equal(0);

    actual = boolean.serialize(undefined);
    expect(actual).to.be.undefined;

  });

  it('should serialize date values', async () => {
    //date type (Date, Time, Datetime)
    const datetime = await mockColumn('created Datetime');

    let actual = datetime.serialize(date);
    expect((actual as Date)?.toISOString()).to.equal(date.toISOString());

    actual = datetime.serialize(1577851200000);
    expect((actual as Date)?.toISOString()).to.equal(date.toISOString());

    actual = datetime.serialize(null);
    expect((actual as Date)?.toISOString()).to.equal(new Date(0).toISOString());

    const created1 = await mockColumn('created Datetime?');
    actual = created1.serialize(null);
    expect(actual).to.be.null;

    actual = datetime.serialize('2020-01-01 12:00:00', true);
    expect(actual).to.equal('2020-01-01 12:00:00');

    actual = datetime.serialize(1577851200000, true);
    expect(actual).to.equal('2020-01-01 12:00:00');

    actual = datetime.serialize(null, true);
    expect(actual).to.equal('1970-01-01 08:00:00');

    const created2 = await mockColumn('created Datetime?');
    actual = created2.serialize(null, true);
    expect(actual).to.be.null;

    actual = datetime.serialize(undefined);
    expect(actual).to.be.undefined;
  });

  it('should serialize object values', async () => {
    //object type (Json, Object, Hash)
    const object = await mockColumn('data Json');

    let actual = object.serialize({ key: 'value' }, true);
    expect(actual).to.equal('{"key":"value"}');
    actual = object.serialize('{"key":"value"}', true);
    expect(actual).to.equal('{"key":"value"}');
    actual = object.serialize('FooBar', true);
    expect(actual).to.equal('{}');

    actual = object.serialize(null, true);
    expect(actual).to.equal('null');

    const data1 = await mockColumn('data Json?');
    actual = data1.serialize(null, true);
    expect(actual).to.equal(null);

    actual = object.serialize({ key: 'value' });
    expect(actual.key).to.equal('value');

    actual = object.serialize('{"key":"value"}');
    expect(actual.key).to.equal('value');
    actual = object.serialize('FooBar');
    expect(Object.keys(actual).length).to.equal(0);

    actual = object.serialize(null);
    expect(actual).to.equal(null);

    const data2 = await mockColumn('data Json?');
    actual = data2.serialize(null);
    expect(actual).to.be.null;

    actual = object.serialize(undefined);
    expect(actual).to.be.undefined;
  });

  it('should unserialize string values', async () => {
    const column = await mockColumn('name String');

    let actual = column.unserialize('Some Name');
    expect(actual).to.equal('Some Name');

    actual = column.unserialize(4);
    expect(actual).to.equal('4');

    actual = column.unserialize(true);
    expect(actual).to.equal('true');

    actual = column.unserialize(false);
    expect(actual).to.equal('false');

    actual = column.unserialize(date);
    expect(actual).to.equal('2020-01-01 12:00:00');

    actual = column.unserialize(null);
    expect(actual).to.be.null;

    actual = column.unserialize(undefined);
    expect(actual).to.be.undefined;
  });
});
