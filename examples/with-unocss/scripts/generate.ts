//stackpress
import { Terminal } from 'stackpress/terminal';
//config
import { bootstrap } from '../config/develop';

async function generate() {
  const args = process.argv.slice(2);
  const command = [ ...args, 'transform' ];
  const server = await bootstrap();
  const terminal = new Terminal(command, server);
  await terminal.server.resolve('idea', { 
    transformer: terminal.transformer 
  });
  await terminal.server.resolve(
    terminal.command, 
    terminal.data || {}
  );
}

generate()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });