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
  lang: string,
  revisions: string,
  build: string,
  module: string,
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