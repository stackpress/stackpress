//modules
import { action } from '@stackpress/ingest/Server';
//stackpress/scripts
import develop from '../scripts/develop.js';
//stackpress/terminal
import type { TerminalPlugin } from '../types.js';

export default action(async function DevelopScript(_req, res, ctx) {
  //terminal setup
  const terminal = ctx.plugin<TerminalPlugin>('terminal');
  //start the server
  await develop(terminal);
  res.setStatus(200);
});