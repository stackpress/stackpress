//stackpress
import type Server from '@stackpress/ingest/Server';
//module plugins
import client from './client/plugin';
import types from './types/plugin';
import sql from './sql/plugin';
import view from './view/plugin';
import admin from './admin/plugin';
import language from './language/plugin';
import session from './session/plugin';
import api from './api/plugin';

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