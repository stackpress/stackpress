import type { Method } from '@stackpress/lib/dist/types';
import type { Data } from '@stackpress/idea-parser/dist/types';
import type { Profile } from '../user/types';

//--------------------------------------------------------------------//
// Server Types
export type Endpoint = {
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
export type Scope = {
  icon?: string,
  name: string,
  description: string
};
export type APIConfig = { 
  api: {
    expires: number,
    scopes: Record<string, Scope>,
    endpoints: Endpoint[]
  }
};

//--------------------------------------------------------------------//
// API Types

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