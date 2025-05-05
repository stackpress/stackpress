//stackpress
import type Server from '@stackpress/ingest/Server';
//module plugins
import client from './client/plugin.js';
import types from './types/plugin.js';
import sql from './sql/plugin.js';
import view from './view/plugin.js';
import admin from './admin/plugin.js';
import language from './language/plugin.js';
import session from './session/plugin.js';
import api from './api/plugin.js';

export default async function plugin(server: Server) {
  //load the plugins
  client(server);
  types(server);
  sql(server);
  view(server);
  admin(server);
  language(server);
  session(server);
  api(server);
};