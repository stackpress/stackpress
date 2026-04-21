//modules
import type { ReactNode } from 'react';
import type { StatusResponse, UnknownNest } from '@stackpress/lib/types';

export type Method = 'GET' | 'ALL' 
  | 'CONNECT' | 'DELETE' 
  | 'HEAD' | 'OPTIONS' 
  | 'PATCH' | 'POST' 
  | 'PUT' | 'TRACE';

export type ServerUrlProps = {
  hash: string,
  host: string,
  hostname: string,
  href: string,
  origin: string,
  pathname: string,
  port: string,
  protocol: string,
  search: string
};
export type ServerSessionRoute = { method: string, route: string };
export type ServerSessionPermission = string | ServerSessionRoute;
export type ServerSessionProps = Record<string, any> & { 
  id: string, 
  name: string,
  image?: string,
  roles: string[],
  token: string,
  permits: ServerSessionPermission[]
};
export type ServerRequestProps<
  I extends UnknownNest = UnknownNest
> = {
  url: ServerUrlProps,
  headers: Record<string, string|string[]>,
  session: Record<string, string|string[]>,
  method: Method,
  mime: string,
  data: I
};
export type ServerResponseProps<
  O = UnknownNest
> = Partial<StatusResponse<O>>;

export type ServerProps<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O = UnknownNest
> = {
  data: C,
  session: ServerSessionProps,
  request: ServerRequestProps<I>,
  response: ServerResponseProps<O>
}

export type ServerContextProps = ServerProps<
  UnknownNest, 
  UnknownNest, 
  any
>;
export type ServerProviderProps<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O = UnknownNest
> = Partial<ServerProps<C, I, O>> & { 
  children: ReactNode 
};