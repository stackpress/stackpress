//stackpress
import type Server from '@stackpress/ingest/dist/Server';
//common
import Terminal from '@/terminal/Terminal';

export default async function transform(server: Server<any, any, any>) {
  const terminal = new Terminal([ 'transform' ], server);
  await terminal.run();
};