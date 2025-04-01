//modules
import { Project, IndentationText } from 'ts-morph';
import prettier from 'prettier';
//stackpress
import type Server from '@stackpress/ingest/Server';
import Terminal from '@stackpress/lib/Terminal';
import FileLoader from '@stackpress/lib/FileLoader';
import Transformer from '@stackpress/idea-transformer/Transformer';
//root
import type { IdeaProjectProps } from '../types';

export default class InceptTerminal extends Terminal {
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
  public readonly transformer: Transformer<IdeaProjectProps>;

  /**
   * Preloads the input and output settings
   */
  public constructor(args: string[], server: Server<any, any, any>) {
    super(args);
    //form the idea file path
    const idea = `${server.loader.cwd}/schema.idea`;
    //get idea file from commandline
    const input = this.expect([ 'input', 'i' ], idea);
    //make a new transformer
    const loader = new FileLoader(server.loader.fs, server.loader.cwd);
    this.transformer = new Transformer<IdeaProjectProps>(input, loader);
    this.server = server;
    this.server.on('transform', async (req, res, server) => {
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
        //save first
        project.saveSync();
        //get source files
        const files = project.getSourceFiles();
        for (const file of files) {
          const filePath = file.getFilePath();
          const content = file.getFullText();
          //so we can pretty print
          const pretty = await prettier.format(content, { 
            parser: 'typescript' 
          });
          const fs = this.server.loader.fs;
          await fs.writeFile(filePath, pretty);
        }
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
    await this.server.resolve('config');
    await this.server.resolve('listen');
    await this.server.resolve('route');
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
        declarationMap: false, 
        sourceMap: false, 
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
    const request = this.server.request({ data: this.data });
    const response = this.server.response();
    return await this.server.emit(this.command, request, response);
  }
}