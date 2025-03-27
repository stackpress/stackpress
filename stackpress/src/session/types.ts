//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
//session
import type Session from '../session/Session';

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
  token: string
};

export type SessionConstructor = { 
  get access(): SessionPermissionList;
  get seed(): string;
  get key(): string;
  set expires(value: number);
  configure(key: string, seed: string, access: SessionPermissionList): void;
  authorize(req: Request, res: Response, permits?: SessionPermission[]): boolean;
  create(data: SessionData): string;
  token(req: Request): string | null;
  load(token: string | Request): Session;
  new (): Session
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
  username?: string,
  email?: string,
  phone?: string,
  secret: string
};

export type SigninType = 'username' | 'email' | 'phone';

//ie. ctx.config<AuthConfig>('auth')
export type AuthConfig = {
  name: string,
  logo: string,
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
  key: string,
  seed: string,
  access: SessionPermissionList
};

//ie. ctx.plugin<AuthPlugin>('auth')
export type SessionPlugin = SessionConstructor;