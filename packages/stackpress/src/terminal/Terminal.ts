//modules
import { Project, IndentationText } from 'ts-morph';
//stackpress
import type Server from '@stackpress/ingest/dist/Server';
import EventTerminal from '@stackpress/lib/dist/event/EventTerminal';
import Transformer from '@stackpress/idea-transformer/dist/Transformer';
//local
import type { ProjectProps } from '../types';

export default class InceptTerminal extends EventTerminal {
  // brand to prefix in all logs
  public static brand: string = '[INCEPT]';
  // you can use a custom extension
  public static extension: string = 'idea';
  //access to static methods from the instance
  //@ts-ignore - Types of construct signatures are incompatible.
  public readonly terminal: typeof InceptTerminal;
  //the server
  public readonly server: Server<any, any, any>;
  //transformer
  public readonly transformer: Transformer<ProjectProps>;

  /**
   * Preloads the input and output settings
   */
  public constructor(args: string[], server: Server<any, any, any>) {
    super(args, server.loader.cwd);
    //make static methods available to this instance
    this.terminal = this.constructor as typeof InceptTerminal;
    //form the idea file path
    const idea = `${this.cwd}/schema.${this.terminal.extension}`;
    //get idea file from commandline
    const input = this.expect([ 'input', 'i' ], idea);
    //make a new transformer
    this.transformer = new Transformer<ProjectProps>(input, { 
      cwd: server.loader.cwd, 
      fs: server.loader.fs 
    });
    this.server = server;
    this.server.on('transform', async (req, res) => {
      const server = req.context;
      const build = server.config.path<string>('client.build');
      const tsconfig = server.config.path<string>('client.tsconfig');
      //make a new project
      const project = this.project(build, tsconfig);
      //create the directory
      const directory = project.createDirectory(build);
      //transform (generate the code)
      await this.transformer.transform({ cli: this, project: directory });
      //get the output language
      const lang = server.config.path<string>('client.lang', 'js');
      //if you want ts, tsx files
      if (lang === 'ts') {
        project.saveSync();
        await this.server.emit('transformed', req, res);
      //if you want js, d.ts files
      } else {
        await project.emit();
        await this.server.emit('transformed', req, res);
      }
      //sometimes this hangs...
      process.exit(0);
    });
  }

  /**
   * Bootstraps the project and binds with the terminal
   */
  public async bootstrap() {
    await this.server.bootstrap();
    await this.server.call('config');
    await this.server.call('listen');
    await this.server.call('route');
    return this;
  }

  /**
   * Makes a new ts-morph project
   */
  public project(output: string, tsconfig: string) {
    return new Project({
      tsConfigFilePath: tsconfig,
      skipAddingFilesFromTsConfig: true,
      compilerOptions: {
        outDir: output,
        declaration: true, 
        declarationMap: true, 
        sourceMap: true, 
      },
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces
      }
    });
  }

  /**
   * Runs the command
   */
  public async run() {
    if (this.command === 'transform') {
      const request = this.server.request({ 
        data: { transformer: this.transformer } 
      });
      const response = this.server.response();
      await this.server.emit('idea', request, response);
    }
    const request = this.server.request({ data: this.params });
    const response = this.server.response();
    return await this.server.emit(this.command, request, response);
  }
}