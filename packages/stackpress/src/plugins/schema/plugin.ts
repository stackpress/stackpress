//stackpress
import type { CLIProps } from '@stackpress/idea-transformer/dist/types';
import type Transformer from '@stackpress/idea-transformer/dist/Transformer';
import type Server from '@stackpress/ingest/dist/Server';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, register the client as a plugin
  server.on('config', req => {
    const server = req.context;
    const module = server.config.path('client.module', '@stackpress/.incept');
    try {
      const client = server.loader.require(module);
      server.register('client', client);
    } catch(e) {}
  }, 10);
  //generate some code in the client folder
  server.on('idea', req => {
    //get the transformer from the request
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    //if no plugin object exists, create one
    if (!transformer.schema.plugin) {
      transformer.schema.plugin = {};
    }
    //add this plugin generator to the schema
    //so it can be part of the transformation
    transformer.schema.plugin['@stackpress/incept/dist/transform'] = {};
  });
};