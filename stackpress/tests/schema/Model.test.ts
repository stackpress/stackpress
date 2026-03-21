//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mockSchema } from '../helpers.js';

import Model from '../../src/schema/Model.js';
import ModelStore from '../../src/schema/model/ModelStore.js';

describe('schema/model/Model', () => {
  it('should make model', async () => {
    const model = Model.make('Test');
    expect(model).to.be.instanceOf(Model);
    expect(model.store).to.be.instanceOf(ModelStore);
  });

  it('should add column', async () => {
    const model = new Model('Test');
    model.addColumn('name', { name: 'String', required: true, multiple: false });
    expect(model.column('name')).to.exist;
    expect(model.column('name')?.type.name).to.equal('String');
  }); 
});

describe('schema/model/ModelStore', () => {
  let model: Model;
  before(async () => {
    model = Model.make('User');
    model.columns.add('id', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, { id: true, sortable: true });
    model.columns.add('name', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, {
      active: true,
      searchable: true,
      sortable: true,
      unique: true,
      timestamp: true
    });
    model.columns.add('email', { 
      name: 'String', 
      required: true, 
      multiple: false 
    }, {
      searchable: true,
      'filter.input': [],
      'span.input': []
    });
  });

  it('should get active column', async () => {
    expect(model.store.active?.name.toString()).to.equal('name');
  });

  it('should get columns with foreign relationships', async () => {
    const schema = await mockSchema();
    const model = schema.models.get('KitchenSink')!;
    const columns = model.store.foreignRelationships;
    const relationships = columns.map(
      column => column.store.foreignRelationship
    );
    //console.log(columns, relationships)
    const basic = relationships.get('basic')!;
    expect(basic.foreign.model.name.toString()).to.equal('BasicModel');
    expect(basic.foreign.column.name.toString()).to.equal('sink');
    expect(basic.local.model.name.toString()).to.equal('KitchenSink');
    expect(basic.local.column.name.toString()).to.equal('basic');
  });

  it('should get columns with id', async () => {
    expect(model.store.ids.size).to.equal(1);
  });

  it('should get indexable columns', async () => {
    expect(model.store.indexables.size).to.equal(3);
  });

  it('should get columns with local relationships', async () => {
    const schema = await mockSchema();
    const model = schema.models.get('BasicModel')!;
    const columns = model.store.localRelationships;
    const relationships = columns.map(
      column => column.store.localRelationship
    );
    const basic = relationships.get('sink')!;
    expect(basic.foreign.model.name.toString()).to.equal('BasicModel');
    expect(basic.foreign.column.name.toString()).to.equal('sink');
    expect(basic.local.model.name.toString()).to.equal('KitchenSink');
    expect(basic.local.column.name.toString()).to.equal('basic');
  });

  it('should determine if model is restorable', async () => {
    expect(model.store.restorable).to.be.true;
  });

  it('should get query', async () => {
    const model = Model.make('Test', { query: [ '*', 'user.*' ] });
    expect(model.store.query).to.deep.equal([ '*', 'user.*' ]);
  });

  it('should get searchable columns', async () => {
    expect(model.store.searchables.size).to.equal(2);
  });

  it('should get sortable columns', async () => {
    expect(model.store.sortables.size).to.equal(2);
  });

  it('should get unique value columns', async () => {
    expect(model.store.uniques.size).to.equal(1);
  });

  it('should get timestamp columns', async () => {
    expect(model.store.timestamp?.name.toString()).to.equal('name');
  });
});
