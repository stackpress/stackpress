//stackpress-server
import type { TerminalPlugin } from '../types.js';
import type Server from '@stackpress/ingest/Server';
import {
  DEVELOPMENT_ERROR,
  DEVELOPMENT_READY,
  DEVELOPMENT_SHUTDOWN
} from './development-messages.js';

//small Reactus surface needed to release the Vite development server
type DevelopmentView = {
  dev?: () => Promise<{ close: () => Promise<void> }>
};

export default function serve(
  terminal: TerminalPlugin, 
  server: Server<any, any, any>,
  host: string,
  port: number
) {
  const service = server.create();
  service.listen(port, host, () => {
    //log only after the server has successfully claimed its port
    terminal?.verbose && terminal.control.system(
      `Server is running on ${host}:${port}`
    );
    terminal?.verbose && terminal.control.system('------------------------------');
    //notify the parent only after the replacement owns the HTTP port
    process.send?.({ type: DEVELOPMENT_READY });
  });
  service.on('error', e => {
    const error = e as Error;
    terminal?.verbose && terminal.control.error(error.message);
    process.send?.({ type: DEVELOPMENT_ERROR, message: error.message });
  });
  service.on('close', () => {
    terminal?.verbose && terminal.control.success('Server Exited.');
  });

  //forked development servers receive an IPC shutdown request so Vite and
  //HTTP can release their resources before the next child starts
  if (process.send) {
    let closing = false;
    process.once('message', message => {
      if (!message
        || typeof message !== 'object'
        || !('type' in message)
        || message.type !== DEVELOPMENT_SHUTDOWN
        || closing
      ) return;
      closing = true;
      const close = async () => {
        const view = server.plugin<DevelopmentView>('reactus');
        const vite = view?.dev ? await view.dev() : null;
        //release the application port before telling browser clients to poll
        await new Promise<void>((resolve, reject) => {
          service.close(error => error ? reject(error) : resolve());
        });
        //closing Vite now makes HTTP recovery wait for the replacement child
        if (vite) await vite.close();
        process.disconnect?.();
      };
      close().catch(error => {
        terminal?.verbose && terminal.control.error(String(error));
        process.exitCode = 1;
        process.disconnect?.();
      });
    });
  }

  return service;
};
