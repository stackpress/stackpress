//modules
import type { HttpServer } from '@stackpress/ingest';
//client
import type { Config } from '../../config/common.js';
import { getHomeResults } from './data.js';
import { setDocsViewProps } from './helpers.js';

/**
 * Registers shared documentation shell routes and server hooks.
 */
export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    server.get('/', ({ req, res, ctx }) => {
      res.results(getHomeResults());
      setDocsViewProps(req, res, ctx);
    }, 100);
    server.view.get('/', '@/plugins/app/views/home');
  });

  server.on('listen', async _ => {
    server.on('error', ({ req, res }) => {
      // if there is already a body
      if (res.body) return;
      if (req.mimetype === 'terminal/arguments') {
        console.log('CLI Error:', res.toStatusResponse());
        return;
      }
    });
  });
}
