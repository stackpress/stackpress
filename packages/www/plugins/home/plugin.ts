//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';

export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    server.import.get('/', () => import('./pages/home.js'));
    server.view.get('/', '@/plugins/home/views/home');
  });
};
