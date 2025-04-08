//stackpress
import type { CLIProps } from '@stackpress/idea-transformer/types';
import type Transformer from '@stackpress/idea-transformer/Transformer';
import type Server from '@stackpress/ingest/Server';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(ctx: Server) {
  //on config, register the client as a plugin
  ctx.on('config', async (_req, _res, ctx) => {
    //if the no client config, return
    if (!ctx.config.get('client')) return;
    const module = ctx.config.path('client.module', '.client');
    try {
      const client = await ctx.loader.import(module);
      ctx.register('client', client);
    } catch(e) {}
  }, 10);
  //generate some code in the client folder
  ctx.on('idea', async req => {
    //get the transformer from the request
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    const schema = await transformer.schema();
    //if no plugin object exists, create one
    if (!schema.plugin) {
      schema.plugin = {};
    }
    //commonjs or esm dirname
    const dirname = typeof __dirname === 'string' 
      ? __dirname
      : import.meta.dirname; 
    //add this plugin generator to the schema
    //so it can be part of the transformation
    schema.plugin[`${dirname}/transform`] = {};
  });
};