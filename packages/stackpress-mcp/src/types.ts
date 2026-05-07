//modules
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type Server from '@stackpress/ingest/Server';
//stackpress-schema
import type { ClientFieldset, SchemaConfig } from 'stackpress-schema/types';
//stackpress-sql
import type { ClientModel, ClientScripts } from 'stackpress-sql/types';

export type McpConfig = {
  name?: string,
  version?: string
  port?: number
};


export type McpPlugin = McpServer;

export type Client<
  //exact map of models
  //ex. { profile: ClientModel<Profile, ProfileExtended, { name: NameSchema, ...}, { auth: {} }> }
  M extends Record<string, ClientModel> = Record<string, ClientModel>,
  //exact map of fieldsets
  F extends Record<string, ClientFieldset> = Record<string, ClientFieldset>
> = {
  config: SchemaConfig,
  model: M,
  fieldset: F,
  scripts: ClientScripts,
  tools: (server: McpServer, ctx: Server) => void
};

//ie. ctx.plugin<ClientPlugin>('client');
export type ClientPlugin<
  //exact map of models
  //ex. { profile: ClientModel<Profile, ProfileExtended, { name: NameSchema, ...}, { auth: {} }> }
  M extends Record<string, ClientModel> = Record<string, ClientModel>,
  //exact map of fieldsets
  F extends Record<string, ClientFieldset> = Record<string, ClientFieldset>
> = (nullable?: boolean) => Promise<Client<M, F>>;