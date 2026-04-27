//modules
import * as z from 'zod';
//stackpress-schema
import ColumnInterface from 'stackpress-schema/ColumnInterface';

export default class VerifiedColumn implements ColumnInterface<
  boolean,
  boolean,
  boolean,
  z.ZodBoolean
> {
  public readonly name = 'verified';
  public readonly shape;

  public get defaults() {
    return this.unserialize(false)!;
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
      .boolean()
      .describe('Indicates if the type has been verified (email, phone, etc.).')
      .refine(
        (data: any) =>
          typeof data !== 'undefined' && data !== null && String(data) !== '',
        { message: 'Verified is required' }
      );
  }

  public serialize<T>(value: T) {
    if (typeof value === 'undefined') {
      return undefined;
    }

    return (
      value === 'false' ? false
      : value === 'true' ? true
      : value === '0' ? false
      : value === '1' ? true
      : Boolean(value)
    );
  }

  public unserialize<T>(value: T) {
    if (typeof value === 'undefined') {
      return undefined;
    }

    return Boolean(value);
  }
}
