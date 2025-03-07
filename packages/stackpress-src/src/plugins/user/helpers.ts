//node
import crypto from 'node:crypto';

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
 * Creates a hash salt of a string
 */
export function hash(string: string) {
  return crypto
    .createHash('shake256')
    .update(string)
    .digest('hex');
}