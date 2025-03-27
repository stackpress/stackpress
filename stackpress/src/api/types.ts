//stackpress
import type { Method, UnknownNest } from '@stackpress/lib/types';
import type { Data } from '@stackpress/idea-parser/types';

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
  expires: number,
  scopes: Record<string, ApiScope>,
  endpoints: ApiEndpoint[],
  webhooks: ApiWebhook[]
};