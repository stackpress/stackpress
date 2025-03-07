//stackpress
import type { InkCompiler } from '@stackpress/ink/dist/types';
import type HttpServer from '@stackpress/ink-dev/dist/HttpServer';
//local
import type Router from './Router';

export type Renderer = (
  filePath: string, 
  props?: Record<string, unknown>
) => Promise<string>;

export type InkPlugin = {
  compiler: InkCompiler,
  refresh: HttpServer,
  render: Renderer,
  router: Router
};

export type TemplatePlugin = {
  render: Renderer
};

export type TemplateDevConfig = {
  buildRoute: string,
  socketRoute: string
};

export type TemplateEngineConfig = {
  brand: string,
  minify: boolean,
  clientPath?: string,
  serverPath?: string,
  manifestPath?: string,
  cwd: string,
  notemplate: string,
  dev: TemplateDevConfig
};

export type TemplateConfig = { 
  template: {
    engine: string,
    config: TemplateEngineConfig
  }
};