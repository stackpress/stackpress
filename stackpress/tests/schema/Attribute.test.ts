//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
//src
import AttributeAssertion from '../../src/schema/attribute/AttributeAssertion.js';
import AttributeComponent from '../../src/schema/attribute/AttributeComponent.js';
import AttributeReference from '../../src/schema/attribute/AttributeReference.js';
import Attributes from '../../src/schema/attribute/Attributes.js';
import Attribute from '../../src/schema/Attribute.js';

describe('schema/Attribute', () => {
  it('should get args array', async () => {
    const actual = new Attribute('labels', [ 'User', 'Users' ]);
    expect(actual.args).to.deep.equal([ 'User', 'Users' ]);
  });

  it('should determine flag', async () => {
    const required = new Attribute('required', true);
    expect(required.isFlag).to.equal(true);
    const optional = new Attribute('required', false);
    expect(optional.isFlag).to.equal(true);
    expect(optional.enabled).to.equal(false);
    const active = new Attribute('active', []);
    //it's true because active is pre-defined as a flag attribute
    expect(active.isFlag).to.equal(true);
    const method = new Attribute('limit', [ 10 ]);
    expect(method.isFlag).to.equal(false);
  });

  it('should determine method', async () => {
    const method = new Attribute('limit', [ 10 ]);
    expect(method.isMethod).to.equal(true);
    const active = new Attribute('active', []);
    //it's false because active is pre-defined as a flag attribute
    expect(active.isMethod).to.equal(false);
  });

  it('should get first possible value', async () => {
    const required = new Attribute('required', true);
    expect(required.value).to.equal(true);
    const method = new Attribute('limit', [ 10, 20, 30 ]);
    expect(method.value).to.equal(10);
  });

  it('should load extensions', async () => {
    const actual = new Attribute('label', [ 'Username' ]);
    expect(actual.assertion).to.be.instanceOf(AttributeAssertion);
    expect(actual.component).to.be.instanceOf(AttributeComponent);
    expect(actual.reference).to.be.instanceOf(AttributeReference);
  });
});

describe('schema/attribute/AttributeAssertion', () => {
  it('should expose assertion definitions', async () => {
    const actual = new Attribute('is.required', []);
    expect(actual.assertion.defined).to.equal(true);
    expect(actual.assertion.definition!.name).to.equal('required');
  });
});

describe('schema/attribute/AttributeComponent', () => {
  it('should resolve component helpers', async () => {
    const field = new Attribute('field.input', []);
    expect(field.component.defined).to.equal(true);
    expect(field.component.kind).to.equal('field');
    expect(field.component.isFormField).to.equal(true);
    expect(field.component.definition?.name).to.equal('Input');

    const filter = new Attribute('filter.input', []);
    expect(filter.component.kind).to.equal('filter');
    expect(filter.component.isFilterField).to.equal(true);

    const list = new Attribute('list.text', []);
    expect(list.component.kind).to.equal('list');
    expect(list.component.isListFormat).to.equal(true);

    const span = new Attribute('span.text', []);
    expect(span.component.kind).to.equal('span');
    expect(span.component.isSpanField).to.equal(true);

    const view = new Attribute('view.text', []);
    expect(view.component.kind).to.equal('view');
    expect(view.component.isViewFormat).to.equal(true);
  });
});

describe('schema/attribute/AttributeReference', () => {
  it('should resolve reference metadata', async () => {
    const active = new Attribute('active', true);
    expect(active.reference.defined).to.equal(true);
    expect(active.reference.kind).to.equal('column');
    expect(active.reference.forColumn).to.equal(true);
    expect(active.reference.forSchema).to.equal(false);
    expect(active.reference.isFlag).to.equal(true);
    expect(active.reference.isMethod).to.equal(false);

    const labels = new Attribute('labels', [ 'User', 'Users' ]);
    expect(labels.reference.kind).to.equal('schema');
    expect(labels.reference.forSchema).to.equal(true);
    expect(labels.reference.forColumn).to.equal(false);
    expect(labels.reference.isFlag).to.equal(false);
    expect(labels.reference.isMethod).to.equal(true);
  });
});

describe('schema/attribute/Attributes', () => {
  it('should derive collections and values', async () => {
    const attributes = new Attributes([
      new Attribute('required', false),
      new Attribute('limit', [ 10 ])
    ]);

    expect(attributes.args.get('required')).to.deep.equal([]);
    expect(attributes.args.get('limit')).to.deep.equal([ 10 ]);
    expect(attributes.props.get('required')).to.equal(false);
    expect(attributes.props.get('limit')).to.equal(10);
    expect(attributes.flags.size).to.equal(1);
    expect(attributes.methods.size).to.equal(1);
    expect(attributes.disabled.size).to.equal(1);
  });

  it('should add and resolve attributes', async () => {
    const attributes = new Attributes();
    attributes.add('active', true);
    expect(attributes.enabled('active')).to.equal(true);

    const limit = new Attribute('limit', [ 10 ]);
    attributes.add(limit);
    expect(attributes.value<number>('limit')).to.equal(10);

    attributes.set('alias', new Attribute('custom', true));
    expect(attributes.get('alias')?.name).to.equal('custom');
  });
});
