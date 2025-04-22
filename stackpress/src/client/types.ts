//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser/types';
import type Server from '@stackpress/ingest/Server';
import type Engine from '@stackpress/inquire/Engine';
import type Create from '@stackpress/inquire/Create';
//spec
import type Fieldset from '../schema/spec/Fieldset.js';
import type Model from '../schema/spec/Model.js';
import type Registry from '../schema/Registry.js';
//sql
import type { Actions } from '../sql/actions/index.js';

//ie. ctx.config<ClientConfig>('client');
export type ClientConfig = {
  //where to store the generated client code
  //used by `stackpress/terminal` (for generating client)
  build?: string,
  //whether to compiler client in `js` or `ts`
  //used by client generator
  //defaults to `js`
  lang?: string,
  //used by `stackpress/client` to `import()` 
  //the generated client code to memory
  module: string,
  //name of client package. Used in the generated package.json
  package: string,
  //where to store serialized idea json files for historical 
  //purposes. Revisions are used in conjuction with push and 
  //migrate to determine the changes between each idea change.
  //wont save if not provided (cant create migrations without this)
  revisions?: string,
  //what tsconfig file to base the typescript compiler on
  //used by `stackpress/terminal` (for generating client)
  tsconfig: string
};

//ie. ctx.plugin<ClientPlugin>('client');
export type ClientPlugin<
  M extends Record<string, unknown> = {},
  F extends Record<string, unknown> = {}
> = {
  config: SchemaConfig,
  registry: Registry,
  fieldset: Record<string, F & { config: Fieldset }>,
  model: Record<string, M & { 
    config: Model,
    events: Server,
    schema: Create,
    actions: (engine: Engine, seed?: string) => Actions<M>,
    admin(server: Server<any, any, any>): void
  }>
};