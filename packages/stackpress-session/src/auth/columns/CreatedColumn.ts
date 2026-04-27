//modules
import * as z from 'zod';
//stackpress-schema
import ColumnInterface from 'stackpress-schema/ColumnInterface';

export default class CreatedColumn implements ColumnInterface<
  Date,
  string,
  Date,
  z.ZodDate
> {
  public readonly name = 'created';
  public readonly shape;

  public get defaults() {
    return new Date();
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
      .date()
      .describe('Generated timestamp when row was created.')
      .refine((value) => !isNaN(Date.parse(value.toString())), {
        message: 'Must be a valid date.'
      })
      .refine(
        (data: any) =>
          typeof data !== 'undefined' && data !== null && String(data) !== '',
        { message: 'Value is required.' }
      );
  }

  public serialize<T>(value: T) {
    if (typeof value === 'undefined') {
      return undefined;
    }

    //if value is a date
    if (value instanceof Date) {
      return [
        value.toISOString().split('T')[0],
        value.toTimeString().split(' ')[0]
      ].join(' ');
      //if value is a number
    } else if (typeof value === 'number') {
      const stamp = new Date(value);
      return [
        stamp.toISOString().split('T')[0],
        stamp.toTimeString().split(' ')[0]
      ].join(' ');
    }
    //either way, try to convert to date (or date string)
    let stamp = new Date(String(value));
    if (isNaN(stamp.getTime())) {
      stamp = new Date(0);
    }
    return [
      stamp.toISOString().split('T')[0],
      stamp.toTimeString().split(' ')[0]
    ].join(' ');
  }

  public unserialize<T>(value: T) {
    if (typeof value === 'undefined') {
      return undefined;
    }

    //if value is a date
    if (value instanceof Date) {
      return value;
      //if value is a number
    } else if (typeof value === 'number') {
      return new Date(value);
    }
    //either way, try to convert to date (or date string)
    let stamp = new Date(String(value));
    if (isNaN(stamp.getTime())) {
      stamp = new Date(0);
    }
    return stamp;
  }
}
