//modules
import DataSet from '@stackpress/lib/Set';
//stackpress-schema
import type { ColumnAssertionToken } from '../types.js';
import type Column from '../Column.js';

export default class ColumnAssertion {
  //column reference
  protected _column: Column;

  /**
   * Returns the assertion attributes of the column
   */
  public get attributes() {
    return this._column.attributes.filter(
      attribute => attribute.assertion.defined
    );
  }

  /**
   * Returns a collection of assertions to use with this column
   */
  public get assertions() {
    const assertions = new DataSet<ColumnAssertionToken>();
    const defaults = this._column.type.assertions;
    //explicit validators
    for (const attribute of this.attributes.values()) {
      const assertion = attribute.assertion.definition!;
      //get the raw arguments
      const args = attribute.args;
      //by default message is from the assertion definition
      let message = assertion.message;
      //if the assertion has a reference
      if (attribute.reference.defined
        //and if args equal the expected args
        && args.length === attribute.reference.definition!.args.length 
        //and the last arg is a string
        && typeof args[args.length - 1] === 'string'
      ) {
        message = args.pop() as string;
      }
      assertions.add({ 
        name: assertion.name, 
        args, 
        message 
      });
    }
    return defaults
      //remove the default assertions that are already defined
      .filter(defaultAssert => !assertions.findValue(
        assert => assert.name === defaultAssert.name
      ))
      .toArray()
      //then add explicit assertions
      .concat(assertions.toArray());
  }

  /**
   * Sets the column reference
   */
  constructor(column: Column) {
    this._column = column;
  }
};