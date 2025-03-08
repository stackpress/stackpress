//modules
import path from 'node:path';
import Module from 'node:module';
//plugins
import bootstrap from '../plugins/bootstrap';

export const requirecb = require;
export const requirept = Module.prototype.require;

//disable require cache
export function nocache(cwd: string) {
  Module.prototype.require = new Proxy(Module.prototype.require, {
    apply(target, thisArg, argumentsList) {
      //console.log('module', { target, thisArg, argumentsList })
      //determines if module is a relative path
      const relative = argumentsList[0].startsWith('./') 
        || argumentsList[0].startsWith('../');
      const module = relative
        //if relative, make the path absolute
        ? path.resolve(thisArg.path, argumentsList[0])
        : argumentsList[0];
      try {
        //find the absolute path of the module being required
        const absolute = requirecb.resolve(module);
        //if the absolute path starts with the current working directory
        //and the absolute path is not the current file
        if (absolute.startsWith(cwd) && absolute !== __filename) {
          delete requirecb.cache[absolute];
        }
      } catch(e) {}

      return Reflect.apply(target, thisArg, argumentsList);
    }
  });
  //return a way to restore the require cache
  return () => {
    Module.prototype.require = requirept;
  }
};

async function serve() {
  //get server
  const server = await bootstrap();
  //get server cwd
  const cwd = server.config.path('server.cwd', process.cwd());
  //get server mode
  const mode = server.config.path('server.mode', 'production');
  //if not production, disable require cache
  if (mode !== 'production') nocache(cwd);
  //get server port
  const port = server.config.path<number>('server.port', 3000);
  //start the server
  server.create().listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('------------------------------');
  });
};

serve().catch(e => {
  console.error(e);
  process.exit(1);
});