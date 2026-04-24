//node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
//modules
import type Server from '@stackpress/ingest/Server';
import type { CLIProps } from '@stackpress/idea-transformer/types';
import type Transformer from '@stackpress/idea-transformer/Transformer';
import type Request from '@stackpress/ingest/Request';
import FileLoader from '@stackpress/lib/FileLoader';
import { action } from '@stackpress/ingest/Server';
//stackpress-server
import type { TerminalPlugin } from 'stackpress-server/types';
import type Terminal from 'stackpress-server/Terminal';
//stackpress-schema
import type { ClientConfig, ClientProjectProps } from './types.js';

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

export async function generate(
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

export function getIdeaPath(server: Server, req: Request) {
  //determine the input schema.idea
  const defaultPath = path.join(server.loader.cwd, 'schema.idea');
  //first try to get the idea from the config
  const config = server.config.path('cli.idea', defaultPath);
  //next try to get the idea from the request (allows override)
  const input = req.data.path('input', config);
  //next try to get the idea from the request (allows override)
  return req.data.path('i', input);
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
  return new Transformer<ClientProjectProps>(idea, loader);
};

/**
 * This interface is intended for the Stackpress library.
 */
export default function plugin(ctx: Server) {
  //on config, register the client as a plugin
  ctx.on('config', action.props(async ({ ctx }) => {
    const module = ctx.config.path('client.module', 'stackpress-client');
    ctx.register('client', async (nullable = false) => {
      if (!nullable) {
        return await ctx.loader.import(module);
      }
      try {
        return await ctx.loader.import(module);
      } catch(e) {
        return null;
      }
    });
  }), 10);
  //on listen
  ctx.on('listen', action.props(({ ctx }) => {
    //add server scripts
    ctx.on('generate', async (req, res, ctx) => {
      //if client config is not set, dont generate client
      if (!ctx.config.has('client')) return;
      //get terminal
      const terminal = ctx.plugin<TerminalPlugin>('terminal');
      //get tsconfig
      const tsconfig = ctx.config.path<string>('client.tsconfig');
      //if no tsconfig path,
      if (!tsconfig) {
        terminal?.verbose && terminal.control.error('Missing tsconfig path');
        res.setError('Missing tsconfig path');
        return;
      }
      const idea = getIdeaPath(ctx, req);
      await generate(ctx, idea, tsconfig, terminal);
      //OK
      res.setStatus(200);
    });
  }));
  //generate some code in the client folder
  ctx.on('idea', async req => {
    //get the transformer from the request
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    const schema = await transformer.schema();
    //if no plugin object exists, create one
    if (!schema.plugin) {
      schema.plugin = {};
    }
    const dirname = typeof __dirname === 'undefined' 
      //@ts-ignore - The import.meta only allowed in ESM
      ? path.dirname(fileURLToPath(import.meta.url))
      : __dirname;
    //add this plugin generator to the schema
    //so it can be part of the transformation
    schema.plugin[`${dirname}/transform`] = {};
  });
};