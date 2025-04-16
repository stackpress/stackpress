//stackpress
import type { Method, UnknownNest } from '@stackpress/lib/types';
import type { Data } from '@stackpress/idea-parser/types';
//language
import type { LanguageConfig } from '../language/types.js';
//views
import type { ViewConfig, BrandConfig } from '../view/types.js';
//session
import type { Profile } from '../session/types.js';

export type ApiConfigProps = {
  language: LanguageConfig,
  view: ViewConfig,
  brand: BrandConfig,
  api: ApiConfig
}

export type ApiOauthInputProps = {
  client_id: string,
  scope: string,
  state: string,
  redirect_uri: string
}

export type ApiOauthFormProps = {
  appName: string,
  revert: string,
  items: {
    id: string;
    icon: string | undefined;
    name: string;
    description: string;
  }[]
}

export type Scopes = Record<string, {
  icon?: string, 
  name: string, 
  description: string
}>;

export type ApiEndpoint = {
  name?: string,
  description?: string,
  example?: string,
  method: Method,
  route: string,
  type: 'public'|'app'|'session',
  scopes?: string[],
  event: string,
  priority?: number,
  data: Record<string, Data>
};

export type ApiScope = {
  icon?: string,
  name: string,
  description: string
};

export type ApiWebhook = {
  //ie. auth-signin
  event: string, 
  //ie. http://localhost:3000/api/webhook
  uri: string,
  method: Method,
  validity: UnknownNest,
  data: UnknownNest
};

//ie. ctx.config<ApiConfig>('api');
export type ApiConfig = {
  //when sessions expire. this is used with `session.created` column
  //defaults to never expire
  expires?: number,
  //calls out external urls when specified events happen
  webhooks?: ApiWebhook[],
  //scopes are used to limit access to certain endpoints
  //when creating the default application, make sure the 
  //following scopes are included, or you will get a 401 
  //error when trying to access the endpoints
  scopes?: Record<string, ApiScope>,
  endpoints?: ApiEndpoint[]
};

//--------------------------------------------------------------------//
// Model Types

export type Application = {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  secret: string;
  scopes: string[];
  active: boolean;
  expires: Date;
  created: Date;
  updated: Date;
};
export type ApplicationExtended = Application;
export type ApplicationInput = {
  id?: string;
  name: string;
  logo?: string;
  website?: string;
  secret?: string;
  scopes?: string[];
  active?: boolean;
  expires: Date;
  created?: Date;
  updated?: Date;
};

export type Session = {
  id: string;
  applicationId: string;
  profileId: string;
  secret: string;
  scopes: string[];
  active: boolean;
  expires: Date;
  created: Date;
  updated: Date;
};
export type SessionExtended = Session & {
  application: Application;
  profile: Profile;
};
export type SessionInput = {
  id?: string;
  applicationId: string;
  profileId: string;
  secret?: string;
  scopes?: string[];
  active?: boolean;
  expires: Date;
  created?: Date;
  updated?: Date;
};