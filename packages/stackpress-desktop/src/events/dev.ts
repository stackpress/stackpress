//modules
import { action } from '@stackpress/ingest/Server';

//client
import { normalizeDesktopConfig } from '../config.js';
import MenuRegistry from '../MenuRegistry.js';
import {
  dispatchDesktopMenuEvent,
  getDesktopPlugin,
  markDesktopInitialized
} from '../plugin.js';
import {
  compileDesktopMenuTemplate,
  launchDesktopElectron,
  startDesktopRuntime
} from '../runtime.js';
import type { DesktopConfig } from '../types.js';

//Terminal shape used when dev mode emits human-readable runtime progress.
type DesktopTerminal = {
  verbose?: boolean;
  control?: {
    system(message: string): unknown;
  };
};

/**
 * Handle the desktop:dev terminal event.
 */
export default action(async function DesktopDev({ res, ctx }) {
  const terminal = ctx.plugin<DesktopTerminal>('terminal');
  const desktop = getDesktopPlugin(ctx);

  //load base config from the Stackpress config tree before contribution hooks
  desktop.config = ctx.config.path<DesktopConfig>('desktop', {});
  await ctx.resolve('desktop:config');

  //normalize config after contribution hooks have applied all patches
  const config = normalizeDesktopConfig(desktop.config);
  desktop.config = config;

  //collect menu contributions before marking desktop initialized
  await ctx.resolve('desktop:menu');
  const menuGroups = desktop.menu instanceof MenuRegistry
    ? desktop.menu.compile()
    : [];

  //compile menu groups for the in-process runtime adapter
  const menu = compileDesktopMenuTemplate(
    menuGroups,
    async event => {
      //dispatch menu events through Stackpress so app plugins own behavior
      await dispatchDesktopMenuEvent(ctx, event);
    }
  );

  //after this point config and menu contributions are closed
  markDesktopInitialized(ctx);

  //start the local runtime before launching Electron against its URL
  const runtime = await startDesktopRuntime(ctx, config);
  try {
    const electron = await launchDesktopElectron(
      config,
      { ...runtime, menu: menuGroups },
      { cwd: ctx.loader.cwd }
    );

    //store runtime details for callers before waiting on Electron exit
    terminal?.verbose && terminal.control?.system(
      `Desktop app is running at ${runtime.url}`
    );
    res.data.set('desktop', {
      host: runtime.host,
      port: runtime.port,
      url: runtime.url,
      main: electron.files.mainPath,
      preload: electron.files.preloadPath,
      menu
    });
    res.statusCode(200);
    await electron.closed;
  } finally {
    //always close the loopback server when Electron exits or launch fails
    await runtime.close();
  }
});
