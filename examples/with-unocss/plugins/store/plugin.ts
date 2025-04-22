//stackpress
import type { Server } from 'stackpress/server';
//util
import connect from './connect.js';

export default function plugin(server: Server) {
  //on config, register the store
  server.on('config', async _ => {
    server.register('database', await connect());
  });
};