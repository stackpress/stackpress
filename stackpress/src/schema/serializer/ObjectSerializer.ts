//modules
import { isObject } from '@stackpress/lib';
//stackpress/schema/serializer
import Serializer, { UnknownType } from './Serializer.js';

export default class ObjectSerializer extends Serializer {
  /**
   * Serializes the value
   */
  public serialize<T>(value: T, seed?: string, toString = false) {
    //try default serialize first
    const serialized = this._serialize(value, seed);
    if (serialized !== UnknownType) {
      return serialized;
    }
    //if value is a string
    if (typeof value === 'string') {
      try { //to see if it's a valid JSON string
        if (!toString) {
          return JSON.parse(value);
        }
        //if value can be parsed as JSON
        JSON.parse(value);
        //then it's already JSON serialized
        return value;
      //let JSON serialize the value
      } catch (e) {
        return !toString ? {}: '{}';
      }
    }
    //let JSON serialize the value
    return !toString ? value: JSON.stringify(value);
  }

  /**
   * Unserializes the value
   */
  public unserialize<T, M extends Record<string, unknown>>(
    value: T, 
    seed: string
  ) {
    //try default unserialize first
    const unserialized = this._unserialize(value, seed);
    if (unserialized !== UnknownType) {
      return unserialized;
    }
    //if value is a string
    if (typeof value === 'string') {
      try { //to parse the value
        return JSON.parse(value);
      } catch (e) {
        return {} as M;
      }
    }
    return (isObject(value) ? value : {}) as M;
  }
};