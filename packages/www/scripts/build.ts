//node
import fs from 'node:fs/promises';
import path from 'node:path';
//modules
import type { NestedObject } from '@stackpress/lib/types';
import type Server from '@stackpress/ingest/Server';
import { Terminal } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
import * as scripts from 'stackpress-view/scripts';
//client
import { docs } from '../config/common.js';
import { getApiDocResults, getApiShelfResults } from '../plugins/api/helpers.js';
import { docs as apiDocs } from '../plugins/api/manifest.js';
import {
  getGuideDocResults,
  getGuideShelfResults
} from '../plugins/guides/helpers.js';
import { docs as guideDocs } from '../plugins/guides/manifest.js';
import { getHomeResults } from '../plugins/home/helpers.js';
import bootstrap from '../config/build.js';

type StaticArtifact = {
  entry: string;
  path: string;
  results: NestedObject;
};

const apiDocView = '@/plugins/api/views/doc';
const apiShelfView = '@/plugins/api/views/shelf';
const generatedPublicPaths = [
  'assets',
  'client'
];
const guideDocView = '@/plugins/guides/views/doc';
const guideShelfView = '@/plugins/guides/views/shelf';
const homeView = '@/plugins/home/views/home';

/**
 * Builds the GitHub Pages-ready static documentation output.
 */
async function build() {
  const server = await bootstrap();
  const cli = new Terminal([ 'build' ], server);

  registerStaticViews(server);

  cli.control.system('Cleaning generated public assets...');
  await cleanGeneratedPublic(cli.cwd);

  cli.control.system('Building pages, client and styles...');
  await scripts.build(server);

  cli.control.system('Cleaning docs output...');
  await fs.rm(docs, { force: true, recursive: true });

  cli.control.system('Copying public to docs...');
  await fsCopyFolder(path.join(cli.cwd, 'public'), docs);

  cli.control.system('Generating markup in docs...');
  for (const artifact of await getStaticArtifacts()) {
    cli.control.system(`Generating ${artifact.path} ...`);
    await fsWriteFile(
      path.join(docs, getArtifactFilepath(artifact.path)),
      await renderStaticArtifact(server, artifact)
    );
  }

  cli.control.system('Cleaning generated public assets...');
  await cleanGeneratedPublic(cli.cwd);
  await fs.rm(path.join(cli.cwd, '.build'), { force: true, recursive: true });
}

/**
 * Removes client and asset output that Stackpress emits during bundling.
 */
async function cleanGeneratedPublic(cwd: string) {
  for (const segment of generatedPublicPaths) {
    await fs.rm(path.join(cwd, 'public', segment), {
      force: true,
      recursive: true
    });
  }
}

/**
 * Registers view actions used only by the static artifact generator.
 */
function registerStaticViews(server: Server<any, any>) {
  server.view.action('static:api:doc', apiDocView);
  server.view.action('static:api:shelf', apiShelfView);
  server.view.action('static:guides:doc', guideDocView);
  server.view.action('static:guides:shelf', guideShelfView);
  server.view.action('static:home', homeView);
}

/**
 * Returns every static page the docs build should write.
 */
async function getStaticArtifacts() {
  return [
    getHomeArtifact(),
    getGuidesShelfArtifact(),
    ...await getGuideDocArtifacts(),
    getApiShelfArtifact(),
    ...await getApiDocArtifacts()
  ];
}

/**
 * Creates the home page artifact.
 */
function getHomeArtifact(): StaticArtifact {
  return {
    entry: homeView,
    path: '/',
    results: getHomeResults()
  };
}

/**
 * Creates the guide index artifact.
 */
function getGuidesShelfArtifact(): StaticArtifact {
  return {
    entry: guideShelfView,
    path: '/guides',
    results: getGuideShelfResults()
  };
}

/**
 * Creates an artifact for each generated guide page.
 */
async function getGuideDocArtifacts() {
  return await Promise.all(guideDocs.map(async item => {
    const results = await getGuideDocResults(item.href);
    if (!results) {
      throw new Error(`Unable to build guide artifact for ${item.href}`);
    }

    return {
      entry: guideDocView,
      path: item.href,
      results
    };
  }));
}

/**
 * Creates the API index artifact.
 */
function getApiShelfArtifact(): StaticArtifact {
  return {
    entry: apiShelfView,
    path: '/api',
    results: getApiShelfResults()
  };
}

/**
 * Creates an artifact for each generated API reference page.
 */
async function getApiDocArtifacts() {
  return await Promise.all(apiDocs.map(async item => {
    const results = await getApiDocResults(item.href);
    if (!results) {
      throw new Error(`Unable to build API artifact for ${item.href}`);
    }

    return {
      entry: apiDocView,
      path: item.href,
      results
    };
  }));
}

async function renderStaticArtifact(
  server: Server<any, any>,
  artifact: StaticArtifact
) {
  const url = new URL(`https://www.stackpress.io${artifact.path}`);
  const request = server.request({ url });
  const response = server.response();
  response.results(artifact.results);
  setViewProps(request, response, server);
  const html = await server.view.render(artifact.entry, {
    data: {
      ...server.config.path('view.props', {}),
      ...(response.data() as Record<string, unknown>)
    },
    request: {
      data: request.data(),
      headers: Object.fromEntries(request.headers.entries()),
      method: request.method,
      mime: request.mimetype,
      session: request.session.data,
      url: {
        hash: request.url.hash,
        host: request.url.host,
        hostname: request.url.hostname,
        href: request.url.href,
        origin: request.url.origin,
        pathname: request.url.pathname,
        port: request.url.port,
        protocol: request.url.protocol,
        search: request.url.search
      }
    },
    response: response.toStatusResponse(),
    session: undefined
  });
  return html || '';
}

/**
 * Converts a route path into a GitHub Pages-friendly output path.
 */
function getArtifactFilepath(pathname: string) {
  const routepath = pathname.replace(/^\//, '').replace(/\/$/, '');
  return routepath === '' ? 'index.html' : `${routepath}/index.html`;
}

/**
 * Writes a file after ensuring its parent directory exists.
 */
async function fsWriteFile(file: string, data: string) {
  const dirname = path.dirname(file);
  if (!await fsExists(dirname)) {
    await fs.mkdir(dirname, { recursive: true });
  }
  await fs.writeFile(file, data, 'utf-8');
}

/**
 * Copies one file when the source exists.
 */
async function fsCopyFile(source: string, destination: string) {
  if (await fsExists(source)) {
    const dirname = path.dirname(destination);
    if (!await fsExists(dirname)) {
      await fs.mkdir(dirname, { recursive: true });
    }
    await fs.copyFile(source, destination);
  }
}

/**
 * Recursively copies a source folder into a destination folder.
 */
async function fsCopyFolder(source: string, destination: string) {
  // find all the files from source
  const files = await fs.readdir(source);
  for (const file of files) {
    // ignore . and ..
    if (file === '.' || file === '..') continue;
    // make an absolute source path
    const absolute = path.join(source, file);
    const stat = await fs.stat(absolute);
    // if file is a directory, recurse
    if (stat.isDirectory()) {
      await fsCopyFolder(
        path.join(source, file),
        path.join(destination, file)
      );
      continue;
    }
    await fsCopyFile(absolute, path.join(destination, file));
  }
}

/**
 * Checks whether a file or folder exists.
 */
async function fsExists(path: string) {
  return await fs.access(path).then(() => true).catch(() => false);
}

build().then(() => {
  console.log('Build completed successfully.');
  process.exit(0);
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
