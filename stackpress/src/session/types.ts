//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
//language
import { LanguageConfig } from '../language/types.js';
//view
import { ViewConfig, BrandConfig } from '../view/types.js';
//session
import type SessionServer from './Session.js';

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

export type SignupInput = {
  name: string,
  type?: string,
  username?: string,
  email?: string,
  phone?: string,
  secret: string,
  roles: string[]
};

export type SigninInput = {
  type?: SigninType,
  username?: string,
  email?: string,
  phone?: string,
  secret: string
};

export type SigninType = 'username' | 'email' | 'phone';

export type AuthConfigProps = {
  language: LanguageConfig,
  view: ViewConfig,
  brand: BrandConfig,
  auth: AuthConfig
};

//ie. ctx.config<AuthConfig>('auth')
export type AuthConfig = {
  base?: string,
  '2fa': {},
  captcha: {},
  roles: string[],
  username: boolean,
  email: boolean,
  phone: boolean,
  password: {
    min: number,
    max: number,
    upper: boolean,
    lower: boolean,
    number: boolean,
    special: boolean
  }
};

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

//ie. ctx.plugin<AuthPlugin>('auth')
export type SessionPlugin = SessionServerConstructor;

//--------------------------------------------------------------------//
// Model Types

export type Profile = {
  id: string;
  name: string;
  image?: string;
  type: string;
  roles: string[];
  tags: string[];
  references?: Record<string, string | number | boolean | null>;
  active: boolean;
  created: Date;
  updated: Date;
};
export type ProfileExtended = Profile;
export type ProfileInput = {
  id?: string;
  name: string;
  image?: string;
  type?: string;
  roles: string[];
  tags?: string[];
  references?: Record<string, string | number | boolean | null>;
  active?: boolean;
  created?: Date;
  updated?: Date;
};

export type Auth = {
  id: string;
  profileId: string;
  type: string;
  nonce: string;
  token: string;
  secret: string;
  verified: boolean;
  consumed: Date;
  active: boolean;
  created: Date;
  updated: Date;
};
export type AuthExtended = Auth & {
  profile: Profile;
};
export type AuthInput = {
  id?: string;
  profileId: string;
  type?: string;
  token: string;
  secret: string;
  verified?: boolean;
  consumed?: Date;
  active?: boolean;
  created?: Date;
  updated?: Date;
};
export type ProfileAuth = Profile & { auth: Record<string, Partial<Auth>> };
