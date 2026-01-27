//stackpress/schema/spec/serializer
import Serializer, { UnknownType } from './Serializer.js';

export default class NumberSerializer extends Serializer {
  /**
   * Serializes the value
   */
  public serialize<T>(value: T, seed?: string) {
    //try default serialize first
    const serialized = this._serialize(value, seed);
    if (serialized !== UnknownType) {
      return serialized;
    }
    //if value is a date
    if (value instanceof Date) {
      return value.getTime();
    }
    //either way, try to convert to number
    const number = Number(value);
    return !isNaN(number) ? number : 0;
  }

  /**
   * Unserializes the value
   */
  public unserialize<T>(value: T, seed?: string) {
    //try default unserialize first
    const unserialized = this._unserialize(value, seed);
    if (unserialized !== UnknownType) {
      return unserialized;
    }
    //either way, try to convert to number
    const number = Number(value);
    return !isNaN(number) ? number : 0;
  }
};