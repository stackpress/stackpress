//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';
//local
import { docs } from './manifest.js';

export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    server.import.get('/concepts', () => import('./pages/shelf.js'));
    server.view.get('/concepts', '@/plugins/concepts/views/shelf');

    for (const doc of docs) {
      server.import.get(doc.href, () => import('./pages/doc.js'));
      server.view.get(doc.href, '@/plugins/concepts/views/doc');
    }
  });
};
