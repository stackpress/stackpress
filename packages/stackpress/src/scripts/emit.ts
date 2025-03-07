//stackpress
import type Server from '@stackpress/ingest/dist/Server';
import EventTerminal from '@stackpress/lib/dist/event/EventTerminal';

export default async function emit(server: Server<any, any, any>, skip = 2) {
  //from the cli
  const terminal = new EventTerminal(process.argv.slice(skip));
  //server emit
  const response = await server.call(terminal.command, terminal.params);
  console.log(JSON.stringify(response, null, 2));
};