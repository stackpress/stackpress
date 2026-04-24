//node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
//modules
import type { Project, Directory } from 'ts-morph';
import Nest from '@stackpress/lib/Nest';
import { TemplateEngine, helpers } from '@stackpress/lib/Template';

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

export function savePackageJsonNest(pwd: string, nest: Nest) {
  if (!fs.existsSync(pwd)) {
    fs.mkdirSync(pwd, { recursive: true });
  }
  const filepath = path.resolve(pwd, 'package.json');
  fs.writeFileSync(filepath, JSON.stringify(nest.get(), null, 2));
}