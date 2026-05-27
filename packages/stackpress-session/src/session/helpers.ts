//node
import crypto from 'node:crypto';
//stackpress-session
import type { SessionRoute } from './types.js';

export const isRegExp = /^\/.+\/[igmsuy]*$/;

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
};

/**
 * Decodes a base32-encoded string into a Buffer.
 * (for 2FA secrets)
 */
export function base32Decode(base32: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  base32 = base32.replace(/=+$/, '').toUpperCase();
  let bits = '';

  for (const char of base32) {
    const val = alphabet.indexOf(char);
    if (val === -1) throw new Error('Invalid base32 character');
    bits += val.toString(2).padStart(5, '0');
  }

  const bytes = bits.match(/.{8}/g)?.map(b => parseInt(b, 2)) ?? [];
  return Buffer.from(bytes);
};

/**
 * Generates a TOTP (Time-based One-Time Password) code.
 * It uses a secret key and the current time to generate a 6-digit code.
 * The `window` parameter allows for a time offset, useful for clock drift.
 * The `timeStep` parameter defines the interval in seconds for the TOTP.
 * (for 2FA verification)
 */
export function generateTOTP(secret: string, window = 0, timeStep = 30): string {
  const key = base32Decode(secret);
  const time = Math.floor(Date.now() / 1000 / timeStep) + window;
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(time));

  const hmac = crypto.createHmac('sha1', key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = ((hmac.readUInt32BE(offset) & 0x7fffffff) % 1e6).toString();

  return code.padStart(6, '0');
};

/**
 * Verifies a TOTP code against a secret.
 * It checks the current time and a specified window of time steps.
 * (for 2FA verification)
 */
export function verifyTOTP(token: string, secret: string, window = 1): boolean {
  for (let i = -window; i <= window; i++) {
    if (generateTOTP(secret, i) === token) return true;
  }
  return false;
};

/**
 * Generates a random secret key for TOTP.
 * The default length is 16 characters, using a specific character set.
 * This key can be used for 2FA.
 * (for 2FA setup)
 */
export function generateSecret(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  return Array.from(crypto.randomBytes(length))
    .map(b => chars[b % chars.length])
    .join('');
};