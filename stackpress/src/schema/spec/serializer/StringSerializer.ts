//stackpress/schema/spec/serializer
import Serializer, { UnknownType } from './Serializer.js';

export default class StringSerializer extends Serializer {
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
      return [
        value.toISOString().split('T')[0],
        value.toTimeString().split(' ')[0]
      ].join(' ');
    }
    //either way, return string
    return String(value);
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
    //if value is a date
    if (value instanceof Date) {
      return [
        value.toISOString().split('T')[0],
        value.toTimeString().split(' ')[0]
      ].join(' ');
    }
    //either way, return string
    return String(value);
  }
};