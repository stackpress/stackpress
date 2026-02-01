//stackpress/schema/serializer
import Serializer, { UnknownType } from './Serializer.js';

export default class BooleanSerializer extends Serializer {
  /**
   * Serializes the value
   */
  public serialize<T>(value: T, seed?: string, toNumber = false) {
    //try default serialize first
    const serialized = this._serialize(value, seed);
    if (serialized !== UnknownType) {
      return serialized;
    }
    //if string 'true' or 'false'
    if (value === 'false') {
      return !toNumber ? false: 0;
    } else if (value === 'true') {
      return !toNumber ? true: 1;
    }
    //if string '1' or '0'
    if (value === '0') {
      return !toNumber ? false: 0;
    } else if (value === '1') {
      return !toNumber ? true: 1;
    }
    //either way, convert to boolean (or numeric boolean)
    return !toNumber ? Boolean(value): Number(Boolean(value));
  }

  /**
   * Unserializes the value
   */
  public unserialize<T>(value: T, seed?: string, toNumber = false) {
    //try default unserialize first
    const unserialized = this._unserialize(value, seed);
    return unserialized !== UnknownType 
      ? unserialized 
      : !toNumber 
      ? Boolean(value)
      : Number(Boolean(value));
  }
};