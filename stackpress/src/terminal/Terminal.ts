//stackpress
import type Server from '@stackpress/ingest/Server';
import Terminal from '@stackpress/lib/Terminal';

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
    this.server = server;
    this.verbose = this.expect<boolean>([ 'verbose', 'v' ], false);
    this.config = this.expect<string|null>([ 'bootstrap', 'b' ], null);
    this.server.register('cli', this);
  }

  /**
   * Bootstraps the project and binds with the terminal
   * (called in bin.js)
   */
  public async bootstrap() {
    //set control brand
    this._control.brand = this.server.config.path('cli.label', '');
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
    const request = this.server.request({ data: this.data });
    const response = this.server.response();
    const status = await this.server.emit(this.command, request, response);
    const verbose = this.expect<boolean>(['verbose', 'v'], false);
    if (status.code === 404 && this.command !== 'serve' && verbose) {
      this._control.error(`Command "${this.command}" not found.`);
    }
    return status;
  }
}