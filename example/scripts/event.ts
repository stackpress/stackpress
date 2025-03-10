//stackpress
import { Terminal } from 'stackpress/terminal';
//plugins
import bootstrap from '../plugins/bootstrap';

async function event() {
  const server = await bootstrap();
  const args = process.argv.slice(2);
  const terminal = new Terminal(args, server);
  if (terminal.command === 'transform') {
    await terminal.server.call('idea', { 
      transformer: terminal.transformer 
    });
  }
  const response = await terminal.server.call(
    terminal.command, 
    terminal.params || {}
  );
  console.log(JSON.stringify(response, null, 2));
}

event()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });