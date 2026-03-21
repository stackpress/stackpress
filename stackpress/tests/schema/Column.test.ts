//tests
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { mockFieldset, mockSchema } from '../helpers.js';

import type { AttributeDataAssertion } from '../../src/schema/types.js';
import Fieldset from '../../src/schema/Fieldset.js';
import ColumnName from '../../src/schema/column/ColumnName.js';
import ColumnType from '../../src/schema/column/ColumnType.js';
import ColumnAssertion from '../../src/schema/column/ColumnAssertion.js';
import ColumnComponent from '../../src/schema/column/ColumnComponent.js';
import ColumnDocument from '../../src/schema/column/ColumnDocument.js';
import ColumnNumber from '../../src/schema/column/ColumnNumber.js';
import ColumnValue from '../../src/schema/column/ColumnValue.js';
import Columns from '../../src/schema/column/Columns.js';
import Column from '../../src/schema/Column.js';

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
    const assertion = type.get<AttributeDataAssertion>('assertion');
    expect(assertion?.name).to.equal('string');
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