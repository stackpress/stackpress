//modules
import fs from 'node:fs';
import path from 'node:path';
//stackpress
import { terminalControls } from 'stackpress/terminal';
import * as scripts from 'stackpress/scripts';
//config
import { bootstrap } from '../config/build';

async function build() {
  const server = await bootstrap();
  //get config
  const cwd = server.config.path(
    'server.cwd',
    process.cwd()
  );
  const build = server.config.path(
    'server.build', 
    path.join(cwd, '.build')
  );
  const control = terminalControls('[EXAMPLE]');
  //make server, client and styles
  control.warning('Building server, client and assets...');
  await scripts.build(server);
  //make a package.json
  control.warning('Building package.json...');
  buildPackageJSON(cwd, build);
};

export function buildPackageJSON(cwd: string, build: string) {
  const source = path.join(cwd, 'package.json');
  const destination = path.join(build, 'package.json');
  const contents = fs.readFileSync(source, 'utf8');
  const settings = JSON.parse(contents);
  delete settings.devDependencies;
  settings.scripts = {
    generate: 'node scripts/generate.js',
    start: 'node scripts/serve.js',
    postinstall: 'node scripts/generate.js'
  };
  fs.writeFileSync(destination, JSON.stringify(settings, null, 2));
}

build()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });