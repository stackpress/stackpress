//stackpress
import type { InkCompiler } from '@stackpress/ink/dist/types';
import type HttpServer from '@stackpress/ink-dev/dist/HttpServer';
import type WhatwgServer from '@stackpress/ink-dev/dist/WhatwgServer';
import type { ViewRender } from '@stackpress/ingest/dist/types';

export type RefreshServers = {
  http: HttpServer,
  whatwg: WhatwgServer
};

export type TemplatePlugin = {
  compiler: InkCompiler,
  servers: RefreshServers,
  render: ViewRender
};

export type TemplateDevConfig = {
  mode: 'http'|'whatwg',
  buildRoute: string,
  socketRoute: string
};

export type TemplateEngineConfig = {
  brand: string,
  cwd: string,
  extname: string,
  minify: boolean,
  clientPath?: string,
  serverPath?: string,
  manifestPath?: string,
  notemplate: string,
  dev: TemplateDevConfig
};

export type TemplateConfig = { 
  template: TemplateEngineConfig
};