//node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
//modules
import type { Project, Directory } from 'ts-morph';
import Nest from '@stackpress/lib/Nest';
import { TemplateEngine, helpers } from '@stackpress/lib/Template';
//stackpress-schema
import type Schema from '../Schema.js';

export const cwd = process.cwd();

export async function createProject(to = 'schema') {
  const tsconfig = path.resolve(cwd, 'tsconfig.json');
  const output = path.resolve(cwd, to);
  //lazy import ts-morph
  const morph = await import('ts-morph');
  const { Project, IndentationText } = morph;
  return new Project({
    tsConfigFilePath: tsconfig,
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      outDir: output,
      declaration: true, 
      declarationMap: false, 
      sourceMap: false, 
    },
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces
    }
  });
};

export function loadPackageJsonNest(pwd: string) {
  const filepath = path.resolve(pwd, 'package.json');
  if (fs.existsSync(filepath)) {
    return new Nest(JSON.parse(fs.readFileSync(filepath, 'utf-8')));
  }
  return new Nest();
};

export function loadProjectFile(
  project: Project | Directory, 
  filepath: string
) {
  return project.getSourceFile(filepath) 
    || project.createSourceFile(filepath, '', { overwrite: true })
};

export async function publishProject(project: Project) {
  //lazy import prettier
  const prettier = await import('prettier');
  //save first
  project.saveSync();
  //get source files
  const files = project.getSourceFiles();
  for (const file of files) {
    const filePath = file.getFilePath();
    const content = file.getFullText();
    //so we can pretty print
    const pretty = await prettier.default.format(content, { 
      parser: 'typescript' 
    });
    await fsp.writeFile(filePath, pretty);
  }
};

export function renderCode(template: string, data: Record<string, any> = {}) {
  const engine = new TemplateEngine({ helpers, delimiters: [ '<%', '%>' ] });
  return engine.render(template, data);
};

/**
 * Remove stale generated schema files that no longer match the current schema.
 */
export async function pruneGeneratedSchemaFiles(root: string, schema: Schema) {
  //if the generated root does not exist yet, there is nothing to prune
  if (!fs.existsSync(root)) {
    return;
  }

  //build the exact list of folders and files the current schema still expects
  const expectedDirectories = new Map<string, {
    columns: Set<string>,
    tests: Set<string>
  }>();
  const modelsAndFieldsets = [
    ...schema.fieldsets.values(),
    ...schema.models.values()
  ];

  for (const fieldset of modelsAndFieldsets) {
    //generated folders are keyed by the fieldset/model path name
    const dirname = fieldset.name.toPathName();
    //model-backed columns are generated elsewhere, so this pass only tracks
    //the direct column artifacts for the fieldset or model folder itself
    const columns = fieldset.columns.filter(
      column => !column.type.model
    );
    //record every column file that should still exist after regeneration
    const columnFiles = new Set(columns.map(
      column => column.name.toPathName('%sColumn.ts')
    ).toArray());
    //only primitive columns get individual test files in this folder layout
    const testFiles = new Set(columns
      .filter(column => !column.type.fieldset)
      .map(column => column.name.toPathName('%sColumn.test.ts'))
      .toArray());
    expectedDirectories.set(dirname, { columns: columnFiles, tests: testFiles });
  }

  for (const entry of await fsp.readdir(root, { withFileTypes: true })) {
    //this cleaner only manages generated directories
    if (!entry.isDirectory()) {
      continue;
    }
    //generated fieldset/model folders should mirror the live schema exactly.
    if (!expectedDirectories.has(entry.name)) {
      await fsp.rm(path.join(root, entry.name), { recursive: true, force: true });
      continue;
    }

    //once the folder is confirmed valid, prune only the stale files inside it
    const expected = expectedDirectories.get(entry.name)!;
    const directory = path.join(root, entry.name);
    await pruneGeneratedGroup(
      path.join(directory, 'columns'),
      expected.columns,
      new Set([ 'index.ts' ])
    );
    await pruneGeneratedGroup(
      path.join(directory, 'tests', 'columns'),
      expected.tests,
      new Set()
    );
  }
};

/**
 * Remove generated files from one folder when they are no longer expected.
 */
async function pruneGeneratedGroup(
  directory: string,
  expectedFiles: Set<string>,
  preservedFiles: Set<string>
) {
  //skip missing folders because generation may not have created them yet
  if (!fs.existsSync(directory)) {
    return;
  }

  for (const entry of await fsp.readdir(directory, { withFileTypes: true })) {
    //only generated files are deleted here, not nested directories
    if (!entry.isFile()) {
      continue;
    }
    //keep aggregate generated files like index.ts, but prune stale column artifacts.
    if (preservedFiles.has(entry.name) || expectedFiles.has(entry.name)) {
      continue;
    }
    await fsp.rm(path.join(directory, entry.name), { force: true });
  }
}

export function savePackageJsonNest(pwd: string, nest: Nest) {
  if (!fs.existsSync(pwd)) {
    fs.mkdirSync(pwd, { recursive: true });
  }
  const filepath = path.resolve(pwd, 'package.json');
  fs.writeFileSync(filepath, JSON.stringify(nest.get(), null, 2));
}
