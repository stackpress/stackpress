//modules
import type { Data, AttributeValue } from '@stackpress/idea-parser';
//schema
import type { AttributeValues } from '../types.js';
import Attribute from './Attribute';

export default class Attributes extends Map<string, AttributeValue> {
  /**
   * Returns an attribute args by name
   */
  public args<T = Data>(name: string) {
    return this.attribute(name)?.args as T[] || [];
  }

  /**
   * Returns the attribute by name
   */
  public attribute(name: string) {
    const value = this.get(name);
    return typeof value !== undefined 
      ? Attribute.get(name, value!)
      : null;
  }

  /**
   * Returns the attribute component configuration
   */
  public component(name: string) {
    return this.attribute(name)?.component;
  }

  /**
   * Returns true if the attribute is enabled
   */
  public enabled(name: string) {
    return Boolean(this.attribute(name)?.enabled);
  }

  /**
   * Returns the attribute by index
   */
  public index(index: number) {
    const entries = Array.from(this.entries());
    if (entries[index]) {
      return this.attribute(entries[index][0]);
    }
    return null;
  }

  /**
   * Returns the attribute value (first argument) by name
   */
  public value<T = Data>(name: string) {
    return this.attribute(name)?.value as T | undefined;
  }

  /**
   * Allow construction from entries or record
   */
  public constructor(attributes?: AttributeValues) {
    super(Array.isArray(attributes) 
      ?  attributes 
      : typeof attributes !== 'undefined'
      ? Object.entries(attributes)
      : []
    );
  }
};