//modules
import fs from 'node:fs';
import path from 'node:path';
//stackpress
import { Terminal } from 'stackpress';
import * as scripts from 'stackpress/scripts';
//plugins
import bootstrap from '../plugins/bootstrap';

Terminal.brand = '[EXAMPLE]';

async function build() {
  const server = await bootstrap('production');
  //get config
  const cwd = server.config.path(
    'server.cwd',
    process.cwd()
  );
  const build = server.config.path(
    'server.build', 
    path.join(cwd, '.build')
  );
  //make server, client and styles
  Terminal.warning('Building server, client and styles...');
  await scripts.build(server);
  //copy ink files to build
  Terminal.warning('Copying ink files to build...');
  copyInkFiles(cwd, build);
  //make a package.json
  Terminal.warning('Building package.json...');
  buildPackageJSON(cwd, build);
};

export function copyInkFiles(cwd: string, build: string, current = 'plugins') {
  const source = path.join(cwd, current);
  const destination = path.join(build, current);
  //find all the .ink files from source
  const files = fs.readdirSync(source);
  for (const file of files) {
    //ignore . and ..
    if (file === '.' || file === '..') continue;
    //make an absolute source path
    const absolute = path.join(source, file);
    //if this is an ink file,
    if (file.endsWith('.ink')) {
      //if the parent directory does not exist,
      if (!fs.existsSync(destination)) {
        //make sure the parent directory exists
        fs.mkdirSync(destination, { recursive: true });
      }
      //now we can copy the file
      fs.copyFileSync(absolute, path.join(destination, file));
      continue;
    } 
    //if file is a directory, recurse
    if (fs.statSync(absolute).isDirectory()) {
      copyInkFiles(cwd, build, path.join(current, file));
    }
  }
}

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