//stackpress/schema/serializer
import Serializer, { UnknownType } from './Serializer.js';

export default class DateSerializer extends Serializer {
  /**
   * Serializes the value
   */
  public serialize<T>(value: T, seed?: string, toString = false) {
    //try default serialize first
    const serialized = this._serialize(value, seed);
    if (serialized !== UnknownType) {
      return serialized;
    }
    //if value is a date
    if (value instanceof Date) {
      return !toString ? value : this.dateToString(value);
    //if value is a number
    } else if (typeof value === 'number') {
      const stamp = new Date(value);
      return !toString ? stamp : this.dateToString(stamp);
    }
    //either way, try to convert to date (or date string)
    let stamp = new Date(value as unknown as string);
    if (isNaN(stamp.getTime())) {
      stamp = new Date(0);
    }
    return !toString ? stamp : this.dateToString(stamp);
  }

  /**
   * Unserializes the value
   */
  public unserialize<T>(value: T, seed?: string, toString = false) {
    //try default unserialize first
    const unserialized = this._unserialize(value, seed);
    if (unserialized !== UnknownType) {
      return unserialized;
    }
    //if value is a date
    if (value instanceof Date) {
      return !toString ? value: this.dateToString(value);
    //if value is a number
    } else if (typeof value === 'number') {
      const stamp = new Date(value);
      return !toString ? stamp: this.dateToString(stamp);
    }
    //either way, try to convert to date (or date string)
    let stamp = new Date(value as unknown as string);
    if (isNaN(stamp.getTime())) {
      stamp = new Date(0);
    }
    return !toString ? stamp : this.dateToString(stamp);
  }

  /**
   * Converts a date to a string
   */
  protected dateToString(date: Date) {
    return [
      date.toISOString().split('T')[0],
      date.toTimeString().split(' ')[0]
    ].join(' ');
  }
};