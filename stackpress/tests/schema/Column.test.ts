//tests
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { mockFieldset, mockSchema } from '../helpers.js';

import type { 
  TypeMapDataAssertion, 
  TypeMapDataSerializer 
} from '../../src/schema/types.js';
import Fieldset from '../../src/schema/fieldset/Fieldset.js';
import Column from '../../src/schema/column/Column.js';
import Columns from '../../src/schema/column/Columns.js';
import ColumnName from '../../src/schema/column/ColumnName.js';
import ColumnType from '../../src/schema/column/ColumnType.js';
import ColumnAssertion from '../../src/schema/column/ColumnAssertion.js';
import ColumnComponent from '../../src/schema/column/ColumnComponent.js';
import ColumnDocument from '../../src/schema/column/ColumnDocument.js';
import ColumnNumber from '../../src/schema/column/ColumnNumber.js';
import ColumnRuntime from '../../src/schema/column/ColumnRuntime.js';
import ColumnValue from '../../src/schema/column/ColumnValue.js';

describe('schema/column/Column', () => {
  let column: Column;
  before(async () => {
    //name String @label("Full Name") @is.required
    column = Column.make('name', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, {
      label: [ 'Full Name' ],
      'is.required': []
    });
  });

  it('should set parent', async () => {
    const fieldset = new Fieldset('User');
    fieldset.schema = await mockSchema();
    fieldset.columns.add(column);
    expect(column.parent).to.equal(fieldset);
  });

  it('should get attribute by name', async () => {
    expect(column.attribute('label')?.value).to.equal('Full Name');
    expect(column.attribute('is.required')?.args).to.be.empty;
  });

  it('should load extensions', async () => {
    expect(column.name).to.be.instanceOf(ColumnName);
    expect(column.type).to.be.instanceOf(ColumnType);
    expect(column.assertion).to.be.instanceOf(ColumnAssertion);
    expect(column.component).to.be.instanceOf(ColumnComponent);
    expect(column.document).to.be.instanceOf(ColumnDocument);
    expect(column.number).to.be.instanceOf(ColumnNumber);
    expect(column.runtime).to.be.instanceOf(ColumnRuntime);
    expect(column.value).to.be.instanceOf(ColumnValue);
  });
});

describe('schema/column/ColumnName', () => {
  it('should manipulate name', async () => {
    //profileId String @label("Profile ID")
    const column = Column.make('profileId', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, {
      label: [ 'Profile ID' ]
    });
    expect(column.name.camelCase).to.equal('profileId');
    expect(column.name.dashCase).to.equal('profile-id');
    expect(column.name.snakeCase).to.equal('profile_id');
    expect(column.name.titleCase).to.equal('ProfileId');
    expect(column.name.label).to.equal('Profile ID');
  });
});

describe('schema/column/ColumnType', () => {
  it('should set schema', async () => {
    const type = new ColumnType('String', true, false);
    const schema = await mockSchema();
    type.schema = schema;
    expect(type.schema).to.equal(schema);
  });

  it('should get assertions', async () => {
    const schema = await mockSchema();
    const type = new ColumnType('String', true, false, schema);
    const actual = type.assertions.findValue(
      assertion => assertion.name === 'string'
    );
    expect(actual).to.not.be.undefined;
  });

  it('should get enum', async () => {
    const schema = await mockSchema();
    const type = new ColumnType('Role', true, false, schema);
    expect(type.enum?.ADMIN).to.equal('ADMIN');
    expect(type.enum?.EDITOR).to.equal('EDITOR');
    expect(type.enum?.USER).to.equal('USER');
  });

  it('should get fieldset', async () => {
    const schema = await mockSchema();
    const type = new ColumnType('Address', true, false, schema);
    expect(type.fieldset?.name.toString()).to.equal('Address');
  });

  it('should get model', async () => {
    const schema = await mockSchema();
    const type = new ColumnType('BasicModel', true, false, schema);
    expect(type.model?.name.toString()).to.equal('BasicModel');
  });

  it('should get mapped values', async () => {
    const type = new ColumnType('Text', true, false);
    const schema = await mockSchema();
    type.schema = schema;

    expect(type.has('assertion')).to.be.true;
    const assertion = type.get<TypeMapDataAssertion>('assertion');
    expect(assertion?.name).to.equal('string');

    expect(type.has('serializer')).to.be.true;
    const serializer = type.get<TypeMapDataSerializer>('serializer');
    expect(serializer?.name).to.equal('StringSerializer');
  });

  it('should load serializer', async () => {
    const type = new ColumnType('Datetime', true, false);
    const schema = await mockSchema();
    type.schema = schema;
    expect(typeof type.serializer).to.equal('function');

    const foobar = new ColumnType('FooBar', true, false);
    foobar.schema = schema;
    expect(typeof foobar.serializer).to.equal('function');
  });
});

describe('schema/column/ColumnAssertion', () => {
  let column: Column;
  before(async () => {
    //age Number @is.required @is.gt(4 "Must be over 4 years old.") @is.lt(10)
    column = Column.make('age', { 
      name: 'Number', 
      required: true, 
      multiple: false 
    }, {
      'is.gt': [ 4, 'Must be over 4 years old.' ],
      'is.lt': [ 10 ],
      'is.required': []
    });
    column.type.schema = await mockSchema();
  });

  it('should get assertion attributes', async () => {
    const attributes = column.assertion.attributes;
    expect(attributes.size).to.equal(3);
    const gt = attributes.find(attr => attr.name === 'is.gt');
    expect(gt).to.not.be.undefined;
    const lt = attributes.find(attr => attr.name === 'is.lt');
    expect(lt).to.not.be.undefined;
    const required = attributes.find(attr => attr.name === 'is.required');
    expect(required).to.not.be.undefined;
  });

  it('should get assertions', async () => {
    const assertions = column.assertion.assertions;
    //should have 4 assertions: is.number (default), is.gt, is.lt, is.required
    expect(assertions.length).to.equal(4);
    const number = assertions.find(assert => assert.name === 'number');
    expect(number).to.not.be.undefined;
    expect(number?.args).to.be.empty;
    expect(number?.message).to.equal('Must be a number.');
    const gt = assertions.find(assert => assert.name === 'gt');
    expect(gt).to.not.be.undefined;
    expect(gt?.args).to.include(4);
    expect(gt?.message).to.equal('Must be over 4 years old.');
    const lt = assertions.find(assert => assert.name === 'lt');
    expect(lt).to.not.be.undefined;
    expect(lt?.args).to.include(10);
    expect(lt?.message).to.equal('Must be less than {{arg}}.');
  });
});

describe('schema/column/ColumnComponent', () => {
  let column: Column;
  before(async () => {
    column = Column.make('age', { 
      name: 'Number', 
      required: true, 
      multiple: false 
    }, {
      'is.gt': [ 4, 'Must be over 4 years old.' ],
      'is.lt': [ 10 ],
      'filter.input': [ { type: 'number' } ],
      'field.number': [ { type: 'number' } ],
      'span.number': [ { type: 'number' } ],
      'list.number': [ { separator: ',', decimal: '.' } ],
      'view.number': [ { separator: ',', decimal: '.' } ],
    });
    const fieldset = await mockFieldset('User');
    //we need to add to fieldset to set parent and thus schema references
    fieldset.columns.add(column);
  });

  it('should get component attributes', async () => {
    expect(column.component.attributes.size).to.equal(5);
  });

  it('should get filter field attribute', async () => {
    const actual = column.component.filterField?.component.definition?.name;
    expect(actual).to.equal('Input');
  });

  it('should get form field attribute', async () => {
    const actual = column.component.formField?.component.definition?.name;
    expect(actual).to.deep.equal('NumberInput');
  });

  it('should get span field attribute', async () => {
    const actual = column.component.spanField?.component.definition?.name;
    expect(actual).to.deep.equal('NumberInput');
  });

  it('should get list format attribute', async () => {
    const actual = column.component.listFormat?.component.definition?.name;
    expect(actual).to.deep.equal('NumberFormat');
  });

  it('should get view format attribute', async () => {
    const actual = column.component.viewFormat?.component.definition?.name;
    expect(actual).to.deep.equal('NumberFormat');
  });
});

describe('schema/column/ColumnDocument', () => {
  it('should get description and examples', () => {
    //name String @description("User full name.") @examples("John Doe" "Jane Smith")
    const column = Column.make('name', {
      name: 'String',
      required: true,
      multiple: false
    }, {
      description: [ "User full name." ],
      examples: [ "John Doe", "Jane Smith" ]
    });
    expect(column.document.description).to.equal('User full name.');
    expect(column.document.examples).to.include('John Doe');
    expect(column.document.examples).to.include('Jane Smith');
  });
});

describe('schema/column/ColumnNumber', () => {
  it('should calculate char length', () => {
    const type = { name: 'String', required: true, multiple: false };
    //name String 
    const column1 = Column.make('name', type);
    expect(column1.number.chars).to.equal(255);
    //name String @is.ceq(4) 
    const column2 = Column.make('name', type, { 'is.ceq': [ 4 ] });
    expect(column2.number.chars).to.equal(4);
    //name String @is.clt(5)
    const column3 = Column.make('name', type, { 'is.clt': [ 5 ] });
    expect(column3.number.chars).to.equal(5);
    //name String @is.cle(6)
    const column4 = Column.make('name', type, { 'is.cle': [ 6 ] });
    expect(column4.number.chars).to.equal(6);
  });
  
  it('should calculate max length', () => {
    const type = { name: 'Number', required: true, multiple: false };
    //age Number
    const column1 = Column.make('age', type);
    expect(column1.number.max).to.equal(0);
    //age Number @max(10)
    const column2 = Column.make('age', type, { max: [ 10 ] });
    expect(column2.number.max).to.equal(10);
    //age Number @is.eq(8)
    const column3 = Column.make('age', type, { 'is.eq': [ 8 ] });
    expect(column3.number.max).to.equal(8);
    //age Number @is.le(8.5) 
    const column4 = Column.make('age', type, { 'is.le': [ 8.5 ] });
    expect(column4.number.max).to.equal(8.5);
    //age Number @is.lt(7.04)
    const column5 = Column.make('age', type, { 'is.lt': [ 7.04 ] });
    expect(column5.number.max).to.equal(7.04);
    //age Number @is.eq(8) @is.le(8.5) @is.lt(7.04)
    const column6 = Column.make('age', type, {
      'is.eq': [ 8 ],
      'is.le': [ 8.5 ],
      'is.lt': [ 7.04 ]
    });
    expect(column6.number.max).to.equal(8.5);
    //age Number @max(10) @is.eq(17) @is.le(8.5) @is.lt(7.04)
    const column7 = Column.make('age', type, {
      max: [ 10 ],
      'is.eq': [ 17 ],
      'is.le': [ 8.5 ],
      'is.lt': [ 7.04 ]
    });
    expect(column7.number.max).to.equal(10);
  });
  
  it('should calculate min length', () => {
    const type = { name: 'Number', required: true, multiple: false };
    //age Number
    const column1 = Column.make('age', type);
    expect(column1.number.min).to.equal(0);
    //age Number @min(2)
    const column2 = Column.make('age', type, { min: [ 2 ] });
    expect(column2.number.min).to.equal(2);
    //age Number @is.eq(4)
    const column3 = Column.make('age', type, { 'is.eq': [ 4 ] });
    expect(column3.number.min).to.equal(4);
    //age Number @is.ge(3.2)
    const column4 = Column.make('age', type, { 'is.ge': [ 3.2 ] });
    expect(column4.number.min).to.equal(3.2);
    //age Number @is.gt(4.03)
    const column5 = Column.make('age', type, { 'is.gt': [ 4.03 ] });
    expect(column5.number.min).to.equal(4.03);
    //age Number @is.eq(4) @is.ge(3.2) @is.gt(4.03)
    const column6 = Column.make('age', type, {
      'is.eq': [ 4 ],
      'is.ge': [ 3.2 ],
      'is.gt': [ 4.03 ]
    });
    expect(column6.number.min).to.equal(3.2);
    //age Number @min(2) @is.eq(4) @is.ge(1.2) @is.gt(4.03)
    const column7 = Column.make('age', type, {
      min: [ 2 ],
      'is.eq': [ 4 ],
      'is.ge': [ 3.2 ],
      'is.gt': [ 4.03 ]
    });
    expect(column7.number.min).to.equal(2);
  });
  
  it('should calculate step length', () => {
    const type = { name: 'Number', required: true, multiple: false };
    //age Number
    const column1 = Column.make('age', type);
    expect(column1.number.step).to.equal(1);
    //age Number @step(0.5)
    const column2 = Column.make('age', type, { step: [ 0.5 ] });
    expect(column2.number.step).to.equal(0.5);
    //age Number @max(10)
    const column3 = Column.make('age', type, { max: [ 10 ] });
    expect(column3.number.step).to.equal(1);
    //age Number @is.eq(8)
    const column4 = Column.make('age', type, { 'is.eq': [ 8 ] });
    expect(column4.number.step).to.equal(1);
    //age Number @is.le(8.5) 
    const column5 = Column.make('age', type, { 'is.le': [ 8.5 ] });
    expect(column5.number.step).to.equal(0.1);
    //age Number @is.lt(7.04)
    const column6 = Column.make('age', type, { 'is.lt': [ 7.04 ] });
    expect(column6.number.step).to.equal(0.01);
    //age Number @min(2)
    const column7 = Column.make('age', type, { min: [ 2 ] });
    expect(column7.number.step).to.equal(1);
    //age Number @is.eq(4)
    const column8 = Column.make('age', type, { 'is.eq': [ 4 ] });
    expect(column8.number.step).to.equal(1);
    //age Number @is.ge(3.2)
    const column9 = Column.make('age', type, { 'is.ge': [ 3.2 ] });
    expect(column9.number.step).to.equal(0.1);
    //age Number @is.gt(4.03)
    const column10 = Column.make('age', type, { 'is.gt': [ 4.03 ] });
    expect(column10.number.step).to.equal(0.01);
    //age Number @is.eq(8) @is.le(8.5) @is.lt(7.04)
    const column11 = Column.make('age', type, {
      'is.eq': [ 8 ],
      'is.le': [ 8.5 ],
      'is.lt': [ 7.04 ]
    });
    expect(column11.number.step).to.equal(0.01);
    //age Number @max(10) @is.eq(8) @is.le(18.5) @is.lt(7.04)
    const column12 = Column.make('age', type, {
      max: [ 10 ],
      'is.eq': [ 8 ],
      'is.le': [ 18.5 ],
      'is.lt': [ 7.04 ]
    });
    expect(column12.number.step).to.equal(0.01);
    //age Number @is.eq(4) @is.ge(1.2) @is.gt(4.03)
    const column13 = Column.make('age', type, {
      'is.eq': [ 4 ],
      'is.ge': [ 1.2 ],
      'is.gt': [ 4.03 ]
    });
    expect(column13.number.step).to.equal(0.01);
    //age Number @min(2) @is.eq(4) @is.ge(1.2) @is.gt(4.03)
    const column14 = Column.make('age', type, {
      min: [ 2 ],
      'is.eq': [ 4 ],
      'is.ge': [ 1.2 ],
      'is.gt': [ 4.03 ]
    });
    expect(column14.number.step).to.equal(0.01);    
    //age Number @is.eq(8) @is.le(8.5) @is.lt(7.04) @is.ge(3.2) @is.gt(4.03)
    const column15 = Column.make('age', type, {
      'is.eq': [ 8 ],
      'is.le': [ 8.5 ],
      'is.lt': [ 7.04 ],
      'is.ge': [ 3.2 ],
      'is.gt': [ 4.03 ]
    });
    expect(column15.number.step).to.equal(0.01);
  });
});

describe('schema/column/ColumnRuntime', () => {
  it('should assert value based on type', async () => {
    //age Number
    const number = Column.make('age', { 
      name: 'Number', 
      required: true, 
      multiple: false 
    });
    expect(number.runtime.assert(25)).to.be.null;
    expect(number.runtime.assert(-5)).to.be.null;
    expect(number.runtime.assert(0)).to.be.null;
    expect(typeof number.runtime.assert(NaN)).to.equal('string');
    expect(typeof number.runtime.assert('hello')).to.equal('string');
    expect(typeof number.runtime.assert(null)).to.equal('string');
    expect(typeof number.runtime.assert(undefined)).to.equal('string');
    //name String
    const string = Column.make('name', { 
      name: 'String', 
      required: true, 
      multiple: false 
    });
    expect(string.runtime.assert('hello')).to.be.null;
    expect(string.runtime.assert('')).to.be.null;
    expect(typeof string.runtime.assert(25)).to.equal('string');
    expect(typeof string.runtime.assert(null)).to.equal('string');
    expect(typeof string.runtime.assert(undefined)).to.equal('string');
    //active Boolean
    const boolean = Column.make('active', { 
      name: 'Boolean', 
      required: true, 
      multiple: false 
    });
    expect(boolean.runtime.assert(true)).to.be.null;
    expect(boolean.runtime.assert(false)).to.be.null;
    expect(typeof boolean.runtime.assert(1)).to.equal('string');
    expect(typeof boolean.runtime.assert(0)).to.equal('string');
    expect(typeof boolean.runtime.assert('true')).to.equal('string');
    expect(typeof boolean.runtime.assert(null)).to.equal('string');
    expect(typeof boolean.runtime.assert(undefined)).to.equal('string');
    //createdAt Datetime
    const datetime = Column.make('createdAt', {
      name: 'Datetime',
      required: true,
      multiple: false
    });
    expect(datetime.runtime.assert(new Date())).to.be.null;
    expect(datetime.runtime.assert('2024-01-01T00:00:00Z')).to.be.null;
    expect(datetime.runtime.assert(1234567890)).to.be.null;
    expect(typeof datetime.runtime.assert('invalid date')).to.equal('string');
    expect(typeof datetime.runtime.assert(null)).to.equal('string');
    expect(typeof datetime.runtime.assert(undefined)).to.equal('string');
    //data Object
    const object = Column.make('data', {
      name: 'Object',
      required: true,
      multiple: false
    });
    expect(object.runtime.assert({ key: 'value' })).to.be.null;
    expect(object.runtime.assert({})).to.be.null;
    expect(typeof object.runtime.assert('not an object')).to.equal('string');
    expect(typeof object.runtime.assert(12345)).to.equal('string');
    expect(typeof object.runtime.assert(null)).to.equal('string');
    expect(typeof object.runtime.assert(undefined)).to.equal('string');
  });

  it('should assert value based on assertions', async () => {
    const typeString = { name: 'String', required: true, multiple: false };
    const typeNumber = { name: 'Number', required: true, multiple: false };
    const typeDate = { name: 'Date', required: true, multiple: false };
    // Cases we need to cover:
    // @is.required
    const required = Column.make('name', typeString, { 'is.required': true });
    expect(required.runtime.assert('John')).to.be.null;
    expect(required.runtime.assert('')).to.be.null;
    expect(typeof required.runtime.assert(undefined)).to.equal('string');
    expect(typeof required.runtime.assert(null)).to.equal('string');
    // @is.notempty
    const notEmpty = Column.make('name', typeString, { 'is.notempty': true });
    expect(notEmpty.runtime.assert('John')).to.be.null;
    expect(typeof notEmpty.runtime.assert('')).to.equal('string');
    // @is.eq
    const eq = Column.make('name', typeString, { 'is.eq': [ 'John' ] });
    expect(eq.runtime.assert('John')).to.be.null;
    expect(typeof eq.runtime.assert('Jane')).to.equal('string');
    // @is.ne
    const ne = Column.make('name', typeString, { 'is.ne': [ 'John' ] });
    expect(ne.runtime.assert('Jane')).to.be.null;
    expect(typeof ne.runtime.assert('John')).to.equal('string');
    // @is.option("John" "Jane")
    const option = Column.make('name', typeString, { 'is.option': [ [ 'John', 'Jane' ] ] });
    expect(option.runtime.assert('John')).to.be.null;
    expect(option.runtime.assert('Jane')).to.be.null;
    expect(typeof option.runtime.assert('Doe')).to.equal('string');
    // @is.regex("^[A-Z]+$")
    const regex = Column.make('name', typeString, { 'is.regex': [ '^[A-Z]+$' ] });
    expect(regex.runtime.assert('JOHN')).to.be.null;
    expect(typeof regex.runtime.assert('John')).to.equal('string');
    // @is.date
    const date = Column.make('createdAt', typeDate, { 'is.date': true });
    expect(date.runtime.assert(new Date())).to.be.null;
    expect(date.runtime.assert('2024-01-01')).to.be.null;
    expect(typeof date.runtime.assert('invalid date')).to.equal('string');
    // @is.future
    const future = Column.make('eventDate', typeDate, { 'is.future': true });
    expect(future.runtime.assert(new Date(Date.now() + 10000))).to.be.null;
    expect(typeof future.runtime.assert(new Date(Date.now() - 10000))).to.equal('string');
    // @is.past
    const past = Column.make('birthDate', typeDate, { 'is.past': true });
    expect(past.runtime.assert(new Date(Date.now() - 10000))).to.be.null;
    expect(typeof past.runtime.assert(new Date(Date.now() + 10000))).to.equal('string');
    // @is.present
    const present = Column.make('meetingDate', typeDate, { 'is.present': true });
    expect(present.runtime.assert(new Date())).to.be.null;
    expect(typeof present.runtime.assert(new Date(Date.now() + 10000))).to.equal('string');
    expect(typeof present.runtime.assert(new Date(Date.now() - 10000))).to.equal('string');
    // @is.gt(10)
    const gt = Column.make('age', typeNumber, { 'is.gt': [ 10 ] });
    expect(gt.runtime.assert(15)).to.be.null;
    expect(typeof gt.runtime.assert(5)).to.equal('string');
    // @is.ge(10)
    const ge = Column.make('age', typeNumber, { 'is.ge': [ 10 ] });
    expect(ge.runtime.assert(10)).to.be.null;
    expect(ge.runtime.assert(15)).to.be.null;
    expect(typeof ge.runtime.assert(5)).to.equal('string');
    // @is.lt(10)
    const lt = Column.make('age', typeNumber, { 'is.lt': [ 10 ] });
    expect(lt.runtime.assert(5)).to.be.null;
    expect(typeof lt.runtime.assert(15)).to.equal('string');
    // @is.le(10)
    const le = Column.make('age', typeNumber, { 'is.le': [ 10 ] });
    expect(le.runtime.assert(10)).to.be.null;
    expect(le.runtime.assert(5)).to.be.null;
    expect(typeof le.runtime.assert(15)).to.equal('string');
    // @is.ceq(10)
    const ceq = Column.make('bio', typeString, { 'is.ceq': [ 10 ] });
    expect(ceq.runtime.assert('abcdefghij')).to.be.null;
    expect(typeof ceq.runtime.assert('abc')).to.equal('string');
    expect(typeof ceq.runtime.assert('abcdefghijklmno')).to.equal('string');
    // @is.cgt(10)
    const cgt = Column.make('bio', typeString, { 'is.cgt': [ 10 ] });
    expect(cgt.runtime.assert('abcdefghijk')).to.be.null;
    expect(typeof cgt.runtime.assert('abc')).to.equal('string');
    expect(typeof cgt.runtime.assert('abcdefghij')).to.equal('string');
    // @is.cge(10)
    const cge = Column.make('bio', typeString, { 'is.cge': [ 10 ] });
    expect(cge.runtime.assert('abcdefghij')).to.be.null;
    expect(cge.runtime.assert('abcdefghijk')).to.be.null;
    expect(typeof cge.runtime.assert('abc')).to.equal('string');
    // @is.clt(10)
    const clt = Column.make('bio', typeString, { 'is.clt': [ 10 ] });
    expect(clt.runtime.assert('abc')).to.be.null;
    expect(typeof clt.runtime.assert('abcdefghijk')).to.equal('string');
    expect(typeof clt.runtime.assert('abcdefghij')).to.equal('string');
    // @is.cle(10)
    const cle = Column.make('bio', typeString, { 'is.cle': [ 10 ] });
    expect(cle.runtime.assert('abc')).to.be.null;
    expect(cle.runtime.assert('abcdefghij')).to.be.null;
    expect(typeof cle.runtime.assert('abcdefghijk')).to.equal('string');
    // @is.weq(10)
    const weq = Column.make('bio', typeString, { 'is.weq': [ 10 ] });
    expect(weq.runtime.assert('one 2 three 4 five 6 seven 8 nine 10')).to.be.null;
    expect(typeof weq.runtime.assert('one 2 three')).to.equal('string');
    expect(typeof weq.runtime.assert('one 2 three 4 five 6 seven 8 nine 10 eleven')).to.equal('string');
    // @is.wgt(10)
    const wgt = Column.make('bio', typeString, { 'is.wgt': [ 10 ] });
    expect(wgt.runtime.assert('one 2 three 4 five 6 seven 8 nine 10 eleven')).to.be.null;
    expect(typeof wgt.runtime.assert('one 2 three')).to.equal('string');
    expect(typeof wgt.runtime.assert('one 2 three 4 five 6 seven 8 nine 10')).to.equal('string');
    // @is.wge(10)
    const wge = Column.make('bio', typeString, { 'is.wge': [ 10 ] });
    expect(wge.runtime.assert('one 2 three 4 five 6 seven 8 nine 10')).to.be.null;
    expect(wge.runtime.assert('one 2 three 4 five 6 seven 8 nine 10 eleven')).to.be.null;
    expect(typeof wge.runtime.assert('one 2 three')).to.equal('string');
    // @is.wlt(10)
    const wlt = Column.make('bio', typeString, { 'is.wlt': [ 10 ] });
    expect(wlt.runtime.assert('one 2 three')).to.be.null;
    expect(typeof wlt.runtime.assert('one 2 three 4 five 6 seven 8 nine 10 eleven')).to.equal('string');
    expect(typeof wlt.runtime.assert('one 2 three 4 five 6 seven 8 nine 10')).to.equal('string');
    // @is.wle(10)
    const wle = Column.make('bio', typeString, { 'is.wle': [ 10 ] });
    expect(wle.runtime.assert('one 2 three')).to.be.null;
    expect(wle.runtime.assert('one 2 three 4 five 6 seven 8 nine 10')).to.be.null;
    expect(typeof wle.runtime.assert('one 2 three 4 five 6 seven 8 nine 10 eleven')).to.equal('string');
    // @is.cc
    const cc = Column.make('card', typeString, { 'is.cc': true });
    expect(cc.runtime.assert('4111111111111111')).to.be.null;
    expect(typeof cc.runtime.assert('1234567890123456')).to.equal('string');
    // @is.color
    const color = Column.make('color', typeString, { 'is.color': true });
    expect(color.runtime.assert('#FF5733')).to.be.null;
    expect(typeof color.runtime.assert('not-a-color')).to.equal('string');
    // @is.email
    const email = Column.make('email', typeString, { 'is.email': true });
    expect(email.runtime.assert('test@example.com')).to.be.null;
    expect(typeof email.runtime.assert('not-an-email')).to.equal('string');
    // @is.hex
    const hex = Column.make('color', typeString, { 'is.hex': true });
    expect(hex.runtime.assert('a3f4c2')).to.be.null;
    expect(typeof hex.runtime.assert('nothex')).to.equal('string');
    // @is.price
    const price = Column.make('srp', typeNumber, { 'is.price': true });
    expect(price.runtime.assert(10)).to.be.null;
    expect(price.runtime.assert(10.01)).to.be.null;
    expect(price.runtime.assert(0.99)).to.be.null;
    expect(price.runtime.assert(-10.55)).to.be.null;
    expect(typeof price.runtime.assert(10.1)).to.equal('string');
    expect(typeof price.runtime.assert(10.002)).to.equal('string');
    // @is.url
    const url = Column.make('url', typeString, { 'is.url': true });
    expect(url.runtime.assert('https://www.example.com')).to.be.null;
    expect(typeof url.runtime.assert('not-a-url')).to.equal('string');
    // @is.unique
  });

  it('should serialize string values', async () => {
    //string
    const stringColumn = Column.make('name', {
      name: 'String',
      required: true,
      multiple: false
    });
    // string to string
    const strToStr = stringColumn.runtime.serialize('John Doe');
    expect(strToStr).to.equal('John Doe');
    // number to string
    const numToStr = stringColumn.runtime.serialize(42);
    expect(numToStr).to.equal('42');
    // date to string
    const date = new Date('2024-01-01T12:00:00Z');
    const dateToStr = stringColumn.runtime.serialize(date);
    expect(typeof dateToStr).to.equal('string');
    // boolean to string
    const boolToStr = stringColumn.runtime.serialize(true);
    expect(boolToStr).to.equal('true');
    // object to string
    const obj = { key: 'value' };
    const objToStr = stringColumn.runtime.serialize(obj);
    expect(objToStr).to.equal(JSON.stringify(obj));
  });

  it('should serialize date values', async () => {
    //date
    const dateColumn = Column.make('createdAt', {
      name: 'Datetime',
      required: true,
      multiple: false
    });
    const dateStr = '2024-01-01T12:00:00Z';
    const date = new Date(dateStr);
    const timestamp = date.getTime();
    // date to date
    const dateToDate = dateColumn.runtime.serialize(date);
    expect(dateToDate).to.equal(date);
    // date to string
    const dateToStr = dateColumn.runtime.serialize(date, true) as string;
    expect(typeof dateToStr).to.equal('string');
    // date string to date
    const strToDate = dateColumn.runtime.serialize(dateStr) as Date;
    expect(strToDate instanceof Date).to.be.true;
    // date string to date string
    const strToStr = dateColumn.runtime.serialize(dateStr, true) as string;
    expect(typeof strToStr).to.equal('string');
    // number timestamp to date
    const timeToDate = dateColumn.runtime.serialize(timestamp) as Date;
    expect(timeToDate instanceof Date).to.be.true;
    // number timestamp to date string
    const timeToStr = dateColumn.runtime.serialize(timestamp, true) as string;
    expect(typeof timeToStr).to.equal('string');
  });

  it('should serialize number values', async () => {
    //number
    const numberColumn = Column.make('age', {
      name: 'Number',
      required: true,
      multiple: false
    });
    // number to number
    const numToNum = numberColumn.runtime.serialize(25);
    expect(numToNum).to.equal(25);
    // boolean to number
    const boolToNum = numberColumn.runtime.serialize(true);
    expect(boolToNum).to.equal(1);
    // string to number
    const strToNum = numberColumn.runtime.serialize('42');
    expect(strToNum).to.equal(42);
  });

  it('should serialize boolean values', async () => {
    //boolean
    const booleanColumn = Column.make('active', {
      name: 'Boolean',
      required: true,
      multiple: false
    });
    // boolean to boolean
    const boolToBool = booleanColumn.runtime.serialize(false);
    expect(boolToBool).to.equal(false);
    // number to boolean
    const numToBool = booleanColumn.runtime.serialize(1);
    expect(numToBool).to.equal(true);
    // string to boolean
    const strToBool = booleanColumn.runtime.serialize('1');
    expect(strToBool).to.equal(true);
    const strToBool2 = booleanColumn.runtime.serialize('true');
    expect(strToBool2).to.equal(true);
    const strToBool3 = booleanColumn.runtime.serialize('0');
    expect(strToBool3).to.equal(false);
    const strToBool4 = booleanColumn.runtime.serialize('false');
    expect(strToBool4).to.equal(false);
    // boolean to number
    const boolToNum = booleanColumn.runtime.serialize(false, true);
    expect(boolToNum).to.equal(0);
    // number to number
    const numToNum = booleanColumn.runtime.serialize(0, true);
    expect(numToNum).to.equal(0);
    // string to number
    const strToNum = booleanColumn.runtime.serialize('1', true);
    expect(strToNum).to.equal(1);
    const strToNum2 = booleanColumn.runtime.serialize('true', true);
    expect(strToNum2).to.equal(1);
  });

  it('should serialize object values', async () => {
    //object
    const objectColumn = Column.make('data', {
      name: 'Object',
      required: true,
      multiple: false
    });
    const obj = { key: 'value', count: 10 };
    // object to object
    const objToObj = objectColumn.runtime.serialize(obj);
    expect(objToObj).to.deep.equal(obj);
    // object to string
    const objToStr = objectColumn.runtime.serialize(obj, true) as string;
    expect(typeof objToStr).to.equal('string');
    expect(JSON.parse(objToStr)).to.deep.equal(obj);
    // string to object
    const strToObj = objectColumn.runtime.serialize('{"key":"value","count":10}') as Record<string, any>;
    expect(strToObj).to.deep.equal(obj);
    // string to string
    const strToStr = objectColumn.runtime.serialize('{"key":"value","count":10}', true) as string;
    expect(typeof strToStr).to.equal('string');
    expect(JSON.parse(strToStr)).to.deep.equal(obj);
  });

  it('should unserialize string values', async () => {
    //string
    const stringColumn = Column.make('name', {
      name: 'String',
      required: true,
      multiple: false
    });
    // string to string
    const strToStr = stringColumn.runtime.unserialize('John Doe') as string;
    expect(typeof strToStr).to.equal('string');
    // number to string
    const numToStr = stringColumn.runtime.unserialize(42) as string;
    expect(typeof numToStr).to.equal('string');
    // date to string
    const date = new Date('2024-01-01T12:00:00Z');
    const dateToStr = stringColumn.runtime.unserialize(date) as string;
    expect(typeof dateToStr).to.equal('string');
    // boolean to string
    const boolToStr = stringColumn.runtime.unserialize(true) as string;
    expect(typeof boolToStr).to.equal('string');
    // object to string
    const obj = { key: 'value' };
    const objToStr = stringColumn.runtime.unserialize(obj) as string;
    expect(typeof objToStr).to.equal('string');
  });
  
  it('should unserialize date values', async () => {
    //date
    const dateColumn = Column.make('createdAt', {
      name: 'Datetime',
      required: true,
      multiple: false
    });
    const dateStr = '2024-01-01T12:00:00Z';
    const dateObj = new Date(dateStr);
    const timestamp = dateObj.getTime();
    
    // date to date
    const dateToDate = dateColumn.runtime.unserialize(dateStr) as Date;
    expect(dateToDate instanceof Date).to.be.true;
    // string to date
    const strToDate = dateColumn.runtime.unserialize(dateStr) as Date;
    expect(strToDate instanceof Date).to.be.true;
    // number to date
    const numToDate = dateColumn.runtime.unserialize(timestamp) as Date;
    expect(numToDate instanceof Date).to.be.true;
    // date to string
    const dateToStr = dateColumn.runtime.unserialize(dateObj, true) as string;
    expect(typeof dateToStr).to.equal('string');
    // string to string
    const strToStr = dateColumn.runtime.unserialize(dateStr, true) as string;
    expect(typeof strToStr).to.equal('string');
    // number to string
    const numToStr = dateColumn.runtime.unserialize(timestamp, true) as string;
    expect(typeof numToStr).to.equal('string');
  });

  it('should unserialize number values', async () => {
    //number
    const numberColumn = Column.make('age', {
      name: 'Number',
      required: true,
      multiple: false
    });
    // number to number
    const numToNum = numberColumn.runtime.unserialize(25) as number;
    expect(typeof numToNum).to.equal('number');
    // boolean to number
    const boolToNum = numberColumn.runtime.unserialize(true) as number;
    expect(typeof boolToNum).to.equal('number');
    // string to number
    const strToNum = numberColumn.runtime.unserialize('42') as number;
    expect(typeof strToNum).to.equal('number');
  });

  it('should unserialize boolean values', async () => {
    //boolean
    const booleanColumn = Column.make('active', {
      name: 'Boolean',
      required: true,
      multiple: false
    });
    // boolean to boolean
    const boolToBool = booleanColumn.runtime.unserialize(false) as boolean;
    expect(typeof boolToBool).to.equal('boolean');
    // number to boolean
    const numToBool = booleanColumn.runtime.unserialize(1) as boolean;
    expect(typeof numToBool).to.equal('boolean');
    // string to boolean
    const strToBool = booleanColumn.runtime.unserialize('1') as boolean;
    expect(typeof strToBool).to.equal('boolean');
    const strToBool2 = booleanColumn.runtime.unserialize('true') as boolean;
    expect(typeof strToBool2).to.equal('boolean');
    const strToBool3 = booleanColumn.runtime.unserialize('0') as boolean;
    expect(typeof strToBool3).to.equal('boolean');
    const strToBool4 = booleanColumn.runtime.unserialize('false') as boolean;
    expect(typeof strToBool4).to.equal('boolean');
  });

  it('should unserialize object values', async () => {
    //object
    const objectColumn = Column.make('data', {
      name: 'Object',
      required: true,
      multiple: false
    });
    const obj = { key: 'value', count: 10 };
    const objStr = JSON.stringify(obj);
    // object to object
    const objToObj = objectColumn.runtime.unserialize(obj) as Record<string, any>;
    expect(typeof objToObj).to.equal('object');
    expect(objToObj).to.deep.equal(obj);
    // string to object
    const strToObj = objectColumn.runtime.unserialize(objStr) as Record<string, any>;
    expect(typeof strToObj).to.equal('object');
    expect(strToObj).to.deep.equal(obj);
  });
  
  it('should determine default value', async () => {
    //name String @default("John Doe")
    const name = Column.make('name', {
      name: 'String',
      required: true,
      multiple: false
    }, {
      default: [ 'John Doe' ]
    });
    expect(name.runtime.defaultValue()).to.equal('John Doe');
    //age Number @default(25)
    const age = Column.make('age', {
      name: 'Number',
      required: true,
      multiple: false
    }, {
      default: [ 25 ]
    });
    expect(age.runtime.defaultValue()).to.equal(25);
    //active Boolean @default(true)
    const active = Column.make('active', {
      name: 'Boolean',
      required: true,
      multiple: false
    }, {
      default: [ true ]
    });
    expect(active.runtime.defaultValue()).to.equal(true);
    //createdAt Datetime @default("now()")
    const created = Column.make('createdAt', {
      name: 'Datetime',
      required: true,
      multiple: false
    }, {
      default: [ 'now()' ]
    });
    const now = new Date();
    const createdAt = created.runtime.defaultValue() as Date;
    expect(createdAt instanceof Date).to.be.true;
    expect(createdAt.getTime()).to.be.closeTo(now.getTime(), 1000);
    //data Object @default({"key":"value"})
    const data = Column.make('data', {
      name: 'Object',
      required: true,
      multiple: false
    }, {
      default: [ { key: 'value' } ]
    });
    expect(data.runtime.defaultValue()).to.deep.equal({ key: 'value' });
    //tags String[] @default(["tag1","tag2"])
    const tags = Column.make('tags', {
      name: 'String',
      required: true,
      multiple: true
    }, {
      default: [ [ 'tag1', 'tag2' ] ]
    });
    expect(tags.runtime.defaultValue()).to.deep.equal([ 'tag1', 'tag2' ]);
    //token String default("cuid()")
    const token = Column.make('token', {
      name: 'String',
      required: true,
      multiple: false
    }, {
      default: [ 'cuid()' ]
    });
    const tokenValue = token.runtime.defaultValue() as string;
    expect(typeof tokenValue).to.equal('string');
    expect(tokenValue.length).to.be.greaterThan(5);
    //id String default("nanoid()")
    const id = Column.make('id', {
      name: 'String',
      required: true,
      multiple: false
    }, {
      default: [ 'nanoid()' ]
    });
    const idValue = id.runtime.defaultValue() as string;
    expect(typeof idValue).to.equal('string');
    expect(idValue.length).to.be.greaterThan(5);
  });
});

describe('schema/column/ColumnValue', () => {
  it('should get flags', async () => {
    const column = Column.make('name', {
      name: 'String',
      required: true,
      multiple: false
    }, {
      default: [ 'default name' ],
      encrypted: true,
      generated: true,
      hashed: true
    });
    expect(column.value.default).to.equal('default name');
    expect(column.value.encrypted).to.be.true;
    expect(column.value.generated).to.be.true;
    expect(column.value.hashed).to.be.true;
  });
});

describe('schema/column/Columns', () => {
  it('should make columns with serialized data', async () => {
    const columns = Columns.make([
      {
        name: 'name',
        type: { name: 'String', required: true, multiple: false },
        attributes: { 'list.text': [], 'is.required': true },
      },
      {
        name: 'age',
        type: { name: 'Number', required: true, multiple: false },
        attributes: { 'list.text': [], 'is.required': true },
      }
    ]);
    expect(columns.size).to.equal(2);
    expect(columns.get('name')).to.exist;
    expect(columns.get('age')).to.exist;
  });

  it('should set/get parent', async () => {
    const parent = await mockFieldset('User');
    const columns = new Columns();
    expect(columns.hasParent).to.be.false;
    columns.parent = parent;
    expect(columns.parent).to.equal(parent);
    expect(Columns.make([], parent).parent).to.equal(parent);
  });

  it('should add column', async () => {
    const columns = new Columns();
    columns.add(Column.make('name', { name: 'String', required: true, multiple: false }));
    expect(columns.size).to.equal(1);
    expect(columns.get('name')).to.exist;
    columns.add('age', { 
      name: 'Number', 
      required: true, 
      multiple: false 
    }, { 
      'is.required': true 
    });
  });

  it('should filter column', async () => {
    const columns = Columns.make([
      {
        name: 'name',
        type: { name: 'String', required: true, multiple: false },
        attributes: { 'list.text': [], 'is.required': true },
      },
      {
        name: 'age',
        type: { name: 'Number', required: true, multiple: false },
        attributes: { 'list.text': [], 'is.required': true },
      }
    ]);
    const filtered = columns.filter(column => column.type.name === 'String');
    expect(filtered.size).to.equal(1);
    expect(filtered.get('name')).to.exist;
  });
});