//stackpress
import type { CLIProps } from '@stackpress/idea-transformer/types';
import type Transformer from '@stackpress/idea-transformer/Transformer';
import type Server from '@stackpress/ingest/Server';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, register the client as a plugin
  server.on('config', async (_req, _res, server) => {
    //if the no client config, return
    if (!server.config.get('client')) return;
    const module = server.config.path('client.module', '.client');
    try {
      const client = await server.loader.import(module);
      server.register('client', client);
    } catch(e) {}
  }, 10);
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
      schema.plugin['stackpress/plugins/schema/transform'] = {};
  });
};