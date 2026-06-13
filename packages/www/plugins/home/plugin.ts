//modules
import type { HttpServer } from '@stackpress/ingest';
//client
import type { Config } from '../../config/common.js';
import { setDocsViewProps } from '../app/helpers.js';
import { getHomeResults } from './helpers.js';

/**
 * Registers the documentation home route.
 */
export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    server.get('/', ({ req, res, ctx }) => {
      res.results(getHomeResults());
      setDocsViewProps(req, res, ctx);
    }, 100);
    server.view.get('/', '@/plugins/home/views/home');
  });
}
