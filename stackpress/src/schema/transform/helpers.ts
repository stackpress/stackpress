//node
import fs from 'node:fs/promises';
import path from 'node:path';
//modules
import type { Project, Directory } from 'ts-morph';
import { decode } from 'html-entities';
//stackpress/view/handlebars
import Handlebars from '../../view/handlebars';

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
 * Replace delimiters in the given string with the provided source and
 * optionally escape them.
 */
function replaceDelimiters(str: string, source: string, escape?: boolean) {
  //Create a regular expression to match the delimiters in the string.
  const regex = new RegExp(source, 'g');
  let match;

  //Iterate over the string and replace delimiters with the provided 
  // source string, optionally escaping the delimiters to prevent 
  // Handlebars from interpreting them as Handlebars expressions.
  // example: replace {{variable}} with <%variable%>
  while ((match = regex.exec(str))) {
    const start = match.index;
    const end = match.index + match[0].length;
    let prefix = str.slice(0, start);
    let inner = (escape ? '\\' : '') + '{{' + match[1] + '}}';
    let suffix = str.slice(end);

    //Guard against accidentally creating Handlebars triple-stash when
    // template delimiters are used inside JSX expression braces.
    // Example (before): href={<%search.href%>}
    // After delimiter replacement (bad): href={{{search.href}}}
    // We insert whitespace so the JSX braces remain braces:
    // After delimiter replacement (good): href={ {{search.href}} }
    const prevChar = start > 0 ? str[start - 1] : '';
    const nextChar = end < str.length ? str[end] : '';
    if (prevChar === '{' && !prefix.endsWith(' ')) {
      prefix += ' ';
    }
    if (nextChar === '}' && !suffix.startsWith(' ')) {
      suffix = ' ' + suffix;
    }
    str = prefix + inner + suffix;
  }
  return str;
}

/**
 * Escape handlebars delimiters in the given string.
 */
function escapeDelimiters(str: string) {
  return replaceDelimiters(str, '{{([\\s\\S]+?)}}', true);
}

/**
 * Configure Handlebars to use custom delimiters for template rendering. 
 * This function was inspired by https://github.com/jonschlinkert/handlebars-delimiters
 */
function delimiters(Handlebars: any, delimiters: [string, string]) {
  if (delimiters[0].slice(-1) !== '=') {
    delimiters[0] += '(?!=)';
  }
  const source = delimiters[0] + '([\\s\\S]+?)' + delimiters[1];
  
  //Idea for compile method from http://stackoverflow.com/a/19181804/1267639
  if (!Handlebars._compile) {
    Handlebars._compile = Handlebars.compile;
  }
  //Override the default Handlebars compile method to replace delimiters 
  // in the template string
  Handlebars.compile = function (str: string) {
    const args = [].slice.call(arguments) as any;
    if (typeof str === 'string') {
      if (delimiters[0] !== '{{' && delimiters[1] !== '}}') {
        args[0] = escapeDelimiters(args[0]);
      }
      args[0] = replaceDelimiters(args[0], source);
    }
    return Handlebars._compile.apply(Handlebars, args);
  };
}

/**
 * Quick rendering using handlebars
 */
export function render(
  template: string,
  data: Record<string, any> = {},
) {
  delimiters(Handlebars, ['<%', '%>']);
  const compiled = Handlebars.compile(template, { compat: true, noEscape: true });
  return decode(compiled(data));  
}

/**
 * Used to "transform" a code template string
 * using code safe variable handlers
 */
export function renderCode(
  template: string, 
  data: Record<string, any> = {},
) {
  return render(template, data);
};