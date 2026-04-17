//node
import path from 'node:path';
//modules
import type Server from '@stackpress/ingest/Server';
import FileLoader from '@stackpress/lib/FileLoader';
//stackpress
import type { IdeaProjectProps } from '../types.js';
//stackpress/client
import type { ClientConfig } from '../client/types.js';
//stackpress/terminal
import Terminal from '../terminal/Terminal.js';

export default async function generate(
  server: Server<any, any, any>,
  idea: string,
  tsconfig: string,
  terminal: Terminal
) {
  //get build
  const build = getBuildPath(server);
  //make a new transformer
  const transformer = await getTransformer(server, idea);
  //make a new project
  const project = await createProject(build, tsconfig);
  
  //register all the idea plugins first
  terminal?.verbose && terminal.control.system('Looking up ideas...');
  await server.resolve('idea', { transformer });
  //create the directory
  const directory = project.createDirectory(build);
  //transform (generate the code)
  terminal?.verbose && terminal.control.system('Generating ideas...');
  await transformer.transform({ terminal, project, directory });
  //get the output language
  const lang = server.config.path<string>('client.lang', 'js');
  //if you want ts, tsx files
  if (lang === 'ts') {
    terminal?.verbose && terminal.control.system('Converting to typescript...');
    //lazy import prettier
    const prettier = await import('prettier');
    //save first
    project.saveSync();
    //get source files
    const files = project.getSourceFiles();
    for (const file of files) {
      const filePath = file.getFilePath();
      const content = file.getFullText();
      //so we can pretty print
      const pretty = await prettier.default.format(content, {
        parser: 'typescript',
        ...server.config.path<ClientConfig['prettier']>('client.prettier', {})
      });
      const fs = server.loader.fs;
      await fs.writeFile(filePath, pretty);
    }
  //if you want js, d.ts files
  } else {
    terminal?.verbose && terminal.control.system('Converting to javascript...');
    await project.emit();
  }
  terminal?.verbose && terminal.control.success(
    'Ideas generated to %s', 
    [ build ]
  );
};

export async function createProject(output: string, tsconfig: string) {
  //lazy import ts-morph
  const morph = await import('ts-morph');
  const { Project, IndentationText } = morph;
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
};

export function getBuildPath(server: Server) {
  //get build
  let build = server.config.path<string>('client.build');
  //if no build path,
  if (!build) {
    const cwd = server.config.path('server.cwd', process.cwd());
    const name = server.config.path('client.package', 'stackpress-client');
    build = path.join(cwd, 'node_modules', name);
  }
  return build;
};

export async function getTransformer(server: Server, idea: string) {
  //make a separate file loader that the transformer expects
  const loader = new FileLoader(server.loader.fs, server.loader.cwd);
  //lazy import the transformer
  const transformer = await import(
    '@stackpress/idea-transformer/Transformer'
  );
  const Transformer = transformer.default;
  //make a new transformer
  return new Transformer<IdeaProjectProps>(idea, loader);
};