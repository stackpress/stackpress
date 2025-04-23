//node
import path from 'node:path';
//stackpress
import type { FileSystem } from '@stackpress/lib/types';
import { terminalControls } from '@stackpress/lib/Terminal';
import { action } from '@stackpress/ingest/Server';
//scripts
import buildScript from '../../scripts/build.js';

export default action(async function BuildScript(req, res, ctx) {
  //cli setup
  const label = ctx.config.path('cli.label', '');
  const verbose = req.data.path('verbose', false) || req.data.path('v', false);
  const control = terminalControls(label);
  //get config
  const cwd = ctx.config.path('server.cwd', process.cwd());
  const build = ctx.config.path('server.build', path.join(cwd, '.build'));
  //make server, client and styles
  verbose && control.system('Building server, client and styles...');
  await buildScript(ctx);
  //make a package.json
  verbose && control.system('Making package.json...');
  buildPackageJSON(cwd, build, ctx.loader.fs);
  //OK
  verbose && control.success('Build Complete.');
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