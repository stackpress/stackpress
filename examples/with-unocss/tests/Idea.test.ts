import { describe, before } from 'mocha';
//stackpress
import type Engine from '@stackpress/inquire/dist/Engine';
//incept
import drop from '@stackpress/incept-inquire/dist/scripts/drop';
import install from '@stackpress/incept-inquire/dist/scripts/install';
import clientTests from '@stackpress/.incept/tests';
//src
import bootstrap from '../plugins/bootstrap';

describe('Idea Tests', async () => {
  //make a new server
  const server = await bootstrap('production');
  //before all tests...
  before(async () => {  
    //get database
    const database = server.plugin<Engine>('database');
    //drop and install database
    await drop(server, database);
    await install(server, database);
  });
  //run client tests
  clientTests(server);
});