//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
//src
import Attributes from '../../src/schema/spec/Attributes.js';

describe('schema/spec/Attributes', () => {
  it('should act like map', async () => {
    const attributes = new Attributes([
      [ 'active', true ],
      [ 'is.gt', [ 4 ] ],
      [ 'admin.is.gt', [ 4 ] ],
      [ 'field.input', [] ],
      [ 'filter.input', [] ],
      [ 'span.input', [] ],
      [ 'admin.active', true ],
      [ 'list.text', [] ],
      [ 'view.text', [] ],
      [ 'admin.list.text', [] ]
    ]);
    expect(attributes.size).to.equal(10);
    expect(attributes.has('active')).to.be.true;
    expect(attributes.get('active')).to.be.true;
    expect(Array.from(attributes.keys())).to.include('active');
    expect(Array.from(attributes.values())).to.include(true);
    expect(Array.from(attributes.entries())[0][1]).to.equal(true);
    attributes.set('foo', [ 'bar' ]);
    expect(attributes.has('foo')).to.be.true;
    attributes.delete('foo')
    expect(attributes.has('foo')).to.be.false;
    attributes.clear()
    expect(attributes.has('active')).to.be.false;
  });

  it('should get attribute', async () => {
    const attributes = new Attributes([
      [ 'active', true ],
      [ 'is.gt', [ 4 ] ],
      [ 'admin.is.gt', [ 4 ] ],
      [ 'field.input', [] ],
      [ 'filter.input', [] ],
      [ 'span.input', [] ],
      [ 'admin.active', true ],
      [ 'list.text', [] ],
      [ 'view.text', [] ],
      [ 'admin.list.text', [] ],
      [ 'filter.text', []]
    ]);
    expect(attributes.attribute('active')?.value).to.equal(true);
    expect(attributes.attribute('is.gt')?.value).to.equal(4);
    expect(attributes.attribute('admin.is.gt')?.value).to.equal(4);
    expect(attributes.attribute('field.input')).to.not.be.null;
    expect(attributes.attribute('filter.input')).to.not.be.null;
    expect(attributes.attribute('span.input')).to.not.be.null;
    expect(attributes.attribute('admin.active')?.value).to.equal(true);
    expect(attributes.attribute('list.text')).to.not.be.null;
    expect(attributes.attribute('view.text')).to.not.be.null;
    expect(attributes.attribute('admin.list.text')).to.not.be.null;
    expect(attributes.attribute('filter.text')).to.not.be.null;
  });

  it('should get index', async () => {
    const attributes = new Attributes([
      [ 'active', true ],
      [ 'is.gt', [ 4 ] ],
      [ 'admin.is.gt', [ 4 ] ],
      [ 'field.input', [] ],
      [ 'filter.input', [] ],
      [ 'span.input', [] ],
      [ 'admin.active', true ],
      [ 'list.text', [] ],
      [ 'view.text', [] ],
      [ 'admin.list.text', [] ]
    ]);
    expect(attributes.index(0)?.value).to.equal(true);
    expect(attributes.index(2)?.value).to.equal(4);
    expect(attributes.index(100)).to.be.null;
  });
});
