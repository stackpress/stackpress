//modules
import type { HttpServer } from '@stackpress/ingest';
//client
import type { Config } from '../../config/common.js';
import { setDocsViewProps } from '../app/helpers.js';
import { getApiDocResults, getApiShelfResults } from './helpers.js';
import { docs } from './manifest.js';

/**
 * Registers API reference index and article routes.
 */
export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    server.get('/api', ({ req, res, ctx }) => {
      res.results(getApiShelfResults());
      setDocsViewProps(req, res, ctx);
    }, 100);
    server.view.get('/api', '@/plugins/api/views/shelf');

    for (const doc of docs) {
      server.get(doc.href, async ({ req, res, ctx }) => {
        const results = await getApiDocResults(req.url.pathname);
        if (!results) return;

        res.results(results);
        setDocsViewProps(req, res, ctx);
      }, 100);
      server.view.get(doc.href, '@/plugins/api/views/doc');
    }
  });
}
