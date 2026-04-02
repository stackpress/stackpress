//node
import fs from 'node:fs/promises';
import path from 'node:path';
//modules
import type { Project, Directory } from 'ts-morph';
import mustache from 'mustache';
import { decode } from 'html-entities';
//stackpress/schema
import type Model from '../Model';

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

/**
 * Collects all columns that should be cleared on copy,
 * deduped via Set — ids, active, timestamp, hashed, encrypted
 */
export function collectClearColumns(
  store: Model['store'],
  value: Model['value']
) {
  //initialize set
  const names = new Set<string>();
  //add all columns that should be cleared on copy
  for (const col of store.ids.values())       names.add(col.name.toString());
  if (store.active)                           names.add(store.active.name.toString());
  if (store.timestamp)                        names.add(store.timestamp.name.toString());
  for (const col of value.hashed.values())    names.add(col.name.toString());
  for (const col of value.encrypted.values()) names.add(col.name.toString());
  //return columns
  return [...names].map(column => ({ column }));
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
    await fs.writeFile(filePath, pretty);
  }
};

/**
 * Quick rendering using mustache
 */
export function render(
  template: string, 
  data: Record<string, any> = {},
  delimiter?: string, //{{=<% %>=}}
  escape = false
) {
  if (delimiter) {
    template = delimiter + template;
  }
  if (escape) {
    //escape all data values
    for (const key in data) {
      if (typeof data[key] === 'string') {
        data[key] = mustache.escape(data[key]);
      }
    }
  }
  return mustache.render(
    template, 
    data, undefined, 
    escape ? { escape: (text: any) => decode(String(text)) } : undefined
  );
};

/**
 * Used to "transform" a code template string
 * using code safe variable handlers
 */
export function renderCode(
  template: string, 
  data: Record<string, any> = {},
  delimiter = '{{=<% %>=}}'
) {
  return render(template, data, delimiter, true);
};