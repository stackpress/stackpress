//modules
import type { DataMapFilter } from '@stackpress/lib/types';
import type { Data } from '@stackpress/idea-parser';
import DataMap from '@stackpress/lib/Map';
import { isObject } from '@stackpress/lib/Nest';
//stackpress/schema
import type { AttributesToken } from '../types.js';
//stackpress/schema/attribute
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
   * Returns Attributes from serialized tokens
   */
  public static make(tokens?: AttributesToken) {
    const attributes: Array<Attribute> = [];
    //if attributes is an array, ie. [ name, Data[] | boolean ][]
    if (Array.isArray(tokens)) {
      const entries = tokens.map(
        entry => new Attribute(entry[0], entry[1])
      );
      //add to attributes
      attributes.push(...entries);
    //if attributes is an object, ie. { name: Data[] | boolean }
    } else if (tokens instanceof Object && isObject(tokens)) {
      const entries = Object.entries(tokens).map(
        entry => new Attribute(entry[0], entry[1])
      );
      //add to attributes
      attributes.push(...entries);
    }
    return new Attributes(attributes);
  }

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
  public constructor(attributes?: Array<Attribute>) {
    //if attributes is an array
    super(Array.isArray(attributes)
      //need to transform to entries, ie. [ name, Attribute ][]
      ? attributes.map(attribute => [ attribute.name, attribute ])
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
   * Filters the data map (returns a new Attributes instance)
   * Override to match constructor arguments 
   */
  public filter(callback: DataMapFilter<string, Attribute, this>) {
    const entries = Array.from(this.entries()).filter(
      entry => callback(entry[1], entry[0], this)
    );
    const constructor = this.constructor as new(map: Attribute[]) => this;
    return new constructor(entries.map(entry => entry[1]));
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