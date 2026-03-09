//modules
import type Server from '@stackpress/ingest/Server';
import Terminal from '@stackpress/lib/Terminal';
//stackpress
import Exception from '../Exception.js';

export default class StackpressTerminal extends Terminal {
  //the server
  public readonly server: Server<any, any, any>;
  //whether to show output
  public readonly verbose: boolean;
  //the config pathname
  public readonly config: string|null;

  /**
   * Returns the terminal branding
   */
  public get brand() {
    return this.control.brand;
  }

  /**
   * Returns the current working directory
   */
  public get cwd() {
    return this.server.loader.cwd;
  }

  /**
   * Preloads the input and output settings
   */
  public constructor(args: string[], server: Server<any, any, any>) {
    super(args);
    //set server
    this.server = server;
    //set flags
    this.verbose = this.expect<boolean>([ 'verbose', 'v' ], false);
    this.config = this.expect<string|null>([ 'bootstrap', 'b' ], null);
    //register terminal plugin
    this.server.register('cli', this);
    //set brand
    this._control.brand = this.server.config.path('cli.label', '');
  }

  /**
   * Bootstraps the project and binds with the terminal
   * (called in bin.js)
   */
  public async bootstrap() {
    //initialize the plugins
    await this.server.bootstrap();
    //bootstrap by events
    await this.server.resolve('config');
    await this.server.resolve('listen');
    await this.server.resolve('route');
    return this;
  }

  /**
   * Runs the command
   * (called in bin.js)
   */
  public async run() {
    const request = this.server.request({ 
      data: this.data, 
      //add a flag to indicate that this is a terminal request
      mimetype: 'terminal/arguments' 
    });
    const response = this.server.response();
    try {
      //emit the command as an event and get the status
      const status = await this.server.emit(this.command, request, response);
      //determine if user wants a verbose output
      const verbose = this.expect<boolean>(['verbose', 'v'], false);
      //if 404 and verbose, show the error
      if (status.code === 404 && this.command !== 'serve' && verbose) {
        this._control.error(`Command "${this.command}" not found.`);
      }
      return status;
    } catch (e) {
      //if the command is serve, we actually want to throw the error
      if (this.command === 'serve') throw e;
      //upgrade the error to an exception
      const exception = Exception.upgrade(e as Error).toResponse();
      //set the exception as the error
      response.setError(exception);
      //allow plugins to handle the error and get the new status
      const status = await this.server.emit('error', request, response);
      //if error was not handled, throw it
      if (status.code !== 200) throw e;
      return status;
    }
  }
}