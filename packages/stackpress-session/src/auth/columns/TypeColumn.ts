//modules
import * as z from 'zod';
//stackpress-schema
import ColumnInterface from 'stackpress-schema/ColumnInterface';

export default class TypeColumn implements ColumnInterface<
  string,
  string,
  string,
  z.ZodString
> {
  public readonly name = 'type';
  public readonly shape;

  public get defaults() {
    return this.unserialize('username')!;
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

  public constructor() {
    this.shape = z
      .string()
      .describe('Type of authentication method (username, email, phone).')
      .refine(
        (data: any) =>
          typeof data !== 'undefined' && data !== null && String(data) !== '',
        { message: 'Type is required' }
      );
  }

  public serialize<T>(value: T) {
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
    return string;
  }

  public unserialize<T>(value: T) {
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
    return String(value);
  }
}
