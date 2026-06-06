#!/usr/bin/env node

//node
import {
  cp,
  mkdir,
  readdir,
  readFile,
  realpath,
  rename,
  rm,
  stat,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// supported skill installer shortcuts and their default homes
const knownTargets = new Map([
  ['codex', { env: 'CODEX_HOME', path: ['.codex', 'skills'] }],
  ['claude', { env: 'CLAUDE_HOME', path: ['.claude', 'skills'] }],
  [
    'opencode',
    { env: 'OPENCODE_HOME', path: ['.config', 'opencode', 'skills'] }
  ]
]);

// folders that are not active skills and should never be installed
const ignoredSkillDirectories = new Set(['archives', 'node_modules', '.git']);

// harmless folder artifacts allowed when creating a new project
const ignoredEmptyDirectoryEntries = new Set(['.DS_Store']);

// npm package names are intentionally stricter than folder names
const packageNamePattern = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;

// npm reserves these names even though they match the basic package shape
const reservedPackageNames = new Set(['node_modules', 'favicon.ico']);

/**
 * Copies all active Stackpress skill folders into the target directory.
 */
async function copySkills(options) {
  const source = options.source;
  const target = options.target;
  const dryRun = options.dryRun ?? false;
  const force = options.force ?? false;
  const installed = [];
  const skipped = [];

  const entries = await readdir(source, { withFileTypes: true });
  await assertInstallDirectory(target, { create: !dryRun });

  for (const entry of entries) {
    // only active skill directories are candidates for installation
    if (!entry.isDirectory() || ignoredSkillDirectories.has(entry.name)) {
      continue;
    }

    const skillSource = path.join(source, entry.name);
    const skillTarget = path.join(target, entry.name);
    const skillStat = await safeStat(skillTarget);

    // existing installs are preserved unless the caller opted into overwrite
    if (skillStat && !force) {
      skipped.push(entry.name);
      continue;
    }

    installed.push(entry.name);

    // dry-runs report the same plan without mutating the filesystem
    if (dryRun) {
      continue;
    }

    if (skillStat) {
      await rm(skillTarget, { force: true, recursive: true });
    }

    await cp(skillSource, skillTarget, {
      force: true,
      recursive: true,
      verbatimSymlinks: true
    });
  }

  installed.sort();
  skipped.sort();

  return { installed, skipped };
}

/**
 * Copies the bundled Stackpress app scaffold into an empty target folder.
 */
async function createProject(options) {
  const source = options.source;
  const target = options.target;
  const dryRun = options.dryRun ?? false;
  const packageName = path.basename(path.resolve(target));

  assertValidPackageName(packageName);
  await assertEmptyDirectory(target, { create: !dryRun });
  await assertValidScaffoldSource(source);

  if (dryRun) {
    return { packageName };
  }

  await cp(source, target, {
    force: true,
    recursive: true,
    verbatimSymlinks: true
  });

  await renameScaffoldGitignore(target);
  await writePackageName(target, packageName);

  return { packageName };
}

/**
 * Parses top-level CLI arguments into a command-specific option object.
 */
function parseArgs(args) {
  const [command, ...rest] = args;

  if (!command) {
    throw new Error('Missing command. Usage: stackpress <skills|create>');
  }

  if (command === 'create') {
    return parseCreateArgs(rest);
  }

  if (command === 'skills') {
    return parseSkillsArgs(rest);
  }

  throw new Error(`Unknown command "${command}". Usage: stackpress <skills|create>`);
}

/**
 * Resolves a skill installer shortcut or direct path to an install directory.
 */
function resolveTargetDirectory(target, options = {}) {
  const env = options.env ?? process.env;
  const home = options.home ?? os.homedir();
  const cwd = options.cwd ?? process.cwd();
  const normalized = target.toLowerCase();
  const knownTarget = knownTargets.get(normalized);

  if (knownTarget) {
    const configuredHome = env[knownTarget.env];

    if (configuredHome) {
      return path.resolve(expandHome(configuredHome, home), 'skills');
    }

    return path.resolve(home, ...knownTarget.path);
  }

  return path.resolve(cwd, expandHome(target, home));
}

/**
 * Ensures create can only run in an empty or missing target directory.
 */
async function assertEmptyDirectory(target, options = {}) {
  const shouldCreate = options.create ?? true;
  const targetStat = await safeStat(target);

  if (!targetStat) {
    if (shouldCreate) {
      await mkdir(target, { recursive: true });
    }
    return;
  }

  if (!targetStat.isDirectory()) {
    throw new Error(`Target path must be an empty directory: ${target}`);
  }

  const entries = await readdir(target);
  const blockingEntries = entries.filter((entry) => (
    !ignoredEmptyDirectoryEntries.has(entry)
  ));

  if (blockingEntries.length > 0) {
    throw new Error(`Target directory must be empty: ${target}`);
  }
}

/**
 * Ensures skills install into a directory path.
 */
async function assertInstallDirectory(target, options = {}) {
  const shouldCreate = options.create ?? true;
  const targetStat = await safeStat(target);

  if (!targetStat) {
    if (shouldCreate) {
      await mkdir(target, { recursive: true });
    }
    return;
  }

  if (!targetStat.isDirectory()) {
    throw new Error(`Target path must be a directory: ${target}`);
  }
}

/**
 * Rejects folder names that cannot be used as npm package names.
 */
function assertValidPackageName(packageName) {
  const isValidLength = packageName.length > 0 && packageName.length <= 214;
  const isValidShape = packageNamePattern.test(packageName);
  const isReserved = reservedPackageNames.has(packageName);

  if (!isValidLength || !isValidShape || isReserved) {
    throw new Error(`Invalid package name from folder: ${packageName}`);
  }
}

/**
 * Ensures the scaffold has required files before anything is copied.
 */
async function assertValidScaffoldSource(source) {
  const packagePath = path.join(source, 'package.json');
  const safeGitignorePath = path.join(source, 'gitignore');

  if (!await safeStat(packagePath)) {
    throw new Error('Scaffold template is missing package.json');
  }

  await readPackageJson(packagePath);

  if (!await safeStat(safeGitignorePath)) {
    throw new Error('Scaffold template is missing gitignore');
  }
}

/**
 * Expands a leading home marker while preserving normal paths.
 */
function expandHome(value, home) {
  if (value === '~') {
    return home;
  }

  if (value.startsWith(`~${path.sep}`) || value.startsWith('~/')) {
    return path.join(home, value.slice(2));
  }

  return value;
}

/**
 * Returns true when this module is running as the package executable.
 */
async function isEntrypoint() {
  if (!process.argv[1]) {
    return false;
  }

  const modulePath = fileURLToPath(import.meta.url);

  try {
    return await realpath(process.argv[1]) === await realpath(modulePath);
  } catch {
    return path.resolve(process.argv[1]) === modulePath;
  }
}

/**
 * Handles the create command output and scaffold operation.
 */
async function main() {
  const options = parseArgs(process.argv.slice(2));
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

  if (options.command === 'create') {
    await runCreateCommand(root, options);
    return;
  }

  await runSkillsCommand(root, options);
}

/**
 * Parses options for the create command.
 */
function parseCreateArgs(args) {
  const options = {
    command: 'create',
    dryRun: false
  };

  for (const arg of args) {
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    throw new Error(`Unknown option "${arg}"`);
  }

  return options;
}

/**
 * Parses options for the skills command.
 */
function parseSkillsArgs(args) {
  const options = {
    command: 'skills',
    dryRun: false,
    force: false,
    target: undefined
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--force') {
      options.force = true;
      continue;
    }

    if (arg === '--target') {
      const target = args[index + 1];

      if (!target || target.startsWith('--')) {
        throw new Error('Missing value for --target');
      }

      options.target = target;
      index += 1;
      continue;
    }

    throw new Error(`Unknown option "${arg}"`);
  }

  if (!options.target) {
    throw new Error('Missing required --target option');
  }

  return options;
}

