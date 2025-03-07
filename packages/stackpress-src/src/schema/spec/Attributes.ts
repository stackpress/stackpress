//stackpress
import type { Data } from '@stackpress/idea-parser';
//local
import type { Assertion, Component, Relation } from '../types';

export default class Attributes extends Map<string, unknown> {
  /**
   * Returns true if this column is an @active column
   */
  public get active() {
    return this.get('active') === true;
  }

  /**
   * Returns a new set of attributes that are admin specific
   */
  public get admin() {
    const attributes: Record<string, unknown> = {};
    //explicit validators
    for (const name in this.keys()) {
      if (!name.startsWith('admin.')) {
        continue;
      }
      //we found it.
      const attribute = this.get(name);
      //get the method
      const method = name.replace('admin.', '');
      //get the arguments
      attributes[method] = attribute;
    }
    return new Attributes(
      Object.entries(attributes)
    );
  }

  /**
   * Returns the column assertions
   */
  public get assertions() {
    const assertions: Assertion[] = [];

    //explicit validators
    for (const name in this.keys()) {
      if (!name.startsWith('is.')) {
        continue;
      }
      //we found it.
      const field = this.get(name);
      //get the method
      const method = name.replace('is.', '');
      //get the arguments
      const args = Array.isArray(field) ? field as unknown[] : [];
      //the last argument is the message
      const message = typeof args[args.length - 1] !== 'string' 
        ? args.pop() as string
        : null;
        assertions.push({ method, args, message });
    }

    return assertions;
  }

  /**
   * Returns a char length if ever
   */
  public get clen() {
    //if is.ceq, is.clt, is.cle
    this.assertions.forEach(assertion => {
      if (assertion.method === 'ceq') {
        return assertion.args[0] as number;
      } else if (assertion.method === 'clt') {
        return assertion.args[0] as number;
      } else if (assertion.method === 'cle') {
        return assertion.args[0] as number;
      }
    });
    return 255;
  }

  /**
   * Returns true if this column is an @created column
   */
  public get created() {
    return this.get('created') === true;
  }

  /**
   * Returns the column @default value
   * example: @default("some value")
   */
  public get default() {
    //@default("some value")
    const defaults = this.get('default');
    if (Array.isArray(defaults)) {
      return defaults[0];
    }
    return undefined;
  }

  /**
   * Returns the column field (defaults to none)
   * example: @field.text({type "text"})
   */
  public get field(): Component {
    for (const name of this.keys()) {
      if (!name.startsWith('field.')) {
        continue;
      }
      //we found it.
      const field = this.get(name);
      //get the method
      const method = name.replace('field.', '');
      //get the arguments
      const args = Array.isArray(field)? field as Data[]: [];
      //the first argument is the field attributes
      const attributes = typeof args[0] === 'object' 
        ? (args[0] || {}) as Record<string, Data>
        : {};
     
      return { method, args, attributes };
    }

    return { method: 'none', args: [], attributes: {} };
  }

  /**
   * Returns the column filter field (defaults to none)
   * example: @filter.text({type "text"})
   */
  public get filter(): Component {
    for (const name of this.keys()) {
      if (!name.startsWith('filter.')) {
        continue;
      }
      //we found it.
      const field = this.get(name);
      //get the method
      const method = name.replace('filter.', '');
      //get the arguments
      const args = Array.isArray(field)? field as Data[]: [];
      //the first argument is the field attributes
      const attributes = typeof args[0] === 'object' 
        ? (args[0] || {}) as Record<string, Data>
        : {};
     
      return { method, args, attributes };
    }

    return { method: 'none', args: [], attributes: {} };
  }

  /**
   * Returns true if column is @generated
   */
  public get generated() {
    return this.get('generated') === true;
  }

  /**
   * Returns true if column is an @id
   */
  public get id() {
    return this.get('id') === true;
  }

  /**
   * Returns the column @label
   * example: @icon("user")
   */
  public get icon() {
    const icon = this.get('icon');
    if (Array.isArray(icon)) {
      return icon[0] as string;
    }
    return undefined;
  }

  /**
   * Returns true if column is @filterable, @searchable, or @sortable
   */
  public get indexable() {
    return this.searchable 
      || this.filter.method !== 'none'
      || this.span.method !== 'none'
      || this.sortable;
  }

  /**
   * Returns the column @label
   * example: @label("Some Label")
   */
  public get label() {
    return this.labels[0] || undefined;
  }

  /**
   * Returns the column @label
   * example: @label("Some Label" "Some other label")
   */
  public get labels() {
    const labels = this.get('label');
    return Array.isArray(labels) ? labels as string[] : [];
  }

