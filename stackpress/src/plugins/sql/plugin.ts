//stackpress
import type { CLIProps } from '@stackpress/idea-transformer/types';
import type Transformer from '@stackpress/idea-transformer/Transformer';
import type Server from '@stackpress/ingest/Server';
//root
import type { ClientPlugin } from '../../types';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on listen, add database events
  server.on('listen', (_req, _res, server) => {
    try {
      //it's possible that the client isnt generated yet...
      //config, registry, model, fieldset
      const client = server.plugin<ClientPlugin>('client');
      //if no client or modules, return
      if (!client?.model) return;
      //loop through all the models
      for (const model of Object.values(client.model)) {
        //register all the model events
        server.use(model.events);
      }
    } catch(e) {}
  });
  //generate some code in the client folder
  server.on('idea', async req => {
      //get the transformer from the request
      const transformer = req.data<Transformer<CLIProps>>('transformer');
      const schema = await transformer.schema();
      //if no plugin object exists, create one
      if (!schema.plugin) {
        schema.plugin = {};
      }
      //add this plugin generator to the schema
      //so it can be part of the transformation
      schema.plugin['stackpress/plugins/sql/transform'] = {};
  });
};