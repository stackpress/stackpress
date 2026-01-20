//modules
import { isObject } from '@stackpress/lib';
//schema
import type { SerializerSettings } from '../types.js';
import { encrypt, decrypt, hash } from '../helpers.js';

export const UnknownType = Symbol('UnknownType');

export abstract class Serializer {
  //ex, Unknown[]
  public readonly multiple: boolean;
  //ex, Unknown?
  public readonly nullable: boolean;
  //whether to hash the value
  public readonly hash: boolean;
  //whether to encrypt/decreypt the value
  public readonly encrypt: boolean;

  /**
   * Sets up all the readonly properties
   */
  public constructor(settings: SerializerSettings) {
    const { 
      require = false, 
      multiple = false, 
      hash = false, 
      encrypt = false
    } = settings;
    this.multiple = multiple;
    this.nullable = !require;
    this.hash = hash;
    this.encrypt = encrypt;
  }

  /**
   * Serializes the value
   */
  public abstract serialize<T>(value: T, seed?: string): unknown;

  /**
   * Unserializes the value
   */
  public abstract unserialize<T>(value: T, seed?: string): unknown;

  /**
   * Default serialize helper
   */
  protected _serialize<T>(value: T, seed?: string) {
    //if nullable and value is nulled
    const nulled = value === null || typeof value === 'undefined';
    if (this.nullable && nulled) {
      return value;
    //if required and value is undefined
    } else if (!this.nullable && typeof value === 'undefined') {
      return value;
    }
    //serialize and hash
    if (this.hash) {
      return hash(String(value));
    } else if (this.encrypt && seed) {
      return encrypt(String(value), seed);
    }
    return UnknownType;
  }

  /**
   * Default unserialize helper
   */
  protected _unserialize<T>(value: T, seed?: string) {
    //if value is null or undefined
    if (value === null || typeof value === 'undefined') {
      return value;
    //unserialize and decrypt
    } else if (this.encrypt && seed) {
      return decrypt(String(value), seed);
    }
    return UnknownType;
  }
};

export class UnknownSerializer extends Serializer {
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

export class StringSerializer extends Serializer {
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

export class NumberSerializer extends Serializer {
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

export class BooleanSerializer extends Serializer {
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

export class DateSerializer extends Serializer {
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

export class ObjectSerializer extends Serializer {
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