/**
 * Renames the package-safe scaffold ignore file into the final dotfile.
 */
async function renameScaffoldGitignore(target) {
  const source = path.join(target, 'gitignore');
  const destination = path.join(target, '.gitignore');

  if (!await safeStat(source)) {
    throw new Error('Scaffold template is missing gitignore');
  }

  await rename(source, destination);
}

/**
 * Reads and validates a scaffold package manifest.
 */
async function readPackageJson(packagePath) {
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
  const isObject = packageJson && typeof packageJson === 'object';

  if (!isObject || Array.isArray(packageJson)) {
    throw new Error('Scaffold package.json must be an object');
  }

  return packageJson;
}

/**
 * Prints messages for the create command and runs the scaffold copy.
 */
async function runCreateCommand(root, options) {
  const source = path.join(
    root,
    'skills',
    'stackpress-app-scaffold',
    'assets',
    'template'
  );
  const target = process.cwd();
  const result = await createProject({
    dryRun: options.dryRun,
    source,
    target
  });

  console.log('Creating Stackpress project');
  console.log(`Source: ${source}`);
  console.log(`Target: ${target}`);
  console.log(`Package: ${result.packageName}`);
  console.log(`Mode: ${options.dryRun ? 'dry run' : 'copy template'}`);

  if (!options.dryRun) {
    console.log('');
    console.log('Next steps:');
    console.log('  yarn install');
    console.log('  yarn generate');
    console.log('  yarn push');
    console.log('  yarn dev');
  }
}

/**
 * Prints messages for the skills command and runs the skill copy.
 */
async function runSkillsCommand(root, options) {
  const source = path.join(root, 'skills');
  const target = resolveTargetDirectory(options.target);

  console.log('Installing Stackpress skills');
  console.log(`Source: ${source}`);
  console.log(`Target: ${target}`);
  console.log(`Mode: ${options.dryRun ? 'dry run' : 'copy all skills'}`);

  const result = await copySkills({
    dryRun: options.dryRun,
    force: options.force,
    source,
    target
  });

  if (result.installed.length) {
    console.log(`Installed: ${result.installed.join(', ')}`);
  } else {
    console.log('Installed: none');
  }

  if (result.skipped.length) {
    console.log(`Skipped existing: ${result.skipped.join(', ')}`);
    console.log('Use --force to overwrite existing skill folders.');
  }
}

/**
 * Reads file metadata and treats missing files as undefined.
 */
async function safeStat(file) {
  try {
    return await stat(file);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return undefined;
    }

    throw error;
  }
}

/**
 * Returns CLI help text for parse and runtime errors.
 */
function usage() {
  return [
    'Usage:',
    '  stackpress create [--dry-run]',
    '  stackpress skills --target <codex|claude|opencode|path> [--force] [--dry-run]',
    '',
    'Examples:',
    '  stackpress create',
    '  stackpress skills --target codex',
    '  stackpress skills --target claude',
    '  stackpress skills --target opencode',
    '  stackpress skills --target ~/.codex/skills'
  ].join('\n');
}

/**
 * Updates the scaffold package name after the template has been copied.
 */
async function writePackageName(target, packageName) {
  const packagePath = path.join(target, 'package.json');
  const packageJson = await readPackageJson(packagePath);

  packageJson.name = packageName;

  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

export {
  copySkills,
  createProject,
  parseArgs,
  resolveTargetDirectory
};

if (await isEntrypoint()) {
  main().catch((error) => {
    console.error(error.message);
    console.error('');
    console.error(usage());
    process.exitCode = 1;
  });
}
