//node
import path from 'node:path';
//stackpress
import type { FileSystem } from '@stackpress/lib/types';
import { action } from '@stackpress/ingest/Server';
//scripts
import buildScript from '../../scripts/build.js';
//terminal
import type { CLIPlugin } from '../types.js';

export default action(async function BuildScript(_req, res, ctx) {
  //get terminal
  const cli = ctx.plugin<CLIPlugin>('cli');
  //get config
  const cwd = ctx.config.path('server.cwd', process.cwd());
  const build = ctx.config.path('server.build', path.join(cwd, '.build'));
  //make server, client and styles
  cli?.verbose && cli.control.system('Building server, client and styles...');
  await buildScript(ctx);
  //make a package.json
  cli?.verbose && cli.control.system('Making package.json...');
  buildPackageJSON(cwd, build, ctx.loader.fs);
  //OK
  cli?.verbose && cli.control.success('Build Complete.');
  res.setStatus(200);
});

export async function buildPackageJSON(
  cwd: string, 
  build: string, 
  fs: FileSystem
) {
  const source = path.join(cwd, 'package.json');
  const destination = path.join(build, 'package.json');
  const contents = await fs.readFile(source, 'utf8');
  const settings = JSON.parse(contents);
  delete settings.devDependencies;
  settings.scripts = {
    generate: 'node scripts/generate.js',
    start: 'node scripts/serve.js',
    postinstall: 'node scripts/generate.js'
  };
  await fs.writeFile(destination, JSON.stringify(settings, null, 2));
};