//node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
//modules
import type { CLIProps } from '@stackpress/idea-transformer/types';
import type Transformer from '@stackpress/idea-transformer/Transformer';
import type Server from '@stackpress/ingest/Server';
import { action } from '@stackpress/ingest/Server';
//stackpress-sql
import type { ClientPlugin } from 'stackpress-sql/types';

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server) {
  //on route, add admin routes
  ctx.on('route', action.props(async ({ ctx }) => {
    //it's possible that the client isnt generated yet...
    //config, registry, model, fieldset
    const client = ctx.plugin<ClientPlugin>('client');
    const { model: models } = await client(true) || {};
    //if no client or modules, return
    if (!models) return;
    //loop through all the models
    for (const model of Object.values(models)) {
      //register all the admin routes
      model.admin(ctx);
    }
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