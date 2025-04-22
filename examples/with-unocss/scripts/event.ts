//stackpress
import { Terminal } from 'stackpress/terminal';
//config
import { bootstrap } from '../config/develop.js';

async function event() {
  const server = await bootstrap();
  const args = process.argv.slice(2);
  const terminal = new Terminal(args, server);
  if (terminal.command === 'transform') {
    await terminal.server.resolve('idea', { 
      transformer: terminal.transformer 
    });
  }
  const response = await terminal.server.resolve(
    terminal.command, 
    terminal.data || {}
  );
  console.log(JSON.stringify(response, null, 2));
}

event()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });