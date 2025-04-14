//config
import { bootstrap } from '../config/preview';

async function serve() {
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

serve().catch(e => {
  console.error(e);
  process.exit(1);
});