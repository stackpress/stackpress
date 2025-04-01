//stackpress
import type { Server } from 'stackpress/server';
//local
import { config } from '../config';

export default function plugin(server: Server) {
  server.config.set(config);
  server.on('listen', async _ => {
    //on error, show error page
    server.on('error', () => import('./pages/error'));
    server.on('error', '@/plugins/app/views/error', -100);
    //on response, check for errors
    server.on('response', async (req, res, ctx) => {  
      if (res.error) {
        await ctx.emit('error', req, res);
      }
    });
  });
  server.on('route', async _ => {
    server.all('/', '@/plugins/app/views/home', -100);
    server.all('/form', '@/plugins/app/views/form', -100);
  });
};