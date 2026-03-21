//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mockFieldset, mockSchema } from '../helpers.js';

import FieldsetName from '../../src/schema/fieldset/FieldsetName.js';
import FieldsetAssertion from '../../src/schema/fieldset/FieldsetAssertion.js';
import FieldsetComponent from '../../src/schema/fieldset/FieldsetComponent.js';
import FieldsetDocument from '../../src/schema/fieldset/FieldsetDocument.js';
import FieldsetType from '../../src/schema/fieldset/FieldsetType.js';
import FieldsetValue from '../../src/schema/fieldset/FieldsetValue.js';
import Fieldset from '../../src/schema/Fieldset.js';

describe('schema/fieldset/Fieldset', () => {
  it('should make fieldset', () => {
    const fieldset = Fieldset.make('Test');
    expect(fieldset).to.be.instanceOf(Fieldset);
    expect(fieldset.name).to.be.instanceOf(FieldsetName);
    expect(fieldset.assertion).to.be.instanceOf(FieldsetAssertion);
    expect(fieldset.component).to.be.instanceOf(FieldsetComponent);
    expect(fieldset.document).to.be.instanceOf(FieldsetDocument);
    expect(fieldset.type).to.be.instanceOf(FieldsetType);
    expect(fieldset.value).to.be.instanceOf(FieldsetValue);
  });

  it('should set/get schema', async () => {
    const schema = await mockSchema();
    const fieldset = new Fieldset('Test');
    fieldset.schema = schema;
    expect(fieldset.schema).to.equal(schema);
  });

  it('should add attribute', () => {
    const fieldset = new Fieldset('Test');
    fieldset.addAttribute('icon', [ 'test-icon' ]);
    expect(fieldset.attribute('icon')?.value).to.equal('test-icon');
  });

  it('should add column', () => {
    const fieldset = new Fieldset('Test');
    fieldset.addColumn('name', { name: 'String', required: true, multiple: false });
    expect(fieldset.column('name')).to.exist;
    expect(fieldset.column('name')?.type.name).to.equal('String');
  });
});

describe('schema/fieldset/FieldsetName', () => {
  it('should manipulate name', async () => {
    const fieldset = new Fieldset('UserComment');
    expect(fieldset.name.camelCase).to.equal('userComment');
    expect(fieldset.name.dashCase).to.equal('user-comment');
    expect(fieldset.name.lowerCase).to.equal('usercomment');
    expect(fieldset.name.titleCase).to.equal('UserComment');
  });
});

describe('schema/fieldset/FieldsetAssertion', () => {
  it('should get all columns with assertion attributes', async () => {
    const fieldset = new Fieldset('Test');
    fieldset.addColumn('name', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, {
      'is.cge': [ 10 ]
    });
    fieldset.addColumn('age', { 
      name: 'Integer', 
      required: true, 
      multiple: false 
    }, {
      'is.le': [ 100 ]
    });

    const columns = fieldset.assertion.columns;
    expect(columns.size).to.equal(2);
  });

  it('should determine each column assertions', async () => {
    const fieldset = new Fieldset('Test');
    fieldset.addColumn('name', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, {
      'is.cge': [ 10 ]
    });
    fieldset.addColumn('age', { 
      name: 'Integer', 
      required: false, 
      multiple: false 
    }, {
      'is.le': [ 100 ]
    });
    const assertions = fieldset.assertion.assertions;
    expect(assertions.size).to.equal(2);
    expect(assertions.get('name')).to.exist;
    expect(assertions.get('age')).to.exist;
  });
});

