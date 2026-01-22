//tests
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mockFieldset } from '../helpers.js';

describe('schema/spec/Fieldset', () => {
  it('should return icon', async () => {
    const fieldset = await mockFieldset('User');
    expect(fieldset.icon).to.be.undefined;

    const actual = await mockFieldset('User', '@icon("user")');
    expect(actual.icon).to.equal('user');
  });

  it('should return labels', async () => {
    const fieldset = await mockFieldset('User');
    expect(fieldset.labels).to.be.empty;

    const actual = await mockFieldset('User', '@labels("User" "Users")');
    expect(actual.labels[0]).to.equal('User');
    expect(actual.labels[1]).to.equal('Users');
    expect(actual.singular).to.equal('User');
    expect(actual.plural).to.equal('Users');
  });

  it('should return display', async () => {
    const fieldset = await mockFieldset('User');
    expect(fieldset.display).to.be.undefined;

    const actual = await mockFieldset('User', '@display("User: {{name}}")');
    expect(actual.display).to.equal('User: {{name}}');
  });

  it('should manipulate name', async () => {
    const fieldset = await mockFieldset('UserComment');
    expect(fieldset.camelCase).to.equal('userComment');
    expect(fieldset.dashCase).to.equal('user-comment');
    expect(fieldset.lowerCase).to.equal('usercomment');
    expect(fieldset.titleCase).to.equal('UserComment');
  });

  it('should collect columns assertions', async () => {
    const fieldset = await mockFieldset('User', '', [
      'name String @is.required @is.notempty',
      'age Integer @is.gte(18)',
      'email String @is.required @is.email'
    ]);
    expect(fieldset.assertions.length).to.equal(3);
  });

  it('should collect encrypted columns', async () => {
    const fieldset = await mockFieldset('User', '', [
      'name String',
      'ssn String @encrypted',
      'creditCard String @encrypted'
    ]);
    expect(fieldset.encrypted.length).to.equal(2);
  });

  it('should collect columns with defaults', async () => {
    const fieldset = await mockFieldset('User', '', [
      'name String @default("John Doe")',
      'age Integer @default(30)',
      'createdAt Date @default("now()")',
      'updatedAt Date @default("now()")',
      'ssn String @encrypted'
    ]);
    const defaults = fieldset.defaults;
    expect(Object.keys(defaults).length).to.equal(4);
    expect(defaults['name']).to.equal('John Doe');
    expect(defaults['age']).to.equal(30);
  });

  it('should collect columns with descriptions', async () => {
    const fieldset = await mockFieldset('User', '', [
      'name String @description("Full name of the user")',
      'age Integer',
      'email String @description("Email address")'
    ]);
    const descriptions = fieldset.descriptions;
    expect(Object.keys(descriptions).length).to.equal(2);
    expect(descriptions['name']).to.equal('Full name of the user');
    expect(descriptions['email']).to.equal('Email address');
  });

  it('should collect columns with examples', async () => {
    const fieldset = await mockFieldset('User', '', [
      'name String @examples("John Doe")',
      'age Integer',
      'email String @examples("john.doe@example.com")'
    ]);
    const examples = fieldset.examples;
    expect(Object.keys(examples).length).to.equal(2);
    expect(examples['name']).to.include('John Doe');
    expect(examples['email']).to.include('john.doe@example.com');
  });

  it('should collect enum columns', async () => {
    const fieldset = await mockFieldset('User', '', [ 'role Role', 'name String' ]);
    expect(fieldset.enums.length).to.equal(1);
  });

  it('should collect field columns', async () => {
    const fieldset = await mockFieldset('User', '', [
      'name String',
      'age Integer',
      'email String @field.mask'
    ]);
    expect(fieldset.fields.length).to.equal(1);

    const nofields = await mockFieldset('User', '', [
      'name String',
      'age Integer',
      'email String'
    ]);
    expect(nofields.fields.length).to.equal(0);
  });

  it('should collect filter columns', async () => {
    const fieldset = await mockFieldset('User', '', [
      'name String @filter.text',
      'age Integer',
      'email String @filter.mask'
    ]);
    //console.log(fieldset.filters)
    expect(fieldset.filters.length).to.equal(2);
  });

  it('should collect span columns', async () => {
    const fieldset = await mockFieldset('User', '', [
      'name String',
      'age Integer @span.number',
      'email String',
      'created Date @span.datetime'
    ]);
    expect(fieldset.spans.length).to.equal(2);
  });

  it('should collect list columns', async () => {
    const fieldset = await mockFieldset('User', '', [
      'name String',
      'age Integer @list.number',
      'email String @list.email',
      'password String'
    ]);
    expect(fieldset.lists.length).to.equal(2);
  });

  it('should collect view columns', async () => {
    const fieldset = await mockFieldset('User', '', [
      'name String',
      'age Integer @view.number',
      'email String @view.email',
      'password String'
    ]);
    expect(fieldset.views.length).to.equal(2);
  });
});
