//modules
import type { BuildStatus } from 'reactus/types';
import type Server from '@stackpress/ingest/Server';
import * as reactus from 'reactus';
//stackpress/terminal
import Terminal from '../terminal/Terminal.js';

export default async function build(
  server: Server<any, any, any>,
  terminal?: Terminal
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
    terminal?.verbose && terminal.control.system('Building clients...');
    responses.push(await engine.buildAllClients() as BuildStatus);
    terminal?.verbose && terminal.control.success('Clients built.');
  }
  if (assetPath) {
    terminal?.verbose && terminal.control.system('Building assets...');
    responses.push(await engine.buildAllAssets() as BuildStatus);
    terminal?.verbose && terminal.control.success('Assets built.');
  }
  if (pagePath) {
    terminal?.verbose && terminal.control.system('Building pages...');
    responses.push(await engine.buildAllPages() as BuildStatus);
    terminal?.verbose && terminal.control.success('Pages built.');
  }

  return responses.map(response => {
    const results = response.results;
    if (typeof results?.contents === 'string') {
      results.contents = results.contents.substring(0, 100) + ' ...';
    }
    return results;
  });
};