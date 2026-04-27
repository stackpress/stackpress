//modules
import * as z from 'zod';
//stackpress-schema
import ColumnInterface from 'stackpress-schema/ColumnInterface';

export default class TagsColumn implements ColumnInterface<
  string[],
  string,
  string[],
  z.ZodArray<z.ZodString>
> {
  public readonly name = 'tags';
  public readonly shape;

  public get defaults() {
    return this.unserialize([])!;
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
    this.shape = z.array(
      z.string().describe('Abritrary tags for general use.')
    );
  }

  public serialize<T>(value: T) {
    if (!Array.isArray(value)) {
      return '[]';
    }
    const values = value
      .map((item) => this._serialize(item))
      .filter((item) => typeof item !== 'undefined' && item !== null);
    return JSON.stringify(values);
  }

  public unserialize<T>(value: T) {
    if (Array.isArray(value)) {
      return value
        .map((item) => this._unserialize(item))
        .filter((item) => typeof item !== 'undefined' && item !== null);
    }
    if (typeof value !== 'string') {
      return [];
    }
    try {
      const values = JSON.parse(value);
      if (!Array.isArray(values)) {
        return [];
      }
      return values
        .map((item) => this._unserialize(item))
        .filter((item) => typeof item !== 'undefined' && item !== null);
    } catch (e) {
      return [];
    }
  }

  protected _serialize<T>(value: T) {
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

  protected _unserialize<T>(value: T) {
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
