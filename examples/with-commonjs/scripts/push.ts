//stackpress
import type { Engine } from 'stackpress/sql';
import * as scripts from 'stackpress/scripts';
//config
import { bootstrap } from '../config/develop';

async function push() {
  const server = await bootstrap();
  const database = server.plugin<Engine>('database');
  await scripts.push(server, database);
};

push()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });