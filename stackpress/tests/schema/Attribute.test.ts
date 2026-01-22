//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
//src
import Attribute from '../../src/schema/spec/Attribute.js';

describe('schema/spec/Attribute', () => {
  it('should factory instantiate', async () => {
    const actual = Attribute.get('label', [ 'Username' ]);
    expect(actual).to.be.instanceOf(Attribute);
  });

  it('should return the args', async () => {
    const label = Attribute.get('label', [ 'Username' ])!;
    expect(label.args).to.include('Username');
    const active = Attribute.get('active', true)!;
    expect(active.args).to.be.empty;
  });
  
  it('should return component token', async () => {
    const actual = Attribute.get('field.input', [])!;
    expect(actual.component.name).to.equal('field.input');
    expect(actual.component.component).to.equal('Input');
    expect(actual.component.import.from).to.equal('frui/form/Input');
    expect(actual.component.import.default).to.be.true;
  });
  
  it('should describe the attribute', async () => {
    const label = Attribute.get('label', [ 'Username' ])!;
    expect(label.description).to.equal(
      'A label that will be shown to represent this '
      + 'column instead of the actual column name.'
    );
    const active = Attribute.get('active', true)!;
    expect(active.description).to.be.equal(
      'A flag that represents the active field. Active fields '
      + 'are changed when deleting or restoring a row, as an '
      + 'alternative to actually deleting the row in the database.'
    );
  });
  
  it('should be enabled', async () => {
    const label = Attribute.get('label', [ 'Username' ])!;
    expect(label.enabled).to.be.false;
    const active = Attribute.get('active', true)!;
    expect(active.enabled).to.be.true;
  });
  
  it('should know which attributes are for models and columns', async () => {
    const icon = Attribute.get('icon', [ 'user' ])!;
    expect(icon.forModel).to.be.true;
    const active = Attribute.get('active', true)!;
    expect(active.forColumn).to.be.true;
  });
  
  it('should know which attributes are admin specific', async () => {
    const icon = Attribute.get('admin.icon', [ 'user' ])!;
    expect(icon.isAdmin).to.be.true;
    const active = Attribute.get('admin.active', true)!;
    expect(active.isAdmin).to.be.true;
  });
  
  it('should know which attributes are assertions', async () => {
    const required = Attribute.get('is.required', [])!;
    expect(required.isAssertion).to.be.true;
    const gt = Attribute.get('is.gt', [ 4 ])!;
    expect(gt.isAssertion).to.be.true;
    const active = Attribute.get('active', true)!;
    expect(active.isAssertion).to.be.false;
  });
  
  it('should know which attributes are components', async () => {
    const field = Attribute.get('field.input', [])!;
    expect(field.isComponent).to.be.true;

    const filter = Attribute.get('filter.input', [])!;
    expect(filter.isComponent).to.be.true;
    
    const span = Attribute.get('span.input', [])!;
    expect(span.isComponent).to.be.true;
    
    const list = Attribute.get('list.text', [])!;
    expect(list.isComponent).to.be.true;
    
    const view = Attribute.get('view.text', [])!;
    expect(view.isComponent).to.be.true;
    
    const gt = Attribute.get('is.gt', [ 4 ])!;
    expect(gt.isComponent).to.be.false;
    
    const active = Attribute.get('active', true)!;
    expect(active.isComponent).to.be.false;
  });

  it('should know which attributes are flags', async () => {
    const active = Attribute.get('active', true)!;
    expect(active.isFlag).to.be.true;

    const field = Attribute.get('field.input', [])!;
    expect(field.isFlag).to.be.false;

    const filter = Attribute.get('filter.input', [])!;
    expect(filter.isFlag).to.be.false;
    
    const span = Attribute.get('span.input', [])!;
    expect(span.isFlag).to.be.false;
    
    const list = Attribute.get('list.text', [])!;
    expect(list.isFlag).to.be.false;
    
    const view = Attribute.get('view.text', [])!;
    expect(view.isFlag).to.be.false;
    
    const gt = Attribute.get('is.gt', [ 4 ])!;
    expect(gt.isFlag).to.be.false;
  });

  it('should know which attributes are methods', async () => {
    const active = Attribute.get('active', true)!;
    expect(active.isMethod).to.be.false;
    
    const icon = Attribute.get('icon', [ 'user' ])!;
    expect(icon.isMethod).to.be.true;

    const field = Attribute.get('field.input', [])!;
    expect(field.isMethod).to.be.true;

    const filter = Attribute.get('filter.input', [])!;
    expect(filter.isMethod).to.be.true;
    
    const span = Attribute.get('span.input', [])!;
    expect(span.isMethod).to.be.true;
    
    const list = Attribute.get('list.text', [])!;
    expect(list.isMethod).to.be.true;
    
    const view = Attribute.get('view.text', [])!;
    expect(view.isMethod).to.be.true;
    
    const gt = Attribute.get('is.gt', [ 4 ])!;
    expect(gt.isMethod).to.be.true;
  });

  it('should determine kinds of attributes', async () => {
    const icon = Attribute.get('icon', [ 'user' ])!;
    expect(icon.isList).to.be.false;
    expect(icon.isView).to.be.false;
    expect(icon.isField).to.be.false;
    expect(icon.isFilter).to.be.false;
    expect(icon.isSpan).to.be.false;
    expect(icon.kind).to.equal('model');

    const active = Attribute.get('active', true)!;
    expect(active.isList).to.be.false;
    expect(active.isView).to.be.false;
    expect(active.isField).to.be.false;
    expect(active.isFilter).to.be.false;
    expect(active.isSpan).to.be.false;
    expect(active.kind).to.equal('column');

    const field = Attribute.get('field.input', [])!;
    expect(field.isList).to.be.false;
    expect(field.isView).to.be.false;
    expect(field.isField).to.be.true;
    expect(field.isFilter).to.be.false;
    expect(field.isSpan).to.be.false;
    expect(field.kind).to.equal('field');
    
    const filter = Attribute.get('filter.input', [])!;
    expect(filter.isList).to.be.false;
    expect(filter.isView).to.be.false;
    expect(filter.isField).to.be.false;
    expect(filter.isFilter).to.be.true;
    expect(filter.isSpan).to.be.false;
    expect(filter.kind).to.equal('filter');
    
    const span = Attribute.get('span.input', [])!;
    expect(span.isList).to.be.false;
    expect(span.isView).to.be.false;
    expect(span.isField).to.be.false;
    expect(span.isFilter).to.be.false;
    expect(span.isSpan).to.be.true;
    expect(span.kind).to.equal('span');
    
    const list = Attribute.get('list.text', [])!;
    expect(list.isList).to.be.true;
    expect(list.isView).to.be.false;
    expect(list.isField).to.be.false;
    expect(list.isFilter).to.be.false;
    expect(list.isSpan).to.be.false;
    expect(list.kind).to.equal('list');
    
    const view = Attribute.get('view.text', [])!;
    expect(view.isList).to.be.false;
    expect(view.isView).to.be.true;
    expect(view.isField).to.be.false;
    expect(view.isFilter).to.be.false;
    expect(view.isSpan).to.be.false;
    expect(view.kind).to.equal('view');
  });

  it('should return the raw value', async () => {
    const icon = Attribute.get('icon', [ 'user' ])!;
    expect(icon.raw).to.include('user');

    const active = Attribute.get('active', true)!;
    expect(active.raw).to.be.true;

    const field = Attribute.get('field.input', [])!;
    expect(field.raw).to.be.empty;
  });

  it('should return the key and name', async () => {
    const icon = Attribute.get('icon', [ 'user' ])!;
    expect(icon.key).to.equal('icon');
    expect(icon.name).to.equal('icon');

    const active = Attribute.get('active', true)!;
    expect(active.key).to.equal('active');
    expect(active.name).to.equal('active');

    const field = Attribute.get('field.input', [])!;
    expect(field.key).to.equal('input');
    expect(field.name).to.equal('field.input');
  });

  it('should return the types', async () => {
    const icon = Attribute.get('icon', [ 'user' ])!;
    expect(icon.types).to.include('method');

    const active = Attribute.get('active', true)!;
    expect(active.types).to.include('flag');

    const required = Attribute.get('is.required', [])!;
    expect(required.types).to.include('flag');
    expect(required.types).to.include('method');

    const field = Attribute.get('field.input', [])!;
    expect(field.types).to.include('component');
  });

  it('should return the value', async () => {
    const icon = Attribute.get('icon', [ 'user' ])!;
    expect(icon.value).to.include('user');

    const active = Attribute.get('active', true)!;
    expect(active.value).to.be.true;

    const field = Attribute.get('field.input', [])!;
    expect(field.value).to.be.undefined;
  });
});
