//modules
import type { Directory } from 'ts-morph';
//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser';
import type { PluginProps } from '@stackpress/idea-transformer';
import type { CookieOptions } from '@stackpress/ingest/dist/types';
//schema
import type Model from './schema/Model';
import type Fieldset from './schema/Fieldset';
import type Registry from './schema/Registry';
//local
import type InceptTerminal from './Terminal';

export type ProjectProps = {
  cli: InceptTerminal,
  project: Directory
};

export type PluginWithProject = PluginProps<ProjectProps>;

export type ServerConfig = {
  server: { 
    cwd: string, 
    mode: string, 
    port: number,
    build: string,
    bodySize: number
  },
  client: {
    lang: string,
    revisions: string,
    build: string,
    module: string,
    tsconfig: string
  },
  cookie: CookieOptions
};

export type ClientPlugin<
  M extends Record<string, unknown> = {},
  F extends Record<string, unknown> = {}
> = {
  config: SchemaConfig,
  registry: Registry,
  fieldset: Record<string, F & { config: Fieldset }>,
  model: Record<string, M & { config: Model }>
};