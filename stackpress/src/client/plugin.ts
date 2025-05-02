//node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
//stackpress
import type { CLIProps } from '@stackpress/idea-transformer/types';
import type Transformer from '@stackpress/idea-transformer/Transformer';
import type Server from '@stackpress/ingest/Server';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server) {
  //on config, register the client as a plugin
  ctx.on('config', async (_req, _res, ctx) => {
    //if the no client config, return
    if (!ctx.config.has('client')) return;
    const module = ctx.config.path('client.module', 'stackpress-client');
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
    const dirname = typeof __dirname === 'undefined' 
      //@ts-ignore - The import.meta only allowed in ESM
      ? path.dirname(fileURLToPath(import.meta.url))
      : __dirname;
    //add this plugin generator to the schema
    //so it can be part of the transformation
    schema.plugin[`${dirname}/transform`] = {};
  });
};