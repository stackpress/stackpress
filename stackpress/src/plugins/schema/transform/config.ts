//node
import path from 'node:path';
//modules
import type { Directory } from 'ts-morph';
//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser';
import type Server from '@stackpress/ingest/Server';
//schema
import Revisions from '../../../schema/Revisions';

/**
 * This is the The params comes form the cli
 */
export default async function generate(
  directory: Directory, 
  schema: SchemaConfig, 
  server: Server
) {
  //need revisions path
  const revisions = server.config.path<string>('client.revisions');
  //if can revision
  if (revisions) {
    //add a new revision
    Revisions.insert(revisions, server.loader, schema);
  }

  const fs = server.loader.fs;

  const pwd = directory.getPath();
  if (!await fs.exists(pwd)) {
    await fs.mkdir(pwd, { recursive: true });
  }
  await fs.writeFile(
    path.join(pwd, 'config.json'), 
    JSON.stringify(schema, null, 2)
  );
};