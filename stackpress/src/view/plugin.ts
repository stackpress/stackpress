//stackpress
import type { CLIProps } from '@stackpress/idea-transformer/types';
import type Transformer from '@stackpress/idea-transformer/Transformer';
import type Server from '@stackpress/ingest/Server';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(ctx: Server) {
  //on config, configure and register the language plugin
  ctx.on('config', async (_req, _res, ctx) => {
    //get server mode
    const mode = ctx.config.path('server.mode', 'production');
    if (mode === 'production') {
      const { config } = await import('./config/production');
      config(ctx);
    } else {
      const { config } = await import('./config/development');
      config(ctx);
    }
  });
  //on route, 
  ctx.on('route', async (_req, _res, ctx) => {
    //get server mode
    const mode = ctx.config.path('server.mode', 'production');
    if (mode !== 'production') {
      const { route } = await import('./config/development');
      route(ctx);
    }
  });
  //generate some code in the client folder
  ctx.on('idea', async req => {
    //get the transformer from the request
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    const schema = await transformer.schema();
    //if no plugin object exists, create one
    if (!schema.plugin) {
      schema.plugin = {};
    }
    //@ts-ignore - __dirname supported in all versions of nodejs
    let dirname = typeof __dirname === 'string' ? __dirname : ''; 
    //@ts-ignore - meta supported after node 20
    if (typeof globalThis.import !== 'undefined') {
      try {
        //@ts-ignore - meta supported after node 20
        dirname = globalThis.import.meta.dirname;
      } catch(e) {}
    }
    //add this plugin generator to the schema
    //so it can be part of the transformation
    schema.plugin[`${dirname}/transform`] = {};
  });
};