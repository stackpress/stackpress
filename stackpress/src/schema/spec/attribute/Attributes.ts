//modules
import type { Data } from '@stackpress/idea-parser';
import DataMap from '@stackpress/lib/Map';
//stackpress/schema/spec/attribute
import Attribute from './Attribute.js';

/**
 * Manages a collection of attributes
 * - Map to discourage duplicates
 * - Manually add attributes
 * - Filter, find, map attributes
 * - Categorize attributes into methods and flags
 * - Determine values of attributes
 */
export default class Attributes extends DataMap<string, Attribute> {
  /**
   * Returns all the possible args of each attribute
   * ie. { required: [], max: [ 255 ] }
   */
  public get args() {
    return this.map(attribute => attribute.args);
  }

  /**
   * Returns the disabled flag attributes of the column
   */
  public get disabled() {
    return this.filter(
      attribute => attribute.isFlag && !attribute.enabled
    );
  }

  /**
   * Returns the flag attributes of the column
   */
  public get flags() {
    return this.filter(attribute => attribute.isFlag);
  }

  /**
   * Returns the method attributes of the column
   */
  public get methods() {
    return this.filter(attribute => attribute.isMethod);
  }

  /**
   * Returns the first possible value of each attribute
   * ie. { required: true, max: 255 }
   */
  public get props() {
    return this.map(attribute => attribute.value);
  }

  /**
   * Allow construction from entries or record
   */
  public constructor(attributes?: Iterable<Attribute>) {
    super(Array.isArray(attributes) 
      ? attributes.map(attribute => [ attribute.name, attribute ])
      : typeof attributes !== 'undefined'
      ? Object.entries(attributes)
      : []
    );
  }

  /**
   * Adds an attribute to the collection
   * 
   * Usage:
   * - `add(Attribute)`
   * - `add(name, args)`
   * - `add(name, true)`
   */
  public add(attribute: Attribute): Attributes;
  public add(name: string, args: Data[] | boolean): Attributes;
  public add(attribute: Attribute | string, args: Data[] | boolean = []) {
    if (typeof attribute === 'string') {
      this.set(attribute, new Attribute(attribute, args));
    } else {
      this.set(attribute.name, attribute);
    }
    return this;
  }

  /**
   * Returns true if the attribute is enabled
   */
  public enabled(name: string) {
    const attribute = this.get(name);
    if (attribute) {
      return attribute.isFlag && attribute.enabled;
    }
    return false;
  }

  /**
   * Returns the attribute by name
   * 
   * NOTE: Dont use the key name, use the 
   * name property in the value instead
   */
  public get(name: string) {
    return this.findValue(attribute => attribute.name === name);
  }

  /**
   * Returns the first value of the attribute by name
   * 
   * Usage: 
   * - `value<boolean>('required') -> true`
   * - `value<number>('max') -> 255`
   */
  public value<D = Data>(name: string) {
    const attribute = this.get(name);
    if (attribute) {
      return attribute.value as D;
    }
    return undefined;
  }
};