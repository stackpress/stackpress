//stackpress
import type Server from '@stackpress/ingest/Server';
import Terminal from '@stackpress/lib/Terminal';

export default async function emit(
  server: Server<any, any, any>, 
  skip = 2
) {
  //from the cli
  const terminal = new Terminal(process.argv.slice(skip));
  //server emit
  const response = await server.resolve(terminal.command, terminal.data);
  console.log(JSON.stringify(response, null, 2));
};