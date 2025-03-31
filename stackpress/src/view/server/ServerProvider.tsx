//stackpress
import type { UnknownNest } from '@stackpress/lib/types';
import { withUnknownHost } from '@stackpress/lib/Request';
//view
import type { ServerProviderProps } from '../types';
//server
import ServerContext from './ServerContext';

// (this is what to put in app.tsx)
export default function ServerProvider<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O extends UnknownNest = UnknownNest
>(props: Partial<ServerProviderProps<C, I, O>>) {
  const unknownHost = new URL(withUnknownHost('/'));
  const { 
    data = {}, 
    session = {
      id: '',
      name: 'Guest',
      roles: [ 'GUEST' ],
      token: '',
      permits: []
    }, 
    request = {
      url: {
        hash: unknownHost.hash,
        host: unknownHost.host,
        hostname: unknownHost.hostname,
        href: unknownHost.href,
        origin: unknownHost.origin,
        pathname: unknownHost.pathname,
        port: unknownHost.port,
        protocol: unknownHost.protocol,
        search: unknownHost.search
      },
      headers: {},
      session: {},
      method: 'GET',
      mime: '',
      data: {}
    }, 
    response = {
      code: 0,
      status: ''
    }, 
    children 
  } = props;
  return (
    <ServerContext.Provider value={{ data, session, request, response }}>
      {children}
    </ServerContext.Provider>
  );
}