//modules
import { ScalarInput } from '@stackpress/lib/types';
//tests
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import {
  mockDatabaseEngine,
  mockProject,
  mockServer,
  mockTerminal, 
  mockTransformer,
  paths,
  savePrettyProject,
  importGenerated
} from '../helpers.js';
//src
import type StoreInterface from '../../src/sql/interface/StoreInterface.js';
import generateSchema from '../../src/schema/transform/index.js';
import generateSql from '../../src/sql/transform/index.js';

enum Role {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  USER = "USER",
};

type BasicModel = {
  title: string;
  description: string;
  price: number;
  age: number;
  height: number;
  active: boolean;
  publishAt: Date;
  showAt: Date;
  createdAt: Date;
  references: Record<string, ScalarInput>;
  data: Record<string, ScalarInput>;
  cache: Record<string, ScalarInput>;
  role: Role;
  address: {
    street: string,
    city: string,
    state: string | null,
    zipCode: string,
    country: string
  };
};

type BasicModelSchemaClass = {
  new (seed?: string): StoreInterface<BasicModel, BasicModel>
};

type User = {
  id: string;
  name: string;
};

type Network = {
  ownerId: string;
  memberId: string;
};

type NetworkExtended = Network & {
  owner: User;
  member: User;
};

type NetworkSchemaClass = {
  new (seed?: string): StoreInterface<Network, NetworkExtended>
};
  
describe('sql/transform', () => {
  before(async function() {
    this.timeout(10000);
    //mock server
    const server = mockServer(paths.tests);
    const terminal = mockTerminal([], server);
    const transformer = mockTransformer();
    const schema = await transformer.schema();
    const config = schema.plugin?.[paths.cwd + '/src/sql/transform'] || {};  
    const project = mockProject(paths.tsconfig, paths.client);
    const directory = project.createDirectory(paths.client);
    //run generate
    await generateSchema({
      config,
      schema,
      transformer,
      cwd: paths.tests,
      terminal,
      project,
      directory
    });
    await generateSql({
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

  it('should get basic model select query', async () => {
    const BasicModelStore = await importGenerated<BasicModelSchemaClass>(
      './out/client/BasicModel/BasicModelStore.ts', 
      true
    );

    const engine = mockDatabaseEngine();
    const store = new BasicModelStore();
    const select = store.select();

    expect(select.query(engine.dialect).query).to.equal('SELECT '
      + '"basic_model"."title" AS "title", '
      + '"basic_model"."description" AS "description", '
      + '"basic_model"."price" AS "price", '
      + '"basic_model"."age" AS "age", '
      + '"basic_model"."height" AS "height", '
      + '"basic_model"."active" AS "active", '
      + '"basic_model"."publish_at" AS "publish_at", '
      + '"basic_model"."show_at" AS "show_at", '
      + '"basic_model"."created_at" AS "created_at", '
      + '"basic_model"."references" AS "references", '
      + '"basic_model"."data" AS "data", '
      + '"basic_model"."cache" AS "cache", '
      + '"basic_model"."role" AS "role", '
      + '"basic_model"."address" AS "address" '
      + 'FROM "basic_model" '
      + 'LIMIT 50');
  });

  it('should get network select query', async () => {
    const NetworkStore = await importGenerated<NetworkSchemaClass>(
      './out/client/Network/NetworkStore.ts', 
      true
    );

    const engine = mockDatabaseEngine();
    const store = new NetworkStore();
    const select = store.select({ columns: [ '*', 'owner.*', 'member.*' ] });

    expect(select.query(engine.dialect).query).to.equal('SELECT '
      + '"network"."owner_id" AS "owner_id", '
      + '"network"."member_id" AS "member_id", '
      + '"owner"."id" AS "owner__id", '
      + '"owner"."name" AS "owner__name", '
      + '"member"."id" AS "member__id", '
      + '"member"."name" AS "member__name" '
      + 'FROM "network" '
      + 'INNER JOIN "user" AS "owner" ON ("network"."owner_id" = "owner"."id") '
      + 'INNER JOIN "user" AS "member" ON ("network"."member_id" = "member"."id") '
      + 'LIMIT 50'
    );
  });
});