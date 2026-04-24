//modules
import type Server from '@stackpress/ingest/Server';
//stackpress-server
import Terminal from 'stackpress-server/Terminal';
//stackpress-sql
import type { SerializedEvent } from '../types.js';

export default async function populate(
  server: Server<any, any, any>, 
  events: SerializedEvent[],
  terminal?: Terminal
) {
  terminal?.verbose && terminal.control.system('Populating database...');
  for (const { event, data } of events) {
    terminal?.verbose && terminal.control.system(`Populating: ${event}`);
    await server.resolve(event, data);
  }
  terminal?.verbose && terminal.control.success('Database Populated.');
};