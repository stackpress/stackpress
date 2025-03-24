//stackpress
import type Server from '@stackpress/ingest/dist/Server';

export default function serve(server: Server<any, any, any>, port = 3000) {
  //start the server
  server.create().listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('------------------------------');
  });
};