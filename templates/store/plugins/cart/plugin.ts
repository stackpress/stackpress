//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';

/**
 * Registers the cart review and add-to-cart routes.
 */
export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    // keep cart ownership inside the cart plugin, including the postback route
    server.import.get('/cart', () => import('./pages/index.js'));
    server.view.get('/cart', '@/plugins/cart/views/index');
    server.import.post('/cart/items', () => import('./pages/index.js'));
  });
};
