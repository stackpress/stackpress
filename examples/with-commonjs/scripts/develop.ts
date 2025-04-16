//config
import { bootstrap } from '../config/develop';

async function develop() {
  //get server
  const server = await bootstrap();
  //get server port
  const port = server.config.path<number>('server.port', 3000);
  //start the server
  server.create().listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('------------------------------');
  });
};

develop().catch(e => {
  console.error(e);
  process.exit(1);
});