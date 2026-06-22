import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  symlink,
  writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';

import {
  copySkills,
  createProject,
  parseArgs,
  resolveRuntimeCommand,
  resolveTargetDirectory
} from '../bin/stackpress.mjs';

const execFileAsync = promisify(execFile);
const nodeBinDirectory = path.dirname(process.execPath);
const executableTestEnv = {
  ...process.env,
  PATH: `${nodeBinDirectory}${path.delimiter}${process.env.PATH ?? ''}`
};

test('parseArgs handles installer commands and forwards runtime commands', () => {
  assert.deepEqual(parseArgs(['skills', '--target', 'codex']), {
    command: 'skills',
    dryRun: false,
    force: false,
    target: 'codex'
  });

  assert.throws(
    () => parseArgs(['skills']),
    /Missing required --target option/
  );

  assert.deepEqual(parseArgs(['create']), {
    command: 'create',
    dryRun: false
  });

  assert.deepEqual(parseArgs(['create', '--dry-run']), {
    command: 'create',
    dryRun: true
  });

  assert.deepEqual(parseArgs(['develop', '--b', 'config/develop', '-v']), {
    command: 'runtime',
    args: ['develop', '--b', 'config/develop', '-v']
  });
});

test('resolveRuntimeCommand uses the local framework CLI when available', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-runtime-'));
  const runtimeBin = path.join(root, 'packages', 'stackpress-server', 'bin.ts');
  const tsxBin = path.join(root, 'node_modules', '.bin', 'tsx');

  await mkdir(path.dirname(runtimeBin), { recursive: true });
  await mkdir(path.dirname(tsxBin), { recursive: true });
  await writeFile(runtimeBin, '#!/usr/bin/env tsx\n');
  await writeFile(tsxBin, '#!/usr/bin/env node\n');

  try {
    assert.deepEqual(await resolveRuntimeCommand(root), {
      args: [runtimeBin],
      runner: tsxBin
    });
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('resolveRuntimeCommand rejects lightweight installs without the runtime CLI', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-runtime-'));

  try {
    await assert.rejects(
      resolveRuntimeCommand(root),
      /only bundles the create and skills commands/
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('resolveTargetDirectory maps known targets and treats other targets as paths', () => {
  const home = path.join(tmpdir(), 'stackpress-installer-home');

  assert.equal(
    resolveTargetDirectory('codex', { env: {}, home }),
    path.join(home, '.codex', 'skills')
  );
  assert.equal(
    resolveTargetDirectory('claude', { env: {}, home }),
    path.join(home, '.claude', 'skills')
  );
  assert.equal(
    resolveTargetDirectory('opencode', { env: {}, home }),
    path.join(home, '.config', 'opencode', 'skills')
  );
  assert.equal(
    resolveTargetDirectory('codex', {
      env: { CODEX_HOME: path.join(home, 'codex-home') },
      home
    }),
    path.join(home, 'codex-home', 'skills')
  );
  assert.equal(
    resolveTargetDirectory('~/agent-skills', { env: {}, home }),
    path.join(home, 'agent-skills')
  );
  assert.equal(
    resolveTargetDirectory('./agent-skills', {
      cwd: path.join(home, 'project'),
      env: {},
      home
    }),
    path.join(home, 'project', 'agent-skills')
  );
});

test('copySkills installs every skill folder and ignores archives', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-skills-'));
  const source = path.join(root, 'skills');
  const target = path.join(root, 'target');

  await mkdir(path.join(source, 'stackpress-router', 'references'), {
    recursive: true
  });
  await mkdir(path.join(source, 'archives', 'old-skill'), { recursive: true });
  await writeFile(
    path.join(source, 'stackpress-router', 'SKILL.md'),
    '# Stackpress Router\n'
  );
  await writeFile(
    path.join(source, 'stackpress-router', 'references', 'routing.md'),
    '# Routing\n'
  );
  await writeFile(path.join(source, 'README.md'), '# Skills\n');

  try {
    const result = await copySkills({ source, target });

    assert.deepEqual(result.installed, ['stackpress-router']);
    assert.equal(result.skipped.length, 0);
    assert.equal(
      await readFile(path.join(target, 'stackpress-router', 'SKILL.md'), 'utf8'),
      '# Stackpress Router\n'
    );
    assert.equal(
      await readFile(
        path.join(target, 'stackpress-router', 'references', 'routing.md'),
        'utf8'
      ),
      '# Routing\n'
    );
    await assert.rejects(
      readFile(path.join(target, 'archives', 'old-skill', 'SKILL.md'), 'utf8')
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('copySkills refuses to overwrite existing skills without force', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-skills-'));
  const source = path.join(root, 'skills');
  const target = path.join(root, 'target');

  await mkdir(path.join(source, 'stackpress-router'), { recursive: true });
  await mkdir(path.join(target, 'stackpress-router'), { recursive: true });
  await writeFile(
    path.join(source, 'stackpress-router', 'SKILL.md'),
    '# New Router\n'
  );
  await writeFile(
    path.join(target, 'stackpress-router', 'SKILL.md'),
    '# Existing Router\n'
  );

  try {
    const result = await copySkills({ source, target });

    assert.equal(result.installed.length, 0);
    assert.deepEqual(result.skipped, ['stackpress-router']);
    assert.equal(
      await readFile(path.join(target, 'stackpress-router', 'SKILL.md'), 'utf8'),
      '# Existing Router\n'
    );

    const forced = await copySkills({ force: true, source, target });

    assert.deepEqual(forced.installed, ['stackpress-router']);
    assert.equal(
      await readFile(path.join(target, 'stackpress-router', 'SKILL.md'), 'utf8'),
      '# New Router\n'
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('copySkills rejects target paths that are not directories', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-skills-'));
  const source = path.join(root, 'skills');
  const target = path.join(root, 'target');

  await mkdir(path.join(source, 'stackpress-router'), { recursive: true });
  await writeFile(
    path.join(source, 'stackpress-router', 'SKILL.md'),
    '# Stackpress Router\n'
  );
  await writeFile(target, 'not a folder\n');

  try {
    await assert.rejects(
      copySkills({ source, target }),
      /Target path must be a directory/
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('copySkills dry-run does not create missing target directories', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-skills-'));
  const source = path.join(root, 'skills');
  const target = path.join(root, 'target');

  await mkdir(path.join(source, 'stackpress-router'), { recursive: true });
  await writeFile(
    path.join(source, 'stackpress-router', 'SKILL.md'),
    '# Stackpress Router\n'
  );

  try {
    const result = await copySkills({ dryRun: true, source, target });

    assert.deepEqual(result.installed, ['stackpress-router']);
    await assert.rejects(stat(target), /ENOENT/);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('createProject copies the template and rewrites package name from the folder', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-create-'));
  const source = path.join(root, 'template');
  const target = path.join(root, 'sample-app');

  await mkdir(source, { recursive: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, '.DS_Store'), '');
  await writeFile(
    path.join(source, 'package.json'),
    JSON.stringify({
      name: '__STACKPRESS_PACKAGE_NAME__',
      private: true,
      type: 'module'
    }, null, 2)
  );
  await writeFile(path.join(source, 'gitignore'), 'node_modules/\n.build\n');
  await writeFile(path.join(source, 'schema.idea'), 'model User {}\n');

  try {
    const result = await createProject({ source, target });
    const packageJson = JSON.parse(
      await readFile(path.join(target, 'package.json'), 'utf8')
    );

    assert.equal(result.packageName, 'sample-app');
    assert.equal(packageJson.name, 'sample-app');
    assert.equal(
      await readFile(path.join(target, 'schema.idea'), 'utf8'),
      'model User {}\n'
    );
    assert.equal(
      await readFile(path.join(target, '.gitignore'), 'utf8'),
      'node_modules/\n.build\n'
    );
    await assert.rejects(readFile(path.join(target, 'gitignore'), 'utf8'));
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('createProject rejects invalid package names from folder names', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-create-'));
  const source = path.join(root, 'template');
  const target = path.join(root, 'Sample App');

  await mkdir(source, { recursive: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(source, 'package.json'), '{"name":"placeholder"}');

  try {
    await assert.rejects(
      createProject({ source, target }),
      /Invalid package name/
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('createProject rejects reserved package names from folder names', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-create-'));
  const source = path.join(root, 'template');
  const target = path.join(root, 'node_modules');

  await mkdir(source, { recursive: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(source, 'package.json'), '{"name":"placeholder"}');

  try {
    await assert.rejects(
      createProject({ source, target }),
      /Invalid package name/
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('createProject rejects target paths that are not directories', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-create-'));
  const source = path.join(root, 'template');
  const target = path.join(root, 'sample-app');

  await mkdir(source, { recursive: true });
  await writeFile(path.join(source, 'package.json'), '{"name":"placeholder"}');
  await writeFile(target, 'not a folder\n');

  try {
    await assert.rejects(
      createProject({ source, target }),
      /Target path must be an empty directory/
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('createProject dry-run does not create missing target directories', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-create-'));
  const source = path.join(root, 'template');
  const target = path.join(root, 'sample-app');

  await mkdir(source, { recursive: true });
  await writeFile(path.join(source, 'package.json'), '{"name":"placeholder"}');
  await writeFile(path.join(source, 'gitignore'), 'node_modules/\n');

  try {
    const result = await createProject({ dryRun: true, source, target });

    assert.equal(result.packageName, 'sample-app');
    await assert.rejects(stat(target), /ENOENT/);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('createProject rejects incomplete scaffolds before copying files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-create-'));
  const source = path.join(root, 'template');
  const target = path.join(root, 'sample-app');

  await mkdir(source, { recursive: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(source, 'package.json'), '{"name":"placeholder"}');

  try {
    await assert.rejects(
      createProject({ source, target }),
      /Scaffold template is missing gitignore/
    );
    await assert.rejects(readFile(path.join(target, 'package.json'), 'utf8'));
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('createProject rejects dot-gitignore-only scaffold sources', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-create-'));
  const source = path.join(root, 'template');
  const target = path.join(root, 'sample-app');

  await mkdir(source, { recursive: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(source, '.gitignore'), 'node_modules/\n');
  await writeFile(path.join(source, 'package.json'), '{"name":"placeholder"}');

  try {
    await assert.rejects(
      createProject({ source, target }),
      /Scaffold template is missing gitignore/
    );
    await assert.rejects(readFile(path.join(target, '.gitignore'), 'utf8'));
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('createProject rejects malformed package files before copying', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-create-'));
  const source = path.join(root, 'template');
  const target = path.join(root, 'sample-app');

  await mkdir(source, { recursive: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(source, 'gitignore'), 'node_modules/\n');
  await writeFile(path.join(source, 'package.json'), '{');

  try {
    await assert.rejects(
      createProject({ source, target }),
      /Expected|Unexpected/
    );
    await assert.rejects(readFile(path.join(target, 'package.json'), 'utf8'));
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('createProject rejects non-object package files before copying', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-create-'));
  const source = path.join(root, 'template');
  const target = path.join(root, 'sample-app');

  await mkdir(source, { recursive: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(source, 'gitignore'), 'node_modules/\n');
  await writeFile(path.join(source, 'package.json'), '[]');

  try {
    await assert.rejects(
      createProject({ source, target }),
      /Scaffold package.json must be an object/
    );
    await assert.rejects(readFile(path.join(target, 'package.json'), 'utf8'));
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('createProject refuses non-empty target directories', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-create-'));
  const source = path.join(root, 'template');
  const target = path.join(root, 'sample-app');

  await mkdir(source, { recursive: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(source, 'package.json'), '{"name":"placeholder"}');
  await writeFile(path.join(target, 'existing.txt'), 'keep me\n');

  try {
    await assert.rejects(
      createProject({ source, target }),
      /Target directory must be empty/
    );
    assert.equal(await readFile(path.join(target, 'existing.txt'), 'utf8'), 'keep me\n');
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('the executable runs when invoked through a package manager symlink', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-bin-'));
  const link = path.join(root, 'stackpress');
  const bin = path.resolve('bin', 'stackpress.mjs');

  try {
    await symlink(bin, link);

    const { stdout } = await execFileAsync(link, [
      'skills',
      '--target',
      path.join(root, 'target'),
      '--dry-run'
    ], { env: executableTestEnv });

    assert.match(stdout, /Installing Stackpress skills/);
    assert.match(stdout, /Mode: dry run/);
    assert.match(stdout, /stackpress-router/);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('the executable can dry-run create through a package manager symlink', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'stackpress-bin-'));
  const link = path.join(root, 'stackpress');
  const bin = path.resolve('bin', 'stackpress.mjs');
  const target = path.join(root, 'sample-app');

  await mkdir(target, { recursive: true });

  try {
    await symlink(bin, link);

    const { stdout } = await execFileAsync(link, ['create', '--dry-run'], {
      cwd: target,
      env: executableTestEnv
    });

    assert.match(stdout, /Creating Stackpress project/);
    assert.match(stdout, /Mode: dry run/);
    assert.match(stdout, /Package: sample-app/);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});
