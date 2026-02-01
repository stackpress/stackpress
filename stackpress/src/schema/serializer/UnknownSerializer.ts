//stackpress/schema/serializer
import Serializer, { UnknownType } from './Serializer.js';

export default class UnknownSerializer extends Serializer {
  /**
   * Serializes the value
   */
  public serialize<T>(value: T, seed?: string) {
    //try default serialize first
    const serialized = this._serialize(value, seed);
    return serialized !== UnknownType ? serialized : value;
  }

  /**
   * Unserializes the value
   */
  public unserialize<T>(value: T, seed?: string) {
    //try default unserialize first
    const unserialized = this._unserialize(value, seed);
    return unserialized !== UnknownType ? unserialized : value;
  }
};