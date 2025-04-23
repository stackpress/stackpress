//stackpress
import type Server from '@stackpress/ingest/Server';
import Terminal, { terminalControls } from '@stackpress/lib/Terminal';

export default class StackpressTerminal extends Terminal {
  //the server
  public readonly server: Server<any, any, any>;

  /**
   * Preloads the input and output settings
   */
  public constructor(args: string[], server: Server<any, any, any>) {
    super(args);
    this.server = server;
  }

  /**
   * Bootstraps the project and binds with the terminal
   * (called in bin.js)
   */
  public async bootstrap() {
    //initialize the plugins
    await this.server.bootstrap();
    //add terminal plugin
    this.server.register('cli', this);
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
      const label = this.server.config.path('cli.label', '');
      const control = terminalControls(label);
      control.error(`Command "${this.command}" not found.`);
    }
    return status;
  }
}