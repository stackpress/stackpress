//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';

/**
 * Registers the order confirmation and account history routes.
 */
export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    // the order plugin owns readback after checkout hands off the placed order
    server.import.get(
      '/orders/confirmation/:id',
      () => import('./pages/confirmation.js')
    );
    server.view.get(
      '/orders/confirmation/:id',
      '@/plugins/order/views/confirmation'
    );

    server.import.get('/account/orders', () => import('./pages/account.js'));
    server.view.get('/account/orders', '@/plugins/order/views/account');
  });
};
