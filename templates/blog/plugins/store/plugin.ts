//stackpress
import type { Server } from 'stackpress/server';
//util
import connect from './connect.js';

export default function plugin(server: Server) {
  //on config, register the store
  server.on('config', async _ => {
    const connection = await connect();
    connection.before = async request => {
      console.log('Executing query:', request);
    };
    server.register('database', connection);
  });
  //on listen, add populate event
  server.on('listen', async _ => {
    server.on('populate', () => import('./populate.js'));
  });
};