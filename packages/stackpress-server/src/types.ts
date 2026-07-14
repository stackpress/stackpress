//modules
import type { 
  ActionRouteProps, 
  ConfigMap, 
  PluginMap 
} from '@stackpress/ingest/types';
import type Server from '@stackpress/ingest/Server';
//stackpress-server
import type Terminal from './Terminal';

//ie. ctx.config<TerminalConfig>('terminal');
export type TerminalConfig = {
  //label for verbose output ($ [LABEL] doing something...)
  label?: string,
  //filepath of your main idea (schema.idea)
  idea?: string
};

//ie. ctx.plugin<TerminalPlugin>('terminal');
export type TerminalPlugin = Terminal;

//development-server watcher and restart policy
export type DevelopmentConfig = {
  //milliseconds to wait for related file changes before restarting
  debounce?: number,
  //file extensions that require a backend restart
  extensions?: string[],
  //additional paths or patterns that the watcher should ignore
  ignore?: (string|RegExp)[],
  //milliseconds to wait for the replacement server to become ready
  timeout?: number,
  //application paths to watch relative to server.cwd
  watch?: string[]
};

//ie. ctx.config<ServerConfig>('server');
export type ServerConfig = {
  //general location to put build files
  //not used by stackpress
  build?: string,
  //general use current working directory
  //used by `stackpress/scripts/build`
  //used by `stackpress/view`
  //defaults to `process.cwd()`
  cwd?: string,
  //production, development
  //used by `stackpress/view`
  //defaults to `production`
  mode?: string,
  //development-server watcher and restart policy
  develop?: DevelopmentConfig,
  //server host
  //not used by stackpress
  //defaults to `127.0.0.1`
  host?: string,
  //server port
  //not used by stackpress
  port?: number,
  //name of child process container
  //this is used on the development server
  //default: STACKPRESS_CHILD
  process?: string
};

//can be used in all event and route handlers
export type RouteProps<
  R = unknown, 
  S = unknown, 
  C extends ConfigMap = ConfigMap,
  P extends PluginMap = PluginMap
> = ActionRouteProps<R, S, Server<R, S, C, P>>;

export type {
  ConfigLoaderOptions,
  PluginLoaderOptions,
  ActionRouterArgs,
  ActionRouterMap,
  ActionRouterAction,
  ActionRouterListener,
  EntryRouterTaskItem,
  ImportRouterAction,
  ImportRouterTaskItem,
  ViewRouterTaskItem,
  ViewRouterEngine,
  ViewRouterRender,
  AnyRouterAction,
  ServerAction,
  ServerHandler,
  ServerGateway,
  ServerOptions,
  NodeServer, 
  NodeServerOptions,
  NodeRequest,
  NodeResponse,
  NodeOptResponse,
  IM, SR,
  HttpResponse,
  HttpRequest,
  HttpRouter,
  HttpServer,
  HttpServerOptions,
  HttpAction,
  WhatwgResponse,
  WhatwgRequest,
  WhatwgRouter,
  WhatwgServer,
  WhatwgServerOptions,
  WhatwgAction,
  Body
} from '@stackpress/ingest/types';
