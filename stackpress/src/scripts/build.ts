//node
import path from 'node:path';
//reactus
import * as reactus from 'reactus';
//stackpress
import type Server from '@stackpress/ingest/Server';

export default async function build(server: Server<any, any, any>) {
  //get current working directory
  const cwd = server.config.path('server.cwd', process.cwd());
  //vite plugins
  const plugins = server.config.path('view.engine.plugins', []);
  //filepath to a global css file
  const cssFiles = server.config.path('view.engine.cssFiles', []);
  //path where to save assets (css, images, etc)
  const assetPath = server.config.path(
    'view.engine.assetPath', 
    path.join(cwd, '.build/assets')
  );
  //path where to save and load (live) the client scripts (js)
  const clientPath = server.config.path(
    'view.engine.clientPath', 
    path.join(cwd, '.build/client')
  );
  //path where to save and load (live) the server script (js)
  const pagePath = server.config.path(
    'view.engine.pagePath', 
    path.join(cwd, '.build/pages')
  );
  const engine = reactus.build({
    cwd,
    plugins,
    assetPath,
    clientPath,
    pagePath,
    cssFiles
  });

  //add views
  //event -> [ ...{ entry, priority } ]
  for (const views of server.views.values()) {
    for (const view of views) {
      await engine.set(view.entry);
    }
  }

  if (engine.size === 0) {
    return [];
  }

  const responses = [
    ...await engine.buildAllClients(),
    ...await engine.buildAllAssets(),
    ...await engine.buildAllPages()
  ].map(response => {
    const results = response.results;
    if (typeof results?.contents === 'string') {
      results.contents = results.contents.substring(0, 100) + ' ...';
    }
    return results;
  });

  return responses;
};