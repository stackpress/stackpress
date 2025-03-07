//stackpress
import type { Data } from '@stackpress/idea-parser';
import NodeFS from '@stackpress/lib/dist/system/NodeFS';
import FileLoader from '@stackpress/lib/dist/system/FileLoader';

export const generators = [
  'cuid()',
  'nano()',
  'random()',
  'now()'
];

/**
 * Converts a string into camel format
 * ie. "some string" to "someString"
 */
export function camelize(string: string) {
  return lowerize(
    string.trim()
      //replace special characters with underscores
      .replace(/[^a-zA-Z0-9]/g, '_')
      //replace multiple underscores with a single underscore
      .replace(/_{2,}/g, '_')
      //trim underscores from the beginning and end of the string
      .replace(/^_+|_+$/g, '')
      //replace underscores with capital
      .replace(/([-_][a-z0-9])/ig, ($1) => {
        return $1.toUpperCase()
          .replace('-', '')
          .replace('_', '');
      })
  );
}

/**
 * Converts a word into capital format
 * ie. "title" to "Title"
 */
export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Converts a string into dash format
 * ie. "some string" to "some-string"
 * ie. "someString" to "some-string"
 */
export function dasherize(string: string) {
  return string.trim()
    //replace special characters with dashes
    .replace(/[^a-zA-Z0-9]/g, '-')
    //replace multiple dashes with a single dash
    .replace(/-{2,}/g, '-')
    //trim dashes from the beginning and end of the string
    .replace(/^-+|-+$/g, '')
    //replace "someString" to "some-string"
    .replace(/([a-z])([A-Z0-9])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Converts a word into lower format
 * ie. "Title" to "title"
 */
export function lowerize(word: string) {
  return word.charAt(0).toLowerCase() + word.slice(1);
}

/**
 * Converts a string into dash format
 * ie. "some string" to "some_string"
 * ie. "someString" to "some_string"
 */
export function snakerize(string: string) {
  return string.trim()
    //replace special characters with dashes
    .replace(/[^a-zA-Z0-9]/g, '_')
    //replace multiple dashes with a single dash
    .replace(/-{2,}/g, '_')
    //trim dashes from the beginning and end of the string
    .replace(/^_+|_+$/g, '')
    //replace "someString" to "some-string"
    .replace(/([a-z])([A-Z0-9])/g, '$1_$2')
    .toLowerCase();
}

export function render(template: string, data: Record<string, any> = {}) {
  return template.replace(/\{\{([a-zA-Z0-9_\-]+)\}\}/g, (match, key) => {
    return data[key] || '';
  });
}

/**
 * Returns the actual value even if it is an environment variable
 * ex. output "./modules/types.ts"
 * ex. output "env(OUTPUT)"
 */
export function enval<T = Data>(value: Data) {
  const string = (value || '').toString();
  const type = string.indexOf('env(') === 0 ? 'env': 'literal';
  const deconstructed = type === 'env' 
    ? string.replace('env(', '').replace(')', '')
    : value as T;
  return { type, value: deconstructed };
};

/**
 * Returns the absolute path of a file considering environment variables
 */
export function ensolute(output: string, cwd: string) {
  const path = enval<string>(output);
  const loader = new FileLoader(new NodeFS(), cwd);
  return path.type === 'env' 
    ? process.env[path.value]
    : loader.absolute(path.value, cwd);
}

/**
 * A simple code formatter
 */
export function formatCode(code: string): string {
  code = code
    .replace(/\}\s+else\s+if\s+\(/g, '} else if (')
    .replace(/\s*\n\s*\n\s*/g, "\n")
    .trim();
  const lines = code.split("\n");
  let indent = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\}/g) || line.match(/^\)/g) || line.match(/^<\//g) || line.match(/^\/>/g)) {
      indent -= 2;
    }
    lines[i] = `${' '.repeat(indent >= 0 ? indent: 0)}${line}`;
    if (line.match(/\s*\{\s*$/g) || line.match(/\s*\(\s*$/g) || line.match(/\s*<[a-zA-Z][^>]*>{0,1}\s*$/g)) {
      indent += 2;
    }
  }
  return lines.join("\n");
};

/**
 * A simple code formatter
 */
export function pipeCode(code: string) {
  const lines: string[] = [];
  for (const line of code.split("\n")) {
    lines.push(line.replace(/^\s*\|\s{0,1}/g, ''))
  }
  return lines.join("\n").trim();
};

/**
 * Convers an object of attributes to a string
 * ex. { type: 'text', number: 4, required: true, disabled: false } => 
 *   'type="text" required number={4} disabled={false}'
 * ex. { list: ['a', 2, true] } => 'list={["a", 2, true]}'
 */
export function objectToAttributeString(attributes: Record<string, any>) {
  return Object.entries(attributes).map(([key, value]) => {
    return `${key}={${JSON.stringify(value)}}`;
  }).join(' ');
}