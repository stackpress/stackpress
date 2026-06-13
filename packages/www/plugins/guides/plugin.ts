//modules
import type { HttpServer } from '@stackpress/ingest';
//client
import type { Config } from '../../config/common.js';
import { setDocsViewProps } from '../app/helpers.js';
import { getGuideDocResults, getGuideShelfResults } from './helpers.js';
import { docs } from './manifest.js';

/**
 * Registers guide index and article routes.
 */
export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    server.get('/guides', ({ req, res, ctx }) => {
      res.results(getGuideShelfResults());
      setDocsViewProps(req, res, ctx);
    }, 100);
    server.view.get('/guides', '@/plugins/guides/views/shelf');

    for (const doc of docs) {
      server.get(doc.href, async ({ req, res, ctx }) => {
        const results = await getGuideDocResults(req.url.pathname);
        if (!results) return;

        res.results(results);
        setDocsViewProps(req, res, ctx);
      }, 100);
      server.view.get(doc.href, '@/plugins/guides/views/doc');
    }
  });
}
