//modules
import DataMap from '@stackpress/lib/Map';
//stackpress/schema
import type {
  AttributeDefinitionInput,
  AttributeDefinitionToken,
  AttributeAssertionInput,
  AttributeAssertionToken,
  AttributeComponentInput,
  AttributeComponentToken
} from '../types.js';

export class TypeMapDictionary extends DataMap<string, DataMap<string, unknown>> {
  /**
   * Defines a new type map definition
   * Usage: 
   * - define('String', 'assertion', TypeMapDataAssertion)
   * - define('String', 'serializer', TypeMapDataAssertion)
   */
  public define(type: string, key: string, definition: unknown) {
    //if no type map
    if (!this.has(type)) {
      //make sure there is a type map
      this.set(type, new DataMap());
    }
    this.get(type)!.set(key, definition);
  }

  /**
   * Returns true if a type map definition exists
   */
  public defined(type: string, key: string) {
    return this.has(type) && this.get(type)!.has(key);
  }

  /**
   * Returns a type map definition
   */
  public definition<T = unknown>(type: string, key: string) {
    if (this.has(type)) {
      const typeMap = this.get(type)!;
      if (typeMap.has(key)) {
        return typeMap.get(key) as T;
      }
    }
    return null;
  }
};

export class AttributeDictionary extends DataMap<string, AttributeDefinitionToken> {
  /**
   * Defines a new attribute definition
   * Usage: 
   * - define('field.text', 'column', AttributeDefinitionInput)
   * - define('icon', 'schema', AttributeDefinitionInput)
   */
  public define(name: string, kind: string, definition: AttributeDefinitionInput) {
    return this.set(name, { ...definition, kind });
  }

  /**
   * Returns true if an attribute definition exists
   * Alias for has()
   */
  public defined(name: string) {
    return this.has(name);
  }

  /**
   * Returns an attribute definition
   * Alias for get()
   */
  public definition(name: string) {
    return this.get(name);
  }
};

export class AssertionDictionary extends DataMap<string, AttributeAssertionToken> {
  /**
   * Defines a new attribute assertion
   * Usage: define('is.required', AttributeAssertionInput)
   * Alias for set()
   */
  public define(name: string, definition: AttributeAssertionInput) {
    return this.set(name, { ...definition });
  }

  /**
   * Returns true if an attribute assertion exists
   * Alias for has()
   */
  public defined(name: string) {
    return this.has(name);
  }

  /**
   * Returns an attribute assertion
   * Alias for get()
   */
  public definition(name: string) {
    return this.get(name);
  }
};

export class ComponentDictionary extends DataMap<string, AttributeComponentToken> {
  /**
   * Defines a new attribute component
   * Usage: define('field.text', 'field', AttributeComponentInput)
   */
  public define(name: string, kind: string, definition: AttributeComponentInput) {
    return this.set(name, { ...definition, kind });
  }

  /**
   * Returns true if an attribute component exists
   * Alias for has()
   */
  public defined(name: string) {
    return this.has(name);
  }

  /**
   * Returns an attribute component
   * Alias for get()
   */
  public definition(name: string) {
    return this.get(name);
  }
};

//--------------------------------------------------------------------//
// Global Static Dictionaries

export const typemaps = new TypeMapDictionary();
export const attributes = new AttributeDictionary();
export const assertions = new AssertionDictionary();
export const components = new ComponentDictionary();