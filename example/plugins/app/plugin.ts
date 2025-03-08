//stackpress
import type { Server } from 'stackpress/server';
//local
import { config } from '../config';
import dmz from './pages/public';

export default function plugin(server: Server) {
  server.config.set(config);
  server.on('listen', async req => {
    const server = req.context;
    //on error, show error page
    server.imports.on('error', () => import('./pages/error'));
    server.view.on('error', '@/plugins/app/templates/error', -100);
    //static assets
    server.on('request', async (req, res) => {  
      if (!res.body && (!res.code || res.code === 404)) {
        await dmz(req, res);
      }
    });
    //on response, check for errors
    server.on('response', async (req, res) => {  
      const server = req.context;
      if (res.error) {
        await server.emit('error', req, res);
      }
    });
  });
  server.on('route', async req => {
    const server = req.context;
    server.view.all('/', '@/plugins/app/templates/home', -100);
  });
};