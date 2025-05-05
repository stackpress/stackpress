//node
import path from 'node:path';
//stackpress
import type Server from '@stackpress/ingest/Server';
import type Request from '@stackpress/ingest/Request';
import { action } from '@stackpress/ingest/Server';
//types
//terminal
import type { CLIPlugin } from '../types.js';
//scripts
import generate from '../../scripts/generate.js';

export default action(async function GenerateScript(req, res, ctx) {
  //if client config is not set, dont generate client
  if (!ctx.config.has('client')) return;
  //get terminal
  const cli = ctx.plugin<CLIPlugin>('cli');
  //get tsconfig
  const tsconfig = ctx.config.path<string>('client.tsconfig');
  //if no tsconfig path,
  if (!tsconfig) {
    cli?.verbose && cli.control.error('Missing tsconfig path');
    res.setError('Missing tsconfig path');
    return;
  }
  const idea = getIdeaPath(ctx, req);
  await generate(ctx, idea, tsconfig, cli);
  //OK
  res.setStatus(200);
});

export function getIdeaPath(server: Server, req: Request) {
  //determine the input schema.idea
  const defaultPath = path.join(server.loader.cwd, 'schema.idea');
  //first try to get the idea from the config
  const config = server.config.path('cli.idea', defaultPath);
  //next try to get the idea from the request (allows override)
  const input = req.data.path('input', config);
  //next try to get the idea from the request (allows override)
  return req.data.path('i', input);
};