//tests
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { 
  mockProject,
  mockServer,
  mockTerminal, 
  mockTransformer,
  paths,
  savePrettyProject,
  importGenerated
} from '../helpers.js';
//src
import type SchemaInterface from '../../src/schema/interface/SchemaInterface.js';
import generate from '../../src/schema/transform/index.js';

type AddressSchemaClass = {
  new (seed?: string): SchemaInterface<{
    street: string,
    city: string,
    state: string | null,
    zipCode: string,
    country: string
  }>
};
  
describe('schema/transform', () => {
  before(async () => {
    //mock server
    const server = mockServer(paths.tests);
    const terminal = mockTerminal([], server);
    const transformer = mockTransformer();
    const schema = await transformer.schema();
    const config = schema.plugin?.[paths.cwd + '/src/schema/transform'] || {};  
    const project = mockProject(paths.tsconfig, paths.client);
    const directory = project.createDirectory(paths.client);
    //run generate
    await generate({
      config,
      schema,
      transformer,
      cwd: paths.tests,
      terminal,
      project,
      directory
    });
    await savePrettyProject(project);
  });

  it('should assert address values', async () => {
    const AddressSchema = await importGenerated<{
      new (seed?: string): SchemaInterface<{
        street: string;
        city: string;
        state: string | null;
        zipCode: string;
        country: string;
      }>
    }>('./out/client/Address/AddressSchema.ts', true);

    const schema = new AddressSchema();

    const valid = schema.assert({
      street: '123 Main St',
      city: 'Anytown',
      state: null,
      zipCode: '12345',
      country: 'USA'
    });
    expect(valid).to.be.null;

    const invalid = schema.assert({
      street: '',
      city: 'Anytown',
      state: null,
      zipCode: '12345',
      country: 'USA'
    })!;
    expect(invalid).to.be.an('object');
    expect(invalid.street).to.equal('Value is required.');
  });

  it('should assert serialize values', async () => {
    const AddressSchema = await importGenerated<{
      new (seed?: string): SchemaInterface<{
        street: string;
        city: string;
        state: string | null;
        zipCode: string;
        country: string;
      }>
    }>('./out/client/Address/AddressSchema.ts', true);

    const schema = new AddressSchema();

    const serialized = schema.serialize({
      street: '123 Main St',
      city: 'Anytown',
      state: null,
      zipCode: 12345,
      country: 'USA'
    });
    expect(serialized).to.deep.equal({
      street: '123 Main St',
      city: 'Anytown',
      state: null,
      zipCode: '12345',
      country: 'USA'
    });
  });

  it('should assert unserialize values', async () => {
    const AddressSchema = await importGenerated<AddressSchemaClass>(
      './out/client/Address/AddressSchema.ts', 
      true
    );

    const schema = new AddressSchema();

    const unserialized = schema.serialize({
      street: '123 Main St',
      city: 'Anytown',
      state: null,
      zipCode: 12345,
      country: 'USA'
    });
    expect(unserialized).to.deep.equal({
      street: '123 Main St',
      city: 'Anytown',
      state: null,
      zipCode: '12345',
      country: 'USA'
    });
  });
});