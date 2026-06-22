//modules
import { action } from '@stackpress/ingest/Server';

//client
import { normalizeDesktopConfig } from '../config.js';
import MenuRegistry from '../MenuRegistry.js';
import {
  getDesktopPlugin,
  markDesktopInitialized
} from '../plugin.js';
import { collectDesktopRoutes } from '../routeRules.js';
import { writeDesktopBuildOutput } from '../scripts/build.js';
import type {
  DesktopBuildOutput,
  DesktopCompiledMenuGroup,
  DesktopConfig,
  DesktopRouteRecord,
  NormalizedDesktopConfig
} from '../types.js';

//Terminal shape used by the build action when the optional terminal plugin is
// registered by the running Stackpress app.
type DesktopBuildTerminal = {
  verbose?: boolean;
  control?: {
    system(message: string): unknown;
    success(message: string): unknown;
  };
};

//Build output options let tests and event handlers control cwd, route metadata,
// and whether the normal Stackpress build lifecycle should run.
export type CreateDesktopBuildOutputOptions = {
  cwd?: string;
  menu?: DesktopCompiledMenuGroup[];
  registeredRoutes?: DesktopRouteRecord[];
  runStackpressBuild?: () => Promise<unknown>;
};

/**
 * Run the Stackpress build lifecycle and write desktop build artifacts.
 */
export async function createDesktopBuildOutput(
  config: NormalizedDesktopConfig,
  options: CreateDesktopBuildOutputOptions = {}
): Promise<DesktopBuildOutput> {
  //run the app build first so generated desktop artifacts point at fresh app
  // output.
  await options.runStackpressBuild?.();

  //then write the desktop manifest and generated Electron entry files
  return await writeDesktopBuildOutput(config, {
    cwd: options.cwd,
    menu: options.menu,
    registeredRoutes: options.registeredRoutes
  });
}

/**
 * Handle the desktop:build terminal event.
 */
export default action(async function DesktopBuild({ res, ctx }) {
  const terminal = ctx.plugin<DesktopBuildTerminal>('terminal');
  const desktop = getDesktopPlugin(ctx);

  //load base config from the Stackpress config tree before contribution hooks
  desktop.config = ctx.config.path<DesktopConfig>('desktop', {});
  await ctx.resolve('desktop:config');

  //normalize config after contribution hooks have applied all patches
  const config = normalizeDesktopConfig(desktop.config);
  desktop.config = config;

  //collect menu contributions before packaged Electron source is generated
  await ctx.resolve('desktop:menu');
  const menu = desktop.menu instanceof MenuRegistry
    ? desktop.menu.compile()
    : [];
  const registeredRoutes = collectDesktopRoutes(ctx);

  //verbose mode mirrors the existing terminal plugin convention
  terminal?.verbose && terminal.control?.system(
    'Running Stackpress build lifecycle...'
  );

  //create the output after running the normal build lifecycle
  const output = await createDesktopBuildOutput(config, {
    cwd: ctx.loader.cwd,
    menu,
    registeredRoutes,
    runStackpressBuild: async () => await ctx.resolve('build')
  });

  //after build artifacts are generated, late desktop contributions would desync
  // packaged source from plugin state.
  markDesktopInitialized(ctx);

  //report output location and store the build payload on the response
  terminal?.verbose && terminal.control?.success(
    `Desktop build output written to ${output.manifestPath}`
  );
  res.data.set('desktop', output);
  res.statusCode(200);
});
