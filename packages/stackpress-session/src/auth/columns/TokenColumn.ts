//modules
import * as z from 'zod';
//stackpress-schema
import ColumnInterface from 'stackpress-schema/ColumnInterface';
import { encrypt, decrypt } from 'stackpress-schema/helpers';

export default class TokenColumn implements ColumnInterface<
  undefined,
  string,
  string,
  z.ZodString
> {
  public readonly name = 'token';
  public readonly shape;

  public get defaults() {
    return undefined;
  }

  public assert<T>(value: T) {
    const results = this.shape.safeParse(value);
    if (results.success) {
      return null;
    }
    if (results.error.issues.length > 0) {
      return results.error.issues[0].message.replaceAll(
        '{{value}}',
        String(value)
      );
    }
    return 'Invalid value';
  }

  public constructor(seed = '') {
    this._seed = seed;

    this.shape = z
      .string()
      .describe('The actual username, email, or phone (depending on type)')
      .refine(
        (data: any) =>
          typeof data !== 'undefined' && data !== null && String(data) !== '',
        { message: 'Token is required' }
      )
      .min(5, { message: 'Must be at least 5 characters' });
  }

  protected _seed: string;

  public serialize<T>(value: T, doEncrypt = false) {
    if (typeof value === 'undefined') {
      return undefined;
    }

    let string = String(value);
    //if value is a date
    if (value instanceof Date) {
      string = [
        value.toISOString().split('T')[0],
        value.toTimeString().split(' ')[0]
      ].join(' ');
    } else if (
      typeof value === 'object' &&
      value?.constructor?.name === 'Object'
    ) {
      string = JSON.stringify(value);
    } else if (typeof value?.toString === 'function') {
      string = value.toString();
    }

    if (doEncrypt) {
      return string.length > 0 ? encrypt(string, this._seed) : string;
    }
    return string;
  }

  public unserialize<T>(value: T, doDecrypt = false) {
    if (typeof value === 'undefined') {
      return undefined;
    }

    //if value is a date
    if (value instanceof Date) {
      return [
        value.toISOString().split('T')[0],
        value.toTimeString().split(' ')[0]
      ].join(' ');
    } else if (
      typeof value === 'object' &&
      value?.constructor?.name === 'Object'
    ) {
      return JSON.stringify(value);
    } else if (typeof value?.toString === 'function') {
      value = value.toString() as T;
    }

    if (doDecrypt) {
      return String(value).length > 0 ?
          decrypt(String(value), this._seed)
        : String(value);
    }
    return String(value);
  }
}
