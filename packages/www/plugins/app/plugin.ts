//modules
import type { HttpServer } from '@stackpress/ingest';
//client
import type { Config } from '../../config/common.js';
/**
 * Registers shared documentation server hooks.
 */
export default function plugin(server: HttpServer<Config>) {
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