  /**
   * Returns the column list format (defaults to none)
   * example: @list.char({length 1})
   */
  public get list(): Component {
    for (const name of this.keys()) {
      if (!name.startsWith('list.')) {
        continue;
      }
      //we found it.
      const field = this.get(name);
      //get the method
      const method = name.replace('list.', '');
      //get the arguments
      const args = Array.isArray(field)? field as Data[]: [];
      //the first argument is the field attributes
      const attributes = typeof args[0] === 'object' 
        ? (args[0] || {}) as Record<string, Data>
        : {};
     
      return { method, args, attributes };
    }
    return { method: 'none',  args: [], attributes: {} };
  }

  /**
   * Returns the column @max
   * example: @max(100)
   * example: @is.eq(100)
   * example: @is.lt(100)
   * example: @is.le(100)
   */
  public get max() {
    const maxes: number[] = [];
    const max = this.get('max');
    if (Array.isArray(max)) {
      maxes.push(max[0]);
    }
    this.assertions.forEach(assertion => {
      if (assertion.method === 'eq'
        || assertion.method === 'lt'
        || assertion.method === 'le'
      ) {
        maxes.push(assertion.args[0] as number);
      }
    });
    if (maxes.length > 0) {
      return Math.max(...maxes.filter(number => Number(number)));
    }
    return 0;
  }

  /**
   * Returns the column @min
   * example: @min(100)
   * example: @is.eq(100)
   * example: @is.gt(100)
   * example: @is.ge(100)
   */
  public get min() {
    const mins: number[] = [];
    const min = this.get('min');
    if (Array.isArray(min)) {
      mins.push(min[0]);
    }
    this.assertions.forEach(assertion => {
      if (assertion.method === 'eq'
        || assertion.method === 'gt'
        || assertion.method === 'ge'
      ) {
        mins.push(assertion.args[0] as number);
      }
    });
    if (mins.length > 0) {
      return Math.min(...mins.filter(number => Number(number)));
    }
    return 0;
  }

  /**
   * Returns relation information
   */
  public get relation() {
    //ie. owner User @relation({ name "connections" local "userId" foreign "id" })
    const attribute = this.get('relation') as [ Relation ] | undefined;
    //if no relation or invalid relation
    if (!attribute || typeof attribute[0] !== 'object') {
      return null;
    }

    return attribute[0];
  }

  /**
   * Returns true if column is @searchable
   */
  public get searchable() {
    return this.get('searchable') === true;
  }

  /**
   * Returns true if column is @sortable
   */
  public get sortable() {
    return this.get('sortable') === true;
  }

  /**
   * Returns the column span field (defaults to none)
   * example: @span.text({type "text"})
   */
  public get span(): Component {
    for (const name of this.keys()) {
      if (!name.startsWith('span.')) {
        continue;
      }
      //we found it.
      const field = this.get(name);
      //get the method
      const method = name.replace('span.', '');
      //get the arguments
      const args = Array.isArray(field)? field as Data[]: [];
      //the first argument is the field attributes
      const attributes = typeof args[0] === 'object' 
        ? (args[0] || {}) as Record<string, Data>
        : {};
     
      return { method, args, attributes };
    }

    return { method: 'none', args: [], attributes: {} };
  }

  /**
   * Returns the column @step
   * example: @step(0.01)
   */
  public get step() {
    const step = this.get('step');
    if (Array.isArray(step)) {
      return step[0];
    }
    const max = this.max;
    const min = this.min;
    //if max has decimals, get the length
    const maxDecimals = max.toString().split('.')[1]?.length || 0;
    //if min has decimals, get the length
    const minDecimals = min.toString().split('.')[1]?.length || 0;
    //which ever is longer that's the step
    const decimalLength = Math.max(maxDecimals, minDecimals);
    //if no decimals
    if (decimalLength === 0) {
      //step is 1 by default
      return 1;
    }
    //convert to 0.001 for example
    return Math.pow(10, -decimalLength);
  }

  /**
   * Returns the column @template
   */
  public get template() {
    const template = this.get('template');
    if (Array.isArray(template)) {
      return template[0];
    }
    return undefined;
  }

  /**
   * Returns true if column is @unique
   */
  public get unique() {
    return this.get('unique') === true;
  }

  /**
   * Returns true if this column is an @updated column
   */
  public get updated() {
    return this.get('updated') === true;
  }

  /**
   * Returns the column @view format (defaults to none)
   * example: @view.char({length 1})
   */
  public get view(): Component {
    for (const name of this.keys()) {
      if (!name.startsWith('view.')) {
        continue;
      }
      //we found it.
      const field = this.get(name);
      //get the method
      const method = name.replace('view.', '');
      //get the arguments
      const args = Array.isArray(field)? field as Data[]: [];
      //the first argument is the field attributes
      const attributes = typeof args[0] === 'object' 
        ? (args[0] || {}) as Record<string, Data>
        : {};
     
      return { method, args, attributes };
    }
    return { method: 'none', args: [], attributes: {} };
  }
}