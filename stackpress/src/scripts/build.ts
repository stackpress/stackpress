//reactus
import type { BuildStatus } from 'reactus/types';
import * as reactus from 'reactus';
//stackpress
import type Server from '@stackpress/ingest/Server';
//terminal
import Terminal from '../terminal/Terminal.js';

export default async function build(
  server: Server<any, any, any>,
  cli?: Terminal
) {
  //get current working directory
  const cwd = server.config.path('server.cwd', process.cwd());
  //vite plugins
  const plugins = server.config.path('view.engine.plugins', []);
  //filepath to a global css file
  const cssFiles = server.config.path('view.engine.cssFiles', []);
  //path where to save assets (css, images, etc)
  const assetPath = server.config.path('view.engine.assetPath');
  //path where to save and load (live) the client scripts (js)
  const clientPath = server.config.path('view.engine.clientPath');
  //path where to save and load (live) the server script (js)
  const pagePath = server.config.path('view.engine.pagePath');
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

  const responses: BuildStatus[] = [];
  if (clientPath) {
    cli?.verbose && cli.control.system('Building clients...');
    responses.push(await engine.buildAllClients() as BuildStatus);
    cli?.verbose && cli.control.success('Clients built.');
  }
  if (assetPath) {
    cli?.verbose && cli.control.system('Building assets...');
    responses.push(await engine.buildAllAssets() as BuildStatus);
    cli?.verbose && cli.control.success('Assets built.');
  }
  if (pagePath) {
    cli?.verbose && cli.control.system('Building pages...');
    responses.push(await engine.buildAllPages() as BuildStatus);
    cli?.verbose && cli.control.success('Pages built.');
  }

  return responses.map(response => {
    const results = response.results;
    if (typeof results?.contents === 'string') {
      results.contents = results.contents.substring(0, 100) + ' ...';
    }
    return results;
  });
};