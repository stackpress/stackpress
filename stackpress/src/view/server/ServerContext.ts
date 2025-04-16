//modules
import { createContext } from 'react';
//stackpress
import { withUnknownHost } from '@stackpress/lib/Request';
//view
import type { ServerContextProps } from '../types.js';

export const unknownHost = new URL(withUnknownHost('/'));
export const config: ServerContextProps = {
  data: {},
  session: {
    id: '',
    name: 'Guest',
    roles: [ 'GUEST' ],
    token: '',
    permits: []
  },
  request: {
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
  response: {
    code: 0,
    status: ''
  }
};

const ServerContext = createContext<ServerContextProps>(config);

export default ServerContext;