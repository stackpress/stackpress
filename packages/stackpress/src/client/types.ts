//modules
import type { UnknownNest } from '@stackpress/lib/types';
import type { 
  CookieOptions  as CookieConfig 
} from '@stackpress/ingest/types';
//stackpress
import type { AdminConfig } from 'stackpress-admin/types';
import type { ApiConfig } from 'stackpress-api/types';
import type { CsrfPlugin } from 'stackpress-csrf/types';
import type { EmailConfig } from 'stackpress-email/types';
import type { 
  LanguageConfig, 
  LanguagePlugin 
} from 'stackpress-language/types';
import type {
  ClientProjectProps,
  ClientPluginProps,
  ClientFieldset,
  ClientConfig
} from 'stackpress-schema/types';
import type { 
  ServerConfig, 
  TerminalConfig, 
  TerminalPlugin 
} from 'stackpress-server/types';
import type { 
  AuthConfig, 
  SessionConfig, 
  SessionPlugin 
} from 'stackpress-session/types';
import type { 
  GenericEventHandler,
  GenericEvents,
  GenericListener,
  GenericAdminRouter,
  DatabaseConfig, 
  DatabasePlugin,
  ClientModel,
  ClientScripts,
  ClientPlugin,
  Client
} from 'stackpress-sql/types';
import type { 
  ViewConfig, 
  BrandConfig, 
  ViewPlugin 
} from 'stackpress-view/types';

export type {
  //parts of the client plugin
  ClientProjectProps,
  ClientPluginProps,
  ClientFieldset,
  GenericEventHandler,
  GenericEvents,
  GenericListener,
  GenericAdminRouter,
  ClientModel,
  ClientScripts,
  //parts of the config
  AdminConfig,
  ApiConfig,
  AuthConfig,
  BrandConfig,
  ClientConfig,
  CookieConfig,
  DatabaseConfig,
  EmailConfig,
  LanguageConfig,
  ServerConfig,
  SessionConfig,
  TerminalConfig,
  ViewConfig,
  //plugins
  ClientPlugin,
  CsrfPlugin,
  DatabasePlugin,
  LanguagePlugin,
  SessionPlugin,
  TerminalPlugin,
  ViewPlugin,
  //type of generated client
  Client
};

//final config options
export type Config = UnknownNest & {
  brand?: BrandConfig,
  terminal?: TerminalConfig,
  server?: ServerConfig,
  client?: ClientConfig,
  cookie?: CookieConfig,
  admin?: AdminConfig,
  api?: ApiConfig,
  email?: EmailConfig,
  language?: LanguageConfig,
  database?: DatabaseConfig,
  view?: ViewConfig,
  auth?: AuthConfig,
  session?: SessionConfig
};