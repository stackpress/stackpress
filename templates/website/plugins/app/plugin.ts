//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';

export default function plugin(server: HttpServer<Config>) {
  server.on('listen', async _ => {
    server.on('error', (req, res) => {
      //if there is already a body
      if (res.body) return;
      if (req.mimetype === 'terminal/arguments') {
        console.log('CLI Error:', res.toStatusResponse());
        return;
      }
    });
  });
  server.on('route', async _ => {
    server.import.get('/', () => import('./pages/home.js'));
    server.view.get('/', '@/plugins/app/views/home');
  });
};