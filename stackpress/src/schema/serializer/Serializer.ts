//stackpress/schema
import type { SerializerSettings } from '../types.js';
import { encrypt, decrypt, hash } from '../helpers.js';

export const UnknownType = Symbol('UnknownType');

export default abstract class Serializer {
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
  public abstract serialize<T>(
    value: T, 
    seed?: string, 
    scalar?: boolean
  ): unknown;

  /**
   * Unserializes the value
   */
  public abstract unserialize<T>(
    value: T, 
    seed?: string, 
    scalar?: boolean
  ): unknown;

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