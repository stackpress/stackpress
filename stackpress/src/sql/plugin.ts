//stackpress
import type { CLIProps } from '@stackpress/idea-transformer/types';
import type Transformer from '@stackpress/idea-transformer/Transformer';
import type Server from '@stackpress/ingest/Server';
//client
import type { ClientPlugin } from '../client/types';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(ctx: Server) {
  //on listen, add database events
  ctx.on('listen', (_req, _res, ctx) => {
    try {
      //it's possible that the client isnt generated yet...
      //config, registry, model, fieldset
      const client = ctx.plugin<ClientPlugin>('client');
      //if no client or modules, return
      if (!client?.model) return;
      //loop through all the models
      for (const model of Object.values(client.model)) {
        //register all the model events
        ctx.use(model.events);
      }
    } catch(e) {}
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
    //add this plugin generator to the schema
    //so it can be part of the transformation
    schema.plugin[`${import.meta.dirname}/transform`] = {};
  });
};