//node
import crypto from 'node:crypto';
//session
import type { SessionRoute } from './types';

export const isRegExp = /^\/.+\/[igmsuy]*$/;

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

/**
 * Returns true if the permit matches 
 * any of the permission patterns
 */
export function matchAnyEvent(permit: string, permissions: string[]) {
  //do the obvious match
  if (permissions.includes(permit)) {
    return true;
  }
  //loop through permissions
  for (const permission of permissions) {
    //we just need one to match to 
    //say that this permit is valid
    if (matchEvent(permit, permission)) {
      return true;
    }
  }
  //nothing in the permission list matched
  return false;
}

/**
 * Returns true if the permit matches 
 * any of the permission patterns
 */
export function matchAnyRoute(permit: SessionRoute, permissions: SessionRoute[]) {
  //loop through permissions
  for (const permission of permissions) {
    //we just need one to match to 
    //say that this permit is valid
    if (matchRoute(permit, permission)) {
      return true;
    }
  }
  //nothing in the permission list matched
  return false;
}

/**
 * Returns true if the permit 
 * matches the permission pattern
 */
export function matchEvent(permit: string, permission: string) {
  //do the obvious match
  if (permission === permit) {
    return true;
  }
  //make sure the permit is a regexp string
  const pattern = !isRegExp.test(permission) 
    ? `/^${permission
      //* -> ([^-]+)
      .replaceAll('*', '([^-]+)')
      //** -> ([^-]+)([^-]+) -> (.*)
      .replaceAll('([^-]+)([^-]+)', '(.*)')
    }$/ig` 
    : permission;
  //make permission into a real regexp, 
  //so we can compare against the permit
  const regexp = new RegExp(
    // pattern,
    pattern.substring(
      pattern.indexOf('/') + 1,
      pattern.lastIndexOf('/')
    ),
    // flag
    pattern.substring(
      pattern.lastIndexOf('/') + 1
    )
  );
  //test the permit
  return regexp.test(permit);
}

/**
 * Returns true if the permit 
 * matches the permission pattern
 */
export function matchRoute(permit: SessionRoute, permission: SessionRoute) {
  //if permission is ALL, we dont care what the permit method is
  //permission is not ALL, so if the methods don't match
  if (permission.method !== 'ALL' 
    && permission.method !== permit.method
  ) {
    return false;
  }

  //method checking is now done...

  //do the obvious match
  if (permission.route === permit.route) {
    return true;
  }
  //make sure the permit is a regexp string
  const pattern = !isRegExp.test(permission.route) 
    ? `/^${permission.route
      //replace the :variable-_name01
      .replace(/(\:[a-zA-Z0-9\-_]+)/g, '*')
      //replace the stars
      //* -> ([^/]+)
      .replaceAll('*', '([^/]+)')
      //** -> ([^/]+)([^/]+) -> (.*)
      .replaceAll('([^/]+)([^/]+)', '(.*)')
    }$/ig` 
    : permission.route;
  //make permission into a real regexp, 
  //so we can compare against the permit
  const regexp = new RegExp(
    // pattern,
    pattern.substring(
      pattern.indexOf('/') + 1,
      pattern.lastIndexOf('/')
    ),
    // flag
    pattern.substring(
      pattern.lastIndexOf('/') + 1
    )
  );
  //test the permit
  return regexp.test(permit.route);
}