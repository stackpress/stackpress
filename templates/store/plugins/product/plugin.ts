//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';

/**
 * Registers the product plugin routes and sample data hook.
 */
export default function plugin(server: HttpServer<Config>) {
  server.on('listen', async _ => {
    // load sample products through the normal populate lifecycle
    server.on('populate', () => import('./populate.js'));
  });

  server.on('route', async _ => {
    // expose the product listing and detail flow from this plugin only
    server.import.get('/products', () => import('./pages/index.js'));
    server.view.get('/products', '@/plugins/product/views/index');

    server.import.get('/products/:slug', () => import('./pages/detail.js'));
    server.view.get('/products/:slug', '@/plugins/product/views/detail');
  });
};
