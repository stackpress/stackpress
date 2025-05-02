//node
import path from 'node:path';
//modules
import { Project, IndentationText } from 'ts-morph';
import prettier from 'prettier';
//stackpress
import FileLoader from '@stackpress/lib/FileLoader';
import { terminalControls } from '@stackpress/lib/Terminal';
import Transformer from '@stackpress/idea-transformer/Transformer';
import { action } from '@stackpress/ingest/Server';
//types
import type { IdeaProjectProps } from '../../types/index.js';
//terminal
import type Terminal from '../Terminal.js';

export default action(async function GenerateScript(req, res, ctx) {
  //cli setup
  const label = ctx.config.path('cli.label', '');
  const verbose = req.data.path('verbose', false) || req.data.path('v', false);
  const control = terminalControls(label);
  //if client config is not set, dont generate client
  if (!ctx.config.has('client')) return;
  //get build
  let build = ctx.config.path<string>('client.build');
  //if no build path,
  if (!build) {
    const cwd = ctx.config.path('server.cwd', process.cwd());
    const name = ctx.config.path('client.package', 'stackpress-client');
    build = path.join(cwd, 'node_modules', name);
  }
  //get tsconfig
  const tsconfig = ctx.config.path<string>('client.tsconfig');
  //if no tsconfig path,
  if (!tsconfig) {
    verbose && control.error('Missing tsconfig path');
    res.setError('Missing tsconfig path');
    return;
  }
  //get terminal
  const cli = ctx.plugin<Terminal>('cli');
  if (!cli) {
    verbose && control.error('Can only generate from the command line.');
    res.setError('Can only generate from the command line.');
    return;
  }

  //determine the input schema.idea
  const defaultPath = path.join(ctx.loader.cwd, 'schema.idea');
  //first try to get the idea from the config
  const config = ctx.config.path('cli.idea', defaultPath);
  //next try to get the idea from the request (allows override)
  const input = req.data.path('input', config);
  //next try to get the idea from the request (allows override)
  const idea = req.data.path('i', input);
  //make a separate file loader that the transformer expects
  const loader = new FileLoader(ctx.loader.fs, ctx.loader.cwd);
  //make a new transformer
  const transformer = new Transformer<IdeaProjectProps>(idea, loader);
  
  //register all the idea plugins first
  verbose && control.system('Looking up ideas...');
  await ctx.resolve('idea', { transformer });
  //make a new project
  const project = createProject(build, tsconfig);
  //create the directory
  const directory = project.createDirectory(build);
  //transform (generate the code)
  verbose && control.system('Generating ideas...');
  await transformer.transform({ cli, project: directory });
  //get the output language
  const lang = ctx.config.path<string>('client.lang', 'js');
  //if you want ts, tsx files
  if (lang === 'ts') {
    verbose && control.system('Converting to typescript...');
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
      const fs = ctx.loader.fs;
      await fs.writeFile(filePath, pretty);
    }
    await ctx.emit('transformed', req, res);
  //if you want js, d.ts files
  } else {
    verbose && control.system('Converting to javascript...');
    await project.emit();
    await ctx.emit('transformed', req, res);
  }
  //OK
  verbose && control.success('Ideas were generated.');
  res.setStatus(200);
});

export function createProject(output: string, tsconfig: string) {
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