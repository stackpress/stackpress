//modules
import { useContext } from 'react';
//stackpress
import type { UnknownNest } from '@stackpress/lib/types';
import { nest } from '@stackpress/lib/Nest';
//client
import type { 
  ServerRequestProps, 
  ServerResponseProps 
} from '../types';
import Request from './ServerRequest';
import Response from './ServerResponse';
import Session from './ServerSession';
import ClientContext from './ServerContext';

export function useRequest<I extends UnknownNest = UnknownNest>() {
  const { request } = useContext(ClientContext);
  return new Request<I>(request as ServerRequestProps<I>);
}

export function useResponse<O = UnknownNest>() {
  const { response } = useContext(ClientContext);
  return new Response<O>(response as ServerResponseProps<O>);
}

export function useSession() {
  const { session } = useContext(ClientContext);
  return new Session(session);
}

export function useConfig<C extends UnknownNest = UnknownNest>() {
  const { data } = useContext(ClientContext);
  return nest<C>(data as C);
}

export function useServer<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O = UnknownNest
>() {
  const { data, request, response, session } = useContext(ClientContext);
  return {
    config: nest<C>(data as C),
    request: new Request<I>(request as ServerRequestProps<I>),
    response: new Response<O>(response as ServerResponseProps<O>),
    session: new Session(session)
  };
}