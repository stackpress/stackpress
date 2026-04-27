//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
//stackpress-session
import type SessionServer from './Session.js';

//--------------------------------------------------------------------//
// Config Types

//ie. ctx.config<SessionConfig>('session')
export type SessionConfig = {
  //name of the session cookie
  //defaults
  key?: string,
  //used to generate the session id
  seed: string,
  //route and event access white list (blacklisted by default)
  //mapped as role -> access entries[]
  access?: SessionPermissionList
};

//--------------------------------------------------------------------//
// Session Types

export type SessionRoute = { method: string, route: string };
export type SessionPermission = string | SessionRoute;
export type SessionPermissionList = Record<string, SessionPermission[]>;
export type SessionData = Record<string, any> & { 
  id: string, 
  name: string,
  image?: string,
  roles: string[]
};
export type SessionTokenData = SessionData & {
  token: string,
  permits: SessionPermission[]
};

export type SessionServerConstructor = { 
  get access(): SessionPermissionList,
  get seed(): string,
  get key(): string,
  set expires(value: number),
  configure(
    key: string, 
    seed: string, 
    access: SessionPermissionList
  ): void,
  authorize(
    req: Request, 
    res: Response, 
    permits?: SessionPermission[]
  ): Promise<boolean>,
  create(data: SessionData): Promise<string>,
  token(req: Request): string | null,
  load(token: string | Request): SessionServer,
  new (): SessionServer
};

//ie. ctx.plugin<AuthPlugin>('auth')
export type SessionPlugin = SessionServerConstructor;
