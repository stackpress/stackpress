//stackpress
import { server as http } from 'stackpress/http';
//config
import { config as desktopConfig } from './desktop.js';

export const config = {
  ...desktopConfig,
  desktop: {
    ...desktopConfig.desktop,
    server: {
      ...desktopConfig.desktop.server,
      open: '/'
    },
    routes: [
      { route: '/' },
      { route: '/articles/**' },
      { route: '/api/**' }
    ]
  }
};

export default async function bootstrap() {
  const server = http();
  server.config.set(config);
  await server.bootstrap();
  await server.resolve('config');
  await server.resolve('listen');
  await server.resolve('route');
  return server;
};
