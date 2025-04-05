//stackpress
import type { Engine } from 'stackpress/sql';
//plugins
import bootstrap from '../plugins/bootstrap';

async function query() {
  const server = await bootstrap();
  const database = server.plugin<Engine>('database');
  const query = process.argv.slice(2).pop();
  if (query) {
    console.log(await database.query(query.replace(/\\/g, "'")));
  }
};

query()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });