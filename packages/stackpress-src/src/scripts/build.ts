//modules
import path from 'node:path';
//stackpress
import type Server from '@stackpress/ingest/dist/Server';
import ink from '@stackpress/ink/compiler';
import { plugin as css } from '@stackpress/ink-css';

const shims: [ string|RegExp, string ][] = [
  [ 'stackpress/template/client', 'stackpress/template/server' ]
];

export default async function build(server: Server<any, any, any>) {
  //get the compiler options
  const cwd = server.config.path('template.config.cwd', process.cwd());
  const brand = server.config.path('template.config.brand', '');
  const extname = server.config.path('template.extname', '.press');
  const clientPath = server.config.path<string>('template.config.clientPath');
  const serverPath = server.config.path<string>('template.config.serverPath');
  const manifestPath = server.config.path<string>('template.config.manifestPath');
  //get paths
  const paths = {
    client: clientPath,
    server: serverPath,
    manifest: manifestPath,
  };
  //create ink compiler (to create the client, server and style builds)
  const compiler = ink({ brand, cwd, shims, minify: true });
  //use ink css
  compiler.use(css());
  //get the file system (to save the build files)
  const fs = server.loader.fs;
  //make server and client directories
  if (typeof paths.server === 'string' && !fs.existsSync(paths.server)) {
    fs.mkdirSync(paths.server, { recursive: true });
  }
  if (typeof paths.client === 'string' && !fs.existsSync(paths.client)) {
    fs.mkdirSync(paths.client, { recursive: true });
  }
  //loop through the templates
  const templates = new Set<string>(
    Array
      //Map<string, Set<EntryTask>>
      .from(server.view.templates.values())
      //Set<EntryTask>[]
      .map(set => Array.from(set))
      //EntryTask[][]
      .flat()
      //EntryTask[]
      .map(task => !path.extname(task.entry) 
        ? `${task.entry}${extname}`
        : task.entry
      )
      //string[]
  );
  for (const template of templates) {
    //get the builder
    const builder = compiler.fromSource(template);
    //update the manifest
    compiler.manifest.set(
      builder.document.id, 
      builder.document.source
    );
    //if there's a server path
    if (typeof paths.server === 'string') {
      //save the server build
      fs.writeFileSync(
        path.join(paths.server, `${builder.document.id}.js`),
        (await builder.server()) + ';module.exports = InkAPI;'
      );
    }
    //if there's a client path
    if (typeof paths.client === 'string') {
      //save the client build
      fs.writeFileSync(
        path.join(paths.client, `${builder.document.id}.js`),
        await builder.client()
      );
      //save the styles
      fs.writeFileSync(
        path.join(paths.client, `${builder.document.id}.css`),
        await builder.styles()
      );
    }
  }
  //if there's a manifest path
  if (typeof paths.manifest === 'string') {
    //save the manifest
    fs.writeFileSync(paths.manifest, compiler.manifest.toJson());
  }
};