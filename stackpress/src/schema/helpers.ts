//node
import crypto from 'node:crypto';
//modules
import mustache from 'mustache';

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
 * Used to decrypt sensitive info from the database
 */
export function decrypt(encrypted: string, seed: string) {
  const value = Buffer.from(encrypted, 'hex');
  //make a hash based on the seed
  const hash = crypto
    .createHash('sha256')
    .update(seed)
    .digest('base64')
    .substring(0, 32);
  //make an iv based on the hash
  const iv = hash.substring(0, 16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', hash, iv);
  return Buffer.concat([
    decipher.update(value), 
    decipher.final()
  ]).toString();
};

/**
 * Creates a hash salt of a string
 */
export function hash(string: string) {
  return crypto
    .createHash('shake256')
    .update(string)
    .digest('hex');
}

/**
 * Used to encrypt sensitive info in the database
 */
export function encrypt(value: string, seed: string) {
  //make a hash based on the seed
  const hash = crypto
    .createHash('sha256')
    .update(seed)
    .digest('base64')
    .substring(0, 32);
  //make an iv based on the hash
  const iv = hash.substring(0, 16);
  const cipher = crypto.createCipheriv('aes-256-cbc', hash, iv);
  const encrypted = Buffer.concat([ 
    cipher.update(value), 
    cipher.final() 
  ]);
  return encrypted.toString('hex');
};

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
  return mustache.render(template, data);
}

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