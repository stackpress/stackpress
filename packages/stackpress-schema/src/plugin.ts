//node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
//modules
import type Server from '@stackpress/ingest/Server';
import type { CLIProps } from '@stackpress/idea-transformer/types';
import type Transformer from '@stackpress/idea-transformer/Transformer';
import { action } from '@stackpress/ingest/Server';
//stackpress-schema
import { generate } from './events/index.js';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server) {
  //on config, register the client as a plugin
  ctx.on('config', action.props(async ({ ctx }) => {
    const module = ctx.config.path('client.module', 'stackpress-client');
    ctx.register('client', async (nullable = false) => {
      if (!nullable) {
        return await ctx.loader.import(module);
      }
      try {
        return await ctx.loader.import(module);
      } catch(e) {
        return null;
      }
    });
  }), 10);
  //on listen
  ctx.on('listen', action.props(({ ctx }) => {
    //add schema scripts
    ctx.on('generate', generate);
  }));
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