describe('schema/fieldset/FieldsetComponent', () => {
  it('should get filter fields', async () => {
    const fieldset = new Fieldset('Test');
    fieldset.addColumn('name', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, {
      'filter.text': []
    });
    fieldset.addColumn('age', { 
      name: 'Integer', 
      required: false, 
      multiple: false 
    });
    const components = fieldset.component;
    const filters = components.filterFields;
    expect(filters.size).to.equal(1);
  });

  it('should get form fields', async () => {
    const fieldset = new Fieldset('Test');
    fieldset.addColumn('name', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, {
      'field.mask': []
    });
    fieldset.addColumn('age', { 
      name: 'Integer', 
      required: false, 
      multiple: false 
    });
    const components = fieldset.component;
    const forms = components.formFields;
    expect(forms.size).to.equal(1);
  });

  it('should get span fields', async () => {
    const fieldset = new Fieldset('Test');
    fieldset.addColumn('createdAt', { 
      name: 'Date', 
      required: true, 
      multiple: false 
    }, {
      'span.datetime': []
    });
    fieldset.addColumn('age', { 
      name: 'Integer', 
      required: false, 
      multiple: false 
    });
    const components = fieldset.component;
    const spans = components.spanFields;
    expect(spans.size).to.equal(1);
  });

  it('should get list formats', async () => {
    const fieldset = new Fieldset('Test');
    fieldset.addColumn('email', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, {
      'list.email': []
    });
    fieldset.addColumn('age', { 
      name: 'Integer', 
      required: false, 
      multiple: false 
    });
    const components = fieldset.component;
    const lists = components.listFormats;
    expect(lists.size).to.equal(1);
  });

  it('should get view formats', async () => {
    const fieldset = new Fieldset('Test');
    fieldset.addColumn('email', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, {
      'view.email': []
    });
    fieldset.addColumn('age', { 
      name: 'Integer', 
      required: false, 
      multiple: false 
    });
    const components = fieldset.component;
    const views = components.viewFormats;
    expect(views.size).to.equal(1);
  });
});

describe('schema/fieldset/FieldsetDocument', () => {
  it('should get descriptions and examples', () => {
    const fieldset = new Fieldset('Test');
    fieldset.addColumn('name', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, {
      'description': [ 'The name of the person' ],
      'examples': [ 'John Doe', 'Jane Smith' ]
    });
    fieldset.addColumn('age', { 
      name: 'Integer', 
      required: false, 
      multiple: false 
    }, {
      'description': [ 'The age of the person' ]
    });

    const descriptions = fieldset.document.descriptions
      .map(column => column.document.description!)
      .toObject() as Record<string, string>;
    const examples = fieldset.document.examples
      .map(column => column.document.examples!)
      .toObject() as Record<string, string[]>;

    expect(Object.keys(descriptions).length).to.equal(2);
    expect(descriptions['name']).to.equal('The name of the person');
    expect(descriptions['age']).to.equal('The age of the person');

    expect(Object.keys(examples).length).to.equal(1);
    expect(examples['name']).to.include('John Doe');
    expect(examples['name']).to.include('Jane Smith');
  });
});

describe('schema/fieldset/FieldsetType', () => {
  it('should get enum columns', async () => {
    const fieldset = await mockFieldset('Test');
    fieldset.addColumn('role', { 
      name: 'Role', 
      required: true, 
      multiple: false
    });
    expect(fieldset.type.enums.size).to.equal(1);
  });

  it('should get fieldset columns', async () => {
    const fieldset = await mockFieldset('Test');
    fieldset.addColumn('address', { 
      name: 'Address', 
      required: true, 
      multiple: false
    });
    expect(fieldset.type.fieldsets.size).to.equal(1);
  });
});

describe('schema/fieldset/FieldsetValue', () => {
  it('should get encrypted columns', async () => {
    const fieldset = new Fieldset('Test');
    fieldset.addColumn('name', { 
      name: 'String', 
      required: true, 
      multiple: false
    }, {
      'encrypted': [ true ]
    });
    fieldset.addColumn('age', {
      name: 'Integer',
      required: false,
      multiple: false
    });
    const encrypted = fieldset.value.encrypted;
    expect(encrypted.size).to.equal(1);
    expect(encrypted.get('name')?.name.toString()).to.equal('name');
  });

  it('should get columns with defaults', async () => {
    const fieldset = new Fieldset('Test');
    fieldset.addColumn('name', { 
      name: 'String', 
      required: true, 
      multiple: false
    }, {
      'default': [ 'John Doe' ]
    });
    fieldset.addColumn('age', {
      name: 'Integer',
      required: false,
      multiple: false
    }, {
      'default': [ 30 ]
    });
    fieldset.addColumn('active', {
      name: 'Boolean',
      required: true,
      multiple: false
    }, {
      'default': [ true ]
    });
    fieldset.addColumn('createdAt', {
      name: 'Datetime',
      required: true,
      multiple: false
    }, {
      'default': [ 'now()' ]
    });
    fieldset.addColumn('id', {
      name: 'String',
      required: true,
      multiple: false
    }, {
      'default': [ 'nanoid()' ]
    });
    fieldset.addColumn('token', {
      name: 'String',
      required: true,
      multiple: false
    }, {
      'default': [ 'cuid()' ]
    });
    const defaults = fieldset.value.defaults;
    expect(defaults.size).to.equal(6);
  });
});