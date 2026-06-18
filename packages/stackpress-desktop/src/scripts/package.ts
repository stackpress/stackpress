//node
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';

//client
import { resolveDesktopPath } from '../runtime.js';
import type {
  DesktopPackageArtifact,
  NormalizedDesktopConfig
} from '../types.js';

//Electron builder options are the subset used by this package's packaging
// adapter and by tests that inject a fake builder.
export type ElectronBuilderOptions = {
  config: Record<string, unknown>;
  projectDir?: string;
  dir?: boolean;
};

//Electron builder function signature used by the package adapter.
export type ElectronBuilder = (
  options: ElectronBuilderOptions
) => Promise<string[] | void>;

//Packaging options allow tests or callers to control cwd and builder import.
export type PackageDesktopOutputOptions = {
  cwd?: string;
  builder?: ElectronBuilder;
};

//Dynamic electron-builder import result shape.
type ElectronBuilderModule = {
  build?: ElectronBuilder;
};

/**
 * Find the installed Electron package version from cwd or an ancestor folder.
 */
function getElectronVersion(cwd: string) {
  let current = cwd;

  //walk upward because workspaces may hoist Electron to the monorepo root
  while (true) {
    const metadataPath = path.join(current, 'node_modules/electron/package.json');

    //when package metadata exists, read the version used by electron-builder
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8')) as {
        version?: unknown;
      };
      return typeof metadata.version === 'string' ? metadata.version : undefined;
    }

    //stop once the filesystem root has been reached
    const parent = path.dirname(current);
    if (parent === current) {
      return undefined;
    }
    current = parent;
  }
}

/**
 * Import electron-builder at runtime so normal package imports stay lightweight.
 */
async function importElectronBuilder(): Promise<ElectronBuilder> {
  //dynamic import through Function avoids TypeScript resolving optional builder
  // types into the emitted runtime bundle.
  const importer = new Function(
    'specifier',
    'return import(specifier)'
  ) as (specifier: string) => Promise<ElectronBuilderModule>;
  const module = await importer('electron-builder');

  //packaging requires the build function from electron-builder
  if (typeof module.build !== 'function') {
    throw new Error('Install electron-builder before packaging desktop output.');
  }
  return module.build;
}

/**
 * Return the current packaging platform identifier.
 */
export function getDesktopPackagePlatform() {
  //platform is included in package artifact output for diagnostics
  return `${os.platform()}-${os.arch()}`;
}

/**
 * Create a standard package failure payload.
 */
function createDesktopPackageFailure(outputPath: string, message: string) {
  //the message always points callers back to desktop build output first
  return {
    status: 'failed' as const,
    tool: 'electron-builder' as const,
    platform: getDesktopPackagePlatform(),
    outputPath,
    message: `Desktop package failed. Check desktop build output at ${outputPath}, then run desktop:build before retrying. ${message}`
  };
}

/**
 * Create the electron-builder file list for a self-hosted Stackpress app.
 */
function createPackageFileList(
  cwd: string,
  paths: {
    mainPath: string;
    preloadPath: string;
    manifestPath: string;
    buildDirectory: string;
  }
) {
  return [
    'package.json',
    'schema.idea',
    'tsconfig.json',
    'uno.config.ts',
    {
      from: path.dirname(paths.mainPath),
      filter: [ path.basename(paths.mainPath) ],
      to: '.'
    },
    {
      from: path.dirname(paths.preloadPath),
      filter: [ path.basename(paths.preloadPath) ],
      to: '.'
    },
    {
      from: path.dirname(paths.manifestPath),
      filter: [ path.basename(paths.manifestPath) ],
      to: '.'
    },
    {
      from: resolveDesktopPath(cwd, paths.buildDirectory),
      to: 'desktop'
    },
    {
      from: resolveDesktopPath(cwd, 'config'),
      to: 'config'
    },
    {
      from: resolveDesktopPath(cwd, 'plugins'),
      to: 'plugins'
    },
    {
      from: resolveDesktopPath(cwd, 'public'),
      to: 'public'
    },
    {
      from: resolveDesktopPath(cwd, '.build/database'),
      to: '.build/database',
      filter: [ '**/*', '!postmaster.pid' ]
    },
    {
      from: resolveDesktopPath(cwd, 'node_modules/blog-client'),
      to: 'node_modules/blog-client'
    }
  ];
}

/**
 * Package generated desktop output with electron-builder.
 */
export async function packageDesktopOutput(
  config: NormalizedDesktopConfig,
  options: PackageDesktopOutputOptions = {}
): Promise<DesktopPackageArtifact> {
  //resolve all generated inputs and final output paths before validation
  const cwd = options.cwd || process.cwd();
  const packageOutput = config.package.output || '.build/releases';
  const buildDirectory = config.build.directory || '.build/desktop';
  const mainPath = resolveDesktopPath(cwd, config.build.main || '.build/desktop/main.js');
  const preloadPath = resolveDesktopPath(cwd, config.build.preload || '.build/desktop/preload.js');
  const manifestPath = resolveDesktopPath(
    cwd,
    config.build.manifest || '.build/desktop/manifest.json'
  );
  const outputPath = resolveDesktopPath(cwd, packageOutput);
  try {
    //fail before importing electron-builder when required build artifacts are
    // missing.
    const missingInput = [
      [ 'manifest', manifestPath ],
      [ 'main entry', mainPath ],
      [ 'preload entry', preloadPath ]
    ].find(([, file]) => !fs.existsSync(file));
    if (missingInput) {
      const [ label, file ] = missingInput;
      return createDesktopPackageFailure(
        outputPath,
        `Desktop build output is missing the ${label} at ${file}.`
      );
    }

    //use injected builder in tests or import electron-builder in real runs
    const builder = options.builder || await importElectronBuilder();

    //ask electron-builder for current-platform distributables so package
    // commands refresh installer artifacts as well as the unpacked app.
    const artifacts = await builder({
      projectDir: cwd,
      dir: false,
      config: {
        asarUnpack: [
          'config/**/*',
          'plugins/**/*',
          'public/**/*',
          '.build/database/**/*',
          'node_modules/**/*',
          'package.json',
          'schema.idea',
          'tsconfig.json',
          'uno.config.ts'
        ],
        appId: config.app.id,
        productName: config.app.name,
        electronVersion: getElectronVersion(cwd),
        extraMetadata: {
          main: 'main.js'
        },
        files: createPackageFileList(cwd, {
          mainPath,
          preloadPath,
          manifestPath,
          buildDirectory
        }),
        directories: {
          output: outputPath
        }
      }
    }) || [];

    //electron-builder may return no artifacts for some modes, so fall back to
    // the output directory that contains the created package.
    const artifactPath = artifacts[0] || outputPath;
    return {
      status: 'created',
      tool: 'electron-builder',
      platform: getDesktopPackagePlatform(),
      outputPath: artifactPath,
      message: `Created desktop package at ${artifactPath}.`
    };
  } catch (error) {
    //return failures as data so CLI callers get actionable messages without a
    // stack trace.
    const message = error instanceof Error ? error.message : String(error);
    return createDesktopPackageFailure(outputPath, message);
  }
}

/**
 * Invoke the desktop package event through a Stackpress server instance.
 */
export default async function packageDesktop(
  server: { resolve(event: string): Promise<unknown> }
) {
  //scripts stay thin wrappers around the event lifecycle
  return await server.resolve('desktop:package');
}
