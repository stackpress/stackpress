//stackpress
import { server as http } from 'stackpress/http';
//config
import { config as developConfig } from './develop.js';

export const config = {
  ...developConfig,
  desktop: {
    runtime: 'http',
    app: {
      id: 'io.stackpress.blog',
      name: 'Stackpress Blog',
      version: '1.0.0'
    },
    server: {
      host: '127.0.0.1',
      port: 0,
      open: '/'
    },
    window: {
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      title: 'Stackpress Blog'
    },
    routes: [],
    security: {
      externalNavigation: 'deny',
      allowDevTools: true
    },
    menu: {
      enabled: true
    },
    updater: {
      enabled: false,
      menu: true
    },
    data: {
      directory: 'userData',
      database: 'blog.sqlite'
    },
    build: {
      directory: '.build/desktop',
      main: '.build/desktop/main.js',
      preload: '.build/desktop/preload.js',
      manifest: '.build/desktop/manifest.json'
    },
    package: {
      tool: 'electron-builder',
      output: '.build/releases'
    }
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
