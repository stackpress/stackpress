//modules
import type { Directory } from 'ts-morph';
import type { PluginProps } from '@stackpress/idea-transformer/types';
//stackpress
import type { UnknownNest } from '@stackpress/lib/types';
import type { CookieOptions } from '@stackpress/ingest/types';
//plugins
import type { ClientConfig } from '../client/types';
import type { ServerConfig } from '../server/types';
import type { ApiConfig } from '../api/types';
import type { AdminConfig } from '../admin/types';
import type { EmailConfig } from '../email/types';
import type { LanguageConfig } from '../language/types';
import type { DatabaseConfig } from '../sql/types';
import type { ViewConfig, BrandConfig } from '../view/types';
import type { AuthConfig, SessionConfig } from '../session/types';
import type InceptTerminal from '../terminal/Terminal';

export * from '../admin/types';
export * from '../api/types';
export * from '../client/types';
export * from '../language/types';
export * from '../schema/types';
export * from '../server/types';
export * from '../session/types';
export * from '../sql/types';
export * from '../view/types';

export type { 
  EnumConfig,
  ModelConfig,
  TypeConfig,
  PropConfig,
  PluginConfig,
  SchemaConfig
} from '@stackpress/idea-parser/types';

//--------------------------------------------------------------------//
// General Types

export type Scalar = string | number | boolean | null | undefined;
export type ExtendsType<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

//--------------------------------------------------------------------//
// Idea Types

export type IdeaProjectProps = {
  cli: InceptTerminal,
  project: Directory
};

export type IdeaPluginWithProject = PluginProps<IdeaProjectProps>;

//--------------------------------------------------------------------//
// Server Configuration Types

export type Config = UnknownNest & {
  brand?: BrandConfig,
  server: ServerConfig,
  client?: ClientConfig,
  cookie?: CookieOptions,
  admin?: AdminConfig,
  api?: ApiConfig,
  email?: EmailConfig,
  language?: LanguageConfig,
  database?: DatabaseConfig,
  view?: ViewConfig,
  auth?: AuthConfig,
  session?: SessionConfig
};