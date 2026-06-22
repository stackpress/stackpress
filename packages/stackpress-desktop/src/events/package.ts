//modules
import { action } from '@stackpress/ingest/Server';

//client
import { normalizeDesktopConfig } from '../config.js';
import { packageDesktopOutput } from '../scripts/package.js';
import type { DesktopConfig } from '../types.js';

//Terminal shape used by the package action for optional verbose progress.
type DesktopPackageTerminal = {
  verbose?: boolean;
  control?: {
    system(message: string): unknown;
    success(message: string): unknown;
    error(message: string): unknown;
  };
};

/**
 * Handle the desktop:package terminal event.
 */
export default action(async function DesktopPackage({ res, ctx }) {
  const terminal = ctx.plugin<DesktopPackageTerminal>('terminal');

  //package uses normalized config so the packaging adapter receives complete
  // paths and metadata.
  const config = normalizeDesktopConfig(
    ctx.config.path<DesktopConfig>('desktop', {})
  );

  //verbose mode announces the packaging adapter before it starts
  terminal?.verbose && terminal.control?.system(
    'Packaging desktop output with electron-builder...'
  );
  const artifact = await packageDesktopOutput(config, { cwd: ctx.loader.cwd });

  //created artifacts are success responses, while actionable failures are
  //returned as status code 1 so terminal callers can fail the command.
  if (artifact.status === 'created') {
    terminal?.verbose && terminal.control?.success(artifact.message);
    res.statusCode(200);
  } else {
    terminal?.verbose && terminal.control?.error(artifact.message);
    res.statusCode(1);
  }

  //store the artifact or failure payload for command callers
  res.data.set('desktop', artifact);
});
