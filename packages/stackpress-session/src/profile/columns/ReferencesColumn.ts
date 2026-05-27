//modules
import * as z from 'zod';
import { ScalarInput } from '@stackpress/lib/types';
import { isObject } from '@stackpress/lib/Nest';
//stackpress-schema
import ColumnInterface from 'stackpress-schema/ColumnInterface';
import { validJSONObjectString } from 'stackpress-schema/helpers';

export default class ReferencesColumn implements ColumnInterface<
  Record<string, ScalarInput>,
  string | null,
  Record<string, ScalarInput> | null,
  z.ZodOptional<z.ZodNullable<z.ZodObject>>
> {
  public readonly name = 'references';
  public readonly shape;

  public get defaults() {
    return this.unserialize({})! as Record<string, ScalarInput>;
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
      .object({})
      .describe('Arbitrary key/value references for general use.')
      .nullable()
      .optional();
  }

  public serialize<T>(value: T) {
    if (typeof value === 'undefined') {
      return undefined;
    }
    if (value === null) {
      return null;
    }
    //if value is a string
    if (typeof value === 'string') {
      return validJSONObjectString(value) ? value : '{}';
    }
    //let JSON serialize the value
    return JSON.stringify(value);
  }

  public unserialize<T>(value: T) {
    if (typeof value === 'undefined') {
      return undefined;
    }
    if (value === null) {
      return null;
    }
    //if value is a string
    if (typeof value === 'string') {
      return validJSONObjectString(value) ? JSON.parse(value) : {};
    }
    return isObject(value) ? value : {};
  }
}
