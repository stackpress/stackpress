//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';

/**
 * Registers the checkout form and submit flow.
 */
export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    server.import.get('/checkout', () => import('./pages/index.js'));
    server.view.get('/checkout', '@/plugins/checkout/views/index');
    server.import.post('/checkout', () => import('./pages/index.js'));
  });
};
